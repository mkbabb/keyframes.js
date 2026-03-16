<template>
    <div class="w-full grid gap-2">
        <IconTooltip :class="!isAnimStarted ? 'disabled' : ''" text="Scrub animation timeline">
            <div
                :class="['touch-gate-target', gate.isActive.value ? 'touch-gate-active' : '']"
                @pointerdown.capture="gatedSliderDown"
                @touchmove="gate.handleScrollCheck"
                @touchend="gate.handleTouchEnd"
            >
                <Slider
                    ref="sliderRef"
                    class="p-2 timeline-slider"
                    :min="0"
                    :max="animation.options.duration"
                    :model-value="[currentT]"
                    @update:model-value="(val: any) => scrubTo(val[0])"
                    @pointerdown="onSliderDown"
                    @value-commit="onSliderCommit"
                />
            </div>
        </IconTooltip>

        <div class="grid grid-cols-2 gap-2 w-full">
            <Button
                :class="[
                    'h-8 w-full rounded-lg gap-2 instrument-serif text-base cursor-pointer hover:scale-105 active:scale-95 transition-transform',
                    isGrouped && !isAnimStarted
                        ? 'bg-accent-red/30 text-accent-red border-accent-red/40 hover:bg-accent-red/50 hover:text-accent-red'
                        : '',
                ]"
                variant="outline"
                @click="emit('togglePlay')"
            >
                <span>{{ isAnimPlaying ? 'Pause' : 'Play' }}</span>
                <font-awesome-icon
                    :class="['icon w-4 h-4', !isAnimPlaying ? 'pl-px' : '']"
                    :icon="
                        isAnimPlaying
                            ? ['fas', 'pause']
                            : ['fas', 'play']
                    "
                />
            </Button>
            <Button
                :class="[
                    'h-8 w-full rounded-lg gap-2 instrument-serif text-base cursor-pointer hover:scale-105 active:scale-95 transition-transform',
                    userReversed
                        ? 'bg-primary/10 border-primary/40'
                        : '',
                ]"
                variant="outline"
                @click="emit('toggleReverse')"
            >
                <span>Reverse</span>
                <ArrowLeftRight
                    :class="[
                        'w-5 h-5 transition-transform duration-200',
                        userReversed ? 'scale-x-[-1]' : '',
                    ]"
                />
            </Button>
        </div>

        <AnimationVisualizer
            :class="['w-full', !isAnimStarted ? 'disabled' : '']"
            :animation="animation"
            @scrub="scrubTo"
            @drag-start="emit('scrubStart')"
            @drag-end="emit('scrubEnd')"
        ></AnimationVisualizer>
    </div>
</template>

<script setup lang="ts">
import { onUnmounted } from "vue";
import type { Animation } from "@src/animation/index";

import { Button } from "@components/ui/button";
import { Slider } from "@components/ui/slider";
import { ArrowLeftRight } from "lucide-vue-next";
import IconTooltip from "@components/custom/IconTooltip.vue";
import AnimationVisualizer from "./AnimationVisualizer.vue";
import { useTouchGate } from "@composables/useTouchGate";

const { animation, isGrouped } = defineProps<{
    animation: Animation<any>;
    currentT: number;
    isAnimPlaying: boolean;
    isAnimStarted: boolean;
    isGrouped?: boolean;
    userReversed: boolean;
}>();

const emit = defineEmits<{
    (e: "scrubStart"): void;
    (e: "scrubEnd"): void;
    (e: "sliderUpdate", val: { t: number; animation: Animation<any> }): void;
    (e: "togglePlay"): void;
    (e: "toggleReverse"): void;
}>();

const gate = useTouchGate();

let sliderScrubActive = false;

/** Capture-phase handler on the wrapper: gate touch interactions on mobile. */
const gatedSliderDown = (e: PointerEvent) => {
    const wrapper = (e.currentTarget as HTMLElement);
    if (!gate.handleTouchStart(wrapper, e.clientY)) {
        // Gate not active — prevent the slider from receiving the event
        e.stopPropagation();
        e.preventDefault();
    }
};

const onSliderDown = () => {
    sliderScrubActive = true;
    emit("scrubStart");
    window.addEventListener("pointerup", onSliderUp, { once: true });
};

const onSliderUp = () => {
    if (sliderScrubActive) {
        sliderScrubActive = false;
        emit("scrubEnd");
    }
};

const onSliderCommit = () => {
    if (sliderScrubActive) {
        sliderScrubActive = false;
        window.removeEventListener("pointerup", onSliderUp);
        emit("scrubEnd");
    }
};

const scrubTo = (effectiveT: number) => {
    const rawT = animation.reversed
        ? animation.options.duration - effectiveT
        : effectiveT;

    if (!isGrouped) {
        const paused = animation.paused;
        animation.paused = false;
        animation.t = rawT;
        animation.interpFrames(effectiveT, true);
        animation.paused = paused;
    } else {
        emit("sliderUpdate", {
            t: rawT,
            animation,
        });
    }
};

onUnmounted(() => {
    window.removeEventListener("pointerup", onSliderUp);
});
</script>

<style scoped>
/* Timeline slider: pastel green track */
.timeline-slider {
    --slider-track-color: hsl(142 40% 72%);
    --slider-border-color: hsl(142 40% 60%);
}
:global(.dark) .timeline-slider {
    --slider-track-color: hsl(142 30% 40%);
    --slider-border-color: hsl(142 30% 50%);
}
.timeline-slider :deep(.bg-primary) {
    background-color: var(--slider-track-color);
}
.timeline-slider :deep(.border-primary) {
    border-color: var(--slider-border-color);
}
</style>
