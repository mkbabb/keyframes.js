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
│   │   │   ├── ColorPicker.vue      # Standalone color picker (legacy)
│   │   │   ├── CommandPalette.vue   # Cmd+K palette
│   │   │   ├── CopyButton.vue      # Clipboard + feedback animation
│   │   │   ├── KeyboardShortcutsModal.vue # Dialog showing registered keyboard shortcuts
│   │   │   └── IconTooltip.vue      # Tooltip wrapper
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

The primary UI for interacting with animations across demos.

- **AnimationControls.vue** — Filing-tab panel: Controls | Keyframes | Timeline. Bouncy sliding indicator (cubic-bezier overshoot), `bg-card` background, overflow `…` when extra tabs exceed width. Timeline uses `Teleport` to expand into bottom bar (survives tab switches).
- **AnimationControlsControls.vue** — Sliders for duration, delay, iterations, direction, fill, easing. Cubic-bezier + steps editors. Playback ribbon (slider + visualizer + play/pause/reverse/reset) teleported to active animation. Emits `scrubStart`/`scrubEnd` for group-level pause during drag.
- **AnimationControlsGroup.vue** — Orchestrates `AnimationGroup`: pauses group during scrub (slider or visualizer drag), resumes on release. Grid row for expanded timeline target. Exposes slot props (`selectedAnimation`, `isPlaying`).
- **AnimationMenuBar.vue** — Bottom-fixed menubar: animation selector dropdown, play/pause, reset, keyboard shortcuts.
- **TimingFunctionPanel.vue** — Detail panel for editing cubic-bezier or steps timing functions, with back-navigation.
- **CubicBezierControls.vue** — SVG bezier curve editor with draggable control points.
- **CSSCodeEditor.vue** — Reusable Monaco editor wrapper: v-model, formatCSS, dark mode, ResizeObserver deferred init.
- **KeyframesStringControls.vue** — CSS @keyframes editing via CSSCodeEditor with floating paste/format/apply icons.
- **KeyframeTimeline.vue** — Horizontal timeline: expand/collapse toggle, draggable diamond markers with hover previews (html2canvas snapshot + ghost CSS fallback), playhead, inline keyframe CSS editing via CSSCodeEditor, import/export.
- **TimelineCaret.vue** — Positioned caret for keyframe percent labels with inline editing.
- **KeyframesEditor.vue** — Frame-by-frame position/CSS editing.
- **AnimationVisualizer.vue** — Timeline progress ball: grab-only on the ball (pointer capture), linear pixel positioning (no animation timing curve), rAF sync from `effectiveT` when idle.
- **AnimatedText.vue** — Staggered per-character animation.
- **Animated.vue** — Fade in/out wrapper using library presets.
- **animationStores.ts** — localStorage state: animation options, group configs, `isTimelineExpanded`, URL hash sharing (base64 encode/decode, 7-day TTL).
- **timelineTypes.ts** — `TimelineKeyframe`, `TimelineState` interfaces + default capture properties.
- **timelineEngine.ts** — `buildAnimationFromTimeline`, `exportTimelineToCSS`, `importCSSToTimeline`.
- **snapshotCapture.ts** — `captureSnapshot` reads `getComputedStyle` to create keyframes.
- **useTimeline.ts** — Composable: timeline state, keyframe CRUD, scrubbing, `scrubAndCapture` (html2canvas preview), animation rebuild, CSS import/export.
- **useAnimationSync.ts** — Composable: bridges `markRaw` Animation objects to Vue reactivity via rAF polling. Exposes `currentT`, `isPlaying`, `isStarted`, `isReversed`.
- **useHighlightCSS.ts** — Composable: manages a `<style>` element in `document.head` for dynamic CSS injection.

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
- **useTransformState.ts** — Matrix3d creation (`Rx * Ry * Rz` convention), transform slider values, cell metadata, rAF-debounced watcher, animated matrix reset.

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
- Lazy-loaded heavy components (`defineAsyncComponent` for `KeyframesStringControls`, `KeyframeTimeline`—which contain Monaco)
- Safari private browsing: localStorage fallback to plain `ref()`
- Pointer Events + `setPointerCapture` for drag containment (OrbitalDrag, AnimationVisualizer); touch pinch on container only
- Keyboard shortcuts via `registerShortcut()` composable; skipped in editable targets (input, textarea, Monaco)
- Modifier keys (shift/ctrl/meta) read from event properties, not keydown/keyup tracking
- Euler convention: quaternion ↔ Euler extraction must match `Rx * Ry * Rz` (useTransformState consumption order)
