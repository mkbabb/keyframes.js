/**
 * The spring-from-duration surface — the modern, time-based `{ visualDuration |
 * duration, bounce }` idiom Motion now leads its docs with, and its pure
 * translation to the canonical `(response, dampingFraction)` pair. ONE cohesive
 * construction-time concern, lifted off the `SpringProgress` module so the spring
 * tracker stays under the library ceiling.
 *
 * LIGHT (parser-free): it reads Value's `/math` `clamp` through the internal
 * leaves and the `SpringProgressOptions` type + the default response from
 * `./types` (NOT `./progress` — the R.W1 ring-break) — no value.js edge, so the
 * static boundary `proof:boundary` stays unbreached. progress.ts re-exports the
 * public `SpringDurationOptions` type and imports `durationToSpringOptions` back
 * for `SpringProgress.fromDuration`, so every consumer resolves the surface
 * through the spring barrel exactly as before; ZERO behaviour change.
 */
import { clamp } from "../../../internal/leaves";
import { DEFAULT_SPRING_RESPONSE, type SpringProgressOptions } from "../types";

/**
 * The modern, time-based spring surface — the idiom Motion now leads its
 * docs with, treating `(response, dampingFraction)` as the advanced
 * fallback. A pure parameter translation: `response = visualDuration` and
 * `dampingFraction = 1 − bounce` (clamped). The solver, the `linear()`
 * sampler, and the live re-seat are unchanged — this is a construction-time
 * alternate surface, zero hot-path cost.
 *
 * Exactly one of `visualDuration` / `duration` selects the perceptual
 * settle time (the period mapped onto `response`); `bounce` ∈ [−1, 1]
 * selects overshoot (`0` ≈ critically damped, `> 0` rings, `< 0`
 * overdamped). The remaining {@link SpringProgressOptions} keys
 * (`initial`, `initialVelocity`, thresholds, `respectReducedMotion`)
 * carry through unchanged.
 */
export interface SpringDurationOptions
    extends Partial<
        Pick<
            SpringProgressOptions,
            | "initial"
            | "initialVelocity"
            | "settleThreshold"
            | "velocitySettleThreshold"
            | "respectReducedMotion"
        >
    > {
    /**
     * The perceptual settle duration in seconds — mapped directly onto
     * `response`. The designer-facing name for the same quantity.
     */
    visualDuration?: number;
    /**
     * Alias of {@link visualDuration} (the Motion `duration` key). When
     * both are supplied, `visualDuration` wins. Default 0.5.
     */
    duration?: number;
    /**
     * Overshoot, in [−1, 1]. `0` maps to critically damped (no ring),
     * `> 0` rings (underdamped), `< 0` is overdamped (sluggish). Mapped
     * `dampingFraction = 1 − bounce`. Default 0.
     */
    bounce?: number;
}

/**
 * Translate the time-based `{ visualDuration | duration, bounce }` surface
 * to the canonical `(response, dampingFraction)` pair — the documented
 * Motion mapping. `response = visualDuration`; `dampingFraction = 1 −
 * bounce`, with `bounce` clamped to `[−1, 1]` (so `dampingFraction` lands
 * in `[0, 2]`). Returns a `Partial<SpringProgressOptions>` the standard
 * constructor consumes directly — there is no second code path.
 */
export function durationToSpringOptions(
    opts: SpringDurationOptions,
): Partial<SpringProgressOptions> {
    const {
        visualDuration,
        duration,
        bounce = 0,
        ...passthrough
    } = opts;
    const response = visualDuration ?? duration ?? DEFAULT_SPRING_RESPONSE;
    const dampingFraction = 1 - clamp(bounce, -1, 1);
    return { ...passthrough, response, dampingFraction };
}
