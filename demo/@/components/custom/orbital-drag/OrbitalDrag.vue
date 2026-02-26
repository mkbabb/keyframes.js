<template>
    <div
        ref="containerRef"
        @mousedown="startDrag"
        @mousemove="drag"
        @mouseup="stopDrag"
        @touchstart="startDrag"
        @touchmove="drag"
        @touchend="stopDrag"
        @gesturestart="startGesture"
        @gesturechange="gesture"
        @gestureend="stopGesture"
    >
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { clamp } from "@src/math";
import { ANGLE_UNITS } from "@src/units/constants";
import { useEventListener, useRafFn } from "@vueuse/core";
import * as THREE from "three";
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
    rotationUnit?: (typeof ANGLE_UNITS)[number];
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
const translationFactor = props.translationFactor ?? 0.8;
const inertiaFactor = props.inertiaFactor ?? 0.95;
const scaleFactor = props.scaleFactor ?? 0.02;

const velocity = ref<VelocityState>(JSON.parse(JSON.stringify(defaultVelocityState)));

const bounds = props.bounds ?? defaultTransformBounds;

// Persistent quaternion — the source of truth for rotation.
// Never reconstructed from Euler angles; only multiplied by delta quaternions.
const currentQuaternion = new THREE.Quaternion();

// Angular velocity for inertia: axis + speed, not per-Euler-component.
const angularVelocity = ref({ axis: new THREE.Vector3(0, 1, 0), speed: 0 });

const quaternionToEulerDegrees = (q: THREE.Quaternion) => {
    const euler = new THREE.Euler().setFromQuaternion(q, "XYZ");
    return {
        x: euler.x * (180 / Math.PI),
        y: euler.y * (180 / Math.PI),
        z: euler.z * (180 / Math.PI),
    };
};

const syncRotationToModel = () => {
    const angles = quaternionToEulerDegrees(currentQuaternion);
    model.value.rotate.x = angles.x;
    model.value.rotate.y = angles.y;
    model.value.rotate.z = angles.z;
    emit("rotate", { ...model.value.rotate });
};

const applyRotation = (axis: THREE.Vector3, angle: number) => {
    if (Math.abs(angle) < 1e-10) return;

    const deltaQuat = new THREE.Quaternion().setFromAxisAngle(axis, angle);
    currentQuaternion.premultiply(deltaQuat);
    currentQuaternion.normalize();

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

const startDrag = (event: MouseEvent | TouchEvent) => {
    if (isTouchEventFallback(event)) {
        isTouching.value = true;
        event.preventDefault();
    }
    previousMousePosition.value = getUserXY(event);
    isDragging.value = true;
};

const stopDrag = () => {
    isTouching.value = false;
    isDragging.value = false;
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

const updateRotation = (deltaX: number, deltaY: number) => {
    const axis = new THREE.Vector3(-deltaY, deltaX, 0);
    const magnitude = axis.length();
    if (magnitude < 1e-6) return;

    axis.normalize();
    const angle = (magnitude * sensitivity) / 25;

    applyRotation(axis, angle);

    // Store angular velocity for inertia
    angularVelocity.value.axis.copy(axis);
    angularVelocity.value.speed = angle;
};

const updateAxisRotation = (constrainedAxes: (typeof axes)[number][], deltaX: number, deltaY: number) => {
    // For single-axis constrained rotation, project onto that axis
    const magnitude = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    if (magnitude < 1e-6) return;

    const angle = (magnitude * sensitivity) / 25;

    for (const a of constrainedAxes) {
        const axis = new THREE.Vector3(
            a === "x" ? 1 : 0,
            a === "y" ? 1 : 0,
            a === "z" ? 1 : 0,
        );
        applyRotation(axis, angle * Math.sign(a === "x" ? -deltaY : deltaX));
    }

    angularVelocity.value.speed = angle;
};

const drag = (event: MouseEvent | TouchEvent) => {
    if (!isDragging.value) return;

    const { x, y } = getUserXY(event);

    const deltaX = x - previousMousePosition.value.x;
    const deltaY = y - previousMousePosition.value.y;

    if (Math.abs(deltaX) < 0.5 && Math.abs(deltaY) < 0.5) return;

    if (pressedKeys.value.x || pressedKeys.value.y || pressedKeys.value.z) {
        handleAxisSpecificInput(deltaX, deltaY);
    } else if (pressedKeys.value.shift) {
        updateTranslation("x", deltaX);
        updateTranslation("y", deltaY);
    } else {
        updateRotation(deltaX, deltaY);
    }

    previousMousePosition.value = { x, y };
};

const gesture = (event: any) => {
    if (!isTouching.value) return;

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

    let { deltaX, deltaY, ctrlKey } = event;

    deltaX = deltaX / 10;
    deltaY = deltaY / 10;

    if (Math.abs(deltaX) < 1e-4 && Math.abs(deltaY) < 1e-4) return;

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
        updateRotation(-deltaX, -deltaY);
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
    if (isDragging.value || isTouching.value) return;

    // Rotational inertia via persistent quaternion
    if (Math.abs(angularVelocity.value.speed) > 1e-4) {
        applyRotation(angularVelocity.value.axis, angularVelocity.value.speed);
        angularVelocity.value.speed *= inertiaFactor;
    } else {
        angularVelocity.value.speed = 0;
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
    const euler = new THREE.Euler(
        x * (Math.PI / 180),
        y * (Math.PI / 180),
        z * (Math.PI / 180),
        "XYZ",
    );
    currentQuaternion.setFromEuler(euler);

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

    useEventListener(window, "mousemove", drag);
    useEventListener(window, "mouseup", stopDrag);
    useEventListener(window, "mouseleave", stopDrag);

    useEventListener(window, "touchmove", drag);
    useEventListener(window, "touchstart", startDrag);
    useEventListener(window, "touchend", stopDrag);

    useEventListener(window, "gesturestart", startGesture);
    useEventListener(window, "gesturechange", gesture);
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

        // Dampen angular velocity on release
        angularVelocity.value.speed *= 0.5;

        // Dampen linear velocities on release
        for (const category of ["translate", "scale"] as const) {
            for (const k of Object.keys(velocity.value[category])) {
                (velocity.value[category] as Record<string, number>)[k] *= 0.5;
            }
        }

        applyInertia();
    },
);
</script>

<style scoped>
div {
    cursor: move;
    user-select: none;
}
</style>
