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
// Colocated playback-button skin (uncaged from utils.css, D.W2.S2). Non-scoped
// global rules — the .btn-playback* classes land on reka-ui's <Button> DOM
// shared across this ribbon and the scene play buttons.
import "./playback-button.css";

import type { Animation } from "@src/animation/engine";

import { useEventListener } from "@vueuse/core";
import { Button, Slider, useTouchGate } from "@mkbabb/glass-ui";
import { IconTooltip } from "@mkbabb/glass-ui/icon-tooltip";
import { ArrowLeftRight, Pause, Play } from "@lucide/vue";
import AnimationVisualizer from "./AnimationVisualizer.vue";

const { animation } = defineProps<{
    animation: Animation<any>;
    currentT: number;
    isAnimPlaying: boolean;
    isAnimStarted: boolean;
    userReversed: boolean;
}>();

const emit = defineEmits<{
    (e: "scrubStart"): void;
    (e: "scrubEnd"): void;
    // Wake-only: fires on EVERY scrub (pointer, keyboard, or visualizer) so a
    // settled sync loop re-arms even on a keyboard-arrow nudge.
    (e: "scrubbed"): void;
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

const onSliderUp = () => {
    if (sliderScrubActive) {
        sliderScrubActive = false;
        emit("scrubEnd");
    }
};

// One honest cleanup path: vueuse owns the window pointerup lifecycle (auto-
// cleanup on scope dispose). The listener stays registered and the
// `sliderScrubActive` guard makes it a no-op unless a scrub is in flight — the
// idiomatic vueuse form, with no once:true crutch and no manual
// removeEventListener double-bookkeeping.
useEventListener(window, "pointerup", onSliderUp);

const onSliderDown = () => {
    sliderScrubActive = true;
    emit("scrubStart");
};

const onSliderCommit = () => {
    if (sliderScrubActive) {
        sliderScrubActive = false;
        emit("scrubEnd");
    }
};

const scrubTo = (effectiveT: number) => {
    const rawT = animation.reversed
        ? animation.options.duration - effectiveT
        : effectiveT;

    // Playback is always group-owned now (H.W1): the scrub routes a
    // `sliderUpdate` through the group, which `setChildTime`s just this
    // animation. The old SOLO branch (poke `animation.t`/`interpFrames`
    // directly) is DELETED with the SOLO authority.
    emit("sliderUpdate", {
        t: rawT,
        animation,
    });

    // Re-arm any idled sync loop.
    emit("scrubbed");
};
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

