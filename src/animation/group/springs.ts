/**
 * `group/springs.ts` — the K.W11 PHYS-C spring-driven blend-weight helpers
 * (R.W2 — the `group-layer-springs.ts` junk-drawer split; the ACTUAL
 * spring-related concern). The flagship physics: a `SpringProgress` (any
 * `WeightStepper`) DRIVES a layer's `weighted`-blend weight instead of a
 * constant, so a crossfade follows a PHYSICAL trajectory that can overshoot 1.0
 * and settle — only possible on kf's weighted-blend substrate.
 *
 *   - `seedLayerSpring` — constructs a fresh `SpringProgress` at the layer's
 *     current weight (one allocation per `transitionLayer` gesture, never a
 *     frame).
 *   - `advanceLayerSprings` — the per-frame integrate of every spring-driven
 *     layer weight (R.W2 lib-group C2: moved here off `AnimationGroup`; it
 *     touches only `entry.layer`, no `_grouped`/`_compositeBuf`/`_soaPlans`).
 *
 * value.js note: `SpringProgress` is LIGHT (value.js-free), so importing it here
 * adds no boundary edge — `group.ts` is HEAVY regardless.
 */
import { SpringProgress, type SpringProgressOptions } from "../physics/spring";
import type { AnimationGroupEntry } from "./group";

/**
 * Options for `AnimationGroup.transitionLayer` / `crossfade` (K.W11 PHYS-C).
 * The `spring` half is the {@link SpringProgressOptions} subset that shapes the
 * weight trajectory (`response`/`dampingFraction`/`bounce`-via-config); the
 * spring is ALWAYS seeded at the layer's CURRENT weight and targets the new
 * weight, so `initial`/`initialVelocity` are managed internally and excluded.
 */
export type LayerTransitionSpring = Partial<
    Omit<SpringProgressOptions, "initial" | "initialVelocity">
>;

/**
 * Seed a FRESH `SpringProgress` for a layer transition (K.W11 PHYS-C). The
 * spring starts at the layer's CURRENT weight (the value the blend was reading)
 * and targets the new weight, so the crossfade is velocity-continuous from rest.
 * With an UNDER-damped spring the weight momentarily blends PAST the target (the
 * canonical iOS "snap into place" for a whole animation layer) before settling —
 * a PHYSICAL trajectory, NOT a hard cut.
 *
 * Returns the constructed spring; the caller parks it on `layer.weightSpring`.
 * Re-targeting mid-flight RE-SEATS the EXISTING spring from its live `(value,
 * velocity)` via `set target` — that re-seat path does NOT come here (no new
 * spring); only the first transition of a static-weight layer seeds.
 *
 * Allocates exactly one `SpringProgress` per CALL — a user gesture
 * (`transitionLayer`/`crossfade`), never a frame.
 */
export const seedLayerSpring = (
    currentWeight: number,
    targetWeight: number,
    springOpts: LayerTransitionSpring | undefined,
): SpringProgress => {
    const spring = new SpringProgress({
        ...springOpts,
        initial: currentWeight,
    });
    spring.target = targetWeight;
    return spring;
};

/**
 * Advance every spring-driven layer weight by the frame delta `dt` ms (K.W11
 * PHYS-C). Iterates the entries, ticks each layer's `weightSpring`, and on
 * settle COMMITS the converged value to the constant `layer.weight` + CLEARS the
 * spring (the `weighted` leaf's `?? layer.weight` read then serves the
 * constant). Returns whether ANY spring remains active — the group parks it on
 * `_hasLayerSprings` so the constant-weight path pays nothing once all settle.
 * R.W2 (lib-group C2): moved here off `AnimationGroup` — it touches only
 * `entry.layer`, no `_grouped`/`_compositeBuf`/`_soaPlans` state.
 */
export const advanceLayerSprings = <V extends Record<string, unknown>>(
    entries: AnimationGroupEntry<V>[],
    dt: number,
): boolean => {
    let anyActive = false;
    for (const entry of entries) {
        const spring = entry.layer.weightSpring;
        if (spring === undefined) continue;
        if (dt > 0) spring.tickDt(dt);
        if (spring.settled) {
            // Commit the converged value to the constant weight, then drop the
            // spring so the read falls back to it (`delete`, not `= undefined`,
            // under `exactOptionalPropertyTypes`).
            entry.layer.weight = spring.value;
            delete entry.layer.weightSpring;
        } else {
            anyActive = true;
        }
    }
    return anyActive;
};
