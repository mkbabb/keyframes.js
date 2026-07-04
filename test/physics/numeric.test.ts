import { describe, expect, it } from "vitest";
import { easeOutCubic, linear } from "@mkbabb/value.js";
import { resolveEasing } from "../../src/animation/easing";
import { AnimationOptionError } from "../../src/animation/internal/errors";
import { NumericAnimation } from "../../src/animation/physics/numeric";

describe("NumericAnimation", () => {
    it("interpolates between two keyframes", () => {
        const anim = new NumericAnimation([
            { x: 0, y: 0 },
            { x: 100, y: 200 },
        ]);

        const start = anim.at(0);
        expect(start.x).toBeCloseTo(0);
        expect(start.y).toBeCloseTo(0);

        const end = anim.at(1);
        expect(end.x).toBeCloseTo(100);
        expect(end.y).toBeCloseTo(200);

        const mid = anim.at(0.5);
        expect(mid.x).toBeCloseTo(50);
        expect(mid.y).toBeCloseTo(100);
    });

    it("clamps progress to [0, 1]", () => {
        const anim = new NumericAnimation([
            { v: 0 },
            { v: 100 },
        ]);

        expect(anim.at(-1).v).toBeCloseTo(0);
        expect(anim.at(2).v).toBeCloseTo(100);
    });

    it("supports multiple keyframes", () => {
        const anim = new NumericAnimation([
            { x: 0 },
            { x: 50 },
            { x: 100 },
        ]);

        expect(anim.at(0).x).toBeCloseTo(0);
        expect(anim.at(0.25).x).toBeCloseTo(25);
        expect(anim.at(0.5).x).toBeCloseTo(50);
        expect(anim.at(0.75).x).toBeCloseTo(75);
        expect(anim.at(1).x).toBeCloseTo(100);
    });

    it("supports custom positions", () => {
        const anim = new NumericAnimation(
            [{ x: 0 }, { x: 100 }, { x: 50 }],
            { positions: [0, 20, 100] },
        );

        expect(anim.at(0).x).toBeCloseTo(0);
        expect(anim.at(0.2).x).toBeCloseTo(100);
        expect(anim.at(1).x).toBeCloseTo(50);
    });

    it("applies timing function", () => {
        const doubleSpeed = (t: number) => Math.min(t * 2, 1);
        const anim = new NumericAnimation(
            [{ x: 0 }, { x: 100 }],
            { timingFunction: doubleSpeed },
        );

        // At progress 0.25, timing function maps to 0.5
        expect(anim.at(0.25).x).toBeCloseTo(50);
    });

    it("updateKeyframe modifies values", () => {
        const anim = new NumericAnimation([
            { x: 0, y: 0 },
            { x: 100, y: 100 },
        ]);

        anim.updateKeyframe(1, { x: 200 });
        expect(anim.at(1).x).toBeCloseTo(200);
        expect(anim.at(1).y).toBeCloseTo(100);
    });

    it("updateKeyframe recomputes adjacent segments", () => {
        const anim = new NumericAnimation([
            { x: 0 },
            { x: 50 },
            { x: 100 },
        ]);

        anim.updateKeyframe(1, { x: 80 });
        expect(anim.at(0.5).x).toBeCloseTo(80);
        expect(anim.at(0.75).x).toBeCloseTo(90);
    });

    it("returns the same object reference (zero-alloc)", () => {
        const anim = new NumericAnimation([
            { x: 0 },
            { x: 100 },
        ]);

        const a = anim.at(0);
        const b = anim.at(0.5);
        expect(a).toBe(b);
    });

    it("throws on fewer than 2 keyframes", () => {
        expect(() => new NumericAnimation([{ x: 0 }])).toThrow();
    });

    it("throws on positions/keyframes length mismatch", () => {
        expect(
            () =>
                new NumericAnimation([{ x: 0 }, { x: 1 }], {
                    positions: [0],
                }),
        ).toThrow();
    });

    it("throws on out-of-range updateKeyframe index", () => {
        const anim = new NumericAnimation([{ x: 0 }, { x: 1 }]);
        expect(() => anim.updateKeyframe(5, { x: 0 })).toThrow(RangeError);
    });
});

describe("NumericAnimation easing construction (fail-explicit + resolveEasing)", () => {
    it("throws AnimationOptionError on a string easing name", () => {
        expect(
            () =>
                new NumericAnimation([{ x: 0 }, { x: 100 }], {
                    // @ts-expect-error — string names are rejected by the type AND at runtime
                    timingFunction: "ease-out-cubic",
                }),
        ).toThrow(AnimationOptionError);
    });

    it("resolveEasing resolves a kebab-case name the engine applies", async () => {
        const easing = await resolveEasing("ease-out-cubic");
        const anim = new NumericAnimation([{ x: 0 }, { x: 100 }], {
            timingFunction: easing,
        });
        expect(anim.at(0).x).toBeCloseTo(0);
        expect(anim.at(1).x).toBeCloseTo(100);
        expect(anim.at(0.5).x).toBeCloseTo(100 * easeOutCubic(0.5));
        // ease-out-cubic(0.5) ≈ 0.875 — distinctly non-linear.
        expect(anim.at(0.5).x).toBeGreaterThan(60);
    });

    it("resolveEasing resolves a camelCase name (easeOutCubic)", async () => {
        const easing = await resolveEasing("easeOutCubic");
        const anim = new NumericAnimation([{ x: 0 }, { x: 100 }], {
            timingFunction: easing,
        });
        expect(anim.at(0.5).x).toBeCloseTo(100 * easeOutCubic(0.5));
    });

    it("play() with a resolved easing reaches the endpoint", async () => {
        const easing = await resolveEasing("ease-out-cubic");
        const anim = new NumericAnimation([{ x: 0 }, { x: 100 }], {
            timingFunction: easing,
            duration: 50,
        });
        const frames: number[] = [];
        await anim.play((v) => frames.push(v.x));
        expect(frames.length).toBeGreaterThan(1);
        // Final frame lands exactly on the endpoint.
        expect(frames[frames.length - 1]).toBeCloseTo(100);
    });

    it("'linear' resolves to the identity ramp and carries its CSS twin", async () => {
        const easing = await resolveEasing("linear");
        expect(easing.css).toBe("linear");
        const anim = new NumericAnimation([{ x: 0 }, { x: 100 }], {
            timingFunction: easing,
        });
        expect(anim.at(0.25).x).toBeCloseTo(100 * linear(0.25));
        expect(anim.at(0.5).x).toBeCloseTo(50);
    });

    it("a callable easing is applied synchronously", () => {
        const doubleSpeed = (t: number) => Math.min(t * 2, 1);
        const anim = new NumericAnimation([{ x: 0 }, { x: 100 }], {
            timingFunction: doubleSpeed,
        });
        expect(anim.at(0.25).x).toBeCloseTo(50);
    });
});
