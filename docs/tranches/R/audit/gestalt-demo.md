# Tranche R — GESTALT-DEMO SYNTHESIS

**Date:** 2026-06-24
**Branch:** `tranche-r-dev`
**Scope:** Single coherent target structure for `demo/`, synthesized from all eight `demo-*.md` lane audits plus direct verification of the live tree.
**Inputs synthesized:** `demo-app-scenes.md`, `demo-scene-switcher.md`, `demo-anim-controls.md`, `demo-composables-state.md`, `demo-targets.md`, `demo-styling.md`, `demo-brittleness.md`, `demo-legacy-sweep.md`.

---

## 0. The central incoherence (the thing the gestalt must cure)

The demo's scene logic is **split across three unrelated locations** with a `../../` relative climb stitching them together:

1. **The scene SFC** lives in `demo/app/scenes/EasingScene.vue` (a shell-adjacent folder).
2. **The scene's domain** (Target SFC, composables, keys, presets, geometry) lives in a sibling top-level folder `demo/easing/`.
3. **The shared control surface** lives in `demo/@/components/custom/animation-controls/`.

Verified at `demo/app/scenes/EasingScene.vue:13-16`:

```ts
import EasingTarget from "../../easing/EasingTarget.vue";
import EasingSidebar from "../../easing/EasingSidebar.vue";
import { useEasingDemo } from "../../easing/useEasingDemo";
import { EASING_DEMO_KEY } from "../../easing/easingKeys";
```

The scene **reaches up two levels and across** into a parallel top-level domain folder. Every one of the eight scenes does this. The result: to understand the Easing scene you open `demo/app/scenes/EasingScene.vue` AND `demo/easing/*` (9 files) AND `demo/@/components/.../PlaybackRibbon.vue`. There is no single directory that *is* the Easing scene.

This is the single most important finding of the gestalt: **the per-scene domain folders (`demo/easing/`, `demo/cube/`, `demo/amiga/`, `demo/morph/`, `demo/motion-path/`, `demo/sequence/`, `demo/spring/`, `demo/square/`) and the `demo/app/scenes/*Scene.vue` shells are TWO HALVES of the same unit that have been physically separated.** The cure is to colocate each scene into one `demo/scenes/<name>/` directory containing the `Scene.vue` entry, the `Target.vue`, the composables, the keys/presets/geometry, and a scene-scoped style file where warranted.

This is NOT the flat-hyphenated-sibling anti-pattern the Q post-mortem flagged in `src/animation/` — the demo already uses real directory sub-modules well (`animation-controls/{components,composables,controls,keyframes,stores,timeline}`, `orbital-drag/composables`, `matrix-editor`). The demo's problem is the *opposite*: a single conceptual unit (a scene) is **scattered** across three roots instead of **fused** into one.

---

## 1. Current top-level layout (verified)

```
demo/
  @/                         # alias root: @components @composables @utils @styles
    components/
      custom/                # 13 loose SFCs + 8 sub-module dirs
      ui/menubar/            # reka menubar wrappers
    composables/             # 3 files (one dies with the carousel)
    styles/                  # style.css(644L) design-idioms.css(874L) brand.css
    utils/
  app/                       # shell + 11 app-level composables/stores + scenes/
    scenes/                  # 8 *Scene.vue shells (reach into the domain dirs below)
  amiga/  cube/  easing/  morph/  motion-path/  sequence/  spring/  square/
                             # 8 per-scene domain folders (flat, un-aliased)
  playground/                # standalone secondary app (own App.vue, dist gitignored)
```

Key facts established by direct inspection:

- `demo/app/scenes/*Scene.vue` import their domain via `../../<scene>/…` relative climbs (verified above).
- The 8 domain folders are flat (`demo/easing/` = 9 files, `demo/spring/` = 13 files) and **not** aliased — only `demo/@/{components,composables,utils,styles}` carry `@`-aliases (vite.config.ts:151-162, tsconfig paths).
- `demo/@/composables/` holds only 3 shared composables: `gestureSelectSuppression.ts`, `useDragScrub.ts`, `useScrollSnapScene.ts` — and the last dies with the carousel removal (§4).
- `demo/playground/dist/` is **gitignored** (`.gitignore:10 dist/`) and **not tracked** (`git ls-files` = 0). Not a checked-in-artifact problem; leave as is.

---

## 2. THE PROPOSED TARGET STRUCTURE

The unifying principle: **one directory per coherent unit.** A scene is a unit. The shared control surface is a unit. The shared primitives are a unit.

```
demo/
  main.ts                      # was app/main.ts — the single entry (playground keeps its own)
  index.html                   # was app/index.html
  app/                         # ONLY the shell + app-wide orchestration (no scenes/)
    App.vue
    router.ts                  # route list GENERATED from sceneRegistry (R-app §5)
    sceneRegistry.ts           # was scenes.ts; SceneDescriptor gains stageMode + superKey
    composables/               # the app-level (cross-scene) composables, re-homed here
      useContractAnimGroup.ts  # NEW — the triplicated transport-host recipe (R-state F2)
      useSceneTransport.ts     # NEW — the triplicated play/pause/togglePlay (R-state F3)
      useRafScene.ts
      useSceneMachineApp.ts    # sceneRef: ShallowRef<SceneExposedApi|null>, not any
      useSceneMachineRouter.ts
      useSceneVisibilityPause.ts
      useSceneTransition.ts    # test-hook DEV-gated + single-channel (R-brittle F3)
      rafConstants.ts          # NEW — PROGRESS_READOUT_HZ etc. (R-state F4)
    cubeTransformStore.ts      # createGlobalState wrapper (R-state F9)
    scene-transition.css       # VT keyframes ONLY (carousel block excised)
    loaf-observer.ts           # dev-only, DCE'd
  scenes/                      # NEW HOME — each scene is ONE colocated directory
    cube/
      CubeScene.vue
      CubeTarget.vue
      cube-3d.css              # extracted 271L style block (R-targets DT-1)
      useCubeAnimations.ts
      useCubeRelit.ts
      cubeKeys.ts              # NEW CUBE_DEMO_KEY (R-targets DT-8 uniformity)
      cube.png
    amiga/
      AmigaScene.vue
      AmigaCrtOverlay.vue
      AmigaTelemetry.vue
      useAmigaScene.ts         # NEW — Three.js renderer/camera/controls extraction (app §1)
      useAmigaAnimations.ts
      useAmigaBoot.ts
      useSphereSpin.ts
      amigaGeometry.ts         # was utils.ts; + computeBounceScale (app §12)
      checkerboard.jpg
    easing/
      EasingScene.vue
      EasingTarget.vue
      EasingHeroStage.vue
      EasingSidebar.vue
      useEasingDemo.ts         # < 500L after parseCSSValue + boilerplate extraction
      easingParsing.ts         # NEW — extracted parseCSSValue (R-state F1)
      useEasingGallery.ts
      useEasingGhost.ts
      useEasingTraceSmear.ts
      easingGroups.ts
      easingKeys.ts
    spring/
      SpringScene.vue
      SpringTarget.vue  SpringTrace.vue  SpringHeatmap.vue  SpringSidebar.vue
      StartingStyleTarget.vue
      useSpringDemo.ts
      useSpringDerby.ts  useSpringHotPath.ts  useSpringKeyframesEditor.ts
      useSpringLinearStops.ts  useSpringPaneDrag.ts
      springKeys.ts  springPresets.ts
    sequence/
      SequenceScene.vue
      SequenceTarget.vue  SequenceAxis.vue  SequencePlayhead.vue  SequenceScrubber.vue
      useSequenceDemo.ts  useSequenceInstrument.ts
      useSequenceReel.ts       # NEW — extracted reel egg (R-state F11)
      sequenceKeys.ts
    square/
      SquareScene.vue
      SquareInstrument.vue
      useSquareAnimations.ts
      useEnvelopeTour.ts       # NEW — extracted easter-egg tour (app §2)
      useSquareDrag.ts         # NEW — extracted drag wiring (app §2)
      squareKeys.ts            # NEW SQUARE_DEMO_KEY for inject uniformity
    morph/
      MorphSVGScene.vue        # was app/scenes/MorphSVGScene.vue
      MorphTarget.vue
      useMorphDemo.ts
      morphShapes.ts  morphKeys.ts
    motion-path/
      MotionPathScene.vue
      MotionPathTarget.vue
      useMotionPathDemo.ts  useMotionPathGesture.ts
      motionPathGeometry.ts  motionPathKeys.ts
  shared/                      # was demo/@ — renamed; keeps @-aliases pointing here
    components/
      custom/
        animation-controls/    # the shared control surface (unchanged internal shape)
        asset-manager/  dock/  editor-shell/  matrix-editor/  orbital-drag/
        # the 13 loose custom SFCs grouped (R-app + brittleness): see §6
        feedback/              # TypingDots, AnimatedText, CopyButton, CopyButton, EditableLabel
        inputs/                # ResponsiveSelect(DELETE), EasingSelect, EditableLabel
        editor/                # CSSPasteDialog, EasingEditor, EasingCurveCanvas, KeyboardShortcutsModal
        DemoControlPoint.vue   # migrated to vueuse (R-brittle F1)
      ui/menubar/
    composables/
      useDragScrub.ts
      gestureSelectSuppression.ts
      useTypedTrigger.ts       # NEW — extracted typed-egg detector (R-targets DT-10)
      # useScrollSnapScene.ts  -> DELETED with the carousel (§4)
    styles/
      style.css                # split: imports/@theme/@layer + glass overrides (R-style F12)
      layout-tokens.css        # NEW — dock/work-area/φ math
      color-tokens.css         # NEW — face crayons/axis/accent/progress/branding
      design-idioms.css        # idiom CLASSES + @keyframes only (R-style F13)
      design-tokens.css        # NEW — design-idioms :root token block
      brand.css
    utils/
  playground/                  # untouched secondary app (own App.vue, own dist)
    App.vue  usePlaygroundAnimations.ts  index.html
```

### Why `demo/scenes/<name>/` and not keep `demo/app/scenes/` + `demo/<name>/`

The current split forces a `../../<name>/` relative climb from every `*Scene.vue` (verified, §0). Fusing the shell entry (`Scene.vue`) with its domain (`Target.vue` + composables + keys) into `demo/scenes/<name>/` makes the import **local** (`./EasingTarget.vue`, `./useEasingDemo`), gives every scene exactly ONE directory, and means a reader/contributor touches one folder per scene. The `app/` folder then holds ONLY what is genuinely app-wide (the shell, the registry, the router, the cross-scene composables) — a clean service boundary.

### Why rename `demo/@/` → `demo/shared/`

`@` as a literal directory name is a clever-but-opaque convention (it visually mimics the alias but is an actual folder). `demo/shared/` states the boundary plainly: code used across ≥ 2 scenes or the shell. The `@components`/`@composables`/`@utils`/`@styles` aliases simply re-point to `demo/shared/*` (one-line vite + tsconfig change). This is optional polish — if churn is a concern, KEEP `demo/@/` and only do the scene fusion. The scene fusion is the load-bearing move; the `@`→`shared` rename is cosmetic.

---

## 3. Scene colocation contract (the per-scene gestalt)

Every `demo/scenes/<name>/` directory follows the SAME internal shape, sized to the scene's actual complexity (KISS — do NOT force empty sub-dirs):

| File kind | Convention | Present when |
|---|---|---|
| `*Scene.vue` | the shell entry: template + wiring of composables, provides `<NAME>_DEMO_KEY` | always (1 per scene) |
| `*Target.vue` | the animated subject; `inject(<NAME>_DEMO_KEY)` with EXPLICIT throw, not `!` | always |
| auxiliary `*.vue` | sidebars/overlays/heatmaps/axes | as the scene needs |
| `use<Name>Demo.ts` | the domain orchestration composable | always |
| `use<Name>*.ts` satellites | sub-concerns (gallery, derby, gesture, reel, tour, drag…) | when the demo composable would exceed ~400L |
| `<name>Keys.ts` | the `InjectionKey` + `<NAME>_DEMO_KEY` + `superKey` constant (single source) | always |
| `<name>Presets.ts` / `<name>Geometry.ts` / `<name>Shapes.ts` | pure static data | scene-specific |
| `<name>-*.css` | extracted scoped-style block when the SFC exceeds the 500L gate | only Cube today (DT-1) |

**Do NOT introduce `components/`/`composables/`/`constants/` sub-dirs inside a scene folder.** With 4-13 files per scene, a flat scene directory is correct (KISS). Sub-directories inside a scene are over-nesting at this grain — they are warranted only inside the genuinely large shared `animation-controls/` unit (§5), never inside a single scene.

The colocation also resolves the **`superKey` DRY violation** (app §7): the `superKey` literal currently appears in BOTH `scenes.ts` and each SFC. Move it to `<name>Keys.ts` as the single authority; both the registry factory and the SFC import it. No string is declared in a file that does not own it.

---

## 4. Scene-switcher removal (CLEAN — fully specified by `demo-scene-switcher.md`)

The phone `SceneSwitcherCarousel` is **structurally broken by design**: its `useScrollSnapScene.onScroll` is a documented no-op (`void nearestCenterId`, writes no Vue state), so the swipe-settle commit never fires — only an explicit card `@click` switches scenes. It is a second scene-switching authority parallel to the always-present `ChromeDock` `<Select>`, which already handles every breakpoint.

**Excise in full** (the dock is the sole switcher on all breakpoints):

- DELETE `demo/@/components/custom/SceneSwitcherCarousel.vue` (178L) and its entire scoped style block.
- DELETE `demo/@/composables/useScrollSnapScene.ts` (72L) — zero consumers after the carousel goes; also carries the `[data-*]` dataset coupling (`dataset.sceneId`, R-brittle F4a) and the dead no-op handler.
- In `App.vue`: delete the `import SceneSwitcherCarousel` line and the `<div class="scene-carousel-host">` mount block. KEEP the `import "./scene-transition.css"` (the VT keyframes are load-bearing).
- In `scene-transition.css`: delete the S2 carousel-visibility block (the `.scene-carousel-host { display:none }` + the `@media (max-width:720px)` rule, ~21 lines). The file becomes VT-keyframes-only; update its header comment.
- DELETE `-webkit-overflow-scrolling: touch` (R-legacy 6a) — it dies with the carousel file anyway.
- Comment-only renames (defer to polish): "scene-switcher" → "ChromeDock"/"dock band" in `style.css` (272, 281, 455), `design-idioms.css` (253), `EditorStartScreen.vue` (5-6). These are non-functional; the term "scene-switcher" now refers unambiguously to ChromeDock.

This removal is the cleanest single win: it deletes a broken parallel surface, a dead composable, a `[data-*]` coupling, a no-op handler, an obsolete CSS property, AND a magic `720px` breakpoint in one pass.

---

## 5. The `animation-controls/` subtree — IS IT over-engineered?

**Verdict: NO, not by directory structure — but YES, it carries component-boundary debt.**

The five-directory split (`components/`, `composables/`, `controls/`, `keyframes/`, `timeline/`) is **NOT contrivance** — each dir has a coherent domain (layout primitives / group-level reactive logic / per-animation panel / Monaco CSS editor / timeline editor). The `keyframes/` and `timeline/` sub-modules each correctly carry their own `components/`/`composables/`/`utils/`. This is the *good* directory decomposition the rest of `demo/` should emulate — and it is the antithesis of the flat-hyphenated-sibling anti-pattern in `src/animation/`.

The verified depth (file counts per dir) shows no empty or single-file contrived dirs:

```
5  animation-controls/                    9  controls/
4  components/                            7  controls/composables/
12 composables/                           4  keyframes/   2 .../components  6 .../composables  2 .../utils
9  stores/                                3  timeline/    2 .../components  4 .../composables  3 .../utils
```

**The one borderline over-nesting** is `controls/composables/` co-existing with the top-level `composables/` (R-anim F11): a reader tracking `../composables/useRafLoop` vs `./composables/useAnimationSync` must know which level they're in. This is correct by cohesion (the controls-scoped composables genuinely belong to the controls panel) — the fix is a one-line boundary comment, NOT a structural move.

**The real debt is in the component boundary, not the directory tree** (R-anim F1-F6):

- **Callbacks-as-props** (F1): `AnimationControlsGroup` passes 5 callback functions (`onPanelTransitionEnd`, `onSheetSettled`, `onPaneMouseEnter/Leave`, `setPaneEl`) as PROPS to `ControlsPaneWrapper`. This is reverse data-flow disguised as props; `:set-pane-el` is an upward ref-teleport. Replace with `defineEmits` events + `defineExpose({ paneEl })`. This alone drops both 499/498L files under 400L.
- **Prop-drilled layout state** (F2): move `useControlsLayout` DOWN into `ControlsPaneWrapper` (it owns the inner `.controls-pane` ref); deletes 8 pass-through props.
- **Engine objects in a presentational dock** (F3): `TransportDock` builds two `CSSKeyframesAnimation` from raw `@keyframes` strings inline → extract `useIconAnimations()` or replace with CSS class-toggle. The `let pointerHandled` RF-17 workaround must become an explicit tagged item, not a silent comment.
- **`storedControls: any`** (F5, also R-state F7): a recorded "BOOK" that violates the no-`any` precept — type it `StoredAnimationGroupControlOptions` (already imported adjacently).
- **`_storeTimestamp` mixed into the payload type** (F6): extract a `StoredEnvelope<T>` wrapper so the TTL sentinel stops bleeding `number | undefined` into every keyed read.
- **silent unknown-scene fallback** (F8): `controlSurfacesFor` silently returns `BUILT_IN_SURFACES` for an unregistered id → make it throw in DEV (the registered scene set is finite and known at build time).

So: keep the `animation-controls/` directory shape verbatim; fix the boundary debt. The subtree is the *model* for the scene-fusion gestalt, not a target for de-nesting.

---

## 6. The 13 loose `custom/` SFCs — group by role (no contrivance)

`demo/@/components/custom/` holds 13 loose SFCs alongside 8 well-formed sub-module dirs. The loose files mix unrelated roles. Group them into thin role-folders (only if the grouping is honest — else leave flat):

- `feedback/` — `TypingDots.vue`, `AnimatedText.vue`, `CopyButton.vue`, `Animated.vue`(**DELETE**, dead — R-legacy 1a)
- `inputs/` — `ResponsiveSelect.vue`(**DELETE**, dead — R-legacy 1b), `EasingSelect.vue`, `EditableLabel.vue`
- `editor/` — `CSSPasteDialog.vue`, `EasingEditor.vue`, `EasingCurveCanvas.vue`, `KeyboardShortcutsModal.vue`
- stays at `custom/` root — `DemoControlPoint.vue` (its own concern; migrate to vueuse per R-brittle F1)

Two of the 13 are **dead and excised outright** (`Animated.vue`, `ResponsiveSelect.vue`) — that removes the need to home them. The grouping is optional polish; the deletions are mandatory. If the remaining count is small after deletion, a flat `custom/` is acceptable (KISS) — do not force role-folders that hold one file each.

---

## 7. State / store management — already coherent, three drift points

The audit (R-state "What works well") confirms the demo's state layer is **idiomatic and consistent**: `createGlobalState` + `useStorage` for all stores (no Pinia drift, uniform 7-day TTL), typed `provide`/`inject` for scene context (`EASING_DEMO_KEY` etc.), disciplined `markRaw` on engine objects, and a clean pure-reducer + effect-shell scene machine. The gestalt **preserves this** — do not restructure the store layer.

Three drift points to normalize (so the pattern is uniform):

1. `cubeTransformStore.ts` uses a bare module-level `ref` instead of `createGlobalState` (R-state F9) — wrap it so it survives HMR like every other store.
2. `_timingFunctionsAnd` is a mutable module-level `let` lazy-singleton with `any` (R-state F10) — replace with a `const` computed once at import (synchronous pure derivation; no async-init excuse).
3. Dead `animationState` field in `StoredAnimationOptions` (R-state F5) — never read anywhere; delete it (it persists junk bytes to localStorage on every clone).

---

## 8. The vueuse listener/observer gestalt — one residual cluster

The demo is **already heavily migrated** to vueuse seams; the canonical model is `useScrollFade.ts` (`useEventListener(el,…)` + `useResizeObserver(el,…)`, ref-direct, auto-detach-on-swap, auto-clean-on-dispose). Twelve+ files use it correctly (R-brittleness exec summary). The residual brittleness is **concentrated and specific** — the gestalt should land these so the codebase has ONE listener idiom:

1. **`DemoControlPoint.vue`** (HIGH) — the single un-migrated component: raw `window.addEventListener` drag-follow loop + raw `handleEl.addEventListener("pointerdown")`. Leaks three window listeners if it unmounts mid-drag (no `onScopeDispose` backstop). Route through `useEventListener` (1b) and the shared `useDragCapture` seam (1a).
2. **`SpringHeatmap.vue`** (HIGH) — raw `new ResizeObserver` + raw `new MutationObserver` watching `<html>` class for dark-mode, with `typeof … !== "undefined"` fallback guards. Replace RO with `useResizeObserver(fieldEl, paint)`; **excise the MutationObserver entirely** for `const { isDark } = useGlobalDark(); watch(isDark, paint)` (glass-ui already exposes it reactively — kills the global-document-root reach and the over-broad re-paint storm).
3. **`useSceneTransition.ts`** (MEDIUM) — a test-only datum DOUBLE-written to `window.__lastVtTypes` AND `data-last-vt-type`, read by nothing in the source. Collapse to ONE channel and DEV-gate it (the `loaf-observer.ts` `import.meta.env.DEV` pattern is the established standard).
4. **`[data-*]` dataset round-trips in hot/reactive code** (MEDIUM) — `useScrollSnapScene` (dies with the carousel, §4) and `EasingTarget`'s per-frame `el.dataset.curve ?? ""` painter. For Easing: build an owned `{ el, fn, isActiveName }[]` snapshot at re-wire time; the painter iterates that, no DOM string-parse per frame, no `?? ""` silent identity-fn fallback.
5. **`useTabStripScroll.ts`** (LOW, vendor-imposed) — `querySelector("[role=tablist]")` into glass-ui `<SegmentedTabs>` internals (no public ref). Best fix is cross-repo (glass-ui `defineExpose` the tablist ref — a BB/BC ask); in-repo, centralize the selectors and make `?? null` an explicit DEV-throw.

The principle: **one listener idiom (vueuse ref-direct) across the whole demo; explicit reactive sources over DOM-poll/observer reaches; no silent `?? ""`/`?? null` swallows in reactive code.**

---

## 9. The 500L oversize files — decomposition targets

Verified over-gate (and the borderline cluster at exactly 499L, which is comment-inflation hiding structure):

| File | Lines | Cure |
|---|---|---|
| `CubeTarget.vue` | 560 | extract 271L style → `cube-3d.css` (the only genuine over-limit) |
| `AmigaScene.vue` | 538 | extract `useAmigaScene.ts` (Three.js renderer/camera/controls/loop) |
| `useEasingDemo.ts` | 511 | extract `easingParsing.ts` + shared `useContractAnimGroup` |
| `SquareScene.vue` | 504 | extract `useEnvelopeTour.ts` + `useSquareDrag.ts` |
| `useSpringDemo.ts` | 499 | shared `useContractAnimGroup` + `useSceneTransport` |
| `useSequenceDemo.ts` | 499 | extract `useSequenceReel.ts`; trim mandate-archaeology comments |
| `SequenceTarget.vue` | 499 | extract `useTypedTrigger`; the subgrid fallback excision |
| `App.vue` | 499 | escalate the `@mbabb` dock workaround to glass-ui (or isolate to a composable) |
| `ControlsPaneWrapper.vue` | 499 | F1+F2 callback-as-prop + layout-ownership fixes drop it < 400L |
| `EasingCurveCanvas.vue` | 499 | SVG canvas + drag + curve math — split drag wiring composable |

The cross-cutting extractions (`useContractAnimGroup`, `useSceneTransport`, `rafConstants.ts`, `useTypedTrigger`) each kill a triplicated/duplicated pattern (R-state F2/F3/F4, R-targets DT-10) AND shrink multiple files at once — they are the highest-leverage moves.

---

## 10. The `@mbabb` dock workaround — escalate, do not house

`App.vue` carries a 50-line click-synthesis workaround (`mbabbSynthClick`, `onMbabbTriggerPointerdown/ClickCapture`) for a `reka`/`glass-ui` `DockDropdownTrigger` press-scale seam mismatch (app §3). The memory note `feedback_glass_ui_root_changes.md` makes this a **BORN-RED**: glass-ui/dock changes must go in the glass-ui repo, never patched in demo. The gestalt position: **escalate to a glass-ui `DockDropdownTrigger` fix**; until it ships, isolate the block into a `useDockDropdownWorkaround()` composable (out of the shell root), tagged as a cross-repo handoff — NOT inlined at App.vue scope. Same disposition as the `useTabStripScroll` SegmentedTabs reach (§8.5): the principled fix is cross-repo.

---

## 11. Ordered execution (low-risk → higher-risk)

1. **Excise dead code** (zero risk): `Animated.vue`, `ResponsiveSelect.vue`, the scene-switcher carousel + `useScrollSnapScene`, the `animationState` dead field, `-webkit-overflow-scrolling`, the subgrid fallback, the green-hue ghost, the tombstone comment bloat.
2. **Cross-cutting extractions** (low risk, high leverage): `useContractAnimGroup`, `useSceneTransport`, `rafConstants.ts`, `useTypedTrigger` — each kills a duplication and shrinks files.
3. **Per-scene style/composable extractions** (low risk): `cube-3d.css`, `useAmigaScene`, `easingParsing`, `useEnvelopeTour`/`useSquareDrag`, `useSequenceReel`.
4. **vueuse migration** (medium): `DemoControlPoint`, `SpringHeatmap` (RO + MutationObserver→useGlobalDark), the `useSceneTransition` test-hook collapse, the EasingTarget dataset snapshot.
5. **Boundary refactors** (medium): animation-controls callbacks-as-props → emits/expose; `useControlsLayout` ownership move; the typed `SceneExposedApi` / `SceneSlots` interfaces replacing `ShallowRef<any>` + render-fn `defineExpose`.
6. **The scene-fusion move** (the big structural one — do LAST, atomically per scene): relocate `demo/<name>/*` + `demo/app/scenes/<Name>Scene.vue` → `demo/scenes/<name>/`, fix imports to local, generate the router list from the registry. Optionally rename `demo/@/` → `demo/shared/` (cosmetic, re-point aliases).

The scene-fusion is the **headline gestalt move** but also the highest churn — it should land after the demo is otherwise clean, atomically one scene at a time, each verified against its `proof:*` gate before the next.

---

## 12. What is NOT a problem (do not touch)

- The four-Target outer-wrapper repetition (DT cross-cutting note) is **consistent design language**, not a bug — the inner contents differ radically; a slot-wrapper would add indirection with no payoff.
- The `createGlobalState`/`useStorage`/`provide-inject`/`markRaw` state discipline is idiomatic — preserve it.
- The `animation-controls/{components,composables,controls,keyframes,stores,timeline}` directory shape is the *model* — keep it verbatim, fix only its component-boundary debt.
- The confirmed-clean vueuse seams (`useScrollFade`, `useOrbitalPointer`, `useSphereSpin`, `toastGuard`, `loaf-observer`, etc.) are the standard — leave them.
- `playground/dist/` is gitignored and untracked — not a checked-in-artifact concern.
- The genuinely-befitting silent catches (`warmScene`, `useMonacoCancellationGuard`, `html2canvas` preview, `useHeroSourceEgg`, AmigaScene `sessionStorage`) are correctly scoped graceful-degrades — leave them.
```
