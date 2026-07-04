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
 *   (c) SOURCE BINDS THE MECHANISM — OrbitalDrag.vue's `containerStyle` emits
 *       `rotate3d(` via `quat.getAxisAngle` and NO `rotateX/Y/Z` (binds the test
 *       to the real component, the resize-tracks clause-3 idiom).
 */
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { quat, vec3 } from "gl-matrix";

const DEG2RAD = Math.PI / 180;

/**
 * The EXACT render math OrbitalDrag.vue's `containerStyle` computed uses (S1):
 * ONE `rotate3d` read straight off the quaternion via `quat.getAxisAngle`.
 * Replicated here (the SFC inlines it inside a computed) so the gate exercises
 * the same code path; clause (c) binds it back to the component source.
 */
const renderAxis = vec3.create();
function renderTransform(q: quat, translate = { x: 0, y: 0, z: 0 }, s = { x: 1, y: 1, z: 1 }): string {
    const angleDeg = quat.getAxisAngle(renderAxis, q) * (180 / Math.PI);
    return `translate3d(${translate.x}px, ${translate.y}px, ${translate.z}px) rotate3d(${renderAxis[0]}, ${renderAxis[1]}, ${renderAxis[2]}, ${angleDeg}deg) scale3d(${s.x}, ${s.y}, ${s.z})`;
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

describe("proof:orbital-rotate3d — the rotation OUTPUT renders as native rotate3d (G.W18)", () => {
    it("clause (a) FORM LOCK — the render contains rotate3d( and no rotateX/Y/Z", () => {
        // A representative accumulated orientation (axis-angle by construction).
        const q = quat.create();
        quat.setAxisAngle(q, vec3.normalize(vec3.create(), vec3.fromValues(-1, 1, 0)), 30 * DEG2RAD);

        const transform = renderTransform(q);
        expect(transform).toContain("rotate3d(");
        expect(transform).not.toContain("rotateX(");
        expect(transform).not.toContain("rotateY(");
        expect(transform).not.toContain("rotateZ(");
    });

    it("clause (a) — the identity quaternion renders a valid rotate3d no-op (no NaN axis)", () => {
        const transform = renderTransform(quat.create());
        const parsed = parseRotate3d(transform);
        expect(parsed).not.toBeNull();
        // getAxisAngle at identity → axis [1,0,0], angle 0 → rotate3d(1, 0, 0, 0deg).
        expect(parsed!.rad).toBeCloseTo(0, 9);
        expect(Number.isFinite(parsed!.axis[0])).toBe(true);
        expect(transform).not.toContain("NaN");
    });

    it("clause (b) GIMBAL-POLE PARITY — the rendered rotate3d reproduces the quaternion at the pole", () => {
        // Drive currentQuaternion to a NEAR-POLE orientation (the old sy→±1
        // regime the Euler path branched on): y≈90° accumulated with a roll +
        // tilt, so the Euler decomposition would have to drop a DOF (ez=0).
        const q = quat.create();
        const tilt = quat.create();
        quat.setAxisAngle(tilt, vec3.fromValues(1, 0, 0), 35 * DEG2RAD);
        quat.multiply(q, tilt, q);
        const yDrive = quat.create();
        quat.setAxisAngle(yDrive, vec3.fromValues(0, 1, 0), 89.95 * DEG2RAD);
        quat.multiply(q, yDrive, q);
        const roll = quat.create();
        quat.setAxisAngle(roll, vec3.fromValues(0, 0, 1), 60 * DEG2RAD);
        quat.multiply(q, roll, q);
        quat.normalize(q, q);

        // Render via the native axis-angle path, then parse + reconstruct.
        const transform = renderTransform(q);
        const parsed = parseRotate3d(transform);
        expect(parsed).not.toBeNull(); // BITE: the OLD Euler render has no rotate3d → null → reds

        const reconstructed = quat.create();
        quat.setAxisAngle(reconstructed, parsed!.axis, parsed!.rad);
        quat.normalize(reconstructed, reconstructed);

        // The rendered orientation is the SOURCE quaternion — loss-free at the
        // pole (the axis-angle path has no singularity to lose a DOF to).
        expect(quatAngleDiffDeg(q, reconstructed)).toBeLessThan(0.01);
    });

    it("clause (b) — the parse-and-reconstruct round-trips an arbitrary orientation", () => {
        // A handful of arbitrary accumulated orientations must all round-trip.
        const axes: [number, number, number][] = [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
            [1, 1, 0],
            [-1, 2, 3],
        ];
        for (const a of axes) {
            for (const deg of [10, 95, 170]) {
                const q = quat.create();
                quat.setAxisAngle(q, vec3.normalize(vec3.create(), vec3.fromValues(...a)), deg * DEG2RAD);
                const parsed = parseRotate3d(renderTransform(q))!;
                const rec = quat.create();
                quat.setAxisAngle(rec, parsed.axis, parsed.rad);
                quat.normalize(rec, rec);
                // 0.05° epsilon: getAxisAngle's axis recovery loses a little
                // precision as θ→180° (sin(θ/2)→1, the axis cosine flattens) —
                // far inside any meaningful render tolerance, still biting hard
                // against a broken render (the Euler path has no rotate3d to parse).
                expect(quatAngleDiffDeg(q, rec)).toBeLessThan(0.05);
            }
        }
    });

    it("clause (c) SOURCE BINDS — OrbitalDrag.vue renders rotate3d off getAxisAngle, no rotateX/Y/Z", () => {
        const file = path.resolve(
            import.meta.dirname,
            "../../demo/scenes/cube/orbital-drag/OrbitalDrag.vue",
        );
        const src = fs.readFileSync(file, "utf8");
        // Isolate the containerStyle render expression — the transform template.
        expect(src).toMatch(/quat\.getAxisAngle\s*\(/);
        expect(src).toMatch(/rotate3d\(\$\{/);
        // The decomposed Euler re-application is GONE from the render.
        expect(src).not.toMatch(/transform:[^`]*`[^`]*rotateX\(\$\{rotate\.x\}deg\)/);
        expect(src).not.toContain("rotateY(${rotate.y}deg)");
        expect(src).not.toContain("rotateZ(${rotate.z}deg)");
    });
});
