/**
 * emerging-css-resolve-now.test.ts — P.W13 (the emerging-CSS lowering pass,
 * Phase-1 element-INDEPENDENT arm). `proof:emerging-css-resolve-NOW` (behaviour).
 *
 * A live, OBSERVABLE-TRUTH gate (the resolution is real, not a grep) over the
 * `resolve-values.ts` lowering pass — all jsdom-clean, NO browser, NO HW-accel
 * sub-claim (the WebKit native-parity assertion is DROPPED per the full-loop
 * RE-SCOPE — it double-gates `proof:browser` and asserts an unattainable
 * `maxDiff≈0.47` parity).
 *
 * Born-RED before the cure: `resolve-values.ts` did not exist; the `if(...)` /
 * `spring(...)` value reached the frame compiler as an unresolved `FunctionValue`
 * (flattening to a raw string leaf at `utils.ts`) and the animation never
 * produced the conditional/spring outcome.
 *
 * The HEAVY surface is reached as the engine tests do: `resolveKeyframes` from
 * the adapter + the spring helpers from `resolve-values.ts`.
 */
import { describe, expect, it } from "vitest";
import { parseCssValue } from "@mkbabb/value.js/css";
import type { CssCall, CssValue } from "@mkbabb/value.js/value";
import { resolveKeyframes } from "../../src/animation/compile/adapter";
import { serializeCssValue } from "../../src/animation/compile/emit/css-text";
import {
    resolveSpringTiming,
    springCssToOptions,
} from "../../src/animation/resolve";
import { springTimingFunction } from "../../src/animation/physics/spring";

/** The concrete color string a resolved keyframe value carries at a stop. */
const stopValue = (
    resolved: ReturnType<typeof resolveKeyframes>,
    percent: string,
    prop: string,
): string | undefined => {
    const frame = resolved.keyframes.get(percent);
    if (!frame || !(prop in frame)) return undefined;
    return serializeCssValue(frame[prop] as CssValue);
};

describe("P.W13 — emerging-css-resolve-NOW (Phase-1 element-independent)", () => {
    // ── Item 1: if() → resolved concrete color ──────────────────────────────
    it("if(supports(...)) resolves to the TRUE branch when supports() returns true", () => {
        const resolved = resolveKeyframes(
            "@keyframes x {\n" +
                "  0% { color: if(supports(color: lch(0 0 0)): red; else: blue) }\n" +
                "  100% { color: green }\n" +
                "}",
            { supports: () => true },
        );
        // The compiled frame holds the RESOLVED color (red), NOT the literal
        // if(...) string. value.js parses `red` → `rgb(255 0 0)`.
        expect(stopValue(resolved, "0%", "color")).toBe("rgb(255 0 0)");
    });

    it("if(supports(...)) resolves to the ELSE branch when supports() returns false", () => {
        const resolved = resolveKeyframes(
            "@keyframes x {\n" +
                "  0% { color: if(supports(color: lch(0 0 0)): red; else: blue) }\n" +
                "  100% { color: green }\n" +
                "}",
            { supports: () => false },
        );
        expect(stopValue(resolved, "0%", "color")).toBe("rgb(0 0 255)");
    });

    it("if(media(...)) resolves to the TRUE branch when matchMedia matches", () => {
        const resolved = resolveKeyframes(
            "@keyframes x {\n" +
                "  0% { width: if(media(min-width: 600px): 10px; else: 20px) }\n" +
                "  100% { width: 100px }\n" +
                "}",
            { matchMedia: () => ({ matches: true }) },
        );
        expect(stopValue(resolved, "0%", "width")).toBe("10px");
    });

    it("if(media(...)) resolves to the ELSE branch when matchMedia does NOT match", () => {
        const resolved = resolveKeyframes(
            "@keyframes x {\n" +
                "  0% { width: if(media(min-width: 600px): 10px; else: 20px) }\n" +
                "  100% { width: 100px }\n" +
                "}",
            { matchMedia: () => ({ matches: false }) },
        );
        expect(stopValue(resolved, "0%", "width")).toBe("20px");
    });

    // ── Item 1 (DROP): guaranteed-invalid if() with no branch + no else ─────
    it("if() with no matching branch and NO else DROPS the declaration (omitted, not '')", () => {
        const resolved = resolveKeyframes(
            "@keyframes x {\n" +
                "  0% { color: if(supports(color: lch(0 0 0)): red) }\n" +
                "  100% { color: green }\n" +
                "}",
            { supports: () => false },
        );
        const frame = resolved.keyframes.get("0%");
        // The declaration is OMITTED — the frame does NOT carry `color` (the CSS
        // guaranteed-invalid rule: prior/initial value wins). It is NOT an
        // empty-string value (which would corrupt interpolation).
        expect(frame).toBeDefined();
        expect("color" in (frame ?? {})).toBe(false);
    });

    // ── SSR-safe default: no env injection → deterministic else branch ──────
    it("with NO env injection (SSR/jsdom default), supports → false → else branch", () => {
        // jsdom has no faithful CSS.supports; the default resolves to `false`
        // deterministically, so the else branch wins (never a thrown
        // ReferenceError, never a non-deterministic outcome).
        const resolved = resolveKeyframes(
            "@keyframes x {\n" +
                "  0% { color: if(supports(weird-prop: 1): red; else: blue) }\n" +
                "  100% { color: green }\n" +
                "}",
        );
        // Either resolves to the else branch (blue) deterministically — the key
        // invariant is it RESOLVED (a concrete color), not the literal if(...).
        const v = stopValue(resolved, "0%", "color");
        expect(v).toBeDefined();
        expect(v).not.toContain("if(");
        // jsdom's CSS.supports returns false for the bogus prop → else (blue).
        expect(v).toBe("rgb(0 0 255)");
    });

    // ── Item 2a: spring() → kf-curve sample-equality ────────────────────────
    it("spring(1 100 10 0) → a curve sample-EQUAL to springTimingFunction({response, dampingFraction})", () => {
        const parsed = parseCssValue("spring(1 100 10 0)");
        expect(parsed.ok).toBe(true);
        if (!parsed.ok || parsed.value.kind !== "call") {
            throw new TypeError("spring fixture did not produce a CssCall");
        }
        const fn: CssCall = parsed.value;
        expect(fn.name).toBe("spring");

        // kf OWNS the physics: springCssToOptions maps (m,k,c,v0) →
        // (response, dampingFraction) by the 2nd-order ODE algebra.
        const { response, dampingFraction } = springCssToOptions([1, 100, 10, 0]);
        // response = 2π√(m/k) = 2π·√(1/100) = 2π/10 ≈ 0.6283
        expect(response).toBeCloseTo((2 * Math.PI) / 10, 9);
        // dampingFraction = c/(2√(km)) = 10/(2·√(100)) = 10/20 = 0.5
        expect(dampingFraction).toBeCloseTo(0.5, 9);

        // The resolved Easing is sample-equal (eps < 1e-6) to the kf curve at
        // the same (response, dampingFraction) — the self-consistent settle
        // horizon response·4. (The WebKit HW-accel sub-assertion is DROPPED —
        // it double-gates proof:browser + asserts unattainable native parity.)
        const resolved = resolveSpringTiming(fn);
        const direct = springTimingFunction({ response, dampingFraction });
        for (let i = 0; i <= 20; i++) {
            const t = i / 20;
            expect(resolved.fn(t)).toBeCloseTo(direct.fn(t), 6);
        }
        // Endpoints are exact.
        expect(resolved.fn(0)).toBe(0);
        expect(resolved.fn(1)).toBe(1);
    });

    it("spring() fills kf-owned defaults for omitted positionals (mass 1 / stiffness 100 / damping 10 / velocity 0)", () => {
        // The generic value.js producer fills nothing; kf does. spring(1 100 10)
        // (velocity omitted) must equal spring(1 100 10 0).
        const a = springCssToOptions([1, 100, 10]);
        const b = springCssToOptions([1, 100, 10, 0]);
        expect(a.response).toBeCloseTo(b.response, 12);
        expect(a.dampingFraction).toBeCloseTo(b.dampingFraction, 12);
        expect(a.initialVelocity).toBe(b.initialVelocity);
        // A non-positive mass/stiffness falls back to the default (never a NaN
        // curve) — kf-owned validation.
        const guarded = springCssToOptions([0, 0, -5]);
        expect(Number.isFinite(guarded.response)).toBe(true);
        expect(Number.isFinite(guarded.dampingFraction)).toBe(true);
        expect(guarded.response).toBeGreaterThan(0);
    });
});
