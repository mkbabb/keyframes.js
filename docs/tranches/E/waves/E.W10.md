# E.W10 — The orchestration tier (the competitive feature frontier)

**Phase:** IMPL · **Class:** MINOR (purely-additive new public API — no break) ·
**Scope:** `src/animation/` (the published library — light-side, value.js-free
helpers + one heavy-surface DX front door) · **Parallel to:** E.W9 (platform
adoption) and the demo waves (W1/W2/W3/W11); **independent of** E.W7/E.W8
(no shared file, no shared gate) · **Gated on:** keyframes' own green CI (inv-27).

**Title.** *Stagger, sequence, FLIP, drag/inertia — the orchestration layer every
competitor leads with, where the engine already owns the hard physics.*

This is the single largest competitive gap, and it is **net-new leverage of
already-SOTA assets, not new physics**. `SpringProgress` tracks `currentVelocity`
and re-seats the closed-form solution from `(x, v)` on every target change — the
hard part of inertia is already solved and class-leading; `ElementMorph` IS the
FLIP "Invert+Play" half; `AnimationGroup.advanceTo(absoluteClock)` + per-child
`delay` is the sequence substrate; `delay` already flows to `toWAAPIOptions`. The
gaps are thin **construction-time** adapters with **zero per-frame cost**. The
mandate's spine — no-legacy, idiomatic+gestalt, isomorphic, KISS, **inv-16** —
holds: every item is `file:line`-grounded + **verified, not asserted** (inv ε),
and the work folded is the genuinely-warranted SOTA orchestration gap, not
manufactured feature-padding. E's content is **net-NEW** (D terminated every
keyframes-owned deferral, zero KFE); these are findings of the post-D **deep**
assay, surfaced by comparing against Motion / GSAP / anime.js v4 rather than the
Baseline-capability checklist.

---

## § Provenance

The augmentation source for this wave is `_SYNTHESIS-E-augmentation.md` § E.W10.
Its underlying lanes, re-grounded against live source below:

- **`r-anim-libs.md`** — the orchestration-gap lane:
  - **F-1** (stagger absent — GAP-NAMED → FOLD-E; `r-anim-libs.md:45-51`),
  - **F-2** (no timeline sequencing/labels/position-insertion — GAP-NAMED →
    FOLD-E, *design book first*; `:54-60`),
  - **F-3** (FLIP/layout is manual-only over `ElementMorph` — FOLD-E; `:63-69`),
  - **F-4** (drag/gesture + velocity-handoff absent, *but the physics core is
    right there* in `SpringProgress` — FOLD-E; `:72-78`),
  - **F-8** (preset library lacks the entrance/exit/loop taxonomy + spring
    presets — FOLD-E small; `:106-111`).
- **`a-tranche-retro.md` §3.1** — named *the real residual*: the engine **LEADS**
  on interpolation / physics / color / parsing and **GAPS** on
  orchestration / interaction.
- **`a-kf-api-dx.md` D-4** — the single-call `animate()` front door (GAP-NAMED →
  FOLD-E; `a-kf-api-dx.md:183-208`).
- **`r-interpolation.md`** — the interpolation-math refinements that touch this
  tier:
  - **F-1** — the spring `fromDuration` / `{ bounce, visualDuration }` ergonomic
    adapter, ALREADY-SOTA solver + FOLD-E small adapter (`r-interpolation.md:49-55`),
  - **F-2** — the spring → `linear()` WAAPI round-trip claim **corrected from LEAD
    to MATCH** (Motion ships `generateLinearEasing`; the LEAD narrows to
    solver-quality + single-source pairing + the multi-segment guard;
    `:58-62`, `:124`),
  - **F-3** — MotionPath two-track (CSS-native `offset-distance` + numeric
    arc-length sampler) — **BOOK**, not this wave (`:68-78`).

**Net-new vs E.W0–W6.** The original E charter (E.W5) found "zero engine GAP"
against the modern-web Baseline checklist and correctly judged the engine
EXEMPLARY. The orchestration tier is invisible to that checklist — it is a
*library-feature-parity* gap, surfaced only by measuring against the competitor
libraries. W10 is the FOLD-E answer.

---

## § State, verified (not asserted)

The live facts, read- and grep-confirmed on `tranche-d-impl`, so the wave's
framing is honest. **The physics is solved; the adapters are missing:**

1. **No `stagger` symbol anywhere.** `grep -rln "stagger" src/` = empty;
   `setTargets(...targets: HTMLElement[])` (`engine.ts:906`) applies ONE animation
   to all targets **uniformly** — there is no index-based delay offset. The
   substrate for a stagger is the per-child `delay` that `AnimationGroup` already
   carries and that already flows to WAAPI: `toWAAPIOptions` emits
   `delay: opts.delay` (`waapi.ts:204`). So a stagger is a pure construction-time
   delay generator — `(i, total) => number` — composed with `AnimationGroup` /
   WAAPI `delay`. Zero per-frame cost.

2. **No sequence/timeline orchestrator — and the `Timeline` name is already
   taken.** `grep -rln "class Sequence\|class Storyboard" src/` = empty. The
   substrate exists: `AnimationGroup.advanceTo(t)` (`group.ts:360`) maps a master
   clock to children, and per-child `delay` offsets them. **But `Timeline` is
   already `export abstract class Timeline`** (`timeline.ts:36`) — the
   scroll/manual *progress driver* (`ScrollTimeline` / `ManualTimeline`), exported
   from the barrel (`index.ts`). A sequence orchestrator that reused the name
   would collide with a shipped public class. The name + the
   `AnimationGroup`-subsumption decision MUST be booked **before any code**.

3. **FLIP is manual-only — `ElementMorph` IS the Invert+Play half.** `ElementMorph`
   (`morph.ts:48`) is a clean rect→rect interpolator: the caller passes explicit
   `from`/`to` rects or elements, its `MorphRect` ctor reads
   `source.getBoundingClientRect()` (`morph.ts:34`), it computes `dx/dy/sx/sy` and
   `.play(element, duration?)` (`morph.ts:110`) emits a `translate()/scale()`
   transform. It is a **manual FLIP** — you supply First and Last. There is no
   automatic "measure → mutate → measure → invert+play" loop and no shared-element
   matching. The missing piece is a ~30-line composition, not new physics.

4. **Drag/inertia absent — but the closed-form velocity core is class-leading.**
   `SpringProgress` (`spring.ts`) tracks `currentVelocity` (declared `spring.ts:87`,
   updated `:302`), exposes it via `get velocity()` (`:143`) and the
   `subscribe(value, velocity)` surface, and **re-seats the closed-form solution
   from `(x, v)` on every `set target`** (`spring.ts:158` → `reseatTarget`, `:167`)
   so the trajectory is continuous across a live target change. This is **exactly**
   the substrate for gesture-follow + flick/inertia — the hard part (a continuous
   analytic trajectory seeded from current velocity) is solved. What's missing is
   the *input* layer (pointer capture + velocity sampling) and the *fling* wiring
   (release-velocity → spring re-seat / a `decay` model). The only new math is a
   one-line `decay(v0, k)` sibling of the solver.

5. **The spring surface is `(response, dampingFraction)`, not the modern
   time-based idiom.** `SpringProgressOptions` (`spring.ts:14`) takes the
   SwiftUI-canonical `response` (`:21`) + `dampingFraction` (`:27`); the defaults
   are `response: 0.5, dampingFraction: 0.86` (`:55-56`); the solver maps
   `ω₀ = 2π/response`, `ζ = dampingFraction` (`:125-126`). This is physics-correct
   but **not the mental model designers reach for** — Motion now *leads* its docs
   with the time-based surface (`duration` + `bounce` / `visualDuration`),
   treating stiffness/damping/mass as the advanced fallback.

6. **No single-call `animate()` front door.** `grep -rn "export function animate\|
   export const animate" src/` = empty. Every motion is the four-step lifecycle
   `new CSSKeyframesAnimation(opts)` → `.fromString(css)` (`engine.ts:997`) /
   `.fromKeyframes(...)` (`:965`) → `.setTargets(el)` (`:906`) → `.play()`. The
   whole field (`motion.animate`, `gsap.to`, anime.js v4 `animate`) leads with one
   declarative call returning a control handle. keyframes has no such front door.

7. **The four glass-ui `--spring-*` tokens are downstream consumers and must move
   zero pixels.** `--spring-smooth/snappy/bouncy/gentle` are defined in
   `node_modules/@mkbabb/glass-ui/dist/styles/tokens.css:158-161` and consumed in
   the demo (`demo/spring/springPresets.ts`, `style.css`, …). Any spring-surface
   addition is a *construction-time alternate constructor* — it does not touch the
   solver, the `linear()` sampler, or the existing `(response, dampingFraction)`
   callers, so these tokens are unchanged.

The wave's job: ship the thin construction-time adapters that close the
orchestration gap, **without** re-writing a line of the SOTA physics, the spring
solver, or the value.js boundary — each closed by a re-runnable instrument.

---

## § Goal

**What lands** (light-side, value.js-free helpers + one heavy-surface front door,
all purely additive — `proof:orchestration` + `proof:boundary` green):

- **`stagger(n | items, { each, from, ease })`** — a per-index delay generator
  `(i, total) => delay` that composes with `AnimationGroup` + WAAPI `delay`.
  Highest-ROI gap; pure construction-time, zero per-frame cost.
- **A sequence/timeline orchestrator** (a `Sequence`/`Storyboard` — **name +
  `AnimationGroup`-subsumption decision booked FIRST**) holding
  `{ animation, at: number | label | "+=rel" }` entries, mapping a master playhead
  → each child's local clock over `advanceTo`.
- **`flip(element, mutate, opts)` / `flipShared(a, b)`** over `ElementMorph` — a
  measure → mutate → measure → `ElementMorph(before, after).play()` composition,
  with batched `getBoundingClientRect` reads (one forced layout per side).
- **`drag` / `useDrag` + `decay(v0, k)`** — a pointer-capture + velocity-sampler
  adapter feeding the existing `SpringProgress` (set target on move, hand
  release-velocity to a re-seat). `decay` is the only new math (a one-line sibling
  of the solver; a richer closed form is the value.js hand-off VJ-1).
- **`SpringProgress.fromDuration({ duration | visualDuration, bounce })`** — a
  construction-time alternate constructor bringing the modern Motion idiom to the
  SOTA solver (`response = visualDuration`, `dampingFraction = 1 − bounce`
  clamped). Zero hot-path cost; the solver / `linear()` sampler / re-seat
  unchanged.
- **Spring-eased + taxonomy presets** — a handful of `spring*`-eased presets
  (using the in-house `springTimingFunction`) + an enter / exit / attention / loop
  grouping. Cheap; pairs with the F-1 stagger demo.
- **`animate(target, input, opts?)`** — the single-call declarative front door:
  a thin **heavy-surface** dispatcher over the three `from*` factories +
  `setTargets` + `play`, returning the animation as the control handle.

**Why:** this is the single largest competitive gap (`a-tranche-retro.md` §3.1),
and it is **leverage, not physics**: the spring velocity core, `ElementMorph`'s
Invert+Play, and `advanceTo`+`delay` are already SOTA — the adapters are thin and
construction-time. KISS: fold the warranted orchestration parity; do NOT re-write
the solver (ALREADY-SOTA — `r-interpolation.md` F-1/A-1) or re-open the `linear()`
round-trip (a MATCH — F-2). The release escalates to **MINOR** (observable new
public API) but stays minor not major — every item is additive, no break.

---

## § Scope

Each sub-move is independently isomorphic (purely additive) + unit-testable. The
light-side helpers (`stagger`/`flip`/`drag`/`decay`/presets/the spring adapter)
carry **zero static value.js edge** — the physics is keyframes-local (inv α). Only
`animate()` rides the existing heavy/async edge.

### S1 — `stagger(n | items, { each, from, ease })` — `r-anim-libs.md` F-1

**WHAT:** a new light-side `src/animation/stagger.ts` returning a per-index delay
function `(i, total) => number` (and/or the materialized delay array). `from`
selects the origin distribution — `'first' | 'center' | 'last' | 'edges' | index`;
`each` is the per-step delay; `ease` shapes the distribution. It composes with
`AnimationGroup` (assign each child the computed `delay`) and with WAAPI delegation
(`delay` already flows to `toWAAPIOptions`, `waapi.ts:204`).

**WHY:** stagger is table-stakes — anime.js v4's headline, Motion's `stagger()`,
GSAP's core tween option. It is the **highest-ROI** gap and the cheapest: a pure
construction-time delay generator, zero new hot-path cost. The CSS-native path
(`sibling-index()` on `animation-delay`, limited availability) belongs in the demo,
not the engine — keyframes drives JS objects too.

### S2 — Sequence / timeline orchestrator — `r-anim-libs.md` F-2 — **BOOK THE API + NAME FIRST**

**WHAT (booked design pass, THEN code):** a `Sequence` / `Storyboard` orchestrator
holding `{ animation, at: number | label | "+=rel" }` entries that maps a master
playhead → each child's local clock over `Animation.advanceTo(absoluteClock)`
(`group.ts:360`). It does NOT need WAAPI (sequences are inherently rAF-driven on
the main thread), but each *segment* can still delegate.

**The booked decision (the wave's FIRST task — code is blocked until recorded):**
1. **Resolve the `Timeline` name collision.** `Timeline` is already
   `export abstract class Timeline` (`timeline.ts:36`) — the scroll/manual
   *progress driver*, a shipped public export (`index.ts`). The sequence
   orchestrator MUST take a distinct name (`Sequence`? `Storyboard`?). Reusing
   `Timeline` would shadow a published class — forbidden.
2. **Decide whether it subsumes `AnimationGroup`.** Group = the parallel sequence
   at `at: 0`. Either the orchestrator generalizes the group (group becomes the
   `at: 0` special case) or it sits beside it. This is the single biggest
   competitive gap and warrants a deliberate surface — record the call before any
   construction.

**WHY:** GSAP's `Timeline` (absolute / relative `"+="`/`"-="` / labels) is the
genre's gold standard; Motion has `animateSequence`; anime.js v4's timeline
accepts `stagger()` as a position. This is THE orchestration primitive every
competitor leads with — it earns a deliberate API design, not a reflexive
construction. BOOKing the name + subsumption is the no-legacy discipline (do not
ship a name that collides with a shipped class).

### S3 — `flip(element, mutate, opts)` / `flipShared(a, b)` over `ElementMorph` — `r-anim-libs.md` F-3

**WHAT:** a ~30-line composition in (e.g.) `src/animation/flip.ts`:
`flip(element, mutate: () => void, opts)` measures the rect, runs `mutate()`,
measures again, builds an `ElementMorph(before, after)` (`morph.ts:48`) and
`.play()`s it (`morph.ts:110`). `flipShared(a, b)` is the same with two elements
(shared-element / `layoutId`-style). **Batch the two `getBoundingClientRect`
reads** — one forced layout per side (read-mutate-read), no layout thrash.

**WHY:** `ElementMorph` already IS the FLIP "Inverse+Play" half (`morph.ts:34` reads
the rect; `:110` plays the transform). Motion's `layout`/`layoutId` and GSAP's Flip
plugin auto-animate layout changes via transform — compositor-friendly, the
guide-cited advantage over View-Transitions (no screenshot; animate `transform`,
not `width/height`). This is **leverage of an existing asset, not new physics** —
and the spring twin (`springTimingFunction`) makes the FLIP springy for free.

### S4 — `drag` / `useDrag` + `decay(v0, k)` — `r-anim-libs.md` F-4

**WHAT:** a light-side `src/animation/drag.ts` — a pointer-capture + velocity-
sampler adapter that sets the `SpringProgress` target on `pointermove` and hands
the **release velocity** to a spring re-seat (the closed-form solution re-seats
from `(x, v)` at `spring.ts:158`/`:167`, with `currentVelocity` tracked at `:87`).
Plus the only new math: a pure `decay(v0, k)` frictional glide
(`x(t) = x0 + v0/k·(1 − e^{−kt})`) — a one-line sibling of the spring solver (an
optional `decay.ts`).

**WHY:** the hard part of inertia — a continuous analytic trajectory across a live
target change seeded from current velocity — is ALREADY solved and class-leading
in `SpringProgress`. What's missing is the *input* layer + the *fling* wiring, both
thin adapters over a solved core. The value.js-free boundary holds (no CSS parsing;
the physics is keyframes-local). A richer `decay` closed form + a generic
JS-easing→`linear()` sampler is the value.js hand-off **VJ-1** (`E-HANDOFF`) — but
`decay` ships locally today; the hand-off only lets it collapse to a thin caller
later (the engine does not grow a second math home).

### S5 — Spring `fromDuration` / `{ bounce, visualDuration }` adapter — `r-interpolation.md` F-1

**WHAT:** a **construction-time** alternate constructor
`SpringProgress.fromDuration({ duration | visualDuration, bounce })` (or accepting
those keys in `SpringProgressOptions`, normalized once at construction). Pure
parameter translation to the existing surface: `response = visualDuration`,
`dampingFraction = 1 − bounce` (clamped) — the documented Motion mapping. The
closed-form solver, the `linear()` sampler, and the live re-seat are **unchanged**.

**WHY:** `SpringProgress` takes `(response, dampingFraction)` (`spring.ts:14-27`) —
physics-correct but not the model designers reach for. Motion now leads its docs
with `duration` + `bounce` / `visualDuration`, treating stiffness/damping/mass as
the advanced fallback. The math is identical under the hood, so this is a thin
adapter — **zero hot-path cost** — that brings the modern idiom to the SOTA solver.
The existing `(response, dampingFraction)` callers and the four glass-ui
`--spring-*` tokens (`tokens.css:158-161`) move **zero pixels**. Small FOLD-E.

### S6 — Spring-eased + taxonomy presets — `r-anim-libs.md` F-8

**WHAT:** a handful of `spring*`-eased presets in `animations.ts` (using the
in-house `springTimingFunction` — `springTimingFunction.ts:65`) + an
enter / exit / attention / loop grouping over the existing preset library.

**WHY:** the preset library is solid but lacks the entrance/exit/loop taxonomy +
spring-eased presets the genre expects. Cheap, and it pairs naturally with the
S1 stagger demo (dogfood the orchestration tier together).

### S7 — `animate(target, input, opts?)` single-call front door — `a-kf-api-dx.md` D-4

**WHAT:** a thin **heavy-surface** dispatcher (it needs value.js — it constructs
`CSSKeyframesAnimation`) that branches on `input` shape — a CSS `@keyframes` string
→ `.fromString` (`engine.ts:997`); a keyframe map → `.fromKeyframes` (`:965`); a
vars array / `Vars`-pair → the vars factory — then auto-`setTargets`, auto-`play`,
and **returns the constructed animation as the control handle**. No new engine
logic — pure construction-time dispatch over the three `from*` factories +
`setTargets` + `play`.

**WHY:** the single-call front door is the DX baseline of the genre — `motion`'s
`animate(el, {opacity:[0,1]}, {duration})`, `gsap.to(target, vars)`, anime.js v4's
`animate(targets, params)` are the first thing every tutorial shows. keyframes
collapses the documented four-step into one. It composes with D-2's async sugar
(it is the async sugar's general form) and with D-1's preset reachability
(`animate(el, fadeIn())`). It rides the **existing** heavy/dynamic edge
(`loadAnimationEngine`) — it introduces **no new static value.js edge** (inv α).

---

## § Hard gate (falsifiable · re-runnable · MUST bite)

The wave closes when every clause VERIFIES. Each is a real unit test / grep /
boundary check that BITES on the exact lapse it guards (inv ε) — not an assertion.

### `proof:orchestration` — each primitive ships with a falsifiable unit test + a dogfood demo scene

1. **Stagger distribution (S1).** A unit test asserts the delay distribution for
   each `from` — `'first'` is monotone-increasing `i·each`; `'center'`/`'edges'`
   are symmetric about the origin; `'last'` is reversed; the `ease` reshapes the
   distribution. **BITE:** swap `from: 'first'` → `'center'` in the helper and the
   symmetric assert reds.
2. **Sequence playhead → child-clock mapping (S2).** A unit test asserts the
   master playhead maps to each child's local clock at **absolute** (`at: n`),
   **relative** (`at: "+="`/`"-="`), and **label** positions. **BITE:** offset one
   child's `at` and the mapped local clock at that segment reds. *Plus* a
   **design-record clause** — see clause 7.
3. **FLIP invert-correctness (S3).** A unit test on a known rect mutation asserts
   the inverted transform places the element at the *before* rect at t=0 and the
   *after* rect at t=1 (the FLIP identity). **BITE:** drop the `mutate()` call
   (before == after) → the transform must be identity; a non-identity reds.
4. **Drag release-velocity → spring continuity (S4).** A unit test hands a known
   release velocity to the `SpringProgress` re-seat and asserts the trajectory is
   `C⁰`/`C¹`-continuous (position + velocity match at the handoff) and that
   `decay(v0, k)` matches the closed form `x0 + v0/k·(1 − e^{−kt})` at sampled `t`.
   **BITE:** zero the handed velocity and the continuity assert (a discontinuous
   `v` at handoff) reds.
5. **Spring `fromDuration` mapping equivalence (S5).** A unit test asserts
   `SpringProgress.fromDuration({ visualDuration: d, bounce: b })` produces a solver
   whose sampled trajectory is **identical** to
   `new SpringProgress({ response: d, dampingFraction: 1 − b })` (the mapping is
   exact parameter translation; the existing callers move zero pixels). **BITE:**
   perturb the mapping (`dampingFraction = b` instead of `1 − b`) → the equivalence
   reds.
6. **Front door dispatch (S7).** A unit test asserts `animate(el, css)`,
   `animate(el, keyframeMap)`, and `animate(el, varsPair)` each construct the
   correct `from*` factory path, set the target, play, and return the animation as
   the control handle (it carries `.pause()`/`.play()`/`.finished`). **BITE:**
   feed a string and assert it routes to `fromString`, not `fromKeyframes` — a
   mis-dispatch reds.
7. **Dogfood scene per primitive.** Each shipped primitive carries a demo scene
   that exercises it (stagger grid, sequence storyboard, a FLIP layout toggle, a
   draggable with fling). **BITE:** a primitive with no exercising scene fails the
   wave (KISS: ship nothing un-dogfooded).

### `proof:boundary` — the light helpers carry zero static value.js edge

8. **The light-side helpers stay value.js-free.** `stagger.ts` / `flip.ts` /
   `drag.ts` / `decay.ts` / the spring adapter / the spring presets carry **no
   static `import ... from "@mkbabb/value.js"`** (the existing `proof:boundary`
   instrument greps the light barrel's static graph). The physics is
   keyframes-local. `animate()` is the ONLY new symbol on the heavy/dynamic edge —
   and it introduces **no new static edge** (it reaches the engine via the existing
   `loadAnimationEngine`). **BITE:** add a static value.js import to `stagger.ts`
   → `proof:boundary` reds (inv α).

### The booked-decision gate (F-2 / S2 specific)

9. **S2 ships no code until the API design is recorded.** The
   `proof:orchestration` clause for S2 (clause 2) additionally gates on the booked
   decision being **written down** before any sequence code: (a) the chosen name
   (NOT `Timeline` — the collision with `timeline.ts:36`'s shipped class), and (b)
   the `AnimationGroup`-subsumption call (group = `at: 0`, or beside). **BITE:**
   a sequence implementation present with no recorded name/subsumption decision
   reds (P-invariant: no un-booked surface).

### No-regression baseline

10. **`npm test` stays green; nothing existing moves.** The orchestration tier is
    purely additive — `proof:zero-alloc` (the group/standalone composite),
    `proof:engine-correctness` (W7), and the existing interpolation tests are
    **UNTOUCHED**. The no-regression baseline is the live `npm test` count at
    E.W10-open; the gate is **no-regression + the new orchestration tests pass**.
    **BITE:** any existing test regression reds.

---

## § Folds

Retires (by finding id), each verified above:

- **`r-anim-libs.md` F-1** (no stagger primitive) — S1 + `proof:orchestration`.1.
- **`r-anim-libs.md` F-2** (no sequence/timeline/labels) — S2 +
  `proof:orchestration`.2 + the booked-decision gate (clause 9).
- **`r-anim-libs.md` F-3** (FLIP manual-only) — S3 + `proof:orchestration`.3.
- **`r-anim-libs.md` F-4** (drag/inertia absent, physics core present) — S4 +
  `proof:orchestration`.4.
- **`r-anim-libs.md` F-8** (preset taxonomy + spring presets) — S6 + the dogfood
  scenes (`proof:orchestration`.7).
- **`r-interpolation.md` F-1** (spring `fromDuration` ergonomic adapter) — S5 +
  `proof:orchestration`.5.
- **`a-kf-api-dx.md` D-4** (no single-call `animate()` front door) — S7 +
  `proof:orchestration`.6.

**Routed OUTWARD / RECORDED (not this wave):**

- **`r-interpolation.md` F-3 — MotionPath / `offset-path` following — BOOK
  (two-track, refined).** Split into a **CSS-native track** (animate
  `offset-distance: 0%→100%` along an `offset-path` — WAAPI-eligible under the
  *existing* `waapi.ts` gate, rides the compositor incl. a spring `linear()` twin)
  + a **numeric track** (arc-length-sample an SVG `<path>` into `{x, y, angle}`
  keyframes fed to `NumericAnimation`). The only new math is the arc-length sampler
  — value-domain geometry, the value.js hand-off **VJ-2** (`E-HANDOFF`), NOT
  animation-loop logic. Lower priority than F-1..F-5; ship-trigger is a concrete
  demo/consumer story (a `demo/path/` scene). `ElementMorph` (straight-line) is
  unchanged — `MotionPath` is its curved sibling. **BOOK, not folded.**
- **`r-anim-libs.md` F-7 — View-Transitions interop *engine* helper —
  BOOK.** A `withViewTransition(domMutation, { fallback })` library helper
  (PRM-gated, feature-detected) is distinct from the demo's deliberate dogfood
  choice (E.W11 Theme 1). For *active-animation* cases, S3's FLIP is the better fit
  (transform, not screenshot). BOOK (engine); the demo VT story is E.W11.
- **The value.js hand-offs (`E-HANDOFF`, inv-16 — keyframes proposes, never
  writes value.js):** **VJ-1** (a canonical `decay`/inertia closed form + a generic
  `TimingFunction → linear()` sampler — the inverse of value.js's `cssLinear`, which
  would let `decay`/`springLinearStops` collapse to thin callers); **VJ-2** (the
  SVG/`offset-path` arc-length geometry sampler for F-3 MotionPath). Both are
  **optional enablers, not blockers** — S4's `decay` ships locally today; the
  hand-off only consolidates the math home later.

**ALREADY-SOTA here — the wave manufactures NO work in the solver or the
round-trip** (recorded so the augmentation does not invent physics work):

- **The analytic closed-form spring solver + the live mid-flight `(x,v)` re-seat**
  (`spring.ts` — second-order ODE solved in closed form, velocity-continuous
  re-seat, `O(machine-ε)` per frame vs Motion's numeric integrator). **LEADS** on
  solver quality + the re-seat (`r-interpolation.md` A-1, F-1). W10 *leverages* its
  velocity core for drag/inertia and *adds* the `fromDuration` ergonomic adapter —
  it does **NOT** re-write the solver.
- **The spring → CSS `linear()` twin** is a **MATCH** on the round-trip itself
  (corrected from a blanket LEAD: Motion ships `generateLinearEasing` too —
  `r-interpolation.md` F-2). The genuine LEAD narrows to **solver quality**
  (closed-form analytic, no integrator drift) + the **single-source `{fn, css}`
  pairing** + the **multi-segment guard** (`waapi.ts:80` refuses to delegate a
  spring `linear()` across 2+ keyframe stops because WAAPI restarts the curve per
  segment). The CSSWG standardized on `linear()` (declined WebKit `spring()`), so
  this is the modern path — **do not re-open it.**
- **`NumericAnimation`'s zero-alloc SoA core** is the *target* of W8's
  FrameCompiler transposition, not a W10 concern — recorded here only because the
  S4 numeric-track BOOK (MotionPath) would feed it.

---

## § Isomorphism

**Every item is purely additive — no existing pixel, behaviour, or boundary
moves.** New API only; the explicit four-step lifecycle (`new … →` `from* →`
`setTargets →` `play`) stays for power users. Specifically:

- **`stagger`/`flip`/`drag`/`decay`/the spring presets** are new light-side
  symbols — no existing symbol changes, no existing pixel renders differently.
- **`SpringProgress.fromDuration`** is an alternate constructor that normalizes to
  the *existing* `(response, dampingFraction)` surface at construction time — the
  existing constructor, the solver, the `linear()` sampler, the re-seat, and the
  four glass-ui `--spring-*` tokens (`tokens.css:158-161`) all move **zero pixels**
  (gate clause 5 asserts the trajectory equivalence).
- **The sequence orchestrator (S2)** leaves `AnimationGroup` semantics **unchanged**
  — it becomes the `at: 0` special case *only if* the booked design decides to
  unify; otherwise it sits beside the group, touching nothing.
- **`animate()`** is a new convenience front door over the existing `from*`
  factories + `setTargets` + `play` — construction-time dispatch, zero hot-path
  cost, returning the same animation the four-step lifecycle would. It rides the
  **existing** heavy/dynamic edge (`loadAnimationEngine`) — **no new static
  value.js edge** (inv α; gate clause 8).

The boundary (inv α) holds throughout: the orchestration helpers are value.js-free
because the physics is keyframes-local; only the `animate()` front door is
heavy-surface, and it adds no new static edge. `proof:boundary` stays green.

---

## § Design decisions

1. **Leverage the solved physics — do NOT re-write it.** RESOLVED + HONEST
   (inv ε): the hard parts — the closed-form spring solver, the velocity-continuous
   re-seat (`spring.ts:158`/`:167`), `ElementMorph`'s Invert+Play (`morph.ts:48`),
   the `advanceTo`+`delay` sequence substrate (`group.ts:360`, `waapi.ts:204`) — are
   ALREADY-SOTA (`r-interpolation.md` A-1/F-1; `a-tranche-retro.md` §3.1). The gap is
   purely the **thin construction-time adapters**. So every W10 item is an adapter
   over a solved core — `stagger` is a delay generator, `flip` is a ~30-line
   `ElementMorph` composition, `drag` is pointer-capture + a re-seat, `fromDuration`
   is parameter translation. Trade-off: it would be "more impressive" to ship a new
   physics engine — but that is anti-KISS (the physics is at the frontier) and
   anti-isomorphic (it would risk the SOTA solver). The honest move is the adapter.

2. **BOOK the sequence API + name BEFORE any code (the `Timeline` collision).**
   RESOLVED: `Timeline` is already a shipped public class (`timeline.ts:36`, the
   scroll/manual progress driver, exported from `index.ts`). A sequence orchestrator
   that reused the name would shadow a published export — forbidden by no-legacy.
   So S2's FIRST task is the booked decision: the distinct name (`Sequence`?
   `Storyboard`?) AND whether it subsumes `AnimationGroup` (group = the `at: 0`
   parallel sequence) or sits beside it. Code is gated on that record (gate
   clause 9). Trade-off: a design pass is slower than reflexive construction — but
   this is the single biggest competitive gap; a deliberate surface is warranted,
   and a colliding name is a latent maintenance hazard.

3. **The spring surface gains the modern idiom WITHOUT touching the solver.**
   RESOLVED: `fromDuration({ visualDuration, bounce })` is a *construction-time*
   alternate constructor — `response = visualDuration`, `dampingFraction = 1 − bounce`
   (clamped), the documented Motion mapping. Zero hot-path cost; the closed-form
   solver / `linear()` sampler / re-seat all unchanged; the existing
   `(response, dampingFraction)` callers and the four glass-ui `--spring-*` tokens
   move zero pixels (gate clause 5). Trade-off: two parameter surfaces is a small
   surface-area cost — but the SwiftUI `(response, dampingFraction)` is
   physics-correct (kept as the advanced fallback) and the time-based surface is the
   one designers reach for (the modern idiom). Both, cleanly mapped, is the
   idiomatic answer.

4. **`decay` ships locally now; the value.js hand-off consolidates it later.**
   RESOLVED: S4 needs one new closed form — `decay(v0, k) = x0 + v0/k·(1 − e^{−kt})`
   — a one-line sibling of the spring solver. It ships keyframes-local today (the
   light boundary holds; the physics is not value.js's). The richer closed form +
   a generic JS-easing→`linear()` sampler is the value.js hand-off **VJ-1**
   (`E-HANDOFF`) — proposed, never written (inv-16). Trade-off: a local `decay`
   risks a second math home — but VJ-1's whole point is that when value.js
   publishes the canonical form, `decay`/`springLinearStops` collapse to thin
   callers, so the local version is the bridge, not the permanent home.

5. **`animate()` is the front door; the four-step lifecycle stays for power
   users.** RESOLVED: the single-call `animate(target, input, opts?)` collapses the
   documented four-step into one and returns the control handle — the DX baseline
   of the genre. It is a thin dispatcher over the existing `from*` factories
   (`engine.ts:965`/`997`) + `setTargets` + `play` — no new engine logic, zero
   hot-path cost. It lives on the heavy/async surface (it constructs
   `CSSKeyframesAnimation`, which needs value.js) and rides the existing
   `loadAnimationEngine` edge — **no new static value.js edge** (inv α). The
   explicit lifecycle remains for power users. Trade-off: a convenience front door
   can mask the lifecycle — but it composes WITH the explicit API (it IS D-2's async
   sugar's general form), and the whole field leads with it; absence is the DX
   regression, not the front door.

6. **MINOR release, additive — not MAJOR.** RESOLVED: the orchestration tier ships
   **observable new public API** (`stagger`/`Sequence`/`flip`/`drag`/`animate`/the
   spring adapter + presets) → E escalates from minor/patch to **MINOR**. But every
   item is purely additive (no break, no removed surface, no changed semantics —
   `AnimationGroup` is unchanged unless S2 *opts* to unify), so it stays MINOR, not
   MAJOR. The changeset records the new API surface; the isomorphism note above is
   the proof nothing existing moved.
