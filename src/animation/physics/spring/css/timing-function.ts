import type { Easing, TimingFunction } from "../../../constants/types";
import { sampleNormalizedSpring } from "../solver/sample";
import {
    springLinearStops,
    type SpringLinearStopsOptions,
} from "./linear-stops";
import { resolveSpringSpan } from "./span";

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
     * `"settle"` spans the spring's own `settleTime` under
     * `settleThreshold`, so the pinned `fn(1) = 1` jumps by at most
     * `settleThreshold`; it throws a `RangeError` for an undamped spring
     * (ζ = 0).
     */
    maxDuration?: number | "settle";
    /**
     * Starting velocity, travel/s on the spring's clock (travel = this
     * leg's distance, so the curve runs 0 → 1). `> 0` is already moving
     * toward the target; `< 0` is still heading away. Default 0 (the
     * unseeded curve). Time on the curve is `u = t / maxDuration`, so the
     * slope at `u = 0` is `initialVelocity × maxDuration`.
     */
    initialVelocity?: number;
}

/**
 * KF-3 (atlas A2(b)) — the sampled look-up-table form of
 * {@link springTimingFunction}: `sampleCount + 1` spring positions at the evenly
 * spaced normalized times `t = i / sampleCount`, with `lut[0] = 0` and
 * `lut[sampleCount] = 1` exactly. Built for per-frame and many-mark consumers
 * (an ECharts series, a canvas of marks, a CSS `linear()` via
 * {@link linearFromSamples}) that want the samples themselves rather than a
 * callable. This IS the table `springTimingFunction` interpolates — one sampler,
 * one solver — so `springTimingFunction(opts).fn(i / n) === lut[i]`.
 *
 * @example
 * const lut = springTimingLUT({ response: 0.5, dampingFraction: 0.45, sampleCount: 120 });
 * const css = linearFromSamples(lut); // "linear(0 0%, … , 1 100%)"
 */
export function springTimingLUT(opts: SpringTimingFunctionOptions): Float64Array {
    const sampleCount = opts.sampleCount ?? 64;
    const settleThreshold = opts.settleThreshold ?? 1e-3;
    const maxDuration = resolveSpringSpan(opts);

    // Reuse the shared normalized-spring sampler — the same construct/step setup
    // `springLinearStops` drives (R.W1 §spring). No second integrator. The LUT
    // spaces its `sampleCount` interior points over `sampleCount`
    // sub-intervals; `samples[i]` is the position at normalized t = i / sampleCount.
    const positions = sampleNormalizedSpring({
        response: opts.response,
        dampingFraction: opts.dampingFraction,
        sampleCount,
        settleThreshold,
        initialVelocity: opts.initialVelocity ?? 0,
        dt: maxDuration / sampleCount,
    });
    const samples = new Float64Array(sampleCount + 1);
    samples[0] = 0;
    for (let i = 1; i <= sampleCount; i++) {
        samples[i] = positions[i - 1]!;
    }
    // Pin the final sample to the settled target so f(1) === 1 exactly.
    samples[sampleCount] = 1;
    return samples;
}

/**
 * Sample a `SpringProgress(target=1, initial=0)` solver and return a typed
 * {@link Easing}: `.fn` is the callable curve — `(t: number) => number`
 * over t∈[0,1] — that `ElementMorph`, `NumericAnimation`, and
 * `Animation.addFrame` accept directly, and `.css` is the CSS `linear()`
 * string that reproduces it (same solver, same preset), so a WAAPI
 * delegation runs the true overshoot/settle on the compositor.
 *
 * This is the JS-easing sibling of `springLinearStops`: same solver,
 * same `(response, dampingFraction)` surface, same default
 * `maxDuration = response * 4`. Where `springLinearStops` emits a CSS
 * `linear()` string for stylesheets/tokens, this returns the typed pair
 * for code paths that drive interpolation directly.
 *
 * The curve satisfies `fn(0) = 0` and `fn(1) = 1` exactly. Interior
 * values may exceed 1 for ζ < 1 (overshoot) — e.g. the bouncy
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
): Easing {
    // Resolve the span once, so `.fn` and `.css` sample the same one.
    const maxDuration = resolveSpringSpan(opts);
    const samples = springTimingLUT({ ...opts, maxDuration });
    const sampleCount = samples.length - 1;

    const fn: TimingFunction = (t: number): number => {
        if (t <= 0) return 0;
        if (t >= 1) return 1;
        const x = t * sampleCount;
        const i = Math.floor(x);
        const frac = x - i;
        const a = samples[i]!;
        const b = samples[i + 1]!;
        return a + (b - a) * frac;
    };

    // Pair the callable with its CSS `linear()` equivalent (same solver,
    // same preset) as a typed Easing, so an `Animation` eased by this spring
    // can run the real overshoot/settle on the compositor via WAAPI instead
    // of falling back to bare `linear`. The JS easing and the CSS string
    // describe ONE curve — and the pairing flows through the type system,
    // not a Symbol tag that wrapping/binding would silently drop.
    const stopOpts: SpringLinearStopsOptions = {
        response: opts.response,
        dampingFraction: opts.dampingFraction,
        maxDuration,
    };
    if (opts.settleThreshold !== undefined)
        stopOpts.settleThreshold = opts.settleThreshold;
    if (opts.initialVelocity !== undefined)
        stopOpts.initialVelocity = opts.initialVelocity;
    return { fn, css: springLinearStops(stopOpts) };
}
