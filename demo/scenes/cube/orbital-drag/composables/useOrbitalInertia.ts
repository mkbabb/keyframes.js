import { useRafFn } from "@vueuse/core";
// inv ζ (F.W10.S1): the coast consumes the engine's SHIPPED analytic `decay()`
// closed form from the published barrel, like every other demo engine consumer.
import { decay } from "@mkbabb/keyframes.js";
import type { DecaySample } from "@mkbabb/keyframes.js";
import { norm3 } from "../arcball";
import type { Vec3 } from "../arcball";
import type { Vec2 } from "../similarity";
import { axisMotion, clampTo, excess, sampleAxis } from "../bounds";
import type { AxisMotion, Interval } from "../bounds";
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

/** The pose the pan and zoom channels move, and where they may rest. */
export interface OrbitPose {
    /** The die's projected centre (client px), its ln s, and the intervals
     *  each may rest in at the current scale. */
    read: () => { c: Vec2; ln: number; x: Interval; y: Interval; z: Interval };
    /** Put the centre at `c` (client px), unclamped. */
    setCentre: (c: Vec2) => void;
    /** Set ln s anchored at `at` (the content under it stays), unclamped. */
    setZoom: (ln: number, at: Vec2) => void;
}

interface OrbitalInertiaParams {
    inertiaFactor: number;
    /** Turn the stored attitude by `angle` (rad) about `axis` (unit, in the
     *  frame the attitude is stored in), and commit the frame. */
    rotateBy: (axis: Vec3, angle: number) => void;
    /** The pan and zoom pose (absent: rotation only). */
    pose?: OrbitPose;
    /** Commit a frame the pan or zoom moved. */
    commit?: () => void;
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
 * frame lands x(t), never a per-frame step). Each starts at r₀ =
 * min(COAST_GAIN·|rate|, cap) along the release's direction and stops once its
 * rate is under 1% of r₀. Under reduced motion r₀ = 0: the gesture stays 1:1
 * and nothing coasts.
 *
 * The pan (per axis) and the zoom (in ln s) are bounded (bounds.ts, owner
 * 2026-11-11): a coast that crosses its bound becomes the critically damped
 * spring at the same k there, and a pose let go past a bound (the hand's
 * rubber band, a zoom that moved the pan's bound) springs back from where it
 * stands. Under reduced motion a pose past its bound is put on it.
 *
 * The GLIDE is the rotation channel's decay with a known total: a wheel
 * notch's rotation θ (an axis·angle vector) drains at r₀ = |θ|·k and lands
 * EXACTLY on θ at the 1% rest. Notches stack: a new one adds into the
 * remaining-rotation vector (any axis), so two notches travel Σθ. Under
 * reduced motion it applies at once. A glide leaves a running pan or zoom
 * coast alone.
 */
export function useOrbitalInertia(params: OrbitalInertiaParams) {
    const { inertiaFactor, rotateBy, pose, commit, onRest, reducedMotion } = params;
    const friction = inertiaFactorToFriction(inertiaFactor);

    let axis: Vec3 = [0, 1, 0];
    let rotation: Channel | null = null;
    /** The pan's two axes and the zoom (ln s), each a coast or a spring. */
    let panX: AxisMotion | null = null;
    let panY: AxisMotion | null = null;
    let zoom: AxisMotion | null = null;
    let zoomAt: Vec2 = { x: 0, y: 0 };
    /** Motions made without a clock (t0 −1) take their first frame's. */
    let pending = false;

    const coasting = () => rotation !== null || panX !== null || panY !== null || zoom !== null;

    const stop = () => {
        const was = coasting();
        rotation = panX = panY = zoom = null;
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

    /** A zoom spring is home under 1e-4 in ln s. */
    const ZOOM_REST = { x: 1e-4, v: 1e-3 };

    /** Re-time motions created before their first frame onto that frame's clock. */
    const stamp = (m: AxisMotion | null, t: number) => {
        if (m && m.t0 < 0) m.t0 = t;
    };

    /** Advance the pan and zoom to `t` (s). */
    const advancePose = (t: number) => {
        if (!pose) return;
        if (pending) {
            stamp(panX, t);
            stamp(panY, t);
            stamp(zoom, t);
            pending = false;
        }
        if (zoom) {
            const z = sampleAxis(zoom, t, pose.read().z, friction, COAST_REST_FRACTION, ZOOM_REST);
            zoom = z.next;
            pose.setZoom(z.x, zoomAt);
        }
        const p = pose.read();
        // A zoom (or a let-go pose) past the pan's bound with no pan motion on
        // that axis springs back from rest.
        const reduce = reducedMotion?.() ?? false;
        if (!panX && excess(p.c.x, p.x) !== 0 && !reduce) panX = axisMotion(p.c.x, 0, p.x, t);
        if (!panY && excess(p.c.y, p.y) !== 0 && !reduce) panY = axisMotion(p.c.y, 0, p.y, t);
        let x = reduce ? clampTo(p.c.x, p.x) : p.c.x;
        let y = reduce ? clampTo(p.c.y, p.y) : p.c.y;
        if (panX) {
            const a = sampleAxis(panX, t, p.x, friction, COAST_REST_FRACTION);
            panX = a.next;
            x = a.x;
        }
        if (panY) {
            const a = sampleAxis(panY, t, p.y, friction, COAST_REST_FRACTION);
            panY = a.next;
            y = a.x;
        }
        if (x !== p.c.x || y !== p.c.y) pose.setCentre({ x, y });
    };

    /** Advance the coast to `now` (ms). Returns whether it is still coasting. */
    const advance = (now: number): boolean => {
        if (!coasting()) return false;
        if (rotation && !step(rotation, now)) rotation = null;
        if (panX || panY || zoom) {
            advancePose(now / 1000);
            commit?.();
        }
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
     * Start the pan and zoom from a let-go pose with the given rates (px/s,
     * ln s/s): a coast, or the spring back for an axis already past its bound.
     * Under reduced motion a pose past its bound is put on it at once.
     */
    const letGo = (pan: Vec2, z: number, at: Vec2, t0: number) => {
        if (!pose) return;
        const p = pose.read();
        if (reducedMotion?.() ?? false) {
            const c = { x: clampTo(p.c.x, p.x), y: clampTo(p.c.y, p.y) };
            if (excess(p.ln, p.z) !== 0) pose.setZoom(clampTo(p.ln, p.z), at);
            if (c.x !== p.c.x || c.y !== p.c.y) pose.setCentre(c);
            return;
        }
        zoomAt = at;
        zoom = axisMotion(p.ln, z, p.z, t0);
        panX = axisMotion(p.c.x, pan.x, p.x, t0);
        panY = axisMotion(p.c.y, pan.y, p.y, t0);
        pending = t0 < 0;
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

        // The pan's starting speed is the gained, capped release speed along
        // the release's direction; the zoom's likewise, signed.
        const v = r.pan ?? { x: 0, y: 0 };
        const speed = Math.hypot(v.x, v.y);
        const p0 = coastRate(speed, reduce, MAX_PAN_COAST_RATE);
        const pan = speed > 0 ? { x: (v.x / speed) * p0, y: (v.y / speed) * p0 } : { x: 0, y: 0 };
        const z = r.zoom ?? 0;
        const z0 = Math.sign(z) * coastRate(z, reduce, MAX_ZOOM_COAST_RATE);
        letGo(pan, z0, r.at ?? { x: 0, y: 0 }, t0 < 0 ? -1 : t0 / 1000);

        if (!coasting()) return false;
        resume();
        return true;
    };

    /**
     * Spring the pan and zoom back from where they stand (a wheel stream that
     * has ended past a bound), leaving a running rotation alone.
     */
    const settle = (at?: Vec2) => {
        if (panX || panY || zoom) return;
        letGo({ x: 0, y: 0 }, 0, at ?? zoomAt, -1);
        if (coasting()) resume();
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

    return { start, stop, advance, glide, settle, friction, coasting };
}
