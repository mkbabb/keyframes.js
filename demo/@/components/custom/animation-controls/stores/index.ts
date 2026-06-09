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

// The scene+playback state machine (H.W1 keystone). Replaces the bare
// scenePlayback.ts Map: the per-scene snapshot now lives in the reactive
// machine context, keyed by scene. The type exports re-home here in the same
// motion (MED-2). The mutation boundary (MED-4): only `dispatch()` + readonly
// refs are exported — no writable activeScene/.status surface.
export {
    type SceneId,
    type PlaybackStatus,
    type AnimationPlaybackSnapshot,
    type PlaybackSnapshot,
    type ScenePlaybackState,
    type SceneContext,
    type SceneEvent,
    type MachineState,
    type ScenePlayback,
    transition,
    HOME_SCENE_ID,
} from "./sceneMachine";

// The reactive store (the effect layer) — co-located with the pure core.
export { useSceneMachine, SCENE_MACHINE_PERSIST_KEY } from "./useSceneMachine";

// The control-surface DFA (H.W11.S4 / I2 — the third orthogonal axis). The pure
// table + selectors; the reactive `controlSurfaces` projection is on
// useSceneMachine (the effect layer above).
export {
    type ControlSurface,
    BUILT_IN_SURFACES,
    CONTROL_SURFACES,
    CONDITIONAL_SURFACES,
    controlSurfacesFor,
    selectedControlSurfaceFor,
    isSurfaceValidForScene,
    builtInSurfacesFor,
} from "./controlSurfaceDFA";

export {
    type RafSceneHandle,
    createGroupAdapter,
    createRafAdapter,
    restoreGroupPlaybackState,
} from "./scenePlaybackAdapters";

export { getAnimationSuperKey, STORE_KEYS } from "./storeUtils";

import { _resetAnimationGroupsOptionsStore } from "./animationOptionsStore";
import { _resetAnimationGroupsControlOptionsStore } from "./controlOptionsStore";
import { _resetAssetManagerStore } from "@components/custom/asset-manager/useAssetManager";
import { STORE_KEYS } from "./storeUtils";
import { SCENE_MACHINE_PERSIST_KEY } from "./useSceneMachine";

export const resetAllStores = () => {
    _resetAnimationGroupsOptionsStore();
    _resetAnimationGroupsControlOptionsStore();
    _resetAssetManagerStore();

    // The scene+playback machine persists the active-scene fact + per-scene
    // snapshots (H.W1 — replacing the deleted raw `keyframes-js-active-scene`
    // localStorage write). Wiping it here means a reset reload boots the machine
    // to its HOME_SCENE_ID default — the "clear → home" intent, single-pathed.
    for (const key of [...STORE_KEYS, SCENE_MACHINE_PERSIST_KEY]) {
        localStorage.removeItem(key);
    }
};
