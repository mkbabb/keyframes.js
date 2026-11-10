/**
 * `physics/spring/css/span.ts` — the one resolver for a sampled spring curve's
 * time span (`maxDuration`), shared by `springTimingLUT`, `springLinearStops`
 * and `springTimingFunction` so `.fn` and `.css` always sample the same span.
 *
 * value.js-free (LIGHT) — plain Math.
 */
import { settleTime } from "../solver/settle";

/** The span inputs a sampled spring curve carries. */
interface SpringSpanOptions {
    response: number;
    dampingFraction: number;
    initialVelocity?: number;
    settleThreshold?: number;
    maxDuration?: number | "settle";
}

/**
 * Resolve a curve's span in seconds: a given number passes through unchanged,
 * the default is `4 × response`, and `"settle"` is the spring's own
 * `settleTime` under the curve's envelope (its `settleThreshold` on both
 * position and velocity — the envelope the sampler already uses).
 *
 * @internal
 */
export function resolveSpringSpan(opts: SpringSpanOptions): number {
    if (opts.maxDuration !== "settle") return opts.maxDuration ?? opts.response * 4;
    const s = opts.settleThreshold ?? 1e-3;
    const span = settleTime({
        response: opts.response,
        dampingFraction: opts.dampingFraction,
        initialVelocity: opts.initialVelocity ?? 0,
        settleThreshold: s,
        velocitySettleThreshold: s,
    });
    if (span === Infinity) {
        throw new RangeError(
            "an undamped spring never settles; pass a finite maxDuration",
        );
    }
    return span;
}
