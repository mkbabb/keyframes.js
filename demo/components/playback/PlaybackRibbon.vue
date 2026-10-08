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
                    <!-- X-DS pass 8 (KF-C8-02) — the hit area grows on the BLOCK
                         axis only. All-round p-2 also padded the inline axis, so
                         the rail ran 8 px inside the label/field column KF-C6-01
                         aligned; it now spans the column edge to edge. -->
                    <Slider
                        class="py-2"
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

        <!-- UIA-KF-051 · UIA-KF-155 (X.KF.W13X.transport) — ONE TRANSPORT. The
             ribbon's own Play/Pause cell is DELETED: it drove the very state
             the dock's persistent Play drives (served ×2 on easing, spring and
             cube — pressing either flips both), so every scene carried two
             controls for one verb (demo/DESIGN.md §3), and its pastel accent
             fill was the low-contrast pill of 155. The dock owns play, reset
             and the channel select; the ribbon keeps what is its own — the
             scrub rail, Reverse and the ball preview.
             The cell wears the shared `.btn-playback` skin (playback-idiom.css,
             via design-idioms.css). Height: the producer Button's
             `min-block-size` (D-16). Glyph size: the producer's `--ui-glyph`
             rung (D-17/N-4). `emphasis="secondary"` is the Button's own
             default (N-6). D-15 / D-8 / N-1 — ONE pressed authority: the
             skin's `.btn-playback[aria-pressed="true"]` rule. -->
        <!-- X-DS pass 1 (KF-P1-01) — the transport row: Reverse and the ball
             preview's eye, two labelled siblings (C1: the eye one rung
             quieter, below). The
             eye floated over the ghost dot's corner (OA-61, out of flow, no
             frame, no label: the owner's "floating meaninglessly",
             2026-10-06); it is seated here, in the row of verbs it belongs
             to, and the ghost dot carries nothing.
             X-DS pass 5 (KF-C5-10) — the two are PEERS. Reverse was a filled
             capsule stretched over ~60% of the pane (the `1fr` track), the
             heaviest mass on the card for a modifier verb, while Preview beside
             it was bare text; ORIGIN set this row's verbs as equal quiet peers.
             Reverse now sits at its content width and one rung lower (glass's
             `quiet`, like Preview); its pressed state is still the skin's one
             pressed authority. The dock's Play is the only loud verb.
             X-DS pass 6 (KF-C6-01) — the row's first WORD sits on the pane's
             label column (the layer row's KF-C1-15 fix, adapted). The ribbon
             itself now starts on that column (RibbonBar.vue). The two quiet
             Buttons keep a SLIM inline padding (`px-2`), since Reverse's
             pressed plate and both hover washes need room around the word (a
             px-0 plate would hug it), and the row hangs exactly that padding
             plus the Button's 1px edge into the frame's gutter (`-ms`), so the
             first word lands on the column and the plate still clears the
             frame. Block size and hit height are glass's (min-block-size). -->
        <div class="flex flex-wrap items-center gap-2 -ms-[calc(0.5rem_+_1px)]">
            <Button
                emphasis="quiet"
                class="btn-playback rounded-full gap-2 px-2"
                :aria-pressed="userReversed"
                @click="onReverse"
            >
                <span>Reverse</span>
                <ArrowLeftRight
                    :class="[
                        'transition-transform duration-fast',
                        userReversed ? 'scale-x-[-1]' : '',
                    ]"
                />
            </Button>
            <!-- UIA-KF-300 (X.KF.W13X.transport) — ONE stable name with
                 `aria-pressed`; the tooltip states the action the next press
                 takes.
                 X-DS pass 1, C1 (KF-C1-03) — the pressed state follows the
                 visible label: "Ball preview", pressed while the preview is
                 SHOWN (it was "Hide ball preview", pressed while hidden, so
                 the accent skin lit the button exactly when the preview was
                 off). The eye is subordinate to Reverse, the card's verb: it
                 is glass's own `quiet` Button (no plate, no shadow) and it
                 does not wear the `.btn-playback` skin, whose pressed accent
                 is Reverse's. The eye / eye-off glyph is the state. -->
            <Tooltip v-if="showEye">
                <TooltipTrigger as-child>
                    <Button
                        emphasis="quiet"
                        class="gap-2 px-2"
                        aria-label="Ball preview"
                        :aria-pressed="preview !== 'hidden'"
                        :data-preview="preview"
                        :style="{ '--preview-ease': PREVIEW_EASE }"
                        @click="emit('update:preview', preview === 'hidden' ? 'shown' : 'hidden')"
                    >
                        <span>Preview</span>
                        <span class="preview-eye__glyphs" aria-hidden="true">
                            <Eye class="preview-eye__glyph" data-glyph="eye" />
                            <EyeOff class="preview-eye__glyph" data-glyph="eye-off" />
                        </span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>{{ preview === "hidden" ? "Show ball preview" : "Hide ball preview" }}</TooltipContent>
            </Tooltip>
        </div>

        <!-- OA-10 (§0ao.1) → OA-61 (X.KF.W13W.e) — the ball preview; its
             body fades in PreviewToggle (hidden stays mounted; its row collapses, C1). The mount owns
             the state and its persistence; every mount binds it. -->
        <PreviewToggle v-if="animation" :state="preview">
            <AnimationVisualizer
                :animation="animation"
                :is-playing="isAnimPlaying"
                :current-t="currentT"
                @scrub="scrubTo"
                @drag-start="emit('scrubStart')"
                @drag-end="emit('scrubEnd')"
            ></AnimationVisualizer>
        </PreviewToggle>
    </div>
</template>

<script setup lang="ts">
// The `.btn-playback` skin the Reverse cell wears is NOT authored here: it lives in
// demo/styles/playback-idiom.css, pulled in by design-idioms.css, and lands on
// glass-ui's <Button> DOM shared with the scene play buttons. This file authors
// no styles: the scrub rail is the producer Slider's own paint (OA-8), and the
// preview eye's glyph cross-fade (`.preview-eye__*`) rides the same partial.

import { computed, ref, useId } from "vue";
import type { KeyframesAnimation } from "@mkbabb/keyframes.js";

// C-11 (NOT landed — recorded): `Button`/`Slider` stay on the root barrel beside
// `/tooltip`. Moving them to `/button`/`/slider` is the convention the row asks
// for, but KF.W12's render-edge gate stubs this ribbon's producer reach at the
// ROOT barrel (its mount path crosses the keyframes.js-import wall), and that
// test file is not this packet's to edit. The move lands the day that seam is
// widened by its owner.
import { Button, Slider } from "@mkbabb/glass-ui";
import { useDragScrub } from "@composables/useDragScrub";
import { Tooltip, TooltipContent, TooltipTrigger } from "@mkbabb/glass-ui/tooltip";
import { ArrowLeftRight, Eye, EyeOff } from "@lucide/vue";
import AnimationVisualizer from "./AnimationVisualizer.vue";
import PreviewToggle, { PREVIEW_EASE } from "./PreviewToggle.vue";

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
     * OA-10 / OA-61 — the ball preview's (the AnimationVisualizer twin's)
     * visibility, toggled by the one eye in the transport row (KF-P1-01). Every demo mount binds
     * it (the scene bucket's `ballPreview`) and persists it; left `undefined`
     * (a bare harness mount), the ribbon offers no eye and shows the preview.
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
    // L-i2 — wake-only: fires on EVERY seat (pointer, keyboard, or visualizer)
    // and on every Reverse flip (KFA-174 — the flip re-maps effective time).
    // Bound by the channel mount alone, whose settled sync loop re-arms on it;
    // the scene mounts have no idle loop and may leave it unbound.
    (e: "scrubbed"): void;
    (e: "sliderUpdate", val: { t: number; animation: KeyframesAnimation<any> }): void;
    (e: "toggleReverse"): void;
    (e: "update:preview", preview: "shown" | "hidden"): void;
}>();

// ── J.W2 S1 (W4-4) — the slider scrub rides the SHARED drag seam ─────────────
// The playhead scrub is a control-surface drag, so `useDragScrub` is its seam
// (gesture only — no `project`/`onScrub`; X.KF.W13X.lib, A2-KE-L1-2):
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
const { dragging: isDragging, onPointerDown: onScrubPointerDown } = useDragScrub({
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

/** KF-P1-01 — the eye is offered where there is a preview to hide AND a mount
 *  that owns its state (an unbound harness mount offers none). */
const showEye = computed(() => animation !== undefined && preview !== undefined);

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


/** The Reverse cell. KFA-174 (X.KF.W13X.transport) — a direction flip moves
 *  the EFFECTIVE time the rail displays (`duration − t` ↔ `t`, the contract
 *  above) without moving the engine's `t`, so the channel mount's sync loop,
 *  idled while paused, never re-derived it: the thumb and ball held the stale
 *  position and snapped on the next Play (served: 1.0 held, then 0.035). The
 *  flip is followed by the same wake a seat sends, so the read-back re-seats
 *  in the new direction at once. */
const onReverse = () => {
    emit("toggleReverse");
    emit("scrubbed");
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
