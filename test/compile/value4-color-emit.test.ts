import { describe, expect, it } from "vitest";
import { oklab, rgb } from "@mkbabb/value.js/color";
import type { AnyColor } from "@mkbabb/value.js/color";
import type { CssValue } from "@mkbabb/value.js/value";
import {
    colorUnitToOklabCSS,
    densifyColorBlock,
    isColorUnit,
} from "../../src/animation/compile/emit/backward-color";

const requireColor = <T>(result: { ok: true; value: T } | { ok: false }): T => {
    if (!result.ok) throw new TypeError("test color construction failed");
    return result.value;
};

const colorValue = (value: AnyColor): CssValue => ({
    kind: "scalar",
    payload: { type: "color", value },
});

describe("Value 4 final-color emission", () => {
    it("converts a final RGB object to the compiler's quantized OKLab literal", () => {
        const slot = colorValue(requireColor(rgb(255, 0, 0)));

        expect(isColorUnit(slot)).toBe(true);
        expect(colorUnitToOklabCSS(slot)).toBe(
            "oklab(0.628 0.2249 0.1258)",
        );
    });

    it("reads OKLab channels directly without the deleted range normalization", () => {
        const slot = colorValue(requireColor(oklab(0.5, 0.1, -0.2)));

        expect(colorUnitToOklabCSS(slot)).toBe("oklab(0.5 0.1 -0.2)");
    });

    it("refuses a nominal or malformed payload instead of parsing or substituting", () => {
        const slot = {
            kind: "scalar",
            payload: { type: "keyword", value: "red" },
        } as const;

        expect(() => colorUnitToOklabCSS(slot)).toThrow(
            "does not contain a Value 4 final color",
        );
    });

    it("densifies through explicit Value 4 mix results", () => {
        const animation = {
            templateFrames: [
                { start: { kind: "percent", value: 0 } },
                { start: { kind: "percent", value: 1 } },
            ],
            parsedVars: [
                { backgroundColor: colorValue(requireColor(rgb(255, 0, 0))) },
                { backgroundColor: colorValue(requireColor(rgb(0, 0, 255))) },
            ],
            options: { colorSpace: "oklab" },
        };

        const result = densifyColorBlock(animation as never, 16, 0.02);
        expect(result).not.toBeNull();
        expect(result).not.toHaveProperty("refused", true);
        if (result && !("refused" in result)) {
            expect(result.keys).toEqual(["backgroundColor"]);
            expect(result.byPct.get(0)?.[0]).toContain("oklab(");
            expect(result.byPct.get(100)?.[0]).toContain("oklab(");
        }
    });
});
