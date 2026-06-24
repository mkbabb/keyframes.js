# Tranche R Audit — lib-group lane
**Files:** `src/animation/group.ts` (924 L) · `src/animation/group-soa.ts` (254 L) · `src/animation/group-layer-springs.ts` (236 L)
**Total cluster:** 1,414 lines across 3 flat siblings

---

## 1. Is the SoA split a real seam or a perf-wave overfit?

`group-soa.ts` is a **real seam** in one narrow sense: `buildSoAPlans` + `groupSoABlendLayer` have zero dependency on the managed-child lifecycle, the scheduler-yield batching, or any rAF state. They are a **pure plan-build + fold pair** that compiles per-entry numeric layout at structural-change time and folds it each frame. They could live anywhere, including under a `group/` sub-directory.

However, the split has an **overfit characteristic**: `soaBlendLayer` is kept as a private instance method wrapper (group.ts:505–507) whose only purpose is to let `bench/group-composite.bench.ts` monkey-patch it via an `as any` cast (bench:103, bench:110). This is a test/bench artifact, not a design requirement. It means the `group-soa.ts` cohesion argument ("three pieces move whole") is partially undermined — the fold function actually lives in `group-soa.ts` but the *entry point* is glued back to the class as a private wrapper to satisfy bench hackery.

```ts
// group.ts:505-507 — wrapper kept ONLY for bench monkey-patch
private soaBlendLayer(plan: SoALayerPlan): void {
    groupSoABlendLayer(this._compositeBuf!, plan);
}
```

The bench reaches private state via `as any` casts: `group.soaBlendLayer`, `group.boxedBlendArm`, `group._grouped`, `group._soaPlans`, `group.getEntries()`. This is the **effusive-dynamicism anti-pattern** baked into production source shape to serve test infrastructure.

---

## 2. Cohesion audit per file

### 2a. `group.ts` (924 L) — over the 500-line ceiling

`group.ts` is the class definition. It contains:

1. **Entry cache + invalidation** (lines 207–227) — `getEntries()`, `invalidateEntries()`. These are simple dirty-flag wrappers; fine.
2. **Setup** (lines 229–251) — `setSuperKey`, `setTargets`. Two lines each; fine.
3. **Lifecycle hooks** (lines 253–262) — `onStart()`, `onEnd()`. Both are no-op stubs that set `this.started = true`. They exist as virtual-dispatch hooks yet nothing ever overrides them. They are effectively dead semantic surface — the only callers are internal (`advanceTo`, `_playReducedMotion`). No external overrider exists.
4. **Frame rendering** (lines 264–410) — `transformFramesGrouped`. The biggest single method (146 lines of body). Contains the SoA branch, the boxed-arm dispatch, the null-fill clear loop, the NOOP_TRANSFORM lazy resolve, and the compaction pass. **Legitimate density** — all manipulate the same `_grouped`/`_soaPlans`/`_compositeBuf` instance state that must stay together.
5. **`boxedBlendArm`** (lines 425–494) — a private 70-line method that duplicates the add/weighted path. See §3.
6. **`soaBlendLayer`** (lines 505–507) — a 3-line delegate kept for bench monkey-patch. See §1.
7. **Render / setChildTime** (lines 509–538) — fine.
8. **Playback loop** (lines 540–615) — `advanceTo`, `_endAdvance`, `_frame`, `_renderFrame`, `_resolvePlay`. These must stay together (they share `paused`, `done`, `lastTickTime`, `playback`).
9. **`play()` + `_playReducedMotion`** (lines 617–682) — fine.
10. **Managed-child lifecycle** (lines 684–800) — `pause`, `resume`, `toggle`, `settle`, `reset`, `stop`, `playing`, `forcePause`, `forcePlay`. All touch `started`/`paused`/`done` + call `playback.stop()`.
11. **Layer management API** (lines 802–833) — `setLayerConfig`, `setLayerEnabled`, `getLayerConfig`. Fine.
12. **Spring-driven blend weight** (lines 835–923) — `transitionLayer`, `crossfade`, `advanceLayerSprings`.

**Finding:** The file is at 924 lines primarily because `transformFramesGrouped` is 146 lines and `boxedBlendArm` is 70 lines. Moving into a `group/` sub-directory is the right shape — see §5.

### 2b. `group-layer-springs.ts` (236 L) — misnamed, heterogeneous

The file contains:
- `resolveEntryKey` + `requireEntry` — entry lookup utilities (lines 64–89)
- `seedLayerSpring` — spring construction (lines 108–119)
- `computeGroupedKeys` — a key-UNION fold (lines 131–143) — **NOT spring-related at all**
- `advanceSlice` + `advanceBatched` — scheduler-yield batching (lines 156–186) — **NOT spring-related at all**
- `renderMultiTarget` — multi-target render (lines 196–205) — **NOT spring-related at all**
- `snapChildrenToFinal` — reduced-motion snap (lines 214–223) — **NOT spring-related at all**
- `setChildrenPaused` — broadcast pause flag (lines 231–236) — **NOT spring-related at all**

Only 3 of 7 exported functions are spring-related. The other 4 were appended under the comment "Also colocated (the cohesive blocks lifted alongside to clear the base ceiling)" (group-layer-springs.ts:36). That comment is honest but it confirms the file is a **ceiling-clearance junk drawer**, not a cohesive unit. The name `group-layer-springs` does not describe `computeGroupedKeys`, `advanceSlice`, or `renderMultiTarget`.

### 2c. `group-soa.ts` (254 L) — genuinely cohesive

The file contains exactly three exports: `isNumericUnit` (the guard), `SoALayerPlan` (the type), `groupSoABlendLayer` (the fold), `buildSoAPlans` (the plan builder). All four are exclusively about the SoA transpose. This IS a real seam. The only criticism is that it lives flat in `src/animation/` instead of under `src/animation/group/`.

---

## 3. Per-frame allocation findings

### F1 — `boxedBlendArm` allocates `new Set(only)` per call on the residual path

**File:** `group.ts:432`

```ts
private boxedBlendArm(
    layer: AnimationLayerConfig,
    values: Record<string, unknown>,
    groupedValues: Record<string, unknown>,
    whitelist: Set<string> | undefined,
    only?: readonly string[],
): void {
    const onlySet = only ? new Set(only) : undefined;   // ← per-call Set allocation
```

`only` is `plan.boxedKeys` — a `string[]` built once per structural change and passed in per-frame when the residual is non-empty. The `new Set(only)` allocates a fresh Set every frame for every non-empty residual layer. The fix is trivial: either pass `plan.boxedKeys` as a `Set<string>` (built once inside `buildSoAPlans`) or use an index loop over the array directly (the `only` filter is just an existence check against a small static array — O(n·m) where n = residual keys and m = values keys, both small, and no Set needed).

### F2 — `advanceBatched` calls `entries.slice(i, i + batch)` per iteration

**File:** `group-layer-springs.ts:183`

```ts
await advanceSlice(entries.slice(i, i + batch), t);
```

Each iteration allocates a new sub-array. This is the rare >32-child path (the hot path never reaches here), so it is medium-severity, not critical. Fix: pass `entries`, `start`, `end` indices to `advanceSlice` instead of a pre-sliced array.

---

## 4. Layer-spring coupling issues

### C1 — `instanceof SpringProgress` narrows `WeightStepper` — punches through the interface

**File:** `group.ts:863`

```ts
const existing = layer.weightSpring;
if (existing instanceof SpringProgress) {
    existing.target = target.weight;   // concrete method not on WeightStepper
```

`AnimationLayerConfig.weightSpring` is typed as `WeightStepper` (constants.ts:332) — a narrow interface with `value`, `tickDt`, `settled`. The `target` setter is a `SpringProgress`-only method not on `WeightStepper`. The re-seat path silently no-ops for any non-`SpringProgress` stepper (the `else` branch seeds a NEW spring, discarding the in-flight generic stepper's velocity). Either:
(a) add `set target(v: number)` to `WeightStepper` and make all steppers support it, OR
(b) make `AnimationLayerConfig.weightSpring` typed as `SpringProgress` (or a subtype that includes `target`), since in practice only `SpringProgress` is ever parked there.

The current code is a **silent fallback**: a user who passes a custom `WeightStepper` via the `WeightStepper` interface and then calls `transitionLayer` again mid-flight will lose the in-flight velocity. This violates the "NO silent or graceful handling" precept.

### C2 — `advanceLayerSprings` is a private method on `AnimationGroup` despite all its deps being entry-iterable

**File:** `group.ts:906–923`

`advanceLayerSprings` iterates `getEntries()`, calls `spring.tickDt(dt)`, commits `layer.weight = spring.value`, and deletes `layer.weightSpring`. It has no state dependency that couldn't be passed in as arguments (entries + dt). The rationale for keeping it inline was "gate-anchored composite STATEMENTS" (group.ts:837), but the function accesses no `_grouped`/`_compositeBuf`/`_soaPlans` state — it only touches `entry.layer`. It should move to `group-layer-springs.ts` (or its successor) for symmetry with `seedLayerSpring`.

---

## 5. `forcePause` / `forcePlay` — undocumented API surface

**File:** `group.ts:793–801`

```ts
forcePause() {
    this.paused = true;
    setChildrenPaused(this.getEntries(), true);
}

forcePlay() {
    this.paused = false;
    setChildrenPaused(this.getEntries(), false);
}
```

These methods are not in the published type surface (`dist/keyframes.d.ts` must be checked), have no JSDoc, no lifecycle bookkeeping (`onStart`/`onEnd` not called, `playback.stop()` not called for `forcePause`, rAF loop not restarted for `forcePlay`). They are used only in a test (`test/group.test.ts:209–221`). They appear to be test-scaffolding hooks that leaked onto the public class. The test that exercises them tests correct state propagation but nothing that a `pause()`/`resume()` pair wouldn't also test. **These should be excised; the tests should use the real lifecycle methods.**

---

## 6. `onStart` / `onEnd` are hollow no-op stubs

**File:** `group.ts:255–262`

```ts
onStart() {
    this.started = true;
    return this;
}

onEnd() {
    return this;
}
```

`onEnd()` is a pure no-op. `onStart()` sets `this.started = true` but the single caller (`advanceTo`, line 557) already guards `if (!this.started) this.onStart()` — so `this.started` is only ever written from here. These methods exist as overrideable hooks but nothing overrides them. Compared to `engine.ts`'s `onStart`/`onEnd` (which delegate to `engine-playback.ts`'s real machinery), the group variants are vestigial stubs. Inline the `started` assignment into `advanceTo` and `_playReducedMotion` directly and delete the hooks.

---

## 7. `render()` fallback — `this.lastTickTime || performance.now()`

**File:** `group.ts:517`

```ts
render(): void {
    const now = this.lastTickTime || performance.now();
```

This is a silent fallback: if called on a never-started group, `performance.now()` is substituted as the time argument. `transformFramesGrouped(t)` uses `t` only to pass to `this.transform(groupedValues, t)`, so the actual numeric value of `t` at `render()` time is irrelevant (it is only meaningful within the rAF loop). The `|| performance.now()` is a defensive guard that silences the "not started yet" case. Per precepts: either document this as intentional (the `t` argument to `transform` is non-normative for pure CSS transforms) or fail explicitly when called before `play()`. The same pattern appears at lines 670 and 702.

---

## 8. `transformFramesGrouped` is a public method that mutates internal state directly

**File:** `group.ts:274`

`transformFramesGrouped(t)` is called from `demo/scenePlaybackAdapters.ts:130`:

```ts
group.paused = true;
group.transformFramesGrouped(now);
```

This is a **demo consumer reaching into group internals** to force a single-frame paint. The correct public API is `render()`, which already dispatches to `transformFramesGrouped` for single-target groups. The demo bypasses `render()` for unclear reasons (perhaps to avoid `lastTickTime || performance.now()` producing a stale time). `transformFramesGrouped` should be private or `protected`; `render()` should accept an optional `t` argument.

---

## 9. Structural proposal — `src/animation/group/` directory

The three flat hyphenated siblings are the correct decomposition units but need to be housed in a proper sub-directory (the `src/animation/internal/` precedent). The proposed layout:

```
src/animation/group/
├── index.ts               ← the public surface (re-exports AnimationGroup, AnimationGroupEntry, AnimationGroupInput, LayerTransitionSpring)
├── group.ts               ← the AnimationGroup class (reduced: no forcePause/forcePlay, no onStart/onEnd stubs; transformFramesGrouped demoted private)
├── soa.ts                 ← rename of group-soa.ts (isNumericUnit, SoALayerPlan, buildSoAPlans, groupSoABlendLayer)
├── entries.ts             ← extracting from group-layer-springs.ts: resolveEntryKey, requireEntry, computeGroupedKeys, renderMultiTarget, snapChildrenToFinal, setChildrenPaused
└── scheduler.ts           ← advanceSlice, advanceBatched (rename from the spring file; the INP-yield logic)
```

`group-layer-springs.ts` becomes:
```
src/animation/group/springs.ts  ← seedLayerSpring, LayerTransitionSpring, advanceLayerSprings (moved from group.ts)
```

`engine.ts` currently imports `AnimationGroup` directly from `./group`; after the move it imports from `./group/index`. No public API surface changes.

---

## 10. DRY — `boxedBlendArm` duplicates the element loop twice

**File:** `group.ts:425–494`

The `add` and `weighted` arms in `boxedBlendArm` are structurally identical loops differentiated only by the inner op (`+=` vs `lerp`). The `w` hoist for `weighted` is the only real distinction. Both could be collapsed into a single loop with a per-call op function — or more cleanly, since this code already has a SoA fast path, the boxed arm should be a minimal fallback with a comment that it only runs for non-numeric residuals. The current 70-line body is a maintenance hazard.

---

## Summary table

| Finding | File:Line | Category | Severity |
|---|---|---|---|
| `new Set(only)` per frame in residual path | group.ts:432 | per-frame alloc | high |
| `entries.slice` per batch iteration | group-layer-springs.ts:183 | per-frame alloc | medium |
| `instanceof SpringProgress` punches through `WeightStepper` interface | group.ts:863 | brittleness | high |
| `forcePause`/`forcePlay` are test-scaffold leaks on public API | group.ts:793-801 | api-surface | medium |
| `onStart`/`onEnd` hollow stubs — dead semantic surface | group.ts:255-262 | dead-code | low |
| `render()` / `lastTickTime \|\|` silent time fallback | group.ts:517,670,702 | fallback | medium |
| `transformFramesGrouped` is public but should be private | group.ts:274 | encapsulation | medium |
| `group-layer-springs.ts` is a misnamed junk drawer (4/7 exports unrelated to springs) | group-layer-springs.ts | decomposition | high |
| `soaBlendLayer` private wrapper kept for bench monkey-patch | group.ts:505 | effusive-dynamicism | medium |
| `boxedBlendArm` add/weighted dual-loop — DRY violation | group.ts:425-494 | dry | low |
| `advanceLayerSprings` private but fully entry-iterable — should move to springs.ts | group.ts:906 | encapsulation | low |
| Flat hyphenated siblings instead of `group/` sub-directory | group*.ts | decomposition | high |
