/**
 * E.W7 `proof:engine-correctness` — the five Strand-A lock-tests.
 *
 * Each asserts the CORRECT behaviour a verified W7 finding restored; each
 * reds if its fix is reverted (the bite is noted per-test). Wired into
 * `npm test` and re-run by `scripts/proof-engine-correctness.mjs`.
 */
import { describe, expect, it, vi } from "vitest";
import { easeInOutCubic } from "@mkbabb/value.js";
import { KeyframesAnimation, CSSKeyframesAnimation } from "../../src/animation/engine";
import { isWAAPIEligible } from "../../src/animation/waapi";
import { getTimingFunction } from "../../src/animation/compile/easing-registry";

const colorValue = (result: Record<string, any>, key: string): string => {
    const arr = result[key];
    if (!arr || !arr.length) throw new Error(`no interp value for "${key}"`);
    return arr.map((v: any) => String(v)).join(" ");
};

describe("E.W7 proof:engine-correctness — Strand A", () => {
    // ── FC-1 ────────────────────────────────────────────────────────────
    it("setColorSpace after fromString re-derives the interpolated channel (FC-1)", () => {
        const el = document.createElement("div");
        const a = new CSSKeyframesAnimation({}, el);
        a.fromString(
            `@keyframes p { from { color: rgb(255, 0, 0) } to { color: rgb(0, 0, 255) } }`,
        );
        // Default space (oklab). Sample the midpoint.
        const before = colorValue(a.at(0.5), "color");
        // Switch to lab — a perceptually different mix at t=0.5.
        a.setColorSpace("lab");
        const afterLab = colorValue(a.at(0.5), "color");
        // BITE: with the old store-and-return setter (no renormalizeColors),
        // afterLab === before (the colorSpace change silently no-ops).
        expect(afterLab).not.toBe(before);
        // And the change is real both ways — back to oklab restores the first.
        a.setColorSpace("oklab");
        expect(colorValue(a.at(0.5), "color")).toBe(before);
    });

    it("setHueMethod after fromString re-derives a cylindrical-space mix (FC-1)", () => {
        const el = document.createElement("div");
        const a = new CSSKeyframesAnimation({ colorSpace: "oklch" }, el);
        a.fromString(
            `@keyframes p { from { color: rgb(255, 0, 0) } to { color: rgb(0, 255, 0) } }`,
        );
        const shorter = colorValue(a.at(0.5), "color");
        a.setHueMethod("longer");
        const longer = colorValue(a.at(0.5), "color");
        // BITE: a no-op setHueMethod leaves `longer === shorter`.
        expect(longer).not.toBe(shorter);
    });

    // ── D-1 ─────────────────────────────────────────────────────────────
    it("a non-adjacent reconciled segment inherits the nearest PRECEDING template transform (D-1)", () => {
        // x spans 0→1→2→3 (adjacent); y is declared only at stops 1 and 3
        // (non-adjacent) → reconcileVars creates a (1,3) segment. Its inherited
        // transform must be the nearest preceding DECLARED template transform
        // (stop 1's `tB`), read from the templateFrames index space — not a
        // frame plucked out of the compiled `frames[]` by a template index.
        const tA = vi.fn();
        const tB = vi.fn();
        const a = new KeyframesAnimation();
        a.addFrame(0, { x: 0 }, tA as any); // template 0 — transform A
        a.addFrame(33, { x: 33, y: 0 }, tB as any); // template 1 — transform B, declares y
        a.addFrame(66, { x: 66 }); // template 2 — no transform
        a.addFrame(100, { x: 100, y: 100 }); // template 3 — no transform, declares y
        a.parse();

        const seg = a.frames.find(
            (f) => f.ixs.start === 1 && f.ixs.stop === 3,
        );
        expect(seg, "the non-adjacent (1,3) y-segment exists").toBeTruthy();
        // stop 1 declared transform tB; the segment starting at stop 1 inherits it.
        expect(seg!.transform).toBe(tB);
    });

    // ── WAAPI F1 ────────────────────────────────────────────────────────
    it("the WAAPI guard rejects a container-relative (cqw) animation (WAAPI F1)", () => {
        const el = document.createElement("div");
        (el as any).animate = () => ({});
        const a = new CSSKeyframesAnimation({ timingFunction: "linear" }, el);
        a.fromString(`@keyframes p { from { width: 10cqw } to { width: 90cqw } }`);
        const elig = isWAAPIEligible(a);
        // BITE: with COMPUTED_UNITS=["var","calc"] only, cqw slips through eligible.
        expect(elig.eligible).toBe(false);
        if (!elig.eligible) {
            expect(elig.reason).toMatch(/cqw/);
        }
        // A bare px animation with a uniform CSS-twinned easing stays eligible.
        const b = new CSSKeyframesAnimation({ timingFunction: "linear" }, el);
        b.fromString(`@keyframes q { from { left: 0px } to { left: 100px } }`);
        expect(isWAAPIEligible(b).eligible).toBe(true);
    });

    // ── WAAPI W1 ────────────────────────────────────────────────────────
    it("a finite delegated WAAPI play leaves ZERO residual filling animations (WAAPI W1)", async () => {
        // Minimal WAAPI mock: a finite animation that resolves `finished`
        // immediately and records commit/cancel. `getAnimations()` returns the
        // still-live ones (not yet cancelled).
        const live = new Set<any>();
        const el = document.createElement("div");
        const make = () => {
            let committed = false;
            const wa: any = {
                playState: "running",
                finished: Promise.resolve(),
                commitStyles: () => {
                    committed = true;
                },
                cancel: () => {
                    live.delete(wa);
                },
                play: () => {},
                pause: () => {},
                get _committed() {
                    return committed;
                },
            };
            live.add(wa);
            return wa;
        };
        (el as any).animate = () => make();
        (el as any).getAnimations = () => [...live];

        const a = new CSSKeyframesAnimation(
            { timingFunction: "linear", duration: 20 },
            el,
        );
        a.fromString(`@keyframes p { from { left: 0px } to { left: 100px } }`);
        await a.play();

        // BITE: without commit-on-finish, `live` still holds the finished
        // fill:forwards animation(s) — they leak and override inline styles.
        expect((el as any).getAnimations().length).toBe(0);
    });

    // ── linear() consumption ────────────────────────────────────────────
    it("getTimingFunction reads back linear(...) to its true curve, not easeInOutCubic (r-css-values §1)", () => {
        const fn = getTimingFunction("linear(0, 0.25 25%, 0.75 75%, 1)");
        expect(typeof fn).toBe("function");
        // The linear ramp is ~identity here: f(0.5) ≈ 0.5; easeInOutCubic(0.5) = 0.5
        // too, so probe a point where they DIFFER. At t=0.25 the linear stop pins
        // 0.25; easeInOutCubic(0.25) ≈ 0.0781 — clearly distinct.
        expect(fn!(0.25)).toBeCloseTo(0.25, 5);
        expect(easeInOutCubic(0.25)).toBeLessThan(0.15);
        expect(fn!(0.25)).not.toBeCloseTo(easeInOutCubic(0.25), 2);
        // Endpoints exact.
        expect(fn!(0)).toBeCloseTo(0, 6);
        expect(fn!(1)).toBeCloseTo(1, 6);
        // BITE: with no linear( branch, getTimingFunction returns undefined and
        // the option setter degrades to easeInOutCubic — fn would be undefined here.
    });
});
