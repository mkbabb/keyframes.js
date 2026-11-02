/**
 * KF-3 (COHESION §0he.4, atlas A2(b)) — the sampled LUT form of
 * `springTimingFunction`, for per-frame / many-mark use and for ECharts/CSS.
 * Falsifier: imported from the PUBLIC barrel; the LUT equals
 * `springTimingFunction` at every sample point within 1e-6; endpoints are 0
 * and 1; the sample count is `sampleCount + 1`; and the `linear()` serializer
 * over the LUT reproduces the LUT stop-for-stop at evenly spaced positions.
 */
import { describe, expect, it } from "vitest";
import * as kf from "../../src/animation";

const PRESETS = [
    { response: 0.5, dampingFraction: 0.45 },
    { response: 0.35, dampingFraction: 0.8 },
    { response: 0.6, dampingFraction: 1 },
    { response: 0.4, dampingFraction: 1.6 },
];

describe("springTimingLUT (KF-3)", () => {
    it("is exported from the public barrel", () => {
        expect(typeof (kf as Record<string, unknown>).springTimingLUT).toBe("function");
        expect(typeof (kf as Record<string, unknown>).linearFromSamples).toBe("function");
    });

    for (const preset of PRESETS) {
        for (const sampleCount of [8, 64, 200]) {
            it(`equals springTimingFunction at sample points (ζ=${preset.dampingFraction}, n=${sampleCount})`, () => {
                const lut = kf.springTimingLUT({ ...preset, sampleCount });
                const { fn } = kf.springTimingFunction({ ...preset, sampleCount });
                expect(lut.length).toBe(sampleCount + 1);
                expect(lut[0]).toBe(0);
                expect(lut[sampleCount]).toBe(1);
                for (let i = 0; i <= sampleCount; i++) {
                    expect(Math.abs(lut[i]! - fn(i / sampleCount))).toBeLessThan(1e-6);
                }
            });
        }
    }

    it("defaults to springTimingFunction's 64 samples and carries overshoot for ζ < 1", () => {
        const lut = kf.springTimingLUT({ response: 0.5, dampingFraction: 0.45 });
        expect(lut.length).toBe(65);
        expect(Math.max(...lut)).toBeGreaterThan(1.1);
    });

    it("serializes to a linear() whose stops are the LUT at monotone even positions", () => {
        const lut = kf.springTimingLUT({ response: 0.5, dampingFraction: 0.45, sampleCount: 16 });
        const css = kf.linearFromSamples(lut);
        expect(css.startsWith("linear(") && css.endsWith(")")).toBe(true);
        const stops = css.slice(7, -1).split(", ").map((s) => s.split(" "));
        expect(stops.length).toBe(17);
        let prevPct = -Infinity;
        stops.forEach(([v, pct], i) => {
            expect(Math.abs(Number(v) - lut[i]!)).toBeLessThanOrEqual(5e-6);
            const p = parseFloat(pct!);
            expect(p).toBeGreaterThan(prevPct);
            expect(Math.abs(p - (i / 16) * 100)).toBeLessThanOrEqual(5e-6);
            prevPct = p;
        });
        expect(stops[0]).toEqual(["0", "0%"]);
        expect(stops[16]).toEqual(["1", "100%"]);
    });
});
