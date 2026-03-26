import { computed, inject, onUnmounted, ref } from "vue";
import type { ComputedRef, Ref } from "vue";
import { CONTROLS_PANE_HOVER_KEY } from "../injectionKeys";

/**
 * Manages hover state for the controls pane with a linger timer.
 * The pane is considered "hovered" when the user hovers the pane itself
 * OR any dock (top/bottom). A linger timer keeps it hovered briefly
 * after the mouse leaves.
 */
export function usePaneHover(lingerMs = 2000): {
    isPaneHovered: ComputedRef<boolean>;
    onPaneMouseEnter: () => void;
    onPaneMouseLeave: () => void;
} {
    const isPaneDirectHover = ref(false);
    const isDockHovered = inject(CONTROLS_PANE_HOVER_KEY, ref(false));
    const isPaneHovered = computed(() => isPaneDirectHover.value || isDockHovered.value);

    let hoverTimer: ReturnType<typeof setTimeout> | null = null;

    function clearTimer() {
        if (hoverTimer) {
            clearTimeout(hoverTimer);
            hoverTimer = null;
        }
    }

    function onPaneMouseEnter() {
        clearTimer();
        isPaneDirectHover.value = true;
    }

    function onPaneMouseLeave() {
        clearTimer();
        hoverTimer = setTimeout(() => {
            isPaneDirectHover.value = false;
            hoverTimer = null;
        }, lingerMs);
    }

    onUnmounted(clearTimer);

    return { isPaneHovered, onPaneMouseEnter, onPaneMouseLeave };
}
