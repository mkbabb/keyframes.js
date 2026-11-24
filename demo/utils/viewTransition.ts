/**
 * FORTY-SIXTH A (K-1) — the page's View Transition, as the site's own work
 * reads it.
 *
 * A dock's plate glides by its group's box (or its image-pair's clip), which
 * the main thread animates: a long task inside the glide holds the plate at
 * its old width while the compositor carries the seats on, and the width then
 * lands in one painted frame. So work that arrives with a page change and
 * costs a long task (the controls pane's host, Home's wash) waits for the
 * transition to finish: `afterViewTransition`.
 */

/** Whether a View Transition is running on the page now (from its start to its `finished`). */
export function viewTransitionRunning(): boolean {
    try {
        return document.documentElement.matches(":active-view-transition");
    } catch {
        return false;
    }
}

/**
 * Call `then` in the first frame in which no View Transition runs (the frame
 * after the running one has finished). Returns a cancel.
 */
export function afterViewTransition(then: () => void): () => void {
    let frame = 0;
    const look = () => {
        if (viewTransitionRunning()) {
            frame = requestAnimationFrame(look);
            return;
        }
        frame = 0;
        then();
    };
    frame = requestAnimationFrame(look);
    return () => {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
    };
}
