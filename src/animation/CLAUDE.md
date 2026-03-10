# src/animation/

Core animation engine. Library entry point (`index.ts` → `dist/keyframes.js`).

## Files

```
animation/
├── index.ts         # Animation, CSSKeyframesAnimation — main classes + re-exports
├── group.ts         # AnimationGroup — multi-animation compositor with layer blending
├── numeric.ts       # NumericAnimation — keyframe interp over {key: number} objects
├── smooth.ts        # SmoothProgress — exponential smoothing for progress values
├── morph.ts         # ElementMorph — position/scale interp between DOM rects
├── timeline.ts      # Timeline (abstract), ScrollTimeline, ManualTimeline
├── animations.ts    # 30+ preset animations (fadeIn, bounce, shake, spinner, etc.)
├── constants.ts     # Types + defaults (AnimationOptions, Vars, AnimationFrame, etc.)
├── utils.ts         # Frame calculation, value interpolation, timing resolution
└── waapi.ts         # Web Animations API eligibility check + delegation
```

## Classes

### `Animation<V extends Vars>`
Core engine. Manages keyframes, timing, interpolation, playback.

- **Frame lifecycle**: `addFrame()` → `parse()` → `AnimationFrame[]` with precomputed `interpVars`
- **Playback**: `play()` / `pause()` / `resume()` / `stop()` / `reset()`
- **Config**: `setDuration()`, `setDelay()`, `setDirection()`, `setFillMode()`, `setTimingFunction()`, `setIterationCount()`, `setColorSpace()`, `setHueMethod()`, `setUseWAAPI()`, `setOptions()` (bulk), `setTargets()`
- **Interpolation**: `interpFrames(t, transformFrames?)` — samples all active frames at time `t`
- **Fill**: `fillForwards()` / `fillBackwards()` — applies first/last frame values
- **Playback queries**: `playing()`, `effectiveT` (getter, direction-adjusted time)
- **Mutation**: `reverse()` — flips `reversed` flag and adjusts `startTime`
- **Composition**: `group()` — convenience factory for `AnimationGroup`
- **Events**: dispatches `animationstart`, `animationiteration`, `animationend` on targets

### `CSSKeyframesAnimation<V>` extends `Animation<V>`
Adds CSS @keyframes parsing layer.

- `fromString(css)` — parse @keyframes string (underlying `parseCSSKeyframes` is memoized; results are cloned per call)
- `fromKeyframes(map)` — from `Map<string, Vars>` or plain object
- `fromVars(vars[])` — from array of variable snapshots
- `transform(vars)` — default: applies interpolated values to `element.style`

### `AnimationGroup<V>`
Composites multiple animations with layer blending.

- **Blend modes**: `replace` (z-order wins), `add` (accumulate), `weighted` (lerp by weight)
- **Layer config**: `zIndex`, `weight`, `blendMode`, `enabled`, `properties` (whitelist)
- **Layer API**: `setLayerConfig()`, `setLayerEnabled()`, `getLayerConfig()`
- **Playback**: `play()`, `pause()`, `stop()`, `reset()`, `forcePause()`, `forcePlay()`, `playing()`
- **Setup**: `setTargets()`, `setSuperKey()`
- Manages own rAF loop; marks child animations as `managed = true`
- Handles single-target vs multi-target rendering paths

### `NumericAnimation<T extends Record<string, number>>`
Keyframe interpolation over plain numeric objects. Zero-allocation — returns same object reference.

- `at(progress)` — sample at [0,1], returns `T`
- `updateKeyframe(index, values)` — modify keyframe, recomputes segments
- Supports 2+ keyframes, explicit positions, per-segment timing functions

### `SmoothProgress`
Exponential smoothing for progress values.

- `setTarget(value)` → `tick()` or `tickDt(dt)` → `current`
- `snap()` — instant convergence; `reset(value?)` — reset state
- `settled` — true when converged within `snapThreshold`
- Frame-rate independent via `tickDt(dt)` (dt in ms)

### `ElementMorph`
Interpolates position and scale between two DOM elements (or `MorphRect` objects).

- `measure(from, to)` — (re)compute deltas
- `at(progress)` → `{translateX, translateY, scaleX, scaleY}`
- `toCSSTransform(progress)` → CSS transform string
- `apply(element, progress)` — writes `transform` + `transformOrigin`

### `Timeline` (abstract), `ScrollTimeline`, `ManualTimeline`
Progress drivers. Compose easing and smoothing; caller owns the rAF loop.

- Pipeline: `sample() → clamp [0,1] → easing → boundary snap → smoothing → progress`
- `tick()` / `tickDt(dt)` — advance one frame
- `progress`, `settled`, `snap()`, `reset(value?)`
- **`ScrollTimeline`**: scroll position → progress. `threshold` (viewport fraction), injectable `getScrollY`/`getViewportHeight` for testing.
- **`ManualTimeline`**: `set(value)` → progress. Smoothing off by default.
- Boundary snapping: raw ≤ 0 or ≥ 1 → `smoother.snap()` for instant convergence.

## Playback Modes

1. **rAF** (default) — `requestAnimationFrame` loop in main thread
2. **WAAPI** (opt-in) — compositor-thread via `Element.animate()` when eligible
3. **Managed** — AnimationGroup controls tick/draw; animation doesn't own its loop

## WAAPI Eligibility (`waapi.ts`)

Requires all of:
- DOM targets present
- Default `transformTargetsStyle` (no custom transform fn)
- Uniform timing function across all frames
- No computed units (`vh`, `vw`, `calc`, `var`)
- No color interpolation (any color unit, not just LAB/OKLAB)

Falls back to rAF silently on ineligibility or error.

## Presets (`animations.ts`)

All return `CSSKeyframesAnimation` instances. Accept optional `InputAnimationOptions`.

Fade: `fadeIn`, `fadeOut` | Attention: `pulse`, `heartbeat`, `glow`, `shake`, `bounce` | Entrance/Exit: `flip`, `rotateIn`, `slideIn`, `slideInLeft/Right`, `slideOutLeft/Right`, `blurIn/Out/InOut`, `jumpUp/Down`, `warpLeft/Right` | Effects: `hover`, `typewriter`, `typingCursor`, `rainbowText`, `progressBar`, `skeletonLoading`, `spinner`, `parallaxScroll`, `gradientBackground`, `rotateScale`, `accordionExpand`, `notificationBounce`, `textFocusBlur`

## Key Types (`constants.ts`)

- `Vars<T>` — `{[key: string]: number | string | T}`
- `TimingFunction` — `(t: number) => number`
- `TransformFunction<V>` — `(v: V, t: number) => void`
- `TemplateAnimationFrame<V>` — user-defined: `{id, start, vars, transform?, timingFunction?}`
- `AnimationFrame<V>` — compiled: adds `ixs`, `time`, `flatVars`, `interpVars`
- `AnimationOptions` — `{duration, delay, iterationCount, direction, fillMode, timingFunction, useWAAPI, colorSpace, hueMethod?}`
- `BlendMode` — `'replace' | 'add' | 'weighted'`

Defaults: 1000ms duration, 0 delay, 1 iteration, normal direction, forwards fill, easeInOutCubic, WAAPI on, oklab color space.

## Dependencies

- `../parsing/` — `parseCSSKeyframes`, `parseCSSPercent`, `parseCSSTime`, `parseCSSValueUnit`
- `../units/` — `ValueUnit`, `FunctionValue`, `ValueArray`, `COMPUTED_UNITS`, `getComputedValue`, `normalizeValueUnits`
- `../easing` — `easeInOutCubic`, `timingFunctions`, `CSSCubicBezier`, `steppedEase`
- `../math` — `clamp`, `scale`, `lerp`
- `../utils` — `memoizeDecorator`, `requestAnimationFrame`, `cancelAnimationFrame`, `seekPreviousValue`, `sleep`, `isObject`
