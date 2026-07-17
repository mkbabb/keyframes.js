import type { FlatAuthoredValues } from "../compile/value";
import { CompositeState } from "./composite-state";
import type { SoALayerPlan } from "./soa";

/** Private, long-lived storage for the group's zero-allocation compositor. */
export interface GroupCompositeStorage {
    readonly compositeState: CompositeState;
    readonly grouped: FlatAuthoredValues;
    groupedKeys: string[];
    groupedKeysDirty: boolean;
    soaPlans: SoALayerPlan[] | null;
    compositeBuf: Float64Array | null;
}

export const createGroupCompositeStorage = (): GroupCompositeStorage => {
    const compositeState = new CompositeState();
    return {
        compositeState,
        grouped: compositeState.values,
        groupedKeys: [],
        groupedKeysDirty: true,
        soaPlans: null,
        compositeBuf: null,
    };
};
