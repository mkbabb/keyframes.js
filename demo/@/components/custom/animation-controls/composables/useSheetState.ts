import { useMediaQuery } from "@vueuse/core";
import { computed, watch, type ComputedRef, type WritableComputedRef } from "vue";
import type { StoredAnimationGroupControlOptions } from "../stores";
import { useSheetSpring } from "./useSheetSpring";

export interface UseSheetStateOptions {
    /** The shared per-group control store (owns the open fact). */
    storedControls: StoredAnimationGroupControlOptions;
    /** Forward the sheet spring's settle to the layout owner (useControlsLayout). */
    onSettled: (settled: boolean) => void;
}

export interface UseSheetStateReturn {
    /** ONE writable model over the store's open fact (read by spring + gesture). */
    sheetOpen: WritableComputedRef<boolean>;
    /** The reactive `--sheet-t` style the mobile CSS detents read. */
    sheetStyle: ComputedRef<{ "--sheet-t": number }>;
}

/**
 * The bottom-sheet OPEN-INTENT + SpringProgress motion + settle-forwarding
 * concern for ControlsPaneWrapper.vue, lifted out as a colocated composable (the
 * K.WZ proof:demo-no-oversize seam; zero behavior change).
 *
 * The sheet's open intent is ONE writable model over the store fact, read by the
 * spring (motion) and read+written by the gesture (the handle's swipe/tap). Its
 * open/close motion is its OWN SpringProgress (useSheetSpring), NOT a CSS
 * `grid-template-rows` ease: `sheetT` ∈ [0,1] springs between the peek detent (0)
 * and the expanded detent (1); the sheet height reads it via `--sheet-t`.
 */
export function useSheetState(options: UseSheetStateOptions): UseSheetStateReturn {
    const { storedControls, onSettled } = options;

    const sheetOpen = computed({
        get: () => storedControls.isControlsPanelOpen,
        set: (v: boolean) => {
            storedControls.isControlsPanelOpen = v;
        },
    });

    // ── S.G1 S1a (p10 F4 — writer a) — the MOBILE MOUNT-RESET (peek by default) ──
    // On the mobile layout the sheet is born at PEEK per scene entry: the wrapper
    // remounts per scene via the `AnimationControlsGroup :key="superKey"` boundary,
    // so this setup-time reset fires once per entry and overrides the store's
    // persisted/default `isControlsPanelOpen: true`. This is the head of the
    // three-writer peek cure (the two born-open scene pokes are DELETED; the
    // useControlsLayout auto-open watch is desktop-gated); it covers writer (a) —
    // the store default — AND the deleted pokes. Desktop is UNTOUCHED: the shell
    // force-opens the rail there (useSceneMachineShellBinding, already ≥1024px-
    // gated + DFA-non-empty gated). It writes the ONE open axis (the store fact —
    // NOT a per-layout fork, which reds proof:live-session-mobile's touch battery;
    // p10 F3). RECORDED (not gated): this discards a returning user's expanded
    // preference per scene entry — accepted as the "peek by default" reading.
    const isMobileLayout = useMediaQuery("(max-width: 1023px)");
    if (isMobileLayout.value) {
        storedControls.isControlsPanelOpen = false;
    }

    const { sheetT, settled } = useSheetSpring(sheetOpen);

    // J.W2 S3 (M2) — forward the spring's settle to the layout owner. The combined
    // (settled × open) source matters: under PRM the spring snaps synchronously on
    // the open flip (settled never nets false across the tick), so watching
    // `settled` alone would miss the re-open — the `sheetOpen` leg carries it. The
    // consumer (useControlsLayout.onSheetSettled) gates on open + mobile, so a
    // close-settle is a no-op there.
    watch([settled, sheetOpen], ([isSettled]) => {
        onSettled(isSettled);
    });

    // The sheet's reactive style — a single custom-property the CSS detents read.
    // Mobile-only (the desktop rail-collapse axis ignores it). `--sheet-t` drives
    // `height` between the peek and expanded detents (both ≤70dvh — NEVER
    // full-height; WV-W7-HIGH-5).
    const sheetStyle = computed(() => ({ "--sheet-t": sheetT.value }));

    return { sheetOpen, sheetStyle };
}
