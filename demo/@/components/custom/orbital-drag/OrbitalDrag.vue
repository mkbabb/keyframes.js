<template>
    <div ref="containerRef" :style="containerStyle">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { clamp } from "@src/math";
import { useEventListener } from "@vueuse/core";
import { quat, vec3 } from "gl-matrix";
import { computed, onMounted, onUnmounted, ref, useTemplateRef, watch } from "vue";
import type { TransformBounds, TransformState, VelocityState } from ".";
import { axes, defaultTransformBounds, defaultTransformState, defaultVelocityState } from ".";
import { useOrbitalInertia } from "./useOrbitalInertia";
import { useOrbitalPinch } from "./useOrbitalPinch";
import { useOrbitalPointer } from "./useOrbitalPointer";

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

const containerStyle = computed(() => {
    if (!props.applyTransformToContainer) return {};
    const { rotate, translate, scale: s } = model.value;
    return {
        transformStyle: 'preserve-3d' as const,
        willChange: 'transform' as const,
        transform: `translate3d(${translate.x}px, ${translate.y}px, ${translate.z}px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) rotateZ(${rotate.z}deg) scale3d(${s.x}, ${s.y}, ${s.z})`,
    };
});

// ── Quaternion core ─────────────────────────────────────────────────
// Persistent quaternion — the source of truth for rotation.
// Never reconstructed from Euler angles; only multiplied by delta quaternions.
const currentQuaternion = quat.create();

// Angular velocity for inertia: axis + speed, not per-Euler-component.
const angularVelocityAxis = vec3.fromValues(0, 1, 0);
const angularVelocitySpeed = ref(0);

const DEG2RAD = Math.PI / 180;

// Extract Euler angles from a quaternion for consumption as R = Rx * Ry * Rz.
const quaternionToEulerDegrees = (q: quat) => {
    const [x, y, z, w] = q;
    const x2 = x + x, y2 = y + y, z2 = z + z;
    const xx = x * x2, xy = x * y2, xz = x * z2;
    const yy = y * y2, yz = y * z2, zz = z * z2;
    const wx = w * x2, wy = w * y2, wz = w * z2;

    const r00 = 1 - (yy + zz);
    const r01 = xy - wz;
    const r02 = xz + wy;
    const r11 = 1 - (xx + zz);
    const r12 = yz - wx;
    const r21 = yz + wx;
    const r22 = 1 - (xx + yy);

    const sy = clamp(r02, -1, 1);
    const ey = Math.asin(sy);

    let ex: number, ez: number;
    if (Math.abs(sy) < 0.9999) {
        ex = Math.atan2(-r12, r22);
        ez = Math.atan2(-r01, r00);
    } else {
        ex = Math.atan2(r21, r11);
        ez = 0;
    }

    return {
        x: ex * (180 / Math.PI),
        y: ey * (180 / Math.PI),
        z: ez * (180 / Math.PI),
    };
};

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

// ── Compose gesture handling ────────────────────────────────────────

// Pinch must be created before pointer so we can pass resetPinchDistance as onStopDrag.
// Use a late-binding wrapper since pinch isn't assigned yet at pointer creation time.
let pinchResetFn: (() => void) | undefined;

const pointer = useOrbitalPointer({
    model,
    velocity,
    bounds,
    sensitivity,
    touchSensitivity,
    translationFactor,
    scaleFactor,
    containerRef,
    updateRotation,
    updateAxisRotation,
    applyRotation,
    angularVelocityAxis,
    angularVelocitySpeed,
    onStopDrag: () => pinchResetFn?.(),
    emit,
});

const pinch = useOrbitalPinch({
    model,
    isTouching: pointer.isTouching,
    isWheeling: pointer.isWheeling,
    scaleFactor,
    updateTranslation: pointer.updateTranslation,
    updateScale: pointer.updateScale,
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
    updateLinearTransform: pointer.updateLinearTransform,
});

// ── Lifecycle ───────────────────────────────────────────────────────

onMounted(() => {
    // Initialize quaternion from model's initial Euler angles
    const { x, y, z } = model.value.rotate;

    const qx = quat.create();
    quat.setAxisAngle(qx, [1, 0, 0], x * DEG2RAD);
    const qy = quat.create();
    quat.setAxisAngle(qy, [0, 1, 0], y * DEG2RAD);
    const qz = quat.create();
    quat.setAxisAngle(qz, [0, 0, 1], z * DEG2RAD);

    quat.multiply(currentQuaternion, qx, qy);
    quat.multiply(currentQuaternion, currentQuaternion, qz);

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
