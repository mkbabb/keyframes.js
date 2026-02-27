# demo/

Vue 3 demo applications showcasing keyframes.js. Each subdirectory is a standalone Vite app with its own `index.html`. The `cube/` demo is the default for `npm run dev` and `npm run gh-pages`.

## Structure

```
demo/
├── @/                           # Shared library
│   ├── components/
│   │   ├── custom/
│   │   │   ├── animation-controls/  # Core control suite (see below)
│   │   │   ├── dark-mode-toggle/    # Sun/moon SVG toggle (@vueuse useDark)
│   │   │   ├── orbital-drag/        # Quaternion-based 3D drag (gl-matrix)
│   │   │   ├── ColorPicker.vue      # Multi-color-space picker (value.js Color)
│   │   │   ├── CommandPalette.vue   # Cmd+K palette
│   │   │   ├── CopyButton.vue      # Clipboard + feedback animation
│   │   │   └── IconTooltip.vue      # Tooltip wrapper
│   │   └── ui/                      # shadcn-vue components (50+)
│   ├── styles/
│   │   ├── style.css                # Tailwind v4 + light/dark theme vars
│   │   └── utils.css                # Fonts (Fraunces, Fira Code), rainbow effects, 3D
│   └── utils/
│       └── utils.ts                 # cn() — clsx + tailwind-merge
├── cube/          # 3D sphere: AnimationGroup, Three.js, OrbitalDrag, matrix editor
├── simple/        # Minimal: single CSSKeyframesAnimation + controls
├── square/        # Custom transform fn with object-based keyframes
├── amiga/         # Physics-like 3D sphere, multi-axis bounce
├── balls/         # Vanilla JS: CSS vars, staggered animations
├── boxes/         # Vanilla JS: matrix3d transforms, complex keyframes
└── bench/         # Benchmark: rAF vs CSS @keyframes vs WAAPI (FPS, dropped frames)
```

## Animation Controls (`@/components/custom/animation-controls/`)

The primary UI for interacting with animations across demos.

- **AnimationControls.vue** — Tab panel: Controls | Keyframes. Wraps a single `Animation`.
- **AnimationControlsControls.vue** — Sliders for duration, delay, iterations, direction, fill, easing. Cubic-bezier + steps editors.
- **AnimationControlsGroup.vue** — Orchestrates `AnimationGroup`: animation selector dropdown, play/pause, reset.
- **CubicBezierControls.vue** — SVG bezier curve editor with draggable control points.
- **KeyframesStringControls.vue** — Monaco editor for CSS @keyframes with format/apply/copy.
- **KeyframesEditor.vue** — Frame-by-frame position/CSS editing.
- **AnimationVisualizer.vue** — Timeline progress ball (draggable via OrbitalDrag).
- **AnimatedText.vue** — Staggered per-character animation.
- **Animated.vue** — Fade in/out wrapper using library presets.
- **animationStores.ts** — localStorage state: animation options, group configs, URL hash sharing (base64 encode/decode, 7-day TTL).

## Demo Apps

| Demo | Framework | Key Feature |
|------|-----------|-------------|
| `cube/` | Vue + Three.js | 4 synchronized animations, 3D sphere, matrix editor, URL sharing |
| `simple/` | Vue | Single animation: translateX/Y + rotate + color |
| `square/` | Vue | Custom transform fn, nested object interpolation |
| `amiga/` | Vue + Three.js | 3D sphere with bouncing on X/Y/Z axes |
| `balls/` | Vanilla TS | `parseCSSKeyframes()` + CSS custom properties |
| `boxes/` | Vanilla TS | Matrix3D transforms, complex keyframes |
| `bench/` | Vanilla TS | FPS/dropped frames across rAF, CSS, WAAPI engines |

## Key Dependencies

- `vue` 3.5, `@vueuse/core` — reactivity, composables, dark mode
- `reka-ui` — headless UI primitives (shadcn-vue basis)
- `three` + `three/OrbitControls` — 3D rendering (cube, amiga)
- `gl-matrix` — quaternion math (orbital-drag)
- `monaco-editor` — CSS keyframes editor
- `@mkbabb/value.js` — Color class (ColorPicker)

## Conventions

- Tailwind v4 with CSS variable theme (light/dark via `.dark` class)
- Path aliases: `@components/`, `@styles/`, `@utils/`
- Lazy-loaded heavy components (`defineAsyncComponent` for Monaco)
- Safari private browsing: localStorage fallback to plain `ref()`
- Touch support: pinch/drag in OrbitalDrag, touch controls in demos
