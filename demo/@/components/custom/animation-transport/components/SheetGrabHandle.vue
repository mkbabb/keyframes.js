<template>
    <!-- ── MOBILE GRAB HANDLE (H.W7.S1a / BLK-6) ──
         The DEDICATED, spatially-DISJOINT gesture surface that owns the
         sheet open/close swipe. The stage region below keeps
         `touch-action: none` (the orbit surface — OrbitalDrag/AmigaScene own
         it via setPointerCapture, which SWALLOWS any swipe on the cube). This
         handle's OWN pointerdown/setPointerCapture owns the sheet swipe, so
         the two gesture landlords never compete: stage-drag mutates the
         quaternion, handle-drag moves the sheet. A real ≥24px touch target
         (the rail spans the sheet width; the visible pill is the affordance).
         Desktop hides it (the rail collapse IS the open/close axis there). -->
    <div
        class="sheet-grab-handle"
        role="button"
        tabindex="0"
        :aria-label="open ? 'Collapse controls' : 'Expand controls'"
        :aria-expanded="open"
        @pointerdown="handle.onPointerDown"
        @pointermove="handle.onPointerMove"
        @pointerup="handle.onPointerUp"
        @pointercancel="handle.onPointerUp"
        @keydown.enter.prevent="handle.toggle"
        @keydown.space.prevent="handle.toggle"
        @click="handle.onClick"
    >
        <span class="sheet-grab-pill" aria-hidden="true"></span>
    </div>
</template>

<script setup lang="ts">
import { useSheetGesture } from "../composables/useSheetGesture";

/**
 * The mobile bottom sheet's grab handle — the ONE gesture surface + its engine
 * + its CSS, colocated as the wrapper's sub-component (the J.W0-S5
 * proof:demo-no-oversize seam: ControlsPaneWrapper stays the thin sheet host;
 * the handle concern — markup, a11y, swipe arbitration, pill styling — lives
 * here as a unit).
 */

// The sheet's open intent — v-model'd against the wrapper's `sheetOpen`
// writable model (the ONE open authority over the store fact). The gesture
// reads it for the a11y state and writes it on swipe/tap.
const open = defineModel<boolean>("open", { required: true });

// ── The grab-handle gesture engine + keep-open mutex (S1a/S2b) ───────────────
// Colocated composable (mirrors useDragScrub's SHAPE) — the gesture arbitration
// (BLK-6: the handle's own setPointerCapture, disjoint from the stage's orbit
// surface) + the sheet-over-menubar keep-open mutex (WV-W7-MED-4).
const handle = useSheetGesture(open);
</script>

<style scoped>
@media (max-width: 1023px) {
    /* ── The grab handle — the DISJOINT gesture surface (S1a/BLK-6) ── */
    .sheet-grab-handle {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        /* ≥24px touch target (WCAG 2.5.8); the rail spans the sheet width so the
           whole top edge is grabbable. Its OWN setPointerCapture owns the swipe
           — `touch-action: none` so the gesture is never hijacked by scroll. */
        min-block-size: 1.75rem;
        padding-block: 0.5rem;
        cursor: grab;
        touch-action: none;
        user-select: none;
        -webkit-user-select: none;
    }
    .sheet-grab-handle:active {
        cursor: grabbing;
    }
    .sheet-grab-pill {
        inline-size: 2.25rem;
        block-size: 0.3125rem;
        border-radius: 9999px;
        background: var(--muted-foreground, hsl(0 0% 60%));
        opacity: 0.5;
    }
    .sheet-grab-handle:hover .sheet-grab-pill,
    .sheet-grab-handle:focus-visible .sheet-grab-pill {
        opacity: 0.85;
    }
    .sheet-grab-handle:focus-visible {
        outline: 2px solid var(--ring, currentColor);
        outline-offset: -2px;
        border-radius: var(--radius-card, 1rem) var(--radius-card, 1rem) 0 0;
    }
}
</style>
