import { ref, type Ref } from "vue";
import type { Animation } from "@src/animation/index";
import { useRafLoop } from "@composables/useRafLoop";

/**
 * Syncs reactive refs to a markRaw animation's state via rAF polling.
 * Animation objects are markRaw so Vue can't track their internal changes.
 *
 * The `isPlaying` guard controls when the rAF loop runs:
 *  - When playing: polls every frame (tracks currentT for slider/visualizer)
 *  - When not playing: loop is stopped (zero CPU cost)
 *
 * The guard ref should come from the parent that owns the play/pause lifecycle
 * (e.g. useAnimationGroupPlayback), NOT from polling the animation object.
 *
 * Accepts a getter function so the composable always polls the *current*
 * animation instance — critical when the animation prop changes (e.g. scene switch).
 */
export function useAnimationSync(
    getAnimation: () => Animation<any>,
    isPlaying: Ref<boolean>,
) {
    const currentT = ref(getAnimation().effectiveT);
    const isStarted = ref(getAnimation().started);
    const isReversed = ref(getAnimation().reversed);

    useRafLoop(() => {
        const animation = getAnimation();
        currentT.value = animation.effectiveT;
        isStarted.value = animation.started;
        isReversed.value = animation.reversed;
    }, { guard: isPlaying });

    return { currentT, isPlaying, isStarted, isReversed };
}
