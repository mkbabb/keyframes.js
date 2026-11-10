/**
 * `physics/spring/solver/settle.ts` — the spring's own settle clock.
 *
 * {@link settleTime} answers "how long until this spring comes to rest?" from the
 * closed form alone (`./solver`): no stepping, no second integrator. The rest
 * envelope is the one `SpringProgress` already uses — `settleThreshold` on
 * position, `velocitySettleThreshold` on velocity — with the same defaults.
 *
 * value.js-free (LIGHT) — plain Math.
 */
import type { SpringProgressOptions } from "../types";
import { defaultSpringOptions } from "../types";
import { prepareDampedHarmonic, solvePreparedDampedHarmonic } from "./solver";

/** Options for {@link settleTime}: the spring, its starting velocity, its rest envelope. */
export interface SpringSettleOptions
    extends Pick<SpringProgressOptions, "response" | "dampingFraction">,
        Partial<
            Pick<
                SpringProgressOptions,
                "initialVelocity" | "settleThreshold" | "velocitySettleThreshold"
            >
        > {}

/** Backward-scan resolution, as a fraction of `response`. */
const SCAN_DIVISIONS = 4096;
/** Horizon cap, as a multiple of `response`: beyond it the spring never settles. */
const HORIZON_CAP = 2 ** 32;

/**
 * Seconds on the spring's own clock until the normalised step response (from 0
 * to a target of 1, starting at `initialVelocity` travel/s) enters the rest
 * envelope `|x − 1| < settleThreshold ∧ |v| < velocitySettleThreshold` and stays
 * there: the LAST time it is outside. After it, the spring never leaves.
 *
 * Pass `velocitySettleThreshold: Infinity` for an envelope on position alone.
 * Returns `Infinity` for an undamped spring (ζ = 0) that starts outside the
 * envelope. Pure and server-safe; reduced motion is not an input.
 *
 * @example
 * settleTime({ response: 0.5, dampingFraction: 0.45 }); // ≈ 1.6 (seconds)
 */
export function settleTime(opts: SpringSettleOptions): number {
    const response = opts.response;
    const zeta = opts.dampingFraction;
    const v0 = opts.initialVelocity ?? defaultSpringOptions.initialVelocity;
    const eps = opts.settleThreshold ?? defaultSpringOptions.settleThreshold;
    const epsV =
        opts.velocitySettleThreshold ??
        defaultSpringOptions.velocitySettleThreshold;

    if (!(response > 0) || !Number.isFinite(response)) {
        throw new RangeError(`settleTime: response must be finite and > 0; got ${response}.`);
    }
    if (!(zeta >= 0)) {
        throw new RangeError(`settleTime: dampingFraction must be >= 0; got ${zeta}.`);
    }
    if (!(eps > 0)) {
        throw new RangeError(`settleTime: settleThreshold must be > 0; got ${eps}.`);
    }
    if (!(epsV > 0)) {
        throw new RangeError(
            `settleTime: velocitySettleThreshold must be > 0 (Infinity allowed); got ${epsV}.`,
        );
    }
    if (!Number.isFinite(v0)) {
        throw new RangeError(`settleTime: initialVelocity must be finite; got ${v0}.`);
    }

    // Relative initial state: start at 0 with the target at 1.
    const x0 = -1;
    const omega = (2 * Math.PI) / response;
    const omegaD = zeta < 1 ? omega * Math.sqrt(1 - zeta * zeta) : 0;

    // ── Analytic decay bound: E_x(t) ≥ |x(t)|, E_v(t) ≥ |v(t)|, non-increasing
    // from `onset`. Same coefficients as `solvePreparedDampedHarmonic`.
    let bound: (t: number) => [number, number];
    let onset = 0;
    if (zeta < 1) {
        const A = x0;
        const B = (v0 + zeta * omega * x0) / omegaD;
        const M = Math.hypot(A, B);
        // The velocity term rotates the same amplitude by √(ωd² + ζ²ω²) = ω.
        bound = (t) => {
            const d = Math.exp(-zeta * omega * t) * M;
            return [d, d * omega];
        };
    } else if (zeta === 1) {
        const A = x0;
        const B = v0 + omega * x0;
        const aB = Math.abs(B);
        const cA = Math.abs(A);
        const cV = Math.abs(B - omega * A);
        onset = 1 / omega;
        bound = (t) => {
            const d = Math.exp(-omega * t);
            return [d * (cA + aB * t), d * (cV + omega * aB * t)];
        };
    } else {
        const disc = omega * Math.sqrt(zeta * zeta - 1);
        const r1 = -zeta * omega + disc;
        const r2 = -zeta * omega - disc;
        const A = (v0 - r2 * x0) / (r1 - r2);
        const B = x0 - A;
        bound = (t) => {
            const e1 = Math.abs(A) * Math.exp(r1 * t);
            const e2 = Math.abs(B) * Math.exp(r2 * t);
            return [e1 + e2, e1 * -r1 + e2 * -r2];
        };
    }
    const boundInside = (t: number): boolean => {
        const [ex, ev] = bound(t);
        return ex < eps && ev < epsV;
    };

    // ── Horizon: the first H (from `onset`) past which the bound keeps the
    // spring inside. Double, then bisect.
    let lo = onset;
    let H = Math.max(response, onset);
    while (!boundInside(H)) {
        if (H > HORIZON_CAP * response) return Infinity;
        lo = H;
        H *= 2;
    }
    for (let i = 0; i < 30; i++) {
        const mid = (lo + H) / 2;
        if (boundInside(mid)) H = mid;
        else lo = mid;
    }

    // ── Backward scan on the closed form: the last sample outside the envelope.
    const out = { x: 0, v: 0 };
    const outside = (t: number): boolean => {
        solvePreparedDampedHarmonic(
            x0,
            v0,
            prepareDampedHarmonic(omega, zeta, omegaD, t),
            out,
        );
        return !(Math.abs(out.x) < eps && Math.abs(out.v) < epsV);
    };
    const h = response / SCAN_DIVISIONS;
    let hi = H;
    let t = H - h;
    while (t > 0 && !outside(t)) {
        hi = t;
        t -= h;
    }
    if (t <= 0) {
        if (!outside(0)) return 0;
        t = 0;
    }
    // Bracket [t outside, hi inside]: bisect to the exit.
    let a = t;
    let b = hi;
    for (let i = 0; i < 40; i++) {
        const mid = (a + b) / 2;
        if (outside(mid)) a = mid;
        else b = mid;
    }
    return b;
}
