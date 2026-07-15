import { ref } from "vue";
import type { Ref } from "vue";
import type { AnimationGroup } from "@mkbabb/keyframes.js";
import type { TransportChannel } from "../transportSource";
import { useRafLoop } from "../composables/useRafLoop";
import { clamp } from "@mkbabb/value.js/math";

export function useAnimationProgress(
    getAnimationGroup: () => AnimationGroup<any>,
    isPlaying: Ref<boolean>,
    // T.B1-β STAGE 1 — the channel axis. When the active scene exposes facility
    // channels, per-channel progress reads the channel's OWN normalized
    // `progress()` (the uniform raf round-trip), never the group keys.
    getChannels: () => TransportChannel[] | undefined = () => undefined,
) {
    const animationProgress = ref<Record<string, number>>({});

    useRafLoop(
        () => {
            const p: Record<string, number> = {};
            const channels = getChannels();
            if (channels && channels.length > 0) {
                for (const ch of channels) {
                    p[ch.name] = clamp(ch.progress(), 0, 1);
                }
            } else {
                const animationGroup = getAnimationGroup();
                for (const [name, groupObj] of Object.entries(
                    animationGroup.animations,
                )) {
                    const anim = groupObj.animation;
                    const dur = anim.options.duration ?? 1000;
                    p[name] =
                        dur > 0
                            ? clamp((anim.t ?? 0) / dur, 0, 1)
                            : 0;
                }
            }
            animationProgress.value = p;
        },
        { guard: isPlaying },
    );

    return { animationProgress };
}
