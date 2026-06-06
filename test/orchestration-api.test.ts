import { afterEach, describe, expect, it } from "vitest";
import { createNativeTimeline } from "../src/animation/timeline";
import { cssTwinFor, toEasing } from "../src/animation/easing";
import type { Easing, TimingFunction } from "../src/animation/constants";

/**
 * F.W3 — the two LIGHT public-API edges exercised in isolation (a-test-quality
 * §3). Both surfaces are reached transitively elsewhere (`createNativeTimeline`
 * inside `platform-adopt.test.ts`'s S5 bridge clauses; `toEasing` incidentally
 * through the light engines), but a consumer calling them DIRECTLY depends on
 * the isolated contract — the guard-absent fallback and the `{ fn, css? }`
 * normalization. These lock that contract directly, with named BITEs.
 */

describe("createNativeTimeline — guard-absent fallback (public-API edge)", () => {
    // The native ScrollTimeline / ViewTimeline globals do not exist in jsdom.
    // Tests that INSTALL one restore the absent baseline afterward so the
    // guard-absent assertions below are not contaminated by an earlier install.
    afterEach(() => {
        delete (globalThis as { ScrollTimeline?: unknown }).ScrollTimeline;
        delete (globalThis as { ViewTimeline?: unknown }).ViewTimeline;
    });

    it("returns null for kind:'scroll' when globalThis.ScrollTimeline is absent", () => {
        // Precondition (verify, do not assert): the native global is absent.
        expect(
            (globalThis as { ScrollTimeline?: unknown }).ScrollTimeline,
        ).toBeUndefined();
        // The documented guard-absent result is `null` — the caller then keeps
        // the JS Timeline sampler. It must NOT throw on the missing global.
        expect(createNativeTimeline({ kind: "scroll" })).toBeNull();
    });

    it("returns null for kind:'view' when globalThis.ViewTimeline is absent", () => {
        const subject = document.createElement("div");
        expect(
            (globalThis as { ViewTimeline?: unknown }).ViewTimeline,
        ).toBeUndefined();
        expect(createNativeTimeline({ kind: "view", subject })).toBeNull();
    });

    it("does not throw at the guard — it returns the fallback, never rejects", () => {
        // BITE: a throw here (instead of the documented null) reds — a direct
        // consumer relies on the guard being a soft fallback, not an exception.
        expect(() => createNativeTimeline({ kind: "scroll" })).not.toThrow();
    });

    it("BITE: with the native global INSTALLED, the same call constructs (non-null)", () => {
        // The negative control for the guard: when the platform DOES expose the
        // constructor, createNativeTimeline returns a native timeline, not null.
        // If the guard branch were unconditional, this would still be null and
        // red — so the install-then-construct path proves the guard is the
        // detect, not a hard-coded null.
        class FakeScrollTimeline {
            source: Element | null = null;
            constructor(_opts?: unknown) {}
        }
        (globalThis as { ScrollTimeline?: unknown }).ScrollTimeline =
            FakeScrollTimeline;
        const tl = createNativeTimeline({ kind: "scroll" });
        expect(tl).not.toBeNull();
        expect(tl).toBeInstanceOf(FakeScrollTimeline);
    });
});

describe("toEasing — the sync light-engine normalizer (public-API edge)", () => {
    it("wraps a passthrough callable into { fn } (identity reference, no css)", () => {
        const fn: TimingFunction = (t) => t;
        const easing = toEasing(fn);
        // The callable is carried through by reference — no re-wrap, no clone.
        expect(easing.fn).toBe(fn);
        // A bare callable has no faithful CSS twin.
        expect(easing.css).toBeUndefined();
        // The fn behaves as the passthrough it was.
        expect(easing.fn(0.37)).toBeCloseTo(0.37, 12);
    });

    it("wraps a non-trivial callable, preserving the curve", () => {
        const quad: TimingFunction = (t) => t * t;
        const easing = toEasing(quad);
        expect(easing.fn).toBe(quad);
        expect(easing.fn(0.5)).toBeCloseTo(0.25, 12);
    });

    it("passes a typed Easing through unchanged (identity, css retained)", () => {
        // A pre-typed Easing (e.g. a cubic-bezier twin a caller resolved) is
        // returned BY REFERENCE — toEasing does not re-allocate or strip css.
        const input: Easing = {
            fn: (t) => t,
            css: "cubic-bezier(0.4, 0, 0.2, 1)",
        };
        const out = toEasing(input);
        expect(out).toBe(input);
        expect(out.css).toBe("cubic-bezier(0.4, 0, 0.2, 1)");
    });

    it("passes a typed Easing carrying a steps() css twin through unchanged", () => {
        const input: Easing = { fn: (t) => Math.floor(t * 4) / 4, css: "steps(4, jump-end)" };
        expect(toEasing(input)).toBe(input);
        expect(toEasing(input).css).toBe("steps(4, jump-end)");
    });

    it("passes a typed Easing carrying a named CSS keyword twin through unchanged", () => {
        const input: Easing = { fn: (t) => t, css: "ease-in-out" };
        expect(toEasing(input)).toBe(input);
        expect(toEasing(input).css).toBe("ease-in-out");
    });

    it("BITE: a function input never carries css; a typed input never loses it", () => {
        // The discriminant: a callable → { fn } with css UNDEFINED; a typed
        // Easing → SAME object (css preserved). Collapsing the two branches
        // (e.g. always wrapping) would red the identity assertions above.
        const fnEasing = toEasing((t) => t);
        const typedEasing = toEasing({ fn: (t) => t, css: "linear" });
        expect(fnEasing.css).toBeUndefined();
        expect(typedEasing.css).toBe("linear");
    });
});

/**
 * The CSS-twin discriminant that `toEasing` relies on for the named/literal
 * forms (a typed Easing's `css` is produced by `cssTwinFor` at resolve time).
 * Locking it here ties the normalizer's representative named/cubic-bezier/steps
 * inputs to a faithful twin (and the bespoke-curve rejection — no twin).
 */
describe("cssTwinFor — the faithful CSS twin discriminant (normalizer support)", () => {
    it("maps the native keyword forms to themselves", () => {
        for (const kw of ["linear", "ease", "ease-in", "ease-out", "ease-in-out"]) {
            expect(cssTwinFor(kw)).toBe(kw);
        }
    });

    it("maps cubic-bezier() and steps() literals to themselves", () => {
        expect(cssTwinFor("cubic-bezier(0.4, 0, 0.2, 1)")).toBe(
            "cubic-bezier(0.4, 0, 0.2, 1)",
        );
        expect(cssTwinFor("steps(4, jump-end)")).toBe("steps(4, jump-end)");
        expect(cssTwinFor("step-start")).toBe("step-start");
        expect(cssTwinFor("step-end")).toBe("step-end");
    });

    it("BITE: a bespoke value.js curve name has NO faithful twin (undefined)", () => {
        // `easeOutCubic` / `bounceInEase` are real registry curves but map to NO
        // CSS keyword — a silent twin here would mis-delegate to the compositor.
        expect(cssTwinFor("easeOutCubic")).toBeUndefined();
        expect(cssTwinFor("bounceInEase")).toBeUndefined();
        expect(cssTwinFor("not-a-real-easing")).toBeUndefined();
    });
});
