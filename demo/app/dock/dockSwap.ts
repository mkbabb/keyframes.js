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
 * A folding dock's capsule glides to the circle glass folds it to (the dock's
 * height, `--kf-dock-to-<name>`), not to its box: glass's morph keeps the
 * open box under the folding plate, so a glide to the box widened the old,
 * open dock for the whole clock and the folded circle then stood in its
 * place between two frames.
 *
 * A seat whose face changes across the swap (the scene seat's "Cube" to
 * "Home", Play to Pause, the transport's channel seat) is marked
 * `data-dock-trade`: its old face goes out, then its new one comes in, never
 * the two over each other (motion canon P0a, in against out, 4).
 *
 * Read before the swap (`dockWidths`) and after its DOM update (`markDockSwap`),
 * the marks stand on the root while the transition runs (`clearDockSwap`).
 * Each dock's group element carries `data-dock-swap="<its group name>"`.
 */
export type DockWidths = Map<
    string,
    { width: number; height: number; morphing: boolean; folded: boolean; faces: Map<Element, string> }
>;

const MARKS = ["dockGrows", "dockShrinks", "dockLive", "dockOpens", "dockFolds"] as const;

/** A dock's seats, as the docks name them while a swap runs (ChromeDock, TransportDock). */
const SEATS = ".glass-dock .dock-layer.is-active > *, .glass-dock .dock-persistent > *, .glass-dock .dock-layer.is-active > .transport-row > *";

/** What a seat shows: its name and its words. */
const face = (el: Element): string => `${el.getAttribute("aria-label") ?? ""}|${el.textContent?.trim() ?? ""}`;

/** Each dock, by its group name: its painted width and height now, whether glass morphs or folds it, and its seats' faces. */
export function dockWidths(): DockWidths {
    const out: DockWidths = new Map();
    for (const el of document.querySelectorAll<HTMLElement>("[data-dock-swap]")) {
        const dock = el.querySelector<HTMLElement>(".glass-dock");
        const box = (dock ?? el).getBoundingClientRect();
        if (box.width <= 0) continue;
        out.set(el.dataset.dockSwap!, {
            width: box.width,
            // Its layout height: glass's morph scales the plate, never the box's block size.
            height: dock?.offsetHeight ?? box.height,
            morphing: dock?.hasAttribute("data-morphing") ?? false,
            folded: dock?.classList.contains("collapsed") ?? false,
            faces: new Map([...el.querySelectorAll(SEATS)].map((seat) => [seat, face(seat)])),
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
        for (const [seat, was] of from.faces) {
            if (seat.isConnected && to.faces.has(seat) && to.faces.get(seat) !== was) seat.setAttribute("data-dock-trade", "");
        }
        if (from.morphing || to.morphing) {
            marks.dockLive.push(name);
            // Glass's fold says which way: a dock folded after the update
            // folds (its fold may have begun at the press, before the first
            // reading, while glass's morph keeps its box open); one unfolded
            // opens if it was folded, or (a tap has already opened the folded
            // transport) if its painted width grows.
            const folds = to.folded;
            const opens = !folds && (from.folded || to.width - from.width >= 1);
            const way = opens ? marks.dockOpens : folds ? marks.dockFolds : null;
            if (way) {
                way.push(name);
                root.style.setProperty(`--kf-dock-from-${name}`, `${from.width}px`);
                // Folded, the dock is a circle its height across.
                if (folds) root.style.setProperty(`--kf-dock-to-${name}`, `${to.height}px`);
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
    for (const name of ["chrome-dock", "transport-dock"]) {
        root.style.removeProperty(`--kf-dock-from-${name}`);
        root.style.removeProperty(`--kf-dock-to-${name}`);
    }
    for (const seat of document.querySelectorAll("[data-dock-trade]")) seat.removeAttribute("data-dock-trade");
}
