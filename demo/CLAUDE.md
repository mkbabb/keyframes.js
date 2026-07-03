# demo/

Vue 3 demo. ONE multi-scene SPA — `app/` — is the demo: `npm run dev` serves it, `npm run gh-pages` builds it to `dist/gh-pages/` (deployed at keyframes.babb.dev). `app/` is the shell + scene machine + router; each scene lives in a SELF-CONTAINED `scenes/<name>/` directory that co-locates its `<Name>Scene.vue` entry with its scene-specific composables and target components (the R.W5 fusion — the old `app/scenes/` entries and the top-level per-scene dirs were merged into `scenes/<name>/`). `playground/` is the one other standalone app (`npm run dev:playground`). Design language: `DESIGN.md` (extends glass-ui's).

## Structure

```
demo/
├── app/                       # THE multi-scene SPA shell (NO scene content — scenes live in scenes/<name>/)
│   ├── index.html / main.ts / App.vue   # shell: KeepAlive + dynamic <component :is> + dock chrome
│   ├── router.ts              # hash-mode vue-router; routes select the active scene id (GH-Pages-safe)
│   ├── scenes.ts              # scene registry: lazy scene loaders (→ ../scenes/<name>/<Name>Scene.vue), inline-SVG icon family, warmScene()
│   ├── sceneExposedApi.ts     # the typed SceneExposedApi contract every <Name>Scene.vue exposes
│   ├── useSceneMachineApp.ts  # scene-machine ↔ app-shell reconcile (SCENE_READY, play/pause routing)
│   ├── useSceneMachineRouter.ts # scene-machine ↔ router reconcile
│   ├── useRafScene.ts         # THE raw-rAF scene recipe: RAFPlayback + ScenePlayback adapter + visibility pause
│   ├── useSceneSwap.ts / useSceneTransition.ts / useSceneVisibilityPause.ts / scene-transition.css
│   ├── composables/           # useContractAnimGroup, useSceneTransport (cross-scene shell recipes)
│   ├── rafConstants.ts / useMonacoCancellationGuard.ts
│   ├── cubeTransformStore.ts  # shared cube matrix state (gl-matrix)
│   ├── loaf-observer.ts       # long-animation-frame diagnostics
│   └── public/robots.txt
├── scenes/                    # THE fused scenes (R.W5): each dir co-locates <Name>Scene.vue + its composables + targets
│   ├── amiga/        # AmigaScene.vue + AmigaCrtOverlay/AmigaTelemetry, useAmigaThree/useAmigaBoot/useSphereSpin/useAmigaAnimations, amigaKeys, checkerboard.jpg
│   ├── cube/         # CubeScene.vue + CubeTarget/CubeAxisLines, useCubeAnimations/useCubeRelit, cube.png
│   ├── easing/       # EasingScene.vue + EasingSidebar/EasingTarget/EasingHeroStage, useEasingDemo/Gallery/Ghost/TraceSmear, easingGroups/easingKeys
│   ├── morph/        # MorphSVGScene.vue + MorphTarget, useMorphDemo, morphShapes/morphKeys (the fromMorphSVG showcase)
│   ├── motion-path/  # MotionPathScene.vue + MotionPathTarget, useMotionPathDemo/Gesture, motionPathGeometry/motionPathKeys
│   ├── sequence/     # SequenceScene.vue + SequenceTarget/Axis/Playhead/Scrubber, useSequenceDemo/Instrument, sequenceKeys
│   ├── spring/       # SpringScene.vue + SpringSidebar/SpringTarget/StartingStyleTarget/SpringHeatmap/SpringTrace, useSpringDemo/Derby/HotPath/KeyframesEditor/LinearStops/PaneDrag, springKeys/springPresets
│   └── square/       # SquareScene.vue + SquareInstrument, useSquareAnimations/useSquareKeyboard, squareKeys (custom transform fn)
├── @/                         # Shared library
│   ├── components/custom/
│   │   ├── animation-controls/  # the control suite (see below)
│   │   ├── asset-manager/       # AssetViewport/AssetLayer/AssetLayerPanel/AssetPropertiesPanel + useAssetManager + assetTypes
│   │   ├── dock/ChromeDock.vue  # glass-ui dock: scene switcher + pane toggles
│   │   ├── editor-shell/        # EditorShell, EditorHeader, EditorStartScreen, SharePopover + useShareState (URL-hash share/restore)
│   │   ├── matrix-editor/       # MatrixEditor.vue + transformMath.ts + useTransformState.ts (gl-matrix)
│   │   ├── orbital-drag/        # quaternion 3D drag: OrbitalDrag.vue, quaternionEuler.ts, useOrbitalPointer/Pinch/Inertia, inertiaDecay
│   │   └── singles: AnimatedText, CSSPasteDialog, CopyButton, DemoControlPoint, EasingCurveCanvas,
│   │              EasingEditor, EasingSelect, EditableLabel, KeyboardShortcutsModal,
│   │              KfPillTabs, TypingDots
│   ├── components/ui/menubar/   # the ONE remaining shadcn-vue component dir (16 files); the rest migrated to @mkbabb/glass-ui
│   ├── composables/
│   │   ├── gestureSelectSuppression.ts  # the ONE global drag-in-flight select-suppression token (body.is-dragging)
│   │   └── useDragScrub.ts              # the ONE shared pointer-drag scrub seam (stage rails, square box)
│   ├── styles/                  # style.css (Tailwind v4 + theme vars), brand.css, design-idioms.css
│   └── utils/                   # utils.ts (cn()), clipboard.ts, iosTextEntry.ts, toastGuard.ts (vue-sonner private-DOM contract)
├── playground/   # standalone app: index.html + App.vue + usePlaygroundAnimations (asset drag-and-drop)
├── CLAUDE.md
└── DESIGN.md     # demo design language (extends glass-ui DESIGN.md)
```

## Animation Controls (`@/components/custom/animation-controls/`)

The primary UI for interacting with animations. Top level: **AnimationControlsGroup.vue** (orchestrates `AnimationGroup`: scrub-pause-resume, playback delegation), **TransportDock.vue**, `animationDescriptions.ts`, `injectionKeys.ts`, `index.ts`.

- **`components/`** — `ControlsPaneWrapper.vue`, `RibbonBar.vue`
- **`composables/`** — `useAnimationGroupPlayback` (scrub-pause-resume state machine), `useAnimationProgress` (rAF progress polling), `useControlsLayout`, `usePaneHover`, `useRafLoop`, `useScrollFade`, `useSheetGesture`, `useSheetSpring`
- **`controls/`** — `AnimationControls.vue` (tab panel; lazy-loads the Monaco-bearing panes), `AnimationControlsControls.vue` (duration/delay/iterations/direction/fill/easing), `AnimationVisualizer.vue` (progress ball; `calc(100cqw - 100%)` + `bumpLayoutEpoch` on container resize), `LayerConfigPanel.vue`, `PlaybackRibbon.vue`, `TimingFunctionPanel.vue`; `controls/composables/`: `useAnimationSync` (markRaw animation → Vue reactivity via gated `useRafFn` polling), `useDragCapture` (control-surface drags: bezier handles, timeline diamonds, sequence rows), `usePlaybackToggle`, `useTimingFunctionEditor`; `timingCurveUtils.ts`; `playback-button.css`, `tab-trigger.css`
- **`keyframes/`** — `CSSCodeEditor.vue` (Monaco wrapper), `KeyframeCard.vue`, `KeyframesEditor.vue`, `KeyframesStringControls.vue`; `components/`: `KeyframeCardList`, `KeyframesAddDialog`; `composables/`: `useApplyCSS`, `useHighlightCSS`, `useKeyframeOps`, `useKeyframesEditor`, `useKeyframesParsing`, `useKeyframesState`; `monaco-themes/` (Dracula, GitHub); `utils/`: `contenteditable.ts`, `parseAnimationCSS.ts`
- **`stores/`** — `animationOptionsStore.ts` + `controlOptionsStore.ts` (vueuse `createGlobalState` + `useStorage`, 7-day TTL via `storeUtils.ts`), `controlSurfaceDFA.ts` (the control-surface single-authority DFA), `sceneMachine.ts` + `scenePlaybackAdapters.ts` + `useSceneMachine.ts` (the scene state machine + per-scene playback adapters; machine context persists to localStorage), `hashSharing.ts` (URL-param state encode/decode/restore), `index.ts` (barrel + `resetAllStores`)
- **`timeline/`** — `KeyframeTimeline.vue` (draggable diamonds, playhead, import/export), `TimelineCaret.vue`; `components/`: `TimelineHoverPreview` (html2canvas), `TimelineTrack`; `composables/`: `useTimeline`, `useTimelineBuild`, `useTimelineOps`, `useZoomPan`; `timelineTypes.ts`; `utils/`: `flattenVars`, `snapshotCapture` (getComputedStyle → keyframes), `timelineEngine` (build/export/import CSS)

## Scenes

Each scene is a self-contained `scenes/<name>/` directory: `<Name>Scene.vue` (the entry, lazy-loaded
via `app/scenes.ts`, exposing the typed `SceneExposedApi`) co-located with its composables + targets.

| Scene | Directory | Key feature |
|---|---|---|
| CubeScene | `scenes/cube/` | 3 synchronized animations, 3D CSS cube, matrix editor, orbital drag |
| AmigaScene | `scenes/amiga/` | Three.js sphere, multi-axis rotation + checkerboard spin |
| SquareScene | `scenes/square/` | Custom transform fn, nested object interpolation |
| EasingScene | `scenes/easing/` | Easing gallery + unified easing editor |
| SpringScene | `scenes/spring/` | Spring presets, `linear()` stops, `@starting-style` target, heatmap |
| SequenceScene | `scenes/sequence/` | `Sequence` master-playhead transport, draggable rows |
| MotionPathScene | `scenes/motion-path/` | `offset-path` editing + gesture |
| MorphSVGScene | `scenes/morph/` | `fromMorphSVG` path morph showcase (on-DOM render contract + orient-along-path) |

Plus the standalone `playground/`: asset drag-and-drop viewport with preset animation binding.

## Key Dependencies

- `vue` ^3.5 + `vue-router` (hash mode) + `@vueuse/core`
- `@mkbabb/glass-ui` `~4.0.0` (in `optionalDependencies`) — the demo chrome: dock, header ribbon, keyboard shortcuts (`registerShortcut` from `@mkbabb/glass-ui/keyboard`), dark-mode toggle, buttons/dialogs/tooltips
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
