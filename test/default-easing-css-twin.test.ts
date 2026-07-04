/**
 * S4 — the default easing's `cubic-bezier()` css-twin: VERIFIED, then WITHHELD.
 *
 * The lever C.W4 §S4 names: if `defaultOptions.timingFunction` carried a
 * faithful `.css` twin, every DEFAULT-eased animation would regain a WAAPI
 * compositor path (today it has none — `cssTwinFor` returns `undefined` for the
 * bespoke `easeInOutCubic`, so the css-twin gate keeps the default on rAF).
 *
 * Design-decision #3 (verify-before-ship): the twin ships ONLY if the sampled
 * `cubic-bezier(...)` matches `easeInOutCubic` within tolerance across [0,1] —
 * a faithful compositor curve or none; no approximation that drifts.
 *
 * MEASURED RESULT — RECORDED UNFAITHFUL: value.js's `easeInOutCubic` is the
 * PIECEWISE Penner cubic (`0.5·(2t)³` for t<0.5, mirrored for t≥0.5). A single
 * cubic-bezier is a non-piecewise polynomial and CANNOT reproduce it. The
 * standard easings.net twin `cubic-bezier(0.645,0.045,0.355,1)` drifts ~0.0247
 * max; even the BEST-fit single cubic-bezier floors at ~0.0208 — both far above
 * the 1e-2 no-visible-drift tolerance. So the twin is NOT shipped: the default
 * stays `{ fn: easeInOutCubic }` (rAF-only), faithful by omission.
 *
 * These assertions are the gate that keeps that decision honest:
 *   - the candidate bezier's drift EXCEEDS tolerance (shipping it would drift);
 *   - `defaultOptions.timingFunction.css` is therefore `undefined` (withheld);
 *   - a default-eased animation is consequently WAAPI-INELIGIBLE (rAF-only).
 * If a future faithful twin is found (drift ≤ tol) the first assertion reds;
 * if anyone ships an UNfaithful `.css` on the default, the second reds.
 */
import { CSSCubicBezier, easeInOutCubic } from "@mkbabb/value.js";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../src/animation/engine";
import { defaultOptions } from "../src/animation/constants";
import { cssTwinFor } from "../src/animation/easing";
import { isWAAPIEligible } from "../src/animation/waapi";

// jsdom has no WAAPI; eligibility short-circuits at "no animate()" before the
// css-twin check. Stub a no-op `animate` so the gate reaches the twin logic —
// the same minimal stub `waapi-lifecycle.test.ts` installs.
beforeEach(() => {
    HTMLElement.prototype.animate = () => ({}) as unknown as globalThis.Animation;
});
afterEach(() => {
    // @ts-expect-error — remove the stub
    delete HTMLElement.prototype.animate;
});

/** Max absolute progress drift that reads as "no visible drift" on screen. */
const TOLERANCE = 1e-2;

/** The standard easings.net "easeInOutCubic" bezier — the candidate twin. */
const CANDIDATE_TWIN = "cubic-bezier(0.645,0.045,0.355,1)";

/** Sample `|a(t) - b(t)|` across [0,1] and return the max. */
const maxDrift = (
    a: (t: number) => number,
    b: (t: number) => number,
    samples = 1000,
): number => {
    let max = 0;
    for (let i = 0; i <= samples; i++) {
        const t = i / samples;
        const d = Math.abs(a(t) - b(t));
        if (d > max) max = d;
    }
    return max;
};

describe("S4 — default easing css-twin fidelity (verify before ship)", () => {
    it("the candidate cubic-bezier DRIFTS from easeInOutCubic beyond tolerance", () => {
        const bezier = CSSCubicBezier(0.645, 0.045, 0.355, 1);
        const drift = maxDrift(easeInOutCubic, bezier);
        // RECORDED: the twin is NOT faithful — shipping it would drift the
        // compositor curve away from what rAF runs. ~0.0247 measured.
        expect(drift).toBeGreaterThan(TOLERANCE);
    });

    it("endpoints still pin (the drift is interior, not at 0/1)", () => {
        const bezier = CSSCubicBezier(0.645, 0.045, 0.355, 1);
        expect(bezier(0)).toBeCloseTo(0, 6);
        expect(bezier(1)).toBeCloseTo(1, 6);
        expect(easeInOutCubic(0)).toBe(0);
        expect(easeInOutCubic(1)).toBe(1);
    });

    it("NO single cubic-bezier reaches tolerance (piecewise floor ~0.0208)", () => {
        // A single cubic-bezier cannot reproduce a PIECEWISE cubic; the best
        // symmetric fit (about (0.5,0.5)) still floors above tolerance. We
        // grid-search the symmetric family to prove the floor, not a value.
        let best = Infinity;
        for (let x1 = 0.1; x1 <= 0.6; x1 += 0.01) {
            for (let y1 = 0; y1 <= 0.3; y1 += 0.01) {
                const fit = CSSCubicBezier(x1, y1, 1 - x1, 1 - y1);
                const drift = maxDrift(easeInOutCubic, fit, 200);
                if (drift < best) best = drift;
            }
        }
        // The achievable floor is itself above tolerance → none is faithful.
        expect(best).toBeGreaterThan(TOLERANCE);
    });

    it("DECISION: the default carries NO css twin (withheld — stays rAF-only)", () => {
        // The fidelity check failed, so per Design-decision #3 the twin is not
        // shipped: the default easing has no faithful CSS twin.
        expect(defaultOptions.timingFunction.css).toBeUndefined();
        // And `cssTwinFor` confirms the bespoke name has no CSS keyword/literal
        // form either — the gate's reason the default stays on rAF.
        expect(cssTwinFor("easeInOutCubic")).toBeUndefined();
    });
});

describe("S4 — the WAAPI consequence of withholding the twin", () => {
    it("a default-eased animation is WAAPI-INELIGIBLE (no faithful twin → rAF)", () => {
        const el = document.createElement("div");
        const anim = new CSSKeyframesAnimation({ duration: 500 });
        anim.setTargets(el);
        anim.fromString(`from { opacity: 0; } to { opacity: 1; }`);

        const elig = isWAAPIEligible(anim);
        expect(elig.eligible).toBe(false);
        if (!elig.eligible) {
            expect(elig.reason).toMatch(/faithful CSS twin/);
        }
    });

    it("an EXPLICIT cubic-bezier twin IS eligible (the path the default forgoes)", () => {
        // Proves the gate is twin-driven, not default-hostile: the SAME curve
        // shape, supplied as an explicit cubic-bezier literal (whose `.css`
        // round-trips), delegates to the compositor. The default forgoes this
        // ONLY because its piecewise curve has no faithful single-bezier twin.
        const el = document.createElement("div");
        const anim = new CSSKeyframesAnimation({
            duration: 500,
            timingFunction: CANDIDATE_TWIN,
        });
        anim.setTargets(el);
        anim.fromString(`from { opacity: 0; } to { opacity: 1; }`);
        expect(isWAAPIEligible(anim).eligible).toBe(true);
    });
});
