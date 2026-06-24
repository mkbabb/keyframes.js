import type { KeyframesAnimation } from "@mkbabb/keyframes.js";
import { createGlobalState, useStorage } from "@vueuse/core";
import { checkAndResetExpiredStore, getAnimationSuperKey } from "./storeUtils";

export type StoredAnimationGroupControlOptions = {
    selectedControl: string;
    // `null` is the honest "no animation selected" state (the clear/validate
    // paths assign it) — typed so the assignment needs no `as any` (J.W2 S6 /
    // LS-20).
    selectedAnimation: string | null;
    selectedKeyframesControl: string;
    isTimelineExpanded: boolean;
    isControlsPanelOpen: boolean;
    keyframeControls?: {
        selectedKeyframesControl: string;
        dialogOpen: boolean;
        keyframes: string;
        addKeyframes: string;
    };
    ppMode?: boolean;
    matrixOptions?: { fixed: boolean };
};

export type StoredAnimationGroupsControlOptions = {
    _storeTimestamp?: number;
    [name: string]: StoredAnimationGroupControlOptions | number | undefined;
};

const defaultStoredAnimationGroupControlOptions: StoredAnimationGroupControlOptions =
    {
        selectedControl: "controls",
        selectedAnimation: "",
        selectedKeyframesControl: "string",
        isTimelineExpanded: false,
        isControlsPanelOpen: true,
    };

export const useAnimationGroupsControlOptionsStore = createGlobalState(() => {
    const store = useStorage<StoredAnimationGroupsControlOptions>(
        "animation-groups-control-options-store",
        { _storeTimestamp: Date.now() } as StoredAnimationGroupsControlOptions,
    );
    checkAndResetExpiredStore(store, {
        _storeTimestamp: Date.now(),
    } as StoredAnimationGroupsControlOptions);
    return store;
});

export const getStoredAnimationGroupControlOptions = (
    superKey: KeyframesAnimation<any> | string | undefined = undefined,
): StoredAnimationGroupControlOptions => {
    superKey = getAnimationSuperKey(superKey, superKey);

    const animationGroupsControlOptionsStore =
        useAnimationGroupsControlOptionsStore();

    if (!animationGroupsControlOptionsStore.value[superKey]) {
        animationGroupsControlOptionsStore.value[superKey] = structuredClone(
            defaultStoredAnimationGroupControlOptions,
        );
    }

    const controls = animationGroupsControlOptionsStore.value[
        superKey
    ] as StoredAnimationGroupControlOptions;

    return controls;
};

/** Reset the store to defaults (used by resetAllStores). */
export const _resetAnimationGroupsControlOptionsStore = () => {
    const store = useAnimationGroupsControlOptionsStore();
    store.value = { _storeTimestamp: Date.now() } as StoredAnimationGroupsControlOptions;
};
