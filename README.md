# keyframes.js ![image](./assets/cube.png)

CSS keyframe animations for anything in JavaScript. Specify your keyframes in standards-compliant CSS; animate any object, DOM element, or data structure. General-purpose interpolation primitives — smoothing, morphing, scroll-driven timelines — ship alongside.

[Try the demo here!](https://keyframes.babb.dev/)

## Quick Start

Create a `CSSKeyframesAnimation`, feed it CSS `@keyframes`, add targets, play. The engine class is a static, synchronous import from the `@mkbabb/keyframes.js/engine` subpath (it carries the CSS parser + `@mkbabb/value.js`; the light `.` barrel stays value.js-free):

```ts run
import { CSSKeyframesAnimation } from "@mkbabb/keyframes.js/engine";

const anim = new CSSKeyframesAnimation({
    duration: 2000,
    iterationCount: Infinity,
    direction: "alternate",
    fillMode: "forwards",
});

anim.fromString(`
    @keyframes mijn-keyframes {
        from { transform: translateX(-100%); background-color: #C462D8; }
        to   { transform: translateX(50%);  background-color: #E85252; }
    }
`);
anim.setTargets(document.getElementById("myElement"));
anim.play();
```

This animates the element's style properties as specified in the keyframes. The default behavior, but you can get far more inventive with it.

The [demo apps](demo/) exercise this pattern end-to-end — [try them live](https://keyframes.babb.dev/).

## Installation

```bash
npm install @mkbabb/keyframes.js
```

Works both in and out of the browser. Anything that touches the DOM (`getComputedStyle`, `document`, etc.) won't work in Node.

## Project Structure

```
src/animation/   # THE library — engine + every primitive (see src/animation/CLAUDE.md)
demo/            # Vue 3 demo apps (see demo/CLAUDE.md)
test/            # Vitest suites (jsdom)
bench/           # Vitest benchmarks
scripts/         # CI gates (proof:* scripts) + code generators
docs/            # Migration guide, published surface manifest, architecture notes
```

For the authoritative per-file inventory, see [`src/animation/CLAUDE.md`](src/animation/CLAUDE.md).

## Animation

The `KeyframesAnimation` object drives `CSSKeyframesAnimation` and `AnimationGroup`. It's composed of:

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

Validation is fail-explicit: a malformed option — a negative `duration`, an unknown `direction` — throws a typed `AnimationOptionError` naming the option and the offending value.

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

Takes `t` in `[0, 1]`, returns `[0, 1]`. All CSS timing functions are implemented in `easing.ts`.

#### Step functions

Implemented as `steppedEase(t, steps, jumpTerm)`:

- `jump-none`: the value is held until the end of the step
- `jump-start` / `start`: step occurs at the start
- `jump-end` / `end`: step occurs at the end
- `jump-both` / `both`: steps at both boundaries

#### Bezier curves

`cubicBezier(t, x1, y1, x2, y2)` implements the cubic case. The general case uses de Casteljau's algorithm iteratively.

For Bezier visualizations, see [this Desmos graph](https://www.desmos.com/calculator/tvivnkflzv).

### `TemplateAnimationFrame`

A template keyframe prior to resolution. Composed of:

- `id`: auto-incremented identifier
- `start`: start time (CSS time string, number, or percentage)
- `vars`: the variables to interpolate
- `transform`: per-keyframe transform function (optional)
- `timingFunction`: per-keyframe timing function (optional)

Once a transform or timing function is specified, it propagates to all subsequent keyframes. Keyframes needn't declare the same variables — the resolver walks backward from each keyframe to fill gaps.

### The dynamic engine — `loadAnimationEngine()`

The package splits along a static/dynamic boundary (see [tree-shaking](#baseline-tree-shaking--reduced-motion)). The classes above — `KeyframesAnimation`, `CSSKeyframesAnimation`, `AnimationGroup` — are the **heavy** tier: they carry the CSS parser and `@mkbabb/value.js`, and their runtime constructors are reached **only** through `loadAnimationEngine()`, one awaited dynamic import:

```ts run
import { loadAnimationEngine } from "@mkbabb/keyframes.js";

// ONE await loads the CSS engine (and value.js with it); repeat calls
// resolve from the module cache. Light-only consumers never pay this.
const { CSSKeyframesAnimation, presets } = await loadAnimationEngine();

const anim = presets.fadeIn({ duration: 200 });
anim.setTargets(element);
await anim.play();
```

The engine surface (`AnimationEngine`): `KeyframesAnimation`, `CSSKeyframesAnimation`, `AnimationGroup`, `getAnimationId`, `getTimingFunction`, `resolveKeyframes`, `MotionPath`/`fromMotionPath`, `DrawSVG`/`fromDrawSVG`, `MorphSVG`/`fromMorphSVG`, `presets`, and the option constants `DIRECTIONS`, `FILL_MODES`, `defaultOptions`, `defaultLayerConfig`. The **type** surface stays on the static barrel — `import type { KeyframesAnimation } from "@mkbabb/keyframes.js"` costs no runtime edge.

### `MotionPath`

CSS-native path motion: sweep `offset-distance` from → to over an author `offset-path`. The browser owns the geometry — keyframes interpolates one scalar — so the sweep is WAAPI-eligible and runs on the compositor thread where possible.

```ts run
const { fromMotionPath, MotionPath } = await loadAnimationEngine();

const along = fromMotionPath(box, {
    path: "path('M 0 0 Q 100 -100 200 0')",
    rotate: "auto", // offset-rotate — face along the path
    duration: 200,
    autoPlay: false,
});
await along.play();

new MotionPath(card, { path: "path('M 0 0 H 200')", autoPlay: false }); // class form
```

Options: `path` (required — any `offset-path` value: `path()`, `ray()`, `url(#id)`, a basic shape), `from` (default `"0%"`), `to` (default `"100%"`), `rotate` (a static `offset-rotate`), `autoPlay`, plus every `AnimationOptions` key.

### `DrawSVG`

CSS-native SVG line drawing: ONE `getTotalLength()` read sets `stroke-dasharray` to the path length; the animation sweeps `stroke-dashoffset` `L → 0`, so the stroke draws in. A bare `<length>` — WAAPI-eligible, the simplest compositor-thread shape.

```ts run
const { fromDrawSVG, DrawSVG } = await loadAnimationEngine();

const draw = fromDrawSVG(pathEl, { duration: 200, autoPlay: false });
await draw.play();

// Erase instead — sweep 100% → 0% (percent strings, or 0..1 fractions):
fromDrawSVG(pathEl, { from: "100%", to: "0%", autoPlay: false });
new DrawSVG(pathEl, { autoPlay: false }); // class form; `.finished` resolves on completion
```

Options: `from`/`to` (`"0%"`–`"100%"` strings or `0`–`1` numbers; default draw-in `0% → 100%`), `autoPlay`, plus every `AnimationOptions` key. The target must be SVG geometry (`<path>`, `<line>`, `<circle>`, …) exposing `getTotalLength()`.

### `MorphSVG`

Path-shape morphing — interpolate one SVG path `d` into another. value.js's `PathGeometry` owns the geometry (arc-length sampling via `getTotalLength()`/`getPointAtLength()`); keyframes samples both paths at `samples` uniform points and lerps the matched point sets, so the engine's native numeric interpolation *is* the morph (a true blend — the midpoint is distinct from both endpoints, not a cross-fade).

```ts run
const { fromMorphSVG, MorphSVG } = await loadAnimationEngine();

// Morph a triangle into a square over 600ms:
const morph = new MorphSVG("M0,0 L10,0 L5,10 Z", "M0,0 L10,0 L10,10 L0,10 Z", {
    samples: 64,
    duration: 600,
});
const dAtMid = morph.sampleD(0.5); // the interpolated `d` at t = 0.5
```

Options: `samples` (point count per path; default `64`), plus every `AnimationOptions` key. Both inputs must be non-degenerate path `d` strings (non-zero arc length, ≥ 2 samples) — a degenerate input refuses with a typed `AnimationOptionError`. `MorphSVG.sampleD(t)` reassembles the morphed `d` at any `t`; the per-point coordinates also surface as `--morph-{i}-x`/`--morph-{i}-y` custom properties for direct CSS binding.

## `CSSKeyframesAnimation`

An abstraction over `KeyframesAnimation` that parses CSS `@keyframes` into `TemplateAnimationFrame` objects, then adds them to a base `KeyframesAnimation`.

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

`keyframes.ts` covers most of the CSS spec:

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

Unit parsing and resolution (length, angle, time, percentage, color, and container-query units) are handled by [`@mkbabb/value.js`](https://github.com/mkbabb/value.js). `ValueUnit`, `FunctionValue`, and `ValueArray` are the three token shapes; all define `toString()`, `valueOf()`, and `lerp()`.

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

`AnimationGroup` (parallel children, blended per-frame) and [`Sequence`](#sequence) (children positioned along a master clock) are the production realization of Web Animations Level 2's `GroupEffect`/`SequenceEffect` model — see [`Sequence`](#sequence) for the correspondence table.

## Presets

30+ ready-to-use animations in `src/animation/presets/`. All return `CSSKeyframesAnimation` instances and accept optional `InputAnimationOptions`. Each builds a value.js-bearing `CSSKeyframesAnimation`, so the presets ride the heavy dynamic boundary (the `presets` namespace on `loadAnimationEngine()`) rather than the value.js-free static barrel:

```ts
import { loadAnimationEngine } from "@mkbabb/keyframes.js";

const { presets } = await loadAnimationEngine();
const anim = presets.fadeIn({ duration: 500 });
anim.setTargets(element);
anim.play();
```

**Fade**: `fadeIn`, `fadeOut` · **Attention**: `pulse`, `heartbeat`, `glow`, `shake`, `bounce` · **Entrance/Exit**: `flip`, `rotateIn`, `slideIn`, `slideInLeft/Right`, `slideOutLeft/Right`, `blurIn/Out/InOut`, `jumpUp/Down`, `warpLeft/Right` · **Effects**: `hover`, `typewriter`, `typingCursor`, `rainbowText`, `progressBar`, `skeletonLoading`, `spinner`, `parallaxScroll`, `gradientBackground`, `rotateScale`, `accordionExpand`, `notificationBounce`, `textFocusBlur`

## The round-trip — ingest, drive, compile

keyframes.js's authoring object **is** parsed CSS `@keyframes`. That one fact opens a loop no other engine can close:

1. **Ingest** — read the live web's CSS (`@keyframes` in a stylesheet, or a *running* CSS animation) straight into a kf `CSSKeyframesAnimation`.
2. **Drive** — run it through the engine: physics-shaped springs, perceptual `oklab` color, scroll-driven progress, weighted blending.
3. **Compile** — emit the result **back** to zero-runtime CSS — `compileToCSS` is the parser run *backward* over the same data model (`format.ts` is `keyframes.ts` in reverse).

This is the moat. GSAP, Motion, and anime author in a bespoke tween model — for them "export to CSS" is a lossy re-derivation nobody ships, and "import the page's CSS" has no meaning. Because kf's internal model is *already* CSS, the forward and backward halves are inverses over one structure: a `var()`, a `matrix3d()`, a `cqw` round-trips **verbatim**. The whole round-trip rides the heavy engine, reached through one `await loadAnimationEngine()`.

### Ingest — read the live web's CSS

Walk the document's stylesheets into kf objects, or take over a CSS animation *mid-flight*. Every entry point returns a **diagnostics** channel — a cross-origin sheet whose `cssRules` throws becomes a `CORS_SKIP` row, never a silent drop.

```ts
const { fromStyleSheets, fromLiveAnimations, adoptRunning } =
    await loadAnimationEngine();

// Every @keyframes rule in document.styleSheets, reconstructed and keyed by name.
// The sibling `.class { animation: spin 2s … }` rule's options are recovered too,
// so each reconstructed animation carries its AUTHORED timing.
const { animations, diagnostics } = fromStyleSheets();
const spin = animations.get("spin")?.animation; // a CSSKeyframesAnimation
for (const d of diagnostics) console.warn(d.code, d.message); // e.g. CORS_SKIP

// Narrow to one name, or pass an explicit source (a sheet / array of sheets):
fromStyleSheets({ animationName: "spin" });
fromStyleSheets([...document.styleSheets]);

// fromLiveAnimations — the same walk, scoped to a RUNNING element's animations.
fromLiveAnimations(element);

// adoptRunning — the mid-flight TEMPORAL takeover: read the element's running
// CSS animation via getAnimations(), seed kf at the SAME currentTime (continuity,
// not seed-at-zero), and hand back the kf object to keep driving.
const { animation } = await adoptRunning(element, { animationName: "spin" });
```

`fromStyleSheets(source?, options?)` and `fromLiveAnimations(element, options?)` return `{ animations: Map<name, { name, animation, diagnostics }>, diagnostics }`. `resolveLiveKeyframes` is the lower-level walk both share. `adoptRunning(el, options)` returns `{ animation, … }` — the reconstructed kf object seeded at the live playhead.

### Scroll-as-CSS — the animation-timeline grammar

The CSS `animation-timeline` / `animation-range` grammar, round-tripped through value.js's typed extractor, and driven by a JS `ScrollScene` where the platform's native scroll-driven timelines aren't available. value.js owns the scroll **values** (the grammar, parsed verbatim — `scroll(root block)`, `entry 0%`, `cover 100%`); the kf `ScrollScene` owns **time** (resolving the live scroller against the DOM).

```ts
const { parseScrollCSS, roundTripScrollCSS, createScrollScene, pinCSS } =
    await loadAnimationEngine();

// PARSE the author grammar into typed options — verbatim, no DOM resolution:
const opts = parseScrollCSS(`
    .hero { animation-timeline: scroll(root block); animation-range: entry 0% cover 100%; }
`);
// opts.timeline => { kind: "scroll", scroller: "root", axis: "block" }
// opts.range    => { start: { phase: "entry", offset: "0%" }, end: { phase: "cover", offset: "100%" } }

// roundTripScrollCSS proves the grammar is an inverse pair (parse → serialize):
roundTripScrollCSS(`.hero { animation-timeline: scroll(root block); }`);

// DRIVE it — the JS fallback scene resolves the scroller against the DOM and
// maps the resolved range onto [0, 1]; feed `.progress` to any interpolator.
const scene = createScrollScene({ range: opts.range, scrub: 0.2 });
element.style.opacity = String(scene.progress);

// pinCSS — synthesize the position:sticky pin a scroll-pinned scene needs:
pinCSS();            // => "position: sticky; top: 0px;"
pinCSS({ top: 24 }); // => "position: sticky; top: 24px;"
```

`dispatchScrollBackend` picks the conservative-correct backend (native `ScrollTimeline` where eligible, the JS scene otherwise); `serializeScrollOptions` is the inverse of `parseScrollCSS`. Where the platform ships native scroll-driven timelines, [`createNativeTimeline`](#timeline) is the additive fast lane and this scene is the general fallback.

### Compile — the parser run backward

`compileToCSS` walks an orchestration graph — an [`AnimationGroup`](#animationgroup), a [`Sequence`](#sequence), or a bare child list (e.g. a [`stagger`](#stagger)-delayed cohort) — and emits a **pure, zero-runtime CSS** artifact: one `@keyframes` block + an `animation` shorthand per child, `replace`/`add` layering as `animation-composition`, springs as `linear()`, materialized stagger delays, and computed units (`vh`/`cqw`/`calc()`/`var()`) verbatim. A human pastes the result and ships with **zero kf bytes on the page**.

```ts
const { CSSKeyframesAnimation, compileToCSS } = await loadAnimationEngine();

const fade = new CSSKeyframesAnimation({ duration: 600 })
    .fromString(`from { background-color: #c462d8; } to { background-color: #e85252; }`)
    .setTargets(element);

const { css, eligible, refusals } = await compileToCSS([fade]);
// eligible === true, refusals === []
// css is a paste-ready @keyframes block. Because the platform interpolates color
// in sRGB but kf interpolates in perceptual oklab, the compiler DENSIFIES the
// color track into intermediate oklab() stops, so the browser's piecewise-linear
// fill TRACKS kf's perceptual lerp — gated on a ΔE proof (ship only if it matches):
//
//   @keyframes a0 {
//     0%      { background-color: oklab(0.6573 0.1489 -0.1223); }
//     6.6667% { background-color: oklab(0.6563 0.1503 -0.1091); }
//     …
//   }
```

**The honest-refusal surface (the trust seam).** What cannot round-trip faithfully is **refused** with a named reason — never silently approximated. `compileToCSS` returns `{ css, eligible, refusals }`; when `eligible` is `false`, `refusals` names each child and why, and the JS playback is the only faithful path for those:

| Refusal reason | What it proves | The faithful path |
|---|---|---|
| `weighted-blend` | no `animation-composition` twin exists | JS `AnimationGroup` |
| `custom-renderer` | a closure cannot be CSS | JS playback |
| `perceptual-oklab` | the oklab densify exceeds the ΔE band | JS playback (true perceptual lerp) |
| `computed-unit-drift` | the narrow case where verbatim emit would drift | JS playback |

A refusal is **marketing for the moat**: it names exactly the kf axis (weighted blending, perceptual color) that exceeds pure CSS. `compileToCSS(input, options?)` options: `staggerDelays` (the materialized `stagger.delays(total)`, emitted as literal per-child `animation-delay`), `densifyStops` (the oklab stop count), `deltaEEpsilon` (the ship-vs-refuse threshold), `printWidth`.

> The snippets in this section are reached through `loadAnimationEngine()` and run against the built `dist/` (the `ts run` README examples in §Beyond CSS / §Animation are the CI-asserted set — `npm run proof:readme-runs`); the round-trip surface above is additionally exercised by `proof:ingest-replay`, `proof:scroll-roundtrip`, and `proof:compile-replay`.

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

**Tree-shaking — the value.js boundary.** The package is `"sideEffects": false` and splits along a static/dynamic boundary. The light physics/interpolation engines — `SpringProgress`, `SmoothProgress`, `NumericAnimation`, `ElementMorph`, the `Timeline` family, `RAFPlayback`, and the spring-stop helpers — carry **zero** static import edge to `@mkbabb/value.js`. A consumer that imports only these never pulls value.js (or the heavy CSS-keyframe parser) into its graph; the heavy engine (`KeyframesAnimation`, `CSSKeyframesAnimation`, `AnimationGroup`) is reached only through `loadAnimationEngine()`'s dynamic `import()`. This boundary is **gated in CI** by `proof:boundary`, which builds a spring-only entry and fails the build if any light module reintroduces a static value.js edge.

**Reduced motion.** Both the light and heavy engines honor `prefers-reduced-motion: reduce`. Opt in per surface:

- **Light interpolators** (`NumericAnimation`, `SmoothProgress`, `SpringProgress`, `ElementMorph`) — pass `respectReducedMotion: true`. `RAFPlayback` owns the shared snap-to-final gate, so the managed `.play()` path skips the rAF loop and lands on the final value in a single paint.
- **Heavy engine** (`KeyframesAnimation` / `CSSKeyframesAnimation`) — pass `respectReducedMotion: true`; `play()` snaps to the final frame (a single paint, `animationstart` → `animationend`) instead of running the rAF/WAAPI loop.
- **`AnimationGroup`** — set `group.respectReducedMotion = true`; `play()` composites every child's final frame once rather than driving the draw loop.

Off-DOM (SSR / Node) the check is a no-op and animations proceed normally.

**INP.** `AnimationGroup` composites N children per frame; for large groups (`> AnimationGroup.YIELD_BATCH`) `tick()` yields to the main thread between batches via `scheduler.yield()` (feature-detected) so a big composite doesn't run as one long task.

## Beyond CSS

The library also ships general-purpose interpolation primitives, decoupled from CSS and the DOM. These compose into a pipeline: `timeline → progress → interpolator → values → apply`.

Everything in this section lives on the **light static barrel** — `import { NumericAnimation, SpringProgress, … } from "@mkbabb/keyframes.js"` — and carries zero static value.js edge (see [tree-shaking](#baseline-tree-shaking--reduced-motion)). Two conventions hold throughout:

- **Easing is callable.** Every light primitive takes a `TimingFunction` (`t => t'`) or a typed `Easing` — `toEasing` normalizes a bare callable to the typed shape, synchronously. A string easing *name* throws an `UnknownEasingError` — resolve it once, up front: `const easing = await resolveEasing("easeOutCubic")`.
- **Every snippet executes.** Each example below runs verbatim against the built package in CI (`npm run proof:readme-runs`); `// =>` comments are asserted results, not aspirations.

### `NumericAnimation`

Keyframe interpolation over plain `{key: number}` objects. Zero-allocation hot path — returns the same object reference each call. Two usage modes: stateless `.at()` queries, or managed `.play()` with rAF-driven playback.

```ts run
// Stateless — drive from your own render loop
const anim = new NumericAnimation([
    { x: 0, y: 0, opacity: 0 },
    { x: 100, y: 200, opacity: 1 },
]);
anim.at(0.5); // => { x: 50, y: 100, opacity: 0.5 }

// Managed — rAF playback with a per-frame callback; a string easing
// name resolves once, up front:
const easing = await resolveEasing("easeOutCubic");
const dial = new NumericAnimation([{ angle: 0 }, { angle: Math.PI * 4 }], {
    duration: 250,
    timingFunction: easing,
});
await dial.play(({ angle }) => {
    ctx.clearRect(0, 0, w, h);
    drawDial(angle);
});
```

Options: `duration` (ms, required for `.play()`), `timingFunction` (callable or `Easing` — string names throw; resolve via `resolveEasing`), `positions` (explicit keyframe positions as percentages), `respectReducedMotion`. Call `.stop()` to cancel a running playback — the play promise resolves immediately.

### `SmoothProgress`

Exponential smoothing for progress values. Frame-rate independent via `tickDt(dt)` — the canonical millisecond step, the same `Tickable` surface [`RAFPlayback.drive`](#rafplayback) owns.

```ts run
const smooth = new SmoothProgress({ damping: 0.15 });
smooth.setTarget(1);
smooth.tickDt(16.7); // one frame step — asymptotically approaches the target
smooth.snap();       // instantly converge
smooth.current; // => 1

// Managed — the smoother owns a rAF loop until it settles:
smooth.setTarget(0);
smooth.play((value) => element.style.setProperty("--p", String(value)));
smooth.stop();
```

Options: `damping` (lerp factor, default 0.1), `snapThreshold` (auto-snap distance, default 0.001), `targetEpsilon` (ignore target changes smaller than this — filters scroll jitter, default 0), `initial`, `clamp` (default `true` — constrain to `[0, 1]`), `respectReducedMotion`. Reads: `.current`, `.target`, `.settled`.

### `ElementMorph`

Interpolates position and scale between two DOM elements (or rects). Produces CSS transforms. Stateless `.apply()` or managed `.play()`.

```ts run
// Stateless
const morph = new ElementMorph(sourceEl, targetEl);
morph.apply(element, 0.5); // writes transform + transformOrigin at progress 0.5

// Managed playback — feed it a spring for the canonical overshoot
const springy = new ElementMorph(sourceEl, targetEl, {
    duration: 250,
    timingFunction: springTimingFunction({ response: 0.4, dampingFraction: 0.7 }),
});
await springy.play(element);
```

Re-measures on demand via `morph.measure(from, to)` (elements or `{ x, y, width, height }` rects). Call `.stop()` to cancel. Options: `duration`, `timingFunction` (callable or `Easing`), `transformOrigin` (default `"top left"`).

### `Timeline`

Abstract progress driver. Pipeline: `sample() → clamp → easing → boundary snap → smoothing`.

```ts run
const easing = await resolveEasing("easeOutCubic");
const timeline = new KeyframesScrollTimeline({
    threshold: 0.35,
    easing,
    boundaryEpsilon: 0.005,
    smoothing: { damping: 0.15, targetEpsilon: 0.002 },
});

function update() {
    element.style.opacity = String(timeline.tick());
    requestAnimationFrame(update);
}

// ManualTimeline — externally-set value → progress; smoothing off by default
const manual = new ManualTimeline();
manual.set(0.25);
manual.tick(); // => 0.25
```

Options: `easing` (callable or `Easing`), `smoothing` (`SmoothProgressOptions` or `false`), `boundaryEpsilon` (snap eased values within this distance of 0/1 to the boundary — prevents scroll-endpoint oscillation, default 0.005).

Subclasses:
- **`KeyframesScrollTimeline`** — scroll position → progress. `threshold` sets viewport fraction for full progress (default 0.35). Injectable `getScrollY`/`getViewportHeight`.
- **`ManualTimeline`** — externally set value → progress. Smoothing off by default.

Where the platform ships native scroll-driven timelines, `createNativeTimeline({ kind: "scroll" | "view", … })` feature-detects and returns a native `AnimationTimeline` (or `null`) as an additive fast lane — the JS sampler stays the general fallback.

See [`docs/scroll-morph.md`](docs/scroll-morph.md) for an architecture guide on building jitter-free scroll-driven morph animations.

### `SpringProgress`

A live-target spring tracker — the physics core under [`drag`](#drag--draggable). The solver integrates the damped harmonic oscillator **analytically** between target changes; setting `target` mid-flight re-seats the closed-form solution from the current `(value, velocity)`, so the trajectory never jumps. API mirrors SwiftUI's `.spring(response:dampingFraction:)`.

```ts run
const spring = new SpringProgress({ response: 0.5, dampingFraction: 0.86 });
spring.target = 1;   // re-seat the closed form — continuous, no jump
spring.tickDt(16.7); // advance one frame (milliseconds); returns the new value
spring.settled; // => false

// Managed — the spring owns a rAF loop until it settles; a new target
// while playing auto-resumes the loop:
spring.play((value, velocity) => {
    element.style.transform = `translateX(${value * 100}px)`;
});
spring.target = 0.5;
spring.stop();

// The time-based surface (Motion's idiom): perceptual duration + bounce
const bouncy = SpringProgress.fromDuration({ visualDuration: 0.4, bounce: 0.3 });
bouncy.settled; // => true
```

Options: `response` (oscillation period in seconds, default 0.5), `dampingFraction` (ζ — `1` critically damped, `< 1` rings, `> 1` overdamped; default 0.86), `initial`, `initialVelocity` (units/s), `settleThreshold` / `velocitySettleThreshold` (default `1e-3`), `respectReducedMotion`. Reads: `.value`, `.velocity`, `.target`, `.settled`; plus `subscribe(fn)` → unsubscribe, `reset(value?, velocity?)`, `snap()`, `dispose()`. `SpringProgress.fromDuration({ visualDuration | duration, bounce })` maps `response = visualDuration`, `dampingFraction = 1 − bounce`.

### `springLinearStops` & `springTimingFunction`

One analytic solver, two emissions. `springLinearStops` samples a `0 → 1` spring into a CSS `linear()` timing-function string (stylesheets, design tokens); `springTimingFunction` samples the same curve into a typed `Easing` — `.fn` is the callable for JS interpolation, `.css` its identical `linear()` twin, so a WAAPI delegation runs the true overshoot on the compositor (see [Web Animations API](#web-animations-api)).

```ts run
// CSS: a linear() string for transition/animation-timing-function
const stops = springLinearStops({ response: 0.5, dampingFraction: 0.45 });
stops.startsWith("linear(0, "); // => true
stops.endsWith(", 1)"); // => true

// JS: a typed Easing — feed it to NumericAnimation / ElementMorph / KeyframesAnimation
const spring = springTimingFunction({ response: 0.5, dampingFraction: 0.45 });
spring.fn(0); // => 0
spring.fn(1); // => 1
// ζ < 1 overshoots past 1 mid-curve — the whole point:
Math.max(...Array.from({ length: 101 }, (_, i) => spring.fn(i / 100))) > 1; // => true
// Same solver, same preset, ONE curve:
spring.css === springLinearStops({ response: 0.5, dampingFraction: 0.45 }); // => true
```

Options (both): `response`, `dampingFraction`, `sampleCount` (default 24 stops / 64 samples), `settleThreshold` (default `1e-3`), `maxDuration` (default `4 × response` — raise it for very underdamped springs, ζ < 0.3).

### `RAFPlayback`

THE managed rAF driver — every loop in the engine rides this one generation-guarded core, through three entry shapes: `play(duration, onTick)` (progress loop), `drive(tickable)` (step a `Tickable` — `SpringProgress`, `SmoothProgress` — until it settles), and `loop(cb)` (self-rescheduling async frame loop).

```ts run
const playback = new RAFPlayback();

// Duration loop — progress 0 → 1 over 200ms; resolves on completion or stop():
await playback.play(200, (progress) => {
    element.style.opacity = String(progress);
});

// Bind-proof by construction: the control surface is arrow class-fields, so a
// destructured method keeps its receiver — no .bind(), ever:
const { stop } = playback;
playback.play(10_000, () => {});
stop(); // safe — the pending play promise resolves immediately
playback.running; // => false

// Settle loop — drive any Tickable to rest:
const spring = new SpringProgress({ response: 0.3 });
spring.target = 1;
playback.drive(spring, () => {
    element.style.transform = `translateX(${spring.value * 100}px)`;
});
playback.stop();
```

Notes: `play(duration, onTick, { respectReducedMotion })` snaps to `onTick(1)` in a single paint under `prefers-reduced-motion: reduce` — the shared reduced-motion gate the light primitives route through. `drive` is idempotent (re-arm freely on every target re-seat; the loop auto-stops on settle). `loop(cb)` reschedules only after the (possibly async) callback completes, so a slow frame never double-schedules. `.running` reports loop ownership.

### `stagger`

A construction-time per-index delay generator — a pure distribution, zero per-frame cost. Returns `(index, total) => delayMs` with a `.delays(total)` materializer.

```ts run
const delay = stagger(5, { each: 50, from: "center" });
delay.delays(5); // => [100, 50, 0, 50, 100]
delay(0, 5); // => 100

// Reshape the distribution with an easing (resolved up front):
const eased = stagger(4, { each: 100, ease: await resolveEasing("easeOutCubic") });
eased(3, 4); // => 300
```

Options: `each` (per-step ms, default 100), `from` (`"first"` | `"last"` | `"center"` | `"edges"` | an index; default `"first"`), `ease` (callable or `Easing`; string names throw). Feed the delays to `AnimationGroup` per-child `delay`, `setTimeout`, or `animation-delay` — the generator is just arithmetic.

### `flip` / `flipShared`

FLIP (First-Last-Invert-Play) layout animation over [`ElementMorph`](#elementmorph). `flip` animates a layout change on one element: measure (First) → `mutate()` (Last) → invert + play, with the two layout reads batched (no read/write thrash). `flipShared` animates element `a` onto element `b`'s rect — the shared-element / `layoutId` idiom.

```ts run
// FLIP a layout change — class toggle, reparent, any synchronous mutation:
await flip(card, () => card.classList.toggle("expanded"), { duration: 200 });

// Shared-element FLIP — animate `a` onto `b`'s rect; springs welcome:
await flipShared(a, b, {
    duration: 200,
    timingFunction: springTimingFunction({ response: 0.3, dampingFraction: 0.8 }),
});
```

Options: `duration` (default 300), `timingFunction` (callable or `Easing` — `springTimingFunction(…)` makes the FLIP springy), `transformOrigin` (default `"top left"`). Both return the play promise.

### `drag` / `Draggable`

A one-axis spring-backed drag: pointer capture follows the pointer as a live spring target; release hands the sampled pointer velocity (a rolling 100ms window) to the spring's re-seat, so the fling leaves the hand C¹-continuous — at exactly the flick speed. A 2-D drag composes two `Draggable`s, one per axis.

```ts run
const draggable = drag(element, {
    axis: "x",
    springOptions: { response: 0.3, dampingFraction: 0.9 },
});

const unsubscribe = draggable.subscribe((value, velocity) => {
    element.style.transform = `translateX(${value}px)`;
});

draggable.dragging; // => false
unsubscribe();
draggable.detach(); // remove listeners; `.dispose()` tears down spring and all
```

Options: `axis` (`"x"` | `"y"`, default `"x"`), `transform` (map a client px coordinate → your value domain), `spring` (bring your own `SpringProgress`) or `springOptions`, `velocityWindow` (ms, default 100). Reads: `.value`, `.velocity`, `.dragging`, `.settled`, and `.spring` (the physics core). `drag(element, options)` is the one-call form of `new Draggable(options)` + `.attach(element)`.

### `decay` / `decayRest`

Frictional decay (inertial glide) — the closed-form sibling of the spring, for the fling with no target: velocity bleeds off under friction (`v' = −k·v`), coasting toward a finite rest point. `decay` returns a pure sampler; `decayRest` returns just the projected endpoint — the snap-target / paginated-fling decision without running a loop.

```ts run
const glide = decay({ initial: 0, velocity: 1200, friction: 5 });
glide(0); // => { value: 0, velocity: 1200 }
glide(0.25).value < 240; // => true

// The projected endpoint, x0 + v0/k — no loop needed:
decayRest({ velocity: 1200, friction: 5 }); // => 240
```

Options: `velocity` (required — release speed, units/s), `initial` (default 0), `friction` (1/s, strictly positive — larger = shorter glide; default 5). The sampler takes `t` in **seconds** (the spring's native clock).

### `Sequence`

The temporal orchestrator: position many animations along ONE master clock and drive them with a GSAP-class transport. Where [`AnimationGroup`](#animationgroup) composites many animations on one target per frame (spatial), `Sequence` maps a master playhead onto each child's local clock (temporal) — they compose, not compete. `Sequence` itself is light; the children arrive from the heavy engine.

```ts run
const { CSSKeyframesAnimation } = await loadAnimationEngine();

const fade = new CSSKeyframesAnimation({ duration: 300 })
    .fromString(`from { opacity: 0; } to { opacity: 1; }`)
    .setTargets(box);
const slide = new CSSKeyframesAnimation({ duration: 400 })
    .fromString(`from { transform: translateX(-100px); } to { transform: translateX(0); }`)
    .setTargets(card);

const seq = new Sequence()
    .add(fade)            // auto-append at 0
    .add(slide, "-=100"); // overlap the previous segment by 100ms

seq.duration; // => 600
seq.seek(300);     // scrub — master playhead → each child's local clock
await seq.play();  // the rAF transport drives the SAME map: play ≡ seek
seq.timeScale(2).repeat(2).yoyo(); // transport persists across plays
```

Positions: a number (absolute ms), `"+=n"` / `"-=n"` (relative to the insertion cursor), or a label registered via `.label(name, at)` (unknown labels throw). Transport: `play()` / `pause()` / `resume()` / `stop()`, `seek(ms)`, `progress` (get/set, `[0, 1]`), `timeScale(n)`, `reverse()`, `repeat(n | Infinity)`, `yoyo()`, `await seq.finished`. Options: `respectReducedMotion` (snap to the rest frame in one paint).

**Web Animations Level 2, in production.** `AnimationGroup` and `Sequence` are the production realization of WAAPI Level 2's `GroupEffect`/`SequenceEffect` model — grouping semantics no browser has ever shipped (polyfill-only, still a Working Draft, with `SequenceEffect` proposed for deletion upstream — [csswg-drafts#9557](https://github.com/w3c/csswg-drafts/issues/9557)) — running over real WAAPI children where eligible, with weighted blending and a transport the spec lacks. The correspondence is named, not mimicked: keyframes.js does not mirror the unsettled L2 class shapes, polyfill the missing native API, or pin its surface to class names the CSSWG is actively reworking.

| Web Animations Level 2 concept | keyframes.js surface |
| --- | --- |
| `GroupEffect` (parallel children) | [`AnimationGroup`](#animationgroup) |
| `SequenceEffect` / proposed `EffectTiming` `align: sequence` | `Sequence` auto-append |
| `EffectTiming` `align: start` | `Sequence` `at: 0` |

### `viewTransition`

The LIGHT View-Transitions dispatch: mutate the DOM behind a native View Transition where the platform ships one, and fall back to a `flipShared` shared-element morph (or a bare immediate mutation) everywhere else — behind ONE normalized handle whose `backend` is queryable and whose promises never reject. Feature-detects `startViewTransition` (and its typed-`update` object overload); PRM routes through the ONE `withReducedMotion` gate (mutate directly, settle).

```ts run
// Off-platform (no `document.startViewTransition`, no shared pairs) it degrades
// to a bare immediate mutation — backend queryable SYNCHRONOUSLY at dispatch:
const vt = viewTransition(() => box.classList.add("open"), { types: ["forward"] });
vt.backend; // => "immediate"
await vt.finished; // never rejects — a skipped/aborted transition settles cleanly
```

Options: `types` (typed same-doc VT), `shared` (`[from, to]` `flipShared` fallback pairs — `backend: "flip"`), `duration`/`timingFunction` (the fallback play), `fallback` (`"flip"` | `"none"` | a custom async runner), `respectReducedMotion` (default `true` — PRM snaps to `"immediate"`). The `backend` is `"view-transition"` (native), `"flip"` (the `flipShared` fallback), or `"immediate"` (bare mutate). Its zero-runtime CSS twin is [`compileToViewTransition`](#compiletoviewtransition).

### `compileToViewTransition`

The round-trip engine pointed at native View Transitions: compile a **name-keyed role spec** to a PURE, ZERO-RUNTIME CSS artifact over the `::view-transition-*` pseudo tree (HEAVY — reached via `loadAnimationEngine()`). Each name's `old`/`new` get a full kf `@keyframes` block + `animation` shorthand (springs → `linear()`); `::view-transition-group(name)` gets a **timing-only** override (duration + timing-function, never `animation-name` — the UA's rect-morph keyframes ARE the free zero-runtime FLIP), so the group stays temporally coherent with the tracks. Non-round-trippable shapes REFUSE with a named reason (the CC-3 four ∪ `vt-scroll-grammar` / `vt-element-scoped-computed` / `vt-snapshot-inapplicable` / `vt-name-collision`).

```ts run
const { CSSKeyframesAnimation, compileToViewTransition } = await loadAnimationEngine();

const out = new CSSKeyframesAnimation({ duration: 300 });
out.fromString(`@keyframes o { from { opacity: 1 } to { opacity: 0; transform: scale(0.9) } }`);
const enter = new CSSKeyframesAnimation({ duration: 300 });
enter.fromString(`@keyframes n { from { opacity: 0; transform: scale(1.05) } to { opacity: 1 } }`);

const vt = await compileToViewTransition({ hero: { old: out, new: enter } }, { types: ["forward"] });
vt.names; // => ["hero"]
vt.css.includes("::view-transition-group(hero)"); // => true
vt.css.includes("animation-name"); // => false   // the group override is timing-only
```

Options: `types` (wraps rules in `:active-view-transition-type(...)`), `crossDocument` (prepend `@view-transition { navigation: auto }`), `reducedMotion` (append the PRM `animation: none` block, default `true`), plus every `CompileOptions` key. The consumer assigns `view-transition-name: <name>` to its elements from the returned `names`.

## Ecosystem & agents

- **`llms.txt`** — the agent surface: a machine-readable index of every capability, generated
  from the CI-verified published surface (`docs/published-surface.md`) by running
  `node scripts/gen-agent-surface.mjs`. The artifact is not tracked in git (generated at CI time);
  `llms-full.txt` carries the expanded form.

## Build & Development

```sh
npm run build        # library (ESM) → dist/keyframes.js + lazy engine chunks + keyframes.d.ts
npm run gh-pages     # demo (multi-scene SPA, demo/app) → dist/gh-pages/
npm run dev          # vite dev server (demo/app)
npm test             # vitest (jsdom)
npm run bench        # vitest bench
npm run proof:readme-runs  # execute every runnable README snippet against the built dist/
```

### Local CI repro

A macOS-pass / Linux-fail CI flake (a render-race, an absolute frame/ms threshold) can be reproduced locally — no push, no 30-minute wait — by running the demo-smoke roster inside the same Linux container the CI runner uses:

```sh
make ci-linux    # node:24-slim container · npm ci → gh-pages → proof:all:demo
```

It pulls `node:24-slim` (kf's CI Node), mounts the repo at `/workspace`, installs the Playwright browser, builds the demo, and runs the demo gate roster with `KF_REQUIRE_BROWSER=1`, exiting with the container's code. `docker` is the only requirement.

**Dependencies**: [`@mkbabb/value.js`](https://github.com/mkbabb/value.js) (ValueUnit, Color, math, parsing, normalization) and [`@mkbabb/parse-that`](https://github.com/mkbabb/parse-that) (parser combinators).

**TypeScript**: `strict: true`, `verbatimModuleSyntax: true`, `target: ES2022`, `moduleResolution: bundler`.

**Node**: >=22.

## Contributing

Open a PR against `master`. Run `npm run proof:all` before pushing — the gate roster is the
acceptance bar.

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
