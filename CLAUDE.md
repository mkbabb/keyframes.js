# keyframes.js

CSS keyframe animations for anything in JavaScript. Parse `@keyframes`, animate any object or DOM element.

## Build

```sh
npm run build        # library → dist/keyframes.js + keyframes.cjs + keyframes.d.ts
npm run gh-pages     # demo (cube) → dist/
npm run dev          # vite dev server on :8080 (cube demo)
npm test             # vitest (jsdom)
npm run bench        # vitest bench
```

## Project Tree

```
src/
├── animation/           # Animation engine (see animation/CLAUDE.md)
│   ├── index.ts         # Animation, CSSKeyframesAnimation classes
│   ├── group.ts         # AnimationGroup — multi-animation compositor
│   ├── animations.ts    # 30+ preset animations (fadeIn, bounce, etc.)
│   ├── constants.ts     # Types, defaults (AnimationOptions, Vars, etc.)
│   ├── utils.ts         # Frame calc, value interpolation, timing
│   └── waapi.ts         # Web Animations API delegation
├── parsing/             # CSS @keyframes parsing (see parsing/CLAUDE.md)
│   ├── keyframes.ts     # @keyframes grammar via parse-that combinators
│   ├── format.ts        # Animation → CSS string serialization (Prettier)
│   ├── units.ts         # Re-export: CSSValueUnit, parseCSSColor from value.js
│   ├── utils.ts         # Re-export: parser combinators from value.js
│   └── index.ts         # Barrel
├── units/               # Value types & normalization (see units/CLAUDE.md)
│   ├── index.ts         # Re-export: ValueUnit, FunctionValue, ValueArray
│   ├── constants.ts     # Re-export: unit sets (LENGTH_UNITS, etc.)
│   ├── utils.ts         # Re-export: conversion fns (convertToPixels, etc.)
│   ├── normalize.ts     # LOCAL: DOM-aware unit normalization + memoization
│   └── color/           # Color space classes, normalization, conversion
│       ├── index.ts     # Re-export: Color, RGBColor, OKLABColor, etc.
│       ├── constants.ts # Re-export: color ranges, white points, matrices
│       ├── normalize.ts # Re-export: normalizeColorUnits
│       ├── utils.ts     # Re-export: 40+ color space converters
│       └── colorFilter.ts # Re-export: rgb2ColorFilter
├── easing.ts            # Re-export barrel: easing fns from value.js
├── math.ts              # Re-export barrel: clamp, lerp, bezier from value.js
├── utils.ts             # Re-export barrel + local memoizeDecorator
└── env.d.ts             # Vue *.vue module declaration

demo/                    # Vue 3 demo apps (see demo/CLAUDE.md)
├── @/                   # Shared: editor shell, composables, UI (shadcn-vue), styles
├── cube/                # 3D cube + AnimationGroup + matrix editor
├── simple/              # Minimal: single animation + controls
├── square/              # Custom transform function demo
├── amiga/               # Physics-like 3D sphere
├── balls/               # Vanilla JS: CSS vars + staggered anim
├── boxes/               # Vanilla JS: matrix3d transforms
└── bench/               # Performance benchmark suite

test/                    # Vitest (jsdom) — 11 files, ~2750 lines
├── animation.test.ts    # Animation options, setters, frame creation
├── easing.test.ts       # Easing functions, bezier, stepped
├── editor-parsing.test.ts # Complex CSS parsing, editor integration
├── equivalence.test.ts  # Animation equivalence across input types
├── format.test.ts       # CSS formatting, normalization
├── group.test.ts        # AnimationGroup orchestration
├── parsing.test.ts      # CSS time/percent/keyframes parsing
├── performance.test.ts  # Perf benchmarks, memory
├── presets.test.ts      # Preset animation library
├── sharing.test.ts      # State cloning, reuse
└── units.test.ts        # Unit conversions, color parsing, interpolation

bench/                   # Vitest bench — 3 files
├── interpolation.bench.ts
├── parser.bench.ts
└── playwright.bench.ts
```

## Library Entry Point

`src/animation/index.ts` — builds to `dist/keyframes.js` (ESM) + `dist/keyframes.cjs` (CJS) + `dist/keyframes.d.ts`.

Primary exports: `Animation`, `CSSKeyframesAnimation`, `AnimationGroup`, `getAnimationId`.

## Dependencies

| Package | Role |
|---------|------|
| `@mkbabb/value.js` | ValueUnit, Color, math, easing, parsing, normalization |
| `@mkbabb/parse-that` | Parser combinators for @keyframes grammar |

Most of `src/` is thin re-export barrels over `value.js`. Local logic lives in:
- `src/animation/` — the animation engine itself
- `src/parsing/keyframes.ts` + `format.ts` — @keyframes grammar + serialization
- `src/units/normalize.ts` — DOM-aware computed value resolution

## Conventions

- TypeScript `strict: true`, `verbatimModuleSyntax: true`, `exactOptionalPropertyTypes: true`
- `moduleResolution: bundler`, `target: ES2022`
- `import type` for type-only imports
- Path aliases: `@src/`, `@components/`, `@composables/`, `@styles/`, `@utils/`, `@assets/`
- Memoization via `memoize()` (from value.js) and local `memoizeDecorator`
- All exported parsing functions are memoized
- Prettier: 4-space indent, 80-char width, tailwind + import sort plugins
- Node >=22

## Architecture Notes

- **Frame pipeline**: `addFrame()` → `parse()` (reconcile vars, compute times) → `AnimationFrame[]` with `interpVars`
- **Playback modes**: rAF-based (default), WAAPI (opt-in for compositor-thread), managed (AnimationGroup controls)
- **Interpolation dispatch**: numeric → `lerp`; color → perceptual (`oklab` default); computed units (`vh`, `calc`, `var`) → DOM resolution
- **Layer blending** (AnimationGroup): `replace` (z-order), `add` (accumulate), `weighted` (lerp by weight)
- **WAAPI eligibility**: requires DOM targets, uniform timing, no computed units, no custom transforms, no LAB/OKLAB colors
