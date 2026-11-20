/**
 * inertiaDecay — the cube's feel, in one place (owner 2026-11-15: "apple like
 * in inertia and momentum--it should be fun and highly interactive"). Pure
 * and Vue-free: every surface the die stands on reads these numbers (the
 * demo's cube scene and the embed slice daraksha.babb.dev/motion frames are
 * one build of one CubeTarget), so the same hand gives the same die on both.
 *
 * The coast is the engine's analytic `decay()` closed form, sampled at
 * elapsed time (so 30, 60 and 120 Hz draw the same path):
 *   ω(t) = ω₀·e^(−k·t),  θ(t) = ω₀/k·(1 − e^(−k·t)).
 *
 * The hand's speed is kept at release (COAST_GAIN 1: the die leaves the
 * finger at the finger's speed, as a scroll view does) and bleeds out at
 * ROTATE_FRICTION 3/s (τ = 333 ms): a gentle flick turns on about a third of
 * a turn, a hard one spins several turns before it rests. (This reverses
 * D-15's k = 9/s and gain 0.5, owner 2026-11-15.)
 */

/** The frame interval the legacy per-frame knob is expressed per (ms). */
export const TARGET_DT = 1000 / 60;

/**
 * The friction coefficient `k` (1/s) equal to a per-60-Hz-frame keep factor:
 * inertiaFactor^(t_ms/TARGET_DT) = e^(−k·t_ms/1000) ⇒ k = −ln(inertiaFactor)·60.
 */
export const inertiaFactorToFriction = (inertiaFactor: number): number =>
    -Math.log(inertiaFactor) * (1000 / TARGET_DT);

/** The rotation coast's friction (1/s): τ = 333 ms. */
export const ROTATE_FRICTION = 3;

/** The default knob, the rotation friction per 60 Hz frame (e^(−3/60) ≈ 0.951). */
export const DEFAULT_INERTIA_FACTOR = Math.exp(-ROTATE_FRICTION / 60);

/** The pan and zoom coast's friction (1/s): a die inside its card has little
 *  room, so a thrown pan or pinch settles twice as fast as the spin. */
export const POSE_FRICTION = 6;

/** The spring that returns what stands past a bound, and Reset's spring
 *  (1/s; critically damped, x(t) = (x₀ + (v₀ + k·x₀)·t)·e^(−k·t)). */
export const SPRING_K = 11;

/** The release gain: the coast starts at the hand's own speed. */
export const COAST_GAIN = 1;

/** The coast's starting rate is capped at six turns per second (a hard flick
 *  coasts at most 12π/3 rad ≈ two turns). */
export const MAX_COAST_RATE = 12 * Math.PI;

/** The pan coast's starting speed cap (screen px/s): a coast of at most 4000/6 ≈ 667 px. */
export const MAX_PAN_COAST_RATE = 4000;

/** The zoom coast's starting rate cap (ln s per second): at most e^(6/6) ≈ 2.7×. */
export const MAX_ZOOM_COAST_RATE = 6;

/** A pan or zoom coast stops once its rate has bled to 1% of its start. */
export const COAST_REST_FRACTION = 0.01;

/** The rotation coast rests once it turns slower than this (rad/s, ≈ 1.7°/s):
 *  an absolute floor, so a hard flick's tail ends where the eye stops seeing it. */
export const COAST_REST_RATE = 0.03;

/** A release slower than this (rad/s) does not coast: a placed die stays placed. */
export const COAST_MIN_RATE = 0.15;

/** A channel's starting coast rate from the hand's release rate (the same
 *  gain for every channel; rad/s by default, px/s or ln s/s with their cap). */
export const coastRate = (releaseRate: number, reducedMotion = false, cap = MAX_COAST_RATE): number =>
    reducedMotion ? 0 : Math.min(COAST_GAIN * Math.abs(releaseRate), cap);

/** How long a rotation coast from ω₀ (rad/s) runs before it rests (s). */
export const coastDuration = (omega0: number, k = ROTATE_FRICTION): number =>
    omega0 > COAST_REST_RATE ? Math.log(omega0 / COAST_REST_RATE) / k : 0;

/** How far a rotation coast from ω₀ (rad/s) travels to its rest (rad). */
export const coastTravel = (omega0: number, k = ROTATE_FRICTION): number =>
    omega0 > COAST_REST_RATE ? (omega0 - COAST_REST_RATE) / k : 0;
