/**
 * The one global drag-select suppression token. It is a plain DOM utility,
 * shared by the scene scrubber and control-surface capture seams, so it lives
 * in the shared utils tier rather than composables.
 */
const DRAG_BODY_CLASS = "is-dragging";
let activeGestureCount = 0;

/** Begin a gesture — set the global select-suppression token (ref-counted). */
export function acquireSelectSuppression(): void {
    if (typeof document === "undefined") return;
    activeGestureCount += 1;
    document.body.classList.add(DRAG_BODY_CLASS);
}

/** End a gesture — clear the token once the last concurrent gesture releases. */
export function releaseSelectSuppression(): void {
    if (typeof document === "undefined") return;
    activeGestureCount = Math.max(0, activeGestureCount - 1);
    if (activeGestureCount === 0) {
        document.body.classList.remove(DRAG_BODY_CLASS);
    }
}
