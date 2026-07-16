import { describe, expect, it } from "vitest";
import { easeOutCubic } from "@mkbabb/value.js/easing";
import { resolveEasing, toEasing } from "../../src/animation/easing";
import { UnknownEasingError } from "../../src/animation/internal/errors";

describe("resolveEasing (the explicit async easing factory)", () => {
    it("resolves a kebab-case registry name to a typed Easing", async () => {
        const easing = await resolveEasing("ease-out-cubic");
        expect(typeof easing.fn).toBe("function");
        expect(easing.fn(0.5)).toBeCloseTo(easeOutCubic(0.5), 10);
        // A non-CSS-native registry name carries no CSS twin.
        expect(easing.css).toBeUndefined();
    });

    it("resolves a camelCase registry name", async () => {
        const easing = await resolveEasing("easeOutCubic");
        expect(easing.fn(0.5)).toBeCloseTo(easeOutCubic(0.5), 10);
    });

    it("attaches the CSS twin for CSS-native names", async () => {
        const easing = await resolveEasing("ease-in-out");
        expect(easing.css).toBe("ease-in-out");
        expect(typeof easing.fn).toBe("function");
    });

    it("resolves a cubic-bezier() literal with its CSS twin", async () => {
        const easing = await resolveEasing("cubic-bezier(0.4, 0, 0.2, 1)");
        expect(easing.css).toBe("cubic-bezier(0.4, 0, 0.2, 1)");
        expect(easing.fn(0)).toBeCloseTo(0, 10);
        expect(easing.fn(1)).toBeCloseTo(1, 10);
        // Mid-curve is distinctly non-linear for this material-style bezier.
        expect(easing.fn(0.5)).toBeGreaterThan(0.6);
    });

    it("resolves a steps() literal", async () => {
        const easing = await resolveEasing("steps(4, jump-end)");
        expect(typeof easing.fn).toBe("function");
        // A 4-step jump-end staircase is flat at the start of each tread.
        expect(easing.fn(0)).toBe(0);
        expect(easing.fn(1)).toBe(1);
    });

    it("REJECTS an unknown name with UnknownEasingError (fail-explicit)", async () => {
        await expect(resolveEasing("not-a-real-easing")).rejects.toThrow(
            UnknownEasingError,
        );
        await expect(resolveEasing("not-a-real-easing")).rejects.toThrow(
            /not-a-real-easing/,
        );
    });
});

describe("toEasing (the sync light-engine normalizer)", () => {
    it("wraps a bare callable", () => {
        const fn = (t: number) => t * t;
        const easing = toEasing(fn);
        expect(easing.fn).toBe(fn);
        expect(easing.css).toBeUndefined();
    });

    it("passes a typed Easing through unchanged", () => {
        const input = { fn: (t: number) => t, css: "linear" };
        expect(toEasing(input)).toBe(input);
    });
});
