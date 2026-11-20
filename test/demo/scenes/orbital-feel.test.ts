/**
 * The cube's feel (owner 2026-11-15: "apple like in inertia and momentum--it
 * should be fun and highly interactive on mobile with multi touch"): the
 * orbit's one frame loop, the trackpad follower, the keyboard, the coalesced
 * hand, a hard flick, and the reduced-motion reset.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick, ref } from "vue";
import OrbitalDrag from "../../../demo/scenes/cube/orbital-drag/OrbitalDrag.vue";
import { defaultTransformState, type TransformState } from "../../../demo/scenes/cube/orbital-drag/transform";
import { quatAngleBetween, quatConjugate, quatMultiply, quatToAxisAngle, type Quat } from "../../../demo/scenes/cube/orbital-drag/arcball";
import { attitudeQuat } from "../../../demo/scenes/cube/graphAttitude";
import { coastTravel, MAX_COAST_RATE } from "../../../demo/scenes/cube/orbital-drag/composables/inertiaDecay";
import { shown } from "./orbit-shown";

const G = attitudeQuat();
const CENTRE = { x: 200, y: 300 };
const STAGE = { left: 16, top: 107, right: 374, bottom: 545 };

let queue: FrameRequestCallback[] = [];
let now = 0;
let reduce = false;
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
});
afterEach(() => vi.unstubAllGlobals());

/** Run one frame at `dt` ms; returns how many callbacks were due. */
const frame = async (dt = 1000 / 60) => {
    now += dt;
    const due = queue;
    queue = [];
    for (const cb of due) cb(now);
    await nextTick();
    return due.length;
};

const ptr = (type: string, id: number, x: number, y: number, t: number, extra: Partial<Record<string, unknown>> = {}) => {
    const e = new PointerEvent(type, { clientX: x, clientY: y, pointerId: id, pointerType: "touch", bubbles: true });
    Object.defineProperty(e, "timeStamp", { value: t });
    for (const [k, v] of Object.entries(extra)) Object.defineProperty(e, k, { value: v });
    return e;
};

const wheel = (deltaY: number, t: number) => {
    const e = new WheelEvent("wheel", { deltaX: 0, deltaY, deltaMode: 0, cancelable: true, bubbles: true });
    Object.defineProperty(e, "timeStamp", { value: t });
    return e;
};

async function mountOrbit() {
    const model = ref<TransformState>(structuredClone(defaultTransformState));
    const w = mount(OrbitalDrag, {
        props: {
            applyTransformToContainer: true,
            modelValue: model.value,
            "onUpdate:modelValue": (v: TransformState) => (model.value = v),
            frame: () => ({ centre: { ...CENTRE }, side: 160, fit: 1, stage: STAGE }),
        },
        attachTo: document.body,
    });
    await nextTick();
    return { w, model, el: w.element as HTMLElement };
}

const q = (m: { quaternion?: unknown }): Quat => (m.quaternion as Quat | undefined) ?? [0, 0, 0, 1];
const screenAngle = (qq: Quat) => quatToAxisAngle(quatMultiply(quatMultiply(G, qq), quatConjugate(G))).angle;

describe("one frame loop", () => {
    it("a drag, its coast and its commit ask for one frame at a time, and the loop stops at rest", async () => {
        const { w, el } = await mountOrbit();
        el.dispatchEvent(ptr("pointerdown", 1, 200, 300, 0));
        for (let i = 1; i <= 6; i++) document.dispatchEvent(ptr("pointermove", 1, 200 + 8 * i, 300, 8 * i));
        expect(queue.length).toBe(1);
        await frame();
        document.dispatchEvent(ptr("pointerup", 1, 248, 300, 50));
        let maxDue = 0;
        let frames = 0;
        while (queue.length && frames < 2000) {
            maxDue = Math.max(maxDue, await frame());
            frames++;
        }
        expect(maxDue).toBe(1);
        expect(queue.length).toBe(0);
        w.unmount();
    });
});

describe("one write per frame", () => {
    it("a throw and its coast write the container's transform once a frame; the model, its emits and the render catch up once, at rest", async () => {
        const { w, model, el } = await mountOrbit();
        const writes: number[] = [];
        let frameNo = 0;
        const mo = new MutationObserver((records) => {
            for (const r of records) if (r.attributeName === "style") writes.push(frameNo);
        });
        mo.observe(el, { attributes: true, attributeFilter: ["style"] });
        const frames = w.emitted("frame")?.length ?? 0;
        el.dispatchEvent(ptr("pointerdown", 1, 160, 300, 0));
        for (let i = 1; i <= 8; i++) {
            document.dispatchEvent(ptr("pointermove", 1, 160 + 10 * i, 300, 8 * i));
            frameNo++;
            now = 8 * i + 4;
            await frame(0);
        }
        document.dispatchEvent(ptr("pointerup", 1, 240, 300, 66));
        const rotatesAtRelease = w.emitted("rotate")?.length ?? 0;
        let running = 0;
        while (queue.length && running < 2000) {
            frameNo++;
            await frame(1000 / 120);
            running++;
            // While the die moves no readout is emitted.
            if (queue.length) expect(w.emitted("rotate")?.length ?? 0).toBe(rotatesAtRelease);
        }
        await nextTick();
        mo.disconnect();
        // At most one style write in any frame.
        const perFrame = new Map<number, number>();
        for (const f of writes) perFrame.set(f, (perFrame.get(f) ?? 0) + 1);
        expect(Math.max(...perFrame.values())).toBe(1);
        expect(running).toBeGreaterThan(20);
        // The model caught up once, at rest, with what the frames showed.
        expect((w.emitted("rotate")?.length ?? 0) - rotatesAtRelease).toBe(1);
        expect(quatAngleBetween(q(model.value), q(shown(el)))).toBeLessThan(1e-9);
        // The per-frame consumer (the slice's paper) heard every frame that moved.
        expect((w.emitted("frame")?.length ?? 0) - frames).toBeGreaterThan(20);
        w.unmount();
    });
});

describe("the trackpad follower", () => {
    it("events at 90 Hz under a 120 Hz frame: every frame of the stream turns the die, none stalls, and the sum lands", async () => {
        const { w, el } = await mountOrbit();
        // 24 events of 6 px, 11.1 ms apart, against 8.33 ms frames.
        let t = 0;
        let nextEvent = 0;
        let sent = 0;
        const per: number[] = [];
        let last = q(shown(el));
        while (sent < 24 || queue.length) {
            if (sent < 24 && t >= nextEvent) {
                el.dispatchEvent(wheel(6, t));
                sent++;
                nextEvent += 1000 / 90;
            }
            t += 1000 / 120;
            await frame(1000 / 120);
            const cur = q(shown(el));
            per.push(quatAngleBetween(cur, last));
            last = cur;
            if (per.length > 400) break;
        }
        const streaming = per.slice(1, 30);
        expect(streaming.filter((x) => x === 0)).toEqual([]);
        // The largest step is under twice the mean (no doubled frames).
        const mean = streaming.reduce((a, b) => a + b, 0) / streaming.length;
        expect(Math.max(...streaming)).toBeLessThan(2 * mean);
        // R: the arcball radius at side 160 is 2h = 160.
        expect(screenAngle(q(shown(el)))).toBeCloseTo((2 * 6 * 24) / 160, 9);
        w.unmount();
    });
});

describe("the keyboard", () => {
    it("ArrowRight glides 15° about the screen's vertical (Shift: 45°), eased over frames", async () => {
        const { w, el } = await mountOrbit();
        el.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true }));
        const steps: number[] = [];
        let last = q(shown(el));
        while (queue.length) {
            await frame();
            const cur = q(shown(el));
            steps.push(quatAngleBetween(cur, last));
            last = cur;
        }
        expect((screenAngle(q(shown(el))) * 180) / Math.PI).toBeCloseTo(15, 9);
        expect(steps.filter((s) => s > 0).length).toBeGreaterThan(8);
        expect(Math.max(...steps)).toBeLessThan((15 * Math.PI) / 180 / 4);
        el.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", shiftKey: true, bubbles: true, cancelable: true }));
        while (queue.length) await frame();
        expect((screenAngle(q(shown(el))) * 180) / Math.PI).toBeCloseTo(30, 9);
        w.unmount();
    });
});

describe("the hand at full rate", () => {
    it("coalesced moves are each sampled: one event carrying 4 coalesced moves reads the same throw as 4 events", async () => {
        const throwOf = async (coalesced: boolean) => {
            const { w, el } = await mountOrbit();
            el.dispatchEvent(ptr("pointerdown", 1, 160, 300, 0));
            const pts = [1, 2, 3, 4, 5, 6, 7, 8].map((i) => ({ x: 160 + 10 * i, y: 300, t: 4 * i }));
            const mk = (p: { x: number; y: number; t: number }) => ptr("pointermove", 1, p.x, p.y, p.t);
            if (coalesced) {
                for (const chunk of [pts.slice(0, 4), pts.slice(4)]) {
                    const last = chunk[chunk.length - 1]!;
                    document.dispatchEvent(ptr("pointermove", 1, last.x, last.y, last.t, { getCoalescedEvents: () => chunk.map(mk) }));
                }
            } else for (const p of pts) document.dispatchEvent(mk(p));
            document.dispatchEvent(ptr("pointerup", 1, 240, 300, 33));
            const at = q(shown(el));
            // The coast is clocked at the release (K3): each throw's frames
            // run on from its own release time.
            now = 33;
            for (let i = 0; i < 4; i++) await frame();
            const out = quatAngleBetween(q(shown(el)), at);
            w.unmount();
            return out;
        };
        const a = await throwOf(false);
        const b = await throwOf(true);
        expect(a).toBeGreaterThan(0);
        expect(Math.abs(a - b) / a).toBeLessThan(1e-9);
    });

    // K2 — the hand at the frame, never ahead of it.
    it("a touch is never shown past its newest sample, whatever the browser predicts, and a stopped touch never steps back", async () => {
        // Real-only: the move without a prediction.
        const o = await mountOrbit();
        o.el.dispatchEvent(ptr("pointerdown", 1, 200, 300, 0));
        document.dispatchEvent(ptr("pointermove", 1, 230, 300, 8));
        now = 20;
        await frame(0);
        const real = screenAngle(q(shown(o.el)));
        o.w.unmount();
        queue = [];

        now = 0;
        const { w, el } = await mountOrbit();
        el.dispatchEvent(ptr("pointerdown", 1, 200, 300, 0));
        const predicted = () => [ptr("pointermove", 1, 240, 300, 16), ptr("pointermove", 1, 260, 300, 32)];
        document.dispatchEvent(ptr("pointermove", 1, 230, 300, 8, { getPredictedEvents: predicted }));
        // The frame's instant (16 ms) is past the newest sample (8 ms): the
        // touch holds it, as a mouse does; the predicted path is not shown.
        now = 20;
        await frame(0);
        expect(screenAngle(q(shown(el)))).toBe(real);
        // No move since: nothing comes back, nothing moves.
        for (let i = 0; i < 30; i++) {
            await frame(1000 / 120);
            expect(screenAngle(q(shown(el)))).toBe(real);
        }
        document.dispatchEvent(ptr("pointerup", 1, 230, 300, 500));
        w.unmount();
    });

    it("a second finger joining shows no step before either finger moves", async () => {
        const { w, el } = await mountOrbit();
        el.dispatchEvent(ptr("pointerdown", 1, 160, 300, 0));
        for (let i = 1; i <= 6; i++) document.dispatchEvent(ptr("pointermove", 1, 160 + 6 * i, 300, 8 * i));
        // A frame between the last two samples shows the finger behind its newest.
        now = 46;
        await frame(0);
        const before = shown(el);
        // The second finger lands; the frame that follows (its instant, 46 ms,
        // still before the first finger's newest sample) shows the same pose.
        el.dispatchEvent(ptr("pointerdown", 2, 260, 340, 49));
        now = 50;
        await frame(0);
        const after = shown(el);
        expect(quatAngleBetween(q(after), q(before))).toBeLessThan(1e-9);
        expect(Math.hypot(after.translate.x - before.translate.x, after.translate.y - before.translate.y)).toBeLessThan(1e-9);
        document.dispatchEvent(ptr("pointerup", 2, 260, 340, 60));
        document.dispatchEvent(ptr("pointerup", 1, 196, 300, 60));
        w.unmount();
    });

    it("a mouse is never shown ahead of its newest sample, predicted or not", async () => {
        const { w, el } = await mountOrbit();
        const mouse = (type: string, x: number, t: number, extra = {}) => {
            const e = ptr(type, 1, x, 300, t, extra);
            Object.defineProperty(e, "pointerType", { value: "mouse" });
            return e;
        };
        el.dispatchEvent(mouse("pointerdown", 200, 0));
        document.dispatchEvent(mouse("pointermove", 230, 8, { getPredictedEvents: () => [mouse("pointermove", 240, 16)] }));
        now = 20;
        await frame(0);
        const held = screenAngle(q(shown(el)));
        for (let i = 0; i < 6; i++) await frame(1000 / 120);
        expect(screenAngle(q(shown(el)))).toBe(held);
        document.dispatchEvent(mouse("pointerup", 230, 500));
        w.unmount();
    });

    it("a throw leaves from the pose shown: no step back at the release, and its first frame travels on", async () => {
        const { w, el } = await mountOrbit();
        el.dispatchEvent(ptr("pointerdown", 1, 120, 300, 0));
        let t = 0;
        let prev = screenAngle(q(shown(el)));
        const per: number[] = [];
        for (let i = 1; i <= 10; i++) {
            t = 8 * i;
            const x = 120 + 12 * i;
            document.dispatchEvent(
                ptr("pointermove", 1, x, 300, t, { getPredictedEvents: () => [ptr("pointermove", 1, x + 12, 300, t + 8)] }),
            );
            now = t + 12;
            await frame(0);
            const a = screenAngle(q(shown(el)));
            per.push(a - prev);
            prev = a;
        }
        document.dispatchEvent(ptr("pointerup", 1, 240, 300, t + 1));
        const atUp = screenAngle(q(shown(el)));
        expect(atUp).toBeGreaterThanOrEqual(prev - 1e-12);
        await frame(1000 / 120);
        const first = screenAngle(q(shown(el))) - atUp;
        expect(first).toBeGreaterThan(0);
        w.unmount();
    });
});

describe("the release on the frames' clock", () => {
    for (const [name, upAt, deliveredAt] of [
        ["delivered late (14 ms after its time)", 84, 98],
        ["delivered at once", 88.5, 89],
    ] as const)
        it(`a release ${name}: the coast's first frame travels about one frame of the drag, never two, never none`, async () => {
            const { w, el } = await mountOrbit();
            el.dispatchEvent(ptr("pointerdown", 1, 120, 300, 0));
            now = 0;
            // A steady drag at 120 Hz: a move every 8 ms, a frame every 8.33.
            for (let k = 1; k <= 10; k++) {
                document.dispatchEvent(ptr("pointermove", 1, 120 + 10 * k, 300, 8 * k));
                while (now + 1000 / 120 <= 8 * k + 4) await frame(1000 / 120);
            }
            // Frames on until the release reaches the page.
            while (now + 1000 / 120 < deliveredAt) await frame(1000 / 120);
            document.dispatchEvent(ptr("pointerup", 1, 220, 300, upAt));
            const atUp = screenAngle(q(shown(el)));
            await frame(1000 / 120);
            const first = screenAngle(q(shown(el))) - atUp;
            // One frame of the drag: 10 px in 8 ms, over 8.33 ms, on R 160.
            const oneFrame = ((10 / 8) * (1000 / 120) * 2) / 160;
            expect(first).toBeGreaterThan(0.5 * oneFrame);
            expect(first).toBeLessThan(1.5 * oneFrame);
            w.unmount();
        });
});

describe("fun", () => {
    it("a hard flick (300 px in 60 ms at R 160) coasts over a turn, capped at six turns a second", async () => {
        const { w, el } = await mountOrbit();
        // Through the die's middle, across its whole disc and past it.
        el.dispatchEvent(ptr("pointerdown", 1, 50, 300, 0));
        for (let i = 1; i <= 12; i++) document.dispatchEvent(ptr("pointermove", 1, 50 + 25 * i, 300, 5 * i));
        document.dispatchEvent(ptr("pointerup", 1, 350, 300, 62));
        let travel = 0;
        let last = q(shown(el));
        while (queue.length) {
            await frame();
            const cur = q(shown(el));
            travel += quatAngleBetween(cur, last);
            last = cur;
        }
        expect(travel / (2 * Math.PI)).toBeGreaterThan(1);
        // (+ the gesture's own last commit, landed in the first frame)
        expect(travel).toBeLessThanOrEqual(coastTravel(MAX_COAST_RATE) + 1e-3);
        w.unmount();
    });
});

describe("reduced motion", () => {
    it("a flick does not coast; Home is a fade (opacity), never a travel", async () => {
        reduce = true;
        const { w, el } = await mountOrbit();
        const animate = vi.fn((_k: Keyframe[], _o: KeyframeAnimationOptions) => {
            const a = { onfinish: null as null | (() => void), cancel: vi.fn() };
            return a as unknown as Animation;
        });
        (el as HTMLElement & { animate: typeof animate }).animate = animate;
        el.dispatchEvent(ptr("pointerdown", 1, 160, 300, 0));
        for (let i = 1; i <= 8; i++) document.dispatchEvent(ptr("pointermove", 1, 160 + 10 * i, 300, 4 * i));
        document.dispatchEvent(ptr("pointerup", 1, 240, 300, 33));
        await frame();
        const placed = q(shown(el));
        for (let i = 0; i < 20; i++) await frame();
        expect(quatAngleBetween(q(shown(el)), placed)).toBe(0);
        (w.vm as unknown as { home: () => void }).home();
        expect(animate).toHaveBeenCalledTimes(1);
        expect(animate.mock.calls[0]![0]).toEqual([{ opacity: 1 }, { opacity: 0 }]);
        // The pose holds until the die has faded out, then it is home, and fades in.
        await frame();
        expect(quatAngleBetween(q(shown(el)), placed)).toBe(0);
        (animate.mock.results[0]!.value as { onfinish: () => void }).onfinish();
        await nextTick();
        expect(screenAngle(q(shown(el)))).toBe(0);
        expect(animate.mock.calls[1]![0]).toEqual([{ opacity: 0 }, { opacity: 1 }]);
        w.unmount();
    });
});
