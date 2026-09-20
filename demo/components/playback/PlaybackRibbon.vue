<template>
    <div class="w-full grid gap-2">
        <!-- D-5 — the one instructional string reaches the thumb through the
             producer's aria-describedby forward (below); the hover Tooltip on
             this wrapper is the sighted convenience, no longer the only route.
             D-6 — disabled is the Slider's own `disabled` (tabindex removal +
             `[data-disabled]`), not an `.is-disabled` costume that left the thumb
             focusable, arrow-operable and un-announced — and whose
             `pointer-events: none` made this very hint unreachable (M-6).
             L-M1 — the wrapper touch gate is DELETED: glass-ui 7.0.0's Slider
             owns its own `useTouchGate` on the slider root (same composable,
             same first-tap contract, `data-touch-active` painted), so the demo
             ran two gates. S-3's reasoning survives the deletion as the
             seam's law: the drag seam arms for every primary pointer at
             capture — a mouse/pen has no page-scroll ambiguity, and a touch's
             first press is the PRODUCER's gate to accept or reject on its own
             element; the seam never second-guesses it. -->
        <Tooltip>
            <TooltipTrigger as-child>
                <div class="timeline-green" @pointerdown.capture="onScrubPointerDown">
                    <!-- D-1 / C-3 / C-4 — cured ON the Slider (PR-CAUTION): the
                         accessible name rides the producer's aria-label forward
                         to the thumb; the arrow step is duration-relative (1 %
                         per press, ×10 on Page/Shift via reka), never reka's
                         1 ms default over a millisecond rail; and the producer's
                         keyboard-inclusive `valueCommit` pairs a keyboard scrub
                         with the pause/resume lifecycle the pointer seam already
                         owns. -->
                    <Slider
                        ref="sliderRef"
                        class="p-2"
                        aria-label="Scrub animation timeline"
                        :min="0"
                        :max="effectiveDuration"
                        :step="scrubStep"
                        :disabled="!isAnimStarted"
                        :aria-describedby="scrubHintId"
                        :model-value="[currentT]"
                        @update:model-value="onSliderInput"
                        @value-commit="onSliderCommit"
                    />
                    <span :id="scrubHintId" class="sr-only">
                        Drag, or use the arrow keys, to scrub the animation timeline.
                    </span>
                </div>
            </TooltipTrigger>
            <TooltipContent>Scrub animation timeline</TooltipContent>
        </Tooltip>

        <div class="grid grid-cols-2 gap-2 w-full">
            <Button
                class="btn-playback btn-playback-accent"
                emphasis="secondary"
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
            <!-- D-15 / D-8 / N-1 — ONE pressed authority: the skin's
                 `.btn-playback[aria-pressed="true"]` rule (playback-idiom.css).
                 The template utilities that argued with it were dead by
                 layering and are gone. -->
            <Button
                class="btn-playback h-10 w-full rounded-full gap-2"
                :aria-pressed="userReversed"
                emphasis="secondary"
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
            v-if="animation"
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

import { computed, useId } from "vue";
import type { KeyframesAnimation } from "@mkbabb/keyframes.js";

import { Button, Slider } from "@mkbabb/glass-ui";
import { useDragCapture } from "@components/instrument/transport/composables/useDragCapture";
import { Tooltip, TooltipContent, TooltipTrigger } from "@mkbabb/glass-ui/tooltip";
import { ArrowLeftRight, Pause, Play } from "@lucide/vue";
import AnimationVisualizer from "./AnimationVisualizer.vue";

/**
 * THE TIME-SPACE CONTRACT (X.KF.W13.b · C-2, one declaration for the ribbon).
 * Every time this ribbon RECEIVES or DISPLAYS is EFFECTIVE time — milliseconds
 * along the direction of travel, `0` at the start the user sees and `duration`
 * at the end, in every direction (the engine's `effectiveT`: `duration − t`
 * under Reverse, `t` otherwise). The channel mount (`useAnimationSync` →
 * `currentT`) is the convention pin. The one value this ribbon EMITS in RAW
 * engine time is `sliderUpdate.t` — `scrubTo` performs the inversion exactly
 * once, over the SAME duration read the rail is scaled by. A mount that feeds
 * raw `t` into `currentT` paints the ball and the thumb mirrored under Reverse.
 */
type EffectiveMs = number;

const { animation, source, duration } = defineProps<{
    // T.B1-β STAGE 1 — the ribbon is CHANNEL-capable: its time source is EITHER
    // the selected channel's painting `animation` (the engine-clocked path —
    // scrubs emit `sliderUpdate`, the visualizer twin mounts) OR a progress-
    // scalar `source` (`progress()`/`setProgress()` — a light channel; scrubs
    // seat the scalar directly, no visualizer twin). At least one is required.
    animation?: KeyframesAnimation<any>;
    source?: {
        progress(): number;
        setProgress(t: number): void;
        /** The scrub scale (ms). Defaults to 1 (a normalized [0,1] rail). */
        duration?: number;
    };
    /**
     * KF-CO-15 — the rail's scale, published REACTIVELY by the one writer of
     * the engine's duration (the options card). `animation.options` is
     * markRaw, so a read of `options.duration` here cannot track a
     * `setDuration`; without this the rail's `:max` freezes at mount.
     */
    duration?: number;
    /** Effective ms (see the contract above). */
    currentT: EffectiveMs;
    isAnimPlaying: boolean;
    isAnimStarted: boolean;
    userReversed: boolean;
}>();

/** THE ONE DURATION READ (L-m9) — the rail's `:max`, the arrow `:step` and the
 *  Reverse inversion all scale by this single value: the published reactive
 *  scale when the writer supplies it, else the animation clock, else the
 *  source's declared duration (1 ⇒ a normalized [0,1] rail). One read, one
 *  guard: a non-positive scale is a rail of length 1. */
const effectiveDuration = computed(() => {
    const dur = duration ?? animation?.options.duration ?? source?.duration ?? 1;
    return dur > 0 ? dur : 1;
});

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
const { isDragging, onPointerDown: onScrubPointerDown } = useDragCapture({
    onStart: () => emit("scrubStart"),
    onEnd: () => emit("scrubEnd"),
});

/** D-5 — the id the sr-only hint carries, forwarded to the thumb by the producer. */
const scrubHintId = useId();

/** C-4 — one arrow press moves 1 % of the rail; reka multiplies Page/Shift ×10. */
const scrubStep = computed(() => effectiveDuration.value / 100);

/** ONE SEAT PER GESTURE. The Slider's live value is seated only while a POINTER
 *  gesture is in flight — the drag seam has already bracketed it (`scrubStart`
 *  at press, `scrubEnd` at release). Typed as the producer declares it,
 *  `number[] | undefined`, with the one guard (L-m5). */
const onSliderInput = (val: number[] | undefined) => {
    if (!isDragging.value) return;
    const t = val?.[0];
    if (t !== undefined) scrubTo(t);
};

/** C-3 — the producer's keyboard-inclusive `valueCommit`. A KEYBOARD step has
 *  no seam and was seated bare — overwritten within a frame during playback. It
 *  is now bracketed the same way the pointer is: pause, seat the committed
 *  value, resume. A pointer gesture's commit is the seam's business and is
 *  skipped here (reka emits the commit before the release the seam ends on). */
const onSliderCommit = (val: number[]) => {
    if (isDragging.value) return;
    const t = val[0];
    if (t === undefined) return;
    emit("scrubStart");
    scrubTo(t);
    emit("scrubEnd");
};


/** Seat the playhead at an EFFECTIVE time (the contract above). */
const scrubTo = (effectiveT: EffectiveMs) => {
    const dur = effectiveDuration.value;
    if (animation) {
        // The one inversion, over the one duration read: raw engine time for
        // the group seam (playback is group-owned — H.W1). A stale rail could
        // once emit a NEGATIVE raw t here (the signed seek); the rail and this
        // pivot now share one scale by construction.
        const rawT = animation.reversed ? dur - effectiveT : effectiveT;
        emit("sliderUpdate", { t: rawT, animation });
    } else if (source) {
        // The progress-scalar path (a light channel): seat the normalized
        // playhead through the channel's own round-trip.
        source.setProgress(effectiveT / dur);
    }

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
   `[data-size=md]` default's specificity while staying scoped to the standard
   recipe, so it
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
.timeline-green :deep(.glass-slider[data-variant="standard"]) {
    --slider-track-height: 1.5rem;
}
.timeline-green:hover {
    --slider-thumb-bg: color-mix(in srgb, var(--color-progress) 80%, transparent);
}
</style>
