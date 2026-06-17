<template>
    <!-- L.W11 S7 — THE PHOSPHOR MASTER PLAYHEAD (colocated sub-unit, ≤500L split).
         The kept progress-driven sweep, refined into three compositor-cheap
         layers: the LINE (full master red), a machined DIAMOND HEAD (::before),
         and a COMET TRAIL (::after) that brightens with --seq-glow while scrubbing.
         Reads --playhead-p (set inline) + --ball-tone/--seq-glow/--scrub-dir/
         --track-inset (inherited from the parent .seq-stage cascade). Pure CSS over
         the engine's `progress` — no per-frame JS. -->
    <div class="seq-playhead-track" aria-hidden="true">
        <div class="seq-playhead" :style="{ '--playhead-p': clamp01(progress) }"></div>
    </div>
</template>

<script setup lang="ts">
defineProps<{ progress: number }>();
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
</script>

<style scoped>
/* Spans the shared row-track column (inset past the label column) so `left: %`
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
    background: var(--ball-tone, var(--color-progress));
    border-radius: var(--radius-pill);
    box-shadow: 0 0 calc(2px + var(--seq-glow, 0) * 8px)
        color-mix(in srgb, var(--ball-tone, var(--color-progress)) calc(35% + var(--seq-glow, 0) * 45%), transparent);
    will-change: left;
}
/* The machined diamond head — a 45°-rotated cap with a lighter bevel (AE cap). */
.seq-playhead::before {
    content: "";
    position: absolute;
    top: -3px;
    left: 50%;
    width: 8px;
    height: 8px;
    transform: translateX(-50%) rotate(45deg);
    background: var(--ball-tone, var(--color-progress));
    border-top: 1px solid color-mix(in srgb, var(--ball-tone, var(--color-progress)) 30%, white);
    border-left: 1px solid color-mix(in srgb, var(--ball-tone, var(--color-progress)) 30%, white);
    border-radius: 1px;
}
/* The comet trail — anchored at the line, 32px behind the travel direction;
   `--scrub-dir` scales it on a drag-back so the streak always trails the thumb;
   brightens with --seq-glow. */
.seq-playhead::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    right: 50%;
    width: 32px;
    transform-origin: right center;
    transform: scaleX(var(--scrub-dir, 1));
    background: linear-gradient(
        to left,
        color-mix(in srgb, var(--ball-tone, var(--color-progress)) calc(28% + var(--seq-glow, 0) * 32%), transparent),
        transparent
    );
    opacity: calc(0.5 + var(--seq-glow, 0) * 0.5);
    pointer-events: none;
}
</style>
