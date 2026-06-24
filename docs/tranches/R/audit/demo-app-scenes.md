# Tranche R Audit — LANE: demo-app-scenes

**Scope:** `demo/app/App.vue` (499 L), `demo/app/scenes/*Scene.vue` (AmigaScene 538 L, SquareScene 504 L, CubeScene 267 L, SpringScene 193 L, EasingScene 123 L, others ≤ 44 L), `demo/app/scene-transition.css`, `demo/app/scenes.ts`, `demo/app/router.ts`, plus the five app-level composables (`useSceneMachineApp`, `useSceneTransition`, `useSceneSwap`, `useSceneVisibilityPause`, `useSceneMachineRouter`, `useRafScene`).

---

## Executive Summary

The demo-app scenes layer has three distinct clusters of problems:

1. **Oversize scene SFCs containing inlined logic that belongs in composables** — AmigaScene (538 L) mixes Three.js room construction, bounce-framing math, boing easter egg, power-on boot, telemetry sampling, and intersection/resize/visibility observers all inside one SFC `<script setup>`. SquareScene (504 L) buries a self-contained envelope-tour easter egg, keyboard-handler, and drag-scrub wiring directly in the SFC rather than a `useEnvelopeTour` / `useSquareDrag` composable.

2. **Structural workarounds that should be excised or escalated** — App.vue carries a 50-line `@mbabb` dropdown workaround (synthesising clicks, suppressing native ones, manual dock-hold pinning) that compensates for a `reka` / `glass-ui` component seam mismatch. This lives in the app root, not in a glass-ui patch. The `useSceneSwap` composable is a self-described "NO-VT FALLBACK" SpringProgress cross-dissolve that is kept alive on the cold-path indefinitely. The router maintains a `Stub`-component route list that is a manually-maintained mirror of `scenes.ts`.

3. **Effusive dynamicism in the scene-slot protocol** — scenes inject their side-panel content (`tabsContent`, `ribbonContent`, `headerLeft`) as raw render functions (`const tabsContent = () => h(...)`) exposed through `defineExpose`. This is an untyped, dynamic content-projection mechanism that fights Vue's component model, breaks template tooling, and creates implicit structural contracts between each scene SFC and the shell.

---

## Finding 1 — AmigaScene: Three.js room construction inlined in scene SFC (god-module)

**Severity: high | Category: god-module**

`demo/app/scenes/AmigaScene.vue` is 538 lines. The `onMounted` block alone spans lines 245–352 and constructs the entire Three.js scene graph inline: `THREE.Scene`, `THREE.PerspectiveCamera`, `THREE.WebGLRenderer`, `HemisphereLight`, `SpotLight`, `BoxGeometry`, `BoxMaterial`, `BoxMesh`, `OrbitControls`, the sphere mesh position, and the render loop start. This is a scene-setup concern completely separable from the component.

```ts
// AmigaScene.vue:248-352 — entirely inside onMounted
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
// ... 100 more lines of room wiring
renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, canvas });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// lights, box, sphere, OrbitControls ...
controls = new OrbitControls(camera, renderer.domElement);
sphereSpin.attach(canvas);
startRenderLoop();
```

The `refreshBounceFraming()` math (lines 115–143) is another standalone geometric concern (camera-frustum fit for the bounce envelope) that only depends on `camera` and constants — it has no Vue reactivity and no component-level state beyond `bounceScale`.

**Proposal:** Extract a `useAmigaScene(canvasEl: Ref<HTMLCanvasElement | null>)` composable in `demo/amiga/` that encapsulates the `THREE.Scene` / `Camera` / `Renderer` / `OrbitControls` / `lights` / `box-mesh` setup + the present-loop driver + `useResizeObserver`. AmigaScene.vue becomes a template + wiring of existing composables (`useAmigaAnimations`, `useAmigaBoot`, `useSphereSpin`, new `useAmigaScene`). The bounce-framing function moves into `useAmigaScene` as an internal. Target: ≤ 200 lines for the SFC.

---

## Finding 2 — SquareScene: easter-egg tour + keyboard handler inlined in SFC (god-module)

**Severity: medium | Category: god-module**

`demo/app/scenes/SquareScene.vue` is 504 lines. Lines 251–295 implement the "envelope tour" easter egg (a stateful multi-leg spring-chase sequence driven by `setTimeout`) entirely inline: `ENVELOPE_LEGS`, `touring`, `tourTimer`, `tourEnvelope()`, a secondary `onBeforeUnmount` cleanup. Lines 298–327 contain the `onKeydown` handler. Both are entirely self-contained concerns with no template bindings other than the `@keydown` event.

```ts
// SquareScene.vue:261-294 — inline easter egg
const ENVELOPE_LEGS: ReadonlyArray<[number, number]> = [ ... ];
let touring = false;
let tourTimer: ReturnType<typeof setTimeout> | null = null;
const tourEnvelope = () => { ... setTimeout(step, 520) ... };
onBeforeUnmount(() => { if (tourTimer) clearTimeout(tourTimer); });
```

Additionally, the drag-wiring block (lines 192–249) duplicates context that could be entirely absorbed into the `useSquareAnimations` composable — `captureFrame`, `homeX`, `homeY`, and the `useDragScrub` call are tightly coupled to the spring model already owned by `useSquareAnimations`.

**Proposal:** Extract `useEnvelopeTour(reseat, springReadout, syncAxisNow)` into `demo/square/useEnvelopeTour.ts`. Extract `useSquareDrag(box, springX, springY, travel, reseat, settle, springReadout, syncAxisNow)` into `demo/square/useSquareDrag.ts` (or fold into `useSquareAnimations`). SquareScene.vue becomes template + wiring. Target: ≤ 200 lines.

---

## Finding 3 — App.vue: `@mbabb` dropdown workaround lives in the app root (workaround)

**Severity: high | Category: workaround**

App.vue lines 18–42 document and lines 399–470 implement a 50-line workaround for a `reka`/`glass-ui` `DockDropdownTrigger` press-scale reflow bug. The fix synthesises a click on `pointerdown`, kills the trailing native click in the capture phase, and manually manages dock-hold state (`mbabbPressing`, `mbabbMenuOpen`, `mbabbSynthClick`):

```ts
// App.vue:438-470
let mbabbSynthClick = false;
function onMbabbTriggerPointerdown(event: PointerEvent) {
    if (event.button !== 0 || event.ctrlKey) return;
    event.preventDefault();
    mbabbPressing.value = true;
    const el = event.currentTarget as HTMLElement | null;
    mbabbSynthClick = true;
    el?.click(); // synthesise a click reka can see
    mbabbSynthClick = false;
}
function onMbabbTriggerClickCapture(event: MouseEvent) {
    if (mbabbSynthClick) return;
    event.preventDefault();
    event.stopPropagation();
}
```

The comment explicitly calls this a "product seam, no reka/glass-ui patch." The [glass-ui root changes feedback](../../memory/feedback_glass_ui_root_changes.md) records that glass-ui/dock changes should go in the glass-ui repo, never patched in demo. This workaround does the opposite: it patches around a glass-ui component deficiency in the app root.

**Proposal:** This entire block must be escalated to a `glass-ui` fix in `DockDropdownTrigger` (the `pointerdown`-opens-on-click mismatch between `DockSelectTrigger` and `DockDropdownTrigger`). Once glass-ui ships the fix, delete `mbabbSynthClick`, `mbabbPressing`, `mbabbMenuOpen`, `onMbabbTriggerEnter/Leave/Pointerdown/ClickCapture/MenuOpen` from App.vue entirely. Until the glass-ui fix ships, the workaround should at minimum be extracted into a `useDockDropdownWorkaround()` composable alongside App.vue, not inlined at the shell level. The memory note `feedback_glass_ui_root_changes.md` makes this a BORN-RED unless excised or isolated.

---

## Finding 4 — `useSceneSwap`: SpringProgress fallback kept alive on browsers that have VT (fallback)

**Severity: medium | Category: fallback**

`demo/app/useSceneSwap.ts` is a self-described "NO-VT FALLBACK." It is loaded and executed unconditionally on every mount. The `supportsViewTransitions()` check gates the `SpringProgress` setup at runtime, but the entire module is imported regardless, the `sceneOpacity` ref and `sceneSwapStyle` computed are always created, and the `sceneSwapStyle` object (scale + opacity) is always applied as an inline `:style` on the scene host.

```ts
// useSceneSwap.ts:35-51
const vtOwnsMotion = supportsViewTransitions();
const sceneOpacity = ref(1);
const sceneSwapStyle = computed(() => ({
    opacity: sceneOpacity.value,
    transform: `scale(${0.97 + 0.03 * sceneOpacity.value})`,
}));
if (!vtOwnsMotion) {
    const sceneSwapSpring = new SpringProgress({ respectReducedMotion: true });
    // ...
}
return { sceneSwapStyle };
```

On VT-supporting browsers (all modern engines) `opacity` is always `1` and `transform` is always `scale(1)` — a constant inline style that adds overhead to every reactive update of the scene host. The fallback path is dead on the common path.

**Proposal:** Native View Transitions have ≥ 95 % browser support as of 2026 (Chrome, Edge, Safari 18+). The SpringProgress cross-dissolve is a historical workaround for pre-VT Firefox. Determine the actual minimum support floor. If VT support meets the project's browser target, **excise `useSceneSwap` entirely**, remove `:style="sceneSwapStyle"` from App.vue (line 153), and let the VT + PRM degrade be the only motion path. If Firefox support without VT is still required, the fallback is legitimate, but `:style` should be conditionally bound only on non-VT engines, not unconditionally applied.

---

## Finding 5 — Router: manually-mirrored scene list (brittleness / DRY violation)

**Severity: medium | Category: brittleness**

`demo/app/router.ts` contains 9 route entries (lines 16–29) that are a manual copy of the scene ids in `demo/app/scenes.ts`. Each uses the `Stub = { render: () => null }` component — the routes serve as URL-state containers only, with zero routing logic. Adding or removing a scene requires editing BOTH files, and no type-check or lint enforces the coupling.

```ts
// router.ts:14-29
const Stub = { render: () => null };
const routes: RouteRecordRaw[] = [
    { path: "/", name: "home", component: Stub },
    { path: "/cube", name: "cube", component: Stub },
    // ... manually mirroring scenes.ts
```

**Proposal:** Generate the route list from `scenes.ts` at import time: `allScenes.map(s => ({ path: s.id === HOME_SCENE_ID ? "/" : `/${s.id}`, name: s.id, component: Stub }))`. Add the catch-all redirect as a fixed trailer. The `Stub` component is correct, but the list must not be a hand-maintained parallel.

---

## Finding 6 — `scenes.ts`: `STAGE_MODES` is a parallel string-keyed record (brittleness / DRY)

**Severity: medium | Category: brittleness**

`demo/app/scenes.ts` lines 223–236 define a `STAGE_MODES: Record<string, StageMode>` that mirrors the scene `id` list a second time:

```ts
const STAGE_MODES: Record<string, StageMode> = {
    home: "subject",
    cube: "subject",
    amiga: "subject",
    // ... one entry per scene
};
```

The `stageMode` field is absent from `SceneDescriptor`. This means: (a) adding a new scene requires two edits (the `scenes` array AND `STAGE_MODES`); (b) an id typo in `STAGE_MODES` silently falls through to `"subject"` (the `?? "subject"` default in `stageModeFor`), producing wrong mobile layout with no error.

**Proposal:** Add `stageMode: StageMode` to `SceneDescriptor`. Populate it inline with each scene's entry. Delete `STAGE_MODES` and `stageModeFor`; replace callers with `currentScene.value.stageMode ?? "subject"`. The silent fallback `?? "subject"` in the old `stageModeFor` was masking missing entries — with the field on the descriptor, a scene without a `stageMode` raises a TS error.

---

## Finding 7 — Scene SFCs: `superKey` string is duplicated between registry and SFC (DRY)

**Severity: low | Category: dry**

Every scene SFC redeclares its own `superKey` string literal, which must match the `superKey` field in `scenes.ts` exactly:

```ts
// scenes.ts:104: superKey: "Amiga"
// AmigaScene.vue:70: const superKey = "Amiga";

// scenes.ts:111: superKey: "Square"
// SquareScene.vue:88: const superKey = "Square";
```

Eight scenes repeat this pattern. There is no import linking the SFC's `superKey` to the registry, so a rename requires two edits and no TS enforces the match. `CubeScene` avoids this by importing `SUPER_KEY` from `useCubeAnimations.ts`, but that module is not the registry either.

**Proposal:** Export each scene's `superKey` from its domain composable (the authoritative constant) and import it in both the `SceneDescriptor` factory call and the SFC. Alternatively, define scene-id/superKey constants in a `demo/app/sceneIds.ts` file that both the registry and each SFC import from. No file should declare a `superKey` literal that it doesn't own.

---

## Finding 8 — Scene-slot protocol: render functions via `defineExpose` (encapsulation)

**Severity: high | Category: encapsulation**

Multiple scenes expose structured UI content to the shell via raw render functions through `defineExpose`:

```ts
// SpringScene.vue:64,128 / EasingScene.vue:53,90 / CubeScene.vue:169,182
const tabsContent = () => h(SpringSidebar, { demo });
const ribbonContent = (slotProps: { selectedControl: string }) => { ... h(Button ...) ... };
defineExpose({ ..., tabsContent, ribbonContent });
```

App.vue then binds these as dynamic components:
```html
<!-- App.vue:119-136 -->
<component :is="sceneRef?.tabsTrigger" v-bind="slotProps" ... />
<component :is="sceneRef?.tabsContent" ... />
<component :is="sceneRef?.ribbonContent" v-bind="slotProps" ... />
```

This is a dynamic content-projection API built from untyped `any` refs (`sceneRef = shallowRef<any>(null)`). The render functions are NOT SFC components — they are imperative `h()` trees with no template analysis, no scoped styles, no Vue compiler optimisations, and no IDE type-checking for their props. `CubeScene.headerLeft` (lines 117–143) is a 26-line `h()` tree for a hover-card that would be 10 lines as a `<template>` inside a dedicated component.

The proper Vue pattern is named **slots** pushed down through the `EditorShell` hierarchy, or a typed **scene-slot protocol** using `provide/inject` with a typed `ISceneSlots` interface. The current approach is effusive dynamicism: it uses `h()` as a workaround because the slot hierarchy doesn't naturally surface these injection points.

**Proposal:** Define a typed `SceneSlots` interface:
```ts
interface SceneSlots {
  tabsContent?: Component;
  ribbonContent?: Component;
  headerLeft?: Component;
}
```
Each scene exposes a static component object (a mini-SFC or a `defineComponent({})` with a `<template>`) rather than a raw render function. The shell binds these components as `<component :is>` with typed props. This preserves the dynamic dispatch while enabling template analysis, scoped styles, and TS prop-checking. CubeScene's `headerLeft` HoverCard becomes its own `CubePpmycotaHoverCard.vue` in `demo/cube/`.

---

## Finding 9 — `useSceneMachineApp`: `sceneRef: ShallowRef<any>` + duck-typed property writes (encapsulation)

**Severity: high | Category: encapsulation**

`useSceneMachineApp.ts` accepts `sceneRef: ShallowRef<any>` (line 24) and reads properties off it with optional chaining against `any`:

```ts
// useSceneMachineApp.ts:60,86,117,134,160,169,213-215,222-223
const group = sceneRef.value?.animationGroup;
const exposed = sceneRef.value?.scenePlayback as ScenePlayback | undefined;
const autoPlays = sceneRef.value?.autoPlays === true;
// ...
if (!ownsPlayback && sceneRef.value && "isPlaying" in sceneRef.value) {
    sceneRef.value.isPlaying = playing;  // raw property write on `any`
}
if (sceneRef.value && "isStarted" in sceneRef.value) {
    sceneRef.value.isStarted = started;
}
```

The `"isPlaying" in sceneRef.value` duck-test is a runtime structural check on an untyped reference. A scene that exposes `isPlaying` as a readonly computed will silently throw at the assignment (`"computed value is readonly"`) — the composable's own comment on line 213-214 documents this fragility. The `sceneRef.value.isStarted = started` write (line 223) is similarly unguarded.

**Proposal:** Define a typed `SceneExposedApi` interface:
```ts
interface SceneExposedApi {
  animationGroup: AnimationGroup<any>;
  superKey: string;
  isPlaying?: WritableRef<boolean>;   // absent on machine-owned scenes
  isStarted?: WritableRef<boolean>;
  scenePlayback?: ScenePlayback;
  autoPlays?: boolean;
  tabsContent?: Component;
  ribbonContent?: Component;
  headerLeft?: Component;
}
```
`shallowRef<SceneExposedApi | null>` replaces `shallowRef<any>`. The `isPlaying` write becomes a type-guarded setter: if the scene declares `isPlaying` as a `WritableRef`, the app writes it; machine-owned scenes declare `isPlaying` as a `ComputedRef` (not in the writable slot), so the dual-authority path vanishes by type.

---

## Finding 10 — `SpringScene.vue` and `EasingScene.vue`: scrub-handler boilerplate duplicated (DRY)

**Severity: low | Category: dry**

Both `SpringScene.vue` (lines 80–103) and `EasingScene.vue` (lines 68–88) implement identical scrub-state boilerplate:

```ts
// SpringScene.vue:95-103 / EasingScene.vue:80-88 — identical pattern
let wasPlayingBeforeScrub = false;
const onScrubStart = () => {
    wasPlayingBeforeScrub = demo.isPlaying.value;
    if (wasPlayingBeforeScrub) demo.pause();
};
const onScrubEnd = () => {
    if (wasPlayingBeforeScrub) demo.play();
    wasPlayingBeforeScrub = false;
};
```

Both pass these to `PlaybackRibbon` with the same prop names. `userReversed` + `onToggleReverse` also duplicate between the two files.

**Proposal:** Extract `usePlaybackScrubState(demo: { isPlaying: Ref<boolean>; play(): void; pause(): void })` returning `{ wasPlayingBeforeScrub, onScrubStart, onScrubEnd, userReversed, onToggleReverse }` into the animation-controls composables directory. Both scenes import it and bind the returned values to `PlaybackRibbon`.

---

## Finding 11 — `App.vue`: `activeSceneComponent/Key/Props` triple-computed with repeated `isHome || currentSceneId === "cube"` guard (brittleness)

**Severity: low | Category: brittleness**

App.vue lines 330–343 contain three separate computed properties each guarding the same `isHome.value || currentSceneId.value === "cube"` condition:

```ts
// App.vue:330-343
const activeSceneComponent = computed(() => {
    if (isHome.value || currentSceneId.value === "cube") return CubeScene;
    return currentScene.value.component;
});
const activeSceneKey = computed(() => {
    if (isHome.value || currentSceneId.value === "cube") return "cube";
    return currentSceneId.value;
});
const activeSceneProps = computed(() => {
    if (isHome.value || currentSceneId.value === "cube") {
        return { hideLoader: isHome.value };
    }
    return {};
});
```

The three-way parallel structure means adding a third home-alias scene (unlikely but possible) requires updating three parallel branches. The condition `currentSceneId === "cube"` when `!isHome` is actually always `true` because `isHome` is checked first — the `|| "cube"` guard in `activeSceneKey` and `activeSceneProps` is dead code when `isHome` is false and scene is "cube" (they are effectively the same branch).

**Proposal:** Consolidate into a single `activeSceneResolved` computed returning `{ component, key, props }`. This eliminates the three parallel branches and the repeated guard. A future scene alias only modifies one place.

---

## Finding 12 — `AmigaScene.vue`: `refreshBounceFraming` is a free-standing math function inline in the SFC (decomposition)

**Severity: low | Category: decomposition**

`demo/app/scenes/AmigaScene.vue` lines 115–143 define `refreshBounceFraming()` — a 28-line pure geometric function (camera frustum → bounce amplitude fit). It depends only on `camera` (a module-level let), the imported constants `SPHERE_RADIUS`, `BOUNCE_FIT_MARGIN`, `BOUNCE`, and writes into `bounceScale`. It has no template reference and no Vue reactivity of its own.

```ts
// AmigaScene.vue:115-143
const refreshBounceFraming = () => {
    if (!camera) return;
    const dx = camera.position.x - SPHERE_HOME;
    // ... 25 lines of geometry math
    bounceScale.x = clamp01(...);
    bounceScale.y = sv;
    bounceScale.z = sv;
};
```

**Proposal:** Move `refreshBounceFraming` and `clamp01` into `demo/amiga/utils.ts` (which already exists and holds `tesselateSphere`). Export as `computeBounceScale(camera: THREE.PerspectiveCamera, opts: {...}) => { x, y, z }` — a pure function with no side-effect references. The SFC calls it and assigns the result to `bounceScale`.

---

## Finding 13 — `scene-transition.css`: `@media (max-width: 720px)` magic number (styling)

**Severity: low | Category: styling**

`demo/app/scene-transition.css` line 70 hardcodes `max-width: 720px` as the phone-carousel breakpoint. This number does not correspond to a Tailwind `sm`/`md` breakpoint or any documented design token — it is a magic number.

```css
/* scene-transition.css:70 */
@media (max-width: 720px) {
    .scene-carousel-host {
        display: block;
        /* ... */
    }
}
```

The comment says "the 720px cut — the only `max-width` in the scene-stage subtree, the shelf-driver cure" but does not reference a token. If the breakpoint changes, both this file and any related glass-ui shell CSS must be updated manually.

**Proposal:** If `720px` is a first-class demo breakpoint (it is: it appears to be between Tailwind's `md` 768px and the undocumented glass-ui phone threshold), define it as a CSS custom property or use `@custom-media` if supported. At minimum document the exact reference in a comment. If it aligns with a Tailwind breakpoint (`sm`: 640px; `md`: 768px), use the standard breakpoint.

---

## Summary Table

| # | File | Lines | Severity | Category | Issue |
|---|------|-------|----------|----------|-------|
| 1 | `AmigaScene.vue` | 245–352 | high | god-module | Three.js room setup inlined in SFC onMounted |
| 2 | `SquareScene.vue` | 251–327 | medium | god-module | Easter-egg tour + keyboard handler inlined |
| 3 | `App.vue` | 399–470 | high | workaround | `@mbabb` click-synthesis dock workaround in root |
| 4 | `useSceneSwap.ts` | 1–54 | medium | fallback | SpringProgress fallback applies `sceneSwapStyle` unconditionally even on VT browsers |
| 5 | `router.ts` | 16–29 | medium | brittleness | Route list manually mirrors `scenes.ts`; Stub components duplicated |
| 6 | `scenes.ts` | 223–241 | medium | brittleness | `STAGE_MODES` parallel record — silent fallback on missing id |
| 7 | All scene SFCs | — | low | dry | `superKey` string literal declared in both registry and SFC |
| 8 | `CubeScene.vue`, `SpringScene.vue`, `EasingScene.vue` | — | high | encapsulation | Render-function slot protocol via `defineExpose` — untyped dynamic content projection |
| 9 | `useSceneMachineApp.ts` | 24,213–223 | high | encapsulation | `sceneRef: ShallowRef<any>` + duck-typed `isPlaying`/`isStarted` writes |
| 10 | `SpringScene.vue`, `EasingScene.vue` | 80–103, 68–88 | low | dry | `wasPlayingBeforeScrub`/`onScrubStart`/`onScrubEnd` duplicated |
| 11 | `App.vue` | 330–343 | low | brittleness | Triple parallel computed with repeated `isHome || "cube"` guard |
| 12 | `AmigaScene.vue` | 115–143 | low | decomposition | `refreshBounceFraming` free-standing math inlined in SFC |
| 13 | `scene-transition.css` | 70 | low | styling | Magic `720px` breakpoint with no token reference |
