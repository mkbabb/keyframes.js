import type { KeyframesAnimation } from "@mkbabb/keyframes.js";
import { createGlobalState, useStorage } from "@vueuse/core";
import {
    checkAndResetExpiredStore,
    gcAndMigrateStoreBuckets,
    getAnimationSuperKey,
} from "./storeUtils";
import type { SceneId } from "./sceneMachine";

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
    // T.B9 — the ONE keyspace: the store keys by the registry `SceneId` (or an
    // animation whose `.superKey` field IS the SceneId). No divergent PascalCase.
    superKey: KeyframesAnimation<any> | SceneId | undefined = undefined,
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

/** T.B9 — migrate legacy PascalCase buckets to the registry `SceneId` keyspace
 *  and GC orphans (a pruned scene's bucket). Called at boot beside the machine's
 *  `gcOrphans` over the SAME valid-id set (the one `gcOrphans(validSceneIds,
 *  ...tables)` sweep, spread across the three globalState modules). */
export const _gcAndMigrateAnimationGroupsControlOptionsStore = (
    validSceneIds: Iterable<SceneId>,
) => {
    gcAndMigrateStoreBuckets(
        useAnimationGroupsControlOptionsStore(),
        validSceneIds,
    );
};
