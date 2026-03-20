import { useRafFn } from "@vueuse/core";
import type { Ref } from "vue";
import { watch } from "vue";
import type { TransformState, VelocityState } from ".";
import { axes } from ".";

export interface OrbitalInertiaParams {
    model: Ref<TransformState>;
    velocity: Ref<VelocityState>;
    isDragging: Ref<boolean>;
    isTouching: Ref<boolean>;
    isWheeling: Ref<boolean>;
    inertiaFactor: number;
    angularVelocitySpeed: Ref<number>;
    // Callbacks into the quaternion core and pointer layer
    applyRotation: (axis: Float32Array, angle: number) => void;
    angularVelocityAxis: Float32Array;
    updateLinearTransform: (
        category: "translate" | "scale",
        axis: (typeof axes)[number],
        value: number,
        velocityValue: number,
    ) => void;
}

export function useOrbitalInertia(params: OrbitalInertiaParams) {
    const {
        model,
        velocity,
        isDragging,
        isTouching,
        isWheeling,
        inertiaFactor,
        angularVelocitySpeed,
        applyRotation,
        angularVelocityAxis,
        updateLinearTransform,
    } = params;

    const hasVelocity = () => {
        if (Math.abs(angularVelocitySpeed.value) > 1e-4) return true;
        for (const category of ["translate", "scale"] as const) {
            for (const v of Object.values(velocity.value[category])) {
                if (Math.abs(v as number) > 0.01) return true;
            }
        }
        return false;
    };

    /** Target frame interval for frame-rate-independent decay (ms). */
    const TARGET_DT = 1000 / 60;
    let lastInertiaTime = 0;

    const applyInertia = () => {
        if (isDragging.value || isTouching.value || isWheeling.value) return;

        // Frame-rate-independent decay: scale the friction exponent by
        // the actual frame delta so inertia feels identical at 30, 60, or 120fps.
        const now = performance.now();
        const dt = lastInertiaTime > 0 ? Math.min(now - lastInertiaTime, 100) : TARGET_DT;
        lastInertiaTime = now;
        const decay = Math.pow(inertiaFactor, dt / TARGET_DT);

        // Rotational inertia via persistent quaternion
        if (Math.abs(angularVelocitySpeed.value) > 1e-4) {
            applyRotation(angularVelocityAxis, angularVelocitySpeed.value);
            angularVelocitySpeed.value *= decay;
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
                        (model.value[category] as Record<string, number>)[
                            k
                        ]! + v,
                        v * decay,
                    );
                } else {
                    (
                        velocity.value[category] as Record<string, number>
                    )[k] = 0;
                }
            }
        }

        // Auto-pause when all velocities have decayed to zero
        if (!hasVelocity()) {
            lastInertiaTime = 0;
            pause();
        }
    };

    const { pause, resume } = useRafFn(applyInertia, { immediate: false });

    // Auto-resume the inertia loop when a gesture ends with residual velocity
    watch(
        () => isDragging.value || isTouching.value || isWheeling.value,
        (active) => {
            if (!active && hasVelocity()) {
                resume();
            }
        },
    );

    return { pause, resume };
}
