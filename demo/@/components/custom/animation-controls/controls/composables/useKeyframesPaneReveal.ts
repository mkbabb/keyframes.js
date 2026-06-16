import { computed, nextTick, watch, type ComputedRef, type Ref } from "vue";
import type { StoredAnimationGroupControlOptions } from "../../stores";

export interface UseKeyframesPaneRevealOptions {
    /** The shared per-group control store (read for the active surface). */
    storedControls: StoredAnimationGroupControlOptions;
    /** The force-mounted keyframes `[role=tabpanel]` element ref. */
    keyframesPaneEl: Ref<any>;
}

export interface UseKeyframesPaneRevealReturn {
    /** Whether the keyframes surface is the active control surface. */
    keyframesActive: ComputedRef<boolean>;
}

/**
 * The force-mounted Monaco keyframes pane REVEAL-FOCUS concern, lifted out of
 * AnimationControls.vue as a colocated composable (the K.WZ proof:demo-no-oversize
 * seam; zero behavior change).
 *
 * B-2: the keyframes pane is force-mounted and content-visibility-cached when
 * inactive. `keyframesActive` toggles the `.inactive` class + the `inert`
 * attribute (inert, not bare aria-hidden, so focusable Monaco descendants leave
 * the tab order too — closing the aria-hidden-focus a11y defect).
 *
 * On reveal, move focus into the freshly-shown Monaco pane (the cached pane was
 * inert + content-visibility:hidden while inactive) and let Monaco's deferred
 * ResizeObserver re-measure now that the box has layout again. The pane is
 * force-mounted (never torn down), so focus restores cleanly on reveal.
 */
export function useKeyframesPaneReveal(
    options: UseKeyframesPaneRevealOptions,
): UseKeyframesPaneRevealReturn {
    const { storedControls, keyframesPaneEl } = options;

    const keyframesActive = computed(
        () => storedControls.selectedControl === "keyframes",
    );

    watch(keyframesActive, (active) => {
        if (!active) return;
        nextTick(() => {
            // The keyframes panel is now a plain `[role=tabpanel]` div ref — resolve
            // the DOM node whether the ref is a component instance ($el) or the element.
            const node = (keyframesPaneEl.value?.$el ?? keyframesPaneEl.value) as
                | HTMLElement
                | undefined;
            // The tabpanel root carries tabindex=0 when active — focus it so the
            // revealed pane owns the tab sequence; Monaco re-measures on the layout
            // pass that content-visibility restoration triggers.
            node?.focus?.();
        });
    });

    return { keyframesActive };
}
