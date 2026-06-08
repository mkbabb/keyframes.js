import { ref, type Ref } from "vue";
import { useEventListener } from "@vueuse/core";

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
 */
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
    const { el, project, onScrub, onStart, onEnd } = options;

    const dragging = ref(false);

    const onPointerDown = (e: PointerEvent) => {
        dragging.value = true;
        // setPointerCapture can throw on iOS / synthetic pointers — the drag
        // still works via the window listeners, so swallow it.
        try {
            el.value?.setPointerCapture(e.pointerId);
        } catch {
            /* capture unavailable — window listeners still drive the drag */
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
        dragging.value = false;
        onEnd?.(e);
    });

    return { dragging, onPointerDown };
}
