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

    const endGesture = (e: PointerEvent) => {
        activePointerId = null;
        isDragging.value = false;
        // D1 — clear the global select-suppression token before the scene hook.
        releaseSelectSuppression();
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
        handlers.onMove?.(e);
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
        if (activePointerId === null) return;
        activePointerId = null;
        isDragging.value = false;
        releaseSelectSuppression();
    });

    return { isDragging, onPointerDown };
}
