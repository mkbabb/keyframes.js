<template>
    <div class="p-2 w-full h-full">
        <div ref="trackEl" class="w-full h-12 p-0 m-0 left-0 top-0 relative">
            <div
                ref="ballEl"
                class="absolute z-30 rounded-full h-12 w-12 bg-accent-red text-accent-red-foreground shadow-md will-change-transform"
            ></div>

            <div
                class="absolute top-0 left-0 rounded-full z-10 h-full aspect-square bg-accent-red/30 shadow-sm"
            ></div>

            <div
                class="absolute top-0 right-0 rounded-full z-10 h-full aspect-square bg-accent-red/15 border-2 border-dashed border-accent-red/40"
            ></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import type { Animation } from "@src/animation/index";

const props = defineProps<{
    animation: Animation<any>;
}>();

const ballEl = ref<HTMLElement | null>(null);
const trackEl = ref<HTMLElement | null>(null);

let rafId: number | null = null;

const syncBallWithAnimation = () => {
    const anim = props.animation;
    if (anim.options.duration > 0 && ballEl.value && trackEl.value) {
        const progress = Math.max(
            0,
            Math.min(anim.effectiveT / anim.options.duration, 1),
        );
        const maxX = trackEl.value.clientWidth - ballEl.value.clientWidth;
        ballEl.value.style.transform = `translateX(${progress * maxX}px)`;
    }
    rafId = requestAnimationFrame(syncBallWithAnimation);
};

onMounted(() => {
    rafId = requestAnimationFrame(syncBallWithAnimation);
});

onUnmounted(() => {
    if (rafId !== null) {
        cancelAnimationFrame(rafId);
    }
});
</script>
