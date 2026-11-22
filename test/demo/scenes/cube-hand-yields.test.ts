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

const FRAME = 1000 / 60;
/** The group's master clock: its first child's elapsed time (ms). */
const clock = (group: { animations: Record<string, { animation: unknown }>; elapsedOf: (a: any) => number }) =>
    group.elapsedOf(Object.values(group.animations)[0]!.animation);

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
        const at = clock(group);
        await frames(6);
        // Nothing of the scene's own loop ran while held: the die stands still.
        expect(group.playing()).toBe(false);
        expect(cubeEl.style.transform).toBe(spin);
        expect(clock(group)).toBe(at);

        held.value = false;
        await nextTick();
        // It plays on from the instant it stood at, and is playing once it has
        // gathered its speed.
        await frames(1);
        expect(clock(group) - at).toBeGreaterThanOrEqual(0);
        expect(clock(group) - at).toBeLessThan(FRAME / 4);
        await frames(20);
        expect(group.playing()).toBe(true);
        group.stop();
        app.unmount();
    });

    // The motion law: nothing changes instantly. The die stood still under the
    // hand; at the release its spin and bob gather speed over about 250 ms
    // instead of jumping from still to full speed in one frame, and once at
    // speed no frame holds or leaps.
    it("at the release the die gathers its speed: no frame leaps from still to full speed, and none holds once moving", async () => {
        const { app, held, group } = setup();
        void group.play();
        await frames(6);
        held.value = true;
        await nextTick();
        await frames(4);
        // What each frame paints: the clock at the group's paint.
        let painted = clock(group);
        const stop = group.onRender(() => {
            painted = clock(group);
        });
        held.value = false;
        await nextTick();
        const steps: number[] = [];
        let last = painted;
        for (let i = 0; i < 30; i++) {
            await frames(1);
            steps.push(painted - last);
            last = painted;
        }
        stop();
        // From still: the first frames move the die by a sliver of a frame.
        expect(steps[0]).toBeLessThan(FRAME / 4);
        expect(steps[1]).toBeLessThan(FRAME / 4);
        // It rises, never by a whole frame's worth at once, and never past speed.
        for (let i = 1; i < steps.length; i++) {
            expect(steps[i]! - steps[i - 1]!).toBeLessThan(FRAME / 3);
            expect(steps[i]!).toBeLessThanOrEqual(FRAME + 0.5);
        }
        // Once moving, no frame holds.
        const moving = steps.findIndex((s) => s > 0);
        for (const s of steps.slice(moving)) expect(s).toBeGreaterThan(0);
        // At speed by 300 ms, and playing.
        for (const s of steps.slice(19)) expect(s).toBeCloseTo(FRAME, 0);
        expect(group.playing()).toBe(true);
        group.stop();
        app.unmount();
    });

    it("a hand that takes the die again while it gathers speed stops it where it stands", async () => {
        const { app, held, group } = setup();
        void group.play();
        await frames(6);
        held.value = true;
        await nextTick();
        await frames(2);
        held.value = false;
        await nextTick();
        await frames(6);
        held.value = true;
        await nextTick();
        const at = clock(group);
        await frames(10);
        expect(clock(group)).toBe(at);
        expect(group.playing()).toBe(false);
        held.value = false;
        await nextTick();
        await frames(25);
        expect(group.playing()).toBe(true);
        group.stop();
        app.unmount();
    });

    it("a Pause pressed while the die gathers speed is kept", async () => {
        const { app, held, playing, group } = setup();
        void group.play();
        await frames(6);
        held.value = true;
        await nextTick();
        held.value = false;
        await nextTick();
        await frames(4);
        // The transport's Pause during the ease.
        playing.value = false;
        group.pause();
        const at = clock(group);
        await frames(25);
        expect(group.playing()).toBe(false);
        expect(clock(group)).toBe(at);
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

describe("a wheel stream on the die is a hand on it", () => {
    it("emits hold true at the stream's first event and false once it has been quiet for 300 ms", async () => {
        vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
        try {
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
            const wheel = (t: number) => {
                const e = new WheelEvent("wheel", { deltaY: 8, clientX: 200, clientY: 300, cancelable: true, bubbles: true });
                Object.defineProperty(e, "timeStamp", { value: t });
                surface.dispatchEvent(e);
            };
            for (let i = 0; i < 6; i++) {
                wheel(10 + 8 * i);
                vi.advanceTimersByTime(8);
            }
            await nextTick();
            expect(w.emitted("hold")).toEqual([[true]]);
            // Still held 250 ms after the last event (its momentum may follow) ...
            vi.advanceTimersByTime(250);
            await nextTick();
            expect(w.emitted("hold")).toEqual([[true]]);
            // ... and let go once the stream has been quiet for 300 ms.
            vi.advanceTimersByTime(60);
            await nextTick();
            expect(w.emitted("hold")).toEqual([[true], [false]]);
            w.unmount();
        } finally {
            vi.useRealTimers();
        }
    });
});
