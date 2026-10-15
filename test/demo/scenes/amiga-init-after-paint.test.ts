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
 *  (3) a dispose mid-build retires the build: no GL context is created after.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, ref } from "vue";
import { mount } from "@vue/test-utils";

const gl = vi.hoisted(() => ({ renderers: 0, compiles: 0 }));

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
        render() {}
        dispose() {}
        forceContextLoss() {}
    }
    return { ...real, WebGLRenderer: RecordingRenderer };
});

vi.mock("@mkbabb/glass-ui", () => ({
    resolveCanvasColor: (color: string) => (color.includes("--amiga-red") ? "rgb(220, 40, 40)" : "rgb(28, 25, 23)"),
}));

import { useAmigaThree } from "../../../demo/scenes/amiga/useAmigaThree";

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
        frames = [];
        vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
            frames.push(cb);
            return frames.length;
        });
        vi.stubGlobal("cancelAnimationFrame", () => {});
    });
    afterEach(() => {
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
});
