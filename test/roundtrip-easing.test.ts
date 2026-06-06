/**
 * roundtrip-easing.test.ts — F.W7 (the serializer round-trip symmetry).
 * proof:roundtrip-easing + proof:spring-roundtrip.
 *
 * `fromString` READS each stop's `animation-timing-function` and stores it on
 * `templateFrame.timingFunction`, but `CSSKeyframesToString` emitted ONLY the
 * top-level curve — so per-stop curves were silently lost on re-parse (a CSS
 * Animations L1 violation, biting the live editor's display-and-reapply seam
 * every keystroke). These lock the symmetry: emit per-keyframe easing when it
 * differs from the default, and round-trip it (named curves AND the engine's own
 * spring `linear()`), while staying byte-stable for uniform easing.
 */
import { describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../src/animation/engine";
import { CSSKeyframesToString, serializeEasing } from "../src/animation/format";
import { springTimingFunction } from "../src/animation/springTimingFunction";

const keyframesBlock = (css: string): string =>
    css.slice(css.indexOf("@keyframes"));

describe("F.W7 — per-keyframe easing round-trip", () => {
    it("emits per-keyframe animation-timing-function when it differs from the default", async () => {
        const a = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "0% { opacity: 0; animation-timing-function: linear; } 50% { opacity: 0.5; animation-timing-function: ease-in; } 100% { opacity: 1; }",
        );
        const out = await CSSKeyframesToString(a);
        const kf = keyframesBlock(out);
        // The per-stop curves the serializer used to drop now ride the @keyframes.
        expect(kf).toMatch(/animation-timing-function:\s*linear/);
        expect(kf).toMatch(/animation-timing-function:\s*ease-in\b/);
    });

    it("round-trips per-keyframe easing through emit → re-parse", async () => {
        const a = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "0% { opacity: 0; animation-timing-function: linear; } 100% { opacity: 1; }",
        );
        const out = await CSSKeyframesToString(a);
        const b = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            keyframesBlock(out),
        );
        const tf = b.templateFrames.find((f) => f.start.value === 0);
        expect(tf).toBeDefined();
        expect(tf!.timingFunction).toBeDefined();
        expect(serializeEasing(tf!.timingFunction!)).toBe("linear");
    });

    it("stays byte-stable for uniform easing (no redundant per-keyframe emission)", async () => {
        const a = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "from { opacity: 0; } to { opacity: 1; }",
        );
        const out = await CSSKeyframesToString(a);
        // The default easing rides the `.class` block; the @keyframes carry NO
        // per-stop animation-timing-function.
        expect(keyframesBlock(out)).not.toMatch(/animation-timing-function/);
    });
});

describe("F.W7 — spring linear() round-trip (proof:spring-roundtrip)", () => {
    it("round-trips the engine's OWN spring linear() per-keyframe emission", async () => {
        const spring = springTimingFunction({
            response: 0.5,
            dampingFraction: 0.45,
        });
        expect(spring.css).toMatch(/^linear\(/);

        const a = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            `0% { opacity: 0; animation-timing-function: ${spring.css}; } 100% { opacity: 1; }`,
        );
        const out = await CSSKeyframesToString(a);
        expect(keyframesBlock(out)).toContain("linear(");

        const b = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            keyframesBlock(out),
        );
        const tf = b.templateFrames.find((f) => f.start.value === 0);
        expect(tf?.timingFunction).toBeDefined();
        // The linear() curve survived emit → re-parse (E.W7's reader + F.W7's
        // emitter close the round-trip the E.W7 lock left half-open).
        expect(serializeEasing(tf!.timingFunction!)).toContain("linear(");
    });
});
