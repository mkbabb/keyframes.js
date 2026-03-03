<template>
    <div class="p-2 w-full h-full">
        <div class="w-full h-12 p-0 m-0 left-0 top-0 relative">
            <div class="w-full h-full relative container-inline-size">
                <div
                    ref="ballEl"
                    class="absolute z-30 rounded-full h-12 w-12 bg-accent-red text-accent-red-foreground shadow-md will-change-transform"
                ></div>

                <div
                    class="absolute top-0 left-0 rounded-full z-10 h-full aspect-square bg-accent-red/30 shadow-sm"
                ></div>

                <div
                    class="absolute top-0 translate-x-[calc(100cqw_-_100%)] rounded-full z-10 h-full aspect-square bg-accent-red/15 border-2 border-dashed border-accent-red/40"
                ></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useEventListener } from "@vueuse/core";

import { getComputedValue } from "@src/units/normalize";
import { CSSKeyframesAnimation } from "@src/animation";
import type { Animation } from "@src/animation/index";

useEventListener(window, "resize", () => {
    getComputedValue.cache.clear();
});

const props = defineProps<{
    animation: Animation<any>;
}>();

const ballEl = ref<HTMLElement | null>(null);

const ballAnim = new CSSKeyframesAnimation().fromString(/*css*/ `
@keyframes ball {
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(calc(100cqw - 100%));
    }
}
`);

let rafId: number | null = null;

const syncBallWithAnimation = () => {
    const anim = props.animation;
    if (anim.options.duration > 0) {
        const progress = Math.max(
            0,
            Math.min(anim.effectiveT / anim.options.duration, 1),
        );
        const ballT = progress * ballAnim.options.duration;
        ballAnim.interpFrames(ballT, true);
    }
    rafId = requestAnimationFrame(syncBallWithAnimation);
};

onMounted(() => {
    ballAnim.setOptions({
        duration: 1000,
    });
    ballAnim.setTargets(ballEl.value!);
    ballAnim.started = true;

    rafId = requestAnimationFrame(syncBallWithAnimation);
});

onUnmounted(() => {
    if (rafId !== null) {
        cancelAnimationFrame(rafId);
    }
    ballAnim.stop();
});
</script>

<style scoped>
.container-inline-size {
    container-type: inline-size;
}
</style>
