/**
 * inertiaDecay — the pure (Vue-free) bridge between the orbital-drag's
 * legacy per-frame friction knob and the engine's analytic `decay()` closed
 * form (F.W10.S1).
 *
 * `useOrbitalInertia` USED to hand-roll the frictional glide as a per-frame
 * `Math.pow(inertiaFactor, dt/TARGET_DT)` velocity multiply — the discrete
 * forward-Euler form of EXACTLY the `decay.ts` analytic closed form the engine
 * now exports. This module holds the ONE measure-first fact the swap rests on
 * (the `k`-from-`inertiaFactor` mapping), kept Vue-free so the inertia-parity
 * gate can import it without pulling the demo's `.vue` graph.
 */

/** Target frame interval the legacy per-frame decay was tuned at (ms). */
export const TARGET_DT = 1000 / 60;

/**
 * The friction coefficient `k` (1/s) that makes the engine's analytic
 * `decay()` felt-IDENTICAL to the legacy per-frame `Math.pow(inertiaFactor,
 * dt/TARGET_DT)` decay. The legacy form bleeds velocity by `inertiaFactor` each
 * `TARGET_DT` ms, so after `t` ms it has multiplied velocity by
 * `inertiaFactor^(t/TARGET_DT)`. The analytic form is `v0·e^(−k·t_s)` with
 * `t_s` in SECONDS. Equating the two exponentials and solving for `k`:
 *
 *   inertiaFactor^(t_ms/TARGET_DT) = e^(−k · t_ms/1000)
 *   ⇒ k = −ln(inertiaFactor) · (1000 / TARGET_DT)   (= −ln(inertiaFactor)·60)
 *
 * This is the MEASURE-FIRST mapping the inertia-parity test locks: the analytic
 * trajectory matches the discrete one within epsilon at 60fps AND is frame-rate
 * INVARIANT (the discrete form only approximates that). `inertiaFactor` is a
 * decay-per-frame fraction in (0, 1), so `ln(inertiaFactor) < 0` and `k > 0`.
 */
export const inertiaFactorToFriction = (inertiaFactor: number): number =>
    -Math.log(inertiaFactor) * (1000 / TARGET_DT);

/**
 * KFA-83 — a gesture amount measured over one pointer event, re-expressed per
 * TARGET_DT frame (the unit the fling speed and the coast step share), so the
 * fling reads the hand's speed per unit time whatever the event rate. The event
 * delta is clamped: coalesced events a millisecond apart must not spike it, and
 * a move after a long pause must not read as near-zero-dt.
 */
export const MIN_EVENT_DT = 4;
export const MAX_EVENT_DT = 100;
export const perTargetFrame = (amount: number, eventDtMs: number): number =>
    (amount * TARGET_DT) /
    Math.min(Math.max(eventDtMs, MIN_EVENT_DT), MAX_EVENT_DT);
