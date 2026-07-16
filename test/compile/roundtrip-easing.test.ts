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
import { CSSKeyframesAnimation } from "../../src/animation/engine";
import { CSSKeyframesToString } from "../../src/animation/compile/emit/format";
import { serializeEasing } from "../../src/animation/compile/emit/easing-serialize";
import { springTimingFunction } from "../../src/animation/physics/spring";

const keyframesBlock = (css: string): string =>
    css.slice(css.indexOf("@keyframes"));

const startsAtZero = (frame: CSSKeyframesAnimation<any>["templateFrames"][number]) =>
    frame.start.kind === "percent" && frame.start.value === 0;

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
        const tf = b.templateFrames.find(startsAtZero);
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

describe("G.W4 — serializeEasing fail-explicit on an unrepresentable closure", () => {
    it("THROWS on a custom closure with no CSS twin (negative control)", () => {
        // A non-registry, no-`.css` closure has no faithful CSS twin — the
        // serializer must THROW naming the option + the remedy, not silently
        // emit a WRONG "linear" that discards the curve. BITE: restoring the
        // `?? "linear"` makes this return "linear" with no throw.
        expect(() => serializeEasing({ fn: (t) => t * t * t })).toThrow(
            /timingFunction/,
        );
        expect(() => serializeEasing({ fn: (t) => t * t * t })).toThrow(
            /Easing\.css twin/,
        );
    });

    it("STILL serializes a genuine registry linear to \"linear\", provably distinguished from the degraded case (positive control)", async () => {
        // A genuinely-`linear` registry easing — parsed from
        // `animation-timing-function: linear` — reverse-resolves to "linear".
        // This is the F.W7 byte-stable case; the assertion is re-grounded so it
        // can no longer pass on a silently-degraded value: the registry `linear`
        // serializes "linear" AND a closure NOT equal to that registry `linear`
        // throws — so "faithfully linear" and "silently degraded to linear" are
        // provably distinct. BITE (no over-reach): make the throw fire before the
        // reverse-lookup resolves → the registry-`linear` serialization reds.
        const a = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "0% { opacity: 0; animation-timing-function: linear; } 100% { opacity: 1; }",
        );
        const out = await CSSKeyframesToString(a);
        const b = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            keyframesBlock(out),
        );
        const tf = b.templateFrames.find(startsAtZero);
        expect(tf?.timingFunction).toBeDefined();
        const registryLinear = tf!.timingFunction!;

        // The registry `linear` serializes "linear" (no over-reach).
        expect(serializeEasing(registryLinear)).toBe("linear");
        // A closure that is NOT the registry `linear` throws — the distinction
        // the prior `=== "linear"` lock could not draw.
        const closure = (t: number) => t * t * t;
        expect(closure).not.toBe(registryLinear.fn);
        expect(() => serializeEasing({ fn: closure })).toThrow();
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
        const tf = b.templateFrames.find(startsAtZero);
        expect(tf?.timingFunction).toBeDefined();
        // The linear() curve survived emit → re-parse (E.W7's reader + F.W7's
        // emitter close the round-trip the E.W7 lock left half-open).
        expect(serializeEasing(tf!.timingFunction!)).toContain("linear(");
    });
});
