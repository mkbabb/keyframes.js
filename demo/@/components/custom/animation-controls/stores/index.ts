// Barrel re-export — preserves all existing import paths.
// import { X } from "./animationStores" and
// import { X } from "./animationStores/index" both resolve here.

export {
    type StoredAnimationOptions,
    type StoredAnimationGroupOptions,
    type StoredAnimationGroupsOptions,
    defaultAnimationOptions,
    defaultStepOptions,
    defaultCubicBezierOptions,
    defaultStoredAnimationOptions,
    useAnimationGroupsOptionsStore,
    getStoredAnimationOptions,
    createAnimationUUId,
} from "./animationOptionsStore";

export {
    type StoredAnimationGroupControlOptions,
    type StoredAnimationGroupsControlOptions,
    useAnimationGroupsControlOptionsStore,
    getStoredAnimationGroupControlOptions,
} from "./controlOptionsStore";

export {
    encodeStateToHash,
    decodeStateFromHash,
    getAllState,
    restoreStateFromParam,
} from "./hashSharing";

export {
    type AnimationPlaybackSnapshot,
    type ScenePlaybackState,
    saveScenePlaybackState,
    getScenePlaybackState,
    clearScenePlaybackState,
} from "./scenePlayback";

export { getAnimationSuperKey, STORE_KEYS } from "./storeUtils";

import { _resetAnimationGroupsOptionsStore } from "./animationOptionsStore";
import { _resetAnimationGroupsControlOptionsStore } from "./controlOptionsStore";
import { _resetAssetManagerStore } from "@components/custom/asset-manager/useAssetManager";
import { STORE_KEYS } from "./storeUtils";

export const resetAllStores = () => {
    _resetAnimationGroupsOptionsStore();
    _resetAnimationGroupsControlOptionsStore();
    _resetAssetManagerStore();

    for (const key of STORE_KEYS) {
        localStorage.removeItem(key);
    }
};
