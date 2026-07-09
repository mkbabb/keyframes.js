import { onMounted } from "vue";

/**
 * WAI-ARIA horizontal-toolbar keyboard behavior (roving tabindex) over the real
 * `<button>` descendants of a container.
 *
 * This is the accessible keyboard core that the shadcn reka `Menubar` used to
 * supply for KeyframesEditor's action bar. S.C3b (C-19) migrated that bar off
 * the deleted `ui/menubar` shadcn island via the a24-F6 **relocate-in-place**
 * path — the bar was a 4-affordance *toolbar* (add / copy / apply, plus a
 * decorative wand), never a set of menus (it carried ZERO `MenubarContent`), so
 * a `dropdown-menu` remap would have buried frequently-used authoring actions
 * behind a trigger AND broken the persistent brush affordance (its ref lives in
 * a portalled content that is unmounted until first open). The in-place toolbar
 * keeps every action visible and working; this composable restores the roving
 * keyboard semantics reka gave it, with no external dependency:
 *
 *   • the toolbar is ONE tab stop — the active item carries `tabindex="0"`, the
 *     rest `tabindex="-1"`, so Tab moves into/out of the whole bar as a unit;
 *   • ArrowRight / ArrowLeft move focus between items (wrapping at the ends);
 *   • Home / End jump to the first / last item.
 *
 * Container-based (it queries the container's `button` descendants) so it is
 * agnostic to how each action renders its button — KeyframesAddDialog's
 * DialogTrigger, CopyButton, the Apply-CSS button — with no per-item
 * registration. Non-button decorative icons (the WandSparkles lead) and
 * `aria-hidden`/`disabled` elements are excluded from the roving cohort.
 */
export interface ToolbarKeyboard {
    /** `keydown` handler to bind on the toolbar container. */
    onKeydown: (event: KeyboardEvent) => void;
    /** (Re)seat the single tab stop — call once the item buttons have mounted. */
    refresh: () => void;
}

export function useToolbarKeyboard(
    getContainer: () => HTMLElement | null | undefined,
): ToolbarKeyboard {
    const items = (): HTMLElement[] => {
        const container = getContainer();
        if (!container) return [];
        return Array.from(
            container.querySelectorAll<HTMLElement>("button"),
        ).filter(
            (el) =>
                !el.hasAttribute("disabled") &&
                el.getAttribute("aria-hidden") !== "true",
        );
    };

    /** Give item `activeIndex` the sole `tabindex="0"`; the rest get `-1`. */
    const seat = (list: HTMLElement[], activeIndex: number): void => {
        list.forEach((el, i) => {
            el.tabIndex = i === activeIndex ? 0 : -1;
        });
    };

    const focusIndex = (index: number): void => {
        const list = items();
        if (list.length === 0) return;
        const next = ((index % list.length) + list.length) % list.length;
        seat(list, next);
        list[next]!.focus();
    };

    const step = (delta: number): void => {
        const list = items();
        if (list.length === 0) return;
        const current = list.findIndex((el) => el === document.activeElement);
        focusIndex((current === -1 ? 0 : current) + delta);
    };

    const refresh = (): void => {
        const list = items();
        if (list.length === 0) return;
        const current = list.findIndex((el) => el === document.activeElement);
        seat(list, current === -1 ? 0 : current);
    };

    const onKeydown = (event: KeyboardEvent): void => {
        switch (event.key) {
            case "ArrowRight":
                event.preventDefault();
                step(1);
                break;
            case "ArrowLeft":
                event.preventDefault();
                step(-1);
                break;
            case "Home":
                event.preventDefault();
                focusIndex(0);
                break;
            case "End": {
                event.preventDefault();
                const n = items().length;
                if (n > 0) focusIndex(n - 1);
                break;
            }
        }
    };

    // Seat the tab stop once the child-rendered item buttons exist (the dialog
    // trigger / copy button render in the same tick, but a microtask defers
    // past their attach so the query is non-empty).
    onMounted(() => {
        queueMicrotask(refresh);
    });

    return { onKeydown, refresh };
}
