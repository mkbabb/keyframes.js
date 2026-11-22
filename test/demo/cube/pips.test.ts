import { describe, expect, it } from "vitest";
import { DIE_FACES, PIPS, faceOf, pipPoint, type Vec3 } from "../../../demo/scenes/cube/dice/pips";
import { attitudeQuat } from "../../../demo/scenes/cube/graphAttitude";
import { rotateVec } from "../../../demo/scenes/cube/orbital-drag/arcball";

/**
 * The die (`faces="pips"`): a Western die, right-handed, resting at the
 * stage's opening attitude on the corner a die is drawn by: 1 on top, 2 on the
 * left (top-left to bottom-right), 3 on the right (top-right to bottom-left).
 */

const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
/** CSS axes (y down) to a right-handed frame (y up). */
const up = (v: Vec3): Vec3 => [v[0], -v[1], v[2]];

/** The die at rest on the stage, seen on the screen (CSS px axes: x right,
 *  y down; z toward the viewer). */
const G = attitudeQuat();
const onScreen = (p: Vec3) => rotateVec(G, [p[0], p[1], p[2]]);

describe("the die's marks", () => {
    it("are a die's: 1 to 6 pips, each value once, 21 in all", () => {
        expect(DIE_FACES.map((f) => f.value).sort()).toEqual([1, 2, 3, 4, 5, 6]);
        for (const f of DIE_FACES) expect(PIPS[f.value]).toHaveLength(f.value);
        expect(DIE_FACES.reduce((n, f) => n + PIPS[f.value].length, 0)).toBe(21);
    });

    it("opposite faces sum to seven", () => {
        for (const f of DIE_FACES) {
            const back = DIE_FACES.find((g) => dot(g.normal, f.normal) === -1)!;
            expect(f.value + back.value).toBe(7);
        }
    });

    it("each face's own axes are its CSS transform's: u × v = the outward normal (the face is seen from outside)", () => {
        for (const f of DIE_FACES) {
            // CSS axes are left-handed (y down), so u × v points INTO the
            // screen for a face seen from outside: the outward normal is −(u × v)
            // computed in CSS coordinates, +(u × v) in a right-handed frame.
            expect(cross(up(f.u), up(f.v)).map((x) => -x || 0)).toEqual(up(f.normal).map((x) => x || 0));
        }
    });

    it("is right-handed: 1, 2, 3 run counter-clockwise round the corner they share", () => {
        const [n1, n2, n3] = [1, 2, 3].map((v) => up(faceOf(v as 1 | 2 | 3).normal)) as [Vec3, Vec3, Vec3];
        // Seen from outside that corner, counter-clockwise is a positive triple product.
        expect(dot(n1, cross(n2, n3))).toBe(1);
    });

    it("rests on its drawn corner: 1 up, 2 on the left face, 3 on the right", () => {
        const at = (v: 1 | 2 | 3) => onScreen(faceOf(v).normal);
        const one = at(1);
        const two = at(2);
        const three = at(3);
        // All three face the viewer, and no other face does.
        for (const f of DIE_FACES) {
            const z = onScreen(f.normal)[2];
            if ([1, 2, 3].includes(f.value)) expect(z).toBeGreaterThan(0.2);
            else expect(z).toBeLessThan(0);
        }
        // 1 is the top (the most upward normal on screen); 2 leans left, 3 right.
        expect(one[1]).toBeLessThan(two[1]);
        expect(one[1]).toBeLessThan(three[1]);
        expect(two[0]).toBeLessThan(0);
        expect(three[0]).toBeGreaterThan(0);
    });

    it("lays the 2 top-left to bottom-right and the 3 top-right to bottom-left, as the drawn die", () => {
        const two = faceOf(2);
        const [tl, br] = PIPS[2].map((c) => onScreen(pipPoint(two, c)));
        expect(tl![0]).toBeLessThan(br![0]);
        expect(tl![1]).toBeLessThan(br![1]);
        const three = faceOf(3);
        const [tr, c, bl] = PIPS[3].map((cell) => onScreen(pipPoint(three, cell)));
        expect(tr![0]).toBeGreaterThan(bl![0]);
        expect(tr![1]).toBeLessThan(bl![1]);
        // The centre pip of the 3 is the face's centre.
        const centre = onScreen([three.normal[0] / 2, three.normal[1] / 2, three.normal[2] / 2]);
        expect(Math.hypot(c![0] - centre[0], c![1] - centre[1])).toBeLessThan(1e-12);
    });
});
