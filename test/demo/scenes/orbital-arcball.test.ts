// SERVED MODEL: claude-opus-5-5
/**
 * KF-M2 (value.js COHESION §0hm) — the orbit's rotation math, pure.
 *
 * G2.0 sign · G2.1 closed-loop drift and renormalisation · G2.2 no flip at
 * ±90° pitch (the matrix path) · G2.6 the face tracks the finger (R = 2h) ·
 * G2.7 screen-frame axes and pan · the axis latch. The readout's own gates are
 * in orbital-euler-yxz.test.ts. Born RED: `arcball.ts` and `attitudeQuat` do
 * not exist at the pre-cure bytes.
 */
import { describe, expect, it } from "vitest";
import {
    applyScreenDelta,
    conjugateByAttitude,
    constrainToAxis,
    cross3,
    norm3,
    quatAngleBetween,
    quatCanonical,
    quatConjugate,
    quatFromAxisAngle,
    quatMultiply,
    quatToAxisAngle,
    rotateVec,
    shoemakeArc,
    sphereMap,
    type Quat,
    type Vec3,
} from "../../../demo/scenes/cube/orbital-drag/arcball";
import { attitudeQuat, rotateByAttitude, GRAPH_ATTITUDE } from "../../../demo/scenes/cube/graphAttitude";

const G = attitudeQuat();
const ID: Quat = [0, 0, 0, 1];

/** A seeded PRNG (mulberry32), so the random gates are reproducible. */
const rng = (seed: number) => () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/** The anchored arcball, as the reader applies it: Q = conj(q(v₀, vₙ))·Q₀. */
const orbitTo = (Q0: Quat, p: [number, number], R: number) =>
    applyScreenDelta(Q0, shoemakeArc(sphereMap(0, 0), sphereMap(p[0] / R, p[1] / R)), G);

/** The world attitude's screen-frame delta from Q0 to Q (G·Q·Q0⁻¹·G⁻¹). */
const screenDelta = (Q0: Quat, Q: Quat) =>
    quatMultiply(quatMultiply(G, quatMultiply(Q, quatConjugate(Q0))), quatConjugate(G));

/** Row-major 3×3 of a unit quaternion. */
const matrixOf = (q: Quat) => {
    const [x, y, z, w] = q;
    return [
        1 - 2 * (y * y + z * z), 2 * (x * y - w * z), 2 * (x * z + w * y),
        2 * (x * y + w * z), 1 - 2 * (x * x + z * z), 2 * (y * z - w * x),
        2 * (x * z - w * y), 2 * (y * z + w * x), 1 - 2 * (x * x + y * y),
    ];
};

describe("attitudeQuat — G single-sourced from GRAPH_ATTITUDE", () => {
    it("rotates a vector exactly as the Rodrigues form does", () => {
        for (const v of [[1, 0, 0], [0, 1, 0], [0, 0, 1], [0.3, -0.7, 0.2]] as Vec3[]) {
            const a = rotateVec(G, v);
            const b = rotateByAttitude(v, GRAPH_ATTITUDE);
            for (let i = 0; i < 3; i++) expect(a[i]).toBeCloseTo(b[i]!, 12);
        }
    });
});

describe("G2.0 SIGN — the drag turns the die the way the hand goes", () => {
    it("a rightward drag from the centre turns about screen +y; a downward one about −x", () => {
        const right = quatToAxisAngle(screenDelta(ID, orbitTo(ID, [20, 0], 200)));
        expect(right.axis[1]).toBeCloseTo(1, 9);
        expect(right.angle).toBeGreaterThan(0);
        const down = quatToAxisAngle(screenDelta(ID, orbitTo(ID, [0, 20], 200)));
        expect(down.axis[0]).toBeCloseTo(-1, 9);
        expect(down.angle).toBeGreaterThan(0);
    });

    it("the front face moves WITH the finger (a point at +z goes right, then down)", () => {
        const front: Vec3 = [0, 0, 1];
        const r = rotateVec(screenDelta(ID, orbitTo(ID, [20, 0], 200)), front);
        expect(r[0]).toBeGreaterThan(0);
        const d = rotateVec(screenDelta(ID, orbitTo(ID, [0, 20], 200)), front);
        expect(d[1]).toBeGreaterThan(0);
    });

    it("a clockwise on-screen roll (screen +z, y down) turns the die clockwise", () => {
        const roll = applyScreenDelta(ID, quatFromAxisAngle([0, 0, 1], 0.5), G);
        const r = rotateVec(screenDelta(ID, roll), [1, 0, 0]);
        // x → +y is clockwise on a y-down screen.
        expect(r[1]).toBeGreaterThan(0);
        expect(r[2]).toBeCloseTo(0, 12);
    });
});

describe("G2.1 CLOSED-LOOP DRIFT — endpoint-only, so a closed path returns exactly", () => {
    it("1000 random closed 200-step paths (rim excursions included) return within 1e-12 rad", () => {
        const rand = rng(7);
        const R = 150;
        let worst = 0;
        for (let n = 0; n < 1000; n++) {
            const Q0 = quatCanonical([rand() - 0.5, rand() - 0.5, rand() - 0.5, rand() - 0.5]);
            const start: [number, number] = [(rand() - 0.5) * 2 * R, (rand() - 0.5) * 2 * R];
            const v0 = sphereMap(start[0] / R, start[1] / R);
            let Q = Q0;
            for (let i = 1; i < 200; i++) {
                // Excursions out to 2R ride the rim.
                const p: [number, number] = [(rand() - 0.5) * 4 * R, (rand() - 0.5) * 4 * R];
                Q = applyScreenDelta(Q0, shoemakeArc(v0, sphereMap(p[0] / R, p[1] / R)), G);
            }
            Q = applyScreenDelta(Q0, shoemakeArc(v0, sphereMap(start[0] / R, start[1] / R)), G);
            worst = Math.max(worst, quatAngleBetween(Q, Q0));
        }
        expect(worst).toBeLessThan(1e-12);
    });

    it("incremental composition of a closed path holds within 1e-9 rad", () => {
        const rand = rng(11);
        const R = 150;
        let Q: Quat = ID;
        const pts: [number, number][] = [];
        for (let i = 0; i < 200; i++) pts.push([(rand() - 0.5) * 2 * R, (rand() - 0.5) * 2 * R]);
        pts.push(pts[0]!);
        for (let i = 1; i < pts.length; i++) {
            const a = sphereMap(pts[i - 1]![0] / R, pts[i - 1]![1] / R);
            const b = sphereMap(pts[i]![0] / R, pts[i]![1] / R);
            Q = applyScreenDelta(Q, shoemakeArc(a, b), G);
        }
        // An incremental arc path is NOT closed in rotation (the arcball is
        // path-dependent); its reverse undoes it. Walk it back.
        for (let i = pts.length - 1; i >= 1; i--) {
            const a = sphereMap(pts[i]![0] / R, pts[i]![1] / R);
            const b = sphereMap(pts[i - 1]![0] / R, pts[i - 1]![1] / R);
            Q = applyScreenDelta(Q, shoemakeArc(a, b), G);
        }
        expect(quatAngleBetween(Q, ID)).toBeLessThan(1e-9);
    });

    it("after 1e6 composes the attitude stays unit to 1e-12", () => {
        const rand = rng(3);
        let Q: Quat = ID;
        for (let i = 0; i < 1e6; i++) {
            Q = applyScreenDelta(Q, quatFromAxisAngle([rand() - 0.5, rand() - 0.5, rand() - 0.5], 0.01), G);
        }
        expect(Math.abs(Math.hypot(...Q) - 1)).toBeLessThan(1e-12);
        expect(Q[3]).toBeGreaterThanOrEqual(0);
    });
});

describe("G2.2 NO FLIP AT ±90° PITCH — the matrix path is smooth", () => {
    it("a vertical 1 px drag through pitch 0 → 120° → 0 has no step ≥ 10× the median", () => {
        const h = 100;
        const R = 2 * h;
        // Re-anchor each R px of travel (a long drag is many anchors' worth).
        let Q: Quat = ID;
        const Ms: number[][] = [matrixOf(Q)];
        const steps = Math.round(((120 * Math.PI) / 180) * h);
        const walk = (dir: 1 | -1) => {
            for (let i = 0; i < steps; i++) {
                Q = applyScreenDelta(Q, shoemakeArc(sphereMap(0, 0), sphereMap(0, dir / R)), G);
                Ms.push(matrixOf(Q));
            }
        };
        walk(1);
        walk(-1);
        const d = Ms.slice(1).map((m, i) => Math.hypot(...m.map((v, j) => v - Ms[i]![j]!)));
        const sorted = [...d].sort((a, b) => a - b);
        const median = sorted[Math.floor(sorted.length / 2)]!;
        expect(Math.max(...d)).toBeLessThanOrEqual(2 * (1 / h) * 1.05);
        expect(Math.max(...d)).toBeLessThan(10 * median);
        expect(quatAngleBetween(Q, ID)).toBeLessThan(1e-9);
    });
});

describe("G2.6 FACE TRACKS FINGER — R = 2h makes the front face move 1:1", () => {
    it("a 40 px drag from the centre moves the front-face centre 40 ± 6 px", () => {
        for (const h of [80, 110, 144]) {
            const R = 2 * h;
            for (const [dx, dy] of [[40, 0], [0, 40], [28.28, 28.28]] as const) {
                const q = screenDelta(ID, orbitTo(ID, [dx, dy], R));
                const f = rotateVec(q, [0, 0, h]);
                const moved = Math.hypot(f[0], f[1]);
                expect(moved).toBeGreaterThan(34);
                expect(moved).toBeLessThan(46);
                // …in the drag's direction.
                expect((f[0] * dx + f[1] * dy) / (moved * 40)).toBeGreaterThan(0.999);
            }
        }
    });

    it("centre → rim is a half turn (the double-angle arc)", () => {
        const q = shoemakeArc(sphereMap(0, 0), sphereMap(1, 0));
        expect(quatToAxisAngle(q).angle).toBeCloseTo(Math.PI, 12);
    });
});

describe("G2.7 SCREEN-FRAME AXES AND PAN", () => {
    it("at G, a horizontal drag's screen axis is pure ±y (|x|, |z| < 1e-9)", () => {
        const a = quatToAxisAngle(screenDelta(ID, orbitTo(ID, [37, 0], 180))).axis;
        expect(Math.abs(a[0])).toBeLessThan(1e-9);
        expect(Math.abs(a[2])).toBeLessThan(1e-9);
    });

    it("translate3d(G⁻¹·t) displaces the subject by exactly t on screen (Δz < 1e-9)", () => {
        const t: Vec3 = [100, -42, 0];
        const local = rotateVec(quatConjugate(G), t);
        const screen = rotateVec(G, local);
        expect(screen[0]).toBeCloseTo(100, 9);
        expect(screen[1]).toBeCloseTo(-42, 9);
        expect(Math.abs(screen[2])).toBeLessThan(1e-9);
    });

    it("conj(q) keeps the angle and turns the axis by G⁻¹", () => {
        const qs = quatFromAxisAngle([0, 1, 0], 0.7);
        const c = quatToAxisAngle(conjugateByAttitude(qs, G));
        expect(c.angle).toBeCloseTo(0.7, 12);
        const expected = rotateVec(quatConjugate(G), [0, 1, 0]);
        for (let i = 0; i < 3; i++) expect(c.axis[i]).toBeCloseTo(expected[i]!, 12);
    });
});

describe("the axis latch — X/Y/Z held turns about the latched axis only", () => {
    it("a diagonal drag with Y latched turns about a_s = G·ŷ", () => {
        const as = rotateVec(G, [0, 1, 0]);
        const R = 150;
        const a = constrainToAxis(sphereMap(10 / R, 5 / R), as)!;
        const b = constrainToAxis(sphereMap(70 / R, 60 / R), as)!;
        const q = shoemakeArc(a, b);
        const axis = quatToAxisAngle(q).axis;
        expect(norm3(cross3(axis, as))).toBeLessThan(1e-12);
        // …and in the container's frame that is the local Y axis itself.
        const local = quatToAxisAngle(conjugateByAttitude(q, G)).axis;
        expect(Math.abs(local[1])).toBeCloseTo(1, 12);
    });

    it("a point on the latched axis has no projection (the caller keeps the last)", () => {
        expect(constrainToAxis([0, 1, 0], [0, 1, 0])).toBeNull();
    });
});
