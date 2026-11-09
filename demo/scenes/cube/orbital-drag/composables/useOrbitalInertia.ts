import { useRafFn } from "@vueuse/core";
// inv ζ (F.W10.S1): the coast consumes the engine's SHIPPED analytic `decay()`
// closed form from the published barrel, like every other demo engine consumer.
import { decay } from "@mkbabb/keyframes.js";
import type { DecaySample } from "@mkbabb/keyframes.js";
import { norm3 } from "../arcball";
import type { Vec3 } from "../arcball";
import type { Vec2 } from "../similarity";
import {
    COAST_REST_FRACTION,
    MAX_PAN_COAST_RATE,
    MAX_ZOOM_COAST_RATE,
    coastRate,
    inertiaFactorToFriction,
} from "./inertiaDecay";

/** A release: the hand's rates at the moment the last pointer left. */
export interface OrbitRelease {
    /** Angular velocity (rad/s, an axis·rate vector in the attitude's frame). */
    omega: Vec3;
    /** Pan velocity (screen px/s). */
    pan?: Vec2;
    /** Zoom rate (ln s per second). */
    zoom?: number;
    /** Where a zoom coast is anchored (client px): the release's centroid. */
    at?: Vec2;
}

interface OrbitalInertiaParams {
    inertiaFactor: number;
    /** Turn the stored attitude by `angle` (rad) about `axis` (unit, in the
     *  frame the attitude is stored in), and commit the frame. */
    rotateBy: (axis: Vec3, angle: number) => void;
    /** Pan by `d` screen px. Returns false once the pan is held at the stage
     *  bound (the pan channel then rests). */
    panBy?: (d: Vec2) => boolean;
    /** Zoom by `ln` (ln s) anchored at `at`. Returns false once the scale is
     *  held at its range (the zoom channel then rests). */
    zoomBy?: (ln: number, at: Vec2) => boolean;
    /** The coast's settle (the readout folds there). */
    onRest?: () => void;
    reducedMotion?: () => boolean;
}

/** One decaying channel: a scalar travel along a fixed direction. */
interface Channel {
    sample: (t: number) => DecaySample;
    rate0: number;
    startedAt: number;
    travelled: number;
    /** A glide's exact travel; −1 for a release coast (no landing). */
    total: number;
    /** Apply `step` of travel; false ends the channel (held at a bound). */
    apply: (step: number) => boolean;
}

/**
 * The release coast — rotation, pan and zoom (KF-M2 D-15; OA-17, owner
 * 2026-11-09: "Natural scrolling for all pan an zoom, in orbital drag").
 *
 * Every channel is the same closed form sampled at elapsed time: x(t) =
 * r₀/k·(1 − e^{−kt}), so the path is identical at 30, 60 and 120 Hz (each
 * frame applies x(t) − x(t_prev), never a per-frame step). Each starts at
 * r₀ = min(COAST_GAIN·|rate|, cap) along the release's direction and stops
 * once its rate is under 1% of r₀ — or, for pan and zoom, once the stage
 * bound or the scale range holds it. Under reduced motion r₀ = 0: the gesture
 * stays 1:1 and nothing coasts.
 *
 * The GLIDE is the rotation channel's decay with a known total: a wheel
 * notch's rotation θ (an axis·angle vector) drains at r₀ = |θ|·k and lands
 * EXACTLY on θ at the 1% rest. Notches stack: a new one adds into the
 * remaining-rotation vector (any axis), so two notches travel Σθ. Under
 * reduced motion it applies at once. A glide leaves a running pan or zoom
 * coast alone.
 */
export function useOrbitalInertia(params: OrbitalInertiaParams) {
    const { inertiaFactor, rotateBy, panBy, zoomBy, onRest, reducedMotion } = params;
    const friction = inertiaFactorToFriction(inertiaFactor);

    let axis: Vec3 = [0, 1, 0];
    let rotation: Channel | null = null;
    let pan: Channel | null = null;
    let zoom: Channel | null = null;

    const coasting = () => rotation !== null || pan !== null || zoom !== null;

    const stop = () => {
        const was = coasting();
        rotation = pan = zoom = null;
        pause();
        if (was) onRest?.();
    };

    const channel = (rate0: number, apply: Channel["apply"], total = -1, now = -1): Channel => ({
        sample: decay({ velocity: rate0, friction }),
        rate0,
        startedAt: now,
        travelled: 0,
        total,
        apply,
    });

    /** Advance one channel to `now`; false once it rests. */
    const step = (c: Channel, now: number): boolean => {
        if (c.startedAt < 0) c.startedAt = now;
        const s = c.sample((now - c.startedAt) / 1000);
        const resting = s.velocity < COAST_REST_FRACTION * c.rate0;
        // A glide lands its whole travel at the rest.
        const at = c.total >= 0 ? (resting ? c.total : Math.min(s.value, c.total)) : s.value;
        const d = at - c.travelled;
        c.travelled = at;
        const free = d === 0 || c.apply(d);
        return free && !resting;
    };

    /** Advance the coast to `now` (ms). Returns whether it is still coasting. */
    const advance = (now: number): boolean => {
        if (!coasting()) return false;
        if (rotation && !step(rotation, now)) rotation = null;
        if (pan && !step(pan, now)) pan = null;
        if (zoom && !step(zoom, now)) zoom = null;
        if (coasting()) return true;
        stop();
        // stop() saw nothing left; the settle is still owed.
        onRest?.();
        return false;
    };

    const { pause, resume } = useRafFn(({ timestamp }) => void advance(timestamp), {
        immediate: false,
    });

    const rotate = (dir: Vec3) => (d: number) => {
        rotateBy(dir, d);
        return true;
    };

    /**
     * Start a coast from a release (or a bare angular velocity, rad/s, an
     * axis·rate vector in the attitude's frame). Returns whether anything
     * coasts.
     */
    const start = (release: OrbitRelease | Vec3, now?: number): boolean => {
        stop();
        const r: OrbitRelease = Array.isArray(release) ? { omega: release } : release;
        const reduce = reducedMotion?.() ?? false;
        const t0 = now ?? -1;

        const rate = norm3(r.omega);
        const r0 = coastRate(rate, reduce);
        if (r0 > 0 && rate > 0) {
            axis = [r.omega[0] / rate, r.omega[1] / rate, r.omega[2] / rate];
            rotation = channel(r0, rotate(axis), -1, t0);
        }

        const v = r.pan ?? { x: 0, y: 0 };
        const speed = Math.hypot(v.x, v.y);
        const p0 = coastRate(speed, reduce, MAX_PAN_COAST_RATE);
        if (panBy && p0 > 0 && speed > 0) {
            const ux = v.x / speed;
            const uy = v.y / speed;
            pan = channel(p0, (d) => panBy({ x: ux * d, y: uy * d }), -1, t0);
        }

        const z = r.zoom ?? 0;
        const z0 = coastRate(z, reduce, MAX_ZOOM_COAST_RATE);
        if (zoomBy && z0 > 0) {
            const sign = Math.sign(z);
            const at = r.at ?? { x: 0, y: 0 };
            zoom = channel(z0, (d) => zoomBy(sign * d, at), -1, t0);
        }

        if (!coasting()) return false;
        resume();
        return true;
    };

    /**
     * Glide out a rotation `theta` (axis·angle, rad, in the attitude's frame),
     * added into whatever rotation is still to travel. Returns the starting rate.
     */
    const glide = (theta: Vec3, now?: number): number => {
        // What is left of the running rotation (a coast: its analytic rest).
        const left = rotation ? (rotation.total >= 0 ? rotation.total : rotation.rate0 / friction) - rotation.travelled : 0;
        const v: Vec3 = [theta[0] + axis[0] * left, theta[1] + axis[1] * left, theta[2] + axis[2] * left];
        const angle = norm3(v);
        if (angle === 0) return 0;
        const dir: Vec3 = [v[0] / angle, v[1] / angle, v[2] / angle];
        if (reducedMotion?.() ?? false) {
            rotation = null;
            rotateBy(dir, angle);
            if (!coasting()) {
                pause();
                onRest?.();
            }
            return 0;
        }
        axis = dir;
        rotation = channel(angle * friction, rotate(dir), angle, now ?? -1);
        resume();
        return rotation.rate0;
    };

    return { start, stop, advance, glide, friction, coasting };
}
