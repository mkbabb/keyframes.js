# Frontier lane — the PHYSICS frontier: a COMPOSED physics vocabulary beyond parity springs

**Lane:** `physics-frontier` (FRONTIER-RESEARCH fleet, K-tranche seeding · 2026-06-10).
**Charter:** kf already has SwiftUI-grade springs at parity with Motion/anime. What would push
its physics layer BEYOND the 2026 field — genuinely novel, on-brand, only-kf-could-do-it-this-way.
Method: internal source surface (every claim `file:line`) + the verified 2026 external landscape
(every external claim linked, §Sources) + the J ground-truth corpus (`audit/sota-landscape.md`,
`J.md §WAVE MAP`, the two sibling frontier docs). **Skeptical of its own lane:** the headline
finding is that the obvious framing of (a) is a KILL, that (b) and (d) are largely PARITY or
already-shipped, and that the ONE genuinely frontier-defining, only-kf seam is **(c) the spring as
a blend-weight driver** — physics fused with kf's unique weighted-blend axis, which nobody has —
backed by **(e) amplitude-scaled reduced-motion**, which nobody has either and which the WCAG
guidance actively wants.

The on-brand test (binding, from the fleet charter): a proposal earns a K verdict only if it
**EXTENDS one of kf's three unique axes** — (1) CSS `@keyframes` round-trip; (2) perceptual oklab
interpolation; (3) **weighted layer blending** — or closes a named gap *in a way only kf could*.
"Motion has springs" is not a reason. "Only an engine with a `weighted` blend tier and an analytic
spring stepper could crossfade two animation layers along a physical spring trajectory" is.

---

## §0 The decisive internal fact — kf's physics is already a SMALL ALGEBRA, not one primitive

Before proposing anything: the single most important piece of evidence is that kf's physics layer
is *already further along the "vocabulary" axis than any competitor*, and that is the lever.

- **Analytic spring with exact velocity** (`spring.ts:341-386`): `SpringProgress.evaluateAt` is the
  closed-form solution of `x'' + 2ζω₀x' + ω₀²x = ω₀²·target` across all three damping regimes, and
  it produces `currentVelocity` as the *exact analytic derivative* (`spring.ts:360-362, 369, 381`),
  not a finite difference. Motion's `getVelocity()` is a numerical per-frame difference
  ([Motion docs](https://motion.dev/docs/motion-value)); kf's is exact.
- **Velocity-continuous re-seat ALREADY EXISTS** (`spring.ts:241-268`): setting `.target`
  re-seats the closed form from the current `(x, v)`, so a mid-flight target change is C¹-continuous.
  The drag→fling path consumes exactly this (`drag.ts:256` — `reset(value, releaseVelocity)`).
- **Closed-form decay with a projected rest point** (`decay.ts:59-100`): `decay()` and `decayRest()`
  give both the glide sampler `x(t)=x0+(v0/k)(1−e^{−kt})` AND the asymptotic endpoint `x0+v0/k`
  without running a loop — i.e. kf *already* has the "where would a fling land" primitive that
  paginated-snap decisions need.
- **Two faithful CSS twins per spring** (`springLinearStops.ts`, `springTimingFunction.ts`): one
  solver emits BOTH a JS `TimingFunction` and a CSS `linear()` string from the same
  `(response, dampingFraction)` preset — the static/dynamic twin that lets a spring run on the
  WAAPI compositor (`springTimingFunction.ts:106-119`, consumed in `waapi.ts`).
- **ONE reduced-motion gate** (`internal/reduced-motion.ts:101-107`): `withReducedMotion(respect,
  snap, run)` — every play path routes through it; today `snap` is a hard jump-to-rest.

So kf is not "a library with springs." It is a library with a **physics ALGEBRA** — spring, decay,
re-seat, CSS-twin, one PRM gate — that no competitor has assembled into composable parts. The
frontier move is to make the *algebra* do something the field can't: drive kf's unique blend axis,
and scale (not kill) under reduced motion. The standalone primitives (vector springs, more drag
axes) are PARITY plumbing and mostly KILL/BOOK.

---

## §1 (a) N-dimensional / vector springs — KILL the coupled form, J-FOLD the trivial form

**The ask:** 2D/3D position springs; "shared phase vs independent axes"; critically-damped vector
springs; the square scene "already wants this."

**The research.** The canonical game-dev spring references are unanimous: a vector spring IS
N independent per-component scalar springs. The Orange Duck "Spring-Roll-Call"
([theorangeduck.com](https://theorangeduck.com/page/spring-roll-call)) states it directly — *"while
this code is for a single `float` the same can be done for a position just by applying it to each
component of the vector independently."* Ryan Juckett's damped-springs reference and Unity's
`SmoothDamp` are the same per-component pattern
([RyanJuckett](http://www.ryanjuckett.com/programming/damped-springs/)). **There is no canonical
"shared-phase coupled vector spring" in the UI/game-animation literature** — coupling axes through a
shared phase is a *mass-spring-network* construct (cloth, soft-body), which is squarely the
Worker/physics-sim territory the ARCH kill list and KISS forbid, and which no UI library wants.

**Why the coupled form is a KILL.** A genuinely coupled 2D spring (shared `ω`/phase across x and y
with cross-terms) buys you nothing a designer asked for and costs an ODE-system integrator — it is
me-too physics-sim chasing, fails KISS, and brushes nothing on kf's three axes. Researched and
rejected.

**Why the independent form is a J-FOLD, not a K.** The useful 80% — "spring a 2D point to a target,
flick it in 2D, settle without overshoot" — is *already expressible today*: two `SpringProgress`
instances, exactly as `drag.ts:28-30` documents (*"A 2-D drag composes two `Draggable`s … the
engine stays one-dimensional, the caller owns the composition (KISS)"*). The square scene wanting
2D springs is satisfied by a thin **`VectorSpring`** convenience that owns an array of
`SpringProgress` and exposes `target: number[]` / `value: number[]` / `velocity: number[]` — pure
sugar, zero new physics, zero new hot-path, value.js-free (stays LIGHT). The ONE non-trivial design
decision — independent axes (each axis its own `response`/ζ, natural for x/y with different feels)
vs a shared preset (one `(response, ζ)` driving every axis, natural for a position that should feel
isotropic) — is a constructor flag, not coupled math. Shared-PRESET ≠ shared-PHASE: the former is
config reuse, the latter is the killed ODE-system.

> **Verdict (a): KILL** the coupled/shared-phase vector spring (physics-sim, ARCH-adjacent, no axis).
> **J-FOLD** the `VectorSpring` sugar — but note it is small enough to be a demo helper or a
> light-barrel convenience, NOT a K wave. Effort **S**. It does not headline anything; it removes a
> paper cut. **Measure-first gate:** none needed (zero hot-path delta — it's N existing steppers).

---

## §2 (b) Velocity-continuous interruption EVERYWHERE — PARTIAL-KILL, with one real K-seam buried in it

**The ask:** retarget any playing animation preserving velocity (Motion's killer feature); what
would kf's engine need — "velocity extraction from the interp stream."

**The research splits the ask into two engines, and they have OPPOSITE verdicts.**

**(b1) The spring/stepper path — ALREADY DONE; proposing it is a KILL (re-litigation).** For
`SpringProgress`/`Draggable`/`SmoothProgress`, velocity-continuous interruption is the existing
behavior: `.target =` re-seats the closed form from live `(x, v)` (`spring.ts:241-268`); the drag
fling is C¹-continuous by construction (`drag.ts:256`). Motion's celebrated "spring inherits the
velocity it had when interrupted" ([Motion](https://motion.dev/), b3ll/Motion) is *bit-for-bit what
`spring.ts` already does, and does more exactly* (analytic vs Motion's numerical `getVelocity`).
There is nothing to build here. Claiming it as frontier work would be dishonest.

**(b2) The KEYFRAME path (`Animation`/`interpFrames`) — the genuinely hard, genuinely on-brand
seam.** This is where "velocity extraction from the interp stream" actually bites. The engine path
carries `effectiveT` (`engine.ts:1098`) but **no velocity** — `interpFrames` is a pure positional
lerp at sample time `t` with zero notion of `dx/dt`. So today, interrupting a *CSS-`@keyframes`
animation* mid-flight (e.g. retargeting a `fromString` animation to a new end state, or cross-fading
to a different `@keyframes` rule) RESTARTS from the current position with **zero velocity** — the
exact "freeze and start from scratch" jank Motion brands itself against. **Only kf has the
ingredients to fix this on the CSS-source path:** kf already round-trips author `@keyframes` AND owns
a spring stepper AND owns the `linear()` twin. The frontier primitive is:

> **`reseatToSpring(animation, newTarget)`** — at interruption, finite-difference the interp stream
> over the last frame (`(value(t) − value(t−dt)) / dt`, the one place a numerical derivative is
> correct because keyframes have no analytic velocity), seed a `SpringProgress` per animated property
> with that velocity, and hand the spring's `linear()` twin BACK to the engine as the transition
> easing toward `newTarget`. The CSS-source animation that was running on its declared curve hands
> off, velocity-continuous, to a spring — and because the spring carries a `linear()` twin
> (`springTimingFunction.ts`), the handoff can run on the WAAPI compositor.

This is the on-brand prize: *velocity-continuous interruption of an animation kf parsed from author
CSS, re-served as a spring with a faithful CSS twin.* GSAP/anime can't (no spring; no oklab; no
round-trip). Motion can't (it never parsed your `@keyframes` — it owns its own tween objects, not
your CSS). **Only a CSS-source-of-truth engine with a spring algebra and a `linear()` emitter can do
this, and it extends axis (1) directly.**

**ARCH-kill distinction.** This is NOT per-property keyframe easing (the kill): the spring easing is
applied UNIFORMLY across the retargeting transition, not stored per-keyframe-per-property; it is a
*transition between* two states, computed once at interruption, exactly the shape `springTimingFunction`
already emits. It is NOT Typed-OM-as-carrier: the velocity is a plain `number` finite-differenced
from the existing `interpVars` lerp output, no Typed-OM. It is NOT ValueUnit monomorphization.

> **Verdict (b): KILL** re-proposing spring interruption (already shipped, exactly). **K-CANDIDATE**
> for `reseatToSpring` on the KEYFRAME path — velocity-continuous interruption of a *parsed CSS
> animation*, the only-kf seam. Effort **M** (the finite-diff hook in `interpFrames`/`engine.ts`;
> the per-property spring seeding; the `linear()` handoff already exists). **Measure-first gate:**
> a `bench/interruption.bench.ts` proving the finite-diff velocity probe adds zero steady-state cost
> (it only runs at the interruption event, not per frame) + a visual proof that a retargeted
> `fromString` animation leaves its prior position at the measured velocity (no visible kink). This
> is the strongest single physics finding; it could anchor a K wave alongside (c).

---

## §3 (c) Physics into the WEIGHTED BLEND axis — the K-HEADLINE-CANDIDATE (nobody has this)

**The ask:** a spring as a blend-weight driver — layer transitions with physical crossfades;
NOBODY has this; it extends kf's unique compositor.

**The seam is real and it is one field.** In `AnimationGroup`, a layer's `weight` is a STATIC
config number (`group.ts:365` reads `layer.weight`; set imperatively via `setLayerConfig`,
`group.ts:776-792`). The `weighted` blend arm lerps each numeric leaf toward the incoming value by
that constant `weight` per frame (`group.ts:345-375`). **Today, changing a layer's weight is a hard
cut** — you `setLayerConfig({ weight: 0.7 })` and the next frame blends at 0.7 with no transition.

**The frontier move:** let a layer's `weight` be DRIVEN by a `SpringProgress` (or `decay`, or any
`Tickable` stepper) instead of being a constant. A crossfade between two animation layers then
follows a *physical* trajectory — it can overshoot (a layer momentarily blends past 100% and settles
back, the canonical iOS "snap into place" for a whole animation layer), it inherits velocity if you
re-target the crossfade mid-transition, and it can be a spring, a decay, or a critically-damped
settle. This is **physics fused with kf's single most unique axis** — and it is the literal
definition of "only kf could do this": GSAP/anime/Motion have NO weighted-layer-blend tier at all
(`sota-landscape.md §3` — "a compositor-style lerp-by-weight tier no mainstream JS library exposes"),
so the *substrate* for a physical layer-crossfade does not exist outside kf.

**Why it's elegant and KISS-compatible (not bloat).** The blend hot path is untouched —
`group.ts:362-365` still lerps by `layer.weight`; the ONLY change is that `weight` becomes a *read of
a stepper's current value* instead of a constant. Concretely: a layer gains an optional
`weightSpring?: SpringProgress`, and the group's tick reads `layer.weightSpring?.value ?? layer.weight`.
One nullish read. The stepper is one of the LIGHT primitives kf already ships
(`SpringProgress`/`decay`/`SmoothProgress` all implement `Tickable`, per `CLAUDE.md`). No new physics,
no new hot-path allocation (the spring is one analytic eval per frame, already zero-alloc), no
value.js edge (the group is heavy-side regardless). It is the COMPOSITION of two things kf already
owns — the unique axis and the spring algebra — which is exactly the "composed physics vocabulary"
the lane charter names and which no competitor can assemble because they lack the blend axis.

**The product shape.** `group.transitionLayer(name, { weight: 1, spring: {...} })` springs a layer's
blend weight from its current value to a new one; `group.crossfade(a, b, { spring })` springs `a`
down while springing `b` up. The `add`/`replace` modes get nothing (they're not weight-parametric);
this is purely the `weighted` tier finally becoming *temporal* and *physical*.

**ARCH-kill distinction.** Brushes nothing. Not ScrollTimeline-native (no scroll), not WAAPI-kill
(the group is rAF-managed by construction, `group.ts`), not per-property easing (the spring drives
ONE scalar — the layer weight — not per-property curves), not Typed-OM, not bit-packing. It is a
nullish read swapping a constant for a stepper value.

> **Verdict (c): K-HEADLINE-CANDIDATE.** This is the lane's strongest finding and the one that best
> satisfies the on-brand test absolutely: it extends the weighted-blend axis (axis 3) with the spring
> algebra, and the substrate is unique to kf. Effort **M** (the `weightSpring` read in the blend
> loop; the `transitionLayer`/`crossfade` API; a demo scene crossfading two layers with overshoot).
> **Measure-first gate:** a bench proving the `?? `-read adds zero measurable cost to the
> `_grouped` blend hot path vs the constant-weight baseline (the gate is "no regression on the
> 200-cell LoAF group bench named in `sota-landscape.md §5`"), plus a runtime proof that a
> spring-driven crossfade overshoots and settles (the velocity-carrying re-target during a live
> crossfade lands without a kink). Could co-anchor the K tranche with (b2): together they are
> "kf's physics algebra drives BOTH the interp stream and the compositor."

---

## §4 (d) Momentum scrolling / snap physics — J-FOLD the primitive, DEFER the orchestration to the scroll lane

**The ask:** decay-to-snap-point feeding the scroll-orchestration lane.

**The honest read:** the physics primitive ALREADY EXISTS and is the right one. `decayRest()`
(`decay.ts:94-100`) returns the projected fling endpoint `x0+v0/k` *without running the loop* — which
is EXACTLY the input a snap decision needs: "given this flick velocity, where would it land; snap to
the nearest snap-point to that projection." This is the canonical paginated-fling / momentum-snap
algorithm, and kf has the hard part (the closed-form projection) shipped today. The missing piece is
trivial: a `snapDecay({ velocity, snapPoints })` helper that calls `decayRest`, finds the nearest
snap point, and re-seats a `SpringProgress` to it (velocity-continuous, so the snap inherits the
fling momentum). That is ~15 lines composing two existing primitives.

**But the verdict is DEFER-to-scroll-lane, not K-here.** Momentum-snap is *only* frontier-defining as
part of a ScrollTrigger-class scroll ORCHESTRATION tier — which `sota-landscape.md §4` names as
"the one genuinely NET-NEW capability candidate" and which is a SEPARATE frontier lane (the
scroll-orchestration lane explicitly owns "momentum scrolling/snap physics feeding the
scroll-orchestration lane" per this lane's own charter cross-reference). Proposing the scroll tier
HERE would duplicate that lane and over-scope the physics lane. The physics lane's contribution is
narrow and clean: **the snap PRIMITIVE (`snapDecay`) is a J-FOLD-sized composition that the scroll
lane CONSUMES.** Building decay-to-snap as standalone physics, divorced from scroll orchestration, is
a primitive nobody asked for in isolation.

**ARCH-kill distinction.** `snapDecay` is pure closed-form math + an existing spring re-seat — it does
NOT touch native ScrollTimeline (the kill); it does not own a scroll loop; it is the *math* a scroll
orchestrator would call. No brush.

> **Verdict (d): J-FOLD** the `snapDecay` primitive (S effort, ~15 LoC composing `decayRest` +
> `SpringProgress.reset`), **flagged as CONSUMED-BY the scroll-orchestration lane** — its frontier
> value lives there, not here. The physics lane records the primitive; the scroll lane owns the
> orchestration. **Overlap flag:** momentum-snap is a shared boundary with the scroll lane; this lane
> defers the K-weight to it. **Measure-first:** none (closed-form, no loop).

---

## §5 (e) Motion-INTENSITY accessibility scaling — K-CANDIDATE, and NOBODY has it

**The ask:** `prefers-reduced-motion` → amplitude-scaled, not binary-off; kf's ONE
`withReducedMotion` gate could take a scale.

**The external research is decisive and surprising: the FIELD agrees this is right, and NO library
does it.** WCAG 2.3.3 ("Animation from Interactions") and current a11y guidance
([MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion),
[W3C WAI 2.3.3](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html)) are
explicit that the vestibular trigger is *large-scale movement* — parallax, zoom, big slides — and
that the correct response is to *reduce or replace* non-essential motion (shorter durations, smaller
travel, opacity/color instead of transform), **NOT** a blanket kill. Yet every library implements
the blunt binary:
- **Motion** ([motion.dev/docs/react-accessibility](https://motion.dev/docs/react-accessibility),
  verified) *"does not scale animation intensity — it either disables or preserves animations"*: it
  hard-disables transform/layout, preserves opacity/color, or hands the developer a boolean.
- **kf today** (`internal/reduced-motion.ts:101-107`): `withReducedMotion` snaps to the terminal
  state — a hard jump. Binary.

**So kf's ONE gate taking a SCALE is a genuine first.** The frontier move: `withReducedMotion` (and
the `respectReducedMotion` option on every stepper/engine surface) accepts not just `true|false` but
an **intensity ∈ [0,1]** (or a richer `{ amplitude, duration, allowOpacity }` policy). At intensity
0.3, a spring keeps its trajectory shape but scales its *amplitude* (the displacement from rest) to
30% while preserving the full opacity/color animation — the WCAG-blessed "shorten the travel, keep
the meaning." Because kf's spring is analytic, amplitude scaling is exact and free: scale
`(originValue − targetValue)` by the intensity before `evaluateAt` (`spring.ts:342`), and the curve
shape, settle time, and CSS `linear()` twin all follow for free. This is *only* clean because kf
funnels every play path through ONE gate (`reduced-motion.ts` — "every play path in the engine routes
through this one contract") — a competitor with per-surface PRM checks would have to retrofit scaling
in seven places; kf changes one signature.

**Why it's on-brand and not bloat.** It rides the ONE-gate discipline kf already built (the gate is
already the headline of `internal/reduced-motion.ts`); the perceptual axis (2) is *preserved* exactly
because the policy keeps oklab color/opacity while scaling transform amplitude (the WCAG distinction
maps 1:1 onto kf's interp dispatch — color stays perceptual, transform scales down); and the spring's
analytic form makes amplitude scaling a one-line multiply, not a new code path. It is the rare
accessibility feature that is *also* a physics-vocabulary feature: "the spring under reduced motion is
the same spring at lower amplitude," which is a genuinely novel, genuinely correct framing.

**The honest caveat (skeptical of the lane).** The *value* of intensity-scaling depends on real
users wanting a middle setting, and the OS only exposes a binary `prefers-reduced-motion`. So the
SCALE must come from the *consumer's* policy (a settings slider, a per-animation
`reducedMotionIntensity`), not from the OS — kf provides the *mechanism* (the gate takes a scale),
the app provides the *policy*. That keeps it honest: kf is not inventing an OS signal; it is making
its one gate expressive enough to honor a richer policy the moment the platform or the app supplies
one. This is a real K-CANDIDATE, but it is a *mechanism* K, not a *headline* K.

**ARCH-kill distinction.** Brushes nothing — it is a parameter on an existing gate. Not a new loop,
not native, not Typed-OM.

> **Verdict (e): K-CANDIDATE.** Net-new in the field (verified: nobody scales intensity), WCAG-aligned,
> rides the one-gate discipline, exact-and-free on the analytic spring, preserves the perceptual axis.
> Effort **M** (the gate signature `withReducedMotion(scale, snap, run, scaledRun?)`; the amplitude
> multiply in `evaluateAt`; the `respectReducedMotion` option widened to `boolean | number | policy`
> across the stepper/engine surfaces; the `springLinearStops`/`springTimingFunction` twins inherit
> scaling for free). **Measure-first gate:** not a perf claim — the gate is a *correctness* claim:
> a runtime proof that at intensity `s`, a spring's peak displacement is `s × `the full-intensity
> peak (analytic, assertable), the opacity/color track is untouched, and the settle time is preserved.
> Pairs naturally with (c): a spring-driven crossfade under reduced motion scales its blend overshoot.

---

## §6 Overlaps with sibling lanes (flagged, not duplicated)

- **view-transitions lane** (`frontier/view-transitions.md §0,§(c)`): already found the
  spring-`linear()`-into-VT-pseudos seam and the glass-ui VT helper kf consumes. This lane's
  spring-`linear()` machinery (`springTimingFunction.ts`) is the SAME emitter; (b2)/(c)/(e) all reuse
  it but apply it to the interp stream / blend axis / PRM gate, NOT to VT pseudos. No duplication —
  complementary consumers of one emitter.
- **scroll-orchestration lane** (named in `sota-landscape.md §4` as the NET-NEW K candidate): OWNS
  momentum-snap as orchestration. This lane DEFERS (d)'s K-weight there and contributes only the
  `snapDecay` primitive it consumes (§4).
- **Tranche J ownership** (`J.md §WAVE MAP`): J owns the publish (J.W5/WZ), the engine totality
  (J.W1), the demo seams (J.W2). NONE of (a)-(e) is J-owned — they are net-new physics capability,
  correctly K-tranche. `decay.ts` being untested is a J.W1 fold, not this lane's concern.

---

## §7 The synthesis line

kf's physics is already an *algebra* — analytic spring, exact velocity, velocity-continuous re-seat,
closed-form decay with a projected rest, dual CSS twins, one PRM gate — assembled to a degree no 2026
competitor has reached. The frontier is NOT more primitives (vector springs are a KILL of the coupled
form and a paper-cut J-FOLD of the trivial form; standalone momentum-snap defers to the scroll lane;
spring interruption is already shipped exactly). The frontier is making the algebra **compose with
kf's unique axes**: drive the weighted-blend tier with a spring so layer crossfades become physical
(**(c) K-HEADLINE** — only kf has the blend substrate); extract velocity from the keyframe interp
stream so a parsed-CSS animation can be interrupted velocity-continuously and re-served as a spring
with a `linear()` twin (**(b2) K-CANDIDATE** — only a round-trip engine has the CSS source); and let
the one reduced-motion gate take an *intensity* so motion is amplitude-scaled, not killed (**(e)
K-CANDIDATE** — nobody does it, WCAG wants it, the analytic spring makes it free). Together (c) + (b2)
+ (e) are one thesis: **kf's physics algebra, pointed at kf's unique axes** — a composed physics
vocabulary the field cannot replicate because it lacks the blend axis, the CSS round-trip, and the
single-gate discipline the composition rides on.

---

## §Sources

[Motion — homepage / interruption](https://motion.dev/) ·
[Motion — getVelocity / motionValue](https://motion.dev/docs/motion-value) ·
[Motion — React accessibility (reduced motion: disable transform, preserve opacity; NO intensity scaling)](https://motion.dev/docs/react-accessibility) ·
[Motion — frame API](https://motion.dev/docs/frame) ·
[b3ll/Motion (iOS — velocity-inheriting interruptible springs)](https://github.com/b3ll/Motion) ·
[Apple WWDC23 — Animate with springs](https://developer.apple.com/videos/play/wwdc2023/10158/) ·
[Orange Duck — Spring-Roll-Call (per-component vector springs; no coupled form)](https://theorangeduck.com/page/spring-roll-call) ·
[Ryan Juckett — Damped Springs](http://www.ryanjuckett.com/programming/damped-springs/) ·
[MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) ·
[W3C WAI — Understanding SC 2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html)
