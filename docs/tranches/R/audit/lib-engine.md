# Tranche R Audit — Lane: lib-engine

**Date:** 2026-06-24  
**Files in scope:** `engine.ts` (1420L), `engine-playback.ts` (484L), `engine-composition.ts` (221L), `engine-css-metadata.ts` (148L), `engine-options.ts` (193L)  
**Total line-count under review:** 2466L

---

## 1. What `engine.ts` Actually Is

`engine.ts` hosts two exported classes — `KeyframesAnimation<V>` (lines 115–1173) and `CSSKeyframesAnimation<V>` (lines 1175–1402) — plus a small module-level helper (`getAnimationId`, `hasClone`) and a re-export block that hoists `AnimationGroup`, `resolveKeyframes`, `getTimingFunction`, and constants out through the dynamic `loadAnimationEngine()` boundary.

The **four distinct responsibilities** still packed into the class body:

| Concern | Lines (approx.) | What it does |
|---|---|---|
| **A. Run-state fields + lifecycle flags** | 116–294 | `id`, `targets`, `options`, `started`, `done`, `paused`, `reversed`, `iteration`, `t`, `startTime`, `pausedTime`, `diagnostics`, `_waAnimations`, `waapiIneligibleReason`, `managed`, `unflatten`, `_ctorOptions`, playback-loop private fields (`resolvePromise`, `_playingPromise`, `_boundFrame`, `_interpOut`, `_stableKeys`), composition caches. |
| **B. Frame compiler delegation + options setters** | 295–571 | `constructor`, `templateFrames`/`parsedVars`/`frames`/`frameId` accessors, `addFrame`, `parse`, `adoptCompiled`, `computeStableKeys`, `computeHasComposition`, full option-setter surface (`setTimingFunction`…`setOptions`). |
| **C. Interpolation core (hot path)** | 573–867 | `reverse`, `fillForwards`, `fillBackwards`, `restPosition`, `paintRest`, `assertNoUnresolvedNamedSelector`, `at`, `interpFrames`, `clearBuffer`, `processFrame`, `applyComposition`. |
| **D. Playback transport delegates + Phase-2 target resolution** | 869–1173 | `onStart`/`onEnd`/`advanceTo` thin delegates → `engine-playback`, `_host` cast, `_frame`, `finished`, `play`/`pause`/`resume`/`toggle`/`stop`/`playing`/`effectiveT`/`settle`/`reset`, `setTargets`, `_resolveElementAwareValues`, `_buildElementAwareEnv`, `group`. |

`CSSKeyframesAnimation` (228L) adds CSS-specific concerns: `propertyRegistry`, `scrollOptions`, `bindTimeline`, `resolveTransform`, `fromVars`, `fromKeyframes`, `fromString`, `transform`.

---

## 2. Is the Q-Split Real or Cosmetic?

### 2a. The siblings do contain real logic

`engine-options.ts` (193L) and `engine-composition.ts` (221L) are genuine logic lifts: pure normalizer and compositing functions that no longer live in the class body. `engine-css-metadata.ts` (148L) similarly holds three focused helpers.

### 2b. But `engine-playback.ts` is a split that FAILED its goal

`engine-playback.ts` (484L) was explicitly described as lifting "the standalone-play lifecycle machine off the god-object." The ACTUAL result:

- Every function in `engine-playback.ts` is a free function that receives a `PlaybackHost<V>` value.
- `KeyframesAnimation` fields that are logically part of the play machine (`resolvePromise`, `_playingPromise`, `_boundFrame`, `_interpOut`, `_waAnimations`) remain declared as `private` on the class body (lines 218–237), not in any dedicated structure.
- `engine-playback.ts` reaches those private fields through the `PlaybackHost` interface, which re-declares them as public-to-the-interface. The class casts itself via `this as unknown as PlaybackHost<V>` (line 918) to satisfy the protocol.
- The result is a **privacy inversion**: fields that are genuinely private run-state are declared `private` on the class to prevent external access, then the `PlaybackHost` interface re-publishes them to the extracted module that was supposed to be the owner. This is a workaround, not a real ownership transfer.
- `engine-playback.ts` still has to cast back to `KeyframesAnimation` to call `playWAAPI` (lines 287, 378: `host as unknown as KeyframesAnimation<V>`), a cycle that proves the "host protocol" abstraction is incomplete.

### 2c. engine.ts is STILL 1420 lines

After four `engine-*.ts` satellites, the god-object still has:
- 59 member declarations (grepped from the class body)
- Five distinct concerns never separated: lifecycle state, compiler delegation, option setters, the interpolation hot-path, and the playback delegate shell
- `CSSKeyframesAnimation` (228L of the same file) which is an entirely distinct CSS-parsing subclass with its own fields and five public methods

### 2d. The flat sibling naming anti-pattern

The Q audit spawned: `engine-playback.ts`, `engine-composition.ts`, `engine-css-metadata.ts`, `engine-options.ts`, `group-soa.ts`, `group-layer-springs.ts`, `waapi-densify.ts`, `frame-compiler-numeric.ts`, `spring-duration.ts`, `spring-reseat.ts`. All remain flat in `src/animation/`. No sub-directory exists except `src/animation/internal/` (4 files). This is the exact "flat hyphenated sibling" anti-pattern flagged as a decomposition regression in the audit precepts.

---

## 3. Specific Findings

### F-1 · `engine.ts` god-module (1420L, two exported classes) — CRITICAL

**Location:** `src/animation/engine.ts` lines 115–1420  
**Category:** god-module / decomposition

`KeyframesAnimation` is 1058 lines of class body. `CSSKeyframesAnimation` adds 228 more in the SAME file. Five incoherent concerns coexist in one class. The Tranche Q "decomposition" extracted HELPERS into siblings but left the class body itself unchanged at 1420L.

**Proposal:** Dissolve into a `src/animation/engine/` directory with the structure below (§4).

---

### F-2 · `engine-playback.ts` privacy-inversion workaround — HIGH

**Location:** `src/animation/engine.ts` lines 218–237 (private fields) + `src/animation/engine-playback.ts` lines 50–100 (`PlaybackHost` re-publishes them) + line 918 (`this as unknown as PlaybackHost<V>` cast) + lines 287/378 (reverse cast back)

**Category:** workaround / encapsulation violation

The extraction of the playback machine into `engine-playback.ts` is structurally fictitious: the run-state it owns (`resolvePromise`, `_playingPromise`, `_boundFrame`, `_interpOut`, `_waAnimations`) lives on the class body as `private`, then is re-published through `PlaybackHost` to allow the extracted functions to write it. The `this as unknown as PlaybackHost<V>` cast at line 918 is the tell: a genuine structural separation would not need an `as unknown as` cast to thread `this` through its own protocol.

The reverse cast (`host as unknown as KeyframesAnimation<V>` at lines 287 and 378) in `engine-playback.ts` to call `playWAAPI` is a second violation — the extracted module reaches back through the abstraction to the concrete class.

**Proposal:** The play-machine state should be a dedicated `PlaybackState` struct (plain object or class) owned by the `engine/playback.ts` submodule, passed by reference from the animation. The class composes it (`this._playback = new PlaybackState()`), the playback functions operate on it natively. No cast needed; `_boundFrame` moves to the play-machine constructor.

---

### F-3 · `setDirection` duplicates `onStart` reversal logic — MEDIUM

**Location:** `src/animation/engine.ts` lines 486–501 vs. `src/animation/engine-playback.ts` lines 107–115

**Category:** dry / brittleness

`setDirection` re-implements the three-way direction → reversal test:
```ts
// engine.ts:490-498
this.reversed = false;
if (
    this.options.direction === "reverse" ||
    (this.options.direction === "alternate-reverse" && this.iteration % 2 === 0) ||
    (this.options.direction === "alternate" && this.iteration % 2 === 1)
) {
    this.reversed = true;
}
```

`engine-playback.ts` `onStart` (lines 107–115) has the SAME three-way test. Two copies, no shared utility. A future direction variant added to one will silently diverge from the other.

**Proposal:** Extract a single `shouldReverse(direction, iteration)` predicate (three lines) into `engine/playback.ts` and call it from both sites.

---

### F-4 · `CSSKeyframesAnimation` jammed into `engine.ts` — HIGH

**Location:** `src/animation/engine.ts` lines 1175–1402

**Category:** decomposition / god-module

`CSSKeyframesAnimation` is a distinct class (CSS-parsing entry-point subclass) that belongs in its own module. It imports nothing from the `engine.ts` file that could not be re-imported from a dedicated `engine/css-animation.ts`. Its fields (`propertyRegistry`, `scrollOptions`, `_boundTimeline`) and methods (`fromVars`, `fromKeyframes`, `fromString`, `bindTimeline`, `resolveTransform`, `transform`) are wholly CSS-specific. `fromString` alone (lines 1312–1397, 85L) is the most complex single method in the engine.

**Proposal:** Move `CSSKeyframesAnimation` to `src/animation/engine/css-animation.ts`. The base `KeyframesAnimation` goes to `src/animation/engine/animation.ts`. The `engine/index.ts` barrel re-exports both.

---

### F-5 · Re-export block at the bottom of `engine.ts` as a "bundling seam" — MEDIUM

**Location:** `src/animation/engine.ts` lines 1404–1420

**Category:** api-surface / encapsulation

`engine.ts` re-exports `AnimationGroup`, `getTimingFunction`, `resolveKeyframes`, `defaultOptions`, `defaultLayerConfig` — none of which are defined in this file. The comment says these are bundled here "so the dynamic boundary … hands consumers the whole value.js-bearing engine in one `import("./engine")`." This is a bundling convenience that conflicts with clean module boundaries. It makes `engine.ts` a de-facto barrel AND a class-definition module.

**Proposal:** After the `engine/` directory split, the `loadAnimationEngine()` import in `index.ts` can import from `engine/index.ts` (the engine barrel), which explicitly re-exports the sub-modules. The re-export block in `engine.ts` is excised; the `loadAnimationEngine` function in `load-engine.ts` imports directly from `engine/index.ts`.

---

### F-6 · `dispatchAnimationEvent` is `private` but required by `PlaybackHost` — MEDIUM

**Location:** `src/animation/engine.ts` line 277 (`private dispatchAnimationEvent`) vs. `src/animation/engine-playback.ts` line 98 (`dispatchAnimationEvent(type: string): void` in `PlaybackHost`)

**Category:** encapsulation / workaround

`dispatchAnimationEvent` is `private` on the class, which correctly prevents consumer code from dispatching lifecycle events. But `PlaybackHost` (in `engine-playback.ts`) declares it as part of the public protocol so that the extracted play functions can fire `animationstart`/`animationend`/`animationiteration`. The `this as unknown as PlaybackHost<V>` cast at line 918 bypasses the TypeScript `private` guard. The practical effect: a "private" method is callable by any code that can obtain the `PlaybackHost` cast, which any file in the module can do.

**Proposal:** In the proposed `engine/` directory structure, `dispatchAnimationEvent` moves to an `internal/events.ts` helper that the both the animation class and the playback module share directly. No `private`-then-cast pattern needed.

---

### F-7 · `_resolveElementAwareValues` + `_buildElementAwareEnv` (87L combined) in `engine.ts` — MEDIUM

**Location:** `src/animation/engine.ts` lines 1061–1168

**Category:** decomposition / god-module

These two private methods (87 lines) implement the Phase-2 element-aware CSS resolution pass triggered by `setTargets`. They import `makeResolveContext`, `resolveValues`, `hasPhase2Node`, `DROP`, `ValueArray`, `CustomFunctionDescriptor`, and `ResolveEnv` — a full resolution-engine dependency set. This logic coheres with `resolve-values.ts`, not with the interpolation or playback concerns of `engine.ts`. It is a second-pass resolver that happens to be called from `setTargets`.

**Proposal:** Extract to `src/animation/engine/element-resolve.ts` (`resolveElementAwareValues(animation, env)` free function). Call site in `setTargets` becomes a one-line delegate.

---

### F-8 · All `engine-*.ts` siblings are flat files, not a directory — HIGH

**Location:** `src/animation/engine.ts`, `engine-playback.ts`, `engine-composition.ts`, `engine-css-metadata.ts`, `engine-options.ts`

**Category:** decomposition / god-module

Five files with the `engine-` prefix share the same directory as 50 other unrelated animation files. There is no `src/animation/engine/` sub-directory. The `group-*.ts` cluster (group.ts, group-soa.ts, group-layer-springs.ts) has the same problem. The `spring-*.ts` cluster (spring.ts, spring-duration.ts, spring-reseat.ts) likewise.

**Proposal:** See §4 for the full directory structure.

---

### F-9 · `PlaybackHost` over-exposes internal fields as public interface members — MEDIUM

**Location:** `src/animation/engine-playback.ts` lines 50–100

**Category:** encapsulation / api-surface

`PlaybackHost` is declared `export interface`, meaning it leaks as part of the module's API. Consumers doing `import type { PlaybackHost } from "./engine-playback"` can see (and structurally satisfy) the full run-state surface including `resolvePromise`, `_playingPromise`, `_boundFrame`, `_interpOut`. These are internal implementation details of the playback machine. The interface should be `/* internal */` and unexported.

**Proposal:** After the directory restructure, `PlaybackHost` is an unexported internal type in `engine/playback.ts`. The class imports the type locally. No external consumer can satisfy it.

---

### F-10 · `nextId` module-level mutable state — LOW

**Location:** `src/animation/engine.ts` line 103: `let nextId = 0;`

**Category:** other (encapsulation risk)

Module-level mutable counter shared across all `KeyframesAnimation` instances. In SSR (concurrent renders on the same module), IDs from different request trees share the same counter, making IDs non-deterministic between requests. Affects `getAnimationId` and `debug` ergonomics.

**Proposal:** If SSR is in scope, replace with a `WeakRef`/Map keyed on the options object or use `crypto.randomUUID()` behind a feature-detect. If SSR is out of scope, document the constraint explicitly at the declaration site.

---

## 4. Proposed `src/animation/engine/` Directory

```
src/animation/engine/
  index.ts              ← barrel: re-exports classes + group + getTimingFunction + resolveKeyframes + constants
  animation.ts          ← KeyframesAnimation<V> base class (~500L: fields, compiler delegation, option setters, interpFrames hot-path)
  css-animation.ts      ← CSSKeyframesAnimation<V> subclass (~230L: fromString, fromVars, fromKeyframes, bindTimeline, propertyRegistry, scrollOptions)
  playback.ts           ← PlaybackState struct + all standalone-play free functions (currently in engine-playback.ts, ~484L, PLUS the run-state fields currently on the class)
  composition.ts        ← rename/move of engine-composition.ts (221L, no change in content)
  options.ts            ← rename/move of engine-options.ts (193L, no change in content)
  css-metadata.ts       ← rename/move of engine-css-metadata.ts (148L, no change in content)
  element-resolve.ts    ← extracted from engine.ts lines 1061–1168 + setTargets fast-path (~90L)
```

### Sizing estimate after split

| File | Estimated lines | Rationale |
|---|---|---|
| `animation.ts` | ~550 | KeyframesAnimation minus CSS-specific, Phase-2 resolver, playback delegates |
| `css-animation.ts` | ~250 | CSSKeyframesAnimation + CSS helpers |
| `playback.ts` | ~510 | Current engine-playback.ts PLUS PlaybackState struct absorbing the private run-state fields from the class |
| `composition.ts` | ~221 | Unchanged move |
| `options.ts` | ~193 | Unchanged move |
| `css-metadata.ts` | ~148 | Unchanged move |
| `element-resolve.ts` | ~90 | Extracted Phase-2 logic |
| `index.ts` | ~30 | Barrel |

No single file exceeds the 500-line threshold. The dynamic `loadAnimationEngine()` boundary is unaffected — it imports from `engine/index.ts` instead of `engine.ts`.

---

## 5. The `group-*.ts` and `spring-*.ts` Clusters (Out of Scope for This Lane)

The same flat-sibling anti-pattern appears in `group.ts` (924L) + `group-soa.ts` + `group-layer-springs.ts`, and `spring.ts` (685L) + `spring-duration.ts` + `spring-reseat.ts`. These are noted as structurally identical problems but are not the focus of this lane.

---

## 6. Summary Table

| # | Finding | Severity | Category | File(s) |
|---|---|---|---|---|
| F-1 | engine.ts god-module (1420L, 5 concerns, 2 classes) | critical | god-module / decomposition | engine.ts |
| F-2 | engine-playback.ts privacy-inversion / `as unknown as` cast workaround | high | workaround / encapsulation | engine.ts:218-237, 918; engine-playback.ts:50-100, 287, 378 |
| F-3 | `setDirection` duplicates `onStart` reversal logic | medium | dry / brittleness | engine.ts:490-498; engine-playback.ts:107-115 |
| F-4 | `CSSKeyframesAnimation` jammed into engine.ts | high | decomposition | engine.ts:1175-1402 |
| F-5 | Re-export bundling block makes engine.ts a barrel AND a class module | medium | api-surface | engine.ts:1404-1420 |
| F-6 | `dispatchAnimationEvent` private-but-required-by-PlaybackHost | medium | encapsulation / workaround | engine.ts:277; engine-playback.ts:98 |
| F-7 | Phase-2 resolver (_resolveElementAwareValues + _buildElementAwareEnv) in wrong module | medium | decomposition | engine.ts:1061-1168 |
| F-8 | All engine-* siblings are flat files, not a sub-directory | high | decomposition | src/animation/{engine,engine-*}.ts |
| F-9 | PlaybackHost over-exposes internal fields as exported interface | medium | encapsulation / api-surface | engine-playback.ts:50-100 |
| F-10 | Module-level `nextId` mutable counter (SSR risk) | low | other | engine.ts:103 |
