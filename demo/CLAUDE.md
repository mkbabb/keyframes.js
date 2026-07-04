# demo/

Vue 3 demo. ONE multi-scene SPA — `app/` — is the demo: `npm run dev` serves it, `npm run gh-pages` builds it to `dist/gh-pages/` (deployed at keyframes.babb.dev). `app/` is the shell + scene machine + router; each scene lives in a SELF-CONTAINED `scenes/<name>/` directory that co-locates its `<Name>Scene.vue` entry with its scene-specific composables and target components (the R.W5 fusion — the old `app/scenes/` entries and the top-level per-scene dirs were merged into `scenes/<name>/`). `playground/` is the one other standalone app (`npm run dev:playground`). Design language: `DESIGN.md` (extends glass-ui's).

## Structure

```
demo/
├── app/                       # THE multi-scene SPA shell (NO scene content — scenes live in scenes/<name>/); S.D1 partition: scene/ · transition/ · runtime/ · chrome/
│   ├── index.html / main.ts / App.vue   # shell: dynamic <component :is> + dock chrome
│   ├── chrome/                # app-private glass-ui dock (S.D2, a24 F3): ChromeDock.vue (scene switcher + pane toggles) + MbabbMenu.vue (@mbabb dropdown)
│   ├── scene/                 # machine↔shell↔route bridge
│   │   ├── scenes.ts          # scene registry: lazy scene loaders (→ ../../scenes/<name>/<Name>Scene.vue), inline-SVG icon family, warmScene()
│   │   ├── sceneExposedApi.ts # the typed SceneExposedApi contract every <Name>Scene.vue exposes
│   │   ├── useSceneMachineShellBinding.ts    # scene-machine ↔ app-shell reconcile (SCENE_READY, play/pause routing)
│   │   ├── useSceneMachineRouterBinding.ts   # scene-machine ↔ router reconcile
│   │   └── router.ts          # hash-mode vue-router; routes select the active scene id (GH-Pages-safe)
│   ├── transition/            # useSceneSwap.ts · useSceneTransition.ts · scene-transition.css (directional VT + SpringProgress cross-dissolve)
│   ├── runtime/               # cross-scene recipes: useRafScene.ts · useSceneVisibilityPause.ts · rafConstants.ts · useContractAnimGroup.ts · useSceneTransport.ts · loaf-observer.ts · useMonacoCancellationGuard.ts
│   └── public/robots.txt
├── scenes/                    # THE fused scenes (R.W5): each dir co-locates <Name>Scene.vue + its composables + targets
│   ├── amiga/        # AmigaScene.vue + AmigaCrtOverlay/AmigaTelemetry, useAmigaThree/useAmigaBoot/useSphereSpin/useAmigaAnimations, amigaKeys, checkerboard.jpg
│   ├── cube/         # CubeScene.vue + CubeTarget/CubeAxisLines, useCubeAnimations/useCubeRelit, cubeTransformStore, matrix-editor/ + orbital-drag/ (S.D2 colocation, a24 F3), cube.png
│   ├── easing/       # EasingScene.vue + EasingSidebar/EasingTarget/EasingHeroStage, useEasingDemo/Gallery/Ghost/TraceSmear, easingGroups/easingKeys
│   ├── morph/        # MorphSVGScene.vue + MorphTarget, useMorphDemo, morphShapes/morphKeys (the fromMorphSVG showcase)
│   ├── motion-path/  # MotionPathScene.vue + MotionPathTarget, useMotionPathDemo/Gesture, motionPathGeometry/motionPathKeys
│   ├── sequence/     # SequenceScene.vue + SequenceTarget/Axis/Playhead/Scrubber, useSequenceDemo/Instrument/useTypedTrigger (S.D2 colocation, a24 F4), sequenceKeys
│   ├── spring/       # SpringScene.vue + SpringSidebar/SpringTarget/StartingStyleTarget/SpringHeatmap/SpringTrace, useSpringDemo/Derby/HotPath/KeyframesEditor/LinearStops/PaneDrag, springKeys/springPresets
│   └── square/       # SquareScene.vue + SquareInstrument, useSquareAnimations/useSquareKeyboard, squareKeys (custom transform fn)
├── @/                         # Shared library
│   ├── state/                  # the demo's global state layer (S.D2 hoist): sceneMachine/useSceneMachine/scenePlaybackAdapters + option stores + controlSurfaceDFA + hashSharing + index (resetAllStores) — @state alias
│   ├── components/custom/
│   │   ├── animation-transport/ # the control-suite shells + controls/ + composables/ (see below)
│   │   ├── keyframes-editor/    # the Monaco CSS keyframes editor (was animation-controls/keyframes/)
│   │   ├── keyframe-timeline/   # the draggable keyframe timeline (was animation-controls/timeline/) + CSSPasteDialog (S.D2 colocation)
│   │   ├── easing-editor/       # EasingEditor + EasingSelect + EasingCurveCanvas + DemoControlPoint cluster (S.D2, a24 F5)
│   │   ├── asset-manager/       # AssetViewport/AssetLayer/AssetLayerPanel/AssetPropertiesPanel + useAssetManager + assetTypes + EditableLabel (playground-private → S.D3 fold)
│   │   ├── editor-shell/        # EditorShell, EditorHeader, EditorStartScreen, SharePopover + useShareState + AnimatedText/TypingDots/KeyboardShortcutsModal (S.D2 colocation)
│   │   └── singles: CopyButton, KfPillTabs   # the two genuinely-shared flat leaves (S.D2 shed the rest)
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

## Animation Controls (`@/components/custom/animation-transport/`)

The primary UI for interacting with animations. S.D2 carved the former
`animation-controls/` monolith into three sibling `@/` peers —
`animation-transport/` (the shells + `controls/` + `composables/`, below),
`keyframes-editor/` (was `keyframes/`), `keyframe-timeline/` (was `timeline/`) —
and hoisted the state layer to `@/state/` (`@state`). Top level of
`animation-transport/`: **AnimationControlsGroup.vue** (orchestrates
`AnimationGroup`: scrub-pause-resume, playback delegation), **TransportDock.vue**,
`animationDescriptions.ts`, `injectionKeys.ts`, `index.ts`.

- **`components/`** — `ControlsPaneWrapper.vue`, `RibbonBar.vue`
- **`composables/`** — `useAnimationGroupPlayback` (scrub-pause-resume state machine), `useAnimationProgress` (rAF progress polling), `useControlsLayout`, `usePaneHover`, `useRafLoop`, `useScrollFade`, `useSheetGesture`, `useSheetSpring`
- **`controls/`** — `AnimationControls.vue` (tab panel; lazy-loads the Monaco-bearing panes), `AnimationControlsControls.vue` (duration/delay/iterations/direction/fill/easing), `AnimationVisualizer.vue` (progress ball; `calc(100cqw - 100%)` + `bumpLayoutEpoch` on container resize), `LayerConfigPanel.vue`, `PlaybackRibbon.vue`, `TimingFunctionPanel.vue`; `controls/composables/`: `useAnimationSync` (markRaw animation → Vue reactivity via gated `useRafFn` polling), `useDragCapture` (control-surface drags: bezier handles, timeline diamonds, sequence rows), `usePlaybackToggle`, `useTimingFunctionEditor`; `timingCurveUtils.ts`; `playback-button.css`, `tab-trigger.css`
- **peer `keyframes-editor/`** (was `keyframes/`) — `CSSCodeEditor.vue` (Monaco wrapper), `KeyframeCard.vue`, `KeyframesEditor.vue`, `KeyframesStringControls.vue`; `components/`: `KeyframeCardList`, `KeyframesAddDialog`; `composables/`: `useApplyCSS`, `useHighlightCSS`, `useKeyframeOps`, `useKeyframesEditor`, `useKeyframesParsing`, `useKeyframesState`; `monaco-themes/` (Dracula, GitHub); `utils/`: `contenteditable.ts`, `parseAnimationCSS.ts`
- **peer `@/state/`** (S.D2 hoist, was `stores/`) — `animationOptionsStore.ts` + `controlOptionsStore.ts` (vueuse `createGlobalState` + `useStorage`, 7-day TTL via `storeUtils.ts`), `controlSurfaceDFA.ts` (the control-surface single-authority DFA), `sceneMachine.ts` + `scenePlaybackAdapters.ts` + `useSceneMachine.ts` (the scene state machine + per-scene playback adapters; machine context persists to localStorage), `hashSharing.ts` (URL-param state encode/decode/restore), `index.ts` (barrel + `resetAllStores` + `registerStoreReset`)
- **peer `keyframe-timeline/`** (was `timeline/`) — `KeyframeTimeline.vue` (draggable diamonds, playhead, import/export), `TimelineCaret.vue`; `components/`: `TimelineHoverPreview` (html2canvas), `TimelineTrack`; `composables/`: `useTimeline`, `useTimelineBuild`, `useTimelineOps`, `useZoomPan`; `timelineTypes.ts`; `utils/`: `flattenVars`, `snapshotCapture` (getComputedStyle → keyframes), `timelineEngine` (build/export/import CSS)

## Scenes

Each scene is a self-contained `scenes/<name>/` directory: `<Name>Scene.vue` (the entry, lazy-loaded
via `app/scene/scenes.ts`, exposing the typed `SceneExposedApi`) co-located with its composables + targets.

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
- Heavy panes lazy-load: `defineAsyncComponent` for the Monaco-bearing `KeyframesStringControls`/`KeyframeTimeline`; scenes lazy-load through `app/scene/scenes.ts`
- Stores: vueuse `createGlobalState` + `useStorage` (localStorage, 7-day TTL); never Pinia
- Animation objects are `markRaw` — Vue reactivity is bridged by gated rAF polling (`useAnimationSync`)
- Pointer Events + `setPointerCapture` for drag containment; EVERY drag seam routes select-suppression through `gestureSelectSuppression` (`useDragScrub` + `useDragCapture`)
- Euler convention: quaternion ↔ Euler extraction must match `Rx · Ry · Rz` (`quaternionEuler.ts`; `useTransformState` consumption order)
