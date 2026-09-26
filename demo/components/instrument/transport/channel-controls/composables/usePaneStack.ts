import { nextTick, reactive, ref } from "vue";

/**
 * X.KF.W13X.controls · A2-KE-L1-7 — the Controls card's ONE drill-in owner.
 *
 * The card is a small stack: the options form (`main`) and two sub-panes it
 * drills into — the timing-function editor (`detail`) and the layer
 * compositing pane (`layer`). This composable is the single place that knows
 * which pane is up, which rows are still mounted, and where focus goes on the
 * way in and on the way back. It replaces four hand-rolled focus handlers,
 * the editor composable's `detailPanelDismissed` / `advancedOpen` flags and
 * the `v-if` that tore the editor down on the same tick its row began to
 * collapse.
 *
 * - KFA-36 — a pane that is leaving stays MOUNTED until its own row's
 *   `grid-template-rows` collapse ends (`onRowTransitionEnd`), so the
 *   collapsing row has content to collapse; the card no longer snaps to a
 *   28 px sliver at the first frame of Back.
 * - KFA-101 — every focus hand-off is `preventScroll`: the landing sits in a
 *   row that is still ~0 px tall and `overflow: hidden` while it opens, and a
 *   plain `focus()` scrolled that box (the content slid in vertically, the
 *   title clipped to "bézier").
 * - Focus return goes to the element that OPENED the pane, handed in by the
 *   caller (a click does not focus a button in every engine, so
 *   `document.activeElement` is not the opener).
 */
export type ChannelPane = "main" | "detail" | "layer";

type Focusable = { focus: (options?: FocusOptions) => void };

const focusQuiet = (el: Focusable | null | undefined): void => {
    el?.focus({ preventScroll: true });
};

export function usePaneStack(
    /** The row element that hosts a pane (its collapse is what unmounts it). */
    rowOf: (p: ChannelPane) => HTMLElement | null | undefined = () => null,
    /** A pane finished arriving (its row is at full height). */
    onArrive: (p: ChannelPane) => void = () => {},
) {
    const pane = ref<ChannelPane>("main");
    /** Panes kept mounted while their row collapses (KFA-36). */
    const leaving = reactive(new Set<ChannelPane>());
    let opener: Focusable | null = null;

    const isOpen = (p: ChannelPane): boolean => pane.value === p;
    const isMounted = (p: ChannelPane): boolean =>
        pane.value === p || leaving.has(p);

    /** Drill into `to`; focus lands on `landing()` once the pane is up. */
    const push = async (
        to: Exclude<ChannelPane, "main">,
        from: Focusable | null,
        landing: () => Focusable | null | undefined,
    ): Promise<void> => {
        opener = from;
        leaving.delete(to);
        pane.value = to;
        await nextTick();
        focusQuiet(landing());
        // A row that does not animate (reduced motion) has arrived already.
        const row = rowOf(to);
        if (row?.getAnimations && row.getAnimations().length === 0) onArrive(to);
    };

    /** Back to the form; focus returns to the pane's opener. */
    const back = async (): Promise<void> => {
        const from = pane.value;
        if (from === "main") return;
        leaving.add(from);
        pane.value = "main";
        await nextTick();
        focusQuiet(opener);
        opener = null;
        // A collapse that does not run (reduced motion: a 0 s transition)
        // fires no `transitionend`; the leaving pane unmounts at once.
        const row = rowOf(from);
        if (row?.getAnimations && row.getAnimations().length === 0) {
            leaving.delete(from);
        }
    };

    /** A row's own transition ended: a pane that is no longer up unmounts;
     *  the pane that is up has arrived. */
    const onRowTransitionEnd = (p: ChannelPane, e: TransitionEvent): void => {
        if (e.target !== e.currentTarget) return;
        if (e.propertyName !== "grid-template-rows") return;
        if (pane.value !== p) leaving.delete(p);
        else onArrive(p);
    };

    return { pane, isOpen, isMounted, push, back, onRowTransitionEnd };
}
