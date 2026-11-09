/**
 * inertiaDecay — the pure (Vue-free) bridge between the orbital-drag's
 * per-frame friction knob and the engine's analytic `decay()` closed form
 * (F.W10.S1), and the coast's release law (KF-M2, COHESION §0hm D-15).
 *
 * The knob is `inertiaFactor`, the velocity kept per 60 Hz frame; the engine
 * wants a friction `k` in 1/s. The mapping between them is the one
 * measure-first fact the swap rests on, kept Vue-free so the inertia-parity
 * gate can import it without pulling the demo's `.vue` graph.
 */

/** The frame interval the friction knob is expressed per (ms). */
export const TARGET_DT = 1000 / 60;

/**
 * The friction coefficient `k` (1/s) that makes the engine's analytic
 * `decay()` felt-IDENTICAL to the per-frame `Math.pow(inertiaFactor,
 * dt/TARGET_DT)` decay. Equating the two exponentials:
 *
 *   inertiaFactor^(t_ms/TARGET_DT) = e^(−k · t_ms/1000)
 *   ⇒ k = −ln(inertiaFactor) · (1000 / TARGET_DT)   (= −ln(inertiaFactor)·60)
 *
 * `inertiaFactor` is a decay-per-frame fraction in (0, 1), so `k > 0`.
 */
export const inertiaFactorToFriction = (inertiaFactor: number): number =>
    -Math.log(inertiaFactor) * (1000 / TARGET_DT);

/**
 * KF-M2 (D-15) — the default knob: k = 9/s, τ = 111 ms, |ω| under 5% in
 * ~333 ms and under 1% in ~512 ms. The former 0.95 (k ≈ 3.1/s, τ ≈ 325 ms)
 * with an un-gained release coasted a 120 px flick ~2× its own gesture, like
 * a slot machine. This is a short, soft exhale.
 */
export const DEFAULT_INERTIA_FACTOR = Math.exp(-9 / 60);

/**
 * The release gain: the coast starts at half the hand's angular speed. With
 * k = 9/s a flick of duration T coasts COAST_GAIN/(k·T) of its own angle: a
 * 120 px flick in 120 ms coasts 0.46× the gesture (100 ms → 0.56×, 160 ms →
 * 0.35×), inside the 0.3–0.6 band.
 */
export const COAST_GAIN = 0.5;

/** The coast's starting rate is capped at one turn per second. */
export const MAX_COAST_RATE = 2 * Math.PI;

/** OA-17 — the pan coast's starting speed cap (screen px/s): a coast of at
 *  most 3000/9 ≈ 333 px. */
export const MAX_PAN_COAST_RATE = 3000;

/** OA-17 — the zoom coast's starting rate cap (ln s per second): a coast of
 *  at most e^(4/9) ≈ 1.56×. */
export const MAX_ZOOM_COAST_RATE = 4;

/** The coast stops once its rate has bled to 1% of its start. */
export const COAST_REST_FRACTION = 0.01;

/** A channel's starting coast rate from the hand's release rate (the same
 *  gain for every channel; rad/s by default, px/s or ln s/s with their cap). */
export const coastRate = (releaseRate: number, reducedMotion = false, cap = MAX_COAST_RATE): number =>
    reducedMotion ? 0 : Math.min(COAST_GAIN * Math.abs(releaseRate), cap);
