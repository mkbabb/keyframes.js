// SERVED MODEL: claude-opus-5-5
/**
 * KF-M2 · D-16 (value.js COHESION §0hm) — the Euler READOUT, Y·X·Z.
 *
 * The former Rx·Ry·Rz readout put its singularity on yaw, the commonest drag:
 * a horizontal spin folded y at ±81° and flipped x and z by 180°. Born RED: at
 * the pre-cure bytes `eulerDegreesToQuaternion(out, x, y, z)` is Rx·Ry·Rz and
 * `quaternionToEulerDegrees` takes no previous reading.
 */
import { describe, expect, it } from "vitest";
import {
    eulerDegreesToQuaternion,
    foldEulerDegrees,
    quaternionToEulerDegrees,
    type EulerDegrees,
} from "../../../demo/scenes/cube/orbital-drag/quaternionEuler";
import {
    quatCanonical,
    quatDot,
    quatFromAxisAngle,
    quatMultiply,
    type Quat,
} from "../../../demo/scenes/cube/orbital-drag/arcball";

const DEG = Math.PI / 180;

const rng = (seed: number) => () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const maxStep = (a: EulerDegrees, b: EulerDegrees) =>
    Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y), Math.abs(a.z - b.z));

describe("the Y·X·Z builder", () => {
    it("is q_y · q_x · q_z", () => {
        const q = eulerDegreesToQuaternion(30, 40, 50);
        const ref = quatMultiply(
            quatMultiply(quatFromAxisAngle([0, 1, 0], 40 * DEG), quatFromAxisAngle([1, 0, 0], 30 * DEG)),
            quatFromAxisAngle([0, 0, 1], 50 * DEG),
        );
        expect(Math.abs(quatDot(q, ref))).toBeCloseTo(1, 14);
    });
});

describe("G2.2 READOUT — round trip, poles and continuity", () => {
    it("eulerToQuat(readout(q)) ≡ ±q for 1e4 random q, poles included (|dot| ≥ 1 − 1e-12)", () => {
        const rand = rng(5);
        let worst = 1;
        for (let i = 0; i < 1e4; i++) {
            let q: Quat;
            if (i % 10 === 0) {
                // An exact pole: X = ±90°.
                q = eulerDegreesToQuaternion(i % 20 === 0 ? 90 : -90, (rand() - 0.5) * 720, (rand() - 0.5) * 720);
            } else {
                q = quatCanonical([rand() - 0.5, rand() - 0.5, rand() - 0.5, rand() - 0.5]);
            }
            const prev = { x: (rand() - 0.5) * 360, y: (rand() - 0.5) * 360, z: (rand() - 0.5) * 360 };
            const e = quaternionToEulerDegrees(q, prev);
            worst = Math.min(worst, Math.abs(quatDot(eulerDegreesToQuaternion(e.x, e.y, e.z), q)));
        }
        expect(worst).toBeGreaterThanOrEqual(1 - 1e-12);
    });

    it("a pure pitch 0 → 120° → 0 in 0.5° steps crosses the pole with no step > 2°", () => {
        let prev = { x: 0, y: 0, z: 0 };
        let worst = 0;
        const path = [
            ...Array.from({ length: 241 }, (_, i) => i * 0.5),
            ...Array.from({ length: 241 }, (_, i) => 120 - i * 0.5),
        ];
        for (const deg of path) {
            const e = quaternionToEulerDegrees(quatFromAxisAngle([1, 0, 0], deg * DEG), prev);
            worst = Math.max(worst, maxStep(e, prev));
            prev = e;
        }
        expect(worst).toBeLessThanOrEqual(2);
        expect(prev.x).toBeCloseTo(0, 9);
        expect(prev.y).toBeCloseTo(0, 9);
        expect(prev.z).toBeCloseTo(0, 9);
    });

    it("held AT the pole for 10 frames the readout does not flicker", () => {
        const pole = eulerDegreesToQuaternion(90, 25, 10);
        let prev = { x: 89, y: 25, z: 10 };
        const first = quaternionToEulerDegrees(pole, prev);
        prev = first;
        for (let i = 0; i < 10; i++) {
            const e = quaternionToEulerDegrees(pole, prev);
            expect(maxStep(e, first)).toBeLessThan(1e-9);
            prev = e;
        }
        expect(first.x).toBeCloseTo(90, 9);
        expect(first.z).toBeCloseTo(10, 9);
    });

    it("D-16 — a yaw loop 0 → 720° keeps Y monotone, max step ≤ 1.2°, no 360° jump", () => {
        let prev = { x: 0, y: 0, z: 0 };
        for (let i = 1; i <= 720; i++) {
            const e = quaternionToEulerDegrees(quatFromAxisAngle([0, 1, 0], i * DEG), prev);
            expect(e.y).toBeGreaterThan(prev.y);
            expect(maxStep(e, prev)).toBeLessThanOrEqual(1.2);
            prev = e;
        }
        expect(prev.y).toBeCloseTo(720, 6);
        expect(prev.x).toBeCloseTo(0, 9);
        expect(prev.z).toBeCloseTo(0, 9);
    });

    it("the rest-time fold brings an unwrapped reading back inside one turn, same rotation", () => {
        const e = { x: 10, y: 730, z: -400 };
        const f = foldEulerDegrees(e);
        expect(f).toEqual({ x: 10, y: 10, z: -40 });
        expect(
            Math.abs(quatDot(eulerDegreesToQuaternion(e.x, e.y, e.z), eulerDegreesToQuaternion(f.x, f.y, f.z))),
        ).toBeCloseTo(1, 12);
    });

    it("G2.8 — a slider write reads back within 1e-9° away from the pole", () => {
        const rand = rng(9);
        for (let i = 0; i < 1000; i++) {
            const e = { x: (rand() - 0.5) * 170, y: (rand() - 0.5) * 340, z: (rand() - 0.5) * 340 };
            const r = quaternionToEulerDegrees(eulerDegreesToQuaternion(e.x, e.y, e.z), e);
            expect(Math.abs(r.x - e.x)).toBeLessThan(1e-9);
            expect(Math.abs(r.y - e.y)).toBeLessThan(1e-9);
            expect(Math.abs(r.z - e.z)).toBeLessThan(1e-9);
        }
    });
});
