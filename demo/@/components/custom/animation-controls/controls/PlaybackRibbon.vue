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
            <!-- G7 (H.W10.S2) — the Reverse cell matches the Play cell's HEIGHT.
                 The reka <Button> default applies `h-10` (40px) to the Play cell
                 (it out-specifies the unlayered `.btn-playback { height:2rem }`),
                 so the Reverse cell adopts the SAME `h-10` (was `h-8` = 32px) to
                 read equal-height beside Play — the user's "same width AND height"
                 ask, closed by the layout idiom (grid-cols-2 = equal width;
                 matched h-10 = equal height) for EVERY scene that mounts this
                 ribbon (cube/amiga/easing/spring), not a per-button magic number. -->
            <!-- K.W2 S3 — the transport band carries ONE voice. Reverse adopts the
                 SAME .btn-playback skin as Play/Pause (was an ad-hoc `text-body`
                 register), so both transport buttons resolve the SINGLE display
                 authority (--font-display) by construction — the dual-authority
                 silent split (Play=serif via --font-serif, Reverse=sans via
                 text-body) is dead. NOT a per-site font class: the existing
                 .btn-playback button skin is the shared transport register. -->
            <Button
                :class="[
                    'btn-playback h-10 w-full rounded-full gap-2 btn-interactive',
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

import { Button, Slider, useTouchGate } from "@mkbabb/glass-ui";
import { useDragCapture } from "./composables/useDragCapture";
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

// ── J.W2 S1 (W4-4) — the slider scrub rides the SHARED drag seam ─────────────
// The playhead scrub is a control-surface drag, so `useDragCapture` is its seam:
// it owns `setPointerCapture` + the global `body.is-dragging` select-suppression
// token for the gesture's whole flight (the same gesture-in-flight authority
// every other drag surface inherits — B6-a at TRUE zero). The former raw
// `useEventListener(window, "pointerup", …)` + the `sliderScrubActive` flag are
// DELETED with the migration: the composable owns the move/up/cancel lifecycle
// (vueuse inside it auto-cleans on scope dispose). The slider's VALUE projection
// stays where it lives — the reka `<Slider>`'s own `@update:model-value` →
// `scrubTo` (re-authoring its pointer→value geometry in an `onMove` body would
// duplicate the component's own math); the seam owns the GESTURE, the component
// owns the VALUE.
const { onPointerDown: onScrubPointerDown } = useDragCapture({
    onStart: () => emit("scrubStart"),
    onEnd: () => emit("scrubEnd"),
});

/** Capture-phase handler on the wrapper: gate touch interactions on mobile,
 *  then route the admitted gesture through the shared drag seam. */
const gatedSliderDown = (e: PointerEvent) => {
    const wrapper = (e.currentTarget as HTMLElement);
    if (!gate.handleTouchStart(wrapper, e.clientY)) {
        // Gate not active — prevent the slider from receiving the event
        e.stopPropagation();
        e.preventDefault();
        return;
    }
    onScrubPointerDown(e);
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

