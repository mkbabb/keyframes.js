// SERVED MODEL: claude-opus-5-5
import { useEventListener } from "@vueuse/core";
import { ref } from "vue";
import {
    angularVelocityFromSamples,
    applyScreenDelta,
    constrainToAxis,
    quatExp,
    quatFromAxisAngle,
    rotateVec,
    shoemakeArc,
    sphereMap,
} from "../arcball";
import type { AttitudeSample, Quat, Vec3 } from "../arcball";
import { anchoredTranslate, clampToBox, engagePair, readPair, unwrapRadians } from "../similarity";
import type { Box, Vec2 } from "../similarity";
import type { GestureEvent, PressedKeys } from "../types";

/** What the reader needs from its host, read once per gesture anchor. */
export interface OrbitFrame {
    /** The subject's projected centre AT REST (client px, t = 0): the parked
     *  stage's centre, which the orbit's own pan does not move. */
    centre: Vec2;
    /** The die's layout side (px, before the orbit's own scale). */
    side: number;
    /** The stage's live fit (the OPEN glide's scale; 1 at rest). */
    fit: number;
    /** The visible-stage box V the projected centre stays inside. */
    stage: Box | null;
}

/** The orbit state the reader drives. The host owns it and commits it. */
export interface OrbitState {
    q: Quat;
    t: Vec2;
    s: number;
}

/** Who owns a vertical scroll over the surface: the stage (the demo — every
 *  wheel and swipe is the die's) or the page (an embed — vertical swipes and
 *  plain wheels scroll the host; horizontal drags and pinches are the die's). */
export type ScrollOwner = "stage" | "page";

export interface OrbitalGestureParams {
    /** The element that takes pointer capture: the whole stage surface. */
    surfaceRef: () => HTMLElement | null;
    scrollOwner: () => ScrollOwner;
    /** The stage attitude G (the conjugation frame). */
    G: Readonly<Quat>;
    state: OrbitState;
    frame: () => OrbitFrame;
    scaleRange: readonly [number, number];
    /** Schedule one commit (model write + render) on the next frame. */
    requestCommit: () => void;
    /** A gesture took the subject (the coast stops). */
    onGestureStart: () => void;
    /** The last pointer left: ω (rad/s, in Q's frame) is the release rate. */
    onGestureEnd: (omega: Vec3) => void;
    /** A wheel notch's rotation (axis·angle, SCREEN frame), to glide out. */
    onGlide: (rotation: Vec3) => void;
}

/** The arcball radius' floor (px). */
export const MIN_ARCBALL_RADIUS = 96;
/** Ctrl/⌘-wheel zoom: s ← s·exp(−ΣΔy/WHEEL_ZOOM_PX) per frame. Chromium
 *  writes a trackpad pinch as ctrl-wheel Δy = −100·ln(scale), so this gear
 *  is the pinch itself. */
export const WHEEL_ZOOM_PX = 100;
/** The summed ln-scale step one frame may take (a mouse notch: e^0.25 ≈ 1.284×). */
export const WHEEL_ZOOM_STEP_CAP = 0.25;
/** A pixel wheel event at least this large, an integer multiple of its
 *  stream's first event, is a NOTCH (a mouse wheel), and glides. */
export const NOTCH_MIN_PX = 50;
/** One notch's travel cap (rad). The glide drains on the coast's decay
 *  (k = 9/s), whose first 60 Hz frame takes 1 − e^(−9/60) ≈ 13.9 % of the
 *  notch, so a 40° notch moves ≤ 5.6° in any frame. Uncapped, a 100 px notch
 *  is 2·100/R: 42° at R 270 (1440) but 72° at R 160, a 10° first frame. */
export const NOTCH_MAX_RAD = (40 * Math.PI) / 180;
/** Page mode: a touch drag turns the die only once it has gone this far
 *  (px), mostly sideways; a mostly vertical one is the host's scroll. */
export const PAGE_TOUCH_SLOP_PX = 10;
/** A wheel stream ends after this quiet gap (ms). */
const WHEEL_STREAM_GAP_MS = 300;

/**
 * driveBy — the virtual-pointer law the wheel and an off-die grab share: a
 * pointer displacement d (px) turns the die about the in-plane axis ⟂ d by
 * 2|d|/R, the arcball's own gain at its centre (rotation vector, SCREEN
 * frame). Linear in d, so coalesced or split moves sum exactly.
 */
export const driveVector = (d: Vec2, R: number): Vec3 => [(-2 * d.y) / R, (2 * d.x) / R, 0];

/** How many notches this wheel event is: 0 for a pixel stream (a trackpad),
 *  1 for deltaMode LINE/PAGE, else n when |Δ| ≥ 50 px is n × the stream's
 *  first event (coalesced notches arrive as one multiple). */
export const notchCount = (deltaMode: number, d: number, first: number): number => {
    if (deltaMode !== 0) return 1;
    const a = Math.abs(d);
    const f = Math.abs(first);
    if (a < NOTCH_MIN_PX || f < NOTCH_MIN_PX) return 0;
    const n = Math.round(a / f);
    return n >= 1 && Math.abs(a / f - n) < 1e-6 ? n : 0;
};

const LATCH_AXES: Record<"x" | "y" | "z", Vec3> = {
    x: [1, 0, 0],
    y: [0, 1, 0],
    z: [0, 0, 1],
};

/**
 * THE ONE MULTITOUCH SOURCE (KF-M2, D-14): Pointer Events. One finger (or the
 * mouse) orbits on Shoemake's anchored arcball, Shift-drag pans 1:1, two
 * fingers are one similarity — pinch zooms, twist rolls about the view axis,
 * the midpoint pans — anchored at the content under the fingers and held
 * inside the visible stage. The former touch* reader and the gesture* writer
 * applied the same pinch twice on iOS; both are gone. gesture* survives only
 * to stop Safari's page zoom while fingers are down, and, with no finger down,
 * as desktop Safari's trackpad pinch (s = s₀·scale, roll = rotation).
 *
 * The whole stage is the surface. A grab ON the die (|p − c| ≤ R) is the
 * anchored arcball: the reader keeps the attitude, pan and scale at the
 * gesture's anchor and recomputes from them, so a closed path returns exactly
 * (no drift) and a coalesced or dropped move costs nothing. A grab OFF it is
 * driven by driveBy, the wheel's own law, rebased each move. The mode is
 * chosen once per grab.
 *
 * The state is the one truth: a gesture never re-seeds from the model (the
 * host's watch re-seeds it on an external write).
 */
export function useOrbitalGesture(params: OrbitalGestureParams) {
    const {
        surfaceRef,
        scrollOwner,
        G,
        state,
        frame,
        scaleRange,
        requestCommit,
        onGestureStart,
        onGestureEnd,
        onGlide,
    } = params;

    const pointers = new Map<number, { x: number; y: number; touch: boolean }>();
    const isActive = ref(false);

    const pressedKeys = ref<PressedKeys>({
        x: false,
        y: false,
        z: false,
        shift: false,
        ctrl: false,
        meta: false,
    });

    const syncModifiers = (event: { shiftKey: boolean; ctrlKey: boolean; metaKey: boolean }) => {
        pressedKeys.value.shift = event.shiftKey;
        pressedKeys.value.ctrl = event.ctrlKey;
        pressedKeys.value.meta = event.metaKey;
    };

    const clampScale = (s: number) => Math.min(scaleRange[1], Math.max(scaleRange[0], s));

    /** The latched axis in the SCREEN frame (a_s = G·a_graph), or null. */
    const latchAxis = (): Vec3 | null => {
        const k = pressedKeys.value;
        const which = k.x ? "x" : k.y ? "y" : k.z ? "z" : null;
        return which ? rotateVec(G, LATCH_AXES[which]) : null;
    };

    // ── Anchors ────────────────────────────────────────────────────────
    // orbit: the anchored arcball (a grab on the die, |p − c| ≤ R); drive: a
    // grab off it, driven by driveBy per move (the wheel's law).
    type Mode = "idle" | "orbit" | "drive" | "pan" | "pair";
    let mode: Mode = "idle";
    let f: OrbitFrame = { centre: { x: 0, y: 0 }, side: 0, fit: 1, stage: null };
    let R = MIN_ARCBALL_RADIUS;
    let q0: Quat = [0, 0, 0, 1];
    let t0: Vec2 = { x: 0, y: 0 };
    let s0 = 1;
    /** The projected centre at the anchor, and at t = 0. */
    let c0: Vec2 = { x: 0, y: 0 };
    let cRest: Vec2 = { x: 0, y: 0 };
    let p0: Vec2 = { x: 0, y: 0 };
    let pPrev: Vec2 = { x: 0, y: 0 };
    /** A page-mode touch grab not yet known to be sideways. */
    let pending = false;
    let v0: Vec3 = [0, 0, 1];
    let vPrev: Vec3 = [0, 0, 1];
    let axis: Vec3 | null = null;
    let pairIds: [number, number] = [-1, -1];
    let pairA0: Vec2 = { x: 0, y: 0 };
    let pairB0: Vec2 = { x: 0, y: 0 };
    let thetaPrev = 0;

    const samples: AttitudeSample[] = [];
    const pushSample = (t: number) => {
        samples.push({ t, q: [state.q[0], state.q[1], state.q[2], state.q[3]] });
        while (samples.length > 2 && t - samples[0]!.t > 120) samples.shift();
    };

    const radius = (fr: OrbitFrame) => {
        const stage = fr.stage;
        const h = (fr.side * state.s * fr.fit) / 2;
        const cap = stage
            ? 0.5 * Math.min(stage.right - stage.left, stage.bottom - stage.top)
            : Infinity;
        return Math.max(MIN_ARCBALL_RADIUS, Math.min(2 * h, Math.max(MIN_ARCBALL_RADIUS, cap)));
    };

    const readFrame = () => {
        f = frame();
        R = radius(f);
        q0 = [state.q[0], state.q[1], state.q[2], state.q[3]];
        t0 = { ...state.t };
        s0 = state.s;
        // D5 — the frame's centre is the REST centre; the panned centre is it
        // plus the pan the state holds.
        cRest = { ...f.centre };
        c0 = { x: cRest.x + t0.x * f.fit, y: cRest.y + t0.y * f.fit };
    };

    /** Is `p` on the die's arcball (|p − c| ≤ R), the die where it stands? */
    const onArcball = (p: Vec2): boolean => {
        const fr = frame();
        const c = { x: fr.centre.x + state.t.x * fr.fit, y: fr.centre.y + state.t.y * fr.fit };
        return Math.hypot(p.x - c.x, p.y - c.y) <= radius(fr);
    };

    const sphereAt = (p: Vec2): Vec3 => sphereMap((p.x - c0.x) / R, (p.y - c0.y) / R);

    const constrained = (v: Vec3, fallback: Vec3): Vec3 =>
        axis ? (constrainToAxis(v, axis) ?? fallback) : v;

    /** Any unit vector ⟂ the latched axis (a pointer exactly on the axis has
     *  no projection of its own). */
    const perpendicular = (): Vec3 =>
        (axis && (constrainToAxis([1, 0, 0], axis) ?? constrainToAxis([0, 1, 0], axis))) || [1, 0, 0];

    /** Set t so the projected centre lands at `t` (stage px) held inside V. */
    const setTranslate = (t: Vec2) => {
        const c = clampToBox({ x: cRest.x + t.x * f.fit, y: cRest.y + t.y * f.fit }, f.stage);
        state.t = { x: (c.x - cRest.x) / f.fit, y: (c.y - cRest.y) / f.fit };
    };

    const anchor = () => {
        const ids = [...pointers.keys()];
        if (ids.length === 0) {
            mode = "idle";
            return;
        }
        readFrame();
        pending = false;
        if (ids.length >= 2) {
            mode = "pair";
            pairIds = [ids[0]!, ids[1]!];
            const a = pointers.get(pairIds[0])!;
            const b = pointers.get(pairIds[1])!;
            pairA0 = { x: a.x, y: a.y };
            pairB0 = { x: b.x, y: b.y };
            thetaPrev = 0;
            return;
        }
        const p = pointers.get(ids[0]!)!;
        p0 = { x: p.x, y: p.y };
        if (pressedKeys.value.shift) {
            mode = "pan";
            return;
        }
        axis = latchAxis();
        pending = p.touch && scrollOwner() === "page";
        if (Math.hypot(p0.x - c0.x, p0.y - c0.y) > R) {
            mode = "drive";
            pPrev = p0;
            return;
        }
        mode = "orbit";
        v0 = constrained(sphereAt(p0), perpendicular());
        vPrev = v0;
    };

    /** A screen-frame rotation vector, held to the latched axis if one is. */
    const latched = (w: Vec3): Vec3 => {
        if (!axis) return w;
        const d = w[0] * axis[0] + w[1] * axis[1] + w[2] * axis[2];
        return [axis[0] * d, axis[1] * d, axis[2] * d];
    };

    /** Turn the state by a screen-frame rotation vector (axis·angle). */
    const turnBy = (w: Vec3) => {
        state.q = applyScreenDelta(state.q, quatExp([w[0] / 2, w[1] / 2, w[2] / 2]), G);
    };

    // ── Application ────────────────────────────────────────────────────
    const applyOrbit = (p: Vec2) => {
        const vn = constrained(sphereAt(p), vPrev);
        vPrev = vn;
        state.q = applyScreenDelta(q0, shoemakeArc(v0, vn), G);
    };

    const applyDrive = (p: Vec2) => {
        const d = { x: p.x - pPrev.x, y: p.y - pPrev.y };
        // A copy: `p` is the live pointer record, rewritten every move.
        pPrev = { x: p.x, y: p.y };
        turnBy(latched(driveVector(d, R)));
    };

    const applyPan = (p: Vec2) => {
        setTranslate({ x: t0.x + (p.x - p0.x) / f.fit, y: t0.y + (p.y - p0.y) / f.fit });
    };

    const applyPair = () => {
        const a = pointers.get(pairIds[0]);
        const b = pointers.get(pairIds[1]);
        if (!a || !b) return;
        const raw = readPair(pairA0, pairB0, a, b);
        raw.dTheta = unwrapRadians(raw.dTheta, thetaPrev);
        thetaPrev = raw.dTheta;
        const eff = engagePair(raw);
        state.s = clampScale(s0 * eff.k);
        const k = state.s / s0;
        const tScreen = anchoredTranslate({ x: 0, y: 0 }, eff.dm, k, c0, raw.m0);
        setTranslate({ x: t0.x + tScreen.x / f.fit, y: t0.y + tScreen.y / f.fit });
        state.q = applyScreenDelta(q0, quatFromAxisAngle([0, 0, 1], eff.dTheta), G);
    };

    // ── Pointer Events ─────────────────────────────────────────────────
    const onPointerDown = (event: PointerEvent) => {
        // Keep iOS Safari from starting its own gesture handling.
        event.preventDefault();
        syncModifiers(event);
        if (pointers.size === 0) onGestureStart();
        pointers.set(event.pointerId, {
            x: event.clientX,
            y: event.clientY,
            touch: event.pointerType === "touch",
        });
        isActive.value = true;
        samples.length = 0;
        pushSample(event.timeStamp);
        // kf-CubeTarget #55 — the acquire is guarded: an inactive pointerId or a
        // disconnected element throws, and the gesture does not depend on
        // capture (the document listeners drive it).
        try {
            surfaceRef()?.setPointerCapture(event.pointerId);
        } catch {
            /* KEEP: capture unavailable — the document listeners still drive it */
        }
        anchor();
    };

    const onPointerMove = (event: PointerEvent) => {
        const p = pointers.get(event.pointerId);
        if (!p) return;
        p.x = event.clientX;
        p.y = event.clientY;
        // Page mode (pan-y): a one-finger drag is the die's only once it is
        // horizontal. Until then the browser may still take it as the host's
        // scroll (a pointercancel), and the die must not have moved.
        if (pending) {
            const dx = p.x - p0.x;
            const dy = p.y - p0.y;
            if (Math.hypot(dx, dy) < PAGE_TOUCH_SLOP_PX || Math.abs(dy) >= Math.abs(dx)) return;
            pending = false;
        }
        const shift = event.shiftKey;
        syncModifiers(event);
        // A modifier change mid-drag re-anchors (orbit ↔ pan), never jumps.
        if ((mode === "pan") !== shift && pointers.size === 1) anchor();
        if (mode === "orbit") applyOrbit(p);
        else if (mode === "drive") applyDrive(p);
        else if (mode === "pan") applyPan(p);
        else if (mode === "pair") applyPair();
        else return;
        pushSample(event.timeStamp);
        requestCommit();
    };

    const releaseCapture = (event: PointerEvent) => {
        try {
            surfaceRef()?.releasePointerCapture(event.pointerId);
        } catch {
            /* KEEP: iOS may throw if already released */
        }
    };

    const onPointerUp = (event: PointerEvent) => {
        if (!pointers.delete(event.pointerId)) return;
        releaseCapture(event);
        if (pointers.size > 0) {
            // 2 → 1 re-anchors the arcball at the finger that stayed (no jump).
            anchor();
            return;
        }
        const omega = mode === "pan" ? ([0, 0, 0] as Vec3) : angularVelocityFromSamples(samples, event.timeStamp);
        mode = "idle";
        isActive.value = false;
        samples.length = 0;
        onGestureEnd(omega);
    };

    const onPointerCancel = (event: PointerEvent) => {
        if (!pointers.has(event.pointerId)) return;
        // iOS cancels mid-pinch: the remaining state is untrustworthy.
        pointers.clear();
        releaseCapture(event);
        mode = "idle";
        isActive.value = false;
        samples.length = 0;
        onGestureEnd([0, 0, 0]);
    };

    // ── Wheel ──────────────────────────────────────────────────────────
    const wheelPx = (event: WheelEvent, d: number) =>
        event.deltaMode === 1 ? d * 16 : event.deltaMode === 2 ? d * 400 : d;

    // The zoom is summed per FRAME and applied once (flushWheel, from the
    // commit): coalesced or split events land the same scale.
    let zoomLn = 0;
    let zoomAt: Vec2 = { x: 0, y: 0 };
    let streamAt = -Infinity;
    let streamFirst = 0;

    /** Apply the frame's summed ctrl-wheel step (the commit calls it). */
    const flushWheel = () => {
        if (zoomLn === 0 || pointers.size > 0) {
            zoomLn = 0;
            return;
        }
        const step = Math.max(-WHEEL_ZOOM_STEP_CAP, Math.min(WHEEL_ZOOM_STEP_CAP, zoomLn));
        zoomLn = 0;
        readFrame();
        state.s = clampScale(s0 * Math.exp(step));
        const k = state.s / s0;
        // Anchored at the cursor: the content under it stays under it.
        setTranslate({
            x: t0.x + ((k - 1) * (c0.x - zoomAt.x)) / f.fit,
            y: t0.y + ((k - 1) * (c0.y - zoomAt.y)) / f.fit,
        });
    };

    const handleWheel = (event: WheelEvent) => {
        const zoom = event.ctrlKey || event.metaKey;
        // An embed yields the plain wheel to its host page.
        if (!zoom && scrollOwner() === "page") return;
        event.preventDefault();
        syncModifiers(event);
        const dx = wheelPx(event, event.deltaX);
        const dy = wheelPx(event, event.deltaY);
        if (Math.abs(dx) < 1e-4 && Math.abs(dy) < 1e-4) return;
        if (pointers.size > 0) return;
        const major = Math.abs(dy) >= Math.abs(dx) ? dy : dx;
        if (event.timeStamp - streamAt > WHEEL_STREAM_GAP_MS) streamFirst = major;
        streamAt = event.timeStamp;
        if (zoom) {
            zoomLn += -dy / WHEEL_ZOOM_PX;
            zoomAt = { x: event.clientX, y: event.clientY };
            requestCommit();
            return;
        }
        // Orbit through a virtual pointer moved by (−Δx, −Δy). No anchor, no
        // coast stop: a running glide keeps running and this composes onto it.
        f = frame();
        R = radius(f);
        axis = latchAxis();
        const w = latched(driveVector({ x: -dx, y: -dy }, R));
        const n = notchCount(event.deltaMode, major, streamFirst);
        if (n > 0) {
            // A mouse notch is one quantum of travel: glided out, not jumped,
            // and no more than NOTCH_MAX_RAD a notch.
            const a = Math.hypot(w[0], w[1], w[2]);
            const k = a > n * NOTCH_MAX_RAD ? (n * NOTCH_MAX_RAD) / a : 1;
            onGlide([w[0] * k, w[1] * k, w[2] * k]);
            return;
        }
        // A trackpad's pixel stream is already continuous (and the OS carries
        // its momentum): direct.
        turnBy(w);
        requestCommit();
    };

    // ── Safari gesture* ────────────────────────────────────────────────
    const touchDown = () => [...pointers.values()].some((p) => p.touch);
    let trackpad = false;

    const onGestureStartEvent = (event: Event) => {
        event.preventDefault();
        if (touchDown()) return;
        trackpad = true;
        onGestureStart();
        readFrame();
    };

    const onGestureChange = (event: Event) => {
        if (!trackpad && !touchDown()) return;
        event.preventDefault();
        if (!trackpad) return;
        const e = event as GestureEvent;
        state.s = clampScale(s0 * (e.scale || 1));
        state.q = applyScreenDelta(q0, quatFromAxisAngle([0, 0, 1], ((e.rotation || 0) * Math.PI) / 180), G);
        requestCommit();
    };

    const onGestureEndEvent = (event: Event) => {
        if (!trackpad) return;
        event.preventDefault();
        trackpad = false;
    };

    /** The axis latch's one setter (the registry's X/Y/Z bindings drive it). A
     *  change mid-orbit re-anchors, so the constraint never jumps. */
    const setAxisLatch = (which: "x" | "y" | "z", pressed: boolean) => {
        pressedKeys.value[which] = pressed;
        if (mode === "orbit") anchor();
    };

    /** OD-5 — the latch's escape (a blur, an app switch, a consumer). */
    const resetPressedKeys = () => {
        const k = pressedKeys.value;
        k.x = k.y = k.z = k.shift = k.ctrl = k.meta = false;
    };

    // kf-CubeTarget #54 · OD-25 — one registration in the composable's scope,
    // with handlers that return unless a pointer of ours is down; the target is
    // a getter so it binds the container's own document once it exists.
    const ownerDoc = () => surfaceRef()?.ownerDocument ?? null;
    useEventListener(ownerDoc, "pointermove", onPointerMove);
    useEventListener(ownerDoc, "pointerup", onPointerUp);
    useEventListener(ownerDoc, "pointercancel", onPointerCancel);

    return {
        isActive,
        pressedKeys,
        pointers,
        onPointerDown,
        handleWheel,
        flushWheel,
        onArcball,
        onGestureStartEvent,
        onGestureChange,
        onGestureEndEvent,
        setAxisLatch,
        resetPressedKeys,
    };
}
