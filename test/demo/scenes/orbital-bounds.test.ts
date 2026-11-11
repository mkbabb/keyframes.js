import { describe, expect, it } from "vitest";
import {
    BAND,
    PAN_OUT,
    axisMotion,
    band,
    banded,
    panInterval,
    sampleAxis,
    springBack,
    unband,
    unbanded,
} from "../../../demo/scenes/cube/orbital-drag/bounds";
import { COAST_REST_FRACTION } from "../../../demo/scenes/cube/orbital-drag/composables/inertiaDecay";

/**
 * The orbit's bounds (owner 2026-11-11: "you should not be able to pan off
 * screen so far ... if you throw the cube out of bounds, it springs back
 * smoothly"): the PAN_OUT interval, the rubber band, and the critically damped
 * return at the coast's k, all closed forms in elapsed time.
 */
const K = 9;

describe("the pan interval", () => {
    it("lets no more than PAN_OUT of the die leave the stage on a side", () => {
        const iv = panInterval(0, 1000, 200);
        expect(iv.lo).toBeCloseTo((0.5 - PAN_OUT) * 200, 12);
        expect(iv.hi).toBeCloseTo(1000 - (0.5 - PAN_OUT) * 200, 12);
        // At the bound, a quarter of the die is past the edge.
        expect((iv.hi + 100 - 1000) / 200).toBeCloseTo(PAN_OUT, 12);
    });

    it("swaps its ends for a die wider than the stage, so it can still be moved while it covers it", () => {
        const iv = panInterval(0, 100, 400);
        expect(iv.lo).toBeLessThan(iv.hi);
        expect(iv).toEqual({ lo: 100 - 100, hi: 0 + 100 });
    });
});

describe("the rubber band", () => {
    it("starts at BAND's slope, stays under its reach, and is inverted exactly", () => {
        const d = 900;
        expect(band(1e-6, d) / 1e-6).toBeCloseTo(BAND, 6);
        for (const o of [1, 10, 100, 1000, 1e5]) {
            expect(band(o, d)).toBeLessThan(d);
            expect(unband(band(o, d), d)).toBeCloseTo(o, 6);
        }
        const iv = { lo: 100, hi: 800 };
        for (const x of [-500, 50, 100, 400, 800, 900, 3000]) expect(unbanded(banded(x, iv, d), iv, d)).toBeCloseTo(x, 6);
        expect(banded(400, iv, d)).toBe(400);
    });
});

describe("the spring back", () => {
    it("from the bound at v0 peaks v0/(k·e) past it at t = 1/k and returns without crossing", () => {
        const v0 = 600;
        const peak = springBack(0, v0, K, 1 / K);
        expect(peak.x).toBeCloseTo(v0 / (K * Math.E), 9);
        expect(peak.x).toBeCloseTo(24.5, 1);
        expect(Math.abs(peak.v)).toBeLessThan(1e-9);
        let prev = peak.x;
        for (let t = 1 / K; t < 2; t += 1 / 120) {
            const s = springBack(0, v0, K, t);
            expect(s.x).toBeLessThanOrEqual(prev + 1e-12);
            expect(s.x).toBeGreaterThanOrEqual(0);
            prev = s.x;
        }
    });

    it("let go at rest past the bound, it eases home: zero start speed, monotone, no overshoot", () => {
        const x0 = 40;
        expect(springBack(x0, 0, K, 0).v).toBe(0);
        let prev = x0;
        for (let t = 1 / 120; t < 2; t += 1 / 120) {
            const s = springBack(x0, 0, K, t);
            expect(s.x).toBeLessThan(prev);
            expect(s.x).toBeGreaterThan(0);
            prev = s.x;
        }
    });
});

describe("a let-go axis: the coast becomes the spring at its crossing", () => {
    const iv = { lo: 0, hi: 500 };
    const run = (hz: number, x0: number, v0: number) => {
        let m = axisMotion(x0, v0, iv, 0);
        const out: { t: number; x: number }[] = [];
        for (let i = 1; m && i < hz * 3; i++) {
            const t = i / hz;
            const s = sampleAxis(m, t, iv, K, COAST_REST_FRACTION);
            out.push({ t, x: s.x });
            m = s.next;
        }
        return out;
    };

    it("crosses at the closed-form time with the coast's speed, peaks, and lands exactly on the bound", () => {
        const x0 = 480;
        const v0 = 600;
        const tr = run(240, x0, v0);
        const peak = Math.max(...tr.map((p) => p.x));
        const tc = -Math.log(1 - (K * (500 - x0)) / v0) / K;
        const vc = v0 * Math.exp(-K * tc);
        expect(peak - 500).toBeCloseTo(vc / (K * Math.E), 1);
        expect(tr.at(-1)!.x).toBe(500);
    });

    it("is the same path at 30, 60 and 120 Hz (sampled at elapsed time)", () => {
        const at = (tr: { t: number; x: number }[], t: number) => tr.find((p) => Math.abs(p.t - t) < 1e-9)?.x;
        const a = run(30, 450, 900);
        const b = run(60, 450, 900);
        const c = run(120, 450, 900);
        for (const t of [1 / 30, 0.1, 0.2, 0.3, 0.5]) {
            expect(at(b, t)).toBeCloseTo(at(a, t)!, 9);
            expect(at(c, t)).toBeCloseTo(at(a, t)!, 9);
        }
        expect(a.at(-1)!.x).toBe(500);
        expect(c.at(-1)!.x).toBe(500);
    });

    it("let go past the bound with no speed, it springs straight home", () => {
        const tr = run(60, 560, 0);
        for (let i = 1; i < tr.length; i++) expect(tr[i]!.x).toBeLessThanOrEqual(tr[i - 1]!.x);
        expect(tr.at(-1)!.x).toBe(500);
    });
});
