import { parseKeyframeSelector } from "@mkbabb/value.js/css";
import { describe, expect, it } from "vitest";

describe("Value 4 keyframe-selector contract", () => {
    it("rejects empty and whitespace-only selectors with diagnostics", () => {
        for (const source of ["", "   "]) {
            const result = parseKeyframeSelector(source);
            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.diagnostics[0].code).toBe(
                    "keyframe_selector_invalid",
                );
            }
        }
    });

    it("normalizes percentages and from/to to the [0,1] domain", () => {
        expect(parseKeyframeSelector("50%")).toMatchObject({
            ok: true,
            value: { kind: "percent", value: 0.5 },
        });
        expect(parseKeyframeSelector("from")).toMatchObject({
            ok: true,
            value: { kind: "percent", value: 0 },
        });
        expect(parseKeyframeSelector("to")).toMatchObject({
            ok: true,
            value: { kind: "percent", value: 1 },
        });
    });

    it("parses bare and offset named phases structurally", () => {
        expect(parseKeyframeSelector("entry")).toMatchObject({
            ok: true,
            value: { kind: "named", name: "entry" },
        });
        expect(parseKeyframeSelector("exit 100%")).toMatchObject({
            ok: true,
            value: { kind: "named", name: "exit", offset: 1 },
        });
    });

    it("rejects malformed and out-of-range selectors", () => {
        for (const source of ["101%", "entry 101%", "bogus", "50px"]) {
            expect(parseKeyframeSelector(source).ok).toBe(false);
        }
    });
});
