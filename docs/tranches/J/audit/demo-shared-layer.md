# Tranche J — Demo Shared Layer Audit
## Lane: demo-shared

**Date:** 2026-06-09  
**Scope:** `demo/@/**` — composables, stores, animation-controls, dock, editor-shell, shared components  
**Branch:** tranche-i-dev (post-I-close tree)

---

## Executive Summary

The shared layer is in materially good shape post-Tranche-I. The scene machine DFA, control-surface single authority, `useRafScene` consolidation, `useDragScrub` gesture seam, and `useSceneVisibilityPause` are all coherent and orthogonal. Both static proof gates (`proof:demo-no-oversize`, `proof:decomposition`, `proof:single-writer`, `proof:composable-encapsulation`) pass clean. No glass-ui local patches exist; the `design-idioms.css` layer correctly _owns_ what the demo depends on rather than renting from glass-ui transitive imports. The `markRaw`/manual-sync memory notes in `MEMORY.md` are _implemented correctly_: `markRaw` groups are never persisted, the adapter registry uses lazy getters, and `currentAnimationGroup` is a `shallowRef`.

Five findings require J attention:

1. **`StoredAnimationGroupControlOptions.selectedControl` is typed `string`, not `ControlSurface`** — the DFA enforces the valid-surface set at runtime via `selectedControlSurfaceFor`, but the store field that carries the "preferred pick" accepts any string. A typo or an old localStorage value can silently enter the store with no type-error and only fails gracefully at the DFA projection (P2).

2. **`CubeScene.vue` writes `storedControls.selectedControl = "controls"` directly** (line 80) — a scene-side imperative write to the control surface bypassing the DFA single-authority path. This is the exact anti-pattern the I.W2 S1 cure was meant to eliminate; it's a CONDITIONAL-surface fallback (matrix-controls → controls on animation deselect) that works correctly today but is structurally fragile (P1).

3. **`useRafLoop` uses `onUnmounted` instead of `onScopeDispose`** — composable cleanup should use `onScopeDispose` so it works when called from `effectScope()` contexts, not just component instances. All other composables in the layer have converged on `onScopeDispose`; this is the lone outlier (P2).

4. **`useEasingGallery` uses raw `setTimeout`** — the tour runs `GALLERY_TOUR.length + 1` raw `setTimeout` calls. This is in `demo/easing/` (a scene-local composable), correctly cleaned up via `disposeGallery` / `onScopeDispose` in `useEasingDemo.ts`. The gate `proof:decomposition` clause `[async-blob]` sweeps only `animation-controls/**`, not the easing scene dir, so this passes the gate. The E-era mandate on `useTimeoutFn` does not currently reach scene dirs. Record-only (BOOK).

5. **Two raw `setTimeout` calls in scene files** (`CubeScene.vue:99`, `AmigaScene.vue:77`) are outside the `animation-controls/` subtree, so `proof:decomposition`'s `[async-blob]` clause does not bite them. Both are cleaned via `onBeforeUnmount`. Not a breakage, but inconsistent with the vueuse-primitive mandate (P2).

No glass-ui local patches found. No `querySelector` DOM coupling into component internals (except the single documented `[role=tablist]` vendor-DOM contract in `AnimationControls.vue:340`, which carries an explicit rationale note). The `provide/inject` graph is clean: two typed injection keys, both provided at `App.vue` root, consumed correctly. The `proof:demo-no-oversize` 500L ceiling holds (max file: `ControlsPaneWrapper.vue` at 490L).

---

## A. Composable Architecture Coherence

### useRafScene (demo/app/useRafScene.ts)

Clean consolidation of the I.W1 S2 transposition. Owns: `markRaw(new RAFPlayback())`, bound `startLoop`/`stopLoop`, `createRafAdapter` wiring, `onScopeDispose(stopLoop)`, and `useSceneVisibilityPause` with bound callbacks. Consumed by `useEasingDemo.ts` and `useSpringDemo.ts`.

**NOTE:** `useRafScene` lives at `demo/app/` (App-layer), not `demo/@/` (shared library). This is correct: it is the App's scene-recipe composable, consumed by scene demos. It is not a general-purpose shared composable.

### useDragScrub (demo/@/composables/useDragScrub.ts)

Correct. Owns the gesture-in-flight authority (global `body.is-dragging` token via `acquireSelectSuppression`/`releaseSelectSuppression`), `releasePolicy`, `pointercancel` cleanup. Uses `useEventListener` from vueuse (no raw `addEventListener`). The `gestureSelectSuppression.ts` sibling is a pure utility (no lifecycle hooks). Clean.

### useSceneVisibilityPause (demo/app/useSceneVisibilityPause.ts)

Correct. Uses `useDocumentVisibility()` from vueuse; the `autoPaused` contract ("only resume what IT paused") is sound. Called by `useRafScene` with bound `stopLoop`/`startLoop` — the I.W1 B-3 fix holds.

### useAnimationGroupPlayback

`demo/@/components/custom/animation-controls/composables/useAnimationGroupPlayback.ts` — composable still typed with `storedControls: any` and `emit: (event: string, ...args: any[]) => void`. These loose `any` types weaken the composable contract. P2 smell.

### useEasingGallery (demo/easing/useEasingGallery.ts)

Scene-local, colocated. Uses 7 raw `setTimeout` calls. Cleanup is `disposeGallery` called via `onScopeDispose` in `useEasingDemo.ts:281-282`. Not a leak. The `proof:decomposition [async-blob]` clause scope is `animation-controls/**` only, so this is unguarded by a gate. BOOK.

### sceneMachine/useSceneMachine/controlSurfaceDFA

Three-file pure core / store / DFA split is coherent and well-documented. `transition` is a pure reducer. `useSceneMachine` is a `createGlobalState` effect layer. `controlSurfaceDFA` is the static table. `selectedControlSurfaceFor` is a pure function. `proof:single-writer` passes clean.

---

## B. Store Layer — markRaw/Manual-Sync Patterns

**`MEMORY.md` note: "animationGroup is markRaw() — requires manual reactive sync for UI updates."**

**Verified correct in tree:**
- `App.vue:228`: `const currentAnimationGroup = shallowRef<AnimationGroup<any>>(markRaw(new AnimationGroup()))` — `shallowRef` + `markRaw`, not reactive.
- `useSceneMachineApp.ts:61,65`: `currentAnimationGroup.value = markRaw(group)` — always assigns via `shallowRef.value`, correct.
- Adapter registry (`scenePlaybackAdapters.ts`): uses lazy `getGroup()` getter, never holds a `markRaw` group reference — correct (MED-6 holds).
- `useSceneMachine.ts` persisted context: only holds `PlaybackSnapshot` (plain JSON), never the group — correct.

No regressions against the `markRaw` discipline found.

---

## C. Raw addEventListener/ResizeObserver/setTimeout Sites

### `animation-controls/` subtree (proof:decomposition [async-blob] scope)

Gate passes: `proof:decomposition [async-blob]` confirms zero raw `setTimeout`/`setInterval`/`requestAnimationFrame` under `animation-controls/**`. Verified by `node scripts/proof-decomposition.mjs`.

All `ResizeObserver` uses in `demo/@/` go through `useResizeObserver` from vueuse:
- `AnimationVisualizer.vue:78`: `useResizeObserver(containerEl, …)` — correct.
- `CSSCodeEditor.vue:207`: `const { stop } = useResizeObserver(el, …)` — correct.
- `useScrollFade.ts:107`: `useResizeObserver(observeEl ?? el, …)` — correct.

All `addEventListener` uses in `demo/@/` go through `useEventListener` from vueuse (no raw `window.addEventListener` found).

### Scene files OUTSIDE the `proof:decomposition` gate scope

**CubeScene.vue:87,99** — raw `setTimeout` for `autoDismissTimer` (ppmycota hover-card 4s auto-dismiss). Cleaned via `clearAutoDismiss()` in `onBeforeUnmount`. No leak; but `useTimeoutFn` from vueuse would be idiomatic.

**AmigaScene.vue:63,77** — raw `setTimeout` for `boingTimer` (boing-bounce 4.2s settle). Cleaned via `clearTimeout(boingTimer)` in `onBeforeUnmount`. No leak; `useTimeoutFn` would be idiomatic.

These are in scene-specific files (`demo/app/scenes/`), outside `demo/@/`. The E-era vueuse-primitive mandate covers `demo/@/`; the scene files are not explicitly gated.

---

## D. querySelector Couplings

`AnimationControls.vue:340`:
```ts
tabsListElRef.value =
    tabsHeaderEl.value?.querySelector<HTMLElement>("[role=tablist]") ?? null;
```
This is the single documented vendor-DOM contract — the reka-ui `<TabsList>` renders `role=tablist` and has no public ref. The comment at line 334-341 explicitly names it as a "single DOCUMENTED vendor-DOM contract (the `[data-sonner-toaster]` disposition, D.W3)." The `proof:no-brittle-selector` gate covers this.

`useHighlightCSS.ts:14,75`: `document.head.querySelector('#${styleId}')` — idempotent check for an existing `<style>` element the composable itself manages. Not a coupling into a component's internals; it is a deliberate head-DOM singleton management pattern.

No `querySelector` couplings into component internals found beyond the two documented sites above.

---

## E. Oversized Component Check

**`proof:demo-no-oversize` gate — PASS (confirmed by running the script):**
```
max demo/@/components/custom/animation-controls/components/ControlsPaneWrapper.vue @ 490L
```
All 168 demo `.vue`/`.ts` files are ≤ 500L ceiling. The gate holds.

**Notable large files (all within ceiling):**
| File | Lines |
|------|-------|
| ControlsPaneWrapper.vue | 490L |
| AnimationControlsGroup.vue | 488L |
| AnimationControls.vue | 411L |
| EasingCurveCanvas.vue | 373L |
| AnimationControlsControls.vue | 368L |
| OrbitalDrag.vue | 334L |
| AnimationMenuBar.vue | 299L |

The `group.ts` override raised to 820L (mentioned in audit prompt as WZ ebcc79f) is in `src/animation/group.ts`, which is the ENGINE (fenced by `proof:demo-no-oversize`). The engine ceiling is managed by `proof:decomposition`'s LIBRARY_CEILING_OVERRIDE mechanism; this audit does not cover it.

---

## F. provide/inject Hygiene

**Injection keys defined:** `demo/@/components/custom/animation-controls/injectionKeys.ts`
- `CONTROLS_PANE_HOVER_KEY: InjectionKey<Ref<boolean>>` — typed, Symbol-keyed.
- `TABS_EXTERNALLY_MANAGED_KEY: InjectionKey<boolean>` — typed, Symbol-keyed.

**Providers (verified):**
- `demo/app/App.vue:184`: `provide(TABS_EXTERNALLY_MANAGED_KEY, true)` — App root.
- `demo/app/App.vue:189`: `provide(CONTROLS_PANE_HOVER_KEY, dockHoveredRef)` — App root.

**Consumers:**
- `AnimationControls.vue:177`: `inject(TABS_EXTERNALLY_MANAGED_KEY, false)` — correct default.
- `usePaneHover.ts:35`: `inject(CONTROLS_PANE_HOVER_KEY, ref(false))` — correct default.
- `ChromeDock.vue:105`: `inject(CONTROLS_PANE_HOVER_KEY, null)` — null default (uses `if (controlsPaneHover)` guard).

No prop-drilling of `isControlsPanelOpen` / `controlSurfaces` observed beyond one-hop prop passing from App into `ChromeDock` and `AnimationControlsGroup`. The provide/inject tree is shallow and typed.

Scene-specific injection keys are correctly colocated: `SPRING_DEMO_KEY`, `EASING_DEMO_KEY`, `SEQUENCE_DEMO_KEY`, `MOTION_PATH_DEMO_KEY` — each provided in its scene root, consumed only in scene subtree.

---

## G. Glass-UI Local Patches

**None found.** The shared layer correctly _consumes_ glass-ui primitives (`GlassDock`, `DockIconButton`, `DockSelectTrigger`, `TooltipProvider`, `Button`, `Tabs`, `Select`, `Card`, etc.) via import. No glass-ui component is overridden or monkey-patched locally.

`design-idioms.css` explicitly addresses this: it defines demo-OWNED tokens and utilities (rainbow family, gold, `.progress-bar`, `.status-badge`, etc.) rather than re-authoring glass-ui recipes. The file's preamble documents the inv-16 distinction.

The single `:deep(.controls-pane-wrapper)` rule in `AnimationControlsGroup.vue:469` reaches a DEMO-AUTHORED component, not a glass-ui internal — not a violation.

The `TABS_EXTERNALLY_MANAGED_KEY` mechanism lets `AnimationControls.vue` operate as a standalone component (playground) without being wired to the scene machine, without any glass-ui patching. Clean.

---

## H. DFA Table Completeness vs Scene Registry

`CONTROL_SURFACES` in `controlSurfaceDFA.ts:76-85` enumerates: `home`, `cube`, `amiga`, `square`, `easing`, `spring`, `sequence`, `motion-path`.

`scenes.ts` registry (`allScenes`): `home`, `cube`, `amiga`, `square`, `easing`, `spring`, `sequence`, `motion-path`.

The DFA table is **complete and in sync** with the scene registry. No scene is missing from the DFA; no DFA entry is orphaned.

The `controlSurfacesFor` function returns `[...BUILT_IN_SURFACES]` for any unknown sceneId (the total fallback) — so a new scene added to `scenes.ts` without a DFA entry would silently get the full triad. This is the documented behavior. A J gate that asserts `Object.keys(CONTROL_SURFACES)` == `allScenes.map(s => s.id)` would make this explicit.

---

## I. defineProps Destructuring

Six files in `demo/@/` use `const { … } = defineProps<…>()`:

- `AnimationControlsGroup.vue:161`
- `PlaybackRibbon.vue:86`
- `AnimationMenuBar.vue:200`
- `AnimationControls.vue:167`
- `KeyframesStringControls.vue:49`
- `KeyframesEditor.vue:102`

Vue 3.5+ ships **native reactive props destructure** as a stable feature (no Reactivity Transform plugin required). The project uses Vue 3.5.35 (`node_modules/vue/package.json`), so `const { x } = defineProps()` is idiomatic and correct — the compiler transforms it to reactive bindings automatically. The `MEMORY.md` precept "NEVER destructure defineProps()" reflects a Vue 3.4 constraint that Vue 3.5 resolved.

**This is NOT a violation in the current tree.** The memory note is stale for Vue 3.5+. The pattern is correct.

---

## J. `selectedControl` Type Gap

`StoredAnimationGroupControlOptions.selectedControl` is typed `string` (controlOptionsStore.ts:6), not `ControlSurface`. The DFA's `selectedControlSurfaceFor` accepts `preferred?: string` (controlSurfaceDFA.ts:171), so the mismatch is bridged at the call site. However, the store can hold any string value (including stale scene-incompatible values), and the type system does not enforce that only valid `ControlSurface` values are written. A `selectedControl: ControlSurface` type would make invalid writes a compile error.

---

## K. CubeScene selectedControl Write — DFA Single-Authority Bypass

`demo/app/scenes/CubeScene.vue:73-83` — a `watch` resets `storedControls.selectedControl = "controls"` when the selected animation changes away from "Matrix." This is a scene-side write to the control-surface that bypasses the `selectedControlSurfaceFor` DFA projection. The I.W2 S1 cure deleted `EasingScene`/`SpringScene`'s `storedControls.selectedControl = …` pokes; `CubeScene`'s conditional-surface fallback survived as the one remaining rogue write.

The write is functionally correct today (the cube DFA allows "controls" for the cube scene), but it violates the single-authority contract: the CORRECT fix is to make the `AnimationControls.vue` `watch(selectedControlSurface)` derivation-sync detect "matrix-controls is no longer valid for the current animation" and perform the fallback via `selectedControlSurfaceFor`. The current write is a scene-side imperative that duplicates the DFA's job.

---

## L. `useRafLoop` `onUnmounted` vs `onScopeDispose`

`demo/@/components/custom/animation-controls/composables/useRafLoop.ts:56` uses `onUnmounted(stop)`. The correct cleanup hook for a composable is `onScopeDispose`, which fires both on component unmount AND when an `effectScope` is disposed. All other animation-controls composables have converged on `onScopeDispose` (e.g., `useSheetSpring.ts:66`). `useRafLoop` is the lone outlier.

`onUnmounted` will not fire if `useRafLoop` is ever called from a non-component context (e.g., from `createGlobalState` or a test `effectScope`). Currently `useAnimationProgress` calls `useRafLoop` — if `useAnimationProgress` were ever hoisted to a global scope, the rAF loop would leak. Low risk in practice but structurally incorrect.

---

## Findings Summary

| ID | Severity | Title | Evidence | Disposition |
|----|----------|-------|----------|-------------|
| DS-1 | P1 | CubeScene.vue directly writes `storedControls.selectedControl` bypassing DFA | `demo/app/scenes/CubeScene.vue:80` | FOLD |
| DS-2 | P2 | `selectedControl` typed as `string` not `ControlSurface` in store | `controlOptionsStore.ts:6` | FOLD |
| DS-3 | P2 | `useRafLoop` uses `onUnmounted` instead of `onScopeDispose` | `useRafLoop.ts:56` | FOLD |
| DS-4 | P2 | Two raw `setTimeout` in scene files outside vueuse-primitive gate | `CubeScene.vue:99`, `AmigaScene.vue:77` | FOLD |
| DS-5 | P2 | `useAnimationGroupPlayback` typed with `any` for storedControls + emit | `useAnimationGroupPlayback.ts:5-9` | FOLD |
| DS-6 | BOOK | `useEasingGallery` uses raw `setTimeout` (not `useTimeoutFn`) | `useEasingGallery.ts:47-48` — correctly cleaned via `disposeGallery`; outside `[async-blob]` gate scope | BOOK |
| DS-7 | BOOK | No gate asserts `CONTROL_SURFACES` keys == `allScenes` ids — DFA+registry sync is manual | `controlSurfaceDFA.ts:76` vs `scenes.ts:92` | BOOK |
| DS-8 | BOOK | `MEMORY.md` note "NEVER destructure defineProps()" is stale for Vue 3.5+ | Vue 3.5.35 ships native reactive props destructure; pattern is correct | RECORD |
