<template>
    <!-- ── P.W5.S3 EGG — "the axis-lock reveal" (colocated sub-unit) ──────────
         OrbitalDrag already CONSTRAINS rotation to a single axis while X/Y/Z is
         held, but the constraint was invisible. Holding the key now lights the
         matching axis line: `--axis-active` lifts its opacity + a drop-shadow
         bloom in the axis's own color, so the otherwise-hidden single-axis lock
         becomes spatially legible. It reads the latch OrbitalDrag already owns
         (fed here as the `lock` prop) — no new rAF, no new gesture machinery.
         Markup + styles together (the SquareInstrument colocation precedent). -->
    <div
        class="axis-line x"
        :class="{ 'axis-line--locked': lock.x }"
        :style="{ '--axis-active': lock.x ? 1 : 0 }"
    ></div>
    <div
        class="axis-line y"
        :class="{ 'axis-line--locked': lock.y }"
        :style="{ '--axis-active': lock.y ? 1 : 0 }"
    ></div>
    <div
        class="axis-line z"
        :class="{ 'axis-line--locked': lock.z }"
        :style="{ '--axis-active': lock.z ? 1 : 0 }"
    ></div>
</template>

<script setup lang="ts">
defineProps<{
    /** The per-axis lock latch OrbitalDrag publishes (no new rAF — a derived read). */
    lock: { x: boolean; y: boolean; z: boolean };
}>();
</script>

<style scoped>
/* P.W5.S3 — register --axis-active (0…1) so the axis-lock reveal's opacity +
   drop-shadow bloom INTERPOLATE cleanly when X/Y/Z is pressed/released.

   KF.W6 W6-H — this registration is the second half of #30 and the fallback arms
   at :53/:55/:56 below are the second half of #59; both dispositions are written
   once, at CubeTarget.css's `@property --lit` block, and are not restated here.
   #60's three raw `180ms` below travel with that row to W6-J.

   KF.W6 #58 ≡ KF-AX-3 — DECLARED, NOT CURED. The `--color` each axis reads
   resolves to `--axis-x/-y/-z`, three theme-INVARIANT `:root` literals, and the
   locked line is not decorative furniture: at `--axis-active: 1` it goes full
   opacity and solid, and IS the state signal that says which axis OrbitalDrag is
   constraining. One of the three carries that meaning below the non-text floor
   in the light arm while its two siblings pass — a per-theme failure on a
   per-axis token, which is exactly what a theme-blind palette produces. The cure
   is theme-aware axis tokens (a dark arm, or `light-dark()`), decided in ONE
   motion with the `#8`/`#9` theme packet; their definitions live in the demo's
   root sheet, outside this unit's §Bounds, so the row is routed there rather
   than restated per consumer — a per-site override IS the masking this wave
   convicts. No ratio is quoted (KF-SKEL-22, re-derived at use); the rendered
   witnesses are KF.W9's, and neither end closes this id alone. */
@property --axis-active {
    syntax: "<number>";
    inherits: false;
    initial-value: 0;
}

.axis-line {
    width: 1000vw;
    height: 0px;
    border: 1px dashed var(--color);
    /* P.W5.S3 — at rest the axis lines sit at the QUIET 0.45 register (T.A2:
       demoted from 0.75 so only the LOCKED axis speaks — the resting grid no
       longer competes with the die); holding the matching X/Y/Z key drives
       --axis-active → 1, lifting the locked line to FULL opacity and blooming a
       drop-shadow in its own axis color, so the single-axis constraint OrbitalDrag
       enforces becomes spatially legible. */
    opacity: calc(0.45 + var(--axis-active, 0) * 0.55);
    filter: drop-shadow(
        0 0 calc(var(--axis-active, 0) * 6px)
            color-mix(in srgb, var(--color) calc(var(--axis-active, 0) * 80%), transparent)
    );
    /* Smooth the reveal as the key latches/releases (the registered @property
       lets both channels interpolate). PRM-respecting via the wrapper below. */
    transition:
        opacity 180ms var(--ease-standard, ease),
        --axis-active 180ms var(--ease-standard, ease),
        filter 180ms var(--ease-standard, ease);
    /* Below the content plane — glass-ui's own below-stack rung (--z-behind <
       --z-content), the producer's token read directly; the demo's z-contract
       (style.css) documents the ORDER and owns no rung of its own. */
    z-index: var(--z-behind);
    position: absolute;
    pointer-events: none;

    /* While locked, the dashed stroke goes solid — a second, motion-free tell
       that the axis is the active rotation constraint. */
    &.axis-line--locked {
        border-style: solid;
    }

    &.x {
        --color: var(--axis-x);
        transform: rotateX(0deg);
    }
    &.y {
        --color: var(--axis-y);
        transform: rotateZ(90deg);
    }
    &.z {
        --color: var(--axis-z);
        transform: rotateY(90deg);
    }
}
</style>
