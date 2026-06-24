#!/usr/bin/env node
/**
 * proof:dogfood — the inv ζ gate ("the shop-window runs on its own engine").
 *
 * keyframes.js' demo is the product's storefront: it should carry NO
 * hand-rolled `requestAnimationFrame` loop that a shipped light engine already
 * is. C.W3 transposed the seven demo rAF loops onto the light surfaces the
 * library exports:
 *
 *   - AnimationVisualizer coast      → SmoothProgress + SpringProgress + RAFPlayback.drive
 *   - useSpringDemo comparison loop   → RAFPlayback.loop
 *   - useEasingDemo ping-pong         → NumericAnimation({ direction: "alternate" })
 *   - useRafLoop lifecycle            → RAFPlayback.loop (Vue-lifecycle skin)
 *
 * Two raw-rAF sites legitimately remain — they are NOT animation loops a
 * light engine replaces, so they are an EXPLICIT, reviewable allowlist
 * (`ALLOWLIST` below), not a blanket "demo rAF is fine":
 *
 *   1. demo/scenes/amiga/AmigaScene.vue
 *        the Three.js present loop (controls.update() + renderer.render()) — the
 *        WebGL renderer's draw cycle, legitimately NOT a keyframes.js concern
 *        (the sphere's MOTION is engine-driven via AnimationGroup).
 *   2. demo/@/components/custom/matrix-editor/useTransformState.ts (~:205)
 *        a one-shot post-paint scheduler (write-coalescing debounce) — the
 *        engine has no "run once next frame" surface and shouldn't grow one.
 *
 * (A third site, timeline/composables/useTimeline.ts, was allowlisted while it
 * held a one-shot await-one-paint before a snapshot; D.W1's decomposition
 * transposed that primitive away, so the entry was pruned as stale.)
 *
 * The gate greps demo SOURCE (EXCLUDING `dist/` — the git-ignored build output
 * that pollutes a naive grep, plan-findings PART 3 finding 13) for
 * `requestAnimationFrame`, subtracts the allowlist, and EXITS 1 on any residual
 * raw rAF in a non-allowlisted file. The allowlist is an explicit file-path set:
 * adding a raw rAF to a new demo file requires a DELIBERATE, reviewable
 * allowlist edit, not a silent slip.
 *
 * Mirrors inv α's `proof:boundary` posture — a standing instrument that keeps
 * inv ζ true on every future demo edit. Mutation test (the gate must BITE, not
 * merely log): add a bare `requestAnimationFrame` loop to a non-allowlisted demo
 * file → the gate reddens; remove it → green.
 *
 * ── ORCHESTRATION DOGFOOD (F.W10 — the inv-ζ analogue reaching the orch tier).
 * inv ζ's rAF discipline (above) is the LOOP-level dogfood; F.W10 extends it to
 * the ORCHESTRATION tier the engine shipped in E.W10 (decay/Draggable/Sequence/
 * stagger). Two added clauses (each BITES on a real grep, not an assertion):
 *
 *   1. useOrbitalInertia consumes the engine's analytic `decay()` — and does
 *      NOT hand-roll the `Math.pow(inertiaFactor, dt/TARGET_DT)` discrete decay
 *      the engine now owns as a closed form. BITE: re-introduce the
 *      `Math.pow(... / TARGET_DT)` decay → the clause reds (the hand-roll is
 *      back, the tier is un-consumed).
 *   2. the Sequence+stagger demo scene imports `Sequence` AND `stagger` from the
 *      engine. BITE: delete the scene's Sequence/stagger import → the clause reds
 *      (a primitive with no exercising scene fails — ship nothing un-dogfooded).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEMO = path.join(REPO, "demo");

// The token the gate counts. A WORD-boundaried match so `cancelAnimationFrame`
// and identifiers merely CONTAINING the substring do not over-fire; the bare
// scheduler call is what a hand-rolled loop reaches for.
const RAF = /\brequestAnimationFrame\b/g;

// The EXPLICIT justified-exception allowlist (S4): the three raw-rAF sites that
// are NOT animation loops a light engine replaces. Stored as repo-relative
// POSIX paths (compared against the same) so the manifest is human-reviewable
// and a new exception is a deliberate diff to THIS array.
const ALLOWLIST = new Set([
    "demo/scenes/amiga/AmigaScene.vue",
    "demo/@/components/custom/matrix-editor/useTransformState.ts",
    // E.W11 a11y: a ONE-SHOT rAF (not a loop) to re-arm the aria-live region —
    // clear `liveStatus` then set it on the next paint frame so a repeat copy
    // re-announces the unchanged text to screen readers. Not an animation a
    // light engine ships; the engine's feedback flash IS the dogfooded part.
    "demo/@/components/custom/CopyButton.vue",
]);

// Source extensions the demo's rAF could live in. (CSS/HTML cannot host a rAF.)
const SOURCE_EXT = new Set([".ts", ".js", ".mjs", ".vue", ".tsx", ".jsx"]);

// ── F.W10 orchestration-dogfood clauses ──────────────────────────────────────
// Each clause is a (file, predicate) pair grepped against demo SOURCE. The
// orbital-inertia file MUST import the engine's `decay` AND MUST NOT carry the
// hand-rolled `Math.pow(... / TARGET_DT)` decay; the Sequence scene MUST import
// `Sequence` + `stagger` from the engine. Stored repo-relative (POSIX).
const ORBITAL_INERTIA =
    "demo/@/components/custom/orbital-drag/composables/useOrbitalInertia.ts";
const SEQUENCE_DEMO = "demo/scenes/sequence/useSequenceDemo.ts";

// The hand-rolled discrete decay the engine's analytic `decay()` replaces — a
// `Math.pow(<base>, <expr involving / TARGET_DT>)` form. Its RETURN is the inv-ζ
// regression: re-introducing it means the demo re-derives the physics the engine
// ships. Matched loosely enough that any `Math.pow(... / TARGET_DT)` reds.
const HANDROLLED_DECAY = /Math\.pow\([^)]*\/\s*TARGET_DT[^)]*\)/;
// The genuine dogfood: the engine's `decay`/`Sequence`/`stagger` imported from
// its LIGHT surface. After the L.W8 S1 ED-3 dogfood inversion the demo consumes
// the PUBLISHED barrel (`@mkbabb/keyframes.js`) rather than the deep `@src`
// source paths — the strictly more-honest dogfood (the demo runs on what `npm i`
// ships). Both specifiers satisfy the clause: the deep `@src/animation/<leaf>`
// (or `/index`) AND the published `@mkbabb/keyframes.js` barrel. The bite is
// unchanged — deleting the import (either form) still reds.
const SURFACE = `(?:@src\\/animation\\/(?:LEAF|index)|@mkbabb\\/keyframes\\.js)`;
const surfaceImport = (sym, leaf) =>
    new RegExp(
        `import\\s*\\{[^}]*\\b${sym}\\b[^}]*\\}\\s*from\\s*["']${SURFACE.replace(
            "LEAF",
            leaf,
        )}["']`,
    );
const IMPORTS_DECAY = surfaceImport("decay", "decay");
const IMPORTS_SEQUENCE = surfaceImport("Sequence", "sequence");
const IMPORTS_STAGGER = surfaceImport("stagger", "stagger");

// Directories that never hold reviewable SOURCE: the git-ignored build output
// (`dist/`) that pollutes a naive grep, plus dependency/VCS noise. Excluding
// `dist/` is load-bearing — the built demo chunks inline the very rAF loops the
// gate is asserting the SOURCE no longer hand-rolls.
const SKIP_DIR = new Set(["dist", "node_modules", ".git"]);

const toPosix = (p) => p.split(path.sep).join("/");
const relPosix = (abs) => toPosix(path.relative(REPO, abs));

/** Walk demo/, collecting every source file (skipping dist/ + deps). */
function collectSources(dir, out = []) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (e.isDirectory()) {
            if (SKIP_DIR.has(e.name)) continue;
            collectSources(path.join(dir, e.name), out);
        } else if (SOURCE_EXT.has(path.extname(e.name))) {
            out.push(path.join(dir, e.name));
        }
    }
    return out;
}

function main() {
    if (!fs.existsSync(DEMO)) {
        console.error("proof:dogfood — ERROR: demo/ not found.");
        process.exit(3);
    }

    const sources = collectSources(DEMO);

    // { rel, count } for every source file that contains at least one raw rAF.
    const hits = [];
    for (const abs of sources) {
        const src = fs.readFileSync(abs, "utf8");
        const matches = src.match(RAF);
        if (matches) hits.push({ rel: relPosix(abs), count: matches.length });
    }
    hits.sort((a, b) => a.rel.localeCompare(b.rel));

    const allowed = [];
    const residual = [];
    for (const h of hits) {
        (ALLOWLIST.has(h.rel) ? allowed : residual).push(h);
    }

    console.log("proof:dogfood — inv ζ (the demo carries no hand-rolled rAF loop");
    console.log("                a shipped light engine already is)");
    console.log(
        `  demo source files scanned: ${sources.length} (dist/ excluded)`,
    );
    console.log(
        `  raw requestAnimationFrame sites: ${hits.length} file(s) ` +
            `(${allowed.length} allowlisted, ${residual.length} residual)`,
    );

    // Surface the allowlisted sites by name so the manifest is visible in the
    // gate's own output (and a stale allowlist entry that no longer matches a
    // real site is caught below).
    for (const h of allowed) {
        console.log(
            `  ✓ allowlisted: ${h.rel}  (raw rAF ×${h.count} — justified exception)`,
        );
    }

    const failures = [];

    // The bite: any non-allowlisted demo source holding a raw rAF.
    for (const h of residual) {
        failures.push(
            `${h.rel}: ${h.count} raw requestAnimationFrame call(s) — transpose ` +
                `onto a light engine (SmoothProgress / SpringProgress / ` +
                `NumericAnimation / RAFPlayback.drive|loop) or add a justified ` +
                `exception to the proof:dogfood ALLOWLIST with a rationale.`,
        );
    }

    // Stale-allowlist guard (mirrors proof:boundary's self-enforcing posture):
    // an allowlist entry that points at a file with NO raw rAF (the exception
    // was removed, or the path drifted) is dead and must be pruned, lest it
    // silently waive a future raw-rAF reintroduction at that path.
    const hitPaths = new Set(hits.map((h) => h.rel));
    for (const a of ALLOWLIST) {
        if (!hitPaths.has(a)) {
            failures.push(
                `allowlist entry "${a}" matches no raw-rAF site — it is STALE ` +
                    `(the file is gone, the path drifted, or the exception was ` +
                    `transposed away). Remove it from the proof:dogfood ALLOWLIST.`,
            );
        }
    }

    // ── F.W10 orchestration-dogfood clauses (the inv-ζ analogue) ──────────────
    console.log(
        "\n  orchestration tier (F.W10 — decay/Sequence/stagger dogfooded):",
    );

    const readDemo = (rel) => {
        const abs = path.join(REPO, rel);
        return fs.existsSync(abs) ? fs.readFileSync(abs, "utf8") : null;
    };

    // Strip line + block comments so the hand-rolled-decay regex matches only
    // LIVE code — the file legitimately NAMES the removed `Math.pow(...,
    // dt/TARGET_DT)` form in its docstring (explaining what the swap replaced);
    // that explanatory mention must NOT red the clause, only its return to code.
    const stripComments = (src) =>
        src
            .replace(/\/\*[\s\S]*?\*\//g, "")
            .replace(/(^|[^:])\/\/[^\n]*/g, "$1");

    // Clause 1 — useOrbitalInertia consumes `decay()`, no hand-rolled Math.pow.
    const inertiaSrc = readDemo(ORBITAL_INERTIA);
    if (inertiaSrc === null) {
        failures.push(
            `${ORBITAL_INERTIA}: missing — the orbital-inertia decay-swap file ` +
                `is gone; the F.W10 orchestration-dogfood clause cannot verify.`,
        );
    } else {
        const inertiaCode = stripComments(inertiaSrc);
        if (HANDROLLED_DECAY.test(inertiaCode)) {
            failures.push(
                `${ORBITAL_INERTIA}: hand-rolls a Math.pow(... / TARGET_DT) ` +
                    `decay — the discrete Euler form the engine's analytic ` +
                    `decay() replaces. Consume the engine's decay() instead ` +
                    `(F.W10.S1, the inv-ζ orchestration analogue).`,
            );
        } else if (!IMPORTS_DECAY.test(inertiaSrc)) {
            failures.push(
                `${ORBITAL_INERTIA}: does NOT import the engine's decay() — the ` +
                    `orchestration tier is un-consumed (import { decay } from ` +
                    `"@src/animation/decay").`,
            );
        } else {
            console.log(
                `  ✓ ${ORBITAL_INERTIA} consumes the engine's decay() (no ` +
                    `hand-rolled Math.pow decay)`,
            );
        }
    }

    // Clause 2 — the Sequence+stagger scene imports BOTH from the engine.
    const seqSrc = readDemo(SEQUENCE_DEMO);
    if (seqSrc === null) {
        failures.push(
            `${SEQUENCE_DEMO}: missing — the F.W10 Sequence+stagger demo scene ` +
                `does not exist (a primitive with no exercising scene fails).`,
        );
    } else {
        const missing = [];
        if (!IMPORTS_SEQUENCE.test(seqSrc)) missing.push("Sequence");
        if (!IMPORTS_STAGGER.test(seqSrc)) missing.push("stagger");
        if (missing.length > 0) {
            failures.push(
                `${SEQUENCE_DEMO}: does NOT import ${missing.join(" + ")} from ` +
                    `the engine — the Sequence+stagger tier is un-dogfooded ` +
                    `(F.W10.S3).`,
            );
        } else {
            console.log(
                `  ✓ ${SEQUENCE_DEMO} imports Sequence + stagger from the engine`,
            );
        }
    }

    if (failures.length > 0) {
        console.error("\nproof:dogfood — FAIL (inv ζ — the shop-window hand-rolls a loop the engine ships):");
        for (const f of failures) console.error("  ✗ " + f);
        console.error(
            "\n  The demo IS the engine's showcase. A demo rAF loop that re-implements\n" +
                "  a shipped light tracker advertises against the product — transpose it\n" +
                "  onto the engine, or (for a genuine non-engine use) add an explicit,\n" +
                "  rationale-bearing entry to the ALLOWLIST in scripts/proof-dogfood.mjs.",
        );
        process.exit(1);
    }

    console.log(
        "\nproof:dogfood — PASS: every demo rAF site is a justified, allowlisted\n" +
            "exception; no hand-rolled animation loop survives beside the engine. inv ζ holds.",
    );
}

main();
