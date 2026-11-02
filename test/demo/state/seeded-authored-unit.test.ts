// SERVED MODEL: claude-opus-5-5
import { beforeAll, describe, expect, it } from "vitest";

import { warmKfEngine } from "../../../demo/kf-engine";
import { CSSKeyframesAnimation } from "../../../src/animation/engine";
import { getStoredAnimationOptions } from "../../../demo/state";
import { animationOptionsToString } from "../../../src/animation/compile/emit/format";

/**
 * UIA-KF-177, the store-seeding half (COHESION §0hg.4 residual): a fresh bucket
 * seeded FROM a live animation (`storedOptionsFrom`) keeps the `<time>` unit the
 * author wrote, the same spelling the keyframes-panel op (`useKeyframeOps`) and
 * every engine emit use. Each case authors one field in each unit, so a dropped
 * unit on either field reads RED; the stored spelling then round-trips back
 * through a fresh animation and its emit unchanged.
 */
beforeAll(async () => {
    await warmKfEngine();
});

const live = (duration: number, durationUnit: "s" | "ms", delay: number, delayUnit: "s" | "ms") => {
    const anim = new CSSKeyframesAnimation({
        duration,
        durationUnit,
        delay,
        delayUnit,
        timingFunction: "linear",
    }).fromString(`
        0% { transform: translateX(0px); }
        100% { transform: translateX(10px); }
    `);
    anim.name = "x";
    anim.superKey = `seeded-unit-${Math.random()}`;
    return anim;
};

describe("UIA-KF-177 — a seeded bucket keeps the authored time unit", () => {
    it.each([
        [1600, "s", 250, "ms", "1.6s", "250ms"],
        [350, "ms", 500, "s", "350ms", "0.5s"],
    ] as const)(
        "duration %d (%s) / delay %d (%s) seeds as %s / %s and round-trips",
        (duration, durationUnit, delay, delayUnit, wantDuration, wantDelay) => {
            const anim = live(duration, durationUnit, delay, delayUnit);
            const stored = getStoredAnimationOptions(anim).animationOptions;
            expect(stored.duration).toBe(wantDuration);
            expect(stored.delay).toBe(wantDelay);

            // Round-trip: the stored spelling, re-ingested, is the same
            // milliseconds, and the engine's emit writes the authored spelling.
            const again = new CSSKeyframesAnimation({
                duration: stored.duration,
                delay: stored.delay,
            });
            expect(again.options.duration).toBe(duration);
            expect(again.options.delay).toBe(delay);
            const css = animationOptionsToString(anim.options, "x");
            expect(css).toContain(`animation-duration: ${wantDuration};`);
            expect(css).toContain(`animation-delay: ${wantDelay};`);
        },
    );
});
