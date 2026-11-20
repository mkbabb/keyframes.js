// inv ζ (F.W10.S1): the coast consumes the engine's SHIPPED analytic `decay()`
// closed form from the published barrel, like every other demo engine consumer.
import { decay } from "@mkbabb/keyframes.js";
import type { DecaySample } from "@mkbabb/keyframes.js";
import { norm3 } from "../arcball";
import type { Vec3 } from "../arcball";
import type { Vec2 } from "../similarity";
import { frameSeconds } from "../follower";
import { axisMotion, clampTo, excess, sampleAxis } from "../bounds";
import type { AxisMotion, Interval } from "../bounds";
import {
    COAST_MIN_RATE,
    COAST_REST_FRACTION,
    COAST_REST_RATE,
    MAX_PAN_COAST_RATE,
    MAX_ZOOM_COAST_RATE,
    POSE_FRICTION,
    SPRING_K,
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
    /** The release's own time (ms, its event's `timeStamp`): the coast's clock. */
    time?: number;
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
     *  frame the attitude is stored in). The state only: the host's frame
     *  loop commits. */
    rotateBy: (axis: Vec3, angle: number) => void;
    /** The pan and zoom pose (absent: rotation only). */
    pose?: OrbitPose;
    /** Ask the host's ONE frame loop for a frame (it calls `advance`). */
    requestFrame: () => void;
    /** The coast's settle (the readout folds there). */
    onRest?: () => void;
    reducedMotion?: () => boolean;
}

/** One decaying channel: a scalar travel along a fixed direction. */
interface Channel {
    sample: (t: number) => DecaySample;
    rate0: number;
    startedAt: number;
    /** Started at its input's own time, not yet re-read on a frame's clock. */
    fresh: boolean;
    travelled: number;
    k: number;
    /** Apply `step` of travel. */
    apply: (step: number) => void;
}

/**
 * The release coast: rotation, pan and zoom, advanced by the host's one frame
 * loop (`advance(now)`), never by a loop of its own.
 *
 * Every channel is the same closed form sampled at elapsed time: x(t) =
 * r₀/k·(1 − e^{−kt}), so the path is identical at 30, 60 and 120 Hz. The
 * rotation starts at the hand's own angular speed (COAST_GAIN 1, capped at
 * MAX_COAST_RATE) and rests once it turns slower than COAST_REST_RATE; the
 * pan and zoom start at the hand's speeds and decay at POSE_FRICTION. Under
 * reduced motion nothing coasts: the gesture stays 1:1.
 *
 * The pan (per axis) and the zoom (in ln s) are bounded (bounds.ts): a coast
 * that crosses its bound becomes the critically damped spring (SPRING_K)
 * there, and a pose let go past a bound springs back from where it stands.
 * Under reduced motion a pose past its bound is put on it.
 */
export function useOrbitalInertia(params: OrbitalInertiaParams) {
    const { inertiaFactor, rotateBy, pose, requestFrame, onRest, reducedMotion } = params;
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
    /** Motions made at their input's own time (s) re-read it on their first frame. */
    let poseFresh: number | null = null;

    const coasting = () => rotation !== null || panX !== null || panY !== null || zoom !== null;

    const stop = () => {
        const was = coasting();
        rotation = panX = panY = zoom = null;
        if (was) onRest?.();
    };

    const channel = (rate0: number, apply: Channel["apply"], now = -1, k = friction): Channel => ({
        sample: decay({ velocity: rate0, friction: k }),
        rate0,
        startedAt: now,
        fresh: now >= 0,
        travelled: 0,
        k,
        apply,
    });

    /** Advance one channel to `now`; false once it rests. */
    const step = (c: Channel, now: number): boolean => {
        // K3: a channel clocked by its input starts at that input's time, so
        // its first frame already travels (frameSeconds: never elapsed 0).
        if (c.startedAt < 0) c.startedAt = now;
        else if (c.fresh) c.startedAt = now - 1000 * frameSeconds(c.startedAt, now);
        c.fresh = false;
        const s = c.sample((now - c.startedAt) / 1000);
        const resting = s.velocity < Math.max(COAST_REST_RATE, 1e-9);
        const at = s.value;
        const d = at - c.travelled;
        c.travelled = at;
        if (d !== 0) c.apply(d);
        return !resting;
    };

    /** The pan's and the zoom's release floors (px/s, ln s/s). */
const POSE_MIN_SPEED = 10;
const ZOOM_MIN_RATE = 0.03;

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
        if (poseFresh !== null) {
            const t0 = t - frameSeconds(poseFresh * 1000, t * 1000);
            for (const m of [panX, panY, zoom]) if (m && m.t0 === poseFresh) m.t0 = t0;
            poseFresh = null;
        }
        if (zoom) {
            const z = sampleAxis(zoom, t, pose.read().z, POSE_FRICTION, COAST_REST_FRACTION, ZOOM_REST, SPRING_K);
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
            const a = sampleAxis(panX, t, p.x, POSE_FRICTION, COAST_REST_FRACTION, undefined, SPRING_K);
            panX = a.next;
            x = a.x;
        }
        if (panY) {
            const a = sampleAxis(panY, t, p.y, POSE_FRICTION, COAST_REST_FRACTION, undefined, SPRING_K);
            panY = a.next;
            y = a.x;
        }
        if (x !== p.c.x || y !== p.c.y) pose.setCentre({ x, y });
    };

    /** Advance the coast to `now` (ms), the host's frame. Returns whether it
     *  still runs; at its rest it calls `onRest`. */
    const advance = (now: number): boolean => {
        if (!coasting()) return false;
        if (rotation && !step(rotation, now)) rotation = null;
        if (panX || panY || zoom) advancePose(now / 1000);
        if (coasting()) return true;
        onRest?.();
        return false;
    };

    const rotate = (dir: Vec3) => (d: number) => rotateBy(dir, d);

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
        poseFresh = t0 < 0 ? null : t0;
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
        const r0 = rate < COAST_MIN_RATE ? 0 : coastRate(rate, reduce);
        if (r0 > 0) {
            axis = [r.omega[0] / rate, r.omega[1] / rate, r.omega[2] / rate];
            rotation = channel(r0, rotate(axis), t0);
        }

        // The pan's starting speed is the gained, capped release speed along
        // the release's direction; the zoom's likewise, signed.
        const v = r.pan ?? { x: 0, y: 0 };
        const raw = Math.hypot(v.x, v.y);
        // A placed pose stays placed: a release slower than the floors does not coast.
        const speed = raw < POSE_MIN_SPEED ? 0 : raw;
        const p0 = coastRate(speed, reduce, MAX_PAN_COAST_RATE);
        const pan = speed > 0 ? { x: (v.x / speed) * p0, y: (v.y / speed) * p0 } : { x: 0, y: 0 };
        const z = Math.abs(r.zoom ?? 0) < ZOOM_MIN_RATE ? 0 : (r.zoom ?? 0);
        const z0 = Math.sign(z) * coastRate(z, reduce, MAX_ZOOM_COAST_RATE);
        letGo(pan, z0, r.at ?? { x: 0, y: 0 }, t0 < 0 ? -1 : t0 / 1000);

        if (!coasting()) return false;
        requestFrame();
        return true;
    };

    /**
     * Spring the pan and zoom back from where they stand (a wheel stream that
     * has ended past a bound), leaving a running rotation alone.
     */
    const settle = (at?: Vec2) => {
        if (panX || panY || zoom) return;
        letGo({ x: 0, y: 0 }, 0, at ?? zoomAt, -1);
        if (coasting()) requestFrame();
    };

    return { start, stop, advance, settle, friction, coasting };
}
