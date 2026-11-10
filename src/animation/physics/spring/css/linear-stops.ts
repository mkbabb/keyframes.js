import { sampleNormalizedSpring } from "../solver/sample";
import { resolveSpringSpan } from "./span";

/**
 * Options for sampling a spring response curve into CSS `linear()` stops.
 */
export interface SpringLinearStopsOptions {
    /** Angular period of oscillation in seconds. */
    response: number;
    /** Damping ratio ζ. */
    dampingFraction: number;
    /**
     * Number of intermediate sample points. Default 24. The emitted
     * string also includes the implicit `0` start and `1` end stops,
     * so the total stop count is `sampleCount + 2`.
     */
    sampleCount?: number;
    /**
     * Position + velocity envelope below which the spring is treated
     * as settled and sampling stops early (subsequent positions are
     * pinned to 1). Default 1e-3. Increase for shorter `linear()`
     * strings on overdamped springs (which take longer to settle).
     */
    settleThreshold?: number;
    /**
     * Upper bound on the sampled time span in seconds. Default 4 ×
     * response (covers ~99% of the envelope for ζ ≥ 0.3). Increase
     * if a very-underdamped spring (ζ < 0.3) is being sampled and
     * the tail keeps ringing past the default cap. `"settle"` spans the
     * spring's own `settleTime` under `settleThreshold`, so the
     * pinned end stop jumps by at most `settleThreshold`; it throws a
     * `RangeError` for an undamped spring (ζ = 0).
     */
    maxDuration?: number | "settle";
    /**
     * Starting velocity, travel/s on the spring's clock (travel = this
     * leg's distance, so the curve runs 0 → 1). `> 0` is already moving
     * toward the target; `< 0` is still heading away. Default 0 (the
     * unseeded curve).
     */
    initialVelocity?: number;
}

/**
 * Sample a `SpringProgress(target=1, initial=0)` solver and emit a CSS
 * `linear()` timing-function string. Suitable for
 * `transition-timing-function` / `animation-timing-function` / token
 * generation (the four `--spring-*` glass-ui tokens regenerate from
 * this helper).
 *
 * The emitted curve passes through `(0%, 0)` and `(100%, 1)` exactly.
 * Intermediate stops carry the unitless spring position; values may
 * exceed 1 (overshoot) for ζ < 1, which CSS `linear()` honors natively.
 *
 * @returns e.g. `"linear(0, 0.234 4.17%, ..., 1)"`
 */
export function springLinearStops(opts: SpringLinearStopsOptions): string {
    const sampleCount = opts.sampleCount ?? 24;
    const settleThreshold = opts.settleThreshold ?? 1e-3;
    const maxDuration = resolveSpringSpan(opts);

    // The shared normalized-spring sampler (R.W1 §spring): construct → target=1
    // → step the solver. `springLinearStops` spaces its points over
    // `sampleCount + 1` sub-intervals (the implicit 0 + 1 frame the interior).
    const positions = sampleNormalizedSpring({
        response: opts.response,
        dampingFraction: opts.dampingFraction,
        sampleCount,
        settleThreshold,
        initialVelocity: opts.initialVelocity ?? 0,
        dt: maxDuration / (sampleCount + 1),
    });

    const stops: string[] = ["0"];
    for (let i = 1; i <= sampleCount; i++) {
        const pct = (i / (sampleCount + 1)) * 100;
        const v = positions[i - 1]!;
        stops.push(`${v.toFixed(5)} ${pct.toFixed(3)}%`);
    }

    stops.push("1");
    return `linear(${stops.join(", ")})`;
}

/** Round to 5 decimals — the `linear()` stop-value / percentage quantization. */
const round5 = (n: number): number => Math.round(n * 1e5) / 1e5;

/**
 * KF-3 — serialize evenly spaced curve samples to a CSS `linear()` easing:
 * `samples[i]` becomes the stop `value (i / (n - 1) · 100)%`, values and
 * percentages quantized to 5 decimals. Positions are explicit and strictly
 * monotone, so the string is always grammar-valid, and overshoot values outside
 * `[0, 1]` ride through (CSS `linear()` permits them). The ONE `linear()`
 * densify serializer: {@link springTimingLUT}'s table and the compile tier's
 * universal `TimingFunction` CSS twin both emit through it.
 *
 * @example
 * linearFromSamples(springTimingLUT({ response: 0.5, dampingFraction: 0.45 }));
 */
export function linearFromSamples(samples: ArrayLike<number>): string {
    const n = samples.length - 1;
    if (n < 1) {
        throw new RangeError(
            `linearFromSamples needs at least 2 samples; got ${samples.length}.`,
        );
    }
    const stops: string[] = [];
    for (let i = 0; i <= n; i++) {
        stops.push(`${round5(samples[i]!)} ${round5((i / n) * 100)}%`);
    }
    return `linear(${stops.join(", ")})`;
}
