import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import DicePair from "../../../demo/scenes/cube/dice/DicePair.vue";

/**
 * The pair as a component (jsdom, a stubbed frame clock and a stage of
 * 600 × 600): the entrance says nothing, a throw says its two values once at
 * rest, reduced motion relabels the dice where they lie, and a carried die
 * follows the hand and is thrown at its speed.
 */

let queue: FrameRequestCallback[] = [];
let now = 0;
let reduce = false;
const SIZE = 600;
beforeEach(() => {
    queue = [];
    now = 0;
    reduce = false;
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
        queue.push(cb);
        return queue.length;
    });
    vi.stubGlobal("cancelAnimationFrame", () => {});
    vi.stubGlobal("matchMedia", (q: string) => ({ matches: reduce && q.includes("reduce") }));
    vi.stubGlobal(
        "ResizeObserver",
        class {
            constructor(private cb: ResizeObserverCallback) {}
            observe() {
                this.cb([{ contentRect: { width: SIZE, height: SIZE } } as ResizeObserverEntry], this as unknown as ResizeObserver);
            }
            unobserve() {}
            disconnect() {}
        },
    );
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
        left: 0,
        top: 0,
        right: SIZE,
        bottom: SIZE,
        width: SIZE,
        height: SIZE,
        x: 0,
        y: 0,
        toJSON: () => ({}),
    } as DOMRect);
});
afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    vi.useRealTimers();
});

const frame = async (dt = 1000 / 60) => {
    now += dt;
    const due = queue;
    queue = [];
    for (const cb of due) cb(now);
    await nextTick();
};
const runToRest = async (max = 900) => {
    let n = 0;
    while (queue.length && n < max) {
        await frame();
        n++;
    }
    return n;
};

const ptr = (type: string, x: number, y: number, t: number) => {
    const e = new PointerEvent(type, { clientX: x, clientY: y, pointerId: 1, pointerType: "mouse", bubbles: true });
    Object.defineProperty(e, "timeStamp", { value: t });
    return e;
};

/** A die's centre (table px) from its matrix3d. */
const centre = (el: Element) => {
    const v = /matrix3d\(([^)]+)\)/.exec((el as HTMLElement).style.transform)![1]!.split(",").map(Number);
    return [v[12]!, v[13]!, v[14]!] as const;
};

async function mountPair() {
    const w = mount(DicePair, { props: { skin: "crayon" }, attachTo: document.body });
    await nextTick();
    await nextTick();
    return { w, dice: () => [...w.element.querySelectorAll(".die")], said: () => w.element.querySelector("[aria-live]")!.textContent };
}

describe("the pair", () => {
    it("drops in and comes to rest without saying anything; a throw is said once, at rest, as the values up", async () => {
        const { w, said } = await mountPair();
        expect(queue.length).toBe(1);
        const entrance = await runToRest();
        expect(entrance).toBeGreaterThan(20);
        expect(queue.length).toBe(0);
        expect(w.emitted("rolled")).toBeUndefined();
        expect(said()).toBe("");
        (w.vm as unknown as { throwBoth: () => void }).throwBoth();
        const frames = await runToRest();
        expect(frames).toBeLessThan(0.0025 * 60 * 1000);
        expect(queue.length).toBe(0);
        const rolled = w.emitted("rolled") as [[number, number]][];
        expect(rolled).toHaveLength(1);
        const [a, b] = rolled[0]![0]!;
        expect(said()).toBe(`${a} and ${b}`);
        expect((w.vm as unknown as { valuesUp: () => number[] }).valuesUp()).toEqual([a, b]);
        // Each die shows its 21 pips.
        expect(w.element.querySelectorAll(".die-pip").length).toBe(42);
        w.unmount();
    });

    it("under reduced motion a throw relabels the dice where they lie: no transform changes, the pips cross over, the values are said", async () => {
        reduce = true;
        vi.useFakeTimers({ toFake: ["setTimeout"] });
        const { w, dice, said } = await mountPair();
        await runToRest();
        const before = dice().map((d) => (d as HTMLElement).style.transform);
        (w.vm as unknown as { throwBoth: () => void }).throwBoth();
        await nextTick();
        expect(w.element.querySelectorAll(".die-pips--out").length).toBe(12);
        vi.advanceTimersByTime(120);
        await nextTick();
        expect(w.element.querySelectorAll(".die-pips--out").length).toBe(0);
        vi.advanceTimersByTime(200);
        await nextTick();
        expect(dice().map((d) => (d as HTMLElement).style.transform)).toEqual(before);
        expect(queue.length).toBe(0);
        const rolled = w.emitted("rolled") as [[number, number]][];
        expect(rolled).toHaveLength(1);
        expect(said()).toBe(`${rolled[0]![0]![0]} and ${rolled[0]![0]![1]}`);
        expect(w.element.querySelectorAll(".die-pip").length).toBe(42);
        w.unmount();
    });

    it("a pressed die is carried under the hand on the follower and, let go moving, thrown at the hand's speed", async () => {
        const { w, dice } = await mountPair();
        await runToRest();
        const stage = w.element as HTMLElement;
        // Press the first die where the camera shows it (its bounding box in
        // jsdom is the stage's, so find it by its table centre's projection).
        const persp = Math.max(900, 1.6 * SIZE);
        const tilt = (38 * Math.PI) / 180;
        const toScreen = (p: readonly number[]) => {
            const Y = p[1]! * Math.cos(tilt) - p[2]! * Math.sin(tilt);
            const Z = p[1]! * Math.sin(tilt) + p[2]! * Math.cos(tilt);
            const k = persp / (persp - Z);
            return { x: SIZE / 2 + p[0]! * k, y: SIZE / 2 + Y * k };
        };
        const at = toScreen(centre(dice()[0]!));
        let t = 1000;
        stage.dispatchEvent(ptr("pointerdown", at.x, at.y, t));
        for (let i = 0; i < 20; i++) await frame();
        // A steady carry to the right, 4 px a frame (240 px/s).
        let x = at.x;
        const gaps: number[] = [];
        const speeds: number[] = [];
        let prev = centre(dice()[0]!);
        for (let i = 0; i < 30; i++) {
            x += 4;
            t += 1000 / 60;
            stage.dispatchEvent(ptr("pointermove", x, at.y, t));
            await frame();
            const c = centre(dice()[0]!);
            const s = toScreen(c);
            if (i > 15) gaps.push(Math.hypot(s.x - x, s.y - at.y));
            speeds.push(Math.hypot(c[0] - prev[0], c[1] - prev[1]) * 60);
            prev = c;
        }
        expect(Math.max(...gaps)).toBeLessThan(12);
        const carried = speeds.slice(-6).reduce((a, b) => a + b, 0) / 6;
        stage.dispatchEvent(ptr("pointerup", x, at.y, t + 2));
        await frame();
        const a = centre(dice()[0]!);
        await frame();
        await frame();
        const b = centre(dice()[0]!);
        const thrown = (Math.hypot(b[0] - a[0], b[1] - a[1]) * 60) / 2;
        expect(thrown / carried).toBeGreaterThan(0.8);
        expect(thrown / carried).toBeLessThan(1.25);
        await runToRest();
        expect(w.emitted("rolled")).toHaveLength(1);
        w.unmount();
    });
});
