<template>
    <div
        ref="containerRef"
        @mousedown="startDrag"
        @mousemove="drag"
        @mouseup="stopDrag"
        @mouseleave="stopDrag"
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
} from ".";

import { angleUnits } from "@src/parsing/units";

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
let previousMousePosition = $ref({ x: 0, y: 0 });

let velocity = $ref<VelocityState>(defaultVelocityState);

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

const startDrag = (event: MouseEvent) => {
    isDragging = true;
    previousMousePosition = { x: event.clientX, y: event.clientY };
};

const stopDrag = () => {
    isDragging = false;
};

const normalizeAngle = (angle: number, unit: (typeof angleUnits)[number]): number => {
    switch (unit) {
        case "deg":
            return angle % 360;
        case "rad":
            return angle % (2 * Math.PI);
        case "grad":
            return angle % 400;
        case "turn":
            return angle % 1;
    }
};

const updateTransform = (
    category: keyof TransformState,
    axis: (typeof axes)[number],
    value: number,
    velocityValue: number,
) => {
    if (category === "rotate") {
        model.value.rotate[axis] = normalizeAngle(value, rotationUnit);
    } else {
        model.value.translate[axis] = value;
    }

    velocity[category][axis] = velocityValue;

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

    // console.log({ value: model.value.rotate[axis], delta, newDelta, newValue });

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

const drag = (event: MouseEvent) => {
    if (!isDragging) return;

    const deltaX = event.clientX - previousMousePosition.x;
    const deltaY = event.clientY - previousMousePosition.y;

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

    previousMousePosition = { x: event.clientX, y: event.clientY };
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
    event.preventDefault();

    if (pressedKeys.shift) {
        updateScale("x", -event.deltaY);
        updateScale("y", -event.deltaY);
    } else {
        updateTranslation("z", -event.deltaY);
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
    if (isDragging) return;

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

onMounted(() => {
    if (containerRef) {
        useEventListener(containerRef, "wheel", handleWheel, { passive: false });
        useEventListener(window, "keydown", handleKeyDown);
        useEventListener(window, "keyup", handleKeyUp);
    }
    resume();
});

onUnmounted(() => {
    if (containerRef) {
        containerRef.removeEventListener("wheel", handleWheel);
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
    }
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
