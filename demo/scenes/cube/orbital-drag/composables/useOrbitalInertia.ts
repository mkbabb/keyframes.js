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
 *
 * The GLIDE is the same decay with a known total: a wheel notch's rotation θ
 * (an axis·angle vector) drains at r₀ = |θ|·k and lands EXACTLY on θ at the 1%
 * rest. Notches stack: a new one adds into the remaining-rotation vector (any
 * axis), so two notches travel Σθ. Under reduced motion it applies at once.
 */
export function useOrbitalInertia(params: OrbitalInertiaParams) {
    const { inertiaFactor, rotateBy, onRest, reducedMotion } = params;
    const friction = inertiaFactorToFriction(inertiaFactor);

    let axis: Vec3 = [0, 1, 0];
    let rate0 = 0;
    let sample: ((t: number) => DecaySample) | null = null;
    let startedAt = -1;
    let travelled = 0;
    /** A glide's exact travel (rad); −1 for a release coast (no landing). */
    let total = -1;

    const stop = () => {
        const wasCoasting = sample !== null;
        sample = null;
        startedAt = -1;
        travelled = 0;
        total = -1;
        pause();
        if (wasCoasting) onRest?.();
    };

    /** Advance the coast to `now` (ms). Returns whether it is still coasting. */
    const advance = (now: number): boolean => {
        if (!sample) return false;
        if (startedAt < 0) startedAt = now;
        const s = sample((now - startedAt) / 1000);
        const resting = s.velocity < COAST_REST_FRACTION * rate0;
        // A glide lands its whole travel at the rest.
        const at = total >= 0 ? (resting ? total : Math.min(s.value, total)) : s.value;
        const step = at - travelled;
        travelled = at;
        if (step !== 0) rotateBy(axis, step);
        if (resting) {
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

    /**
     * Glide out a rotation `theta` (axis·angle, rad, in the attitude's frame),
     * added into whatever is still to travel. Returns the starting rate.
     */
    const glide = (theta: Vec3, now?: number): number => {
        // What is left of the running motion (a coast: its analytic rest).
        const left = sample ? (total >= 0 ? total : rate0 / friction) - travelled : 0;
        const v: Vec3 = [theta[0] + axis[0] * left, theta[1] + axis[1] * left, theta[2] + axis[2] * left];
        const angle = norm3(v);
        if (angle === 0) return 0;
        const dir: Vec3 = [v[0] / angle, v[1] / angle, v[2] / angle];
        if (reducedMotion?.() ?? false) {
            sample = null;
            pause();
            rotateBy(dir, angle);
            stop();
            onRest?.();
            return 0;
        }
        axis = dir;
        rate0 = angle * friction;
        sample = decay({ velocity: rate0, friction });
        startedAt = now ?? -1;
        travelled = 0;
        total = angle;
        resume();
        return rate0;
    };

    return { start, stop, advance, glide, friction };
}
