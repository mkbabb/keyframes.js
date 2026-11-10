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
/** Halvings of one scan interval before an exit is ruled out (h / 2^20). */
const LEAF_DEPTH = 20;
/** Horizon cap, as a multiple of `response`: beyond it the spring never settles. */
const HORIZON_CAP = 2 ** 32;

/**
 * Seconds on the spring's own clock until the normalised step response (from 0
 * to a target of 1, starting at `initialVelocity` travel/s) enters the rest
 * envelope `|x − 1| < settleThreshold ∧ |v| < velocitySettleThreshold` and stays
 * there: the LAST time it is outside. After it, the spring never leaves.
 *
 * Pass `velocitySettleThreshold: Infinity` for an envelope on position alone.
 * Returns `Infinity` when the solver's trajectory never settles: an undamped
 * spring (ζ = 0) that starts outside the envelope, or one damped so hard
 * (ζ ≳ 1e8) that the solver's slow root rounds to 0 in floating point and the
 * spring never moves. An exit is found down to `response / 2^32` s. Pure and
 * server-safe; reduced motion is not an input.
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
    if (!(zeta >= 0) || !Number.isFinite(zeta)) {
        throw new RangeError(`settleTime: dampingFraction must be finite and >= 0; got ${zeta}.`);
    }
    if (!(eps > 0) || !Number.isFinite(eps)) {
        throw new RangeError(`settleTime: settleThreshold must be finite and > 0; got ${eps}.`);
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
    // sup of the bound over [t, t + w]; the bound itself where it never rises.
    let supBound: (t: number, w: number) => [number, number] = (t) => bound(t);
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
        // e^{−ωs}(c + k·s) ≤ e^{−ωt}(c + k·(t + w)) for s ∈ [t, t + w].
        supBound = (t, w) => {
            const d = Math.exp(-omega * t);
            return [d * (cA + aB * (t + w)), d * (cV + omega * aB * (t + w))];
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

    // ── Backward scan on the closed form for the LAST exit. A sample alone
    // cannot see an exit between samples, so each interval [a, a + w] is
    // CERTIFIED inside from x(a), v(a) and the decay bound's sup over it
    // (|x| grows by at most w·sup|v|, |v| by at most w·sup|a|, with
    // |a| ≤ ω²|x| + 2ζω|v|), and halved where it cannot be.
    const out = { x: 0, v: 0 };
    const solve = (t: number): void => {
        solvePreparedDampedHarmonic(
            x0,
            v0,
            prepareDampedHarmonic(omega, zeta, omegaD, t),
            out,
        );
    };
    const outside = (t: number): boolean => {
        solve(t);
        return !(Math.abs(out.x) < eps && Math.abs(out.v) < epsV);
    };
    const certified = (a: number, w: number): boolean => {
        solve(a);
        const [sx, sv] = supBound(a, w);
        const sa = omega * omega * sx + 2 * zeta * omega * sv;
        return Math.abs(out.x) + w * sv < eps && Math.abs(out.v) + w * sa < epsV;
    };
    // The rightmost leaf [a, b] of [lo, hi] whose left end is outside (b is
    // inside, and so is everything after it), or null when [lo, hi] is inside.
    const lastLeaf = (lo: number, hi: number, depth: number): [number, number] | null => {
        if (certified(lo, hi - lo)) return null;
        if (depth === 0) return outside(lo) ? [lo, hi] : null;
        const mid = (lo + hi) / 2;
        return lastLeaf(mid, hi, depth - 1) ?? lastLeaf(lo, mid, depth - 1);
    };
    const h = response / SCAN_DIVISIONS;
    for (let b = H; b > 0; ) {
        const a = Math.max(0, b - h);
        const leaf = lastLeaf(a, b, LEAF_DEPTH);
        if (leaf) {
            // Bracket [outside, inside]: bisect to the exit.
            let [lo, hi] = leaf;
            for (let i = 0; i < 40; i++) {
                const mid = (lo + hi) / 2;
                if (outside(mid)) lo = mid;
                else hi = mid;
            }
            return hi;
        }
        b = a;
    }
    return 0;
}
