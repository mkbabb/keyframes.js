<template>
    <!-- THE SEQUENCE MODE's lanes (X.KF.W13V.s2 · §0cw ESC-s-1 (b) · OA-46).
         One grid: a label column and ONE time column the master playhead, every
         lane's rail and every re-time handle resolve their x from — the master
         clock in ms, `x = t / duration` (the stage's canonical domain). The
         glass-free leaf of the pane (SequenceTimeline is its shell). -->
    <div class="seq-lanes" :style="{ '--seq-p': source.progress() }">
        <!-- The master scrub — the pane's playhead. Its rail heads the time
             column; the playhead line it seats runs down through every lane. -->
        <span class="seq-lane-label text-mono-caption text-muted-foreground" style="grid-row: 1">clock</span>
        <div
            ref="scrubEl"
            class="seq-lane-scrub kf-focus-ring"
            style="grid-row: 1"
            :class="{ 'is-scrubbing': source.isScrubbing() }"
            role="slider"
            aria-label="Scrub the sequence master clock"
            :aria-valuenow="Math.round(source.progress() * 100)"
            :aria-valuetext="`${Math.round(source.progress() * source.duration())} ms of ${source.duration()} ms`"
            aria-valuemin="0"
            aria-valuemax="100"
            tabindex="0"
            @pointerdown="onScrubDown"
            @keydown="onScrubKeydown"
            @keyup="onScrubKeyup"
            @blur="source.setScrubbing(false)"
        >
            <div class="progress-rail"></div>
            <div class="progress-ball seq-lane-scrub-ball"></div>
        </div>

        <template v-for="lane in source.lanes()" :key="lane.index">
            <!-- Every cell names its row: the playhead spans the column, so
                 auto-placement would flow the lanes around it. -->
            <span
                class="seq-lane-label text-mono-caption text-muted-foreground tabular-nums"
                :style="{ gridRow: lane.index + 2 }"
            >
                <span class="text-foreground">{{ lane.index + 1 }}</span>
                <span>@{{ Math.round(lane.at) }}ms</span>
            </span>
            <div
                :ref="(el) => setLaneEl(lane.index, el as HTMLElement | null)"
                class="seq-lane-track"
                :style="{ '--ball-tone': lane.tone, gridRow: lane.index + 2 }"
            >
                <div class="progress-rail"></div>
                <!-- The item's run on the master clock: [at, at + span]. -->
                <div
                    class="seq-lane-bar"
                    :style="{
                        left: `${(lane.at / source.duration()) * 100}%`,
                        width: `${(lane.span / source.duration()) * 100}%`,
                    }"
                ></div>
                <!-- The re-time handle: drag or key re-authors the item's `at`
                     on the master Sequence (the engine's `add(child, at)`). Its
                     CONTROL range is the editable [0, atMax] domain. -->
                <div
                    class="seq-lane-handle kf-focus-ring"
                    :style="{ left: `${(lane.at / source.duration()) * 100}%` }"
                    role="slider"
                    :aria-label="`Re-time row ${lane.index + 1} start offset`"
                    :aria-valuenow="Math.round(lane.at)"
                    :aria-valuetext="`${Math.round(lane.at)} ms`"
                    aria-valuemin="0"
                    :aria-valuemax="source.atMax"
                    tabindex="0"
                    @pointerdown="onLaneDown(lane.index, $event)"
                    @keydown="onLaneKeydown(lane.index, $event)"
                ></div>
            </div>
        </template>

        <!-- The playhead line — the master scrub's position carried through
             every lane (paint only; the scrub rail above owns the gesture). -->
        <div
            class="seq-lanes-playhead"
            data-sequence-playhead
            aria-hidden="true"
            :style="{ gridRow: `1 / span ${source.lanes().length + 1}` }"
        >
            <div class="seq-lanes-playhead-line"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from "vue";
import { clamp } from "@mkbabb/value.js/math";
import { useDragScrub } from "@composables/useDragScrub";
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
/** 5% of the clock per arrow press — a scrub of the WHOLE clock (KF-SCR-6). */
const SCRUB_KEY_STEP = 0.05;
const SCRUB_KEYS = new Set(["ArrowRight", "ArrowUp", "ArrowLeft", "ArrowDown", "Home", "End"]);
const scrubEl = useTemplateRef<HTMLElement>("scrubEl");
let lastP = 0;

/** One scrub sample: latch the direction (the stage cascade chases it), hold
 *  the scrub heat, seek the master clock. */
const applyScrub = (p: number) => {
    const next = clamp(p, 0, 1);
    if (next !== lastP) {
        props.source.setScrubDir(next > lastP ? 1 : -1);
        lastP = next;
    }
    props.source.setScrubbing(true);
    props.source.scrub(next);
};

const { onPointerDown: onScrubDown } = useDragScrub({
    el: scrubEl,
    project: (e) => {
        const el = scrubEl.value;
        if (!el) return props.source.progress();
        const rect = el.getBoundingClientRect();
        if (rect.width === 0) return props.source.progress();
        return clamp((e.clientX - rect.left) / rect.width, 0, 1);
    },
    onScrub: applyScrub,
    onStart: () => {
        lastP = props.source.progress();
    },
    onEnd: () => props.source.setScrubbing(false),
});

const onScrubKeydown = (e: KeyboardEvent) => {
    if (!SCRUB_KEYS.has(e.key)) return;
    e.preventDefault();
    const p = props.source.progress();
    lastP = p;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") applyScrub(p + SCRUB_KEY_STEP);
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") applyScrub(p - SCRUB_KEY_STEP);
    else applyScrub(e.key === "Home" ? 0 : 1);
};
const onScrubKeyup = (e: KeyboardEvent) => {
    if (SCRUB_KEYS.has(e.key)) props.source.setScrubbing(false);
};

// ── The lanes' re-time handles ───────────────────────────────────────────────
// ONE shared `useDragScrub` drives every handle: the pressed lane is latched,
// `project` reads THAT lane's track rect → an `at` in ms on the master clock's
// axis (x = at / duration, the handle's own placement), clamped by `reseat` to
// the editable [0, atMax] domain. The axis is READ ONCE at the press: a
// re-time changes the clock's span (duration = max(at + span)), and a
// projection over the live span would chase its own write under a held pointer.
let laneAxis = 1;
const laneEls: (HTMLElement | null)[] = [];
const setLaneEl = (i: number, el: HTMLElement | null) => {
    laneEls[i] = el;
};
const activeLane = ref<number | null>(null);
const activeLaneEl = computed<HTMLElement | null>(() =>
    activeLane.value == null ? null : (laneEls[activeLane.value] ?? null),
);
const { onPointerDown: onLaneScrubDown } = useDragScrub({
    el: activeLaneEl,
    project: (e) => {
        const i = activeLane.value;
        const el = i == null ? null : laneEls[i];
        if (i == null || !el) return 0;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0) return props.source.lanes()[i]?.at ?? 0;
        return clamp((e.clientX - rect.left) / rect.width, 0, 1) * laneAxis;
    },
    onStart: () => {
        laneAxis = props.source.duration();
    },
    onScrub: (at) => {
        if (activeLane.value != null) props.source.reseat(activeLane.value, at);
    },
    onEnd: () => {
        activeLane.value = null;
    },
});
const onLaneDown = (index: number, e: PointerEvent) => {
    activeLane.value = index;
    onLaneScrubDown(e);
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
};
</script>

<style scoped>
/* ONE grid: the label column hugs its widest label; the time column is the
   master clock's axis every rail, bar, handle and the playhead share — their
   x resolves from the same column box, so they agree by construction. */
.seq-lanes {
    display: grid;
    grid-template-columns: max-content minmax(0, 1fr);
    column-gap: 0.75rem;
    row-gap: 0.25rem;
    align-items: center;
}

.seq-lane-label {
    grid-column: 1;
    display: inline-flex;
    gap: 0.375rem;
    text-transform: none;
    letter-spacing: 0;
}

/* The master scrub rail — the pane's playhead control. The ball rides
   `translateX(<cqw>)` against the rail's own inline size (compositor-only). */
.seq-lane-scrub {
    grid-column: 2;
    position: relative;
    height: 2.25rem;
    cursor: pointer;
    user-select: none;
    touch-action: none;
    container-type: inline-size;
}
.seq-lane-scrub-ball {
    --ball-size: 1.25rem;
    left: 0;
    margin-left: calc(var(--ball-size) / -2);
    transform: translate(calc(var(--seq-p, 0) * 100cqw), -50%);
    will-change: transform;
}
.seq-lane-scrub.is-scrubbing .seq-lane-scrub-ball {
    --ball-glow: 60%;
}

/* One lane: the rail, the item's run as a bar in its tone, the handle. */
.seq-lane-track {
    grid-column: 2;
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

/* The playhead line through every lane, at the master clock's position. */
.seq-lanes-playhead {
    grid-column: 2;
    align-self: stretch;
    position: relative;
    pointer-events: none;
    container-type: inline-size;
}
.seq-lanes-playhead-line {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 2px;
    margin-left: -1px;
    translate: calc(var(--seq-p, 0) * 100cqw) 0;
    background: var(--color-progress);
    opacity: 0.7;
}
</style>
