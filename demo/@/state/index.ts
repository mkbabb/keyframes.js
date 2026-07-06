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
    type ControlSurfaceTab,
    BUILT_IN_SURFACES,
    CONTROL_SURFACES,
    CONDITIONAL_SURFACES,
    SURFACE_META,
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
import { STORE_KEYS } from "./storeUtils";
import { SCENE_MACHINE_PERSIST_KEY } from "./useSceneMachine";

// S.D2 / a24 F2 — the app-level reset composer (dependency inversion). The state
// barrel used to reach SIDEWAYS into a UI/feature component — a state layer owning
// a control-surface component's internals (altitude inversion). It now owns only a
// HOOK REGISTRY: feature stores that live outside the state peer register their own
// reset here, and the app assembles the full reset by importing those features, so
// the edge points the correct way (feature → @state) and the state peer imports no
// component. (T.E1 — the compose scene's asset store, the last such consumer, was
// PRUNED under OD-1; the registry seam is retained as the general contract.)
const externalResetHooks = new Set<() => void>();

/** Register an external store's reset with the app-level `resetAllStores`
 *  composer (a24 F2). Returns an unregister fn. Called by feature stores that
 *  live outside `@/state/`. */
export const registerStoreReset = (reset: () => void): (() => void) => {
    externalResetHooks.add(reset);
    return () => externalResetHooks.delete(reset);
};

export const resetAllStores = () => {
    _resetAnimationGroupsOptionsStore();
    _resetAnimationGroupsControlOptionsStore();
    for (const reset of externalResetHooks) reset();

    // The scene+playback machine persists the active-scene fact + per-scene
    // snapshots (H.W1 — replacing the deleted raw `keyframes-js-active-scene`
    // localStorage write). Wiping it here means a reset reload boots the machine
    // to its HOME_SCENE_ID default — the "clear → home" intent, single-pathed.
    for (const key of [...STORE_KEYS, SCENE_MACHINE_PERSIST_KEY]) {
        localStorage.removeItem(key);
    }
};
