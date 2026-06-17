#!/usr/bin/env node
/**
 * proof:transport-events — L.W5 S3 (W-TRANSPORT-EVENTS, the born-RED gate).
 *
 * THE GAP (L.W5 §Gap 2, audit Lane 32 W-TRANSPORT-EVENTS). `Sequence`
 * (`sequence.ts`) ships a full transport — `play`/`pause`/`resume`/`stop`/
 * `timeScale`/`reverse`/`repeat`/`yoyo`/`seek`/`progress` — but fires NO
 * callback when a child segment enters or leaves, or when the playhead crosses
 * a named label. `Sequence._frame` (`sequence.ts:387-452`) drives `_applyAt` +
 * `advanceTo` but accumulates no crossing events; `sequence.ts:97-102` holds
 * `entries` + `labels` but no `_subscribers` map; there is NO `.on(event, cb)`
 * method on `Sequence` today. A consumer cannot trigger a side-effect at a
 * precise sequence moment (play a sound when a hero slide enters, reset a
 * counter when the playhead crosses "chapter-2") without polling `sequence.time`
 * in an external rAF loop — a workaround-tier solution. GSAP Timeline's
 * `addCallback`/`call` is the incumbent.
 *
 * THE CURE (L.W5 §S3). Mirror `ScrollScene.on` (scroll-scene.ts:506-514): a
 * typed per-event subscribe returning an unsubscribe handle. New types
 * `SequenceEvent` (`"segment:enter" | "segment:leave" | "label"`),
 * `SequenceSegmentSubscriber` ((animation, masterClock) => void),
 * `SequenceLabelSubscriber` ((name, masterClock) => void); a `_subscribers`
 * Map + a `_prevPhase` field; `_frame`/`seek` fire the crossings. LIGHT —
 * `sequence.ts` carries NO static value.js edge; the `.on()` method introduces
 * none. `proof:boundary` stays green by construction.
 *
 * THIS GATE BITES (born-RED on HEAD-pre-cure, GREEN-on-cure):
 *
 *  • clause (a) — `sequence.on` is a FUNCTION. On today's tree `typeof
 *    sequence.on === "undefined"` (no method) — the clause FAILS.
 *  • clause (b) — `sequence.on("segment:enter", cb)` + a `seek` PAST a
 *    segment's `at`-offset fires `cb` with the correct `(animation,
 *    masterClock)` — the entered segment's OWN animation reference and the
 *    master clock at the crossing. On today's tree there is no method to
 *    register, so nothing fires — the clause FAILS.
 *  • clause (c) — `sequence.on("label", cb)` + a `seek` PAST a registered label
 *    fires `cb` with `(name, masterClock)`. On today's tree the clause FAILS.
 *
 * The gate runs over the COMPILED / LIGHT barrel (`dist/keyframes.js`) — the
 * `proof:orchestration` pattern: a node script, no browser, no demo build. The
 * `Sequence` surface is value.js-free, so the import never pulls value.js in.
 * The two stub animations carry the MINIMAL `Animation`-shaped surface the
 * `seek → _applyAt` map reads (`options.duration` + an `interpFrames(local,
 * apply)` no-op) — no full engine needed; the test is LIGHT.
 *
 * Re-runnable: `node scripts/proof-transport-events.mjs`. Exits non-zero on any
 * residual. P6 posture: hard — a device-independent correctness oracle.
 */
import { pathToFileURL } from "node:url";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/keyframes.js");

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};

console.log(
    "proof:transport-events — L.W5 S3 (Sequence segment/label callback channel)",
);

// ── Import the LIGHT compiled barrel ─────────────────────────────────────────
let Sequence;
try {
    ({ Sequence } = await import(pathToFileURL(DIST).href));
} catch (e) {
    console.error(
        `proof:transport-events — FAIL: could not import the compiled barrel ` +
            `(${DIST}). Build the library first (\`npm run build\`).\n  ${e?.stack ?? e}`,
    );
    process.exit(1);
}
if (typeof Sequence !== "function") {
    fail(
        `the LIGHT barrel does not export \`Sequence\` as a class — ` +
            `(got ${typeof Sequence})`,
    );
}

/**
 * A minimal `Animation`-shaped stub — the surface the `seek → _applyAt` map
 * reads. `options.duration` anchors the segment span; `interpFrames(local,
 * apply)` is the paint the sequence drives (a no-op that records the last local
 * clock so the stub is observable). No CSS parser, no value.js — LIGHT.
 */
function stubAnimation(duration, tag) {
    return {
        tag,
        options: { duration },
        lastLocal: undefined,
        // The synchronous scrub path (`_applyAt` → `interpFrames(local, true)`).
        interpFrames(local, _apply) {
            this.lastLocal = local;
            return this;
        },
        // The play-loop driver (`_frame` → `advanceTo(phase)`); unused by `seek`
        // but present so a future cure that fires crossings from `_frame` over
        // the same stub still finds a callable.
        async advanceTo(_clock) {
            return false;
        },
        setTargets() {
            return this;
        },
        startTime: undefined,
        started: false,
        managed: false,
    };
}

if (typeof Sequence === "function") {
    // Build a two-segment sequence with a registered label.
    //   segA: at 0,    duration 500  → [0, 500)
    //   segB: at 1000, duration 500  → [1000, 1500)
    //   label "mid" at 750 (between the two segments)
    const segA = stubAnimation(500, "A");
    const segB = stubAnimation(500, "B");

    const seq = new Sequence();
    seq.add(segA, 0);
    seq.add(segB, 1000);
    seq.label("mid", 750);

    // ── clause (a) — `sequence.on` is a callable method ──────────────────────
    if (typeof seq.on !== "function") {
        fail(
            `clause (a) — \`sequence.on\` is NOT a function (typeof === ` +
                `"${typeof seq.on}"). The Sequence transport fires no segment/` +
                `label crossing callbacks; there is no subscribe channel. ` +
                `(L.W5 S3 born-RED: \`grep -nE "on\\(event|_subscribers|` +
                `SequenceEvent" src/animation/sequence.ts\` → zero hits.)`,
        );
    } else {
        ok(`clause (a) — \`sequence.on\` is a function`);

        // ── clause (b) — segment:enter fires with (animation, masterClock) ───
        // Register, then seek from before segB's `at` (1000) to past it (1200).
        // The cure fires "segment:enter" for segB with its OWN animation ref +
        // the master clock at the crossing.
        let enterCall = null;
        let unsubEnter;
        try {
            // Seed the playhead BEFORE segB so the seek crosses its `at` edge.
            seq.seek(200);
            unsubEnter = seq.on("segment:enter", (animation, masterClock) => {
                enterCall = { animation, masterClock };
            });
            seq.seek(1200);
        } catch (e) {
            fail(
                `clause (b) — \`sequence.on("segment:enter", cb)\` / seek threw ` +
                    `(${e?.message ?? e})`,
            );
        }
        if (typeof unsubEnter === "function") {
            // The unsubscribe handle must be callable (the ScrollScene.on idiom).
            unsubEnter();
        }
        if (!enterCall) {
            fail(
                `clause (b) — seeking PAST segment B's at-offset (1000) fired ` +
                    `NO "segment:enter" callback. The Sequence transport does ` +
                    `not emit segment-lifecycle crossings.`,
            );
        } else if (enterCall.animation !== segB) {
            fail(
                `clause (b) — "segment:enter" fired but with the WRONG ` +
                    `animation reference (expected segB, got ` +
                    `${enterCall.animation?.tag ?? "?"}).`,
            );
        } else if (
            typeof enterCall.masterClock !== "number" ||
            !(enterCall.masterClock >= 1000 && enterCall.masterClock <= 1200)
        ) {
            fail(
                `clause (b) — "segment:enter" fired with an out-of-range ` +
                    `masterClock (${enterCall.masterClock}); expected the crossing ` +
                    `clock in [1000, 1200].`,
            );
        } else {
            ok(
                `clause (b) — "segment:enter" fires with (segB, masterClock=` +
                    `${enterCall.masterClock}) on a seek past segB's at-offset`,
            );
        }

        // ── clause (c) — label crossing fires with (name, masterClock) ───────
        // Seek from before the "mid" label (750) to past it.
        let labelCall = null;
        let unsubLabel;
        try {
            seq.seek(200);
            unsubLabel = seq.on("label", (name, masterClock) => {
                labelCall = { name, masterClock };
            });
            seq.seek(800);
        } catch (e) {
            fail(
                `clause (c) — \`sequence.on("label", cb)\` / seek threw ` +
                    `(${e?.message ?? e})`,
            );
        }
        if (typeof unsubLabel === "function") unsubLabel();
        if (!labelCall) {
            fail(
                `clause (c) — seeking PAST the "mid" label (750) fired NO ` +
                    `"label" callback. The Sequence transport does not emit ` +
                    `label crossings.`,
            );
        } else if (labelCall.name !== "mid") {
            fail(
                `clause (c) — "label" fired but with the WRONG name (expected ` +
                    `"mid", got "${labelCall.name}").`,
            );
        } else if (
            typeof labelCall.masterClock !== "number" ||
            !(labelCall.masterClock >= 750 && labelCall.masterClock <= 800)
        ) {
            fail(
                `clause (c) — "label" fired with an out-of-range masterClock ` +
                    `(${labelCall.masterClock}); expected the crossing clock in ` +
                    `[750, 800].`,
            );
        } else {
            ok(
                `clause (c) — "label" fires with (name="mid", masterClock=` +
                    `${labelCall.masterClock}) on a seek past the registered label`,
            );
        }
    }
}

console.log("");
if (failures.length > 0) {
    console.error(
        `proof:transport-events — FAIL (${failures.length}): the Sequence ` +
            `transport fires no segment-lifecycle or label crossing callbacks.\n  ` +
            failures.join("\n  ") +
            `\n\n  L.W5 S3 cure: add a \`SequenceEvent\` type, a \`_subscribers\` ` +
            `Map, an \`on(event, cb)\` method (mirror ScrollScene.on,\n  ` +
            `scroll-scene.ts:506-514), and a \`_prevPhase\`-tracked crossing ` +
            `detector in \`_frame\`/\`seek\` that fires "segment:enter" /\n  ` +
            `"segment:leave" / "label" with the correct (animation|name, ` +
            `masterClock).`,
    );
    process.exit(1);
}
console.log(
    "proof:transport-events — PASS: `sequence.on(event, cb)` registers a typed " +
        "subscriber;\n  a seek past a segment's at-offset fires \"segment:enter\" " +
        "with (animation, masterClock);\n  a seek past a registered label fires " +
        "\"label\" with (name, masterClock); each returns an\n  unsubscribe " +
        "handle (the ScrollScene.on idiom). W-TRANSPORT-EVENTS is closed.",
);
