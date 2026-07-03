import { ref, type Ref } from "vue";
import { useEventListener } from "@vueuse/core";
import {
    acquireSelectSuppression,
    releaseSelectSuppression,
} from "./gestureSelectSuppression";

/**
 * useDragScrub — the ONE pointer-drag scrub seam the stage scenes share
 * (H.W12.S1 / I8; the W5-BOOKed extraction, RE-OPENed now over its 3-consumer
 * MEASURE-FIRST threshold — `H.W5.md:66`).
 *
 * Spring's `positionFromEvent`, Sequence's master-scrub `progressFromEvent`, and
 * MotionPath's `projectPointer` were THREE hand-rolled copies of the SAME dance:
 * pointer-capture on `pointerdown` + window `pointermove`/`pointerup` + a
 * `project(e) → ratio` read. They collapse to THIS composable; each scene now
 * supplies ONLY its `project` (rect-ratio for the rails; nearest-point-on-path
 * for MotionPath). The new I3 affordances (the sequence row-drag, the
 * motion-path control points) are BORN on this seam — no churn-then-delete.
 *
 * The capture target is `el` (the rail / traveller / handle). vueuse owns the
 * window-listener lifecycle (auto-cleanup on scope dispose); the move/up handlers
 * stay registered and early-return unless a drag is in flight — the idiomatic
 * form the prior copies already used. `project` is pure (the scene's geometry);
 * `onScrub` applies the projected value. `onStart`/`onEnd` are the optional
 * pause-for-gesture / resume-on-release hooks (MotionPath uses them to mirror the
 * bottom bar's `onScrubStart`/`onScrubEnd`; the rail scenes leave them unset).
 *
 * I.W4 D1 — THE GESTURE-IN-FLIGHT AUTHORITY (the gestalt single-seam). This
 * composable is the ONLY thing in the demo that knows "a drag is live," so it
 * owns the global select-suppression token: on `onPointerDown` it sets
 * `body.is-dragging` (whose rule `body.is-dragging * { user-select: none }` lives
 * in design-idioms.css) and clears it on `pointerup`/`pointercancel`. Every drag
 * surface that routes through this seam (square, spring rail, sequence scrub,
 * motion-path) INHERITS select-suppression for free — the pointer sweeps the
 * chrome (dock + control labels) without highlighting it (closes B6-a for ALL
 * drags, not just square). Nesting-safe: a small reference count guards against
 * two concurrent gestures clearing the token early.
 *
 * I.W4 D2 — `releasePolicy` makes "persist vs recenter on release" a DECLARED
 * choice on the seam (closes B6-b). `"persist"` (the default — the spring/
 * MotionPath posture) leaves the dragged value in place on release; `"recenter"`
 * fires `onRelease` so the scene can re-seat home. Square no longer buries a
 * `reseat(0,0)` in its `pointerup` — it declares `releasePolicy: "persist"`.
 */
/**
 * The release policy (I.W4 D2). `"persist"` (default) leaves the dragged value
 * where released — the spring chases-to-rest at the dragged target, the box stays
 * put (the spring/MotionPath posture). `"recenter"` fires `onRelease` so the
 * scene can re-seat home on release.
 */
export type ReleasePolicy = "persist" | "recenter";

export interface UseDragScrubOptions<T = number> {
    /** The element that captures the pointer for the gesture (the rail / handle). */
    el: Ref<HTMLElement | null>;
    /**
     * Project a pointer event onto the scene's scrub value. PURE — the scene's
     * own geometry: a rect-ratio for a rail (`(clientX - left) / width`), the
     * nearest-point-on-path length ratio for MotionPath. Returns the value
     * `onScrub` will receive (typically a `[0,1]` ratio; the projector owns any
     * clamp the geometry needs).
     */
    project: (e: PointerEvent) => T;
    /** Apply a projected value (re-seat the spring target / scrub the playhead). */
    onScrub: (value: T) => void;
    /** Fired once on pointer-down, AFTER capture, BEFORE the first `onScrub`. */
    onStart?: (e: PointerEvent) => void;
    /** Fired once on pointer-up, when a live drag ends. */
    onEnd?: (e: PointerEvent) => void;
    /**
     * I.W4 D2 — the release policy. Defaults to `"persist"` (leave the dragged
     * value in place — the spring/MotionPath posture). `"recenter"` fires
     * `onRelease` on pointer-up so the scene returns home.
     */
    releasePolicy?: ReleasePolicy;
    /**
     * Fired on pointer-up ONLY when `releasePolicy === "recenter"` — the scene's
     * "return home" verb (e.g. `reseat(0,0)`). Under `"persist"` it is never
     * called (the dragged value stays). Runs after `onEnd`.
     */
    onRelease?: () => void;
}

export interface UseDragScrub {
    /** True while a drag gesture is in flight (drives the `--dragging` affordance). */
    dragging: Ref<boolean>;
    /** Attach to the capture element's `@pointerdown`. */
    onPointerDown: (e: PointerEvent) => void;
}

export function useDragScrub<T = number>(
    options: UseDragScrubOptions<T>,
): UseDragScrub {
    const { el, project, onScrub, onStart, onEnd, onRelease } = options;
    const releasePolicy: ReleasePolicy = options.releasePolicy ?? "persist";

    const dragging = ref(false);

    const endGesture = (e: PointerEvent) => {
        dragging.value = false;
        // Clear the global select-suppression token (D1) before the scene's own
        // release hooks, so the chrome is selectable again the instant the drag
        // ends regardless of what the hooks do.
        releaseSelectSuppression();
        onEnd?.(e);
        // D2 — only a "recenter" policy fires the scene's return-home verb; under
        // "persist" the dragged value stays exactly where released.
        if (releasePolicy === "recenter") onRelease?.();
    };

    const onPointerDown = (e: PointerEvent) => {
        dragging.value = true;
        // D1 — set the global select-suppression token FIRST, so the very first
        // pointermove that sweeps the chrome cannot start a text selection.
        acquireSelectSuppression();
        // setPointerCapture can throw on iOS / synthetic pointers — the drag
        // still works via the window listeners, so swallow it.
        try {
            el.value?.setPointerCapture(e.pointerId);
        } catch {
            /* KEEP: capture unavailable — window listeners still drive the drag */
        }
        onStart?.(e);
        onScrub(project(e));
    };

    // vueuse owns the listener lifecycle (auto-cleanup on scope dispose). The
    // handlers early-return unless a drag is live — one honest registration, no
    // add/remove bookkeeping that can leak on a mid-drag unmount.
    useEventListener(window, "pointermove", (e: PointerEvent) => {
        if (!dragging.value) return;
        onScrub(project(e));
    });

    useEventListener(window, "pointerup", (e: PointerEvent) => {
        if (!dragging.value) return;
        endGesture(e);
    });

    // pointercancel (OS gesture takeover, contextmenu, etc.) must ALSO clear the
    // token — otherwise a cancelled gesture would strand `body.is-dragging` and
    // freeze selection globally. The same end path runs.
    useEventListener(window, "pointercancel", (e: PointerEvent) => {
        if (!dragging.value) return;
        endGesture(e);
    });

    return { dragging, onPointerDown };
}
