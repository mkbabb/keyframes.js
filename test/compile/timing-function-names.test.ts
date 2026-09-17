/**
 * timing-function-names.test.ts — X.KF.W4 `.e` / **G-KFW4-13** (name/identity
 * honesty; KF-CB-18 + KF-CB-24 + KF-CB-29).
 *
 * The defect this locks is a TYPE that lied about a RUNTIME roster, in both
 * directions at once:
 *
 * 1. **`TimingFunctionNames` advertised `"steps"`** — a name the registry does
 *    not carry and the CSS Easing L1 grammar rejects in its bare form
 *    (`steps()` needs its count + jump term), so the published union invited a
 *    value that `resolveTimingFunction` THROWS on. An advertised member that
 *    cannot be constructed is a type-level false claim, not a convenience.
 * 2. **`InputAnimationOptions["timingFunction"]` carried a `| string` arm**,
 *    which made `tsc` green on *every* string — so the union above was
 *    decorative at the only surface a consumer actually writes through. That
 *    arm is the mechanism by which the value.js `bounceInEase` → `easeInBounce`
 *    rename shipped with a green typecheck over a name that had ceased to
 *    exist.
 *
 * The oracle is deliberately NOT self-derived (G-L7 rule (e)): the union's
 * members are enumerated here from the TYPE (with a compile-time exhaustiveness
 * bite, so a member added to `types.ts` and not to this roster reddens the
 * program) and compared against the REGISTRY's own runtime roster
 * (`timingFunctionEntries`, built at module evaluation in
 * `compile/easing/registry.ts`). Two independently-authored sets; the gate is
 * their equality.
 *
 * Each clause carries its own BITE (what edit makes it red).
 */
import { describe, expect, it } from "vitest";
import {
    resolveTimingFunction,
    timingFunctionEntries,
} from "../../src/animation/compile/easing/registry";
import type {
    InputAnimationOptions,
    TimingFunctionNames,
} from "../../src/animation/constants/types";

/**
 * Every member of the published union, written out. `satisfies` proves each
 * entry IS a member; `assertNoneMissing` below proves no member is absent — the
 * two together make this array the union, checked in both directions.
 */
const TIMING_FUNCTION_NAMES = [
    // `BezierPresetName` — value.js's `bezierPresets` keys (30).
    "linear",
    "ease",
    "ease-in",
    "ease-out",
    "ease-in-out",
    "smooth-step-3",
    "ease-in-sine",
    "ease-out-sine",
    "ease-in-out-sine",
    "ease-in-quad",
    "ease-out-quad",
    "ease-in-out-quad",
    "ease-in-cubic",
    "ease-out-cubic",
    "ease-in-out-cubic",
    "ease-in-quart",
    "ease-out-quart",
    "ease-in-out-quart",
    "ease-in-quint",
    "ease-out-quint",
    "ease-in-out-quint",
    "ease-in-expo",
    "ease-out-expo",
    "ease-in-out-expo",
    "ease-in-circ",
    "ease-out-circ",
    "ease-in-out-circ",
    "ease-in-back",
    "ease-out-back",
    "ease-in-out-back",
    // The hyphenated bounce name the registry adds on top of the presets.
    "ease-in-bounce",
    // The camel `DIRECT_NAMES` (9) — the value.js callable curves.
    "easeOutCubic",
    "easeInOutSine",
    "easeInOutCubic",
    "easeInOutQuad",
    "easeInOutExpo",
    "easeInOutCirc",
    "easeOutExpo",
    "smoothStep3",
    "easeInBounce",
] as const satisfies readonly TimingFunctionNames[];

/**
 * Compile-time exhaustiveness. `T` is constrained to `never`, so instantiating
 * it with a union member this roster forgot is a TYPE ERROR at the call site.
 */
const assertNoneMissing = <T extends never>(..._missing: T[]): void => {};

describe("TimingFunctionNames — the published union is the registry roster", () => {
    it("no union member escapes the roster (compile-time)", () => {
        // BITE: add a member to `TimingFunctionNames` without adding it here and
        // `Exclude<…>` stops being `never`, reddening this line under `tsc`.
        assertNoneMissing<
            Exclude<TimingFunctionNames, (typeof TIMING_FUNCTION_NAMES)[number]>
        >();
        expect(TIMING_FUNCTION_NAMES).toHaveLength(40);
    });

    it("the union and the runtime registry are the SAME set", () => {
        const fromType = [...TIMING_FUNCTION_NAMES].sort();
        const fromRegistry = timingFunctionEntries.map(([name]) => name).sort();
        // BITE: a name advertised by the type but absent from `registryNames`
        // (or vice versa) reddens here — the `"steps"` defect's exact shape.
        expect(fromType).toEqual(fromRegistry);
    });

    it.each([...TIMING_FUNCTION_NAMES])(
        "constructs %s without throwing",
        (name) => {
            // BITE: re-advertising a name the registry cannot build (bare
            // `"steps"` was one) reddens here before any consumer sees it.
            expect(() => resolveTimingFunction(name)).not.toThrow();
            const fn = resolveTimingFunction(name);
            expect(fn).toBeTypeOf("function");
            expect(Number.isFinite(fn(0))).toBe(true);
            expect(Number.isFinite(fn(0.5))).toBe(true);
            expect(Number.isFinite(fn(1))).toBe(true);
        },
    );

    it("BITE: bare `steps` is not a member, and throws when constructed", () => {
        expect(TIMING_FUNCTION_NAMES).not.toContain("steps");
        expect(() => resolveTimingFunction("steps")).toThrow(TypeError);
        // The parametric form is a CSS literal, never a registry NAME — it goes
        // through the parser branch and is why `"steps"` bare was never needed.
        expect(() => resolveTimingFunction("steps(4, jump-end)")).not.toThrow();
    });

    it("BITE: the option surface rejects a name the registry does not carry", () => {
        const options: InputAnimationOptions = {
            // @ts-expect-error — `"banana"` is not a `TimingFunctionNames`
            // member. While `types.ts`'s `| string` arm stood, this line
            // COMPILED, and this directive was unused (TS2578) — that was the
            // RED. Deleting the arm is what makes the suppression necessary,
            // so the directive is now the assertion.
            timingFunction: "banana",
        };
        expect(options.timingFunction).toBe("banana");
        expect(() => resolveTimingFunction("banana")).toThrow(TypeError);
    });
});
