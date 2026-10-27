/**
 * OD19 residue-2 (COHESION §0gq.3) — a swap's fold landing waits out the
 * swap's commit frame.
 *
 * MEASURED (OD19 residue profile, real-GPU cell): a scene swap mounts the new
 * rail inside the View Transition's update callback, and `useFoldLanding`'s
 * landing ran in the commit frame, where clearing a cap and reading the fold
 * forced a layout of the half-built scene (2-10 ms of that frame per swap).
 *
 * The witness drives the REAL `useFoldLanding` over a rail with one port.
 * While a transition runs (`:active-view-transition` matches), the landing
 * takes the second frame, never the first; outside one it lands in the first
 * frame, as before. Born RED at `fc1a3383` (the landing took the commit frame).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, nextTick, ref } from "vue";
import { mount, type VueWrapper } from "@vue/test-utils";
import { useFoldLanding } from "../../../demo/components/instrument/pane/composables/useFoldLanding";

class NoopResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
}

describe("a swap's fold landing waits out the commit frame", () => {
    let wrapper: VueWrapper | undefined;
    let frames: FrameRequestCallback[];
    let swapping: boolean;

    beforeEach(() => {
        frames = [];
        swapping = false;
        vi.stubGlobal("ResizeObserver", NoopResizeObserver);
        vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => frames.push(cb));
        vi.stubGlobal("cancelAnimationFrame", () => {});
        const root = document.documentElement;
        const own = root.matches.bind(root);
        vi.spyOn(root, "matches").mockImplementation(((selector: string) =>
            selector === ":active-view-transition" ? swapping : own(selector)) as typeof root.matches);
    });
    afterEach(() => {
        wrapper?.unmount();
        wrapper = undefined;
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    /** Mount a rail; return the frame (1-based) the landing first read it in. */
    const landingFrame = async (): Promise<number> => {
        const rail = ref<HTMLElement | null>(null);
        let reads = 0;
        wrapper = mount(
            defineComponent({
                setup() {
                    useFoldLanding(rail);
                    return () =>
                        h("div", { ref: rail }, [h("div", { "data-fold-key": "k" }, [h("p", "row")])]);
                },
            }),
            { attachTo: document.body },
        );
        await nextTick();
        const el = rail.value!;
        const own = el.querySelectorAll.bind(el);
        el.querySelectorAll = ((sel: string) => {
            reads++;
            return own(sel);
        }) as typeof el.querySelectorAll;
        for (let frame = 1; frame <= 4; frame++) {
            const due = frames.splice(0);
            for (const cb of due) cb(performance.now());
            if (reads > 0) return frame;
        }
        return Infinity;
    };

    it("lands in the second frame while a view transition runs", async () => {
        swapping = true;
        expect(await landingFrame()).toBe(2);
    });

    it("lands in the first frame outside a transition", async () => {
        expect(await landingFrame()).toBe(1);
    });
});
