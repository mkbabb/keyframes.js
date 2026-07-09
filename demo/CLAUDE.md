# demo/

Vue 3 demo. ONE multi-scene SPA — `app/` — is the demo: `npm run dev` serves it, `npm run gh-pages` builds it to `dist/gh-pages/` (deployed at keyframes.babb.dev). `app/` is the shell + scene machine + router; each scene lives in a SELF-CONTAINED `scenes/<name>/` directory that co-locates its `<Name>Scene.vue` entry with its scene-specific composables and target components (the R.W5 fusion — the old `app/scenes/` entries and the top-level per-scene dirs were merged into `scenes/<name>/`). Six scenes ship: amiga · cube · easing · sequence · spring · square (compose · morph · motion-path were PRUNED at T.E1/T.E3, OD-1 = PRUNE). Design language: `DESIGN.md` (extends glass-ui's).

## Structure

```
demo/
├── app/                       # THE multi-scene SPA shell (NO scene content — scenes live in scenes/<name>/); S.D1 partition: scene/ · transition/ · runtime/ · dock/
│   ├── index.html / main.ts / App.vue   # shell: dynamic <component :is> + dock chrome
│   ├── dock/                  # app-private glass-ui dock (T.F3 — was chrome/; a24 F3): ChromeDock.vue (scene switcher + pane toggles) + MbabbMenu.vue (@mbabb dropdown)
│   ├── scene/                 # machine↔shell↔route bridge
│   │   ├── scenes.ts          # scene registry: lazy scene loaders (→ ../../scenes/<name>/<Name>Scene.vue), inline-SVG icon family, warmScene()
│   │   ├── sceneExposedApi.ts # the typed SceneExposedApi contract every <Name>Scene.vue exposes
│   │   ├── useSceneMachineShellBinding.ts    # scene-machine ↔ app-shell reconcile (SCENE_READY, play/pause routing)
│   │   ├── useSceneMachineRouterBinding.ts   # scene-machine ↔ router reconcile
│   │   └── router.ts          # hash-mode vue-router; routes select the active scene id (GH-Pages-safe)
│   ├── transition/            # useSceneSwap.ts · useSceneTransition.ts (VT dispatch over kf's viewTransition + SpringProgress cross-dissolve fallback; NO demo-side ::view-transition CSS — glass-ui owns the look, S.G2 S11)
│   ├── runtime/               # cross-scene recipes: useRafScene.ts · useSceneVisibilityPause.ts · rafConstants.ts · useSceneTransport.ts · loaf-observer.ts · useMonacoCancellationGuard.ts
│   └── public/robots.txt
├── scenes/                    # THE fused scenes (R.W5): each dir co-locates <Name>Scene.vue + its composables + targets
│   ├── amiga/        # AmigaScene.vue + AmigaCrtOverlay/AmigaTelemetry, useAmigaThree/useAmigaBoot/useSphereSpin/useAmigaDemo, utils (tesselateSphere), amigaKeys, checkerboard.jpg
│   ├── cube/         # CubeScene.vue + CubeTarget/CubeAxisLines, useCubeDemo/useCubeRelit, cubeTransformStore, matrix-editor/ + orbital-drag/ (S.D2 colocation, a24 F3), cube.png
│   ├── easing/       # EasingScene.vue + EasingTarget (the OD-7 specimen GALLERY — 33 tiles, ONE shared clock, T.E6) + EasingSidebar (the Curve-facet body = glass-ui EasingPicker, T.E8), useEasingDemo, easingGroups/easingKeys (hero/Ghost/TraceSmear DELETED at T.E6; CurvePhysics + gallery-door DELETED at T.E7 — VERDICT #13/#15)
│   ├── sequence/     # SequenceScene.vue + SequenceTarget/Axis/Playhead/Scrubber, useSequenceDemo/Instrument/useTypedTrigger (S.D2 colocation, a24 F4), sequenceKeys
│   ├── spring/       # SpringScene.vue + SpringPhysicsFacet (T.B7 — the sidebar dissolved into the facility facet)/SpringTarget/StartingStyleTarget/SpringHeatmap/SpringTrace, useSpringDemo/Derby/HotPath/KeyframesEditor/LinearStops/useCompiledEntry (S.F3 EN-d entry/exit dogfood), springKeys/springPresets
│   └── square/       # SquareScene.vue + SquareInstrument, useSquareDemo/useSquareKeyboard, squareKeys (custom transform fn)
│   # (morph/ · motion-path/ · compose/ were PRUNED at T.E1/T.E3, OD-1 = PRUNE; the
│   #  LIBRARY MotionPath/MorphSVG/DrawSVG factories in src/animation/svg/ survive.)
├── @/                         # Shared library
│   ├── state/                  # the demo's global state layer (S.D2 hoist): sceneMachine/useSceneMachine/scenePlaybackAdapters + option stores + controlSurfaceDFA + hashSharing + index (resetAllStores) — @state alias
│   ├── components/custom/
│   │   ├── instrument/          # THE control facility (T.F5 fold) — the four cohering peers under ONE lazy barrel (index.ts: `export type` + `defineAsyncComponent`, no eager Monaco/highlight.js)
│   │   │   ├── transport/       # the control-suite shells + controls/ + composables/ + KfPillTabs/useKfPillTabs (was animation-transport/; see below)
│   │   │   ├── keyframes/       # the Monaco CSS keyframes editor (was keyframes-editor/)
│   │   │   ├── timeline/        # the draggable keyframe timeline (was keyframe-timeline/) + CSSPasteDialog (S.D2 colocation)
│   │   │   └── shell/           # EditorShell, EditorHeader, EditorStartScreen, SharePopover + useShareState + AnimatedText/TypingDots/KeyboardShortcutsModal + useHeroSourceEgg (was editor-shell/)
│   │   │   # (instrument/easing/ — the 1,082L hand-rolled EasingEditor/EasingSelect/EasingCurveCanvas/DemoControlPoint cluster — was DELETED at T.E8: glass-ui's EasingPicker is the sole curve-authoring surface)
│   │   └── CopyButton.vue       # the one genuinely-shared flat leaf beside the facility
│   │                            # (components/ui/ is GONE — the last shadcn island, ui/menubar/, was migrated off + deleted at S.C3b, C-19)
│   ├── composables/
│   │   ├── gestureSelectSuppression.ts  # the ONE global drag-in-flight select-suppression token (body.is-dragging)
│   │   └── useDragScrub.ts              # the ONE shared pointer-drag scrub seam (stage rails, square box)
│   ├── styles/                  # per-concern, each ≤300L (proof:style-file-ceiling): style.css (Tailwind v4 entry + @theme + color/accent tokens + @layer base/utilities/demo-typography), layout.css (work-area/dock/rail geometry + @media + @supports), design-idioms.css (the rainbow/gold signal tokens + shared idiom recipes + @keyframes enter), brand.css (the ppmycota mark)
│   └── utils/                   # clipboard.ts, iosTextEntry.ts, kfEngine.ts, toastGuard.ts (vue-sonner private-DOM contract) — the shadcn cn() helper (utils.ts) went with ui/menubar (S.C3b)
├── CLAUDE.md
└── DESIGN.md     # demo design language (extends glass-ui DESIGN.md)
```

**The `demo/@` → `shared` rename, ruled terminally (S.D4 S4).** `demo/@/` is an
actual on-disk directory literally named `@` (not a bundler alias — neither
`vite.config.ts` nor `tsconfig.json` declares a bare `@` path), imported
everywhere as `@/…`. S.D4 considered renaming it to a self-explaining `shared/`
and RULED to keep `@/`: every consumer already spells the short form, the
directory's role (the one cross-scene shared library, vs. `app/` the shell and
`scenes/<name>/` the per-scene homes) is unambiguous from its siblings, and a
rename would touch every import in the tree for a documentation-only gain. Alias
churn buys nothing — this decision is terminal, not deferred.

## Animation Controls (`@/components/custom/instrument/`)

The primary UI for interacting with animations. S.D2 carved the former
`animation-controls/` monolith into sibling peers; **T.F5 (THE GRAND COLOCATION
EDICT) folds them into ONE `instrument/` facility** — `instrument/{transport,
keyframes, timeline, shell}/` cohered under a real lazy barrel
(`instrument/index.ts`: `export type` + `defineAsyncComponent` re-exports,
replacing animation-transport's old empty "don't import me" stub) that keeps the
Monaco/highlight.js chunk split (the idle-warm pane-reveal seam,
`transport/controls/composables/useKeyframesPaneReveal.ts`, is preserved by
construction — `AnimationControls.vue`'s `import()` calls own pane laziness).
`instrument/easing/` (was `easing-editor/`, the transient E8 co-tenant) was
DELETED at T.E8 — the demo consumes glass-ui's `EasingPicker` (the easing
scene's Curve facet body under `scenes/easing/` + the `TimingFunctionPanel.vue`
detail body) instead of the 1,082L hand-rolled cluster. The state layer lives at `@/state/`
(`@state`). Top level of `transport/`: **AnimationControlsGroup.vue** + its
scoped-CSS split `AnimationControlsGroup.css` (orchestrates `AnimationGroup`:
scrub-pause-resume, playback delegation), **TransportDock.vue**, **KfPillTabs.vue**
+ `useKfPillTabs.ts`, `animationDescriptions.ts`, `injectionKeys.ts`, `transportSource.ts`,
`index.ts` (the transport barrel).

- **`components/`** — `ControlsPaneWrapper.vue` + its scoped-CSS split `ControlsPaneWrapper.css` (P2-1 F6 — a template/CSS split, import-neutral), `RibbonBar.vue`, `DemoGlobalChrome.vue` (the document-level singletons extracted from the layout root), 
- **`composables/`** — the flattened one-tier composables home (T.F6 killed the double-nested `controls/composables/`): `useAnimationGroupPlayback` (scrub-pause-resume state machine), `useAnimationGroupActions`, `useAnimationProgress` (rAF progress polling), `useControlsKeyboardShortcuts`, `useControlsLayout`, `usePaneHover`, `usePaneRegister`, `usePlayActuation` (the TransportDock play-toggle actuation core, S.B7 fold row 71), `useRafLoop`, `useScrollFade`, `useSheetGesture`, `useSheetSpring`, `useSheetState` + the former control-surface composables `useAnimationSync` (markRaw animation → Vue reactivity via gated `useRafFn` polling), `useDragCapture` (control-surface drags: bezier handles, timeline diamonds, sequence rows), `useKeyframesPaneReveal` (the Monaco idle-warm pane-reveal seam), `usePlaybackToggle`, `useSelectedControlSurface`, `useTabStripScroll`, `useTimingFunctionEditor`
- **`controls/`** — `AnimationControls.vue` (tab panel; lazy-loads the Monaco-bearing panes), `AnimationControlsControls.vue` (duration/delay/iterations/direction/fill/easing), `AnimationVisualizer.vue` (progress ball; `calc(100cqw - 100%)` + `bumpLayoutEpoch` on container resize), `LayerConfigPanel.vue`, `PlaybackRibbon.vue`, `TimingFunctionPanel.vue`; `timingCurveUtils.ts`; `playback-button.css`, `tab-trigger.css` (its composables were hoisted to `transport/composables/` at T.F6)
- **peer `instrument/keyframes/`** (was `keyframes-editor/`) — `CSSCodeEditor.vue` (Monaco wrapper), `KeyframeCard.vue`, `KeyframesEditor.vue`, `KeyframesStringControls.vue`, `index.ts` (lazy barrel); `components/`: `KeyframeCardList`, `KeyframesAddDialog`; `composables/`: `useApplyCSS`, `useHighlightCSS`, `useKeyframeOps`, `useKeyframesEditor`, `useKeyframesParsing`, `useKeyframesState`, `useToolbarKeyboard` (WAI-ARIA roving-tabindex core); `monaco-themes/` (Dracula, GitHub); `utils/`: `contenteditable.ts`, `parseAnimationCSS.ts`
- **peer `instrument/timeline/`** (was `keyframe-timeline/`) — `KeyframeTimeline.vue` (draggable diamonds, playhead, import/export), `TimelineCaret.vue`, `CSSPasteDialog.vue` (S.D2 colocation), `index.ts` (lazy barrel); `components/`: `TimelineHoverPreview` (html2canvas), `TimelineTrack`; `composables/`: `useTimeline`, `useTimelineBuild`, `useTimelineOps`, `useZoomPan`; `timelineTypes.ts`; `utils/`: `flattenVars`, `snapshotCapture` (getComputedStyle → keyframes), `timelineEngine` (build/export/import CSS)
- **peer `instrument/shell/`** (was `editor-shell/`) — `EditorShell.vue`, `EditorHeader.vue`, `EditorStartScreen.vue`, `SharePopover.vue` + `index.ts` (barrel) + `useShareState.ts` + `AnimatedText`/`TypingDots`/`KeyboardShortcutsModal`/`HeroAurora`/`useHeroSourceEgg` (L.W11.S1 the live @keyframes source card)
- **peer `@/state/`** (S.D2 hoist, was `stores/`) — `animationOptionsStore.ts` + `controlOptionsStore.ts` (vueuse `createGlobalState` + `useStorage`, 7-day TTL via `storeUtils.ts`), `controlSurfaceDFA.ts` (the control-surface single-authority DFA), `sceneMachine.ts` + `scenePlaybackAdapters.ts` + `useSceneMachine.ts` (the scene state machine + per-scene playback adapters; machine context persists to localStorage), `hashSharing.ts` (URL-param state encode/decode/restore), `index.ts` (barrel + `resetAllStores` + `registerStoreReset`)

## Scenes

Each scene is a self-contained `scenes/<name>/` directory: `<Name>Scene.vue` (the entry, lazy-loaded
via `app/scene/scenes.ts`, exposing the typed `SceneExposedApi`) co-located with its composables + targets.

| Scene | Directory | Key feature |
|---|---|---|
| CubeScene | `scenes/cube/` | 3 synchronized animations, 3D CSS cube, matrix editor, orbital drag |
| AmigaScene | `scenes/amiga/` | Three.js sphere, multi-axis rotation + checkerboard spin |
| SquareScene | `scenes/square/` | Custom transform fn, nested object interpolation |
| EasingScene | `scenes/easing/` | The specimen gallery (33 curves, ONE shared clock) + the glass-ui EasingPicker Curve facet |
| SpringScene | `scenes/spring/` | Spring presets, `linear()` stops, `@starting-style` target, heatmap |
| SequenceScene | `scenes/sequence/` | `Sequence` master-playhead transport, draggable rows |

## Key Dependencies

- `vue` ^3.5 + `vue-router` (hash mode) + `@vueuse/core`
- `@mkbabb/glass-ui` `~4.0.0` (in `optionalDependencies`) — the demo chrome: dock, header ribbon, keyboard shortcuts (`registerShortcut` from `@mkbabb/glass-ui/keyboard`), dark-mode toggle, buttons/dialogs/tooltips
- `reka-ui` — glass-ui's headless-primitive peer basis (Dialog/DropdownMenu/Select/…); the last DIRECT demo consumer (the shadcn `ui/menubar`) was retired at S.C3b, so reka-ui now rides in only as glass-ui's peer
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
