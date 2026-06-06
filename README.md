# keyframes.js ![image](./assets/cube.png)

CSS keyframe animations for anything in JavaScript. Specify your keyframes in standards-compliant CSS; animate any object, DOM element, or data structure. General-purpose interpolation primitives — smoothing, morphing, scroll-driven timelines — ship alongside.

[Try the demo here!](https://keyframes.babb.dev/)

## Quick Start

Create a `CSSKeyframesAnimation`, feed it CSS `@keyframes`, add targets, play:

```ts
const anim = new CSSKeyframesAnimation({
    duration: 2000,
    iterationCount: Infinity,
    direction: "alternate",
    fillMode: "forwards",
});

anim.fromString(`
    @keyframes mijn-keyframes {
        from {
            transform: translateX(-100%) translateY(-100%) rotate(0turn);
            background-color: #C462D8;
        }
        100% {
            transform: translateX(50%) translateY(75%) rotate(1turn);
            background-color: #E85252;
        }
    }
`);

anim.setTargets(document.getElementById("myElement"));
anim.play();
```

This animates the element's style properties as specified in the keyframes. The default behavior, but you can get far more inventive with it.

Plucked directly from the [`demo/simple`](demo/simple/App.vue) Vue file.

## Table of Contents

- [Installation](#installation)
- [Project Structure](#project-structure)
- [Animation](#animation)
  - [AnimationOptions](#animationoptions)
  - [Transform Function](#the-transform-function)
  - [Timing Function](#the-timing-function)
  - [TemplateAnimationFrame](#templateanimationframe)
- [CSSKeyframesAnimation](#csskeyframesanimation)
  - [Parsing CSS Keyframes](#parsing-css-keyframes)
  - [Units](#units)
- [AnimationGroup](#animationgroup)
- [Presets](#presets)
- [Web Animations API](#web-animations-api)
- [Baseline, tree-shaking & reduced motion](#baseline-tree-shaking--reduced-motion)
- [Beyond CSS](#beyond-css)
  - [NumericAnimation](#numericanimation)
  - [SmoothProgress](#smoothprogress)
  - [ElementMorph](#elementmorph)
  - [Timeline](#timeline)
- [Build & Development](#build--development)

## Installation

```bash
npm install @mkbabb/keyframes.js
```

Works both in and out of the browser. Anything that touches the DOM (`getComputedStyle`, `document`, etc.) won't work in Node.

## Project Structure

```
src/
├── animation/           # Animation engine: classes, group, presets, interpolation, WAAPI
│   ├── index.ts         # Animation, CSSKeyframesAnimation
│   ├── group.ts         # AnimationGroup — multi-animation compositor
│   ├── numeric.ts       # NumericAnimation — keyframe interpolation over plain objects
│   ├── smooth.ts        # SmoothProgress — exponential smoothing
│   ├── morph.ts         # ElementMorph — position/scale interpolation between elements
│   ├── timeline.ts      # Timeline, ScrollTimeline, ManualTimeline — progress drivers
│   ├── animations.ts    # 30+ preset animations
│   ├── constants.ts     # Types & defaults
│   ├── utils.ts         # Frame calc, value interpolation
│   └── waapi.ts         # Web Animations API delegation
├── parsing/             # CSS @keyframes parsing & serialization
│   ├── keyframes.ts     # @keyframes grammar (parse-that combinators)
│   ├── format.ts        # Animation → CSS string (Prettier)
│   ├── units.ts         # Re-export: CSS value/color parsers
│   └── utils.ts         # Re-export: parser combinators
├── units/               # Value types & normalization
│   ├── normalize.ts     # DOM-aware unit normalization
│   ├── color/           # Color space classes, converters, normalization
│   └── *.ts             # Re-export barrels from @mkbabb/value.js
├── easing.ts            # Re-export: easing functions
├── math.ts              # Re-export: clamp, lerp, bezier
└── utils.ts             # Re-export + memoizeDecorator

demo/                    # Vue 3 demo apps
├── @/                   # Shared: animation controls, shadcn-vue UI, styles
├── cube/                # 3D cube + AnimationGroup + matrix editor (default demo)
├── simple/              # Minimal single-animation example
├── square/              # Custom transform function
├── amiga/               # 3D animated sphere (Three.js)
├── playground/          # Asset playground: drag-and-drop viewport with preset animation binding
├── balls/               # Vanilla JS: CSS vars + staggered animations
├── boxes/               # Vanilla JS: matrix3d transforms
└── bench/               # Performance benchmarks (rAF vs CSS vs WAAPI)

test/                    # Vitest (jsdom) — 15 suites, 261 tests
bench/                   # Vitest benchmarks — 3 suites
```

## Animation

The `Animation` object drives `CSSKeyframesAnimation` and `AnimationGroup`. It's composed of:

- **options** (`AnimationOptions`)
- **transform function**: interpolates between keyframes
- **timing function**: eases the animation
- **keyframes** (`TemplateAnimationFrame`)

### `AnimationOptions`

- `duration`: time in milliseconds (default: 1000)
- `delay`: time in milliseconds before the animation begins (default: 0)
- `iterationCount`: number of repetitions (default: 1)
- `direction`: `normal`, `reverse`, `alternate`, `alternate-reverse`
- `fillMode`: `none`, `forwards`, `backwards`, `both`
- `timingFunction`: easing function (default: `easeInOutCubic`)
- `colorSpace`: color interpolation space (default: `oklab`)
- `hueMethod`: hue interpolation method for cylindrical color spaces (optional)
- `useWAAPI`: delegate to Web Animations API when eligible (default: `true`)

### The transform function

```ts
type TransformFunction<V extends Vars> = (v: V, t: number) => void;
```

Called at each timestep `t` (0 to `duration`) with the interpolated variables `v`. The variables arrive in the same shape you specified in your keyframes—deeply nested objects included.

Every value is parsed as a CSS value unit (`1px`, `1em`, `1deg`, etc.). To interpolate between two units they must share a supertype: `px` and `em` are both **length**, so they interpolate; `px` and `deg` are not.

### The timing function

```ts
type TimingFunction = (t: number) => number;
```

Takes `t` in `[0, 1]`, returns `[0, 1]`. All CSS timing functions are implemented in [`easing.ts`](src/easing.ts).

#### Step functions

Implemented as `steppedEase(t, steps, jumpTerm)`:

- `jump-none`: the value is held until the end of the step
- `jump-start` / `start`: step occurs at the start
- `jump-end` / `end`: step occurs at the end
- `jump-both` / `both`: steps at both boundaries

#### Bezier curves

`cubicBezier(t, x1, y1, x2, y2)` implements the cubic case. The general case uses de Casteljau's algorithm iteratively.

Both are in [`math.ts`](src/math.ts). For Bezier visualizations, see [this Desmos graph](https://www.desmos.com/calculator/tvivnkflzv) or the `timing-functions` demo.

`CSSCubicBezier` is the higher-order convenience: takes control points, returns a `t → value` function. CSS's named easings are built from it:

```ts
const easeInBounce = (t: number) => CSSCubicBezier(0.09, 0.91, 0.5, 1.5)(t);
```

### `TemplateAnimationFrame`

A template keyframe prior to resolution. Composed of:

- `id`: auto-incremented identifier
- `start`: start time (CSS time string, number, or percentage)
- `vars`: the variables to interpolate
- `transform`: per-keyframe transform function (optional)
- `timingFunction`: per-keyframe timing function (optional)

Once a transform or timing function is specified, it propagates to all subsequent keyframes.

#### Reification

Template keyframes are reified into concrete keyframes by:

1. **Parsing start times**: CSS time formats (`1s`, `100ms`), raw numbers, or percentages (`50%`). All normalized to a percentage of total duration.
2. **Resolving functions**: null transforms and timing functions fall back to the `AnimationOptions` defaults.
3. **Sorting** by start percentage.
4. **Resolving variables** across keyframes—every keyframe ends up with the same variable set.
5. **Computing durations** from sorted start/stop times.

#### Variable resolution

Keyframes needn't declare the same variables. The resolver walks backward from each keyframe, seeking the most recent definition of each variable. If none exists, the default value (typically `0`) is used.

```ts
const kf1 = { start: "0s",   vars: { x: 0, y: 0 } };
const kf2 = { start: "500ms", vars: { x: 1 } };
const kf3 = { start: "100%", vars: { x: 0, y: 1 } };
```

`kf2` gets `y: 0` from `kf1`. This lets you specify keyframes loosely.

## `CSSKeyframesAnimation`

An abstraction over `Animation` that parses CSS `@keyframes` into `TemplateAnimationFrame` objects, then adds them to a base `Animation`.

Three ways to create keyframes:

```ts
// From CSS string (underlying parser is memoized; results cloned per call)
anim.fromString(`from { opacity: 0; } to { opacity: 1; }`);

// From keyframe map
anim.fromKeyframes({ "0%": { opacity: 0 }, "100%": { opacity: 1 } });

// From variable array
anim.fromVars([{ opacity: 0 }, { opacity: 1 }]);
```

The default transform applies interpolated values to `element.style` for each target.

### Parsing CSS keyframes

[`keyframes.ts`](src/parsing/keyframes.ts) covers most of the CSS spec:

- `from`, `to`, and percentages
- Time units (`s`, `ms`)
- Lengths (`px`, `em`, etc.)
- Angles (`deg`, `rad`, etc.)
- Colors (`#fff`, `rgb(255, 255, 255)`, `lab(100, 0, 0)`, `lightblue`, etc.)
- Transforms (`translateX(100%)`, `rotate(1turn)`, etc.)
- Variables (`var(--my-var)`)
- Math expressions (`calc(100% - 10px)`)
- Any `key: value` pair parseable as a CSS value, function, or list thereof

The parser uses [`@mkbabb/parse-that`](https://github.com/mkbabb/parse-that) and [`@mkbabb/value.js`](https://github.com/mkbabb/value.js) for CSS value parsing. All exported parse functions are memoized.

### Units

Thorough unit parsing and resolution, covering:

- **length**, **angle**, **time**, **resolution**, **percentage**, **color**

See [`units/`](src/units/) and [`parsing/units.ts`](src/parsing/units.ts).

A `unit` value takes one of three forms:

- `ValueUnit`: a value with a string unit and an array of supertypes
- `FunctionValue`: a function name with an array of `ValueUnit`s
- `ValueArray`: an array of `ValueUnit`s

Each defines `toString()`, `valueOf()`, and `lerp(t, other, target?)`. Any `ValueUnit` variant can interpolate with any other—values are aligned to the shorter array, then interpolated element-wise.

Units of the same supertype interpolate freely. Supertypes also encode whether a unit is relative or absolute (`px` is absolute; `em` is relative), used to resolve to a common base before interpolation.

Interpolation dispatch: numeric values use `lerp`; colors use perceptual interpolation (`oklab` by default, configurable); computed units (`vh`, `vw`, `calc`, `var`) resolve against the live DOM at interpolation time.

## `AnimationGroup`

Composites multiple animations with layer blending. Each animation gets a layer config controlling how it merges with others.

```ts
const group = anim1.group(anim2, anim3);
group.setTargets(element);
group.play();
```

Three blend modes:

- **`replace`**: highest `zIndex` wins (default)
- **`add`**: numeric values accumulate
- **`weighted`**: linear interpolation by `weight` (0–1)

Layer configuration per animation: `zIndex`, `weight`, `blendMode`, `enabled`, `properties` (whitelist). Property whitelisting enables effect layering—one layer animates position, another animates opacity.

The group manages its own `requestAnimationFrame` loop and marks child animations as `managed`.

## Presets

30+ ready-to-use animations in [`animations.ts`](src/animation/animations.ts). All return `CSSKeyframesAnimation` instances and accept optional `InputAnimationOptions`. Each builds a value.js-bearing `CSSKeyframesAnimation`, so the presets ride the heavy dynamic boundary (the `presets` namespace on `loadAnimationEngine()`) rather than the value.js-free static barrel:

```ts
import { loadAnimationEngine } from "@mkbabb/keyframes.js";

const { presets } = await loadAnimationEngine();
const anim = presets.fadeIn({ duration: 500 });
anim.setTargets(element);
anim.play();

// …or the single-call front door (auto-target + auto-play):
const { animate } = await loadAnimationEngine();
animate(element, presets.fadeIn());
```

**Fade**: `fadeIn`, `fadeOut` · **Attention**: `pulse`, `heartbeat`, `glow`, `shake`, `bounce` · **Entrance/Exit**: `flip`, `rotateIn`, `slideIn`, `slideInLeft/Right`, `slideOutLeft/Right`, `blurIn/Out/InOut`, `jumpUp/Down`, `warpLeft/Right` · **Effects**: `hover`, `typewriter`, `typingCursor`, `rainbowText`, `progressBar`, `skeletonLoading`, `spinner`, `parallaxScroll`, `gradientBackground`, `rotateScale`, `accordionExpand`, `notificationBounce`, `textFocusBlur`

## Web Animations API

When `useWAAPI` is `true` (default), eligible animations run on the compositor thread via `Element.animate()`. Eligibility requires: DOM targets, uniform timing function across frames, no computed units, no custom transform function, no color interpolation. Falls back to `requestAnimationFrame` silently.

A spring timing function (`springTimingFunction`) carries its CSS `linear()` equivalent, so a WAAPI-delegated spring animation runs the true overshoot/settle curve on the compositor instead of a flattened `linear` ramp — the JS easing and the compositor curve are one solver.

## Baseline, tree-shaking & reduced motion

keyframes.js targets a modern-web Baseline and documents the tier of every platform facility it leans on:

| Facility | Baseline tier | Behavior |
|---|---|---|
| `prefers-reduced-motion` | Widely available | Native `matchMedia`; SSR-safe no-op off-DOM |
| `scheduler.yield()` | Newly available | Feature-detected; falls back to a `MessageChannel` macrotask (≤20 LOC) |
| WAAPI `linear()` springs | Newly available | Feature-detected; the rAF spring path is the default fallback |
| `Element.animate()` (WAAPI) | Widely available | Opt-out via `useWAAPI: false` |

**Tree-shaking — the value.js boundary.** The package is `"sideEffects": false` and splits along a static/dynamic boundary. The light physics/interpolation engines — `SpringProgress`, `SmoothProgress`, `NumericAnimation`, `ElementMorph`, the `Timeline` family, `RAFPlayback`, and the spring-stop helpers — carry **zero** static import edge to `@mkbabb/value.js`. A consumer that imports only these never pulls value.js (or the heavy CSS-keyframe parser) into its graph; the heavy engine (`Animation`, `CSSKeyframesAnimation`, `AnimationGroup`) is reached only through `loadAnimationEngine()`'s dynamic `import()`. This boundary is **gated in CI** by `proof:boundary`, which builds a spring-only entry and fails the build if any light module reintroduces a static value.js edge.

**Reduced motion.** Both the light and heavy engines honor `prefers-reduced-motion: reduce`. Opt in per surface:

- **Light interpolators** (`NumericAnimation`, `SmoothProgress`, `SpringProgress`, `ElementMorph`) — pass `respectReducedMotion: true`. `RAFPlayback` owns the shared snap-to-final gate, so the managed `.play()` path skips the rAF loop and lands on the final value in a single paint.
- **Heavy engine** (`Animation` / `CSSKeyframesAnimation`) — pass `respectReducedMotion: true`; `play()` snaps to the final frame (a single paint, `animationstart` → `animationend`) instead of running the rAF/WAAPI loop.
- **`AnimationGroup`** — set `group.respectReducedMotion = true`; `play()` composites every child's final frame once rather than driving the draw loop.

Off-DOM (SSR / Node) the check is a no-op and animations proceed normally.

**INP.** `AnimationGroup` composites N children per frame; for large groups (`> AnimationGroup.YIELD_BATCH`) `tick()` yields to the main thread between batches via `scheduler.yield()` (feature-detected) so a big composite doesn't run as one long task.

## Beyond CSS

The library also ships general-purpose interpolation primitives, decoupled from CSS and the DOM. These compose into a pipeline: `timeline → progress → interpolator → values → apply`.

### `NumericAnimation`

Keyframe interpolation over plain `{key: number}` objects. Zero-allocation hot path — returns the same object reference each call. Two usage modes: stateless `.at()` queries, or managed `.play()` with rAF-driven playback.

```ts
// Stateless — drive from your own render loop
const anim = new NumericAnimation([
    { x: 0, y: 0, opacity: 0 },
    { x: 100, y: 200, opacity: 1 },
]);
anim.at(0.5); // => { x: 50, y: 100, opacity: 0.5 }

// Managed — rAF playback with per-frame callback
const anim = new NumericAnimation(
    [{ angle: 0 }, { angle: Math.PI * 4 }],
    { duration: 2500, timingFunction: easeOutCubic },
);
await anim.play(({ angle }) => {
    ctx.clearRect(0, 0, w, h);
    drawDial(angle);
});
```

Options: `duration` (ms, required for `.play()`), `timingFunction`, `positions` (explicit keyframe positions as percentages). Call `.stop()` to cancel a running playback — the play promise resolves immediately.

### `SmoothProgress`

Exponential smoothing for progress values. Frame-rate independent via `tickDt(dt)`.

```ts
const smooth = new SmoothProgress({ damping: 0.15 });
smooth.setTarget(1);
smooth.tick();       // asymptotically approaches 1
smooth.snap();       // instantly converge
```

Options: `damping` (lerp factor, default 0.1), `snapThreshold` (auto-snap distance, default 0.001), `targetEpsilon` (ignore target changes smaller than this — filters scroll jitter, default 0), `initial`, `clamp`.

### `ElementMorph`

Interpolates position and scale between two DOM elements (or rects). Produces CSS transforms. Stateless `.apply()` or managed `.play()`.

```ts
// Stateless
const morph = new ElementMorph(sourceEl, targetEl);
morph.apply(element, progress); // writes transform + transformOrigin

// Managed playback
const morph = new ElementMorph(sourceEl, targetEl, {
    duration: 400,
    timingFunction: easeOutCubic,
});
await morph.play(element);
```

Re-measures on demand via `morph.measure(from, to)`. Call `.stop()` to cancel.

### `Timeline`

Abstract progress driver. Pipeline: `sample() → clamp → easing → boundary snap → smoothing`.

```ts
const timeline = new ScrollTimeline({
    threshold: 0.35,
    easing: easeOutCubic,
    boundaryEpsilon: 0.005,
    smoothing: { damping: 0.15, targetEpsilon: 0.002 },
});

function update() {
    const p = timeline.tick();
    requestAnimationFrame(update);
}
```

Options: `easing`, `smoothing` (`SmoothProgressOptions` or `false`), `boundaryEpsilon` (snap eased values within this distance of 0/1 to the boundary — prevents scroll-endpoint oscillation, default 0.005).

Subclasses:
- **`ScrollTimeline`** — scroll position → progress. `threshold` sets viewport fraction for full progress (default 0.35). Injectable `getScrollY`/`getViewportHeight`.
- **`ManualTimeline`** — externally set value → progress. Smoothing off by default.

See [`docs/scroll-morph.md`](docs/scroll-morph.md) for an architecture guide on building jitter-free scroll-driven morph animations.

## Build & Development

```sh
npm run build        # library → dist/keyframes.js + keyframes.cjs + keyframes.d.ts
npm run gh-pages     # demo → dist/
npm run dev          # vite dev server on :8080 (cube demo)
npm test             # vitest (jsdom)
npm run bench        # vitest bench
```

**Dependencies**: [`@mkbabb/value.js`](https://github.com/mkbabb/value.js) (ValueUnit, Color, math, parsing, normalization) and [`@mkbabb/parse-that`](https://github.com/mkbabb/parse-that) (parser combinators).

**TypeScript**: `strict: true`, `verbatimModuleSyntax: true`, `target: ES2022`, `moduleResolution: bundler`.

**Node**: >=22.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). The README shape follows the perimeter-level
[canonical README shape](https://github.com/mkbabb/glass-ui/blob/master/docs/precepts/canonical-readme-shape.md).

## License

[MIT](./LICENSE) © 2026 Mike Babb.

## Sources, acknowledgements, &c.

- [CSS Animations Level 1](https://www.w3.org/TR/css-animations-1/). W3C. — `@keyframes`, `animation-*` properties, timing model.
- [CSS Easing Functions Level 2](https://www.w3.org/TR/css-easing-2/). W3C. — `linear()` piecewise easing, `steps()` jump terms, `cubic-bezier()`.
- [CSS Transforms Module Level 2](https://www.w3.org/TR/css-transforms-2/). W3C. — `matrix3d()`, decomposition algorithm, quaternion interpolation.
- [CSSOM View Module](https://www.w3.org/TR/cssom-view-1/). W3C. — `getComputedStyle`, unit resolution for relative values.
- [Web Animations API](https://www.w3.org/TR/web-animations-1/). W3C. — `Element.animate()`; the WAAPI delegation path.
- [`@mkbabb/value.js`](https://github.com/mkbabb/value.js) — CSS value parsing, color spaces, unit conversion, easing functions.
- [`@mkbabb/parse-that`](https://github.com/mkbabb/parse-that) — Parser combinators for the `@keyframes` grammar.
- de Casteljau, P. (1959). *Outillages méthodes calcul*. — The recursive subdivision algorithm used for general Bezier curves.
