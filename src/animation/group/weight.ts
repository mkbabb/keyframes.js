import type { AnimationLayerConfig } from "../constants";

import type { CompositeOperator } from "../constants";

/** Resolve the single canonical operation axis while accepting old callers. */
export const resolveBlendOperator = (
    layer: AnimationLayerConfig,
): CompositeOperator => {
    if (layer.op !== undefined) return layer.op;
    return layer.blendMode === "weighted" ? "replace" : layer.blendMode;
};

/** `weighted` and `{ op: "replace", weight }` are the same compatibility form. */
export const isWeightedBlend = (layer: AnimationLayerConfig): boolean =>
    layer.blendMode === "weighted" ||
    (layer.op === "replace" && layer.weight !== 1);

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
