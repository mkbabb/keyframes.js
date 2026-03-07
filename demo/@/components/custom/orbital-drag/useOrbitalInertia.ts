import { useRafFn } from "@vueuse/core";
import type { Ref } from "vue";
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
                        (model.value[category] as Record<string, number>)[
                            k
                        ]! + v,
                        v * inertiaFactor,
                    );
                } else {
                    (
                        velocity.value[category] as Record<string, number>
                    )[k] = 0;
                }
            }
        }
    };

    const { pause, resume } = useRafFn(applyInertia);

    return { pause, resume };
}
