import { describe, expect, it } from "vitest";
import {
    CSSCubicBezier,
    steppedEase,
    timingFunctions,
} from "@mkbabb/value.js";

describe("easing re-exports (smoke tests)", () => {
    it("timingFunctions['ease-in-quad'] is a function", () => {
        const fn = timingFunctions["ease-in-quad"];
        expect(typeof fn).toBe("function");
    });

    it("timingFunctions has expected keys", () => {
        expect(timingFunctions).toHaveProperty("linear");
        expect(timingFunctions).toHaveProperty("easeInQuad");
        expect(timingFunctions).toHaveProperty("ease-in-quad");
        expect(timingFunctions).toHaveProperty("ease");
        expect(timingFunctions).toHaveProperty("ease-in-out");
        expect(timingFunctions).toHaveProperty("steps");
        expect(timingFunctions).toHaveProperty("step-start");
        expect(timingFunctions).toHaveProperty("step-end");
    });

    it("CSSCubicBezier boundaries", () => {
        const ease = CSSCubicBezier(0.25, 0.1, 0.25, 1);
        expect(ease(0)).toBeCloseTo(0, 5);
        expect(ease(1)).toBeCloseTo(1, 5);
    });

    it("steppedEase returns a function", () => {
        const fn = steppedEase(4, "jump-start");
        expect(typeof fn).toBe("function");
        expect(fn!(0)).toBe(0);
        expect(fn!(1)).toBe(1);
    });
});
