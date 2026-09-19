<template>
    <!-- The master-clock RULER — colocated sub-unit of SequenceTarget. It spans
         the shared track column (2) — placed by the stage, the owning side of the
         seam — so its labels resolve against the SAME width the row tracks and
         the playhead track share. A ruler is three things and this paints all
         three itself: the TICK MARKS (a two-pitch band along its bottom edge:
         a major at every labelled fraction, three minors between), the LABELS
         (`q × duration`, on the canonical master clock, in ms) and the UNIT
         LEGEND (` ms`, once, on the terminal label — which IS the sequence's
         duration). `--tick-count` binds the band's pitch to the labels' count,
         so the marks and the names can never disagree. -->
    <div
        class="seq-axis"
        :style="{ '--tick-count': quarters.length - 1 }"
        aria-hidden="true"
    >
        <span
            v-for="(q, i) in quarters"
            :key="q"
            class="seq-axis-tick text-mono-micro text-muted-foreground tabular-nums"
            :style="{ '--tick-p': q }"
        >{{ Math.round(q * duration) }}<span v-if="i === quarters.length - 1" class="seq-axis-unit"> ms</span></span>
    </div>
</template>

<script setup lang="ts">
/** `quarters` — the labelled fractions of the clock, ascending, first 0, last 1;
 *  `duration` — the canonical clock's span (ms), so the terminal label IS the
 *  sequence's duration. */
defineProps<{ quarters: readonly number[]; duration: number }>();
</script>

<style scoped>
/* The ruler's GRID PLACEMENT lives on the owning side (SequenceTarget.css —
   the stage that declares the track list); this leaf styles only its own box.
   It is a legend, not a control: no pointer, no selection. It is an inline-size
   CONTAINER so its own width — the shared track width — can decide how many
   labels fit (below). */
.seq-axis {
    position: relative;
    height: 1.5rem;
    pointer-events: none;
    user-select: none;
    container-type: inline-size;
}
/* The tick band — ONE gradient pair on the bottom edge. The major pitch is the
   ruler's width over `--tick-count` (the labels' count, written inline); the
   minor pitch is a quarter of that. The band is 6px tall for the majors, 3px
   for the minors, drawn in the frame's own border ink; the closing major at the
   right edge is a hairline the repeating gradient cannot reach (its last
   period ends AT the edge), so it is painted on its own, mirrored. */
.seq-axis::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 6px;
    background-image:
        repeating-linear-gradient(
            to right,
            var(--border) 0 1px,
            transparent 1px calc(100% / var(--tick-count, 4))
        ),
        linear-gradient(to left, var(--border) 0 1px, transparent 1px);
}
.seq-axis::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 3px;
    background-image: repeating-linear-gradient(
        to right,
        var(--border) 0 1px,
        transparent 1px calc(100% / (var(--tick-count, 4) * 4))
    );
    opacity: 0.6;
}
.seq-axis-tick {
    position: absolute;
    top: 0;
    left: calc(var(--tick-p, 0) * 100%);
    transform: translateX(-50%);
    line-height: 1rem;
    white-space: nowrap;
}
/* The unit legend rides the terminal label at the same rung, dimmer — a legend,
   not a fifth number. */
.seq-axis-unit {
    opacity: 0.7;
}
/* First + last ticks hug the edges so the labels never clip the frame — named
   by CLASS, not by tree position, so a sibling added to the ruler cannot steal
   the edge-hug. */
.seq-axis-tick:nth-child(1 of .seq-axis-tick) {
    transform: translateX(0);
}
.seq-axis-tick:nth-last-child(1 of .seq-axis-tick) {
    transform: translateX(-100%);
}
/* When the track column is narrow, five labels of 3–4 figures collide; the
   ruler drops its odd quarters and keeps 0 · ½ · end (the marks stay — the band
   above is width-relative). The query reads the RULER's own inline size, which
   is the track width, not the viewport: a narrow column inside a wide window
   makes the same decision. */
@container (inline-size < 260px) {
    .seq-axis-tick:nth-child(2 of .seq-axis-tick),
    .seq-axis-tick:nth-child(4 of .seq-axis-tick) {
        display: none;
    }
}
/* Mobile row-pitch compression (the axis half of the Target's media query; the
   raw viewport literal is the breakpoint-token family's — none exists in the
   tree yet). */
@media (max-width: 1023px) {
    .seq-axis {
        height: 1.25rem;
    }
}
</style>
