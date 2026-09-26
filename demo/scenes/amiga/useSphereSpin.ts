import * as THREE from "three";
import { useEventListener } from "@vueuse/core";
// inv ζ — the amiga sphere dogfoods the engine's SHIPPED analytic `decay()`
// closed form (the SAME idiom the cube's orbital inertia rides,
// useOrbitalInertia.ts). A pointer-drag on the mesh accumulates an angular
// velocity; on RELEASE the engine's frictional glide bleeds that velocity off
// over many frames. `decay` is the light surface (zero value.js edge), imported
// directly like every demo engine consumer.
import { decay, type DecaySample } from "@mkbabb/keyframes.js";

/**
 * The interactive subject of the amiga scene. Drag the SPHERE to spin it; on
 * release the engine `decay()` glide coasts the spin to rest.
 *
 * T.A7 — the gesture is an ADDITIVE LAYER, never a second mesh writer. It
 * accumulates into `attitude` (a stable quaternion the scene reads each frame);
 * the scene composes `spin · attitude` into the mesh transform (ONE writer).
 *
 * X.KF.W13X · KFA-19 — the attitude is ONE quaternion, a trackball. It used to
 * be two Euler angles composed 'XYZ', so yaw turned about the already-pitched
 * body axis: after a quarter-turn pitch a horizontal drag rolled the ball in
 * place. Every drag delta is now a rotation about the SCREEN axis under the
 * finger (camera space, perpendicular to the drag), premultiplied.
 *
 * X.KF.W13X · KFA-65 — the gesture composes INSIDE the Boing spin. The scene's
 * spin is applied last, about the fixed tilted world axis, so a delta the user
 * makes in world (screen) space is conjugated by the current spin (`getFrame`)
 * before it joins the attitude; a pitch no longer tilts the spin axis.
 *
 * Camera orbit (OrbitControls) stays the BACKGROUND gesture: a pointerdown that
 * RAYCASTS the sphere is the spin gesture (and suppresses orbit for its
 * duration); a miss falls through to OrbitControls untouched. The two gesture
 * landlords are disjoint by hit-test, never racing.
 */
interface SphereSpinOptions {
    /** The mesh the drag spins (the raycast hit-test target). */
    getMesh: () => THREE.Object3D | undefined;
    /** The camera the raycaster projects through (and whose axes are the screen's). */
    getCamera: () => THREE.Camera | undefined;
    /** Suspend/resume camera orbit while a sphere-spin gesture owns the pointer. */
    setOrbitEnabled: (enabled: boolean) => void;
    /**
     * KFA-65 — the rotation the gesture composes INSIDE (the scene's Boing spin,
     * `mesh = frame · attitude`). A world-space delta D joins the attitude as
     * `frame⁻¹ · D · frame`. Omitted: identity.
     */
    getFrame?: () => THREE.Quaternion;
    /** KFA-130 — Home snaps instead of gliding under prefers-reduced-motion. */
    reducedMotion?: () => boolean;
    /**
     * Friction coefficient (1/s) of the release glide — larger = shorter coast.
     * Default 2.4 (a long, legible spin-down).
     */
    friction?: number;
    /** Drag pixels → radians of spin. Default 0.01. */
    sensitivity?: number;
}

const DEFAULT_FRICTION = 2.4;
const DEFAULT_SENSITIVITY = 0.01;
// Below this (rad/s) the glide is visually at rest — stop integrating.
const REST_SPEED = 1e-3;
// L-M1/C-8 — the shortest interval a real pointer stream samples at (240 Hz).
// The floor used to be 1 ms, so a coalesced pair delivered a sub-millisecond
// apart divided a full drag delta by 0.001 s: a genuine up-to-1000× amplifier on
// the release impulse, and nothing downstream clamped it.
const MIN_SAMPLE_MS = 1000 / 240;
// L-M1/C-8 — a flick older than this is not a flick: past this window the finger
// had come to rest. KFA-129 — it is also the window the release impulse is READ
// over (a least-squares slope of the samples inside it), so one early or late
// event cannot set the coast.
const FLICK_WINDOW_MS = 100;
// KFA-20 — a keyboard nudge is a short glide that lands exactly on its step:
// a stiff friction so the turn reads in ~¼ s, then the remainder is applied.
const NUDGE_FRICTION = 12;
// KFA-130 — Home carries the ball back to rest over this long (ease-out).
const HOME_MS = 320;

/** One screen-axis coast: a decay sampler about a fixed world axis. A nudge also
 *  carries the exact angle it must cover (`total`), applied when it settles. */
interface Coast {
    axis: THREE.Vector3;
    sample: (t: number) => DecaySample;
    start: number;
    applied: number;
    pitchShare: number;
    yawShare: number;
    total?: number;
}

/** A pointer sample, in cumulative pixels (the window the release is read over). */
interface Sample {
    t: number;
    x: number;
    y: number;
}

const IDENTITY = new THREE.Quaternion();

export function useSphereSpin(options: SphereSpinOptions) {
    const friction = options.friction ?? DEFAULT_FRICTION;
    const sensitivity = options.sensitivity ?? DEFAULT_SENSITIVITY;

    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();

    let canvasEl: HTMLCanvasElement | undefined;

    // T.A7 / KFA-19 — the gesture ATTITUDE: one quaternion, the body side of the
    // scene's spin (`mesh = spin · attitude`). A stable object the scene reads.
    const attitude = new THREE.Quaternion();
    // The per-axis READ-OUT (rad): the pitch (`x`, drag-y) and yaw (`y`, drag-x)
    // the user has put in, screen-referenced and unwrapped. It is what the a11y
    // read-out and the dev probe report; the attitude is what is painted.
    const offset = { x: 0, y: 0 };

    // ── Drag state ───────────────────────────────────────────────────────────
    let dragging = false;
    let activePointer: number | undefined;
    let lastX = 0;
    let lastY = 0;
    let lastMoveTime = 0;
    // KFA-129 — the flick window: cumulative pixels against (floored) event time.
    let samples: Sample[] = [];
    let travelX = 0;
    let travelY = 0;

    // ── Coast state: ONE screen-axis decay (a release glide or a nudge) or ONE
    // homing slerp, advanced on the FRAME clock the present loop hands in.
    let coast: Coast | undefined;
    let homing:
        | { from: THREE.Quaternion; fromX: number; fromY: number; start: number }
        | undefined;

    const scratchDelta = new THREE.Quaternion();
    const scratchFrame = new THREE.Quaternion();
    const scratchCamera = new THREE.Quaternion();

    const toNDC = (clientX: number, clientY: number) => {
        const rect = canvasEl!.getBoundingClientRect();
        ndc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        ndc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    const hitsSphere = (clientX: number, clientY: number): boolean => {
        const mesh = options.getMesh();
        const camera = options.getCamera();
        if (!mesh || !camera || !canvasEl) return false;
        // The mesh world transform is written by the scene's present loop; ensure
        // it is current for the raycast even between render-on-demand frames.
        mesh.updateMatrixWorld();
        toNDC(clientX, clientY);
        raycaster.setFromCamera(ndc, camera);
        return raycaster.intersectObject(mesh, false).length > 0;
    };

    /** The WORLD axis of a screen rotation: camera-space (pitch, yaw, 0) → world. */
    const screenAxis = (pitch: number, yaw: number): THREE.Vector3 => {
        const axis = new THREE.Vector3(pitch, yaw, 0).normalize();
        const camera = options.getCamera();
        if (camera) axis.applyQuaternion(camera.getWorldQuaternion(scratchCamera));
        return axis;
    };

    /** KFA-19 + KFA-65 — turn the attitude by `angle` about the world `axis`,
     *  inside the scene's frame: attitude ← frame⁻¹ · D · frame · attitude. */
    const turn = (axis: THREE.Vector3, angle: number): void => {
        scratchDelta.setFromAxisAngle(axis, angle);
        const frame = options.getFrame?.();
        if (frame) {
            scratchFrame.copy(frame).invert();
            scratchDelta.premultiply(scratchFrame).multiply(frame);
        }
        attitude.premultiply(scratchDelta).normalize();
    };

    /** Advance a coast by `angle` (rad) along its axis, read-out included. */
    const advance = (c: Coast, angle: number): void => {
        if (angle === 0) return;
        turn(c.axis, angle);
        offset.x += angle * c.pitchShare;
        offset.y += angle * c.yawShare;
    };

    /** A nudge still under way lands on its step before anything else moves. */
    const finishCoast = (): void => {
        if (coast?.total !== undefined) advance(coast, coast.total - coast.applied);
        coast = undefined;
    };

    /** KFA-129 — the least-squares slope (px/ms) of the flick window's samples. */
    const slope = (key: "x" | "y"): number => {
        const n = samples.length;
        if (n < 2) return 0;
        let tm = 0;
        let km = 0;
        for (const s of samples) {
            tm += s.t;
            km += s[key];
        }
        tm /= n;
        km /= n;
        let num = 0;
        let den = 0;
        for (const s of samples) {
            num += (s.t - tm) * (s[key] - km);
            den += (s.t - tm) ** 2;
        }
        return den > 0 ? num / den : 0;
    };

    // L-M1/C-8 — the engine's analytic decay sampler seeded ONCE with unit
    // velocity, so `unitDecay(t).velocity` IS the multiplicative factor
    // e^(−k·t): the same closed form the glide itself rides, used here to age a
    // release impulse by however long the finger was still before it lifted.
    const unitDecay = decay({ velocity: 1, friction });

    const onPointerDown = (e: PointerEvent) => {
        // MISSED-G — one gesture, one pointer, one button. A second touch used
        // to overwrite `activePointer` and silently steal the drag mid-flight,
        // and a right-button press hijacked the surface with `preventDefault` +
        // `stopPropagation` while orbit was disabled. Three guards, all cheap.
        if (dragging) return; // re-entrancy: the gesture is already owned
        if (!e.isPrimary) return; // a secondary touch is not a second drag
        if (e.button !== 0) return; // pen/right/middle → not a spin gesture
        if (!hitsSphere(e.clientX, e.clientY)) return; // → OrbitControls
        // The sphere owns this gesture: take the pointer, stand the camera orbit
        // down, and end any in-flight coast (a new grab re-seeds velocity).
        dragging = true;
        activePointer = e.pointerId;
        canvasEl!.setPointerCapture(e.pointerId);
        options.setOrbitEnabled(false);
        finishCoast();
        homing = undefined;
        lastX = e.clientX;
        lastY = e.clientY;
        lastMoveTime = performance.now();
        travelX = 0;
        travelY = 0;
        samples = [{ t: lastMoveTime, x: 0, y: 0 }];
        e.preventDefault();
        e.stopPropagation();
    };

    const onPointerMove = (e: PointerEvent) => {
        if (!dragging || e.pointerId !== activePointer) return;
        const now = performance.now();
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
        lastMoveTime = now;
        // KFA-19 — the delta is a rotation about the SCREEN axis perpendicular
        // to the drag (a trackball): horizontal → about the screen vertical,
        // vertical → about the screen horizontal, whatever the attitude.
        const len = Math.hypot(dx, dy);
        if (len > 0) {
            const angle = len * sensitivity;
            turn(screenAxis(dy / len, dx / len), angle);
            offset.x += dy * sensitivity;
            offset.y += dx * sensitivity;
        }
        // KFA-129 — sample the flick window. L-M1/C-8: a sample's time is floored
        // at one real sampling period after the last, so a coalesced pair cannot
        // divide a whole delta by a sub-millisecond interval.
        travelX += dx;
        travelY += dy;
        const prev = samples[samples.length - 1];
        const t = prev ? Math.max(now, prev.t + MIN_SAMPLE_MS) : now;
        samples.push({ t, x: travelX, y: travelY });
        while (samples.length > 2 && samples[0]!.t < t - FLICK_WINDOW_MS) {
            samples.shift();
        }
    };

    const endDrag = (e: PointerEvent) => {
        if (!dragging || e.pointerId !== activePointer) return;
        const now = performance.now();
        dragging = false;
        activePointer = undefined;
        if (canvasEl?.hasPointerCapture(e.pointerId)) {
            canvasEl.releasePointerCapture(e.pointerId);
        }
        options.setOrbitEnabled(true);
        // KFA-129 — the release impulse is the window's slope (px/ms → rad/s),
        // aged by how long the finger had been still (L-M1/C-8).
        const age = now - lastMoveTime;
        const staleness =
            age >= FLICK_WINDOW_MS ? 0 : unitDecay(age / 1000).velocity;
        const vx = slope("x") * 1000;
        const vy = slope("y") * 1000;
        const speed = Math.hypot(vx, vy);
        const omega = speed * sensitivity * staleness;
        samples = [];
        if (omega <= REST_SPEED) return;
        coast = {
            axis: screenAxis(vy / speed, vx / speed),
            sample: decay({ velocity: omega, friction }),
            start: now,
            applied: 0,
            pitchShare: vy / speed,
            yawShare: vx / speed,
        };
    };

    /**
     * Advance the coast (or the homing) to the FRAME time `now` — the present
     * loop's rAF timestamp. KFA-128: it read `performance.now()` when it ran,
     * which wobbles with main-thread work, so an even frame cadence stepped
     * unevenly (a ±7 % ripple). Returns whether the gesture is still moving.
     */
    const tickGlide = (now: number): boolean => {
        if (homing) {
            const k = Math.min(Math.max((now - homing.start) / HOME_MS, 0), 1);
            const eased = 1 - (1 - k) ** 3;
            attitude.slerpQuaternions(homing.from, IDENTITY, eased);
            offset.x = homing.fromX * (1 - eased);
            offset.y = homing.fromY * (1 - eased);
            if (k < 1) return true;
            homing = undefined;
            attitude.identity();
            offset.x = 0;
            offset.y = 0;
            return false;
        }
        if (!coast) return false;
        const s = coast.sample(Math.max(now - coast.start, 0) / 1000);
        advance(coast, s.value - coast.applied);
        coast.applied = s.value;
        if (Math.abs(s.velocity) > REST_SPEED) return true;
        finishCoast();
        return false;
    };

    let stopHandles: Array<() => void> = [];
    const attach = (canvas: HTMLCanvasElement) => {
        detach();
        canvasEl = canvas;
        stopHandles = [
            useEventListener(canvas, "pointerdown", onPointerDown, {
                capture: true,
            }),
            useEventListener(canvas, "pointermove", onPointerMove),
            useEventListener(canvas, "pointerup", endDrag),
            useEventListener(canvas, "pointercancel", endDrag),
        ];
    };
    const detach = () => {
        for (const stop of stopHandles) stop();
        stopHandles = [];
        canvasEl = undefined;
    };

    /**
     * D-2 — the keyboard route. KFA-20: the step used to be written in ONE frame,
     * and a sixteenth of a turn is exactly one checker tile, so each press read
     * as a red↔white swap and two presses as nothing. The nudge is now a short
     * glide on the same screen-axis coast as a release, seeded so it covers the
     * step exactly (a decay's total travel is v/k) and landing on it.
     */
    const nudge = (dPitch: number, dYaw: number): void => {
        finishCoast();
        homing = undefined;
        const angle = Math.hypot(dPitch, dYaw);
        if (angle === 0) return;
        coast = {
            axis: screenAxis(dPitch / angle, dYaw / angle),
            sample: decay({ velocity: angle * NUDGE_FRICTION, friction: NUDGE_FRICTION }),
            start: performance.now(),
            applied: 0,
            pitchShare: dPitch / angle,
            yawShare: dYaw / angle,
            total: angle,
        };
    };

    /**
     * Home — back to the rest attitude. KFA-130: it zeroed the attitude in one
     * frame; it now carries it home over HOME_MS (a slerp, ease-out), and snaps
     * only under prefers-reduced-motion.
     */
    const rest = (): void => {
        coast = undefined;
        if (options.reducedMotion?.() || attitude.angleTo(IDENTITY) === 0) {
            homing = undefined;
            attitude.identity();
            offset.x = 0;
            offset.y = 0;
            return;
        }
        homing = {
            from: attitude.clone(),
            fromX: offset.x,
            fromY: offset.y,
            start: performance.now(),
        };
    };

    /** The gesture's current angular speed (rad/s) — the dev probe's reading. */
    const angularVelocity = (): number => {
        if (dragging) return Math.hypot(slope("x"), slope("y")) * 1000 * sensitivity;
        if (!coast) return 0;
        const t = Math.max(performance.now() - coast.start, 0) / 1000;
        return Math.abs(coast.sample(t).velocity);
    };

    return {
        attach,
        detach,
        tickGlide,
        nudge,
        rest,
        /** The gesture attitude the scene composes inside its spin. */
        attitude,
        /** The per-axis read-out (rad): accumulated screen pitch (x) and yaw (y). */
        offset,
        /** True while the user is actively dragging the sphere. */
        isDragging: () => dragging,
        /** True while a coast (release glide, nudge) or the homing is moving it. */
        isGliding: () => !!(coast || homing),
        angularVelocity,
    };
}
