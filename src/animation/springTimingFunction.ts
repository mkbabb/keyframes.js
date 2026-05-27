import type { TimingFunction } from "./constants";
import { SpringProgress } from "./spring";

/**
 * Options for sampling a spring response curve into a callable
 * `TimingFunction`. Mirrors `SpringLinearStopsOptions` so the same
 * preset (`response`, `dampingFraction`, ...) produces an identical
 * curve whether emitted as a CSS `linear()` string or a JS easing.
 */
export interface SpringTimingFunctionOptions {
    /** Angular period of oscillation in seconds. */
    response: number;
    /** Damping ratio ζ. `< 1` overshoots/rings; `≥ 1` monotone. */
    dampingFraction: number;
    /**
     * Number of intermediate sample points between t=0 and t=1.
     * Default 64 — higher than `springLinearStops` (24) because the
     * lerp between samples is the only smoothing a JS easing gets,
     * whereas CSS `linear()` is consumed at sub-pixel cadence.
     */
    sampleCount?: number;
    /**
     * Position + velocity envelope below which the spring is treated
     * as settled (subsequent positions pin to 1). Default 1e-3.
     */
    settleThreshold?: number;
    /**
     * Upper bound on the sampled time span in seconds — the spring
     * time that normalized `t = 1` maps to. Default 4 × response
     * (covers ~99% of the envelope for ζ ≥ 0.3). Increase for very
     * underdamped springs (ζ < 0.3) whose tail rings past the cap.
     */
    maxDuration?: number;
}

/**
 * Sample a `SpringProgress(target=1, initial=0)` solver and return a
 * pure `TimingFunction` — `(t: number) => number` over t∈[0,1] — that
 * `ElementMorph`, `NumericAnimation`, and `Animation.addFrame` accept
 * directly (anywhere a `TimingFunction` is taken).
 *
 * This is the JS-easing sibling of `springLinearStops`: same solver,
 * same `(response, dampingFraction)` surface, same default
 * `maxDuration = response * 4`. Where `springLinearStops` emits a CSS
 * `linear()` string for stylesheets/tokens, this returns a closure for
 * code paths that drive interpolation directly and cannot consume a
 * `linear()` string.
 *
 * The returned curve satisfies `f(0) = 0` and `f(1) = 1` exactly.
 * Interior values may exceed 1 for ζ < 1 (overshoot) — e.g. the bouncy
 * `response 0.5 / ζ 0.45` preset peaks at ≈ 1.205 mid-curve — which is
 * the whole point: feeding this into `ElementMorph` produces the
 * canonical iOS spring overshoot without hand-rolling stops or a
 * second ODE integrator.
 *
 * @example
 * const spring = springTimingFunction({ response: 0.5, dampingFraction: 0.45 });
 * const morph = new ElementMorph(from, to, { timingFunction: spring });
 */
export function springTimingFunction(
    opts: SpringTimingFunctionOptions,
): TimingFunction {
    const sampleCount = opts.sampleCount ?? 64;
    const settleThreshold = opts.settleThreshold ?? 1e-3;
    const maxDuration = opts.maxDuration ?? opts.response * 4;

    // Reuse the existing analytic solver — the same one
    // `springLinearStops` drives. No second integrator.
    const spring = new SpringProgress({
        response: opts.response,
        dampingFraction: opts.dampingFraction,
        initial: 0,
        settleThreshold,
        velocitySettleThreshold: settleThreshold,
    });
    spring.target = 1;

    // samples[i] is the spring position at normalized t = i / sampleCount.
    const samples = new Float64Array(sampleCount + 1);
    samples[0] = 0;
    const dt = maxDuration / sampleCount;
    for (let i = 1; i <= sampleCount; i++) {
        spring.tick(dt);
        samples[i] = spring.settled ? 1 : spring.value;
    }
    // Pin the final sample to the settled target so f(1) === 1 exactly.
    samples[sampleCount] = 1;
    spring.dispose();

    return (t: number): number => {
        if (t <= 0) return 0;
        if (t >= 1) return 1;
        const x = t * sampleCount;
        const i = Math.floor(x);
        const frac = x - i;
        const a = samples[i]!;
        const b = samples[i + 1]!;
        return a + (b - a) * frac;
    };
}
