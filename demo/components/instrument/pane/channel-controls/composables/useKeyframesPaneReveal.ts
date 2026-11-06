import { computed, nextTick, watch, type ComputedRef, type Ref } from "vue";
import type { StoredAnimationGroupControlOptions } from "@state";

interface UseKeyframesPaneRevealOptions {
    /** The shared per-group control store (read for the active surface). */
    storedControls: StoredAnimationGroupControlOptions;
    /** The force-mounted keyframes `[role=tabpanel]` element ref. */
    keyframesPaneEl: Ref<any>;
    /** X.KF.W13X.esc1 (ESC-mobile-1) — the CHANNEL's warm flag (the store's
     *  `getChannelControlsState(animation).keyframesWarmed`): a channel whose
     *  editor was warmed mounts warm again after a swap. */
    keyframesWarmed: Ref<boolean>;
}

interface UseKeyframesPaneRevealReturn {
    /** Whether the keyframes surface is the active control surface. */
    keyframesActive: ComputedRef<boolean>;
    /**
     * Whether the Monaco keyframes pane may MOUNT yet (T.G9). Starts `false` so
     * the `vendor-monaco` chunk is off every scene's load; flips `true` the
     * instant the Keyframes surface is reached, and stays `true` for the channel.
     */
    keyframesWarmed: Ref<boolean>;
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
    const { storedControls, keyframesPaneEl, keyframesWarmed } = options;

    const keyframesActive = computed(
        () => storedControls.selectedControl === "keyframes",
    );

    // ── T.G9 — the Monaco keyframes pane mounts on INTENT only ────────────────
    // The force-mount + content-visibility cache (B-2, INP) is preserved: once the
    // pane mounts it is never torn down, so a switch-back stays instant and never
    // re-spins Monaco's worker, model or themes. It first mounts when the
    // Keyframes surface is reached (select, deep link, restore). The dock's
    // surfaces trigger prefetches the pane's chunk on pointerenter/focus
    // (ChromeDock `warmControlSurfaces`), so the select-time mount lands on a
    // warm module cache. There is no idle warm: an idle callback fired within
    // the first seconds of every scene that has a Keyframes surface and fetched
    // and evaluated Monaco (~2.5 MB) and Prettier for a pane nobody opened.
    watch(
        keyframesActive,
        (active) => {
            if (active) keyframesWarmed.value = true;
        },
        { immediate: true },
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
            // X.KF.W13X.controls · KFA-118 — `preventScroll`: when '2' re-opens
            // a closed rail, this runs while the track is still ~0 px wide inside
            // the overflow-hidden pane, and a plain focus() scrolled the pane
            // 240 px sideways (the content slid in from the left, cut off).
            node?.focus?.({ preventScroll: true });
        });
    });

    return { keyframesActive, keyframesWarmed };
}
