<template>
    <!-- The scene's root column (SequenceScene renders this and nothing else):
         centred, full-height, width-bounded at lg (below lg it spans the page
         gutter, X.KF.W13W.m OA-64). One child, so no gap; no bespoke
         class, since no rule ever selected one (kf-SequenceTarget L-8). -->
    <div class="flex flex-col items-center justify-center h-full w-full lg:px-8 lg:max-w-5xl mx-auto overflow-hidden">
        <!-- I5 — the standard NON-cartoon glass <Card> protagonist plate (rounded
             by construction, shadow off). J.W7c C-SEQ-1 (U6): the card no longer
             STRETCHES the whole .stage-cell (the former flex-1 floated 5 rows on a
             vast dead checkerboard); it HUGS its content (h-fit max-h-full), so the
             void that bled the page grid is gone. -->
        <!-- OVERFLOW POSTURE (kf-SequenceScene D8 / kf-SequenceTarget D-8): the
             card hugs its content but SCROLLS when the cell is shorter than it,
             so a short viewport never silently discards a storyboard row. -->
        <Card :shadow="false" class="seq-target w-full h-fit max-h-full min-h-0 flex flex-col overflow-y-auto overflow-x-hidden">
            <!-- Header: the scene's name and ONE live readout, and the reel
                 (X.KF.W13X.sequence — UIA-KF-210 · UIA-KF-211 · KFA-220). The
                 Metric is the canonical clock's one visual-numeric exposure
                 (milliseconds on the master clock, kf-SequencePlayhead N-14's
                 rider) at a rung below the title (D-6), wearing the master accent
                 (`.readout-accent`, ST-3) and receiving the NUMBER so the
                 primitive's own non-finite coalescer stays live (C-12). The
                 `stagger × N` caption (the five lanes already say it) and the
                 ready/playing badge (the transport's play glyph already says it)
                 are deleted: one readout per datum. The row NEVER wraps: the title
                 is one word that never ellipsizes (§0dz: no ellipsis in effect)
                 and the Metric holds its own tabular slot, so a growing
                 clock never reflows the card mid-play (UIA-KF-211; the 390 header
                 was five wrapped lines). -->
            <!-- X.KF.W13X.sections (A2-KE-L1-8) — the ONE SceneStageHeader. -->
            <SceneStageHeader
                title="Sequence"
                class="seq-header flex flex-nowrap items-center justify-between gap-3 px-4 py-2.5 border-b border-border/40 shrink-0"
                title-class="whitespace-nowrap m-0"
                id-class="flex flex-nowrap items-baseline gap-3 min-w-0"
                aside-class="shrink-0"
            >
                <template #readouts>
                    <Metric
                        size="md"
                        label="clock"
                        :value="Math.round(demo.progress.value * demo.duration.value)"
                        unit="ms"
                        class="readout-accent shrink-0"
                        data-readout="primary"
                    />
                </template>
                <template #aside>
                    <!-- EE-SEQ-1 "the reel" — the discoverable twin of the hidden
                         typed "reel" trigger: cascading-wave overshoot replay.
                         THE STATE SIGNAL (kf-SequenceTarget ST-4 · D-9 · D-15 · ST-2 ·
                         ST-10 · C-2; KFA-220): the reel's running state IS the
                         Button's shipped `loading` contract — it emits `aria-busy`,
                         shows the busy glyph in the header and suppresses activation,
                         which is the announcement, the affordance and the visible form
                         of `playReel`'s lock in one binding. -->
                    <Button
                        size="xs"
                        icon-only
                        class="shrink-0"
                        :loading="demo.isReeling.value"
                        aria-label="Play the reel — a cascading wave replay"
                        title="Play the reel"
                        @click="demo.playReel()"
                    >
                        <Clapperboard class="w-3.5 h-3.5" />
                    </Button>
                </template>
            </SceneStageHeader>

            <!-- ── THE STORYBOARD — the subject, and only the subject ──
                 X.KF.W13X.sequence (A2-KE-L3-7 · one primary per region): the Timeline pane's
                 Sequence mode OWNS timing — its clock scrub, its playhead and each
                 lane's `@ms` offset (X.KF.W13V.s2). The stage therefore keeps
                 unlabelled lanes, an index at most: the master-clock ruler
                 (SequenceAxis) and the stage playhead (SequencePlayhead) are
                 deleted with their `@ms` labels, so two adjacent regions no longer
                 compete as the timing primary (and the playhead's grid-row and
                 width defects, KFA-49 · KFA-105 · KFA-219 · UIA-KF-030 · UIA-KF-314,
                 leave with it). The lanes keep the time geometry the pane draws:
                 each traveller RESTS on its start gate (`--row-start`) and arrives at
                 its own end time (`--row-span`, UIA-KF-214), so the stagger reads as
                 a diagonal cascade at every instant. The Card is the only frame
                 (UIA-KF-212 · UIA-KF-312): no second tinted, bordered plate. -->
            <div class="seq-storyboard px-4 py-4 shrink-0">
                <!-- L.W11 S7 — the IGNITION-CASCADE host (`.cascade-chase`): scrubbing
                     (the Timeline pane's master scrub, X.KF.W13V.s2) lifts the
                     lanes' glow (`--scrub-dir` flips on drag-back);
                     `.is-powering-on` runs the ~700ms boot once. The motion is
                     the engine's --ball-p fan-out. `--seq-room` is the overshoot
                     room the springs' crest needs past the last end time (KFA-48). -->
                <div
                    class="seq-stage cascade-chase"
                    :class="{ 'is-scrubbing': demo.isScrubbing.value, 'is-powering-on': demo.isPoweringOn.value }"
                    :style="{
                        '--scrub-dir': demo.scrubDir.value,
                        '--seq-room': demo.overshootRoom.value,
                        '--row-span': demo.rowSpan.value,
                    }"
                >
                    <!-- The five lanes — each sets ONE --ball-tone + its --row-start
                         (the at: proportion ON THE CANONICAL CLOCK, `at / duration`);
                         the index, rail and traveller wear it. -->
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
                            <span class="seq-row-name text-mono-caption tabular-nums">{{ row.index + 1 }}</span>
                            <div class="seq-track relative">
                                <div class="progress-rail"></div>
                                <!-- The traveller — the engine's child-animation
                                     TARGET (J.WZ): the engine paints --ball-p +
                                     opacity + the scale-pop onto THIS ball. -->
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
import SceneStageHeader from "../SceneStageHeader.vue";
import { Clapperboard } from "@lucide/vue";

import { SEQUENCE_DEMO_KEY } from "./sequenceKeys";
import { ROW_COUNT, ROW_TONES } from "./sequenceMotion";
// The master scrub, the row re-time handles, the clock ruler and the playhead
// are timing, and timing lives in the shared Timeline pane's Sequence mode
// (X.KF.W13V.s2 · §0cw; A2-KE-L3-7): the stage paints the subject only.

// THE PROVIDER GUARD (kf-SequenceTarget C-11) — the scene provides
// unconditionally, so this names the contract instead of erasing the
// missing-provider signal into a render-time TypeError.
const demo = inject(SEQUENCE_DEMO_KEY);
if (!demo) {
    throw new Error(
        "SequenceTarget must be mounted inside the sequence scene: no SEQUENCE_DEMO_KEY was provided.",
    );
}

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
