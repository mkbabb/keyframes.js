// SERVED MODEL: claude-opus-5-5
/**
 * KFA-28 (X.KF.W13X.r4lib) — a step easing is never baked into linear ramps.
 *
 * The home typing dots run `steps(4, jump-none)` over three stops. The WAAPI
 * emit sent every numeric multi-segment animation down the densify (bake) path,
 * whose chord bisection cannot converge on a jump: the dots got 35 linear
 * keyframes, 2 of 8 cliffs survived, and full opacity showed for one instant.
 * A step easing has an exact CSS twin, so the emit keeps the boundary stops and
 * hands each segment its native `steps()` easing. The WAAPI curve, evaluated the
 * way the compositor evaluates it (per-keyframe easing, linear effect), then
 * equals the rAF lane at every sample.
 */
import { describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../../src/animation/engine";
import { toWAAPIKeyframes, toWAAPIOptions } from "../../src/animation/waapi";
import type { InputAnimationOptions } from "../../src/animation/constants";

const DURATION = 1200;
const REST = 0.2;

const typingDot = (
    timingFunction: NonNullable<InputAnimationOptions["timingFunction"]>,
) => {
    const anim = new CSSKeyframesAnimation<{ opacity: number }>({
        duration: DURATION,
        iterationCount: "infinite",
        timingFunction,
    }).fromKeyframes({
        "0%": { opacity: REST },
        "50%": { opacity: 1 },
        "100%": { opacity: REST },
    });
    anim.setTargets(document.createElement("div"));
    return anim;
};

/** The compositor's reading of a keyframe list: find the segment, ease its
 * local progress with that keyframe's own easing, lerp the two values. */
const waapiSample = (
    keyframes: Keyframe[],
    easeOf: (css: string) => (p: number) => number,
    offset: number,
): number => {
    let i = 0;
    while (i < keyframes.length - 2 && (keyframes[i + 1]!.offset as number) <= offset) i++;
    const a = keyframes[i]!;
    const b = keyframes[i + 1]!;
    const span = (b.offset as number) - (a.offset as number);
    const p = span === 0 ? 1 : (offset - (a.offset as number)) / span;
    const eased = a.easing === undefined ? p : easeOf(a.easing)(p);
    const va = Number(a.opacity);
    const vb = Number(b.opacity);
    return va + (vb - va) * eased;
};

describe("KFA-28 — steps() is emitted, never baked", () => {
    it("emits only the boundary stops, each carrying the native steps() easing", () => {
        const anim = typingDot("steps(4, jump-none)");
        const keyframes = toWAAPIKeyframes(anim);
        expect(keyframes.map((k) => k.offset)).toEqual([0, 0.5, 1]);
        expect(keyframes.slice(0, -1).map((k) => k.easing)).toEqual([
            "steps(4, jump-none)",
            "steps(4, jump-none)",
        ]);
        expect(keyframes.at(-1)!.easing).toBeUndefined();
        expect(toWAAPIOptions(anim).easing).toBe("linear");
    });

    it("the compositor curve equals the rAF lane at every sample (all 8 cliffs, a held peak)", () => {
        const anim = typingDot("steps(4, jump-none)");
        const keyframes = toWAAPIKeyframes(anim);
        const fn = anim.frames[0]!.timingFunction.fn;
        const easeOf = (css: string) => {
            expect(css).toBe("steps(4, jump-none)");
            return fn;
        };
        let atPeak = 0;
        for (let s = 0; s < 240; s++) {
            const t = (DURATION * (s + 0.5)) / 240;
            const raf = Number(anim.interpFrames(t, false).opacity);
            const wa = waapiSample(keyframes, easeOf, t / DURATION);
            expect(wa).toBeCloseTo(raf, 9);
            if (Math.abs(raf - 1) < 1e-9) atPeak++;
        }
        // jump-none over 4 steps holds the top value for a quarter of each
        // half: 2 × 30 samples of 240 sit on full opacity, not one instant.
        expect(atPeak).toBe(60);
    });

    it("a continuous easing still takes the densify path", () => {
        const anim = typingDot("cubic-bezier(0.9, 0, 0.1, 1)");
        expect(toWAAPIKeyframes(anim).length).toBeGreaterThan(3);
    });
});
