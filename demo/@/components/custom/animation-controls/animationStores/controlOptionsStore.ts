import type { Animation } from "@src/animation";
import { useStorage } from "@vueuse/core";
import { ref } from "vue";
import { checkAndResetExpiredStore, touchTimestamp, getAnimationSuperKey } from "./storeUtils";

export type StoredAnimationGroupControlOptions = {
    selectedControl: string;
    selectedAnimation: string;
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
        isControlsPanelOpen: false,
    };

let _animationGroupsControlOptionsStore: ReturnType<
    typeof useStorage<StoredAnimationGroupsControlOptions>
> | null = null;

export const getAnimationGroupsControlOptionsStore = (): ReturnType<
    typeof useStorage<StoredAnimationGroupsControlOptions>
> => {
    if (!_animationGroupsControlOptionsStore) {
        try {
            _animationGroupsControlOptionsStore = useStorage(
                "animation-groups-control-options-store",
                {
                    _storeTimestamp: Date.now(),
                } as StoredAnimationGroupsControlOptions,
            );
            checkAndResetExpiredStore(
                _animationGroupsControlOptionsStore,
                {
                    _storeTimestamp: Date.now(),
                } as StoredAnimationGroupsControlOptions,
            );
        } catch {
            // Safari private browsing or no localStorage — fall back to a plain ref
            _animationGroupsControlOptionsStore = ref({
                _storeTimestamp: Date.now(),
            }) as ReturnType<
                typeof useStorage<StoredAnimationGroupsControlOptions>
            >;
        }
    }
    return _animationGroupsControlOptionsStore!;
};

export const getStoredAnimationGroupControlOptions = (
    superKey: Animation<any> | string | undefined = undefined,
): StoredAnimationGroupControlOptions => {
    superKey = getAnimationSuperKey(superKey, superKey);

    const animationGroupsControlOptionsStore =
        getAnimationGroupsControlOptionsStore();
    touchTimestamp(animationGroupsControlOptionsStore);

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

/** Reset the module-level singleton (used by resetAllStores). */
export const _resetAnimationGroupsControlOptionsStore = () => {
    _animationGroupsControlOptionsStore = null;
};
