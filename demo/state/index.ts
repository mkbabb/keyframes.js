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

// The control-surface DERIVATION (H.W11.S4 / I2 — the third orthogonal axis;
// INVERTED at T.B2 from a table into a facility derivation). The pure
// `surfacesFor` derivation + surface-set selectors; the reactive
// `controlSurfaces` projection is on useSceneMachine (the effect layer above).
export {
    type ControlSurface,
    type ControlSurfaceTab,
    type SurfaceFacilityLike,
    type SurfaceChannelLike,
    BUILT_IN_SURFACES,
    SURFACE_META,
    surfacesFor,
    extraTabsFrom,
    selectedSurfaceFrom,
} from "./controlSurfaceDFA";

export {
    type RafSceneHandle,
    createGroupAdapter,
    createRafAdapter,
    restoreGroupPlaybackState,
} from "./scenePlaybackAdapters";

export { getAnimationSuperKey, STORE_KEYS } from "./storeUtils";

import {
    _resetAnimationGroupsOptionsStore,
    _gcAndMigrateAnimationGroupsOptionsStore,
} from "./animationOptionsStore";
import {
    _resetAnimationGroupsControlOptionsStore,
    _gcAndMigrateAnimationGroupsControlOptionsStore,
} from "./controlOptionsStore";
import { STORE_KEYS } from "./storeUtils";
import { SCENE_MACHINE_PERSIST_KEY, useSceneMachine } from "./useSceneMachine";
import type { SceneId } from "./sceneMachine";

export { gcAndMigrateStoreBuckets } from "./storeUtils";

/**
 * T.B9 — the ONE gc/migrate sweep over ALL THREE per-scene tables (the scene
 * machine's `perScene` snapshot map + both option stores). Replaces the lone
 * `machine.gcOrphans` boot call: one valid-id set, three tables migrated to the
 * registry `SceneId` keyspace + pruned of orphans in lockstep, so no table can
 * drift its keyspace from the others (the machine keyed by `SceneId` while the
 * option stores kept a divergent PascalCase — the very drift this closes). The
 * option stores additionally MIGRATE a legacy case-variant bucket ("Cube" →
 * "cube") so a returning user's state is not orphaned by the collapse.
 */
export const gcAndMigrateSceneKeyspace = (validSceneIds: Iterable<SceneId>) => {
    const ids = [...validSceneIds];
    useSceneMachine().gcOrphans(ids);
    _gcAndMigrateAnimationGroupsOptionsStore(ids);
    _gcAndMigrateAnimationGroupsControlOptionsStore(ids);
};

export const resetAllStores = () => {
    _resetAnimationGroupsOptionsStore();
    _resetAnimationGroupsControlOptionsStore();

    // The scene+playback machine persists the active-scene fact + per-scene
    // snapshots (H.W1 — replacing the deleted raw `keyframes-js-active-scene`
    // localStorage write). Wiping it here means a reset reload boots the machine
    // to its HOME_SCENE_ID default — the "clear → home" intent, single-pathed.
    for (const key of [...STORE_KEYS, SCENE_MACHINE_PERSIST_KEY]) {
        localStorage.removeItem(key);
    }
};
