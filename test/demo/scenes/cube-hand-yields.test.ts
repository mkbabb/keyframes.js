// SERVED MODEL: claude-opus-5-5
/**
 * A hand on the playing die: the scene yields while it holds.
 *
 * On a phone the playing cube scene repainted its transport every frame, and
 * its touches reached the page about 15 ms later than the paused scene's
 * (28.7 ms against 13.2 ms, created to handled). While a finger
 * or the mouse holds the die, the group's own loop now pauses (the die holds
 * still under the hand, and the page's frames carry the hand alone); at the
 * release it plays on from the same instant. Only a loop that was running is
 * paused, only that pause is resumed, and a Pause pressed during the hold is
 * kept.
 *
 * Born red: the orbit said nothing of a hand, and the group played on under it.
 */
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick, ref } from "vue";
import { withSetup } from "../../support/withSetup";
import { warmKfEngine } from "../../../demo/kf-engine";
import { useCubeDemo } from "../../../demo/scenes/cube/useCubeDemo";
import { createMatrix } from "../../../demo/scenes/cube/matrix-editor/transformMath";
import OrbitalDrag from "../../../demo/scenes/cube/orbital-drag/OrbitalDrag.vue";
import { defaultTransformState, type TransformState } from "../../../demo/scenes/cube/orbital-drag/transform";

let queue: FrameRequestCallback[] = [];
let now = 0;
beforeEach(() => {
    queue = [];
    now = 0;
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
        queue.push(cb);
        return queue.length;
    });
    vi.stubGlobal("cancelAnimationFrame", () => {});
});
afterEach(() => vi.unstubAllGlobals());

const frames = async (n: number) => {
    for (let i = 0; i < n; i++) {
        now += 1000 / 60;
        const due = queue;
        queue = [];
        for (const cb of due) cb(now);
        await nextTick();
    }
};

const el = (parent: HTMLElement, cls: string): HTMLElement => {
    const node = document.createElement("div");
    node.className = cls;
    parent.appendChild(node);
    return node;
};

const ptr = (type: string, x: number, y: number, t: number) => {
    const e = new PointerEvent(type, { clientX: x, clientY: y, pointerId: 7, pointerType: "touch", bubbles: true });
    Object.defineProperty(e, "timeStamp", { value: t });
    return e;
};

describe("the orbit says when a hand holds the die", () => {
    it("emits hold true at the first finger down and false at the last one up", async () => {
        const model = ref<TransformState>(structuredClone(defaultTransformState));
        const w = mount(OrbitalDrag, {
            props: {
                applyTransformToContainer: true,
                modelValue: model.value,
                "onUpdate:modelValue": (v: TransformState) => (model.value = v),
                frame: () => ({ centre: { x: 200, y: 300 }, side: 160, fit: 1, stage: null }),
            },
            attachTo: document.body,
        });
        await nextTick();
        const surface = w.element as HTMLElement;
        surface.dispatchEvent(ptr("pointerdown", 200, 300, 10));
        await nextTick();
        document.dispatchEvent(ptr("pointermove", 220, 300, 26));
        await frames(2);
        document.dispatchEvent(ptr("pointerup", 220, 300, 200));
        await nextTick();
        expect(w.emitted("hold")).toEqual([[true], [false]]);
        w.unmount();
    });
});

describe("the playing cube yields to a hand on the die", () => {
    beforeAll(async () => {
        await warmKfEngine();
    });

    const setup = () => {
        const held = ref(false);
        const playing = ref(true);
        const [demo, app] = withSetup(() =>
            useCubeDemo(ref(createMatrix()), ref(createMatrix()), ref("crayon"), { settle: false, held, playing }),
        );
        const graphEl = el(document.body, "graph");
        const bobEl = el(graphEl, "cube-bob");
        const poseEl = el(bobEl, "cube-pose");
        const cubeEl = el(poseEl, "cube");
        cubeEl.style.setProperty("--rotationX", "360deg");
        demo.setTargets({ cubeEl, bobEl, poseEl, graphEl });
        return { demo, app, held, playing, cubeEl, group: demo.animationGroup.value };
    };

    it("the group pauses while a hand holds the die and plays on, from the same instant, at its release", async () => {
        const { app, held, group, cubeEl } = setup();
        void group.play();
        await frames(6);
        expect(group.playing()).toBe(true);

        held.value = true;
        await nextTick();
        expect(group.playing()).toBe(false);
        const spin = cubeEl.style.transform;
        await frames(6);
        // Nothing of the scene's own loop ran while held: the die stands still.
        expect(group.playing()).toBe(false);
        expect(cubeEl.style.transform).toBe(spin);

        held.value = false;
        await nextTick();
        expect(group.playing()).toBe(true);
        group.stop();
        app.unmount();
    });

    it("a Pause pressed while the hand held the die is kept at its release", async () => {
        const { app, held, playing, group } = setup();
        void group.play();
        await frames(4);
        held.value = true;
        await nextTick();
        // The transport's Pause during the hold.
        playing.value = false;
        group.pause();
        held.value = false;
        await nextTick();
        expect(group.playing()).toBe(false);
        group.stop();
        app.unmount();
    });

    it("a group that was not playing is left as it was", async () => {
        const { app, held, playing, group } = setup();
        playing.value = false;
        held.value = true;
        await nextTick();
        held.value = false;
        await nextTick();
        expect(group.playing()).toBe(false);
        expect(group.started).toBe(false);
        app.unmount();
    });
});
