<template>
    <!-- ESC-W13X-tl-1 (A2-KE-L1-9 consumer half · UIA-KF-099), steps 1–2 —
         THE ONE LANE-TRACK PRIMITIVE (KF-W13.md addendum (g), COHESION §0er).
         The Timeline pane hosted two timeline stacks, each with its own scrub,
         playhead, ruler and gesture code (TimelineTrack: a rail slider, a tick
         ruler, a whole-pixel playhead; SequenceLanes: a hand-rolled master
         scrub, a playhead line, no ruler). This is the one track both now
         render: a scrub row and N lanes on ONE time column, one ruler and one
         playhead drawn through every row, one scrub host (role=slider, one
         keyboard map) and one pointer policy for every gesture on it — a scrub
         of the host or a drag an adapter begins on a lane item. TimelineTrack
         and SequenceLanes are its two data adapters: they supply the domain
         (value, ticks, the column mapping) and paint their items in the rows.
         Step 3 (the rail from glass `Slider` draggable marks, O-59 /
         UIA-KF-280) is ADOPT-AT-LANDING: this is the one seat it replaces. -->
    <div
        class="lane-track"
        :class="{ 'lane-track--labelled': labelled }"
        :data-ruled="ticks.length > 0 ? '' : undefined"
    >
        <template v-if="labelled">
            <span class="lane-track-label" style="grid-row: 1"><slot name="scrub-label" /></span>
            <span
                v-for="(lane, i) in lanes"
                :key="lane.key"
                class="lane-track-label"
                :style="{ gridRow: i + 2 }"
            ><slot name="lane-label" :lane="lane" :index="i" /></span>
        </template>
        <!-- The one scrub. The adapter's own attributes (its classes, its
             zoom keys, wheel and pinch listeners) land here, beside the
             primitive's: one element, one role, one name. -->
        <div
            ref="hostEl"
            v-bind="$attrs"
            class="lane-track-scrub"
            :style="{ gridRow: `1 / span ${rows}` }"
            role="slider"
            tabindex="0"
            :aria-label="scrubLabel"
            aria-orientation="horizontal"
            :aria-valuemin="min"
            :aria-valuemax="max"
            :aria-valuenow="Math.round(value)"
            :aria-valuetext="valueText"
            @pointerdown="onHostPointerDown"
            @pointermove="onHostPointerMove"
            @pointerup="onHostPointerUp"
            @pointercancel="onHostPointerUp"
            @lostpointercapture="onHostPointerUp"
            @keydown="onHostKeydown"
            @keyup="onHostKeyup"
            @blur="emit('scrubEnd')"
        >
            <!-- THE TIME COLUMN — every row, tick, the playhead and the pointer
                 projection share this one box, so they agree by construction. -->
            <div ref="columnEl" class="lane-track-column">
                <!-- The ruler. A graduation is decoration to AT (the slider's
                     value text says where the playhead is). -->
                <div
                    v-for="tick in ticks"
                    :key="tick.key"
                    class="absolute top-0 h-full border-l border-border/30"
                    :style="{ left: `${tick.at}%` }"
                    aria-hidden="true"
                >
                    <span
                        v-if="tick.label"
                        class="lane-track-tick-label text-mono-caption tabular-nums absolute left-0 text-muted-foreground whitespace-nowrap"
                        :data-edge="edgeOf(tick.at)"
                    >{{ tick.label }}</span>
                </div>
                <!-- The playhead, through every row. KFA-172 — placed by a
                     WHOLE-PIXEL translate (a fractional offset rasterises soft
                     while it moves). -->
                <div
                    class="lane-track-playhead absolute top-0 left-0 h-full w-0.5 z-content pointer-events-none"
                    data-lane-track-playhead
                    aria-hidden="true"
                    :style="{ transform: `translateX(${playheadPx}px)` }"
                ></div>
                <div class="lane-track-row" style="grid-row: 1">
                    <slot name="scrub" :begin-drag="beginDrag" />
                </div>
                <div
                    v-for="(lane, i) in lanes"
                    :key="lane.key"
                    class="lane-track-row"
                    :style="{ gridRow: i + 2 }"
                >
                    <slot name="lane" :lane="lane" :index="i" :begin-drag="beginDrag" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
/** A lane: one row under the scrub row, keyed. The adapter's own data rides
 *  along (the slot hands the lane back). */
export interface LaneTrackLane {
    key: string | number;
}

/** A graduation of the one ruler: `at` is its place in the time column (%). A
 *  `null` label draws the line without a caption (a mark already says it). */
export interface LaneTrackTick {
    key: string | number;
    at: number;
    label: string | null;
}

/** A drag an adapter begins on one of its items: `move` receives the pointer's
 *  value in the track's domain (projected, clamped); returning `false` ends the
 *  gesture (the dragged item is gone). `end` runs once when it ends. */
export interface LaneTrackDrag {
    move: (value: number) => void | false;
    end?: () => void;
}

/** Begin a drag on an item from its own pointerdown. Returns the press's value
 *  in the domain (an adapter's grab offset reads it), or `null` when the press
 *  is declined (not primary, a pinch, no column to project onto). */
export type LaneTrackBeginDrag = (event: PointerEvent, drag: LaneTrackDrag) => number | null;

/**
 * The edge band (%): a mark within it of either end hangs inward, so a 0 % or
 * 100 % mark is never cut in half by a clipping rail. The band is 5 % of the
 * column, derived, not chosen (half a "100%" label, and the widest expanded
 * selected diamond, are each ≈5 % of the 400 px low end of `--rail-width`):
 * `docs/tranches/X/keyframes/evidence/W7/D-19-GEOMETRY-REDERIVATION.md`.
 */
export const LANE_EDGE_BAND = 5;
export type LaneEdge = "start" | "end" | "mid";
export const edgeOf = (position: number): LaneEdge =>
    position <= LANE_EDGE_BAND ? "start" : position >= 100 - LANE_EDGE_BAND ? "end" : "mid";
</script>

<script setup lang="ts" generic="L extends LaneTrackLane">
import { computed, shallowRef, useTemplateRef } from "vue";
import { useElementSize } from "@vueuse/core";
import { clamp } from "@mkbabb/value.js/math";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
    defineProps<{
        /** The scrub's accessible name, and its value (domain units) and text. */
        scrubLabel: string;
        value: number;
        valueText: string;
        min?: number;
        max?: number;
        /** The keyboard map: an arrow moves `step`; Shift+arrow and Page keys `pageStep`. */
        step?: number;
        pageStep?: number;
        /** The lanes under the scrub row (none: the scrub row is the one lane). */
        lanes?: readonly L[];
        /** The ruler's graduations, placed in the column (%). */
        ticks?: readonly LaneTrackTick[];
        /** The playhead's place in the column (%). */
        playhead: number;
        /** The column → domain map a pointer projects through (an adapter's
         *  zoom/pan inverse); default the linear [min, max] map. */
        unplace?: (position: number) => number;
        /** A label column beside the rows (the scrub row's and each lane's). */
        labelled?: boolean;
    }>(),
    { min: 0, max: 100, step: 1, pageStep: 10, lanes: () => [], ticks: () => [], labelled: false },
);

const emit = defineEmits<{
    (e: "scrubStart"): void;
    (e: "scrub", value: number): void;
    (e: "scrubEnd"): void;
}>();

defineSlots<{
    scrub?: (props: { beginDrag: LaneTrackBeginDrag }) => unknown;
    lane?: (props: { lane: L; index: number; beginDrag: LaneTrackBeginDrag }) => unknown;
    "scrub-label"?: () => unknown;
    "lane-label"?: (props: { lane: L; index: number }) => unknown;
}>();

const rows = computed(() => props.lanes.length + 1);

const hostEl = useTemplateRef<HTMLElement>("hostEl");
const columnEl = useTemplateRef<HTMLElement>("columnEl");
const { width: columnWidth } = useElementSize(columnEl);

/** KFA-172 — the playhead's whole-pixel offset along the column. */
const playheadPx = computed(() => Math.round((props.playhead / 100) * columnWidth.value));

/** Project a pointer onto the domain through the column. `null` — never an
 *  in-band value — when the column is not laid out: a failed projection moves
 *  nothing. */
const valueAt = (event: PointerEvent): number | null => {
    const column = columnEl.value;
    if (!column) return null;
    const rect = column.getBoundingClientRect();
    if (rect.width <= 0) return null;
    const position = ((event.clientX - rect.left) / rect.width) * 100;
    const value = props.unplace
        ? props.unplace(position)
        : props.min + (position / 100) * (props.max - props.min);
    return clamp(value, props.min, props.max);
};

// ── THE ONE POINTER POLICY (KF.W7 G2, carried from the keyframe rail) ────────
// • A gesture is EXPLICIT state, never inferred from `buttons`: a pointermove
//   that is not the live gesture's pointer does nothing, so a button-held
//   pointer entering the track (a text-selection drag begun elsewhere) moves
//   nothing.
// • Only a PRIMARY press (`isPrimary && button === 0`) begins a gesture; a
//   right/middle press neither scrubs nor captures (the context menu opens).
// • A second contact is a PINCH: it ends the live gesture and suppresses every
//   gesture until all contacts lift (the pinch belongs to an adapter's touch
//   handlers alone).
// • Capture is taken on the HOST — the one node no keyed re-render moves —
//   never on `event.target` (an item's transient node).
type Gesture =
    | { kind: "scrub"; pointerId: number }
    | { kind: "drag"; pointerId: number; drag: LaneTrackDrag };

const gesture = shallowRef<Gesture | null>(null);
const activePointers = new Set<number>();
let gestureSuppressed = false;

const finish = (live: Gesture) => {
    if (live.kind === "drag") live.drag.end?.();
    else emit("scrubEnd");
};

const endGesture = () => {
    const live = gesture.value;
    if (!live) return;
    gesture.value = null;
    const host = hostEl.value;
    if (host?.hasPointerCapture(live.pointerId)) host.releasePointerCapture(live.pointerId);
    finish(live);
};

/** Register a contact and say whether it may begin a gesture. */
const admitPress = (event: PointerEvent): boolean => {
    activePointers.add(event.pointerId);
    if (activePointers.size > 1) {
        gestureSuppressed = true;
        endGesture();
        return false;
    }
    return !gestureSuppressed && event.isPrimary && event.button === 0;
};

const beginGesture = (event: PointerEvent, next: Gesture): boolean => {
    const host = hostEl.value;
    if (!host) return false;
    host.setPointerCapture(event.pointerId);
    gesture.value = next;
    return true;
};

const beginDrag: LaneTrackBeginDrag = (event, drag) => {
    if (!admitPress(event)) return null;
    const value = valueAt(event);
    if (value === null) return null;
    if (!beginGesture(event, { kind: "drag", pointerId: event.pointerId, drag })) return null;
    return value;
};

/** A scrub sample. A column with no layout re-seats the CURRENT value — a
 *  no-op seek, never NaN and never an arbitrary in-band value. */
const scrubAt = (event: PointerEvent) => emit("scrub", valueAt(event) ?? props.value);

const onHostPointerDown = (event: PointerEvent) => {
    if (!admitPress(event)) return;
    if (!beginGesture(event, { kind: "scrub", pointerId: event.pointerId })) return;
    emit("scrubStart");
    scrubAt(event);
};

const onHostPointerMove = (event: PointerEvent) => {
    const live = gesture.value;
    if (!live || live.pointerId !== event.pointerId) return;
    if (live.kind === "scrub") {
        scrubAt(event);
        return;
    }
    const value = valueAt(event);
    if (value !== null && live.drag.move(value) === false) endGesture();
};

const onHostPointerUp = (event: PointerEvent) => {
    activePointers.delete(event.pointerId);
    if (activePointers.size === 0) gestureSuppressed = false;
    const live = gesture.value;
    if (live?.pointerId !== event.pointerId) return;
    gesture.value = null;
    finish(live);
};

// ── THE ONE KEYBOARD MAP ──────────────────────────────────────────────────────
// Only the host's own keys: an item's keydown (a marker, a re-time handle)
// bubbles here and is not a scrub.
const SCRUB_KEYS = new Set(["ArrowRight", "ArrowUp", "ArrowLeft", "ArrowDown", "PageUp", "PageDown", "Home", "End"]);

const onHostKeydown = (event: KeyboardEvent) => {
    if (event.target !== event.currentTarget || !SCRUB_KEYS.has(event.key)) return;
    const arrow = event.shiftKey ? props.pageStep : props.step;
    const next =
        event.key === "ArrowRight" || event.key === "ArrowUp"
            ? props.value + arrow
            : event.key === "ArrowLeft" || event.key === "ArrowDown"
              ? props.value - arrow
              : event.key === "PageUp"
                ? props.value + props.pageStep
                : event.key === "PageDown"
                  ? props.value - props.pageStep
                  : event.key === "Home"
                    ? props.min
                    : props.max;
    event.preventDefault();
    // A key press is a scrub gesture of one sample: it starts, seeks, and ends
    // on the key's release (or the host's blur).
    emit("scrubStart");
    emit("scrub", clamp(next, props.min, props.max));
};

const onHostKeyup = (event: KeyboardEvent) => {
    if (event.target === event.currentTarget && SCRUB_KEYS.has(event.key)) emit("scrubEnd");
};

defineExpose({ hostEl, columnEl });
</script>

<style scoped>
/* The ruler's label hangs ABOVE the first row by exactly the room the track
   reserves for it (ONE constant, read by both, D-14/i-1). An adapter insets
   the column (`--lane-track-inset`) so its widest end mark sits inside the
   track; the end labels reach back across the inset to the track's own ends. */
.lane-track {
    --lane-track-ruler: 1.25rem;
    --lane-track-inset: 0px;
    --lane-track-playhead-ink: var(--primary);
}
.lane-track[data-ruled] {
    margin-top: var(--lane-track-ruler);
}
/* With a label column, the labels and the rows share one grid: the host and
   its column take the rows as subgrids, so a label sits on its row. */
.lane-track--labelled {
    display: grid;
    grid-template-columns: max-content minmax(0, 1fr);
    column-gap: 0.75rem;
    align-items: center;
}
.lane-track-label {
    grid-column: 1;
    white-space: nowrap;
}
.lane-track-scrub {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: repeat(v-bind(rows), minmax(0, 1fr));
}
.lane-track--labelled > .lane-track-scrub {
    grid-column: 2;
    grid-template-rows: subgrid;
    align-self: stretch;
}
.lane-track-column {
    position: relative;
    grid-row: 1 / -1;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: subgrid;
    margin-inline: var(--lane-track-inset);
}
.lane-track-row {
    position: relative;
    grid-column: 1;
    min-width: 0;
}
.lane-track-playhead {
    background: var(--lane-track-playhead-ink);
}
.lane-track-tick-label {
    top: calc(-1 * var(--lane-track-ruler));
    translate: -50% 0;
    /* figures in the mono register, as written (no caption uppercasing) */
    text-transform: none;
}
.lane-track-tick-label[data-edge="start"] {
    translate: calc(-1 * var(--lane-track-inset)) 0;
}
.lane-track-tick-label[data-edge="end"] {
    translate: calc(-100% + var(--lane-track-inset)) 0;
}
</style>
