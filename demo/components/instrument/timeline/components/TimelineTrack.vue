<template>
    <!-- RR-A missed-1 — THE INSTRUMENT'S ACCESSIBLE CONTAINER.
         The rail's hosts were unnamed and unrelated in the AT tree: N
         `role="slider"` markers, a `role="scrollbar"` pan bar and the rail
         itself sat as siblings in generic divs, so a browse-mode reader met a
         run of anonymous sliders with nothing saying they belonged to one
         timeline. One group, named once, is the whole cure.
         ANCHOR DRIFT, RECORDED (D-19): the row names `:21-35` — the rail
         element — and that element has since taken `role="slider"` as G8's
         keyboard-scrub cure (`aria-label="Playhead — scrub the animation"`,
         asserted by `timeline-mount-keyboard.test.ts`). One element carries one
         role, so the group lands on the rail's CONTAINER, which is what the
         gate asks for in its own words ("the rail has an accessible
         container"). The nested-slider structure that drift leaves behind is
         DECLARED, not silently inherited: see the note at the rail below. -->
    <div class="flex flex-col" role="group" aria-label="Keyframe timeline">
        <!-- Zoom / pan row. The row is ALWAYS MOUNTED and reserves its height
             (D-11): it used to appear on `zoomLevel > 1`, and `zoomLevel` is
             continuous through 1.0 in both directions, so the ~32px row
             materialised mid-gesture and shoved the track it measures.
             The bar is an OPERABLE scrollbar, not a readout (M-7 + RR-B
             missed-4): pan had exactly three writers — the zoom recentre,
             shift-wheel, and `clampPan` — and no drag, no click-to-jump and no
             keyboard route, so the only pan readout was inert while the only
             pan gesture read one axis. It is also the pan writer ARB-1's
             auto-pan needs to exist at all.
             D-5 (TimelineTrack) — THE ZOOM/PAN INDICATOR'S RUNG. The bar is the
             ONLY rendering of pan position and it failed SC 1.4.11 in both arms
             through two alphas: a `/30` outline and a `/40` fill. Both are gone
             for full-strength tokens under the rung this wave gives every 1.4.11
             mark — `--muted-foreground` for the boundary, `--primary` for the
             thumb — because an alpha multiplies whatever the token resolved to
             and therefore caps the ratio below any theme's reach. This row RIDES
             D-7's residue row for its painted figures and is never measured
             separately (the single-measurement-site lock). -->
        <!-- UIA-KF-180 — at zoom 1 the row held a ~22px dead band between the
             stage and the tick labels in every resting frame. It now COLLAPSES
             (grid rows 0fr → 1fr, eased), so there is no reserved space when
             there is nothing to pan, and it still never pops in mid-gesture:
             it eases open instead of materialising (D-11's concern). -->
        <div
            class="timeline-pan-collapse grid transition-[grid-template-rows] duration-fast ease-standard"
            :class="zoomLevel > 1 ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
        >
        <div class="min-h-0 overflow-hidden">
        <div
            class="timeline-pan-row flex items-center gap-2 pb-3 transition-opacity duration-fast"
            :class="zoomLevel > 1 ? 'opacity-100' : 'opacity-0'"
            :aria-hidden="zoomLevel > 1 ? undefined : 'true'"
        >
            <div
                ref="panBarEl"
                class="kf-focus-ring timeline-pan-bar relative flex-1 h-1.5 rounded-full bg-muted/50 border border-muted-foreground cursor-grab"
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
                    class="timeline-pan-thumb absolute top-0 h-full rounded-full bg-primary"
                    :style="{ left: `${panOffset}%`, width: `${100 / zoomLevel}%` }"
                ></div>
            </div>
            <!-- TimelineTrack D-3 (+ M10's size half) — the two numeric readouts
                 here rode the proportional stack while every sibling readout
                 (caret, hover caption, header) obeys the Mono-as-data law. They
                 take the demo's numeric idiom, ONE register for role (c):
                 `text-mono-caption tabular-nums` — the same rung the header's
                 percent and the caret's readout wear, so the rail no longer sets
                 its decorative ticks a rung ABOVE the editable percent (M10's
                 inversion). The tick band above the rail reserves 1.25rem; the
                 caption rung's box is smaller than the one it replaces, so the
                 reservation still holds. The `toFixed(1)` micro-note ("1.0x"
                 beside a bar whose own guard says otherwise) is carried, not
                 cured here. -->
            <span class="timeline-zoom-readout text-mono-caption text-muted-foreground shrink-0 tabular-nums">{{ zoomLevel.toFixed(1) }}x</span>
        </div>
        </div>
        </div>

        <!-- Timeline Track.
             D-7 (KeyframeTimeline) — THE RAIL'S BOUNDARY, cured at the file the
             subject has lived in since `81a56990` (the row is record-qualified
             to kf-KeyframeTimeline; its bytes are here, and the anchor is
             recorded rather than re-homed). This is the instrument's PRIMARY
             interactive surface and it had no perceivable boundary in either
             theme: the fill sits within a hair of the card it lies on, and
             `--border` — the decorative hairline token — carried the perimeter,
             which is the same reading in both arms and under both of the rail's
             modes (expanded strips the Card plate entirely). What 1.4.11 governs
             here is the BOUNDARY, not the fill, so the boundary alone takes the
             real rung and the fill's hover step is left exactly as authored.
             Painted composites stay KF.W9/SS-13's single measurement site.

             DECLARED, NOT SWALLOWED (RR-A missed-1's residue) — this element is
             `role="slider"` (G8's keyboard scrub) and it CONTAINS the N marker
             sliders and their carets. `slider` is a Children-Presentational
             role, so a strict user agent may prune its interactive descendants
             from the AT tree; separating the two would mean moving the playhead
             role off `.timeline-track` (which `timeline-mount-keyboard.test.ts`
             pins) or lifting the markers out of the element whose scoped block
             declares `--timeline-hit-floor` and `--timeline-caret-gap` for
             them. Neither is this gate's cure and neither is spent here. -->

        <!-- ESC-W13X-tl-1 — the rail is the one LaneTrack (its scrub row is
             this timeline's one lane): the ruler, the whole-pixel playhead, the
             scrub's keyboard map and the one pointer policy are the primitive's;
             this adapter supplies the percent domain through its zoom/pan map
             and paints the stops (markers, carets) in the scrub row. -->
        <LaneTrack
            ref="laneTrack"
            :id="railId"
            :data-expanded="expanded ? 'true' : undefined"
            :class="[
                'kf-focus-ring timeline-track relative rounded-[var(--radius-field)] border border-border bg-muted/50 hover:bg-muted/70 transition-colors duration-fast cursor-pointer select-none overflow-x-clip overflow-y-visible touch-pan-y',
                expanded ? 'h-32' : 'h-12',
            ]"
            scrub-label="Playhead — scrub the animation"
            :value="scrubT * 100"
            :value-text="`${Math.round(scrubT * 100)}%`"
            :ticks="ticks"
            :playhead="percentToPosition(scrubT * 100)"
            :unplace="positionToPercent"
            @scrub="(percent: number) => emit('update:scrubT', percent / 100)"
            @keydown="onZoomKeydown"
            @wheel="onTrackWheel"
            @touchstart.passive="onTouchStart"
            @touchmove.passive="onTouchMove"
            @touchend.passive="onTouchEnd"
        >
            <template #scrub="{ beginDrag }">
                    <Tooltip v-for="stop in stops" :key="stop.keyframes[0].id">
                        <!-- D-10 (KeyframeTimeline) — ONE CAPTURE SEAM, BOTH
                             MODALITIES. The capture was armed on the marker's
                             `@mouseenter` ALONE, while the tooltip opens on FOCUS too
                             (reka's `TooltipTrigger` wires `focus` straight to
                             `onOpen`). A keyboard user therefore opened the panel and
                             got the ghost branch forever — the preview entry for their
                             keyframe was never requested, by anything. Hover and focus
                             now ask the same question; the emit NAME is kept, because
                             renaming it is not the cure. -->
                        <TooltipTrigger as-child>
                            <div
                                :class="[
                                    'kf-focus-ring keyframe-marker absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-controls',
                                    expanded ? 'w-6 h-6' : 'w-4 h-4',
                                    'rotate-45 rounded-sm cursor-grab',
                                    'border-2',
                                    isStopSelected(stop)
                                        ? 'bg-primary border-primary scale-125 hover:ring-2 hover:ring-primary/40'
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
                                @pointerdown.stop="onMarkerPointerDown($event, stop, beginDrag)"
                                @keydown="onMarkerKeydown($event, stop)"
                            >
                                <!-- X-DS pass 5 (KF-C5-03) — a multi-member stop's
                                     count is NOT worn on the diamond: the Badge
                                     (about 30x20 on a 16px mark) covered it docked
                                     and left half of it as a stray chevron
                                     unfolded. The count reads in the stop's own
                                     caret below ("0% ×2"), one labelled row. -->
                            </div>
                        </TooltipTrigger>
                        <!-- m-17 (W6-I; G-W6-9's VARIANT member): the caller's `p-2`
                             is gone — merged LAST through the package's tailwind-merge
                             it flattened the tooltip's designed 1.272 block/inline
                             optical padding ratio (`px-(--overlay-pad-inline)
                             py-(--overlay-pad-block)`) to 1.0. The width cap stays
                             (`max-w-72` since UIA-KF-279) and collides with nothing
                             the primitive declares. Pairs with THP D-11 (`.e`,
                             RETAINED). -->
                        <!-- MISSED-1 + M7 — THE PANEL'S NAME IS PASSED, NEVER SCRAPED.
                             `TooltipContentImpl.js:87` builds the accessible
                             description as `props.ariaLabel || currentElement.value
                             ?.textContent`. With nothing passed, the second arm won:
                             an UNTRACKED DOM read, taken ONCE at first mount, of a
                             panel whose `<img alt>` `textContent` cannot see and whose
                             block boundaries it runs together — so an AT user got one
                             unpunctuated stylesheet, frozen before the capture landed,
                             and on the focus path (D-10) frozen on the ghost that has
                             no name at all. Passing the prop takes the FIRST arm, and
                             because the prop is a `computed`-shaped expression over the
                             keyframe and its preview source, reka's own `computed`
                             re-evaluates whenever either changes. It is also M7's cure
                             at the only place it matters for AT: a prop is a string, so
                             no `text-transform` register can reach it and the property
                             values arrive in the case the author typed them. -->
                        <!-- UIA-KF-183 — the panel opens BELOW the rail, away from
                             the card's own toolbar and tick labels it used to cover.
                             UIA-KF-279 — the declarations are the content: the cap is
                             wide enough for common values, and a long one wraps. -->
                        <TooltipContent
                            side="bottom"
                            :side-offset="8"
                            class="max-w-72"
                            :aria-label="describeStop(stop)"
                        >
                            <TimelineHoverPreview
                                :keyframe="stop.keyframes[0]"
                                :source="previewSource ?? null"
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
                        :count="stop.keyframes.length"
                        @commit-percent="(p) => moveStop(stop.keyframes.map((kf) => kf.id), p)"
                        @select="emit('select', selectionIdFor(stop))"
                    />
            </template>
        </LaneTrack>
    </div>
</template>

<script setup lang="ts">
import { computed, useId, useTemplateRef } from "vue";
import { Tooltip, TooltipContent, TooltipTrigger } from "@mkbabb/glass-ui/tooltip";
import { clamp } from "@mkbabb/value.js/math";
import { useZoomPan } from "../composables/useZoomPan";
import LaneTrack, { edgeOf, type LaneTrackBeginDrag, type LaneTrackTick } from "./LaneTrack.vue";
import TimelineCaret from "../TimelineCaret.vue";
import TimelineHoverPreview, { describeKeyframe } from "./TimelineHoverPreview.vue";
import { coalesceKeyframes } from "../timelineTypes";
import type { TimelineKeyframe, TimelineStop } from "../timelineTypes";

const props = defineProps<{
    sortedKeyframes: TimelineKeyframe[];
    scrubT: number;
    expanded?: boolean;
    selectedKeyframeId: string | null;
    /**
     * The scene element the hover preview poses a clone of (KFA-59). Optional:
     * without one the panel draws the ghost, which is what `describeStop` says.
     */
    previewSource?: HTMLElement | null;
}>();

const emit = defineEmits<{
    (e: "update:scrubT", value: number): void;
    (e: "moveKeyframe", id: string, percent: number): void;
    (e: "select", id: string): void;
}>();

/** The LaneTrack's exposed time column (a generic SFC: its exposed shape, typed here). */
const laneTrack = useTemplateRef<{ columnEl: HTMLElement | null }>("laneTrack");
/** The inset lane every mark is placed on — the LaneTrack's time column, and
 *  the box a pointer projects onto (the zoom's anchor reads it too). */
const laneEl = computed<HTMLElement | null>(() => laneTrack.value?.columnEl ?? null);
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

// EDGE AWARENESS (M1 + D-m2) — one band for every mark on the rail: the band
// and its derivation live with the one LaneTrack (`edgeOf`), which reads it for
// the ruler's labels; the carets read the same function.


/**
 * G9's FIRST reader — the panel's accessible description, PASSED.
 *
 * The derivation itself belongs to the panel (it is the panel's own caption,
 * ghost predicate and status, composed once); this mount's job is to hand reka
 * the string, because `TooltipContentImpl` takes `props.ariaLabel` before it
 * ever falls back to scraping `textContent`.
 */
const describeStop = (stop: TimelineStop): string =>
    describeKeyframe(stop.keyframes[0], !!props.previewSource);

/**
 * The marker's own name — G9's third reader.
 *
 * The typed label LEADS (N-2's wire, reader 3): tabbing a row of markers used
 * to read "keyframe at 12%", "keyframe at 38%", "keyframe at 61%" — N sliders
 * told apart only by a number the user has to hold in their head. Whatever the
 * author named it comes first, so the distinguishing word is heard before the
 * position rather than after it.
 */
const stopLabel = (stop: TimelineStop): string => {
    const p = Math.round(stop.percent);
    const n = stop.keyframes.length;
    const lead = stop.keyframes[0].label ? `${stop.keyframes[0].label} — ` : "";
    return n === 1
        ? `${lead}Keyframe at ${p}% — drag or arrow to move`
        : `${lead}${n} keyframes at ${p}% (one rule in the animation) — drag or arrow to move`;
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
} = useZoomPan(laneEl);

/** UIA-KF-178 — whether a stop already labels this graduation. */
const stopAtTick = (tick: number): boolean =>
    stops.value.some((stop) => Math.round(stop.percent) === tick);

/** The ruler, handed to the LaneTrack: the zoom's graduations placed through
 *  its map; a graduation that coincides with a stop is not labelled twice (the
 *  stop's caret says it). */
const ticks = computed<LaneTrackTick[]>(() =>
    visibleTicks.value.map((tick) => ({
        key: tick,
        at: percentToPosition(tick),
        label: stopAtTick(tick) ? null : `${tick}%`,
    })),
);

// L-D8/C-4(a) + D-7 + MISSED-4 — `getGhostStyle` lived HERE, in the geometry
// component, computing a required prop for a leaf that had every input it
// needed: a pure function of the keyframe, derived by the mount owner, handed
// down. It also hardcoded four properties against a seventeen-property capture
// set and composed `scale(0.3) ${transform}` onto the bordered plate, scaling
// the frame with its payload and pushing the authored translate out of a box
// that clips. The whole function is gone; `TimelineHoverPreview` derives its
// own ghost, decomposed, with the scale on a wrapper.

// THE POINTER POLICY (KF.W7 G2) and the scrub's keyboard map (G8) are the
// LaneTrack's (ESC-W13X-tl-1): one gesture state for the scrub and for a stop
// drag (begun below through its `beginDrag`), primary presses only, a pinch
// suppressing both, capture on the rail. The pan bar keeps its own press rule.
const acceptsPress = (event: PointerEvent): boolean =>
    event.isPrimary && event.button === 0;

/** The rail's zoom keys, beside the LaneTrack's scrub keys on the same host. */
const onZoomKeydown = (event: KeyboardEvent) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        zoomBy(1.25);
    } else if (event.key === "-" || event.key === "_") {
        event.preventDefault();
        zoomBy(1 / 1.25);
    }
};

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

/**
 * A stop drag, begun on the LaneTrack (one gesture with the scrub). It carries
 * its GRAB OFFSET (`grabDx`, model percent), captured once at the press and
 * subtracted on every move: a grab is not a teleport (the pointer lands up to
 * ~12px off the mark's centre inside its 24px pad). A dragged stop whose
 * keyframes are all gone ends the gesture.
 */
const onMarkerPointerDown = (
    event: PointerEvent,
    stop: TimelineStop,
    beginDrag: LaneTrackBeginDrag,
) => {
    let ids = stop.keyframes.map((kf) => kf.id);
    let grabDx = 0;
    const percent = beginDrag(event, {
        move: (p) => {
            const live = ids.filter((id) => props.sortedKeyframes.some((kf) => kf.id === id));
            if (live.length === 0) return false;
            ids = live;
            moveStop(ids, clamp(p - grabDx, 0, 100));
        },
    });
    if (percent === null) return;
    grabDx = percent - stop.percent;
    emit("select", selectionIdFor(stop));
};

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
/* The rail is the LaneTrack's scrub host (rendered in that component, so
   reached through :deep): the ruler's label room is the LaneTrack's own
   (`--lane-track-ruler`, D-14/i-1). */
:deep(.timeline-track) {
    /* KFA-173 / UIA-KF-178 — the carets hang BELOW the rail. They were
       placed at the rail's centre line plus a fixed 16px/23px, so on the 48px
       rail every readout sat on the bottom border ("0% / 50% / 100%" struck
       through). Their offset is now the rail's own block size plus a gap, so
       it cannot straddle whatever height the rail takes. */
    --timeline-caret-gap: 0.25rem;
    /* The visible diamond; the lane is inset by half its SELECTED diagonal
       (√2⁄2 × scale-125 = 0.8839), so an end stop sits inside the rail. */
    --timeline-diamond: 1rem;

    margin-bottom: 1.5rem;
}

:deep(.timeline-track[data-expanded]) {
    --timeline-diamond: 1.5rem;
}

/* The lane's inset, named once: the LaneTrack's column reads it, and the
   ruler's end labels reach back across it to the rail's own ends (X-DS pass 1,
   C1 (KF-C1-16): "0%" starts where the rail starts, "100%" ends where it ends;
   the marks stay on the lane, so a 0% or 100% stop sits on its tick). */
:deep(.timeline-track) {
    --lane-track-inset: calc(var(--timeline-diamond) * 0.8839);
}

/* RR-A missed-5 — ONE CARD, ONE POINTER REGIME. Every glass control beside this
   card grows when the pointer turns coarse (the producer expresses its floor per
   component through `--touch-target`); the card's own bespoke targets were frozen
   hard-px and read the same at a fingertip as at a mouse — two scaling regimes in
   one card. The floor is declared ONCE here and inherited by the pads that
   consume it, so the card scales in one place rather than per site.
   BOUND, and stated so it cannot widen: the marker pad's hard-px arm FOLDS to
   banked S-1 BOUNDED and is NOT re-booked here — the diamonds sit on a
   continuous 0–100% axis where growing an inline sequence of pads manufactures
   overlap, which is a different defect, not this one's cure. What this regime
   reaches is the target that has no floor in EITHER regime: the pan scrollbar,
   which paints 6px and is dragged, clicked and arrow-keyed. Rendered magnitudes
   remain KF.W9/SS-13's. */
:deep(.timeline-track),
.timeline-pan-bar {
    --timeline-hit-floor: 24px;
}

@media (pointer: coarse) {
    :deep(.timeline-track),
    .timeline-pan-bar {
        --timeline-hit-floor: var(--touch-target, 2.75rem);
    }
}

/* The pad is gated on the row's OPERABILITY, which the template already
   declares: the pan row reserves its height at all zoom levels and marks itself
   `aria-hidden` with `tabindex="-1"` when there is nothing to pan, so an
   ungated pad would hand an invisible control a larger hit area than the one it
   has when it is live. */
.timeline-pan-row:not([aria-hidden]) .timeline-pan-bar::after {
    content: "";
    position: absolute;
    inset-inline: 0;
    inset-block-start: 50%;
    block-size: var(--timeline-hit-floor);
    translate: 0 -50%;
}

/* The marker's motion, named property by property (D-12 / K-5). This rule used
   to transition `transform` — and Tailwind 4 writes the INDIVIDUAL `scale`,
   `rotate` and `translate` properties, never the shorthand, so nothing ever set
   `transform` and the selection scale SNAPPED while only the border eased. The
   `transition-all` on the marker's class list read as the live declaration and
   was dead code: this scoped rule outranks it, and it is deleted rather than
   widened (widening the shorthand would leave the scale dead in a way that
   looks cured). */
.keyframe-marker {
    transition:
        scale var(--duration-fast) var(--ease-standard),
        translate var(--duration-fast) var(--ease-standard),
        background-color var(--duration-fast) var(--ease-standard),
        box-shadow var(--duration-fast) var(--ease-standard),
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
