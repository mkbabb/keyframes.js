# src/animation/

Core animation engine. Library entry point is `index.ts` → `dist/keyframes.js`.

## The value.js static/dynamic boundary

`index.ts` is the package barrel and the boundary between two surfaces:

- **LIGHT (static)** — the physics/interpolation engines: `SpringProgress`,
  `SmoothProgress`, `NumericAnimation`, `ElementMorph`, the `Timeline` family,
  `RAFPlayback`, the spring-stop helpers (`springLinearStops`,
  `springTimingFunction`), and the easing factories (`resolveEasing`,
  `toEasing`). None carries a static import edge to `@mkbabb/value.js`: they
  read leaf helpers (rAF + clamp/lerp/scale) from `internal/leaves.ts` and
  accept easing as a callable `TimingFunction` or a typed `Easing`
  (`{ fn, css? }`); a string easing NAME is resolved once, up front, via
  `await resolveEasing(name)` — the one dynamic edge.
- **HEAVY (dynamic)** — the CSS-keyframe parsing engine in `engine.ts`:
  `Animation`, `CSSKeyframesAnimation`, `AnimationGroup`, `getAnimationId`,
  `getTimingFunction`, `resolveKeyframes`, and the option constants. These
  genuinely need value.js and are reached ONLY through `loadAnimationEngine()`
  — an `await import("./engine")`. The barrel holds no static edge to that
  module, so a light-only consumer never pulls value.js (or the parser) in.

Types stay whole on the static barrel (`import type` is erased under
`verbatimModuleSyntax`). The boundary is gated in CI by `proof:boundary`
(`scripts/proof-boundary.mjs`): it bundles EVERY light barrel export as its own
entry (the entry set is parsed from the barrel, self-enforcing), asserts zero
static value.js / `engine.ts` edges per entry, asserts the heavy engine emits
as a dynamic chunk behind `loadAnimationEngine`, and greps light source for
dormant static specifiers.

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
├── springTimingFunction.ts # spring → typed Easing ({ fn, css: linear() } — one curve, two forms)
├── morph.ts         # ElementMorph — position/scale interp between DOM rects (composes NumericAnimation)
├── timeline.ts      # Timeline (abstract), ScrollTimeline, ManualTimeline
├── playback.ts      # RAFPlayback — THE managed rAF driver (play/drive/loop) every loop rides
├── easing.ts        # resolveEasing(name) async factory + toEasing normalizer (light)
├── animations.ts    # 30+ preset animations (fadeIn, bounce, shake, spinner, etc.)
├── constants.ts     # Types + defaults (Easing, AnimationOptions, Vars, AnimationFrame, etc.)
├── utils.ts         # Frame calculation, value interpolation, getTimingFunction (CSS Easing L1 complete)
├── format.ts        # Animation → CSS string serialization (Easing.css faithful)
└── internal/        # value.js-free leaves (keep the light bundle clean)
    ├── leaves.ts            # clamp/scale/lerp + rAF shims (byte-equivalent to value.js; parity-tested)
    ├── binarySearch.ts      # binarySearchRange for segment lookup
    ├── errors.ts            # AnimationOptionError / UnknownEasingError + parseOption (fail-explicit seam)
    ├── reduced-motion.ts    # ONE prefers-reduced-motion detector + the ONE withReducedMotion gate
    └── scheduler.ts         # yieldToMain() — live scheduler.yield probe + cached fallback
```

## Classes

### `Animation<V extends Vars>` (`engine.ts`)
Core engine. Manages keyframes, timing, interpolation, playback.

- **Frame lifecycle**: `addFrame()` → `parse()` → `AnimationFrame[]` with precomputed `interpVars`
- **Playback**: `play()` / `pause()` / `resume()` / `stop()` (halt, settle, never paints) / `reset()` (explicit rewind: paint initial + settle) / `settle()` (pure teardown)
- **Rest-position contract**: `restPosition` derives once from `fillMode` (forwards/both → final; none/backwards → initial); completion paints the rest frame via `paintRest()` then settles. Reduced-motion = "rest = final, paint, settle" — the same terminal path as a forwards completion.
- **Config**: `setDuration()`, `setDelay()`, `setDirection()`, `setFillMode()`, `setTimingFunction()`, `setIterationCount()`, `setColorSpace()`, `setHueMethod()`, `setUseWAAPI()`, `setRespectReducedMotion()`, `setOptions()` (bulk), `setTargets()` — ALL fail-explicit: malformed present input throws a typed `AnimationOptionError`; genuine omission defaults
- **Interpolation**: `interpFrames(t, apply?, buffer?)` — samples all active frames at time `t` (hot path reads `frame.timingFunction.fn`)
- **Fill**: `fillForwards()` / `fillBackwards()`
- **Reduced motion**: with `respectReducedMotion: true`, `play()` snaps to the final frame in a single paint (`animationstart` → `animationend`) instead of running the rAF/WAAPI loop — routed through the ONE `withReducedMotion` gate
- **Events**: dispatches `animationstart`, `animationiteration`, `animationend` on targets (SSR-safe capability skip)
- **Loops**: `readonly playback: RAFPlayback` owns the rAF handle for the standalone play loop AND the WAAPI shadow tick

### `CSSKeyframesAnimation<V>` extends `Animation<V>` (`engine.ts`)
Adds the CSS `@keyframes` parsing layer: `fromString(css)`, `fromKeyframes(map)`, `fromVars(vars[])`, `transform(vars)`.

### `AnimationGroup<V>` (`group.ts`)
Composites multiple animations with layer blending (`replace` / `add` / `weighted`).

- Draw loop rides its `readonly playback: RAFPlayback`; marks children `managed = true`
- `tick()` ticks children in batches, yielding to the main thread between
  batches for groups larger than `AnimationGroup.YIELD_BATCH` (INP relief)
- `respectReducedMotion = true` → `play()` composites every child's final frame once, no draw loop; `play()` is re-entrant (`_playingPromise` guard)
- Rest-position contract: completion `settle()`s (pure, leaves the rest frame painted by each child's fill); `reset()` is the explicit rewind (paint initial + settle); `stop()` = halt + rewind (transport semantics)

### `NumericAnimation<T extends Record<string, number>>` (`numeric.ts`)
Zero-allocation keyframe interpolation over plain numeric objects. `at(progress)`, `updateKeyframe()`, managed `play()`. Accepts a callable `TimingFunction` or typed `Easing` only (a string name throws — resolve via `await resolveEasing(name)` first); `play()` routes its reduced-motion snap through `RAFPlayback`.

### `SmoothProgress` (`smooth.ts`), `SpringProgress` (`spring.ts`)
Progress trackers — pure steppers implementing `Tickable` (`tickDt(dt)` + `settled`). `setTarget` → `tick()`/`tickDt(dt)` → `current`; the managed `.play()` loop delegates to `RAFPlayback.drive`. Snaps route through the ONE `withReducedMotion` gate.

### `ElementMorph` (`morph.ts`)
Interpolates position/scale between two DOM rects. Composes `NumericAnimation`, so it inherits the callable/`Easing`-only easing contract + the `RAFPlayback` reduced-motion behavior.

### `Timeline` (abstract), `ScrollTimeline`, `ManualTimeline` (`timeline.ts`)
Progress drivers; the caller owns the rAF loop. Pipeline: `sample() → clamp → easing → boundary snap → smoothing → progress`. Accepts a callable `TimingFunction` or typed `Easing` only (a string name throws).

### `RAFPlayback` (`playback.ts`)
THE managed rAF driver — no other module owns a rAF handle. Three shapes:
`play(duration, onTick, { respectReducedMotion })` (duration/progress loop with
the light reduced-motion snap), `drive(tickable, onFrame?)` (settle-based dt
loop over a `Tickable` — `SmoothProgress`/`SpringProgress`), and `loop(cb)`
(self-rescheduling async frame loop — `Animation`, `AnimationGroup`, the WAAPI
shadow tick). Exported so consumers driving their own light playback get the
same gate.

## Boundary ergonomics — `resolveEasing` (`easing.ts`)

The light engines accept easing as a callable `TimingFunction` or a typed
`Easing` (`{ fn, css? }`) — synchronous, value.js-free. A string easing *name*
from value.js's registry is resolved ONCE, explicitly, through the async
factory `await resolveEasing(name)` — the one dynamic `import("./engine")`
edge. Fail-explicit: an unknown name rejects with `UnknownEasingError`; a
chunk-load failure rethrows with the easing named; a string passed directly to
a light engine throws `AnimationOptionError`. No pending state, no identity
fallback, no resolver class.

## Playback Modes

1. **rAF** (default) — `requestAnimationFrame` loop in main thread
2. **WAAPI** (opt-in via `useWAAPI`) — compositor-thread via `Element.animate()` when eligible
3. **Managed** — `AnimationGroup` controls tick/draw; the child doesn't own its loop
4. **Reduced-motion snap** — under `respectReducedMotion` + `prefers-reduced-motion`, snap to the final frame

## WAAPI Eligibility (`waapi.ts`)

Requires DOM targets, the default DOM-style renderer (a reference comparison
via `animation.usesDefaultRenderer()` — bind-proof, unlike the former Symbol
tag that `Function.prototype.bind` silently dropped, which had made every
`fromString` animation read as "custom transform" and the WAAPI path dead in
practice), a uniform timing function across frames, no CSS-twinned easing
across multiple segments (WAAPI restarts the curve per segment), no computed
units (`vh`/`calc`/`var`/`cqw`), and no color interpolation. Falls back to rAF
with a queryable `waapiIneligibleReason`. `toWAAPIOptions` emits
`Easing.css` when the uniform easing carries one (a spring's `linear()` from
`springTimingFunction`), otherwise bare `linear`.

## Key Types (`constants.ts`)

- `Vars<T>` — `{[key: string]: number | string | T}`
- `TimingFunction` — `(t: number) => number`
- `Easing` — `{ fn: TimingFunction, css?: string }` — the typed easing value; `css` is the faithful CSS twin (spring `linear()`, `cubic-bezier()` literal) that flows through the type system instead of a Symbol tag
- `AnimationFrame<V>` — compiled frame: `ixs`, `time`, `flatVars`, `interpVars`, `allInterpVars`, `timingFunction: Easing`
- `AnimationOptions` — `{duration, delay, iterationCount, direction, fillMode, timingFunction: Easing, useWAAPI, respectReducedMotion, colorSpace, hueMethod?}`
- `BlendMode` — `'replace' | 'add' | 'weighted'`

Defaults: 1000ms duration, 0 delay, 1 iteration, normal direction, forwards fill, easeInOutCubic, WAAPI on, reduced-motion off, oklab color space.

## Dependencies

- `@mkbabb/value.js` — `ValueUnit`, `Color`, the CSS parser, the easing registry, math/easing helpers. Reached by the HEAVY surface only (statically in `engine.ts`/`constants.ts`/`waapi.ts`; never by the light modules).
- `internal/leaves.ts` — value.js-free leaf copies of `clamp`/`scale`/`lerp` + rAF shims, so the light engines carry no static value.js edge.
