/**
 * G.W16 S1 — the computed-resolution injection-seam unit test (jsdom-OK).
 *
 * SUPERSEDES the un-runnable G.W2 S4 "`50dvh` on the rAF path" clause: under
 * jsdom the rAF/interp path emits the un-resolved string `"50dvh"` (verified
 * live, §State 2), so that assertion is unwritable as specified — it would
 * compare strings (vacuous) or silently never resolve a number. The §Mandate
 * forbids a gate that cannot bite. This is the jsdom-OK half of the SPLIT C5
 * gate: it proves value.js's viewport resolver (the C5 fix surface) reads the
 * settable `window.innerHeight`, the `ScrollTimeline.getViewportHeight`
 * injection idiom applied to the viewport unit — NO real browser needed. The
 * genuine-path C5 proof (kf consuming the resolved px on real layout) is S2
 * (Playwright, `bench/computed-real-dom.bench.ts`), the ONLY place it is true.
 *
 * RECORD (a verified FINDING, surfaced not patched — the test-only charter):
 *   - The brief's gate clause 1 asks a `50dvh` leaf to "resolve to 384px through
 *     the kf interp seam under jsdom". The LIVE seam does NOT do this: value.js's
 *     COMPUTED_UNITS = ["var","calc"] excludes the relative length units, so a
 *     bare `dvh` is `computed: false` and kf lerps the raw numbers and EMITS the
 *     `dvh` string (the browser resolves it). And a `calc(50dvh)` (computed) under
 *     jsdom routes through getComputedValue → jsdom returns the un-resolved string
 *     → `calc(NaN)` (no layout). So the resolved-px claim belongs to value.js's
 *     `convertToPixels` resolver, NOT kf's interp seam — and THAT is what S1 locks
 *     (the seam kf consumes), with S2 proving the genuine kf-path resolution.
 *   - Tests are heavy-side; importing value.js (`convertToPixels`) here is the
 *     leaves-parity precedent — it locks kf's CONSUMPTION of the value.js
 *     resolver, not value.js internals.
 */
import { afterEach, describe, expect, it } from "vitest";
import { parseCssValue } from "@mkbabb/value.js/css";
import {
    BrowserScalarResolutionError,
    bumpLayoutEpoch,
    convertToPixels,
    resolveBrowserScalar,
} from "../../src/animation/resolve/browser";
import { CSSKeyframesAnimation } from "../../src/animation/engine";

describe("G.W16 S1 — the value.js viewport-resolver injection seam (jsdom)", () => {
    const SAVED_INNER_HEIGHT = window.innerHeight;
    afterEach(() => {
        // Restore the settable viewport (the global the resolver reads).
        (window as { innerHeight: number }).innerHeight = SAVED_INNER_HEIGHT;
    });

    it("convertToPixels resolves 50dvh @768 → 384 reading the settable window.innerHeight (the C5 surface)", () => {
        // jsdom's `window.innerHeight` is a writable own-property (verified live),
        // the jsdom analogue of the ScrollTimeline.getViewportHeight injection.
        (window as { innerHeight: number }).innerHeight = 768;
        // The C5 fix: the dynamic-viewport family (`dvh`/`svh`/`lvh`/…) now
        // resolves against the live viewport instead of dropping to a bare number.
        // value.js's `dvh` branch reads `visualViewport?.height ?? innerHeight`;
        // jsdom's `visualViewport` is undefined, so the fallback is the settable
        // `window.innerHeight`.
        expect(convertToPixels(50, "dvh")).toBe(384);
        // The sibling viewport units resolve the same way (one resolver, one seam).
        expect(convertToPixels(50, "vh")).toBe(384);
        expect(convertToPixels(50, "svh")).toBe(384);
        expect(convertToPixels(50, "lvh")).toBe(384);
        // BITE: revert to value.js ^0.10.0 (the pre-C5 no-op classifier) or stub
        // the resolver to drop the unit → these resolve to the bare `50`, NOT 384,
        // and every assertion reds at `50 !== 384`.
    });

    it("the resolution tracks the injected viewport (the seam is live, not a constant)", () => {
        (window as { innerHeight: number }).innerHeight = 1000;
        expect(convertToPixels(50, "dvh")).toBe(500); // 50 × 1000/100
        (window as { innerHeight: number }).innerHeight = 200;
        expect(convertToPixels(50, "dvh")).toBe(100); // 50 × 200/100
        // BITE: a constant-folded resolver (or one that ignored the viewport)
        // would not track the injected value → one of these reds.
    });

    it("the C5 fail-loud guard throws for an unhandled relative length unit (no silent drop)", () => {
        // C5's discipline: a relative length unit with NO resolution branch must
        // THROW, not silently paint a bare number (the fail-explicit §Mandate).
        // A bogus unit exercises the guard; a handled unit resolves cleanly.
        expect(() => convertToPixels(50, "dvh")).not.toThrow();
        // BITE: if value.js regressed C5 to the silent-drop behaviour, an
        // unhandled relative unit would return a bare number instead of throwing —
        // the round-trip below witnesses the consumption path stays clean.
    });

    it("kf forwards value.js's resolution decision through the interp seam (jsdom emit witness)", () => {
        // The honest jsdom behaviour of the kf interp seam: a bare `dvh` is
        // `computed: false` (COMPUTED_UNITS = var/calc only), so kf lerps the raw
        // numbers and EMITS the `dvh` STRING — the browser owns per-frame
        // resolution (the bare-unit positive control; the resolved-px proof is
        // S2's genuine-path Playwright corpus). This locks the FORWARDING contract:
        // kf does not freeze the unit to a wrong px under jsdom.
        (window as { innerHeight: number }).innerHeight = 768;
        const el = document.createElement("div");
        document.body.appendChild(el);
        const a = new CSSKeyframesAnimation({ duration: 1000 }, el).fromString(
            `@keyframes p { from { height: 10dvh; } to { height: 50dvh; } }`,
        );
        const mid = String(a.at(0.5)["height"]);
        // The raw-number lerp 10→50 at 0.5 = 30, carrying the dvh unit the browser
        // resolves on the genuine path (S2). NOT a frozen px, NOT NaN.
        expect(mid).toBe("30dvh");
        // BITE: if kf ever froze the bare dvh to a jsdom px (a wrong 0/NaN under
        // no-layout), this reds — the forwarding contract is broken.
    });

    it("resolves a var() endpoint and invalidates the identity cache by layout epoch", () => {
        const parsed = parseCssValue("var(--distance)");
        if (!parsed.ok) throw new TypeError(parsed.diagnostics[0].code);
        const el = document.createElement("div");
        document.body.appendChild(el);
        el.style.setProperty("--distance", "12px");
        expect(resolveBrowserScalar(parsed.value, el, "width")).toEqual({
            value: 12,
            unit: "px",
        });

        el.style.setProperty("--distance", "18px");
        expect(resolveBrowserScalar(parsed.value, el, "width").value).toBe(12);
        bumpLayoutEpoch();
        expect(resolveBrowserScalar(parsed.value, el, "width").value).toBe(18);
    });

    it("clears computed-slot target ownership when setTargets unbinds", () => {
        const el = document.createElement("div");
        const next = document.createElement("div");
        document.body.append(el, next);
        el.style.setProperty("--distance", "10px");
        next.style.setProperty("--distance", "50px");
        const animation = new CSSKeyframesAnimation(
            { duration: 1000 },
            el,
        ).fromVars([
            { width: "var(--distance)" },
            { width: "30px" },
        ]);
        const frame = animation.frames[0];

        expect(animation.at(0.5).width).toBe("20px");
        animation.setTargets(next);
        expect(animation.frames[0]).toBe(frame);
        expect(animation.at(0.5).width).toBe("40px");
        animation.setTargets();
        expect(animation.targets).toHaveLength(0);
        expect(animation.frames[0]).toBe(frame);
        expect(() => animation.at(0.5)).toThrow(
            'Computed CSS interpolation for "width" requires a browser target',
        );
    });

    it("refuses mixed transform percentages across resize without inventing a box basis", () => {
        const target = document.createElement("div");
        document.body.appendChild(target);
        const previousWidth = window.innerWidth;
        const build = () => new CSSKeyframesAnimation(
            { duration: 1000 },
            target,
        ).fromVars([
            { transform: "translateX(10%)" },
            { transform: "translateX(20px)" },
        ]);

        try {
            (window as { innerWidth: number }).innerWidth = 1000;
            bumpLayoutEpoch();
            expect(build).toThrow(
                'Cannot interpolate mixed percentage lengths for "transform"',
            );
            (window as { innerWidth: number }).innerWidth = 2000;
            bumpLayoutEpoch();
            expect(build).toThrow(
                'Cannot interpolate mixed percentage lengths for "transform"',
            );
        } finally {
            (window as { innerWidth: number }).innerWidth = previousWidth;
            bumpLayoutEpoch();
        }
    });

    it("restores inline style when a computed probe cannot produce a scalar", () => {
        const parsed = parseCssValue("calc(1px + 2px)");
        if (!parsed.ok) throw new TypeError(parsed.diagnostics[0].code);
        const el = document.createElement("div");
        document.body.appendChild(el);
        el.style.width = "7px";
        try {
            resolveBrowserScalar(parsed.value, el, "width");
        } catch (error) {
            expect(error).toBeInstanceOf(BrowserScalarResolutionError);
        }
        expect(el.style.width).toBe("7px");
    });
});
