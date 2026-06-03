---
"@mkbabb/keyframes.js": major
---

Tranche A — the value.js boundary hardened, the release CI runnable, and the engine on its own modern-web baseline.

**Boundary, gated (not asserted).** A `proof:boundary` CI gate builds a spring-only entry and fails the build if any light module reintroduces a static `@mkbabb/value.js` edge — the KF-B1 light/heavy split is now proven by construction, not a CHANGELOG sentence. `"sideEffects": false` and the `loadAnimationEngine()` dynamic boundary are unchanged.

**Boundary ergonomics.** String easing *names* now resolve through one shared `EasingResolvable` contract: resolution is kicked off eagerly at construction, so a named curve lands by the first frame instead of silently interpolating linearly until `await .ready()`. A residual same-tick synchronous `.at()`/`tick()` before resolution emits a one-time dev-only warning (stripped from the published bundle). `RAFPlayback` is exported and owns the shared reduced-motion snap gate.

**Reduced motion, everywhere.** `prefers-reduced-motion: reduce` is honored on the heavy path now, not just the light interpolators. Opt in with `respectReducedMotion: true` on `Animation`/`CSSKeyframesAnimation` (snaps `play()` to the final frame in a single paint) and on `NumericAnimation`/`ElementMorph` (via the exported `RAFPlayback` gate); set `group.respectReducedMotion = true` on an `AnimationGroup`. SSR-safe no-op off-DOM.

**INP.** `AnimationGroup.tick()` yields to the main thread (`scheduler.yield()` with a `MessageChannel` fallback) between child batches for large groups, so a big per-frame composite no longer runs as one long task.

**WAAPI springs.** A spring `Animation` delegated to the Web Animations API now runs its true overshoot/settle curve on the compositor — `springTimingFunction` carries its CSS `linear()` equivalent, which the WAAPI path emits instead of a flattened `linear` ramp.

**Release.** The library build is glass-ui-free: `@mkbabb/glass-ui` is an optional demo-only dependency a clean runner skips, and the CI gate is library-scoped (`check:lib` → `build:lib` → `test` → `proof:boundary`). The package publishes with npm provenance.
