---
"@mkbabb/keyframes.js": major
---

Tranche C — the close made honest, the design system made true, the engine dogfooded.

This release ships alongside the Tranche B engine transposition (the
`tranche-b-3-1-0` changeset, cut but never published — folded here so one
provenance-signed publish ships both). C's published-library surface is the
engine residuals; the design-system + dogfood + integrity work (W1–W3) lands in
the demo + CI gates and does not change the published API.

**The engine unification, completed to its edges (W4).**

- **One generation-guarded loop core.** `play`/`drive`/`loop` fold into a single
  `_run` frame-scheduler; `drive` inherits the `_gen` restart guard `loop` had,
  so a `stop()`+restart mid-frame can no longer spawn a second rAF chain (the
  unguarded double-schedule class is now structurally impossible).
- **One canonical step: `tickDt(dt: ms): number` on every stepper.** The
  frame-dependent no-arg `SmoothProgress.tick()` is removed and the
  seconds-taking `SpringProgress.tick(seconds)` is demoted to a private
  internal — no public stepper method takes seconds or means four different
  things. `Tickable.tickDt` is typed `: number` (was `: void`). **Breaking:** if
  you stepped `SmoothProgress`/`SpringProgress` manually, call `tickDt(ms)`.
- **Fail-explicit option contract is now total.** `setColorSpace` /
  `setHueMethod` join the `parseOption` seam — a malformed PRESENT value throws
  `AnimationOptionError` (genuine omission still defaults), closing the last two
  setters that silently accepted invalid input. **Breaking** for callers that
  relied on an invalid value being silently accepted (e.g. `colorSpace: "srgb"`
  — value.js's sRGB-family space is `"rgb"`).
- **The default easing's compositor path: verified, then withheld.** A single
  `cubic-bezier()` cannot faithfully reproduce the piecewise Penner
  `easeInOutCubic` (proven: the best symmetric fit floors at ~0.0208 drift,
  above the 1e-2 no-visible-drift tolerance), so the default carries no `.css`
  twin and stays rAF-only — faithful by omission. A standing test reds if a
  faithful twin is ever found or an unfaithful one shipped.
- **`Timeline._advance` deduplicated** to one `setTarget` + one branch.

**The boundary + release gates hardened.** `proof:boundary` closes its residual
false-negative classes (a live bare side-effect import, a `@mkbabb/value.js/...`
subpath specifier, a direct `export const` light export now each redden the
gate); `rolldown` is declared as the gate's load-bearing dependency; the CI demo
gate pins the glass-ui sibling to a tag (no moving-HEAD reproducibility hole).

SemVer note: the tier is **major** because the combined B+C release changes
behavior visible to a 3.0.0 consumer (fail-explicit setters throw where 3.0.0
silently accepted; the canonical `tickDt` step). If the team treats the
unpublished B 3.1.0 light-engine surface as the baseline (those steppers were
never published), the change is additive — the publish owner finalizes the tier
at `changeset version`.
