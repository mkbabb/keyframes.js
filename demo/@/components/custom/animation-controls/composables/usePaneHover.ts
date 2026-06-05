import { computed, inject, ref } from "vue";
import type { ComputedRef } from "vue";
import { useTimeoutFn } from "@vueuse/core";
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
    const isPaneHovered = computed(
        () => isPaneDirectHover.value || isDockHovered.value,
    );

    // vueuse owns the timer handle + the scope-dispose cleanup (replaces the
    // former hand-rolled timer bookkeeping; D.W1.S4).
    const { start: startLinger, stop: stopLinger } = useTimeoutFn(
        () => {
            isPaneDirectHover.value = false;
        },
        lingerMs,
        { immediate: false },
    );

    function onPaneMouseEnter() {
        stopLinger();
        isPaneDirectHover.value = true;
    }

    function onPaneMouseLeave() {
        startLinger();
    }

    return { isPaneHovered, onPaneMouseEnter, onPaneMouseLeave };
}
