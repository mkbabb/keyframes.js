// SERVED MODEL: claude-opus-5-5
import { describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../../src/animation/engine";

/**
 * KFA-181 (X.KF.W13V.k) — a non-final wrap CARRIES its overshoot: iteration
 * n+1 begins exactly one duration after iteration n began. Re-basing the next
 * iteration at the next frame's clock dropped the overshoot (plus the held end
 * frame) on every wrap, so a 1600 ms channel drifted out of phase with its
 * 8000 ms sibling (the Amiga's floor slam slid away from the wall hit).
 */
const make = () => {
    const el = document.createElement("div");
    const a = new CSSKeyframesAnimation({
        duration: 100,
        iterationCount: "infinite",
        useWAAPI: false,
    }).fromString("from { opacity: 0; } to { opacity: 1; }");
    a.setTargets(el);
    return a;
};

describe("KFA-181 — iteration boundaries sit on the true clock", () => {
    it("the frame after a wrap reads the carried overshoot, not 0", async () => {
        const a = make();
        await a.advanceTo(0);
        await a.advanceTo(110); // wrap at the 100 ms boundary
        expect(await a.advanceTo(120)).toBeCloseTo(20, 9);
    });

    it("no drift across many wraps: local time is clock mod duration", async () => {
        const a = make();
        let t = 0;
        await a.advanceTo(t);
        for (let k = 0; k < 500; k++) {
            t += 16.7;
            await a.advanceTo(t);
        }
        // Re-basing lost ≥ one frame per wrap (~80 wraps here); carried, the
        // playhead stays on the clock (within the one held boundary frame).
        const local = await a.advanceTo(t + 16.7);
        expect(Math.abs(local - ((t + 16.7) % 100))).toBeLessThan(1e-6);
    });
});
