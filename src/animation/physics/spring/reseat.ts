/**
 * The K.W11 PHYS-B2 velocity-continuous interruption seam — the finite-differenced
 * re-seat that makes a keyframe-stream interruption velocity-continuous, lifted
 * off the `SpringProgress` module so the spring tracker stays under the library
 * ceiling. ONE cohesive concern: measure the instantaneous velocity of a parsed-
 * CSS (or any positional) interp stream from a two-sample window, then seed a
 * fresh {@link SpringProgress} at the CURRENT position with that MEASURED velocity.
 *
 * LIGHT (value.js-free): it composes ONLY the `SpringProgress` class beside it (a
 * `./progress` import — never value.js) + the shared option type from `./types`
 * and a leaf finite difference, so the static boundary `proof:boundary` is
 * unbreached. The spring barrel re-exports these public symbols (`VelocityProbe`
 * / `probeVelocity` / `reseatToSpring`) so every consumer resolves them through
 * the barrel exactly as before; ZERO behaviour change.
 */
import { SpringProgress } from "./progress";
import type { SpringProgressOptions } from "./types";

/**
 * A two-sample window over a position stream — the last two `(value, time)`
 * the engine emitted before an interruption (K.W11 PHYS-B2). `time` is in
 * MILLISECONDS (the engine's `effectiveT` clock); `value` is the interpolated
 * scalar of the animated property at that time. The finite difference
 * `(curr.value − prev.value) / ((curr.time − prev.time) / 1000)` is the
 * measured velocity in units/SECOND — the one place a numerical derivative is
 * correct, because a keyframe stream carries NO analytic velocity.
 */
export interface VelocityProbe {
    /** The earlier sample `(value, time-ms)`. */
    prev: { value: number; time: number };
    /** The later sample `(value, time-ms)` — the interruption position. */
    curr: { value: number; time: number };
}

/**
 * Measure the instantaneous velocity (units/SECOND) of a position stream from
 * a two-sample {@link VelocityProbe} (K.W11 PHYS-B2). The forward difference
 * `(curr − prev) / dt` with `dt` in seconds. A zero / negative `dt` (two
 * samples at the same frame, or out-of-order) yields `0` — no division blow-up,
 * a stationary read.
 */
export function probeVelocity(probe: VelocityProbe): number {
    const dtMs = probe.curr.time - probe.prev.time;
    if (dtMs <= 0) return 0;
    return (probe.curr.value - probe.prev.value) / (dtMs / 1000);
}

/**
 * Velocity-continuous interruption of a parsed-CSS (or any positional)
 * animation, re-served as a spring (K.W11 PHYS-B2 — the only-kf seam).
 *
 * At interruption the engine path carries a POSITION (`effectiveT` → the
 * interpolated value) but NO velocity — a keyframe stream has no analytic
 * derivative. This finite-differences the interp stream over the last frame
 * (the {@link VelocityProbe}: the two most recent `(value, time)` samples), then
 * seeds a fresh {@link SpringProgress} at the CURRENT position
 * (`probe.curr.value`) with that MEASURED velocity, targeting `newTarget`. The
 * first post-interruption frames therefore continue the prior direction and
 * speed within ε — no visible kink — instead of restarting from rest.
 *
 * The spring's `linear()` twin (`springTimingFunction` / `springLinearStops`)
 * is the SAME kf-internal emitter the compiler consumes, so the reseated
 * transition is round-trippable: the velocity-continuous interruption composes
 * INTO the round-trip rather than forfeiting it.
 *
 * Pure construction — no DOM, no rAF until the returned spring is `.play()`ed
 * or `tickDt`-driven. value.js-free (LIGHT): it composes only `SpringProgress`
 * and the leaf finite difference.
 *
 * @param probe     The two most recent `(value, time-ms)` samples of the
 *                  interrupted stream (`prev` then `curr`, the interruption
 *                  position).
 * @param newTarget The value the spring transitions toward.
 * @param options   Spring config (`response` / `dampingFraction` / thresholds /
 *                  `respectReducedMotion`); `initial` and `initialVelocity` are
 *                  IGNORED — they are seeded from the probe.
 * @returns A `SpringProgress` seeded at `(probe.curr.value, measured velocity)`,
 *          targeting `newTarget`.
 */
export function reseatToSpring(
    probe: VelocityProbe,
    newTarget: number,
    options?: Partial<
        Omit<SpringProgressOptions, "initial" | "initialVelocity">
    >,
): SpringProgress {
    const velocity = probeVelocity(probe);
    const spring = new SpringProgress({
        ...options,
        initial: probe.curr.value,
        initialVelocity: velocity,
    });
    // Re-seat onto the new target from the measured `(x, v)` — the closed-form
    // solution is continuous (origin = current position, origin velocity =
    // the measured velocity), so the trajectory leaves at the prior speed.
    spring.target = newTarget;
    return spring;
}
