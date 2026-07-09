import { describe, expect, it } from "vitest";
import {
    springScaleIn,
    springSlideIn,
    springPop,
    springWobble,
    enterPresets,
    exitPresets,
    attentionPresets,
    loopPresets,
    presetTaxonomy,
    fadeIn,
    fadeOut,
    pulse,
    spinner,
} from "../../src/animation/presets";
import { CSSKeyframesAnimation } from "../../src/animation/engine";

const springPresets = {
    springScaleIn,
    springSlideIn,
    springPop,
    springWobble,
};

describe("spring-eased presets (S6)", () => {
    for (const [name, factory] of Object.entries(springPresets)) {
        it(`${name}() returns a CSSKeyframesAnimation with frames`, () => {
            const anim = factory();
            expect(anim).toBeInstanceOf(CSSKeyframesAnimation);
            expect(anim.frames.length).toBeGreaterThan(0);
        });

        it(`${name}() is eased by a spring (Easing carries a linear() css twin)`, () => {
            const anim = factory();
            const easing = anim.options.timingFunction;
            // springTimingFunction returns a typed Easing: a callable `.fn`
            // plus the CSS `linear()` twin so WAAPI runs the true overshoot.
            expect(typeof easing.fn).toBe("function");
            expect(easing.css).toMatch(/^linear\(/);
            // f(0) = 0 and f(1) = 1 exactly (the spring boundary contract).
            expect(easing.fn(0)).toBe(0);
            expect(easing.fn(1)).toBe(1);
        });

        it(`${name}() honors an options override`, () => {
            const anim = factory({ duration: 1234 });
            expect(anim.options.duration).toBe(1234);
        });
    }

    it("a bouncy spring preset overshoots past 1 mid-curve", () => {
        // springScaleIn uses the bouncy spring (ζ 0.5) — its easing must peak
        // above 1 somewhere in the interior (the canonical iOS overshoot).
        const easing = springScaleIn().options.timingFunction;
        let peak = 0;
        for (let t = 0; t <= 1; t += 0.01) peak = Math.max(peak, easing.fn(t));
        expect(peak).toBeGreaterThan(1);
    });
});

describe("preset taxonomy (S6)", () => {
    it("groups existing factories by intent without re-implementing them", () => {
        // Each taxonomy leaf is one of the existing exported factories — the
        // taxonomy is a discovery index, not a second copy.
        expect(enterPresets.fadeIn).toBe(fadeIn);
        expect(exitPresets.fadeOut).toBe(fadeOut);
        expect(attentionPresets.pulse).toBe(pulse);
        expect(loopPresets.spinner).toBe(spinner);
    });

    it("the spring presets are placed in their intent buckets", () => {
        expect(enterPresets.springScaleIn).toBe(springScaleIn);
        expect(enterPresets.springSlideIn).toBe(springSlideIn);
        expect(attentionPresets.springPop).toBe(springPop);
        expect(attentionPresets.springWobble).toBe(springWobble);
    });

    it("presetTaxonomy exposes the four intent groups", () => {
        expect(Object.keys(presetTaxonomy)).toEqual([
            "enter",
            "exit",
            "attention",
            "loop",
        ]);
        expect(presetTaxonomy.enter).toBe(enterPresets);
        expect(presetTaxonomy.exit).toBe(exitPresets);
        expect(presetTaxonomy.attention).toBe(attentionPresets);
        expect(presetTaxonomy.loop).toBe(loopPresets);
    });

    it("every taxonomy leaf constructs a valid animation", () => {
        for (const group of Object.values(presetTaxonomy)) {
            for (const factory of Object.values(group)) {
                const anim = factory();
                expect(anim).toBeInstanceOf(CSSKeyframesAnimation);
                expect(anim.frames.length).toBeGreaterThan(0);
            }
        }
    });

    it("loop presets run continuously (iterationCount Infinity)", () => {
        for (const factory of Object.values(loopPresets)) {
            expect(factory().options.iterationCount).toBe(Infinity);
        }
    });
});
