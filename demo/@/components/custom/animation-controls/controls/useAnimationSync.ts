import { ref, onMounted } from "vue";
import type { Animation } from "@src/animation/index";
import { useRafLoop } from "@composables/useRafLoop";

/**
 * Syncs reactive refs to a markRaw animation's state via rAF polling.
 * Animation objects are markRaw so Vue can't track their internal changes.
 *
 * Accepts a getter function so the composable always polls the *current*
 * animation instance — critical when the animation prop changes (e.g. scene switch).
 */
export function useAnimationSync(getAnimation: () => Animation<any>) {
    const currentT = ref(getAnimation().effectiveT);
    const isPlaying = ref(getAnimation().playing());
    const isStarted = ref(getAnimation().started);
    const isReversed = ref(getAnimation().reversed);

    const { start } = useRafLoop(() => {
        const animation = getAnimation();
        currentT.value = animation.effectiveT;
        isPlaying.value = animation.playing();
        isStarted.value = animation.started;
        isReversed.value = animation.reversed;
    });

    onMounted(start);

    return { currentT, isPlaying, isStarted, isReversed };
}
