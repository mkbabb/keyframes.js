<template>
    <div ref="containerRef" :style="containerStyle">
        <!-- P.W5.S3 — the axis-lock-reveal egg seam: expose `pressedKeys` (the
             X/Y/Z/modifier latch this component already owns) as a scoped slot
             prop so the cube can light the locked axis line. Reactive, no new
             rAF — the same ref the gesture readers mutate. -->
        <slot :pressed-keys="pointer.pressedKeys.value"></slot>
    </div>
</template>

<script setup lang="ts">
import { clamp } from "@mkbabb/value.js/math";
import { useEventListener } from "@vueuse/core";
import { quat, vec3 } from "gl-matrix";
import { computed, onMounted, onUnmounted, ref, useTemplateRef, watch } from "vue";
import type { TransformBounds, TransformState, VelocityState } from ".";
import type { PressedKeys } from "./types";
import { axes, defaultTransformBounds, defaultTransformState, defaultVelocityState } from ".";
import { useOrbitalInertia } from "./composables/useOrbitalInertia";
import { useOrbitalPinch } from "./composables/useOrbitalPinch";
import { useOrbitalPointer } from "./composables/useOrbitalPointer";
import { eulerDegreesToQuaternion, quaternionToEulerDegrees } from "./quaternionEuler";

const props = defineProps<{
    sensitivity?: number;
    translationFactor?: number;
    inertiaFactor?: number;
    scaleFactor?: number;
    bounds?: TransformBounds;
    applyTransformToContainer?: boolean;
}>();

const emit = defineEmits<{
    (e: "rotate", state: TransformState["rotate"]): void;
    (e: "translate", state: TransformState["translate"]): void;
    (e: "scale", scale: TransformState["scale"]): void;
    // P.W5.S3 — the axis-lock-reveal egg: emit the X/Y/Z/modifier latch whenever
    // it changes so a parent (the cube) can light the locked axis line. Reactive,
    // no rAF — fired from the keydown/keyup watch over the owned `pressedKeys`.
    (e: "pressedKeys", keys: PressedKeys): void;
}>();

const model = defineModel<TransformState>({
    default: defaultTransformState,
});

if (Object.keys(model.value).length === 0) {
    Object.assign(model.value, defaultTransformState);
}

const containerRef = useTemplateRef<HTMLElement>("containerRef");

const sensitivity = props.sensitivity ?? 0.5;
const touchSensitivity = sensitivity * 0.5;
const translationFactor = props.translationFactor ?? 0.8;
const inertiaFactor = props.inertiaFactor ?? 0.95;
const scaleFactor = props.scaleFactor ?? 0.02;
const bounds = props.bounds ?? defaultTransformBounds;

const velocity = ref<VelocityState>(structuredClone(defaultVelocityState));
const renderAxis = vec3.create(); // reused getAxisAngle out-param (zero-alloc)

const containerStyle = computed(() => {
    if (!props.applyTransformToContainer) return {};
    // `void …rotate.x` registers the reactive dep (syncRotationToModel writes it
    // per rotation) so the computed re-runs, then renders ONE rotate3d() off the
    // quaternion's NATIVE axis-angle — no Euler decompose, no Rx·Ry·Rz, no gimbal.
    void model.value.rotate.x;
    const { translate, scale: s } = model.value;
    const angleDeg = quat.getAxisAngle(renderAxis, currentQuaternion) * (180 / Math.PI);
    return {
        transformStyle: 'preserve-3d' as const,
        willChange: 'transform' as const,
        transform: `translate3d(${translate.x}px, ${translate.y}px, ${translate.z}px) rotate3d(${renderAxis[0]}, ${renderAxis[1]}, ${renderAxis[2]}, ${angleDeg}deg) scale3d(${s.x}, ${s.y}, ${s.z})`,
    };
});

// ── Quaternion core — the rotation source of truth ──────────────────
// Never reconstructed from Euler angles; only multiplied by delta quaternions.
const currentQuaternion = quat.create();

// Angular velocity for inertia: axis + speed, not per-Euler-component.
const angularVelocityAxis = vec3.fromValues(0, 1, 0);
const angularVelocitySpeed = ref(0);

/** Set by gesture composables during active interaction to suppress emit overhead. */
let isInteracting = false;

const syncRotationToModel = () => {
    const angles = quaternionToEulerDegrees(currentQuaternion);
    model.value.rotate.x = angles.x;
    model.value.rotate.y = angles.y;
    model.value.rotate.z = angles.z;
    // Skip emit during active interaction to reduce reactivity cascade on iOS
    if (!isInteracting) {
        emit("rotate", { ...model.value.rotate });
    }
};

// Re-seed the quaternion source-of-truth FROM the Euler v-model — the reverse
// path. The forward path (drag) mutates `currentQuaternion` directly and DERIVES
// the Euler triple from it (syncRotationToModel); but the v-model is two-way, so
// an EXTERNAL write to `model.value.rotate` (the matrix-editor Reset, a slider,
// a restored share-hash) must re-seed the quaternion the render reads — otherwise
// the container renders the stale dragged orientation. Same `Rx·Ry·Rz`
// construction onMounted uses (the convention useTransformState consumes).
const rebuildQuaternionFromEuler = () => {
    const { x, y, z } = model.value.rotate;
    eulerDegreesToQuaternion(currentQuaternion, x, y, z);
};

const applyRotation = (axis: vec3, angle: number) => {
    if (Math.abs(angle) < 1e-10) return;

    const deltaQuat = quat.create();
    quat.setAxisAngle(deltaQuat, axis, angle);
    quat.multiply(currentQuaternion, deltaQuat, currentQuaternion);
    quat.normalize(currentQuaternion, currentQuaternion);

    syncRotationToModel();
};

const updateRotation = (deltaX: number, deltaY: number, isTouch = false) => {
    const axis = vec3.fromValues(-deltaY, deltaX, 0);
    const magnitude = vec3.length(axis);
    if (magnitude < 1e-6) return;

    vec3.normalize(axis, axis);
    const s = isTouch ? touchSensitivity : sensitivity;
    const angle = (magnitude * s) / 25;

    applyRotation(axis, angle);

    // EMA-smoothed angular velocity for inertia
    const alpha = 0.3;
    vec3.lerp(angularVelocityAxis, angularVelocityAxis, axis, alpha);
    vec3.normalize(angularVelocityAxis, angularVelocityAxis);
    angularVelocitySpeed.value = alpha * angle + (1 - alpha) * angularVelocitySpeed.value;
};

const updateAxisRotation = (constrainedAxes: (typeof axes)[number][], deltaX: number, deltaY: number, isTouch = false) => {
    const magnitude = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    if (magnitude < 1e-6) return;

    const s = isTouch ? touchSensitivity : sensitivity;
    const angle = (magnitude * s) / 25;

    for (const a of constrainedAxes) {
        const axis = vec3.fromValues(
            a === "x" ? 1 : 0,
            a === "y" ? 1 : 0,
            a === "z" ? 1 : 0,
        );
        applyRotation(axis, angle * Math.sign(a === "x" ? -deltaY : deltaX));
    }

    angularVelocitySpeed.value = angle;
};

// ── Linear transform appliers ───────────────────────────────────────
// The translate/scale counterparts of the rotation appliers above — they
// mutate the `model`/`velocity` this component owns and emit the category,
// so they belong here beside `applyRotation`, NOT in the pointer reader.
// `useOrbitalPointer` receives them as callbacks (symmetric with rotation).

const updateLinearTransform = (
    category: "translate" | "scale",
    axis: (typeof axes)[number],
    value: number,
    velocityValue: number,
) => {
    (model.value[category] as Record<string, number>)[axis] = value;
    (velocity.value[category] as Record<string, number>)[axis] = velocityValue;

    const categoryBounds = (bounds as unknown as Record<string, Record<string, [number, number]>>)[category]!;
    for (const [k, v] of Object.entries(model.value[category] as Record<string, number>)) {
        const [min, max] = categoryBounds[k]!;
        (model.value[category] as unknown as Record<string, number>)[k] = clamp(v, min, max);
    }

    if (category === "translate") emit("translate", { ...model.value.translate });
    else emit("scale", { ...model.value.scale });
};

const updateTranslation = (axis: (typeof axes)[number], delta: number) => {
    updateLinearTransform("translate", axis, model.value.translate[axis] + delta * translationFactor, delta * translationFactor);
};

const updateScale = (axis: (typeof axes)[number], delta: number) => {
    updateLinearTransform("scale", axis, model.value.scale[axis] + delta * scaleFactor, delta * scaleFactor);
};

const handleAxisSpecificInput = (deltaX: number, deltaY: number, isTouch = false) => {
    const keys = pointer.pressedKeys.value;
    const delta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;

    if (keys.x) {
        if (keys.shift) updateTranslation("x", delta);
        else if (keys.ctrl || keys.meta) updateScale("x", delta);
        else updateAxisRotation(["x"], deltaX, deltaY, isTouch);
    }
    if (keys.y) {
        if (keys.shift) updateTranslation("y", delta);
        else if (keys.ctrl || keys.meta) updateScale("y", delta);
        else updateAxisRotation(["y"], deltaX, deltaY, isTouch);
    }
    if (keys.z) {
        if (keys.shift) updateTranslation("z", delta);
        else if (keys.ctrl || keys.meta) updateScale("z", delta);
        else updateAxisRotation(["z"], deltaX, deltaY, isTouch);
    }
};

// ── Compose gesture handling ────────────────────────────────────────

// Pinch must be created before pointer so we can pass resetPinchDistance as onStopDrag.
// Use a late-binding wrapper since pinch isn't assigned yet at pointer creation time.
let pinchResetFn: (() => void) | undefined;

const pointer = useOrbitalPointer({
    sensitivity,
    touchSensitivity,
    containerRef,
    updateRotation,
    applyRotation,
    updateTranslation,
    updateScale,
    handleAxisSpecificInput,
    angularVelocityAxis,
    angularVelocitySpeed,
    onStopDrag: () => pinchResetFn?.(),
});

const pinch = useOrbitalPinch({
    model,
    isTouching: pointer.isTouching,
    isWheeling: pointer.isWheeling,
    scaleFactor,
    updateTranslation,
    updateScale,
    applyRotation,
    angularVelocityAxis,
    angularVelocitySpeed,
});

pinchResetFn = pinch.resetPinchDistance;

const inertia = useOrbitalInertia({
    model,
    velocity,
    isDragging: pointer.isDragging,
    isTouching: pointer.isTouching,
    isWheeling: pointer.isWheeling,
    inertiaFactor,
    angularVelocitySpeed,
    applyRotation,
    angularVelocityAxis,
    updateLinearTransform,
});

// ── Lifecycle ───────────────────────────────────────────────────────

onMounted(() => {
    // Initialize the quaternion source-of-truth from the model's initial Euler.
    rebuildQuaternionFromEuler();

    useEventListener(
        containerRef,
        "wheel",
        (event) => {
            pointer.handleWheel(event as WheelEvent);
        },
        { passive: false },
    );

    useEventListener(window, "keydown", (e: KeyboardEvent) => pointer.updatePressedKeys(e, true));
    useEventListener(window, "keyup", (e: KeyboardEvent) => pointer.updatePressedKeys(e, false));

    // Pointer Events on container -- dynamic doc listeners via setPointerCapture
    useEventListener(containerRef, "pointerdown", pointer.onPointerDown);

    // Touch events on container only -- for multi-touch pinch (2+ fingers)
    useEventListener(containerRef, "touchstart", pinch.startTouchPinch, { passive: false });
    useEventListener(containerRef, "touchmove", pinch.handleTouchPinch, { passive: false });
    useEventListener(containerRef, "touchend", pinch.stopTouchPinch);

    // Safari gesture events: start on container, change/end on window with isTouching guard
    useEventListener(containerRef, "gesturestart", pinch.startGesture as (event: Event) => void, { passive: false });
    useEventListener(window, "gesturechange", pinch.gesture as (event: Event) => void, { passive: false });
    useEventListener(window, "gestureend", pinch.stopGesture);

});

onUnmounted(() => {
    inertia.pause();
});

// The reverse path (external Euler → quaternion). The forward path writes
// `model.value.rotate` as EXACTLY `quaternionToEulerDegrees(currentQuaternion)`,
// so an echo of our own write is byte-identical to the quaternion's current
// Euler — skip it. Any OTHER value is an external write (Reset / slider / share)
// and must re-seed the quaternion the render reads, or the container would render
// the stale dragged orientation. `flush: 'pre'` re-seeds before the render reads
// `currentQuaternion` through `containerStyle`'s `void model.value.rotate.x` dep.
watch(
    () => [model.value.rotate.x, model.value.rotate.y, model.value.rotate.z],
    ([x, y, z]) => {
        const echo = quaternionToEulerDegrees(currentQuaternion);
        if (x === echo.x && y === echo.y && z === echo.z) return;
        rebuildQuaternionFromEuler();
    },
);

// P.W5.S3 — the axis-lock-reveal egg: surface the X/Y/Z latch to the parent the
// moment it changes (keydown/keyup mutate `pointer.pressedKeys` in place, so a
// deep watch catches each toggle). The cube reads this to light the locked axis.
watch(
    () => pointer.pressedKeys.value,
    (keys) => emit("pressedKeys", { ...keys }),
    { deep: true },
);

// Dampen velocities on release of drag/touch/wheel + emit deferred rotation
watch(
    () => pointer.isDragging.value || pointer.isTouching.value || pointer.isWheeling.value,
    (active) => {
        isInteracting = active;
        if (active) return;

        // Emit final rotation now that interaction ended
        emit("rotate", { ...model.value.rotate });

        // Gentle initial velocity dampen on release — preserves most of the
        // momentum for a smooth handoff to the inertia decay loop.
        angularVelocitySpeed.value *= 0.8;

        for (const category of ["translate", "scale"] as const) {
            for (const k of Object.keys(velocity.value[category])) {
                (velocity.value[category] as Record<string, number>)[k] *= 0.8;
            }
        }
    },
);
</script>

<style scoped>
div {
    cursor: move;
    user-select: none;
    touch-action: none;
}
</style>
