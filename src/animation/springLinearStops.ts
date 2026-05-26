import { SpringProgress } from "./spring";

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
     * the tail keeps ringing past the default cap.
     */
    maxDuration?: number;
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
    const maxDuration = opts.maxDuration ?? opts.response * 4;

    const spring = new SpringProgress({
        response: opts.response,
        dampingFraction: opts.dampingFraction,
        initial: 0,
        settleThreshold,
        velocitySettleThreshold: settleThreshold,
    });
    spring.target = 1;

    const stops: string[] = ["0"];
    const dt = maxDuration / (sampleCount + 1);

    for (let i = 1; i <= sampleCount; i++) {
        spring.tick(dt);
        const pct = (i / (sampleCount + 1)) * 100;
        const v = spring.settled ? 1 : spring.value;
        stops.push(`${v.toFixed(5)} ${pct.toFixed(3)}%`);
    }

    stops.push("1");
    spring.dispose();
    return `linear(${stops.join(", ")})`;
}
