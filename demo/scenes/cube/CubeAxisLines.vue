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
   drop-shadow bloom INTERPOLATE cleanly when X/Y/Z is pressed/released. */
@property --axis-active {
    syntax: "<number>";
    inherits: false;
    initial-value: 0;
}

.axis-line {
    width: 1000vw;
    height: 0px;
    border: 1px dashed var(--color);
    /* P.W5.S3 — at rest the axis lines sit at the 0.75 register; holding the
       matching X/Y/Z key drives --axis-active → 1, lifting the locked line to
       full opacity and blooming a drop-shadow in its own axis color, so the
       single-axis constraint OrbitalDrag enforces becomes spatially legible. */
    opacity: calc(0.75 + var(--axis-active, 0) * 0.25);
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
    /* Below the content plane — the demo's named below-stack rung (W3.S2).
       Reconciles the former orphan raw below-plane value to the z-contract
       documented in style.css (--z-behind < --z-content). */
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
