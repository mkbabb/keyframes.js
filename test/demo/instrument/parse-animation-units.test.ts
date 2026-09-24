import { describe, expect, it } from "vitest";
import { parseAnimationCSS } from "../../../demo/components/instrument/keyframes/utils/parseAnimationCSS";

// UIA-KF-011 (X.KF.W13V.u): value.js's `collectAnimationOptions` reports CSS
// times in SECONDS; keyframes' engine options are in MILLISECONDS. The editor's
// projection is the one boundary between the two, so a parse -> serialize
// round-trip must be value-stable: `animation-duration: 5s` is 5000 ms, never 5.
const css = (duration: string, delay: string) => `
    .subject { animation-duration: ${duration}; animation-delay: ${delay}; }
    @keyframes spin { from { opacity: 0; } to { opacity: 1; } }
`;

describe("the editor projection's time unit (UIA-KF-011)", () => {
    it.each([
        ["5s", "0s", 5000, 0],
        ["1500ms", "250ms", 1500, 250],
        ["0.25s", "1.5s", 250, 1500],
    ])(
        "animation-duration %s / animation-delay %s -> %d ms / %d ms",
        async (duration, delay, durationMs, delayMs) => {
            const { options } = await parseAnimationCSS(css(duration, delay));

            expect(options.duration).toBeCloseTo(durationMs, 9);
            expect(options.delay).toBeCloseTo(delayMs, 9);
        },
    );

    it("leaves an absent time absent", async () => {
        const { options } = await parseAnimationCSS(
            `@keyframes spin { from { opacity: 0; } to { opacity: 1; } }`,
        );

        expect(options.duration).toBeUndefined();
        expect(options.delay).toBeUndefined();
    });
});
