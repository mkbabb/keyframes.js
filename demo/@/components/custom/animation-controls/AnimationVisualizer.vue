<template>
    <div class="p-2 w-full h-full">
        <div
            ref="trackEl"
            class="w-full h-12 p-0 m-0 left-0 top-0 relative"
            style="touch-action: none"
        >
            <div ref="containerEl" class="w-full h-full relative" style="container-type: inline-size">
                <div
                    ref="ballEl"
                    :class="[
                        'absolute z-30 rounded-full h-12 w-12 bg-accent-red text-accent-red-foreground shadow-md will-change-transform',
                        isDragging ? 'cursor-grabbing' : 'cursor-grab',
                    ]"
                    @pointerdown="onPointerDown"
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
import type { Animation } from "@src/animation/index";

const props = defineProps<{
    animation: Animation<any>;
}>();

const emit = defineEmits<{
    (e: "scrub", t: number): void;
    (e: "dragStart"): void;
    (e: "dragEnd"): void;
}>();

const ballEl = ref<HTMLElement | null>(null);
const trackEl = useTemplateRef<HTMLElement>("trackEl");
const containerEl = useTemplateRef<HTMLElement>("containerEl");
const isDragging = ref(false);

let rafId: number | null = null;
let grabOffset = 0;

/** Max translateX in pixels (container width − ball width). */
const getMaxX = () => {
    const container = containerEl.value;
    const ball = ballEl.value;
    if (!container || !ball) return 0;
    return container.clientWidth - ball.clientWidth;
};

/** Set ball position directly via transform — no animation timing curve. */
const setBallProgress = (progress: number) => {
    const ball = ballEl.value;
    if (!ball) return;
    const px = progress * getMaxX();
    ball.style.transform = `translateX(${px}px)`;
};

const progressFromPointerX = (clientX: number): number => {
    const track = trackEl.value;
    if (!track) return 0;
    const rect = track.getBoundingClientRect();
    const ballW = ballEl.value?.clientWidth ?? 48;
    const maxX = rect.width - ballW;
    if (maxX <= 0) return 0;
    const x = Math.max(0, Math.min(clientX - rect.left - ballW / 2 - grabOffset, maxX));
    return x / maxX;
};

const applyProgress = (progress: number) => {
    const anim = props.animation;
    if (!anim || anim.options.duration <= 0) return;

    setBallProgress(progress);

    const t = progress * anim.options.duration;
    emit("scrub", t);
};

const syncBallWithAnimation = () => {
    const anim = props.animation;
    if (!isDragging.value && anim.options.duration > 0) {
        const progress = Math.max(
            0,
            Math.min(anim.effectiveT / anim.options.duration, 1),
        );
        setBallProgress(progress);
    }
    rafId = requestAnimationFrame(syncBallWithAnimation);
};

const onPointerDown = (e: PointerEvent) => {
    if (e.button !== 0) return;

    const ball = ballEl.value;
    if (!ball) return;

    const ballRect = ball.getBoundingClientRect();
    const ballCenterX = ballRect.left + ballRect.width / 2;
    grabOffset = e.clientX - ballCenterX;

    isDragging.value = true;
    emit("dragStart");
    ball.setPointerCapture(e.pointerId);

    applyProgress(progressFromPointerX(e.clientX));
};

useEventListener(ballEl, "pointermove", (e: PointerEvent) => {
    if (!isDragging.value) return;
    applyProgress(progressFromPointerX(e.clientX));
});

useEventListener(ballEl, "pointerup", () => {
    if (!isDragging.value) return;
    isDragging.value = false;
    grabOffset = 0;
    emit("dragEnd");
});

useEventListener(ballEl, "pointercancel", () => {
    if (!isDragging.value) return;
    isDragging.value = false;
    grabOffset = 0;
    emit("dragEnd");
});

onMounted(() => {
    rafId = requestAnimationFrame(syncBallWithAnimation);
});

onUnmounted(() => {
    if (rafId !== null) {
        cancelAnimationFrame(rafId);
    }
});
</script>
