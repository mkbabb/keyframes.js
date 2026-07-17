import { parseCssValues } from "@mkbabb/value.js/css";
import type { CssValue } from "@mkbabb/value.js/value";
import { describe, expect, it } from "vitest";
import {
    compileValuePair,
    interpolateCompiledValue,
    serializeCompiledValue,
} from "../../src/animation/compile/value";

const parse = (source: string): CssValue => {
    const result = parseCssValues(source);
    if (!result.ok) throw new TypeError(`Fixture did not parse: ${source}`);
    return result.value;
};

const midpoint = (
    from: string,
    to: string,
    property = "transform",
    colorSpace: "rgb" | "oklab" | "oklch" = "oklab",
): string => {
    const value = compileValuePair(parse(from), parse(to), {
        colorSpace,
        property,
    });
    interpolateCompiledValue(value, 0.5);
    return serializeCompiledValue(value);
};

describe("structural interpolate-anything matrix", () => {
    it("interpolates multi-argument transforms without residual leaves", () => {
        expect(
            midpoint(
                "translate3d(0px, 0px, 0px) scale(1)",
                "translate3d(100px, 100px, 0px) scale(2)",
            ),
        ).toBe("translate3d(50px, 50px, 0px) scale(1.5)");
    });

    it("interpolates angles in their normalized dimension", () => {
        expect(midpoint("rotate(0deg)", "rotate(0.25turn)")).toBe(
            "rotate(45deg)",
        );
    });

    it("interpolates filters and pads a missing function with its identity", () => {
        expect(midpoint("blur(4px)", "blur(8px) brightness(2)", "filter")).toBe(
            "blur(6px) brightness(1.5)",
        );
    });

    it("interpolates shadow numeric channels and colors structurally", () => {
        const value = midpoint(
            "0px 0px 0px rgb(0, 0, 0)",
            "10px 20px 4px rgb(255, 255, 255)",
            "box-shadow",
        );
        expect(value).toMatch(/^5px 10px 2px oklab\(/);
    });

    it("interpolates gradient stop positions within the call AST", () => {
        const value = midpoint(
            "linear-gradient(90deg, red 0%, blue 100%)",
            "linear-gradient(90deg, red 40%, blue 100%)",
            "background",
        );
        expect(value).toContain("20%");
    });

    it("preserves the selected color interpolation space", () => {
        expect(midpoint("red", "blue", "color", "rgb")).toMatch(/^rgb\(/);
        expect(midpoint("red", "blue", "color", "oklab")).toMatch(/^oklab\(/);
        expect(midpoint("red", "blue", "color", "oklch")).toMatch(/^oklch\(/);
    });

    it("keeps bare container-query units authored for browser resolution", () => {
        expect(midpoint("10cqw", "90cqw", "width")).toBe("50cqw");
    });
});
