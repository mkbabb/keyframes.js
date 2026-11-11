// SERVED MODEL: claude-opus-5-5
/**
 * KF-M2 · G2.3 / G2.4 (value.js COHESION §0hm) — the mounted OrbitalDrag
 * under synthetic two-pointer events: pinch changes only zoom, twist only
 * roll, a two-finger drag only pan (1:1), and the gesture* path writes nothing
 * while fingers are down (ONE multitouch source, D-14).
 *
 * Born RED at the pre-cure bytes: the pinch was additive (2× the finger
 * distance scaled 1.064×), the pan 1.43×, the twist sentinel dropped a 0 rad
 * frame, there was no `frame` prop, and touchmove AND gesturechange both
 * applied the same pinch on iOS.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick, ref } from "vue";
import OrbitalDrag from "../../../demo/scenes/cube/orbital-drag/OrbitalDrag.vue";
import { defaultTransformState, type TransformState } from "../../../demo/scenes/cube/orbital-drag/transform";
import {
    quatConjugate,
    quatMultiply,
    quatToAxisAngle,
    type Quat,
} from "../../../demo/scenes/cube/orbital-drag/arcball";
import { attitudeQuat } from "../../../demo/scenes/cube/graphAttitude";

const G = attitudeQuat();
const CENTRE = { x: 200, y: 300 };
const STAGE = { left: 16, top: 107, right: 374, bottom: 545 };

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

const flush = async (frames = 1) => {
    for (let i = 0; i < frames; i++) {
        now += 1000 / 60;
        const due = queue;
        queue = [];
        for (const cb of due) cb(now);
        await nextTick();
    }
};

const ptr = (type: string, id: number, x: number, y: number, t: number, pointerType = "touch") => {
    const e = new PointerEvent(type, { clientX: x, clientY: y, pointerId: id, pointerType, bubbles: true });
    Object.defineProperty(e, "timeStamp", { value: t });
    return e;
};

const gestureEvent = (type: string, scale: number, rotation: number) => {
    const e = new Event(type, { cancelable: true, bubbles: true });
    Object.defineProperty(e, "scale", { value: scale });
    Object.defineProperty(e, "rotation", { value: rotation });
    return e;
};

async function mountOrbit() {
    const model = ref<TransformState>(structuredClone(defaultTransformState));
    const w = mount(OrbitalDrag, {
        props: {
            applyTransformToContainer: true,
            modelValue: model.value,
            "onUpdate:modelValue": (v: TransformState) => (model.value = v),
            // D5 — the frame reports the REST centre (`.graph`'s, which the
            // orbit's own pan does not move); the reader adds the pan.
            frame: () => ({
                centre: { ...CENTRE },
                side: 160,
                fit: 1,
                stage: STAGE,
            }),
        },
        attachTo: document.body,
    });
    await nextTick();
    return { w, model, el: w.element as HTMLElement };
}

/** The on-screen rotation the orbit authored since identity (G·Q·G⁻¹). */
const screenRotation = (q: Quat) => quatToAxisAngle(quatMultiply(quatMultiply(G, q), quatConjugate(G)));

/** Two fingers from (a0, b0) to (a, b) in `steps`, then released. */
async function twoFinger(
    el: HTMLElement,
    a0: [number, number],
    b0: [number, number],
    a: [number, number],
    b: [number, number],
    steps = 20,
    release = true,
) {
    let t = 0;
    el.dispatchEvent(ptr("pointerdown", 1, a0[0], a0[1], t));
    el.dispatchEvent(ptr("pointerdown", 2, b0[0], b0[1], t));
    for (let i = 1; i <= steps; i++) {
        t += 8;
        const f = i / steps;
        document.dispatchEvent(ptr("pointermove", 1, a0[0] + (a[0] - a0[0]) * f, a0[1] + (a[1] - a0[1]) * f, t));
        document.dispatchEvent(ptr("pointermove", 2, b0[0] + (b[0] - b0[0]) * f, b0[1] + (b[1] - b0[1]) * f, t));
        if (i % 2 === 0) await flush();
    }
    await flush();
    if (release) {
        document.dispatchEvent(ptr("pointerup", 1, a[0], a[1], t + 2));
        document.dispatchEvent(ptr("pointerup", 2, b[0], b[1], t + 2));
        await flush();
    }
}

describe("G2.3 — the mounted orbit: one channel per hand motion", () => {
    it("(a) a spread 80 → 160 px about a fixed centroid zooms 2× and does nothing else", async () => {
        const { w, model, el } = await mountOrbit();
        await twoFinger(el, [160, 300], [240, 300], [120, 300], [280, 300]);
        expect(Math.abs(model.value.scale.x - 2)).toBeLessThan(0.01);
        expect(screenRotation(model.value.quaternion!).angle).toBeLessThan(1e-12);
        expect(Math.abs(model.value.translate.x)).toBeLessThan(1);
        expect(Math.abs(model.value.translate.y)).toBeLessThan(1);
        w.unmount();
    });

    it("(b) a 90° twist at constant distance rolls 90° ± 0.5° and keeps the scale", async () => {
        const { w, model, el } = await mountOrbit();
        // Rotate the pair clockwise about the centroid in 20 steps.
        let t = 0;
        el.dispatchEvent(ptr("pointerdown", 1, 140, 300, t));
        el.dispatchEvent(ptr("pointerdown", 2, 260, 300, t));
        for (let i = 1; i <= 20; i++) {
            t += 8;
            const a = (Math.PI / 2) * (i / 20);
            document.dispatchEvent(ptr("pointermove", 1, 200 - 60 * Math.cos(a), 300 - 60 * Math.sin(a), t));
            document.dispatchEvent(ptr("pointermove", 2, 200 + 60 * Math.cos(a), 300 + 60 * Math.sin(a), t));
        }
        await flush();
        const r = screenRotation(model.value.quaternion!);
        expect(Math.abs((r.angle * 180) / Math.PI - 90)).toBeLessThan(0.5);
        expect(r.axis[2]).toBeCloseTo(1, 9);
        expect(Math.abs(model.value.scale.x - 1)).toBeLessThan(0.005);
        document.dispatchEvent(ptr("pointerup", 1, 200, 240, t + 2));
        document.dispatchEvent(ptr("pointerup", 2, 200, 360, t + 2));
        w.unmount();
    });

    it("(c) a two-finger 100 px drag pans 100 ± 1 px, no zoom, no roll", async () => {
        const { w, model, el } = await mountOrbit();
        await twoFinger(el, [170, 300], [230, 300], [170, 400], [230, 400]);
        expect(Math.abs(model.value.translate.y - 100)).toBeLessThan(1);
        expect(Math.abs(model.value.translate.x)).toBeLessThan(1e-9);
        expect(model.value.scale.x).toBe(1);
        expect(screenRotation(model.value.quaternion!).angle).toBeLessThan(1e-12);
        w.unmount();
    });

    it("(f) the bound holds the projected centre: at rest no more than a quarter of the die leaves the stage", async () => {
        const { w, model, el } = await mountOrbit();
        await twoFinger(el, [170, 300], [230, 300], [170, 900], [230, 900]);
        await flush(120);
        // The die's extent at the scale it rests at (the release may carry a zoom).
        const D = 160 * model.value.scale.x;
        expect(CENTRE.y + model.value.translate.y).toBeLessThanOrEqual(STAGE.bottom - 0.25 * D + 1e-9);
        w.unmount();
    });

});

/**
 * OA-17 (owner 2026-11-09: "Natural scrolling for all pan an zoom, in orbital
 * drag") overturns D-15's "pan and zoom never coast": a released pan or pinch
 * coasts on the rotation's own decay — one coast, three channels, the closed
 * form sampled at elapsed time (COAST_GAIN 0.5, k = 9/s, the 1% rest). Born
 * RED ×2 on b74cc693: a two-finger pan released at 600 px/s coasted 0 px.
 */
describe("OA-17 — pan and pinch coast on release", () => {
    let reduce = false;
    beforeEach(() => {
        reduce = false;
        vi.stubGlobal("matchMedia", (q: string) => ({ matches: reduce && q.includes("reduce") }));
    });

    const flushAt = async (hz: number, frames: number) => {
        for (let i = 0; i < frames; i++) {
            now += 1000 / hz;
            const due = queue;
            queue = [];
            for (const cb of due) cb(now);
            await nextTick();
        }
    };

    /** A two-finger pan down at `v` px/s for 96 px (8 ms a move), released
     *  2 ms after its last move; then the coast at `hz` for 1.2 s. */
    const panCoast = async (v: number, hz = 60) => {
        const { w, model, el } = await mountOrbit();
        const step = (v * 8) / 1000;
        const n = Math.round(96 / step);
        let t = 0;
        el.dispatchEvent(ptr("pointerdown", 1, 170, 200, t));
        el.dispatchEvent(ptr("pointerdown", 2, 230, 200, t));
        for (let i = 1; i <= n; i++) {
            t += 8;
            document.dispatchEvent(ptr("pointermove", 1, 170, 200 + step * i, t));
            document.dispatchEvent(ptr("pointermove", 2, 230, 200 + step * i, t));
            if (i % 2 === 0) await flush();
        }
        await flush();
        document.dispatchEvent(ptr("pointerup", 1, 170, 200 + step * n, t + 2));
        document.dispatchEvent(ptr("pointerup", 2, 230, 200 + step * n, t + 2));
        const atRelease = model.value.translate.y;
        let last = atRelease;
        let restMs = 0;
        const frames = Math.round(1.2 * hz);
        for (let i = 1; i <= frames; i++) {
            await flushAt(hz, 1);
            if (model.value.translate.y !== last) restMs = (i * 1000) / hz;
            last = model.value.translate.y;
        }
        const out = { coast: model.value.translate.y - atRelease, restMs, tx: model.value.translate.x, s: model.value.scale.x };
        w.unmount();
        return out;
    };

    it("a two-finger pan released at 600 px/s coasts 33 ± 3 px and rests within 600 ms", async () => {
        const r = await panCoast(600);
        expect(Math.abs(r.coast - (0.5 * 600) / 9)).toBeLessThan(3);
        expect(r.restMs).toBeGreaterThan(0);
        expect(r.restMs).toBeLessThanOrEqual(600);
        // Along the hand only: no sideways drift, no zoom.
        expect(Math.abs(r.tx)).toBeLessThan(1e-9);
        expect(r.s).toBe(1);
    });

    it("the pan coast's end at 30, 60 and 120 Hz differs by under 0.5 px", async () => {
        // One at a time: the rAF clock is shared.
        const at: number[] = [];
        for (const hz of [30, 60, 120]) at.push((await panCoast(600, hz)).coast);
        expect(Math.min(...at)).toBeGreaterThan(30);
        expect(Math.max(...at) - Math.min(...at)).toBeLessThan(0.5);
    });

    it("a pinch released while spreading coasts its zoom on the same decay", async () => {
        const { w, model, el } = await mountOrbit();
        // Spread 80 → 160 px about a fixed centroid in 160 ms.
        await twoFinger(el, [160, 300], [240, 300], [120, 300], [280, 300], 20, false);
        document.dispatchEvent(ptr("pointerup", 1, 120, 300, 162));
        document.dispatchEvent(ptr("pointerup", 2, 280, 300, 162));
        const s0 = model.value.scale.x;
        await flush(80);
        const coastLn = Math.log(model.value.scale.x / s0);
        expect(coastLn).toBeGreaterThan(0);
        // The release window is the last 80 ms: the spread went 120 → 160 px,
        // a rate of ln(160/120)/0.08 s; the coast is COAST_GAIN·rate/k.
        const rate = Math.log(160 / 120) / 0.08;
        expect(Math.abs(coastLn - (0.5 * rate) / 9) / ((0.5 * rate) / 9)).toBeLessThan(0.15);
        w.unmount();
    });

    it("the pan coast stops at the stage bound", async () => {
        const { w, model, el } = await mountOrbit();
        await twoFinger(el, [170, 300], [230, 300], [170, 540], [230, 540], 20);
        await flush(60);
        expect(CENTRE.y + model.value.translate.y).toBeLessThanOrEqual(STAGE.bottom + 1e-9);
        w.unmount();
    });

    it("under reduced motion nothing coasts", async () => {
        reduce = true;
        const r = await panCoast(600);
        expect(r.coast).toBe(0);
    });

    it("a new grab stops the coast where it stands", async () => {
        const { w, model, el } = await mountOrbit();
        await twoFinger(el, [170, 200], [230, 200], [170, 296], [230, 296], 20);
        await flush(3);
        const held = model.value.translate.y;
        el.dispatchEvent(ptr("pointerdown", 3, 400, 400, 1000, "mouse"));
        await flush(20);
        expect(model.value.translate.y).toBe(held);
        document.dispatchEvent(ptr("pointerup", 3, 400, 400, 1300, "mouse"));
        w.unmount();
    });
});

describe("G2.4 — ONE multitouch source (D-14)", () => {
    it("with fingers down, a gesturechange writes nothing (it only stops the page zoom)", async () => {
        const { w, model, el } = await mountOrbit();
        await twoFinger(el, [160, 300], [240, 300], [140, 300], [260, 300], 10, false);
        const before = JSON.stringify(model.value);
        const e = gestureEvent("gesturechange", 3, 45);
        window.dispatchEvent(e);
        await flush();
        expect(e.defaultPrevented).toBe(true);
        expect(JSON.stringify(model.value)).toBe(before);
        document.dispatchEvent(ptr("pointerup", 1, 140, 300, 200));
        document.dispatchEvent(ptr("pointerup", 2, 260, 300, 200));
        w.unmount();
    });

    it("at most one model write per frame, however many moves arrive", async () => {
        const { w, el } = await mountOrbit();
        el.dispatchEvent(ptr("pointerdown", 1, 160, 300, 0));
        el.dispatchEvent(ptr("pointerdown", 2, 240, 300, 0));
        await flush();
        const before = (w.emitted("rotate") ?? []).length;
        for (let i = 1; i <= 6; i++) {
            document.dispatchEvent(ptr("pointermove", 1, 160 - i * 5, 300, i));
            document.dispatchEvent(ptr("pointermove", 2, 240 + i * 5, 300, i));
        }
        await flush();
        expect((w.emitted("rotate") ?? []).length - before).toBe(1);
        document.dispatchEvent(ptr("pointerup", 1, 130, 300, 10));
        document.dispatchEvent(ptr("pointerup", 2, 270, 300, 10));
        w.unmount();
    });

    it("desktop Safari's trackpad (no finger down): s = s₀·scale", async () => {
        const { w, model, el } = await mountOrbit();
        el.dispatchEvent(gestureEvent("gesturestart", 1, 0));
        window.dispatchEvent(gestureEvent("gesturechange", 1.5, 0));
        await flush();
        expect(Math.abs(model.value.scale.x - 1.5)).toBeLessThan(1e-6);
        window.dispatchEvent(gestureEvent("gestureend", 1.5, 0));
        w.unmount();
    });

    it("Safari's pinch and twist in one gesture: s ×1.5 anchored at the cursor, 30° about the view axis", async () => {
        const { w, model, el } = await mountOrbit();
        const at = { x: CENTRE.x + 60, y: CENTRE.y - 40 };
        const g = (type: string, scale: number, rotation: number) => {
            const e = gestureEvent(type, scale, rotation);
            Object.defineProperty(e, "clientX", { value: at.x });
            Object.defineProperty(e, "clientY", { value: at.y });
            return e;
        };
        el.dispatchEvent(g("gesturestart", 1, 0));
        window.dispatchEvent(g("gesturechange", 1.5, 30));
        await flush();
        const k = model.value.scale.x;
        expect(k).toBeCloseTo(1.5, 9);
        const c = { x: CENTRE.x + model.value.translate.x, y: CENTRE.y + model.value.translate.y };
        expect(Math.abs(c.x + k * (at.x - CENTRE.x) - at.x)).toBeLessThan(1e-6);
        expect(Math.abs(c.y + k * (at.y - CENTRE.y) - at.y)).toBeLessThan(1e-6);
        const r = screenRotation(model.value.quaternion!);
        expect((r.angle * 180) / Math.PI).toBeCloseTo(30, 6);
        expect(Math.abs(r.axis[2])).toBeCloseTo(1, 9);
        window.dispatchEvent(g("gestureend", 1.5, 30));
        w.unmount();
    });

    it("a host's relayed gesture does the same; its own gesture* takes precedence over a relay", async () => {
        const { w, model, el } = await mountOrbit();
        const orbit = w.vm as unknown as { relayGesture: (p: string, s: number, r: number, at: { x: number; y: number }) => void };
        const at = { x: CENTRE.x - 50, y: CENTRE.y + 20 };
        orbit.relayGesture("start", 1, 0, at);
        orbit.relayGesture("change", 1.5, 30, at);
        await flush();
        const k = model.value.scale.x;
        expect(k).toBeCloseTo(1.5, 9);
        const c = { x: CENTRE.x + model.value.translate.x, y: CENTRE.y + model.value.translate.y };
        expect(Math.abs(c.x + k * (at.x - CENTRE.x) - at.x)).toBeLessThan(1e-6);
        orbit.relayGesture("end", 1.5, 30, at);
        await flush(5);
        // While its own gesture runs, a relay writes nothing.
        el.dispatchEvent(gestureEvent("gesturestart", 1, 0));
        const before = model.value.scale.x;
        orbit.relayGesture("start", 1, 0, at);
        orbit.relayGesture("change", 2, 0, at);
        await flush();
        expect(model.value.scale.x).toBe(before);
        window.dispatchEvent(gestureEvent("gestureend", 1, 0));
        w.unmount();
    });

    it("home: Reset eases the orbit to its load pose on the settle spring (no cut)", async () => {
        const { w, model, el } = await mountOrbit();
        await twoFinger(el, [160, 300], [240, 300], [120, 330], [280, 330], 10);
        await flush(120);
        const orbit = w.vm as unknown as { home: () => void };
        const s0 = model.value.scale.x;
        expect(s0).toBeGreaterThan(1.5);
        orbit.home();
        const ss: number[] = [];
        for (let i = 0; i < 90; i++) {
            await flush();
            ss.push(model.value.scale.x);
        }
        const travel = s0 - 1;
        const steps = ss.map((v, i) => Math.abs(v - (i ? ss[i - 1]! : s0)));
        expect(Math.max(...steps) / travel).toBeLessThan(0.15);
        expect(steps[0]! / travel).toBeLessThan(0.04);
        expect(ss.filter((v, i) => v !== (i ? ss[i - 1] : s0)).length).toBeGreaterThanOrEqual(6);
        expect(ss.at(-1)).toBe(1);
        expect(model.value.translate.x).toBe(0);
        expect(screenRotation(model.value.quaternion!).angle).toBeLessThan(1e-9);
        w.unmount();
    });

    it("2 → 1 re-anchors the arcball at the remaining finger (no jump)", async () => {
        const { w, model, el } = await mountOrbit();
        await twoFinger(el, [160, 300], [240, 300], [150, 300], [250, 300], 6, false);
        const q = [...model.value.quaternion!];
        document.dispatchEvent(ptr("pointerup", 2, 250, 300, 100));
        document.dispatchEvent(ptr("pointermove", 1, 150, 300, 108));
        await flush();
        const d = quatMultiply(model.value.quaternion!, quatConjugate(q as Quat));
        expect(quatToAxisAngle(d).angle).toBeLessThan(1e-9);
        document.dispatchEvent(ptr("pointerup", 1, 150, 300, 300));
        w.unmount();
    });
});
