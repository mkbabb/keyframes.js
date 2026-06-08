<template>
    <div class="flex flex-col items-center justify-center gap-4 h-full w-full px-6 lg:px-8 max-w-3xl mx-auto overflow-hidden">
        <!-- I5 (H.W11.S1) — the STAGE-CARD register. The former bare-class
             `glass-resting cartoon-surface` div (border-radius 0 — the I4 square
             defect; the radius lived on the `<Card>` root, not the
             `cartoon-surface` utility) SWAPS to a standard, NON-cartoon glass
             `<Card>` — the protagonist plate, rounded-card by construction (I4
             closes FOR FREE). `shadow={false}` (FORK I5-shadow). All four stage
             scenes converge to ONE register. -->
        <Card :shadow="false" class="w-full flex-1 min-h-0 flex flex-col overflow-hidden">
            <!-- Header: title + live master progress read-out -->
            <div class="flex items-center justify-between px-4 py-2.5 border-b border-border/40 shrink-0">
                <div class="flex items-baseline gap-3 min-w-0">
                    <span class="text-heading text-foreground truncate">Sequence</span>
                    <span class="text-mono-caption text-muted-foreground tabular-nums whitespace-nowrap">
                        stagger &times; {{ ROW_COUNT }} &middot; progress {{ (demo.progress.value * 100).toFixed(0) }}%
                    </span>
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

            <!-- The staggered storyboard: one rail+ball per Sequence child, now
                 a draggable TIMELINE (H.W12.S6 / I3). Each row's start-handle
                 scrubs its child's master-clock `at:` offset live; a swept
                 master-playhead LINE crosses all rows at the live progress so the
                 stagger is SEEN as a sweep (R-SEQ-E). The handle track + the
                 playhead share the master-clock axis (`at / STAGGER_MAX`). -->
            <div class="seq-storyboard relative flex-1 min-h-0 flex flex-col justify-center gap-3 px-6 py-6">
                <!-- The swept master-playhead line — pure CSS, driven by the one
                     `progress` value the scrub ball already pays for. A track
                     wrapper spans ONLY the shared track region (inset past the
                     label column) so the line's `%` position resolves against the
                     track width, then translateX moves it (compositor-friendly). -->
                <div class="seq-playhead-track" aria-hidden="true">
                    <div
                        class="seq-playhead"
                        :style="{ '--playhead-p': clamp01(demo.progress.value) }"
                    ></div>
                </div>

                <div
                    v-for="row in demo.rows.value"
                    :key="row.index"
                    class="seq-row flex items-center gap-3"
                >
                    <span class="text-mono-caption text-muted-foreground tabular-nums shrink-0 w-20 text-right pr-2">
                        @{{ Math.round(row.at) }}ms
                    </span>
                    <div
                        :ref="(el) => setRowEl(row.index, el as HTMLElement | null)"
                        class="seq-track relative flex-1 h-10"
                    >
                        <div class="progress-rail"></div>
                        <!-- The draggable start-handle: marks (and re-authors)
                             this child's master-clock `at:` offset. Slider posture
                             — drag re-emits delays[i] + re-sorts the Sequence. -->
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
                        <!-- The ball position is painted by the engine into
                             --ball-p (0→1) on this element; CSS reads it. -->
                        <div class="progress-ball seq-ball"></div>
                    </div>
                </div>
            </div>

            <!-- Master scrubber — the F.W16 rail/ball idiom for the playhead -->
            <div class="px-4 py-3 border-t border-border/40 shrink-0">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-small text-foreground">master playhead</span>
                    <span class="text-mono-caption text-muted-foreground tabular-nums">{{ demo.progress.value.toFixed(3) }}</span>
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

                <!-- The F.W9 transport — play/pause, reverse, timeScale, reset.
                     Exercises the COMPLETE Sequence transport (not just play/
                     stop), the F.W10.S3 gate clause.

                     H.W12.S1 / I8 — Play/Pause + Reverse wear the SHARED
                     `.btn-playback` skin (playback-button.css, the same partial
                     the standard ribbon + EasingScene/SpringScene import) so they
                     read IDENTICALLY to cube/amiga/easing's transport; Play takes
                     the accent posture, Reverse the `aria-pressed` active tint
                     (the ribbon's Reverse posture). timeScale + Reset stay the
                     DOMAIN extras on `.btn-interactive` (the cube model — domain
                     verbs beside the standard transport; Sequence is NOT forced
                     onto PlaybackRibbon, which lacks timeScale). `text-small`
                     stays a NAMED per-site retention so the four cells fit the
                     `grid-cols-4` track (the skin's `--type-body` would overflow
                     the dense row). -->
                <div class="grid grid-cols-4 gap-2 mt-3">
                    <Button
                        variant="outline"
                        class="btn-playback btn-playback-accent text-small"
                        aria-label="Play or pause the sequence"
                        :aria-pressed="demo.isPlaying.value"
                        @click="demo.togglePlay()"
                    >
                        <component :is="demo.isPlaying.value ? Pause : Play" class="w-4 h-4" />
                        <span>{{ demo.isPlaying.value ? "Pause" : "Play" }}</span>
                    </Button>
                    <Button
                        variant="outline"
                        class="btn-playback text-small"
                        :aria-pressed="demo.isReversed.value"
                        aria-label="Reverse the sequence direction"
                        @click="demo.reverse()"
                    >
                        <Rewind class="w-4 h-4" />
                        <span>Reverse</span>
                    </Button>
                    <Button
                        variant="outline"
                        class="h-8 w-full rounded-full gap-1.5 text-small btn-interactive"
                        aria-label="Cycle the sequence time scale"
                        @click="cycleTimeScale()"
                    >
                        <Gauge class="w-4 h-4" />
                        <span class="tabular-nums">{{ demo.timeScale.value }}&times;</span>
                    </Button>
                    <Button
                        variant="outline"
                        class="h-8 w-full rounded-full gap-1.5 text-small btn-interactive"
                        aria-label="Reset the sequence to the start"
                        @click="demo.reset()"
                    >
                        <RotateCcw class="w-4 h-4" />
                        <span>Reset</span>
                    </Button>
                </div>
            </div>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { inject, onMounted, ref, useTemplateRef } from "vue";
import { useEventListener } from "@vueuse/core";
import { Button, Card } from "@mkbabb/glass-ui";
import { Pause, Play, Rewind, Gauge, RotateCcw, Clapperboard } from "@lucide/vue";

// The shared playback-button skin (D.W2.S2 partial). Non-scoped global rules —
// the `.btn-playback*` classes land on reka-ui's <Button> DOM, shared with the
// standard ribbon + EasingScene/SpringScene. H.W12.S1 / I8 brings Sequence's
// Play/Reverse onto the SAME skin (the share-win, keeping its domain verbs).
import "@components/custom/animation-controls/controls/playback-button.css";

import { useDragScrub } from "@composables/useDragScrub";
import { SEQUENCE_DEMO_KEY } from "./sequenceKeys";
import { ROW_COUNT } from "./useSequenceDemo";

const demo = inject(SEQUENCE_DEMO_KEY)!;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

// timeScale cycle: slow-mo → real-time → fast-forward (the F.W9 transport).
const TIME_SCALES = [0.5, 1, 2];
const cycleTimeScale = () => {
    const i = TIME_SCALES.indexOf(demo.timeScale.value);
    demo.setTimeScale(TIME_SCALES[(i + 1) % TIME_SCALES.length]!);
};

// Per-row track elements — each becomes its child animation's target so the
// engine paints `--ball-p` directly onto it (no per-frame Vue work).
const rowEls: (HTMLElement | null)[] = Array(ROW_COUNT).fill(null);
const setRowEl = (i: number, el: HTMLElement | null) => {
    rowEls[i] = el;
};

onMounted(() => {
    for (let i = 0; i < ROW_COUNT; i++) {
        const el = rowEls[i];
        if (el) demo.childAnims[i]!.setTargets(el);
    }
    // Paint the CURRENT playhead (not a hard t=0): on a fresh entry `progress` is
    // 0 (balls rest at their rail origin); on a return entry the machine's
    // SCENE_READY restore may have already re-seated `progress` through the
    // ScenePlayback adapter, so seeking the live value avoids clobbering it
    // regardless of mount/restore ordering (H.W1).
    demo.sequence.progress = demo.progress.value;
});

// ── Master scrubber: drag/keyboard scrubs the Sequence progress ──────────────
// The drag rides the shared `useDragScrub` seam (H.W12.S1 / I8); the master
// scrubber's `project` is the clamped rail rect-ratio.
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
// ONE shared `useDragScrub` consumer drives every row handle (the seam's
// single-home philosophy). The pressed row's index is latched; the `project`
// reads THAT row's track rect → a [0,1] ratio → an `at:` ms offset across the
// `[0, STAGGER_MAX]` domain; `onScrub` re-emits it via `demo.reseatRow`, which
// re-authors the engine's position-insertion (the `Sequence` re-sort). The track
// elements are the SAME refs the engine paints `--ball-p` onto (rowEls).
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
// A HIDDEN typed-sequence trigger (i-r5's primary): type "reel" while the scene
// is open and the storyboard plays the cascading-wave egg. Scene-scoped via
// vueuse (auto-cleanup on unmount); ignores typing in editable targets so it
// never fights an input. The Reel button beside the readout is the discoverable
// twin (the egg is hidden, the affordance is graceful).
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
.seq-track,
.seq-scrub {
    display: flex;
    align-items: center;
}

/* The storyboard holds the swept playhead line as an overlay. The label column
   (w-20 = 5rem) + the row gap (gap-3 = 0.75rem) is the inset before the shared
   track region; named so the playhead + handles align to ONE track axis. */
.seq-storyboard {
    --label-col: 5rem;
    --row-gap: 0.75rem;
    --track-inset: calc(var(--label-col) + var(--row-gap));
    /* LOCAL micro-stack tokens (D.W3 §S2 — single-sourced, named). These order
       the storyboard's own absolutely-positioned siblings WITHIN this card's
       local stacking context; they are NOT the global --z-* app-layer scale
       (content/controls/dock/overlay…), which orders chrome across the whole
       page. Naming them keeps even the local stack drift-free: the playhead line
       sits below the draggable row handles. */
    --z-seq-playhead: 1;
    --z-seq-handle: 2;
}

/* ── The swept master-playhead line (R-SEQ-E, H.W12.S6 / I3) ──────────────────
   The playhead track wrapper spans ONLY the shared row-track region (inset past
   the label column on the left, the px-6 padding on the right), so the line's
   `left: %` position resolves against the TRACK width — the SAME axis the row
   handles ride. */
.seq-playhead-track {
    position: absolute;
    top: 0.75rem;
    bottom: 0.75rem;
    /* px-6 (1.5rem) + the label inset on the left; px-6 on the right. */
    left: calc(1.5rem + var(--track-inset));
    right: 1.5rem;
    pointer-events: none;
    z-index: var(--z-seq-playhead);
}

/* A single vertical line crossing all five row tracks at the live progress, so
   the stagger reads as a SWEEP (each ball "wakes" as the line enters its
   window). Pure CSS — driven by the one `--playhead-p` [0,1] the scrub ball
   already pays for. `left: %` resolves against the track wrapper; translateX
   centers the 2px line on the position and keeps the move on the compositor. */
.seq-playhead {
    position: absolute;
    top: 0;
    bottom: 0;
    left: calc(var(--playhead-p, 0) * 100%);
    width: 2px;
    transform: translateX(-50%);
    background: color-mix(in srgb, var(--color-progress) 55%, transparent);
    border-radius: var(--radius-pill);
    will-change: left;
}

/* ── The draggable row start-handle (R-SEQ-D, H.W12.S6 / I3) ──────────────────
   A grip marker at the child's master-clock `at:` proportion; dragging it
   re-authors that child's offset live (the GSAP-timeline gesture). A vertical
   grip (not a round ball) so it never reads as the gliding .seq-ball. */
.seq-handle {
    position: absolute;
    top: 50%;
    width: 0.55rem;
    height: 1.6rem;
    margin-top: -0.8rem;
    margin-left: -0.275rem;
    border-radius: var(--radius-pill);
    background: color-mix(in srgb, var(--color-progress) 70%, var(--background));
    border: 1.5px solid var(--color-progress);
    cursor: grab;
    touch-action: none;
    z-index: var(--z-seq-handle);
    transition:
        background 120ms ease,
        transform 120ms ease;
}
.seq-handle:hover,
.seq-handle:focus-visible {
    background: var(--color-progress);
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

/* The per-row ball rides the engine-painted --ball-p (0→1), so it travels the
   rail with NO per-frame Vue work. It consumes the shared .progress-ball idiom
   (design-idioms.css): only the per-site variation lives here — the rail-relative
   horizontal position (the idiom centers vertically via margin-top) and a small
   live-ball size. The --ball-p default keeps the ball at the origin before the
   engine first paints it. */
.seq-ball {
    --ball-p: 0;
    --ball-size: 1.4rem;
    left: calc(var(--ball-p) * (100% - var(--ball-size)));
    will-change: left;
}

/* The master scrub-ball is positioned by Vue (`left:` from demo.progress) — the
   one ball the engine does not paint, since it tracks the master playhead. */
.scrub-ball {
    --ball-size: 1.25rem;
    margin-left: calc(var(--ball-size) / -2);
    will-change: left;
}

/* H.W12.S1 / I8 — the former bespoke `.transport-active` reverse tint is DELETED
   (no legacy beside its replacement): the Reverse button now wears the shared
   `.btn-playback` skin, whose `[aria-pressed="true"]` rule (playback-button.css)
   carries the active tint — the SAME affordance the standard ribbon's Reverse
   uses, driven here by `:aria-pressed="demo.isReversed.value"`. */
</style>
