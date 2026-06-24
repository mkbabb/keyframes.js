# src/animation/

Core animation engine. Library entry point is `index.ts` → `dist/keyframes.js`.

## The value.js static/dynamic boundary

`index.ts` is the package barrel and the boundary between two surfaces:

- **LIGHT (static)** — the physics/interpolation engines: `SpringProgress`,
  `SmoothProgress`, `NumericAnimation`, `ElementMorph`, the `Timeline` family,
  `RAFPlayback`, the spring-stop helpers (`springLinearStops`,
  `springTimingFunction`), the orchestration tier (`stagger`, `flip`/`flipShared`,
  `drag`/`Draggable`, `decay`/`decayRest`, `Sequence`), and the easing factories
  (`resolveEasing`, `toEasing`). None carries a static import edge to `@mkbabb/value.js`: they
  read leaf helpers (rAF + clamp/lerp/scale) from `internal/leaves.ts` and
  accept easing as a callable `TimingFunction` or a typed `Easing`
  (`{ fn, css? }`); a string easing NAME is resolved once, up front, via
  `await resolveEasing(name)` — the one dynamic edge.
- **HEAVY (dynamic)** — the CSS-keyframe parsing engine in `engine.ts` plus the
  front doors that construct it: `Animation`, `CSSKeyframesAnimation`,
  `AnimationGroup`, `getAnimationId`, `getTimingFunction`, `resolveKeyframes`,
  `animate`, `MotionPath`/`fromMotionPath`, `DrawSVG`/`fromDrawSVG`, the
  `presets` namespace, and the option constants. These genuinely need value.js
  and are reached ONLY through `loadAnimationEngine()` — an `await
  import("./engine")` (merged with `./animate`, `./motion-path`, `./draw-svg`,
  `./animations` via `Promise.all`). The barrel holds no static edge to those
  modules, so a light-only consumer never pulls value.js (or the parser) in.

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
├── engine.ts        # HEAVY: defines Animation + CSSKeyframesAnimation + getAnimationId; re-exports AnimationGroup, getTimingFunction, resolveKeyframes
├── frame-compiler.ts # FrameCompiler — the template→compiled frame pipeline split out of Animation (no run-state; pure value-in → frames-out)
├── group.ts         # AnimationGroup — multi-animation compositor (layer blending, scheduler.yield, PRM snap)
├── waapi.ts         # WAAPI eligibility + delegation (emits a spring linear() when the easing carries one)
├── adapter.ts       # resolveKeyframes — input → ResolvedKeyframes
├── animate.ts       # animate() — single-call front door: shape dispatch + auto-target + auto-play (HEAVY: constructs CSSKeyframesAnimation)
├── motion-path.ts   # MotionPath / fromMotionPath — offset-distance sweep over an author offset-path; browser owns the geometry (HEAVY)
├── draw-svg.ts      # DrawSVG / fromDrawSVG — stroke-dashoffset line drawing over ONE getTotalLength() read (HEAVY)
├── numeric.ts       # NumericAnimation — keyframe interp over {key: number} objects
├── smooth.ts        # SmoothProgress — exponential smoothing for progress values
├── spring.ts        # SpringProgress — iOS-style spring physics tracker
├── springLinearStops.ts    # spring → CSS linear() stops string
├── springTimingFunction.ts # spring → typed Easing ({ fn, css: linear() } — one curve, two forms)
├── morph.ts         # ElementMorph — position/scale interp between DOM rects (composes NumericAnimation)
├── flip.ts          # flip / flipShared — FLIP (First-Last-Invert-Play) composition over ElementMorph (LIGHT)
├── drag.ts          # drag / Draggable — pointer-capture drag/fling input layer over SpringProgress (LIGHT)
├── decay.ts         # decay / decayRest — closed-form frictional glide x(t) = x0 + (v0/k)(1 − e^(−kt)) (LIGHT)
├── stagger.ts       # stagger — pure construction-time per-index delay generator (LIGHT)
├── sequence.ts      # Sequence — master-playhead temporal orchestrator (positions children along one clock; beside AnimationGroup, not over it)
├── timeline.ts      # Timeline (abstract), ScrollTimeline, ManualTimeline, createNativeTimeline
├── playback.ts      # RAFPlayback — THE managed rAF driver (play/drive/loop) every loop rides
├── easing.ts        # resolveEasing(name) async factory + toEasing normalizer (light)
├── animations.ts    # preset animations (fadeIn, bounce, shake, spinner, …) + the preset taxonomy groups (enter/exit/attention/loop)
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

**Managed-child lifecycle (the one contract, stated once).** A child the group
owns is marked `managed = true` (at attach, `group.ts`). The group OWNS its loop:
- The child throws on a direct `play()` (`engine.ts` — "the AnimationGroup owns
  the rAF loop. Call group.play() instead"); it never drives its own rAF.
- The group's `pause()` propagates to every child AND records the group's LAST
  rAF timestamp (not `performance.now()`) on each child's `pausedTime`, so
  `resume()` adjusts `startTime` without a forward jump.
- The group's `resume()` un-pauses children DIRECTLY (`entry.animation.paused =
  false`), explicitly NOT via `child.resume()` — `child.resume()` would start
  each child's own rAF loop and race the group's draw loop.
- `settle()` releases each child (`managed = false`).

The behaviour is correct as of D.W4 (honest `pause`/`resume`/`toggle`, the
jump-free `pausedTime`, the no-race resume); this note STATES the contract a
consumer must honor in one place. `group.ts`'s `pause`/`resume` carry a
cross-link comment to here.

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
(self-rescheduling frame loop over a maybe-async callback — `Animation`,
`AnimationGroup`, the WAAPI shadow tick). Since J.W6 S1 the steady
`Animation`/group `_frame` returns a plain boolean, so the loop-core sync
fast-path reschedules it inline — zero per-frame promise/microtask cost;
`advanceTo` returns a thenable only on the genuinely-async first-tick delay
sleep (ordering locked by `proof:event-ordering`). Exported so consumers
driving their own light playback get the same gate.

### The orchestration tier (`stagger.ts`, `flip.ts`, `drag.ts`, `decay.ts`, `sequence.ts`)
All LIGHT (zero static value.js edge), composed over the engines above:
- **`stagger(count, opts)`** (`stagger.ts`) — construction-time per-index delay
  distribution; returns a `(i, total) => ms` generator handed to the substrate
  that already carries delay (e.g. `AnimationGroup` per-child options).
- **`flip(el, mutate, opts)` / `flipShared`** (`flip.ts`) — FLIP
  (First-Last-Invert-Play) over `ElementMorph` + `RAFPlayback`; batched
  read-mutate-read, no interleaved layout thrash.
- **`drag` / `Draggable` / `drag2D`** (`drag.ts`) — pointer-capture drag/fling
  input layer over `SpringProgress`; release velocity re-seats the closed-form
  spring so the fling is continuous with the gesture. Framework-free; SSR-safe
  until `attach()`. **`drag2D`** (re-exported from `drag-2d.ts` through `drag.ts`
  → the barrel — the single LIGHT re-export chain) is the single-call 2-D drag
  sugar: two one-axis `Draggable`s composed behind a 2-D handle, returning a
  `Drag2DHandle` whose `value` is `{x,y}`; per-axis `bounds`/`snap`/`rubberBand`
  pass through and `dispose()` tears down both. KISS — the 1-D engine stays 1-D.
  It is a COMMITTED LIGHT public primitive (the DemoControlPoint substrate),
  certified by `proof:drag2d-light-certified` (Q.WA2) + named in
  `proof:published-surface`'s LIGHT set; `proof:boundary` proves it value.js-free
  and `proof:drag-gesture` S4 proves the live 2-D follow.
- **`decay` / `decayRest`** (`decay.ts`) — closed-form frictional glide
  `x(t) = x0 + (v0/k)(1 − e^(−kt))`; `decayRest` is the projected resting point.
  Pure math — no rAF, no DOM.
- **`Sequence`** (`sequence.ts`) — the master-playhead TEMPORAL orchestrator:
  positions many child animations along one clock (GSAP-Timeline-class
  sequencing). Sits BESIDE `AnimationGroup` (the SPATIAL per-frame blender),
  never replaces it; the name `Timeline` was already taken by the progress
  drivers (booked decision in the module header).

### The heavy front doors (`animate.ts`, `motion-path.ts`, `draw-svg.ts`)
HEAVY (each statically imports `./engine`, so they ride `loadAnimationEngine()`):
- **`animate(target, input, opts?)`** (`animate.ts`) — single-call dispatch on
  the SHAPE of `input` (CSS string / keyframe map / vars array / MotionPath
  spec) → the right `from*` factory + auto-target + auto-play; returns the
  constructed animation as the control handle.
- **`MotionPath` / `fromMotionPath`** (`motion-path.ts`) — sweeps
  `offset-distance` over an author `offset-path`; the browser owns the
  geometry, keyframes interpolates the scalar. WAAPI-eligible (the `%` is
  path-length-relative, exempt from the layout-`%` rejection).
- **`DrawSVG` / `fromDrawSVG`** (`draw-svg.ts`) — stroke line-drawing:
  `stroke-dashoffset: L → 0` over `stroke-dasharray: L` from ONE
  `getTotalLength()` read. WAAPI-eligible unchanged.

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
units (`vh`/`calc`/`var`/`cqw`), and no color interpolation. On WebKit a
`linear()`-twinned easing is additionally HELD on rAF (CE-1.0, J.W6 S9 —
WebKit refuses HW-accel for custom `linear()` easings, so a delegated spring
would run main-thread WAAPI, heavier than the rAF path it bypassed; engine
feature-detect via `webkitConvertPointFromNodeToPage`, not a UA sniff). Falls
back to rAF with a queryable `waapiIneligibleReason`. `toWAAPIOptions` emits
`Easing.css` when the uniform easing carries one (a spring's `linear()` from
`springTimingFunction`), otherwise bare `linear`.

## Computed-unit container contract (the one contract, stated once)

value.js resolves a computed/container unit (`vh` / `calc` / `var` / `cqw` /
`cqh` / `cqi` / `cqb` / `cqmin` / `cqmax`) against the DOM and CACHES the
resolved endpoint `(startN, stopN, unit)` on the iv, keyed by a monotonic
`layoutEpoch`. value.js auto-installs a `window.resize` listener that bumps the
epoch, so the cache busts on every VIEWPORT resize. It exports `bumpLayoutEpoch()`
for the one resize it structurally CANNOT observe: a **container resize that does
not coincide with a window resize** — a dock toggle, a sidebar collapse, a
split-pane drag, a flex re-layout that changes a `container-type` box width while
the viewport is unchanged.

**The contract.** A consumer animating a `cq*`/computed unit whose
resolution-container resizes independently of the viewport MUST call
`bumpLayoutEpoch()` (from `@mkbabb/value.js`) on that container's
`ResizeObserver` — e.g. `useResizeObserver(container, () => bumpLayoutEpoch())`.
Without it, the C1 endpoint cache serves the STALE pre-resize pixels until the
next window resize busts the epoch. The demo wires exactly this on
`AnimationVisualizer`'s `container-inline-size` box (its `calc(100cqw - 100%)`
ball). The eviction/epoch policy lives ONCE in value.js; the consumer feeds only
the signal value.js's auto-`window.resize` listener cannot see (DRY).

**RECORDED non-action (BOOK, not SHIP).** The library does NOT install a generic
per-target `ResizeObserver` on `setTargets` when an iv carries a `cq*`/computed
unit. A per-target observer + a layout-coupled side effect for a niche unit class
is a boundary breach pending a bench that a container-unit animation under
panel-resize is a real LIBRARY workload (not just the demo's). The consumer owns
its container topology; the library cannot know it. Carried, not manufactured.

## Key Types (`constants.ts`)

- `Vars<T>` — `{[key: string]: number | string | T}`
- `TimingFunction` — `(t: number) => number`
- `Easing` — `{ fn: TimingFunction, css?: string }` — the typed easing value; `css` is the faithful CSS twin (spring `linear()`, `cubic-bezier()` literal) that flows through the type system instead of a Symbol tag
- `AnimationFrame<V>` — compiled frame: `ixs`, `time`, `flatVars`, `interpVars`, `allInterpVars`, `timingFunction: Easing`
- `AnimationOptions` — `{duration, delay, iterationCount, direction, fillMode, timingFunction: Easing, useWAAPI, respectReducedMotion, colorSpace, hueMethod?}`
- `BlendMode` — `'replace' | 'add' | 'weighted'`

Defaults: 1000ms duration, 0 delay, 1 iteration, normal direction, forwards fill, easeInOutCubic, WAAPI on, reduced-motion off, oklab color space.

## Dependencies

- `@mkbabb/value.js` — `ValueUnit`, `Color`, the CSS parser, the easing registry, math/easing helpers. Reached by the HEAVY surface only (static runtime imports in `engine.ts`, `frame-compiler.ts`, `group.ts`, `adapter.ts`, `animations.ts`, `constants.ts`, `format.ts`, `utils.ts`, `waapi.ts`; the barrel's own `import type { Stylesheet }` is erased; never by the light modules — gated by `proof:boundary`).
- `internal/leaves.ts` — value.js-free leaf copies of `clamp`/`scale`/`lerp` + rAF shims, so the light engines carry no static value.js edge.
