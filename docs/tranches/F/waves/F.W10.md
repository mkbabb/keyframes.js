# F.W10 — Dogfood the orchestration tier (the inv-ζ analogue: swap the hand-rolled decay, add a Sequence+stagger scene)

**Phase:** IMPL · **Class:** PATCH+demo (the demo — a behaviour-equivalent decay swap +
one additive demo scene; the library is UNTOUCHED) · **Scope:**
`demo/@/components/custom/orbital-drag/composables/useOrbitalInertia.ts` (the hand-rolled
decay) + a new `demo/` scene exercising `Sequence`+`stagger` — Band 3, the
orchestration-dogfood · **DAG: F10 depends on F9** (the `Sequence` transport — the scene
should drive a complete transport) **and the demo band** (it lands a demo scene that should
respect F16's promoted rail/ball idiom, `F.md §The DAG`) · **Gated on:**
keyframes' own green CI (inv-27); `proof:dogfood` exercises the new scene.

**Title.** *The E.W10 tier shipped as public API but is UNDOGFOODED — `decay`/`Draggable`/
`Sequence`/`stagger`/`flip` have zero demo callsites, and the flagship demo hand-rolls the
exact `Math.pow` decay the engine now exports as a closed form. The proof IS the demo.*

This is the inv-ζ dogfood discipline reaching the orchestration tier (`F.md
§invariant set` — inv ζ EXTEND). inv-ζ (the shop-window runs on its own engine — no
hand-rolled rAF) is green; the *orchestration* analogue is not: `useOrbitalInertia.ts:62`
computes frictional inertia as `Math.pow(inertiaFactor, dt / TARGET_DT)` — the discrete
Euler form of EXACTLY the `decay()` closed form the engine now owns analytically
(`decay.ts:9`). A library that ships `decay`/`Draggable` as public API while its own
flagship demo hand-rolls worse versions of both has not *proven* the API. The proof is the
demo dogfooding the tier.

**The Mandate spine (binding — `F.md §Mandate`).** NO quick solution / NO
workaround: swap the hand-rolled `Math.pow` decay to the engine's analytic `decay()` — the
genuine dogfood, NOT a parallel "demo-local helper" that re-wraps it. NO legacy: the
hand-rolled discrete decay is REPLACED in one motion, not left beside the analytic form.
Measure-first BINDS on the felt-equivalence: the analytic `decay()` is the continuous limit
of the discrete `Math.pow` form — the swap must be felt-PIXEL-equivalent within epsilon,
proven by a parity test (NOT asserted). Isomorphic-RESTORING: the analytic form is the
continuous limit, so the swap is felt-identical (no frame-rate drift — strictly more
correct); the new scene is purely additive. inv ε: every claim cites `file:line`.

**Provenance.** `r-anim-libs-2026 F26-3` (the orchestration tier shipped but UNDOGFOODED;
the demo hand-rolls the physics the engine now exports — SHIP-in-F dogfood, parity-gated).

---

## § State, verified (not asserted)

The live facts, read- and grep-confirmed on `tranche-e-impl`:

1. **The E.W10 tier has ZERO demo callsites.** `r-anim-libs-2026 F26-3` (re-grounded): a
   grep `\bstagger\b|\bflip\b|flipShared|\bDraggable\b|\bdrag\(|\bdecay\b|new Sequence` over
   `demo/**` (non-dist) finds only UNRELATED local identifiers — `useSpringDemo.ts:176`
   "Flip the target" (a comment), `EasingCurveCanvas.vue` "draggable handles" (SVG control
   points), and `useOrbitalInertia.ts`'s OWN local `const decay`. The shipped public API
   (`stagger`/`flip`/`flipShared`/`drag`/`Draggable`/`decay`/`Sequence`) is exercised by no
   first-party consumer.

2. **The demo hand-rolls the exact closed form the engine exports.**
   `useOrbitalInertia.ts:62` (verified): `const decay = Math.pow(inertiaFactor, dt /
   TARGET_DT);` (with `TARGET_DT = 1000 / 60`, `:51`) and multiplies velocity by it each
   frame — `angularVelocitySpeed.value *= decay` (`:67`) and `v * decay` (`:82`). That is a
   discrete exponential decay — the per-frame Euler form of the `decay.ts:9` analytic closed
   form `x(t) = x0 + (v0/k)·(1 − e^(−k·t))` with velocity `v(t) = v0·e^(−k·t)` (verified
   `decay.ts:9-11,49-50`). The comment `useOrbitalInertia.ts:57-58` even names the goal —
   "inertia feels identical at 30, 60, or 120fps" — which is precisely what the analytic
   form delivers WITHOUT a per-frame `Math.pow` (the closed form is frame-rate-exact by
   construction, no Euler drift).

3. **The engine owns the analytic form, light-side.** `decay(v0, k, …)` (`decay.ts:59`)
   returns the `DecaySample` (`:35`) — `x(t) = x0 + v0/k·(1 − e^(−k·t))` (`:36`), `v(t) =
   v0·e^(−k·t)` (`:38`) — and `decay.ts:17` notes it hands off to value.js VJ-1 and
   collapses to a thin caller when value.js publishes the canonical form (the local form is
   the bridge). `Draggable` (`drag.ts`) provides `estimateVelocity` (the windowed
   pointer-velocity sampler the orbital drag also hand-rolls, `r-anim-libs-2026 F26-3`).
   These are light-side (the `proof:dogfood`/`proof:boundary` surface).

4. **`Sequence`+`stagger` have no demo scene.** Per State 1, `Sequence` and `stagger` are
   un-exercised. The cube demo proves `AnimationGroup`; there is no scene proving the
   temporal orchestrator (`Sequence`) the way the cube proves the compositor
   (`r-anim-libs-2026 F26-3`).

The wave's job: swap `useOrbitalInertia`'s hand-rolled `Math.pow` decay to the engine's
analytic `decay()` (parity-gated felt-equivalence) and add a `Sequence`+`stagger` demo
scene — the proof of the tier IS the demo, gated by `proof:dogfood`.

---

## § Goal

**What lands** (a parity-gated decay swap + one additive demo scene; the library
UNTOUCHED):
- **`useOrbitalInertia` consumes the engine's `decay()`.** Replace the hand-rolled
  `Math.pow(inertiaFactor, dt / TARGET_DT)` per-frame decay (`useOrbitalInertia.ts:62`)
  with the analytic `decay()` (`decay.ts:59`) — the frictional glide seeded from the
  release velocity, frame-rate-exact by construction (no Euler drift). Where the gesture is
  1-D, route the orbital release-velocity through `Draggable`'s `estimateVelocity`
  (`drag.ts`) rather than the hand-rolled pointer-velocity sampling.
- **A `Sequence`+`stagger` demo scene** — a new `demo/` scene that builds a `Sequence` of
  staggered child animations (the `stagger` delay distribution feeding the `Sequence`
  position-insertion), exercising the F9-completed transport (play/pause/reverse/progress)
  the way the cube demo exercises `AnimationGroup`. It respects F16's promoted rail/ball
  idiom (Band 5 — the `progress-rail`/`progress-ball` pair, `F.md §The DAG`
  cross-band coupling).
- **`proof:dogfood` orchestration clauses** — the existing `proof:dogfood` (inv ζ — the
  shop-window runs on its own engine, `scripts/proof-dogfood.mjs:40`) EXTENDED to assert
  the orchestration tier is consumed: `useOrbitalInertia` imports the engine's `decay`
  (not a hand-rolled `Math.pow` decay), and the new scene imports `Sequence`+`stagger`.
- **The inertia-parity test** — the `decay()` swap is behaviour-equivalent to the
  hand-rolled `Math.pow` form within epsilon (the felt-inertia is pixel-equivalent), proven
  not asserted.

**Why:** the E.W10 tier shipped as the highest-profile new public API but is UNDOGFOODED,
and the flagship demo hand-rolls worse versions of `decay` and pointer-velocity sampling
(`r-anim-libs-2026 F26-3`). This is not a competitor-feature gap — it is a credibility/proof
gap: a library that ships `decay`/`Draggable` while its own demo hand-rolls them has not
proven the API. inv-ζ's discipline (the engine consumes its own `RAFPlayback`,
`scripts/proof-dogfood.mjs:40`) reaches the orchestration tier here. The proof IS the demo.

---

## § Scope

### S1 — Swap `useOrbitalInertia` to the engine's analytic `decay()` (`r-anim-libs-2026 F26-3`) — SHIP-in-F (dogfood), parity-gated

**WHAT:** replace the per-frame `const decay = Math.pow(inertiaFactor, dt / TARGET_DT)`
(`useOrbitalInertia.ts:62`) and the velocity multiplies (`:67`, `:82`) with the engine's
analytic `decay()` (`decay.ts:59`): seed the frictional glide from the current
angular/linear velocity, sample the analytic `v(t) = v0·e^(−k·t)` (the friction constant
`k` derived from `inertiaFactor` so the felt decay-rate matches), and update the model from
the analytic position/velocity. The `decay` import comes from the engine's light surface
(the orchestration tier is value.js-free, `decay.ts`). The hand-rolled discrete form is
REMOVED (no-legacy — not left beside the analytic form).

**WHY:** the `Math.pow(inertiaFactor, dt / TARGET_DT)` form IS the discrete Euler form of
the `decay.ts:9` analytic closed form (`r-anim-libs-2026 F26-3`); the engine now owns the
analytic version (frame-rate-exact, no Euler drift, an exact `decayRest` projected
endpoint). The demo's own comment names the goal the analytic form delivers natively
(`useOrbitalInertia.ts:57-58` "feels identical at 30, 60, or 120fps"). Dogfooding the
analytic form is the genuine swap; it is isomorphism-RESTORING (the continuous limit of the
discrete one) — proven felt-equivalent by the parity test, not asserted.

### S2 — Route the orbital release-velocity through `Draggable`'s sampler where 1-D (`r-anim-libs-2026 F26-3`) — SHIP-in-F (dogfood)

**WHAT:** where the orbital gesture reduces to a 1-D release (the angular fling), route the
release-velocity estimation through `Draggable`'s `estimateVelocity` (`drag.ts`, the
windowed pointer-velocity sampler) rather than the hand-rolled sampling in
`useOrbitalInertia`. (The full 3-D quaternion drag stays orbital-specific — `Draggable` is
the 1-D fling sampler; the dogfood is to consume it where the shape matches, NOT to force
the 3-D gesture through a 1-D primitive — the Mandate's no-workaround.)

**WHY:** `Draggable` ships `estimateVelocity` as a tested primitive (`drag.ts`); the orbital
drag hand-rolls pointer-velocity sampling (`r-anim-libs-2026 F26-3`). Consuming the tested
primitive where the gesture shape matches is the dogfood; the 3-D quaternion path is
genuinely orbital-specific and is NOT contorted to fit a 1-D primitive (that would be the
workaround the Mandate forbids).

### S3 — A `Sequence`+`stagger` demo scene (`r-anim-libs-2026 F26-3`) — SHIP-in-F (dogfood)

**WHAT:** add a new `demo/` scene (a staggered storyboard) that builds a `Sequence` of
child animations whose start positions are distributed by `stagger` (the `(i, total) →
delay` generator feeding the `Sequence` `at:` positions), and drives it through the F9
transport (play/pause/reverse/progress). The scene exercises the temporal orchestrator the
way the cube demo exercises the compositor. It uses F16's promoted `progress-rail`/
`progress-ball` idiom for its scrub UI (Band 5 cross-coupling, `F.md §The DAG`)
and must not reintroduce a dock-over-content occlusion (inv δ — the HARD gate,
`F.md §invariant set`).

**WHY:** `Sequence`+`stagger` have no demo scene (State 4); the cube proves
`AnimationGroup` but nothing proves the temporal orchestrator. The new scene is the dogfood
proof of `Sequence`+`stagger` AND the consumer that exercises F9's completed transport
(play/pause/reverse/progress) end-to-end. Purely additive — no existing scene moves.

---

## § Hard gate (falsifiable · re-runnable · MUST bite)

The wave closes when every clause VERIFIES (each BITES — a real test/grep, not an
assertion):

1. **Inertia-parity — the `decay()` swap is felt-equivalent within epsilon (S1).** A test
   seeds a known release velocity and asserts the analytic `decay()` trajectory matches the
   hand-rolled `Math.pow(inertiaFactor, dt/TARGET_DT)` discrete form (sampled at the same
   `t`) within epsilon at 60 fps, AND that the analytic form is frame-rate-INVARIANT (the
   trajectory at 30 fps and 120 fps converges to the same endpoint — the property the
   discrete form only approximates). **BITE:** zero the seeded velocity → the continuity
   assert reds; OR perturb the `k`-from-`inertiaFactor` mapping → the 60 fps epsilon-match
   reds. This is the MEASURE-FIRST felt-equivalence gate.

2. **`proof:dogfood` orchestration clause — the tier is consumed (S1/S2/S3).** The extended
   `proof:dogfood` asserts `useOrbitalInertia.ts` imports the engine's `decay` (and does NOT
   contain a hand-rolled `Math.pow(... , .../TARGET_DT)` decay), and the new scene imports
   `Sequence`+`stagger` from the engine. **BITE:** re-introduce the hand-rolled `Math.pow`
   decay in `useOrbitalInertia` → the `proof:dogfood` orchestration clause reds (the
   hand-roll is back, the tier is un-consumed). A primitive with no exercising scene fails
   (KISS: ship nothing un-dogfooded — the E.W10 `proof:orchestration`.7 idiom).

3. **The new scene exercises F9's transport (S3).** A test/scene-smoke asserts the
   `Sequence`+`stagger` scene drives `play`/`pause`/`reverse`/`progress` (the F9-completed
   transport) — not just `play`/`stop`. **BITE:** a scene that only `play`/`stop`s (the
   pre-F9 one-shot scrubber) fails the transport-exercise clause.

4. **No-regression + inv δ — the library is untouched, no dock occlusion.** `npm test`
   stays green (the library is UNTOUCHED — this wave edits only `demo/`); the existing demo
   scenes move zero pixels; the new scene introduces NO dock-over-content overlap (inv δ —
   the HARD gate, `F.md §invariant set`). **BITE:** a library source edit
   (out-of-scope) OR a dock occlusion in the new scene reds.

---

## § Folds

Retires (by finding id):
- **`r-anim-libs-2026 F26-3`** (the orchestration tier shipped but UNDOGFOODED; the demo
  hand-rolls the physics the engine exports) — S1 (`decay()` swap) + S2 (`Draggable`
  sampler where 1-D) + S3 (`Sequence`+`stagger` scene) + gate clauses 1–3.

**Routed OUTWARD / RECORDED (not this wave):**
- **A `useMotionValue` Vue composable over `SpringProgress.subscribe`** (`r-anim-libs-2026
  F26-6`) — **RECORD** (the demo's idiomatic showcase of the reactive value-graph; NOT an
  engine addition — the engine's job ends at `subscribe`, the graph is the consumer's).
  Noted for a future demo pass, not folded here.
- **The dogfood-the-barrel demo migration** (`E7` / charter `NEW-19`) — **BOOK** (the
  boundary is gated but no first-party consumer crosses it; the minimal SHIP is a
  dist-barrel smoke, `a-boundary-arch-F F-A1`). The orchestration dogfood here is a
  separate axis from the barrel dogfood.

---

## § Design decisions

1. **The genuine dogfood is consuming `decay()` — NOT re-wrapping it demo-local.**
   RESOLVED: the dogfood discipline is the demo consuming the SHIPPED public API
   (`r-anim-libs-2026 F26-3`); a "demo-local decay helper" that re-implements or re-wraps
   the analytic form would not prove the engine's API. So `useOrbitalInertia` imports the
   engine's `decay()` directly and the hand-rolled `Math.pow` form is removed (no-legacy).
   Trade-off: the orbital path is 3-D quaternion physics, not a pure 1-D glide — so the swap
   adapts `decay()` to the angular/linear components rather than wholesale replacement, but
   the analytic decay-rate IS what each component's velocity follows. The dogfood is real
   where the shape matches; it is not forced where it does not (S2's 1-D-only `Draggable`
   routing).

2. **The swap is MEASURE-FIRST felt-equivalent — the parity test is the proof.** RESOLVED +
   named: the analytic `decay()` is the continuous limit of the discrete `Math.pow` form, so
   the swap is isomorphism-RESTORING (felt-identical, AND frame-rate-exact where the
   discrete form drifted). But "felt-identical" is a claim to VERIFY, not assert
   (`r-anim-libs-2026 F26-3` — the swap "must be felt-identical, parity-gated"). Gate clause
   1 is the proof: the analytic trajectory matches the discrete one within epsilon at 60 fps
   AND is frame-rate-invariant (the named-befitting delta — the discrete form had drift the
   analytic form removes). This is measure-first applied to a behaviour-equivalence claim.

3. **The new scene respects F16's idiom and the dock invariant.** RESOLVED: the
   `Sequence`+`stagger` scene lands a new demo scene (`F.md §The DAG` cross-band
   coupling) — it uses F16's promoted `progress-rail`/`progress-ball` idiom for its scrub UI
   (NOT a fourth ad-hoc rail/ball spelling — Band 5's whole point is the de-dup) and must
   not reintroduce a dock-over-content occlusion (inv δ is a HARD gate, not advisory,
   `F.md §invariant set`). Trade-off: this couples F10 to the demo band's
   ordering — the DAG records it (F10 depends on F16's idiom landing); the scene is
   authored to consume the promoted pair, not to introduce a new one.

4. **The library is UNTOUCHED — this is a demo+dogfood wave.** RESOLVED: F10 edits only
   `demo/` (the `useOrbitalInertia` swap + the new scene) and the `proof:dogfood` gate; the
   library's `decay`/`Draggable`/`Sequence`/`stagger` are CONSUMED, not changed (they are
   ALREADY-SOTA, `r-anim-libs-2026 A26-1`). Gate clause 4 locks the library byte-stable.
   The proof of the tier is the demo using it — the API does not change to be dogfooded.
