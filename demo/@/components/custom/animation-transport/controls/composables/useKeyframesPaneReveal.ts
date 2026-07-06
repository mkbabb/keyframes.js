import {
    computed,
    nextTick,
    onScopeDispose,
    ref,
    watch,
    type ComputedRef,
    type Ref,
} from "vue";
import type { StoredAnimationGroupControlOptions } from "@state";

export interface UseKeyframesPaneRevealOptions {
    /** The shared per-group control store (read for the active surface). */
    storedControls: StoredAnimationGroupControlOptions;
    /** The force-mounted keyframes `[role=tabpanel]` element ref. */
    keyframesPaneEl: Ref<any>;
}

export interface UseKeyframesPaneRevealReturn {
    /** Whether the keyframes surface is the active control surface. */
    keyframesActive: ComputedRef<boolean>;
    /**
     * Whether the Monaco keyframes pane may MOUNT yet (T.G9 — the Monaco-eager LCP
     * cure). Starts `false` so the ~4 MB `vendor-monaco` chunk is OFF the scene's
     * initial critical path; flips `true` after LCP settles (a `requestIdleCallback`
     * warm) OR the instant the user selects/interacts with the keyframes surface —
     * so the editor still opens instantly on tab-select (no UX regression), it just
     * no longer pays Monaco's bytes during first paint of every scene.
     */
    keyframesWarmed: Ref<boolean>;
    /** Force the warm now (interaction-gated: e.g. pointerenter on the tab). */
    warmKeyframes: () => void;
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

    // ── T.G9 — the Monaco-eager LCP cure (idle/interaction-gated warm) ──────────
    // The force-mount + content-visibility cache (B-2, INP) is preserved: once the
    // pane mounts it is NEVER torn down, so a tab switch-back stays instant and
    // never re-spins Monaco's worker/model/themes. What changes is WHEN it first
    // mounts — no longer on scene entry (which put `vendor-monaco`'s ~4 MB on the
    // initial critical path of EVERY scene that surfaces a keyframes channel, the
    // post-T.B triad-derivation regression: mobile LCP 10–16 s), but after the LCP
    // window (a `requestIdleCallback` warm) or the instant the user reaches for it.
    const keyframesWarmed = ref(false);
    let idleHandle: number | undefined;
    let idleTimer: ReturnType<typeof setTimeout> | undefined;
    const warmKeyframes = (): void => {
        if (keyframesWarmed.value) return;
        keyframesWarmed.value = true;
        // Cancel the pending idle warm — we've warmed early (select/interaction).
        const w = globalThis as unknown as {
            cancelIdleCallback?: (h: number) => void;
        };
        if (idleHandle !== undefined) w.cancelIdleCallback?.(idleHandle);
        if (idleTimer !== undefined) clearTimeout(idleTimer);
    };

    // Warm during the first idle after mount (post-LCP). `requestIdleCallback`
    // (Baseline: Safari 17+) falls back to a short timeout where absent so the warm
    // still lands promptly on older engines — always AFTER the synchronous
    // first-paint work, never blocking it.
    const scheduleIdleWarm = (): void => {
        const w = globalThis as unknown as {
            requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
        };
        if (typeof w.requestIdleCallback === "function") {
            idleHandle = w.requestIdleCallback(() => warmKeyframes(), {
                timeout: 4000,
            });
        } else {
            idleTimer = setTimeout(warmKeyframes, 1500);
        }
    };
    scheduleIdleWarm();

    // Reaching the keyframes surface (tab select, deep-link, restore) warms it
    // immediately — the editor is mounting the moment it is asked for, so it opens
    // without waiting on the idle warm.
    watch(
        keyframesActive,
        (active) => {
            if (active) warmKeyframes();
        },
        { immediate: true },
    );

    onScopeDispose(() => {
        const w = globalThis as unknown as {
            cancelIdleCallback?: (h: number) => void;
        };
        if (idleHandle !== undefined) w.cancelIdleCallback?.(idleHandle);
        if (idleTimer !== undefined) clearTimeout(idleTimer);
    });

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

    return { keyframesActive, keyframesWarmed, warmKeyframes };
}
