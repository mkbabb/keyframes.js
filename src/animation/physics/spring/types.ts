/**
 * The spring family's shared types + the one canonical default — the ring-break
 * (R.W1, lib-spring §3). `progress.ts` (the SpringProgress class), `duration.ts`
 * (the spring-from-duration surface), and `reseat.ts` (the velocity-continuous
 * interruption seam) all read `SpringProgressOptions` / `DEFAULT_SPRING_RESPONSE`
 * from HERE rather than from each other, dissolving the
 * progress↔duration↔reseat circular import ring.
 */
import type { ReducedMotionPolicy } from "../../internal/reduced-motion";

/**
 * iOS-style spring physics options. The pair `(response, dampingFraction)`
 * is the SwiftUI-canonical surface — designer-tunable, normalized so
 * `dampingFraction = 1` is critically damped (no overshoot), `< 1` rings,
 * `> 1` is overdamped (sluggish). Internally these map onto a standard
 * second-order linear ODE
 *
 *   x'' + 2ζω₀ x' + ω₀² x = ω₀² target
 *
 * with `ω₀ = 2π / response` and `ζ = dampingFraction`, unit mass.
 */
export interface SpringProgressOptions {
    /**
     * Angular period of the oscillation in seconds. Roughly the time the
     * spring takes to swing through one cycle if undamped. Default 0.5.
     * Smaller values → snappier; larger → looser.
     */
    response: number;
    /**
     * Damping ratio ζ. `1` critically damped (fastest no-overshoot);
     * `< 1` underdamped (rings); `> 1` overdamped (sluggish). Default
     * 0.86 — the iOS "smooth" preset.
     */
    dampingFraction: number;
    /** Starting position. Default 0. */
    initial: number;
    /** Starting velocity (units/s). Default 0. */
    initialVelocity: number;
    /**
     * Position settle threshold. When |x - target| AND |v| both drop
     * below `settleThreshold` and `velocitySettleThreshold` respectively,
     * the spring snaps to target and stops integrating. Default 1e-3.
     */
    settleThreshold: number;
    /** Velocity settle threshold (units/s). Default 1e-3. */
    velocitySettleThreshold: number;
    /**
     * Honor `prefers-reduced-motion: reduce` (K.W11 PHYS-E — the
     * intensity-scaled, WCAG 2.3.3-aligned gate):
     *
     * - `false` (default) — ignore the preference; the spring runs at full
     *   amplitude.
     * - `true` — the classic binary snap: under an active query the spring
     *   jumps to target at zero velocity (amplitude scale `0`). SSR-safe.
     * - a `number` ∈ [0, 1] — the AMPLITUDE INTENSITY: under an active query
     *   the spring keeps its trajectory SHAPE (curve + settle time) but scales
     *   its displacement-from-rest (`originValue − targetValue`) to this
     *   fraction. At `0.3` the peak overshoot is 30 % of the full-intensity
     *   peak; the envelope is preserved by construction (the analytic form
     *   makes the scaling exact and free). `1` ≈ full motion, `0` ≡ the snap.
     *
     * The scale is the CONSUMER's policy (a settings slider, a per-animation
     * field) — the OS exposes only a binary signal; kf provides the mechanism.
     */
    respectReducedMotion: ReducedMotionPolicy;
}

/** Subscriber callback. Receives current position + velocity each emission. */
export type SpringSubscriber = (value: number, velocity: number) => void;

/** Per-frame callback for `.play()` mode. */
export type SpringFrameCallback = (value: number, velocity: number) => void;

/**
 * The default `response` (angular period, seconds) — the iOS-canonical 0.5.
 * The one place the value lives, so `duration.ts` seeds the same fallback when
 * neither `visualDuration` nor `duration` is supplied, and `progress.ts`'s
 * `defaultSpringOptions.response` reads it too.
 */
export const DEFAULT_SPRING_RESPONSE = 0.5;
