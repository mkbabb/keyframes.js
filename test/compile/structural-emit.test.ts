import { parseCssValues } from "@mkbabb/value.js/css";
import type { CssValue } from "@mkbabb/value.js/value";
import { describe, expect, it } from "vitest";
import { compileToEntry } from "../../src/animation/compile/emit/entry";
import { densifiedKeyframesBlock } from "../../src/animation/compile/emit/densify";
import {
    keyframesBlock,
    premultipliedKeyframesBlock,
} from "../../src/animation/compile/emit/format";
import { serializeCssValue } from "../../src/animation/compile/emit/css-text";
import { toWAAPIKeyframes } from "../../src/animation/waapi/emission";

const parse = (source: string): CssValue => {
    const result = parseCssValues(source);
    if (!result.ok) throw new TypeError(`Fixture did not parse: ${source}`);
    return result.value;
};

const template = (value: number) => ({
    id: value,
    start: { kind: "percent" as const, value },
    vars: {},
    timingFunction: { fn: (progress: number) => progress, css: "linear" },
});

const animation = (parsedVars: Record<string, CssValue>[]) => ({
    parsedVars,
    templateFrames: [template(0), template(1)],
    frames: [
        {
            time: { start: 0, stop: 1_000 },
            transform: () => {},
        },
    ],
    options: {
        duration: 1_000,
        delay: 0,
        iterationCount: 1,
        direction: "normal",
        fillMode: "forwards",
        timingFunction: { fn: (progress: number) => progress, css: "linear" },
        useWAAPI: true,
        respectReducedMotion: false,
        colorSpace: "oklab",
    },
    usesDefaultRenderer: () => true,
});

describe("structural CSS and WAAPI emission", () => {
    it("serializes declared Value 4 ASTs with normalized selector offsets", () => {
        const anim = animation([
            { opacity: parse("0"), transform: parse("translateX(10px)") },
            { opacity: parse("1"), transform: parse("translateX(30px)") },
        ]);

        const block = keyframesBlock(anim as never, "move");

        expect(block).toContain("0% {");
        expect(block).toContain("100% {");
        expect(block).toContain("opacity: 0;");
        expect(block).toContain("transform: translateX(30px);");
    });

    it("premultiplies numeric ASTs immutably and refuses colors", () => {
        const source = parse("translateX(10px)");
        const anim = animation([
            { transform: source },
            { transform: parse("translateX(30px)") },
        ]);

        const result = premultipliedKeyframesBlock(anim as never, "half", 0.5);

        expect(result).toHaveProperty("block");
        if ("block" in result) expect(result.block).toContain("translateX(5px)");
        expect(serializeCssValue(source)).toBe("translateX(10px)");

        const refused = premultipliedKeyframesBlock(
            animation([{ color: parse("red") }, { color: parse("blue") }]) as never,
            "color",
            0.5,
        );
        expect(refused).toEqual({ refused: true, key: "color" });
    });

    it("merges densified colors with declared structural tracks", () => {
        const anim = animation([
            { opacity: parse("0"), color: parse("red") },
            { opacity: parse("1"), color: parse("blue") },
        ]);

        const block = densifiedKeyframesBlock(anim as never, "mixed", {
            keys: ["color"],
            byPct: new Map([
                [0, ["color: oklab(0.6 0.2 0.1);"]],
                [50, ["color: oklab(0.5 0 0);"]],
                [100, ["color: oklab(0.4 0 -0.2);"]],
            ]),
        });

        expect(block).toContain("50% {");
        expect(block).toContain("opacity: 0;");
        expect(block).toContain("opacity: 1;");
    });

    it("canonicalizes entry colors to OKLab without residual color leaves", async () => {
        const anim = animation([
            { opacity: parse("0"), color: parse("red") },
            { opacity: parse("1"), color: parse("blue") },
        ]);

        const result = await compileToEntry({ ".card": { enter: anim as never } });

        expect(result.eligible).toBe(true);
        expect(result.css).toContain("oklab(");
        expect(result.css).toContain("@starting-style");
    });

    it("emits WAAPI keyframes directly from authored primitive samples", () => {
        const anim = {
            options: { duration: 1_000 },
            frames: [{ time: { start: 0, stop: 1_000 } }],
            interpFrames(t: number) {
                return {
                    opacity: t / 1_000,
                    transform: `translateX(${t / 10}px)`,
                };
            },
        };

        const keyframes = toWAAPIKeyframes(anim as never);

        expect(keyframes).toHaveLength(2);
        expect(keyframes[0]).toMatchObject({ offset: 0, opacity: 0 });
        expect(keyframes[1]).toMatchObject({ offset: 1, opacity: 1 });
    });
});
