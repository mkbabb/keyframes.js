import { computed, type ComputedRef, type Ref } from "vue";
import { useMediaQuery } from "@vueuse/core";

export interface UsePaneRegisterOptions {
    /**
     * The mobile STAGE mode-class (H.W7.S1c): `subject` full-bleeds the stage
     * behind the sheet; `editor`/`storyboard` keep a content card. Pass the raw
     * prop (a getter) — undefined falls back to `subject`.
     */
    stageMode: () => "subject" | "editor" | "storyboard" | undefined;
}

export interface UsePaneRegisterReturn {
    /** The resolved stage mode (the `controls-pane--stage-*` class driver). */
    stageMode: ComputedRef<"subject" | "editor" | "storyboard">;
    /** True at ≥1024px — gates the desktop glass-wash adoption. */
    isDesktop: Ref<boolean>;
}

/**
 * The pane REGISTER concern for ControlsPaneWrapper.vue — the resolved stage mode
 * + the desktop break — lifted out as a colocated composable (the K.WZ
 * proof:demo-no-oversize seam; zero behavior change).
 *
 * J.W7a S1 (D5) — the glass-wash adoption is DESKTOP-only (the mobile sheet keeps
 * its own popover-card paint). `isDesktop` draws the SAME 1024px line every layout
 * composable in this subtree draws (useControlsLayout / ResponsiveSelect). The
 * stage mode tunes the register only: the sheet is ALWAYS a content card; `subject`
 * full-bleeds the stage behind it, `editor`/`storyboard` keep a contained card.
 */
export function usePaneRegister(
    options: UsePaneRegisterOptions,
): UsePaneRegisterReturn {
    const { stageMode: stageModeProp } = options;

    const stageMode = computed(() => stageModeProp() ?? "subject");

    const isDesktop = useMediaQuery("(min-width: 1024px)");

    return { stageMode, isDesktop };
}
