import { describe, expect, it } from "vitest";
import { AnimationOptionError } from "../../src/animation/internal/errors";
import {
    namedSelectorToFraction,
    parseKeyframeSelector,
} from "../../src/animation/compile/selector";

describe("Value 4 keyframe selector boundary", () => {
    it.each([
        ["from", { kind: "percent", value: 0 }],
        ["FROM", { kind: "percent", value: 0 }],
        ["to", { kind: "percent", value: 1 }],
        ["To", { kind: "percent", value: 1 }],
        ["0%", { kind: "percent", value: 0 }],
        ["50%", { kind: "percent", value: 0.5 }],
        ["100%", { kind: "percent", value: 1 }],
    ] as const)("normalizes %s", (source, expected) => {
        expect(parseKeyframeSelector(source)).toEqual(expected);
    });

    it.each([
        ["entry", { kind: "named", name: "entry" }],
        ["ENTRY 50%", { kind: "named", name: "entry", offset: 0.5 }],
        ["exit 100%", { kind: "named", name: "exit", offset: 1 }],
    ] as const)("normalizes named selector %s", (source, expected) => {
        expect(parseKeyframeSelector(source)).toEqual(expected);
    });

    it.each(["", "   ", "abc", "150%", "-1%", "entry -1%", "entry 101%"])(
        "translates Value diagnostics for %j",
        (source) => {
            let error: unknown;
            try {
                parseKeyframeSelector(source);
            } catch (caught) {
                error = caught;
            }
            expect(error).toBeInstanceOf(AnimationOptionError);
            expect((error as Error).message).toContain(
                "keyframe_selector_invalid",
            );
            if (source.trim() === "") {
                expect((error as AnimationOptionError).code).toBe(
                    "EMPTY_PARSE",
                );
            }
        },
    );

    it("resolves normalized named offsets through Keyframes phase semantics", () => {
        const entry = parseKeyframeSelector("entry 50%");
        const exit = parseKeyframeSelector("exit 100%");
        expect(namedSelectorToFraction(entry)).toBeCloseTo(0.125, 12);
        expect(namedSelectorToFraction(exit)).toBe(1);
    });
});
