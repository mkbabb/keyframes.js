import { describe, expect, it } from "vitest";
import {
    boxContact,
    cameraFor,
    dieSide,
    faceUp,
    FIRST_LABELS,
    newDie,
    penetration,
    qAxisAngle,
    qRot,
    relabelUp,
    stepOnce,
    STEP_S,
    tableDepth,
    tableFor,
    throwDice,
    type Die,
    type Table,
} from "../../../demo/scenes/cube/dice/dicePhysics";
import { DIE_FACES, type DieValue } from "../../../demo/scenes/cube/dice/pips";

/**
 * The pair's physics, without a page: thrown thousands of times, the dice are
 * fair, finite, on the table, at rest soon, never inside each other, and they
 * finish in the middle of the table's depth.
 */

/** A seeded uniform generator (Park-Miller). */
const seeded = (seed: number) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

/** The pair laid at its opening place on a table. */
const pairOn = (tb: Table): Die[] => {
    const s = tb.side;
    const { mid } = tableDepth(tb);
    return [newDie([-0.9 * s, mid + 0.1 * s, s / 2], 2, 0.4), newDie([0.9 * s, mid - 0.15 * s, s / 2], 3, -0.5)];
};

interface Throw {
    values: [DieValue, DieValue];
    restS: number;
    finite: boolean;
    onTable: boolean;
    maxPen: number;
    restPen: number;
    ys: [number, number];
}

/** One tap throw from where the dice lie, stepped to rest (or 6 s). */
const throwOnce = (dice: Die[], tb: Table, rnd: () => number, tall: boolean): Throw => {
    throwDice(dice, tb, { rnd, tall });
    let t = 0;
    let maxPen = 0;
    let finite = true;
    let onTable = true;
    const s = tb.side;
    while (t < 6 && dice.some((d) => d.phase !== "rest")) {
        stepOnce(dice, tb, STEP_S);
        t += STEP_S;
        maxPen = Math.max(maxPen, penetration(dice[0]!, dice[1]!, s));
        for (const d of dice) {
            if (![...d.p, ...d.v, ...d.q, ...d.w].every(Number.isFinite)) finite = false;
            if (Math.abs(d.p[0]) > tb.halfX + 1e-6 || d.p[1] < -tb.farY - 1e-6 || d.p[1] > tb.nearY + 1e-6 || d.p[2] < 0) onTable = false;
        }
    }
    return {
        values: [faceUp(dice[0]!.q, dice[0]!.labels).value, faceUp(dice[1]!.q, dice[1]!.labels).value],
        restS: t,
        finite,
        onTable,
        maxPen,
        restPen: penetration(dice[0]!, dice[1]!, s),
        ys: [dice[0]!.p[1], dice[1]!.p[1]],
    };
};

const STAGES: Record<string, [number, number]> = {
    "390×844": [390, 844],
    "844×390": [844, 390],
    "1440×900": [1440, 900],
};

describe("the pair's physics", () => {
    it("sizes the die to the stage: 24 % of a phone's short side, 21 % elsewhere, 64-168 px", () => {
        expect(dieSide(390, 844)).toBeCloseTo(93.6, 6);
        expect(dieSide(844, 390)).toBeCloseTo(93.6, 6);
        expect(dieSide(1440, 900)).toBe(168);
        expect(dieSide(600, 700)).toBe(126);
        expect(dieSide(200, 200)).toBe(64);
    });

    it("finds the dice's overlap by the separating axis: face to face, corner into face, apart", () => {
        const s = 100;
        const a = { p: [0, 0, 50] as [number, number, number], q: [0, 0, 0, 1] as [number, number, number, number] };
        expect(boxContact(a, { p: [120, 0, 50], q: [0, 0, 0, 1] }, s)).toBeNull();
        const face = boxContact(a, { p: [90, 0, 50], q: [0, 0, 0, 1] }, s)!;
        expect(face.depth).toBeCloseTo(10, 9);
        expect(face.n[0]).toBeCloseTo(1, 9);
        // A cube turned 45° about z, its edge pressed into a's face: the
        // spheres the dice used to knock as (0.6 s) would read 32 px apart.
        const turned = { p: [115, 0, 50] as [number, number, number], q: qAxisAngle([0, 0, 1], Math.PI / 4) };
        const edge = boxContact(a, turned, s)!;
        expect(edge.depth).toBeCloseTo(50 + 50 * Math.SQRT2 - 115, 6);
        expect(edge.n[0]).toBeCloseTo(1, 6);
        expect(edge.at[0]).toBeCloseTo(115 - 50 * Math.SQRT2, 6);
    });

    it("relabels a die under reduced motion by a turn of its marks: the face up shows the value, opposites still sum to 7, the hand kept", () => {
        const rnd = seeded(7);
        let labels = { ...FIRST_LABELS };
        const q = qAxisAngle([1, 1, 0], 2.1);
        for (let k = 0; k < 60; k++) {
            const v = (1 + Math.floor(rnd() * 6)) as DieValue;
            labels = relabelUp(q, labels, v, rnd);
            expect(faceUp(q, labels).value).toBe(v);
            for (const f of DIE_FACES) {
                const back = DIE_FACES.find((g) => g.normal.every((x, i) => x === -f.normal[i]!))!;
                expect(labels[f.side] + labels[back.side]).toBe(7);
            }
            // 1, 2, 3 still run counter-clockwise round their corner.
            const n = (v: DieValue) => {
                const side = (Object.keys(labels) as (keyof typeof labels)[]).find((k) => labels[k] === v)!;
                const m = DIE_FACES.find((f) => f.side === side)!.normal;
                return [m[0], -m[1], m[2]] as [number, number, number];
            };
            const [a, b, c] = [n(1), n(2), n(3)];
            const triple = a[0] * (b[1] * c[2] - b[2] * c[1]) - a[1] * (b[0] * c[2] - b[2] * c[0]) + a[2] * (b[0] * c[1] - b[1] * c[0]);
            expect(triple).toBe(1);
        }
        // The die itself does not move: the attitude is the caller's, unchanged.
        expect(qRot(q, [1, 0, 0])).toEqual(qRot(qAxisAngle([1, 1, 0], 2.1), [1, 0, 0]));
    });

    it(
        "6000 throws: fair faces (chi-square, p > 0.01), finite, on the table, at rest by 2.5 s (p99), never more than 0.02 s inside each other and apart at rest",
        () => {
            const rnd = seeded(20261119);
            const counts = [0, 0, 0, 0, 0, 0];
            const rest: number[] = [];
            let worstPen = 0;
            let worstRestPen = 0;
            let bad = 0;
            // Each stage's pair is thrown again from where it came to rest, as
            // a hand throws it; a third of the throws on each stage.
            const shapes = Object.values(STAGES).map(([w, h]) => {
                const tb = tableFor(cameraFor(w, h));
                return { tb, dice: pairOn(tb), tall: h > w * 1.2 };
            });
            for (let i = 0; i < 6000; i++) {
                const { tb, dice, tall } = shapes[i % shapes.length]!;
                const r = throwOnce(dice, tb, rnd, tall);
                for (const v of r.values) counts[v - 1]!++;
                rest.push(r.restS);
                worstPen = Math.max(worstPen, r.maxPen / tb.side);
                worstRestPen = Math.max(worstRestPen, r.restPen);
                if (!r.finite || !r.onTable) bad++;
            }
            const n = counts.reduce((a, b) => a + b, 0);
            const chi = counts.reduce((a, c) => a + (c - n / 6) ** 2 / (n / 6), 0);
            rest.sort((a, b) => a - b);
            const p99 = rest[Math.floor(0.99 * rest.length)]!;
            console.info(`faces ${counts.join(" ")} χ² ${chi.toFixed(2)} · rest p50 ${rest[rest.length >> 1]!.toFixed(2)} s p99 ${p99.toFixed(2)} s · worst penetration ${(worstPen * 100).toFixed(2)} % of a side`);
            // χ² with 5 degrees of freedom: p > 0.01 below 15.086.
            expect(chi).toBeLessThan(15.086);
            expect(bad).toBe(0);
            expect(p99).toBeLessThanOrEqual(2.5);
            expect(worstPen).toBeLessThanOrEqual(0.02);
            expect(worstRestPen).toBe(0);
        },
        180_000,
    );

    for (const [name, [w, h]] of Object.entries(STAGES)) {
        it(`${name}: 200 throws come to rest in the middle 60 % of the table's depth`, () => {
            const rnd = seeded(w * 7 + h);
            const tb = tableFor(cameraFor(w, h));
            const { depth } = tableDepth(tb);
            const lo = -tb.farY + 0.2 * depth;
            const hi = tb.nearY - 0.2 * depth;
            const dice = pairOn(tb);
            let out = 0;
            const ys: number[] = [];
            for (let i = 0; i < 200; i++) {
                const r = throwOnce(dice, tb, rnd, h > w * 1.2);
                for (const y of r.ys) {
                    ys.push((y + tb.farY) / depth);
                    if (y < lo || y > hi) out++;
                }
            }
            ys.sort((a, b) => a - b);
            console.info(`${name}: depth ${depth.toFixed(0)} px, rest at ${(ys[0]! * 100).toFixed(0)}-${(ys[ys.length - 1]! * 100).toFixed(0)} % (median ${(ys[ys.length >> 1]! * 100).toFixed(0)} %), ${out} of 400 outside`);
            expect(out).toBe(0);
        }, 60_000);
    }
});
