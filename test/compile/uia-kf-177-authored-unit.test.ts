// SERVED MODEL: claude-opus-5-5
import { describe, expect, it } from "vitest";
import { reverseCSSTime } from "../../src/animation/compile/emit";
import { compileToEntry } from "../../src/animation/compile/emit/entry";
import {
    animationOptionsToString,
    animationShorthand,
} from "../../src/animation/compile/emit/format";
import { CSSKeyframesAnimation } from "../../src/animation/engine";

/**
 * UIA-KF-177, the kf half (X.KF.W3 `.c4`, COHESION §0fl.2): the `<time>` unit
 * the author wrote survives ingest → emit.
 *
 * value.js 4.1.0's `CSSAnimationOptions` carries `durationUnit` / `delayUnit`
 * (`css.d.ts:93,97`). Before this unit kf dropped them at ingest and every emit
 * wrote the shortest exact spelling, so an authored `500ms` came back as
 * `0.5s` and an authored `0.05s` as `50ms`. Each case below picks a spelling
 * the shortest-exact rule would rewrite, so a dropped unit reads RED.
 */
const KEYFRAMES = `@keyframes x { from { opacity: 0; } to { opacity: 1; } }\n`;
const ingest = (rule: string): CSSKeyframesAnimation<any> =>
    new CSSKeyframesAnimation().fromString(`${KEYFRAMES}.x { ${rule} }`);

describe("UIA-KF-177 — the authored time unit survives ingest → emit", () => {
    it("ingest keeps the unit beside the milliseconds", () => {
        const anim = ingest("animation: x 500ms linear 0.05s;");
        expect(anim.options.duration).toBe(500);
        expect(anim.options.durationUnit).toBe("ms");
        expect(anim.options.delay).toBe(50);
        expect(anim.options.delayUnit).toBe("s");
    });

    it("the longhand emit writes the authored units", () => {
        const css = animationOptionsToString(
            ingest("animation: x 500ms linear 0.05s;").options,
            "x",
        );
        expect(css).toContain("animation-duration: 500ms;");
        expect(css).toContain("animation-delay: 0.05s;");
    });

    it("the shorthand emit writes the authored units", () => {
        const shorthand = animationShorthand(
            ingest(
                "animation-duration: 0.05s; animation-timing-function: linear; animation-delay: 250ms;",
            ).options,
            "x",
        );
        expect(shorthand).toMatch(/^0\.05s linear 250ms /);
    });

    it("the entry emit writes the authored unit", async () => {
        const out = await compileToEntry({
            ".toast": { enter: ingest(
                "animation-duration: 350ms; animation-timing-function: linear;",
            ) },
        });
        expect(out.css).toMatch(/opacity 350ms linear/);
        expect(out.css).not.toMatch(/0\.35s/);
    });

    it("re-ingesting the emit is a fixed point, unit included", () => {
        const first = animationOptionsToString(
            ingest("animation: x 500ms linear 0.05s;").options,
            "x",
        );
        const again = animationOptionsToString(
            new CSSKeyframesAnimation().fromString(`${KEYFRAMES}${first}`).options,
            "x",
        );
        expect(again).toBe(first);
    });

    it("an explicit unit is honoured; no unit keeps the shortest exact form", () => {
        expect(reverseCSSTime(500, "ms")).toBe("500ms");
        expect(reverseCSSTime(50, "s")).toBe("0.05s");
        expect(reverseCSSTime(500)).toBe("0.5s");
        expect(reverseCSSTime(50)).toBe("50ms");
    });
});
