// SERVED MODEL: claude-opus-5-5
import { describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../../src/animation/engine";

/**
 * KFA-145 (X.KF.W13X.r4lib) — the frame that crosses a non-final loop boundary
 * paints the wrapped pose.
 *
 * KFA-181 already carries the overshoot into the next iteration's anchor, but
 * the crossing frame itself still clamped to `duration` and painted the end
 * pose: on the Square tour the 360° pose was held for an extra frame (t = 2000
 * then t = 0 read identical), which a linear loop shows as a hitch. On a
 * non-final wrap the next iteration starts in the same frame, so the frame
 * reads the carried local time (and the reversed pose under `alternate`).
 */
const make = (
    direction: "normal" | "alternate" = "normal",
    iterationCount: number | "infinite" = "infinite",
) => {
    const a = new CSSKeyframesAnimation<{ opacity: number }>({
        duration: 100,
        iterationCount,
        direction,
        timingFunction: "linear",
        useWAAPI: false,
    } as never).fromString("from { opacity: 0; } to { opacity: 1; }");
    a.setTargets(document.createElement("div"));
    return a;
};

describe("KFA-145 — the crossing frame paints the wrapped pose", () => {
    it("normal: the frame at 110 ms reads local 10, iteration 1", async () => {
        const a = make();
        await a.advanceTo(0);
        expect(await a.advanceTo(110)).toBeCloseTo(10, 9);
        expect(a.iteration).toBe(1);
        expect(await a.advanceTo(120)).toBeCloseTo(20, 9);
    });

    it("a linear loop never repeats a pose across the boundary", async () => {
        const a = make();
        let t = 0;
        await a.advanceTo(t);
        const poses: number[] = [];
        for (let k = 0; k < 40; k++) {
            t += 16.7;
            const local = await a.advanceTo(t);
            poses.push(Number(a.interpFrames(local, false).opacity));
        }
        for (let k = 1; k < poses.length; k++) {
            // Each frame advances 16.7 % of the cycle, modulo the wrap.
            const step = (poses[k]! - poses[k - 1]! + 1) % 1;
            expect(step).toBeCloseTo(0.167, 6);
        }
    });

    it("alternate: the crossing frame paints the reversed iteration", async () => {
        const a = make("alternate");
        await a.advanceTo(0);
        const local = await a.advanceTo(110);
        expect(local).toBeCloseTo(10, 9);
        expect(Number(a.interpFrames(local, false).opacity)).toBeCloseTo(0.9, 9);
    });

    it("the final boundary still ends on the end frame", async () => {
        const a = make("normal", 2);
        await a.advanceTo(0);
        await a.advanceTo(110);
        expect(await a.advanceTo(215)).toBe(100);
        expect(a.done).toBe(true);
    });
});
