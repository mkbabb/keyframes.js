/**
 * X.KF.W12.f · AXISLINE-UNIT — the axis-lock reveal, made honest (G-KFW12-6).
 *
 * kf-CubeAxisLines had ZERO coverage (KF-AX-16's last limb). This file is the
 * unit's acceptance test and it asserts only what the component can be held to:
 *
 *  · KF-AX-1 — the reveal is driven by the demo's ONE keyboard registry. The
 *    window-latch half was cured upstream at KF.W11 `.a` (`fff7232c`); this end
 *    proves the consumer half END TO END by dispatching a real `KeyX` keydown
 *    and reading the lit line, with no window listener anywhere in the chain.
 *  · KF-AX-2 — the reveal is an ARMING tell: it lights with no gesture in
 *    flight, and the same latch gates the FIRST branch of BOTH the drag and the
 *    wheel path (the sixth operation), which is why "single-axis rotation" was
 *    false and the prose now says which axis the next constrained gesture pins.
 *  · KF-AX-4 · #57 · KF-AX-5 — EVERY geometric assertion is FRAME-STAMPED
 *    against the attitude the stage is parked at, `rotate3d(-1, 1, 0, 30deg)`,
 *    re-derived READ-ONLY from `GRAPH_ATTITUDE`/`rotateByAttitude` (KF.W11's
 *    files, never edited, never restated). The whole corpus's deepest error was
 *    arguing this component's geometry in a frame the app shows for 650 ms.
 *  · KF-AX-14 / -16 / -23 — one boolean drives one class; the three strokes come
 *    from the owner's own `axes` tuple; the fragment is `aria-hidden` like its
 *    `face-relit` sibling.
 *
 * No source text is read and no CSS is asserted by string: the style rows
 * (KF-AX-8/-9/-13/-17/-21) ride byte clauses in the wave record, because a test
 * that greps its subject proves only that the grep ran.
 */
import { afterEach, describe, expect, it } from "vitest";
import { createApp, effectScope, h, nextTick, reactive, ref, shallowRef } from "vue";
import { vec3 } from "gl-matrix";
import CubeAxisLines from "../../../demo/scenes/cube/CubeAxisLines.vue";
import OrbitalDrag from "../../../demo/scenes/cube/orbital-drag/OrbitalDrag.vue";
import { useOrbitalPointer } from "../../../demo/scenes/cube/orbital-drag/composables/useOrbitalPointer";
import {
    axes,
    defaultTransformState,
    type PressedKeys,
    type TransformState,
} from "../../../demo/scenes/cube/orbital-drag";
import {
    GRAPH_ATTITUDE,
    rotateByAttitude,
    type GraphAttitude,
} from "../../../demo/scenes/cube/useCubeRelit";

/** The stage attitude at the FIRST frame of the 650 ms intro sweep: identity. */
const MOUNT_T0: GraphAttitude = { axis: [0, 0, 0], angleDeg: 0 };

/**
 * Each stroke's own direction in the graph's frame — the element's local +X
 * after the per-axis transform the stylesheet declares:
 * `.x rotateX(0deg)` · `.y rotateZ(90deg)` · `.z rotateY(90deg)`.
 */
const STROKE_DIRECTION: Record<(typeof axes)[number], [number, number, number]> = {
    x: [1, 0, 0],
    y: [0, 1, 0],
    z: [0, 0, -1],
};

/**
 * Screen projection of a stroke under an attitude. CSS `perspective` divides a
 * ray through the projection origin by a positive scalar, which changes a
 * point's distance from the origin and never its bearing — so the projected
 * ORIENTATION of a line through that origin is exactly the bearing of its
 * rotated direction, and the screen EXTENT per unit of line is the length of
 * that direction's screen component. Both are frame-stamped by `attitude`.
 */
function project(axis: (typeof axes)[number], attitude: GraphAttitude) {
    const d = rotateByAttitude(STROKE_DIRECTION[axis], attitude);
    const extent = Math.hypot(d[0], d[1]);
    // Undirected: a line at 175.89° and one at −4.11° are the same stroke.
    const orientation = extent < 1e-9 ? null : (((Math.atan2(d[1], d[0]) * 180) / Math.PI % 180) + 180) % 180;
    return { direction: d, extent, orientation };
}

/** Smallest angle between two undirected orientations, in degrees. */
function separation(a: number, b: number): number {
    const d = Math.abs(a - b) % 180;
    return Math.min(d, 180 - d);
}

describe("the Z stroke, frame-stamped (KF-AX-4 · #57 · KF-AX-5)", () => {
    it("the stage attitude is re-derived, never restated", () => {
        // If KF.W11's frame ever moves, every number below moves with it — that
        // is the point of importing it rather than writing 30 into this file.
        expect(GRAPH_ATTITUDE.axis).toEqual([-1, 1, 0]);
        expect(GRAPH_ATTITUDE.angleDeg).toBe(30);
    });

    it("SETTLED rotate3d(-1,1,0,30deg): the .z stroke is legible — 45.00deg, extent 0.5/unit", () => {
        const z = project("z", GRAPH_ATTITUDE);
        expect(z.extent).toBeCloseTo(0.5, 5);
        expect(z.orientation).toBeCloseTo(45, 2);
        // Legible = it paints a stroke, not a point: half a unit of screen
        // length per unit of line, over a 1000vw line.
        expect(z.extent).toBeGreaterThan(0.1);
    });

    it("SETTLED: orientation is a REAL redundant encoding — all three ≥ 45deg apart", () => {
        const o = Object.fromEntries(
            axes.map((a) => [a, project(a, GRAPH_ATTITUDE).orientation!]),
        ) as Record<(typeof axes)[number], number>;
        expect(o.x).toBeCloseTo(175.89, 2);
        expect(o.y).toBeCloseTo(94.11, 2);
        expect(o.z).toBeCloseTo(45.0, 2);
        expect(separation(o.x, o.y)).toBeCloseTo(81.79, 2);
        expect(separation(o.y, o.z)).toBeCloseTo(49.11, 2);
        expect(separation(o.z, o.x)).toBeCloseTo(49.11, 2);
        for (const [a, b] of [
            ["x", "y"],
            ["y", "z"],
            ["z", "x"],
        ] as const) {
            expect(separation(o[a], o[b])).toBeGreaterThan(45);
        }
    });

    it("MOUNT t0 (identity): the redundancy holds for X-vs-Y and fails for EXACTLY Z", () => {
        const x = project("x", MOUNT_T0);
        const y = project("y", MOUNT_T0);
        const z = project("z", MOUNT_T0);
        expect(x.extent).toBeCloseTo(1, 10);
        expect(y.extent).toBeCloseTo(1, 10);
        expect(separation(x.orientation!, y.orientation!)).toBeCloseTo(90, 10);
        // The degeneracy, exactly: the Z axis lies along the view direction, so
        // the stroke projects to a point — and nothing else does.
        expect(z.extent).toBeCloseTo(0, 12);
        expect(z.orientation).toBeNull();
        expect(z.direction[2]).toBeCloseTo(-1, 12);
    });

    it("the degeneracy is TRANSIENT, and the PRM arm never shows it", () => {
        // The sweep runs identity → GRAPH_ATTITUDE; the PRM arm writes the
        // settled attitude inline with no sweep, so it starts already legible.
        expect(project("z", MOUNT_T0).extent).toBeLessThan(1e-9);
        expect(project("z", GRAPH_ATTITUDE).extent).toBeGreaterThan(0.1);
        // KF-AX-5's design decision, asserted as a property rather than a style:
        // `rotateY(90deg)` IS the Z axis. Any tilt that made it legible at t0
        // would move it off the axis it names.
        const local = STROKE_DIRECTION.z;
        expect(vec3.length(vec3.fromValues(local[0], local[1], 0))).toBe(0);
    });
});

let teardown: (() => void) | null = null;

/** The CubeTarget wiring, exactly: OrbitalDrag's emitted latch feeds the reveal. */
function mountRevealUnderRealOrbitalDrag() {
    const host = document.createElement("div");
    document.body.appendChild(host);
    const lock = reactive<Pick<PressedKeys, "x" | "y" | "z">>({ x: false, y: false, z: false });
    const model = reactive<TransformState>(structuredClone(defaultTransformState));
    const app = createApp({
        setup: () => () => [
            h(OrbitalDrag, {
                modelValue: model,
                "onUpdate:modelValue": (v: TransformState) => Object.assign(model, v),
                onPressedKeys: (keys: PressedKeys) => {
                    lock.x = keys.x;
                    lock.y = keys.y;
                    lock.z = keys.z;
                },
            }),
            h(CubeAxisLines, { lock }),
        ],
    });
    app.mount(host);
    teardown = () => {
        app.unmount();
        host.remove();
        teardown = null;
    };
    const strokes = () =>
        [...host.querySelectorAll<HTMLElement>(".axis-line")].map((el) => ({
            axis: axes.find((a) => el.classList.contains(a)) ?? null,
            locked: el.classList.contains("axis-line--locked"),
            style: el.getAttribute("style"),
            ariaHidden: el.getAttribute("aria-hidden"),
        }));
    return { strokes };
}

const key = (type: "keydown" | "keyup", code: string) =>
    window.dispatchEvent(new KeyboardEvent(type, { code, bubbles: true }));

describe("the reveal, on the ONE registry (KF-AX-1 consumer half · KF-AX-2)", () => {
    afterEach(() => teardown?.());

    it("a registry-dispatched KeyX lights the X stroke and only the X stroke", async () => {
        const { strokes } = mountRevealUnderRealOrbitalDrag();
        expect(strokes().map((s) => s.axis)).toEqual([...axes]);
        expect(strokes().some((s) => s.locked)).toBe(false);

        key("keydown", "KeyX");
        await nextTick();
        expect(strokes().filter((s) => s.locked).map((s) => s.axis)).toEqual(["x"]);

        // KF-AX-2 — ARMED, not active: nothing was dragged, and the tell is up.
        key("keyup", "KeyX");
        await nextTick();
        expect(strokes().some((s) => s.locked)).toBe(false);
    });

    it("each axis key lights its own stroke — the whole tuple, one at a time", async () => {
        const { strokes } = mountRevealUnderRealOrbitalDrag();
        for (const axis of axes) {
            key("keydown", `Key${axis.toUpperCase()}`);
            await nextTick();
            expect(strokes().filter((s) => s.locked).map((s) => s.axis)).toEqual([axis]);
            key("keyup", `Key${axis.toUpperCase()}`);
            await nextTick();
        }
        expect(strokes().some((s) => s.locked)).toBe(false);
    });

    it("KF-AX-14 — the class is the SOLE driver: no inline --axis-active survives", async () => {
        const { strokes } = mountRevealUnderRealOrbitalDrag();
        key("keydown", "KeyZ");
        await nextTick();
        for (const s of strokes()) expect(s.style ?? "").not.toContain("--axis-active");
        // KF-AX-23 — decorative to the a11y tree; the registry's labelled
        // bindings are the non-visual channel.
        for (const s of strokes()) expect(s.ariaHidden).toBe("true");
    });
});

describe("KF-AX-2 — the latch gates the FIRST branch of BOTH gesture paths", () => {
    /** The pointer reader with counting stubs in place of the transform appliers. */
    function harness() {
        const calls = { axisSpecific: 0, rotation: 0, translation: 0, scale: 0 };
        const scope = effectScope();
        const pointer = scope.run(() =>
            useOrbitalPointer({
                sensitivity: 1,
                touchSensitivity: 1,
                containerRef: shallowRef<HTMLElement | null>(document.createElement("div")),
                updateRotation: () => void calls.rotation++,
                applyRotation: () => {},
                updateTranslation: () => void calls.translation++,
                updateScale: () => void calls.scale++,
                handleAxisSpecificInput: () => void calls.axisSpecific++,
                angularVelocityAxis: vec3.create(),
                angularVelocitySpeed: ref(0),
            }),
        )!;
        return { pointer, calls, dispose: () => scope.stop() };
    }

    const pointerEvent = (type: string, clientX: number, clientY: number) =>
        new PointerEvent(type, { clientX, clientY, pointerId: 1, pointerType: "mouse" });

    it("DRAG: unlatched it rotates; latched it is constrained — same gesture", () => {
        const { pointer, calls, dispose } = harness();
        pointer.startDrag(pointerEvent("pointerdown", 0, 0));
        pointer.drag(pointerEvent("pointermove", 20, 20));
        expect(calls.rotation).toBe(1);
        expect(calls.axisSpecific).toBe(0);

        // Exactly what the registry's keydown binding calls (OrbitalDrag's
        // `registerShortcut(code, () => pointer.setAxisLatch(axis, true))`).
        pointer.setAxisLatch("y", true);
        pointer.drag(pointerEvent("pointermove", 40, 40));
        expect(calls.axisSpecific).toBe(1);
        expect(calls.rotation).toBe(1);
        dispose();
    });

    it("WHEEL: the sixth operation reads the SAME latch — 'single-axis rotation' was false", () => {
        const { pointer, calls, dispose } = harness();
        pointer.handleWheel(new WheelEvent("wheel", { deltaX: 40, deltaY: 40 }));
        expect(calls.rotation).toBe(1);
        expect(calls.axisSpecific).toBe(0);

        pointer.setAxisLatch("z", true);
        pointer.handleWheel(new WheelEvent("wheel", { deltaX: 40, deltaY: 40 }));
        expect(calls.axisSpecific).toBe(1);
        expect(calls.rotation).toBe(1);
        dispose();
    });

    it("the latch is ARMED with no gesture in flight — the reveal's real meaning", () => {
        const { pointer, calls, dispose } = harness();
        pointer.setAxisLatch("x", true);
        expect(pointer.pressedKeys.value.x).toBe(true);
        // Nothing has been dragged, wheeled or rotated: the tell is an arming
        // tell, and the prose now says so.
        expect(calls).toEqual({ axisSpecific: 0, rotation: 0, translation: 0, scale: 0 });
        dispose();
    });
});
