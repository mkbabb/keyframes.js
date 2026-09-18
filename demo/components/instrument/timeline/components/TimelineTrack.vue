<template>
    <div class="flex flex-col gap-3">
        <!-- Zoom mini range bar -->
        <div
            v-if="zoomLevel > 1"
            class="flex items-center gap-2"
        >
            <div class="relative flex-1 h-1.5 rounded-full bg-muted/50 border border-border/30">
                <div
                    class="absolute top-0 h-full rounded-full bg-primary/40"
                    :style="{
                        left: `${(panOffset / 100) * 100}%`,
                        width: `${(100 / zoomLevel / 100) * 100}%`,
                    }"
                ></div>
            </div>
            <span class="text-small text-muted-foreground shrink-0">{{ zoomLevel.toFixed(1) }}x</span>
        </div>

        <!-- Timeline Track -->
        <div
            ref="trackEl"
            :class="[
                'timeline-track relative rounded-lg border border-border bg-muted/50 hover:bg-muted/70 transition-all duration-fast cursor-pointer select-none overflow-x-clip overflow-y-visible touch-none',
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
            @wheel.prevent="onWheel"
            @touchstart.passive="onTouchStart"
            @touchmove.passive="onTouchMove"
            @touchend.passive="onTouchEnd"
        >
            <!-- Tick marks -->
            <div
                v-for="tick in visibleTicks"
                :key="tick"
                class="absolute top-0 h-full border-l border-border/30"
                :style="{ left: `${percentToPosition(tick)}%` }"
            >
                <span
                    :class="[
                        'text-small absolute -top-5 left-0 text-muted-foreground whitespace-nowrap',
                        percentToPosition(tick) <= 2 ? 'translate-x-0' : percentToPosition(tick) >= 98 ? '-translate-x-full' : '-translate-x-1/2',
                    ]"
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
                            'keyframe-marker absolute top-1/2 -translate-x-1/2 -translate-y-1/2 z-controls',
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
                :is-selected="isStopSelected(stop)"
                @commit-percent="(p) => moveStop(stop.keyframes.map((kf) => kf.id), p)"
                @select="emit('select', selectionIdFor(stop))"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, shallowRef, useTemplateRef } from "vue";
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

/** The partition the engine compiles from (KF.W7 G5) — rendered, never re-derived. */
const stops = computed(() => coalesceKeyframes(props.sortedKeyframes));

const isStopSelected = (stop: TimelineStop): boolean =>
    stop.keyframes.some((kf) => kf.id === props.selectedKeyframeId);

/** Selecting a stop keeps its already-selected member, else takes its head. */
const selectionIdFor = (stop: TimelineStop): string =>
    stop.keyframes.find((kf) => kf.id === props.selectedKeyframeId)?.id ??
    stop.keyframes[0].id;

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
    if (!trackEl.value) return null;
    const rect = trackEl.value.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const posPercent = (x / rect.width) * 100;
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
    margin-top: 1.25rem;
    margin-bottom: 1rem;
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
