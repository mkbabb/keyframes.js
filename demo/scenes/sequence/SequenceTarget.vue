<template>
    <!-- The scene's root column (SequenceScene renders this and nothing else):
         centred, width-bounded, full-height. One child, so no gap; no bespoke
         class, since no rule ever selected one (kf-SequenceTarget L-8). -->
    <div class="flex flex-col items-center justify-center h-full w-full px-6 lg:px-8 max-w-3xl mx-auto overflow-hidden">
        <!-- I5 — the standard NON-cartoon glass <Card> protagonist plate (rounded
             by construction, shadow off). J.W7c C-SEQ-1 (U6): the card no longer
             STRETCHES the whole .stage-cell (the former flex-1 floated 5 rows on a
             vast dead checkerboard); it HUGS its content (h-fit max-h-full), so the
             void that bled the page grid is gone. -->
        <!-- OVERFLOW POSTURE (kf-SequenceScene D8 / kf-SequenceTarget D-8): the
             card hugs its content but SCROLLS when the cell is shorter than it —
             the last child is the master scrubber, the card's only in-content
             transport surface, and a short viewport must never silently discard
             it. -->
        <Card :shadow="false" class="seq-target w-full h-fit max-h-full min-h-0 flex flex-col overflow-y-auto overflow-x-hidden">
            <!-- Header: serif text-display scene name + the small muted `stagger × N`
                 caption + the live master-clock Metric. The Metric is the CANONICAL
                 clock's one visual-numeric exposure — milliseconds on the master
                 clock (kf-SequencePlayhead N-14's rider) — at a rung BELOW the
                 scene title (D-6: a re-derivable readout is not the card's largest
                 datum), wearing the master accent through the house `.readout-
                 accent` idiom (ST-3) and receiving the NUMBER so the primitive's
                 own non-finite coalescer stays live (C-12). The rows WRAP at phone
                 widths (XH-4 band contract). -->
            <div class="flex flex-wrap items-center justify-between gap-y-1 px-4 py-2.5 border-b border-border/40 shrink-0">
                <div class="flex flex-wrap items-baseline gap-3 gap-y-1 min-w-0">
                    <!-- The scene name is the card's heading (D-5): an `h2`, so the
                         outline names the storyboard; the display rung is the
                         same utility it wore as a span — no reset needed, the
                         utility sets size, weight and margin. -->
                    <h2 class="text-display text-foreground truncate m-0">Sequence</h2>
                    <span class="text-mono-caption text-muted-foreground tabular-nums whitespace-nowrap">
                        stagger &times; {{ ROW_COUNT }}
                    </span>
                    <Metric
                        size="md"
                        label="clock"
                        :value="Math.round(demo.progress.value * demo.duration.value)"
                        unit="ms"
                        class="readout-accent shrink-0"
                    />
                </div>
                <div class="flex items-center gap-2 shrink-0">
                    <!-- EE-SEQ-1 "the reel" — the discoverable twin of the hidden
                         typed "reel" trigger: cascading-wave overshoot replay.
                         THE STATE SIGNAL (kf-SequenceTarget ST-4 · D-9 · D-15 ·
                         ST-2 · ST-10 · C-2): the reel's running state IS the
                         Button's shipped `loading` contract — it emits `aria-busy`
                         and suppresses activation, which is the announcement, the
                         affordance and the user-visible form of `playReel`'s guard
                         in one binding. The primitive's own `iconOnly` geometry
                         replaces the hand-sized square that lost to its height
                         floor; the default-valued emphasis prop is not restated. -->
                    <Button
                        size="xs"
                        icon-only
                        :loading="demo.isReeling.value"
                        aria-label="Play the reel — a cascading wave replay"
                        title="Play the reel"
                        @click="demo.playReel()"
                    >
                        <Clapperboard class="w-3.5 h-3.5" />
                    </Button>
                    <!-- The undo of the row re-time (SC-2): the one path back to the
                         default stagger distribution, made a visible verb. -->
                    <Button
                        size="xs"
                        icon-only
                        aria-label="Reset the storyboard rows to the default stagger"
                        title="Reset the storyboard rows"
                        @click="demo.reset()"
                    >
                        <RotateCcw class="w-3.5 h-3.5" />
                    </Button>
                    <!-- The transport-state badge: a TRANSPORT axis, so the accent
                         lands on the LIVE state (playing) and the neutral tone on
                         rest (D19(a)); the dead `reverse` arm died with SC-2. It is
                         the card's only textual state signal, so it is a live
                         status region (D20) — `progress` itself is never one. -->
                    <span
                        role="status"
                        class="status-badge text-mono-micro uppercase px-2 py-0.5 rounded-full"
                        :style="{ '--badge-tone': demo.isPlaying.value ? 'var(--color-progress)' : 'var(--muted-foreground)' }"
                    >{{ demo.isPlaying.value ? "playing" : "ready" }}</span>
                </div>
            </div>

            <!-- ── THE STORYBOARD — a CONTAINED timeline frame (J.W7c C-SEQ-2, U6) ──
                 REDESIGN (not removal). Before: a draggable timeline floating on a
                 vast translucent void (the page grid bled through as a dead
                 checkerboard; the travellers piled at the rail origin). Fix =
                 PROPORTION + CONTAINMENT (the stage-card grammar): a rounded,
                 master-tinted .seq-stage that OWNS its time grid; a .seq-axis ruler
                 naming the master-clock axis; .seq-rows on a CSS subgrid (uniform
                 label col); and each traveller RESTING at its at: start gate
                 (C-SEQ-3, --row-start) so the stagger reads as a DIAGONAL CASCADE
                 even at t=0 — the distribution SEEN, not piled left. -->
            <div class="seq-storyboard px-4 py-4 shrink-0">
                <!-- L.W11 S7 — the IGNITION-CASCADE host (`.cascade-chase`): scrubbing
                     detonates the lanes in a diagonal cascade chasing the thumb
                     (`--scrub-dir` flips on drag-back); `.is-powering-on` runs the
                     ~700ms boot once. The motion is the engine's --ball-p fan-out. -->
                <div
                    class="seq-stage cascade-chase"
                    :class="{ 'is-scrubbing': demo.isScrubbing.value, 'is-powering-on': demo.isPoweringOn.value }"
                    :style="{ '--scrub-dir': demo.scrubDir.value }"
                >
                    <!-- The master-clock axis ruler — a colocated sub-unit. It names
                         the CANONICAL clock: labels are `q × duration` ms and the
                         terminal label IS `sequence.duration` (N-1's born-RED gate). -->
                    <SequenceAxis :quarters="AXIS_QUARTERS" :duration="demo.duration.value" />

                    <!-- The swept phosphor master-playhead — a colocated sub-unit
                         (SequencePlayhead, the ≤500L split seam). -->
                    <SequencePlayhead :progress="demo.progress.value" />

                    <!-- The five rows — each sets ONE --ball-tone + its --row-start
                         (the at: proportion ON THE CANONICAL CLOCK, `at / duration`);
                         label, rail, traveller + handle wear it. -->
                    <div class="seq-rows">
                        <div
                            v-for="row in demo.rows.value"
                            :key="row.index"
                            class="seq-row"
                            :style="{
                                '--ball-tone': ROW_TONES[row.index],
                                '--row-start': clamp(row.at / demo.duration.value, 0, 1),
                                '--row-index': row.index,
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
                                     re-authors at: + rebuilds the Sequence. Its
                                     centre sits at `at / duration` of the track
                                     (the canonical clock); its CONTROL range is
                                     the editable [0, STAGGER_MAX] domain, and it
                                     announces the canonical unit (N-14's rider). -->
                                <div
                                    class="seq-handle kf-focus-ring"
                                    :style="{ left: `calc(${(row.at / demo.duration.value) * 100}%)` }"
                                    role="slider"
                                    :aria-label="`Re-time row ${row.index + 1} start offset`"
                                    :aria-valuenow="Math.round(row.at)"
                                    :aria-valuetext="`${Math.round(row.at)} ms`"
                                    aria-valuemin="0"
                                    :aria-valuemax="demo.STAGGER_MAX"
                                    tabindex="0"
                                    @pointerdown="onRowDown(row.index, $event)"
                                    @keydown="onRowKeydown(row.index, $event)"
                                ></div>
                                <!-- The traveller — the engine's child-animation
                                     TARGET (J.WZ): the engine paints --ball-p +
                                     opacity + the scale-pop onto THIS ball, not the
                                     row track (the former track-target let
                                     `scale: 0.7` shrink the whole row, dropping the
                                     24px handle to 16.8px → target-size). -->
                                <div
                                    :ref="(el) => setBallEl(row.index, el as HTMLElement | null)"
                                    class="progress-ball seq-ball"
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Master scrubber — the F.W16 rail/ball idiom. Extracted to a
                 colocated sub-unit (SequenceScrubber.vue, J.WZ) at the scrubber
                 seam to hold the ≤500L ceiling; it injects the demo, no props. -->
            <SequenceScrubber />
        </Card>
    </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, ref } from "vue";
import { clamp } from "@mkbabb/value.js/math";
import { useTypedTrigger } from "./useTypedTrigger";
import { Button, Card } from "@mkbabb/glass-ui";
// Glass 7 canonical poster-metric primitive.
import { Metric } from "@mkbabb/glass-ui/metric";
import { Clapperboard, RotateCcw } from "@lucide/vue";

import { useDragScrub } from "@composables/useDragScrub";
import { SEQUENCE_DEMO_KEY } from "./sequenceKeys";
import { ROW_COUNT } from "./sequenceMotion";
// Colocated sub-units (the ≤500L split seam): the master scrubber (J.WZ), the
// L.W11 S7 phosphor master-playhead + the master-clock axis ruler.
import SequenceScrubber from "./SequenceScrubber.vue";
import SequencePlayhead from "./SequencePlayhead.vue";
import SequenceAxis from "./SequenceAxis.vue";

// THE PROVIDER GUARD (kf-SequenceTarget C-11) — the scene provides
// unconditionally, so this names the contract instead of erasing the
// missing-provider signal into a render-time TypeError.
const demo = inject(SEQUENCE_DEMO_KEY);
if (!demo) {
    throw new Error(
        "SequenceTarget must be mounted inside the sequence scene: no SEQUENCE_DEMO_KEY was provided.",
    );
}

// The axis-ruler quarter marks. Labels = `q × duration` ms — the time grid is
// NAMED from the ONE canonical clock the handles + playhead ride, so the
// terminal label is the sequence's duration itself (no hardcoded ms).
const AXIS_QUARTERS = [0, 0.25, 0.5, 0.75, 1] as const;

// J.W7a S3 (D12 / CP-2) — the per-row spectrum map, row 0 violet … row 4 green
// (the sequence icon's ascending bars), all from the owned --rainbow-* family.
// The fourth is the token-derived cyan→green midpoint (the glyph ships four stops
// over five rows — the bridge stop is mixed, never a new literal).
// ONE cardinality (L-9): the tuple's length is checked against ROW_COUNT at
// compile time, so a sixth row (or a fifth tone) reds `vue-tsc` instead of
// silently degrading a row to the master tone through an `undefined` read.
const ROW_TONES = [
    "var(--rainbow-violet)",
    "var(--rainbow-blue)",
    "var(--rainbow-cyan)",
    "color-mix(in oklab, var(--rainbow-cyan) 45%, var(--rainbow-green))",
    "var(--rainbow-green)",
] as const satisfies { readonly length: typeof ROW_COUNT };

// Per-row track elements — the drag-capture host + the rect the row handle's
// `project` reads. NOT the engine target (J.WZ): see ballEls below.
const rowEls: (HTMLElement | null)[] = Array(ROW_COUNT).fill(null);
const setRowEl = (i: number, el: HTMLElement | null) => {
    rowEls[i] = el;
};

// Per-row TRAVELLER elements — each is its child animation's target (J.WZ): the
// engine paints --ball-p + opacity + the scale-pop onto the BALL, not the track,
// so `scale: 0.7` no longer shrinks the row (the 24px handle holds — target-size).
const ballEls: (HTMLElement | null)[] = Array(ROW_COUNT).fill(null);
const setBallEl = (i: number, el: HTMLElement | null) => {
    ballEls[i] = el;
};

onMounted(() => {
    // The two seam verbs (L-10/C-4): the composable binds the engine targets and
    // paints the current playhead — the view never reaches into the engine.
    for (let i = 0; i < ROW_COUNT; i++) {
        const el = ballEls[i];
        if (el) demo.bindRowTarget(i, el);
    }
    demo.paintCurrent();
    // L.W11 S7 — fire the orchestrated power-on boot once (PRM-snapped inside
    // `powerOn`): ruler clip-wipe → staggered lane drop, demonstrating `stagger`.
    demo.powerOn();
});

// ── Draggable rows: re-author each child's `at:` live (H.W12.S6 / I3) ─────────
// ONE shared `useDragScrub` consumer drives every row handle. The pressed row's
// index is latched; `project` reads THAT row's track rect → a [0,1] ratio → an
// `at:` ms offset over [0, STAGGER_MAX]; `onScrub` re-emits via demo.reseatRow
// (the engine Sequence re-sort). The track refs are the engine's --ball-p targets.
const activeRow = ref<number | null>(null);
// The pressed row's own track is the pointer-capture host (the scrub rail moved
// to SequenceScrubber in the J.WZ split; the active track is the natural host).
const activeRowEl = computed<HTMLElement | null>(() =>
    activeRow.value == null ? null : (rowEls[activeRow.value] ?? null),
);
const { onPointerDown: onRowScrubDown } = useDragScrub({
    el: activeRowEl,
    project: (e) => {
        const i = activeRow.value;
        const el = i == null ? null : rowEls[i];
        if (i == null || !el) return 0;
        const rect = el.getBoundingClientRect();
        const ratio = clamp((e.clientX - rect.left) / rect.width, 0, 1);
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
const ROW_AT_PAGE = ROW_AT_STEP * 10; // ms per PageUp/PageDown (APG's larger step)
const onRowKeydown = (index: number, e: KeyboardEvent) => {
    const at = demo.rows.value[index]?.at ?? 0;
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = at + ROW_AT_STEP;
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = at - ROW_AT_STEP;
    else if (e.key === "PageUp") next = at + ROW_AT_PAGE;
    else if (e.key === "PageDown") next = at - ROW_AT_PAGE;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = demo.STAGGER_MAX;
    if (next === null) return;
    e.preventDefault();
    demo.reseatRow(index, next);
};

// ── EE-SEQ-1 "the reel" trigger (H.W12.S6 / I3 egg) ──────────────────────────
// A HIDDEN typed trigger: type "reel" → the storyboard plays the cascading-wave
// egg. Scene-scoped via `useTypedTrigger` (R.W5 B.4); ignores typing in editable
// targets. The Reel button beside the readout is the discoverable twin.
useTypedTrigger("reel", () => demo.playReel());
</script>

<style scoped src="./SequenceTarget.css"></style>
