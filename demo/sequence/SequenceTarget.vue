<template>
    <div class="flex flex-col items-center justify-center gap-4 h-full w-full px-6 lg:px-8 max-w-3xl mx-auto overflow-hidden">
        <!-- I5 — the standard NON-cartoon glass <Card> protagonist plate (rounded
             by construction, shadow off). J.W7c C-SEQ-1 (U6): the card no longer
             STRETCHES the whole .stage-cell (the former flex-1 floated 5 rows on a
             vast dead checkerboard); it HUGS its content (h-fit max-h-full), so the
             void that bled the page grid is gone. -->
        <Card :shadow="false" class="seq-target w-full h-fit max-h-full flex flex-col overflow-hidden">
            <!-- Header: serif text-display scene name + the small muted `stagger × N`
                 caption + the live master-progress MetricBadge (xl poster rung, master
                 accent). The rows WRAP at phone widths (XH-4 band contract). -->
            <div class="flex flex-wrap items-center justify-between gap-y-1 px-4 py-2.5 border-b border-border/40 shrink-0">
                <div class="flex flex-wrap items-baseline gap-3 gap-y-1 min-w-0">
                    <span class="text-display text-foreground truncate">Sequence</span>
                    <span class="text-mono-caption text-muted-foreground tabular-nums whitespace-nowrap">
                        stagger &times; {{ ROW_COUNT }}
                    </span>
                    <MetricBadge
                        size="xl"
                        label="progress"
                        label-position="inline"
                        :amount="(demo.progress.value * 100).toFixed(0)"
                        unit="%"
                        color="var(--ball-tone, var(--color-progress))"
                        class="shrink-0"
                    />
                </div>
                <div class="flex items-center gap-2 shrink-0">
                    <!-- EE-SEQ-1 "the reel" — the discoverable twin of the hidden
                         typed "reel" trigger: cascading-wave overshoot replay. -->
                    <Button
                        variant="outline"
                        class="h-7 w-7 p-0 btn-interactive"
                        :class="{ 'reel-active': demo.isReeling.value }"
                        aria-label="Play the reel — a cascading wave replay"
                        @click="demo.playReel()"
                    >
                        <Clapperboard class="w-3.5 h-3.5" />
                    </Button>
                    <span
                        class="status-badge text-admin-label px-2 py-0.5 rounded-full"
                        :class="demo.isReversed.value ? 'reverse-badge' : (demo.isPlaying.value ? 'tracking-badge' : 'settled-badge')"
                    >{{ demo.isReversed.value ? "reverse" : (demo.isPlaying.value ? "playing" : "ready") }}</span>
                </div>
            </div>

            <!-- ── THE STORYBOARD — a CONTAINED timeline frame (J.W7c C-SEQ-2, U6) ──
                 REDESIGN (not removal). Before: a draggable timeline floating on a
                 vast translucent void (the page grid bled through as a dead
                 checkerboard; the travellers piled at the rail origin). Fix =
                 PROPORTION + CONTAINMENT (the motion-path stage grammar): a rounded,
                 master-tinted .seq-stage that OWNS its time grid; a .seq-axis ruler
                 naming the master-clock axis; .seq-rows on a CSS subgrid (uniform
                 label col); and each traveller RESTING at its at: start gate
                 (C-SEQ-3, --row-start) so the stagger reads as a DIAGONAL CASCADE
                 even at t=0 — the distribution SEEN, not piled left. -->
            <div class="seq-storyboard px-4 py-4 shrink-0">
                <div class="seq-stage" :style="{ '--stagger-max': demo.STAGGER_MAX }">
                    <!-- The master-clock axis ruler: quarter labels derived from STAGGER_MAX. -->
                    <div class="seq-axis stage-field-x" aria-hidden="true">
                        <span
                            v-for="q in AXIS_QUARTERS"
                            :key="q"
                            class="seq-axis-tick text-mono-caption text-muted-foreground tabular-nums"
                            :style="{ '--tick-p': q }"
                        >{{ Math.round(q * demo.STAGGER_MAX) }}</span>
                    </div>

                    <!-- The swept master-playhead line — pure CSS over `progress`. -->
                    <div class="seq-playhead-track" aria-hidden="true">
                        <div
                            class="seq-playhead"
                            :style="{ '--playhead-p': clamp01(demo.progress.value) }"
                        ></div>
                    </div>

                    <!-- The five rows — each sets ONE --ball-tone + its --row-start
                         (the at: proportion); label, rail, traveller + handle wear it. -->
                    <div class="seq-rows">
                        <div
                            v-for="row in demo.rows.value"
                            :key="row.index"
                            class="seq-row"
                            :style="{
                                '--ball-tone': ROW_TONES[row.index],
                                '--row-start': clamp01(row.at / demo.STAGGER_MAX),
                            }"
                        >
                            <span class="seq-row-label text-mono-caption text-muted-foreground tabular-nums">
                                <span class="seq-row-name text-foreground">{{ row.index + 1 }}</span>
                                <span class="seq-row-at">@{{ Math.round(row.at) }}ms</span>
                            </span>
                            <div
                                :ref="(el) => setRowEl(row.index, el as HTMLElement | null)"
                                class="seq-track relative"
                            >
                                <div class="progress-rail"></div>
                                <!-- The draggable start-handle (slider): drag
                                     re-authors at: + re-sorts the Sequence. -->
                                <div
                                    class="seq-handle"
                                    :style="{ left: `calc(${(row.at / demo.STAGGER_MAX) * 100}%)` }"
                                    role="slider"
                                    :aria-label="`Re-time row ${row.index + 1} start offset`"
                                    :aria-valuenow="Math.round(row.at)"
                                    aria-valuemin="0"
                                    :aria-valuemax="demo.STAGGER_MAX"
                                    tabindex="0"
                                    @pointerdown="onRowDown(row.index, $event)"
                                    @keydown="onRowKeydown(row.index, $event)"
                                ></div>
                                <!-- The traveller — engine-painted --ball-p (0→1),
                                     resting at its start gate (the cascade, C-SEQ-3). -->
                                <div class="progress-ball seq-ball"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Master scrubber — the F.W16 rail/ball idiom; the storyboard's
                 editable CONTENT (the playhead the user scrubs), not transport
                 chrome (the bottom TransportDock IS the transport, XH-2 / §c). -->
            <div class="px-4 py-3 border-t border-border/40 shrink-0">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-small text-foreground">master playhead</span>
                    <span class="readout-accent text-mono-caption tabular-nums">{{ demo.progress.value.toFixed(3) }}</span>
                </div>
                <div
                    ref="scrubEl"
                    class="seq-scrub relative w-full h-9 cursor-pointer select-none"
                    role="slider"
                    aria-label="Scrub the sequence master playhead"
                    :aria-valuenow="Math.round(demo.progress.value * 100)"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    tabindex="0"
                    @pointerdown="onScrubDown"
                    @keydown="onScrubKeydown"
                >
                    <div class="progress-rail"></div>
                    <div
                        class="progress-ball scrub-ball"
                        :style="{ left: `calc(${clamp01(demo.progress.value) * 100}%)` }"
                    ></div>
                </div>
            </div>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { inject, onMounted, ref, useTemplateRef } from "vue";
import { useEventListener } from "@vueuse/core";
import { Button, Card } from "@mkbabb/glass-ui";
// J.W7a S2 (D8) — the published poster-metric primitive (glass-ui 3.9.0).
import { MetricBadge } from "@mkbabb/glass-ui/metric-badge";
import { Clapperboard } from "@lucide/vue";

import { useDragScrub } from "@composables/useDragScrub";
import { SEQUENCE_DEMO_KEY } from "./sequenceKeys";
import { ROW_COUNT } from "./useSequenceDemo";

const demo = inject(SEQUENCE_DEMO_KEY)!;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

// J.W7c C-SEQ-2 (U6) — the axis-ruler quarter marks. Labels = `q × STAGGER_MAX`
// ms, so the time grid is NAMED from the same domain the handles + playhead ride
// (no hardcoded ms; .stage-field-x paints the rules at the same 0.25 intervals).
const AXIS_QUARTERS = [0, 0.25, 0.5, 0.75, 1] as const;

// J.W7a S3 (D12 / CP-2) — the per-row spectrum map, row 0 violet … row 4 green
// (the sequence icon's ascending bars), all from the owned --rainbow-* family.
// The fourth is the token-derived cyan→green midpoint (the glyph ships four stops
// over five rows — the bridge stop is mixed, never a new literal).
const ROW_TONES = [
    "var(--rainbow-violet)",
    "var(--rainbow-blue)",
    "var(--rainbow-cyan)",
    "color-mix(in oklab, var(--rainbow-cyan) 45%, var(--rainbow-green))",
    "var(--rainbow-green)",
] as const;

// Per-row track elements — each becomes its child animation's target (the engine
// paints --ball-p onto it; no per-frame Vue work).
const rowEls: (HTMLElement | null)[] = Array(ROW_COUNT).fill(null);
const setRowEl = (i: number, el: HTMLElement | null) => {
    rowEls[i] = el;
};

onMounted(() => {
    for (let i = 0; i < ROW_COUNT; i++) {
        const el = rowEls[i];
        if (el) demo.childAnims[i]!.setTargets(el);
    }
    // Paint the CURRENT playhead (not a hard t=0): a return entry may have already
    // re-seated `progress` via the ScenePlayback restore, so seeking the live value
    // avoids clobbering it regardless of mount/restore ordering (H.W1).
    demo.sequence.progress = demo.progress.value;
});

// ── Master scrubber: drag/keyboard scrubs the Sequence progress ──────────────
// The drag rides the shared `useDragScrub` seam (H.W12.S1 / I8); `project` is the
// clamped rail rect-ratio.
const scrubEl = useTemplateRef<HTMLElement>("scrubEl");

const { onPointerDown: onScrubDown } = useDragScrub({
    el: scrubEl,
    project: (e) => {
        const el = scrubEl.value;
        if (!el) return demo.progress.value;
        const rect = el.getBoundingClientRect();
        return clamp01((e.clientX - rect.left) / rect.width);
    },
    onScrub: (p) => demo.scrub(p),
});

const onScrubKeydown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        demo.scrub(demo.progress.value + 0.05);
        e.preventDefault();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        demo.scrub(demo.progress.value - 0.05);
        e.preventDefault();
    } else if (e.key === "Home") {
        demo.scrub(0);
        e.preventDefault();
    } else if (e.key === "End") {
        demo.scrub(1);
        e.preventDefault();
    }
};

// ── Draggable rows: re-author each child's `at:` live (H.W12.S6 / I3) ─────────
// ONE shared `useDragScrub` consumer drives every row handle. The pressed row's
// index is latched; `project` reads THAT row's track rect → a [0,1] ratio → an
// `at:` ms offset over [0, STAGGER_MAX]; `onScrub` re-emits via demo.reseatRow
// (the engine Sequence re-sort). The track refs are the engine's --ball-p targets.
const activeRow = ref<number | null>(null);
const { onPointerDown: onRowScrubDown } = useDragScrub({
    el: scrubEl, // a stable capture host; the drag starts from the row handle
    project: (e) => {
        const i = activeRow.value;
        const el = i == null ? null : rowEls[i];
        if (i == null || !el) return 0;
        const rect = el.getBoundingClientRect();
        const ratio = clamp01((e.clientX - rect.left) / rect.width);
        return ratio * demo.STAGGER_MAX;
    },
    onScrub: (at) => {
        if (activeRow.value != null) demo.reseatRow(activeRow.value, at);
    },
    onEnd: () => {
        activeRow.value = null;
    },
});

const onRowDown = (index: number, e: PointerEvent) => {
    activeRow.value = index;
    onRowScrubDown(e);
};

const ROW_AT_STEP = 40; // ms nudge per arrow press (the slider keyboard posture)
const onRowKeydown = (index: number, e: KeyboardEvent) => {
    const at = demo.rows.value[index]?.at ?? 0;
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = at + ROW_AT_STEP;
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = at - ROW_AT_STEP;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = demo.STAGGER_MAX;
    if (next === null) return;
    e.preventDefault();
    demo.reseatRow(index, next);
};

// ── EE-SEQ-1 "the reel" trigger (H.W12.S6 / I3 egg) ──────────────────────────
// A HIDDEN typed trigger: type "reel" → the storyboard plays the cascading-wave
// egg. Scene-scoped via vueuse; ignores typing in editable targets. The Reel
// button beside the readout is the discoverable twin.
const REEL_CODE = "reel";
let reelBuffer = "";
useEventListener(window, "keydown", (e: KeyboardEvent) => {
    const t = e.target as HTMLElement | null;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)))
        return;
    if (e.key.length !== 1) return;
    reelBuffer = (reelBuffer + e.key.toLowerCase()).slice(-REEL_CODE.length);
    if (reelBuffer === REEL_CODE) {
        reelBuffer = "";
        demo.playReel();
    }
});
</script>

<style scoped>
/* J.W7a S3 (D12) — the MASTER tone (the scrubber ball, playhead + readout accent
   read ONE clock green); the rows OVERRIDE it per-row with their spectrum stop. */
.seq-target {
    --ball-tone: var(--color-progress);
}

/* The storyboard hugs its content (no flex-1 void); local micro-stack tokens
   order the frame's absolute siblings (playhead below the handles). */
.seq-storyboard {
    --z-seq-playhead: 1;
    --z-seq-handle: 2;
}

/* The contained timeline FRAME — the motion-path stage grammar: a bounded, gently
   master-tinted, rounded plate that OWNS its time grid (the .stage-field-x rules
   live INSIDE it, never bleeding the page grid). Defines the shared subgrid column
   geometry ONCE (a uniform label col + the elastic track col). */
.seq-stage {
    --label-col: 3.25rem;
    --col-gap: 0.75rem;
    --track-inset: calc(var(--label-col) + var(--col-gap));

    position: relative;
    display: grid;
    grid-template-columns: var(--label-col) 1fr;
    gap: 0.5rem 0;
    padding: 0.75rem 1rem 1rem;
    border-radius: var(--radius-card);
    border: 1px solid color-mix(in srgb, var(--ball-tone, var(--color-progress)) 16%, var(--border));
    /* The faint master-tinted vertical wash — a contained film region, kept low
       (§S4: the frame AMPLIFIES the stage, never shouts). */
    background:
        linear-gradient(
            to bottom,
            color-mix(in srgb, var(--ball-tone, var(--color-progress)) 5%, var(--background)),
            color-mix(in srgb, var(--ball-tone, var(--color-progress)) 2%, var(--background))
        );
}

/* ── The master-clock axis ruler (J.W7c C-SEQ-2) ──────────────────────────────
   Spans the SHARED track column (2) so the tick labels resolve against the track
   width. .stage-field-x paints the quarter rules; the ticks NAME them. */
.seq-axis {
    grid-column: 2;
    position: relative;
    height: 1.1rem;
    margin-bottom: 0.15rem;
}
.seq-axis-tick {
    position: absolute;
    top: 0;
    left: calc(var(--tick-p, 0) * 100%);
    transform: translateX(-50%);
    line-height: 1.1rem;
    white-space: nowrap;
}
/* First + last ticks hug the edges so the labels never clip the frame. */
.seq-axis-tick:first-child {
    transform: translateX(0);
}
.seq-axis-tick:last-child {
    transform: translateX(-100%);
}

/* ── The rows — a CSS subgrid so the label column is UNIFORM (§LABEL-subgrid) ── */
.seq-rows {
    grid-column: 1 / -1;
    display: grid;
    /* Same-cascade fallback (Baseline 2023) then subgrid. */
    grid-template-columns: var(--label-col) 1fr;
    grid-template-columns: subgrid;
    row-gap: 0.55rem;
}
.seq-row {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: var(--label-col) 1fr;
    grid-template-columns: subgrid;
    align-items: center;
    column-gap: var(--col-gap);
}

/* The row label — a stacked index + at:, right-aligned (index = foreground; at: = muted). */
.seq-row-label {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    line-height: 1.15;
    text-align: right;
}
.seq-row-name {
    font-weight: 600;
}
/* J.W7c φ-ladder (proof:phi-leaf-zero) — the `at:` sub-line stays on the φ
   token ladder (it inherits `--type-caption` from the parent's `.text-mono-
   caption`); its subordination to the index reads through WEIGHT + opacity, not
   an off-ladder sub-caption px. The former bare `font-size: 0.62rem` was the one
   raw font-size literal the redesign introduced — routed back onto the ladder. */
.seq-row-at {
    font-weight: 400;
    opacity: 0.8;
}

/* The per-row track — rail + handle + traveller host (room for the traveller + glow). */
.seq-track {
    grid-column: 2;
    height: 2rem;
    display: flex;
    align-items: center;
}
.seq-scrub {
    display: flex;
    align-items: center;
}

/* ── The swept master-playhead line (R-SEQ-E, H.W12.S6 / I3) ──────────────────
   Spans the shared row-track column (inset past the label column) so `left: %`
   resolves against the track width — the SAME axis the handles ride. */
.seq-playhead-track {
    position: absolute;
    grid-column: unset;
    top: calc(0.75rem + 1.25rem); /* frame pad-top + axis ruler height */
    bottom: 1rem;
    left: calc(1rem + var(--track-inset));
    right: 1rem;
    pointer-events: none;
    z-index: var(--z-seq-playhead);
}
.seq-playhead {
    position: absolute;
    top: 0;
    bottom: 0;
    left: calc(var(--playhead-p, 0) * 100%);
    width: 2px;
    transform: translateX(-50%);
    background: color-mix(in srgb, var(--ball-tone, var(--color-progress)) 55%, transparent);
    border-radius: var(--radius-pill);
    will-change: left;
}

/* ── The draggable row start-handle (R-SEQ-D, H.W12.S6 / I3) ──────────────────
   A vertical grip at the child's at: proportion; dragging it re-authors that
   offset live. It is the START GATE the traveller rests on + launches from
   (C-SEQ-3). Spans the full track width via `left: at/STAGGER_MAX`. */
.seq-handle {
    position: absolute;
    top: 50%;
    width: 0.4rem;
    height: 1.5rem;
    margin-top: -0.75rem;
    margin-left: -0.2rem;
    border-radius: var(--radius-pill);
    background: color-mix(in srgb, var(--ball-tone, var(--color-progress)) 70%, var(--background));
    border: 1.5px solid var(--ball-tone, var(--color-progress));
    cursor: grab;
    touch-action: none;
    z-index: var(--z-seq-handle);
    transition:
        background 120ms ease,
        transform 120ms ease;
}
.seq-handle:hover,
.seq-handle:focus-visible {
    background: var(--ball-tone, var(--color-progress));
    transform: scaleY(1.12);
    outline: none;
}
.seq-handle:active {
    cursor: grabbing;
}

/* The reel button pulses while the egg runs (the active affordance state). */
.reel-active {
    color: var(--color-progress);
    border-color: var(--color-progress);
}

/* ── The per-row traveller (J.W7c C-SEQ-3, U6) ────────────────────────────────
   Rides the engine-painted --ball-p (0→1) over the shared .progress-ball idiom.
   THE CASCADE: it RESTS at its row's start gate (--row-start = at/STAGGER_MAX) and
   glides to the track far end as the sweep enters — so even at t=0 the balls draw
   the stagger as a DIAGONAL CASCADE (the distribution SEEN, not piled left).

   THE SHADOW FIX (a born-RED latent bug the redesign repairs): the engine paints
   --ball-p onto the TRACK; the ball reads it by INHERITANCE. The former `.seq-ball
   { --ball-p: 0 }` SELF-DECLARATION shadowed that cascade (the travellers were
   STATIC — the trap the design-idioms.css --ball-tone note names). Both --ball-p
   + --row-start now read via the `var(--x, fallback)` form, so both cascades flow. */
.seq-ball {
    --ball-size: 1.6rem;
    /* usable = full rail minus the ball's width; left walks from the start gate to
       the far end as --ball-p sweeps 0→1 (both read via the fallback form). */
    left: calc(
        (var(--row-start, 0) + var(--ball-p, 0) * (1 - var(--row-start, 0))) *
            (100% - var(--ball-size))
    );
    z-index: var(--z-seq-handle); /* the traveller rests ON its gate, above it */
    will-change: left;
}

/* The master scrub-ball — positioned by Vue (the one ball the engine does not
   paint), at the idiom-default --ball-size + full glow: the DOMINANT ball that
   drives the whole storyboard (SEQ-12). */
.scrub-ball {
    margin-left: calc(var(--ball-size, 36px) / -2);
    will-change: left;
}
</style>
