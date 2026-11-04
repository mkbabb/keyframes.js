import { useRafFn } from "@vueuse/core";
// inv ζ (F.W10.S1): the coast consumes the engine's SHIPPED analytic `decay()`
// closed form from the published barrel, like every other demo engine consumer.
import { decay } from "@mkbabb/keyframes.js";
import type { DecaySample } from "@mkbabb/keyframes.js";
import { norm3 } from "../arcball";
import type { Vec3 } from "../arcball";
import { COAST_REST_FRACTION, coastRate, inertiaFactorToFriction } from "./inertiaDecay";

interface OrbitalInertiaParams {
    inertiaFactor: number;
    /** Turn the stored attitude by `angle` (rad) about `axis` (unit, in the
     *  frame the attitude is stored in), and commit the frame. */
    rotateBy: (axis: Vec3, angle: number) => void;
    /** The coast's settle (the readout folds there). */
    onRest?: () => void;
    reducedMotion?: () => boolean;
}

/**
 * The release coast — ROTATION ONLY (KF-M2, D-15). Pan and zoom are
 * positional and clamped; they never coast.
 *
 * The coast is the closed form, sampled at elapsed time: angle(t) =
 * |ω₀|/k·(1 − e^{−kt}), so the path is identical at 30, 60 and 120 Hz (each
 * frame applies angle(t) − angle(t_prev), never a per-frame step). It starts at
 * ω₀ = min(COAST_GAIN·|ω|, 2π) about ω̂ and stops once |ω| < 1% of ω₀. Under
 * reduced motion ω₀ = 0: the gesture stays 1:1 and nothing coasts.
 */
export function useOrbitalInertia(params: OrbitalInertiaParams) {
    const { inertiaFactor, rotateBy, onRest, reducedMotion } = params;
    const friction = inertiaFactorToFriction(inertiaFactor);

    let axis: Vec3 = [0, 1, 0];
    let rate0 = 0;
    let sample: ((t: number) => DecaySample) | null = null;
    let startedAt = -1;
    let travelled = 0;

    const stop = () => {
        const wasCoasting = sample !== null;
        sample = null;
        startedAt = -1;
        travelled = 0;
        pause();
        if (wasCoasting) onRest?.();
    };

    /** Advance the coast to `now` (ms). Returns whether it is still coasting. */
    const advance = (now: number): boolean => {
        if (!sample) return false;
        if (startedAt < 0) startedAt = now;
        const s = sample((now - startedAt) / 1000);
        const step = s.value - travelled;
        travelled = s.value;
        if (step !== 0) rotateBy(axis, step);
        if (s.velocity < COAST_REST_FRACTION * rate0) {
            stop();
            return false;
        }
        return true;
    };

    const { pause, resume } = useRafFn(({ timestamp }) => void advance(timestamp), {
        immediate: false,
    });

    /**
     * Start a coast from the release's angular velocity `omega` (rad/s, an
     * axis·rate vector in the attitude's frame). Returns the starting rate.
     */
    const start = (omega: Vec3, now?: number): number => {
        stop();
        const rate = norm3(omega);
        const r0 = coastRate(rate, reducedMotion?.() ?? false);
        if (r0 <= 0 || rate === 0) return 0;
        axis = [omega[0] / rate, omega[1] / rate, omega[2] / rate];
        rate0 = r0;
        sample = decay({ velocity: r0, friction });
        startedAt = now ?? -1;
        travelled = 0;
        resume();
        return r0;
    };

    return { start, stop, advance, friction };
}
