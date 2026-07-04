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
import { parseLinearStops } from "@mkbabb/value.js";
import { CSSKeyframesAnimation } from "../src/animation/engine";
import { CSSKeyframesToString, serializeEasing } from "../src/animation/compile/backward/format";
import { springTimingFunction } from "../src/animation/physics/spring";

const keyframesBlock = (css: string): string =>
    css.slice(css.indexOf("@keyframes"));

/**
 * L.W9 S7 — the un-normalized `linear()` round-trip PENDING guard.
 *
 * value.js's stylesheet serializer (`FunctionValue.toString()`) emits a
 * `linear()`'s stops as a FLAT COMMA list — `linear(0, 0.5, 25%, 1)` — a form
 * its OWN `parseLinearStops` REJECTS (the canonical form is space-joined
 * `linear(0, 0.5 25%, 1)`). kf carries the workaround at `utils.ts:185–196`
 * (the `,\s*<num>%` → ` <num>%` regex) to fold the asymmetry. S7 dispatches the
 * cure to value.js Tranche O (VJ-L2: fix `FunctionValue.toString()` to emit the
 * space-separated form its parser accepts).
 *
 * The arm below exercises the EXACT serializer→parser path WITHOUT the kf regex.
 * Today the flat-comma form THROWS at `parseLinearStops`, so the arm must be
 * PENDING (skipped-with-reason) — NOT a failure that reds proof:roundtrip-easing.
 *
 * This FEATURE PROBE resolves the PENDING state at runtime, offline (no registry
 * call): it asks the INSTALLED value.js whether its `parseLinearStops` now
 * accepts the flat-comma form. Today → false (VJ-L2 not landed) → the arm skips.
 * After kf re-pins value.js to the VJ-L2 cut → the un-normalized form parses →
 * the probe flips true → the arm RUNS (and asserts the round-trip). Self-
 * resolving; it can never red the suite while VJ-L2 is unpublished.
 */
const VJ_L2_FLAT_COMMA_PROBE = "linear(0, 0.5, 25%, 1)";
const vjL2LinearLanded: boolean = (() => {
    try {
        // VJ-L2 lands when value.js's parser accepts the flat-comma stop form
        // its serializer emits (today it throws — the asymmetry kf's regex folds).
        parseLinearStops(VJ_L2_FLAT_COMMA_PROBE);
        return true;
    } catch {
        return false;
    }
})();

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
        const tf = b.templateFrames.find((f) => f.start.value === 0);
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
        const tf = b.templateFrames.find((f) => f.start.value === 0);
        expect(tf?.timingFunction).toBeDefined();
        // The linear() curve survived emit → re-parse (E.W7's reader + F.W7's
        // emitter close the round-trip the E.W7 lock left half-open).
        expect(serializeEasing(tf!.timingFunction!)).toContain("linear(");
    });
});

describe("L.W9 S7 — un-normalized linear() round-trip (PENDING until value.js VJ-L2)", () => {
    // PENDING-GUARDED: `it.skipIf(!vjL2LinearLanded)` skips with the VJ-L2 reason
    // while value.js's parser still rejects the flat-comma serializer form. This
    // arm therefore CANNOT red proof:roundtrip-easing today — it is reported as
    // skipped. It RUNS only once kf re-pins value.js to the VJ-L2 cut (the probe
    // flips true), at which point it locks the EXACT serializer→parser path with
    // NO kf regex normalization (S7's deletion pre-condition).
    it.skipIf(!vjL2LinearLanded)(
        "round-trips the value.js serializer's flat-comma linear() WITHOUT the kf normalize regex",
        () => {
            // Build the spring `linear()` curve the engine emits, then SIMULATE
            // value.js's own serializer output: fold each space-joined stop
            // position (` 4.000%`) to the FLAT-COMMA form (`, 4.000%`) the
            // `FunctionValue.toString()` asymmetry produces. This is the EXACT
            // string kf's `utils.ts:185–196` regex exists to normalize.
            const spring = springTimingFunction({
                response: 0.5,
                dampingFraction: 0.45,
            });
            expect(spring.css).toMatch(/^linear\(/);
            const flatComma = spring.css.replace(/\s+(-?[\d.]+%)/g, ", $1");
            expect(flatComma).toContain(", "); // it IS the flat-comma form

            // VJ-L2: value.js's parser accepts the serializer's own output — no
            // kf-side regex fold. Parsing the un-normalized form must NOT throw,
            // and must yield a non-trivial stop list (the round-trip is whole).
            const stops = parseLinearStops(flatComma);
            expect(Array.isArray(stops) ? stops.length : 0).toBeGreaterThan(1);
        },
    );

    it("DOCUMENTS the PENDING reason when VJ-L2 has not landed (always runs)", () => {
        // A non-skipped witness so the suite records WHY the arm above is pending
        // (and proves the probe is wired): today the flat-comma form THROWS, so
        // the engine STILL needs the kf normalize regex; the deletion (S7) is held
        // until VJ-L2 ships. When VJ-L2 lands, `vjL2LinearLanded` flips true and
        // the skipped arm above activates.
        if (!vjL2LinearLanded) {
            // The asymmetry the workaround folds is real on today's value.js.
            expect(() => parseLinearStops(VJ_L2_FLAT_COMMA_PROBE)).toThrow();
        } else {
            // VJ-L2 has landed — the flat-comma form parses cleanly; the kf regex
            // workaround (utils.ts:185–196) is now deletable (proof:workaround-
            // deletion S7 will RED until it is removed).
            expect(() =>
                parseLinearStops(VJ_L2_FLAT_COMMA_PROBE),
            ).not.toThrow();
        }
    });
});
