<template>
    <div ref="containerRef" :style="containerStyle">
        <!-- P.W5.S3 — the axis-lock-reveal egg seam: expose `pressedKeys` (the
             X/Y/Z/modifier latch this component owns) as a scoped slot prop so
             the cube can light the locked axis line. Reactive, no new rAF. -->
        <slot :pressed-keys="gesture.pressedKeys.value"></slot>
    </div>
</template>

<script setup lang="ts">
// SERVED MODEL: claude-opus-5-5
import { registerShortcut } from "@mkbabb/glass-ui/keyboard";
import { useEventListener } from "@vueuse/core";
import { computed, onMounted, onUnmounted, shallowRef, useTemplateRef, watch } from "vue";
import { attitudeQuat } from "../graphAttitude";
import {
    quatCanonical,
    quatConjugate,
    quatDot,
    quatFromAxisAngle,
    quatMultiply,
    quatSlerp,
    quatToAxisAngle,
    panInPlane,
    rotateVec,
} from "./arcball";
import type { Quat, Vec3 } from "./arcball";
import type { TransformBounds, TransformState } from "./transform";
import type { PressedKeys } from "./types";
import { defaultTransformBounds, defaultTransformState } from "./transform";
import { useOrbitalGesture } from "./composables/useOrbitalGesture";
import type { OrbitFrame, OrbitState, ScrollOwner } from "./composables/useOrbitalGesture";
import { useOrbitalInertia } from "./composables/useOrbitalInertia";
import { DEFAULT_INERTIA_FACTOR, SPRING_K } from "./composables/inertiaDecay";
import {
    eulerDegreesToQuaternion,
    foldEulerDegrees,
    quaternionToEulerDegrees,
} from "./quaternionEuler";

/**
 * THE ORBIT (KF-M2, COHESION §0hm). One reader, one state, one render.
 *
 *  · The stored truth is the container-local attitude Q (`model.quaternion`),
 *    kept unit and in the w ≥ 0 hemisphere. The rendered world attitude is
 *    G·Q, G the stage attitude `.graph` is parked at (graphAttitude.ts).
 *  · A screen-frame rotation q_s reaches Q conjugated, Q' = (G⁻¹·q_s·G)·Q₀, so
 *    a drag turns the die about the axis the hand sees (the former local-frame
 *    axis skewed it up to 30°).
 *  · The pan is in SCREEN px and renders in the stage's own plane
 *    (panInPlane: local z = 0, so `.graph`'s perspective cannot magnify it):
 *    the die's centre lands exactly t (the former 1.43×, D-13; translate3d
 *    (G⁻¹·t)'s own local depth, 1.15× at a 440 px pan).
 *  · The Euler triple is a READOUT (Y·X·Z, continuous, quaternionEuler.ts).
 *  · Gesture moves write the state; ONE frame loop (`tick`) flushes the
 *    wheel, advances the coast or the spring home, and commits once: one model
 *    write, one emit, one render tick per frame, transform only. Nothing else
 *    in the orbit asks for a frame.
 */
const props = withDefaults(
    defineProps<{
        inertiaFactor?: number;
        bounds?: TransformBounds;
        /** The subject's projected centre, layout side, live fit and the
         *  visible stage — read once per gesture anchor. */
        frame?: () => OrbitFrame;
        applyTransformToContainer?: boolean;
        /** The element the gesture is read on and captured by (the whole
         *  stage); the container itself when absent. */
        surface?: HTMLElement | null;
        /** Who a vertical scroll over the surface belongs to. */
        scrollOwner?: ScrollOwner;
    }>(),
    { inertiaFactor: DEFAULT_INERTIA_FACTOR, surface: null, scrollOwner: "stage" },
);

const emit = defineEmits<{
    (e: "rotate", state: TransformState["rotate"]): void;
    (e: "translate", state: TransformState["translate"]): void;
    (e: "scale", scale: TransformState["scale"]): void;
    // P.W5.S3 — the X/Y/Z/modifier latch, whenever it changes.
    (e: "pressedKeys", keys: PressedKeys): void;
}>();

const model = defineModel<TransformState>({
    default: defaultTransformState,
});

if (Object.keys(model.value).length === 0) {
    Object.assign(model.value, structuredClone(defaultTransformState));
}

const containerRef = useTemplateRef<HTMLElement>("containerRef");
const bounds = props.bounds ?? defaultTransformBounds;
const G: Quat = attitudeQuat();
const Ginv: Quat = quatConjugate(G);

const seedQuaternion = (): Quat => {
    const stored = model.value.quaternion;
    if (stored && stored.length === 4) return quatCanonical(stored);
    const { x, y, z } = model.value.rotate;
    return quatCanonical(eulerDegreesToQuaternion(x, y, z));
};

const state: OrbitState = {
    q: seedQuaternion(),
    t: { x: model.value.translate.x, y: model.value.translate.y },
    s: model.value.scale.x,
};

// ── The render ──────────────────────────────────────────────────────
// The version tick is the render's ONE dependency for the attitude (bumped
// once per commit), replacing the `void rotate.x/y/z` read of the readout.
const version = shallowRef(0);

const containerStyle = computed(() => {
    if (!props.applyTransformToContainer) return {};
    void version.value;
    const { translate, scale: s } = model.value;
    const tl = panInPlane(G, [translate.x, translate.y, translate.z]);
    const { axis, angle } = quatToAxisAngle(state.q);
    return {
        transformStyle: "preserve-3d" as const,
        willChange: "transform" as const,
        transform: `translate3d(${tl[0]}px, ${tl[1]}px, ${tl[2]}px) rotate3d(${axis[0]}, ${axis[1]}, ${axis[2]}, ${angle * (180 / Math.PI)}deg) scale3d(${s.x}, ${s.y}, ${s.z})`,
    };
});

// ── The commit: one model write, one emit, one tick per frame ───────
const writeModel = (fold = false) => {
    const m = model.value;
    const readout = quaternionToEulerDegrees(state.q, m.rotate);
    const r = fold ? foldEulerDegrees(readout) : readout;
    m.rotate.x = r.x;
    m.rotate.y = r.y;
    m.rotate.z = r.z;
    m.quaternion = [state.q[0], state.q[1], state.q[2], state.q[3]];
    if (m.translate.x !== state.t.x || m.translate.y !== state.t.y) {
        m.translate.x = state.t.x;
        m.translate.y = state.t.y;
        emit("translate", { ...m.translate });
    }
    if (m.scale.x !== state.s || m.scale.y !== state.s || m.scale.z !== state.s) {
        m.scale.x = m.scale.y = m.scale.z = state.s;
        emit("scale", { ...m.scale });
    }
    emit("rotate", { ...m.rotate });
    version.value++;
};

// ── THE frame loop: one requestAnimationFrame for the whole orbit ────
// The wheel's follower, the coast, the spring home and the gesture's commit
// all run here, once a frame; the loop stops itself when nothing is live.
let frameHandle = 0;
/** The state changed since the last commit. */
let dirty = false;
const tick = (now: number) => {
    frameHandle = 0;
    const wheel = gesture.flushWheel(now);
    const owed = wheel === "owed";
    const ahead = gesture.unwindPrediction(now);
    const coasting = inertia.advance(now);
    const homing = stepHome(now);
    if (dirty || coasting || homing || wheel !== "idle" || ahead === "unwound") {
        dirty = false;
        writeModel();
    }
    if (coasting || homing || owed || ahead === "ahead") requestFrame();
};
const requestFrame = () => {
    if (!frameHandle) frameHandle = requestAnimationFrame(tick);
};
const requestCommit = () => {
    dirty = true;
    requestFrame();
};
const commitNow = () => {
    dirty = false;
    writeModel();
};

// ── The frame the reader anchors on ─────────────────────────────────
const defaultFrame = (): OrbitFrame => {
    const el = containerRef.value;
    const r = el?.getBoundingClientRect();
    // The container carries the pan: its rest centre is the rect's less t.
    return {
        centre: r
            ? { x: r.left + r.width / 2 - state.t.x, y: r.top + r.height / 2 - state.t.y }
            : { x: 0, y: 0 },
        side: el?.offsetWidth ?? 0,
        fit: 1,
        stage: null,
    };
};
const readFrame = (): OrbitFrame => {
    const f = props.frame?.() ?? defaultFrame();
    return { ...f, fit: f.fit > 0 ? f.fit : 1, stage: bounds.stage?.() ?? f.stage };
};

const reducedMotion = () =>
    typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

// ── The coast: rotation, pan and zoom (OA-17) ───────────────────────
// The pan and zoom channels move the reader's pose (declared below; read only
// once a coast runs), inside its bounds or springing back to them.
const inertia = useOrbitalInertia({
    inertiaFactor: props.inertiaFactor,
    reducedMotion,
    rotateBy: (axis: Vec3, angle: number) => {
        state.q = quatCanonical(quatMultiply(quatFromAxisAngle(axis, angle), state.q));
    },
    pose: {
        read: () => gesture.pose.read(),
        setCentre: (c) => gesture.pose.setCentre(c),
        setZoom: (ln, at) => gesture.pose.setZoom(ln, at),
    },
    requestFrame,
    onRest: () => writeModel(true),
});

// ── The reader ──────────────────────────────────────────────────────
const surfaceEl = (): HTMLElement | null => props.surface ?? containerRef.value;

const gesture = useOrbitalGesture({
    surfaceRef: surfaceEl,
    scrollOwner: () => props.scrollOwner,
    G,
    state,
    frame: readFrame,
    scaleRange: bounds.scale,
    requestCommit,
    // D1 — the state is the truth; a gesture never re-seeds from the model
    // (the external-write watch below does, the moment one lands).
    onGestureStart: () => {
        home = null;
        inertia.stop();
    },
    onGestureEnd: (release) => {
        commitNow();
        if (!inertia.start(release)) writeModel(true);
    },
    // A wheel notch glides out on the coast's own decay, conjugated into Q's
    // frame (G is fixed, so turning the axis by G⁻¹ is the conjugation).
    onGlide: (w) => void inertia.glide(rotateVec(Ginv, w)),
    // A wheel stream's end settles: a pan or zoom past a bound springs back,
    // and with nothing left moving the readout folds.
    onSettle: (at) => {
        inertia.settle(at);
        if (!inertia.coasting()) writeModel(true);
    },
    reducedMotion,
});

// ── Home: Reset returns the orbit to its load pose on the settle spring ──
// The attitude, pan and zoom travel together on p(t) = 1 − (1 + k·t)·e^(−k·t)
// (the critically damped spring, SPRING_K: zero velocity at both ends, no
// overshoot), sampled at elapsed time in the one frame loop. A gesture takes
// it over where it stands. Under reduced motion it is a fade: the die fades
// out where it is and in at home (opacity only, 120 + 160 ms), never a cut and
// never a travel.
const HOME_REST = 1e-4;
let home: { t0: number; q: Quat; t: { x: number; y: number }; ln: number } | null = null;
let fade: Animation | null = null;
const stepHome = (now: number): boolean => {
    if (!home) return false;
    if (home.t0 < 0) home.t0 = now;
    const k = SPRING_K;
    const tau = (now - home.t0) / 1000;
    const left = (1 + k * tau) * Math.exp(-k * tau);
    const done = left < HOME_REST;
    const p = done ? 1 : 1 - left;
    state.q = done ? [0, 0, 0, 1] : quatCanonical(quatSlerp(home.q, [0, 0, 0, 1], p));
    state.t = done ? { x: 0, y: 0 } : { x: home.t.x * (1 - p), y: home.t.y * (1 - p) };
    state.s = done ? 1 : Math.exp(home.ln * (1 - p));
    if (!done) return true;
    home = null;
    writeModel(true);
    return false;
};
/** The pose at rest at home (identity, no pan, scale 1). */
const atHome = () =>
    Math.abs(state.q[3]) > 1 - 1e-6 && Math.hypot(state.t.x, state.t.y) < 0.5 && Math.abs(state.s - 1) < 1e-3;
const putHome = () => {
    state.q = [0, 0, 0, 1];
    state.t = { x: 0, y: 0 };
    state.s = 1;
    writeModel(true);
};
const goHome = () => {
    inertia.stop();
    gesture.dropOwed();
    if (reducedMotion()) {
        const el = containerRef.value;
        fade?.cancel();
        if (!el || typeof el.animate !== "function") return putHome();
        const out = el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, easing: "ease-in" });
        fade = out;
        out.onfinish = () => {
            putHome();
            if (fade !== out) return;
            fade = el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: "ease-out" });
        };
        return;
    }
    home = { t0: -1, q: [state.q[0], state.q[1], state.q[2], state.q[3]], t: { ...state.t }, ln: Math.log(state.s) };
    requestFrame();
};

// ── The keyboard: the arrows turn the die on the same decay ─────────
// With the stage focused, an arrow turns the die 15° (Shift: 45°) about the
// screen's vertical (← →) or horizontal (↑ ↓), the near face moving with the
// arrow, glided out on the coast's own closed form (a held key's repeats
// stack into one glide); Home returns it. Under reduced motion the glide is
// shortened, never cut.
const ARROW_STEP_RAD = (15 * Math.PI) / 180;
const ARROW_TURN: Record<string, Vec3> = {
    ArrowLeft: [0, -1, 0],
    ArrowRight: [0, 1, 0],
    ArrowUp: [1, 0, 0],
    ArrowDown: [-1, 0, 0],
};
const onKeydown = (event: KeyboardEvent) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "Home") {
        event.preventDefault();
        goHome();
        return;
    }
    const dir = ARROW_TURN[event.key];
    if (!dir) return;
    event.preventDefault();
    event.stopPropagation();
    home = null;
    const a = ARROW_STEP_RAD * (event.shiftKey ? 3 : 1);
    inertia.glide(rotateVec(Ginv, [dir[0] * a, dir[1] * a, dir[2] * a]));
};

// ── The axis latch — KF-AX-1 ≡ OD-3/OD-4/OD-5/OD-6/OD-25/OD-31 ──────
// THE ONE REGISTRY. Holding X, Y or Z constrains the orbit to that axis. The
// binding is SPATIAL (`event.code`), the registry skips editable targets and
// a bare combo matches only with no modifiers held (so ⌘Z never latches Z),
// and the labelled registrations teach the gesture in the shortcuts map.
const AXIS_KEYS = [
    { axis: "x", code: "KeyX" },
    { axis: "y", code: "KeyY" },
    { axis: "z", code: "KeyZ" },
] as const;

for (const { axis, code } of AXIS_KEYS) {
    const label = `Orbit on ${axis.toUpperCase()} axis (hold)`;
    registerShortcut(code, () => gesture.setAxisLatch(axis, true), {
        label,
        group: "Cube",
    });
    registerShortcut(code, () => gesture.setAxisLatch(axis, false), {
        event: "keyup",
        group: "Cube",
    });
}

// OD-5 — a blur or an app switch never delivers the latch's keyup; clear it.
useEventListener(window, "blur", () => gesture.resetPressedKeys());
useEventListener(document, "visibilitychange", () => {
    if (document.visibilityState === "hidden") gesture.resetPressedKeys();
});

onMounted(() => {
    // The surface may arrive after the container (a parent's root ref).
    const surface = computed(() => props.surface ?? containerRef.value);
    useEventListener(surface, "wheel", (event) => gesture.handleWheel(event as WheelEvent), {
        passive: false,
    });
    useEventListener(surface, "pointerdown", gesture.onPointerDown);
    // A right-button drag pans: the stage keeps the context menu off it.
    useEventListener(surface, "contextmenu", (event) => event.preventDefault());
    useEventListener(surface, "touchstart", gesture.onTouchStart, { passive: false });
    // Safari gesture*: page-zoom suppression while fingers are down, and the
    // desktop trackpad pinch when none are.
    useEventListener(surface, "gesturestart", gesture.onGestureStartEvent, { passive: false });
    useEventListener(surface, "keydown", onKeydown);
    useEventListener(window, "gesturechange", gesture.onGestureChange, { passive: false });
    useEventListener(window, "gestureend", gesture.onGestureEndEvent, { passive: false });
});

onUnmounted(() => {
    inertia.stop();
    fade?.cancel();
    if (frameHandle) cancelAnimationFrame(frameHandle);
});

// kf-CubeTarget #1 — THE CAPTURE SURFACE, published (a consumer recognising its
// own gesture listens where the captured events are delivered), with OD-5's
// escape hatch.
defineExpose({
    containerRef,
    resetPressedKeys: gesture.resetPressedKeys,
    onArcball: gesture.onArcball,
    /** A host's relayed gesture* (babb-embed v1, in this frame's client px). */
    relayGesture: gesture.relayGesture,
    /** Return to the load pose on the settle spring (Reset). */
    home: goHome,
    /** Is the die at rest at its load pose? */
    atHome,
});

// The reverse path: an EXTERNAL write to the readout (Reset, a slider, a
// restored state) re-seeds the attitude. The test is by ROTATION, not by
// bytes — the readout is unwrapped and folded, so its numbers drift from any
// fresh extraction while naming the same attitude; only a write that names a
// different rotation is external.
watch(
    () => [model.value.rotate.x, model.value.rotate.y, model.value.rotate.z] as const,
    ([x, y, z]) => {
        const q = eulerDegreesToQuaternion(x, y, z);
        if (Math.abs(quatDot(q, state.q)) >= 1 - 1e-12) return;
        inertia.stop();
        state.q = quatCanonical(q);
        model.value.quaternion = [state.q[0], state.q[1], state.q[2], state.q[3]];
        version.value++;
    },
);

// The same for an external write of the attitude itself.
watch(
    () => model.value.quaternion,
    (q) => {
        if (!q || Math.abs(quatDot(q, state.q)) >= 1 - 1e-12) return;
        inertia.stop();
        state.q = quatCanonical(q);
        version.value++;
    },
);

// …and of the pan and the zoom (Reset, a slider, a restored state). Epsilon,
// not bytes: our own commit writes the state's exact numbers back.
watch(
    () => [model.value.translate.x, model.value.translate.y, model.value.scale.x] as const,
    ([x, y, s]) => {
        const eps = 1e-9;
        if (Math.abs(x - state.t.x) < eps && Math.abs(y - state.t.y) < eps && Math.abs(s - state.s) < eps)
            return;
        state.t = { x, y };
        state.s = s;
        version.value++;
    },
);

// P.W5.S3 — surface the latch to the parent the moment it changes.
watch(
    () => gesture.pressedKeys.value,
    (keys) => emit("pressedKeys", { ...keys }),
    { deep: true },
);
</script>

<style scoped>
div {
    cursor: move;
    user-select: none;
}
</style>
