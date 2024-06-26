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
import { onMounted, onUnmounted, watch } from "vue";
import { useEventListener, useRafFn } from "@vueuse/core";
import {
    TransformState,
    VelocityState,
    axes,
    defaultTransformState,
    defaultVelocityState,
    TransformBounds,
    defaultTransformBounds,
} from ".";

import { clamp } from "@src/math";

import { angleUnits } from "@src/parsing/units";
import { get } from "http";

const normalizeAngle = (angle: number, unit: (typeof angleUnits)[number]): number => {
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
    rotationUnit?: (typeof angleUnits)[number];
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

const containerRef = $ref<HTMLElement | null>(null);

let isDragging = $ref(false);
let isTouching = $ref(false);
let isScrolling = $ref(false);

const getDefaultPreviousMousePosition = () => {
    return { x: 0, y: 0 };
};

let previousMousePosition = $ref(getDefaultPreviousMousePosition());

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
const translationFactor = props.translationFactor ?? 0.1;
const inertiaFactor = props.inertiaFactor ?? 0.95;
const rotationUnit = props.rotationUnit ?? "deg";
const scaleFactor = props.scaleFactor ?? 0.01;

const getDefaultVelocityState = () => {
    return JSON.parse(JSON.stringify(defaultVelocityState));
};

let velocity = $ref<VelocityState>(getDefaultVelocityState());

let bounds = props.bounds ?? defaultTransformBounds;

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

const updateRotation = (axis: (typeof axes)[number], delta: number) => {
    let newDelta = delta * sensitivity;
    newDelta = normalizeAngle(newDelta, rotationUnit);

    let newValue = model.value.rotate[axis] + newDelta;

    updateTransform("rotate", axis, newValue, delta * sensitivity);
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

const drag = (event: MouseEvent | TouchEvent) => {
    if (!isDragging) return;

    const { x, y } = getUserXY(event);

    const deltaX = x - previousMousePosition.x;
    const deltaY = y - previousMousePosition.y;

    const delta = deltaX + deltaY;

    if (Math.abs(delta) < 1e-4) return;

    if (pressedKeys.x || pressedKeys.y || pressedKeys.z) {
        handleAxisSpecificDrag(deltaX, deltaY);
    } else if (pressedKeys.shift) {
        updateTranslation("x", deltaX);
        updateTranslation("y", deltaY);
    } else if (pressedKeys.ctrl || pressedKeys.meta) {
        updateRotation("z", deltaX);
    } else {
        updateRotation("y", deltaX);
        updateRotation("x", -deltaY);
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
        else updateRotation("x", delta);
    }
    if (pressedKeys.y) {
        if (pressedKeys.shift) updateTranslation("y", delta);
        else if (pressedKeys.ctrl || pressedKeys.meta) updateScale("y", delta);
        else updateRotation("y", -delta);
    }
    if (pressedKeys.z) {
        if (pressedKeys.shift) updateTranslation("z", delta);
        else if (pressedKeys.ctrl || pressedKeys.meta) updateScale("z", delta);
        else updateRotation("z", delta);
    }
};

const handleWheel = (event: WheelEvent) => {
    if (!isScrolling) {
        return;
    }

    event.preventDefault();

    const { deltaX, deltaY, ctrlKey } = event;

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
        updateRotation("y", deltaX);
        updateRotation("x", -deltaY);
    }
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
        }, 100);
    });

    useEventListener(window, "keydown", handleKeyDown);
    useEventListener(window, "keyup", handleKeyUp);

    useEventListener(window, "mousemove", drag);
    useEventListener(window, "mouseup", stopDrag);
    useEventListener(window, "mouseleave", stopDrag);

    useEventListener(window, "touchmove", drag);
    // useEventListener(window, "touchstart", startDrag);
    // useEventListener(window, "touchend", stopDrag);

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

watch(isDragging, (newValue) => {
    if (newValue) return;

    Object.entries(velocity).forEach(([category, value]) => {
        for (const [k, v] of Object.entries(value)) {
            velocity[category][k] *= 0.5;
        }
    });
});
</script>

<style scoped>
div {
    cursor: move;
    user-select: none;
}
</style>
