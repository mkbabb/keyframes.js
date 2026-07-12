import type { AnimationLayerConfig } from "../constants";

/**
 * Resolve the orthogonal layer-weight axis.
 *
 * Static layer weights are normalized to the crossfade domain [0, 1]. A live
 * spring is deliberately exempt: its under-damped trajectory may overshoot
 * while converging, which is part of the spring contract; callers still seed
 * and target it with normalized values through the layer API.
 */
export const resolveBlendWeight = (layer: AnimationLayerConfig): number => {
    const value = layer.weightSpring?.value ?? layer.weight;
    if (layer.weightSpring) return value;
    if (!Number.isFinite(value)) return 0;
    return Math.min(1, Math.max(0, value));
};

/** Normalize a public transition target before it seeds/reseats a spring. */
export const normalizeBlendWeight = (value: number): number => {
    if (!Number.isFinite(value)) return 0;
    return Math.min(1, Math.max(0, value));
};
