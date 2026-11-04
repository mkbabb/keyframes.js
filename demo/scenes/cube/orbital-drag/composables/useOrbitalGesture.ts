// SERVED MODEL: claude-opus-5-5
import { useEventListener } from "@vueuse/core";
import { ref } from "vue";
import type { ShallowRef } from "vue";
import {
    angularVelocityFromSamples,
    applyScreenDelta,
    constrainToAxis,
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
    /** The subject's projected centre (client px). */
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

export interface OrbitalGestureParams {
    containerRef: Readonly<ShallowRef<HTMLElement | null>>;
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
}

/** The arcball radius' floor (px). */
export const MIN_ARCBALL_RADIUS = 96;
/** Ctrl/⌘-wheel zoom gain per wheel px. */
export const WHEEL_ZOOM_GAIN = 0.0015;

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
 * Every application is ANCHORED: the reader keeps the attitude, pan and scale
 * at the gesture's anchor and recomputes from them, so a closed path returns
 * exactly (no drift) and a coalesced or dropped move costs nothing.
 */
export function useOrbitalGesture(params: OrbitalGestureParams) {
    const { containerRef, G, state, frame, scaleRange, requestCommit, onGestureStart, onGestureEnd } =
        params;

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
    type Mode = "idle" | "orbit" | "pan" | "pair";
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

    const readFrame = () => {
        f = frame();
        const stage = f.stage;
        const h = (f.side * state.s * f.fit) / 2;
        const cap = stage
            ? 0.5 * Math.min(stage.right - stage.left, stage.bottom - stage.top)
            : Infinity;
        R = Math.max(MIN_ARCBALL_RADIUS, Math.min(2 * h, Math.max(MIN_ARCBALL_RADIUS, cap)));
        q0 = [state.q[0], state.q[1], state.q[2], state.q[3]];
        t0 = { ...state.t };
        s0 = state.s;
        c0 = { ...f.centre };
        cRest = { x: c0.x - t0.x * f.fit, y: c0.y - t0.y * f.fit };
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
        mode = "orbit";
        axis = latchAxis();
        v0 = constrained(sphereAt(p0), perpendicular());
        vPrev = v0;
    };

    // ── Application ────────────────────────────────────────────────────
    const applyOrbit = (p: Vec2) => {
        const vn = constrained(sphereAt(p), vPrev);
        vPrev = vn;
        state.q = applyScreenDelta(q0, shoemakeArc(v0, vn), G);
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
            containerRef.value?.setPointerCapture(event.pointerId);
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
        const shift = event.shiftKey;
        syncModifiers(event);
        // A modifier change mid-drag re-anchors (orbit ↔ pan), never jumps.
        if ((mode === "pan") !== shift && pointers.size === 1) anchor();
        if (mode === "orbit") applyOrbit(p);
        else if (mode === "pan") applyPan(p);
        else if (mode === "pair") applyPair();
        else return;
        pushSample(event.timeStamp);
        requestCommit();
    };

    const releaseCapture = (event: PointerEvent) => {
        try {
            containerRef.value?.releasePointerCapture(event.pointerId);
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

    const handleWheel = (event: WheelEvent) => {
        event.preventDefault();
        syncModifiers(event);
        const dx = wheelPx(event, event.deltaX);
        const dy = wheelPx(event, event.deltaY);
        if (Math.abs(dx) < 1e-4 && Math.abs(dy) < 1e-4) return;
        if (pointers.size > 0) return;
        onGestureStart();
        readFrame();
        if (event.ctrlKey || event.metaKey) {
            // Zoom, anchored at the cursor.
            state.s = clampScale(s0 * Math.exp(-dy * WHEEL_ZOOM_GAIN));
            const k = state.s / s0;
            setTranslate({
                x: t0.x + ((k - 1) * (c0.x - event.clientX)) / f.fit,
                y: t0.y + ((k - 1) * (c0.y - event.clientY)) / f.fit,
            });
        } else {
            // Orbit through a virtual pointer at c + (−Δx, −Δy), incrementally.
            // No coast: the OS supplies a wheel's momentum.
            axis = latchAxis();
            const a = constrained([0, 0, 1], perpendicular());
            const b = constrained(sphereMap(-dx / R, -dy / R), a);
            state.q = applyScreenDelta(q0, shoemakeArc(a, b), G);
        }
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
    const ownerDoc = () => containerRef.value?.ownerDocument ?? null;
    useEventListener(ownerDoc, "pointermove", onPointerMove);
    useEventListener(ownerDoc, "pointerup", onPointerUp);
    useEventListener(ownerDoc, "pointercancel", onPointerCancel);

    return {
        isActive,
        pressedKeys,
        pointers,
        onPointerDown,
        handleWheel,
        onGestureStartEvent,
        onGestureChange,
        onGestureEndEvent,
        setAxisLatch,
        resetPressedKeys,
    };
}
