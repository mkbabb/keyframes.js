<template>
    <div class="flex flex-col gap-3">
        <!-- Zoom / pan row. The row is ALWAYS MOUNTED and reserves its height
             (D-11): it used to appear on `zoomLevel > 1`, and `zoomLevel` is
             continuous through 1.0 in both directions, so the ~32px row
             materialised mid-gesture and shoved the track it measures.
             The bar is an OPERABLE scrollbar, not a readout (M-7 + RR-B
             missed-4): pan had exactly three writers — the zoom recentre,
             shift-wheel, and `clampPan` — and no drag, no click-to-jump and no
             keyboard route, so the only pan readout was inert while the only
             pan gesture read one axis. It is also the pan writer ARB-1's
             auto-pan needs to exist at all. -->
        <div
            class="timeline-pan-row flex items-center gap-2 transition-opacity duration-fast"
            :class="zoomLevel > 1 ? 'opacity-100' : 'opacity-0'"
            :aria-hidden="zoomLevel > 1 ? undefined : 'true'"
        >
            <div
                ref="panBarEl"
                class="timeline-pan-bar relative flex-1 h-1.5 rounded-full bg-muted/50 border border-border/30 cursor-grab"
                role="scrollbar"
                aria-orientation="horizontal"
                aria-label="Timeline window — pan"
                aria-valuemin="0"
                aria-valuemax="100"
                :aria-valuenow="Math.round(panOffset)"
                :aria-valuetext="`${Math.round(panOffset)}% to ${Math.round(panOffset + 100 / zoomLevel)}%`"
                :aria-controls="railId"
                :tabindex="zoomLevel > 1 ? 0 : -1"
                @keydown="onPanKeydown"
                @pointerdown="onPanPointerDown"
                @pointermove="onPanPointerMove"
                @pointerup="onPanPointerUp"
                @pointercancel="onPanPointerUp"
                @lostpointercapture="onPanPointerUp"
            >
                <div
                    class="timeline-pan-thumb absolute top-0 h-full rounded-full bg-primary/40"
                    :style="{ left: `${panOffset}%`, width: `${100 / zoomLevel}%` }"
                ></div>
            </div>
            <span class="timeline-zoom-readout text-small text-muted-foreground shrink-0 tabular-nums">{{ zoomLevel.toFixed(1) }}x</span>
        </div>

        <!-- Timeline Track -->
        <div
            :id="railId"
            ref="trackEl"
            :data-expanded="expanded ? 'true' : undefined"
            :class="[
                'timeline-track relative rounded-lg border border-border bg-muted/50 hover:bg-muted/70 transition-colors duration-fast cursor-pointer select-none overflow-x-clip overflow-y-visible touch-pan-y',
                expanded ? 'h-32' : 'h-12',
            ]"
            role="slider"
            tabindex="0"
            aria-label="Playhead — scrub the animation"
            aria-orientation="horizontal"
            aria-valuemin="0"
            aria-valuemax="100"
            :aria-valuenow="Math.round(scrubT * 100)"
            :aria-valuetext="`${Math.round(scrubT * 100)}%`"
            @keydown="onTrackKeydown"
            @pointerdown="onTrackPointerDown"
            @pointermove="onTrackPointerMove"
            @pointerup="onTrackPointerUp"
            @pointercancel="onTrackPointerUp"
            @lostpointercapture="onTrackPointerUp"
            @wheel="onTrackWheel"
            @touchstart.passive="onTouchStart"
            @touchmove.passive="onTouchMove"
            @touchend.passive="onTouchEnd"
        >
            <!-- Tick marks. The label hangs ABOVE the rail by exactly the
                 margin the rail reserves for it — one constant, declared once
                 in this file's scoped block and read by both (D-14/i-1: the two
                 were the same magic number 174 lines apart with nothing stating
                 the coupling). C-9's contract, said at the node that needs it:
                 the labels are why this subtree is provisioned
                 `overflow-y-visible` while the rail clips in x. -->
            <div
                v-for="tick in visibleTicks"
                :key="tick"
                class="absolute top-0 h-full border-l border-border/30"
                :style="{ left: `${percentToPosition(tick)}%` }"
            >
                <span
                    class="timeline-tick-label text-small absolute left-0 text-muted-foreground whitespace-nowrap"
                    :class="edgeClass(percentToPosition(tick))"
                >{{ tick }}%</span>
            </div>

            <!-- Playhead -->
            <div
                class="absolute top-0 h-full w-0.5 bg-primary z-content pointer-events-none"
                :style="{ left: `${percentToPosition(scrubT * 100)}%` }"
            ></div>

            <!-- Keyframe markers — ONE PER STOP (KF.W7 G5: the partition the
                 engine compiles from; keyframes sharing a selector are one rule
                 in the animation, so they are one marker that SAYS how many it
                 holds). Each a keyboard-accessible slider (the SpringTarget
                 role="slider" template): drag OR arrow-key the stop along the
                 0–100% track. The visible diamond keeps its 16/24px size; an
                 invisible ≥24px hit pad (::before) meets the touch-target
                 minimum without moving a pixel of the diamond. Keyed by the
                 stop's head id, which is stable across a drag. -->
            <Tooltip v-for="stop in stops" :key="stop.keyframes[0].id">
                <TooltipTrigger as-child>
                    <div
                        :class="[
                            'keyframe-marker absolute top-1/2 -translate-y-1/2 z-controls',
                            edgeClass(percentToPosition(stop.percent)),
                            expanded ? 'w-6 h-6' : 'w-4 h-4',
                            'rotate-45 rounded-sm cursor-grab',
                            'border-2 transition-all',
                            isStopSelected(stop)
                                ? 'bg-primary border-primary scale-125'
                                : 'bg-background border-foreground/50 hover:border-primary scale-on-hover',
                        ]"
                        :id="`timeline-marker-${stop.keyframes[0].id}`"
                        role="slider"
                        :aria-label="stopLabel(stop)"
                        :aria-valuenow="Math.round(stop.percent)"
                        :aria-valuetext="`${Math.round(stop.percent)}%`"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        :data-state="isStopSelected(stop) ? 'selected' : undefined"
                        tabindex="0"
                        :style="{ left: `${percentToPosition(stop.percent)}%` }"
                        @pointerdown.stop="onMarkerPointerDown($event, stop)"
                        @keydown="onMarkerKeydown($event, stop)"
                        @mouseenter="emit('diamondHover', stop.keyframes[0])"
                    >
                        <!-- Said so: a multi-member stop wears its count. -->
                        <span
                            v-if="stop.keyframes.length > 1"
                            class="stop-count absolute -top-2.5 -right-3 -rotate-45 rounded-full bg-primary px-1 text-mono-caption leading-none tabular-nums text-primary-foreground"
                            aria-hidden="true"
                            >×{{ stop.keyframes.length }}</span
                        >
                    </div>
                </TooltipTrigger>
                <TooltipContent side="top" :side-offset="8" class="p-2 max-w-56">
                    <TimelineHoverPreview
                        :keyframe="stop.keyframes[0]"
                        :preview-src="previewCache[stop.keyframes[0].id]"
                        :loading="previewLoading[stop.keyframes[0].id]"
                        :ghost-style="getGhostStyle(stop.vars)"
                    />
                </TooltipContent>
            </Tooltip>

            <!-- Timeline Carets — one per stop, same partition -->
            <TimelineCaret
                v-for="stop in stops"
                :key="'caret-' + stop.keyframes[0].id"
                :keyframe-id="stop.keyframes[0].id"
                :percent="stop.percent"
                :position="percentToPosition(stop.percent)"
                :edge="edgeOf(percentToPosition(stop.percent))"
                :is-selected="isStopSelected(stop)"
                @commit-percent="(p) => moveStop(stop.keyframes.map((kf) => kf.id), p)"
                @select="emit('select', selectionIdFor(stop))"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, shallowRef, useId, useTemplateRef } from "vue";
import { Tooltip, TooltipContent, TooltipTrigger } from "@mkbabb/glass-ui/tooltip";
import { clamp } from "@mkbabb/value.js/math";
import { useZoomPan } from "../composables/useZoomPan";
import TimelineCaret from "../TimelineCaret.vue";
import TimelineHoverPreview from "./TimelineHoverPreview.vue";
import { coalesceKeyframes } from "../timelineTypes";
import type { TimelineKeyframe, TimelineStop } from "../timelineTypes";

const props = defineProps<{
    sortedKeyframes: TimelineKeyframe[];
    scrubT: number;
    expanded?: boolean;
    selectedKeyframeId: string | null;
    previewCache: Record<string, string>;
    previewLoading: Record<string, boolean>;
}>();

const emit = defineEmits<{
    (e: "update:scrubT", value: number): void;
    (e: "moveKeyframe", id: string, percent: number): void;
    (e: "select", id: string): void;
    (e: "diamondHover", kf: TimelineKeyframe): void;
}>();

const trackEl = useTemplateRef<HTMLElement>("trackEl");
const panBarEl = useTemplateRef<HTMLElement>("panBarEl");
/** The rail's id — what the pan scrollbar declares it controls. */
const railId = useId();

/** The partition the engine compiles from (KF.W7 G5) — rendered, never re-derived. */
const stops = computed(() => coalesceKeyframes(props.sortedKeyframes));

const isStopSelected = (stop: TimelineStop): boolean =>
    stop.keyframes.some((kf) => kf.id === props.selectedKeyframeId);

/** Selecting a stop keeps its already-selected member, else takes its head. */
const selectionIdFor = (stop: TimelineStop): string =>
    stop.keyframes.find((kf) => kf.id === props.selectedKeyframeId)?.id ??
    stop.keyframes[0].id;

/**
 * EDGE AWARENESS — one band for every mark on the rail (M1 + D-m2).
 *
 * The rail clips in x (`overflow-x-clip`, deliberate and kept, S-1/S-2/S-3), so
 * a mark at 0% or 100% — the two positions a keyframe timeline almost always
 * occupies — was cut in half. The tick LABELS got three-way edge handling in
 * this same file and the markers and carets did not; that asymmetry is the
 * proof of oversight, so they share the handling now.
 *
 * The band is 5% of the rail, and it is derived, not chosen: half a "100%"
 * label is ≈5% of the 400px low end of `--rail-width` `clamp(25rem, 33svi,
 * 32rem)` (400–512px), and the widest mark — the expanded, selected diamond —
 * is 24 × √2 ÷ 2 × 1.25 = 21.21px = 5.3% of the same rail. The old 2%/98%
 * pair was sized for a ~1025px rail that does not exist here (D-m2: re-tune the
 * constant, never delete the mechanism). Full derivation:
 * `docs/tranches/X/keyframes/evidence/W7/D-19-GEOMETRY-REDERIVATION.md`.
 */
const EDGE_BAND = 5;

type MarkEdge = "start" | "end" | "mid";

const edgeOf = (position: number): MarkEdge =>
    position <= EDGE_BAND ? "start" : position >= 100 - EDGE_BAND ? "end" : "mid";

const edgeClass = (position: number): string =>
    ({
        start: "translate-x-0",
        end: "-translate-x-full",
        mid: "-translate-x-1/2",
    })[edgeOf(position)];

const stopLabel = (stop: TimelineStop): string => {
    const p = Math.round(stop.percent);
    const n = stop.keyframes.length;
    return n === 1
        ? `Keyframe at ${p}% — drag or arrow to move`
        : `${n} keyframes at ${p}% (one rule in the animation) — drag or arrow to move`;
};

/** A stop moves as one: every member to the same percent. */
const moveStop = (ids: readonly string[], percent: number) => {
    for (const id of ids) emit("moveKeyframe", id, percent);
};

const {
    zoomLevel,
    panOffset,
    percentToPosition,
    positionToPercent,
    zoomBy,
    panBy,
    panTo,
    visibleTicks,
    onWheel,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
} = useZoomPan(trackEl);

const getGhostStyle = (vars: Record<string, string>): Record<string, string> => {
    const style: Record<string, string> = {};
    if (vars["background-color"]) style.backgroundColor = vars["background-color"];
    if (vars["opacity"]) style.opacity = vars["opacity"];
    if (vars["transform"]) style.transform = `scale(0.3) ${vars["transform"]}`;
    if (vars["border-radius"]) style.borderRadius = vars["border-radius"];
    return style;
};

/**
 * Project a pointer onto the model's 0–100 percent. `null` — never an in-band
 * `0` — when the rail is not mounted: a failed projection scrubs nowhere.
 */
const getPercentFromPointer = (event: PointerEvent): number | null => {
    const rail = trackEl.value;
    if (!rail) return null;
    // ONE BOX FOR BOTH MAPS (RR-B missed-5 / banked D-20). `left: N%` on every
    // mark resolves against the rail's PADDING box, while
    // `getBoundingClientRect` returns its BORDER box — so pointer→percent and
    // percent→pixel disagreed by a fixed one-border origin and two-border span
    // skew that grows with any border change. The borders are measured, not
    // assumed, so the maps stay agreed whatever the token says.
    const rect = rail.getBoundingClientRect();
    const style = getComputedStyle(rail);
    const borderLeft = parseFloat(style.borderLeftWidth) || 0;
    const borderRight = parseFloat(style.borderRightWidth) || 0;
    const width = rect.width - borderLeft - borderRight;
    if (width <= 0) return null;
    const posPercent = ((event.clientX - rect.left - borderLeft) / width) * 100;
    return clamp(positionToPercent(posPercent), 0, 100);
};

// --- The pointer policy (KF.W7 G2) — ONE gesture, ONE policy, whole handler set ---
//
// • A gesture is EXPLICIT state (`gesture`), never inferred from `buttons`: a
//   pointermove that is not the live gesture's pointer does nothing, so a
//   button-held pointer ENTERING the band (a text-selection drag begun
//   elsewhere) scrubs nothing.
// • Only a PRIMARY press (`isPrimary && button === 0`) begins a gesture. A
//   right/middle press neither scrubs nor captures — the context menu opens.
// • A second contact is a PINCH: it ends the live gesture and suppresses every
//   gesture until all contacts lift; the pinch belongs to the touch handlers
//   (zoom) alone. The primary finger does not scrub under a pinch.
// • Capture is taken on the RAIL — the element that owns every gesture and the
//   one node here that no keyed re-render moves — never on `event.target`
//   (a caret's transient node, a marker whose stop head may change mid-drag).
// • A drag carries its GRAB OFFSET (`grabDx`, in model percent). A grab is not
//   a teleport: the pointer lands up to ~12px off the mark's centre inside the
//   24px pad — ~3% of the 400–512px rail at z=1, itself 3× the component's own
//   finest keyboard increment — and projecting the bare pointer percent would
//   jump the keyframe there before the first move. The offset is captured once,
//   at pointerdown, and subtracted on every move (GradientStopEditor C11/G5 is
//   the severity precedent, not the identity).
type Gesture =
    | { kind: "scrub"; pointerId: number }
    | { kind: "drag"; pointerId: number; ids: string[]; grabDx: number };

const gesture = shallowRef<Gesture | null>(null);
const activePointers = new Set<number>();
let gestureSuppressed = false;

const acceptsPress = (event: PointerEvent): boolean =>
    event.isPrimary && event.button === 0;

const endGesture = () => {
    const live = gesture.value;
    if (!live) return;
    gesture.value = null;
    const rail = trackEl.value;
    if (rail?.hasPointerCapture(live.pointerId)) {
        rail.releasePointerCapture(live.pointerId);
    }
};

/**
 * Register a contact and say whether it may begin a gesture. A second contact
 * (pinch) ends the live gesture and suppresses until every contact lifts; a
 * non-primary press is declined.
 */
const admitPress = (event: PointerEvent): boolean => {
    activePointers.add(event.pointerId);
    if (activePointers.size > 1) {
        gestureSuppressed = true;
        endGesture();
        return false;
    }
    return !gestureSuppressed && acceptsPress(event);
};

const beginGesture = (event: PointerEvent, next: Gesture): boolean => {
    const rail = trackEl.value;
    if (!rail) return false;
    rail.setPointerCapture(event.pointerId);
    gesture.value = next;
    return true;
};

const onTrackPointerDown = (event: PointerEvent) => {
    if (!admitPress(event)) return;
    const percent = getPercentFromPointer(event);
    if (percent === null) return;
    if (!beginGesture(event, { kind: "scrub", pointerId: event.pointerId })) return;
    emit("update:scrubT", percent / 100);
};

const onTrackPointerMove = (event: PointerEvent) => {
    const live = gesture.value;
    if (!live || live.pointerId !== event.pointerId) return;
    const percent = getPercentFromPointer(event);
    if (percent === null) return;
    if (live.kind === "drag") {
        // The dragged set is reconciled against the LIVE collection every move:
        // a mid-drag delete, undo or import leaves the latched id dangling, and
        // the sink's `find` would no-op in silence (L-m-14). An empty set ends
        // the gesture instead — one identity policy with L-8/C-9.
        const ids = live.ids.filter((id) =>
            props.sortedKeyframes.some((kf) => kf.id === id),
        );
        if (ids.length === 0) {
            endGesture();
            return;
        }
        if (ids.length !== live.ids.length) gesture.value = { ...live, ids };
        moveStop(ids, clamp(percent - live.grabDx, 0, 100));
        return;
    }
    emit("update:scrubT", percent / 100);
};

/** pointerup · pointercancel · lostpointercapture — the contact is gone. */
const onTrackPointerUp = (event: PointerEvent) => {
    activePointers.delete(event.pointerId);
    if (activePointers.size === 0) gestureSuppressed = false;
    if (gesture.value?.pointerId === event.pointerId) gesture.value = null;
};

/**
 * The playhead's KEYBOARD route (D-1). Scrubbing had none anywhere in the tree:
 * a bare `div` with six pointer listeners and a `@wheel`, no role, no tabindex,
 * no keydown — and `defineExpose` published neither `scrub` nor `scrubT`, so no
 * ancestor could drive it either. The emit is the SAME one the pointer uses, so
 * the wire stays ONE (`KeyframeTimeline` → `scrub`), and with the playhead
 * reachable the ribbon's argless `snapshot()` finally captures at the keyboard
 * user's position instead of always at 0% — the row's one adopted harm.
 *
 * Only the rail's OWN keystrokes are read: a marker's arrows retime a keyframe
 * and the caret's editor types numbers, and neither may also scrub.
 */
const onTrackKeydown = (event: KeyboardEvent) => {
    if (event.target !== event.currentTarget) return;

    const percent = props.scrubT * 100;
    const step = event.shiftKey ? 10 : 1;
    let next: number | null = null;

    switch (event.key) {
        case "ArrowRight":
        case "ArrowUp":
            next = percent + step;
            break;
        case "ArrowLeft":
        case "ArrowDown":
            next = percent - step;
            break;
        case "PageUp":
            next = percent + 10;
            break;
        case "PageDown":
            next = percent - 10;
            break;
        case "Home":
            next = 0;
            break;
        case "End":
            next = 100;
            break;
        // The zoom's keyboard route (D-11): wheel and pinch were its only
        // gestures, so zoom was unreachable without a pointer.
        case "+":
        case "=":
            event.preventDefault();
            zoomBy(1.25);
            return;
        case "-":
        case "_":
            event.preventDefault();
            zoomBy(1 / 1.25);
            return;
    }

    if (next === null) return;
    event.preventDefault();
    emit("update:scrubT", clamp(next, 0, 100) / 100);
};

/**
 * ONE WHEEL POLICY: prevent only on CONSUMED events. `useZoomPan.onWheel` says
 * whether it consumed the wheel (ctrl/⌘ zoom, shift pan); a plain wheel is
 * consumed by nobody and reaches the ancestor, which is what scrolls the pane
 * the instrument lives in. The old `@wheel.prevent` cancelled the page's scroll
 * BEFORE the handler could decide, and `touch-none` removed the touch escape on
 * top of it — hence `touch-pan-y`: the rail owns the horizontal gestures, the
 * page keeps the vertical one.
 */
const onTrackWheel = (event: WheelEvent) => {
    if (onWheel(event)) event.preventDefault();
};

/** The pan window's own keyboard route — a step is a tenth of the window. */
const onPanKeydown = (event: KeyboardEvent) => {
    const step = (event.shiftKey ? 50 : 10) / zoomLevel.value;
    switch (event.key) {
        case "ArrowRight":
        case "ArrowUp":
            panBy(step);
            break;
        case "ArrowLeft":
        case "ArrowDown":
            panBy(-step);
            break;
        case "Home":
            panTo(0, 0);
            break;
        case "End":
            panTo(100, 1);
            break;
        default:
            return;
    }
    event.preventDefault();
};

/** Click-to-jump and drag-to-pan on the window bar (the same projection). */
const panFromPointer = (event: PointerEvent) => {
    const bar = panBarEl.value;
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    if (rect.width === 0) return;
    panTo(clamp((event.clientX - rect.left) / rect.width, 0, 1) * 100, 0.5);
};

let panPointerId: number | null = null;

const onPanPointerDown = (event: PointerEvent) => {
    if (!acceptsPress(event) || zoomLevel.value <= 1) return;
    panPointerId = event.pointerId;
    panBarEl.value?.setPointerCapture(event.pointerId);
    panFromPointer(event);
};

const onPanPointerMove = (event: PointerEvent) => {
    if (panPointerId !== event.pointerId) return;
    panFromPointer(event);
};

const onPanPointerUp = (event: PointerEvent) => {
    if (panPointerId !== event.pointerId) return;
    panPointerId = null;
};

const onMarkerPointerDown = (event: PointerEvent, stop: TimelineStop) => {
    if (!admitPress(event)) return;
    const percent = getPercentFromPointer(event);
    if (percent === null) return;
    if (
        !beginGesture(event, {
            kind: "drag",
            pointerId: event.pointerId,
            ids: stop.keyframes.map((kf) => kf.id),
            grabDx: percent - stop.percent,
        })
    ) {
        return;
    }
    emit("select", selectionIdFor(stop));
};

/**
 * Keyboard slider control — mirrors SpringTarget's arrow/Home/End template.
 * Arrows step ±1% (±10% with Shift), Home/End jump to the rail ends; the
 * percent is clamped 0–100 by `moveKeyframe`. A stop moves as one.
 */
const onMarkerKeydown = (event: KeyboardEvent, stop: TimelineStop) => {
    // NON-DESTRUCTIVE SELECTION (M3). A bare `div` synthesizes no click, so
    // Enter and Space fell through and a keyboard user could not select a
    // keyframe without retiming it — every inspection keystroke landed in the
    // debounced undo history, while a pointer user got selection two ways.
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        emit("select", selectionIdFor(stop));
        return;
    }

    const step = event.shiftKey ? 10 : 1;
    let next: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") next = stop.percent + step;
    else if (event.key === "ArrowLeft" || event.key === "ArrowDown") next = stop.percent - step;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = 100;
    if (next === null) return;
    event.preventDefault();
    emit("select", selectionIdFor(stop));
    moveStop(
        stop.keyframes.map((kf) => kf.id),
        clamp(next, 0, 100),
    );
};
</script>

<style scoped>
.timeline-track {
    /* The tick labels hang above the rail; the rail reserves exactly that much
       room for them. ONE constant, read by both (D-14/i-1). */
    --timeline-tick-label-offset: 1.25rem;

    /* The caret's clearance below the mark's centre line, re-derived at the
       bytes (OP-3 / D-19). The global `--caret-offset` is 14px, which clears
       NOTHING when the diamond is expanded: at `h-32` the padding box is 126px,
       its centre line 63px, and a selected (`scale-125`) 24px diamond reaches
       63 + 24·√2÷2·1.25 = 84.21px — 7.21px BELOW the caret's top. Collapsed it
       is a 0.14px hairline overlap. These two values clear the worst case by
       ~1.8px in both states; `layout.css` owns the global token and is not
       touched. */
    --timeline-caret-offset: 16px;

    margin-top: var(--timeline-tick-label-offset);
    margin-bottom: 1rem;
}

.timeline-track[data-expanded] {
    --timeline-caret-offset: 23px;
}

.timeline-tick-label {
    top: calc(-1 * var(--timeline-tick-label-offset));
}

.keyframe-marker {
    transition:
        transform var(--duration-fast) var(--ease-standard),
        border-color var(--duration-fast) var(--ease-standard);
}

/* Invisible ≥24px pointer/touch pad centered on the diamond — meets the
   minimum touch-target size for the 16px collapsed diamond without changing
   the visible mark (the pad inherits pointer/keyboard events for the marker;
   it counter-rotates so its box is axis-aligned, not a 24px diamond). */
.keyframe-marker::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 24px;
    height: 24px;
    transform: translate(-50%, -50%) rotate(-45deg);
}

.keyframe-marker:active {
    cursor: grabbing;
}
</style>
