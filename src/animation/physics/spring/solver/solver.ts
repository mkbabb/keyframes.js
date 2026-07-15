/**
 * `physics/spring/solver/solver.ts` — the closed-form damped-harmonic kernel
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

export type SpringModalStep =
    | { regime: "under"; w: number; z: number; wd: number; decay: number; cos: number; sin: number }
    | { regime: "critical"; w: number; decay: number; t: number }
    | { regime: "over"; r1: number; r2: number; e1: number; e2: number };

/** Prepare the regime-specific transcendental terms once for one elapsed time. */
export function prepareDampedHarmonic(
    omega: number,
    zeta: number,
    omegaD: number,
    t: number,
): SpringModalStep {
    if (zeta < 1) {
        return {
            regime: "under",
            w: omega,
            z: zeta,
            wd: omegaD,
            decay: Math.exp(-zeta * omega * t),
            cos: Math.cos(omegaD * t),
            sin: Math.sin(omegaD * t),
        };
    }
    if (zeta === 1) {
        return { regime: "critical", w: omega, decay: Math.exp(-omega * t), t };
    }
    const disc = omega * Math.sqrt(zeta * zeta - 1);
    const r1 = -zeta * omega + disc;
    const r2 = -zeta * omega - disc;
    return { regime: "over", r1, r2, e1: Math.exp(r1 * t), e2: Math.exp(r2 * t) };
}

/** Apply one prepared modal step to one scalar/lane initial condition. */
export function solvePreparedDampedHarmonic(
    x0: number,
    v0: number,
    modal: SpringModalStep,
    out: SpringSolution = { x: 0, v: 0 },
): SpringSolution {
    if (modal.regime === "under") {
        const { w, z, wd, decay, cos, sin } = modal;
        const A = x0;
        const B = (v0 + z * w * x0) / wd;
        out.x = decay * (A * cos + B * sin);
        out.v = decay * ((B * wd - A * z * w) * cos - (A * wd + B * z * w) * sin);
        return out;
    }
    if (modal.regime === "critical") {
        const { w, decay, t } = modal;
        const A = x0;
        const B = v0 + w * x0;
        out.x = decay * (A + B * t);
        out.v = decay * (B - w * (A + B * t));
        return out;
    }
    const { r1, r2, e1, e2 } = modal;
    const A = (v0 - r2 * x0) / (r1 - r2);
    const B = x0 - A;
    out.x = A * e1 + B * e2;
    out.v = A * r1 * e1 + B * r2 * e2;
    return out;
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
    return solvePreparedDampedHarmonic(
        x0,
        v0,
        prepareDampedHarmonic(omega, zeta, omegaD, t),
    );
}
