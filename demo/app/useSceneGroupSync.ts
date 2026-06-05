import { markRaw, nextTick, watch, type ComputedRef, type Ref, type ShallowRef } from "vue";
import { AnimationGroup } from "@src/animation/group";
import {
    getStoredAnimationGroupControlOptions,
    getScenePlaybackState,
    clearScenePlaybackState,
    type ScenePlaybackState,
} from "@components/custom/animation-controls/stores";

/**
 * Reconciles the active scene's `AnimationGroup` into App-level reactive state
 * across the ACG key-triggered remount cycle.
 *
 * The scene mounts inside `AnimationControlsGroup`; a superKey change remounts
 * ACG, which fires this watcher twice. The FIRST fire configures the controls
 * store BEFORE `currentSuperKey` updates (ACG reads it during setup); the SECOND
 * ("stable") fire — superKey already equal — is the group instance that sticks,
 * so the saved per-scene playback state is restored only then (targets are set,
 * so `interpFrames` can resolve computed CSS values).
 *
 * Extracted from App.vue (the VT-wrap fold, proof:decomposition) — App owns the
 * scene shell; this owns the group↔store reconcile.
 */
export function useSceneGroupSync(opts: {
    sceneRef: ShallowRef<any>;
    currentSuperKey: ShallowRef<string>;
    currentAnimationGroup: ShallowRef<AnimationGroup<any>>;
    isHome: ComputedRef<boolean>;
    autoPlayNext: Ref<boolean>;
    restoreGroupPlaybackState: (
        group: AnimationGroup<any>,
        state: ScenePlaybackState,
    ) => void;
}) {
    const {
        sceneRef,
        currentSuperKey,
        currentAnimationGroup,
        isHome,
        autoPlayNext,
        restoreGroupPlaybackState,
    } = opts;

    watch(
        () => sceneRef.value?.animationGroup,
        (group) => {
            if (!group) return;
            const superKey = sceneRef.value!.superKey;

            // Detect the "stable" fire: when superKey hasn't changed, this is
            // the second watcher fire after ACG's key-triggered remount cycle.
            // The scene has remounted inside the new ACG, targets are set,
            // and this group instance is the one that will stick around.
            const isStableFire = currentSuperKey.value === superKey;

            // Configure controls BEFORE updating superKey — the key change
            // remounts AnimationControlsGroup which reads these during setup.
            const controls = getStoredAnimationGroupControlOptions(superKey);
            if (isHome.value) {
                controls.isControlsPanelOpen = false;
            } else {
                // Pick the first animation when none is selected yet.
                if (!controls.selectedAnimation) {
                    const names = Object.keys(group.animations);
                    if (names.length > 0) controls.selectedAnimation = names[0]!;
                }
                // Controls panel is open by default whenever a non-home scene
                // mounts (e.g. page reload, direct deep link). User can close
                // it during a session; it reopens on the next scene mount.
                if (window.innerWidth >= 1024) {
                    controls.isControlsPanelOpen = true;
                }
            }

            currentSuperKey.value = superKey;
            currentAnimationGroup.value = markRaw(group);

            // Restore saved playback state on the stable (second) fire.
            // By this point the scene has mounted and set targets, so
            // interpFrames can resolve computed CSS values.
            if (isStableFire) {
                const savedState = getScenePlaybackState(superKey);
                if (savedState) {
                    restoreGroupPlaybackState(group, savedState);
                    clearScenePlaybackState(superKey);
                }
            }

            // Clear autoPlay flag after the scene has mounted and the
            // AnimationControlsGroup consumed it via the prop.
            if (autoPlayNext.value) {
                // Keep it true for this render cycle so AnimationControlsGroup
                // sees it during its mount. Clear on next tick.
                nextTick(() => { autoPlayNext.value = false; });
            }
        },
    );
}
