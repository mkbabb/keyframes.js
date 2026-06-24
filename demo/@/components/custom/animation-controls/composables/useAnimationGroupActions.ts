import type { AnimationGroup } from "@mkbabb/keyframes.js";
import type { KeyframesAnimation } from "@mkbabb/keyframes.js";
import type { AnimationLayerConfig } from "@mkbabb/keyframes.js";
import type { StoredAnimationGroupControlOptions } from "../stores";
import { resetAllStores } from "../stores";

export interface UseAnimationGroupActionsDeps {
    /** The active animation group (getter — the prop swaps on scene switch). */
    getGroup: () => AnimationGroup<any>;
    /** The shared per-group control store. */
    storedControls: StoredAnimationGroupControlOptions;
    /** Resolve the group object backing an Animation (from useAnimationGroupPlayback). */
    findAnimationGroupObject: (animation: KeyframesAnimation<any>) => any;
    /** Re-sync isPlaying/isStarted from the group (from useAnimationGroupPlayback). */
    syncPlayState: () => void;
}

export interface UseAnimationGroupActionsReturn {
    updateLayerConfig: (name: string, config: Partial<AnimationLayerConfig>) => void;
    keyframesUpdate: (e: { animation: KeyframesAnimation<any> }) => void;
    reset: () => void;
    clear: () => void;
}

/**
 * The group-mutation ACTION helpers (layer-config write, keyframes-edit
 * invalidation, reset, clear) for AnimationControlsGroup.vue, lifted out as a
 * colocated composable (the K.WZ proof:demo-no-oversize seam; zero behavior
 * change). The component still owns the playback/ref state; these are the thin
 * group writers it dispatches from template handlers + keyboard shortcuts.
 */
export function useAnimationGroupActions(
    deps: UseAnimationGroupActionsDeps,
): UseAnimationGroupActionsReturn {
    const { getGroup, storedControls, findAnimationGroupObject, syncPlayState } =
        deps;

    const updateLayerConfig = (
        name: string,
        config: Partial<AnimationLayerConfig>,
    ) => {
        getGroup().setLayerConfig(name, config);
    };

    const keyframesUpdate = (e: { animation: KeyframesAnimation<any> }) => {
        const groupObject = findAnimationGroupObject(e.animation);
        if (groupObject != null) {
            groupObject.values = {};
        }
    };

    const reset = () => {
        getGroup().stop();
        syncPlayState();
    };

    const clear = () => {
        getGroup().stop();
        syncPlayState();
        storedControls.selectedAnimation = null;
        // resetAllStores() now also wipes the scene-machine persist key, so the
        // active-scene fact resets to HOME_SCENE_ID on reload. The old raw
        // `localStorage.setItem("keyframes-js-active-scene", "home")` write is
        // DELETED — the machine owns that fact (H.W1); the legacy key is read by
        // nobody.
        resetAllStores();
        window.location.reload();
    };

    return { updateLayerConfig, keyframesUpdate, reset, clear };
}
