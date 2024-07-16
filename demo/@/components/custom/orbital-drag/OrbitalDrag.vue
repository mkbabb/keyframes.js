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
import { onMounted, onUnmounted, watch } from "vue";
import {
    TransformBounds,
    TransformState,
    VelocityState,
    axes,
    defaultTransformBounds,
    defaultTransformState,
    defaultVelocityState,
} from ".";

const normalizeAngle = (angle: number, unit: (typeof ANGLE_UNITS)[number]): number => {
    switch (unit) {
        case "rad":
            return angle % (2 * Math.PI);
        case "grad":
            return angle % 400;
        case "turn":
            return angle % 1;
        default:
        case "deg":
            return angle % 360;
    }
};

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

const containerRef = $ref<HTMLElement | null>(null);

let isDragging = $ref(false);
let isTouching = $ref(false);
let isScrolling = $ref(false);

const getDefaultPreviousMousePosition = () => {
    return { x: 0, y: 0 };
};

let previousMousePosition = $ref(getDefaultPreviousMousePosition());

let previousWheelState = $ref(getDefaultPreviousMousePosition());

const getDefaultGestureState = () => {
    return {
        x: 0,
        y: 0,
        scale: 1,
    };
};

let previousGestureState = $ref(getDefaultGestureState());

let pressedKeys = $ref<PressedKeys>({
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
const rotationUnit = props.rotationUnit ?? "deg";
const scaleFactor = props.scaleFactor ?? 0.02;

const getDefaultVelocityState = () => {
    return JSON.parse(JSON.stringify(defaultVelocityState));
};

let velocity = $ref<VelocityState>(getDefaultVelocityState());

let bounds = props.bounds ?? defaultTransformBounds;

const rotateAroundAxis = (axis: THREE.Vector3, angle: number) => {
    const quaternion = new THREE.Quaternion();
    quaternion.setFromAxisAngle(axis, angle);

    let { x, y, z } = model.value.rotate;
    // Convert degrees to radians
    const currentEuler = new THREE.Euler(
        x * (Math.PI / 180),
        y * (Math.PI / 180),
        z * (Math.PI / 180),
        "XYZ",
    );

    const currentQuaternion = new THREE.Quaternion().setFromEuler(currentEuler);

    // Apply new rotation
    currentQuaternion.premultiply(quaternion);

    // Convert back to Euler angles
    const newEuler = new THREE.Euler().setFromQuaternion(currentQuaternion, "XYZ");

    // Convert radians to degrees
    const newX = newEuler.x * (180 / Math.PI);
    const newY = newEuler.y * (180 / Math.PI);
    const newZ = newEuler.z * (180 / Math.PI);

    return {
        x: newX,
        y: newY,
        z: newZ,
    };
};

const isTouchEventFallback = (event: MouseEvent | TouchEvent): event is TouchEvent => {
    return !!(event as TouchEvent).touches;
};

const getUserXY = (event: MouseEvent | TouchEvent) => {
    if (isTouchEventFallback(event)) {
        return {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY,
        };
    } else {
        return { x: event.clientX, y: event.clientY };
    }
};

const startDrag = (event: MouseEvent | TouchEvent) => {
    if (isTouchEventFallback(event)) {
        isTouching = true;
        event.preventDefault();
    }

    previousMousePosition = getUserXY(event);
    isDragging = true;
};

const stopDrag = (event: MouseEvent | TouchEvent) => {
    isTouching = false;
    isDragging = false;
};

const startGesture = (event: any) => {
    event.preventDefault();

    isTouching = true;

    previousGestureState = {
        x: event.screenX,
        y: event.screenY,
        scale: event.scale ?? 1,
    };
};

const stopGesture = () => {
    isTouching = false;
};

const updateTransform = (
    category: keyof TransformState,
    axis: (typeof axes)[number],
    value: number,
    velocityValue: number,
) => {
    if (category === "rotate") {
        value = normalizeAngle(value, rotationUnit);
    }

    model.value[category][axis] = value;
    velocity[category][axis] = velocityValue;

    for (const [k, v] of Object.entries(model.value[category])) {
        const [min, max] = bounds[category][k];
        model.value[category][k] = clamp(v, min, max);
    }

    if (category === "rotate") {
        emit("rotate", { ...model.value.rotate });
    } else if (category === "translate") {
        emit("translate", { ...model.value.translate });
    } else if (category === "scale") {
        emit("scale", { ...model.value.scale });
    }
};

const updateTranslation = (axis: (typeof axes)[number], delta: number) => {
    updateTransform(
        "translate",
        axis,
        model.value.translate[axis] + delta * translationFactor,
        delta * translationFactor,
    );
};

const updateScale = (axis: (typeof axes)[number], delta: number) => {
    updateTransform(
        "scale",
        axis,
        model.value.scale[axis] + delta * scaleFactor,
        delta * scaleFactor,
    );
};

const updateRotation = (
    axis: (typeof axes)[number][],
    deltaX: number,
    deltaY: number,
) => {
    const rotationAxis = new THREE.Vector3(-deltaY, deltaX, 0).normalize();
    const rotationAngle =
        (Math.sqrt(deltaX * deltaX + deltaY * deltaY) * sensitivity) / 25;

    const newAngles = rotateAroundAxis(rotationAxis, rotationAngle);

    axis.forEach((a) => {
        const delta = newAngles[a] - model.value.rotate[a];
        updateTransform("rotate", a, newAngles[a], delta * sensitivity);
    });
};

const drag = (event: MouseEvent | TouchEvent) => {
    if (!isDragging) return;

    const { x, y } = getUserXY(event);

    const deltaX = x - previousMousePosition.x;
    const deltaY = y - previousMousePosition.y;

    console.log({ model: model.value });

    const delta = deltaX + deltaY;

    if (Math.abs(delta) < 1e-4) return;

    if (pressedKeys.x || pressedKeys.y || pressedKeys.z) {
        handleAxisSpecificDrag(deltaX, deltaY);
    } else if (pressedKeys.shift) {
        updateTranslation("x", deltaX);
        updateTranslation("y", deltaY);
    } else {
        updateRotation(["x", "y", "z"], deltaX, deltaY);
    }

    previousMousePosition = { x, y };
};

const gesture = (event: any) => {
    if (!isTouching || isScrolling) return;

    const { screenX, screenY, scale } = event;

    const deltaX = screenX - previousGestureState.x;
    const deltaY = screenY - previousGestureState.y;
    const deltaScale = (scale - previousGestureState.scale) / (scaleFactor / 1.25);

    if (
        Math.abs(deltaX) < 1e-4 &&
        Math.abs(deltaY) < 1e-4 &&
        Math.abs(deltaScale) < 1e-4
    )
        return;

    updateTranslation("x", deltaX);
    updateTranslation("y", deltaY);

    updateScale("x", deltaScale);
    updateScale("y", deltaScale);
    updateScale("z", deltaScale);

    previousGestureState = { x: screenX, y: screenY, scale };
};

const handleAxisSpecificDrag = (deltaX: number, deltaY: number) => {
    const delta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;

    if (pressedKeys.x) {
        if (pressedKeys.shift) updateTranslation("x", delta);
        else if (pressedKeys.ctrl || pressedKeys.meta) updateScale("x", delta);
        else updateRotation(["x"], deltaX, deltaY);
    }
    if (pressedKeys.y) {
        if (pressedKeys.shift) updateTranslation("y", delta);
        else if (pressedKeys.ctrl || pressedKeys.meta) updateScale("y", delta);
        else updateRotation(["y"], deltaX, deltaY);
    }
    if (pressedKeys.z) {
        if (pressedKeys.shift) updateTranslation("z", delta);
        else if (pressedKeys.ctrl || pressedKeys.meta) updateScale("z", delta);
        else updateRotation(["z"], deltaX, deltaY);
    }
};

const handleWheel = (event: WheelEvent) => {
    if (!isScrolling) {
        return;
    }

    event.preventDefault();

    let { deltaX, deltaY, ctrlKey } = event;

    deltaX = deltaX / 10;
    deltaY = deltaY / 10;

    const delta = deltaX + deltaY;

    if (Math.abs(delta) < 1e-4) return;

    if (pressedKeys.x || pressedKeys.y || pressedKeys.z) {
        handleAxisSpecificDrag(deltaX, deltaY);
    } else if (pressedKeys.shift) {
        updateTranslation("x", deltaX);
        updateTranslation("y", deltaY);
    } else if (pressedKeys.ctrl || pressedKeys.meta || ctrlKey) {
        updateScale("x", deltaY);
        updateScale("y", deltaY);
        updateScale("z", deltaY);
    } else {
        updateRotation(["x", "y", "z"], -deltaX, -deltaY);
    }

    previousWheelState = { x: deltaX, y: deltaY };
};

const handleKeyDown = (event: KeyboardEvent) => {
    updatePressedKeys(event, true);
};

const handleKeyUp = (event: KeyboardEvent) => {
    updatePressedKeys(event, false);
};

const updatePressedKeys = (event: KeyboardEvent, isPressed: boolean) => {
    const key = event.key.toLowerCase();

    switch (key) {
        case "x":
        case "y":
        case "z":
            pressedKeys[key as "x" | "y" | "z"] = isPressed;
            break;
        case "shift":
            pressedKeys.shift = isPressed;
            break;
        case "control":
            pressedKeys.ctrl = isPressed;
            break;
        case "meta":
            pressedKeys.meta = isPressed;
            break;
    }
};

const applyInertia = () => {
    if (isDragging || isTouching) return;

    Object.entries(velocity).forEach(([category, value]) => {
        for (const [k, v] of Object.entries(value)) {
            if (Math.abs(v) > 0.01) {
                updateTransform(
                    category as any,
                    k as any,
                    model.value[category][k] + v,
                    v * inertiaFactor,
                );
            } else {
                velocity[category][k] = 0;
            }
        }
    });
};

const { pause, resume } = useRafFn(applyInertia);

let wheelEventEndTimeout = null;

onMounted(() => {
    useEventListener(
        containerRef,
        "wheel",
        (event) => {
            isScrolling = true;
            handleWheel(event as WheelEvent);
        },
        { passive: false },
    );
    useEventListener(window, "wheel", handleWheel, { passive: false });

    window.addEventListener("wheel", () => {
        clearTimeout(wheelEventEndTimeout);

        wheelEventEndTimeout = setTimeout(() => {
            isScrolling = false;
        }, 200);
    });

    useEventListener(window, "keydown", handleKeyDown);
    useEventListener(window, "keyup", handleKeyUp);

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
    if (!containerRef) {
        return;
    }

    containerRef.removeEventListener("wheel", handleWheel);

    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);

    window.removeEventListener("mousemove", drag);
    window.removeEventListener("mouseup", stopDrag);
    window.removeEventListener("mouseleave", stopDrag);

    window.removeEventListener("touchmove", drag);
    window.removeEventListener("touchstart", startDrag);
    window.removeEventListener("touchend", stopDrag);

    window.removeEventListener("gesturestart", startGesture);
    window.removeEventListener("gesturechange", gesture);
    window.removeEventListener("gestureend", stopGesture);

    pause();
});

watch(
    () => isDragging || isTouching,
    (newValue) => {
        if (newValue) return;

        Object.entries(velocity).forEach(([category, value]) => {
            for (const [k, v] of Object.entries(value)) {
                velocity[category][k] *= 0.5;
            }
        });

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
