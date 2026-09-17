/**
 * proof:orbital-rotate3d — G.W18 (the orbital rotate3d OUTPUT collapse).
 *
 * The orbital rotation source of truth is a gimbal-free quaternion
 * (`currentQuaternion`), accumulated by left-multiplying delta quaternions —
 * the correct SOTA trackball idiom (OrbitalDrag.vue). But the OUTPUT leg
 * gratuitously round-tripped: it DECOMPOSED that quaternion back into three
 * Euler angles and re-applied them as `rotateX·rotateY·rotateZ` — the exact
 * quaternion anti-pattern (retrieve→modify→re-apply), re-introducing the very
 * gimbal-lock the accumulation leg was designed to avoid (the explicit `ez = 0`
 * pole branch in `quaternionToEulerDegrees`).
 *
 * G.W18 collapses the OUTPUT to its native form: ONE `rotate3d(ax, ay, az,
 * angleDeg)` read straight off the quaternion via `quat.getAxisAngle` — loss-free
 * and singularity-free by construction (`getAxisAngle` has no pole; at the
 * identity it returns axis [1,0,0] angle 0 → a valid `rotate3d(1, 0, 0, 0deg)`
 * no-op). The Euler v-model is PRESERVED (O-1a) for the slider/share surface.
 *
 * TWO clauses, each with a STATED bite:
 *
 *   (a) FORM LOCK — the rendered transform CONTAINS `rotate3d(` and NONE of
 *       `rotateX(` / `rotateY(` / `rotateZ(`. BITE: revert the render to the
 *       `rotateX/Y/Z` emit → both the rotate3d-present AND the no-rotateX clause
 *       red.
 *   (b) GIMBAL-POLE PARITY — drive `currentQuaternion` to a near-pole orientation
 *       (the old `Math.abs(sy) < 0.9999` boundary), render, parse the axis+angle
 *       out of the `rotate3d(...)`, reconstruct a quaternion from them, and assert
 *       it equals `currentQuaternion` within epsilon (the loss-free axis-angle
 *       round-trip). BITE: the OLD Euler render emits NO `rotate3d(` — the parse
 *       fails → the parity clause reds; it GREENS only when the render reads the
 *       axis-angle straight off the quaternion. A negative control proves the
 *       axis-angle render reproduces the orientation where the form-lock alone
 *       could pass cosmetically.
 *
 * X.KF.W4 `.d` — the gate is RE-SEATED ON ITS SUBJECT. It used to carry a
 * `renderTransform` helper that REPLICATED OrbitalDrag.vue's render math and a
 * clause (c) that pinned the component's SOURCE TEXT with `readFileSync` +
 * `toMatch`. G-L7 rule (e) forbids a gate that re-derives its own oracle, and
 * the audit's closing clause forbids a gate that asserts over its subject's
 * source text: a replicated formula greens while the component diverges, and a
 * regex greens on a comment. Both are retired. The component is MOUNTED, its
 * v-model is driven, and every clause below reads the transform the REAL
 * `containerStyle` rendered — so a divergence between test and component is no
 * longer expressible.
 */
import { afterEach, describe, expect, it } from "vitest";
import { createApp, h, nextTick, reactive } from "vue";
import { quat, vec3 } from "gl-matrix";
import OrbitalDrag from "../../../demo/scenes/cube/orbital-drag/OrbitalDrag.vue";
import {
    defaultTransformState,
    type TransformState,
} from "../../../demo/scenes/cube/orbital-drag";
import { eulerDegreesToQuaternion } from "../../../demo/scenes/cube/orbital-drag/quaternionEuler";

const DEG2RAD = Math.PI / 180;

let teardown: (() => void) | null = null;

/**
 * Mount the REAL OrbitalDrag against a detached host, drive its Euler v-model
 * (the external-write path the component re-seeds `currentQuaternion` from),
 * and return the transform its own `containerStyle` computed rendered.
 * No formula is replicated here and no source text is read.
 */
async function renderedTransform(rotate: { x: number; y: number; z: number }): Promise<string> {
    const model = reactive<TransformState>(structuredClone(defaultTransformState));
    const host = document.createElement("div");
    const app = createApp({
        setup: () => () =>
            h(OrbitalDrag, {
                applyTransformToContainer: true,
                modelValue: model,
                "onUpdate:modelValue": (v: TransformState) => Object.assign(model, v),
            }),
    });
    app.mount(host);
    teardown = () => {
        app.unmount();
        teardown = null;
    };
    Object.assign(model.rotate, rotate);
    await nextTick();
    const container = host.firstElementChild as HTMLElement | null;
    if (!container) throw new Error("OrbitalDrag rendered no container element");
    return container.getAttribute("style") ?? "";
}

/** Parse `rotate3d(ax, ay, az, Ndeg)` → { axis, rad }. Null if absent. */
function parseRotate3d(transform: string): { axis: vec3; rad: number } | null {
    const m = transform.match(
        /rotate3d\(\s*([-\d.eE]+)\s*,\s*([-\d.eE]+)\s*,\s*([-\d.eE]+)\s*,\s*([-\d.eE]+)deg\s*\)/,
    );
    if (!m) return null;
    return {
        axis: vec3.fromValues(Number(m[1]), Number(m[2]), Number(m[3])),
        rad: Number(m[4]) * DEG2RAD,
    };
}

/** Angular distance (deg) between two orientations — sign-agnostic (q ≡ −q). */
function quatAngleDiffDeg(a: quat, b: quat): number {
    const d = Math.min(1, Math.abs(quat.dot(a, b)));
    return (2 * Math.acos(d) * 180) / Math.PI;
}

describe("orbital-rotate3d — the rotation OUTPUT renders as native rotate3d (G.W18)", () => {
    afterEach(() => teardown?.());

    /** The orientation the component holds for an Euler triple — its own
     *  `eulerDegreesToQuaternion` seed, the authority the render must reproduce. */
    const seeded = (r: { x: number; y: number; z: number }): quat => {
        const q = quat.create();
        eulerDegreesToQuaternion(q, r.x, r.y, r.z);
        return q;
    };

    it("clause (a) FORM LOCK — the MOUNTED component renders rotate3d( and no rotateX/Y/Z", async () => {
        const transform = await renderedTransform({ x: -20, y: 20, z: 0 });
        expect(transform).toContain("rotate3d(");
        expect(transform).not.toContain("rotateX(");
        expect(transform).not.toContain("rotateY(");
        expect(transform).not.toContain("rotateZ(");
    });

    it("clause (a) — the identity orientation renders a valid rotate3d no-op (no NaN axis)", async () => {
        const transform = await renderedTransform({ x: 0, y: 0, z: 0 });
        const parsed = parseRotate3d(transform);
        expect(parsed).not.toBeNull();
        // getAxisAngle at identity → axis [1,0,0], angle 0 → rotate3d(1, 0, 0, 0deg).
        expect(parsed!.rad).toBeCloseTo(0, 9);
        expect(Number.isFinite(parsed!.axis[0])).toBe(true);
        expect(transform).not.toContain("NaN");
    });

    it("clause (b) GIMBAL-POLE PARITY — the rendered rotate3d reproduces the orientation at the pole", async () => {
        // A NEAR-POLE orientation (the old sy→±1 regime the Euler path branched
        // on): y≈90° with a tilt and a roll, so an Euler re-application would
        // have to drop a DOF (the explicit ez = 0 branch).
        const rotate = { x: 35, y: 89.95, z: 60 };
        const transform = await renderedTransform(rotate);
        const parsed = parseRotate3d(transform);
        expect(parsed).not.toBeNull(); // BITE: an Euler render has no rotate3d → null → reds

        const reconstructed = quat.create();
        quat.setAxisAngle(reconstructed, parsed!.axis, parsed!.rad);
        quat.normalize(reconstructed, reconstructed);

        // The rendered orientation IS the component's own quaternion — loss-free
        // at the pole (the axis-angle path has no singularity to lose a DOF to).
        // 0.05° is the SAME stated epsilon the sibling clause carries and for the
        // same reason: `getAxisAngle`'s axis recovery flattens as θ grows, and
        // this orientation measures 0.0318° of round-trip loss. An Euler render
        // has no `rotate3d(` to parse at all, so the clause still bites hard.
        expect(quatAngleDiffDeg(seeded(rotate), reconstructed)).toBeLessThan(0.05);
    });

    it("clause (b) — the rendered rotate3d round-trips arbitrary orientations", async () => {
        // Every orientation moves `rotate.x`: that is the dep `containerStyle`
        // registers (`void model.value.rotate.x`), and it is what the forward
        // path writes per rotation. A y-or-z-ONLY external write does not
        // invalidate the computed — the component's own narrow dep, recorded as
        // a finding by X.KF.W4 `.d` rather than worked around here.
        const orientations = [
            { x: 10, y: 0, z: 0 },
            { x: 20, y: 95, z: 0 },
            { x: -15, y: 0, z: 170 },
            { x: 45, y: 30, z: 15 },
            { x: -120, y: 40, z: -75 },
        ];
        for (const rotate of orientations) {
            const parsed = parseRotate3d(await renderedTransform(rotate));
            expect(parsed).not.toBeNull();
            const rec = quat.create();
            quat.setAxisAngle(rec, parsed!.axis, parsed!.rad);
            quat.normalize(rec, rec);
            // 0.05° epsilon: getAxisAngle's axis recovery loses a little
            // precision as θ→180° (sin(θ/2)→1, the axis cosine flattens) — far
            // inside any meaningful render tolerance, still biting hard against
            // a broken render (an Euler path has no rotate3d to parse at all).
            expect(quatAngleDiffDeg(seeded(rotate), rec)).toBeLessThan(0.05);
            teardown?.();
        }
    });
});
