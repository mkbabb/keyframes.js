/**
 * FORTY-SIXTH A (K-1) — which way each dock's width goes across a page change,
 * for the dock-swap look (@styles/dock-swap.css).
 *
 * A dock that changes width across the swap draws ONE of its two plate images,
 * the wider, at its own size and cut to the group's gliding capsule: the cut of
 * a uniform plate is the plate at every width between. Cross-faded at their own
 * sizes, the narrower plate stood inside the wider as a second, darker capsule;
 * stretched to the group's box, Home's round Play plate became an ellipse on
 * its way to the bar. A dock whose width holds keeps the cross-fade.
 *
 * A dock glass is opening or folding at either reading is marked
 * `data-dock-live`. The page holds its last frame while the swap's update runs
 * and glass's morph runs on behind it, so drawn as it then stands the dock
 * came out of the hold already open or already folded. So one that opens
 * (`data-dock-opens`: glass's fold lifted between the readings, or its painted
 * width grown) draws its live image, and one that folds (`data-dock-folds`)
 * its old one, each cut to a capsule that glides from the width it was
 * painted at before the hold (`--kf-dock-from-<name>`, the glass dock's
 * painted width: its morph scales the plate) to the group's box.
 *
 * Read before the swap (`dockWidths`) and after its DOM update (`markDockSwap`),
 * the marks stand on the root while the transition runs (`clearDockSwap`).
 * Each dock's group element carries `data-dock-swap="<its group name>"`.
 */
export type DockWidths = Map<string, { width: number; morphing: boolean; folded: boolean }>;

const MARKS = ["dockGrows", "dockShrinks", "dockLive", "dockOpens", "dockFolds"] as const;

/** Each dock, by its group name: its painted width now, and whether glass morphs or folds it. */
export function dockWidths(): DockWidths {
    const out: DockWidths = new Map();
    for (const el of document.querySelectorAll<HTMLElement>("[data-dock-swap]")) {
        const dock = el.querySelector<HTMLElement>(".glass-dock");
        const width = (dock ?? el).getBoundingClientRect().width;
        if (width <= 0) continue;
        out.set(el.dataset.dockSwap!, {
            width,
            morphing: dock?.hasAttribute("data-morphing") ?? false,
            folded: dock?.classList.contains("collapsed") ?? false,
        });
    }
    return out;
}

/** Mark on the root how each dock's width goes since `before`. */
export function markDockSwap(before: DockWidths): void {
    const after = dockWidths();
    const marks: Record<(typeof MARKS)[number], string[]> = { dockGrows: [], dockShrinks: [], dockLive: [], dockOpens: [], dockFolds: [] };
    const root = document.documentElement;
    for (const [name, from] of before) {
        const to = after.get(name);
        if (!to) continue;
        if (from.morphing || to.morphing) {
            marks.dockLive.push(name);
            // Glass's fold says which way; while it does not change (a tap
            // has already opened the folded transport), the painted width.
            const opens = from.folded === to.folded ? to.width - from.width >= 1 : from.folded;
            const folds = from.folded === to.folded ? from.width - to.width >= 1 : to.folded;
            const way = opens ? marks.dockOpens : folds ? marks.dockFolds : null;
            if (way) {
                way.push(name);
                root.style.setProperty(`--kf-dock-from-${name}`, `${from.width}px`);
            }
        } else if (Math.abs(to.width - from.width) >= 1) {
            (to.width > from.width ? marks.dockGrows : marks.dockShrinks).push(name);
        }
    }
    for (const key of MARKS) {
        if (marks[key].length) root.dataset[key] = marks[key].join(" ");
        else delete root.dataset[key];
    }
}

export function clearDockSwap(): void {
    const root = document.documentElement;
    for (const key of MARKS) delete root.dataset[key];
    for (const name of ["chrome-dock", "transport-dock"]) root.style.removeProperty(`--kf-dock-from-${name}`);
}
