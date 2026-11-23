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
    getAuthoredAnimationOptions,
    createAnimationUUId,
} from "./animationOptionsStore";

export {
    type CubeSkin,
    type MatrixOptions,
    type StoredAnimationGroupControlOptions,
    type StoredAnimationGroupsControlOptions,
    useAnimationGroupsControlOptionsStore,
    getStoredAnimationGroupControlOptions,
    controlsOpenAtRest,
    markSheetPress,
} from "./controlOptionsStore";

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
export { useSceneMachine } from "./useSceneMachine";

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
    channelFacetsOf,
    extraTabsFrom,
    selectedSurfaceFrom,
} from "./controlSurfaces";

// X.KF.W13X.esc1 (ESC-mobile-1) — the per-channel control state the ONE pane
// host reads back on every mount (drill-in pane, warm flag, editor buffer).
export {
    type ChannelPane,
    type ChannelControlsState,
    getChannelControlsState,
} from "./channelControlsStore";

export {
    type RafSceneHandle,
    createGroupAdapter,
    createRafAdapter,
    restoreGroupPlaybackState,
    walkGroupClock,
    EASE_IN_MS,
    EASE_OUT_MS,
} from "./scenePlaybackAdapters";

export { getAnimationSuperKey } from "./storeUtils";

import { _resetAnimationGroupsOptionsStore } from "./animationOptionsStore";
import { _resetAnimationGroupsControlOptionsStore } from "./controlOptionsStore";

/**
 * Clear the view: every channel's options and every scene's view state go back
 * to their defaults, and the address drops the scene's keys (the address is
 * the page, FORTY-SIXTH E), so a reload after it opens the scene bare. Nothing
 * of the view is in browser storage; the theme, a viewer's preference, stays.
 */
export const resetAllStores = () => {
    _resetAnimationGroupsOptionsStore();
    _resetAnimationGroupsControlOptionsStore();
    const hash = location.hash;
    const q = hash.indexOf("?");
    if (q >= 0) history.replaceState(history.state, "", `${location.pathname}${location.search}${hash.slice(0, q)}`);
};
