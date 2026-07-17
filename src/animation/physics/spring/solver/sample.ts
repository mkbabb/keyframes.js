/**
 * `physics/spring/solver/sample.ts` — the normalized-spring sampler shared by the two
 * CSS serializers (R.W1 §spring; the closed-form kernel split to `./solver` at
 * R.W2c).
 *
 *  - {@link sampleNormalizedSpring} — the normalized `(target=1, initial=0)`
 *    response-curve sampler `springLinearStops` + `springTimingFunction` both
 *    drive. Dedups the `new SpringProgress(...) → set target → _stepSeconds`
 *    setup that was copied into both serializers.
 *
 * The closed-form analytic step (`solveDampedHarmonic`) the scalar tracker
 * drives once per frame lives in the dependency-free `./solver` leaf, which both
 * `progress.ts` and this module read — that split inverts the former
 * `progress.ts ↔ sample.ts` runtime ring (R.W2c).
 *
 * value.js-free (LIGHT) — plain Math.
 */
import { SpringProgress } from "../progress";

/** Inputs to the normalized-spring sampler shared by the two serializers. */
interface NormalizedSpringSampleOptions {
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
