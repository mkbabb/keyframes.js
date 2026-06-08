import { ref, watch, type Ref } from "vue";
import type { StoredAnimationGroupControlOptions } from "../stores";
import { usePaneHover } from "./usePaneHover";
import { useScrollFade } from "./useScrollFade";

/**
 * Owns the controls-pane LAYOUT reactivity for AnimationControlsGroup: the
 * max-height transition tracking, the pane-open auto-show on tab switch, the
 * pane hover-linger state, and the mobile vertical scroll-fade.
 *
 * Extracted from AnimationControlsGroup.vue (D.W1.S1) — the sizing/open-state
 * is a composable's shape, lifted whole from the parent so the shell stays a
 * thin layout host. No behaviour change: the same refs, watches, and
 * composable wiring, relocated.
 */
export function useControlsLayout(
    storedControls: StoredAnimationGroupControlOptions,
    controlsPaneEl: Ref<HTMLElement | null>,
) {
    // Track whether the panel's max-height transition has completed.
    const isPanelTransitionDone = ref(storedControls.isControlsPanelOpen);

    watch(
        () => storedControls.isControlsPanelOpen,
        (open) => {
            if (!open) isPanelTransitionDone.value = false;
        },
    );

    const onPanelTransitionEnd = (e: TransitionEvent) => {
        if (
            e.propertyName === "max-height" &&
            storedControls.isControlsPanelOpen
        ) {
            isPanelTransitionDone.value = true;
        }
    };

    // Auto-show controls pane when switching tabs while pane is hidden.
    watch(
        () => storedControls.selectedControl,
        (newVal, oldVal) => {
            if (newVal !== oldVal && !storedControls.isControlsPanelOpen) {
                storedControls.isControlsPanelOpen = true;
            }
        },
    );

    // --- Controls pane hover with linger delay + global idle-fade (F9) ---
    const { isPaneHovered, isPaneIdle, onPaneMouseEnter, onPaneMouseLeave } =
        usePaneHover();

    // --- Mobile vertical scroll fade ---
    const { fadeClass: scrollFadeClass } = useScrollFade({
        el: controlsPaneEl,
        axis: "y",
        classPrefix: "scroll-fade",
        retrigger: isPanelTransitionDone,
    });

    return {
        isPanelTransitionDone,
        onPanelTransitionEnd,
        isPaneHovered,
        isPaneIdle,
        onPaneMouseEnter,
        onPaneMouseLeave,
        scrollFadeClass,
    };
}
