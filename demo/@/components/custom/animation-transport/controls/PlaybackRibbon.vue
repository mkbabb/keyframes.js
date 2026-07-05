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

import type { KeyframesAnimation } from "@mkbabb/keyframes.js";

import { Button, Slider, useTouchGate } from "@mkbabb/glass-ui";
import { useDragCapture } from "./composables/useDragCapture";
import { IconTooltip } from "@mkbabb/glass-ui/icon-tooltip";
import { ArrowLeftRight, Pause, Play } from "@lucide/vue";
import AnimationVisualizer from "./AnimationVisualizer.vue";

const { animation } = defineProps<{
    animation: KeyframesAnimation<any>;
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
    (e: "sliderUpdate", val: { t: number; animation: KeyframesAnimation<any> }): void;
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
 *  then route the admitted gesture through the shared drag seam.
 *
 *  T.S2 (lane 27 F3) — the touch gate is a MOBILE scroll-vs-scrub disambiguator
 *  (`useTouchGate`): its first-tap-activates contract returns `false` on the
 *  first press whenever `"ontouchstart" in window` — which is TRUE in Chromium
 *  (desktop + Playwright) even for a MOUSE. Routing a mouse/pen press through it
 *  therefore SWALLOWED the shared drag seam's arming (`acquireSelectSuppression`
 *  → `body.is-dragging` never set), so a real desktop scrub highlighted the
 *  chrome it swept (proof:drag-gesture clause (a) RED on this one surface). A
 *  mouse/pen has no page-scroll ambiguity, so it bypasses the gate and arms the
 *  seam directly; only a genuine `touch` pointer consults the tap-to-activate
 *  gate (which glass-ui's Slider does NOT provide — it sets touch-action:none,
 *  hijacking scroll — so the wrapper stays, correctly scoped to touch). */
const gatedSliderDown = (e: PointerEvent) => {
    if (e.pointerType === "touch") {
        const wrapper = e.currentTarget as HTMLElement;
        if (!gate.handleTouchStart(wrapper, e.clientY)) {
            // First touch on a resting control — defer to page scroll; prevent
            // the slider from receiving the event until a deliberate re-tap.
            e.stopPropagation();
            e.preventDefault();
            return;
        }
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
/* ── The timeline scrub slider — the ONE motion-color authority (K.W4 S3/F4,
   re-voiced at T.D7/OD-6) ──
   The class name is retained (`.timeline-green` lands on the wrapper that sets
   the reka <Slider> CSS vars) but the hue is token-sourced: --color-progress
   now resolves the OD-6 violet authority and --color-slider-track a NEUTRAL
   border-derived groove at the token root (style.css T.D7), so the track +
   thumb paint the SAME violet the AnimationVisualizer's ball/dashed-twin
   draws — ONE motion-color identity, red returned to destructive-only
   (VERDICT #16). No per-component color class; the token repoint carries it.

   F4 — the track THICKER (the user's live verdict: "the timeline SCRUBBER track
   is too thin"). glass-ui 4.0.0's Slider sets --slider-track-height ON the
   `.glass-slider[data-size=md]` element itself (1.25rem ≈ 20px), which sits
   CLOSER to the `.slider-track` than this `.timeline-green` wrapper — so a var
   set on the wrapper is OVERRIDDEN by the size-default and never reaches the
   track (measured: wrapper sets .625rem, track still resolves the md 1.25rem).
   The cure sets the height on the slider element ITSELF via :deep, beating the
   `[data-size=md]` default's specificity (0,2,0 with the variant attr) so it
   actually lands: the scrub rail lifts to 1.5rem (24px) — clearly more
   substantial than the 20px md default the user called "too thin", a chunky
   scrubbable rail with the red range fill. The thumb keeps its variant size. */
.timeline-green {
    --slider-track-bg: color-mix(in srgb, var(--color-slider-track) 22%, transparent);
    --slider-range-bg: color-mix(in srgb, var(--color-slider-track) 45%, transparent);
    --slider-thumb-bg: var(--color-progress);
}
/* Set the track height on the slider element (where [data-size=md] declares it)
   so it wins the cascade and reaches `.slider-track`'s var(--slider-track-height)
   read — the wrapper-level var did not. */
.timeline-green :deep(.glass-slider[data-variant=timeline]) {
    --slider-track-height: 1.5rem;
}
.timeline-green:hover {
    --slider-thumb-bg: color-mix(in srgb, var(--color-progress) 80%, transparent);
}
</style>

