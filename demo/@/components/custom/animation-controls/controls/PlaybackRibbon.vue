<template>
    <div class="w-full grid gap-2">
        <IconTooltip :class="!isAnimStarted ? 'is-disabled' : ''" text="Scrub animation timeline">
            <div
                :class="['touch-gate-target timeline-green', gate.isActive.value ? 'touch-gate-active' : '']"
                @pointerdown.capture="gatedSliderDown"
                @touchmove="gate.handleScrollCheck"
                @touchend="gate.handleTouchEnd"
            >
                <Slider
                    ref="sliderRef"
                    variant="timeline"
                    class="p-2"
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
                class="btn-playback btn-playback-accent"
                variant="outline"
                @click="emit('togglePlay')"
            >
                <span>{{ isAnimPlaying ? 'Pause' : 'Play' }}</span>
                <Pause v-if="isAnimPlaying" class="icon-md" />
                <Play v-else class="icon-md pl-px" />
            </Button>
            <Button
                :class="[
                    'h-8 w-full rounded-full gap-2 text-body btn-interactive',
                    'aria-pressed:bg-primary/10 aria-pressed:border-primary/40',
                ]"
                :aria-pressed="userReversed"
                variant="outline"
                @click="emit('toggleReverse')"
            >
                <span>Reverse</span>
                <ArrowLeftRight
                    :class="[
                        'icon-lg transition-transform duration-fast',
                        userReversed ? 'scale-x-[-1]' : '',
                    ]"
                />
            </Button>
        </div>

        <AnimationVisualizer
            :class="['w-full', !isAnimStarted ? 'is-disabled' : '']"
            :animation="animation"
            :is-playing="isAnimPlaying"
            @scrub="scrubTo"
            @drag-start="emit('scrubStart')"
            @drag-end="emit('scrubEnd')"
        ></AnimationVisualizer>
    </div>
</template>

<script setup lang="ts">
import { onUnmounted } from "vue";
import type { Animation } from "@src/animation/engine";

import { Button, Slider, useTouchGate } from "@mkbabb/glass-ui";
import { IconTooltip } from "@mkbabb/glass-ui/icon-tooltip";
import { ArrowLeftRight, Pause, Play } from "@lucide/vue";
import AnimationVisualizer from "./AnimationVisualizer.vue";

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
/* Green-themed timeline slider using project color tokens */
.timeline-green {
    --slider-track-bg: color-mix(in srgb, var(--color-slider-track) 15%, transparent);
    --slider-range-bg: color-mix(in srgb, var(--color-slider-track) 40%, transparent);
    --slider-thumb-bg: var(--color-progress);
}
.timeline-green:hover {
    --slider-thumb-bg: color-mix(in srgb, var(--color-progress) 80%, transparent);
}
</style>

