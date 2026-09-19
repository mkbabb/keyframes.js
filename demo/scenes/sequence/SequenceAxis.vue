<template>
    <!-- The master-clock axis ruler (J.W7c C-SEQ-2) — colocated sub-unit (L.W11
         S7 ≤500L split). Spans the SHARED track column (2) so the tick labels
         resolve against the track width; .stage-field-x paints the quarter rules,
         the ticks NAME them. Labels = `q × duration` ms on the canonical
         master clock; the terminal label IS the sequence's duration. -->
    <div class="seq-axis stage-field-x" aria-hidden="true">
        <span
            v-for="q in quarters"
            :key="q"
            class="seq-axis-tick text-mono-caption text-muted-foreground tabular-nums"
            :style="{ '--tick-p': q }"
        >{{ Math.round(q * duration) }}</span>
    </div>
</template>

<script setup lang="ts">
/** `quarters` — the labelled fractions of the clock; `duration` — the canonical
 *  clock's span (ms), so the terminal label IS the sequence's duration. */
defineProps<{ quarters: readonly number[]; duration: number }>();
</script>

<style scoped>
/* The ruler's GRID PLACEMENT lives on the owning side (SequenceTarget.css —
   the stage that declares the track list); this leaf styles only its own box. */
.seq-axis {
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
/* Mobile row-pitch compression (J.WZ — the axis half of the Target's media query). */
@media (max-width: 1023px) {
    .seq-axis {
        height: 0.95rem;
        margin-bottom: 0;
    }
}
</style>
