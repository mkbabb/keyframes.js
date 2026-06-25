/**
 * `physics/spring/solver.ts` — the closed-form damped-harmonic kernel
 * (R.W2c §spring). The PURE analytic step, extracted off `sample.ts` so it
 * carries ZERO module dependency: both `progress.ts` (the scalar tracker, once
 * per frame) and `sample.ts` (the normalized-curve sampler) read it without
 * either side reaching back through the other.
 *
 * This break inverts the former `progress.ts ↔ sample.ts` runtime ring: the
 * kernel is the shared leaf both depend on, while `sample.ts`'s higher-level
 * `sampleNormalizedSpring` (which constructs a `SpringProgress`) keeps its
 * one-directional edge to `progress.ts`.
 *
 * value.js-free (LIGHT) — plain Math.
 */

/** The relative displacement + velocity of the solver at elapsed `t`. */
export interface SpringSolution {
    /** x(t) relative to the (scaled) target — add the target back for absolute. */
    x: number;
    /** v(t) — the instantaneous velocity (a physical fact, never amplitude-scaled). */
    v: number;
}

/**
 * Closed-form step of the second-order damped harmonic oscillator with
 * `x(0) = x0`, `v(0) = v0` (both RELATIVE to the rest target). Returns
 * `(x(t), v(t))`. The case split is keyed on ζ:
 *
 *   underdamped (ζ < 1):  x(t) = e^(-ζω t) [A cos(ω_d t) + B sin(ω_d t)]
 *   critical    (ζ = 1):  x(t) = e^(-ω t) [A + B t]
 *   overdamped  (ζ > 1):  x(t) = A e^(r₁ t) + B e^(r₂ t)
 *
 * `omegaD` (the damped frequency `ω₀√(1-ζ²)`) is passed in so the caller can
 * cache it across frames — it is only consulted on the underdamped branch.
 */
export function solveDampedHarmonic(
    x0: number,
    v0: number,
    omega: number,
    zeta: number,
    omegaD: number,
    t: number,
): SpringSolution {
    const w = omega;
    const z = zeta;

    if (z < 1) {
        // Underdamped.
        const wd = omegaD;
        const decay = Math.exp(-z * w * t);
        const A = x0;
        const B = (v0 + z * w * x0) / wd;
        const cos = Math.cos(wd * t);
        const sin = Math.sin(wd * t);
        const x = decay * (A * cos + B * sin);
        const v =
            decay * ((B * wd - A * z * w) * cos - (A * wd + B * z * w) * sin);
        return { x, v };
    }
    if (z === 1) {
        // Critically damped.
        const decay = Math.exp(-w * t);
        const A = x0;
        const B = v0 + w * x0;
        return { x: decay * (A + B * t), v: decay * (B - w * (A + B * t)) };
    }
    // Overdamped. Two real roots of r² + 2ζω r + ω² = 0.
    const disc = w * Math.sqrt(z * z - 1);
    const r1 = -z * w + disc;
    const r2 = -z * w - disc;
    // Solve A + B = x0, A r1 + B r2 = v0.
    const A = (v0 - r2 * x0) / (r1 - r2);
    const B = x0 - A;
    const e1 = Math.exp(r1 * t);
    const e2 = Math.exp(r2 * t);
    return { x: A * e1 + B * e2, v: A * r1 * e1 + B * r2 * e2 };
}
