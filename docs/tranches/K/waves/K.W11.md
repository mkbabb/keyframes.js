# K.W11 — THE PHYSICS (∥ W10 · file-disjoint · the axis-3 headline only kf's substrate can hold: a spring drives the weighted-blend layer crossfade)

- **Phase:** DEV — spec authored, awaits IMPL+auth · **Class:** SHIP-in-K (Band II · the FLAGSHIP
  demo moment; born-RED in the FRONTIER sense — NO spring-driven blend weight exists TODAY: in
  `AnimationGroup` a layer's `weight` is a STATIC config number: `group.ts:336` is `case
  "weighted":`, and the leaf lerps each numeric element by the CONSTANT `layer.weight`
  (`group.ts:355-359` — `existing[i].value = lerp(existing[i].value, incoming[i].value,
  layer.weight)`, `layer.weight` the third arg at `group.ts:356`); `weight` is a
  plain `number` (`constants.ts:202` `weight: number;`, default `1` `constants.ts:218`) set
  IMPERATIVELY via `setLayerConfig` (`group.ts:776`, `Object.assign(entry.layer, config)` at
  `group.ts:790`), so
  changing a layer's weight is a HARD CUT (the next frame blends at the new constant, no
  transition). The capability is genuinely absent: `grep -rn "weightSpring|transitionLayer|crossfade"
  src/` → **ZERO hits** (§State-verified). This is ONLY POSSIBLE on kf's substrate — GSAP/Motion/anime
  have NO weighted-layer-blend tier at all (`../../J/audit/sota-landscape.md §3` — "a compositor-style
  lerp-by-weight tier no mainstream JS library exposes"), so the SUBSTRATE for a physical
  layer-crossfade does not exist outside kf.) · **Scope (engine-internal, value.js-INDEPENDENT;
  the `group.ts` blend-WEIGHT tier — file-disjoint from W10's compiler AND from W7's blend-MODE
  leaf):** PHYS-C the spring-driven blend weight (a `SpringProgress` drives a layer's `weight`
  instead of a constant — the `transitionLayer`/`crossfade` API) + PHYS-B2 `reseatToSpring`
  (velocity-continuous interruption of a parsed-CSS animation, the only-kf seam) + PHYS-E
  intensity-scaled reduced-motion (the ONE PRM gate takes a scale, WCAG 2.3.3-aligned) + the
  `VectorSpring` S companion (sugar over N `SpringProgress` — OPTIONAL, light-barrel, droppable) +
  the `proof:spring-blend-weight` / `proof:reseat-velocity-continuous` / `proof:scaled-prm` gates
  (all born-RED in the frontier sense). It rides the K.W0/K.W1
  `scenePlaybackAdapters`/`sceneMachine` playback seam Band I rebuilds. ·
- **DAG-deps:** runs **∥ K.W10 (compile)** — file-disjoint (W11 the `group.ts` blend-WEIGHT tier;
  W10 a new compile module over the `format.ts` lineage — `K.md §WAVE MAP`: "K.W11 (physics) …
  engine-internal; rides the K.W0/K.W1 playback seam, file-disjoint from the compiler"). It is
  DISJOINT from W7's blend-MODE leaf too (W7 reads the per-keyframe COMPOSITION operator
  `add`/`accumulate`/`replace`; W11 drives the per-layer WEIGHT — both in `group.ts` but DISJOINT
  line concerns; §Hand-off). It RIDES the K.W0/K.W1 playback seam (the `scenePlaybackAdapters`/
  `sceneMachine` wiring Band I rebuilds — the flagship crossfade demo plays through the repaired
  cold-entry path; `K.md §frontier, un-blocked` row PHYSICS "rides the SAME `scenePlaybackAdapters`/
  `sceneMachine` seam K.W0/K.W1 rebuilds … and wants K's seam"). The value.js half is
  RIPE/none-needed: PHYS-C/B2/E are engine-internal (`group.ts`/`spring.ts`/`reduced-motion.ts`);
  NO value.js grammar gate — W11 carries NO acyclic-spine born-RED edge (un-blocked today,
  `K.md §frontier table` PHYSICS "UN-BLOCKED ✅ (and wants K's seam)").

## §Provenance (the frontier lane this wave consumes + the booked roots)

- **`../L-SEED.md §2 PHYS-C` — THE decisive frontier input (the §body→K.W11 map row).** The
  body-item map: "**PHYS-C / PHYS-B2 / PHYS-E** — SPRING-DRIVEN BLEND WEIGHT (§2) | the physical
  layer crossfade on the weighted-blend compositor + the riders | **K.W11** PHYSICS". The §2 body
  (`../L-SEED.md §2`): "PHYS-C — SPRING-DRIVEN BLEND WEIGHT — the only axis-3 headline: physical
  layer crossfades on the weighted-blend compositor (a spring drives the blend weight between
  animation layers). Only POSSIBLE on kf's substrate — no competitor has a weighted blend tier to
  drive. The flagship demo moment. Riders: PHYS-B2 `reseatToSpring` (velocity-continuous
  interruption of a PARSED-CSS animation — needs round-trip + spring algebra + linear() twin
  simultaneously, i.e. needs kf) and PHYS-E intensity-scaled reduced-motion (the ONE PRM gate takes
  a scale, not a boolean — net-new in the field, WCAG 2.3.3-aligned)."
- **`../../J/audit/frontier/physics-frontier.md §3,§2,§5` — the wave-ready engineering detail.** §3 (the
  K-HEADLINE-CANDIDATE — PHYS-C): "In `AnimationGroup`, a layer's `weight` is a STATIC config number
  (`group.ts:365` reads `layer.weight`; set imperatively via `setLayerConfig`, `group.ts:776-792`).
  The `weighted` blend arm lerps each numeric leaf toward the incoming value by that constant
  `weight` per frame (`group.ts:345-375`). Today, changing a layer's weight is a hard cut. … The
  frontier move: let a layer's `weight` be DRIVEN by a `SpringProgress` (or `decay`, or any
  `Tickable` stepper) instead of being a constant. A crossfade between two animation layers then
  follows a PHYSICAL trajectory — it can overshoot … inherits velocity if you re-target the
  crossfade mid-transition … This is physics fused with kf's single most unique axis … the literal
  definition of 'only kf could do this'. … The blend hot path is untouched — `group.ts:362-365`
  still lerps by `layer.weight`; the ONLY change is that `weight` becomes a READ of a stepper's
  current value … `layer.weightSpring?.value ?? layer.weight`. One nullish read." The product shape:
  "`group.transitionLayer(name, { weight: 1, spring: {...} })` springs a layer's blend weight from
  its current value to a new one; `group.crossfade(a, b, { spring })` springs `a` down while
  springing `b` up." MEASURE-FIRST gate: "a bench proving the `??`-read adds zero measurable cost to
  the `_grouped` blend hot path vs the constant-weight baseline (the gate is 'no regression on the
  200-cell LoAF group bench')." §2 (the K-CANDIDATE rider — PHYS-B2): "the KEYFRAME path
  (`Animation`/`interpFrames`) — the engine path carries `effectiveT` (the lane cited
  `engine.ts:1098` at the J-era audit; **re-verified against the K tree 2026-06-15 the getter is at
  `engine.ts:1122` `get effectiveT(): number`** — the §State-verified live anchor of record; the
  audit's 1098 is the original citation, 1122 is the K-tree truth) but NO
  velocity. … `reseatToSpring(animation, newTarget)` — at interruption, finite-difference the interp
  stream over the last frame … seed a `SpringProgress` per animated property with that velocity, and
  hand the spring's `linear()` twin BACK to the engine as the transition easing toward `newTarget`.
  … velocity-continuous interruption of an animation kf parsed from author CSS, re-served as a spring
  with a faithful CSS twin. … Only a CSS-source-of-truth engine with a spring algebra and a
  `linear()` emitter can do this." §5 (the K-CANDIDATE rider — PHYS-E): "`prefers-reduced-motion` →
  amplitude-scaled, not binary-off; kf's ONE `withReducedMotion` gate could take a scale. … NO
  library does it. … `withReducedMotion` (and the `respectReducedMotion` option on every
  stepper/engine surface) accepts not just `true|false` but an intensity ∈ [0,1] … At intensity 0.3,
  a spring keeps its trajectory shape but scales its amplitude (the displacement from rest) to 30%
  while preserving the full opacity/color animation … Because kf's spring is analytic, amplitude
  scaling is exact and free: scale `(originValue − targetValue)` by the intensity before
  `evaluateAt` (`spring.ts:342`)." The honest caveat: "the SCALE must come from the consumer's
  policy … not from the OS — kf provides the mechanism, the app provides the policy."
- **The K.W0/K.W1 seam (the playback wiring W11 rides).** `K.md §frontier, un-blocked` PHYSICS row:
  "rides the SAME `scenePlaybackAdapters`/`sceneMachine` seam K.W0/K.W1 rebuilds." The flagship
  crossfade demo plays through the repaired cold-entry path (K.W0's adapter-resume-made-total) — so
  the physics demo is honest ONLY on Band I's repaired playback seam (the crossfade plays from the
  cold hero CTA, the de-vacuoused B1 reads the engine's own blend-weight write, never decorative
  churn). This is the "rides after the repair" ordering of `K.md §WAVE MAP`.
- **The booked invariant roots:** `K.md §invariant set` — the **engine-write disambiguation rule**
  (the `proof:spring-blend-weight` gate reads the engine's own blend-weight write — the
  spring-driven `weight` value's effect on the composited leaf — never bare `getComputedStyle`
  churn) + the **acyclic-spine invariant** (W11 is value.js-INDEPENDENT; no OPEN gate, no born-RED
  edge — engine-internal). The ARCH kills brushed by NEITHER: PHYS-A coupled vector springs KILLED
  (`../L-SEED.md §5`); the analytic spring + reseat are SHIPPED (not re-litigated — the NEW seam is
  the BLEND-WEIGHT drive + the KEYFRAME-path reseat + the PRM scale).

## §The state, verified (file:line / grep / version anchors — every claim a command + its observed output, RE-RUN against the tree 2026-06-15)

**Tree/version pins (the substrate this born-RED stands on, re-verified 2026-06-15):**
`git rev-parse --abbrev-ref HEAD` → `tranche-k-dev`; `node -e "console.log(require('./package.json').version)"`
→ `4.2.0` (the J close tip); `node -e "console.log(require('./node_modules/@mkbabb/value.js/package.json').version)"`
→ `0.11.2` INSTALLED (0.12.0 published, K.W1 re-pins). **W11 needs NEITHER the installed 0.11.2
NOR the published 0.12.0 grammar** — every locus is engine-internal kf source (`group.ts`/`spring.ts`/
`engine.ts`/`reduced-motion.ts`); this is the strongest acyclic-spine statement a Band-II wave can
make (the value.js pin is immaterial to W11's GREEN).

- **PHYS-C: the blend weight is STATIC; no spring drives it (CONFIRMED against the tree,
  2026-06-15 — the born-RED root).** `group.ts:336` `case "weighted":`; the leaf lerps each numeric
  element by the CONSTANT `layer.weight` — the call OPENS at `group.ts:355` `existing[i].value =
  lerp(` with `layer.weight` the third arg at `group.ts:356` and the call CLOSING `group.ts:357-358`
  (the precise live range is `group.ts:355-359`), the non-numeric fallback `existing[i] =
  incoming[i]` at `group.ts:361` (the `else` arm — co-precise with W7's `:358-364` weighted
  citation). `weight` is a plain `number`: `constants.ts:202` `/** 0–1 for 'weighted' blend mode.
  Default: 1 */ weight: number;` on `AnimationLayerConfig` (`constants.ts:198`), default `weight: 1`
  (`constants.ts:218`). It is set imperatively: `setLayerConfig` (`group.ts:776`) does
  `Object.assign(entry.layer, config);` (`group.ts:790`) — a HARD CUT (the next frame blends at the
  new constant, no transition). **The group OWNS its rAF loop in managed mode** (`group.ts:74`
  `readonly playback = new RAFPlayback();`; the per-frame draw `group.ts:590`
  `this.playback.loop(this._boundFrame)`) — so the `weightSpring` stepper's per-frame advance has a
  loop to ride (no new rAF ownership). **The absence probe (copy-pasteable, re-run 2026-06-15):**
  ```
  $ grep -rn "weightSpring|transitionLayer|crossfade" src/   →  exit 1, ZERO hits (PHYS-C absent)
  ```
- **PHYS-B2: the interp stream carries NO velocity (CONFIRMED 2026-06-15 — the born-RED root).**
  ```
  $ grep -n "velocity" src/animation/engine.ts   →  exit 1, ZERO hits (no dx/dt in the engine)
  $ grep -rn "reseatToSpring" src/               →  exit 1, ZERO hits (the bridge is absent)
  ```
  `interpFrames` (`engine.ts:657`) is a pure positional lerp at `t`; `effectiveT` (`engine.ts:1122`
  `get effectiveT(): number`) the playhead scalar with no `dx/dt`. **The spring INGREDIENTS all
  exist** (so PHYS-B2 is composition, not new physics): `spring.ts:222` `get value()` /
  `spring.ts:226-227` `get velocity()` returns `currentVelocity` (the EXACT analytic derivative,
  assigned at `spring.ts:385` `this.currentVelocity = vRel;`); `spring.ts:407-412` `reset(value?,
  velocity?)` seeds the closed form at a given `(x, v)`; `spring.ts:241-247` `set target` →
  `reseatTarget` (`spring.ts:250-268`) re-seats from live `(originValue, originVelocity)`
  (`spring.ts:260` `this.originVelocity = this.currentVelocity;`); `springTimingFunction.ts:65`
  `springTimingFunction(...)` / `springLinearStops.ts:46` `springLinearStops(...)` emit the
  `linear()` twin. **The born-RED root is the bridge: no hook finite-differences the interp stream to
  seed a spring** — `interpFrames` produces position only.
- **PHYS-E: the ONE gate takes a BOOLEAN, not a scale (CONFIRMED 2026-06-15 — the born-RED root).**
  `internal/reduced-motion.ts:101-107` — `withReducedMotion<T>(respect: boolean | undefined, snap:
  () => T, run: () => T): T` → `:106` `return respect && prefersReducedMotion() ? snap() : run();` —
  a hard snap-or-run. Every play path passes a `boolean` `respectReducedMotion`: `spring.ts:46`
  `respectReducedMotion: boolean;`, `group.ts:59` `respectReducedMotion = false;`, `smooth.ts:30`,
  `numeric.ts:45`, and `engine.ts:513` `setRespectReducedMotion(respectReducedMotion:
  InputAnimationOptions["respectReducedMotion"])` whose body THROWS on a non-boolean
  (`engine.ts:520` `if (typeof respectReducedMotion !== "boolean")` → `AnimationOptionError`) —
  proving the type is binary today, not an intensity.
  ```
  $ grep -rn "intensity|amplitude|reducedMotionScale" src/animation/internal/reduced-motion.ts src/animation/spring.ts
        →  exit 1, ZERO hits (no scale lever today)
  ```
  The amplitude-scale lever is EXACT-and-FREE on the analytic spring: `evaluateAt`
  (`spring.ts:341-385`) computes `const x0 = this.originValue - this.targetValue;` (`spring.ts:342`)
  — the displacement from rest; scaling `x0` by an intensity scales peak displacement while the
  envelope (curve shape + settle time) is preserved by construction. The one-gate discipline ("the
  seven formerly hand-written snap bodies … collapse to per-surface one-liners",
  `reduced-motion.ts:95-99`) makes the scale a ONE-signature change.
- **The `VectorSpring` S companion is ABSENT (CONFIRMED 2026-06-15).**
  ```
  $ grep -rn "VectorSpring" src/   →  exit 1, ZERO hits
  ```
  The 2D composition is caller-owned today (`drag.ts:26-29`: "A 2-D drag composes two `Draggable`s
  … the engine stays one-dimensional, the caller owns the composition (KISS)"); `VectorSpring` is
  the optional sugar that owns the array of N `SpringProgress`.
- **value.js status (CONFIRMED — NONE needed; the acyclic edge that does NOT exist).** PHYS-C/B2/E
  and the `VectorSpring` are engine-internal / light-leaf (`group.ts`/`spring.ts`/`engine.ts`/
  `reduced-motion.ts`). No value.js grammar gate; the spring's `linear()` twin
  (`springLinearStops`/`springTimingFunction`) is SHIPPED kf-internal (PHYS-B2's clause-(c) handoff
  reuses it — it is NOT a value.js symbol, it is kf's own emitter). The spring/decay algebra is kf's
  PERMANENTLY (`L-SEED.md §7` — "Spring/decay math stays in kf PERMANENTLY"; the VJ-owns-spring-math
  hypothesis was researched-FALSE). W11 carries NO acyclic-spine born-RED edge and NO consume edge —
  it is, with K.W7, one of the two frontier waves un-blocked outright with no grammar dependency
  (`K.md §frontier table` PHYSICS "UN-BLOCKED ✅"). **The one composition that DOES touch the
  ratified-proposed value.js fold is INDIRECT:** clause (c)'s `linear()`-replay rider composes with
  K.W10, whose compile path's color leg consumes `sampleColorRamp` (the RATIFIED-PROPOSED N.W11.D
  producer, value.js's `docs/tranches/N/GRAMMAR-FOLD.md` PART I — the sibling-idiom citation,
  K.W9.md:110) — but that is W10's consume edge, not W11's; W11's `linear()` twin is kf-internal and
  RIPE (§Hand-off, §Design-decisions).

## §Goal

Make kf's PHYSICS ALGEBRA compose with its unique axes: **a spring drives the weighted-blend layer
crossfade — a layer transition follows a PHYSICAL trajectory that can overshoot and settle, the
flagship demo moment only kf's substrate can hold; a parsed-CSS animation interrupted mid-flight
re-seats to a velocity-continuous spring with a `linear()` twin; and the ONE reduced-motion gate
takes an intensity, so motion is amplitude-SCALED, not killed — WCAG-aligned, net-new in the
field.** kf is not "a library with springs" — it is a library with a physics ALGEBRA (analytic
spring, exact velocity, velocity-continuous re-seat, dual CSS twins, one PRM gate) no competitor
has assembled; the frontier is pointing that algebra at kf's unique axes. Three moves:

1. **PHYS-C — the spring-driven blend weight (S1 — the K-HEADLINE).** A layer's `weight` becomes a
   READ of a `SpringProgress` (or any `Tickable` stepper) instead of a constant:
   `layer.weightSpring?.value ?? layer.weight` (one nullish read; the blend hot path untouched).
   `group.transitionLayer(name, { weight, spring })` springs a layer's weight; `group.crossfade(a,
   b, { spring })` springs `a` down while springing `b` up — a physical crossfade that overshoots
   and settles. ONLY possible on kf's weighted-blend substrate.
2. **PHYS-B2 — `reseatToSpring` (S2 — the only-kf rider).** At interruption of a parsed-CSS
   animation, finite-difference the interp stream over the last frame (the one place a numerical
   derivative is correct — keyframes have no analytic velocity), seed a `SpringProgress` per
   property with that velocity, and hand the spring's `linear()` twin BACK to the engine as the
   transition toward `newTarget`. Velocity-continuous interruption of an animation kf PARSED from
   author CSS — needs round-trip + spring algebra + `linear()` twin simultaneously (i.e. needs kf).
3. **PHYS-E — intensity-scaled reduced-motion (S3 — the WCAG-aligned rider).** `withReducedMotion`
   accepts an intensity ∈ [0,1] (the amplitude scale): at intensity 0.3 a spring keeps its
   trajectory shape but scales its displacement-from-rest to 30% while preserving the full
   opacity/color animation (the WCAG-blessed "shorten the travel, keep the meaning"). The analytic
   spring makes amplitude scaling exact and free (scale `x0 = originValue − targetValue` at
   `spring.ts:342`); the ONE-gate discipline makes it a one-signature change. kf provides the
   MECHANISM (the gate takes a scale); the app provides the POLICY.

4. **`VectorSpring` — the S companion (S4 — OPTIONAL sugar).** A thin `VectorSpring` owning an array
   of `SpringProgress`, exposing `target: number[]` / `value: number[]` / `velocity: number[]`, with
   a constructor flag for independent-axes vs shared-PRESET (NOT shared-PHASE — the coupled form is
   the PHYS-A KILL). Pure sugar, zero new physics, value.js-free (LIGHT). It satisfies the square
   scene's 2D-spring want (`physics-frontier.md §1`) and is DROPPABLE — removable from the wave
   without touching PHYS-C/B2/E.

## §Scope

- **S1 — PHYS-C the spring-driven blend weight (the K-HEADLINE; engine-internal `group.ts`).**
  Locus: `group.ts:355-357` (the `weighted` blend leaf) reads `layer.weightSpring?.value ??
  layer.weight` (the ONE nullish read; the per-frame lerp untouched) + `AnimationLayerConfig`
  (`constants.ts:198` — an optional `weightSpring?: Tickable` field) + the
  `transitionLayer`/`crossfade` methods on `AnimationGroup` (beside `setLayerConfig`, `group.ts:776`);
  the group's managed rAF tick (it owns the loop in managed mode) advances the `weightSpring` stepper.
  The leaf change is EXACTLY:
  ```js
  // group.ts:355-357 — was: layer.weight   →   now: the stepper value when present
  const w = layer.weightSpring?.value ?? layer.weight;   // ONE nullish read
  existing[i].value = lerp(existing[i].value, incoming[i].value, w);
  ```
  The API: `group.transitionLayer(name, { weight, spring })` (constructs a `SpringProgress` seeded at
  the layer's CURRENT weight, targets the new weight, sets `layer.weightSpring`; on settle the spring
  clears and the read falls back to the now-updated `layer.weight`) + `group.crossfade(a, b, { spring
  })` (two `transitionLayer` calls — a→0, b→1). The `add`/`replace` modes get NOTHING (they're not
  weight-parametric) — this is purely the `weighted` tier becoming TEMPORAL and PHYSICAL. **WHY
  KISS-compatible (not bloat):** the blend hot path machinery is untouched (`group.ts:355-357` still
  lerps); the ONLY change is `weight` becoming a read of a stepper's current value — one nullish
  read; the stepper is a SHIPPED LIGHT primitive (`SpringProgress` implements `Tickable`); no new
  physics, no new hot-path alloc (the spring is one analytic eval per frame, already zero-alloc) —
  "the COMPOSITION of two things kf already owns" (`../../J/audit/frontier/physics-frontier.md §3`).
  **MEASURE-FIRST (the one perf risk):** the `??`-read in the `_grouped` blend hot path — a bench
  proving it adds zero measurable cost vs the constant-weight baseline (the gate is "no regression on
  the 200-cell LoAF group bench named in `../../J/audit/sota-landscape.md §5`"; the `_grouped`
  fast-properties / delete-free / zero-alloc per-frame path is PRESERVED). **NO-WORKAROUND:** NOT a
  new blend-mode pipeline (the existing `weighted` leaf is reused; the spring drives the SAME scalar
  `weight`); NOT a coupled vector spring (PHYS-A KILLED — `../L-SEED.md §5`; the layer weight is ONE
  scalar, one independent spring); NOT a silent degrade of the blend axis (the EPF-5 KILL — the
  crossfade is AUTHOR-DECLARED, never a quality-shed under load).
- **S2 — PHYS-B2 `reseatToSpring` (the only-kf rider; the KEYFRAME-path seam).** Locus: a
  finite-diff hook in `interpFrames`/`engine.ts` (the interruption EVENT, not the per-frame path) +
  the per-property spring seeding + the SHIPPED `linear()` handoff. At interruption:
  finite-difference the interp stream over the last frame (`(value(t) − value(t−dt)) / dt` — the
  one place a numerical derivative is CORRECT because keyframes have no analytic velocity), seed a
  `SpringProgress` per animated property with that velocity (reusing the SHIPPED `spring.ts:241 set
  target`/`reseatTarget`), and hand the spring's `linear()` twin (the SHIPPED `springTimingFunction`)
  to the engine as the transition easing toward `newTarget`. **WHY only kf:** velocity-continuous
  interruption of an animation kf PARSED from author CSS, re-served as a spring with a faithful CSS
  twin — needs round-trip + spring algebra + `linear()` emitter simultaneously; GSAP/anime can't (no
  spring/oklab/round-trip), Motion can't (it never parsed your `@keyframes`). **ARCH-kill
  distinction (named):** the spring easing is applied UNIFORMLY across the retargeting transition,
  NOT stored per-keyframe-per-property (NOT the per-property-easing kill); the velocity is a plain
  `number` finite-differenced from the existing `interpVars` lerp output (NOT Typed-OM). **MEASURE-
  FIRST:** a `bench/interruption.bench.ts` proving the finite-diff velocity probe adds ZERO
  steady-state cost (it runs at the interruption event, not per frame). **NO-WORKAROUND:** NOT
  re-proposing spring interruption (the `SpringProgress`/`Draggable` path is ALREADY shipped exactly
  — `../../J/audit/frontier/physics-frontier.md §2 (b1)` KILL; the NEW seam is the KEYFRAME path's
  finite-diff hook, not the stepper).
- **S3 — PHYS-E intensity-scaled reduced-motion (the WCAG-aligned rider; the ONE-gate widening).**
  Locus: `reduced-motion.ts:101 withReducedMotion` — the signature widens to accept an intensity
  (`boolean | number | { amplitude, duration, allowOpacity }` policy); the `respectReducedMotion`
  option on every stepper/engine surface widens to match; the amplitude multiply in `spring.ts:342
  evaluateAt` (scale `(originValue − targetValue)` by the intensity — the analytic form makes it
  exact and free, and the `linear()`/`springTimingFunction` twins inherit the scaling). At intensity
  0.3, a spring's peak displacement scales to 30% while the opacity/color track is untouched (the
  WCAG 2.3.3 distinction — reduce the vestibular large-scale movement, keep the meaning). **WHY
  on-brand (not bloat):** it rides the ONE-gate discipline kf already built (every play path routes
  through `withReducedMotion`); the perceptual axis is PRESERVED (the policy keeps oklab
  color/opacity while scaling transform amplitude); the analytic spring makes it a one-line multiply.
  "The rare accessibility feature that is also a physics-vocabulary feature." **The honest scope
  (named):** the SCALE comes from the CONSUMER's policy (a settings slider, a per-animation
  `reducedMotionIntensity`), NOT the OS (which exposes only a binary `prefers-reduced-motion`) — kf
  provides the MECHANISM, the app provides the POLICY. **NO-WORKAROUND:** NOT inventing an OS
  signal (kf makes its one gate expressive enough to honor a richer policy the app supplies); NOT a
  per-surface PRM retrofit (the ONE gate takes the scale — "a competitor with per-surface PRM checks
  would have to retrofit scaling in seven places; kf changes one signature").
- **S4 — `VectorSpring` (the S companion; OPTIONAL, light-barrel).** Locus: a NEW `VectorSpring` (a
  light leaf beside `spring.ts`, value.js-free) owning `SpringProgress[]`, exposing `target:
  number[]` / `value: number[]` / `velocity: number[]` / `tick`, with a constructor flag `{ shared?:
  SpringConfig }` for shared-PRESET (one `(response, ζ)` across axes) vs independent (per-axis
  config). **WHY sugar, not physics:** "zero new physics, zero new hot-path … N existing steppers"
  (`../../J/audit/frontier/physics-frontier.md §1`); shared-PRESET ≠ shared-PHASE (the coupled ODE is the
  PHYS-A KILL). **NO-WORKAROUND:** NOT a coupled/shared-phase vector spring (the PHYS-A KILL,
  `../L-SEED.md §5` — "a vector spring IS N independent per-component springs"); it is N independent
  `SpringProgress` instances behind one array-shaped facade. **DROPPABLE:** S4 is OPTIONAL — if the
  wave is scoped tight, `VectorSpring` rides a later S slot or the demo-helper tier; PHYS-C/B2/E are
  the wave's substance.

## §Hard gate (the proof:* that BITES — born-RED in the FRONTIER sense · the physics-on-the-axes oracle)

**The oracle (per the engine-write-disambiguation rule + the gate-ORACLE precept):**
`proof:spring-blend-weight` drives a layer crossfade with a spring and asserts the blend weight
follows the spring's PHYSICAL trajectory (overshoots and settles) — read on the engine's own
blend-weight write (the composited leaf's value as the spring drives `weight`), never decorative
churn. Born-RED in the FRONTIER sense: no spring-driven blend weight exists (the weight is a
constant — the §State-verified `group.ts:356 layer.weight`).

- **clause (a) — PHYS-C a spring-driven crossfade OVERSHOOTS and SETTLES (CORRECTNESS · the
  engine-write).** `group.crossfade(a, b, { spring })` with an under-damped spring: the layer
  weight (read on the composited leaf — the engine's own blend-weight effect) momentarily blends
  PAST 100% and settles back (the canonical iOS "snap into place" for a whole animation layer), NOT
  a hard cut. The assert reads the engine's blend write (the composited value attributable to the
  `weighted` leaf as `weight` springs), never bare `getComputedStyle` churn (the engine-write
  disambiguation rule). **BORN-RED WITNESS:** today `weight` is a constant (`group.ts:356`) → a
  weight change is a hard cut (the composited value steps, no overshoot) → the overshoot assert
  REDS. **BITE:** reds on the pre-cure tree (the hard cut); greens on S1 (the `weightSpring` read
  drives the physical trajectory). **NO escape:** the overshoot (weight > 1.0 mid-transition,
  settling to the target) is a property a constant-weight hard cut provably cannot produce.
- **clause (b) — the crossfade carries VELOCITY on re-target (CORRECTNESS).** Re-targeting the
  crossfade mid-transition (a second `crossfade` before the first settles) inherits the live
  velocity (the spring re-seats from `(x, v)` — the SHIPPED `reseatTarget`), so the weight does NOT
  kink. **BITE:** reds if a mid-transition re-target hard-cuts the weight (loses velocity). **NO
  escape:** the no-kink continuity is a property velocity-continuous re-seating produces and a
  restart-from-rest does not.
- **clause (c) — PHYS-B2 `reseatToSpring` interrupts a parsed-CSS animation velocity-continuously
  (`proof:reseat-velocity-continuous`; CORRECTNESS · the only-kf seam).** A `fromString` animation
  retargeted mid-flight leaves its prior position at the MEASURED velocity (the first
  post-interruption frames continue the prior direction/speed within ε — no visible kink) — the
  finite-diff velocity probe seeds the spring, the spring's `linear()` twin drives the transition;
  NOT from zero velocity. **BORN-RED WITNESS:** the engine path carries `effectiveT` but NO velocity
  today (`grep velocity engine.ts` = ZERO; `grep reseatToSpring src/` = ZERO) → a retarget restarts
  from zero velocity (the visible kink) → the no-kink assert REDS. **BITE:** reds on the pre-cure
  tree (the zero-velocity restart kink); greens on S2 (the finite-diff seed + `linear()` handoff).
  **NO escape:** the leave-velocity matching the measured pre-interruption velocity within ε is a
  property only the finite-diff seed produces — a zero-velocity restart provably fails.
  **REPLAY-EQUALITY RIDER (labeled HYGIENE — the round-trip composition):** the reseated spring's
  `linear()` twin (`springTimingFunction.ts:65`) is the SAME kf-internal emitter K.W10's compiler
  consumes; a corroborating assert — the reseat transition serializes to a `linear()` block that
  replays EQUAL (pixel-compared, the replay-equality invariant `K.md §invariant set`) to the JS
  spring handoff — declares the round-trippability, composing INTO W10's compile path rather than
  refusing it. **The acyclic-spine note (the ratified-proposed producer):** the `linear()` twin is
  kf's OWN emitter (RIPE, no value.js edge — it does not gate on any grammar publish); the value.js
  fold W10's compile path DOES ride — the RATIFIED-PROPOSED `sampleColorRamp` (N.W11.D) +
  `CSSTimelineOptions` (N.W11′) grammars, developed to executable depth in value.js's
  `docs/tranches/N/GRAMMAR-FOLD.md`
  (PART I / PART II, both → the 0.13.0 cut) — touches W10's COLOR/SCROLL legs, NOT W11's spring
  `linear()` twin. So clause (c)'s replay rider is GREEN-on-kf-substrate the moment S2 lands (no
  publish wait); it is W10's own `proof:compile-replay-equal` that born-RED-gates on the 0.13.0
  publish, and only on its color/scroll legs (CC-2 densify clause (d), the scroll round-trip), per
  the published-consume-edge cadence (value.js `docs/tranches/N/GRAMMAR-FOLD.md §I.3`/`§II.5` —
  born-RED kf-side, lights on the publish, NEVER a `file:` link or a vendored grammar; awaiting
  value.js's user ratification per `GRAMMAR-FOLD.md §dispatch-gate`). The wave's GREEN rests on the
  velocity-continuity correctness, not this rider — the rider is the receipt that W11's physics
  COMPOSES with W10's round-trip rather than forfeiting it.
- **clause (d) — PHYS-E the spring scales AMPLITUDE, not the curve, under reduced motion
  (`proof:scaled-prm`; CORRECTNESS · the WCAG assert).** At intensity `s`, a spring's PEAK
  displacement is `s ×` the full-intensity peak (analytic, assertable — `x0` scaled by `s`), the
  opacity/color track is UNTOUCHED (the perceptual axis-2 preserved), and the settle time is
  preserved (the envelope unchanged — the WCAG 2.3.3-aligned amplitude scale, not a binary kill).
  **BORN-RED WITNESS:** today `withReducedMotion(respect: boolean | undefined, …)` is BINARY
  (`reduced-motion.ts:102/106` — snap or run; `grep intensity reduced-motion.ts spring.ts` = ZERO)
  → an intensity 0.3 request either fully snaps (ZERO displacement) or fully runs → the "peak = 0.3
  × full" assert REDS. **BITE:** reds on the pre-cure tree (the binary gate); greens on S3 (the
  amplitude multiply at `spring.ts:342`). **NO escape:** the `s × peak` displacement is an analytic
  property assertable from the spring's closed form; the opacity-untouched + settle-preserved asserts
  are observable properties a binary kill (which zeroes displacement) provably violates.
- **clause (e) — the `??`-read does NOT regress the blend hot path (HYGIENE — labeled,
  MEASURE-FIRST).** The 200-cell LoAF group bench holds its baseline with the `weightSpring?.value
  ?? layer.weight` read vs the constant-weight baseline (the nullish read is free). *(Labeled
  HYGIENE — it corroborates that the spring-driven weight is zero-cost on the constant path; the
  wave's GREEN depends on the correctness clauses (a)-(d).)*

**The §spine bar — MUST bite.** Clauses (a)-(d) are the physics-on-the-axes correctness oracle: the
gate drives a real spring-driven crossfade over the BUILT `dist/keyframes.js`, reads the engine's
own blend-weight write (the overshoot, the velocity-carry — the engine-write channel, never
decorative churn), interrupts a parsed-CSS animation velocity-continuously (c), and scales the
spring amplitude under reduced motion (d). The born-RED is in the FRONTIER sense: the weight is a
constant today (the §State-verified `group.ts:356`), the engine path carries no velocity, the PRM
gate is binary — so the overshoot/velocity-carry/no-kink/amplitude-scale asserts red by
construction until the capability lands. **Two-tier taxonomy:** the wave's GREEN depends on the
correctness clauses (a)-(d); clause (e) is a HYGIENE corroborator (the hot-path bench may NEVER
substitute for a red correctness clause). **Engine-write-disambiguation posture (declared):** the
gate reads the engine's own blend-weight write (the composited leaf's value as `weight` springs),
never the `.idle-hover` bob or decorative churn — the rule carries into the frontier band exactly
as K.W0/K.W5. **The flagship demo rides Band I's repaired seam:** the crossfade plays through the
K.W0 adapter-resume-made-total cold-entry path (the demo is honest ONLY on the repaired playback
seam — the physics demo plays from the cold hero CTA, the de-vacuoused B1 reads the engine's blend
write). **Replay-equality posture (declared):** PHYS-C's spring-driven weighted blend is one of the
FOUR named CSS-domain refusals (`K.md §invariant set`: "weighted blend / custom renderers /
perceptual oklab / computed-unit drift") — so a spring-driven crossfade is HONESTLY REFUSED by the
K.W10 compiler with a named reason (CC-3), never silently approximated (the honest-refusal clause);
PHYS-B2's reseated spring IS round-trippable (its `linear()` twin is the SAME kf-internal emitter
K.W10 compiles — RIPE, no value.js edge), so the interrupt-and-reseat composes INTO the round-trip
rather than refusing it — clause (c)'s `linear()`-replay rider declares that composition (labeled
HYGIENE; the wave's GREEN rests on the physics-trajectory correctness, the replay-equality oracle is
the COMPOSING wave's, W10). The value.js grammars W10's compile path rides — the RATIFIED-PROPOSED
`sampleColorRamp` (N.W11.D) + `CSSTimelineOptions` (N.W11′), value.js's `docs/tranches/N/
GRAMMAR-FOLD.md` PART I/II → 0.13.0 — touch W10's color/scroll legs, NOT this spring twin; W11's
composition with W10 is therefore GREEN on kf's substrate the moment S2 lands, decoupled from the
0.13.0 publish (the publish gates W10's CC-2/scroll legs, never W11).
**P6 posture (declared):** the analytic asserts (a: the overshoot peak; b: the velocity continuity;
c: the leave-velocity; d: the `s × peak` amplitude) are device-INDEPENDENT computed facts → they
hard-gate on the Linux runner (the spring's closed form is deterministic; the composited weight
value is computable headless); the demo crossfade's VISUAL overshoot (the flagship moment) runs on
the headed chrome-devtools-mcp tier with a per-EXPECTED predicate (the leaf overshoot value), NOT a
fixed settle. **Budget 0** (the gate asserts POSITIVE product properties — the crossfade overshoots,
the reseat is velocity-continuous, the amplitude scales — not an error count; the pre-cure tree threw
NOTHING, it simply lacked the capability). **value.js gate status:** NONE — PHYS-C/B2/E are
engine-internal; W11 carries NO acyclic-spine born-RED edge and NO consume edge (un-blocked today —
`K.md §frontier table` PHYSICS "UN-BLOCKED ✅ (and wants K's seam)"). The ONLY value.js fold in
W11's neighbourhood is INDIRECT and RATIFIED-PROPOSED: the `sampleColorRamp`/`CSSTimelineOptions`
grammars (N.W11.D / N.W11′, the now-ratified-proposed producer in value.js's Tranche-N
`docs/tranches/N/GRAMMAR-FOLD.md` PART I/II, both cut at 0.13.0, awaiting value.js's ratification per
`GRAMMAR-FOLD.md §dispatch-gate`) gate K.W10's and K.W9's consume edges, NOT W11's — W11 references
them only to
declare that its `linear()`-twin composition (clause c) rides W10's RIPE kf-internal emitter, never
a value.js publish. Acyclic-spine posture: value.js → kf (grammar, consumed ONE tranche behind,
born-RED-gated kf-side); kf → glass-ui (spring); no back-edge; W11 adds no edge at all.

## §No-workaround prohibitions (BINDING — the mandate's named forbiddings for this wave)

- **NO new blend-mode pipeline (S1).** PHYS-C reuses the EXISTING `weighted` leaf
  (`group.ts:336/356`); the spring drives the SAME scalar `weight` via one nullish read
  (`layer.weightSpring?.value ?? layer.weight`). NOT a parallel blend pipeline (the blend hot path
  is untouched — the composition of two things kf already owns).
- **NO coupled vector spring (S1 — PHYS-A KILLED).** The layer weight is ONE scalar, one
  independent spring; the coupled/shared-phase vector spring is the KILLED physics-sim form
  (`../L-SEED.md §5` PHYS-A; `../../J/audit/frontier/physics-frontier.md §1`). The spec re-affirms the
  kill, it does not re-litigate it.
- **NO re-proposing spring interruption (S2 — the (b1) KILL).** The `SpringProgress`/`Draggable`
  velocity-continuous interruption is ALREADY shipped exactly (`spring.ts:241-268`,
  `drag.ts:256`); re-proposing it would be re-litigation. The NEW seam is the KEYFRAME path's
  finite-diff hook (PHYS-B2), not the stepper (`../../J/audit/frontier/physics-frontier.md §2`).
- **NO per-property-easing storage (S2).** The spring easing is applied UNIFORMLY across the
  retargeting transition (a transition BETWEEN two states, computed once at interruption), NOT
  stored per-keyframe-per-property (the per-property-easing ARCH kill). NOT Typed-OM (the velocity
  is a plain `number` finite-differenced from `interpVars` output).
- **NO inventing an OS signal (S3).** PHYS-E makes the ONE gate expressive enough to honor a richer
  POLICY the app supplies (a settings slider, a per-animation `reducedMotionIntensity`); the OS
  exposes only a binary `prefers-reduced-motion`. kf provides the MECHANISM (the gate takes a
  scale); the app provides the policy (`../../J/audit/frontier/physics-frontier.md §5` "the honest
  caveat"). NOT a per-surface PRM retrofit (the ONE gate takes the scale — one signature).
- **NO touching W7's blend-MODE leaf OR W10's compiler (the §Hand-off file seam).** W11 drives the
  per-layer WEIGHT (`group.ts` `layer.weight` → a spring); W7 reads the per-keyframe COMPOSITION
  operator (`group.ts:316-375` `add`/`accumulate`/`replace`); W10 is a NEW compile module over the
  `format.ts` lineage. W11 is file-disjoint from W10 (README §4B) and DISJOINT-line from W7 in
  `group.ts` — the boundary is a HARD CONTRACT (each gate reds only on its half).
- **NO `file:`/vendored value.js on the composing edge (the acyclic-spine prohibition, restated for
  THIS wave).** W11 itself carries NO value.js edge — but where its clause-(c) `linear()` replay
  composes INTO W10's round-trip (and where the doc names the N.W11.D/N.W11′ grammars W10/W9 ride),
  the prohibition is BINDING: those are PUBLISHED consumes (value.js publishes 0.13.0, kf re-pins
  ONE tranche behind, born-RED-gated kf-side), NEVER a `file:` link to value.js's WIP tree NEVER a
  vendored copy of `sampleColorRamp`/`CSSTimelineOptions` (`K.md §MANDATE`: "the frontier's value.js
  edges are PUBLISHED consumes, born-RED-gated kf-side, NEVER a `file:` link or a vendored copy").
  W11's own `linear()` twin is kf-INTERNAL (not a value.js symbol), so it never tempts the shortcut.
- **NO lossy emitter on the composing edge (the moat-is-faithfulness prohibition).** Where PHYS-B2's
  reseated spring compiles (clause (c)'s replay rider into W10), the compiled `linear()` block is the
  parser run BACKWARD over the SAME `(response, ζ)` spring model — the SHIPPED `springTimingFunction`
  emitter — NOT a re-derived lossy approximation (`K.md §MANDATE`: "the compiler is the round-trip's
  parser run BACKWARD over the same data model, NOT a re-derived lossy emitter"). The replay-equality
  rider PROVES the faithfulness (pixel-equal to the JS handoff); a lossy twin would forfeit it.

## §Folds (every K.md-assigned fold, with its frontier-lane + L-SEED citation)

- **PHYS-C** (the spring-driven blend weight — the K-HEADLINE) — S1. `../L-SEED.md §2 PHYS-C` + the
  §body→K.W11 map; `../../J/audit/frontier/physics-frontier.md §3` (K-HEADLINE-CANDIDATE, M);
  `group.ts:336` (`case "weighted":`) / `group.ts:356` (`layer.weight` the lerp third-arg) — the
  static-weight born-RED root; `SpringProgress` (the shipped `Tickable` stepper, `spring.ts:222 get
  value`).
- **PHYS-B2** (`reseatToSpring` — the only-kf rider) — S2. `../../J/audit/frontier/physics-frontier.md
  §2 (b2)` (K-CANDIDATE, M); `spring.ts:241-268` (the shipped reseat — `set target`→`reseatTarget`),
  `springTimingFunction.ts:65`/`springLinearStops.ts:46` (the shipped kf-internal `linear()` twin),
  `engine.ts:1122 get effectiveT` (the velocity-less interp path — the born-RED root for the
  finite-diff hook; `engine.ts:657 interpFrames` the positional lerp it probes).
- **PHYS-E** (intensity-scaled reduced-motion — the WCAG-aligned rider) — S3.
  `../../J/audit/frontier/physics-frontier.md §5` (K-CANDIDATE, M, "nobody does it, WCAG wants it");
  `reduced-motion.ts:101-106` (the ONE binary gate the scale widens), `spring.ts:342 evaluateAt`
  (the amplitude multiply).
- **`VectorSpring` (the S companion)** — S4 (the array facade over N `SpringProgress`, the
  shared-PRESET constructor flag). `../../J/audit/frontier/physics-frontier.md §1 (a)` (the PHYS-A coupled
  form KILLED — `../L-SEED.md §5`; the trivial independent form J-FOLD'd as "a light-barrel
  convenience"), `drag.ts:28-30` (the caller-owned 2D composition today). **OPTIONAL — rides as an S
  companion, droppable from the wave without touching PHYS-C/B2/E** (the coupled/shared-phase form
  stays KILLED, non-re-litigable).
- **snapDecay / PHYS-D** — CONSUMED-BY K.W9's scroll snap (`../../J/audit/frontier/physics-frontier.md
  §4` "the snap PRIMITIVE is a J-FOLD-sized composition the scroll lane CONSUMES"); the K-weight
  lives in K.W9, NOT here.

## §Hand-off (the BINDING file-ownership boundary — §4B of the README, restated)

W11 runs ∥ W10, rides the K.W0/K.W1 seam. Its loci (`waves/README.md §4B`):

- **`group.ts` blend-WEIGHT tier is W11's alone.** PHYS-C drives `layer.weight` via a spring at the
  lerp third-arg (`group.ts:356` → `layer.weightSpring?.value ?? layer.weight`); the
  `transitionLayer`/`crossfade` API is NET-NEW on `AnimationGroup` (beside `setLayerConfig`,
  `group.ts:776`). **W11 is file-disjoint from the W10 compiler — RECIPROCALLY DECLARED:** `K.W10.md
  §Hand-off` states verbatim "`group.ts` is W11's alone … W11 and W10 run in parallel WITHOUT
  touching each other's files" (README §4B); the compiler READS `group.ts`'s `BlendMode`/layering as
  DATA, it does not EDIT `group.ts`. The boundary is binding in BOTH docs.
- **`group.ts` blend-MODE leaf is W7's; blend-WEIGHT tier is W11's — RECIPROCALLY DECLARED.** W7
  reads the per-keyframe COMPOSITION operator into the blend switch (`group.ts:316-368` — the `add`
  arm's numeric leaf at `group.ts:325-328`, the `weighted` arm at `group.ts:336-367`); W11 reads the
  per-layer WEIGHT into a spring at the SAME `weighted` arm's lerp third-arg (`group.ts:356`) and the
  non-numeric fallback at `group.ts:361`. `K.W7.md §Hand-off` reciprocates verbatim ("`group.ts`
  blend-WEIGHT tier vs W7's `group.ts` blend-MODE leaf"; W7's `:358-364` weighted citation is
  line-precise with W11's `:355-361`). File-adjacent in `group.ts`, DISJOINT line concerns — the
  boundary is a HARD CONTRACT (each wave's §Hard gate reds only on its half; they land as separable
  `group.ts` commits — W11 the weight-spring read, W7 the composition read).
- **PHYS-B2's finite-diff hook lives in `interpFrames`/`engine.ts` — the INTERRUPTION event, NOT
  the per-frame path.** It does NOT edit W7's `animation-composition` read (a different concern in
  `engine.ts` — the interruption velocity probe vs the composition read). If both touch `engine.ts`,
  they land as separable commits (W11 the finite-diff hook, W7 the composition read), each gate
  reding only on its half.
- **PHYS-E widens `reduced-motion.ts` — a single-signature change, no co-edit.** The ONE gate takes
  the scale; no other wave touches `reduced-motion.ts`.
- **W11 rides the K.W0/K.W1 playback seam — it does NOT rebuild it.** The flagship crossfade demo
  plays through the K.W0 adapter-resume-made-total cold-entry path (the seam Band I rebuilds); W11
  CONSUMES the repaired seam, it does not re-author `scenePlaybackAdapters`/`sceneMachine`.
- **No value.js consume edge.** PHYS-C/B2/E are engine-internal; W11 carries no acyclic-spine
  born-RED edge (un-blocked today).

## §Design-decisions (the named calls this spec makes, so the impl does not re-litigate)

- **PHYS-C is the lane's strongest finding — the spring fused with the weighted-blend axis.** It is
  the literal "only kf could do this": GSAP/Motion/anime have NO weighted-blend tier to drive, so
  the SUBSTRATE for a physical layer-crossfade does not exist outside kf
  (`../../J/audit/frontier/physics-frontier.md §3`). It is the COMPOSITION of two things kf already owns
  (the unique axis + the spring algebra), not new physics — one nullish read.
- **PHYS-B2 is on the KEYFRAME path, NOT the stepper path.** The stepper-path interruption is
  ALREADY shipped exactly (re-proposing it is the (b1) KILL); the NEW seam is the finite-diff
  velocity probe on `interpFrames` — "the one place a numerical derivative is correct because
  keyframes have no analytic velocity" — and the `linear()` handoff (`../../J/audit/frontier/physics-frontier.md
  §2`). **It COMPOSES with W8 + W10 (reciprocal, named):** the interrupted animation is the
  PARSED-CSS source K.W8 ingests/reconstructs (`fromString`/`fromStyleSheets` — the only-kf seam
  needs the round-trip source K.W8 owns); the reseated spring's `linear()` twin
  (`springTimingFunction.ts:65`) is K.W10-EMITTABLE (the reseat transition compiles into the
  round-trip — clause (c)'s replay rider). **The acyclic distinction:** that `linear()` emitter is
  kf-INTERNAL and RIPE (no value.js publish gates it); the value.js grammars W10's compile path
  rides — `sampleColorRamp`/`CSSTimelineOptions`, the RATIFIED-PROPOSED N.W11.D/N.W11′ producer
  (value.js's `docs/tranches/N/GRAMMAR-FOLD.md` PART I/II, both → 0.13.0, awaiting value.js's
  ratification per `§dispatch-gate`) — touch W10's color/scroll legs, never the spring twin. W11
  NAMES these compositions; it does NOT author the ingest (W8), the compiler (W10), or any value.js
  grammar.
- **PHYS-E is a MECHANISM K, not a headline.** kf provides the gate-takes-a-scale; the app provides
  the policy (the OS exposes only a binary signal). The value is net-new in the field (nobody
  scales intensity) and WCAG-aligned, but it rides the one-gate discipline as a one-signature
  widening (`../../J/audit/frontier/physics-frontier.md §5`).
- **W11 rides the Band-I repaired seam — the physics demo is honest ONLY on K.W0's cured cold
  path.** The flagship crossfade plays from the cold hero CTA (K.W0's adapter-resume-made-total),
  the de-vacuoused B1 (K.W0/K.W5) reads the engine's own blend-weight write. This is the
  "Band II rides the honest substrate Band I leaves behind" ordering (`K.md §WAVE MAP`).
- **W11 is file-disjoint from W10, DISJOINT-line from W7.** The blend-WEIGHT tier (W11) vs the
  blend-MODE leaf (W7) vs the compiler (W10) are three distinct concerns; the parallel-wave
  boundary is BINDING (README §4B). The impl lands W11's `group.ts` weight changes as commits
  separable from W7's `group.ts` composition reads.
