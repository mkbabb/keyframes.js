import { parseCssValues } from "@mkbabb/value.js/css";
import type { CssValue } from "@mkbabb/value.js/value";
import { describe, expect, it } from "vitest";
import {
    buildAuthoredSink,
    compileValuePair,
    interpolateCompiledValue,
    parseAndFlattenObject,
    refreshAuthoredSink,
    serializeCompiledValue,
} from "../../src/animation/compile/value-ast";
import { bumpLayoutEpoch } from "../../src/animation/resolve/browser";

const parse = (source: string): CssValue => {
    const result = parseCssValues(source);
    if (!result.ok) throw new TypeError(`Fixture did not parse: ${source}`);
    return result.value;
};

const compile = (from: string, to: string, property = "transform") =>
    compileValuePair(parse(from), parse(to), {
        colorSpace: "oklab",
        property,
    });

describe("Value 4 structural interpolation kernel", () => {
    it("interpolates compatible numeric units without residual producer leaves", () => {
        const value = compile("10deg", "0.5turn");

        interpolateCompiledValue(value, 0.5);

        expect(value.slots).toHaveLength(1);
        expect(value.slots[0]).toMatchObject({
            kind: "number",
            from: 10,
            to: 180,
            current: 95,
            unit: "deg",
        });
        expect(serializeCompiledValue(value)).toBe("95deg");
    });

    it("refuses incompatible dimensions explicitly", () => {
        expect(() => compile("1s", "2deg", "animation-delay")).toThrow(
            'Cannot interpolate incompatible CSS units "s" and "deg"',
        );
    });

    it("pads missing known functions with explicit CSS identities", () => {
        const value = compile("blur(4px)", "brightness(2)", "filter");

        expect(serializeCompiledValue(value)).toBe("blur(4px) brightness(1)");
        interpolateCompiledValue(value, 1);
        expect(serializeCompiledValue(value)).toBe("blur(0px) brightness(2)");
    });

    it("refuses a missing function identity instead of inventing a fallback", () => {
        expect(() => compile("custom-fn(1)", "blur(2px)")).toThrow(
            'No interpolation identity is defined for CSS function "custom-fn"',
        );
    });

    it("compiles computed endpoints target-free, then resolves once per layout epoch", () => {
        const target = document.createElement("div");
        target.style.setProperty("--from", "10px");
        document.body.append(target);
        const value = compileValuePair(parse("var(--from)"), parse("30px"), {
            colorSpace: "oklab",
            property: "width",
        });

        expect(serializeCompiledValue(value)).toBe("var(--from)");
        expect(() => interpolateCompiledValue(value, 0.5)).toThrow(
            'requires a browser target at sample time',
        );
        interpolateCompiledValue(value, 0.5, target);
        expect(serializeCompiledValue(value)).toBe("20px");

        target.style.setProperty("--from", "20px");
        interpolateCompiledValue(value, 0.5);
        expect(serializeCompiledValue(value)).toBe("20px");

        bumpLayoutEpoch();
        interpolateCompiledValue(value, 0.5);
        expect(serializeCompiledValue(value)).toBe("25px");
        target.remove();
    });

    it("keeps mixed layout-relative lengths late-bound across layout epochs", () => {
        const target = document.createElement("div");
        document.body.append(target);
        const previousWidth = window.innerWidth;
        const value = compileValuePair(parse("10vw"), parse("20px"), {
            colorSpace: "oklab",
            property: "width",
            target,
        });

        try {
            (window as { innerWidth: number }).innerWidth = 1000;
            bumpLayoutEpoch();
            interpolateCompiledValue(value, 0.5);
            expect(value.slots[0]?.kind).toBe("computed");
            expect(serializeCompiledValue(value)).toBe("60px");

            (window as { innerWidth: number }).innerWidth = 2000;
            bumpLayoutEpoch();
            interpolateCompiledValue(value, 0.5);
            expect(serializeCompiledValue(value)).toBe("110px");
        } finally {
            (window as { innerWidth: number }).innerWidth = previousWidth;
            bumpLayoutEpoch();
            target.remove();
        }
    });

    it("refuses a mixed percentage basis instead of resolving against the wrong box", () => {
        expect(() => compile("translateX(10%)", "translateX(20px)", "transform")).toThrow(
            'Cannot interpolate mixed percentage lengths for "transform"',
        );
    });

    it("expands a singleton shorthand value to the peer list shape", () => {
        const value = compile(
            "50%",
            "40% 60% 60% 40% / 40% 40% 60% 60%",
            "border-radius",
        );

        interpolateCompiledValue(value, 0.5);

        expect(serializeCompiledValue(value)).toBe(
            "45% 55% 55% 45% / 45% 45% 55% 55%",
        );
    });

    it("projects stable authored objects while keeping unitless numbers numeric", () => {
        const left = parseAndFlattenObject({ opacity: 0, nested: { x: "10px" } });
        const right = parseAndFlattenObject({ opacity: 1, nested: { x: "30px" } });
        const values = Object.fromEntries(
            Object.keys(left).map((key) => [
                key,
                compileValuePair(left[key]!, right[key]!, {
                    colorSpace: "oklab",
                    property: key,
                }),
            ]),
        );
        const sink = buildAuthoredSink(values);

        for (const value of Object.values(values)) {
            interpolateCompiledValue(value, 0.5);
        }
        refreshAuthoredSink(sink);

        expect(sink.root).toEqual({ opacity: 0.5, nested: { x: "20px" } });
        expect(sink.flat).toEqual({ opacity: 0.5, "nested.x": "20px" });
    });

    it("mixes colors through Value 4 and serializes only at the boundary", () => {
        const value = compile("red", "blue", "color");

        interpolateCompiledValue(value, 0.5);

        expect(value.slots[0]?.kind).toBe("color");
        expect(serializeCompiledValue(value)).toMatch(/^oklab\(/);
    });
});
