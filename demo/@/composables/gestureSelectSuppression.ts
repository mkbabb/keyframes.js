/**
 * gestureSelectSuppression — the ONE global "gesture-in-flight" select-suppression
 * token (I.W4 D1). The demo had NO seam that knew "a drag is live," so a
 * window-scope drag let the pointer sweep the chrome (dock + control labels) and
 * highlight every caption it crossed (B6-a). The cure is structural: the two
 * shared drag seams — `useDragScrub` (the scene rails + the square box) and
 * `useDragCapture` (the control-surface drags: bezier handles, timeline diamonds,
 * sequence rows) — BOTH route their pointer-down/up through this token, so EVERY
 * drag surface inherits select-suppression for free.
 *
 * The token is a single `body.is-dragging` class whose consuming rule
 * (`body.is-dragging *, body.is-dragging { user-select: none }`) lives in
 * design-idioms.css (the demo's owned vocabulary). A reference count makes it
 * nesting-safe: two concurrent gestures must BOTH release before the token clears
 * (a control-surface drag overlapping a scene drag cannot strand or prematurely
 * clear the other's suppression). SSR-safe via the `document` guard.
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
