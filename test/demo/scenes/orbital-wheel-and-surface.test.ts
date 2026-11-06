// SERVED MODEL: claude-opus-5-5
/**
 * kf-cube (value.js X §0hz, owner 2026-11-05: "keyframes cube scrolling and
 * orbital dragging needs debugging and assay") — the mounted OrbitalDrag's
 * wheel, its surface and its pan frame.
 *
 *  U1 one truth: ctrl-wheel steps summed per frame (coalesced or split events
 *     land the same scale); the plain-wheel orbit sums the same way; an
 *     external write still re-seeds.
 *  U2 the zoom gear: s ← s·exp(−ΣΔy/100), Chromium's own pinch encoding, the
 *     summed ln step capped at ±0.25 a frame.
 *  U3 the surface: a grab beside the die drives it by the wheel's law, at the
 *     arcball's centre gain.
 *  U4 the notch glide: one notch glides out over ≥ 12 frames, ≤ 6° a frame,
 *     landing exactly; notches stack; a trackpad stream is direct.
 *  U5 the true centre: the frame's centre is the REST centre; the pan clamp
 *     holds the die inside V however many pans stack.
 *  U6 the scroll owner: an embed ("page") yields the plain wheel to its host.
 *
 * Born RED ×2 on fdb5987f (16 of 18): each ctrl-wheel event re-seeded from
 * the uncommitted model, so the last of 4 × −5 won (Δs 0.023 against 1 × −20),
 * and the 0.0015/px gear zoomed a 2× pinch to 1.11×; a 100 px notch landed in
 * one frame; a grab beside the die did nothing; three +250 px pans put the
 * die's centre at 548 against V's right edge 374; an embed's plain wheel was
 * prevented and a vertical swipe on it turned the die.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick, ref } from "vue";
import OrbitalDrag from "../../../demo/scenes/cube/orbital-drag/OrbitalDrag.vue";
import { defaultTransformState, type TransformState } from "../../../demo/scenes/cube/orbital-drag/transform";
import {
    quatAngleBetween,
    quatConjugate,
    quatMultiply,
    quatToAxisAngle,
    type Quat,
} from "../../../demo/scenes/cube/orbital-drag/arcball";
import { attitudeQuat } from "../../../demo/scenes/cube/graphAttitude";

const G = attitudeQuat();
/** The die's REST centre (t = 0), as CubeTarget's frame reports `.graph`'s. */
const CENTRE = { x: 200, y: 300 };
const STAGE = { left: 16, top: 107, right: 374, bottom: 545 };
/** side 160 → h 80 → R = min(2h, ½·min V) = 160. */
const SIDE = 160;
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

async function mountOrbit(scrollOwner: "stage" | "page" = "stage") {
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

const ptr = (type: string, x: number, y: number, t: number, shiftKey = false) => {
    const e = new PointerEvent(type, { clientX: x, clientY: y, pointerId: 1, pointerType: "mouse", bubbles: true, shiftKey });
    Object.defineProperty(e, "timeStamp", { value: t });
    return e;
};

/** A held mouse drag along `path` (no fling: released 200 ms after the last move). */
async function drag(el: HTMLElement, path: [number, number][], shiftKey = false) {
    let t = 0;
    el.dispatchEvent(ptr("pointerdown", path[0]![0], path[0]![1], t, shiftKey));
    for (const [x, y] of path.slice(1)) document.dispatchEvent(ptr("pointermove", x, y, (t += 8), shiftKey));
    await flush();
    document.dispatchEvent(ptr("pointerup", path.at(-1)![0], path.at(-1)![1], t + 200, shiftKey));
    await flush();
}

const q = (m: TransformState): Quat => (m.quaternion as Quat | undefined) ?? [0, 0, 0, 1];
/** The screen-frame rotation the orbit authored since identity (G·Q·G⁻¹). */
const screenRotation = (qq: Quat) => quatToAxisAngle(quatMultiply(quatMultiply(G, qq), quatConjugate(G)));

describe("U1 — one truth: ctrl-wheel and wheel-orbit steps sum per frame", () => {
    const zoomBy = async (deltas: number[]) => {
        const { w, model, el } = await mountOrbit();
        for (const d of deltas) el.dispatchEvent(wheel({ deltaY: d, ctrlKey: true }, 1));
        await flush();
        const s = model.value.scale.x;
        w.unmount();
        return s;
    };

    it("4 × −5 and 2 × −10 land the scale of 1 × −20 (under the frame cap)", async () => {
        // Every per-event step (ln 0.05, 0.1) and the sum (0.2) sit under
        // the 0.25 frame cap, so the cap cannot be what makes them agree.
        const one = await zoomBy([-20]);
        expect(Math.abs((await zoomBy([-5, -5, -5, -5])) - one)).toBeLessThan(1e-6);
        expect(Math.abs((await zoomBy([-10, -10])) - one)).toBeLessThan(1e-6);
        expect(Math.abs(one - Math.exp(0.2))).toBeLessThan(1e-9);
    });

    it("4 × 4 px of plain wheel in one task turn the die exactly as 1 × 16 px", async () => {
        const turn = async (deltas: number[]) => {
            const { w, model, el } = await mountOrbit();
            for (const d of deltas) el.dispatchEvent(wheel({ deltaY: d }, 1));
            await flush();
            const out = q(model.value);
            w.unmount();
            return out;
        };
        const one = await turn([16]);
        expect(screenRotation(one).angle).toBeCloseTo((2 * 16) / R, 9);
        expect(quatAngleBetween(await turn([4, 4, 4, 4]), one)).toBeLessThan(1e-9);
    });

    it("an external write (Reset, a slider, a restore) still re-seeds the zoom and pan", async () => {
        const { w, model, el } = await mountOrbit();
        model.value = { ...model.value, scale: { x: 2, y: 2, z: 2 }, translate: { x: 30, y: 0, z: 0 } };
        await w.setProps({ modelValue: model.value });
        el.dispatchEvent(wheel({ deltaY: -20, ctrlKey: true, clientX: CENTRE.x + 30 }, 1));
        await flush();
        expect(Math.abs(model.value.scale.x - 2 * Math.exp(0.2))).toBeLessThan(1e-9);
        // Anchored at the cursor over the panned centre: the pan stays.
        expect(Math.abs(model.value.translate.x - 30)).toBeLessThan(1e-9);
        w.unmount();
    });
});

describe("U2 — the zoom gear is the pinch itself", () => {
    it("Chromium's pinch 2× (ΣΔy = −100·ln 2 over 10 frames) lands 2.000×", async () => {
        const { w, model, el } = await mountOrbit();
        for (let i = 0; i < 10; i++) {
            el.dispatchEvent(wheel({ deltaY: (-100 * Math.LN2) / 10, ctrlKey: true }, i * 16));
            await flush();
        }
        expect(Math.abs(model.value.scale.x - 2)).toBeLessThan(1e-9);
        w.unmount();
    });

    it("one mouse notch (Δy −100) is one capped frame step: e^0.25 = 1.284×", async () => {
        const { w, model, el } = await mountOrbit();
        el.dispatchEvent(wheel({ deltaY: -100, ctrlKey: true }));
        await flush();
        expect(Math.abs(model.value.scale.x - Math.exp(0.25))).toBeLessThan(1e-9);
        w.unmount();
    });
});

describe("U3 — the stage is the surface", () => {
    it("a grab beside the die turns it at the arcball's centre gain (2|d|/R)", async () => {
        const { w, model, el } = await mountOrbit();
        const x0 = CENTRE.x + R + 30;
        await drag(el, [[x0, CENTRE.y], [x0, CENTRE.y + 10], [x0, CENTRE.y + 20]]);
        const r = screenRotation(q(model.value));
        expect(r.angle).toBeCloseTo((2 * 20) / R, 9);
        // A vertical move tumbles about the screen x axis, as on the die.
        expect(Math.abs(r.axis[0])).toBeCloseTo(1, 9);
        w.unmount();
    });

    it("the off-die drive rebases each move: split moves equal one, out-and-back returns", async () => {
        const run = async (path: [number, number][]) => {
            const { w, model, el } = await mountOrbit();
            await drag(el, path);
            const out = q(model.value);
            w.unmount();
            return out;
        };
        const x0 = CENTRE.x - R - 20;
        const y = CENTRE.y;
        const one = await run([[x0, y], [x0 - 40, y]]);
        expect(screenRotation(one).angle).toBeCloseTo((2 * 40) / R, 9);
        const split = await run([[x0, y], [x0 - 10, y], [x0 - 20, y], [x0 - 30, y], [x0 - 40, y]]);
        expect(quatAngleBetween(one, split)).toBeLessThan(1e-9);
        const back = await run([[x0, y], [x0 - 25, y], [x0 - 40, y], [x0 - 10, y], [x0, y]]);
        expect(screenRotation(back).angle).toBeLessThan(1e-9);
    });

    it("the seam: a tangential move at R − 2 and at R + 2 turns the die within ±5 %", async () => {
        const turn = async (r: number) => {
            const { w, model, el } = await mountOrbit();
            const x = CENTRE.x + r;
            await drag(el, [[x, CENTRE.y], [x, CENTRE.y + 2]]);
            const a = screenRotation(q(model.value)).angle;
            w.unmount();
            return a;
        };
        const inside = await turn(R - 2);
        const outside = await turn(R + 2);
        expect(Math.abs(outside / inside - 1)).toBeLessThan(0.05);
    });
});

describe("U4 — a mouse notch glides out; a trackpad stream stays direct", () => {
    /** Per-frame angle steps (rad) until the attitude rests. */
    const glideSteps = async (model: { value: TransformState }, frames = 90) => {
        const steps: number[] = [];
        let prev = q(model.value);
        for (let i = 0; i < frames; i++) {
            await flush();
            const cur = q(model.value);
            steps.push(quatAngleBetween(cur, prev));
            prev = cur;
        }
        return steps;
    };

    it("one 100 px notch: ≥ 12 frames, ≤ 6° a frame, landing exactly on the capped 40°", async () => {
        const { w, model, el } = await mountOrbit();
        el.dispatchEvent(wheel({ deltaY: 100 }));
        await nextTick();
        // Nothing jumps in the event's own task.
        expect(screenRotation(q(model.value)).angle).toBe(0);
        const steps = await glideSteps(model);
        expect(steps.filter((s) => s > 0).length).toBeGreaterThanOrEqual(12);
        expect(Math.max(...steps) * DEG).toBeLessThanOrEqual(6);
        expect(Math.abs(screenRotation(q(model.value)).angle - (40 / DEG))).toBeLessThan(1e-9);
        w.unmount();
    });

    it("notches stack: a second notch mid-glide travels Σθ, monotone", async () => {
        const { w, model, el } = await mountOrbit();
        el.dispatchEvent(wheel({ deltaY: 100 }, 0));
        await flush(4);
        el.dispatchEvent(wheel({ deltaY: 100 }, 66));
        const steps = await glideSteps(model);
        expect(steps.every((s) => s >= 0)).toBe(true);
        expect(Math.abs(screenRotation(q(model.value)).angle - (80 / DEG))).toBeLessThan(1e-9);
        w.unmount();
    });

    it("notches on two axes in one task glide as one rotation |θx + θy|", async () => {
        const { w, model, el } = await mountOrbit();
        el.dispatchEvent(wheel({ deltaY: 100 }, 0));
        el.dispatchEvent(wheel({ deltaX: 100, deltaY: 0 }, 400));
        await glideSteps(model);
        expect(Math.abs(screenRotation(q(model.value)).angle - (40 * Math.SQRT2) / DEG)).toBeLessThan(1e-9);
        w.unmount();
    });

    it("under reduced motion a notch lands in its own frame", async () => {
        reduce = true;
        const { w, model, el } = await mountOrbit();
        el.dispatchEvent(wheel({ deltaY: 100 }));
        await nextTick();
        expect(Math.abs(screenRotation(q(model.value)).angle - 40 / DEG)).toBeLessThan(1e-9);
        w.unmount();
    });

    it("a trackpad's pixel stream is applied direct: 0 glides", async () => {
        const { w, model, el } = await mountOrbit();
        const stream = [2, 4, 7, 11, 9, 6, 3, 1];
        let t = 0;
        for (const d of stream) {
            el.dispatchEvent(wheel({ deltaY: d }, (t += 16)));
            await flush();
        }
        const after = q(model.value);
        expect(screenRotation(after).angle).toBeCloseTo((2 * stream.reduce((a, b) => a + b)) / R, 9);
        // Nothing still moving.
        await flush(10);
        expect(quatAngleBetween(q(model.value), after)).toBe(0);
        w.unmount();
    });
});

describe("U5 — the frame's centre is the rest centre; the pan holds the die in V", () => {
    it("three +250 px pans keep the die's centre inside V", async () => {
        const { w, model, el } = await mountOrbit();
        for (let i = 0; i < 3; i++) {
            const x = CENTRE.x + model.value.translate.x;
            await drag(el, [[x, CENTRE.y], [x + 125, CENTRE.y], [x + 250, CENTRE.y]], true);
            expect(CENTRE.x + model.value.translate.x).toBeLessThanOrEqual(STAGE.right + 1e-9);
        }
        expect(CENTRE.x + model.value.translate.x).toBeCloseTo(STAGE.right, 9);
        w.unmount();
    });

    it("a 20 px drag from the panned centre tumbles (roll < 0.5°)", async () => {
        const { w, model, el } = await mountOrbit();
        await drag(el, [[CENTRE.x, CENTRE.y], [CENTRE.x + 60, CENTRE.y + 40]], true);
        const c = { x: CENTRE.x + model.value.translate.x, y: CENTRE.y + model.value.translate.y };
        await drag(el, [[c.x, c.y], [c.x + 10, c.y], [c.x + 20, c.y]]);
        const r = screenRotation(q(model.value));
        expect(r.angle).toBeGreaterThan(0.1);
        expect(Math.abs(r.angle * r.axis[2]) * DEG).toBeLessThan(0.5);
        w.unmount();
    });
});

describe("U6 — who owns the scroll", () => {
    it("page: the plain wheel goes to the host (not prevented, no turn); ctrl-wheel is the die's", async () => {
        const { w, model, el } = await mountOrbit("page");
        const plain = wheel({ deltaY: 40 });
        el.dispatchEvent(plain);
        await flush();
        expect(plain.defaultPrevented).toBe(false);
        expect(screenRotation(q(model.value)).angle).toBe(0);
        const zoom = wheel({ deltaY: -20, ctrlKey: true });
        el.dispatchEvent(zoom);
        await flush();
        expect(zoom.defaultPrevented).toBe(true);
        expect(Math.abs(model.value.scale.x - Math.exp(0.2))).toBeLessThan(1e-9);
        w.unmount();
    });

    it("page: a vertical touch swipe leaves the die alone; a sideways one turns it", async () => {
        const { w, model, el } = await mountOrbit("page");
        const touch = (type: string, x: number, y: number, t: number) => {
            const e = new PointerEvent(type, { clientX: x, clientY: y, pointerId: 7, pointerType: "touch", bubbles: true });
            Object.defineProperty(e, "timeStamp", { value: t });
            return e;
        };
        el.dispatchEvent(touch("pointerdown", CENTRE.x, CENTRE.y, 0));
        for (let i = 1; i <= 6; i++) document.dispatchEvent(touch("pointermove", CENTRE.x + i, CENTRE.y - 8 * i, i * 8));
        await flush();
        expect(screenRotation(q(model.value)).angle).toBe(0);
        // The browser takes it as the host's scroll.
        document.dispatchEvent(touch("pointercancel", CENTRE.x + 6, CENTRE.y - 48, 60));
        await flush();
        expect(screenRotation(q(model.value)).angle).toBe(0);

        el.dispatchEvent(touch("pointerdown", CENTRE.x, CENTRE.y, 100));
        for (let i = 1; i <= 6; i++) document.dispatchEvent(touch("pointermove", CENTRE.x + 8 * i, CENTRE.y + i, 100 + i * 8));
        await flush();
        expect(screenRotation(q(model.value)).angle).toBeGreaterThan(0.2);
        document.dispatchEvent(touch("pointerup", CENTRE.x + 48, CENTRE.y + 6, 400));
        w.unmount();
    });

    it("stage: every wheel is the die's", async () => {
        const { w, el } = await mountOrbit("stage");
        const plain = wheel({ deltaY: 40 });
        el.dispatchEvent(plain);
        expect(plain.defaultPrevented).toBe(true);
        w.unmount();
    });
});
