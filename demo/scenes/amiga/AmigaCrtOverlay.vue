<template>
    <!-- L.W11.S3 — the CRT phosphor atmosphere stack (the demoscene reliquary
         refinement), extracted from AmigaScene.vue as a colocated sub-unit (the
         demo ≤500L-per-file decomposition; proof:demo-no-oversize). A
         pointer-events:none overlay over the canvas so the spin/orbit gesture
         model is UNTOUCHED. Every layer is mixed from the scene-scoped
         --amiga-phosphor (off --primary): the magenta returns as ATMOSPHERE
         framing the kept crayon-red ball, never as the ball. Composites OVER the
         grid-bg PAPER substrate (it does not delete it). --spin-bloom (0…1) from
         the spin glide flares the phosphor; `booting` fires the power-on flash. -->
    <div
        class="crt-overlay pointer-events-none"
        :class="{ 'crt-overlay--booting': booting }"
        :style="{ '--spin-bloom': spinBloom }"
        aria-hidden="true"
    >
        <div class="crt-overlay__scanlines"></div>
        <div class="crt-overlay__grille"></div>
        <div class="crt-overlay__vignette"></div>
        <div class="crt-overlay__flash"></div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    /** True during the once-on-enter power-on boot (fires the phosphor flash). */
    booting: boolean;
    /** 0…1 spin-glide energy — flares the scanlines/bloom on a hard flick. */
    spinBloom: number;
}>();
</script>

<style scoped>
.crt-overlay {
    --amiga-phosphor: oklch(0.78 0.14 318);
    --spin-bloom: 0;
    position: absolute;
    inset: 0;
    z-index: var(--z-content);
    border-radius: var(--radius-card);
    overflow: hidden;
    pointer-events: none;
}

/* 1 — scanlines: fine horizontal raster, low alpha so the ball reads through. */
.crt-overlay__scanlines {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
        to bottom,
        transparent 0 2px,
        color-mix(in oklab, var(--amiga-phosphor) 9%, transparent) 2px 3px
    );
    opacity: calc(0.5 + 0.5 * var(--spin-bloom));
    mix-blend-mode: multiply;
}
:global(.dark) .crt-overlay__scanlines {
    mix-blend-mode: screen;
    opacity: calc(0.32 + 0.4 * var(--spin-bloom));
}

/* 2 — aperture-grille shimmer (Trinitron): a very faint vertical stripe. */
.crt-overlay__grille {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
        to right,
        transparent 0 2px,
        color-mix(in oklab, var(--amiga-phosphor) 5%, transparent) 2px 3px
    );
    opacity: 0.4;
    mix-blend-mode: overlay;
}

/* 3 — vignette + bloom: the emitting-glass halo (a warm magenta-tinged centre
   behind the red sphere + a near-black curvature ring). Swells with the flare. */
.crt-overlay__vignette {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: radial-gradient(
        circle at 50% 44%,
        color-mix(in oklab, var(--amiga-phosphor) calc(14% + var(--spin-bloom) * 16%), transparent) 0%,
        transparent 58%
    );
    box-shadow:
        inset 0 0 60px 10px color-mix(in oklab, black 26%, transparent),
        inset 0 0 0 1px color-mix(in oklab, var(--amiga-phosphor) 22%, transparent);
}

/* 4 — the once-on-enter power-on white phosphor FLASH. Idle: transparent. On
   `.crt-overlay--booting` it snaps bright and fades — the CRT switching on. PRM:
   the booting class is never set under reduced-motion (the runBoot guard). */
.crt-overlay__flash {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: radial-gradient(
        circle at 50% 46%,
        rgba(255, 255, 255, 0.92) 0%,
        color-mix(in oklab, var(--amiga-phosphor) 60%, white) 30%,
        transparent 70%
    );
    opacity: 0;
}
@media (prefers-reduced-motion: no-preference) {
    .crt-overlay--booting .crt-overlay__flash {
        animation: crt-power-on 900ms var(--ease-standard) 1 both;
    }
}
@keyframes crt-power-on {
    0% {
        opacity: 0;
        transform: scaleY(0.02);
    }
    8% {
        opacity: 1;
        transform: scaleY(1);
    }
    100% {
        opacity: 0;
        transform: scaleY(1);
    }
}
</style>
