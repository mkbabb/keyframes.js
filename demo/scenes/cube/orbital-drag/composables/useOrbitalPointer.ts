import { vec3 } from "gl-matrix";
import { ref } from "vue";
import type { Ref, ShallowRef } from "vue";
import { useEventListener, useTimeoutFn } from "@vueuse/core";
import { axes } from "..";
import type { PressedKeys } from "../types";

export interface OrbitalPointerParams {
    sensitivity: number;
    touchSensitivity: number;
    containerRef: Readonly<ShallowRef<HTMLElement | null>>;
    // Transform appliers — owned by OrbitalDrag (the component that owns the
    // model + emit); the pointer reader only dispatches input to them.
    updateRotation: (deltaX: number, deltaY: number, isTouch?: boolean) => void;
    applyRotation: (axis: vec3, angle: number) => void;
    updateTranslation: (axis: (typeof axes)[number], delta: number) => void;
    updateScale: (axis: (typeof axes)[number], delta: number) => void;
    handleAxisSpecificInput: (deltaX: number, deltaY: number, isTouch?: boolean) => void;
    angularVelocityAxis: vec3;
    angularVelocitySpeed: Ref<number>;
    onStopDrag?: () => void;
}

export function useOrbitalPointer(params: OrbitalPointerParams) {
    const {
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
        onStopDrag,
    } = params;

    const isDragging = ref(false);
    const isTouching = ref(false);
    const isWheeling = ref(false);

    // Debounced wheel-end: each wheel event restarts the timer; when it fires
    // 150ms after the last event, the wheel is released (no release momentum).
    const { start: startWheelTimeout } = useTimeoutFn(() => {
        isWheeling.value = false;
        angularVelocitySpeed.value = 0;
    }, 150, { immediate: false });

    // Track active touch pointer IDs -- when 2+ are down, drag() should skip rotation
    const activeTouchPointers = new Set<number>();

    const previousMousePosition = ref({ x: 0, y: 0 });

    // Flag to reset previousMousePosition after pinch-to-single-finger transition
    const justExitedPinch = ref(false);

    const pressedKeys = ref<PressedKeys>({
        x: false, y: false, z: false, shift: false, ctrl: false, meta: false,
    });

    const syncModifiers = (event: { shiftKey: boolean; ctrlKey: boolean; metaKey: boolean }) => {
        pressedKeys.value.shift = event.shiftKey;
        pressedKeys.value.ctrl = event.ctrlKey;
        pressedKeys.value.meta = event.metaKey;
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

        if (pressedKeys.value.x || pressedKeys.value.y || pressedKeys.value.z) {
            handleAxisSpecificInput(deltaX, deltaY, isTouch);
        } else if (pressedKeys.value.shift) {
            updateTranslation("x", deltaX);
            updateTranslation("y", deltaY);
        } else if (pressedKeys.value.ctrl || pressedKeys.value.meta) {
            // Z-axis roll from horizontal drag
            const axis = vec3.fromValues(0, 0, 1);
            const s = isTouch ? touchSensitivity : sensitivity;
            const angle = ((Math.abs(deltaX) * s) / 25) * Math.sign(deltaX);
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
        const logDampen = (v: number) => Math.sign(v) * Math.log1p(Math.abs(v)) * 1.5;
        const deltaX = logDampen(rawDX);
        const deltaY = logDampen(rawDY);

        if (Math.abs(deltaX) < 1e-4 && Math.abs(deltaY) < 1e-4) return;

        // Mark wheel as active so applyInertia doesn't decay mid-scroll
        isWheeling.value = true;
        // Restart the debounce — useTimeoutFn.start() cancels any pending run.
        startWheelTimeout();

        if (pressedKeys.value.x || pressedKeys.value.y || pressedKeys.value.z) {
            handleAxisSpecificInput(deltaX, deltaY);
        } else if (pressedKeys.value.shift) {
            updateTranslation("x", deltaX);
            updateTranslation("y", deltaY);
        } else if (pressedKeys.value.ctrl || pressedKeys.value.meta || ctrlKey) {
            updateScale("x", -deltaY);
            updateScale("y", -deltaY);
            updateScale("z", -deltaY);
        } else {
            updateRotation(-deltaX, -deltaY);
        }
    };

    const updatePressedKeys = (event: KeyboardEvent, isPressed: boolean) => {
        // event.key "control" maps to the `ctrl` slot; x/y/z/shift/meta map 1:1.
        const key = event.key.toLowerCase();
        const slot = key === "control" ? "ctrl" : key;
        if (slot in pressedKeys.value) {
            pressedKeys.value[slot as keyof PressedKeys] = isPressed;
        }
    };

    // Pointer Events: dynamic document listeners only during active drag.
    // Captured at capture-start as useEventListener stop() handles, torn down
    // on pointerup/cancel; vueuse's tryOnScopeDispose covers an unmount mid-drag.
    let docListenerStops: (() => void)[] = [];

    const removeDocListeners = () => {
        for (const stop of docListenerStops) stop();
        docListenerStops = [];
    };

    const releaseCapture = (event: PointerEvent) => {
        try {
            containerRef.value?.releasePointerCapture(event.pointerId);
        } catch { /* KEEP: iOS may throw if already released */ }
    };

    const onPointerUp = (event: PointerEvent) => {
        stopDrag(event);
        releaseCapture(event);
        // Only remove doc listeners when no touch pointers remain
        if (event.pointerType !== "touch" || activeTouchPointers.size === 0) {
            removeDocListeners();
        }
    };

    const onPointerCancel = (event: PointerEvent) => {
        if (event.pointerType === "touch") {
            // iOS Safari pointercancel during pinch — remaining touch state
            // is untrustworthy, so reset everything.
            activeTouchPointers.clear();
            isDragging.value = false;
            isTouching.value = false;
            justExitedPinch.value = false;
        } else {
            stopDrag(event);
        }
        releaseCapture(event);
        removeDocListeners();
    };

    const onPointerDown = (event: PointerEvent) => {
        // Prevent iOS Safari from initiating its own gesture handling
        event.preventDefault();
        startDrag(event);
        containerRef.value!.setPointerCapture(event.pointerId);
        // Register the doc listeners once per gesture — a second touch pointer
        // shares the live listeners (matches the prior addEventListener dedup).
        if (docListenerStops.length === 0) {
            const doc = containerRef.value!.ownerDocument;
            docListenerStops = [
                useEventListener(doc, "pointermove", drag),
                useEventListener(doc, "pointerup", onPointerUp),
                useEventListener(doc, "pointercancel", onPointerCancel),
            ];
        }
    };

    return {
        isDragging,
        isTouching,
        isWheeling,
        activeTouchPointers,
        pressedKeys,
        syncModifiers,
        startDrag,
        stopDrag,
        drag,
        handleWheel,
        updatePressedKeys,
        onPointerDown,
    };
}
