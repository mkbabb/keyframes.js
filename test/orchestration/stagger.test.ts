import { describe, expect, it } from "vitest";
import { stagger } from "../../src/animation/orchestration/stagger";
import type { TimingFunction } from "../../src/animation/constants";
import { AnimationOptionError } from "../../src/animation/internal/errors";

describe("stagger", () => {
    it("from: 'first' is a monotone ramp of i·each", () => {
        const delay = stagger(5, { each: 50, from: "first" });
        const delays = delay.delays(5);
        expect(delays).toEqual([0, 50, 100, 150, 200]);
        // Strictly increasing.
        for (let i = 1; i < delays.length; i++) {
            expect(delays[i]!).toBeGreaterThan(delays[i - 1]!);
        }
    });

    it("from: 'last' is the reversed ramp", () => {
        const delay = stagger(5, { each: 50, from: "last" });
        expect(delay.delays(5)).toEqual([200, 150, 100, 50, 0]);
    });

    it("from: 'center' is symmetric about the origin (odd count)", () => {
        const delays = stagger(5, { each: 50, from: "center" }).delays(5);
        // Midpoint is the zero origin; symmetric arms grow outward.
        expect(delays[2]).toBe(0);
        expect(delays[0]).toBe(delays[4]);
        expect(delays[1]).toBe(delays[3]);
        expect(delays[0]).toBeGreaterThan(delays[1]!);
    });

    it("from: 'center' is symmetric (even count)", () => {
        const delays = stagger(4, { each: 50, from: "center" }).delays(4);
        // No exact center index; the two inner indices share the min delay.
        expect(delays[0]).toBe(delays[3]);
        expect(delays[1]).toBe(delays[2]);
        expect(delays[1]).toBeLessThan(delays[0]!);
    });

    it("from: 'edges' is symmetric, zero at both ends, max in the middle", () => {
        const delays = stagger(5, { each: 50, from: "edges" }).delays(5);
        expect(delays[0]).toBe(0);
        expect(delays[4]).toBe(0);
        expect(delays[0]).toBe(delays[4]);
        expect(delays[1]).toBe(delays[3]);
        // Center index is the maximum.
        expect(delays[2]).toBeGreaterThan(delays[1]!);
    });

    it("from: numeric index uses that index as the zero origin", () => {
        const delays = stagger(5, { each: 50, from: 1 }).delays(5);
        expect(delays[1]).toBe(0);
        // Distance grows outward from index 1; far end is the max.
        expect(delays[0]).toBe(50);
        expect(delays[4]).toBeGreaterThan(delays[0]!);
    });

    it("BITE: swapping 'first' → 'center' breaks the monotone/symmetric asserts", () => {
        const first = stagger(5, { each: 50, from: "first" }).delays(5);
        const center = stagger(5, { each: 50, from: "center" }).delays(5);
        // 'first' is monotone increasing; 'center' is NOT (it dips to 0 mid).
        const firstMonotone = first.every(
            (d, i) => i === 0 || d > first[i - 1]!,
        );
        const centerMonotone = center.every(
            (d, i) => i === 0 || d > center[i - 1]!,
        );
        expect(firstMonotone).toBe(true);
        expect(centerMonotone).toBe(false);
        // 'first' is NOT symmetric; 'center' is.
        expect(first[0]).not.toBe(first[4]);
        expect(center[0]).toBe(center[4]);
    });

    it("ease reshapes the distribution (endpoints fixed, interior bent)", () => {
        const linear = stagger(5, { each: 50, from: "first" }).delays(5);
        // A concave ease (t²) pulls interior delays below the linear ramp.
        const quad: TimingFunction = (t) => t * t;
        const eased = stagger(5, { each: 50, from: "first", ease: quad }).delays(
            5,
        );
        // Endpoints are pinned (ease(0)=0, ease(1)=1 ⇒ same max).
        expect(eased[0]).toBeCloseTo(linear[0]!);
        expect(eased[4]).toBeCloseTo(linear[4]!);
        // Interior is reshaped below the linear ramp.
        expect(eased[1]).toBeLessThan(linear[1]!);
        expect(eased[2]).toBeLessThan(linear[2]!);
        // BITE: drop the ease and the interior matches the linear ramp.
        expect(eased[2]).not.toBeCloseTo(linear[2]!);
    });

    it("accepts a typed Easing ({ fn }) for ease, not just a callable", () => {
        const callable = stagger(5, {
            each: 50,
            ease: (t) => t * t,
        }).delays(5);
        const typed = stagger(5, {
            each: 50,
            ease: { fn: (t) => t * t },
        }).delays(5);
        expect(typed).toEqual(callable);
    });

    it("accepts an array of items, using its length as the default total", () => {
        const items = ["a", "b", "c", "d"];
        const delay = stagger(items, { each: 50, from: "first" });
        // delays() with no arg uses the construction-time length.
        expect(delay.delays()).toEqual([0, 50, 100, 150]);
        // The callable also defaults its total.
        expect(delay(3)).toBe(150);
    });

    it("default each is 100ms", () => {
        const delay = stagger(3, { from: "first" });
        expect(delay.delays(3)).toEqual([0, 100, 200]);
    });

    it("is the per-index callable (i, total) => delay", () => {
        const delay = stagger(5, { each: 50, from: "first" });
        expect(delay(0, 5)).toBe(0);
        expect(delay(2, 5)).toBe(100);
        expect(delay(4, 5)).toBe(200);
    });

    it("single-element and empty runs are all-zero (no NaN)", () => {
        expect(stagger(1, { each: 50 }).delays(1)).toEqual([0]);
        expect(stagger(0, { each: 50 }).delays(0)).toEqual([]);
        // Direct call on a degenerate total.
        expect(stagger(1, { each: 50 })(0, 1)).toBe(0);
    });

    it("BITE: a string easing name is rejected at construction (fail-explicit)", () => {
        expect(() =>
            stagger(5, {
                each: 50,
                // @ts-expect-error — string names are rejected by the type AND at runtime
                ease: "easeOutCubic",
            }),
        ).toThrow(AnimationOptionError);
    });
});
