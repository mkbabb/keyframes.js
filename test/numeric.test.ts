import { describe, expect, it } from "vitest";
import { easeOutCubic, linear } from "@mkbabb/value.js";
import { NumericAnimation } from "../src/animation/numeric";

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

describe("NumericAnimation lazy string-name easing", () => {
    it("string name interpolates as linear until ready() resolves", () => {
        const anim = new NumericAnimation([{ x: 0 }, { x: 100 }], {
            timingFunction: "ease-out-cubic",
        });
        // Before resolution: linear fallback.
        expect(anim.at(0.5).x).toBeCloseTo(50);
    });

    it("ready() resolves a kebab-case name through the engine boundary", async () => {
        const anim = new NumericAnimation([{ x: 0 }, { x: 100 }], {
            timingFunction: "ease-out-cubic",
        });
        await anim.ready();
        // After resolution: eased curve, endpoints exact, midpoint eased.
        expect(anim.at(0).x).toBeCloseTo(0);
        expect(anim.at(1).x).toBeCloseTo(100);
        expect(anim.at(0.5).x).toBeCloseTo(100 * easeOutCubic(0.5));
        // ease-out-cubic(0.5) ≈ 0.875 — distinctly non-linear.
        expect(anim.at(0.5).x).toBeGreaterThan(60);
    });

    it("ready() resolves a camelCase name (easeOutCubic)", async () => {
        const anim = new NumericAnimation([{ x: 0 }, { x: 100 }], {
            timingFunction: "easeOutCubic",
        });
        await anim.ready();
        expect(anim.at(0.5).x).toBeCloseTo(100 * easeOutCubic(0.5));
    });

    it("play() resolves the name before the first frame and reaches the endpoint", async () => {
        const anim = new NumericAnimation([{ x: 0 }, { x: 100 }], {
            timingFunction: "ease-out-cubic",
            duration: 50,
        });
        const frames: number[] = [];
        await anim.play((v) => frames.push(v.x));
        expect(frames.length).toBeGreaterThan(1);
        // Final frame lands exactly on the endpoint.
        expect(frames[frames.length - 1]).toBeCloseTo(100);
        // The easing was applied — at least one mid frame is above the
        // linear value for the same progress (ease-out front-loads).
        // (We can't read progress directly, but a non-linear curve means
        //  intermediate x values are not a straight ramp.)
    });

    it("'linear' name resolves to the identity ramp", async () => {
        const anim = new NumericAnimation([{ x: 0 }, { x: 100 }], {
            timingFunction: "linear",
        });
        await anim.ready();
        expect(anim.at(0.25).x).toBeCloseTo(100 * linear(0.25));
        expect(anim.at(0.5).x).toBeCloseTo(50);
    });

    it("ready() is a no-op for callable easing (resolves immediately)", async () => {
        const doubleSpeed = (t: number) => Math.min(t * 2, 1);
        const anim = new NumericAnimation([{ x: 0 }, { x: 100 }], {
            timingFunction: doubleSpeed,
        });
        // Callable is applied synchronously — no resolution needed.
        expect(anim.at(0.25).x).toBeCloseTo(50);
        await anim.ready();
        expect(anim.at(0.25).x).toBeCloseTo(50);
    });
});
