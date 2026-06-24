import { describe, expect, it } from "vitest";
import { springLinearStops } from "../src/animation/physics/spring";

/**
 * Parse the bare numeric position values out of a `linear(...)` string.
 * Treats "0" and "1" sentinel stops at the edges and returns every
 * leading number from each comma-separated entry.
 */
function parseStops(s: string): number[] {
    const m = s.match(/^linear\((.+)\)$/);
    if (!m) throw new Error(`not a linear() expression: ${s}`);
    return m[1]!.split(",").map((entry) => {
        const trimmed = entry.trim();
        const firstToken = trimmed.split(/\s+/)[0]!;
        return parseFloat(firstToken);
    });
}

describe("springLinearStops", () => {
    it("emits a linear() expression with the linear( prefix", () => {
        const s = springLinearStops({
            response: 0.5,
            dampingFraction: 0.86,
        });
        expect(s.startsWith("linear(")).toBe(true);
        expect(s.endsWith(")")).toBe(true);
    });

    it("stop count = sampleCount + 2 (implicit 0% + 100% endpoints)", () => {
        const sampleCount = 24;
        const s = springLinearStops({
            response: 0.5,
            dampingFraction: 0.86,
            sampleCount,
        });
        const stops = parseStops(s);
        expect(stops.length).toBe(sampleCount + 2);
    });

    it("honors custom sampleCount", () => {
        const s = springLinearStops({
            response: 0.5,
            dampingFraction: 1,
            sampleCount: 12,
        });
        expect(parseStops(s).length).toBe(14);
    });

    it("first stop is 0 and last stop is 1", () => {
        const s = springLinearStops({
            response: 0.5,
            dampingFraction: 0.86,
        });
        const stops = parseStops(s);
        expect(stops[0]).toBe(0);
        expect(stops[stops.length - 1]).toBe(1);
    });

    it("monotone for ζ ≥ 1 (critically damped, no overshoot)", () => {
        const s = springLinearStops({
            response: 0.5,
            dampingFraction: 1,
            sampleCount: 32,
        });
        const stops = parseStops(s);
        for (let i = 1; i < stops.length; i++) {
            // Allow tiny analytic-epsilon dips below the previous value.
            expect(stops[i]!).toBeGreaterThanOrEqual(stops[i - 1]! - 1e-6);
        }
    });

    it("monotone for ζ > 1 (overdamped)", () => {
        const s = springLinearStops({
            response: 0.5,
            dampingFraction: 1.5,
            sampleCount: 32,
        });
        const stops = parseStops(s);
        for (let i = 1; i < stops.length; i++) {
            expect(stops[i]!).toBeGreaterThanOrEqual(stops[i - 1]! - 1e-6);
        }
    });

    it("underdamped curve overshoots (some stop > 1)", () => {
        const s = springLinearStops({
            response: 0.5,
            dampingFraction: 0.35,
            sampleCount: 48,
        });
        const stops = parseStops(s);
        const max = Math.max(...stops);
        expect(max).toBeGreaterThan(1);
    });

    it("emits valid CSS — stops carry a percent unit", () => {
        const s = springLinearStops({
            response: 0.5,
            dampingFraction: 1,
            sampleCount: 8,
        });
        // The interior stops have the form "<num> <pct>%".
        const interior = s
            .slice("linear(".length, -1)
            .split(",")
            .map((e) => e.trim())
            .slice(1, -1);
        for (const entry of interior) {
            expect(entry).toMatch(/^[-\d.]+ [\d.]+%$/);
        }
    });
});
