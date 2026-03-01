<template>
    <div ref="containerRef">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { clamp } from "@src/math";
import { useEventListener, useRafFn } from "@vueuse/core";
import { quat, vec3 } from "gl-matrix";
import { onMounted, onUnmounted, ref, useTemplateRef, watch } from "vue";
import type { TransformBounds, TransformState, VelocityState } from ".";
import { axes, defaultTransformBounds, defaultTransformState, defaultVelocityState } from ".";

type PressedKeys = {
    x: boolean;
    y: boolean;
    z: boolean;
    shift: boolean;
    ctrl: boolean;
    meta: boolean;
};

const props = defineProps<{
    sensitivity?: number;
    translationFactor?: number;
    inertiaFactor?: number;
    scaleFactor?: number;
    bounds?: TransformBounds;
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

const isDragging = ref(false);
const isTouching = ref(false);

const previousMousePosition = ref({ x: 0, y: 0 });
const previousGestureState = ref({ x: 0, y: 0, scale: 1 });

const pressedKeys = ref<PressedKeys>({
    x: false,
    y: false,
    z: false,
    shift: false,
    ctrl: false,
    meta: false,
});

const sensitivity = props.sensitivity ?? 0.5;
const translationFactor = props.translationFactor ?? 0.1;
const inertiaFactor = props.inertiaFactor ?? 0.95;
const scaleFactor = props.scaleFactor ?? 0.01;

// Pinch tracking for standard touch events (non-Safari)
const previousPinchDistance = ref(0);
const previousPinchCenter = ref({ x: 0, y: 0 });

// Wheel activity tracking — wheel events don't set isDragging/isTouching,
// so applyInertia would decay velocity between wheel events. Track a
// timeout so inertia only kicks in after scrolling stops.
const isWheeling = ref(false);
let wheelTimeout: ReturnType<typeof setTimeout> | null = null;

const velocity = ref<VelocityState>(JSON.parse(JSON.stringify(defaultVelocityState)));

const bounds = props.bounds ?? defaultTransformBounds;

// Persistent quaternion — the source of truth for rotation.
// Never reconstructed from Euler angles; only multiplied by delta quaternions.
const currentQuaternion = quat.create();

// Angular velocity for inertia: axis + speed, not per-Euler-component.
const angularVelocityAxis = vec3.fromValues(0, 1, 0);
const angularVelocitySpeed = ref(0);

// Extract Euler angles (XYZ order) from a quaternion — replaces THREE.Euler.setFromQuaternion
const quaternionToEulerDegrees = (q: quat) => {
    // Extract rotation matrix elements from quaternion
    const [x, y, z, w] = q;
    const x2 = x + x, y2 = y + y, z2 = z + z;
    const xx = x * x2, xy = x * y2, xz = x * z2;
    const yy = y * y2, yz = y * z2, zz = z * z2;
    const wx = w * x2, wy = w * y2, wz = w * z2;

    // Rotation matrix elements (column-major like gl-matrix)
    const m11 = 1 - (yy + zz);
    const m12 = xy + wz;
    const m13 = xz - wy;
    const m21 = xy - wz;
    const m22 = 1 - (xx + zz);
    const m23 = yz + wx;
    // const m31 = xz + wy;
    // const m32 = yz - wx;
    const m33 = 1 - (xx + yy);

    // XYZ Euler extraction
    const sy = clamp(m13, -1, 1);
    const ey = -Math.asin(sy);

    let ex: number, ez: number;
    if (Math.abs(sy) < 0.9999) {
        ex = Math.atan2(m23, m33);
        ez = Math.atan2(m12, m11);
    } else {
        ex = Math.atan2(-m21, m22); // m32
        ez = 0;
    }

    return {
        x: ex * (180 / Math.PI),
        y: ey * (180 / Math.PI),
        z: ez * (180 / Math.PI),
    };
};

const syncRotationToModel = () => {
    const angles = quaternionToEulerDegrees(currentQuaternion);
    model.value.rotate.x = angles.x;
    model.value.rotate.y = angles.y;
    model.value.rotate.z = angles.z;
    emit("rotate", { ...model.value.rotate });
};

const applyRotation = (axis: vec3, angle: number) => {
    if (Math.abs(angle) < 1e-10) return;

    const deltaQuat = quat.create();
    quat.setAxisAngle(deltaQuat, axis, angle);
    // premultiply: currentQuaternion = deltaQuat * currentQuaternion
    quat.multiply(currentQuaternion, deltaQuat, currentQuaternion);
    quat.normalize(currentQuaternion, currentQuaternion);

    syncRotationToModel();
};

const isTouchEventFallback = (event: MouseEvent | TouchEvent): event is TouchEvent => {
    return !!(event as TouchEvent).touches;
};

const getUserXY = (event: MouseEvent | TouchEvent) => {
    if (isTouchEventFallback(event)) {
        const touch = event.touches[0] ?? event.changedTouches[0];
        if (!touch) return previousMousePosition.value;
        return { x: touch.clientX, y: touch.clientY };
    }
    return { x: event.clientX, y: event.clientY };
};

const getTouchDistance = (event: TouchEvent) => {
    if (event.touches.length < 2) return 0;
    const t0 = event.touches[0], t1 = event.touches[1];
    const dx = t1.clientX - t0.clientX, dy = t1.clientY - t0.clientY;
    return Math.sqrt(dx * dx + dy * dy);
};

const getTouchCenter = (event: TouchEvent) => {
    if (event.touches.length < 2) return getUserXY(event);
    const t0 = event.touches[0], t1 = event.touches[1];
    return { x: (t0.clientX + t1.clientX) / 2, y: (t0.clientY + t1.clientY) / 2 };
};

const startDrag = (event: MouseEvent | TouchEvent) => {
    if (isTouchEventFallback(event)) {
        isTouching.value = true;
        event.preventDefault();
        if (event.touches.length >= 2) {
            previousPinchDistance.value = getTouchDistance(event);
            previousPinchCenter.value = getTouchCenter(event);
        }
    }
    previousMousePosition.value = getUserXY(event);
    isDragging.value = true;
};

const stopDrag = () => {
    isTouching.value = false;
    isDragging.value = false;
    previousPinchDistance.value = 0;
};

const startGesture = (event: any) => {
    event.preventDefault();
    isTouching.value = true;
    previousGestureState.value = {
        x: event.screenX,
        y: event.screenY,
        scale: event.scale ?? 1,
    };
};

const stopGesture = () => {
    isTouching.value = false;
};

const updateLinearTransform = (
    category: "translate" | "scale",
    axis: (typeof axes)[number],
    value: number,
    velocityValue: number,
) => {
    (model.value[category] as Record<string, number>)[axis] = value;
    (velocity.value[category] as Record<string, number>)[axis] = velocityValue;

    for (const [k, v] of Object.entries(model.value[category] as Record<string, number>)) {
        const categoryBounds = (bounds as unknown as Record<string, Record<string, [number, number]>>)[category];
        const [min, max] = categoryBounds[k];
        (model.value[category] as unknown as Record<string, number>)[k] = clamp(v, min, max);
    }

    if (category === "translate") {
        emit("translate", { ...model.value.translate });
    } else {
        emit("scale", { ...model.value.scale });
    }
};

const updateTranslation = (axis: (typeof axes)[number], delta: number) => {
    updateLinearTransform(
        "translate",
        axis,
        model.value.translate[axis] + delta * translationFactor,
        delta * translationFactor,
    );
};

const updateScale = (axis: (typeof axes)[number], delta: number) => {
    updateLinearTransform(
        "scale",
        axis,
        model.value.scale[axis] + delta * scaleFactor,
        delta * scaleFactor,
    );
};

const DEG2RAD = Math.PI / 180;

const updateRotation = (deltaX: number, deltaY: number) => {
    const axis = vec3.fromValues(-deltaY, deltaX, 0);
    const magnitude = vec3.length(axis);
    if (magnitude < 1e-6) return;

    vec3.normalize(axis, axis);
    const angle = magnitude * sensitivity * DEG2RAD;

    applyRotation(axis, angle);

    // Store angular velocity for inertia
    vec3.copy(angularVelocityAxis, axis);
    angularVelocitySpeed.value = angle;
};

const updateAxisRotation = (constrainedAxes: (typeof axes)[number][], deltaX: number, deltaY: number) => {
    const delta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;
    if (Math.abs(delta) < 1e-6) return;

    for (const a of constrainedAxes) {
        const axis = vec3.fromValues(
            a === "x" ? 1 : 0,
            a === "y" ? 1 : 0,
            a === "z" ? 1 : 0,
        );
        // Match old sign convention: X uses delta, Y uses -delta, Z uses delta
        const sign = a === "y" ? -1 : 1;
        const angle = delta * sign * sensitivity * DEG2RAD;
        applyRotation(axis, angle);
    }

    angularVelocitySpeed.value = Math.abs(delta * sensitivity * DEG2RAD);
};

const drag = (event: MouseEvent | TouchEvent) => {
    if (!isDragging.value) return;

    const isTouch = isTouchEventFallback(event);

    // Prevent browser from taking over the touch gesture (scroll/zoom)
    if (isTouch) {
        event.preventDefault();
    }

    // Handle 2-finger pinch/pan via standard touch events (non-Safari fallback)
    if (isTouch && event.touches.length >= 2) {
        const dist = getTouchDistance(event);
        const center = getTouchCenter(event);

        if (previousPinchDistance.value > 0) {
            const deltaScale = (dist - previousPinchDistance.value) / (1 / (scaleFactor * 2));
            const deltaCX = center.x - previousPinchCenter.value.x;
            const deltaCY = center.y - previousPinchCenter.value.y;

            updateTranslation("x", deltaCX);
            updateTranslation("y", deltaCY);
            updateScale("x", deltaScale);
            updateScale("y", deltaScale);
            updateScale("z", deltaScale);
        }

        previousPinchDistance.value = dist;
        previousPinchCenter.value = center;
        return;
    }

    const { x, y } = getUserXY(event);

    const deltaX = x - previousMousePosition.value.x;
    const deltaY = y - previousMousePosition.value.y;

    if (Math.abs(deltaX) < 0.5 && Math.abs(deltaY) < 0.5) return;

    if (pressedKeys.value.x || pressedKeys.value.y || pressedKeys.value.z) {
        handleAxisSpecificInput(deltaX, deltaY);
    } else if (pressedKeys.value.shift) {
        updateTranslation("x", deltaX);
        updateTranslation("y", deltaY);
    } else if (pressedKeys.value.ctrl || pressedKeys.value.meta) {
        // Z-axis roll from horizontal drag
        const axis = vec3.fromValues(0, 0, 1);
        const angle = deltaX * sensitivity * DEG2RAD;
        applyRotation(axis, angle);
        vec3.copy(angularVelocityAxis, axis);
        angularVelocitySpeed.value = Math.abs(angle);
    } else {
        updateRotation(deltaX, deltaY);
    }

    previousMousePosition.value = { x, y };
};

const gesture = (event: any) => {
    if (!isTouching.value || isWheeling.value) return;

    const { screenX, screenY, scale } = event;

    const deltaX = screenX - previousGestureState.value.x;
    const deltaY = screenY - previousGestureState.value.y;
    const deltaScale = (scale - previousGestureState.value.scale) / (scaleFactor / 1.25);

    if (Math.abs(deltaX) < 1e-4 && Math.abs(deltaY) < 1e-4 && Math.abs(deltaScale) < 1e-4) {
        return;
    }

    updateTranslation("x", deltaX);
    updateTranslation("y", deltaY);

    updateScale("x", deltaScale);
    updateScale("y", deltaScale);
    updateScale("z", deltaScale);

    previousGestureState.value = { x: screenX, y: screenY, scale };
};

const handleAxisSpecificInput = (deltaX: number, deltaY: number) => {
    const delta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;

    if (pressedKeys.value.x) {
        if (pressedKeys.value.shift) updateTranslation("x", delta);
        else if (pressedKeys.value.ctrl || pressedKeys.value.meta) updateScale("x", delta);
        else updateAxisRotation(["x"], deltaX, deltaY);
    }
    if (pressedKeys.value.y) {
        if (pressedKeys.value.shift) updateTranslation("y", delta);
        else if (pressedKeys.value.ctrl || pressedKeys.value.meta) updateScale("y", delta);
        else updateAxisRotation(["y"], deltaX, deltaY);
    }
    if (pressedKeys.value.z) {
        if (pressedKeys.value.shift) updateTranslation("z", delta);
        else if (pressedKeys.value.ctrl || pressedKeys.value.meta) updateScale("z", delta);
        else updateAxisRotation(["z"], deltaX, deltaY);
    }
};

const handleWheel = (event: WheelEvent) => {
    event.preventDefault();

    const { deltaX, deltaY, ctrlKey } = event;

    if (Math.abs(deltaX) < 1e-4 && Math.abs(deltaY) < 1e-4) return;

    // Mark wheel as active so applyInertia doesn't decay mid-scroll
    isWheeling.value = true;
    if (wheelTimeout) clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => {
        isWheeling.value = false;
    }, 100);

    if (pressedKeys.value.x || pressedKeys.value.y || pressedKeys.value.z) {
        handleAxisSpecificInput(deltaX, deltaY);
    } else if (pressedKeys.value.shift) {
        updateTranslation("x", deltaX);
        updateTranslation("y", deltaY);
    } else if (pressedKeys.value.ctrl || pressedKeys.value.meta || ctrlKey) {
        updateScale("x", deltaY);
        updateScale("y", deltaY);
        updateScale("z", deltaY);
    } else {
        updateRotation(deltaX, deltaY);
    }
};

const updatePressedKeys = (event: KeyboardEvent, isPressed: boolean) => {
    const key = event.key.toLowerCase();
    switch (key) {
        case "x":
        case "y":
        case "z":
            pressedKeys.value[key as "x" | "y" | "z"] = isPressed;
            break;
        case "shift":
            pressedKeys.value.shift = isPressed;
            break;
        case "control":
            pressedKeys.value.ctrl = isPressed;
            break;
        case "meta":
            pressedKeys.value.meta = isPressed;
            break;
    }
};

const applyInertia = () => {
    if (isDragging.value || isTouching.value || isWheeling.value) return;

    // Rotational inertia via persistent quaternion
    if (Math.abs(angularVelocitySpeed.value) > 1e-4) {
        applyRotation(angularVelocityAxis, angularVelocitySpeed.value);
        angularVelocitySpeed.value *= inertiaFactor;
    } else {
        angularVelocitySpeed.value = 0;
    }

    // Linear inertia (translate + scale)
    for (const category of ["translate", "scale"] as const) {
        for (const [k, v] of Object.entries(velocity.value[category])) {
            if (Math.abs(v) > 0.01) {
                updateLinearTransform(
                    category,
                    k as (typeof axes)[number],
                    (model.value[category] as Record<string, number>)[k] + v,
                    v * inertiaFactor,
                );
            } else {
                (velocity.value[category] as Record<string, number>)[k] = 0;
            }
        }
    }
};

const { pause, resume } = useRafFn(applyInertia);

onMounted(() => {
    // Initialize quaternion from model's initial Euler angles
    const { x, y, z } = model.value.rotate;

    // Build quaternion from XYZ Euler angles
    const qx = quat.create();
    quat.setAxisAngle(qx, [1, 0, 0], x * DEG2RAD);
    const qy = quat.create();
    quat.setAxisAngle(qy, [0, 1, 0], y * DEG2RAD);
    const qz = quat.create();
    quat.setAxisAngle(qz, [0, 0, 1], z * DEG2RAD);

    // XYZ order: qz * qy * qx
    quat.multiply(currentQuaternion, qz, qy);
    quat.multiply(currentQuaternion, currentQuaternion, qx);

    useEventListener(
        containerRef,
        "wheel",
        (event) => {
            handleWheel(event as WheelEvent);
        },
        { passive: false },
    );

    useEventListener(window, "keydown", (e: KeyboardEvent) => updatePressedKeys(e, true));
    useEventListener(window, "keyup", (e: KeyboardEvent) => updatePressedKeys(e, false));

    // mousedown on container to initiate drag; move/up on window for cross-element tracking
    useEventListener(containerRef, "mousedown", startDrag);
    useEventListener(window, "mousemove", drag);
    useEventListener(window, "mouseup", stopDrag);
    useEventListener(window, "mouseleave", stopDrag);

    // Touch events: start only on container, move/end on window for tracking.
    // touchmove/gesturechange MUST be { passive: false } on window — Chrome marks
    // window-level touch listeners as passive by default, which prevents
    // preventDefault() and lets the browser hijack the gesture after ~300ms.
    useEventListener(containerRef, "touchstart", startDrag, { passive: false });
    useEventListener(window, "touchmove", drag, { passive: false });
    useEventListener(window, "touchend", stopDrag);

    useEventListener(window, "gesturestart", startGesture, { passive: false });
    useEventListener(window, "gesturechange", gesture, { passive: false });
    useEventListener(window, "gestureend", stopGesture);

    resume();
});

onUnmounted(() => {
    pause();
});

watch(
    () => isDragging.value || isTouching.value,
    (active) => {
        if (active) return;

        // Dampen all velocities on release (match old behavior: 0.5 across the board)
        angularVelocitySpeed.value *= 0.5;

        for (const category of ["translate", "scale"] as const) {
            for (const k of Object.keys(velocity.value[category])) {
                (velocity.value[category] as Record<string, number>)[k] *= 0.5;
            }
        }
    },
);
</script>

<style scoped>
div {
    cursor: move;
    user-select: none;
}
</style>
