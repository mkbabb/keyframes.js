import { ref, type Ref } from "vue";
import type { Animation } from "@src/animation/index";
import { useRafLoop } from "../../composables/useRafLoop";

/**
 * Syncs reactive refs to a markRaw animation's state via rAF polling.
 * Animation objects are markRaw so Vue can't track their internal changes.
 *
 * The loop runs unconditionally — three ref assignments per frame is negligible,
 * and gating on isPlaying/isStarted creates chicken-and-egg problems where
 * isStarted never flips because the loop that reads it isn't running.
 */
export function useAnimationSync(
    getAnimation: () => Animation<any>,
    isPlaying: Ref<boolean>,
) {
    const currentT = ref(getAnimation().effectiveT);
    const isStarted = ref(getAnimation().started);
    const isReversed = ref(getAnimation().reversed);

    const { start } = useRafLoop(() => {
        const animation = getAnimation();
        currentT.value = animation.effectiveT;
        isStarted.value = animation.started;
        isReversed.value = animation.reversed;
    });

    // Start immediately — no guard needed
    start();

    return { currentT, isPlaying, isStarted, isReversed };
}
