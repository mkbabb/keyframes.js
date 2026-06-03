# Changelog

## 3.0.0

### Major Changes

- d84faf5: Tranche A — the value.js boundary hardened, the release CI runnable, and the engine on its own modern-web baseline.

    **Boundary, gated (not asserted).** A `proof:boundary` CI gate builds a spring-only entry and fails the build if any light module reintroduces a static `@mkbabb/value.js` edge — the KF-B1 light/heavy split is now proven by construction, not a CHANGELOG sentence. `"sideEffects": false` and the `loadAnimationEngine()` dynamic boundary are unchanged.

    **Boundary ergonomics.** String easing _names_ now resolve through one shared `EasingResolvable` contract: resolution is kicked off eagerly at construction, so a named curve lands by the first frame instead of silently interpolating linearly until `await .ready()`. A residual same-tick synchronous `.at()`/`tick()` before resolution emits a one-time dev-only warning (stripped from the published bundle). `RAFPlayback` is exported and owns the shared reduced-motion snap gate.

    **Reduced motion, everywhere.** `prefers-reduced-motion: reduce` is honored on the heavy path now, not just the light interpolators. Opt in with `respectReducedMotion: true` on `Animation`/`CSSKeyframesAnimation` (snaps `play()` to the final frame in a single paint) and on `NumericAnimation`/`ElementMorph` (via the exported `RAFPlayback` gate); set `group.respectReducedMotion = true` on an `AnimationGroup`. SSR-safe no-op off-DOM.

    **INP.** `AnimationGroup.tick()` yields to the main thread (`scheduler.yield()` with a `MessageChannel` fallback) between child batches for large groups, so a big per-frame composite no longer runs as one long task.

    **WAAPI springs.** A spring `Animation` delegated to the Web Animations API now runs its true overshoot/settle curve on the compositor — `springTimingFunction` carries its CSS `linear()` equivalent, which the WAAPI path emits instead of a flattened `linear` ramp.

    **Release.** The library build is glass-ui-free: `@mkbabb/glass-ui` is an optional demo-only dependency a clean runner skips, and the CI gate is library-scoped (`check:lib` → `build:lib` → `test` → `proof:boundary`). The package publishes with npm provenance.

## v2.2.0 — value.js static/dynamic boundary (KF-B1)

Carves the package barrel along the value.js seam so the light physics/
interpolation engines no longer drag the heavy CSS-parsing surface — or
`@mkbabb/value.js` — into a consumer's static graph.

### The boundary

- **LIGHT engines stay static and value.js-free.** `SpringProgress`,
  `SmoothProgress`, `NumericAnimation`, `ElementMorph`, the `Timeline`
  family, and the spring-stop helpers now reach their handful of leaf
  helpers — `requestAnimationFrame` / `cancelAnimationFrame` /
  `clamp` / `lerp` / `scale` — from a new local `src/animation/internal/
leaves.ts` instead of `@mkbabb/value.js`. A consumer that imports only
  these has **zero** static import edge to value.js. Verified against the
  built dist: the `dist/keyframes.js` barrel statically imports only the
  leaf chunk; a spring-only bundle contains no value.js code.

- **HEAVY engine moves behind a dynamic boundary.** `Animation`,
  `CSSKeyframesAnimation`, `AnimationGroup`, `getTimingFunction`,
  `resolveKeyframes`, and the animation-options constants (`DIRECTIONS`,
  `FILL_MODES`, `defaultOptions`, `defaultLayerConfig`) live in
  `src/animation/engine.ts` and are reached through a new async accessor:

    ```ts
    import { loadAnimationEngine } from "@mkbabb/keyframes.js";
    const { CSSKeyframesAnimation } = await loadAnimationEngine();
    const anim = new CSSKeyframesAnimation(opts).fromString(css);
    ```

    `loadAnimationEngine()` does `await import("./engine")`, so the
    value.js-bearing graph (the `ValueUnit`/`Color`/CSS-parser/easing-
    registry surface) loads only on first await and never enters a
    light-only consumer's static graph. The dist now ships a split
    `engine-*.js` chunk that the barrel reaches via dynamic import.

### Breaking changes

- **The heavy classes are no longer static named exports of the barrel.**
  `import { Animation } from "@mkbabb/keyframes.js"` as a _value_ is
  retired in favour of `await loadAnimationEngine()`. The class **types**
  remain on the static barrel (`import type { Animation } from
"@mkbabb/keyframes.js"` still resolves), so type annotations are
  unaffected — only the runtime constructors moved.

- **The light engines resolve string easing names lazily — callable
  easing stays static and value.js-free.** `NumericAnimation`,
  `ElementMorph`, and the `Timeline` family still accept
  `timingFunction` / `easing` as a callable `TimingFunction` OR a string
  easing _name_ (`"ease-out-cubic"`, `"easeOutCubic"`, `"linear"`, …), as
  before. A **callable** is used directly — no dynamic import, nothing
  value.js pulled into the static graph (this is the gate path). A
  **string name** is resolved LAZILY through the dynamic engine boundary:
  `NumericAnimation` / `ElementMorph` resolve before the first `.play()`
  frame (or an explicit `await .ready()`); `Timeline` kicks off resolution
  from its constructor and applies the eased value once it lands (also
  awaitable via `.ready()`). The value.js-bearing easing registry loads
  only when a named easing is actually used, so a callable-only consumer's
  static graph stays value.js-free. The full `Animation` /
  `CSSKeyframesAnimation` engine accepts string names eagerly as before.

### Build

- `package.json` gains `"sideEffects": false` so a bundler may tree-shake
  the unused static re-exports out of the single dist barrel.

## v2.1.1 — 2026-05-28 (G.W5 — value.js seam canon)

Published as part of the muster tranche G release-engineering wave (G.W5 sub-wave A).
The `@mkbabb/value.js` dependency migrates from the `file:../value.js` seam to the
`^0.10.0` npm-registry semver pin — the published artifact resolves value.js through
the registry. No public API change versus v2.1.0; this is the seam-canon publish that
lands keyframes.js on the registry-resolved consumer-default path. (Note: this release
re-exported value.js _statically_; the dynamic re-export boundary it gestured at did
not yet exist in the source — it lands in v2.2.0 above.)

## v2.1.0 — 2026-05-13 (AB.W6 settle)

Settles the long-standing `w.w2.1-keyframes-prebuild` operator WIP branch
into master and ships the new scrubbing + zero-allocation API.

### New public API

- `AnimationGroup.render()` — re-composes the current frame using every
  child's current `t`. Single-target groups go through the composed
  transform; multi-target groups apply each child's interpolated vars
  directly to its own targets. Replaces the previously private
  `renderPauseFrame()` and is the entry point for scenarios that mutate
  child state outside the rAF loop (scrubbing, state restore, pause
  snapshots).
- `AnimationGroup.setChildTime(nameOrAnim, t)` — sets a single child's
  `t` + `pausedTime` without touching its siblings. Chainable; call
  `render()` afterwards to reflect the change visually.
- `Animation.interpFrames(t, transformFrames, out?)` — optional `out`
  buffer enables zero-allocation steady-state playback. When passed,
  the buffer's stale keys are cleared deterministically before new
  values are written, so callers can reuse a single long-lived object
  per child.

### Internal refactors

- `AnimationGroup.transformFramesGrouped()` now writes each child's
  interpolated vars directly into the entry's `values` buffer via the
  new `interpFrames(out)` path. Drops the per-entry `Object.assign` and
  the per-frame allocation. The previous `done || paused` early-return
  path is gone — `interpFrames` clears stale keys, so scrubbed children
  always reflect fresh state.
- `AnimationGroup.tick()` simplified — the comment around the
  `pausedTime === 0` snapshot tick is now self-evident from the code.
- `AnimationGroup` pause path calls public `render()` instead of the
  private `renderPauseFrame()`.

### Bug fixes (demo)

- `useAnimationGroupPlayback.sliderUpdate` no longer drags sibling
  animations along normalized progress when one child is scrubbed.
  The previous bespoke loop has been replaced with
  `getAnimationGroup().setChildTime(animation, t).render()`.
- `useAnimationGroupPlayback.notifyPlayStateChange` now derives
  `isStarted` from intent (`playing || group.started`) so callers that
  just asked the group to start get the correct state before the first
  rAF tick flips `group.started`.
- `useTransformState` matrix-editor watcher early-returns when the
  group has started, eliminating mid-play `matrix3dEnd` rebuilds that
  caused visible jitter on the orbiting cube.

### Tests

- `test/useAnimationGroupPlayback.test.ts` rewritten to assert the new
  contract: scrubbing one animation moves only its own `t`; siblings
  remain at their pre-scrub `t` and render at that position.
- Full suite: 218 tests passing.

### Operator-WIP settlement (AB.W6)

This release also clears the 16 dirty entries on the
`w.w2.1-keyframes-prebuild` WIP branch (9 untracked operator UI
captures deleted; 5 modified source files finished + committed; 2
modified dist files dropped + rebuilt from source). The WIP branch is
fast-forward-merged into master.

The underlying `b788205` commit ("adopt glass-ui v1.0 subpath surface")
is now locked into master, so downstream consumers see the demo's
subpath import canon.

## v2.0.0 — 2025-09-09

Drops `value.js` re-exports — consumers must now import primitives from
`@mkbabb/value.js` directly.
