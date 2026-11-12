// SERVED MODEL: claude-opus-5-5
/**
 * X.KF.W13X.r4init — KFA-76 heavy-scene-init limb (ESC-r4shell-1, COHESION
 * §0fa item 3): the Amiga room is built PAST the scene's first paint, one stage
 * per frame, behind a skeleton.
 *
 * Measured on gh-pages (`evidence/W13X/r4shell/swapprof-gh-amiga.txt`): a swap
 * into amiga ran one 676 ms long-animation-frame, 541 ms of it three.js init
 * inside the swap's own frame, because `onMounted` built the whole room
 * (graph, GL context, program compile, first draw) inline.
 *
 * The frames are driven by hand: `requestAnimationFrame` is a queue this test
 * flushes, so "a frame painted" is an explicit act. The room's graph and the
 * materials are the real module's; only the WebGL renderer is a recorder (jsdom
 * has no GL) and the 2D canvas context a no-op.
 *
 *  (1) a mount paints first: until a frame has run, the room is not built, no
 *      GL context exists, and the room reads `booting`;
 *  (2) the build is staged a frame apart: the graph lands after the first
 *      frame, the GL context after the next, and the present loop arms (the
 *      skeleton lifts) only after the program compile has settled;
 *  (3) a dispose mid-build retires the build: no GL context is created after;
 *  (4) o1111 kfamiga — a mount inside a running View Transition with no room
 *      prepared (the hard load's path) builds nothing until the transition
 *      has finished, so no build stage lands in the visible cross-fade;
 *  (5) owner-1112 (item 6) — a room PREPARED before the swap (the switch's
 *      prepare step, staged a frame apart while the leaving scene shows) is
 *      adopted whole by a mount inside the transition: no skeleton, no second
 *      context, the present loop armed, the first frame drawn, in the mount's
 *      own step, so the room is in the new-state capture and the cross-fade.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, ref } from "vue";
import { mount } from "@vue/test-utils";

const gl = vi.hoisted(() => ({ renderers: 0, compiles: 0, renders: 0 }));

vi.mock("three", async (importOriginal) => {
    const real = await importOriginal<typeof import("three")>();
    class RecordingRenderer {
        domElement: HTMLCanvasElement;
        constructor(opts: { canvas: HTMLCanvasElement }) {
            gl.renderers++;
            this.domElement = opts.canvas;
        }
        setPixelRatio() {}
        setClearColor() {}
        setSize() {}
        compileAsync() {
            gl.compiles++;
            return Promise.resolve();
        }
        render() {
            gl.renders++;
        }
        dispose() {}
        forceContextLoss() {}
    }
    return { ...real, WebGLRenderer: RecordingRenderer };
});

vi.mock("@mkbabb/glass-ui", () => ({
    resolveCanvasColor: (color: string) => (color.includes("--amiga-red") ? "rgb(220, 40, 40)" : "rgb(28, 25, 23)"),
}));

import {
    discardPreparedAmigaRoom,
    prepareAmigaRoom,
    useAmigaThree,
} from "../../../demo/scenes/amiga/useAmigaThree";

/** The hand-driven frame queue. */
let frames: FrameRequestCallback[] = [];
/** Let every queued task and microtask run (no frame is produced). */
const settleTasks = async () => {
    for (let i = 0; i < 4; i++) await new Promise((r) => setTimeout(r, 0));
};
/** Produce one frame (its rAF callbacks), then let the tasks queued from it run. */
const paintFrame = async () => {
    const due = frames;
    frames = [];
    for (const cb of due) cb(performance.now());
    await settleTasks();
};

function mountRoom() {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(
        () =>
            ({
                createRadialGradient: () => ({ addColorStop: () => {} }),
                fillRect: () => {},
                clearRect: () => {},
                set fillStyle(_v: unknown) {},
            }) as never,
    );
    const canvas = document.createElement("canvas");
    Object.defineProperty(canvas, "clientWidth", { value: 878 });
    Object.defineProperty(canvas, "clientHeight", { value: 646 });
    let handle!: ReturnType<typeof useAmigaThree>;
    const wrapper = mount(
        defineComponent({
            setup() {
                handle = useAmigaThree(ref(canvas), () => false);
                return () => h("div");
            },
        }),
    );
    return { handle, wrapper };
}

describe("X.KF.W13X.r4init — KFA-76: the Amiga room builds past the first paint", () => {
    beforeEach(() => {
        gl.renderers = 0;
        gl.compiles = 0;
        gl.renders = 0;
        frames = [];
        vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
            frames.push(cb);
            return frames.length;
        });
        vi.stubGlobal("cancelAnimationFrame", () => {});
    });
    afterEach(() => {
        discardPreparedAmigaRoom();
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it("(1) a mount paints first: no room and no GL context before a frame has run", async () => {
        const { handle, wrapper } = mountRoom();
        void handle.setup();
        await settleTasks();
        expect(gl.renderers).toBe(0);
        expect(handle.getSphere()).toBeUndefined();
        expect(handle.booting.value).toBe(true);
        expect(handle.running).toBe(false);
        wrapper.unmount();
    });

    it("(2) the build is staged a frame apart, and the loop arms after the compile", async () => {
        const { handle, wrapper } = mountRoom();
        const built = handle.setup();
        await settleTasks();
        await paintFrame();
        // Frame 1 painted: the graph exists, the GL context does not yet.
        expect(handle.getSphere()).toBeDefined();
        expect(gl.renderers).toBe(0);
        await paintFrame();
        // Frame 2 painted: the context exists; the programs are not compiled.
        expect(gl.renderers).toBe(1);
        expect(gl.compiles).toBe(0);
        expect(handle.booting.value).toBe(true);
        await paintFrame();
        await built;
        // Frame 3 painted: compiled, the skeleton lifts, the present loop arms.
        expect(gl.compiles).toBe(1);
        expect(handle.booting.value).toBe(false);
        expect(handle.failed.value).toBe(false);
        expect(handle.running).toBe(true);
        wrapper.unmount();
    });

    it("(3) a dispose mid-build retires it: no GL context is created after", async () => {
        const { handle, wrapper } = mountRoom();
        const built = handle.setup();
        await settleTasks();
        await paintFrame();
        wrapper.unmount();
        await paintFrame();
        await paintFrame();
        await built;
        expect(gl.renderers).toBe(0);
        expect(handle.running).toBe(false);
    });

    it("(4) a mount inside a running View Transition builds nothing until it has finished", async () => {
        let transition = true;
        const matches = Element.prototype.matches;
        vi.spyOn(Element.prototype, "matches").mockImplementation(function (this: Element, selector: string) {
            if (selector === ":active-view-transition") return transition;
            return matches.call(this, selector);
        });
        const { handle, wrapper } = mountRoom();
        const built = handle.setup();
        await settleTasks();
        // Three frames of the cross-fade: no graph, no context, still booting.
        for (let i = 0; i < 3; i++) await paintFrame();
        expect(handle.getSphere()).toBeUndefined();
        expect(gl.renderers).toBe(0);
        expect(handle.booting.value).toBe(true);
        // The transition finishes: the first frame after it sees none running,
        // and the staged build starts a frame later, exactly as outside a swap.
        transition = false;
        await paintFrame();
        expect(handle.getSphere()).toBeUndefined();
        await paintFrame();
        expect(handle.getSphere()).toBeDefined();
        expect(gl.renderers).toBe(0);
        await paintFrame();
        expect(gl.renderers).toBe(1);
        await paintFrame();
        await built;
        expect(handle.running).toBe(true);
        wrapper.unmount();
    });
    it("(5) a room prepared before the swap is adopted whole by a mount inside it", async () => {
        vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(
            () =>
                ({
                    createRadialGradient: () => ({ addColorStop: () => {} }),
                    fillRect: () => {},
                    clearRect: () => {},
                    set fillStyle(_v: unknown) {},
                }) as never,
        );
        // The switch's prepare step, before the transition starts: staged.
        const ready = prepareAmigaRoom();
        await settleTasks();
        expect(gl.renderers).toBe(0);
        await paintFrame();
        expect(gl.renderers).toBe(0);
        await paintFrame();
        expect(gl.renderers).toBe(1);
        await paintFrame();
        await ready;
        expect(gl.compiles).toBe(1);
        const drawnAhead = gl.renders;
        expect(drawnAhead).toBe(1);

        // The mount, inside the running transition.
        const matches = Element.prototype.matches;
        vi.spyOn(Element.prototype, "matches").mockImplementation(function (this: Element, selector: string) {
            if (selector === ":active-view-transition") return true;
            return matches.call(this, selector);
        });
        const { handle, wrapper } = mountRoom();
        expect(handle.booting.value).toBe(false);
        await handle.setup();
        // Adopted in the mount's own step: no new context, drawn, looping.
        expect(gl.renderers).toBe(1);
        expect(handle.getSphere()).toBeDefined();
        expect(handle.booting.value).toBe(false);
        expect(handle.running).toBe(true);
        expect(gl.renders).toBe(drawnAhead + 1);
        wrapper.unmount();
    });
});
