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
            frame: () => ({
                centre: { x: CENTRE.x + model.value.translate.x, y: CENTRE.y + model.value.translate.y },
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

    it("(f) the clamp holds the projected centre inside the stage", async () => {
        const { w, model, el } = await mountOrbit();
        await twoFinger(el, [170, 300], [230, 300], [170, 900], [230, 900]);
        expect(CENTRE.y + model.value.translate.y).toBeLessThanOrEqual(STAGE.bottom + 1e-9);
        w.unmount();
    });

    it("pan and zoom never coast", async () => {
        const { w, model, el } = await mountOrbit();
        await twoFinger(el, [160, 300], [240, 300], [120, 330], [280, 330], 10);
        const after = { s: model.value.scale.x, ty: model.value.translate.y, q: [...model.value.quaternion!] };
        await flush(60);
        expect(model.value.scale.x).toBe(after.s);
        expect(model.value.translate.y).toBe(after.ty);
        expect(model.value.quaternion).toEqual(after.q);
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
