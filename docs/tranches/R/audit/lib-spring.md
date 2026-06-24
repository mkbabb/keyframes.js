# Tranche R Audit — lib-spring lane

**Lane:** lib-spring  
**Files audited:** `src/animation/spring.ts` (685L), `src/animation/spring-duration.ts` (83L), `src/animation/spring-reseat.ts` (98L), `src/animation/springLinearStops.ts` (73L), `src/animation/springTimingFunction.ts` (120L)  
**Total cluster:** 1,059 lines across 5 flat files  
**Date:** 2026-06-24

---

## 1. Sub-module verdict: this IS a coherent spring/ candidate

The five files share a single physics identity:

| File | Role |
|---|---|
| `spring.ts` | Core: `SpringProgress` class, ODE solver, vector mode |
| `spring-duration.ts` | Construction surface: `{ visualDuration, bounce }` → `(response, dampingFraction)` |
| `spring-reseat.ts` | Interruption: velocity-continuous re-seat from a keyframe stream |
| `springLinearStops.ts` | Emitter: spring curve → CSS `linear()` string |
| `springTimingFunction.ts` | Emitter: spring curve → `Easing` (callable + CSS twin) |

Every file either IS `SpringProgress` or SERVES `SpringProgress` exclusively. No file in this cluster imports from, or is imported by, anything outside the spring domain except at the consumption boundary (`resolve-values.ts`, `waapi.ts`, `animations.ts`, `drag.ts`, `scroll-scene.ts`, `group-layer-springs.ts`). The cohesion test passes cleanly.

The appropriate refactor is `src/animation/spring/` with an `index.ts` that re-exports everything currently resolved through `./spring` and the two flat emitters. The barrel (`src/animation/index.ts`) imports from `./spring` today — changing that to `./spring/index` is a one-line move.

---

## 2. Naming inconsistency — mixed camelCase / kebab-case filenames

**Severity: medium**

```
spring-duration.ts     ← kebab-case  (added in d7c7f3d, Tranche-L close)
spring-reseat.ts       ← kebab-case  (added in d7c7f3d, Tranche-L close)
springLinearStops.ts   ← camelCase   (added in d89274d, original spring drop)
springTimingFunction.ts← camelCase   (added in ddd3409, timing-function wave)
```

The whole `src/animation/` flat space uses kebab-case uniformly for every other hyphenated file (`engine-playback.ts`, `group-soa.ts`, `waapi-densify.ts`, `frame-compiler-numeric.ts`). The two camelCase survivors are historical accidents from the first spring drop, before the project settled on kebab.

**Proposal:** rename `springLinearStops.ts` → `spring-linear-stops.ts` and `springTimingFunction.ts` → `spring-timing-function.ts`. If the sub-module directory is adopted, the rename is subsumed into the relocation — both land as `spring/linear-stops.ts` and `spring/timing-function.ts`.

---

## 3. Circular import ring: `spring.ts` ↔ `spring-duration.ts` ↔ `spring.ts`

**Severity: medium (structural brittleness)**

```
spring.ts:12-15       import { durationToSpringOptions, type SpringDurationOptions } from "./spring-duration"
spring.ts:22-26       export { probeVelocity, reseatToSpring, type VelocityProbe } from "./spring-reseat"

spring-duration.ts:17 import { DEFAULT_SPRING_RESPONSE, type SpringProgressOptions } from "./spring"
spring-reseat.ts:16   import { SpringProgress } from "./spring"
spring-reseat.ts:17   import type { SpringProgressOptions } from "./spring"
```

Both satellites import runtime values from `spring.ts` (`DEFAULT_SPRING_RESPONSE`, `SpringProgress`), while `spring.ts` imports runtime values back from them (`durationToSpringOptions`). TypeScript resolves the cycle at emit time (ESM circular references are deferred by the module graph), but this is a structural dependency inversion.

**Root cause:** the "library ceiling" mechanism pressured line count down without addressing where types and constants should live. `DEFAULT_SPRING_RESPONSE` and `SpringProgressOptions` need to be accessible to both `spring.ts` and its satellites without importing through the class file.

**Proposal:** extract a `spring/types.ts` (or `spring/constants.ts`) that holds `SpringProgressOptions`, `DEFAULT_SPRING_RESPONSE`, `SpringSubscriber`, `SpringFrameCallback`, and the other pure-type exports. `spring.ts` (the class) and all satellites import from `types.ts`, not each other. The cycle dissolves.

In a `src/animation/spring/` directory:
```
spring/
  index.ts         ← re-exports everything (the public surface, unchanged)
  types.ts         ← SpringProgressOptions, DEFAULT_SPRING_RESPONSE, subscriber types
  progress.ts      ← SpringProgress class (the ODE + vector mode)
  duration.ts      ← durationToSpringOptions, SpringDurationOptions
  reseat.ts        ← probeVelocity, reseatToSpring, VelocityProbe
  linear-stops.ts  ← springLinearStops, SpringLinearStopsOptions
  timing-function.ts ← springTimingFunction, SpringTimingFunctionOptions
```

---

## 4. DRY violation — duplicated sampler setup in linear-stops vs timing-function

**Severity: medium**

Both `springLinearStops` and `springTimingFunction` contain identical spring-sampler setup boilerplate:

`springLinearStops.ts:51-64`:
```ts
const spring = new SpringProgress({
    response: opts.response,
    dampingFraction: opts.dampingFraction,
    initial: 0,
    settleThreshold,
    velocitySettleThreshold: settleThreshold,
});
spring.target = 1;
// ... loop calling spring._stepSeconds(dt)
```

`springTimingFunction.ts:74-91`:
```ts
const spring = new SpringProgress({
    response: opts.response,
    dampingFraction: opts.dampingFraction,
    initial: 0,
    settleThreshold,
    velocitySettleThreshold: settleThreshold,
});
spring.target = 1;
// ... loop calling spring._stepSeconds(dt)
```

The pattern — construct `SpringProgress({initial:0}), set target=1, step N times` — is a dedicated private concern: "sample a normalized spring curve into an array." A shared internal helper `sampleNormalizedSpring(opts, sampleCount, dt): Float64Array` would own this, called by both emitters. The emitters then differ only in their output step (string formatting vs percent position vs linear interpolation).

**Proposal (within `spring/` dir):**
```ts
// spring/sample.ts (internal, not exported from index)
export function sampleNormalizedSpring(
    opts: { response: number; dampingFraction: number; settleThreshold?: number },
    sampleCount: number,
    maxDuration: number,
): Float64Array
```

Both `linear-stops.ts` and `timing-function.ts` consume this. The `_stepSeconds` leaking through `@internal` is also encapsulated.

---

## 5. DRY violation — `SpringTimingFunctionOptions` re-declares the body of `SpringLinearStopsOptions`

**Severity: low**

`springTimingFunction.ts:14-38` declares `SpringTimingFunctionOptions` with fields `response`, `dampingFraction`, `sampleCount`, `settleThreshold`, `maxDuration`. The comment on line 10 acknowledges this explicitly: *"Mirrors `SpringLinearStopsOptions`."*

They are identical except for the different default `sampleCount` (24 vs 64) — which is not part of the type at all. There is no type reason for two separate interfaces. `SpringTimingFunctionOptions` should `extend SpringLinearStopsOptions` (or simply alias it, since they carry the same fields).

---

## 6. Encapsulation breach — `_stepSeconds` leaks as a de-facto internal API

**Severity: medium**

`spring.ts:334` marks `_stepSeconds` as `@internal`, but it is underscore-prefixed, not `private`, specifically so `springLinearStops.ts:64` and `springTimingFunction.ts:88` can call it cross-file:

```ts
// springLinearStops.ts:64
spring._stepSeconds(dt);

// springTimingFunction.ts:88
spring._stepSeconds(dt);
```

This is an encapsulation leak driven by the flat file layout. If the samplers lived inside the same module directory, the natural resolution is:
- make `_stepSeconds` a module-internal export (not on the public class), or
- make the shared `sampleNormalizedSpring` helper the one caller of the method, keeping the underscore convention as a true private convention, not a published cross-file name.

---

## 7. `springTimingFunction` silently drops `sampleCount` when constructing the CSS twin

**Severity: medium (brittleness)**

`springTimingFunction` accepts `sampleCount` (default 64) for the JS easing table, but when it calls `springLinearStops` to construct the `.css` twin at lines 112-119, it does NOT forward `sampleCount`:

```ts
// springTimingFunction.ts:112-119
const stopOpts: SpringLinearStopsOptions = {
    response: opts.response,
    dampingFraction: opts.dampingFraction,
};
if (opts.settleThreshold !== undefined)
    stopOpts.settleThreshold = opts.settleThreshold;
if (opts.maxDuration !== undefined) stopOpts.maxDuration = opts.maxDuration;
return { fn, css: springLinearStops(stopOpts) };   // ← sampleCount NOT forwarded
```

The JS easing is built with `sampleCount=64` (or the caller's value); the CSS twin is built with `sampleCount=24` (springLinearStops default). These two curves will discretize the same analytic spring differently. For overdamped springs this is benign; for highly underdamped springs (ζ < 0.4) with a non-default `sampleCount`, the CSS WAAPI path runs a coarser curve than the JS fallback. The doc-comment on line 10-11 promises "same preset... identical curve," but the two stop counts differ unless the caller passes no `sampleCount`.

The fact that `sampleCount` is absent from `SpringLinearStopsOptions` but present on `SpringTimingFunctionOptions` makes it structurally impossible to forward — another consequence of the twin-option-type DRY violation (finding 5).

**Proposal:** unify the option types first (finding 5), then `springTimingFunction` forwards `sampleCount` to `springLinearStops` so both representations use the same grid.

---

## 8. Stale `LIBRARY_CEILING_OVERRIDE` rationale for `spring.ts`

**Severity: low (documentation brittleness)**

`scripts/proof-decomposition.mjs:224-242` records a `cap: 700` for `spring.ts` with the rationale:

> "the reseat is NOT a separable module — it seeds a `SpringProgress` from a measured `(x,v)` and IS the spring tracker's interruption entry-point... A split-for-line-count would orphan the reseat from the integrator it seeds."

But `spring-reseat.ts` was already extracted in the same commit (d7c7f3d) that set this override. The rationale argues against a split that already happened. The override cap was set at 700L "sitting just above the current 644L"; spring.ts is now at 685L (vector mode `setTargets`/`tickVector` added post-split), pushing toward the cap.

The override rationale needs to be updated to reflect actual current content. More importantly: if the `spring/` sub-module move is adopted, the proof:decomposition gate should be updated to reflect the new structure rather than carrying a stale ceiling rationale for a file whose name will change.

---

## 9. `target` setter guard reads construction-time `initialVelocity`, not live `currentVelocity`

**Severity: low (logic brittleness)**

`spring.ts:265-272`:
```ts
set target(value: number) {
    if (value === this.targetValue && !this.options.initialVelocity) {
        // No-op if target didn't change and velocity is zero — keeps
        // the existing closed-form state intact.
        return;
    }
    this.reseatTarget(value);
}
```

The guard checks `this.options.initialVelocity` (the construction-time parameter) not `this.currentVelocity` (the live state). This means:

- A spring constructed with `{ initialVelocity: 5 }`, now fully settled at zero velocity, will **incorrectly force a reseat** when reassigned the same target — because `options.initialVelocity` is `5` (truthy) even though `currentVelocity` is `0`.
- The comment says "velocity is zero" but it's checking a static option, not the live velocity.

The intended idempotence check is "target unchanged AND currently at rest." The fix is `!this.currentVelocity` (or `this.isSettled`):

```ts
set target(value: number) {
    if (value === this.targetValue && this.isSettled) {
        return;
    }
    this.reseatTarget(value);
}
```

`isSettled` is exactly the invariant: position within threshold of target AND velocity within threshold of zero. This is both semantically correct and simpler than the `initialVelocity` read. There are no tests for the `initialVelocity ≠ 0, re-assign same target after settle` case.

---

## 10. `SpringDurationOptions` is not exported from the public barrel

**Severity: low (api-surface gap)**

`spring.ts:17` re-exports `SpringDurationOptions` so consumers importing from `./spring` can see it. But `src/animation/index.ts` never exports `SpringDurationOptions`. A consumer using `SpringProgress.fromDuration({ visualDuration: 0.4, bounce: 0.2 })` who tries to type their options as `SpringDurationOptions` must either inline the type or import it directly from the deep path `@mkbabb/keyframes/animation/spring`, defeating the barrel contract.

**Proposal:** add `export type { SpringDurationOptions } from "./spring"` to `index.ts`.

---

## Summary table

| # | Finding | Severity | Category |
|---|---|---|---|
| 1 | Spring cluster IS a coherent sub-module — should be `src/animation/spring/` | high | decomposition |
| 2 | File-naming inconsistency: camelCase vs kebab-case within the cluster | medium | styling |
| 3 | Circular import ring: `spring.ts` ↔ satellites both importing each other | medium | encapsulation |
| 4 | Duplicated sampler setup boilerplate in both emitter files | medium | dry |
| 5 | `SpringTimingFunctionOptions` is a re-declaration of `SpringLinearStopsOptions` | low | dry |
| 6 | `_stepSeconds` is a de-facto cross-file API due to flat layout | medium | encapsulation |
| 7 | `springTimingFunction` silently drops caller's `sampleCount` in CSS twin | medium | brittleness |
| 8 | Stale `LIBRARY_CEILING_OVERRIDE` rationale in proof-decomposition.mjs | low | legacy |
| 9 | `target` setter guard checks construction-time `initialVelocity` not live state | low | brittleness |
| 10 | `SpringDurationOptions` missing from public barrel `index.ts` | low | api-surface |

---

## Proposed `src/animation/spring/` layout

```
src/animation/spring/
  index.ts           ← public surface; all existing barrel exports unchanged
  types.ts           ← SpringProgressOptions, DEFAULT_SPRING_RESPONSE, subscriber types
                        (breaks the circular import ring)
  progress.ts        ← SpringProgress class (ODE + vector mode; ~480L)
  duration.ts        ← durationToSpringOptions, SpringDurationOptions
  reseat.ts          ← probeVelocity, reseatToSpring, VelocityProbe
  sample.ts          ← sampleNormalizedSpring (internal only; no index re-export)
  linear-stops.ts    ← springLinearStops, SpringLinearStopsOptions
  timing-function.ts ← springTimingFunction (extends SpringLinearStopsOptions)
```

`src/animation/index.ts` changes `from "./spring"` → `from "./spring/index"` (or just `from "./spring"` — Node module resolution finds `spring/index.ts` automatically). Zero public API change.

The `proof:decomposition` script would replace the `spring.ts` override with per-file ceilings. `progress.ts` at ~480L stays under the 550L base; the remaining files are all under 150L.
