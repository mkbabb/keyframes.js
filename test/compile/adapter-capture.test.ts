/**
 * adapter-capture.test.ts — F.W8 (capture the dropped adapter metadata).
 * proof:adapter-capture.
 *
 *  (a) the sibling style-rule `animation` shorthand takes effect as the option
 *      BASE, with the constructor-explicit options overriding it (resolved.options
 *      was computed then never consumed — a dead documented field);
 *  (b) per-keyframe `animation-composition` is captured on ResolvedKeyframes
 *      (value.js parses it; the adapter used to drop it);
 *  (c) the wrapBareKeyframes detection decides on the AST, so a leading
 *      `/* @keyframes *​/` comment no longer defeats it (the PX-1 comment-defeat).
 */
import { describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../../src/animation/engine";
import { resolveKeyframes } from "../../src/animation/compile/adapter";

const sheet = `
    .foo { animation: 2s ease-in-out infinite alternate; }
    @keyframes foo { from { opacity: 0; } to { opacity: 1; } }
`;

describe("F.W8 (a) — the style-rule animation shorthand is applied", () => {
    it("the parsed shorthand takes effect when the constructor sets nothing", () => {
        const a = new CSSKeyframesAnimation().fromString(sheet);
        expect(a.options.duration).toBe(2000);
        expect(a.options.direction).toBe("alternate");
        expect(a.options.iterationCount).toBe(Infinity);
    });

    it("constructor-explicit options OVERRIDE the parsed shorthand", () => {
        const a = new CSSKeyframesAnimation({ duration: 500 }).fromString(sheet);
        // ctor wins on duration…
        expect(a.options.duration).toBe(500);
        // …but the shorthand still supplies what the ctor left unset.
        expect(a.options.direction).toBe("alternate");
        expect(a.options.iterationCount).toBe(Infinity);
    });

    it("is byte-identical (no option change) when there is no style rule", () => {
        const a = new CSSKeyframesAnimation().fromString(
            "@keyframes foo { from { opacity: 0; } to { opacity: 1; } }",
        );
        expect(a.options.duration).toBe(1000); // the engine default, untouched
        expect(a.options.direction).toBe("normal");
    });
});

describe("F.W8 (b) — per-keyframe composition is captured", () => {
    it("surfaces rule.composition on ResolvedKeyframes (was dropped)", () => {
        const resolved = resolveKeyframes(
            "@keyframes x { 0% { opacity: 0; animation-composition: add; } 100% { opacity: 1; } }",
        );
        expect(resolved.composition.get("0%")).toBe("add");
        expect(resolved.composition.has("100%")).toBe(false);
    });
});

describe("F.W8 (c) — wrapBareKeyframes decides on the AST", () => {
    it("a leading @keyframes comment no longer defeats bare-list detection", () => {
        const a = new CSSKeyframesAnimation().fromString(
            "/* @keyframes foo */ from { opacity: 0; } to { opacity: 1; }",
        );
        // The comment-defeat bug parsed this to ZERO frames (the regex matched
        // @keyframes inside the comment, skipped the wrap, the grammar rejected
        // the bare list). AST-decide re-wraps it → two template stops.
        expect(a.templateFrames.length).toBe(2);
    });

    it("a plain bare list still wraps + parses", () => {
        const a = new CSSKeyframesAnimation().fromString(
            "from { opacity: 0; } to { opacity: 1; }",
        );
        expect(a.templateFrames.length).toBe(2);
    });
});
