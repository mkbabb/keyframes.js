/**
 * C1-KF-03 (critic 1 on KF-P4, the scene swap's long frames) — the Easing
 * scene's tile plots were ~40 ms of its mount, inside the swap's commit:
 * `curvePlot` spent all 48 bisection halvings on every one of the 64 grid
 * intervals, continuous or not (3,201 calls of the curve per tile).
 *
 * (1) The cost: a continuous curve's plot calls the curve at most 1,200 times
 *     (born RED at kf `9439cfb7`: 3,201), a steps staircase at most 400.
 * (2) The stroke is unchanged: for every tile the Easing scene plots, the
 *     vertices equal the full-depth bisection's (the reference below is the
 *     HEAD algorithm, verbatim).
 */
import { describe, expect, it } from "vitest";
import { curvePlot, unitEasingFrame, type CurveFn } from "../../../demo/utils/curvePlot";
import { EASING_GROUPS } from "../../../demo/utils/reference-data/easingGroups";
import { namedEasing, steppedEasing } from "../../../demo/utils/reference-data/timingCurveUtils";

const fnFor = (name: string): CurveFn =>
    name === "steps" ? steppedEasing(4, "jump-end") : namedEasing(name);
const NAMES = EASING_GROUPS.filter((g) => g.family !== "Custom").flatMap((g) => g.items.map((i) => i.name));

const counted = (fn: CurveFn) => {
    let calls = 0;
    return { fn: (t: number) => (calls++, fn(t)), calls: () => calls };
};

/** The full-depth stroke (kf `9439cfb7` `strokeVertices`, samples 64, no knots). */
const referenceVertices = (fn: CurveFn, samples = 64) => {
    const ts = [...new Set(Array.from({ length: samples + 1 }, (_, i) => i / samples))].sort((a, b) => a - b);
    const out: { t: number; v: number }[] = [{ t: ts[0]!, v: fn(ts[0]!) }];
    for (let i = 1; i < ts.length; i++) {
        let lo = ts[i - 1]!;
        let hi = ts[i]!;
        let vlo = fn(lo);
        let vhi = fn(hi);
        const a = lo;
        const b = hi;
        const vb = vhi;
        for (let k = 0; k < 48; k++) {
            const mid = (lo + hi) / 2;
            const vm = fn(mid);
            if (Math.abs(vm - vlo) >= Math.abs(vhi - vm)) {
                hi = mid;
                vhi = vm;
            } else {
                lo = mid;
                vlo = vm;
            }
        }
        if (Math.abs(vhi - vlo) > 1e-6) {
            if (lo > a) out.push({ t: lo, v: vlo });
            out.push({ t: hi, v: vhi });
            if (hi < b) out.push({ t: b, v: vb });
        } else out.push({ t: b, v: vb });
    }
    return out;
};

describe("C1-KF-03: a tile plot costs what its curve needs", () => {
    it("plots the scene's tiles", () => {
        expect(NAMES.length).toBeGreaterThan(20);
        expect(NAMES).toContain("steps");
    });

    it("(1) a continuous curve is called <= 1200 times, a staircase <= 400", () => {
        for (const name of NAMES) {
            const c = counted(fnFor(name));
            curvePlot(c.fn, unitEasingFrame());
            expect(c.calls(), name).toBeLessThanOrEqual(name === "steps" ? 400 : 1200);
        }
    });

    it("(2) every tile's stroke is the full-depth bisection's", () => {
        for (const name of NAMES) {
            const fn = fnFor(name);
            expect(curvePlot(fn, unitEasingFrame()).vertices, name).toEqual(referenceVertices(fn));
        }
    });
});
