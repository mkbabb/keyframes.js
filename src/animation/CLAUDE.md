# src/animation/

The entire library. Entry point is `index.ts` → `dist/keyframes.js`; the heavy
static mirror is `public.ts` → `dist/engine/index.js` (the `./engine` subpath).
Partitioned into eleven cohesive **zone directories** (R.W1), each with its own
`index.ts` barrel — the LIGHT (value.js-free) zones `physics/` + `orchestration/`
and the HEAVY (value.js-bearing) zones `engine/` · `group/` · `compile/` ·
`resolve/` · `ingest/` · `scroll/` · `waapi/` + `presets/` + `svg/`. `internal/` is
the value.js-free **leaf tier**, not a zone (C-5: its barrel was deleted — 0
consumers — and it is excluded from `ZONE_DIRS` by documented design).

## The two package "in"s (the honest API, stated once)

The owner's question — *"what's our IN to the library?"* — has TWO honest
answers, one per package entry point (R's DEVELOPED lesson; `package.json`
`exports`):

1. **The `.` barrel — @mkbabb/keyframes.js (`index.ts` → `dist/keyframes.js`)** —
   the LIGHT static surface (the physics/orchestration primitives, value.js-free)
   PLUS the dynamic accessor `loadAnimationEngine()`. A consumer importing only
   the LIGHT names never pulls value.js into its graph; the heavy engine is
   reached at runtime through `await loadAnimationEngine()`.
2. **The `./engine` subpath — @mkbabb/keyframes.js/engine (`public.ts` →
   `dist/engine/index.js`)** — the WHOLE heavy engine surface as a STATIC,
   synchronous import, for a consumer who wants `new CSSKeyframesAnimation(...)`
   without the dynamic dance. `public.ts` is the composition barrel that mirrors
   `loadAnimationEngine()`'s `AnimationEngine` interface key-for-key (gated by
   `proof:engine-subpath-mirror` — runtime keys ⊆ the d.ts TYPE keys).

The README Quick Start uses form (2); it is the resolved honest "in" — a
value-level class you can actually `import` (the R.W4 fix; the single-call
declarative front door it competed with was EXCISED at S.C1 — no front door
survives).

## The value.js static/dynamic boundary

`index.ts` is the package barrel and the boundary between two surfaces:

- **LIGHT (static)** — the physics/interpolation engines and the orchestration
  tier: `SpringProgress`, `SmoothProgress`, `NumericAnimation`, `ElementMorph`,
  `Oscillator`, the `Timeline` family, `RAFPlayback`, the spring-stop helpers
  (`springLinearStops`, `springTimingFunction`), `stagger`, `flip`/`flipShared`,
  `drag`/`Draggable`/`drag2D`, `decay`/`decayRest`, `Sequence`, `splitText`,
  `viewTransition`, and the easing factories (`resolveEasing`, `toEasing`). None
  carries a static import edge to `@mkbabb/value.js`: they read leaf helpers
  (rAF + `clamp`/`lerp`/`scale`) from `internal/leaves.ts` (which re-exports
  value.js's OWN math from the `parse-that`-free `@mkbabb/value.js/math` subpath —
  no byte-copy), and accept easing as a callable `TimingFunction` or a typed
  `Easing` (`{ fn, css? }`); a string easing NAME is resolved once, up front, via
  `await resolveEasing(name)` — the one dynamic edge.
- **HEAVY (dynamic)** — the CSS-keyframe parsing engine (the `engine/` zone) plus
  the cross-zone surface `loadAnimationEngine()` composes: `KeyframesAnimation`,
  `CSSKeyframesAnimation`, `AnimationGroup`, `getAnimationId`, `getTimingFunction`,
  `resolveKeyframes`, `MotionPath`/`fromMotionPath`, `DrawSVG`/`fromDrawSVG`,
  `MorphSVG`/`fromMorphSVG`, the `presets` namespace, the ingest + scroll +
  compile round-trip (`compileToCSS`, `compileToViewTransition`, `compileToEntry`),
  the `validate`/`explain` verbs, and the option constants. These genuinely need
  value.js and are reached ONLY through `loadAnimationEngine()` (`load-engine.ts` —
  a `Promise.all` over `import("./engine/index")` merged with the `./group`,
  `./svg/*`, `./ingest`, `./scroll`, `./compile*`, `./validate`, `./presets`
  chunks). The barrel holds no static edge to those modules, so a light-only
  consumer never pulls value.js (or the parser) in.

Types stay whole on the static barrel (`import type` is erased under
`verbatimModuleSyntax`). The boundary is gated in CI by `proof:boundary`
(`scripts/proof-boundary.mjs`): it bundles EVERY light barrel export as its own
entry (the entry set is parsed from the barrel, self-enforcing), asserts zero
static value.js / `engine/` edges per entry, asserts the heavy engine emits as a
dynamic chunk behind `loadAnimationEngine`, and greps light source for dormant
static specifiers. The published `.` surface is gated by
`proof:published-surface`; the `./engine` subpath mirror by
`proof:engine-subpath-mirror`.

## Zone map

```
animation/
├── index.ts               # package barrel — LIGHT static exports + loadAnimationEngine() (the boundary)
├── load-engine.ts         # HEAVY dynamic loader — loadAnimationEngine() + warmEngine() (the AnimationEngine interface)
├── public.ts              # HEAVY static mirror — the ./engine subpath's composition barrel (public + build-entry sink)
├── easing.ts              # resolveEasing(name) async factory + toEasing normalizer (LIGHT boundary ergonomics)
├── validate.ts            # validate()/explain() — the agent-authoring projection over the compile surface (HEAVY)
├── constants/             # LIGHT-pure types + the value.js-bearing defaults (S.B1 three-way split)
│   ├── types.ts           # LIGHT-pure: Easing, AnimationOptions, Vars, AnimationFrame, … (zero non-import-type edges)
│   ├── defaults.ts        # the two value.js-bearing consts (defaultOptions / defaultLayerConfig)
│   └── index.ts           # back-compat barrel (heavy importers keep this; the 10 LIGHT importers target ./types)
├── physics/               # LIGHT: clock-driven value steppers + the rAF driver
│   ├── numeric.ts / smooth.ts / oscillator.ts / decay.ts / morph.ts / playback.ts
│   ├── index.ts
│   └── spring/            # the SpringProgress family (the ring-break sub-zone)
│       ├── progress.ts / duration.ts / reseat.ts / sample.ts / solver.ts / vector.ts
│       ├── linear-stops.ts / timing-function.ts / managed-play.ts / types.ts
│       └── index.ts
├── orchestration/         # LIGHT: temporal/multi-target helpers over the physics steppers
│   ├── stagger.ts / flip.ts
│   ├── index.ts
│   ├── drag/              # pointer-capture drag/fling over SpringProgress
│   │   ├── draggable.ts / drag-2d.ts / index.ts
│   ├── sequence/          # the master-playhead temporal orchestrator
│   │   ├── sequence.ts / events.ts / lifecycle.ts / transport.ts / index.ts
│   ├── split-text/        # a11y-first text splitter (S.F2)
│   │   ├── split-text.ts / segment.ts / refuse.ts / index.ts
│   ├── timeline/          # the progress-driver family + native bridge
│   │   ├── timeline.ts / native.ts / index.ts
│   └── view-transition/   # the LIGHT View-Transitions dispatch (S.F1 VT-a)
│       ├── view-transition.ts / index.ts
├── engine/                # HEAVY core: KeyframesAnimation over a composed FrameCompiler
│   ├── animation.ts       # the base KeyframesAnimation class (value.js-/scroll-agnostic)
│   ├── playback-state.ts  # the PlaybackState run-state STORE (single-STORAGE, S.B2 C-15)
│   ├── play-lifecycle.ts  # the standalone-play transport FREE FUNCTIONS
│   ├── interpolate.ts     # the per-frame lerp+apply HOT PATH (interpFrames/processFrame)
│   ├── option-setters.ts / options.ts  # the option-APPLY surface + the pure normalizers
│   ├── compile-bridge.ts / composition.ts  # the FrameCompiler bridge + animation-composition honoring
│   ├── index.ts           # the HEAVY engine-core barrel
│   └── css/               # the CSS-parsing sub-zone (S.B2 C-1)
│       ├── css-animation.ts  # CSSKeyframesAnimation — fromString/fromKeyframes/fromVars
│       ├── metadata.ts       # @property + scroll-timeline metadata recovery off the same parse
│       └── index.ts
├── group/                 # HEAVY compositor: AnimationGroup (replace/add/weighted blending)
│   ├── group.ts           # the class (thin this-delegates over the free-function lifecycle)
│   ├── lifecycle.ts       # the TRANSPORT verbs as free functions (S.B5 a19 F1)
│   ├── soa.ts / compositor.ts / springs.ts / yield-batch.ts  # the zero-alloc SoA blend fold + INP-relief batching
│   ├── entries.ts / layer-api.ts / types.ts
│   └── index.ts
├── compile/               # HEAVY pipeline — FORWARD (root) + BACKWARD (backward/, S.B3 C-2)
│   ├── parse-flatten.ts   # CSS leaves → ValueUnits (the forward entry)
│   ├── frame-compiler.ts  # FrameCompiler — template → AnimationFrame[] with interpVars
│   ├── easing-registry.ts # the synchronous getTimingFunction resolver
│   ├── easing-option.ts / selector.ts / numeric-plan.ts  # heavy easing-input resolver + selector grammar + numeric SoA plan
│   ├── adapter.ts         # resolveKeyframes — input → ResolvedKeyframes, the FrameCompiler.parse feeder (C-9)
│   ├── entry.ts           # compileToEntry — @starting-style/allow-discrete emitter (S.F3 EN-c)
│   ├── view-transition.ts # compileToViewTransition — ::view-transition-* emitter (S.F1 VT-c)
│   ├── index.ts
│   └── backward/          # the round-trip's BACKWARD leg (C-2: FORWARD-vs-BACKWARD is the real seam)
│       ├── backward.ts       # compileToCSS — orchestration graph → zero-runtime CSS
│       ├── backward-walk.ts  # the input-graph walkers
│       ├── backward-color.ts # the oklab densify (per-percentage color stops)
│       ├── format.ts         # the @keyframes serializer (declaredKeyframeBodyFor / bodyByStop)
│       ├── easing-serialize.ts / densify.ts  # serializeEasing CSS-twin (EN-a) + the linear() densify
│       └── index.ts
├── resolve/               # HEAVY emerging-CSS lowering pass (if()/@function/env/spring()) — one recursive rewriter
│   ├── core.ts            # the recursion (resolveValues/hasResolvableValue) + the resolveNode seam
│   ├── spring-css.ts / resolve-if.ts / resolve-function.ts / element-resolve.ts / env.ts
│   └── index.ts           # thin re-export barrel (S.B4)
├── ingest/                # HEAVY: the CSSOM walk + live-animation temporal takeover
│   ├── cssom.ts           # walk document.styleSheets / getAnimations() → kf CSSKeyframesAnimation
│   ├── adopt.ts           # mid-flight takeover of a RUNNING CSS animation
│   └── index.ts
├── scroll/                # HEAVY: the scroll grammar round-trip + the JS ScrollScene driver
│   ├── grammar.ts         # the value.js scroll-grammar parse/serialize
│   ├── scene.ts           # the ScrollScene continuous scrub/snap driver (kf owns TIME)
│   ├── range.ts           # the animation-range → [0,1] mapping
│   ├── trigger.ts         # the discrete animation-trigger idle→active→done lifecycle (S.F4)
│   └── index.ts
├── waapi/                 # HEAVY: WAAPI eligibility + emission + options + delegation
│   ├── eligibility.ts     # isWAAPIEligible + the layout-unit guard
│   ├── emission.ts        # toWAAPIKeyframes (rides the curvature-adaptive densify)
│   ├── waapi-options.ts   # toWAAPIOptions (the direction/fill/composite/easing map)
│   ├── delegation.ts      # playWAAPI + the native-scroll-timeline bridge
│   ├── densify.ts         # the multi-segment CSS-twin densify (→ single bare linear)
│   └── index.ts
├── presets/               # HEAVY preset catalog — rides loadAnimationEngine() as the `presets` namespace
│   ├── classic.ts         # the classic cubic-bezier/stepped preset factories
│   ├── classic-data.ts    # the 34 CSS-string constants (S.B5 data-volume split)
│   ├── spring.ts / taxonomy.ts  # spring-eased factories + the enter/exit/attention/loop discovery index
│   └── index.ts
├── svg/                   # HEAVY SVG factories over CSSKeyframesAnimation
│   ├── motion-path.ts     # MotionPath / fromMotionPath — offset-distance over an author offset-path
│   ├── draw-svg.ts        # DrawSVG / fromDrawSVG — stroke-dashoffset line drawing
│   ├── morph-svg.ts       # MorphSVG / fromMorphSVG — path-shape morph over value.js's PathGeometry
│   ├── handle.ts          # the abstract animation-handle base (closes the .finished asymmetry, S.B4)
│   └── index.ts
└── internal/              # value.js-free LEAF tier (NOT a zone — no barrel, C-5)
    ├── leaves.ts          # rAF shims + the re-exported value.js math leaves (no GRAMMAR edge)
    ├── binarySearch.ts    # binarySearchRange for segment lookup
    ├── animation-id.ts    # getAnimationId — the value.js-free id leaf (kills the group→engine edge, R.W2c)
    ├── errors.ts          # AnimationOptionError / UnknownEasingError + parseOption (fail-explicit seam)
    ├── reduced-motion.ts  # the ONE prefers-reduced-motion detector + the ONE withReducedMotion gate + reducedMotionScale
    ├── scheduler.ts       # yieldToMain() — the scheduler.yield probe + cached fallback
    └── scroll-phases.ts   # the shared scroll-phase constants
```

## Classes + primitives

### `KeyframesAnimation<V extends Vars>` (`engine/animation.ts`)
The base engine over a composed `FrameCompiler`. Manages keyframes, timing,
interpolation, playback. The god-object it was is carved into cohesive siblings:
the play machine into `play-lifecycle.ts` + the `PlaybackState` store in
`playback-state.ts`, the interp hot-path into `interpolate.ts`, the option-apply
into `option-setters.ts`/`options.ts`, the compile bridge into
`compile-bridge.ts`, the element-aware resolver into `resolve/element-resolve.ts`.

- **Frame lifecycle**: `addFrame()` → `parse()` → `AnimationFrame[]` with precomputed `interpVars` (delegated to the composed `FrameCompiler`)
- **Playback**: `play()` / `pause()` / `resume()` / `stop()` (halt, settle, never paints) / `reset()` (explicit rewind: paint initial + settle) / `settle()` (pure teardown)
- **Rest-position contract**: `restPosition` derives once from `fillMode` (forwards/both → final; none/backwards → initial); completion paints the rest frame via `paintRest()` then settles. Reduced-motion = "rest = final, paint, settle" — the same terminal path as a forwards completion.
- **Config** (fail-explicit — malformed present input throws a typed `AnimationOptionError`, genuine omission defaults): `setDuration()`, `setDelay()`, `setDirection()`, `setFillMode()`, `setTimingFunction()`, `setIterationCount()`, `setColorSpace()`, `setHueMethod()`, `setUseWAAPI()`, `setRespectReducedMotion()`, `setOptions()` (bulk), `setTargets()`
- **Interpolation**: `interpFrames(t, apply?, buffer?)` — samples all active frames at time `t` (hot path reads `frame.timingFunction.fn`)
- **Reduced motion**: with `respectReducedMotion: true`, `play()` snaps to the final frame in a single paint (`animationstart` → `animationend`) instead of running the rAF/WAAPI loop — routed through the ONE `withReducedMotion` gate
- **Events**: dispatches `animationstart`, `animationiteration`, `animationend` on targets (SSR-safe capability skip)
- **Loops**: `readonly playback: RAFPlayback` owns the rAF handle for the standalone play loop AND the WAAPI shadow tick
- **Run-state**: the standalone-play FSM lives in `PlaybackState` (`engine/playback-state.ts`) as the SOLE backing store, exposed through accessor delegates (S.B2 C-15 single-STORAGE); no FSM transition field is declared on the class body

### `CSSKeyframesAnimation<V>` extends `KeyframesAnimation<V>` (`engine/css/css-animation.ts`)
Adds the CSS `@keyframes` parsing layer: `fromString(css)`, `fromKeyframes(map)`,
`fromVars(vars[])`, `bindTimeline()`. Its `metadata.ts` sibling recovers the
`@property` typed-custom registry + the scroll-driven timeline grammar off the
SAME value.js parse. The PRIMARY "in" (README Quick Start).

### `AnimationGroup<V>` (`group/group.ts`)
Composites multiple animations with layer blending (`replace` / `add` /
`weighted`). Constructed via `AnimationGroup.of(first, ...rest)` (S.B4 — genuine
ownership; the `getGroupFactory` service locator + `KeyframesAnimation.group()`
were excised, so the `group → engine` edge is one-directional by construction).

- Draw loop rides its `readonly playback: RAFPlayback`; marks children `managed = true`
- `tick()` ticks children in batches, yielding to the main thread between batches for groups larger than `AnimationGroup.YIELD_BATCH` (INP relief; `group/yield-batch.ts`)
- `respectReducedMotion = true` → `play()` composites every child's final frame once, no draw loop; `play()` is re-entrant (`_playingPromise` guard)
- Rest-position contract: completion `settle()`s (pure, leaves the rest frame painted by each child's fill); `reset()` is the explicit rewind (paint initial + settle); `stop()` = halt + rewind (transport semantics)
- The transport verbs are FREE FUNCTIONS in the colocated `group/lifecycle.ts`; the methods are thin `this`-delegates over them (S.B5)

**Managed-child lifecycle (the one contract, stated once).** A child the group
owns is marked `managed = true` (at attach). The group OWNS its loop:
- The child throws on a direct `play()` ("the AnimationGroup owns the rAF loop. Call group.play() instead"); it never drives its own rAF.
- The group's `pause()` propagates to every child AND records the group's LAST rAF timestamp (not `performance.now()`) on each child's `pausedTime`, so `resume()` adjusts `startTime` without a forward jump.
- The group's `resume()` un-pauses children DIRECTLY (`entry.animation.paused = false`), explicitly NOT via `child.resume()` — `child.resume()` would start each child's own rAF loop and race the group's draw loop.
- `settle()` releases each child (`managed = false`).

The behaviour is correct as of D.W4 (honest `pause`/`resume`/`toggle`, the
jump-free `pausedTime`, the no-race resume); this note STATES the contract a
consumer must honor in one place. `group/lifecycle.ts`'s `pause`/`resume` carry a
cross-link comment to here.

### `NumericAnimation<T extends Record<string, number>>` (`physics/numeric.ts`)
Zero-allocation keyframe interpolation over plain numeric objects. `at(progress)`,
`updateKeyframe()`, managed `play()`. Accepts a callable `TimingFunction` or typed
`Easing` only (a string name throws — resolve via `await resolveEasing(name)`
first); `play()` routes its reduced-motion snap through `RAFPlayback`.

### `SmoothProgress` (`physics/smooth.ts`), `SpringProgress` (`physics/spring/progress.ts`)
Progress trackers — pure steppers implementing `Tickable` (`tickDt(dt)` +
`settled`). `setTarget` → `tick()`/`tickDt(dt)` → `current`; the managed `.play()`
loop delegates to `RAFPlayback.drive`. Snaps route through the ONE
`withReducedMotion` gate. `SpringProgress`'s velocity-continuous interruption seam
(`reseat.ts`), spring-from-duration construction (`duration.ts`), and CSS-emission
helpers (`linear-stops.ts` → `springLinearStops`, `timing-function.ts` →
`springTimingFunction`) round out the `physics/spring/` sub-zone.

### `Oscillator` (`physics/oscillator.ts`)
A LIGHT periodic phase clock — a frequency-driven phase ramp + a pure waveform
shaper (`waveformValue`), no CSS parsing. The caller drives the loop (mirrors
`SmoothProgress`/`SpringProgress` — no rAF ownership).

### `ElementMorph` (`physics/morph.ts`)
Interpolates position/scale between two DOM rects. Composes `NumericAnimation`, so
it inherits the callable/`Easing`-only easing contract + the `RAFPlayback`
reduced-motion behavior.

### `Timeline` (abstract), `KeyframesScrollTimeline`, `ManualTimeline` (`orchestration/timeline/`)
Progress drivers; the caller owns the rAF loop. Pipeline: `sample() → clamp →
easing → boundary snap → smoothing → progress`. Accepts a callable
`TimingFunction` or typed `Easing` only (a string name throws).
`KeyframesScrollTimeline` takes injectable `getScrollY`/`getViewportHeight`
callbacks for testing without DOM; `ManualTimeline` has smoothing off by default
(set raw value, get immediate result); `createNativeTimeline` bridges the platform
`ScrollTimeline`/`ViewTimeline` (`native.ts`). The legacy `ScrollTimeline` /
`ScrollTimelineOptions` @deprecated aliases were DROPPED in 5.0.0 (Q.WE1 —
NO-LEGACY); the names are now `KeyframesScrollTimeline` /
`KeyframesScrollTimelineOptions`.

### `RAFPlayback` (`physics/playback.ts`)
THE managed rAF driver — no other module owns a rAF handle. Three shapes:
`play(duration, onTick, { respectReducedMotion })` (duration/progress loop with
the light reduced-motion snap), `drive(tickable, onFrame?)` (settle-based dt loop
over a `Tickable` — `SmoothProgress`/`SpringProgress`), and `loop(cb)`
(self-rescheduling frame loop over a maybe-async callback —
`KeyframesAnimation`, `AnimationGroup`, the WAAPI shadow tick). The steady
`_frame` returns a plain boolean, so the loop-core sync fast-path reschedules it
inline — zero per-frame promise/microtask cost; `advanceTo` returns a thenable
only on the genuinely-async first-tick delay sleep (ordering locked by
`proof:event-ordering`). Exported so consumers driving their own light playback
get the same gate.

### The orchestration tier (`orchestration/`)
All LIGHT (zero static value.js edge), composed over the engines above:
- **`stagger(count, opts)`** (`stagger.ts`) — construction-time per-index delay distribution; returns a `(i, total) => ms` generator handed to a delay-carrying substrate (e.g. `AnimationGroup` per-child options).
- **`flip(el, mutate, opts)` / `flipShared`** (`flip.ts`) — FLIP (First-Last-Invert-Play) over `ElementMorph` + `RAFPlayback`; batched read-mutate-read, no interleaved layout thrash.
- **`drag` / `Draggable` / `drag2D`** (`orchestration/drag/`) — pointer-capture drag/fling input layer over `SpringProgress`; release velocity re-seats the closed-form spring so the fling is continuous with the gesture. `drag2D` is the single-call 2-D sugar: two one-axis `Draggable`s behind a 2-D handle, returning a `Drag2DHandle` whose `value` is `{x,y}`; per-axis `bounds`/`snap`/`rubberBand` pass through and `dispose()` tears down both. A COMMITTED LIGHT public primitive, certified by `proof:drag2d-light-certified` + named in `proof:published-surface`'s LIGHT set.
- **`decay` / `decayRest`** (`physics/decay.ts`) — closed-form frictional glide `x(t) = x0 + (v0/k)(1 − e^(−kt))`; `decayRest` is the projected resting point. Pure math — no rAF, no DOM.
- **`Sequence`** (`orchestration/sequence/`) — the master-playhead TEMPORAL orchestrator: positions many child animations along one clock (GSAP-Timeline-class sequencing). Sits BESIDE `AnimationGroup` (the SPATIAL per-frame blender), never replaces it; the name `Timeline` was already taken by the progress drivers.
- **`splitText`** (`orchestration/split-text/`) — a11y-first text splitter: shreds a text element into an animatable fragment cohort + a ready stagger, consolidating the accessible name onto the container (`aria-label` + `aria-hidden` fragments). `by: "line"` is measure-or-refuse (`SplitTextRefusalError`).
- **`viewTransition`** (`orchestration/view-transition/`) — the LIGHT View-Transitions dispatch: mutates the DOM behind a native View Transition where the platform ships one, falling back to a `flipShared` shared-element morph (or a bare immediate mutation) everywhere else, behind ONE normalized `ViewTransitionHandle` whose `backend` is queryable. The HEAVY companion `compileToViewTransition` (the zero-runtime CSS emitter) rides `loadAnimationEngine()`.

### The SVG factories (`svg/`)
HEAVY (each statically imports `CSSKeyframesAnimation`, so they ride
`loadAnimationEngine()`), sharing the abstract `svg/handle.ts` base (the SAME
`.play()`/`.pause()`/`.stop()`/`.finished` delegation, closing the `.finished`
asymmetry by construction — S.B4):
- **`MotionPath` / `fromMotionPath`** (`motion-path.ts`) — sweeps `offset-distance` over an author `offset-path`; the browser owns the geometry. WAAPI-eligible (the `%` is path-length-relative, exempt from the layout-`%` rejection).
- **`DrawSVG` / `fromDrawSVG`** (`draw-svg.ts`) — stroke line-drawing: `stroke-dashoffset: L → 0` over `stroke-dasharray: L` from ONE `getTotalLength()` read.
- **`MorphSVG` / `fromMorphSVG`** (`morph-svg.ts`) — path-shape morph over value.js's `PathGeometry` (the ONE geometry edge it legitimately needs).

### The round-trip compile surface (`compile/` + `validate.ts`)
The parser run BACKWARD over the SAME value.js data model, plus the forward
validation projection:
- **`compileToCSS`** (`compile/backward/backward.ts`) — an orchestration graph (`AnimationGroup` / `Sequence` / child list) → zero-runtime CSS.
- **`compileToViewTransition`** (`compile/view-transition.ts`) — a name-keyed role spec → `::view-transition-*` CSS (S.F1 VT-c).
- **`compileToEntry`** (`compile/entry.ts`) — a selector-keyed entry/exit spec → `@starting-style` + `transition-behavior: allow-discrete` CSS (S.F3 EN-c), a declared-endpoint projection over `format.ts`'s `declaredKeyframeBodyFor`.
- **`validate` / `explain`** (`validate.ts`) — a READ-ONLY projection over the adapter diagnostics / compile refusals / WAAPI eligibility channels onto ONE agent-shaped envelope (the round-trip's FORWARD half; stays at the `src/animation` root as a HEAVY cross-zone facade verb — C-9).

## Boundary ergonomics — `resolveEasing` (`easing.ts`)

The light engines accept easing as a callable `TimingFunction` or a typed
`Easing` (`{ fn, css? }`) — synchronous, value.js-free. A string easing *name*
from value.js's registry is resolved ONCE, explicitly, through the async factory
`await resolveEasing(name)` — the one dynamic `import` edge. Fail-explicit: an
unknown name rejects with `UnknownEasingError`; a chunk-load failure rethrows with
the easing named; a string passed directly to a light engine throws
`AnimationOptionError`. No pending state, no identity fallback, no resolver class.

## Playback modes

1. **rAF** (default) — `requestAnimationFrame` loop in main thread (rides `RAFPlayback`)
2. **WAAPI** (opt-in via `useWAAPI`) — compositor-thread via `Element.animate()` when eligible
3. **Managed** — `AnimationGroup` controls tick/draw; the child doesn't own its loop
4. **Reduced-motion snap** — under `respectReducedMotion` + `prefers-reduced-motion`, snap to the final frame

## WAAPI eligibility (`waapi/eligibility.ts`)

Requires DOM targets, the default DOM-style renderer (a reference comparison via
`animation.usesDefaultRenderer()` — bind-proof), a uniform timing function across
frames, no computed units (`vh`/`calc`/`var`/`cqw`, resolved against the DOM), and
no color interpolation. A multi-segment CSS-twin easing IS eligible (S.F5c): the
emit DENSIFIES the composite per-segment curve into keyframes fed a SINGLE bare
`linear` effect easing (the "densify → single `linear()`" collapse, `waapi/densify.ts`)
so the piecewise-linear fill tracks the true rAF curve with no per-segment restart.
On WebKit a `linear()`-twinned easing is additionally HELD on rAF (WebKit refuses
HW-accel for custom `linear()` easings; engine feature-detect via
`webkitConvertPointFromNodeToPage`, not a UA sniff). Falls back to rAF with a
queryable `waapiIneligibleReason`. `toWAAPIOptions` (`waapi/waapi-options.ts`)
emits `Easing.css` for a SINGLE-segment uniform easing that carries a twin (a
spring's `linear()` from `springTimingFunction`), and bare `linear` for a
multi-segment animation (the densified keyframes already carry the baked curve) or
when the easing has no twin.

## Computed-unit container contract (the one contract, stated once)

value.js resolves a computed/container unit (`vh` / `calc` / `var` / `cqw` /
`cqh` / `cqi` / `cqb` / `cqmin` / `cqmax`) against the DOM and CACHES the resolved
endpoint `(startN, stopN, unit)` on the iv, keyed by a monotonic `layoutEpoch`.
value.js auto-installs a `window.resize` listener that bumps the epoch, so the
cache busts on every VIEWPORT resize. It exports `bumpLayoutEpoch()` for the one
resize it structurally CANNOT observe: a **container resize that does not coincide
with a window resize** — a dock toggle, a sidebar collapse, a split-pane drag, a
flex re-layout that changes a `container-type` box width while the viewport is
unchanged.

**The contract.** A consumer animating a `cq*`/computed unit whose
resolution-container resizes independently of the viewport MUST call
`bumpLayoutEpoch()` (from `@mkbabb/value.js`) on that container's
`ResizeObserver` — e.g. `useResizeObserver(container, () => bumpLayoutEpoch())`.
Without it, the endpoint cache serves the STALE pre-resize pixels until the next
window resize busts the epoch. The eviction/epoch policy lives ONCE in value.js;
the consumer feeds only the signal value.js's auto-`window.resize` listener cannot
see (DRY).

**RECORDED non-action (BOOK, not SHIP).** The library does NOT install a generic
per-target `ResizeObserver` on `setTargets` when an iv carries a `cq*`/computed
unit. A per-target observer + a layout-coupled side effect for a niche unit class
is a boundary breach pending a bench that a container-unit animation under
panel-resize is a real LIBRARY workload (not just the demo's). Carried, not
manufactured.

## Key types (`constants/types.ts`)

- `Vars<T>` — `{[key: string]: number | string | T}`
- `TimingFunction` — `(t: number) => number`
- `Easing` — `{ fn: TimingFunction, css?: string }` — the typed easing value; `css` is the faithful CSS twin (spring `linear()`, `cubic-bezier()` literal) that flows through the type system instead of a Symbol tag
- `AnimationFrame<V>` — compiled frame: `ixs`, `time`, `flatVars`, `interpVars`, `allInterpVars`, `timingFunction: Easing`
- `AnimationOptions` — `{duration, delay, iterationCount, direction, fillMode, timingFunction: Easing, useWAAPI, respectReducedMotion, colorSpace, hueMethod?}`
- `BlendMode` — `'replace' | 'add' | 'weighted'`

`constants/types.ts` is LIGHT-pure (zero non-`import type` edges); the two
value.js-bearing consts (`defaultOptions`, `defaultLayerConfig`) live in
`constants/defaults.ts`; the ten LIGHT importers target `constants/types` while the
heavy importers keep the back-compat `constants` barrel (S.B1). Defaults: 1000ms
duration, 0 delay, 1 iteration, normal direction, forwards fill, easeInOutCubic,
WAAPI on, reduced-motion off, oklab color space.

## Dependencies

- `@mkbabb/value.js` — `ValueUnit`, `Color`, the CSS `@keyframes` grammar/parser, the easing registry, math/normalization. Reached by the HEAVY surface only (static runtime imports in `engine/`, `group/`, `compile/`, `resolve/`, `ingest/`, `scroll/`, `waapi/`, `svg/morph-svg.ts`, `presets/`, `constants/defaults.ts`; the barrel's own `import type { Stylesheet }` is erased; never by the light modules — gated by `proof:boundary`). The `@keyframes` grammar itself lives in value.js; keyframes.js owns the animation engine over it.
- `internal/leaves.ts` — re-exports value.js's OWN `clamp`/`scale`/`lerp` from the `parse-that`-free `@mkbabb/value.js/math` subpath (not a byte-copy) + rAF shims, so the light engines carry no value.js GRAMMAR edge.
