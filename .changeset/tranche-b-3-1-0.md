---
"@mkbabb/keyframes.js": minor
---

Tranche B — the engine's debt transposed, the demo made true.

**Engine (gestalt transposition, net-deletion).** A typed `Easing`
(`{ fn, css? }`) replaces the former Symbol-on-a-closure side channels;
`resolveEasing(name)` (async, fail-explicit) + `toEasing` replace the
`EasingResolvable` resolver — the light engines accept a callable
`TimingFunction` or a typed `Easing` only (a string name throws
`AnimationOptionError`; resolve it up front). One `RAFPlayback` driver
(`play`/`drive`/`loop`) owns every rAF loop; one `withReducedMotion` gate
drives every reduced-motion snap; one explicit rest-position/fill contract
(`settle()` pure teardown, `reset()` explicit rewind, `restPosition` from
`fillMode`). Option setters are fail-explicit: a malformed PRESENT value
throws a typed `AnimationOptionError` (genuine omission still defaults).
WAAPI delegation is restored (the prior renderer check was bind-broken) and
made faithful: it delegates only when the easing has a CSS twin, and
`stop()`/`reset()` cancel the compositor animation. New exports: `Easing`,
`resolveEasing`, `toEasing`, `AnimationOptionError`, `UnknownEasingError`,
`RAFPlaybackOptions`, `Tickable`. `getTimingFunction` now resolves CSS
`steps()`/`step-start`/`step-end` (Easing Level 1 complete).

**Boundary gate widened.** `proof:boundary` now proves every light barrel
export (not just `SpringProgress`), the heavy engine's dynamic boundary,
and the absence of dormant static value.js specifiers.

**Demo + CI** (not part of the published library): the production demo
build is repaired (it was shipping blank), the four blank scenes render,
the cube is no longer clipped, and CI gains demo-paint (inv γ) + occlusion
(inv δ) gates.
