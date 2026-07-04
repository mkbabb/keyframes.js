#!/usr/bin/env node
/**
 * proof:composition-honored — K.W7 (THE FIDELITY FLOOR): the engine HONORS the
 * `animation-composition` operator the author declared. The round-trip made
 * HONEST at its floor — the `add`/`accumulate`/`replace` the CSS source carries
 * is the `add`/`accumulate`/`replace` the engine produces, on rAF AND WAAPI.
 *
 * BORN-RED WITNESS (the frontier sense): on the pre-cure tree
 * `engine.ts` has ZERO reads of the captured `resolved.composition` Map
 * (`grep "composition" engine.ts` = ZERO) and `waapi.ts` emits ZERO `composite`
 * — so a `composite:add` keyframe runs as silent `replace` on BOTH paths. Each
 * clause below reds on exactly that dropped-operator shape: a SOURCE-GREP gate
 * in the `proof:blend`/`proof:engine` style (each clause verified, not
 * asserted), chained to the VALUE proof in `test/composition-honored.test.ts`
 * (the SUM math, the accumulate, the rAF↔WAAPI parity, the honest fallback).
 *
 * CLAUSES (each BITES):
 *
 *   raf-read       — engine.ts READS `resolved.composition` in the fromString
 *       loop and threads it into addFrame. BITE: drop the read → the operator is
 *       dropped again (the born-RED root) → the value test reds.
 *
 *   apply-honor    — processFrame composites the lerped numeric leaf onto the
 *       captured base on the APPLY path (`transformFrames`-gated). BITE: remove
 *       the applyComposition call → the mid-frame is the replace, not the SUM.
 *
 *   accumulate     — the `accumulate` operator is repeat-aware (reads
 *       `this.iteration`). BITE: collapse accumulate to add (drop the iteration
 *       stack) → iteration 2 reads iteration 1's value → the value test reds.
 *
 *   non-numeric    — the non-numeric leaf `replace`-falls-back AND emits a
 *       COMPOSITION_FALLBACK row (never a silent wrong pixel). BITE: drop the
 *       fallback emit → the refusal is silent → the value test reds.
 *
 *   waapi-emit     — waapi.ts emits the `composite` keyword (the Baseline
 *       pass-through). BITE: drop the composite emit → WAAPI runs replace while
 *       rAF runs add → the parity clause reds.
 *
 *   raf-only-apply — the honoring is GATED on `transformFrames` (the rAF apply
 *       channel), so the WAAPI sample stays the raw effect (no double-count).
 *       BITE: ungate it → the WAAPI keyframes carry the SUM AND the compositor
 *       adds the base → double-counted → the parity raw-effect clause reds.
 *
 *   test-locks     — `test/composition-honored.test.ts` carries the four §gate
 *       value clauses (the 0.8 SUM, the 1.6 un-clamped, the 0.8 accumulate, the
 *       COMPOSITION_FALLBACK). BITE: delete a lock → reds.
 *
 * Mirrors proof:blend / proof:motion-path: exits 1 on any residual.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

const failures = [];
const fail = (clause, msg) => failures.push(`  ✗ [${clause}] ${msg}`);
const ok = (clause, msg) => console.log(`  ✓ [${clause}] ${msg}`);

const requireAll = (clause, file, anchors) => {
    const src = read(file);
    const missing = anchors.filter(({ re }) => !re.test(src));
    if (missing.length > 0) {
        fail(
            clause,
            `${file} is missing: ` +
                missing.map((m) => m.name).join("; ") +
                ` — the ${clause} contract is no longer locked.`,
        );
    } else {
        ok(clause, `${file} locks ${anchors.length} ${clause} anchor(s)`);
    }
};

console.log(
    "proof:composition-honored — K.W7 (the engine honors animation-composition)",
);

const ENGINE = "src/animation/engine/animation.ts";
// K.WZ — the K.W7 composition-honoring LEAF logic (the un-clamped add, the
// repeat-aware accumulate, the captured underlying base, the non-numeric
// `replace`-fallback + `COMPOSITION_FALLBACK` row) lives in this colocated
// INTERNAL module. R.W2 — the engine god-class was carved: the `fromString`
// `resolved.composition` READ moved to `engine/css/css-animation.ts`, and the
// `processFrame` → `applyComposition` CALL + the `iteration` thread moved to
// `engine/interpolate.ts` (the hot-path carve). The anchors below follow the
// code to its new home ("gate follows code").
const COMPOSITION = "src/animation/engine/composition.ts";
const CSS_ANIMATION = "src/animation/engine/css/css-animation.ts";
const INTERPOLATE = "src/animation/engine/interpolate.ts";
// R.W2 carved the flat `waapi/waapi.ts` into cohesive concerns; the WAAPI
// `composite` keyword pass-through (`toWAAPIOptions` + `uniformComposite` +
// the CompositeOperation map) lives in the options concern.
const WAAPI = "src/animation/waapi/waapi-options.ts"; // S.B4 rename (r3 F7)
const TEST = "test/composition-honored.test.ts";

// ── raf-read — engine reads resolved.composition + threads it into addFrame ──
// R.W2 — `fromString` lives in `engine/css/css-animation.ts` (the CSS subclass carve).
requireAll("raf-read", CSS_ANIMATION, [
    {
        name: "fromString reads resolved.composition.get(percent)",
        re: /resolved\.composition\.get\(\s*percent\s*\)/,
    },
    {
        name: "the captured operator threads into addFrame (the 5th arg)",
        re: /addFrame\(\s*[\s\S]*?composition[\s\S]*?\)/,
    },
]);

// ── apply-honor — processFrame composites on the APPLY path ───────────────────
// The CALL site lives in `engine/interpolate.ts` (R.W2 hot-path carve): the
// `processFrame` free function calls `applyComposition`. The leaf bodies (the
// un-clamped add, the captured base) live in `engine/composition.ts`.
requireAll("apply-honor", INTERPOLATE, [
    {
        name: "processFrame calls applyComposition (the honoring leaf)",
        re: /applyComposition\(\s*anim\s*,\s*frame\s*\)/,
    },
]);
requireAll("apply-honor", COMPOSITION, [
    {
        name: "the composite accumulates the numeric leaf IN PLACE (un-clamped)",
        re: /unit\.value\s*=\s*b\s*\+\s*unit\.value/,
    },
    {
        name: "the underlying base is CAPTURED (not re-parsed at apply time)",
        re: /captureUnderlyingBase\(/,
    },
]);

// ── accumulate — the accumulate operator is repeat-aware (reads iteration) ────
// The iteration counter is threaded in via the runtime; the stack math lives in
// the extracted module (the engine surfaces `iteration` on the runtime object).
requireAll("accumulate", COMPOSITION, [
    {
        name: "accumulate reads the iteration counter (runtime.iteration)",
        re: /op\s*===\s*["']accumulate["']\s*\?\s*runtime\.iteration/,
    },
    {
        name: "the repeat-aware stack adds iters·(end − base) onto the base",
        re: /b\s*\+\s*iters\s*\*\s*\(\s*end\s*-\s*b\s*\)\s*\+\s*unit\.value/,
    },
]);
// The engine THREADS its own `iteration` into the composition runtime (the
// counter the accumulate stack reads) — R.W2: the `applyComposition` seam moved
// to `engine/interpolate.ts`. S.B2 (C-15) folded the run-state FSM into
// PlaybackState single-STORAGE, so the hot path threads
// `iteration: anim._playback.iteration` (the backing store) — the CompositionRuntime
// interface still insulates `composition.ts`, which reads `runtime.iteration`.
requireAll("accumulate", INTERPOLATE, [
    {
        name: "the interp hot-path threads its iteration counter into the composition runtime",
        re: /iteration:\s*anim\._playback\.iteration/,
    },
]);

// ── non-numeric — the non-numeric leaf replace-falls-back AND diagnoses ───────
requireAll("non-numeric", COMPOSITION, [
    {
        name: "a non-numeric leaf emits COMPOSITION_FALLBACK (never silent)",
        re: /emitCompositionFallback\(/,
    },
    {
        name: "the fallback row carries the stable COMPOSITION_FALLBACK code",
        re: /code:\s*["']COMPOSITION_FALLBACK["']/,
    },
    {
        name: "the numeric guard gates the honoring (every leaf element)",
        re: /leaf\.every\(\s*\(?u\)?\s*=>\s*u\s+instanceof\s+ValueUnit/,
    },
]);

// ── waapi-emit — the Baseline composite keyword pass-through ──────────────────
requireAll("waapi-emit", WAAPI, [
    {
        name: "toWAAPIOptions emits the composite keyword",
        re: /result\.composite\s*=\s*composite/,
    },
    {
        name: "the uniform composite is derived from the frames' operator",
        re: /uniformComposite\(/,
    },
    {
        name: "the CompositeOperation map forwards add/accumulate (Baseline)",
        re: /accumulate:\s*["']accumulate["']/,
    },
]);

// ── raf-only-apply — the honoring is GATED on transformFrames ─────────────────
// R.W2 — `processFrame` (the gate site) lives in `engine/interpolate.ts`.
{
    const src = read(INTERPOLATE);
    // The applyComposition call must be guarded by `transformFrames` so a WAAPI
    // sample (apply=false) keeps the raw effect (the compositor adds the base).
    const gated =
        /if\s*\(\s*transformFrames\s*&&[\s\S]*?frame\.composition\s*!=\s*null\s*\)\s*\{\s*applyComposition\(\s*anim/.test(
            src,
        );
    if (!gated) {
        fail(
            "raf-only-apply",
            `${INTERPOLATE}: the applyComposition call is NOT gated on \`transformFrames\` — a WAAPI sample (apply=false) would carry the SUM AND the compositor would add the base, double-counting (parity reds).`,
        );
    } else {
        ok(
            "raf-only-apply",
            `the honoring is gated on \`transformFrames\` — the WAAPI sample stays the raw effect, no double-count`,
        );
    }
}

// ── test-locks — the four §gate value clauses are present and biting ──────────
requireAll("test-locks", TEST, [
    {
        name: "(a) the rAF add SUM → 0.8",
        re: /toBeCloseTo\(0\.8\b/,
    },
    {
        name: "(a) the un-clamped add → 1.6",
        re: /toBeCloseTo\(1\.6\b/,
    },
    {
        name: "(b) the repeat-aware accumulate (iteration 1 → 0.8)",
        re: /iteration\s*=\s*1[\s\S]*?toBeCloseTo\(0\.8\b/,
    },
    {
        name: "(c) the WAAPI options carry composite:add",
        re: /opts\.composite\)\.toBe\(["']add["']\)/,
    },
    {
        name: "(d) the non-numeric fallback emits COMPOSITION_FALLBACK",
        re: /toContain\(["']COMPOSITION_FALLBACK["']\)/,
    },
]);

console.log("");
if (failures.length > 0) {
    console.error(
        "proof:composition-honored — FAIL: the engine does not fully honor\n" +
            "animation-composition:\n" +
            failures.join("\n") +
            "\n\n  The engine must READ the captured `resolved.composition` Map (never\n" +
            "  re-parse), composite the numeric leaf onto the captured base on the\n" +
            "  rAF apply path (un-clamped add, repeat-aware accumulate), `replace`-\n" +
            "  fall-back + diagnose a non-numeric leaf, and emit the Baseline\n" +
            "  `composite` keyword on the WAAPI path. Restore the clause each anchor names.",
    );
    process.exit(1);
}
console.log(
    "proof:composition-honored — PASS: the engine reads the captured composition\n" +
        "operator, composites the numeric leaf onto the captured underlying base on\n" +
        "the rAF apply (un-clamped add; repeat-aware accumulate via the iteration\n" +
        "counter), `replace`-falls-back + diagnoses a non-numeric leaf, and emits\n" +
        "the Baseline `composite` keyword on WAAPI — the operator honored\n" +
        "IDENTICALLY across backends. The value proof rides\n" +
        "`vitest run test/composition-honored.test.ts`.",
);
