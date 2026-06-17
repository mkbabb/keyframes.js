import { useRafFn } from "@vueuse/core";
import type { Ref } from "vue";
import { watch } from "vue";
import type { TransformState, VelocityState } from "..";
import { axes } from "..";
// inv ζ (orchestration analogue, F.W10.S1): the orbital inertia consumes the
// engine's SHIPPED analytic `decay()` closed form — it no longer hand-rolls the
// `Math.pow(inertiaFactor, dt/TARGET_DT)` discrete Euler decay the engine now
// owns. `decay` is the light surface (zero value.js edge), imported from the
// published barrel `@mkbabb/keyframes.js` like every other demo engine consumer
// (L.W8 ED-3 dogfood inversion — the demo consumes the published surface, not
// deep `@src/animation/*` paths).
import { decay } from "@mkbabb/keyframes.js";
// The Vue-free measure-first mapping (k from inertiaFactor) + TARGET_DT, kept in
// a pure module so the inertia-parity gate imports it without the .vue graph.
import { TARGET_DT, inertiaFactorToFriction } from "./inertiaDecay";

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

    // The friction `k` the analytic glide bleeds velocity at — derived ONCE so
    // the felt decay-rate matches the legacy per-frame form (the parity gate).
    const friction = inertiaFactorToFriction(inertiaFactor);

    // The engine's analytic decay sampler, seeded ONCE with unit velocity so
    // `unitDecay(t_s).velocity` IS the multiplicative factor e^(−k·t_s) — the
    // ratio v(t+dt)/v(t) over a frame. The closure is captured once (decay() is
    // allocation-free per call), so the hot loop only reads it. This is the
    // genuine dogfood: the per-frame factor comes from the SHIPPED `decay()`
    // closed form, NOT a hand-rolled `Math.pow`.
    const unitDecay = decay({ velocity: 1, friction });

    // The analytic velocity-decay factor over a frame of `dtMs` ms. The
    // per-frame integration structure is preserved (position += current
    // velocity), so the swap is isomorphism-restoring: same trajectory,
    // frame-rate-exact (no Euler drift).
    const decayFactorOver = (dtMs: number): number =>
        unitDecay(dtMs / 1000).velocity;

    let lastInertiaTime = 0;

    const applyInertia = () => {
        if (isDragging.value || isTouching.value || isWheeling.value) return;

        // Frame-rate-independent decay: the analytic factor over the actual
        // frame delta, so inertia feels identical at 30, 60, or 120fps (the
        // closed form is frame-rate-exact by construction — no Euler drift).
        const now = performance.now();
        const dt =
            lastInertiaTime > 0
                ? Math.min(now - lastInertiaTime, 100)
                : TARGET_DT;
        lastInertiaTime = now;
        const factor = decayFactorOver(dt);

        // Rotational inertia via persistent quaternion
        if (Math.abs(angularVelocitySpeed.value) > 1e-4) {
            applyRotation(angularVelocityAxis, angularVelocitySpeed.value);
            angularVelocitySpeed.value *= factor;
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
                        v * factor,
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
