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
     * Starting velocity in travel/s on the spring's clock (the curve runs
     * 0 → 1). Default 0 — the unseeded curve.
     */
    initialVelocity?: number;
    /**
     * Per-step `dt` in SECONDS. The two serializers space their points
     * differently (`springLinearStops` over `sampleCount+1` sub-intervals,
     * `springTimingFunction` over `sampleCount`), so the caller passes the exact
     * step — the construct/step/settle-pin loop is the only shared part.
     */
    dt: number;
}

/** Finest seeded-head knot: `dt / 2^HEAD_DEPTH`. */
const HEAD_DEPTH = 12;
/** The head's first chord must leave at `initialVelocity` to within this fraction. */
const HEAD_TOLERANCE = 0.02;

/** A sampled normalized spring: its evenly spaced positions and its seeded head. */
interface NormalizedSpringSamples {
    /** The position after each `dt` step (pinned to `1` once settled). */
    positions: number[];
    /**
     * Extra knots inside the FIRST step, as `[fraction of dt, position]` with
     * fractions `2^-k` ascending — empty unless `initialVelocity ≠ 0`. A
     * piecewise-linear curve (`linear()`, a lerped LUT) leaves u = 0 at its
     * first chord's slope; over a whole step that chord falls far short of a
     * seeded start, which bends hard (a reversal), so the head halves the first
     * step until its first chord leaves at `initialVelocity` (within 2 %, or
     * down to `dt / 4096`).
     */
    head: Array<[number, number]>;
}

/**
 * Step a normalized `SpringProgress(target=1, initial=0)` solver `sampleCount`
 * times by `dt` SECONDS, returning the spring position at each interior step
 * (pinned to `1` once settled), plus the seeded head knots inside the first
 * step. The implicit `0` start and `1` end stops are NOT included — the caller
 * frames them. This is the ONE sampler SETUP `springLinearStops` +
 * `springTimingFunction` share (R.W1 §spring): the same
 * `(response, dampingFraction)` solver, the same step loop, the same settle pin —
 * so the two serializers describe ONE curve. (Only the per-step `dt` differs,
 * passed in by each.) With `initialVelocity` 0 the step sequence, and so every
 * position, is exactly the unseeded one.
 */
export function sampleNormalizedSpring(
    opts: NormalizedSpringSampleOptions,
): NormalizedSpringSamples {
    const v0 = opts.initialVelocity ?? 0;
    const spring = new SpringProgress({
        response: opts.response,
        dampingFraction: opts.dampingFraction,
        initial: 0,
        initialVelocity: v0,
        settleThreshold: opts.settleThreshold,
        velocitySettleThreshold: opts.settleThreshold,
    });
    // Re-seat from (0, initialVelocity) toward the target.
    spring.target = 1;
    const read = (): number => (spring.settled ? 1 : spring.value);

    // The seeded head: knots at dt·2^-k, k = HEAD_DEPTH … 1, on the same spring.
    let head: Array<[number, number]> = [];
    let t = 0;
    if (v0 !== 0) {
        for (let k = HEAD_DEPTH; k >= 1; k--) {
            const f = 2 ** -k;
            spring._stepSeconds(f * opts.dt - t);
            t = f * opts.dt;
            head.push([f, read()]);
        }
    }

    const positions: number[] = [];
    for (let i = 1; i <= opts.sampleCount; i++) {
        spring._stepSeconds(opts.dt - t);
        t = 0;
        positions.push(read());
    }
    spring.dispose();

    if (head.length > 0) {
        // Keep the head from its coarsest knot whose chord leaves at v0.
        const leaves = (f: number, x: number): boolean =>
            Math.abs(x / (f * opts.dt) - v0) <= HEAD_TOLERANCE * Math.abs(v0);
        if (positions.length > 0 && leaves(1, positions[0]!)) head = [];
        else {
            let keep = 0;
            for (let j = head.length - 1; j >= 0; j--) {
                if (leaves(head[j]![0], head[j]![1])) {
                    keep = j;
                    break;
                }
            }
            head = head.slice(keep);
        }
    }
    return { positions, head };
}
