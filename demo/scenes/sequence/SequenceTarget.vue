<template>
    <!-- The scene's root column (SequenceScene renders this and nothing else):
         centred, full-height, width-bounded at lg (below lg it spans the page
         gutter, X.KF.W13W.m OA-64). One child, so no gap; no bespoke
         class, since no rule ever selected one (kf-SequenceTarget L-8). -->
    <div class="flex flex-col items-center justify-center h-full w-full lg:px-8 lg:max-w-3xl mx-auto overflow-hidden">
        <!-- I5 — the standard NON-cartoon glass <Card> protagonist plate (rounded
             by construction, shadow off). J.W7c C-SEQ-1 (U6): the card no longer
             STRETCHES the whole .stage-cell (the former flex-1 floated 5 rows on a
             vast dead checkerboard); it HUGS its content (h-fit max-h-full), so the
             void that bled the page grid is gone. -->
        <!-- OVERFLOW POSTURE (kf-SequenceScene D8 / kf-SequenceTarget D-8): the
             card hugs its content but SCROLLS when the cell is shorter than it,
             so a short viewport never silently discards a storyboard row. -->
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
                        data-readout="primary"
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
                    <!-- The re-time's undo (SC-2) moved WITH the handles it undoes
                         into the Timeline pane's Sequence mode (X.KF.W13V.s2). -->
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
                     (the Timeline pane's master scrub, X.KF.W13V.s2)
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
                         label, rail and traveller wear it. -->
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
                            <div class="seq-track relative">
                                <div class="progress-rail"></div>
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

        </Card>
    </div>
</template>

<script setup lang="ts">
import { inject, onMounted } from "vue";
import { clamp } from "@mkbabb/value.js/math";
import { useTypedTrigger } from "./useTypedTrigger";
import { Button, Card } from "@mkbabb/glass-ui";
// Glass 7 canonical poster-metric primitive.
import { Metric } from "@mkbabb/glass-ui/metric";
import { Clapperboard } from "@lucide/vue";

import { SEQUENCE_DEMO_KEY } from "./sequenceKeys";
import { ROW_COUNT, ROW_TONES } from "./sequenceMotion";
// Colocated sub-units (the ≤500L split seam): the L.W11 S7 phosphor
// master-playhead + the master-clock axis ruler. The master scrub and the row
// re-time handles are EDITORS and live in the shared Timeline pane's Sequence
// mode (X.KF.W13V.s2 · §0cw); the stage paints the subject only.
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
// NAMED from the ONE canonical clock the rows + playhead ride, so the
// terminal label is the sequence's duration itself (no hardcoded ms).
const AXIS_QUARTERS = [0, 0.25, 0.5, 0.75, 1] as const;

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

// ── EE-SEQ-1 "the reel" trigger (H.W12.S6 / I3 egg) ──────────────────────────
// A HIDDEN typed trigger: type "reel" → the storyboard plays the cascading-wave
// egg. Scene-scoped via `useTypedTrigger` (R.W5 B.4); ignores typing in editable
// targets. The Reel button beside the readout is the discoverable twin.
useTypedTrigger("reel", () => demo.playReel());
</script>

<style scoped src="./SequenceTarget.css"></style>
