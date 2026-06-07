#!/usr/bin/env node
/**
 * proof:finished — the G.W13 `.finished` completion front-door gate.
 *
 * `get finished()` exposes the ONE held `_playingPromise` `play()` already
 * constructs — settled ⇒ a pre-resolved `Promise.resolve()`, in-flight ⇒ the
 * held promise — NOT a second completion lifecycle. It lands on all four
 * playable surfaces (Animation / CSSKeyframesAnimation by inheritance /
 * AnimationGroup / Sequence).
 *
 * A SOURCE-GREP gate in the style of `proof:motion-path`: each clause reds on the
 * exact regression it forbids. The resolution/identity/premature-mid-play proof
 * lives in the chained `vitest run test/finished.test.ts` (the lead wires the
 * combined `"proof:finished"` script — see the note at the tail).
 *
 * CLAUSES (each BITES):
 *
 *   getter-present     — `get finished()` exists on `Animation` (engine.ts),
 *       `AnimationGroup` (group.ts), and `Sequence` (sequence.ts). BITE: omit the
 *       getter on any surface → reds (CSSKeyframesAnimation inherits Animation's).
 *
 *   held-promise       — each getter returns `this._playingPromise ??
 *       Promise.resolve()` — the held promise, not a fresh `new Promise` per
 *       call. BITE: `return new Promise(...)` per call → reds (and the test's
 *       referential-identity assertion reds).
 *
 *   one-lifecycle      — no surface mints a SECOND completion promise field for
 *       `.finished` beside `_playingPromise`. BITE: add a parallel
 *       `_finishedPromise` lifecycle → reds.
 *
 *   test-locks         — `test/finished.test.ts` carries the locking assertions
 *       (mid-play identity, never-played resolves immediately, the
 *       does-NOT-resolve-prematurely race, all-surfaces presence). BITE: delete a
 *       lock → reds.
 *
 * Mirrors `proof:motion-path`: exits 1 on any residual.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

const failures = [];
const fail = (clause, msg) => failures.push(`  ✗ [${clause}] ${msg}`);
const ok = (clause, msg) => console.log(`  ✓ [${clause}] ${msg}`);

console.log("proof:finished — G.W13 (the .finished completion front-door)");

const ENGINE = "src/animation/engine.ts";
const GROUP = "src/animation/group.ts";
const SEQUENCE = "src/animation/sequence.ts";
const TEST = "test/finished.test.ts";

const surfaces = [
    ["Animation (engine.ts)", ENGINE],
    ["AnimationGroup (group.ts)", GROUP],
    ["Sequence (sequence.ts)", SEQUENCE],
];

// The ONE faithful form: `get finished(): Promise<void> { return
// this._playingPromise ?? Promise.resolve(); }`. The held-promise body is the
// non-negotiable — a fresh-per-call promise reds the test's identity check.
const getterRe = /get\s+finished\s*\(\s*\)\s*:\s*Promise<void>\s*\{[\s\S]{0,120}?this\._playingPromise\s*\?\?\s*Promise\.resolve\(\)/;

// ── getter-present + held-promise — each surface returns the held promise ─────
for (const [label, file] of surfaces) {
    const src = read(file);
    const hasGetter = /get\s+finished\s*\(\s*\)/.test(src);
    const heldBody = getterRe.test(src);
    if (!hasGetter) {
        fail(
            "getter-present",
            `${label}: no \`get finished()\` — the completion front-door is missing on this surface.`,
        );
    } else if (!heldBody) {
        fail(
            "held-promise",
            `${label}: \`get finished()\` does NOT return \`this._playingPromise ?? Promise.resolve()\` — it must expose the HELD promise, not a fresh one per call (the identity contract).`,
        );
    } else {
        ok(
            "held-promise",
            `${label}: get finished returns the held _playingPromise (?? Promise.resolve())`,
        );
    }
}

// ── one-lifecycle — no parallel completion-promise field beside _playingPromise
for (const [label, file] of surfaces) {
    const src = read(file);
    // A second completion lifecycle would declare a `_finishedPromise`-shaped
    // field; the only completion promise must be `_playingPromise`.
    const parallel = /_finishedPromise\b/.test(src);
    if (parallel) {
        fail(
            "one-lifecycle",
            `${label}: a parallel \`_finishedPromise\` field — .finished must expose the ONE held _playingPromise, not a second completion lifecycle.`,
        );
    } else {
        ok(
            "one-lifecycle",
            `${label}: no parallel completion-promise field (the one held _playingPromise)`,
        );
    }
}

// ── test-locks — the resolution/identity/premature clauses are present ────────
{
    const src = read(TEST);
    const anchors = [
        {
            name: "(5) two mid-play reads return the SAME promise (identity)",
            re: /const\s+a\s*=\s*anim\.finished[\s\S]*?const\s+b\s*=\s*anim\.finished[\s\S]*?expect\(a\)\.toBe\(b\)/,
        },
        {
            name: "(6) a never-played .finished resolves immediately",
            re: /never-played[\s\S]*?\.finished\)\.resolves\.toBeUndefined\(\)/,
        },
        {
            name: "(6) BITE: .finished mid-play does NOT resolve prematurely (race → timeout)",
            re: /Promise\.race\(\[[\s\S]*?timeout\([\s\S]*?expect\(winner\)\.toBe\("timeout"\)/,
        },
        {
            name: "(7) all four surfaces (Animation/Group/Sequence) expose get finished",
            re: /AnimationGroup exposes get finished[\s\S]*?Sequence exposes get finished/,
        },
    ];
    const missing = anchors.filter(({ re }) => !re.test(src));
    if (missing.length > 0) {
        fail(
            "test-locks",
            `${TEST} is missing: ` +
                missing.map((m) => m.name).join("; ") +
                ` — the resolution/identity/premature locks are not all present.`,
        );
    } else {
        ok("test-locks", `${TEST} locks ${anchors.length} resolution clause(s)`);
    }
}

console.log("");
if (failures.length > 0) {
    console.error(
        "proof:finished — FAIL: the .finished front-door is not fully gated:\n" +
            failures.join("\n") +
            "\n\n  .finished is `this._playingPromise ?? Promise.resolve()` on all four\n" +
            "  playable surfaces — the ONE held promise (settled ⇒ pre-resolved,\n" +
            "  in-flight ⇒ the held one), no second lifecycle. Restore the clause\n" +
            "  each anchor names.",
    );
    process.exit(1);
}
console.log(
    "proof:finished — PASS: get finished returns the held _playingPromise\n" +
        "(?? Promise.resolve()) on Animation / AnimationGroup / Sequence (and\n" +
        "CSSKeyframesAnimation by inheritance) — one held promise, no second\n" +
        "completion lifecycle. The resolution proof rides `vitest run test/finished.test.ts`.",
);
