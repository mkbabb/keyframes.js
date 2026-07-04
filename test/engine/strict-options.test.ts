/**
 * The fail-explicit option contract (B.W2) — malformed PRESENT input
 * THROWS a typed `AnimationOptionError`; genuine omission (`undefined`)
 * defaults. These are the bites of the invariant A declared
 * ("a value.js-internal resolution failure throws") and B honors.
 */
import { describe, expect, it } from "vitest";
import { KeyframesAnimation } from "../../src/animation/engine";
import { AnimationOptionError } from "../../src/animation/internal/errors";
import { defaultOptions } from "../../src/animation/constants";

describe("strict option validation (AnimationOptionError)", () => {
    it("setIterationCount throws on a malformed string", () => {
        const anim = new KeyframesAnimation();
        expect(() => anim.setIterationCount("abc")).toThrow(
            AnimationOptionError,
        );
        expect(() => anim.setIterationCount("abc")).toThrow(/iterationCount/);
    });

    it("setIterationCount throws on a negative number", () => {
        const anim = new KeyframesAnimation();
        expect(() => anim.setIterationCount(-3)).toThrow(AnimationOptionError);
    });

    it("setIterationCount accepts 'infinite' and genuine omission defaults", () => {
        const anim = new KeyframesAnimation();
        anim.setIterationCount("infinite");
        expect(anim.options.iterationCount).toBe(Infinity);
        anim.setIterationCount(undefined);
        expect(anim.options.iterationCount).toBe(
            defaultOptions.iterationCount,
        );
    });

    it("setDuration throws on non-positive and malformed input", () => {
        const anim = new KeyframesAnimation();
        expect(() => anim.setDuration(-5)).toThrow(AnimationOptionError);
        expect(() => anim.setDuration(0)).toThrow(AnimationOptionError);
        expect(() => anim.setDuration("garbage")).toThrow(
            AnimationOptionError,
        );
        // The previous duration survives the throw — no silent half-write.
        expect(anim.options.duration).toBe(defaultOptions.duration);
    });

    it("setDuration accepts a CSS time string", () => {
        const anim = new KeyframesAnimation();
        anim.setDuration("2s");
        expect(anim.options.duration).toBe(2000);
    });

    it("setTimingFunction throws on an unknown name (never silent-defaults)", () => {
        const anim = new KeyframesAnimation();
        expect(() => anim.setTimingFunction("bogus-easing")).toThrow(
            AnimationOptionError,
        );
    });

    it("setTimingFunction resolves registry names, beziers, steps, and typed Easings", () => {
        const anim = new KeyframesAnimation();
        anim.setTimingFunction("ease-out-cubic");
        expect(typeof anim.options.timingFunction.fn).toBe("function");

        anim.setTimingFunction("cubic-bezier(0.4, 0, 0.2, 1)");
        expect(anim.options.timingFunction.fn(1)).toBeCloseTo(1, 10);

        anim.setTimingFunction("steps(4)");
        expect(anim.options.timingFunction.fn(1)).toBe(1);

        const typed = { fn: (t: number) => t, css: "linear" };
        anim.setTimingFunction(typed);
        expect(anim.options.timingFunction).toBe(typed);
    });

    it("setDelay throws on malformed input, allows negative CSS delays", () => {
        const anim = new KeyframesAnimation();
        expect(() => anim.setDelay("garbage")).toThrow(AnimationOptionError);
        anim.setDelay(-100);
        expect(anim.options.delay).toBe(-100);
    });

    it("setDirection / setFillMode throw on unknown literals", () => {
        const anim = new KeyframesAnimation();
        expect(() =>
            anim.setDirection("sideways" as never),
        ).toThrow(AnimationOptionError);
        expect(() => anim.setFillMode("everything" as never)).toThrow(
            AnimationOptionError,
        );
    });

    it("setUseWAAPI / setRespectReducedMotion throw on non-booleans", () => {
        const anim = new KeyframesAnimation();
        expect(() => anim.setUseWAAPI("yes" as never)).toThrow(
            AnimationOptionError,
        );
        expect(() => anim.setRespectReducedMotion(1 as never)).toThrow(
            AnimationOptionError,
        );
    });

    it("setColorSpace throws on a malformed present value, defaults on omission", () => {
        const anim = new KeyframesAnimation();
        // Present-but-malformed: the seam, not a silent `?? default` accept.
        expect(() => anim.setColorSpace("bogus" as never)).toThrow(
            AnimationOptionError,
        );
        expect(() => anim.setColorSpace("srgbbb" as never)).toThrow(
            /colorSpace/,
        );
        // A valid space is written through.
        anim.setColorSpace("oklch");
        expect(anim.options.colorSpace).toBe("oklch");
        // Genuine omission still defaults — the only accepted non-value.
        anim.setColorSpace(undefined);
        expect(anim.options.colorSpace).toBe(defaultOptions.colorSpace);
    });

    it("setHueMethod throws on a malformed present value, omission leaves it unset", () => {
        const anim = new KeyframesAnimation();
        expect(() => anim.setHueMethod("bogus" as never)).toThrow(
            AnimationOptionError,
        );
        expect(() => anim.setHueMethod("bogus" as never)).toThrow(/hueMethod/);
        // A valid CSS Color 4 hue method is written through.
        anim.setHueMethod("longer");
        expect(anim.options.hueMethod).toBe("longer");
        // Genuine omission is the accepted no-op (the prior value survives).
        anim.setHueMethod(undefined);
        expect(anim.options.hueMethod).toBe("longer");
    });

    it("setColorSpace error carries the option name and offending value", () => {
        const anim = new KeyframesAnimation();
        try {
            anim.setColorSpace("srgbbb" as never);
            expect.unreachable("should have thrown");
        } catch (e) {
            const err = e as AnimationOptionError;
            expect(err.name).toBe("AnimationOptionError");
            expect(err.option).toBe("colorSpace");
            expect(err.value).toBe("srgbbb");
        }
    });

    it("the error carries the option name and offending value", () => {
        const anim = new KeyframesAnimation();
        try {
            anim.setIterationCount("abc");
            expect.unreachable("should have thrown");
        } catch (e) {
            const err = e as AnimationOptionError;
            expect(err.name).toBe("AnimationOptionError");
            expect(err.option).toBe("iterationCount");
            expect(err.value).toBe("abc");
        }
    });
});

describe("the rest-position contract (settle vs reset)", () => {
    it("settle() is pure teardown — flags clear, no paint requirement", () => {
        const anim = new KeyframesAnimation({ duration: 100 });
        anim.started = true;
        anim.t = 50;
        anim.settle();
        expect(anim.started).toBe(false);
        expect(anim.t).toBe(0);
        expect(anim.done).toBe(false);
    });

    it("restPosition derives from fillMode", () => {
        const anim = new KeyframesAnimation();
        anim.setFillMode("forwards");
        expect(anim.restPosition).toBe("final");
        anim.setFillMode("both");
        expect(anim.restPosition).toBe("final");
        anim.setFillMode("none");
        expect(anim.restPosition).toBe("initial");
        anim.setFillMode("backwards");
        expect(anim.restPosition).toBe("initial");
    });
});
