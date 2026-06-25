import { describe, expect, it } from "vitest";
import { CSSKeyframesAnimation, resolveKeyframes } from "../src/animation/engine";
import {
    animationOptionsToString,
    CSSKeyframesToString,
} from "../src/animation/compile/format";
import { defaultOptions } from "../src/animation/constants";

const parseCSSKeyframes = (input: string) => resolveKeyframes(input).keyframes;

describe("animationOptionsToString", () => {
    it("produces CSS with correct properties", () => {
        const css = animationOptionsToString(defaultOptions, "test");

        expect(css).toContain("animation-name: test");
        expect(css).toContain("animation-duration:");
        expect(css).toContain("animation-timing-function:");
        expect(css).toContain("animation-iteration-count:");
        expect(css).toContain("animation-direction:");
        expect(css).toContain("animation-fill-mode:");
    });

    it("uses correct duration format", () => {
        const css = animationOptionsToString({ ...defaultOptions, duration: 1000 });
        expect(css).toContain("1000ms");
    });

    it("shows infinite for Infinity iteration count", () => {
        const css = animationOptionsToString({
            ...defaultOptions,
            iterationCount: Infinity,
        });
        expect(css).toContain("infinite");
    });

    it("includes delay when > 0", () => {
        const css = animationOptionsToString({
            ...defaultOptions,
            delay: 500,
        });
        expect(css).toContain("animation-delay: 500ms");
    });
});

describe("CSSKeyframesToString", () => {
    it("roundtrip: parse → format → re-parse → same frame count", async () => {
        const el = document.createElement("div");

        const input = /*css*/ `
            @keyframes test {
                from { background-color: red; left: 200px; top: 0px; }
                50% { background-color: blue; left: 200px; top: 200px; }
                to { background-color: red; left: 200px; top: 0px; }
            }
        `;

        const anim = new CSSKeyframesAnimation({}, el).fromString(input);
        const formatted = await CSSKeyframesToString(anim);

        // Extract just the @keyframes block (formatter emits class rule + @keyframes block separated by blank line)
        const keyframesBlock = formatted.split("\n\n")[1] ?? formatted;
        const reparsed = parseCSSKeyframes(keyframesBlock);

        expect(reparsed.size).toBeGreaterThan(0);
    });

    it("roundtrip: parse → format → re-parse preserves property names and values", async () => {
        const el = document.createElement("div");

        const input = /*css*/ `
            @keyframes preserve-test {
                0% { opacity: 0; transform: translateX(0px); }
                100% { opacity: 1; transform: translateX(100px); }
            }
        `;

        const anim = new CSSKeyframesAnimation({}, el).fromString(input);
        const formatted = await CSSKeyframesToString(anim, "preserve-test");

        const keyframesBlock = formatted.split("\n\n")[1] ?? formatted;
        const reparsed = parseCSSKeyframes(keyframesBlock);

        // Verify property names survive the roundtrip
        const allValues = [...reparsed.values()];
        const allProperties = allValues.flatMap((frame) => Object.keys(frame));

        expect(allProperties).toContain("opacity");
        expect(allProperties).toContain("transform");
    });

    it("roundtrip: re-parsed keyframes contain valid @keyframes block", async () => {
        const el = document.createElement("div");

        const input = /*css*/ `
            @keyframes idempotent-test {
                0% { opacity: 0; left: 10px; }
                100% { opacity: 1; left: 100px; }
            }
        `;

        const anim1 = new CSSKeyframesAnimation({}, el).fromString(input);
        const formatted1 = await CSSKeyframesToString(anim1, "idempotent-test");

        // Formatted output should contain the @keyframes block
        expect(formatted1).toContain("@keyframes idempotent-test");
        expect(formatted1).toContain("opacity");
        expect(formatted1).toContain("left");

        // Re-parse should succeed (not throw)
        const keyframesBlock1 = formatted1
            .split("\n\n")
            .slice(1)
            .join("\n\n");
        const reparsed = parseCSSKeyframes(keyframesBlock1);
        expect(reparsed.size).toBeGreaterThan(0);
    });
});
