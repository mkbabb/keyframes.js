/**
 * The Daraksha motion signature: two library presets the cube's Daraksha
 * skin (and the daraksha.babb.dev die) play.
 *
 *  · `garlandSway` (loop) — a pendulum hung from above: a closed loop that
 *    rests at the neutral hang (0% = 100% = the identity), stays within
 *    ±2.5° and rises at the extremes (25% / 75%).
 *  · `unfurl` (enter) — a petal grows from its base and turns open on
 *    CSS `spring(1 120 12 0)` (ζ ≈ 0.55): one gentle overshoot, then rest.
 */
import { describe, expect, it } from "vitest";
import {
    garlandSway,
    unfurl,
    enterPresets,
    loopPresets,
} from "../../src/animation/presets";
import { CSSKeyframesAnimation } from "../../src/animation/engine";
import { springCssToOptions } from "../../src/animation/resolve/spring-css";

/** Read one transform function's numeric argument off a sampled frame. */
const fnArg = (transform: string, name: string): number => {
    const m = new RegExp(`${name}\\((-?[\\d.]+)[a-z%]*\\)`).exec(transform);
    if (!m) throw new Error(`${name}() absent from "${transform}"`);
    return Number(m[1]);
};

describe("garlandSway — a garland's pendulum", () => {
    // Linear timing so a sample at p reads the authored stop at p.
    const anim = garlandSway({ timingFunction: "linear" });
    const at = (p: number) => String({ ...anim.at(p) }.transform);

    it("compiles, in the loop group, with the catalogue's loop options", () => {
        const fresh = garlandSway();
        expect(fresh).toBeInstanceOf(CSSKeyframesAnimation);
        expect(fresh.options.duration).toBe(4200);
        expect(fresh.options.iterationCount).toBe(Infinity);
        expect(fresh.options.direction).toBe("normal");
        expect(fresh.options.fillMode).toBe("none");
        expect(loopPresets.garlandSway).toBe(garlandSway);
    });

    it("the loop is closed: the 0% and 100% frames are equal", () => {
        expect(at(1)).toBe(at(0));
    });

    it("rests at the neutral hang: 0% and 100% are the identity (0°, centred)", () => {
        // The rest frame a stop (fill none → initial) and the reduced-motion
        // snap (→ final) both paint. 6.2.0 rested at the arc's extreme
        // (rotateZ(-2.5deg)), so a reduced-motion die hung tilted.
        for (const p of [0, 1]) {
            expect(fnArg(at(p), "rotateZ")).toBe(0);
            expect(fnArg(at(p), "translateY")).toBe(0);
        }
    });

    it("|rotateZ| ≤ 2.5deg at every sampled frame", () => {
        for (let i = 0; i <= 100; i++) {
            expect(Math.abs(fnArg(at(i / 100), "rotateZ"))).toBeLessThanOrEqual(2.5);
        }
        // …and the arc actually reaches both ends.
        expect(fnArg(at(0.25), "rotateZ")).toBe(2.5);
        expect(fnArg(at(0.75), "rotateZ")).toBe(-2.5);
    });

    it("the pendulum rises at the extremes: translateY < 0 at 25%/75%, 0 at the crossings", () => {
        expect(fnArg(at(0.25), "translateY")).toBeLessThan(0);
        expect(fnArg(at(0.75), "translateY")).toBeLessThan(0);
        expect(fnArg(at(0), "translateY")).toBe(0);
        expect(fnArg(at(0.5), "translateY")).toBe(0);
    });
});

describe("unfurl — a petal opening on a soft spring", () => {
    it("compiles, in the enter group, and its 100% frame is the identity", () => {
        const anim = unfurl({ timingFunction: "linear" });
        expect(anim).toBeInstanceOf(CSSKeyframesAnimation);
        expect(enterPresets.unfurl).toBe(unfurl);
        const end = { ...anim.at(1) };
        expect(fnArg(String(end.transform), "scale")).toBe(1);
        expect(fnArg(String(end.transform), "rotate")).toBe(0);
        expect(Number(end.opacity)).toBe(1);
        const start = { ...anim.at(0) };
        expect(fnArg(String(start.transform), "scale")).toBe(0.2);
        expect(Number(start.opacity)).toBe(0);
    });

    it("is timed by CSS spring(1 120 12 0): ζ ≈ 0.55, 900 ms, fill none", () => {
        const { dampingFraction } = springCssToOptions([1, 120, 12, 0]);
        expect(dampingFraction).toBeCloseTo(0.548, 3);
        const anim = unfurl();
        expect(anim.options.duration).toBe(900);
        expect(anim.options.fillMode).toBe("none");
        expect(anim.options.timingFunction.css).toMatch(/^linear\(/);
    });

    it("overshoots once: peak in [1.02, 1.15], settled within 2% by the horizon", () => {
        const fn = unfurl().options.timingFunction.fn;
        const N = 1000;
        const ys = Array.from({ length: N + 1 }, (_, i) => fn(i / N));
        const peak = Math.max(...ys);
        expect(peak).toBeGreaterThanOrEqual(1.02);
        expect(peak).toBeLessThanOrEqual(1.15);
        // The tail rests inside the 2% band.
        for (let i = Math.round(0.85 * N); i <= N; i++) {
            expect(Math.abs(ys[i]! - 1)).toBeLessThanOrEqual(0.02);
        }
        // ONE visible overshoot: exactly one local maximum outside the 2%
        // settle band. (A damped spring's later crests sit above 1 too —
        // ζ 0.55's second is ~1.002 — but inside the band they are rest.)
        const maxima = ys.filter(
            (y, i) => i > 0 && i < N && y > ys[i - 1]! && y >= ys[i + 1]! && y > 1.02,
        );
        expect(maxima).toHaveLength(1);
        expect(ys[0]).toBe(0);
        expect(ys[N]).toBe(1);
    });
});
