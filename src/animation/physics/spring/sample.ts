/**
 * `physics/spring/sample.ts` — the shared spring sampler kernel (R.W1 §spring).
 *
 * Two cohesive concerns extracted off the family's hot paths:
 *
 *  - {@link solveDampedHarmonic} — the closed-form analytic step of a
 *    second-order damped harmonic oscillator (the underdamped / critical /
 *    overdamped case split). `SpringProgress.evaluateAt` (the scalar tracker)
 *    drives it once per frame. The vector SoA lane loop (`vector.ts`) inlines
 *    the SAME math with the transcendentals hoisted once per tick (the W122
 *    amortization), so the two forms ring identically by construction.
 *
 *  - {@link sampleNormalizedSpring} — the normalized `(target=1, initial=0)`
 *    response-curve sampler `springLinearStops` + `springTimingFunction` both
 *    drive. Dedups the `new SpringProgress(...) → set target → _stepSeconds`
 *    setup that was copied into both serializers.
 *
 * value.js-free (LIGHT) — plain Math.
 */
import { SpringProgress } from "./progress";

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

/** Inputs to the normalized-spring sampler shared by the two serializers. */
export interface NormalizedSpringSampleOptions {
    response: number;
    dampingFraction: number;
    /** Number of interior samples to step. */
    sampleCount: number;
    /** Settle envelope (both position + velocity). */
    settleThreshold: number;
    /**
     * Per-step `dt` in SECONDS. The two serializers space their points
     * differently (`springLinearStops` over `sampleCount+1` sub-intervals,
     * `springTimingFunction` over `sampleCount`), so the caller passes the exact
     * step — the construct/step/settle-pin loop is the only shared part.
     */
    dt: number;
}

/**
 * Step a normalized `SpringProgress(target=1, initial=0)` solver `sampleCount`
 * times by `dt` SECONDS, returning the spring position at each interior step
 * (pinned to `1` once settled). The implicit `0` start and `1` end stops are NOT
 * included — the caller frames them. This is the ONE sampler SETUP
 * `springLinearStops` + `springTimingFunction` share (R.W1 §spring): the same
 * `(response, dampingFraction)` solver, the same step loop, the same settle pin —
 * so the two serializers describe ONE curve. (Only the per-step `dt` differs,
 * passed in by each.)
 */
export function sampleNormalizedSpring(
    opts: NormalizedSpringSampleOptions,
): number[] {
    const spring = new SpringProgress({
        response: opts.response,
        dampingFraction: opts.dampingFraction,
        initial: 0,
        settleThreshold: opts.settleThreshold,
        velocitySettleThreshold: opts.settleThreshold,
    });
    spring.target = 1;

    const samples: number[] = [];
    for (let i = 1; i <= opts.sampleCount; i++) {
        spring._stepSeconds(opts.dt);
        samples.push(spring.settled ? 1 : spring.value);
    }
    spring.dispose();
    return samples;
}
