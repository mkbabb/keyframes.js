// FORTY-SIXTH F — "https://keyframes.babb.dev/#/cube?q=-0.532,0.433,-0.439,0.58
// --what is the q?" The q was the die's orbit attitude (the turn a hand gave
// it) as a unit quaternion. The link now spells it `turn=x,y,z`: the orbit
// readout's own Y·X·Z triple in whole degrees (CubeScene's URL key). His link
// becomes turn=-14,87,-87 (0.6 degrees from it); whole degrees cost at most
// 1.5 degrees of attitude anywhere.

import { describe, expect, it } from "vitest";
import {
    eulerDegreesToQuaternion,
    quaternionToEulerDegrees,
} from "../../../demo/scenes/cube/orbital-drag/quaternionEuler";

type Q = [number, number, number, number];
const unit = (q: number[]): Q => {
    const n = Math.hypot(...q);
    return q.map((v) => v / n) as Q;
};
const angleBetween = (a: Q, b: Q) =>
    (2 * Math.acos(Math.min(1, Math.abs(a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]))) * 180) / Math.PI;
/** The key's spelling of an attitude: the readout, rounded. */
const spell = (q: Q) => {
    const e = quaternionToEulerDegrees(q);
    return [Math.round(e.x), Math.round(e.y), Math.round(e.z)] as const;
};

describe("FORTY-SIXTH F — the turn key", () => {
    it("his link's q is turn=-14,87,-87, within 0.6 degrees", () => {
        const his = unit([-0.532, 0.433, -0.439, 0.58]);
        expect(spell(his)).toEqual([-14, 87, -87]);
        const back = eulerDegreesToQuaternion(-14, 87, -87);
        expect(angleBetween(back, his)).toBeLessThan(0.6);
    });

    // Each of the three angles moves at most half a degree, so the attitude
    // moves at most 1.5 degrees (the bound; typically under one).
    it("whole degrees round-trip any attitude to within 1.5 degrees", () => {
        let seed = 7;
        const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
        for (let i = 0; i < 2000; i++) {
            const q = unit([rnd(), rnd(), rnd(), rnd()]);
            const [x, y, z] = spell(q);
            expect(angleBetween(eulerDegreesToQuaternion(x, y, z), q)).toBeLessThan(1.5);
        }
    });

    it("the home pose spells 0,0,0 (no key is written)", () => {
        expect(spell([0, 0, 0, 1])).toEqual([0, 0, 0]);
    });
});
