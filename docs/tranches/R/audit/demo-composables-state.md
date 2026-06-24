# Tranche R Audit — Lane: demo-composables-state

**Focus:** `demo/**/use*.ts` composables and stores  
**Auditor:** Tranche R (2026-06-24)

---

## Scope Inventory

| File | Lines | Exceeds 500L |
|---|---|---|
| `demo/easing/useEasingDemo.ts` | 511 | YES |
| `demo/spring/useSpringDemo.ts` | 499 | NO (border) |
| `demo/sequence/useSequenceDemo.ts` | 499 | NO (border) |
| `demo/square/useSquareAnimations.ts` | 384 | — |
| `demo/@/components/custom/animation-controls/stores/useSceneMachine.ts` | 331 | — |
| `demo/@/components/custom/animation-controls/stores/sceneMachine.ts` | 244 | — |
| `demo/@/components/custom/animation-controls/stores/scenePlaybackAdapters.ts` | 198 | — |
| `demo/@/components/custom/animation-controls/stores/animationOptionsStore.ts` | 120 | — |
| `demo/@/components/custom/animation-controls/stores/controlOptionsStore.ts` | 74 | — |

Sub-composable satellites (already split off):  
`useSpringHotPath.ts` (163L), `useSpringDerby.ts` (115L), `useEasingGallery.ts` (60L), `useEasingGhost.ts` (44L), `useEasingTraceSmear.ts` (57L), `useSpringKeyframesEditor.ts` (76L), `useSequenceInstrument.ts` (45L), `useRafScene.ts` (122L)

---

## Finding 1 — useEasingDemo.ts is 511L and breaches the 500L ceiling

**File:** `demo/easing/useEasingDemo.ts`  
**Line:** 1–511

`useEasingDemo` is 511 lines and is the only composable in the lane that strictly exceeds 500L. The split pattern already exists (gallery, ghost, trace-smear are their own files), but two cohesive sub-concerns remain embedded:

**Sub-concern A — the `parseCSSValue` parser (L341–L387, 47L):**  
An inline hand-rolled CSS `cubic-bezier(…)` and `steps(…)` parser using raw regex. This is parsing logic, not sweep/animation logic. It is a standalone, testable unit that should live in `demo/easing/easingParsing.ts` (or merge into `useEasingGallery.ts` since it only serves the easing composable). The function closes over `captureGhost`, `currentEasingName`, `bezierControlPoints`, `stepOptions`, `svgPath`, `timingFunctionsAnd` — all passed as parameters if extracted.

**Sub-concern B — the `contractAnim` / `animationGroup` boilerplate (L400–L456, ~56L):**  
This is the "dummy transport host" segment that appears nearly verbatim in all three rAF-scene composables (see Finding 2). If extracted into a shared `useContractAnimGroup` helper, the per-scene code drops to 2–3 lines.

**Proposal:** Extract `parseCSSValue` + related helpers into `demo/easing/easingParsing.ts`. Extract the shared transport-host boilerplate into `demo/app/useContractAnimGroup.ts`. After both extractions `useEasingDemo` returns to sub-500L.

---

## Finding 2 — Three-way DRY violation: contractAnim/animationGroup boilerplate copied verbatim

**Files:**  
- `demo/easing/useEasingDemo.ts:400–456`  
- `demo/spring/useSpringDemo.ts:391–432`  
- `demo/sequence/useSequenceDemo.ts:158–193`

All three rAF-scene composables contain the identical six-step "dummy transport host" recipe:

```ts
// Pattern repeated in all three (slight parameter differences only)
const contractAnim = markRaw(
    new CSSKeyframesAnimation({
        duration: ...,
        iterationCount: "infinite",
        direction: "alternate",
        timingFunction: ...,
    }).fromVars([{ opacity: 0 }, { opacity: 1 }]),
);
contractAnim.name = "... Preview";
contractAnim.superKey = "...";
const animationGroup = markRaw(new AnimationGroup(contractAnim));
animationGroup.started = true;
animationGroup.paused = false; // or true
watch(isPlaying, (playing) => { animationGroup.paused = !playing; }, { immediate: true });
```

The only variations are: `duration`, `timingFunction`, `name`, `superKey`, and initial `paused` value. The long comment ("DOCUMENTED EXPECTATION, WV-W1 lane escape hatch…") is also copy-pasted three times.

**Proposal:** Extract into `demo/app/useContractAnimGroup(opts: { duration, timingFunction, name, superKey, isPlaying, startPaused? })`. Each scene composable becomes:

```ts
const { contractAnim, animationGroup } = useContractAnimGroup({
    duration: duration.value,
    timingFunction: cssValue.value,
    name: "Easing Preview",
    superKey: "Easing",
    isPlaying,
});
```

The comment lives once in the helper.

---

## Finding 3 — Three-way DRY violation: play/pause/togglePlay triad copied verbatim

**Files:**  
- `demo/easing/useEasingDemo.ts:268–279`  
- `demo/spring/useSpringDemo.ts:335–346`  
- `demo/sequence/useSequenceDemo.ts:270–286`

The `play` / `pause` / `togglePlay` functions are byte-for-byte identical across all three (sequence has a trivial `resume = () => play()` alias):

```ts
const play = () => {
    if (isPlaying.value) return;
    machine.dispatch({ type: "PLAY" });
};
const pause = () => {
    if (!isPlaying.value) return;
    machine.dispatch({ type: "PAUSE" });
};
const togglePlay = () => {
    if (isPlaying.value) pause();
    else play();
};
```

**Proposal:** Export a shared factory from the machine store barrel:

```ts
// In stores/index.ts or a new useSceneTransport.ts
export function useSceneTransport(machine: ReturnType<typeof useSceneMachine>) {
    const isPlaying = computed(() => machine.status.value === "playing");
    const play = () => { if (!isPlaying.value) machine.dispatch({ type: "PLAY" }); };
    const pause = () => { if (isPlaying.value) machine.dispatch({ type: "PAUSE" }); };
    const togglePlay = () => isPlaying.value ? pause() : play();
    return { isPlaying, play, pause, togglePlay };
}
```

Each scene composable then calls `useSceneTransport(machine)` and destructures.

---

## Finding 4 — PROGRESS_READOUT_HZ constant duplicated with identical value

**Files:**  
- `demo/easing/useEasingDemo.ts:181`  
- `demo/spring/useSpringHotPath.ts:46`

```ts
// demo/easing/useEasingDemo.ts:181
const PROGRESS_READOUT_HZ = 6; // reactive readout cadence (a few Hz, not 60)

// demo/spring/useSpringHotPath.ts:46
const PROGRESS_READOUT_HZ = 6; // reactive readout cadence (a few Hz, not 60)
```

Same value, same comment, two different local `const` declarations. If either scene author adjusts the cadence, the other silently drifts.

**Proposal:** Export `export const PROGRESS_READOUT_HZ = 6;` from a shared location — either `demo/app/useRafScene.ts` (the rAF scene recipe) or a new `demo/app/rafConstants.ts`. Both composables import it.

---

## Finding 5 — Dead field: `animationState` in `StoredAnimationOptions` — never read outside its definition

**File:** `demo/@/components/custom/animation-controls/stores/animationOptionsStore.ts:9–14`

```ts
export type StoredAnimationOptions = {
    animationOptions: InputAnimationOptions;
    animationState: {        // ← declared here
        t: number;
        startTime: number;
        pauseTime: number;
        paused: boolean;
    };
    stepOptions: { ... };
    cubicBezierOptions: { ... };
};
```

A comprehensive grep confirms `animationState` is **never accessed by any file in the entire demo tree** — there is no `storedAnimationOptions.animationState`, no `.pauseTime`, no `.startTime` read in any `.ts` or `.vue` file outside the store definition itself. This field is dead state from a pre-machine-era playback snapshot (the machine replaced it at H.W1). It now participates in every `structuredClone(defaultStoredAnimationOptions)` call at line 96 (persisting unnecessary bytes to localStorage) and bloats the type.

**Proposal:** Delete the `animationState` field from `StoredAnimationOptions`, remove it from `defaultStoredAnimationOptions`. The machine's `PlaybackSnapshot` owns playback state now; there is no restoration path for this field.

---

## Finding 6 — `matrixOptions` type in `controlOptionsStore` is under-typed relative to actual use

**File:** `demo/@/components/custom/animation-controls/stores/controlOptionsStore.ts:21`

```ts
matrixOptions?: { fixed: boolean };
```

`MatrixEditor.vue` accesses `storedControls.matrixOptions.selectedMatrixCell` on every cell render, but `selectedMatrixCell` is not in the type. The actual `defaultMatrixOptions` at `MatrixEditor.vue:126–130` is `{ fixed: false, selectedMatrixCell: 0 }`. The type omits `selectedMatrixCell`, so every write/read is an implicit `any` property access (TypeScript does not error because the type is widened at the `??=` assignment site).

**Proposal:** Widen `matrixOptions` to include `selectedMatrixCell: number`:

```ts
matrixOptions?: { fixed: boolean; selectedMatrixCell: number };
```

Move `defaultMatrixOptions` out of `MatrixEditor.vue` into `controlOptionsStore.ts` (it is store initialization data, not component data). This collocates the default with its type, eliminates the `??=` runtime mutation anti-pattern, and gives TypeScript full coverage of `matrixOptions` field access.

---

## Finding 7 — `storedControls: any` in useAnimationGroupPlayback (recorded BOOK, not excised)

**File:** `demo/@/components/custom/animation-controls/composables/useAnimationGroupPlayback.ts:16`

```ts
export function useAnimationGroupPlayback(
    getAnimationGroup: () => AnimationGroup<any>,
    storedControls: any,   // ← explicit `any`, noted as "stays a recorded BOOK"
    emit: AnimationGroupPlaybackEmit,
)
```

The comment acknowledges this is a deliberate deferral ("the DS-5 emit half. The `storedControls: any` half stays a recorded BOOK"). However, the precepts require NO silent/graceful handling and no `: any`. `StoredAnimationGroupControlOptions` is the correct type and is imported in adjacent files. The `any` allows callers to accidentally pass wrong types.

**Proposal:** Replace `storedControls: any` with `storedControls: StoredAnimationGroupControlOptions`. The import of that type is already present in the adjacent `stores` import.

---

## Finding 8 — `useSequenceDemo` bypasses `useRafScene` and hand-wires the rAF contract directly

**File:** `demo/sequence/useSequenceDemo.ts:425–459`

`useRafScene` was introduced (I.W1 S2) as "THE raw-rAF scene recipe, consolidated" to prevent the binding mistake (unbound `playback.stop`) from recurring. `useEasingDemo` and `useSpringDemo` both delegate to `useRafScene`. However, `useSequenceDemo` calls `createRafAdapter` directly and wires `useSceneVisibilityPause` manually — bypassing the recipe:

```ts
// useSequenceDemo.ts:431 — direct createRafAdapter, bypassing useRafScene
const scenePlayback: ScenePlayback = createRafAdapter({
    getProgress: ...,
    setProgress: ...,
    getPlaying: ...,
    setPlaying: () => {},
    isLoopRunning: () => mirror.running,
    stopLoop,
    startLoop,
});

useSceneVisibilityPause(   // wired manually, not via useRafScene
    () => mirror.running,
    stopLoop,
    startLoop,
);
```

The justification is that the Sequence has its OWN `RAFPlayback` (the `sequence` object's internal loop) and a SEPARATE `mirror` RAFPlayback for reactive progress readout. `useRafScene` owns exactly one `RAFPlayback`, so the dual-loop architecture genuinely cannot map to it. However:

1. The `useSceneVisibilityPause` wiring is still hand-rolled with manually named callbacks — the same structural risk `useRafScene` was designed to eliminate.
2. There is no `onScopeDispose(stopMirror)` for the mirror playback — the scope dispose at L464 stops `mirror` and `sequence` manually, which is correct, but it is not the `onScopeDispose(stopLoop)` that `useRafScene` owns structurally.

**Proposal:** Extend `useRafScene` to accept an optional `externalLoop?: { running: () => boolean; stop: () => void; start: () => void }` override (or create a `useRafSceneComplex` variant). This keeps the contract-wiring + visibility-pause in one auditable place even for scenes with dual loops. Short-term: at minimum add a comment pointing to the divergence so the next author knows why the bypass exists (currently there is no such comment).

---

## Finding 9 — `cubeTransformStore.ts` uses a module-level bare `ref` instead of `createGlobalState`

**File:** `demo/app/cubeTransformStore.ts:9`

```ts
// NOT createGlobalState — a plain module-level ref
export const sharedCubeTransform = ref<TransformState>({ ... });
```

Every other persistent/shared reactive state in the demo uses `createGlobalState` (optionally `useStorage`). A module-level bare `ref` is a global singleton but is invisible to the `createGlobalState` hot-reload boundary — during Vite HMR the module re-evaluates and the `ref` resets. The `createGlobalState` pattern survives HMR because Vite's accept hook keeps the reactive closure alive.

**Proposal:** Wrap in `createGlobalState`:

```ts
export const useCubeTransform = createGlobalState(() =>
    ref<TransformState>({ rotate: ..., translate: ..., scale: ..., matrix: mat4.create() })
);
```

---

## Finding 10 — Module-level mutable singleton `_timingFunctionsAnd` in useEasingDemo

**File:** `demo/easing/useEasingDemo.ts:30–42`

```ts
let _timingFunctionsAnd: Record<string, any> | undefined;

export function getTimingFunctionsAnd(): Record<string, any> {
    if (!_timingFunctionsAnd) {
        _timingFunctionsAnd = Object.fromEntries(...)
    }
    return _timingFunctionsAnd;
}
```

A mutable module-level `let` used as a lazy singleton. This is a manual memoization of a pure derivation from `value.js`'s `timingFunctions`. The `any` return type erases all key/value type information.

**Proposal:** Replace with a module-level `const` computed once at import time (it is a synchronous pure transformation of a static import, no side-effects):

```ts
const timingFunctionsAnd: Record<string, TimingFunction | string> = Object.fromEntries(
    Object.entries({ "cubic-bezier": "cubic-bezier", ...timingFunctions })
        .map(([k, v]) => [camelCaseToHyphen(k), v]),
);
export { timingFunctionsAnd };
```

The `let` + guarded-init pattern is a legacy workaround for an async-init concern that does not exist here (the import is synchronous). The `any` return type should be replaced with the correct `Record<string, TimingFunction | string>`.

---

## Finding 11 — `useSequenceDemo` is 499L and sits at the hard ceiling — comment overhead is heavy

**File:** `demo/sequence/useSequenceDemo.ts`

At 499L the file narrowly avoids the 500L flag, but approximately 90 lines (18%) are block-comment documentation repeating "H.W1 — the SHADOW playback authority DELETED" and similar mandate archaeology from prior tranches. These comments are audit artifacts, not living documentation. The reelOvershoot egg (L391–L422, 32L) could be extracted to a `useSequenceReel.ts` satellite matching the pattern of `useSpringDerby` and `useEasingGallery`.

**Proposal:** Extract the reel (L391–L422 + its constants `REEL_STAGGER`, `reelOvershoot`) into `demo/sequence/useSequenceReel.ts`. Trim the mandate-archaeology comments to one concise citation each. The file returns to ~430L.

---

## Pattern Summary

### What works well (no action needed)

1. **`createGlobalState` + `useStorage` for all stores** — consistent across `animationOptionsStore`, `controlOptionsStore`, `useSceneMachine`. No Pinia drift. The 7-day TTL pattern is applied uniformly.
2. **`provide`/`inject` for scene-level demo context** — `EASING_DEMO_KEY`, `SPRING_DEMO_KEY`, `SEQUENCE_DEMO_KEY`, `MOTION_PATH_DEMO_KEY` are typed `InjectionKey<ReturnType<typeof useFoo>>` and provided at the scene root. Idiomatic, no prop-drilling.
3. **`markRaw` discipline** — engine objects (`AnimationGroup`, `RAFPlayback`, `SpringProgress`) are consistently `markRaw`d; reactive bridges use `ref`/`watch` at the composable seam. No reactive wrap of mutable engine internals.
4. **Scene machine is a clean pure reducer + effect shell** — `sceneMachine.ts` (pure) + `useSceneMachine.ts` (effect) are well separated. The mutation boundary (`dispatch` + readonly refs only) holds.
5. **Sub-composable extraction is partially done** — `useSpringHotPath`, `useSpringDerby`, `useEasingGallery`, `useRafScene`, etc. correctly colocate sub-concerns.

### What needs fixing

| # | Severity | Category | Description |
|---|---|---|---|
| 1 | medium | decomposition | `useEasingDemo` 511L — extract `parseCSSValue` + contractAnim boilerplate |
| 2 | high | dry | contractAnim/animationGroup boilerplate triplicated (easing/spring/sequence) |
| 3 | high | dry | `play`/`pause`/`togglePlay` triad triplicated byte-for-byte |
| 4 | low | dry | `PROGRESS_READOUT_HZ = 6` duplicated with identical value |
| 5 | high | dead-code | `animationState` field in `StoredAnimationOptions` — never read anywhere |
| 6 | medium | brittleness | `matrixOptions` type missing `selectedMatrixCell` — silent `any` field access |
| 7 | medium | legacy | `storedControls: any` in `useAnimationGroupPlayback` — recorded "book", never excised |
| 8 | medium | encapsulation | `useSequenceDemo` bypasses `useRafScene` — hand-wires `createRafAdapter` + `useSceneVisibilityPause` directly |
| 9 | low | workaround | `cubeTransformStore` uses bare module-level `ref` instead of `createGlobalState` |
| 10 | medium | legacy | `_timingFunctionsAnd` mutable module-level singleton + `any` type erasure |
| 11 | low | decomposition | `useSequenceDemo` 499L — reel egg extractable, comment archaeology trimmable |
