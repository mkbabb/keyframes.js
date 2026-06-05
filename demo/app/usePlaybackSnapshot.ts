import type { ShallowRef } from "vue";
import type { AnimationGroup } from "@src/animation/group";
import {
    saveScenePlaybackState,
    type ScenePlaybackState,
} from "@components/custom/animation-controls/stores";

/**
 * The per-scene playback codec — snapshots an `AnimationGroup`'s playing state
 * before a scene switch and re-seats a fresh group from a saved snapshot on the
 * way back in. Pure engine choreography (no routing, no DOM, no template): it
 * reads only the current super-key + group and the scenePlayback store.
 *
 * Parameterized by the app-entry's reactive accessors so the codec lives in one
 * colocated home (beside `useSceneRouter`/`useSceneUrl`) and stays
 * independently testable — App.vue calls these from `switchScene` + the
 * `sceneRef` watcher exactly as before.
 */
export function usePlaybackSnapshot(
    currentSuperKey: ShallowRef<string>,
    currentAnimationGroup: ShallowRef<AnimationGroup<any>>,
) {
    /** Snapshot the current scene's animation playback state before leaving. */
    function saveCurrentPlaybackState() {
        const key = currentSuperKey.value;
        const group = currentAnimationGroup.value;
        if (!key || key.startsWith("__") || !group.started) return;

        const animations: Record<string, { t: number; reversed: boolean; iteration: number }> = {};
        for (const [name, { animation }] of Object.entries(group.animations)) {
            animations[name] = {
                t: animation.t,
                reversed: animation.reversed,
                iteration: animation.iteration,
            };
        }
        saveScenePlaybackState(key, {
            playing: group.playing(),
            started: group.started,
            animations,
        });
    }

    /**
     * Restore a saved playback state onto a fresh AnimationGroup.
     * Sets each animation to the saved T value (with correct direction),
     * renders the frame, and resumes playing if it was playing before.
     */
    function restoreGroupPlaybackState(group: AnimationGroup<any>, savedState: ScenePlaybackState) {
        const now = performance.now();

        group.started = true;
        group.lastTickTime = now;

        for (const [name, groupObject] of Object.entries(group.animations)) {
            const snap = savedState.animations[name];
            if (!snap) continue;

            const anim = groupObject.animation;

            anim.managed = true;
            anim.started = true;
            anim.reversed = snap.reversed;
            anim.iteration = snap.iteration;
            anim.startTime = now - snap.t;
            anim.t = snap.t;
            anim.paused = true;
            anim.pausedTime = now;

            // Interpolate frames at the saved T to populate values
            const vars = anim.interpFrames(snap.t, false);
            Object.assign(groupObject.values, vars);
        }

        // Render the restored frame
        group.paused = true;
        group.transformFramesGrouped(now);

        if (savedState.playing) {
            // Resume from the restored paused state: unpauses children and
            // restarts the rAF draw loop.
            group.resume();
        }
    }

    return { saveCurrentPlaybackState, restoreGroupPlaybackState };
}
