/**
 * X.KF.W13X.r4press — ESC-W13X-r4cube-1 (COHESION §0fa item 6): the first
 * pointer press on Play, with the transport dock idle-collapsed, must act.
 *
 * Served (`evidence/W13X/r4press/before-collapse-r*.txt`): the press lands on the
 * persistent Play's icon, the dock expands under it, Play slides to the leading
 * edge, and the release lands on the neighbour ("Channel to edit") — so the
 * same-control law read the release node, saw no Play, and dropped the press.
 *
 * The law identifies the press by its CONTROL: a release inside the box the
 * origin control had at `pointerdown` completes that control's click, whatever
 * node is under the pointer now. A release outside that box stays a drag-off.
 * Real DOM nodes, real bubbling to the window; only the layout boxes are set.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { usePlayActuation } from "@components/instrument/transport/composables/usePlayActuation";

const box = (el: Element, x: number, y: number, w = 44, h = 44) => {
    el.getBoundingClientRect = () => DOMRect.fromRect({ x, y, width: w, height: h });
};

const press = (type: "pointerdown" | "pointerup", x: number, y: number) =>
    new PointerEvent(type, {
        pointerId: 1,
        isPrimary: true,
        button: 0,
        pointerType: "mouse",
        clientX: x,
        clientY: y,
        bubbles: true,
    });

/** The persistent Play beside its neighbour, wired as TransportDock wires it. */
function mountDock(actuate: () => void) {
    const play = document.createElement("button");
    play.setAttribute("aria-label", "Play animation");
    const neighbour = document.createElement("button");
    neighbour.setAttribute("aria-label", "Channel to edit");
    document.body.append(play, neighbour);
    const h = usePlayActuation(actuate);
    play.addEventListener("pointerdown", (e) => h.onPlayPointerDown(e));
    play.addEventListener("pointerup", (e) => h.onPlayPointerUp(e));
    play.addEventListener("pointercancel", (e) => h.onPlayPointerCancel(e));
    // Collapsed: Play is centred on the plate, under the pointer at (722, 822).
    box(play, 700, 800);
    box(neighbour, 760, 800, 120, 44);
    return { play, neighbour };
}

/** The press expands the dock: Play slides to the leading edge, the neighbour slides under the pointer. */
const expandUnderPointer = (play: Element, neighbour: Element) => {
    box(play, 560, 800);
    box(neighbour, 700, 800, 120, 44);
};

afterEach(() => {
    document.body.replaceChildren();
});

describe("usePlayActuation — the press whose control moved (ESC-W13X-r4cube-1)", () => {
    it("a still pointer released on the neighbour after the dock expanded under it actuates Play once", () => {
        const actuate = vi.fn();
        const { play, neighbour } = mountDock(actuate);
        play.dispatchEvent(press("pointerdown", 722, 822));
        expandUnderPointer(play, neighbour);
        neighbour.dispatchEvent(press("pointerup", 722, 822));
        expect(actuate).toHaveBeenCalledOnce();
    });

    it("the press is consumed: a later stray release on the window does not actuate again", () => {
        const actuate = vi.fn();
        const { play, neighbour } = mountDock(actuate);
        play.dispatchEvent(press("pointerdown", 722, 822));
        expandUnderPointer(play, neighbour);
        neighbour.dispatchEvent(press("pointerup", 722, 822));
        window.dispatchEvent(press("pointerup", 722, 822));
        expect(actuate).toHaveBeenCalledOnce();
    });

    it("a drag-off (released outside the box Play had at the press) still never actuates", () => {
        const actuate = vi.fn();
        const { play, neighbour } = mountDock(actuate);
        play.dispatchEvent(press("pointerdown", 722, 822));
        expandUnderPointer(play, neighbour);
        neighbour.dispatchEvent(press("pointerup", 800, 822));
        expect(actuate).not.toHaveBeenCalled();
    });

    it("a pointercancel after the move never actuates", () => {
        const actuate = vi.fn();
        const { play, neighbour } = mountDock(actuate);
        play.dispatchEvent(press("pointerdown", 722, 822));
        expandUnderPointer(play, neighbour);
        neighbour.dispatchEvent(
            new PointerEvent("pointercancel", { pointerId: 1, clientX: 722, clientY: 822, bubbles: true }),
        );
        expect(actuate).not.toHaveBeenCalled();
    });

    it("the pre-collapse path is unchanged: down and up on Play actuate once, not twice", () => {
        const actuate = vi.fn();
        const { play } = mountDock(actuate);
        play.dispatchEvent(press("pointerdown", 722, 822));
        play.dispatchEvent(press("pointerup", 722, 822));
        expect(actuate).toHaveBeenCalledOnce();
    });
});
