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
    getAnimationGroupsOptionsStore,
    getStoredAnimationOptions,
    createAnimationUUId,
} from "./animationOptionsStore";

export {
    type StoredAnimationGroupControlOptions,
    type StoredAnimationGroupsControlOptions,
    getAnimationGroupsControlOptionsStore,
    getStoredAnimationGroupControlOptions,
} from "./controlOptionsStore";

export {
    encodeStateToHash,
    decodeStateFromHash,
    getAllState,
    restoreStateFromHash,
    initFromHash,
} from "./hashSharing";

export {
    type AnimationPlaybackSnapshot,
    type ScenePlaybackState,
    saveScenePlaybackState,
    getScenePlaybackState,
    clearScenePlaybackState,
    setActiveScene,
    getActiveScene,
} from "./scenePlayback";

export { deepDefaultStore, getAnimationSuperKey, STORE_KEYS } from "./storeUtils";

// --- resetAllStores (needs access to both store singletons) ---

import { getAnimationGroupsOptionsStore, _resetAnimationGroupsOptionsStore } from "./animationOptionsStore";
import { getAnimationGroupsControlOptionsStore, _resetAnimationGroupsControlOptionsStore } from "./controlOptionsStore";
import { STORE_KEYS } from "./storeUtils";

export const resetAllStores = () => {
    // Reset reactive refs
    getAnimationGroupsOptionsStore().value = { _storeTimestamp: Date.now() };
    getAnimationGroupsControlOptionsStore().value = { _storeTimestamp: Date.now() };

    // Also clear localStorage directly — useStorage writeback may not flush before reload
    try {
        for (const key of STORE_KEYS) {
            localStorage.removeItem(key);
        }
    } catch {
        // Safari private browsing — no-op
    }

    // Clear URL hash so restoreStateFromHash() doesn't re-populate on reload
    if (window.location.hash) {
        history.replaceState(null, "", window.location.pathname + window.location.search);
    }

    // Reset module-level singletons so they're recreated fresh on next access
    _resetAnimationGroupsOptionsStore();
    _resetAnimationGroupsControlOptionsStore();
};
