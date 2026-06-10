# Tranche J Audit — Demo Scenes Lane

**Branch:** `tranche-i-dev` (master tip `8a40cf4` + tranche-i-dev post-close)
**Date:** 2026-06-09
**Scope:** `demo/{cube,amiga,square,easing,spring,sequence,motion-path,playground,app}` and related shared components

---

## 1. Scene inventory

Live scene set (scenes.ts): cube · amiga · square · easing · spring · sequence · motion-path (7 scenes).
Playground is a **separate Vite app** (`dev:playground`), not a scene in the SPA.

```
demo/
  @/               shared library
  app/             single-page app (root: ./demo/app/)
    scenes/        AmigaScene.vue, CubeScene.vue, EasingScene.vue, SpringScene.vue,
                   SquareScene.vue, SequenceScene.vue, MotionPathScene.vue
  cube/            scene module (no standalone index.html)
  amiga/           scene module
  square/          scene module
  easing/          scene module
  spring/          scene module
  sequence/        scene module
  motion-path/     scene module
  playground/      separate Vite app (dev-only, not deployed)
```

---

## 2. Size ceilings (proof:demo-no-oversize)

```
$ node scripts/proof-demo-no-oversize.mjs
  ✓ [ceiling] all 168 demo .vue/.ts files ≤ 500L
    (max demo/@/components/custom/animation-controls/components/ControlsPaneWrapper.vue @ 491L)
  ✓ [colocate] all 4 use*Demo composables colocate with a sibling *Target.vue
  ✓ [colocate] all 4 stage-scene dirs colocate *Target.vue + use*Demo.ts + *Keys.ts
proof:demo-no-oversize — PASS
```

Files within 10L of the 500L ceiling:

| File | Lines |
|---|---|
| `demo/@/components/custom/animation-controls/components/ControlsPaneWrapper.vue` | 491 |
| `demo/@/components/custom/animation-controls/AnimationControlsGroup.vue` | 488 |
| `demo/sequence/useSequenceDemo.ts` | 485 |
| `demo/easing/useEasingDemo.ts` | 474 |
| `demo/spring/useSpringDemo.ts` | 443 |

None exceed 500L today. Any J-wave that enriches sequence/easing/spring demo composables or AnimationControlsGroup risks the ceiling.

---

## 3. Post-I residue

### 3a. Hand-rolled rAF (outside useRafScene)

`demo/app/scenes/AmigaScene.vue:183–201` — raw `requestAnimationFrame` / `cancelAnimationFrame`.

**VERDICT: JUSTIFIED.** This is the Three.js WebGL present loop, not a progress-animation rAF. It is architecturally different from `useRafScene` (which owns a progress-based rAF); the Amiga scene is a 3D viewport with no "animation progress" concept. The loop is properly managed: started `onMounted`, guarded idempotent (`if (rafId != null) return`), stopped by `cancelAnimationFrame`, paused by `useSceneVisibilityPause` (tab visibility), and paused by `useIntersectionObserver` (occlusion). No `useRafScene` misuse.

`demo/@/components/custom/CopyButton.vue:87` and `demo/@/components/custom/matrix-editor/useTransformState.ts:205` — one-shot deferred rAF callbacks (microbatch / "next-frame" pattern). **JUSTIFIED.** Neither is a recurring loop.

### 3b. Hand-rolled drag outside useDragScrub

`demo/amiga/useSphereSpin.ts` — uses `useEventListener` (vueuse) for pointer drag on the Three.js canvas. **JUSTIFIED.** This is a 3D sphere spin with raycast hit-test, not a progress-scrub gesture. `useDragScrub` is the animation-progress scrub seam; sphere spin is a different interaction surface (disjoint gesture landlords by hit-test). The implementation uses `useEventListener` (not raw `addEventListener`), so VueUse owns lifecycle cleanup.

`demo/@/components/custom/asset-manager/AssetViewport.vue` — uses `useDragCapture` for asset move and handle resize/rotate. **JUSTIFIED.** `useDragCapture` is the CONTROL-SURFACE drag seam (bezier handles, timeline diamonds, asset resize); `useDragScrub` is the PROGRESS-SCRUB seam. Semantically correct separation.

### 3c. Reactive ref writes per rAF frame

**Easing scene** — FIXED (I.W4 D4). The sweep dot positions are written via direct `element.style.transform` (non-reactive). Reactive `progress.value` written at ≤6Hz (PROGRESS_READOUT_HZ). No per-frame reactive storm.
Evidence: `demo/easing/useEasingDemo.ts:194–216`.

**Spring scene** — NOT fixed. `demo/spring/useSpringDemo.ts:175–193` writes **17 reactive refs per frame**:
- `liveValue.value`, `liveVelocity.value`, `liveSettled.value` (3 refs)
- 4 SPRING_PRESETS tracks × 3 refs (`value.value`, `velocity.value`, `settled.value`) = 12 refs
- `progress.value`, `sampled.value` (2 refs)

These feed the SpringTarget template (ball position `:style="{ left: calc(...) }"`), the SpringSidebar preset track balls (4 × `:style` binding), and the readout text. This is NOT as severe as the pre-D4 easing storm (243-node SVG re-render per frame), but it is unaddressed reactive-per-frame writes with no measured ceiling.

`proof:perf-frame-budget` only measures the easing scene (D4 fix validation) and dock expand (D3). The spring scene's reactive-per-frame load is **ungated**.

**Sequence scene** — ACCEPTABLE. Uses a mirror `RAFPlayback` that writes only `progress.value` (1 ref/frame).
Evidence: `demo/sequence/useSequenceDemo.ts:202–210`.

**Motion-path scene** — CLEAN. Reactive writes in useMotionPathDemo.ts are on user events only.

---

## 4. Scene descriptor conformance

### Icons

All 7 scenes have icon fields in `scenes.ts:97,104,111,118,125,136,150`.
All 7 icon SVG files exist at `assets/icons/{cube,amiga,square,easing,spring,sequence,motion-path}.svg`.

```
$ node scripts/proof-icon-idiom.mjs
  ✓ all 4 icon sizes resolve ... 61 refs covered
proof:icon-idiom — PASS
```

```
$ node scripts/proof-easter-egg.mjs (static half)
  ✓ [sequence] EE-SEQ-1 "the reel"
  ✓ [motion-path] EE-MP-2 "the wink"
  ✓ [cube] "the Roll"
  ✓ [amiga] "the Boing"
  ✓ [square] "the Tumble"
  ✓ [spring] "the Derby"
  ✓ [easing] "the Gallery"
proof:easter-egg — PASS (static)
```

All 7 scenes have one easter egg each. The browser half is skipped (no Playwright).

### Scene descriptor structure

`scenes.ts` is structurally sound: `id`, `label`, `superKey`, `icon`, `component` (via `lazyScene`) for all 7. `stageMode` correctly classifies cube/amiga/square as `subject`, easing as `editor`, spring/sequence/motion-path as `storyboard`. `warmScene` chunk-prefetch via hover wired correctly.

---

## 5. Orphaned / dead scenes

**Ghost directories — removed at commit `e073dac`, CLAUDE.md NOT updated:**

Four demo apps removed at `e073dac` ("idiomatic glass-ui adoption + dead-code purge + playground completion"):
- `demo/simple/` (Vue, single CSSKeyframesAnimation + controls)
- `demo/balls/` (Vanilla TS, parseCSSKeyframes + CSS custom properties)
- `demo/boxes/` (Vanilla TS, matrix3d transforms)
- `demo/bench/` (Vanilla TS, FPS benchmarks)

Neither `CLAUDE.md` was updated:

```
CLAUDE.md:55: ├── simple/
CLAUDE.md:59-61: ├── balls/ ├── boxes/ └── bench/
CLAUDE.md:122-128: table rows for simple, balls, boxes, bench

demo/CLAUDE.md:39: ├── simple/
demo/CLAUDE.md:43-45: ├── balls/ ├── boxes/ └── bench/
demo/CLAUDE.md:122,126-128: table rows for simple, balls, boxes, bench
```

Additionally, `demo/CLAUDE.md:3` states "each subdirectory is a standalone Vite app with its own `index.html`" — **false**. Only `demo/app/` and `demo/playground/` have `index.html`. Scene modules (`cube/`, `easing/`, etc.) are colocated SFC/TS modules, not standalone Vite apps.

`demo/CLAUDE.md:3` states "The `cube/` demo is the default for `npm run dev` and `npm run gh-pages`" — **stale**. `npm run dev` now roots at `./demo/app/` (the full 7-scene SPA). The cube is one scene, not the root.

Additionally, `demo/CLAUDE.md` does not mention `demo/app/`, `demo/app/scenes/`, `demo/sequence/`, or `demo/motion-path/` anywhere in its structure table.

**Playground status:**

`demo/playground/` is a **dev-only separate Vite app** (`npm run dev:playground`). It is:
- Not in `scenes.ts` (not a SPA scene)
- Not built by `npm run gh-pages`
- Not deployed to keyframes.babb.dev
- Not covered by CI gate scripts
- Has no scene machine integration (no `SCENE_READY`, no `scenePlayback`)
- Uses `EditorShell` + `AnimationGroup` directly but no progress tracking

This is an UNDEPLOYED orphan. Its `demo/playground/dist/` is gitignored local build output.

---

## 6. Props destructuring precept violations

Six `const { ... } = defineProps<{...}>()` destructurings found in shared `animation-controls` components:

| File | Line | Props destructured |
|---|---|---|
| `demo/@/components/custom/animation-controls/AnimationMenuBar.vue` | 200 | `storedControls, isPlaying, isStarted, animationProgress, animationNames` |
| `demo/@/components/custom/animation-controls/AnimationControlsGroup.vue` | 161 | `superKey, animationGroup, autoPlay, hideControls, stageMode` |
| `demo/@/components/custom/animation-controls/controls/PlaybackRibbon.vue` | 86 | `animation` |
| `demo/@/components/custom/animation-controls/controls/AnimationControls.vue` | 167 | `animation, isPlaying: isPlayingProp, layerConfig, active` |
| `demo/@/components/custom/animation-controls/keyframes/KeyframesEditor.vue` | 102 | `animation` |
| `demo/@/components/custom/animation-controls/keyframes/KeyframesStringControls.vue` | 49 | `animation` |

**Severity assessment:**

The precept (MEMORY: `feedback_props_destructuring.md`) says NEVER destructure `defineProps()`. The history behind it: `AnimationControlsGroup.vue:173` called `getStoredAnimationGroupControlOptions(superKey)` with the destructured `superKey` — the D12 stale-store bug. This was fixed by `EditorShell.vue:63` adding `:key="superKey"` to force remount on scene switch, NOT by fixing the destructure.

Vue 3.5 introduces "Reactive Props Destructure" (stable, enabled by default) which compiles `const { x } = defineProps()` to reactive getters via the compiler. The project uses Vue `^3.5.35` (`package.json:217`). The Vue plugin is invoked as `Vue()` with no explicit `propsDestructure: false`, so the transform IS active.

**Practical consequence TODAY:** In Vue 3.5+, each destructured prop name is effectively a getter; template usages and closure captures re-read the current prop value. The D12 stale-superKey pattern is additionally guarded by `:key="superKey"`. No known live bugs stem from these 6 violations today.

**However:** (a) the PRECEPT is a standing mandate — these are precept violations regardless of Vue 3.5's compiler fix; (b) the `AnimationControlsGroup.vue:173` `getStoredAnimationGroupControlOptions(superKey)` pattern is the EXACT D12 class, still present; (c) the `:key` guard is a structural mitigation, not a semantic fix.

**Zero scene-level `.vue` files destructure `defineProps`.** All 6 violations are in shared `animation-controls` infrastructure.

---

## 7. Playground I-bar assessment

The I-bar: plays, switches, drags clean with error budget 0 across PLAY+SWITCH+DRAG.

Playground does NOT apply to the I-bar (it is not a scene in the SPA). It has no scene machine, no proof gate coverage, and is not deployed. From a correctness standpoint it is a **standalone dev-only tool** with no quality contract.

The `usePlaygroundAnimations.ts` creates animations with `placeholder` DOM elements (`document.createElement("div")`) as targets on setup, then reassigns them when assets bind via a `watch`. This is a pragmatic but architecturally fragile pattern (the placeholder is never removed from the animations' target list, it just gets overwritten).

---

## 8. Summary table

| # | Item | File:line | Severity | Disposition |
|---|---|---|---|---|
| DS-1 | Ghost dirs in root `CLAUDE.md` (simple, balls, boxes, bench) | `CLAUDE.md:55,59-61,122-128` | P1 | FOLD |
| DS-2 | Ghost dirs in `demo/CLAUDE.md` (simple, balls, boxes, bench) + stale "standalone apps" + stale "cube is default" claims | `demo/CLAUDE.md:3,39,43-45,122,126-128` | P1 | FOLD |
| DS-3 | Spring scene: 17 reactive ref writes/frame (liveValue/velocity/settled + 4 track refs); no D4-class fix applied; ungated | `demo/spring/useSpringDemo.ts:175-193` | P2 | FOLD |
| DS-4 | 6 `defineProps` destructuring violations in animation-controls shared components (precept) | files at lines 200, 161, 86, 167, 102, 49 | P2 | FOLD |
| DS-5 | Playground orphan — dev-only separate app, not deployed, not gated, no scene machine integration | `demo/playground/` | BOOK | BOOK |
| DS-6 | `AnimationControlsGroup.vue:173` — stale-superKey pattern (D12 class) mitigated by `:key` not semantic fix | `demo/@/components/custom/animation-controls/AnimationControlsGroup.vue:173`, `demo/@/components/custom/editor-shell/EditorShell.vue:63` | P2 | FOLD |
| DS-7 | `proof:perf-frame-budget` does not measure spring scene reactive-per-frame load | `scripts/proof-perf-frame-budget.mjs` (easing/dock only) | P2 | FOLD |
| DS-8 | Playground `usePlaygroundAnimations.ts`: placeholder DOM target pattern (never cleaned up) | `demo/playground/usePlaygroundAnimations.ts:42-46` | P2 | BOOK |
