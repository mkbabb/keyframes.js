import { computed, inject, ref } from "vue";
import type { ComputedRef } from "vue";
import { useIdle, useTimeoutFn } from "@vueuse/core";
import { CONTROLS_PANE_HOVER_KEY } from "../injectionKeys";

/** Global window idle threshold before the controls pane rest-dims (F9). */
const IDLE_MS = 10_000;

/**
 * Manages hover state for the controls pane with a linger timer, plus the
 * global idle-fade state (F9, H.W9.S6).
 *
 * The pane is considered "hovered" when the user hovers the pane itself OR any
 * dock (top/bottom). A linger timer keeps it hovered briefly after the mouse
 * leaves (the immediate hover-state tracker).
 *
 * The pane "rest-dims" after `IDLE_MS` of GLOBAL window inactivity (F9 — the
 * idle-fade restoration). `useIdle` dogfoods the installed @vueuse/core
 * primitive (inv ζ — no hand-rolled setTimeout) and tracks
 * mousemove/mousedown/resize/keydown/touchstart/wheel + visibilitychange, so
 * scrubbing a slider, typing, or scrolling all RESET the idle clock. The CSS
 * owns the opacity magnitude (design-idioms.css `--controls-idle-opacity`) +
 * the transition + the :hover/:focus-within instant lift + the PRM snap-guard
 * (ControlsPaneWrapper.vue scoped style); this composable owns only the WHEN.
 * `isPaneIdle` gates on `!isPaneHovered` so the 2s hover-linger keeps the pane
 * lit even past the idle threshold while the cursor rests on it.
 */
export function usePaneHover(lingerMs = 2000): {
    isPaneHovered: ComputedRef<boolean>;
    isPaneIdle: ComputedRef<boolean>;
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

    // Global idle (F9) — the rest-dim fires only when idle AND not hovered, so
    // a resting cursor / lingering hover never ghosts the surface the user is on.
    const { idle } = useIdle(IDLE_MS);
    const isPaneIdle = computed(() => idle.value && !isPaneHovered.value);

    function onPaneMouseEnter() {
        stopLinger();
        isPaneDirectHover.value = true;
    }

    function onPaneMouseLeave() {
        startLinger();
    }

    return { isPaneHovered, isPaneIdle, onPaneMouseEnter, onPaneMouseLeave };
}
