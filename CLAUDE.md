# keyframes.js

CSS keyframe animations for anything in JavaScript. Parse `@keyframes`, animate any object or DOM element.

## Build

```sh
npm run build           # library (ESM) → dist/keyframes.js + dist/keyframes.d.ts
npm run gh-pages        # demo (demo/app multi-scene SPA) → dist/gh-pages/
npm run dev             # vite dev server — demo/app SPA (HMR)
npm run dev:playground  # vite dev server — playground demo
npm run check           # tsc --noEmit (repo); check:lib for the library tsconfig
npm test                # vitest (jsdom)
npm run bench           # vitest bench
npm run proof:all       # full proof:* gate roster (correctness + hygiene)
```

## Project Tree

```
src/                            # animation/ + env.d.ts — nothing else
├── animation/                  # The entire library (see animation/CLAUDE.md)
│   ├── index.ts                # Package barrel — LIGHT static exports + loadAnimationEngine() (the static/dynamic boundary)
│   ├── engine.ts               # HEAVY: Animation + CSSKeyframesAnimation; re-exports AnimationGroup, getAnimationId, getTimingFunction, resolveKeyframes
│   ├── frame-compiler.ts       # FrameCompiler — template→compiled frame pipeline (addFrame → parse → AnimationFrame[])
│   ├── group.ts                # AnimationGroup — multi-animation compositor (replace/add/weighted blending)
│   ├── adapter.ts              # resolveKeyframes — input → ResolvedKeyframes
│   ├── animate.ts              # animate() — single-call front door: shape dispatch + auto-target + auto-play (HEAVY)
│   ├── motion-path.ts          # MotionPath / fromMotionPath — offset-distance over an author offset-path (HEAVY)
│   ├── draw-svg.ts             # DrawSVG / fromDrawSVG — stroke-dashoffset line drawing over getTotalLength() (HEAVY)
│   ├── animations.ts           # Preset library (fadeIn, bounce, shake, …) — rides the engine surface as `presets`
│   ├── numeric.ts              # NumericAnimation — zero-alloc keyframe interp over {key: number} objects
│   ├── smooth.ts               # SmoothProgress — exponential-smoothing progress tracker
│   ├── spring.ts               # SpringProgress — closed-form spring physics tracker
│   ├── springLinearStops.ts    # spring → CSS linear() stops string
│   ├── springTimingFunction.ts # spring → typed Easing ({ fn, css })
│   ├── morph.ts                # ElementMorph — rect-to-rect position/scale interpolation
│   ├── flip.ts                 # flip / flipShared — FLIP composition over ElementMorph
│   ├── drag.ts                 # drag / Draggable — pointer drag/fling input layer over SpringProgress
│   ├── decay.ts                # decay / decayRest — closed-form frictional glide
│   ├── stagger.ts              # stagger — pure construction-time per-index delay generator
│   ├── sequence.ts             # Sequence — master-playhead temporal orchestrator
│   ├── timeline.ts             # Timeline (abstract), ScrollTimeline, ManualTimeline, createNativeTimeline
│   ├── playback.ts             # RAFPlayback — THE managed rAF driver (play/drive/loop)
│   ├── easing.ts               # resolveEasing(name) async factory + toEasing normalizer
│   ├── waapi.ts                # WAAPI eligibility + delegation
│   ├── format.ts               # Animation → CSS string serialization
│   ├── constants.ts            # Types + defaults (Easing, AnimationOptions, Vars, …)
│   ├── utils.ts                # Frame calc, value interpolation, getTimingFunction
│   └── internal/               # value.js-free leaves: leaves, binarySearch, errors, reduced-motion, scheduler
└── env.d.ts                    # *.vue module declaration (dev-only shim; not shipped)

demo/                # Vue 3 demo (see demo/CLAUDE.md)
├── @/               # Shared library: animation-controls suite, asset-manager, dock, editor-shell, matrix-editor, orbital-drag, composables, styles, utils
├── app/             # THE multi-scene SPA (npm run dev / gh-pages): router + scene machine + scenes/*Scene.vue
├── amiga/ cube/ easing/ motion-path/ sequence/ spring/ square/
│                    # Per-scene content (composables + target components) consumed by app/scenes/ — NOT standalone apps
└── playground/      # Standalone asset-playground app (npm run dev:playground)

test/                # Vitest (jsdom). Count: `ls test/*.test.ts | wc -l` files, `npx vitest list | wc -l` tests
                     # (96 files / 912 tests at the O+P impl-drive — derive, don't trust a frozen number)
bench/               # Vitest bench. Count: `ls bench/*.bench.ts | wc -l` (9 at the O+P impl-drive)
scripts/             # proof-*.mjs runtime gates (wired to npm run proof:*) + shared lib/ + deploy/capture helpers
docs/                # Tranche records + audit lanes
```

## Library Entry Point — the static/dynamic boundary

`src/animation/index.ts` builds to `dist/keyframes.js` (ESM-only — no CJS artifact is emitted) + `dist/keyframes.d.ts` (API Extractor roll-up).

Two export surfaces meet at the barrel:

- **LIGHT (static named exports, value.js-free):** `NumericAnimation`, `SmoothProgress`, `SpringProgress`, `springLinearStops`, `springTimingFunction`, `ElementMorph`, `Timeline`, `ScrollTimeline`, `ManualTimeline`, `createNativeTimeline`, `RAFPlayback`, `stagger`, `flip`/`flipShared`, `drag`/`Draggable`/`drag2D` (the single-call 2-D drag sugar — two one-axis `Draggable`s behind a 2-D handle; returns a `Drag2DHandle`), `decay`/`decayRest`, `Sequence`, `resolveEasing`, `toEasing`, `AnimationOptionError`, `UnknownEasingError`. A consumer importing only these never pulls `@mkbabb/value.js` into its graph.
- **HEAVY (dynamic — reached ONLY via `await loadAnimationEngine()`):** `Animation`, `CSSKeyframesAnimation`, `AnimationGroup`, `getAnimationId`, `getTimingFunction`, `resolveKeyframes`, `animate`, `MotionPath`/`fromMotionPath`, `DrawSVG`/`fromDrawSVG`, `presets`, `DIRECTIONS`, `FILL_MODES`, `defaultOptions`, `defaultLayerConfig`.

```ts
const { CSSKeyframesAnimation } = await loadAnimationEngine();
const anim = new CSSKeyframesAnimation(opts).fromString(css);
```

The heavy classes are NOT static named exports — only their TYPES are (`import type` is erased under `verbatimModuleSyntax`). The hash-named dist chunks (`engine-*`, `animate-*`, `motion-path-*`, `draw-svg-*`, …) are the `loadAnimationEngine()` lazy splits, not leakage. The boundary is gated in CI by `proof:boundary`; the published surface by `proof:published-surface`.

## Dependencies

| Package | Role |
|---------|------|
| `@mkbabb/value.js` | ValueUnit, Color, the CSS `@keyframes` grammar/parser, easing registry, math, normalization — statically imported by the HEAVY surface only |
| `@mkbabb/parse-that` | Parser combinators; consumed directly only in `src/animation/utils.ts` (the `any` combinator over value.js's parsers — a cross-realm nominal-type seam) |

The `@keyframes` grammar itself lives in value.js; keyframes.js owns the animation engine over it.

## Conventions

- TypeScript `strict: true`, `verbatimModuleSyntax: true`, `exactOptionalPropertyTypes: true`, `noUncheckedIndexedAccess: true`
- `moduleResolution: bundler`, `target: ES2022`
- `import type` for type-only imports
- Path aliases: `@src/`, `@components/`, `@composables/`, `@styles/`, `@utils/`, `@assets/`
- Prettier: 4-space indent, 80-char width, plugins: tailwind, organize-imports, classnames, merge
- Node >=22

## Architecture Notes

- **Frame pipeline** (`frame-compiler.ts`): `addFrame()` → `parse()` (reconcile vars, compute times) → `AnimationFrame[]` with `interpVars`
- **Playback modes**: rAF (default — every loop rides `RAFPlayback`), WAAPI (opt-in compositor-thread), managed (AnimationGroup owns the loop), reduced-motion snap
- **Interpolation dispatch**: numeric → `lerp`; color → perceptual (`oklab` default); computed units (`vh`, `calc`, `var`, `cq*`) → DOM resolution
- **Layer blending** (AnimationGroup): `replace` (z-order), `add` (accumulate), `weighted` (lerp by weight)
- **WAAPI eligibility** (`waapi.ts`): DOM targets, default DOM-style renderer, uniform timing, no multi-segment CSS-twin easing, no computed units, no color interpolation — else rAF fallback with a queryable `waapiIneligibleReason`
- **General primitives**: `NumericAnimation` (zero-alloc keyframe interp), `SmoothProgress`/`SpringProgress` (progress trackers), `ElementMorph` (rect-to-rect transform), `Timeline` (progress driver)
- **Orchestration tier** (all LIGHT): `stagger` (delay distribution), `flip` (layout FLIP over ElementMorph), `drag`/`decay` (gesture physics over SpringProgress), `Sequence` (temporal orchestration beside `AnimationGroup`'s spatial blending)
- **Timeline pipeline**: `sample() → clamp → easing → boundary snap → smoothing → progress`. No rAF ownership — caller drives the loop.
- **ScrollTimeline**: injectable `getScrollY`/`getViewportHeight` callbacks for testing without DOM
- **ManualTimeline**: smoothing off by default; set raw value, get immediate result
