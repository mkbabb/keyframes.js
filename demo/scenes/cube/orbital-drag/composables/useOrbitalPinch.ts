import { vec3 } from "gl-matrix";
import { ref } from "vue";
import type { Ref } from "vue";
import type { TransformState } from "..";
import { axes } from "..";
import type { GestureEvent } from "../types";

interface OrbitalPinchParams {
    model: Ref<TransformState>;
    isTouching: Ref<boolean>;
    isWheeling: Ref<boolean>;
    scaleFactor: number;
    // Callbacks into the quaternion core and pointer layer
    updateTranslation: (axis: (typeof axes)[number], delta: number) => void;
    updateScale: (axis: (typeof axes)[number], delta: number) => void;
    applyRotation: (axis: vec3, angle: number) => void;
    angularVelocityAxis: vec3;
    angularVelocitySpeed: Ref<number>;
}

export function useOrbitalPinch(params: OrbitalPinchParams) {
    const {
        isTouching,
        isWheeling,
        scaleFactor,
        updateTranslation,
        updateScale,
        applyRotation,
        angularVelocityAxis,
        angularVelocitySpeed,
    } = params;

    // Pinch tracking for standard touch events (non-Safari)
    const previousPinchDistance = ref(0);
    const previousPinchCenter = ref({ x: 0, y: 0 });
    const previousPinchAngle = ref(0);

    // Safari gesture state
    const previousGestureState = ref({ x: 0, y: 0, scale: 1 });

    const getUserXY = (event: MouseEvent | TouchEvent) => {
        if (!!(event as TouchEvent).touches) {
            const touch =
                (event as TouchEvent).touches[0] ??
                (event as TouchEvent).changedTouches[0];
            if (!touch) return { x: 0, y: 0 };
            return { x: touch.clientX, y: touch.clientY };
        }
        return {
            x: (event as MouseEvent).clientX,
            y: (event as MouseEvent).clientY,
        };
    };

    const getTouchDistance = (event: TouchEvent) => {
        if (event.touches.length < 2) return 0;
        const t0 = event.touches[0]!,
            t1 = event.touches[1]!;
        const dx = t1.clientX - t0.clientX,
            dy = t1.clientY - t0.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    const getTouchCenter = (event: TouchEvent) => {
        if (event.touches.length < 2) return getUserXY(event);
        const t0 = event.touches[0]!,
            t1 = event.touches[1]!;
        return {
            x: (t0.clientX + t1.clientX) / 2,
            y: (t0.clientY + t1.clientY) / 2,
        };
    };

    const getTouchAngle = (event: TouchEvent) => {
        if (event.touches.length < 2) return 0;
        const t0 = event.touches[0]!,
            t1 = event.touches[1]!;
        return Math.atan2(
            t1.clientY - t0.clientY,
            t1.clientX - t0.clientX,
        );
    };

    const startTouchPinch = (event: TouchEvent) => {
        if (event.touches.length >= 2) {
            event.preventDefault();
            isTouching.value = true;
            previousPinchDistance.value = getTouchDistance(event);
            previousPinchCenter.value = getTouchCenter(event);
            previousPinchAngle.value = getTouchAngle(event);
        }
    };

    const handleTouchPinch = (event: TouchEvent) => {
        if (!isTouching.value || event.touches.length < 2) return;
        event.preventDefault();

        const dist = getTouchDistance(event);
        const center = getTouchCenter(event);
        const angle = getTouchAngle(event);

        if (previousPinchDistance.value > 0) {
            const deltaScale =
                (dist - previousPinchDistance.value) /
                (1 / (scaleFactor * 2));
            const deltaCX = center.x - previousPinchCenter.value.x;
            const deltaCY = center.y - previousPinchCenter.value.y;

            updateTranslation("x", deltaCX);
            updateTranslation("y", deltaCY);
            updateScale("x", deltaScale);
            updateScale("y", deltaScale);
            updateScale("z", deltaScale);

            // Two-finger rotation around Z axis
            if (previousPinchAngle.value !== 0) {
                let deltaAngle = angle - previousPinchAngle.value;
                // Normalize to [-PI, PI]
                if (deltaAngle > Math.PI) deltaAngle -= 2 * Math.PI;
                if (deltaAngle < -Math.PI) deltaAngle += 2 * Math.PI;

                const zAxis = vec3.fromValues(0, 0, 1);
                applyRotation(zAxis, deltaAngle);
                vec3.copy(angularVelocityAxis, zAxis);
                angularVelocitySpeed.value = Math.abs(deltaAngle);
            }
        }

        previousPinchDistance.value = dist;
        previousPinchCenter.value = center;
        previousPinchAngle.value = angle;
    };

    const stopTouchPinch = (event: TouchEvent) => {
        if (event.touches.length < 2) {
            previousPinchDistance.value = 0;
            previousPinchAngle.value = 0;
        }
    };

    // Safari gesture events
    const startGesture = (event: GestureEvent) => {
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

    const gesture = (event: GestureEvent) => {
        if (!isTouching.value || isWheeling.value) return;
        event.preventDefault();

        const { screenX, screenY, scale } = event;

        const deltaX = screenX - previousGestureState.value.x;
        const deltaY = screenY - previousGestureState.value.y;
        const deltaScale =
            (scale - previousGestureState.value.scale) /
            (scaleFactor / 1.25);

        if (
            Math.abs(deltaX) < 1e-4 &&
            Math.abs(deltaY) < 1e-4 &&
            Math.abs(deltaScale) < 1e-4
        ) {
            return;
        }

        updateTranslation("x", deltaX);
        updateTranslation("y", deltaY);

        updateScale("x", deltaScale);
        updateScale("y", deltaScale);
        updateScale("z", deltaScale);

        previousGestureState.value = { x: screenX, y: screenY, scale };
    };

    /** Reset pinch distance on stopDrag (called by pointer layer) */
    const resetPinchDistance = () => {
        previousPinchDistance.value = 0;
    };

    return {
        previousPinchDistance,
        startTouchPinch,
        handleTouchPinch,
        stopTouchPinch,
        startGesture,
        gesture,
        stopGesture,
        resetPinchDistance,
    };
}
