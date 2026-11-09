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
import { DEFAULT_INERTIA_FACTOR } from "./composables/inertiaDecay";
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
 *  · Gesture moves write the state; ONE commit per frame writes the model,
 *    emits, and ticks the render (no Euler-triple render dependency).
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

let commitHandle = 0;
const commitNow = () => {
    if (commitHandle) cancelAnimationFrame(commitHandle);
    commitHandle = 0;
    writeModel();
};
const requestCommit = () => {
    if (commitHandle) return;
    commitHandle = requestAnimationFrame(() => {
        commitHandle = 0;
        gesture.flushWheel();
        writeModel();
    });
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
// The pan and zoom channels apply through the reader's own clamped,
// cursor-anchored setters (declared below; called only once a coast runs).
const inertia = useOrbitalInertia({
    inertiaFactor: props.inertiaFactor,
    reducedMotion,
    rotateBy: (axis: Vec3, angle: number) => {
        state.q = quatCanonical(quatMultiply(quatFromAxisAngle(axis, angle), state.q));
        writeModel();
    },
    panBy: (d) => {
        const free = gesture.panBy(d);
        writeModel();
        return free;
    },
    zoomBy: (ln, at) => {
        const free = gesture.zoomBy(ln, at);
        writeModel();
        return free;
    },
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
    onGestureStart: () => inertia.stop(),
    onGestureEnd: (release) => {
        commitNow();
        if (!inertia.start(release)) writeModel(true);
    },
    // A wheel notch glides out on the coast's own decay, conjugated into Q's
    // frame (G is fixed, so turning the axis by G⁻¹ is the conjugation).
    onGlide: (w) => void inertia.glide(rotateVec(Ginv, w)),
});

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
    useEventListener(surface, "touchstart", gesture.onTouchStart, { passive: false });
    // Safari gesture*: page-zoom suppression while fingers are down, and the
    // desktop trackpad pinch when none are.
    useEventListener(surface, "gesturestart", gesture.onGestureStartEvent, { passive: false });
    useEventListener(window, "gesturechange", gesture.onGestureChange, { passive: false });
    useEventListener(window, "gestureend", gesture.onGestureEndEvent, { passive: false });
});

onUnmounted(() => {
    inertia.stop();
    if (commitHandle) cancelAnimationFrame(commitHandle);
});

// kf-CubeTarget #1 — THE CAPTURE SURFACE, published (a consumer recognising its
// own gesture listens where the captured events are delivered), with OD-5's
// escape hatch.
defineExpose({
    containerRef,
    resetPressedKeys: gesture.resetPressedKeys,
    onArcball: gesture.onArcball,
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
