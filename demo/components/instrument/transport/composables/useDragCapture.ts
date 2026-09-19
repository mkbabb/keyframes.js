import { onScopeDispose, ref } from "vue";
import { useEventListener } from "@vueuse/core";
import {
    acquireSelectSuppression,
    releaseSelectSuppression,
} from "@utils/gestureSelectSuppression";

interface DragCaptureHandlers {
    onStart?: (e: PointerEvent) => void;
    onMove?: (e: PointerEvent) => void;
    onEnd?: (e: PointerEvent) => void;
}

/**
 * Composable for pointer-capture-based drag interactions.
 *
 * Returns `onPointerDown` to attach to the drag target. On pointer-down it
 * captures the pointer and latches its id; the `pointermove`/`pointerup`/
 * `pointercancel` handlers are registered ONCE, here, in this composable's own
 * effect scope — so the scope disposes them — and admit only samples from the
 * pointer that opened the gesture.
 *
 * WHY NOT per-gesture registration inside the handler, which is what this seam
 * did: `useEventListener` in the installed @vueuse (14.3.0) is a
 * `watchImmediate` whose listeners are released by ITS effect scope's cleanup —
 * it calls no `tryOnScopeDispose` of its own, and inside a DOM event handler
 * there is no active scope to bind to. The docblock that promised "vueuse's
 * `tryOnScopeDispose` cleans up any listener still live at unmount" was
 * therefore false against the installed bytes, in exactly the case it named: a
 * mid-drag unmount left the listeners on a detached node and the only release
 * path unreachable.
 *
 * I.W4 D1 — this control-surface drag seam (the visualizer ball, the ribbon's
 * scrub wrapper) ALSO routes through the shared global select-suppression token,
 * so a control drag that sweeps a label or the dock does not highlight it either
 * — the SAME gesture-in-flight authority `useDragScrub` uses (one token, both
 * seams).
 *
 * X.KF.W11.i — THE GUARD FAMILY (KF-AV-15, spec'd with KF-SCR-1 + L·D-1 across
 * BOTH demo drag seams; `useDragScrub` carries the identical family). Three
 * parts, one cure:
 *
 *   (1) THE RE-ENTRANCY GUARD. There was no `isDragging` test on pointer-down,
 *       so a second pointer acquired the shared token a second time against a
 *       single release — `activeGestureCount` pinned ≥ 1 and `user-select: none`
 *       stranded on the document for the session — while also replacing the
 *       handler set (orphaning the first) and emitting a second `onStart` with
 *       no matching `onEnd`.
 *   (2) THE POINTER LATCH. Samples and releases are admitted from the opening
 *       pointer alone, so a second pointer neither drives nor ends the gesture.
 *   (3) THE SCOPE-DISPOSAL RELEASE. A mid-drag unmount never sees its own
 *       `pointerup`; the token is document-wide and outlives this scope, so the
 *       scope returns it.
 *
 * The exported surface — `{ isDragging, onPointerDown }` and the handler bag —
 * is unchanged: `PlaybackRibbon` consumes this seam and is not this unit's.
 */
export function useDragCapture(handlers: DragCaptureHandlers) {
    const isDragging = ref(false);
    /**
     * THE POINTER LATCH (part 2). The id of the pointer that opened the gesture,
     * or `null` when the seam is idle — the seam's single admission test.
     */
    let activePointerId: number | null = null;

    /** Is this event the gesture's own pointer? The seam's one admission test. */
    const isActivePointer = (e: PointerEvent) => e.pointerId === activePointerId;

    // ── C·C-1 ≡ KF-AV-16 — THE MACHINE-WRITE POLICY: DECOUPLE ────────────────
    // A drag on this seam terminates in a scene-machine dispatch whose reducer
    // allocates a fresh context per call and whose store serialises it to
    // localStorage synchronously, so every admitted sample costs one
    // `JSON.stringify` + `setItem`. Pointer hardware samples far faster than the
    // display paints (240 Hz against 60): at four samples a frame the seam
    // bought four blocking writes to render one picture.
    //
    // THE DECISION IS DECOUPLE, not throttle. The sample stream is still read at
    // full rate — the latest sample always wins — but the move is DELIVERED in
    // the animation frame that will paint it, so the consumer and the machine
    // behind it see at most one per frame and never a value the frame has
    // already superseded. A wall-clock throttle was refused for the defect it is
    // named for: it drops the terminal sample. Here the pending sample is
    // flushed SYNCHRONOUSLY at the gesture's end, so what the machine records is
    // exactly the value the user let go at. `onStart` is never coalesced — the
    // press seats immediately, as it always did.
    let pendingMove: PointerEvent | null = null;
    let moveFrame: number | null = null;

    /** Deliver the latest sample now (the rAF callback AND the terminal flush). */
    const flushPendingMove = () => {
        if (moveFrame !== null) cancelAnimationFrame(moveFrame);
        moveFrame = null;
        const e = pendingMove;
        pendingMove = null;
        if (e) handlers.onMove?.(e);
    };

    /** Drop the pending sample unsent (the gesture is going away with its scope). */
    const dropPendingMove = () => {
        if (moveFrame !== null) cancelAnimationFrame(moveFrame);
        moveFrame = null;
        pendingMove = null;
    };

    const endGesture = (e: PointerEvent) => {
        activePointerId = null;
        isDragging.value = false;
        // D1 — clear the global select-suppression token before the scene hook.
        releaseSelectSuppression();
        // The terminal sample, exact and synchronous, BEFORE `onEnd` — the
        // release hook reads the position the gesture ended at.
        flushPendingMove();
        handlers.onEnd?.(e);
    };

    const onPointerDown = (e: PointerEvent) => {
        if (e.button !== 0) return;
        // THE RE-ENTRANCY GUARD (part 1). One gesture at a time: a second
        // pointer on a live drag acquires nothing and latches nothing.
        if (activePointerId !== null) return;
        activePointerId = e.pointerId;
        isDragging.value = true;
        // D1 — set the global select-suppression token for the gesture duration.
        acquireSelectSuppression();
        // setPointerCapture can throw (or be absent) on iOS / synthetic
        // pointers — the drag still works via the window listeners, so swallow
        // it, exactly as the sibling seam does.
        try {
            (e.currentTarget as Element | null)?.setPointerCapture(e.pointerId);
        } catch {
            /* KEEP: capture unavailable — window listeners still drive the drag */
        }

        handlers.onStart?.(e);
    };

    useEventListener(window, "pointermove", (e: PointerEvent) => {
        if (!isActivePointer(e)) return;
        pendingMove = e;
        if (moveFrame === null) moveFrame = requestAnimationFrame(flushPendingMove);
    });

    useEventListener(window, "pointerup", (e: PointerEvent) => {
        if (!isActivePointer(e)) return;
        endGesture(e);
    });

    useEventListener(window, "pointercancel", (e: PointerEvent) => {
        if (!isActivePointer(e)) return;
        endGesture(e);
    });

    // THE SCOPE-DISPOSAL RELEASE (part 3). The scene's `onEnd` is NOT run — the
    // scene is going away; the document-wide token is not, so the token is what
    // the scope returns.
    onScopeDispose(() => {
        dropPendingMove();
        if (activePointerId === null) return;
        activePointerId = null;
        isDragging.value = false;
        releaseSelectSuppression();
    });

    return { isDragging, onPointerDown };
}
