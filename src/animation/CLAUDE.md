# src/animation/

Core animation engine. Library entry point is `index.ts` → `dist/keyframes.js`.

## The value.js static/dynamic boundary

`index.ts` is the package barrel and the boundary between two surfaces:

- **LIGHT (static)** — the physics/interpolation engines: `SpringProgress`,
  `SmoothProgress`, `NumericAnimation`, `ElementMorph`, the `Timeline` family,
  `RAFPlayback`, and the spring-stop helpers (`springLinearStops`,
  `springTimingFunction`). None carries a static import edge to
  `@mkbabb/value.js`: they read leaf helpers (rAF + clamp/lerp/scale) from
  `internal/leaves.ts` and accept easing as a callable `TimingFunction`.
- **HEAVY (dynamic)** — the CSS-keyframe parsing engine in `engine.ts`:
  `Animation`, `CSSKeyframesAnimation`, `AnimationGroup`, `getAnimationId`,
  `getTimingFunction`, `resolveKeyframes`, and the option constants. These
  genuinely need value.js and are reached ONLY through `loadAnimationEngine()`
  — an `await import("./engine")`. The barrel holds no static edge to that
  module, so a light-only consumer never pulls value.js (or the parser) in.

Types stay whole on the static barrel (`import type` is erased under
`verbatimModuleSyntax`). The boundary is gated in CI by `proof:boundary`
(`scripts/proof-boundary.mjs`): it bundles a spring-only entry and fails if any
light module reintroduces a static value.js / `engine.ts` edge.

## Files

```
animation/
├── index.ts         # package barrel — light exports + loadAnimationEngine() (the boundary)
├── engine.ts        # HEAVY: Animation, CSSKeyframesAnimation, getAnimationId, getTimingFunction re-exports
├── group.ts         # AnimationGroup — multi-animation compositor (layer blending, scheduler.yield, PRM snap)
├── waapi.ts         # WAAPI eligibility + delegation (emits a spring linear() when the easing carries one)
├── adapter.ts       # resolveKeyframes — input → ResolvedKeyframes
├── numeric.ts       # NumericAnimation — keyframe interp over {key: number} objects
├── smooth.ts        # SmoothProgress — exponential smoothing for progress values
├── spring.ts        # SpringProgress — iOS-style spring physics tracker
├── springLinearStops.ts    # spring → CSS linear() stops string
├── springTimingFunction.ts # spring → callable TimingFunction (tagged with its linear() equivalent)
├── morph.ts         # ElementMorph — position/scale interp between DOM rects (composes NumericAnimation)
├── timeline.ts      # Timeline (abstract), ScrollTimeline, ManualTimeline
├── playback.ts      # RAFPlayback — shared rAF lifecycle + the reduced-motion snap gate
├── animations.ts    # 30+ preset animations (fadeIn, bounce, shake, spinner, etc.)
├── constants.ts     # Types + defaults (AnimationOptions, Vars, AnimationFrame, etc.)
├── utils.ts         # Frame calculation, value interpolation, getTimingFunction
├── format.ts        # Animation → CSS string serialization
├── renderer.ts      # default DOM-style transform renderer
└── internal/        # value.js-free leaves (keep the light bundle clean)
    ├── leaves.ts            # clamp/scale/lerp + rAF shims (byte-equivalent to value.js)
    ├── binarySearch.ts      # binarySearchRange for segment lookup
    ├── easing-resolvable.ts # ONE shared string-easing-name resolver (eager-resolve + .ready() + dev-warn)
    ├── reduced-motion.ts    # ONE shared prefers-reduced-motion gate (SSR-safe)
    ├── scheduler.ts         # yieldToMain() — scheduler.yield() with a MessageChannel fallback
    └── css-easing.ts        # tag/read a TimingFunction's CSS easing string (spring linear())
```

## Classes

### `Animation<V extends Vars>` (`engine.ts`)
Core engine. Manages keyframes, timing, interpolation, playback.

- **Frame lifecycle**: `addFrame()` → `parse()` → `AnimationFrame[]` with precomputed `interpVars`
- **Playback**: `play()` / `pause()` / `resume()` / `stop()` / `reset()`
- **Config**: `setDuration()`, `setDelay()`, `setDirection()`, `setFillMode()`, `setTimingFunction()`, `setIterationCount()`, `setColorSpace()`, `setHueMethod()`, `setUseWAAPI()`, `setRespectReducedMotion()`, `setOptions()` (bulk), `setTargets()`
- **Interpolation**: `interpFrames(t, apply?, buffer?)` — samples all active frames at time `t`
- **Fill**: `fillForwards()` / `fillBackwards()`
- **Reduced motion**: with `respectReducedMotion: true`, `play()` snaps to the final frame in a single paint (`animationstart` → `animationend`) instead of running the rAF/WAAPI loop
- **Events**: dispatches `animationstart`, `animationiteration`, `animationend` on targets

### `CSSKeyframesAnimation<V>` extends `Animation<V>` (`engine.ts`)
Adds the CSS `@keyframes` parsing layer: `fromString(css)`, `fromKeyframes(map)`, `fromVars(vars[])`, `transform(vars)`.

### `AnimationGroup<V>` (`group.ts`)
Composites multiple animations with layer blending (`replace` / `add` / `weighted`).

- Manages its own rAF loop; marks children `managed = true`
- `tick()` ticks children in batches, yielding to the main thread between
  batches for groups larger than `AnimationGroup.YIELD_BATCH` (INP relief)
- `respectReducedMotion = true` → `play()` composites every child's final frame once, no draw loop

### `NumericAnimation<T extends Record<string, number>>` (`numeric.ts`)
Zero-allocation keyframe interpolation over plain numeric objects. `at(progress)`, `updateKeyframe()`, managed `play()`. String easing names resolve through the shared `EasingResolvable`; `play()` routes its reduced-motion snap through `RAFPlayback`.

### `SmoothProgress` (`smooth.ts`), `SpringProgress` (`spring.ts`)
Progress trackers. `setTarget` → `tick()`/`tickDt(dt)` → `current`. Both honor `respectReducedMotion` via the shared `prefersReducedMotion()` gate.

### `ElementMorph` (`morph.ts`)
Interpolates position/scale between two DOM rects. Composes `NumericAnimation`, so it inherits the `EasingResolvable` + `RAFPlayback` reduced-motion behavior.

### `Timeline` (abstract), `ScrollTimeline`, `ManualTimeline` (`timeline.ts`)
Progress drivers; the caller owns the rAF loop. Pipeline: `sample() → clamp → easing → boundary snap → smoothing → progress`. String easing names resolve through the shared `EasingResolvable`.

### `RAFPlayback` (`playback.ts`)
Shared rAF playback lifecycle for the light interpolators. Owns the rAF handle AND the `prefers-reduced-motion` snap gate (`play(duration, onTick, { respectReducedMotion })` → `onTick(1)` once, no loop). Exported so consumers driving their own light playback get the same gate.

## Boundary ergonomics — `EasingResolvable` (`internal/easing-resolvable.ts`)

The light engines accept easing as a callable `TimingFunction` (value.js-free)
OR a string easing *name* from value.js's registry. A name resolves through the
dynamic `import("../engine")` boundary. `EasingResolvable` is the ONE shared
resolver (`numeric.ts` + `timeline.ts` consume it directly; `morph.ts` via
`numeric`): it eager-resolves the name at construction, exposes `.ready()` for
the rare first-synchronous-`.at()` case, and emits a one-time dev-only warning
(`warnIfPending`) if a name is read before it resolves — the wrong-until-ready
window is detectable, not silent.

## Playback Modes

1. **rAF** (default) — `requestAnimationFrame` loop in main thread
2. **WAAPI** (opt-in via `useWAAPI`) — compositor-thread via `Element.animate()` when eligible
3. **Managed** — `AnimationGroup` controls tick/draw; the child doesn't own its loop
4. **Reduced-motion snap** — under `respectReducedMotion` + `prefers-reduced-motion`, snap to the final frame

## WAAPI Eligibility (`waapi.ts`)

Requires DOM targets, the default DOM-style renderer, a uniform timing function
across frames, no computed units (`vh`/`calc`/`var`/`cqw`), and no color
interpolation. Falls back to rAF silently. `toWAAPIOptions` emits the uniform
timing function's CSS easing string when it carries one (a spring's `linear()`
via `springTimingFunction`'s tag), otherwise bare `linear`.

## Key Types (`constants.ts`)

- `Vars<T>` — `{[key: string]: number | string | T}`
- `TimingFunction` — `(t: number) => number`
- `AnimationFrame<V>` — compiled frame: `ixs`, `time`, `flatVars`, `interpVars`, `allInterpVars`, `timingFunction`
- `AnimationOptions` — `{duration, delay, iterationCount, direction, fillMode, timingFunction, useWAAPI, respectReducedMotion, colorSpace, hueMethod?}`
- `BlendMode` — `'replace' | 'add' | 'weighted'`

Defaults: 1000ms duration, 0 delay, 1 iteration, normal direction, forwards fill, easeInOutCubic, WAAPI on, reduced-motion off, oklab color space.

## Dependencies

- `@mkbabb/value.js` — `ValueUnit`, `Color`, the CSS parser, the easing registry, math/easing helpers. Reached by the HEAVY surface only (statically in `engine.ts`/`constants.ts`/`waapi.ts`; never by the light modules).
- `internal/leaves.ts` — value.js-free leaf copies of `clamp`/`scale`/`lerp` + rAF shims, so the light engines carry no static value.js edge.
