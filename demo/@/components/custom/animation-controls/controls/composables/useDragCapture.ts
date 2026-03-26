import { ref, onUnmounted } from "vue";

export interface DragCaptureHandlers {
    onStart?: (e: PointerEvent) => void;
    onMove?: (e: PointerEvent) => void;
    onEnd?: (e: PointerEvent) => void;
}

/**
 * Composable for pointer-capture-based drag interactions.
 *
 * Returns `onPointerDown` to attach to the drag target. Internally manages
 * `setPointerCapture`, `pointermove`, and `pointerup`/`pointercancel` listeners,
 * cleaning up on unmount.
 */
export function useDragCapture(handlers: DragCaptureHandlers) {
    const isDragging = ref(false);
    let activePointerId: number | null = null;
    let activeTarget: Element | null = null;

    const onPointerMove = (e: PointerEvent) => {
        if (!isDragging.value) return;
        handlers.onMove?.(e);
    };

    const onPointerUp = (e: PointerEvent) => {
        if (!isDragging.value) return;
        isDragging.value = false;
        activePointerId = null;
        handlers.onEnd?.(e);
        removeListeners();
    };

    const addListeners = (el: Element) => {
        activeTarget = el;
        el.addEventListener("pointermove", onPointerMove as EventListener);
        el.addEventListener("pointerup", onPointerUp as EventListener);
        el.addEventListener("pointercancel", onPointerUp as EventListener);
    };

    const removeListeners = () => {
        if (!activeTarget) return;
        activeTarget.removeEventListener("pointermove", onPointerMove as EventListener);
        activeTarget.removeEventListener("pointerup", onPointerUp as EventListener);
        activeTarget.removeEventListener("pointercancel", onPointerUp as EventListener);
        activeTarget = null;
    };

    const onPointerDown = (e: PointerEvent) => {
        if (e.button !== 0) return;
        isDragging.value = true;
        activePointerId = e.pointerId;

        const target = e.currentTarget as Element;
        target.setPointerCapture(e.pointerId);
        addListeners(target);

        handlers.onStart?.(e);
    };

    onUnmounted(removeListeners);

    return { isDragging, onPointerDown };
}
