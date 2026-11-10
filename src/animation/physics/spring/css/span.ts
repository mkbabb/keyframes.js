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
 * the default is `4 × response`, and `"settle"` is exactly
 * `settleTime(opts)` — the same options, the same envelope (`settleThreshold`
 * on position, `settleTime`'s default on velocity) — so a consumer reads the
 * span a `"settle"` curve uses by calling `settleTime` with the options it
 * passed the curve.
 *
 * @internal
 */
export function resolveSpringSpan(opts: SpringSpanOptions): number {
    if (opts.maxDuration !== "settle") return opts.maxDuration ?? opts.response * 4;
    const span = settleTime({
        response: opts.response,
        dampingFraction: opts.dampingFraction,
        ...(opts.initialVelocity !== undefined && { initialVelocity: opts.initialVelocity }),
        ...(opts.settleThreshold !== undefined && { settleThreshold: opts.settleThreshold }),
    });
    if (span === Infinity) {
        throw new RangeError(
            opts.dampingFraction === 0
                ? 'maxDuration "settle": an undamped spring never settles; pass a finite maxDuration.'
                : 'maxDuration "settle": this spring never settles in floating-point arithmetic (damped so hard ' +
                      "its slow root rounds to 0); pass a finite maxDuration.",
        );
    }
    if (!(span > 0)) {
        throw new RangeError(
            'maxDuration "settle": the spring starts at rest inside settleThreshold, so there is ' +
                "no span to take; pass a finite maxDuration.",
        );
    }
    return span;
}
