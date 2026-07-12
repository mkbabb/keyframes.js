# Lane 13 — `lib-physics-orchestration` (Tranche U audit)

**Scope:** `src/animation/physics/` (numeric · smooth · oscillator · decay · morph · playback · `spring/`) and `src/animation/orchestration/` (stagger · flip · `drag/` · `sequence/` · `timeline/` · `split-text/` · `view-transition/`). The LIGHT tier — value.js-free, `proof:boundary`-gated.

**Verdict headline.** The LIGHT tier is the most mature zone in the tree: the spring ring-break (`types.ts` as the shared-options home) is genuinely clean, the `RAFPlayback` one-core-three-shapes driver is exemplary, and every stepper honors the "caller owns the clock / no rAF ownership" discipline. But the tier carries **one hard, gate-invisible correctness-hazard duplication** (the spring closed-form is implemented TWICE — once in `solver.ts`, once re-inlined in `vector.ts`), **one incomplete carve** (SmoothProgress never received the S.B5 managed-play extraction SpringProgress got, so two byte-parallel managed-loop lifecycles coexist), and **one architectural miss against the performance grand edict** (`drag2D` spins up two independent rAF loops + two scalar springs when the SoA vector-lane machinery the spring already ships exists precisely for the 2-channel case). These three are the load-bearing charter asks; the rest are doc-truth and micro-perf.

---

## Findings

### F1 — MAJOR — The spring closed-form ODE is implemented twice: `solver.ts` (scalar) and `vector.ts` (SoA), diverging by copy

`solver.ts` extracts the underdamped/critical/overdamped case split as the single dependency-free kernel `solveDampedHarmonic(x0, v0, omega, zeta, omegaD, t)` (`spring/solver.ts:36-77`). The scalar tracker consumes it (`spring/progress.ts:39,319`). **But the SoA vector lane loop does NOT call it** — `spring/vector.ts:126-151` re-implements the identical three-case math inline (underdamped `A/B/decayU/cos/sin`, critical `decayC`, overdamped `r1/r2/e1/e2`), a verbatim algebraic copy of `solver.ts:47-76`. `grep solveDampedHarmonic src/` confirms the kernel has exactly two call sites, both scalar; the vector path reaches it zero times.

The docstrings assert the opposite — `vector.ts:11-13` and `progress.ts:316-318` both claim the lanes ring "the SAME closed form `evaluateAt` uses" — so the duplication is *documented as shared* while being *physically copied*. Any future correction to the ODE (a settle-threshold refinement, a numerical-stability guard on `wd → 0`, a sign fix) must be made in two places or the scalar and vector springs silently diverge. No gate catches this: `proof:boundary` checks edges, not algebraic equivalence.

The stated justification — hoisting `exp`/`cos`/`sin` once per tick across K lanes rather than per-lane — is real and correct, but it does not require a second copy of the math.

**Failure scenario:** a maintainer fixes an overdamped-branch edge case (e.g. `disc → 0` as ζ→1⁺) in `solveDampedHarmonic`; the scalar spring and every `springLinearStops`/`springTimingFunction` emission gets the fix, but every `setTargets`/`tickVector` multi-channel spring (the ADOPTed W122 SoA path) keeps the old math — a scalar-vs-vector trajectory divergence that the "rings identically" gate assumption actively hides.

**Evidence:** `spring/vector.ts:126-151`; `spring/solver.ts:36-77`; `spring/progress.ts:39,316-319`.

**Proposal (gestalt, not a patch):** transpose `solver.ts` into a **two-phase modal kernel** — one source of truth that serves both the per-frame scalar step and the per-tick-hoisted vector step:

- `prepareSpringModal(omega, zeta, omegaD, t) → SpringModal` — evaluates the transcendentals ONCE (`decay`, `cos`, `sin`, or `r1/r2/e1/e2`) and returns the case tag + coefficients.
- `applySpringModal(modal, x0, v0) → { x, v }` — pure arithmetic per (x0, v0), NO transcendentals.

The scalar path calls `prepare` then `apply` in sequence (identical cost to today's single call). The vector path calls `prepare` ONCE per tick, then `apply` per lane in the hot loop — the exact hoisting `vector.ts` hand-rolls today, now over the ONE kernel. `solveDampedHarmonic` becomes the trivial `apply(prepare(...))` composition for back-compat. One algebra, both perf profiles, and the "rings identically" claim becomes true by construction rather than by comment.

---

### F2 — MAJOR — SmoothProgress never got the S.B5 managed-play carve SpringProgress did; two parallel managed-stepper lifecycles now coexist

At S.B5 the SpringProgress `.play()`/`.stop()`/auto-resume lifecycle was lifted into `spring/managed-play.ts` as free functions over the `SpringPlayback` structural contract declared in `spring/types.ts:86-101` (the class keeps thin delegates, `progress.ts:483-491`). SmoothProgress is the identical shape — a `Tickable` stepper with a managed `.play(onFrame)` that routes through `withReducedMotion`, arms `RAFPlayback.drive`, auto-resumes on `setTarget`, and idempotently re-binds — but it **hand-rolls that entire lifecycle inline** (`smooth.ts:156-200` `.play`/`.stop`/`_startLoop`, plus `_snapSettled` at `smooth.ts:100-113`).

The duplication is self-documented: `smooth.ts:104-107` notes its `_snapSettled` is "contract-equivalent" to `SpringProgress._snapSettled` ("value-set + settle + emit + stop, differing only in the spring's velocity/origin fields"), and `RAFPlayback`'s own docstring (`playback.ts:58-61`) claims the "`SmoothProgress` / `SpringProgress` `_startLoop`/`_stopLoop` byte-siblings ... all delegate here." They delegate the *rAF core* to `RAFPlayback.drive`, yes — but the *managed-play orchestration* (PRM routing, auto-resume-on-retarget, idempotent rebind, snap-and-stop) is copied, not shared. The S.B5 carve stopped at one of the two sibling steppers.

**Failure scenario:** a fix to the auto-resume semantics (e.g. re-arming the loop when a callback binds after settle) lands in `managed-play.ts` for the spring but is forgotten in `smooth.ts` — the two steppers drift in their managed-play contract despite being advertised as siblings. More concretely: the "no scheduled `drive` frame after a reduced-motion snap" invariant (`smooth.ts:104-107`) is asserted equal across both but enforced in neither shared place.

**Evidence:** `smooth.ts:100-113,156-200`; `spring/managed-play.ts:28-67`; `spring/types.ts:86-101`; `physics/playback.ts:58-61`.

**Proposal (gestalt):** generalize `SpringPlayback` into a zone-level `ManagedStepper` contract (it already extends `Tickable`; the only spring-specific member is `snap()`, which SmoothProgress also has, and the `value`/`velocity` reads — SmoothProgress has `current` and no velocity, so the callback shape is the one real difference). Home ONE `physics/managed-stepper.ts` (or fold into `playback.ts` beside `Tickable`) that both `SmoothProgress` and `SpringProgress` delegate to via thin methods. `spring/managed-play.ts` becomes the concrete binding of that contract, and `smooth.ts` loses ~45 hand-rolled lines. This is the natural completion of the S.B5 carve the tranche left half-finished, and it makes the "byte-siblings delegate here" claim literally true.

---

### F3 — MAJOR — `drag2D` violates the performance grand edict: two independent rAF loops + two scalar springs where the SoA vector lanes exist for exactly this

`drag2D` composes two one-axis `Draggable`s (`drag/drag-2d.ts:63-64`), each of which owns its own `SpringProgress` (`drag/draggable.ts:129,168`), and each `SpringProgress` owns its own `RAFPlayback` (`spring/progress.ts:123`). A single 2-D fling therefore drives **two separate `requestAnimationFrame` chains**, and — because each axis' spring subscription independently calls the shared `emit()` (`drag-2d.ts:88-89`) — fans out the `(x, y, vx, vy)` subscriber **twice per frame** with the same coalesced state.

Meanwhile the spring family already ships the SoA multi-channel path built and ADOPTed precisely for "K channels under one spring in one tick, one buffer write" (the W122 2.97–3.78× result): `SpringProgress.setTargets(Float64Array)` / `tickVector(dt)` (`progress.ts:404-445`, `vector.ts`). A 2-D drag is the canonical K=2 case, and it is running the pre-SoA "K independent scalar instances" shape the vector work was measured *against*. The "engine stays 1-D (KISS)" note (`drag-2d.ts:8`) is a fair design axiom for the *input plumbing*, but it has leaked into the *physics substrate*, doubling the rAF cost of the one primitive most likely to run during active pointer interaction (the INP-sensitive path).

The obstacle is real and worth chartering honestly: the vector lanes re-seat each lane's origin from current `(x, v)` on `setTargets` (`vector.ts:56-61`) but have **no per-lane velocity-injection** surface — and `Draggable`'s release does exactly that via `spring.reset(value, releaseVelocity)` (`draggable.ts:348,369`). So this is an architectural transposition, not a call-site swap: the SoA lane API needs a `reseatLane(i, value, velocity)` (or a vector `reset`) to carry the release fling. That extension is small and squarely in the spirit of "performance is the grand edict."

**Failure scenario:** a two-axis fling on a mid-range device schedules two rAF callbacks per frame and double-invokes every subscriber, competing for the same 16ms budget the SoA path was adopted to reclaim — the exact workload the vector lanes optimize, run in the un-optimized shape.

**Evidence:** `drag/drag-2d.ts:63-64,88-89`; `drag/draggable.ts:129,168,348,369`; `spring/progress.ts:123,404-445`; `spring/vector.ts:56-61`.

**Proposal (gestalt):** drive `drag2D` from ONE 2-lane `SpringProgress` vector under one `RAFPlayback` loop. Extend the SoA lane surface (`vector.ts`) with per-lane velocity-reseat so the per-axis release fling injects its `releaseVelocity` into lane `i`; `drag2D` then holds one spring, one loop, one emit per frame. Keep the 1-D `Draggable` engine as the pointer-plumbing front for the scalar case; `drag2D` stops being "two engines glued" and becomes "one 2-lane engine behind a 2-D handle." Coalescing the double-emit falls out for free (one loop → one emit).

---

### F4 — MINOR — Stale kernel-location comment in `progress.ts` (doc drift, NO-legacy)

`progress.ts:316-318` says the closed-form step "lives in the shared `./sample` kernel — the SAME math the vector SoA lane loop inlines." The kernel actually lives in `./solver` (imported at `progress.ts:39`, `solveDampedHarmonic`); `./sample` is the higher-level `sampleNormalizedSpring` serializer helper, which *constructs a SpringProgress* and depends on it. The kernel was split out to `solver.ts` at R.W2c specifically to break the `progress ↔ sample` ring (`solver.ts:1-14` documents this), but this one comment still points at the pre-split home. A reader chasing the kernel is sent to the wrong file.

**Evidence:** `progress.ts:316-318` vs `progress.ts:39`, `spring/solver.ts:1-14`, `spring/sample.ts:18`.

**Proposal:** correct the reference to `./solver`; and note the comment's "the vector SoA lane loop inlines" phrasing is the same false-sharing claim F1 addresses — fixing F1 lets this comment truthfully say "shared with the vector path" instead of "inlined by it."

### F5 — MINOR — `Sequence.duration` is an unbounded O(entries) recompute on every access, including per play-frame

`Sequence.duration` iterates all entries to find the max segment end on every read (`sequence.ts:200-208`). It is read from the `progress` getter (`sequence.ts:222`), and — the hot one — every frame of the play loop via `ctx.duration` (`transport.ts:219` `const total = ctx.duration * ctx._repeatCount`). `entries` mutates only in `add()` (`sequence.ts:275-283`), so the max is memoizable there. Under the performance grand edict, a per-frame O(n) recompute of an invariant-between-mutations quantity is exactly the kind of "free" cost the edict targets. (Small n in practice, hence MINOR — but it is genuinely unbounded in n and genuinely per-frame.)

**Evidence:** `sequence.ts:200-208,222`; `transport.ts:219`; mutation site `sequence.ts:275-283`.

**Proposal:** maintain `_duration` as a field updated in `add()` (the sole entries mutation); the getter returns the cached value. Trivial, and it removes an O(n) term from the play-loop step.

### F6 — MINOR — Per-frame reduced-motion `scaledTarget` recomputed in both `evaluateAt` and `checkSettled`

`evaluateAt` (`progress.ts:310-313`) and `checkSettled` (`progress.ts:339-341`) each recompute `scaledTarget = originValue + s·(target − origin)` every frame, though `originValue`, `targetValue`, and `amplitudeScale` change only on a target re-seat (`reseatTarget`, `progress.ts:201-227`). Two redundant multiply-adds per frame on the scalar hot path. Cache `scaledTarget` as a field set in `reseatTarget`/constructor/`reset`.

**Evidence:** `progress.ts:310-313,339-341` vs the re-seat sites `progress.ts:201-227,360-378`.

**Proposal:** derive `scaledTarget` once per re-seat into a field; `evaluateAt`/`checkSettled` read it. Folds naturally into the F1 modal-kernel refactor (the modal prepare step is also per-re-seat-ish and can carry it).

### F7 — MINOR — `NumericAnimation`'s zero-alloc scratch is a module-global shared across all instances (non-reentrancy hazard, undocumented)

`_out` is a module-scope `Float64Array` grown lazily and reused across EVERY `NumericAnimation` instance's `.at()` (`numeric.ts:25,198-201`). This is legitimately zero-alloc and safe single-threaded/non-reentrant, but it is a hidden cross-instance shared-mutable: if `.at()` is ever entered reentrantly — e.g. a caller passes a `timingFunction` that itself samples another `NumericAnimation` (fully legal: easings are arbitrary callables), or `ElementMorph.at` composed within a stagger callback — the inner `.at()` overwrites `_out` before the outer copies it out (`numeric.ts:201-206`). The zero-alloc claim is honest for the common loop but the reentrancy contract is unstated.

**Evidence:** `numeric.ts:25,196-206`.

**Proposal:** either make the scratch per-instance (a `private _out` grown per animation — the alloc is one-per-instance, not per-frame, so the zero-alloc hot path is preserved) or document `.at()` as explicitly non-reentrant. Per-instance is the cleaner gestalt: it keeps the zero-alloc property without the shared-global reentrancy footgun, at the cost of one small buffer per animation (which already holds `keyframes`/`segments`, so the marginal footprint is negligible).

---

## What U must charter

1. **Unify the spring closed-form into ONE modal kernel.** Split `solver.ts` into `prepareSpringModal` (transcendentals once) + `applySpringModal` (per-(x0,v0) arithmetic); make BOTH `progress.ts` (scalar) and `vector.ts` (SoA per-lane, hoisted) consume it. Delete the copied ODE in `vector.ts:126-151`. One algebra, both perf profiles; the "rings identically" claim becomes true by construction. (F1)
2. **Complete the S.B5 managed-play carve for SmoothProgress.** Promote `SpringPlayback` to a zone-level `ManagedStepper` contract; home one `managed-stepper` module both `SmoothProgress` and `SpringProgress` delegate to; delete the hand-rolled managed loop in `smooth.ts:156-200`. (F2)
3. **Transpose `drag2D` onto one 2-lane vector spring + one rAF loop.** Extend the SoA lane surface (`vector.ts`) with per-lane velocity-reseat so the release fling injects into a lane; retire the two-independent-`SpringProgress`/two-rAF-loop/double-emit shape. Performance grand edict, INP-critical path. (F3)
4. **Correct the stale `./sample`→`./solver` kernel reference** in `progress.ts:316-318` (dovetails with #1). (F4)
5. **Memoize `Sequence.duration`** in `add()`; stop recomputing the segment-max per play-frame. (F5)
6. **Cache the reduced-motion `scaledTarget`** per re-seat in `SpringProgress` rather than recomputing it in `evaluateAt` + `checkSettled` each frame. (F6)
7. **Resolve the `NumericAnimation._out` shared-global reentrancy hazard** — per-instance scratch (preferred) or a documented non-reentrant `.at()` contract. (F7)
