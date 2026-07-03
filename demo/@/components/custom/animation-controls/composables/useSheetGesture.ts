import { watch, type Ref } from "vue";
import { useOptionalDockContext } from "@mkbabb/glass-ui/dock";

/**
 * The mobile bottom-SHEET gesture engine (H.W7.S1a/S2b) — the DEDICATED grab
 * handle's open/close swipe arbitration (BLK-6) + the sheet-over-menubar
 * keep-open mutex (WV-W7-MED-4). Colocated with `useSheetSpring` (the motion)
 * because the gesture is the sheet's other cohesive concern — together they own
 * the drawer; the component is left a thin host (proof:demo-no-oversize seam).
 *
 * GESTURE ARBITRATION (BLK-6). The handle owns the open/close swipe via its OWN
 * `setPointerCapture` — spatially DISJOINT from the stage's `touch-action: none`
 * orbit surface, so neither gesture landlord swallows the other (the cube's
 * `setPointerCapture` swallows any swipe on the exposed cube; the handle's own
 * capture owns the sheet). A downward swipe past the threshold closes (→ peek);
 * an upward swipe opens (→ expanded); a tap toggles.
 *
 * KEEP-OPEN MUTEX (S2b). While the sheet is OPEN, hold the dock's keep-open so
 * the bottom menubar's collapse timer cannot shift the sheet's anchor mid-
 * interaction. The imperative DI function pair on `DockContext` (mirrors
 * App.vue's @mbabb mutex) — NOT a v-model surface.
 *
 * @param isOpen  the sheet's open state (read + written). The handlers flip it;
 *                the mutex watches it.
 */
export function useSheetGesture(isOpen: Ref<boolean>) {
    // ── S2b — the keep-open mutex ────────────────────────────────────────────
    const dockContext = useOptionalDockContext();
    watch(
        isOpen,
        (open) => {
            if (open) dockContext?.keepOpen();
            else dockContext?.release();
        },
        { immediate: true },
    );

    // ── S1a — the dedicated grab-handle swipe (BLK-6) ────────────────────────
    const SWIPE_THRESHOLD_PX = 28; // past this, a swipe commits a detent change.
    let dragStartY = 0;
    let dragging = false;
    let moved = false;

    function toggle() {
        isOpen.value = !isOpen.value;
    }

    function onPointerDown(e: PointerEvent) {
        dragStartY = e.clientY;
        dragging = true;
        moved = false;
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }

    function onPointerMove(e: PointerEvent) {
        if (!dragging) return;
        const dy = e.clientY - dragStartY;
        if (Math.abs(dy) > SWIPE_THRESHOLD_PX) {
            moved = true;
            // dy > 0 → swipe DOWN → close (peek); dy < 0 → swipe UP → expand.
            const wantOpen = dy < 0;
            if (isOpen.value !== wantOpen) isOpen.value = wantOpen;
            // Commit once per gesture; re-arm origin so a back-swipe reverses.
            dragStartY = e.clientY;
        }
    }

    function onPointerUp(e: PointerEvent) {
        dragging = false;
        try {
            (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
        } catch {
            /* KEEP: already released */
        }
    }

    // A plain tap (no committed swipe) toggles. Guarded by `moved` so a swipe
    // that already toggled does not double-fire on the synthetic click.
    function onClick() {
        if (moved) {
            moved = false;
            return;
        }
        toggle();
    }

    return { toggle, onPointerDown, onPointerMove, onPointerUp, onClick };
}
