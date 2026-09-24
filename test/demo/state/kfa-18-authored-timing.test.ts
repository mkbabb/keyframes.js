// SERVED MODEL: claude-opus-5-5
import { beforeAll, describe, expect, it } from "vitest";

import { warmKfEngine } from "../../../demo/kf-engine";
import { CSSKeyframesAnimation } from "../../../src/animation/engine";
import { getStoredAnimationOptions } from "../../../demo/state";
import { useTimingFunctionEditor } from "../../../demo/components/instrument/transport/channel-controls/composables/useTimingFunctionEditor";

/**
 * KFA-18 / KFA-21 (X.KF.W13V.k) — an authored channel keeps its authored timing.
 *
 *  · The store bucket for a LIVE animation is seeded FROM that animation (what
 *    the controls pane displays is what runs), never from the demo-global
 *    5s / alternate / ease-in-out defaults.
 *  · An easing edit re-seats ONLY the frames that inherited the channel easing
 *    (the engine's identity-preserving setter); an author-declared per-frame
 *    curve (the Amiga's FALL/RISE) survives.
 */
beforeAll(async () => {
    await warmKfEngine();
});

const authored = () => {
    const anim = new CSSKeyframesAnimation({
        duration: 1600,
        direction: "normal",
        iterationCount: "infinite",
        timingFunction: "linear",
    }).fromString(`
        0% { transform: translateY(0px); animation-timing-function: ease-in; }
        50% { transform: translateY(100px); }
        100% { transform: translateY(0px); }
    `);
    anim.name = "y";
    anim.superKey = `kfa-18-${Math.random()}`;
    return anim;
};

describe("KFA-18/21 — the authored channel's timing is the truth", () => {
    it("an unseen bucket for a live animation is seeded from what it runs", () => {
        const anim = authored();
        const stored = getStoredAnimationOptions(anim);
        expect(stored.animationOptions.duration).toBe("1600ms");
        expect(stored.animationOptions.direction).toBe("normal");
        expect(stored.animationOptions.iterationCount).toBe("infinite");
        expect(stored.animationOptions.timingFunction).toBe("linear");
    });

    it("an easing edit re-seats only the inherited frames; a declared per-frame curve survives", () => {
        const anim = authored();
        const declared = anim.frames[0]!.timingFunction;
        const inherited = anim.frames[1]!.timingFunction;
        expect(declared).not.toBe(inherited);

        const editor = useTimingFunctionEditor(() => anim, getStoredAnimationOptions(anim));
        editor.updateTimingFunctionFromName("ease-out");

        expect(anim.frames[0]!.timingFunction).toBe(declared);
        expect(anim.frames[1]!.timingFunction).not.toBe(inherited);
        expect(anim.frames[1]!.timingFunction).toBe(anim.options.timingFunction);
    });
});
