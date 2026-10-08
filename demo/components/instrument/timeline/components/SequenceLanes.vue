<template>
    <!-- THE SEQUENCE MODE's lanes (X.KF.W13V.s2 · §0cw ESC-s-1 (b) · OA-46).
         ESC-W13X-tl-1 (A2-KE-L1-9 consumer half · UIA-KF-099), steps 1–2 —
         this is now a DATA ADAPTER of the one LaneTrack the keyframe Timeline
         also renders: the master clock is the track's scrub (its scrub row
         carries the clock's ball), the items are its lanes (each its run as a
         bar in its tone, and its re-time handle), and the ruler, the playhead
         through every row, the keyboard map and the pointer policy are the
         track's. The domain is the master clock in ms, placed `x = t / axis`.
         Step 3 (glass `Slider` draggable marks, O-59) is ADOPT-AT-LANDING. -->
    <LaneTrack
        class="seq-lane-scrub"
        :class="{ 'is-scrubbing': source.isScrubbing() }"
        :style="{ '--seq-p': playhead / 100 }"
        labelled
        scrub-label="Scrub the sequence master clock"
        :value="source.progress() * 100"
        :value-text="`${Math.round(source.progress() * source.duration())} ms of ${source.duration()} ms`"
        :step="SCRUB_KEY_STEP"
        :page-step="SCRUB_PAGE_STEP"
        :lanes="lanes"
        :ticks="ticks"
        :playhead="playhead"
        @scrub-start="onScrubStart"
        @scrub="applyScrub"
        @scrub-end="source.setScrubbing(false)"
    >
        <template #scrub-label>
            <span class="seq-lane-label text-mono-caption text-muted-foreground">clock</span>
        </template>
        <template #scrub>
            <!-- The clock's own row: its rail and its ball, at the playhead. -->
            <div class="seq-lane-clock">
                <div class="progress-rail"></div>
                <div class="progress-ball seq-lane-scrub-ball"></div>
            </div>
        </template>
        <template #lane-label="{ lane }">
            <!-- X.KF.W13X.sq+dh (§0dz) — ONE label register per row: the index
                 and its offset are one muted mono caption. The lane's tone
                 already keys the row. -->
            <span class="seq-lane-label text-mono-caption text-muted-foreground tabular-nums">
                {{ lane.index + 1 }} @{{ Math.round(lane.at) }}ms
            </span>
        </template>
        <template #lane="{ lane, beginDrag }">
            <div
                class="seq-lane-track"
                :style="{ '--ball-tone': lane.tone }"
            >
                <div class="progress-rail"></div>
                <!-- The item's run on the master clock: [at, at + span]. -->
                <div
                    class="seq-lane-bar"
                    :style="{
                        left: `${(lane.at / axis) * 100}%`,
                        width: `${(lane.span / axis) * 100}%`,
                    }"
                ></div>
                <!-- The re-time handle: drag or key re-authors the item's `at`
                     on the master Sequence (the engine's `add(child, at)`). Its
                     CONTROL range is the editable [0, atMax] domain. Its press
                     begins a drag on the track (one gesture with the scrub);
                     it never reaches the scrub. -->
                <div
                    class="seq-lane-handle"
                    :style="{ left: `${(lane.at / axis) * 100}%` }"
                    :data-dragging="activeLane === lane.index ? '' : undefined"
                    role="slider"
                    :aria-label="`Re-time row ${lane.index + 1} start offset`"
                    :aria-valuenow="Math.round(lane.at)"
                    :aria-valuetext="`${Math.round(lane.at)} ms`"
                    aria-valuemin="0"
                    :aria-valuemax="source.atMax"
                    tabindex="0"
                    @pointerdown.stop="onLaneDown(lane.index, $event, beginDrag)"
                    @keydown="onLaneKeydown(lane.index, $event)"
                ></div>
            </div>
        </template>
    </LaneTrack>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { clamp } from "@mkbabb/value.js/math";
import LaneTrack, { type LaneTrackBeginDrag, type LaneTrackTick } from "./LaneTrack.vue";
import type { SequenceTimelineSource } from "../timelineTypes";

const props = defineProps<{ source: SequenceTimelineSource }>();
// THE SOURCE GUARD (C·C-4, carried from the stage scrubber's provider guard):
// the pane mounts this only on a channel that carries a Sequence, so a mount
// without one names the contract instead of dying inside the render.
if (!props.source) {
    throw new Error(
        "SequenceLanes needs a SequenceTimelineSource: mount it on a channel that carries a Sequence props.source.",
    );
}

// ── The master scrub (the pane's playhead) ───────────────────────────────────
// The track's value is the clock's progress in percent. An arrow press moves 5 %
// of the clock (a scrub of the WHOLE clock, KF-SCR-6); Shift or a Page key, 25 %.
const SCRUB_KEY_STEP = 5;
const SCRUB_PAGE_STEP = 25;

/** One scrub sample (pointer or key): latch the direction PER SAMPLE (the
 *  stage cascade chases it), hold the scrub heat, seek the master clock. A
 *  gesture's first sample is read against the clock where the gesture began. */
let lastP = 0;
const onScrubStart = () => {
    lastP = props.source.progress();
};
const applyScrub = (percent: number) => {
    const next = clamp(percent / 100, 0, 1);
    if (next !== lastP) {
        props.source.setScrubDir(next > lastP ? 1 : -1);
        lastP = next;
    }
    props.source.setScrubbing(true);
    props.source.scrub(next);
};

/**
 * UIA-KF-031 — THE AXIS HOLDS STILL UNDER A DRAG. A re-time re-derives the
 * master clock's span (the last item's start plus its run), and the lanes were
 * drawn against the LIVE span while the drag projected against the span at
 * press: the handle trailed the pointer by up to ~100 px over a 120 px drag
 * (served, row 5, 1440 and 390). For the life of a lane drag, every lane, bar,
 * handle and the playhead are drawn on the axis the drag projects onto; the
 * pane re-lays out to the new span when the handle is released.
 */
const dragAxis = ref<number | null>(null);
const axis = computed(() => dragAxis.value ?? props.source.duration());

/** The playhead's place in the time column (%), on the drawn axis. */
const playhead = computed(() => ((props.source.progress() * props.source.duration()) / axis.value) * 100);

/** The lanes, keyed for the track. */
const lanes = computed(() => props.source.lanes().map((lane) => ({ key: lane.index, ...lane })));

/** The ruler: the clock's quarters on the drawn axis, in ms. The unit is said
 *  once, by the pane's caption above ("5 items · 1940 ms"); a unit on the end
 *  graduation ran its label into the three-quarter one on a rail-width column. */
const RULER_QUARTERS = [0, 0.25, 0.5, 0.75, 1];
const ticks = computed<LaneTrackTick[]>(() =>
    RULER_QUARTERS.map((q) => ({ key: q, at: q * 100, label: `${Math.round(q * axis.value)}` })),
);

// ── The lanes' re-time handles ───────────────────────────────────────────────
// A handle's press begins a drag on the track (one pointer policy with the
// scrub). The track projects the pointer onto its time column in percent; the
// handle maps that to an `at` in ms on the axis READ ONCE at the press, and
// `reseat` clamps it to the editable [0, atMax] domain.
const activeLane = ref<number | null>(null);

const onLaneDown = (index: number, e: PointerEvent, beginDrag: LaneTrackBeginDrag) => {
    const laneAxis = props.source.duration();
    const pressed = beginDrag(e, {
        move: (percent) => props.source.reseat(index, (percent / 100) * laneAxis),
        end: () => {
            // UIA-KF-317 — the re-time settles on release: the stage runs the
            // retimed row once, so the new offset shows its motion before Play.
            props.source.preview(index);
            activeLane.value = null;
            dragAxis.value = null;
        },
    });
    if (pressed === null) return;
    activeLane.value = index;
    dragAxis.value = laneAxis;
    props.source.reseat(index, (pressed / 100) * laneAxis);
};

const LANE_AT_STEP = 40; // ms per arrow press (the slider keyboard posture)
const LANE_AT_PAGE = LANE_AT_STEP * 10; // ms per PageUp/PageDown (APG's larger step)
const onLaneKeydown = (index: number, e: KeyboardEvent) => {
    const at = props.source.lanes()[index]?.at ?? 0;
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = at + LANE_AT_STEP;
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = at - LANE_AT_STEP;
    else if (e.key === "PageUp") next = at + LANE_AT_PAGE;
    else if (e.key === "PageDown") next = at - LANE_AT_PAGE;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = props.source.atMax;
    if (next === null) return;
    e.preventDefault();
    props.source.reseat(index, next);
    props.source.preview(index); // UIA-KF-317 — a key step is a settled re-time
};
</script>

<style scoped>
/* The LaneTrack's grid (its root carries this component's scope): the label
   column hugs its widest label; the time column is the master clock's axis
   every rail, bar, handle, the ruler and the playhead share. */
.lane-track {
    row-gap: 0.25rem;
}

.seq-lane-label {
    white-space: nowrap;
    text-transform: none;
    letter-spacing: 0;
}

/* The master scrub — the LaneTrack's host (rendered there, so reached through
   :deep). The playhead wears the clock's progress ink, as the line it replaces
   did (identity kept, §0dm). */
:deep(.seq-lane-scrub) {
    --lane-track-playhead-ink: color-mix(in srgb, var(--color-progress) 70%, transparent);
    cursor: pointer;
    user-select: none;
    touch-action: none;
}
/* The clock's row: its rail and its ball. The ball rides `translateX(<cqw>)`
   against the row's own inline size (compositor-only). */
.seq-lane-clock {
    position: relative;
    height: 2.25rem;
    container-type: inline-size;
}
.seq-lane-scrub-ball {
    --ball-size: 1.25rem;
    left: 0;
    margin-left: calc(var(--ball-size) / -2);
    /* X-DS pass 2 · KF-C2-13 — the idiom already centres the disc on the rail
       (`.progress-ball`'s `top: 50%` + half-size negative margin); a second
       −50% here lifted it half a disc (~10px) off the clock row's rule. */
    transform: translateX(calc(var(--seq-p, 0) * 100cqw));
    will-change: transform;
}
/* One lane: the rail, the item's run as a bar in its tone, the handle. */
.seq-lane-track {
    position: relative;
    height: 2rem;
}
.seq-lane-bar {
    position: absolute;
    top: 50%;
    height: 0.5rem;
    transform: translateY(-50%);
    border-radius: var(--radius-pill);
    background: color-mix(in srgb, var(--ball-tone) 35%, transparent);
    border: 1px solid color-mix(in srgb, var(--ball-tone) 60%, transparent);
    pointer-events: none;
}

/* The re-time handle — a 44px touch floor on the drag axis; the visible grip
   is the thin toned bar painted by ::after at the item's start. */
.seq-lane-handle {
    position: absolute;
    top: 0;
    width: 44px;
    height: 100%;
    margin-left: -22px;
    cursor: grab;
    touch-action: none;
    z-index: 1;
}
.seq-lane-handle::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0.4rem;
    height: 1.5rem;
    transform: translate(-50%, -50%);
    border-radius: var(--radius-pill);
    background: color-mix(in srgb, var(--ball-tone) 70%, var(--background));
    border: 1.5px solid var(--ball-tone);
    pointer-events: none;
    transition:
        background 120ms ease,
        transform 120ms ease;
}
.seq-lane-handle:hover::after,
.seq-lane-handle:focus-visible::after {
    background: var(--ball-tone);
    transform: translate(-50%, -50%) scaleY(1.12);
}
.seq-lane-handle:active {
    cursor: grabbing;
}

/* UIA-KF-317 — a held handle SAYS it is held: the grip takes its full tone and
   stretches, and its lane's run brightens, for the life of the drag (the grip
   used to look exactly as it does at rest). */
.seq-lane-handle[data-dragging] {
    cursor: grabbing;
}
.seq-lane-handle[data-dragging]::after {
    background: var(--ball-tone);
    transform: translate(-50%, -50%) scaleY(1.25);
}
.seq-lane-track:has(.seq-lane-handle[data-dragging]) .seq-lane-bar {
    background: color-mix(in srgb, var(--ball-tone) 55%, transparent);
}

/* UIA-KF-313 — the focus ring sits on the control's OWN shape: the grip of a
   re-time handle and the master clock's ball, not a square around their
   invisible hit hosts (a 44×32 box, a full-width rectangle). */
:deep(.seq-lane-scrub:focus-visible),
.seq-lane-handle:focus-visible {
    outline: none;
}
:deep(.seq-lane-scrub:focus-visible) .seq-lane-scrub-ball,
.seq-lane-handle:focus-visible::after {
    box-shadow: var(--focus-ring-shadow);
}
@media (forced-colors: active) {
    :deep(.seq-lane-scrub:focus-visible) .seq-lane-scrub-ball,
    .seq-lane-handle:focus-visible::after {
        outline: 2px solid Highlight;
        outline-offset: 2px;
    }
}
</style>
