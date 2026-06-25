/**
 * Frictional decay (inertial glide) — the one-line closed-form sibling of
 * the spring solver, for the fling/flick case where there is no target to
 * settle to, only an initial velocity bleeding off under friction.
 *
 * The model is a first-order velocity-proportional drag, `v'(t) = −k·v(t)`,
 * whose closed-form position is
 *
 *   x(t) = x0 + (v0 / k)·(1 − e^(−k·t))
 *
 * with velocity `v(t) = v0·e^(−k·t)`. As `t → ∞` the glide asymptotes to a
 * finite resting point `x0 + v0/k` (the projected endpoint a release would
 * coast to). Larger `k` → more friction → shorter glide.
 *
 * LIGHT module: zero static `@mkbabb/value.js` edge. Pure math — no rAF, no
 * DOM, no allocation in the hot path. A richer canonical closed form is the
 * value.js hand-off VJ-1; `decay` ships keyframes-local today and collapses
 * to a thin caller once value.js publishes the canonical surface.
 */

/** Inputs to the {@link decay} frictional-glide closed form. */
export interface DecayOptions {
    /** Starting position. Default 0. */
    initial?: number;
    /** Release velocity (units/s) — the flick speed handed off at release. */
    velocity: number;
    /**
     * Friction coefficient (1/s). Strictly positive — larger means more
     * drag and a shorter glide. Default 5.
     */
    friction?: number;
}

/** A sampled point on a decay glide: position + velocity at time `t`. */
export interface DecaySample {
    /** Position `x(t) = x0 + v0/k·(1 − e^(−k·t))`. */
    value: number;
    /** Velocity `v(t) = v0·e^(−k·t)`. */
    velocity: number;
}

const DEFAULT_FRICTION = 5;

/**
 * The closed-form frictional glide. Given a release `velocity` `v0`, an
 * `initial` position `x0`, and a `friction` `k`, returns a pure sampler
 * `(t) => { value, velocity }` evaluating
 *
 *   x(t) = x0 + (v0 / k)·(1 − e^(−k·t))
 *   v(t) = v0·e^(−k·t)
 *
 * at any elapsed time `t` in SECONDS — the spring's native clock. `t ≤ 0`
 * yields the seed state `(x0, v0)`. Allocation-free per call (one closure
 * captured once); the returned function does no further allocation.
 *
 * @throws if `friction <= 0` — a non-positive coefficient has no finite
 *   resting point and is a programmer error, surfaced explicitly.
 */
export function decay(
    options: DecayOptions,
): (t: number) => DecaySample {
    const x0 = options.initial ?? 0;
    const v0 = options.velocity;
    const k = options.friction ?? DEFAULT_FRICTION;

    if (k <= 0) {
        throw new Error("decay() requires a friction coefficient > 0.");
    }

    // The asymptotic resting point — the value the glide coasts to as
    // `t → ∞`. Captured once so the sampler is a pure read.
    const restValue = x0 + v0 / k;

    return (t: number): DecaySample => {
        if (t <= 0) {
            return { value: x0, velocity: v0 };
        }
        const e = Math.exp(-k * t);
        return {
            value: restValue - (v0 / k) * e,
            velocity: v0 * e,
        };
    };
}

/**
 * The asymptotic resting point of a glide — the position a release of
 * `velocity` from `initial` under `friction` coasts to as `t → ∞`
 * (`x0 + v0/k`). The projected endpoint, useful for snap-to-target /
 * paginated-fling decisions without running the loop.
 *
 * @throws if `friction <= 0` (see {@link decay}).
 */
export function decayRest(options: DecayOptions): number {
    const k = options.friction ?? DEFAULT_FRICTION;
    if (k <= 0) {
        throw new Error("decayRest() requires a friction coefficient > 0.");
    }
    return (options.initial ?? 0) + options.velocity / k;
}
