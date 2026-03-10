import { describe, expect, it } from "vitest";
import { ElementMorph } from "../src/animation/morph";
import type { MorphRect } from "../src/animation/morph";

describe("ElementMorph", () => {
    const from: MorphRect = { x: 0, y: 0, width: 100, height: 50 };
    const to: MorphRect = { x: 200, y: 100, width: 200, height: 100 };

    it("at(0) returns identity transform", () => {
        const morph = new ElementMorph(from, to);
        const v = morph.at(0);
        expect(v.translateX).toBeCloseTo(0);
        expect(v.translateY).toBeCloseTo(0);
        expect(v.scaleX).toBeCloseTo(1);
        expect(v.scaleY).toBeCloseTo(1);
    });

    it("at(1) returns full delta", () => {
        const morph = new ElementMorph(from, to);
        const v = morph.at(1);
        expect(v.translateX).toBeCloseTo(200);
        expect(v.translateY).toBeCloseTo(100);
        expect(v.scaleX).toBeCloseTo(2);
        expect(v.scaleY).toBeCloseTo(2);
    });

    it("at(0.5) returns midpoint", () => {
        const morph = new ElementMorph(from, to);
        const v = morph.at(0.5);
        expect(v.translateX).toBeCloseTo(100);
        expect(v.translateY).toBeCloseTo(50);
        expect(v.scaleX).toBeCloseTo(1.5);
        expect(v.scaleY).toBeCloseTo(1.5);
    });

    it("toCSSTransform returns valid CSS", () => {
        const morph = new ElementMorph(from, to);
        const css = morph.toCSSTransform(0);
        expect(css).toContain("translate(");
        expect(css).toContain("scale(");
    });

    it("handles zero-width source gracefully", () => {
        const zeroFrom: MorphRect = { x: 0, y: 0, width: 0, height: 50 };
        const morph = new ElementMorph(zeroFrom, to);
        const v = morph.at(1);
        expect(v.scaleX).toBeCloseTo(1); // fallback
        expect(v.scaleY).toBeCloseTo(2);
    });

    it("measure() updates the animation", () => {
        const morph = new ElementMorph(from, to);
        const newTo: MorphRect = { x: 400, y: 200, width: 300, height: 150 };
        morph.measure(from, newTo);
        const v = morph.at(1);
        expect(v.translateX).toBeCloseTo(400);
        expect(v.translateY).toBeCloseTo(200);
    });

    it("apply() sets element style", () => {
        const morph = new ElementMorph(from, to);
        const el = document.createElement("div");
        morph.apply(el, 0.5);
        expect(el.style.transform).toContain("translate(");
        expect(el.style.transformOrigin).toBe("top left");
    });

    it("accepts custom transformOrigin", () => {
        const morph = new ElementMorph(from, to, {
            transformOrigin: "center center",
        });
        const el = document.createElement("div");
        morph.apply(el, 0);
        expect(el.style.transformOrigin).toBe("center center");
    });
});
