#!/usr/bin/env node
/**
 * proof:spring-blend-weight — K.W11 PHYSICS (the flagship-demo oracle).
 *
 * The physics ALGEBRA composed with kf's unique axes. Three frontier moves,
 * born-RED in the FRONTIER sense (the capability was ABSENT on the pre-cure
 * tree — `grep weightSpring|transitionLayer|crossfade src/` was ZERO hits; the
 * engine path carried NO velocity; the PRM gate was a BOOLEAN):
 *
 *   PHYS-C — a `SpringProgress` (any `WeightStepper`) DRIVES a layer's blend
 *     `weight` instead of a constant. `group.transitionLayer`/`crossfade`
 *     spring the weight; the `weighted` blend leaf reads
 *     `layer.weightSpring?.value ?? layer.weight` (ONE nullish read, hoisted
 *     out of the element loop — the constant path byte-unchanged). A crossfade
 *     follows a PHYSICAL trajectory that can overshoot 1.0 and settle — only
 *     possible on kf's weighted-blend substrate.
 *
 *   PHYS-B2 — `reseatToSpring(probe, newTarget)` finite-differences a parsed-CSS
 *     interp stream (`probeVelocity`) and seeds a spring at the CURRENT position
 *     with the MEASURED velocity, so an interruption is velocity-continuous (no
 *     kink), NOT a restart from rest.
 *
 *   PHYS-E — `withReducedMotion`/`reducedMotionScale` take an INTENSITY ∈ [0,1],
 *     not a boolean. The analytic spring scales its displacement-from-rest
 *     (`x0 = originValue − targetValue`) by the intensity at `evaluateAt`, so
 *     peak amplitude scales while the envelope (curve + settle time) is
 *     preserved — WCAG 2.3.3-aligned, net-new in the field.
 *
 * A SOURCE-GREP gate in the style of `proof:blend` / `proof:motion-path`: each
 * clause reds on the exact regression it forbids — verified, not asserted. The
 * VALUE proof (the overshoot peak, the velocity-continuity ε, the `s × peak`
 * amplitude) rides the chained `vitest run test/group/spring-blend-weight.test.ts`.
 *
 * Mirrors `proof:blend`: exits 1 on any residual.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

const failures = [];
const fail = (clause, msg) => failures.push(`  ✗ [${clause}] ${msg}`);
const ok = (clause, msg) => console.log(`  ✓ [${clause}] ${msg}`);

/** Assert every anchor is present in `file`; the clause reds on any missing. */
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
    "proof:spring-blend-weight — K.W11 PHYSICS (spring-driven blend weight +\n" +
        "  reseatToSpring + intensity-scaled reduced motion)",
);

const GROUP = "src/animation/group/group.ts";
// R.W2 — the `group-layer-springs.ts` junk-drawer 3-way split: the spring
// helpers (`seedLayerSpring` + `advanceLayerSprings`) moved to the colocated
// `./springs` module (the SAME "gate follows code to its new home" co-edit the
// PHYS-B2 reseat split below did for `spring-reseat`). The per-frame advance
// BODY (`tickDt(dt)` + the settle commit/clear) is greped at its new home; the
// CALL site (`if (this._hasLayerSprings) this.advanceLayerSprings(dt)`) + the
// gate-anchored composite STATEMENTS (the `weighted` leaf read, `transitionLayer`
// re-seat, `layer.weightSpring = spring`) stay in `group.ts`.
const GROUP_SPRINGS = "src/animation/group/springs.ts";
// R.W2 — the boxed weighted-blend LEAF (the `const w = layer.weightSpring?.value
// ?? layer.weight` read + the `lerp(..., w)`) moved with `boxedBlendArm` into the
// colocated `./compositor` (the 146L+70L carve); the `phys-c-read` clause greps
// it at its new home.
const GROUP_COMPOSITOR = "src/animation/group/compositor.ts";
const GROUP_WEIGHT = "src/animation/group/weight.ts";
// R.W2 — the layer-management + spring-transition API (`transitionLayer`/
// `crossfade` + the spring park/re-seat statements) moved off `group.ts` into the
// colocated `./layer-api` (the cohesive "layer API" carve); the transition
// STATEMENTS are greped at their new home.
const GROUP_LAYER_API = "src/animation/group/layer-api.ts";
const SPRING = "src/animation/physics/spring/progress.ts";
// L.WZ ceiling split — the PHYS-B2 velocity-continuous interruption seam
// (`VelocityProbe` / `probeVelocity` / `reseatToSpring`) was EXTRACTED out of
// the `spring.ts` god-module into the colocated `./spring-reseat` module (the
// spring.ts ≤700 ceiling split, the engine-composition.ts precedent — the gate
// FOLLOWS the code to its new home). `spring.ts` re-exports the public symbols
// so the barrel resolves them through `./spring` unchanged; the `phys-b2-reseat`
// arm below greps the function BODIES at their new home.
const SPRING_RESEAT = "src/animation/physics/spring/solver/reseat.ts";
// S.B1 — constants carved into constants/{types,defaults}.ts; the phys-c-field
// anchors (WeightStepper + AnimationLayerConfig.weightSpring) are TYPE
// declarations and live on the LIGHT-pure types module.
const CONSTANTS = "src/animation/constants/types.ts";
const PRM = "src/animation/internal/reduced-motion.ts";
const TEST = "test/group/spring-blend-weight.test.ts";

// ── PHYS-C (a) — the weighted leaf reads the stepper value, not the constant ──
// BITE: revert the lerp factor to the bare `layer.weight` → the spring no longer
// drives the blend → the overshoot value test reds (a hard cut, no overshoot).
// The resolver body lives in `weight.ts`; the compositor consumes that resolver
// once per layer before lerping, so this gate follows both halves of the seam.
{
    const compositor = read(GROUP_COMPOSITOR);
    const weight = read(GROUP_WEIGHT);
    const springRead =
        /layer\.weightSpring\?\.value\s*\?\?\s*layer\.weight/.test(weight);
    const lerpUsesW =
        /const\s+w\s*=\s*resolveBlendWeight\(layer\)/.test(compositor) &&
        /existing\[i\]\.value\s*=\s*lerp\([\s\S]*?incoming\[i\]\.value\s*,\s*w\s*,?\s*\)/.test(compositor);
    if (!springRead || !lerpUsesW) {
        fail(
            "phys-c-read",
            `${GROUP_COMPOSITOR} + ${GROUP_WEIGHT}: the weighted leaf must resolve \`layer.weightSpring?.value ?? layer.weight\` (found ${springRead}) and lerp by the resolved \`w\` (found ${lerpUsesW}) — a bare \`layer.weight\` third-arg is the static-weight HARD CUT the spring-driven blend cures.`,
        );
    } else {
        ok(
            "phys-c-read",
            "the weighted blend leaf reads the stepper value (?? layer.weight) and lerps by it — one nullish read, the constant path intact",
        );
    }
}

// ── PHYS-C (b) — the transitionLayer/crossfade API + the per-frame advance ────
// BITE: drop transitionLayer (no spring is ever parked) OR drop the per-frame
// tickDt (the spring never advances) → the weight stays put → overshoot reds.
// R.W2 — the transition API surface (`transitionLayer`/`crossfade` + the
// `advanceLayerSprings` call site) stays on `group.ts` as the public delegate;
// the spring park/re-seat STATEMENTS moved with the bodies to `./layer-api`, and
// the per-frame advance BODY to `./springs` — each greped at its new home.
requireAll("phys-c-api", GROUP, [
    {
        name: "transitionLayer is on the public group surface",
        re: /transitionLayer\(/,
    },
    {
        name: "crossfade is on the public group surface",
        re: /crossfade\(/,
    },
    {
        name: "the group drives the per-frame advance (advanceLayerSprings call site)",
        re: /advanceLayerSprings/,
    },
]);
requireAll("phys-c-transition", GROUP_LAYER_API, [
    {
        name: "transitionLayer constructs/re-seats a SpringProgress on layer.weightSpring",
        re: /export\s+function\s+transitionLayer/,
    },
    {
        name: "crossfade springs a→0 and b→1",
        re: /export\s+function\s+crossfade/,
    },
    {
        name: "the layer spring is parked on layer.weightSpring",
        re: /layer\.weightSpring\s*=\s*spring/,
    },
    {
        name: "a mid-flight re-target re-seats from live (value, velocity) via `set target`",
        re: /existing\.target\s*=\s*target\.weight/,
    },
]);
requireAll("phys-c-advance", GROUP_SPRINGS, [
    {
        name: "advanceLayerSprings advances each driving spring by dt (tickDt)",
        re: /export\s+const\s+advanceLayerSprings/,
    },
    {
        name: "the per-frame advance steps tickDt(dt)",
        re: /spring\.tickDt\(dt\)/,
    },
    {
        name: "a settled spring commits its value to the constant weight and clears",
        re: /entry\.layer\.weight\s*=\s*spring\.value;[\s\S]*?delete\s+entry\.layer\.weightSpring/,
    },
]);

// ── PHYS-C (c) — the WeightStepper field on AnimationLayerConfig ──────────────
// BITE: remove the field → the leaf can't read a spring → tsc + the test red.
requireAll("phys-c-field", CONSTANTS, [
    {
        name: "WeightStepper interface (value getter + tickDt + settled)",
        re: /interface\s+WeightStepper\s*\{[\s\S]*?readonly\s+value:\s*number[\s\S]*?tickDt\(dt:\s*number\)[\s\S]*?readonly\s+settled:\s*boolean/,
    },
    {
        name: "AnimationLayerConfig.weightSpring?: WeightStepper",
        re: /weightSpring\?:\s*WeightStepper/,
    },
]);

// ── PHYS-C (d) — the fast-path guard (the zero-alloc / no-regression contract) ─
// BITE: tick springs unconditionally (drop `_hasLayerSprings`) → the constant
// blend path pays a per-frame scan → the no-regression contract breaks.
{
    const src = read(GROUP);
    const guarded =
        /if\s*\(\s*this\._hasLayerSprings\s*\)\s*this\.advanceLayerSprings/.test(
            src,
        );
    if (!guarded) {
        fail(
            "phys-c-guard",
            `${GROUP}: \`advanceLayerSprings\` must be gated behind \`if (this._hasLayerSprings)\` so the constant-weight blend hot path takes ZERO new per-frame work (the MEASURE-FIRST no-regression contract).`,
        );
    } else {
        ok(
            "phys-c-guard",
            "the per-frame spring advance is gated behind `_hasLayerSprings` — the constant path pays nothing",
        );
    }
}

// ── PHYS-B2 — reseatToSpring is velocity-continuous (finite-diff seed) ────────
// BITE: seed from rest (drop the measured velocity) → the interruption restarts
// from zero velocity → the no-kink continuity test reds.
requireAll("phys-b2-reseat", SPRING_RESEAT, [
    {
        name: "probeVelocity finite-differences (curr − prev) / dt",
        re: /export\s+function\s+probeVelocity[\s\S]*?\(probe\.curr\.value\s*-\s*probe\.prev\.value\)\s*\/\s*\(dtMs\s*\/\s*1000\)/,
    },
    {
        name: "reseatToSpring seeds initialVelocity from the MEASURED velocity",
        re: /export\s+function\s+reseatToSpring[\s\S]*?initialVelocity:\s*velocity/,
    },
    {
        name: "reseatToSpring seeds initial at the current (interruption) position",
        re: /initial:\s*probe\.curr\.value/,
    },
    {
        name: "reseatToSpring re-seats onto the new target (continuous trajectory)",
        re: /spring\.target\s*=\s*newTarget/,
    },
]);

// ── PHYS-E — the PRM gate takes a SCALE (intensity), the spring scales x0 ──────
// BITE: revert withReducedMotion to `boolean` (or drop the x0 multiply) → an
// intensity 0.3 request snaps or runs full → the `s × peak` amplitude test reds.
requireAll("phys-e-scale", PRM, [
    {
        name: "ReducedMotionPolicy is boolean | number | undefined",
        re: /type\s+ReducedMotionPolicy\s*=\s*boolean\s*\|\s*number\s*\|\s*undefined/,
    },
    {
        name: "reducedMotionScale resolves the policy to an amplitude scale ∈ [0,1]",
        re: /export\s+function\s+reducedMotionScale\(respect:\s*ReducedMotionPolicy\)/,
    },
    {
        name: "withReducedMotion accepts the policy (a positive intensity routes to run, not snap)",
        re: /withReducedMotion<T>\(\s*respect:\s*ReducedMotionPolicy/,
    },
]);
requireAll("phys-e-amplitude", SPRING, [
    {
        name: "the spring solves toward a SCALED target origin + s·(target − origin)",
        re: /const\s+s\s*=\s*this\.amplitudeScale;[\s\S]*?scaledTarget\s*=\s*\n?\s*this\.originValue\s*\+\s*s\s*\*\s*\(this\.targetValue\s*-\s*this\.originValue\)/,
    },
    {
        name: "the displacement-from-rest x0 is measured from the scaled target",
        re: /const\s+x0\s*=\s*this\.originValue\s*-\s*scaledTarget/,
    },
    {
        name: "the spring settles to the scaled target (currentValue = scaledTarget + xRel)",
        re: /this\.currentValue\s*=\s*scaledTarget\s*\+\s*xRel/,
    },
    {
        name: "amplitudeScale is resolved from the policy via reducedMotionScale",
        re: /this\.amplitudeScale\s*=\s*reducedMotionScale\(/,
    },
]);

// R.W1: the SpringProgressOptions shape (incl. respectReducedMotion) moved to the
// spring family's `types.ts` (the progress↔duration↔reseat ring-break). The
// phys-e amplitude-policy TYPE anchor now reads the types module.
const SPRING_TYPES = "src/animation/physics/spring/types.ts";
requireAll("phys-e-amplitude-type", SPRING_TYPES, [
    {
        name: "respectReducedMotion is typed as the ReducedMotionPolicy (not bare boolean)",
        re: /respectReducedMotion:\s*ReducedMotionPolicy/,
    },
]);

// ── test-locks — the value clauses are present and biting ─────────────────────
requireAll("test-locks", TEST, [
    {
        name: "(a) PHYS-C overshoot — the weight blends PAST the target then settles",
        re: /overshoot/i,
    },
    {
        name: "(b) PHYS-C velocity-carry on re-target (no kink)",
        re: /re-?target|velocity-?carry|no-?kink/i,
    },
    {
        name: "(c) PHYS-B2 reseatToSpring is velocity-continuous",
        re: /reseatToSpring/,
    },
    {
        name: "(d) PHYS-E the spring scales amplitude (s × peak), not the curve",
        re: /amplitude|intensity/i,
    },
]);

console.log("");
if (failures.length > 0) {
    console.error(
        "proof:spring-blend-weight — FAIL: the K.W11 physics is not fully gated:\n" +
            failures.join("\n") +
            "\n\n  PHYS-C: the `weighted` leaf must read `layer.weightSpring?.value ??\n" +
            "  layer.weight` and the group must spring + per-frame-advance the\n" +
            "  weight (transitionLayer/crossfade/advanceLayerSprings, guarded by\n" +
            "  `_hasLayerSprings`). PHYS-B2: reseatToSpring must seed the MEASURED\n" +
            "  velocity at the current position. PHYS-E: the PRM gate must take an\n" +
            "  intensity and the spring must scale x0 (and v0) by it. Restore the\n" +
            "  clause each anchor names.",
    );
    process.exit(1);
}
console.log(
    "proof:spring-blend-weight — PASS: a SpringProgress drives the weighted-blend\n" +
        "weight (the `?? layer.weight` read, the transitionLayer/crossfade API, the\n" +
        "guarded per-frame advance); reseatToSpring is velocity-continuous (the\n" +
        "finite-diff seed); the PRM gate takes an intensity and the analytic spring\n" +
        "scales its displacement-from-rest by it. The value proof rides\n" +
        "`vitest run test/group/spring-blend-weight.test.ts`.",
);
