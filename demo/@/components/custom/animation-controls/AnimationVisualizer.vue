<template>
    <div class="p-2 w-full h-full">
        <div
            ref="trackEl"
            class="w-full h-12 p-0 m-0 left-0 top-0 relative cursor-grab active:cursor-grabbing"
            @pointerdown="onPointerDown"
        >
            <div class="w-full h-full relative container-inline-size">
                <div
                    ref="ballEl"
                    class="absolute z-30 rounded-full h-12 w-12 bg-accent-red text-accent-red-foreground shadow-md will-change-transform pointer-events-none"
                ></div>

                <div
                    class="absolute top-0 left-0 rounded-full z-10 h-full aspect-square bg-accent-red/30 shadow-sm pointer-events-none"
                ></div>

                <div
                    class="absolute top-0 translate-x-[calc(100cqw_-_100%)] rounded-full z-10 h-full aspect-square bg-accent-red/15 border-2 border-dashed border-accent-red/40 pointer-events-none"
                ></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, useTemplateRef } from "vue";
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
const trackEl = useTemplateRef<HTMLElement>("trackEl");

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
let isDragging = false;

const syncBallWithAnimation = () => {
    const anim = props.animation;
    if (!isDragging && anim.options.duration > 0) {
        const progress = Math.max(
            0,
            Math.min(anim.effectiveT / anim.options.duration, 1),
        );
        const ballT = progress * ballAnim.options.duration;
        ballAnim.interpFrames(ballT, true);
    }
    rafId = requestAnimationFrame(syncBallWithAnimation);
};

// --- Drag-to-scrub ---
const scrubFromPointer = (e: PointerEvent) => {
    const track = trackEl.value;
    const anim = props.animation;
    if (!track || !anim || anim.options.duration <= 0) return;

    const rect = track.getBoundingClientRect();
    const ball = ballEl.value;
    const ballW = ball ? ball.clientWidth : 48;
    const maxX = rect.width - ballW;
    const x = Math.max(0, Math.min(e.clientX - rect.left - ballW / 2, maxX));
    const progress = maxX > 0 ? x / maxX : 0;

    anim.t = progress * anim.options.duration;

    // Also update the ball position immediately during drag
    const ballT = progress * ballAnim.options.duration;
    ballAnim.interpFrames(ballT, true);
};

const onPointerDown = (e: PointerEvent) => {
    if (e.button !== 0) return;
    isDragging = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    scrubFromPointer(e);
};

useEventListener(trackEl, "pointermove", (e: PointerEvent) => {
    if (!isDragging) return;
    scrubFromPointer(e);
});

useEventListener(trackEl, "pointerup", () => {
    isDragging = false;
});

useEventListener(trackEl, "pointercancel", () => {
    isDragging = false;
});

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
