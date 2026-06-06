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
