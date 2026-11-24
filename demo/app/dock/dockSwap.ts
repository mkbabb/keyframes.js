/**
 * FORTY-SIXTH A (K-1) — which way each dock's width goes across a page change,
 * for the dock-swap look (@styles/dock-swap.css).
 *
 * A dock that changes width across the swap draws ONE of its two plate images,
 * the wider, at its own size and cut to the group's gliding capsule: the cut of
 * a uniform plate is the plate at every width between. Cross-faded at their own
 * sizes, the narrower plate stood inside the wider as a second, darker capsule;
 * stretched to the group's box, Home's round Play plate became an ellipse on
 * its way to the bar. A dock whose width holds keeps the cross-fade, and so
 * does one that is opening or folding (its seats are in its image then).
 *
 * Read before the swap (`dockWidths`) and after its DOM update (`markDockSwap`),
 * the marks stand on the root while the transition runs (`clearDockSwap`).
 * Each dock's group element carries `data-dock-swap="<its group name>"`.
 */
export type DockWidths = Map<string, number>;

/** Each dock at rest, by its group name: its width now. */
export function dockWidths(): DockWidths {
    const out: DockWidths = new Map();
    for (const el of document.querySelectorAll<HTMLElement>("[data-dock-swap]")) {
        if (el.querySelector(".glass-dock[data-morphing]")) continue;
        const width = el.getBoundingClientRect().width;
        if (width > 0) out.set(el.dataset.dockSwap!, width);
    }
    return out;
}

/** Mark on the root the docks that grow and those that shrink since `before`. */
export function markDockSwap(before: DockWidths): void {
    const after = dockWidths();
    const grows: string[] = [];
    const shrinks: string[] = [];
    for (const [name, from] of before) {
        const to = after.get(name);
        if (to === undefined || Math.abs(to - from) < 1) continue;
        (to > from ? grows : shrinks).push(name);
    }
    const root = document.documentElement;
    if (grows.length) root.dataset.dockGrows = grows.join(" ");
    else delete root.dataset.dockGrows;
    if (shrinks.length) root.dataset.dockShrinks = shrinks.join(" ");
    else delete root.dataset.dockShrinks;
}

export function clearDockSwap(): void {
    const root = document.documentElement;
    delete root.dataset.dockGrows;
    delete root.dataset.dockShrinks;
}
