import { describe, expect, it } from "vitest";
import { resolveEasingOption } from "../../src/animation/compile/easing/option";
import { serializeEasing } from "../../src/animation/compile/emit/easing-serialize";

describe("Value 4 easing contract", () => {
    it.each([
        "linear",
        "ease-out-cubic",
        "easeOutCubic",
        "smooth-step-3",
        "ease-in-bounce",
    ])("resolves canonical name %s", (name) => {
        const fn = resolveEasingOption("timingFunction", name).fn;
        expect(fn).toBeTypeOf("function");
        expect(fn(0)).toBeCloseTo(0, 8);
        expect(fn(1)).toBeCloseTo(1, 8);
    });

    it("resolves typed cubic-bezier and steps ASTs", () => {
        const bezier = resolveEasingOption("timingFunction", "cubic-bezier(0, 0, 1, 1)").fn;
        const steps = resolveEasingOption("timingFunction", "steps(4, jump-end)").fn;
        expect(bezier(0.5)).toBeCloseTo(0.5, 6);
        expect(steps(0.99)).toBe(0.75);
    });

    it("resolves omitted and double CSS linear() stop positions", () => {
        const distributed = resolveEasingOption("timingFunction", "linear(0, 0.6, 1)").fn;
        const double = resolveEasingOption("timingFunction", "linear(0, 0.5 25% 75%, 1)").fn;
        expect(distributed(0.5)).toBeCloseTo(0.6, 8);
        expect(double(0.25)).toBeCloseTo(0.5, 8);
        expect(double(0.5)).toBeCloseTo(0.5, 8);
        expect(double(0.75)).toBeCloseTo(0.5, 8);
    });

    it("fails explicitly for malformed or unknown text", () => {
        expect(() => resolveEasingOption("timingFunction", "steps(0)")).toThrow();
        expect(() => resolveEasingOption("timingFunction", "not-an-easing")).toThrow();
    });

    it("keeps stable named identities for faithful CSS serialization", () => {
        const fn = resolveEasingOption("timingFunction", "ease-out-cubic").fn;
        expect(serializeEasing({ fn })).toMatch(/^linear\(/);
    });
});
