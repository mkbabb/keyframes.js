import { nextTick, onMounted, ref, type Ref } from "vue";
import { useScrollFade } from "./useScrollFade";

export interface UseTabStripScrollOptions {
    /** The header element wrapping the `<SegmentedTabs>` strip. */
    tabsHeaderEl: Ref<HTMLElement | null>;
}

export interface UseTabStripScrollReturn {
    /** The overflow edge-fade class for the strip (`tabs-overflow-*`). */
    overflowClass: Ref<string>;
    /** Re-check overflow + scroll the active tab into view (after a tick). */
    reMeasure: () => void;
}

/**
 * The tab-strip OVERFLOW + active-tab scroll-into-view concern, lifted out of
 * AnimationControls.vue as a colocated composable (the K.WZ proof:demo-no-oversize
 * seam; zero behavior change). The DFA-driven strip itself (`stripOptions` ←
 * `builtInTabs`, the `:options="stripOptions"` binding) stays in the .vue — only
 * the overflow/scroll plumbing moves here.
 *
 * glass-ui 4.0.0 (BA.W-TABS) — `<SegmentedTabs>` owns its option buttons
 * internally (no per-trigger ref hook), so the active-tab scroll-into-view reads
 * the strip's own `[role=tab][aria-selected=true]` node and the overflow probe
 * observes the strip's `[role=tablist]` node — both off the header element
 * directly (the SAME panel-nav DOM across the underline/pill materials —
 * variant-invariant). The `[role=tablist]` resolve is a single DOCUMENTED
 * vendor-DOM contract (the `[data-sonner-toaster]` disposition, D.W3).
 */
export function useTabStripScroll(
    options: UseTabStripScrollOptions,
): UseTabStripScrollReturn {
    const { tabsHeaderEl } = options;

    // --- Overflow detection (left + right) via shared composable ---
    const tabsListElRef = ref<HTMLElement | null>(null);

    const { fadeClass: overflowClass, check: checkOverflow } = useScrollFade({
        el: tabsListElRef,
        axis: "x",
        classPrefix: "tabs-overflow",
        observeEl: tabsHeaderEl,
    });

    const scrollActiveTabIntoView = () => {
        // glass-ui 4.0.0 (BA.W-TABS) — the active tab is `<SegmentedTabs>`' own
        // `[role=tab][aria-selected=true]` button (the SAME panel-nav DOM across both
        // materials — one indicator engine; K.W4 S4 moved this strip to `variant="pill"`
        // but the `role=tablist`/`tab`/`aria-selected` contract is variant-invariant);
        // read it off the header element rather than an owned per-trigger ref map.
        const activeBtn = tabsHeaderEl.value?.querySelector<HTMLElement>(
            "[role=tab][aria-selected=true]",
        );
        activeBtn?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
    };

    const reMeasure = () => {
        nextTick(() => {
            checkOverflow();
            scrollActiveTabIntoView();
        });
    };

    onMounted(() => {
        // The `<SegmentedTabs variant="pill">` strip renders the `role=tablist`
        // element (the panel-nav material — variant-invariant); there is no public ref
        // for it, so this is a single DOCUMENTED vendor-DOM contract (the
        // `[data-sonner-toaster]` disposition, D.W3) — the overflow probe observes that
        // strip node.
        tabsListElRef.value =
            tabsHeaderEl.value?.querySelector<HTMLElement>("[role=tablist]") ?? null;
        scrollActiveTabIntoView();
    });

    return {
        overflowClass,
        reMeasure,
    };
}
