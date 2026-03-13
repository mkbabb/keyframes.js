# demo/

Vue 3 demo applications showcasing keyframes.js. Each subdirectory is a standalone Vite app with its own `index.html`. The `cube/` demo is the default for `npm run dev` and `npm run gh-pages`.

## Structure

```
demo/
├── @/                           # Shared library
│   ├── components/
│   │   ├── custom/
│   │   │   ├── animation-controls/  # Core control suite (see below)
│   │   │   ├── editor-shell/        # Reusable editor layout (see below)
│   │   │   ├── asset-manager/         # Asset playground: viewport, layer panel, drag-and-drop
│   │   │   ├── color-picker/         # Multi-color-space picker suite (spectrum, sliders, saved)
│   │   │   ├── matrix-editor/       # 4×4 matrix3d cell grid + slider
│   │   │   ├── dark-mode-toggle/    # Sun/moon SVG toggle (@vueuse useDark)
│   │   │   ├── orbital-drag/        # Quaternion-based 3D drag (gl-matrix, Pointer Events)
│   │   │   ├── Animated.vue         # Fade in/out wrapper using library presets
│   │   │   ├── AnimatedText.vue     # Staggered per-character animation
│   │   │   ├── ColorPicker.vue      # Standalone color picker (legacy)
│   │   │   ├── CommandPalette.vue   # Cmd+K palette
│   │   │   ├── CopyButton.vue      # Clipboard + feedback animation
│   │   │   ├── IconTooltip.vue      # Tooltip wrapper
│   │   │   ├── KeyboardShortcutsModal.vue # Dialog showing registered keyboard shortcuts
│   │   │   ├── LabeledInput.vue     # DRY: label + tooltip + input row
│   │   │   ├── LabeledSelect.vue    # DRY: label + tooltip + select dropdown row
│   │   │   └── ResponsiveSelect.vue # Select with custom trigger/item/extra slots
│   │   └── ui/                      # shadcn-vue components (50+)
│   ├── composables/
│   │   ├── useKeyboardShortcuts.ts  # Singleton keyboard shortcut registry (Mod, combo parsing)
│   │   ├── useShareState.ts         # URL hash share/load with no-reload restore
│   │   └── useTransformState.ts     # Matrix3d math, transform sliders, rAF watcher
│   ├── styles/
│   │   ├── style.css                # Tailwind v4 + light/dark theme vars
│   │   └── utils.css                # Fonts (Fraunces, Fira Code), rainbow effects, 3D
│   └── utils/
│       └── utils.ts                 # cn() — clsx + tailwind-merge
├── cube/          # 3D cube: AnimationGroup, OrbitalDrag, matrix editor
│   ├── App.vue            # ~170 lines — composes EditorShell + CubeTarget
│   ├── CubeTarget.vue     # Cube sides, OrbitalDrag, idle bob, pp mode, axis lines
│   └── useCubeAnimations.ts # Cube-specific animation creation (matrix, rotation, hover)
├── simple/        # Minimal: single CSSKeyframesAnimation + controls
├── square/        # Custom transform fn with object-based keyframes
├── amiga/         # 3D animated sphere (Three.js), multi-axis rotation + color cycling
├── playground/    # Asset playground: drag-and-drop viewport with preset animation binding
├── balls/         # Vanilla JS: CSS vars, staggered animations
├── boxes/         # Vanilla JS: matrix3d transforms, complex keyframes
└── bench/         # Benchmark: rAF vs CSS @keyframes vs WAAPI (FPS, dropped frames)
```

## Animation Controls (`@/components/custom/animation-controls/`)

The primary UI for interacting with animations across demos. Organized into subdirectories by concern.

- **AnimationControlsGroup.vue** — Orchestrates `AnimationGroup`: pauses group during scrub, resumes on release. Delegates playback to `useAnimationGroupPlayback`, progress polling to `useAnimationProgress`.
- **AnimationMenuBar.vue** — Bottom-fixed menubar: animation selector dropdown, play/pause, reset.
- **animationStores/** — Directory module (barrel re-export via `index.ts`). Split by concern:
  - `animationOptionsStore.ts` — `StoredAnimationOptions` types + defaults, lazy localStorage singleton, `getStoredAnimationOptions`, `createAnimationUUId`.
  - `controlOptionsStore.ts` — `StoredAnimationGroupControlOptions` (typed, no index signature), lazy localStorage singleton, `getStoredAnimationGroupControlOptions`.
  - `hashSharing.ts` — `encodeStateToHash`, `decodeStateFromHash`, `getAllState`, `restoreStateFromHash`, `initFromHash`.
  - `scenePlayback.ts` — `ScenePlaybackState`, per-scene ephemeral playback CRUD, active scene tracking.
  - `storeUtils.ts` — `checkAndResetExpiredStore`, `touchTimestamp`, `deepDefaultStore`, `getAnimationSuperKey`, TTL/key constants.
  - `index.ts` — barrel re-export + `resetAllStores`.
- **useAnimationGroupPlayback.ts** — Composable: scrub-pause-resume state machine, play/pause orchestration, animation selection.
- **useAnimationProgress.ts** — Composable: rAF-driven progress polling for all animations in group.

### `controls/` — Sliders, easing editors, playback ribbon

- **AnimationControls.vue** — Filing-tab panel: Controls | Keyframes | Timeline. Bouncy sliding indicator, `Teleport`-based timeline expansion.
- **AnimationControlsControls.vue** — Duration, delay, iterations, direction, fill, easing (uses `LabeledInput`/`LabeledSelect`). Crossfade transition between main controls and detail panel (cubic-bezier/steps).
- **PlaybackRibbon.vue** — Slider + visualizer + play/pause/reverse. Teleported to active animation.
- **TimingFunctionPanel.vue** — Detail panel for cubic-bezier or steps editing, with back-navigation.
- **CubicBezierControls.vue** — SVG bezier curve editor with draggable control points.
- **LayerConfigPanel.vue** — Z-index, blend mode, weight, enabled toggle (grouped animations).
- **ColorInterpolationPanel.vue** — Color space + hue method selects.
- **AnimationVisualizer.vue** — Timeline progress ball: pointer capture, linear positioning, rAF sync.
- **useAnimationSync.ts** — Composable: bridges `markRaw` Animation objects to Vue reactivity via rAF polling. Exposes `currentT`, `isPlaying`, `isStarted`, `isReversed`.
- **timingCurveUtils.ts** — Pure functions: `generateCurveSVGPath`, `generateStepSVGPath`, `getCurvePath` with cache.

### `keyframes/` — CSS @keyframes editing

- **CSSCodeEditor.vue** — Reusable Monaco editor wrapper: `defineModel`, formatCSS, dark mode, ResizeObserver deferred init.
- **KeyframesStringControls.vue** — CSS @keyframes editing via CSSCodeEditor with copy/format/apply actions.
- **KeyframesEditor.vue** — Frame-by-frame position/CSS editing. Uses `KeyframeCard` for each frame. DOM-specific logic (highlight.js, brush animation, progress bars).
- **useKeyframesEditor.ts** — Composable: CSS string management, stored controls, parsing/formatting, debounced updates extracted from KeyframesEditor.
- **KeyframeCard.vue** — Single keyframe: start input, contenteditable CSS, remove/copy buttons.
- **useHighlightCSS.ts** — Composable: manages a `<style>` element in `document.head` for dynamic CSS injection.

### `timeline/` — Horizontal keyframe timeline

- **KeyframeTimeline.vue** — Expand/collapse, draggable diamond markers, hover previews (html2canvas), playhead, inline CSS editing, import/export. Delegates zoom/pan to `useZoomPan`.
- **useZoomPan.ts** — Composable: zoom level, pan offset, coordinate transforms, wheel/pinch handlers.
- **TimelineCaret.vue** — Positioned caret for keyframe percent labels with inline editing.
- **timelineTypes.ts** — `TimelineKeyframe`, `TimelineState` interfaces + default capture properties.
- **timelineEngine.ts** — `buildAnimationFromTimeline`, `exportTimelineToCSS`, `importCSSToTimeline`.
- **snapshotCapture.ts** — `captureSnapshot` reads `getComputedStyle` to create keyframes.
- **useTimeline.ts** — Composable: timeline state, keyframe CRUD, scrubbing, `scrubAndCapture`, animation rebuild, CSS import/export.

## Editor Shell (`@/components/custom/editor-shell/`)

Reusable full-page animation editor layout. Slot-driven — accepts any target element.

- **EditorShell.vue** — Grid background, header, start screen, `AnimationControlsGroup` wrapper. Slots: `#header-left`, `#header-right`, `#start-screen`, `#tabs-trigger`, `#tabs-content`, `#target`.
- **EditorHeader.vue** — Fixed-position header bar with left/right slot areas.
- **EditorStartScreen.vue** — "Select an animation..." overlay with configurable text.
- **SharePopover.vue** — Self-contained share/load popover using `useShareState`.

## Matrix Editor (`@/components/custom/matrix-editor/`)

- **MatrixEditor.vue** — 4×4 matrix3d cell grid with slider, reset/lock buttons. Props-driven via `matrix3dEnd`, `matrixCellMeta`, `superKey`.

## Composables (`@/composables/`)

- **useKeyboardShortcuts.ts** — Singleton keyboard shortcut registry (`createGlobalState`). Single `window` keydown listener, `Mod` alias (Meta on macOS, Ctrl elsewhere), editable target detection (input/textarea/contenteditable/Monaco). Auto-cleanup via `onScopeDispose`.
- **useShareState.ts** — URL hash encode/decode, clipboard copy, no-reload state restore via `stateVersion` counter.
- **transformMath.ts** — Pure utilities: `createMatrix`, axis/transform index helpers, slider option constants, `MatrixCellMeta` interface.
- **useTransformState.ts** — Composable: reactive transform slider values, rAF-debounced watcher, animated matrix reset. Imports math from `transformMath.ts`.
- **useExclusiveSelect.ts** — Mutual-exclusion for dropdowns: only one open at a time.

## Demo Apps

| Demo | Framework | Key Feature |
|------|-----------|-------------|
| `cube/` | Vue | 3 synchronized animations, 3D cube, matrix editor, EditorShell, URL sharing |
| `simple/` | Vue | Single animation: translateX/Y + rotate + color |
| `square/` | Vue | Custom transform fn, nested object interpolation |
| `amiga/` | Vue + Three.js | 3D sphere with multi-axis rotation + color cycling |
| `playground/` | Vue | Asset drag-and-drop viewport with preset animation binding |
| `balls/` | Vanilla TS | `parseCSSKeyframes()` + CSS custom properties |
| `boxes/` | Vanilla TS | Matrix3D transforms, complex keyframes |
| `bench/` | Vanilla TS | FPS/dropped frames across rAF, CSS, WAAPI engines |

## Key Dependencies

- `vue` 3.5, `@vueuse/core` — reactivity, composables, dark mode
- `reka-ui` — headless UI primitives (shadcn-vue basis)
- `three` + `three/examples/jsm/controls/OrbitControls.js` — 3D rendering (amiga only; cube uses CSS 3D transforms)
- `gl-matrix` — quaternion math (orbital-drag); used directly but only present as a transitive dependency
- `monaco-editor` — CSS keyframes editor (wrapped by CSSCodeEditor)
- `html2canvas` — keyframe diamond hover previews (timeline)
- `@mkbabb/value.js` — Color class (ColorPicker)

## Conventions

- Tailwind v4 with CSS variable theme (light/dark via `.dark` class)
- Path aliases: `@components/`, `@composables/`, `@styles/`, `@utils/`
- `defineModel()` for two-way binding (Input, Textarea, CSSCodeEditor, ResponsiveSelect, Calendar)
- Lazy-loaded heavy components (`defineAsyncComponent` for `KeyframesStringControls`, `KeyframeTimeline`—which contain Monaco)
- Safari private browsing: localStorage fallback to plain `ref()`
- Pointer Events + `setPointerCapture` for drag containment (OrbitalDrag, AnimationVisualizer); touch pinch on container only
- Keyboard shortcuts via `registerShortcut()` composable; skipped in editable targets (input, textarea, Monaco)
- Modifier keys (shift/ctrl/meta) read from event properties, not keydown/keyup tracking
- Euler convention: quaternion ↔ Euler extraction must match `Rx * Ry * Rz` (useTransformState consumption order)
