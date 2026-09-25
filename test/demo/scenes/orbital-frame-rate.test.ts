// SERVED MODEL: claude-opus-5-5
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { effectScope, nextTick, ref } from "vue";
import { quat, vec3 } from "gl-matrix";

import OrbitalDrag from "../../../demo/scenes/cube/orbital-drag/OrbitalDrag.vue";

import { useOrbitalInertia } from "../../../demo/scenes/cube/orbital-drag/composables/useOrbitalInertia";
import {
    defaultTransformState,
    defaultVelocityState,
} from "../../../demo/scenes/cube/orbital-drag/transform";

/**
 * X.KF.W13X `.cube` · KFA-83 — the orbit coast is frame-rate invariant.
 * `applyInertia` decayed the speed by the analytic factor over the real frame
 * delta, but stepped the pose by the whole per-frame speed on EVERY frame, so a
 * 120 Hz display coasted about twice as far as a 60 Hz one. The same fling is
 * coasted here at 60 Hz and at 120 Hz on a hand-driven rAF clock, and the total
 * angle must agree. The fling's SPEED is measured per unit time as well: the
 * same hand speed sampled by 60 Hz and 120 Hz pointer events must coast alike
 * (the EMA used to average the per-EVENT angle, so 120 Hz events halved it).
 */

let now = 0;
let queue: FrameRequestCallback[] = [];

beforeEach(() => {
    now = 0;
    queue = [];
    vi.spyOn(performance, "now").mockImplementation(() => now);
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
        queue.push(cb);
        return queue.length;
    });
    vi.stubGlobal("cancelAnimationFrame", () => {});
});

afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});

const coast = (hz: number, ms: number) => {
    let total = 0;
    const isDragging = ref(true);
    const scope = effectScope();
    scope.run(() =>
        useOrbitalInertia({
            model: ref(structuredClone(defaultTransformState)),
            velocity: ref(structuredClone(defaultVelocityState)),
            isDragging,
            isTouching: ref(false),
            isWheeling: ref(false),
            inertiaFactor: 0.95,
            // The fling's speed in the composable's own unit: radians per 60 Hz frame.
            angularVelocitySpeed: ref(0.05),
            applyRotation: (_axis, angle) => void (total += angle),
            angularVelocityAxis: vec3.fromValues(0, 1, 0),
            updateLinearTransform: () => {},
        }),
    );
    return {
        run: async () => {
            isDragging.value = false; // the release resumes the coast loop
            await Promise.resolve();
            const dt = 1000 / hz;
            for (let t = 0; t < ms; t += dt) {
                now += dt;
                const due = queue;
                queue = [];
                for (const cb of due) cb(now);
            }
            scope.stop();
            return total;
        },
    };
};

describe("KFA-83 — the coast covers the same angle at 60 Hz and 120 Hz", () => {
    it("total coast angle agrees within 5 %", async () => {
        const at60 = await coast(60, 2000).run();
        const at120 = await coast(120, 2000).run();
        expect(at60).toBeGreaterThan(0.2);
        expect(Math.abs(at120 - at60) / at60).toBeLessThan(0.05);
    });
});

const frame = (dt: number) => {
    now += dt;
    const due = queue;
    queue = [];
    for (const cb of due) cb(now);
};

const at = (type: string, x: number, y: number, timeStamp: number) => {
    const e = new PointerEvent(type, { clientX: x, clientY: y, pointerId: 1, pointerType: "mouse", bubbles: true });
    Object.defineProperty(e, "timeStamp", { value: timeStamp });
    return e;
};

const orientation = (el: Element) => {
    const m = /rotate3d\(\s*([-\d.eE]+)\s*,\s*([-\d.eE]+)\s*,\s*([-\d.eE]+)\s*,\s*([-\d.eE]+)deg/.exec(
        el.getAttribute("style") ?? "",
    )!;
    const q = quat.create();
    quat.setAxisAngle(q, vec3.normalize(vec3.create(), vec3.fromValues(+m[1]!, +m[2]!, +m[3]!)), (+m[4]! * Math.PI) / 180);
    return q;
};

/** The same hand speed (0.12 px/ms to the right) sampled at `hz`; returns the
 *  coast angle (deg) after release. */
const flingCoast = async (hz: number) => {
    const model = ref(structuredClone(defaultTransformState));
    const w = mount(OrbitalDrag, {
        props: { applyTransformToContainer: true, modelValue: model.value, "onUpdate:modelValue": (v: typeof model.value) => (model.value = v) },
        attachTo: document.body,
    });
    await nextTick();
    const el = w.element as HTMLElement;
    const dt = 1000 / hz;
    let t = 0;
    let x = 0;
    el.dispatchEvent(at("pointerdown", x, 0, t));
    await nextTick(); // events are separate tasks in a browser; let the press flush
    for (let i = 0; i < Math.round(hz / 5); i++) {
        t += dt;
        x += 0.12 * dt;
        document.dispatchEvent(at("pointermove", x, 0, t));
    }
    await nextTick();
    document.dispatchEvent(at("pointerup", x, 0, t + 1));
    await nextTick();
    const released = orientation(el);
    for (let i = 0; i < 180; i++) {
        frame(1000 / 60);
        await nextTick();
    }
    const coasted = orientation(el);
    w.unmount();
    return (2 * Math.acos(Math.min(1, Math.abs(quat.dot(released, coasted)))) * 180) / Math.PI;
};

describe("KFA-83 — the fling speed is per unit time, not per pointer event", () => {
    it("60 Hz and 120 Hz pointer events of one hand speed coast within 10 %", async () => {
        const at60 = await flingCoast(60);
        const at120 = await flingCoast(120);
        expect(at60).toBeGreaterThan(5);
        expect(Math.abs(at120 - at60) / at60).toBeLessThan(0.1);
    });
});
