<template>
    <div class="p-2 w-full h-full">
        <div
            ref="trackEl"
            class="w-full h-12 relative"
            :style="{ touchAction: gate.isActive.value || !gate.isTouchDevice ? 'none' : 'pan-y' }"
        >
            <div ref="containerEl" class="w-full h-full relative" style="container-type: inline-size">
                <div
                    class="absolute top-1/2 left-[1.5rem] w-[calc(100%-3rem)] h-1 -translate-y-1/2 rounded-full bg-accent-red/20 pointer-events-none"
                ></div>

                <div
                    ref="ball"
                    :class="[
                        'absolute z-30 rounded-full h-12 w-12 bg-accent-red text-accent-red-foreground shadow-md will-change-transform touch-gate-target',
                        isDragging ? 'cursor-grabbing' : 'cursor-grab',
                        gate.isActive.value ? 'touch-gate-active' : '',
                    ]"
                    @pointerdown="gatedPointerDown"
                    @touchmove="gate.handleScrollCheck"
                    @touchend="gate.handleTouchEnd"
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
import { onMounted, useTemplateRef } from "vue";
import type { Animation } from "@src/animation/index";
import { useRafLoop } from "@composables/useRafLoop";
import { useDragCapture } from "@composables/useDragCapture";
import { useTouchGate } from "@composables/useTouchGate";

const props = defineProps<{
    animation: Animation<any>;
}>();

const emit = defineEmits<{
    (e: "scrub", t: number): void;
    (e: "dragStart"): void;
    (e: "dragEnd"): void;
}>();

const ballEl = useTemplateRef<HTMLElement>('ball');
const trackEl = useTemplateRef<HTMLElement>("trackEl");
const containerEl = useTemplateRef<HTMLElement>("containerEl");

const gate = useTouchGate();

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

const { isDragging, onPointerDown } = useDragCapture({
    onStart: (e) => {
        const ball = ballEl.value;
        if (!ball) return;
        const ballRect = ball.getBoundingClientRect();
        grabOffset = e.clientX - (ballRect.left + ballRect.width / 2);
        gate.suppressDeactivate(true);
        emit("dragStart");
        applyProgress(progressFromPointerX(e.clientX));
    },
    onMove: (e) => {
        applyProgress(progressFromPointerX(e.clientX));
    },
    onEnd: () => {
        grabOffset = 0;
        gate.suppressDeactivate(false);
        emit("dragEnd");
    },
});

/** Gate pointer-down through touch gate on mobile. */
const gatedPointerDown = (e: PointerEvent) => {
    const ball = ballEl.value;
    if (!ball) return;
    if (!gate.handleTouchStart(ball, e.clientY)) return;
    onPointerDown(e);
};

const { start: startSync } = useRafLoop(() => {
    const anim = props.animation;
    if (!isDragging.value && anim.options.duration > 0) {
        const progress = Math.max(
            0,
            Math.min(anim.effectiveT / anim.options.duration, 1),
        );
        setBallProgress(progress);
    }
});

onMounted(startSync);
</script>
