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
        <!-- X-DS pass 10 (KF-C10-02) — TIME is a labelled row, in the same
             PARAM-ROW idiom the parameters above it wear (design-idioms.css):
             the label "time" and its live readout on one mono line, the rail
             beneath. It drew in the parameters' exact register with neither,
             so at 0 it read as a second, empty, unlabelled slider rather than
             the animation's playhead. The rail keeps its own specific name
             (aria-label); the readout is the sighted twin of the value text. -->
        <div class="param-row">
            <LabeledField label="time" :control-labelable="false">
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
            </LabeledField>
            <output class="param-value" aria-hidden="true">{{ timeReadout }}</output>
        </div>

        <!-- UIA-KF-051 · UIA-KF-155 (X.KF.W13X.transport) — ONE TRANSPORT. The
             ribbon's own Play/Pause cell is DELETED: the dock owns play, reset
             and the channel select; the ribbon keeps what is its own — the
             scrub rail, Reverse and the ball preview.
             OD19-K4 (the owner, 2026-10-19: "Reverse / Preview and the three
             dots integrated more deftly, using the ball") — there is no verb
             row. The ball track's two end discs ARE the two verbs: the start
             disc is Reverse (the run's origin; its two-way arrow (C1-KF-11) mirrors
             under Reverse, `aria-pressed`), the dashed
             ghost disc is the ball Preview (the run's destination; eye /
             eye-off is the state, `aria-pressed` while SHOWN). Both are named
             glass Buttons with Tooltips, authored here and seated by the
             visualizer's `start` / `end` slots (no wrapper). Reverse keeps the
             `.btn-playback` skin, the one pressed authority (D-15 / N-1); the
             eye stays glass's plain `quiet` Button (KF-C1-03). On the short
             desktop rail (KF-C5-03) the ball is not drawn and the eye is not
             offered; the row seats Reverse alone at the control height. -->
        <AnimationVisualizer
            v-if="animation"
            :animation="animation"
            :is-playing="isAnimPlaying"
            :current-t="currentT"
            :preview="railShort ? 'hidden' : (preview ?? 'shown')"
            :compact="railShort"
            @scrub="scrubTo"
            @drag-start="emit('scrubStart')"
            @drag-end="emit('scrubEnd')"
        >
            <template #start>
                <Tooltip>
                    <TooltipTrigger as-child>
                        <Button
                            emphasis="quiet"
                            icon-only
                            class="btn-playback size-(--ball-size) shrink-0 rounded-full bg-accent-kf/30"
                            :aria-pressed="userReversed"
                            @click="onReverse"
                        >
                            <!-- C1-KF-11 / C2-KF-02 — at rest the disc reads as
                                 its verb in the pane's own vocabulary: the
                                 direction table's "reverse" glyph (the two-way
                                 arrow there means "alternate"), flipped under
                                 Reverse, at the eye disc's 1rem glyph rung. -->
                            <component
                                :is="OPTION_GLYPHS.reverse"
                                :class="[
                                    'size-4 transition-transform duration-fast',
                                    userReversed ? 'scale-x-[-1]' : '',
                                ]"
                                aria-hidden="true"
                            />
                            <span class="sr-only">Reverse</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>{{ userReversed ? "Play forwards" : "Play in reverse" }}</TooltipContent>
                </Tooltip>
            </template>
            <!-- UIA-KF-300 — ONE stable name with `aria-pressed`; the tooltip
                 states the action the next press takes. -->
            <template v-if="showEye" #end>
                <Tooltip>
                    <TooltipTrigger as-child>
                        <Button
                            emphasis="quiet"
                            icon-only
                            class="size-(--ball-size) shrink-0 rounded-full border-2 border-dashed border-accent-kf/40 bg-accent-kf/15"
                            aria-label="Ball preview"
                            :aria-pressed="preview !== 'hidden'"
                            :data-preview="preview"
                            :style="{ '--preview-ease': PREVIEW_EASE }"
                            @click="emit('update:preview', preview === 'hidden' ? 'shown' : 'hidden')"
                        >
                            <span class="preview-eye__glyphs" aria-hidden="true">
                                <Eye class="preview-eye__glyph" data-glyph="eye" />
                                <EyeOff class="preview-eye__glyph" data-glyph="eye-off" />
                            </span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>{{ preview === "hidden" ? "Show ball preview" : "Hide ball preview" }}</TooltipContent>
                </Tooltip>
            </template>
        </AnimationVisualizer>
    </div>
</template>

<script setup lang="ts">
// The `.btn-playback` skin the Reverse cell wears is NOT authored here: it lives in
// demo/styles/playback-idiom.css, pulled in by design-idioms.css, and lands on
// glass-ui's <Button> DOM shared with the scene play buttons. This file authors
// no styles: the scrub rail is the producer Slider's own paint (OA-8), the
// preview eye's glyph cross-fade (`.preview-eye__*`) rides the same partial,
// and the two discs' seat (`--ball-size`) is AnimationVisualizer's (OD19-K4).

import { computed, onBeforeUnmount, ref, useId } from "vue";
import type { KeyframesAnimation } from "@mkbabb/keyframes.js";

// C-11 (NOT landed — recorded): `Button`/`Slider` stay on the root barrel beside
// `/tooltip`. Moving them to `/button`/`/slider` is the convention the row asks
// for, but KF.W12's render-edge gate stubs this ribbon's producer reach at the
// ROOT barrel (its mount path crosses the keyframes.js-import wall), and that
// test file is not this packet's to edit. The move lands the day that seam is
// widened by its owner.
import { Button, Slider } from "@mkbabb/glass-ui";
import { useMediaQuery } from "@vueuse/core";
import { useDragScrub } from "@composables/useDragScrub";
import { Tooltip, TooltipContent, TooltipTrigger } from "@mkbabb/glass-ui/tooltip";
import { LabeledField } from "@mkbabb/glass-ui/labeled-field";
import { Eye, EyeOff } from "@lucide/vue";
import { OPTION_GLYPHS } from "@components/instrument/pane/channel-controls/optionGlyphs";
import AnimationVisualizer from "./AnimationVisualizer.vue";
import { PREVIEW_EASE } from "./PreviewToggle.vue";

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

const { animation, source, duration, currentT, isAnimPlaying, preview } = defineProps<{
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
/** The rail is in milliseconds when a scale is declared (else a normalized
 *  [0, 1] source rail) — read by the time readout and the release hold. */
const railInMs = computed(() => {
    const scaled = duration ?? animation?.options.duration ?? source?.duration;
    return scaled != null && scaled > 0;
});

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
/** KFA-226 (the release limb, X.KF.W13X.r4transport) — a playing loop
 *  released within this beat of its end wrapped to 0 before the eye read the
 *  release (the audit measured the wrap inside ~400 ms). The release is held
 *  for the beat: the scrub (the machine's SCRUB_START…SCRUB_END hold) ends
 *  after it, so the rail shows where the user let go and the loop then resumes
 *  from there. A press during the hold continues the same scrub. */
const RELEASE_HOLD_MS = 400;
let releaseHold: ReturnType<typeof setTimeout> | undefined;

const endScrub = () => {
    releaseHold = undefined;
    gestureT.value = null;
    emit("scrubEnd");
};

const { dragging: isDragging, onPointerDown: onScrubPointerDown } = useDragScrub({
    onStart: () => {
        if (releaseHold !== undefined) {
            clearTimeout(releaseHold);
            releaseHold = undefined;
            return;
        }
        emit("scrubStart");
    },
    onEnd: () => {
        const released = gestureT.value ?? currentT;
        if (isAnimPlaying && railInMs.value && effectiveDuration.value - released < RELEASE_HOLD_MS) {
            releaseHold = setTimeout(endScrub, RELEASE_HOLD_MS);
            return;
        }
        endScrub();
    },
});

// An unmount inside the hold still ends the scrub (the machine never stays held).
onBeforeUnmount(() => {
    if (releaseHold === undefined) return;
    clearTimeout(releaseHold);
    endScrub();
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

/** X-DS pass 10 (KF-C10-02) — the time row's readout: elapsed over the rail's
 *  ONE duration read, in ms; a normalized source (no declared scale) reads as
 *  a percentage, since its rail is [0, 1] and not milliseconds. */
const timeReadout = computed(() => {
    return railInMs.value
        ? `${Math.round(railT.value)} / ${Math.round(effectiveDuration.value)} ms`
        : `${Math.round(railT.value * 100)} %`;
});

/** X-DS r5 pass 5 (KF-C5-03) — THE BALL TRACK YIELDS TO THE SCROLLER ON A
 *  SHORT RAIL. The ribbon is pinned under the pane's scroller, and its three
 *  rows (time, Reverse / Preview, the 64 px track with its gap: 205 px) left
 *  the scroller 301 px of a 368 px Easing facet at 1280x800, so `duration`,
 *  the scene's one timing control, rested under the fold (the cube, square and
 *  amiga panes lost `layer`, spring half its presets). The track repeats what
 *  the time rail shows, so it is the row that gives way; the time rail and
 *  Reverse stay pinned. The rail's block budget is the stage plate's (the work
 *  band), which follows the viewport's height: the tallest resting facet
 *  (spring Physics, 406 px) fits beside the track from 890 px of viewport up
 *  (416 px of scroller at 900), so below that the ball is not drawn and the
 *  eye that toggles it is not offered. Desktop rail only: the phone sheet
 *  scrolls the ribbon with its pane. OD19-K4 — the row itself stays, compact:
 *  it seats Reverse (the start disc) at the control height, the block the
 *  former verb row took, so the scroller's budget is unchanged. */
const railShort = useMediaQuery("(min-width: 1024px) and (max-height: 889px)");

/** KF-P1-01 — the eye is offered where there is a preview to hide AND a mount
 *  that owns its state (an unbound harness mount offers none). OD19-K4 — on
 *  the short rail the track row stays (it seats Reverse) but draws no ball. */
const showEye = computed(() => !railShort.value && preview !== undefined);

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
