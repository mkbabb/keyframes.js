// SERVED MODEL: claude-opus-5-5
import { describe, expect, it } from "vitest";
import { reverseCSSTime } from "../../src/animation/compile/emit";
import { CSSKeyframesAnimation } from "../../src/animation/engine";

/**
 * UIA-KF-177 (X.KF.W13X.r4lib) — a CSS time re-serializes in its shortest
 * exact form, so Format keeps an authored `0.25s` or `4.5s`.
 *
 * `reverseCSSTime` switched units at a 5000 ms threshold, so `0.25s` came back
 * as `250ms` and `4.5s` as `4500ms` on any edit or Format: the value survived,
 * the author's unit did not. The parse keeps only milliseconds (value.js's
 * `CSSAnimationOptions` carries no unit), so the emit writes the shorter of
 * the two exact spellings, seconds on a tie (the CSSOM's canonical unit). Both
 * spellings parse back to the same milliseconds, so one Format is a fixed point.
 */
const roundTrip = (time: string): number => {
    const anim = new CSSKeyframesAnimation().fromString(
        `@keyframes x { from { opacity: 0; } to { opacity: 1; } }\n` +
            `.x { animation: x ${time} linear; }`,
    );
    return anim.options.duration;
};

describe("UIA-KF-177 — the shortest exact CSS time", () => {
    it("keeps the authored seconds of 0.25s and 4.5s", () => {
        expect(reverseCSSTime(roundTrip("0.25s"))).toBe("0.25s");
        expect(reverseCSSTime(roundTrip("4.5s"))).toBe("4.5s");
    });

    it.each([
        [250, "0.25s"],
        [4500, "4.5s"],
        [1000, "1s"],
        [5000, "5s"],
        [300, "0.3s"],
        [16.7, "16.7ms"],
        [1234, "1.234s"],
        [50, "50ms"],
        [0, "0s"],
    ])("%d ms → %s", (ms, css) => {
        expect(reverseCSSTime(ms)).toBe(css);
    });

    it("one Format is a fixed point, and the value is exact", () => {
        for (const ms of [1, 16.7, 100, 250, 333, 1234, 4500, 5000, 12345.6]) {
            const css = reverseCSSTime(ms);
            expect(roundTrip(css)).toBe(roundTrip(`${ms}ms`));
            expect(reverseCSSTime(roundTrip(css))).toBe(css);
        }
    });
});
