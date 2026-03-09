import { ref } from "vue";
import type { Ref } from "vue";
import type { AnimationGroup } from "@src/animation/group";
import { useRafLoop } from "@composables/useRafLoop";

export function useAnimationProgress(
    animationGroup: AnimationGroup<any>,
    isPlaying: Ref<boolean>,
) {
    const animationProgress = ref<Record<string, number>>({});

    useRafLoop(
        () => {
            const p: Record<string, number> = {};
            for (const [name, groupObj] of Object.entries(animationGroup.animations)) {
                const anim = groupObj.animation;
                const dur = anim.options.duration ?? 1000;
                p[name] = dur > 0 ? Math.min(1, Math.max(0, (anim.t ?? 0) / dur)) : 0;
            }
            animationProgress.value = p;
        },
        { guard: isPlaying },
    );

    return { animationProgress };
}
