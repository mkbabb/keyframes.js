import { ref, onMounted } from "vue";
import type { Animation } from "@src/animation/index";
import { useRafLoop } from "@composables/useRafLoop";

/**
 * Syncs reactive refs to a markRaw animation's state via rAF polling.
 * Animation objects are markRaw so Vue can't track their internal changes.
 */
export function useAnimationSync(animation: Animation<any>) {
    const currentT = ref(animation.effectiveT);
    const isPlaying = ref(animation.playing());
    const isStarted = ref(animation.started);
    const isReversed = ref(animation.reversed);

    const { start } = useRafLoop(() => {
        currentT.value = animation.effectiveT;
        isPlaying.value = animation.playing();
        isStarted.value = animation.started;
        isReversed.value = animation.reversed;
    });

    onMounted(start);

    return { currentT, isPlaying, isStarted, isReversed };
}
