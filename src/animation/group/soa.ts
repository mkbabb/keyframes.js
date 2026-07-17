import { lerp } from "@mkbabb/value.js/math";
import type { FlatAuthoredValues } from "../compile/value";
import type { AnimationLayerConfig } from "../constants";
import type { AnimationGroupEntry } from "./types";
import { isWeightBlend, resolveBlendWeight } from "./weight";

interface NumericValueRef {
    readonly values: FlatAuthoredValues;
    readonly key: string;
}

export const isNumericAuthoredValue = (value: unknown): value is number =>
    typeof value === "number";

export interface SoALayerPlan {
    readonly layer: AnimationLayerConfig;
    readonly weightBlend: boolean;
    readonly carriers: NumericValueRef[];
    readonly incomingSlots: NumericValueRef[];
    readonly residualKeys: Set<string>;
}

export const groupSoABlendLayer = (
    buf: Float64Array,
    plan: SoALayerPlan,
): void => {
    const { carriers, incomingSlots } = plan;
    const count = carriers.length;
    if (count === 0) return;

    for (let index = 0; index < count; index++) {
        buf[index] = carriers[index]!.values[carriers[index]!.key] as number;
    }

    if (plan.weightBlend) {
        const weight = resolveBlendWeight(plan.layer);
        for (let index = 0; index < count; index++) {
            const incoming = incomingSlots[index]!;
            buf[index] = lerp(
                buf[index]!,
                incoming.values[incoming.key] as number,
                weight,
            );
        }
    } else {
        for (let index = 0; index < count; index++) {
            const incoming = incomingSlots[index]!;
            buf[index] = buf[index]! +
                (incoming.values[incoming.key] as number);
        }
    }

    for (let index = 0; index < count; index++) {
        const carrier = carriers[index]!;
        carrier.values[carrier.key] = buf[index]!;
    }
};

export const buildSoAPlans = <V extends Record<string, unknown>>(
    entries: AnimationGroupEntry<V>[],
    previousBuffer: Float64Array | null,
    ownedValues: FlatAuthoredValues,
): { plans: SoALayerPlan[]; compositeBuf: Float64Array | null } => {
    const plans: SoALayerPlan[] = [];
    const carrierByKey: Record<string, NumericValueRef | undefined> = {};
    let maxWidth = 0;

    for (const entry of entries) {
        const { layer, values } = entry;
        if (!layer.enabled) continue;
        const whitelist = layer.properties;
        const operation = layer.op;
        const weightBlend = isWeightBlend(layer);

        if (operation === "replace" && !weightBlend) {
            for (const key in values) {
                if (whitelist && !whitelist.has(key)) continue;
                if (values[key] === undefined) continue;
                carrierByKey[key] = { values: ownedValues, key };
            }
            continue;
        }

        const carriers: NumericValueRef[] = [];
        const incomingSlots: NumericValueRef[] = [];
        const residualKeys = new Set<string>();
        for (const key in values) {
            if (whitelist && !whitelist.has(key)) continue;
            const incoming = values[key];
            if (incoming === undefined) continue;
            const carrier = carrierByKey[key];
            const existing = carrier?.values[key];
            if (carrier !== undefined &&
                isNumericAuthoredValue(existing) &&
                isNumericAuthoredValue(incoming)) {
                carriers.push(carrier);
                incomingSlots.push({ values, key });
            } else {
                residualKeys.add(key);
                carrierByKey[key] = { values: ownedValues, key };
            }
        }

        maxWidth = Math.max(maxWidth, carriers.length);
        plans.push({ layer, weightBlend, carriers, incomingSlots, residualKeys });
    }

    let compositeBuf = previousBuffer;
    if (maxWidth > 0 &&
        (compositeBuf === null || compositeBuf.length < maxWidth)) {
        compositeBuf = new Float64Array(maxWidth);
    }
    return { plans, compositeBuf };
};
