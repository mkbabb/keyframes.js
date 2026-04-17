import { clamp } from "@mkbabb/value.js";
import { vec3 } from "gl-matrix";
import { ref } from "vue";
import type { Ref, ShallowRef } from "vue";
import type { TransformBounds, TransformState, VelocityState } from "..";
import { axes } from "..";
import type { PressedKeys } from "../types";

export interface OrbitalPointerParams {
    model: Ref<TransformState>;
    velocity: Ref<VelocityState>;
    bounds: TransformBounds;
    sensitivity: number;
    touchSensitivity: number;
    translationFactor: number;
    scaleFactor: number;
    containerRef: Readonly<ShallowRef<HTMLElement | null>>;
    // Callbacks into the quaternion core
    updateRotation: (deltaX: number, deltaY: number, isTouch?: boolean) => void;
    updateAxisRotation: (
        constrainedAxes: (typeof axes)[number][],
        deltaX: number,
        deltaY: number,
        isTouch?: boolean,
    ) => void;
    applyRotation: (axis: vec3, angle: number) => void;
    angularVelocityAxis: vec3;
    angularVelocitySpeed: Ref<number>;
    onStopDrag?: () => void;
    emit: {
        (e: "rotate", state: TransformState["rotate"]): void;
        (e: "translate", state: TransformState["translate"]): void;
        (e: "scale", scale: TransformState["scale"]): void;
    };
}

export function useOrbitalPointer(params: OrbitalPointerParams) {
    const {
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
        onStopDrag,
        emit,
    } = params;

    const isDragging = ref(false);
    const isTouching = ref(false);
    const isWheeling = ref(false);
    let wheelTimeout: ReturnType<typeof setTimeout> | null = null;

    // Track active touch pointer IDs -- when 2+ are down, drag() should skip rotation
    const activeTouchPointers = new Set<number>();

    const previousMousePosition = ref({ x: 0, y: 0 });

    // Flag to reset previousMousePosition after pinch-to-single-finger transition
    const justExitedPinch = ref(false);

    const pressedKeys = ref<PressedKeys>({
        x: false,
        y: false,
        z: false,
        shift: false,
        ctrl: false,
        meta: false,
    });

    const syncModifiers = (event: {
        shiftKey: boolean;
        ctrlKey: boolean;
        metaKey: boolean;
    }) => {
        pressedKeys.value.shift = event.shiftKey;
        pressedKeys.value.ctrl = event.ctrlKey;
        pressedKeys.value.meta = event.metaKey;
    };

    const updateLinearTransform = (
        category: "translate" | "scale",
        axis: (typeof axes)[number],
        value: number,
        velocityValue: number,
    ) => {
        (model.value[category] as Record<string, number>)[axis] = value;
        (velocity.value[category] as Record<string, number>)[axis] = velocityValue;

        const categoryBounds = (
            bounds as unknown as Record<
                string,
                Record<string, [number, number]>
            >
        )[category]!;
        for (const [k, v] of Object.entries(
            model.value[category] as Record<string, number>,
        )) {
            const [min, max] = categoryBounds[k]!;
            (
                model.value[category] as unknown as Record<string, number>
            )[k] = clamp(v, min, max);
        }

        if (category === "translate") {
            emit("translate", { ...model.value.translate });
        } else {
            emit("scale", { ...model.value.scale });
        }
    };

    const updateTranslation = (
        axis: (typeof axes)[number],
        delta: number,
    ) => {
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

    const handleAxisSpecificInput = (
        deltaX: number,
        deltaY: number,
        isTouch = false,
    ) => {
        const delta =
            Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;

        if (pressedKeys.value.x) {
            if (pressedKeys.value.shift) updateTranslation("x", delta);
            else if (pressedKeys.value.ctrl || pressedKeys.value.meta)
                updateScale("x", delta);
            else updateAxisRotation(["x"], deltaX, deltaY, isTouch);
        }
        if (pressedKeys.value.y) {
            if (pressedKeys.value.shift) updateTranslation("y", delta);
            else if (pressedKeys.value.ctrl || pressedKeys.value.meta)
                updateScale("y", delta);
            else updateAxisRotation(["y"], deltaX, deltaY, isTouch);
        }
        if (pressedKeys.value.z) {
            if (pressedKeys.value.shift) updateTranslation("z", delta);
            else if (pressedKeys.value.ctrl || pressedKeys.value.meta)
                updateScale("z", delta);
            else updateAxisRotation(["z"], deltaX, deltaY, isTouch);
        }
    };

    const startDrag = (event: PointerEvent) => {
        if (event.pointerType === "touch") {
            activeTouchPointers.add(event.pointerId);
            isTouching.value = true;
        }
        previousMousePosition.value = { x: event.clientX, y: event.clientY };
        isDragging.value = true;
    };

    const stopDrag = (event?: PointerEvent) => {
        if (event?.pointerType === "touch") {
            const wasPinching = activeTouchPointers.size >= 2;
            activeTouchPointers.delete(event.pointerId);
            isDragging.value = activeTouchPointers.size > 0;
            isTouching.value = activeTouchPointers.size > 0;
            if (wasPinching && activeTouchPointers.size === 1) {
                // Flag pinch-to-single-finger transition to avoid rotation jump
                justExitedPinch.value = true;
            } else if (activeTouchPointers.size === 0) {
                // Clear stale flag when all fingers lift
                justExitedPinch.value = false;
            }
        } else {
            isDragging.value = false;
        }
        onStopDrag?.();
    };

    const drag = (event: PointerEvent) => {
        if (!isDragging.value) return;
        // Skip rotation when 2+ touch pointers are down (pinch gesture)
        if (activeTouchPointers.size >= 2) return;
        syncModifiers(event);

        const isTouch = event.pointerType === "touch";
        const { clientX: x, clientY: y } = event;

        // After pinch-to-single-finger transition, reset position to avoid jump
        if (justExitedPinch.value) {
            justExitedPinch.value = false;
            previousMousePosition.value = { x, y };
            return;
        }

        const deltaX = x - previousMousePosition.value.x;
        const deltaY = y - previousMousePosition.value.y;

        if (Math.abs(deltaX) < 0.5 && Math.abs(deltaY) < 0.5) return;

        if (
            pressedKeys.value.x ||
            pressedKeys.value.y ||
            pressedKeys.value.z
        ) {
            handleAxisSpecificInput(deltaX, deltaY, isTouch);
        } else if (pressedKeys.value.shift) {
            updateTranslation("x", deltaX);
            updateTranslation("y", deltaY);
        } else if (pressedKeys.value.ctrl || pressedKeys.value.meta) {
            // Z-axis roll from horizontal drag
            const axis = vec3.fromValues(0, 0, 1);
            const s = isTouch ? touchSensitivity : sensitivity;
            const angle =
                ((Math.abs(deltaX) * s) / 25) * Math.sign(deltaX);
            applyRotation(axis, angle);
            vec3.copy(angularVelocityAxis, axis);
            angularVelocitySpeed.value = Math.abs(angle);
        } else {
            updateRotation(deltaX, deltaY, isTouch);
        }

        previousMousePosition.value = { x, y };
    };

    const handleWheel = (event: WheelEvent) => {
        event.preventDefault();
        syncModifiers(event);

        const { deltaX: rawDX, deltaY: rawDY, ctrlKey } = event;

        // Logarithmic dampening: responsive for small deltas, capped for large ones
        const logDampen = (v: number) =>
            Math.sign(v) * Math.log1p(Math.abs(v)) * 1.5;
        const deltaX = logDampen(rawDX);
        const deltaY = logDampen(rawDY);

        if (Math.abs(deltaX) < 1e-4 && Math.abs(deltaY) < 1e-4) return;

        // Mark wheel as active so applyInertia doesn't decay mid-scroll
        isWheeling.value = true;
        if (wheelTimeout) clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
            isWheeling.value = false;
            // Kill residual velocity — wheel has no meaningful "release momentum"
            angularVelocitySpeed.value = 0;
        }, 150);

        if (
            pressedKeys.value.x ||
            pressedKeys.value.y ||
            pressedKeys.value.z
        ) {
            handleAxisSpecificInput(deltaX, deltaY);
        } else if (pressedKeys.value.shift) {
            updateTranslation("x", deltaX);
            updateTranslation("y", deltaY);
        } else if (
            pressedKeys.value.ctrl ||
            pressedKeys.value.meta ||
            ctrlKey
        ) {
            updateScale("x", -deltaY);
            updateScale("y", -deltaY);
            updateScale("z", -deltaY);
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

    // Pointer Events: dynamic document listeners only during active drag
    const onPointerMove = (event: PointerEvent) => {
        drag(event);
    };

    const removeDocListeners = () => {
        const doc = containerRef.value?.ownerDocument ?? document;
        doc.removeEventListener("pointermove", onPointerMove);
        doc.removeEventListener("pointerup", onPointerUp);
        doc.removeEventListener("pointercancel", onPointerCancel);
    };

    const onPointerUp = (event: PointerEvent) => {
        stopDrag(event);
        try {
            containerRef.value?.releasePointerCapture(event.pointerId);
        } catch { /* iOS may throw if already released */ }
        // Only remove doc listeners when no touch pointers remain
        if (event.pointerType !== "touch" || activeTouchPointers.size === 0) {
            removeDocListeners();
        }
    };

    const onPointerCancel = (event: PointerEvent) => {
        if (event.pointerType === "touch") {
            // On iOS Safari, pointercancel during pinch means
            // we can't trust remaining touch state
            activeTouchPointers.clear();
            isDragging.value = false;
            isTouching.value = false;
            justExitedPinch.value = false;
        } else {
            stopDrag(event);
        }
        try {
            containerRef.value?.releasePointerCapture(event.pointerId);
        } catch { /* iOS may throw if already released */ }
        removeDocListeners();
    };

    const onPointerDown = (event: PointerEvent) => {
        // Prevent iOS Safari from initiating its own gesture handling
        event.preventDefault();
        startDrag(event);
        containerRef.value!.setPointerCapture(event.pointerId);
        const doc = containerRef.value!.ownerDocument;
        doc.addEventListener("pointermove", onPointerMove);
        doc.addEventListener("pointerup", onPointerUp);
        doc.addEventListener("pointercancel", onPointerCancel);
    };

    return {
        isDragging,
        isTouching,
        isWheeling,
        activeTouchPointers,
        pressedKeys,
        syncModifiers,
        updateLinearTransform,
        updateTranslation,
        updateScale,
        handleAxisSpecificInput,
        startDrag,
        stopDrag,
        drag,
        handleWheel,
        updatePressedKeys,
        onPointerDown,
    };
}
