import type { NumericFoldPlan } from "./compiled-frame";
import type {
    InterpSlot,
    NumericInterpSlot,
} from "./interp-slot";

/** Build the stable numeric/residual partition used by the frame hot path. */
export const buildNumericPlan = (
    slots: readonly InterpSlot[],
): NumericFoldPlan => {
    const numeric: NumericInterpSlot[] = [];
    const residual: InterpSlot[] = [];
    for (const slot of slots) {
        if (slot.kind === "number") numeric.push(slot);
        else residual.push(slot);
    }

    const from = new Float64Array(numeric.length);
    const to = new Float64Array(numeric.length);
    for (let index = 0; index < numeric.length; index++) {
        from[index] = numeric[index]!.from;
        to[index] = numeric[index]!.to;
    }

    return {
        numeric,
        residual,
        from,
        to,
        out: new Float64Array(numeric.length),
    };
};
