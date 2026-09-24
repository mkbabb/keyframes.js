<template>
    <div class="w-full grid gap-2">
        <!-- D-5 — the one instructional string reaches the thumb through the
             producer's aria-describedby forward (below); the hover Tooltip on
             this wrapper is the sighted convenience, no longer the only route.
             D-6 — the `.is-disabled` costume (focusable, arrow-operable,
             un-announced; its `pointer-events: none` hid this very hint, M-6)
             is gone. OA-29 (KF.W13U.t) — and so is the `disabled` that replaced
             it: it was derived from the animation's started flag, a lifecycle
             fact the scrub seat never needed (a never-started child is seated
             and painted by the group's `setChildTime(…).render()`), so the
             rail sat greyed and inert on every scene until Play. The timeline
             is live from boot: a paused or never-played scene scrubs.
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
                <div class="scrub-rail" @pointerdown.capture="onScrubPointerDown">
                    <!-- D-1 / C-3 / C-4 — cured ON the Slider (PR-CAUTION): the
                         accessible name rides the producer's aria-label forward
                         to the thumb; the arrow step is duration-relative (1 %
                         per press, ×10 on Page/Shift via reka), never reka's
                         1 ms default over a millisecond rail; and the producer's
                         keyboard-inclusive `valueCommit` pairs a keyboard scrub
                         with the pause/resume lifecycle the pointer seam already
                         owns. -->
                    <!-- D-2 / KFA-61 — a VISIBLE playhead, on the primitive's
                         own timeline recipe: `scrubber` (glass's continuous-
                         cylinder slider — the elapsed range IS the fill, its
                         leading edge IS the handle). `spectrum` is the colour-
                         picker recipe: a transparent range over a `--secondary`
                         groove and a hollow thumb, which read as a DISABLED rail
                         at rest, playing and scrubbing (the owner's "timeline is
                         always greyed out"). The paint stays the PRODUCER's (OA-8):
                         no local thumb/track/range overrides. -->
                    <Slider
                        class="p-2"
                        variant="scrubber"
                        aria-label="Scrub animation timeline"
                        :min="0"
                        :max="effectiveDuration"
                        :step="scrubStep"
                        :aria-describedby="scrubHintId"
                        :model-value="[railT]"
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
            <!-- Both cells wear the shared `.btn-playback` skin
                 (playback-idiom.css, via design-idioms.css) — one voice for the
                 transport band. Height: the producer Button's `min-block-size`
                 (40/60px by pointer) is the one live authority (D-16 — the
                 template `h-10` and the skin's `height: 2rem` were both dead
                 under it). Width: the grid track (N-6). Glyph size: the
                 producer's `--ui-glyph` rung, which the demo's `icon-*`
                 utilities silently defeated so Play's glyph stayed pinned while
                 the coarse-pointer button grew (D-17/N-4). `emphasis="secondary"`
                 is the Button's own default (N-6). -->
            <Button class="btn-playback btn-playback-accent" @click="emit('togglePlay')">
                <span>{{ isAnimPlaying ? 'Pause' : 'Play' }}</span>
                <Pause v-if="isAnimPlaying" />
                <Play v-else class="pl-px" />
            </Button>
            <!-- D-15 / D-8 / N-1 — ONE pressed authority: the skin's
                 `.btn-playback[aria-pressed="true"]` rule (playback-idiom.css).
                 The template utilities that argued with it were dead by
                 layering and are gone. -->
            <Button
                class="btn-playback rounded-full gap-2"
                :aria-pressed="userReversed"
                @click="emit('toggleReverse')"
            >
                <span>Reverse</span>
                <ArrowLeftRight
                    :class="[
                        'transition-transform duration-fast',
                        userReversed ? 'scale-x-[-1]' : '',
                    ]"
                />
            </Button>
        </div>

        <!-- OA-10 (§0ao.1) — the ball preview's inline hide toggle. Offered
             only where the mount binds `preview` (the mount owns the state
             and its persistence; an unbound ribbon keeps its preview).
             The producer Button in its pressed-toggle form (`aria-pressed`,
             the Reverse cell's idiom) with one stable name; pressed = hidden.
             Hidden is ABSENT (`v-if`): the twin leaves the DOM and the tree,
             and its pointer seam with it. -->
        <div v-if="animation" class="flex w-full items-center gap-1">
            <AnimationVisualizer
                v-if="preview !== 'hidden'"
                class="min-w-0 flex-1"
                :animation="animation"
                :is-playing="isAnimPlaying"
                :current-t="currentT"
                @scrub="scrubTo"
                @drag-start="emit('scrubStart')"
                @drag-end="emit('scrubEnd')"
            ></AnimationVisualizer>
            <Button
                v-if="preview !== undefined"
                size="sm"
                emphasis="quiet"
                icon-only
                class="ms-auto shrink-0"
                aria-label="Hide ball preview"
                :aria-pressed="preview === 'hidden'"
                @click="
                    emit('update:preview', preview === 'hidden' ? 'shown' : 'hidden')
                "
            >
                <EyeOff v-if="preview === 'hidden'" aria-hidden="true" />
                <Eye v-else aria-hidden="true" />
            </Button>
        </div>
    </div>
</template>

<script setup lang="ts">
// The `.btn-playback*` skin the two cells wear is NOT authored here: it lives in
// demo/styles/playback-idiom.css, pulled in by design-idioms.css, and lands on
// glass-ui's <Button> DOM shared with the scene play buttons. This file authors
// no styles: the scrub rail is the producer Slider's own paint (OA-8).

import { computed, ref, useId } from "vue";
import type { KeyframesAnimation } from "@mkbabb/keyframes.js";

// C-11 (NOT landed — recorded): `Button`/`Slider` stay on the root barrel beside
// `/tooltip`. Moving them to `/button`/`/slider` is the convention the row asks
// for, but KF.W12's render-edge gate stubs this ribbon's producer reach at the
// ROOT barrel (its mount path crosses the keyframes.js-import wall), and that
// test file is not this packet's to edit. The move lands the day that seam is
// widened by its owner.
import { Button, Slider } from "@mkbabb/glass-ui";
import { useDragCapture } from "@components/instrument/transport/composables/useDragCapture";
import { Tooltip, TooltipContent, TooltipTrigger } from "@mkbabb/glass-ui/tooltip";
import { ArrowLeftRight, Eye, EyeOff, Pause, Play } from "@lucide/vue";
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

const { animation, source, duration, currentT, preview } = defineProps<{
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
    /**
     * C-15 — the user's reverse INTENT (the visual: the flipped glyph and the
     * pressed state). It is not `animation.reversed` (the math the inversion
     * reads): on alternate-direction iterations the engine's flag flips while
     * the intent stays; `scrubTo` deliberately reads the engine's flag.
     */
    userReversed: boolean;
    /**
     * OA-10 — the ball preview's (the AnimationVisualizer twin's) visibility.
     * Bound by a mount that owns (and persists) the view state; left
     * `undefined`, the ribbon offers no toggle and always shows the preview.
     * A two-member string, not a boolean: Vue casts an absent Boolean prop to
     * `false`, which would erase the "unbound" state the toggle's offer reads.
     */
    preview?: "shown" | "hidden";
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
    // L-i2 — wake-only: fires on EVERY seat (pointer, keyboard, or visualizer).
    // Bound by the channel mount alone, whose settled sync loop re-arms on it;
    // the scene mounts have no idle loop and may leave it unbound.
    (e: "scrubbed"): void;
    (e: "sliderUpdate", val: { t: number; animation: KeyframesAnimation<any> }): void;
    (e: "togglePlay"): void;
    (e: "toggleReverse"): void;
    (e: "update:preview", preview: "shown" | "hidden"): void;
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
    onEnd: () => {
        gestureT.value = null;
        emit("scrubEnd");
    },
});

/** R-close-1 — THE RAIL'S VALUE DURING A POINTER GESTURE is the value the
 *  gesture last seated, not the `currentT` read-back. `currentT` is rAF-polled
 *  by the mount (`useAnimationSync`'s ticker, idled while paused and woken by
 *  `scrubbed`), so it reaches the rail a frame or more after the seat. The
 *  producer Slider aligns its thumb `contain`: reka measures the grab offset
 *  ONCE, on the gesture's first move, from the thumb's rendered rect. With the
 *  read-back lagging, a move that arrives before that frame measured the thumb
 *  where the playhead WAS — a press at 20 % with the playhead parked at 96 %
 *  stored a −76 % offset, and every later move saturated at `:max` (the scrub
 *  landed at the end and stayed there). Seating the rail from the gesture
 *  re-renders the thumb in the same flush as the press, before any move. At
 *  release the rail returns to the read-back, which by then holds the seat. */
const gestureT = ref<EffectiveMs | null>(null);
const railT = computed<EffectiveMs>(() => gestureT.value ?? currentT);

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
    if (t === undefined) return;
    gestureT.value = t;
    scrubTo(t);
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
