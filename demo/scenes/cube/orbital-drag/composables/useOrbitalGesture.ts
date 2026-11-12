// SERVED MODEL: claude-opus-5-5
import { useEventListener } from "@vueuse/core";
import { ref } from "vue";
import {
    angularVelocityFromSamples,
    applyScreenDelta,
    poseRatesFromSamples,
    constrainToAxis,
    quatExp,
    quatFromAxisAngle,
    rotateVec,
    shoemakeArc,
    sphereMap,
} from "../arcball";
import type { AttitudeSample, Quat, Vec3 } from "../arcball";
import { anchoredTranslate, engagePair, readPair, unwrapRadians } from "../similarity";
import type { Box, Vec2 } from "../similarity";
import { SILHOUETTE, UNBOUNDED, ZOOM_BAND_LN, banded, clampTo, panInterval, unbanded } from "../bounds";
import type { Interval } from "../bounds";
import type { GestureEvent, PressedKeys } from "../types";
import type { OrbitPose, OrbitRelease } from "./useOrbitalInertia";

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

/** Who owns a vertical scroll over the surface:
 *  - "stage": every wheel and swipe is the die's (the demo, its page having
 *    nothing to scroll);
 *  - "beside": the demo whose page CAN scroll — a touch on the die's arcball
 *    is the die's, a mostly-vertical swipe beside it scrolls the page, and the
 *    off-die drive takes it once it is sideways (the embed's law, off the die);
 *  - "page": an embed — vertical swipes and plain wheels scroll the host;
 *    horizontal drags and pinches are the die's. */
export type ScrollOwner = "stage" | "beside" | "page";

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
    /** The last pointer left: the release's rates (ω in rad/s in Q's frame,
     *  the pan in screen px/s, the zoom in ln s/s). */
    onGestureEnd: (release: OrbitRelease) => void;
    /** A wheel notch's rotation (axis·angle, SCREEN frame), to glide out. */
    onGlide: (rotation: Vec3) => void;
    /** A pan or zoom wheel stream has ended: spring back what stands past a
     *  bound, anchored at the stream's last point. */
    onSettle?: (at: Vec2) => void;
    /** Reduced motion: the bounds are hard walls (no rubber band). */
    reducedMotion?: () => boolean;
}

/** The arcball radius' floor (px). */
export const MIN_ARCBALL_RADIUS = 96;
/**
 * OA-17 (owner 2026-11-09) — natural scrolling: a plain wheel (a two-finger
 * trackpad scroll) PANS, and the content follows the fingers. The wheel's Δ is
 * the distance the page's content would scroll, already in the user's own
 * direction (the OS applies its natural-scrolling setting to Δ before the page
 * sees it), so content that follows moves by −Δ, exactly as a scrolled page's
 * content does. No platform sniffing. `NATURAL = false` would move the
 * subject WITH Δ (a camera pan) instead.
 */
export const NATURAL = true;
/** The wheel pan's sign: −1 under NATURAL (the subject moves by −Δ). */
export const WHEEL_PAN_SIGN = NATURAL ? -1 : 1;
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
/** A pan or zoom wheel stream holds the rubber band until this long after its
 *  last event (the OS's own momentum arrives as events, so it is the throw);
 *  then the spring takes over (ms). */
export const WHEEL_LIVE_MS = 80;

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
 * OA-17 (owner 2026-11-09) — natural scrolling for all pan and zoom:
 *   mouse     drag orbits · Shift-drag pans · wheel pans · Ctrl/⌘-wheel zooms
 *             at the cursor · Alt/Option-wheel orbits (a notch glides);
 *   trackpad  two-finger scroll pans (content follows the fingers; the OS
 *             carries its momentum) · pinch zooms · Safari's gesture* pinch
 *             and twist as before;
 *   touch     one finger orbits · two fingers pan, pinch and twist together.
 * A released pointer pan or pinch coasts on the rotation's own decay (one
 * coast, three channels — useOrbitalInertia).
 *
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
        onSettle,
        reducedMotion,
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

    /** The scale range in ln s, the zoom's bound. */
    const lnRange: Interval = { lo: Math.log(scaleRange[0]), hi: Math.log(scaleRange[1]) };
    /** The hand holds the die past a bound with resistance (bounds.ts), except
     *  under reduced motion, where the bounds are hard walls. */
    const banding = () => !(reducedMotion?.() ?? false);
    /** The shown scale for a raw ln s: banded while the hand holds it. */
    const showScale = (ln: number) =>
        Math.exp(banding() ? banded(ln, lnRange, ZOOM_BAND_LN) : clampTo(ln, lnRange));

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
    /** The anchor's pan and scale as the hand holds them: under the rubber
     *  band these are the raw pose (the band's inverse of what shows), so a
     *  die re-grabbed past its bound is picked up where it shows. */
    let t0: Vec2 = { x: 0, y: 0 };
    let s0 = 1;
    /** The anchor's scale as shown. */
    let sShow0 = 1;
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
    /** The pair's last centroid (client px), the zoom coast's anchor. */
    let releaseCentroid: Vec2 = { x: 0, y: 0 };

    const samples: AttitudeSample[] = [];
    const pushSample = (t: number) => {
        samples.push({
            t,
            q: [state.q[0], state.q[1], state.q[2], state.q[3]],
            // The pan in screen px (t·fit) and the zoom as ln s (OA-17).
            p: { x: state.t.x * f.fit, y: state.t.y * f.fit },
            ls: Math.log(state.s),
        });
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

    /** The centre's allowed intervals at scale `s` (the die's whole silhouette
     *  inside V, bounds.ts) and the band's reach on each axis. */
    const panLimits = (s: number) => {
        const st = f.stage;
        if (!st || st.right < st.left || st.bottom < st.top) return { x: UNBOUNDED, y: UNBOUNDED, dx: 0, dy: 0 };
        const D = f.side * s * f.fit * SILHOUETTE;
        return {
            x: panInterval(st.left, st.right, D),
            y: panInterval(st.top, st.bottom, D),
            dx: st.right - st.left,
            dy: st.bottom - st.top,
        };
    };

    const readFrame = () => {
        f = frame();
        R = radius(f);
        q0 = [state.q[0], state.q[1], state.q[2], state.q[3]];
        sShow0 = state.s;
        // D5 — the frame's centre is the REST centre; the panned centre is it
        // plus the pan the state holds.
        cRest = { ...f.centre };
        c0 = { x: cRest.x + state.t.x * f.fit, y: cRest.y + state.t.y * f.fit };
        // The raw pose under the band (exact inverse while it shows inside).
        s0 = Math.exp(unbanded(Math.log(state.s), lnRange, ZOOM_BAND_LN));
        const L = panLimits(state.s);
        t0 = {
            x: (unbanded(c0.x, L.x, L.dx) - cRest.x) / f.fit,
            y: (unbanded(c0.y, L.y, L.dy) - cRest.y) / f.fit,
        };
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

    /** Set the raw pan `t`: the projected centre lands inside its bound, or
     *  past it on the rubber band while the hand holds it (a hard wall under
     *  reduced motion). */
    const setTranslate = (t: Vec2) => {
        const L = panLimits(state.s);
        const c = { x: cRest.x + t.x * f.fit, y: cRest.y + t.y * f.fit };
        const x = banding() ? banded(c.x, L.x, L.dx) : clampTo(c.x, L.x);
        const y = banding() ? banded(c.y, L.y, L.dy) : clampTo(c.y, L.y);
        state.t = { x: (x - cRest.x) / f.fit, y: (y - cRest.y) / f.fit };
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
        const owner = scrollOwner();
        const offDie = Math.hypot(p0.x - c0.x, p0.y - c0.y) > R;
        pending = p.touch && (owner === "page" || (owner === "beside" && offDie));
        if (offDie) {
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

    /**
     * A grab off the die: the move's radial part (toward or away from the
     * die's centre) drives it as the wheel does, and its tangential part, the
     * angle swept about the centre, rolls it about the view axis by that angle
     * (the rim roll, owner 2026-11-11: a twist where the platform has none).
     * A pure arc about the centre only rolls; a pure radial move only drives.
     */
    const applyDrive = (p: Vec2) => {
        const a = { x: pPrev.x - c0.x, y: pPrev.y - c0.y };
        const b = { x: p.x - c0.x, y: p.y - c0.y };
        // A copy: `p` is the live pointer record, rewritten every move.
        pPrev = { x: p.x, y: p.y };
        const la = Math.hypot(a.x, a.y);
        const lb = Math.hypot(b.x, b.y);
        const mx = a.x + b.x;
        const my = a.y + b.y;
        const lm = Math.hypot(mx, my);
        if (la === 0 || lb === 0 || lm === 0) {
            turnBy(latched(driveVector({ x: b.x - a.x, y: b.y - a.y }, R)));
            return;
        }
        const dr = lb - la;
        const w = driveVector({ x: (mx / lm) * dr, y: (my / lm) * dr }, R);
        const roll = Math.atan2(a.x * b.y - a.y * b.x, a.x * b.x + a.y * b.y);
        turnBy(latched([w[0], w[1], roll]));
    };

    const applyPan = (p: Vec2) => {
        setTranslate({ x: t0.x + (p.x - p0.x) / f.fit, y: t0.y + (p.y - p0.y) / f.fit });
    };

    const applyPair = () => {
        const a = pointers.get(pairIds[0]);
        const b = pointers.get(pairIds[1]);
        if (!a || !b) return;
        releaseCentroid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        const raw = readPair(pairA0, pairB0, a, b);
        raw.dTheta = unwrapRadians(raw.dTheta, thetaPrev);
        thetaPrev = raw.dTheta;
        const eff = engagePair(raw);
        state.s = showScale(Math.log(s0 * eff.k));
        const k = state.s / sShow0;
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
        // kf-CubeTarget #55 — the acquire is guarded: an inactive pointerId or a
        // disconnected element throws, and the gesture does not depend on
        // capture (the document listeners drive it).
        try {
            surfaceRef()?.setPointerCapture(event.pointerId);
        } catch {
            /* KEEP: capture unavailable — the document listeners still drive it */
        }
        anchor();
        // After the anchor, so the first sample's pan reads this gesture's fit.
        samples.length = 0;
        pushSample(event.timeStamp);
    };

    /** "beside": the surface is pan-y, so the browser may take any vertical
     *  swipe as the page's. A touch that starts on the die's arcball (or a
     *  second finger, a pinch) is the die's, and only a cancelled touchstart
     *  keeps the browser off it. Beside the die the swipe is left to the page. */
    const onTouchStart = (event: TouchEvent) => {
        if (scrollOwner() !== "beside" || !event.cancelable) return;
        const t = event.touches[0];
        if (event.touches.length > 1 || (t && onArcball({ x: t.clientX, y: t.clientY }))) event.preventDefault();
    };

    const onPointerMove = (event: PointerEvent) => {
        const p = pointers.get(event.pointerId);
        if (!p) return;
        p.x = event.clientX;
        p.y = event.clientY;
        // Page mode, and beside the die (pan-y): a one-finger drag is the die's
        // only once it is horizontal. Until then the browser may still take it
        // as the page's scroll (a pointercancel), and the die must not have moved.
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
        // One moment of the hand, three channels (OA-17): ω, the pan and the
        // zoom. A Shift-pan authors no rotation; a pinch's zoom is anchored
        // at its last centroid.
        const omega = mode === "pan" ? ([0, 0, 0] as Vec3) : angularVelocityFromSamples(samples, event.timeStamp);
        const { pan, zoom } = poseRatesFromSamples(samples, event.timeStamp);
        const at = releaseCentroid;
        mode = "idle";
        isActive.value = false;
        samples.length = 0;
        onGestureEnd({ omega, pan, zoom, at });
    };

    const onPointerCancel = (event: PointerEvent) => {
        if (!pointers.has(event.pointerId)) return;
        // iOS cancels mid-pinch: the remaining state is untrustworthy.
        pointers.clear();
        releaseCapture(event);
        mode = "idle";
        isActive.value = false;
        samples.length = 0;
        onGestureEnd({ omega: [0, 0, 0] });
    };

    // ── Wheel ──────────────────────────────────────────────────────────
    const wheelPx = (event: WheelEvent, d: number) =>
        event.deltaMode === 1 ? d * 16 : event.deltaMode === 2 ? d * 400 : d;

    /** Pan by `d` screen px from where the die stands (raw under the band). */
    const panBy = (d: Vec2) => {
        readFrame();
        setTranslate({ x: t0.x + d.x / f.fit, y: t0.y + d.y / f.fit });
    };

    /**
     * Zoom by `ln` (ln s), anchored at `at` (client px): the content under it
     * stays under it. Past the scale range or the pan's bound the die rides
     * the rubber band (a hard wall under reduced motion).
     */
    const zoomBy = (ln: number, at: Vec2) => {
        readFrame();
        state.s = showScale(Math.log(s0) + ln);
        const k = state.s / sShow0;
        setTranslate({ x: t0.x + ((k - 1) * (c0.x - at.x)) / f.fit, y: t0.y + ((k - 1) * (c0.y - at.y)) / f.fit });
    };

    /**
     * The pose the let-go pan and zoom move (useOrbitalInertia): the shown
     * centre and ln s and their bounds; the setters write unclamped (the
     * coast and the spring own the bound).
     */
    const pose: OrbitPose = {
        read: () => {
            readFrame();
            const L = panLimits(state.s);
            return { c: { ...c0 }, ln: Math.log(state.s), x: L.x, y: L.y, z: lnRange };
        },
        setCentre: (c) => {
            state.t = { x: (c.x - cRest.x) / f.fit, y: (c.y - cRest.y) / f.fit };
        },
        setZoom: (ln, at) => {
            readFrame();
            const s1 = Math.exp(ln);
            const k = s1 / state.s;
            state.s = s1;
            state.t = {
                x: state.t.x + ((k - 1) * (c0.x - at.x)) / f.fit,
                y: state.t.y + ((k - 1) * (c0.y - at.y)) / f.fit,
            };
        },
    };

    // The zoom and the pan are summed per FRAME and applied once (flushWheel,
    // from the commit): coalesced or split events land the same pose.
    let zoomLn = 0;
    let zoomAt: Vec2 = { x: 0, y: 0 };
    let panPx: Vec2 = { x: 0, y: 0 };
    let streamAt = -Infinity;
    let streamFirst = 0;

    /** Apply the frame's summed wheel zoom and pan (the commit calls it). */
    const flushWheel = () => {
        const ln = zoomLn;
        const d = panPx;
        zoomLn = 0;
        panPx = { x: 0, y: 0 };
        if (pointers.size > 0) return;
        if (ln !== 0) zoomBy(Math.max(-WHEEL_ZOOM_STEP_CAP, Math.min(WHEEL_ZOOM_STEP_CAP, ln)), zoomAt);
        if (d.x !== 0 || d.y !== 0) panBy(d);
    };

    /** The pan / zoom stream's end: the rubber band lets go (the spring). */
    let liveTimer: ReturnType<typeof setTimeout> | undefined;
    const holdLive = () => {
        clearTimeout(liveTimer);
        liveTimer = setTimeout(() => {
            liveTimer = undefined;
            onSettle?.(zoomAt);
        }, WHEEL_LIVE_MS);
    };

    const handleWheel = (event: WheelEvent) => {
        const zoom = event.ctrlKey || event.metaKey;
        const orbit = !zoom && event.altKey;
        // An embed yields the plain wheel to its host page.
        if (!zoom && !orbit && scrollOwner() === "page") return;
        event.preventDefault();
        syncModifiers(event);
        const dx = wheelPx(event, event.deltaX);
        const dy = wheelPx(event, event.deltaY);
        if (Math.abs(dx) < 1e-4 && Math.abs(dy) < 1e-4) return;
        if (pointers.size > 0) return;
        const major = Math.abs(dy) >= Math.abs(dx) ? dy : dx;
        if (event.timeStamp - streamAt > WHEEL_STREAM_GAP_MS) streamFirst = major;
        streamAt = event.timeStamp;
        if (zoom || !orbit) {
            // A live pan or zoom stream takes the die from a let-go spring.
            if (!liveTimer) onGestureStart();
            holdLive();
        }
        if (zoom) {
            zoomLn += -dy / WHEEL_ZOOM_PX;
            zoomAt = { x: event.clientX, y: event.clientY };
            requestCommit();
            return;
        }
        if (!orbit) {
            // OA-17 — natural scrolling: the content follows the fingers. The
            // OS carries a trackpad's momentum in the stream itself, so the
            // wheel never coasts here.
            zoomAt = { x: event.clientX, y: event.clientY };
            panPx = { x: panPx.x + WHEEL_PAN_SIGN * dx, y: panPx.y + WHEEL_PAN_SIGN * dy };
            requestCommit();
            return;
        }
        // Alt/Option-wheel orbits through a virtual pointer moved by (−Δx, −Δy).
        // No anchor, no coast stop: a running glide keeps running and this
        // composes onto it.
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

    // ── Safari gesture* (and the host's relay of it) ────────────────────
    // Desktop Safari's trackpad pinch and twist arrive as gesture* with no
    // finger down: s = s₀·scale anchored at the cursor (the content under it
    // stays), roll = rotation about the view axis, both in one gesture. A host
    // that frames the slice relays the gesture* the browser hands to IT
    // (`relayGesture`, babb-embed v1); the slice ignores a relayed gesture
    // while it is receiving its own, so nothing is applied twice.
    const touchDown = () => [...pointers.values()].some((p) => p.touch);
    let trackpad = false;
    let relayed = false;
    let gestureAt: Vec2 = { x: 0, y: 0 };

    const gestureBegin = (at: Vec2) => {
        onGestureStart();
        readFrame();
        gestureAt = Number.isFinite(at.x) && Number.isFinite(at.y) ? { ...at } : { ...c0 };
    };

    const gestureApply = (scale: number, rotationDeg: number) => {
        state.s = showScale(Math.log(s0 * (scale > 0 ? scale : 1)));
        const k = state.s / sShow0;
        setTranslate({
            x: t0.x + ((k - 1) * (c0.x - gestureAt.x)) / f.fit,
            y: t0.y + ((k - 1) * (c0.y - gestureAt.y)) / f.fit,
        });
        state.q = applyScreenDelta(q0, quatFromAxisAngle([0, 0, 1], ((rotationDeg || 0) * Math.PI) / 180), G);
        requestCommit();
    };

    /** The gesture lets go: whatever stands past a bound springs back. */
    const gestureFinish = () => onGestureEnd({ omega: [0, 0, 0] });

    const onGestureStartEvent = (event: Event) => {
        event.preventDefault();
        if (touchDown()) return;
        const e = event as GestureEvent;
        relayed = false;
        trackpad = true;
        gestureBegin({ x: e.clientX, y: e.clientY });
    };

    const onGestureChange = (event: Event) => {
        if (!trackpad && !touchDown()) return;
        event.preventDefault();
        if (!trackpad) return;
        const e = event as GestureEvent;
        gestureApply(e.scale, e.rotation);
    };

    const onGestureEndEvent = (event: Event) => {
        if (!trackpad) return;
        event.preventDefault();
        trackpad = false;
        gestureFinish();
    };

    /** A gesture the host relays (its own gesture*, in this frame's client px). */
    const relayGesture = (phase: "start" | "change" | "end", scale: number, rotationDeg: number, at: Vec2) => {
        if (phase === "start") {
            if (trackpad || pointers.size > 0) return;
            relayed = true;
            gestureBegin(at);
        } else if (phase === "change") {
            if (relayed && !trackpad) gestureApply(scale, rotationDeg);
        } else if (relayed) {
            relayed = false;
            if (!trackpad) gestureFinish();
        }
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
        onTouchStart,
        handleWheel,
        flushWheel,
        panBy,
        zoomBy,
        pose,
        relayGesture,
        onArcball,
        onGestureStartEvent,
        onGestureChange,
        onGestureEndEvent,
        setAxisLatch,
        resetPressedKeys,
    };
}
