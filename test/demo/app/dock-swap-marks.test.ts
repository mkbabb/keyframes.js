/**
 * FORTY-SIXTH A (K-1) — what the dock-swap look is told about each dock and
 * seat across a page change (@app/dock/dockSwap), read before the swap and
 * after its update:
 *
 *   - A seat whose face changes (its name or its words: the scene seat's
 *     "Cube" to "Home", Play to Pause) is marked to trade, its old face out
 *     and then its new one in; a seat that shows the same face is not.
 *     Unmarked, the two faces cross-faded over each other, and the images were
 *     sized by the seat's gliding box ("Rotations" at half size over "≡").
 *   - A dock folded after the update folds (to the circle its height across),
 *     even when glass's morph keeps its box open and wider than it was painted
 *     before: marked as opening, its capsule widened the old, open dock for
 *     the whole clock and the folded circle stood in its place between two
 *     frames (Play with the dock open, 390).
 *   - The marks go when the swap ends.
 *
 * jsdom has no layout: each dock's box is stubbed (its painted rect and its
 * layout height), as the browser would read them.
 */
import { afterEach, describe, expect, it } from "vitest";
import { clearDockSwap, dockWidths, markDockSwap } from "../../../demo/app/dock/dockSwap";

/** A dock as the components render it: its swap group, glass's dock, its active layer of seats. */
function dock(name: string): { group: HTMLElement; glass: HTMLElement; layer: HTMLElement } {
    const group = document.createElement("div");
    group.dataset.dockSwap = name;
    const glass = document.createElement("div");
    glass.className = "glass-dock";
    const layer = document.createElement("div");
    layer.className = "dock-layer is-active";
    glass.append(layer);
    group.append(glass);
    document.body.append(group);
    return { group, glass, layer };
}

function seat(layer: HTMLElement, label: string, words = ""): HTMLElement {
    const b = document.createElement("button");
    b.setAttribute("aria-label", label);
    b.textContent = words;
    layer.append(b);
    return b;
}

/** Stub the painted box and the layout height a browser would read. */
function box(el: HTMLElement, width: number, height: number): void {
    el.getBoundingClientRect = () => ({ x: 0, y: 0, left: 0, top: 0, right: width, bottom: height, width, height, toJSON() {} }) as DOMRect;
    Object.defineProperty(el, "offsetHeight", { configurable: true, get: () => height });
}

afterEach(() => {
    clearDockSwap();
    document.body.replaceChildren();
});

describe("the dock-swap marks", () => {
    it("marks a seat whose face changes to trade, and leaves one that holds its face", () => {
        const { glass, layer } = dock("chrome-dock");
        box(glass, 450, 56);
        const scene = seat(layer, "Scene", "Cube");
        const play = seat(layer, "Play animation");
        const account = seat(layer, "Account", "A");
        const before = dockWidths();
        scene.textContent = "Home";
        play.setAttribute("aria-label", "Pause animation");
        box(glass, 322, 56);
        markDockSwap(before);
        expect(scene.hasAttribute("data-dock-trade")).toBe(true);
        expect(play.hasAttribute("data-dock-trade")).toBe(true);
        expect(account.hasAttribute("data-dock-trade")).toBe(false);
        expect(document.documentElement.dataset.dockShrinks).toBe("chrome-dock");
        clearDockSwap();
        expect(document.querySelectorAll("[data-dock-trade]")).toHaveLength(0);
        expect(document.documentElement.dataset.dockShrinks).toBeUndefined();
    });

    it("folds a dock folded after the update to the circle its height across, though glass keeps its box open", () => {
        const { glass, layer } = dock("chrome-dock");
        seat(layer, "Scene", "Home");
        // Glass's fold began at the press: folded and morphing at the first
        // reading, still painted at the open dock's width.
        glass.classList.add("collapsed");
        glass.setAttribute("data-morphing", "");
        box(glass, 243, 60);
        const before = dockWidths();
        // After the update glass's morph runs on in a box laid out for the
        // cube's seats, wider than the dock was painted.
        box(glass, 383, 60);
        markDockSwap(before);
        const root = document.documentElement;
        expect(root.dataset.dockFolds).toBe("chrome-dock");
        expect(root.dataset.dockOpens).toBeUndefined();
        expect(root.style.getPropertyValue("--kf-dock-from-chrome-dock")).toBe("243px");
        expect(root.style.getPropertyValue("--kf-dock-to-chrome-dock")).toBe("60px");
        clearDockSwap();
        expect(root.style.getPropertyValue("--kf-dock-to-chrome-dock")).toBe("");
    });

    it("opens a dock glass unfolds as the page changes, from the width it was painted at", () => {
        const { glass } = dock("transport-dock");
        glass.classList.add("collapsed");
        box(glass, 60, 60);
        const before = dockWidths();
        glass.classList.remove("collapsed");
        glass.setAttribute("data-morphing", "");
        box(glass, 275, 60);
        markDockSwap(before);
        const root = document.documentElement;
        expect(root.dataset.dockOpens).toBe("transport-dock");
        expect(root.dataset.dockFolds).toBeUndefined();
        expect(root.style.getPropertyValue("--kf-dock-from-transport-dock")).toBe("60px");
        expect(root.style.getPropertyValue("--kf-dock-to-transport-dock")).toBe("");
    });
});
