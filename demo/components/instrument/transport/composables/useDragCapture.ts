import { ref } from "vue";
import { useEventListener } from "@vueuse/core";
import {
    acquireSelectSuppression,
    releaseSelectSuppression,
} from "@utils/gestureSelectSuppression";

export interface DragCaptureHandlers {
    onStart?: (e: PointerEvent) => void;
    onMove?: (e: PointerEvent) => void;
    onEnd?: (e: PointerEvent) => void;
}

/**
 * Composable for pointer-capture-based drag interactions.
 *
 * Returns `onPointerDown` to attach to the drag target. On pointer-down it
 * captures the pointer and registers `pointermove`/`pointerup`/`pointercancel`
 * via `useEventListener`, whose `stop()` handles are called on drag-end.
 * vueuse's `tryOnScopeDispose` cleans up any listener still live at unmount
 * (the mid-drag-unmount leak the manual remove path missed).
 *
 * I.W4 D1 — this control-surface drag seam (bezier handles, timeline diamonds,
 * sequence rows) ALSO routes through the shared global select-suppression token,
 * so a control drag that sweeps a label or the dock does not highlight it either
 * — the SAME gesture-in-flight authority `useDragScrub` uses (one token, both
 * seams, nesting-safe).
 */
export function useDragCapture(handlers: DragCaptureHandlers) {
    const isDragging = ref(false);
    let stops: (() => void)[] = [];

    const removeListeners = () => {
        for (const stop of stops) stop();
        stops = [];
    };

    const onPointerMove = (e: PointerEvent) => {
        if (!isDragging.value) return;
        handlers.onMove?.(e);
    };

    const onPointerUp = (e: PointerEvent) => {
        if (!isDragging.value) return;
        isDragging.value = false;
        // D1 — clear the global select-suppression token before the scene hook.
        releaseSelectSuppression();
        handlers.onEnd?.(e);
        removeListeners();
    };

    const onPointerDown = (e: PointerEvent) => {
        if (e.button !== 0) return;
        isDragging.value = true;
        // D1 — set the global select-suppression token for the gesture duration.
        acquireSelectSuppression();

        const target = e.currentTarget as Element;
        target.setPointerCapture(e.pointerId);
        stops = [
            useEventListener(target, "pointermove", onPointerMove),
            useEventListener(target, "pointerup", onPointerUp),
            useEventListener(target, "pointercancel", onPointerUp),
        ];

        handlers.onStart?.(e);
    };

    return { isDragging, onPointerDown };
}
