/**
 * THE GESTURE MAP (owner 2026-11-12: "For keyframes.js, scrolling with
 * multitouch should rotate, not pan. Ensure ALL of our multitouch gestures map
 * to their befitting actions. This was working properly several months ago.")
 *
 * The plain wheel (a trackpad's two-finger scroll) ORBITED the die from March
 * to October 2026 (useOrbitalPointer.handleWheel: `updateRotation(−Δx, −Δy)`,
 * Shift-wheel panned, Ctrl-wheel zoomed). OA-17 (80b1584c, 2026-11-09) made
 * the plain wheel pan and moved the orbit to Alt-wheel; this restores the map
 * and completes it:
 *
 *   two-finger scroll (wheel, pixel stream)  → orbit (Δx yaw, Δy pitch), no pan
 *   mouse wheel notch (deltaMode LINE, or n × 100 px)  → orbit, glided out
 *   Shift + scroll                            → pan (content follows), banded
 *   Ctrl/⌘ + scroll (Chromium's pinch)        → zoom at the cursor
 *   Safari gesture* scale / rotation          → zoom at the cursor / roll
 *   left drag → orbit; middle or right drag   → pan
 *   touch: one finger → orbit; two fingers    → pan + pinch + twist at once
 *
 * Born RED on c80fb9a5 (the plain wheel panned; a middle or right drag
 * orbited; a reduced-motion notch cut to its end in one frame).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick, ref } from "vue";
import OrbitalDrag from "../../../demo/scenes/cube/orbital-drag/OrbitalDrag.vue";
import { defaultTransformState, type TransformState } from "../../../demo/scenes/cube/orbital-drag/transform";
import { PAN_OUT, SILHOUETTE } from "../../../demo/scenes/cube/orbital-drag/bounds";
import { WHEEL_LIVE_MS, notchCount } from "../../../demo/scenes/cube/orbital-drag/composables/useOrbitalGesture";
import {
    quatAngleBetween,
    quatConjugate,
    quatMultiply,
    quatToAxisAngle,
    type Quat,
} from "../../../demo/scenes/cube/orbital-drag/arcball";
import { attitudeQuat } from "../../../demo/scenes/cube/graphAttitude";

const G = attitudeQuat();
const CENTRE = { x: 200, y: 300 };
const STAGE = { left: 16, top: 107, right: 374, bottom: 545 };
const SIDE = 160;
/** side 160 → h 80 → R = min(2h, ½·min V) = 160. */
const R = 160;
const DEG = 180 / Math.PI;

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

const flush = async (frames = 1) => {
    for (let i = 0; i < frames; i++) {
        now += 1000 / 60;
        const due = queue;
        queue = [];
        for (const cb of due) cb(now);
        await nextTick();
    }
};

async function mountOrbit(scrollOwner: "stage" | "beside" | "page" = "stage") {
    const model = ref<TransformState>(structuredClone(defaultTransformState));
    const w = mount(OrbitalDrag, {
        props: {
            applyTransformToContainer: true,
            scrollOwner,
            modelValue: model.value,
            "onUpdate:modelValue": (v: TransformState) => (model.value = v),
            frame: () => ({ centre: { ...CENTRE }, side: SIDE, fit: 1, stage: STAGE }),
        },
        attachTo: document.body,
    });
    await nextTick();
    return { w, model, el: w.element as HTMLElement };
}

let wheelAt = 0;
const wheel = (init: WheelEventInit, t?: number) => {
    const e = new WheelEvent("wheel", { cancelable: true, bubbles: true, clientX: CENTRE.x, clientY: CENTRE.y, ...init });
    Object.defineProperty(e, "timeStamp", { value: t ?? (wheelAt += 1000) });
    return e;
};

const ptr = (type: string, id: number, x: number, y: number, t: number, pointerType = "mouse", button = 0) => {
    const e = new PointerEvent(type, { clientX: x, clientY: y, pointerId: id, pointerType, button, bubbles: true });
    Object.defineProperty(e, "timeStamp", { value: t });
    return e;
};

const q = (m: TransformState): Quat => (m.quaternion as Quat | undefined) ?? [0, 0, 0, 1];
/** The screen-frame rotation the orbit authored since identity (G·Q·G⁻¹). */
const screenRotation = (qq: Quat) => quatToAxisAngle(quatMultiply(quatMultiply(G, qq), quatConjugate(G)));

describe("M1 — a two-finger scroll orbits the die and never pans it", () => {
    it("Δy +30 px pitches 2·30/R about the screen's horizontal; the die stays put; the page does not scroll", async () => {
        const { w, model, el } = await mountOrbit();
        const e = wheel({ deltaY: 30 });
        el.dispatchEvent(e);
        await flush();
        expect(e.defaultPrevented).toBe(true);
        const r = screenRotation(q(model.value));
        expect(r.angle).toBeCloseTo((2 * 30) / R, 9);
        expect(Math.abs(r.axis[0])).toBeCloseTo(1, 9);
        expect(model.value.translate.x).toBe(0);
        expect(model.value.translate.y).toBe(0);
        expect(model.value.scale.x).toBe(1);
        w.unmount();
    });

    it("Δx −40 px yaws 2·40/R about the screen's vertical; the die stays put", async () => {
        const { w, model, el } = await mountOrbit();
        el.dispatchEvent(wheel({ deltaX: -40, deltaY: 0 }));
        await flush();
        const r = screenRotation(q(model.value));
        expect(r.angle).toBeCloseTo((2 * 40) / R, 9);
        expect(Math.abs(r.axis[1])).toBeCloseTo(1, 9);
        expect(model.value.translate.x).toBe(0);
        expect(model.value.translate.y).toBe(0);
        w.unmount();
    });

    it("the surface follows the fingers: −Δy tips the near face up (the drag's own sense)", async () => {
        // A one-finger drag upward by 30 px turns the die the same way as a
        // scroll whose content moves up by 30 px (Δy = +30 under natural scrolling).
        const turnByWheel = async () => {
            const { w, model, el } = await mountOrbit();
            el.dispatchEvent(wheel({ deltaY: 30 }));
            await flush();
            const out = q(model.value);
            w.unmount();
            return out;
        };
        const turnByDrag = async () => {
            const { w, model, el } = await mountOrbit();
            el.dispatchEvent(ptr("pointerdown", 1, CENTRE.x, CENTRE.y, 0));
            document.dispatchEvent(ptr("pointermove", 1, CENTRE.x, CENTRE.y - 30, 8));
            await flush();
            document.dispatchEvent(ptr("pointerup", 1, CENTRE.x, CENTRE.y - 30, 300));
            await flush();
            const out = q(model.value);
            w.unmount();
            return out;
        };
        const a = screenRotation(await turnByWheel());
        const b = screenRotation(await turnByDrag());
        expect(Math.sign(a.axis[0])).toBe(Math.sign(b.axis[0]));
    });

    it("a trackpad's stream, momentum tail included, is applied as it comes: it sums, nothing coasts after, nothing pans", async () => {
        const { w, model, el } = await mountOrbit();
        // A flick: the hand's ramp, then the OS's own momentum bleeding out.
        const stream = [2, 5, 9, 14, 12, 9, 6, 4, 2, 1, 1];
        let t = 0;
        for (const d of stream) {
            el.dispatchEvent(wheel({ deltaX: d, deltaY: 0 }, (t += 16)));
            await flush();
        }
        const after = q(model.value);
        expect(screenRotation(after).angle).toBeCloseTo((2 * stream.reduce((a, b) => a + b)) / R, 9);
        await flush(30);
        expect(quatAngleBetween(q(model.value), after)).toBe(0);
        expect(model.value.translate.x).toBe(0);
        expect(model.value.translate.y).toBe(0);
        w.unmount();
    });
});

describe("M2 — a mouse wheel notch orbits too, glided out", () => {
    it("notchCount tells a mouse from a trackpad by deltaMode and integer steps", () => {
        expect(notchCount(1, 3, 3)).toBe(1); // Firefox, LINE
        expect(notchCount(0, 100, 100)).toBe(1); // Chromium / Safari, one notch
        expect(notchCount(0, 240, 120)).toBe(2); // two coalesced notches
        expect(notchCount(0, 12, 4)).toBe(0); // a trackpad's pixel stream
        expect(notchCount(0, 73.5, 61)).toBe(0); // a fast trackpad flick
    });

    it("a LINE-mode notch (3 lines = 48 px) glides to 2·48/R about the screen's horizontal and pans nothing", async () => {
        const { w, model, el } = await mountOrbit();
        el.dispatchEvent(wheel({ deltaY: 3, deltaMode: 1 }));
        await nextTick();
        expect(screenRotation(q(model.value)).angle).toBe(0);
        let frames = 0;
        let prev = q(model.value);
        for (let i = 0; i < 90; i++) {
            await flush();
            if (quatAngleBetween(q(model.value), prev) > 0) frames++;
            prev = q(model.value);
        }
        expect(frames).toBeGreaterThanOrEqual(12);
        const r = screenRotation(q(model.value));
        expect(r.angle).toBeCloseTo((2 * 48) / R, 9);
        expect(Math.abs(r.axis[0])).toBeCloseTo(1, 9);
        expect(model.value.translate.y).toBe(0);
        w.unmount();
    });

    it("under reduced motion a notch's glide is shortened, never cut", async () => {
        reduce = true;
        const { w, model, el } = await mountOrbit();
        el.dispatchEvent(wheel({ deltaY: 100 }));
        await nextTick();
        // Nothing jumps in the event's own task.
        expect(screenRotation(q(model.value)).angle).toBe(0);
        const angles: number[] = [];
        for (let i = 0; i < 30; i++) {
            await flush();
            angles.push(screenRotation(q(model.value)).angle);
        }
        // More than one frame of travel, and resting well inside the full glide's ~30 frames.
        expect(angles.filter((a, i) => i > 0 && a > angles[i - 1]!).length).toBeGreaterThanOrEqual(3);
        const restAt = angles.findIndex((a) => Math.abs(a - 40 / DEG) < 1e-9);
        expect(restAt).toBeGreaterThan(1);
        expect(restAt).toBeLessThanOrEqual(12);
        w.unmount();
    });
});

describe("M3 — Shift + scroll pans, banded, and springs back", () => {
    it("Shift + Δy +30 moves the die's centre −30 (content follows the fingers) and turns nothing", async () => {
        const { w, model, el } = await mountOrbit();
        el.dispatchEvent(wheel({ deltaY: 30, shiftKey: true }));
        await flush();
        expect(model.value.translate.y).toBeCloseTo(-30, 9);
        expect(model.value.translate.x).toBe(0);
        expect(screenRotation(q(model.value)).angle).toBe(0);
        w.unmount();
    });

    it("a Shift-scroll past the bound rides the band, then springs back onto it", async () => {
        const TOP = STAGE.top + (0.5 - PAN_OUT) * SIDE * SILHOUETTE;
        const { w, model, el } = await mountOrbit();
        for (let i = 0; i < 5; i++) {
            el.dispatchEvent(wheel({ deltaY: 200, shiftKey: true }));
            await flush();
        }
        expect(CENTRE.y + model.value.translate.y).toBeLessThan(TOP);
        await new Promise((r) => setTimeout(r, WHEEL_LIVE_MS + 20));
        const ys: number[] = [];
        for (let i = 0; i < 120; i++) {
            await flush();
            ys.push(CENTRE.y + model.value.translate.y);
        }
        // Eased home: monotone, more than one frame, landing exactly.
        for (let i = 1; i < ys.length; i++) expect(ys[i]!).toBeGreaterThanOrEqual(ys[i - 1]! - 1e-9);
        expect(new Set(ys.map((y) => y.toFixed(3))).size).toBeGreaterThan(5);
        expect(ys.at(-1)).toBe(TOP);
        expect(screenRotation(q(model.value)).angle).toBe(0);
        w.unmount();
    });
});

describe("M4 — the pinch zooms at the cursor", () => {
    it("Ctrl + Δy −15 (Chromium's pinch) zooms e^0.15 and turns nothing", async () => {
        const { w, model, el } = await mountOrbit();
        el.dispatchEvent(wheel({ deltaY: -15, ctrlKey: true }));
        await flush();
        expect(Math.abs(model.value.scale.x - Math.exp(0.15))).toBeLessThan(1e-9);
        expect(screenRotation(q(model.value)).angle).toBe(0);
        w.unmount();
    });
});

describe("M5 — mouse buttons: left orbits, middle and right pan", () => {
    const dragWith = async (button: number) => {
        const { w, model, el } = await mountOrbit();
        el.dispatchEvent(ptr("pointerdown", 1, CENTRE.x, CENTRE.y, 0, "mouse", button));
        // Inside the bound (the centre's right bound is 374 − ½·160·2 = 214).
        document.dispatchEvent(ptr("pointermove", 1, CENTRE.x + 6, CENTRE.y + 3, 8, "mouse", button));
        document.dispatchEvent(ptr("pointermove", 1, CENTRE.x + 12, CENTRE.y + 6, 16, "mouse", button));
        await flush();
        document.dispatchEvent(ptr("pointerup", 1, CENTRE.x + 12, CENTRE.y + 6, 300, "mouse", button));
        await flush();
        const out = { t: { ...model.value.translate }, angle: screenRotation(q(model.value)).angle };
        w.unmount();
        return out;
    };

    it("a left drag orbits and does not pan", async () => {
        const r = await dragWith(0);
        expect(r.angle).toBeGreaterThan(0.05);
        expect(r.t.x).toBe(0);
        expect(r.t.y).toBe(0);
    });

    it("a middle drag pans 1:1 and does not turn", async () => {
        const r = await dragWith(1);
        expect(r.t.x).toBeCloseTo(12, 9);
        expect(r.t.y).toBeCloseTo(6, 9);
        expect(r.angle).toBe(0);
    });

    it("a right drag pans 1:1, does not turn, and keeps the context menu off the stage", async () => {
        const r = await dragWith(2);
        expect(r.t.x).toBeCloseTo(12, 9);
        expect(r.t.y).toBeCloseTo(6, 9);
        expect(r.angle).toBe(0);
        const { w, el } = await mountOrbit();
        const menu = new MouseEvent("contextmenu", { cancelable: true, bubbles: true });
        el.dispatchEvent(menu);
        expect(menu.defaultPrevented).toBe(true);
        w.unmount();
    });
});

describe("M6 — touch: one finger orbits; two fingers pan, pinch and twist in one gesture", () => {
    it("a pair that spreads 2×, twists 30° and whose centroid moves (+30, +20) does all three at once", async () => {
        const { w, model, el } = await mountOrbit();
        const a0 = { x: 170, y: 300 };
        const b0 = { x: 230, y: 300 };
        let t = 0;
        el.dispatchEvent(ptr("pointerdown", 1, a0.x, a0.y, t, "touch"));
        el.dispatchEvent(ptr("pointerdown", 2, b0.x, b0.y, t, "touch"));
        const steps = 20;
        for (let i = 1; i <= steps; i++) {
            t += 8;
            const f = i / steps;
            const half = 30 * (1 + f); // 30 → 60: the distance doubles
            const th = (30 / DEG) * f;
            const c = { x: 200 + 30 * f, y: 300 + 20 * f };
            const dx = half * Math.cos(th);
            const dy = half * Math.sin(th);
            document.dispatchEvent(ptr("pointermove", 1, c.x - dx, c.y - dy, t, "touch"));
            document.dispatchEvent(ptr("pointermove", 2, c.x + dx, c.y + dy, t, "touch"));
            if (i % 2 === 0) await flush();
        }
        await flush();
        expect(Math.abs(model.value.scale.x - 2)).toBeLessThan(0.02);
        const r = screenRotation(q(model.value));
        // Each channel sits behind its soft dead zone (similarity.ts), paid
        // back as the gesture grows: 30° lands 30 − 4²/30 ≈ 29.5°.
        expect(Math.abs(r.angle * DEG - 30)).toBeLessThan(1);
        expect(Math.abs(r.axis[2])).toBeCloseTo(1, 6);
        // The centroid started on the die's centre, so the die's centre rides it.
        expect(Math.abs(model.value.translate.x - 30)).toBeLessThan(1.5);
        expect(Math.abs(model.value.translate.y - 20)).toBeLessThan(1.5);
        document.dispatchEvent(ptr("pointerup", 1, 0, 0, t + 400, "touch"));
        document.dispatchEvent(ptr("pointerup", 2, 0, 0, t + 400, "touch"));
        w.unmount();
    });
});
