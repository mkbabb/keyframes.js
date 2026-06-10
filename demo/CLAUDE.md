# demo/

Vue 3 demo. ONE multi-scene SPA — `app/` — is the demo: `npm run dev` serves it, `npm run gh-pages` builds it to `dist/gh-pages/` (deployed at keyframes.babb.dev). The per-scene directories (`amiga/`, `cube/`, `easing/`, `motion-path/`, `sequence/`, `spring/`, `square/`) hold scene-specific composables and target components consumed by `app/scenes/*Scene.vue` — they are NOT standalone apps. `playground/` is the one other standalone app (`npm run dev:playground`). Design language: `DESIGN.md` (extends glass-ui's).

## Structure

```
demo/
├── app/                       # THE multi-scene SPA
│   ├── index.html / main.ts / App.vue   # shell: KeepAlive + dynamic <component :is> + dock chrome
│   ├── router.ts              # hash-mode vue-router; routes select the active scene id (GH-Pages-safe)
│   ├── scenes.ts              # scene registry: lazy scene loaders, inline-SVG icon family, warmScene()
│   ├── scenes/                # AmigaScene, CubeScene, EasingScene, MotionPathScene, SequenceScene, SpringScene, SquareScene
│   ├── useSceneMachineApp.ts  # scene-machine ↔ app-shell reconcile (SCENE_READY, play/pause routing)
│   ├── useSceneMachineRouter.ts # scene-machine ↔ router reconcile
│   ├── useRafScene.ts         # THE raw-rAF scene recipe: RAFPlayback + ScenePlayback adapter + visibility pause
│   ├── useSceneSwap.ts / useSceneTransition.ts / useSceneVisibilityPause.ts
│   ├── cubeTransformStore.ts  # shared cube matrix state (gl-matrix)
│   ├── loaf-observer.ts       # long-animation-frame diagnostics
│   └── public/robots.txt
├── @/                         # Shared library
│   ├── components/custom/
│   │   ├── animation-controls/  # the control suite (see below)
│   │   ├── asset-manager/       # AssetViewport/AssetLayer/AssetLayerPanel/AssetPropertiesPanel + useAssetManager + assetTypes
│   │   ├── dock/ChromeDock.vue  # glass-ui dock: scene switcher + pane toggles
│   │   ├── editor-shell/        # EditorShell, EditorHeader, EditorStartScreen, SharePopover + useShareState (URL-hash share/restore)
│   │   ├── matrix-editor/       # MatrixEditor.vue + transformMath.ts + useTransformState.ts (gl-matrix)
│   │   ├── orbital-drag/        # quaternion 3D drag: OrbitalDrag.vue, quaternionEuler.ts, useOrbitalPointer/Pinch/Inertia, inertiaDecay
│   │   └── singles: Animated, AnimatedText, CSSPasteDialog, CopyButton, EasingCurveCanvas,
│   │              EasingEditor, EasingSelect, EditableLabel, KeyboardShortcutsModal,
│   │              ResponsiveSelect, TypingDots
│   ├── components/ui/menubar/   # the ONE remaining shadcn-vue component dir (16 files); the rest migrated to @mkbabb/glass-ui
│   ├── composables/
│   │   ├── gestureSelectSuppression.ts  # the ONE global drag-in-flight select-suppression token (body.is-dragging)
│   │   └── useDragScrub.ts              # the ONE shared pointer-drag scrub seam (stage rails, square box)
│   ├── styles/                  # style.css (Tailwind v4 + theme vars), brand.css, design-idioms.css
│   └── utils/                   # utils.ts (cn()), clipboard.ts, iosTextEntry.ts, toastGuard.ts (vue-sonner private-DOM contract)
├── amiga/        # Three.js sphere: useAmigaAnimations, useSphereSpin, utils, checkerboard.jpg
├── cube/         # 3D CSS cube: CubeTarget.vue, useCubeAnimations, cube.png
├── easing/       # easing gallery: EasingSidebar/EasingTarget, easingGroups/easingKeys, useEasingDemo/useEasingGallery
├── motion-path/  # MotionPathTarget, motionPathGeometry/motionPathKeys, useMotionPathDemo/useMotionPathGesture
├── sequence/     # SequenceTarget, sequenceKeys, useSequenceDemo
├── spring/       # SpringSidebar/SpringTarget/StartingStyleTarget, springKeys/springPresets, useSpringDemo, useSpringLinearStops
├── square/       # useSquareAnimations (custom transform fn)
├── playground/   # standalone app: index.html + App.vue + usePlaygroundAnimations (asset drag-and-drop)
├── CLAUDE.md
└── DESIGN.md     # demo design language (extends glass-ui DESIGN.md)
```

## Animation Controls (`@/components/custom/animation-controls/`)

The primary UI for interacting with animations. Top level: **AnimationControlsGroup.vue** (orchestrates `AnimationGroup`: scrub-pause-resume, playback delegation), **AnimationMenuBar.vue**, `animationDescriptions.ts`, `injectionKeys.ts`, `index.ts`.

- **`components/`** — `ControlsPaneWrapper.vue`, `RibbonBar.vue`
- **`composables/`** — `useAnimationGroupPlayback` (scrub-pause-resume state machine), `useAnimationProgress` (rAF progress polling), `useControlsLayout`, `usePaneHover`, `useRafLoop`, `useScrollFade`, `useSheetGesture`, `useSheetSpring`
- **`controls/`** — `AnimationControls.vue` (tab panel; lazy-loads the Monaco-bearing panes), `AnimationControlsControls.vue` (duration/delay/iterations/direction/fill/easing), `AnimationVisualizer.vue` (progress ball; `calc(100cqw - 100%)` + `bumpLayoutEpoch` on container resize), `LayerConfigPanel.vue`, `PlaybackRibbon.vue`, `TimingFunctionPanel.vue`; `controls/composables/`: `useAnimationSync` (markRaw animation → Vue reactivity via gated `useRafFn` polling), `useDragCapture` (control-surface drags: bezier handles, timeline diamonds, sequence rows), `usePlaybackToggle`, `useTimingFunctionEditor`; `timingCurveUtils.ts`; `playback-button.css`, `tab-trigger.css`
- **`keyframes/`** — `CSSCodeEditor.vue` (Monaco wrapper), `KeyframeCard.vue`, `KeyframesEditor.vue`, `KeyframesStringControls.vue`; `components/`: `KeyframeCardList`, `KeyframesAddDialog`; `composables/`: `useApplyCSS`, `useHighlightCSS`, `useKeyframeOps`, `useKeyframesEditor`, `useKeyframesParsing`, `useKeyframesState`; `monaco-themes/` (Dracula, GitHub); `utils/`: `contenteditable.ts`, `parseAnimationCSS.ts`
- **`stores/`** — `animationOptionsStore.ts` + `controlOptionsStore.ts` (vueuse `createGlobalState` + `useStorage`, 7-day TTL via `storeUtils.ts`), `controlSurfaceDFA.ts` (the control-surface single-authority DFA), `sceneMachine.ts` + `scenePlaybackAdapters.ts` + `useSceneMachine.ts` (the scene state machine + per-scene playback adapters; machine context persists to localStorage), `hashSharing.ts` (URL-param state encode/decode/restore), `index.ts` (barrel + `resetAllStores`)
- **`timeline/`** — `KeyframeTimeline.vue` (draggable diamonds, playhead, import/export), `TimelineCaret.vue`; `components/`: `TimelineHoverPreview` (html2canvas), `TimelineTrack`; `composables/`: `useTimeline`, `useTimelineBuild`, `useTimelineOps`, `useZoomPan`; `timelineTypes.ts`; `utils/`: `flattenVars`, `snapshotCapture` (getComputedStyle → keyframes), `timelineEngine` (build/export/import CSS)

## Scenes

| Scene (`app/scenes/`) | Content dir | Key feature |
|---|---|---|
| CubeScene | `cube/` | 3 synchronized animations, 3D CSS cube, matrix editor, orbital drag |
| AmigaScene | `amiga/` | Three.js sphere, multi-axis rotation + checkerboard spin |
| SquareScene | `square/` | Custom transform fn, nested object interpolation |
| EasingScene | `easing/` | Easing gallery + unified easing editor |
| SpringScene | `spring/` | Spring presets, `linear()` stops, `@starting-style` target |
| SequenceScene | `sequence/` | `Sequence` master-playhead transport, draggable rows |
| MotionPathScene | `motion-path/` | `offset-path` editing + gesture |

Plus the standalone `playground/`: asset drag-and-drop viewport with preset animation binding.

## Key Dependencies

- `vue` ^3.5 + `vue-router` (hash mode) + `@vueuse/core`
- `@mkbabb/glass-ui` `~3.9.0` (in `optionalDependencies`) — the demo chrome: dock, header ribbon, keyboard shortcuts (`registerShortcut` from `@mkbabb/glass-ui/keyboard`), dark-mode toggle, buttons/dialogs/tooltips
- `reka-ui` — headless primitives (menubar basis)
- `three` — amiga sphere only (the cube is CSS 3D transforms)
- `gl-matrix` — quaternion/matrix math (orbital-drag, matrix-editor, cubeTransformStore)
- `monaco-editor` + `monaco-themes` — CSS keyframes editor (wrapped by CSSCodeEditor)
- `html2canvas` — timeline hover previews
- `highlight.js` — keyframe CSS highlighting
- `vue-sonner` — toasts (`@/utils/toastGuard.ts` owns its private DOM contract)
- `@lucide/vue`, `@iconify/vue` — icons
- `@mkbabb/value.js` — Color, math, easing, parsing (also the library's own dependency)

## Conventions

- Tailwind v4; light/dark theme via the `.dark` class (`@custom-variant dark` in `@/styles/style.css`); glass-ui tokens + demo overrides per `DESIGN.md`
- Path aliases: `@src/`, `@components/`, `@composables/`, `@styles/`, `@utils/`, `@assets/`
- Keyboard shortcuts via glass-ui's `registerShortcut` (skipped in editable targets)
- Heavy panes lazy-load: `defineAsyncComponent` for the Monaco-bearing `KeyframesStringControls`/`KeyframeTimeline`; scenes lazy-load through `app/scenes.ts`
- Stores: vueuse `createGlobalState` + `useStorage` (localStorage, 7-day TTL); never Pinia
- Animation objects are `markRaw` — Vue reactivity is bridged by gated rAF polling (`useAnimationSync`)
- Pointer Events + `setPointerCapture` for drag containment; EVERY drag seam routes select-suppression through `gestureSelectSuppression` (`useDragScrub` + `useDragCapture`)
- Euler convention: quaternion ↔ Euler extraction must match `Rx · Ry · Rz` (`quaternionEuler.ts`; `useTransformState` consumption order)
