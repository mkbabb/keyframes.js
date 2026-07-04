import { useMediaQuery } from "@vueuse/core";
import { ref, watch, type Ref } from "vue";
import type { StoredAnimationGroupControlOptions } from "@state";
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

    // ── J.W2 S3 (M2) — the MOBILE readiness signal is the sheet spring's OWN
    // settle, not a CSS transitionend. On mobile the sheet height is
    // spring-driven (useSheetSpring → --sheet-t; ControlsPaneWrapper) with NO
    // CSS height transition, so the `max-height` transitionend above NEVER
    // fires there — after a close + RE-OPEN the latch stayed false and the
    // sheet body stayed `overflow-hidden` (the I.W2 M2 overclaim,
    // `audit/wave-I.W2.md §4`). The wrapper forwards the spring's `settled`
    // signal here (the same prop pattern as onPanelTransitionEnd); when the
    // sheet is OPEN and the spring has settled on the mobile layout, the panel
    // is ready and the body may scroll. The desktop path keeps the
    // transitionend gate — the two paths dispatch on the layout mode (the same
    // 1023px boundary the sheet CSS uses).
    const isMobileLayout = useMediaQuery("(max-width: 1023px)");
    const onSheetSettled = (settled: boolean) => {
        if (
            settled &&
            isMobileLayout.value &&
            storedControls.isControlsPanelOpen
        ) {
            isPanelTransitionDone.value = true;
        }
    };

    // Auto-show controls pane when switching tabs while pane is hidden.
    // ── S.G1 S1b (p10 F4 — writer b) — DESKTOP-GATED ──
    // On mobile this watch fired on the scene machine's entry-time `selectedControl`
    // PROJECTION (not a genuine user tab pick), silently re-expanding the sheet the
    // instant the host mount-reset set it to peek (the third re-opener head). The
    // desktop rail still auto-shows on a real tab switch; the mobile sheet stays at
    // peek until the user taps the grab handle. `isMobileLayout` is the SAME 1023px
    // boundary the sheet CSS + the mount-reset use.
    watch(
        () => storedControls.selectedControl,
        (newVal, oldVal) => {
            if (
                !isMobileLayout.value &&
                newVal !== oldVal &&
                !storedControls.isControlsPanelOpen
            ) {
                storedControls.isControlsPanelOpen = true;
            }
        },
    );

    // --- Controls pane hover with linger delay + global idle-fade (F9) ---
    const { isPaneHovered, isPaneIdle, paneMouseEnter, paneMouseLeave } =
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
        onSheetSettled,
        isPaneHovered,
        isPaneIdle,
        onPaneMouseEnter: paneMouseEnter,
        onPaneMouseLeave: paneMouseLeave,
        scrollFadeClass,
    };
}
