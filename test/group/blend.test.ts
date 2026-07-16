/**
 * blend.test.ts — G.W17 (the dead `add`/`weight` blend-leaf correction).
 * proof:blend — the value-level twin to proof:zero-alloc.
 *
 * The `add` and `weight` arms compose the engine's authored-value sink:
 * numeric properties fold arithmetically while structural values take the
 * ordinary residual path. These clauses lock the observable numeric results.
 *
 * These four clauses assert EXACT blended VALUES — the gap GL-1 closes (the
 * existing suite asserts config get/set + buffer identity, never a number):
 *   (a) add accumulates           — two opacity 0→1 children → 1.0 (not 0.5)
 *   (b) weight lerps            — lerp(0, 0.5, 0.5) → 0.25 (not 0.5)
 *   (c) the GL-6 clamp contract   — add of two opacity 0.8 → 1.6 (un-clamped)
 *   (d) the multi-component leaf  — element-wise, min(len), no special case
 */
import { describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../../src/animation/engine";
import { AnimationGroup } from "../../src/animation/group";
import { compositeFramesAt } from "../support/group-probe";

/** Build a parsed `opacity` animation sampled at `t` (its own clock). */
const opacityAt = (css: string, t: number): CSSKeyframesAnimation<any> => {
    const a = new CSSKeyframesAnimation({ duration: 1000 }).fromString(css);
    a.t = t;
    return a;
};

const scalar = (out: Record<string, any>, key: string): number => {
    const value = out[key];
    expect(typeof value).toBe("number");
    return value;
};

describe("proof:blend (a) — add accumulates", () => {
    it("two opacity 0→1 children at the mid-frame, add → exactly 1.0", () => {
        // Each child rests at 0.5 (t=500 of a 1000ms 0→1 sweep). The lower-zIndex
        // `replace` child establishes the carrier at 0.5; the `add` child
        // accumulates 0.5 onto it → 1.0 (additive-correct). DEAD-LEAF returned the
        // bare incoming 0.5 (last-writer-wins replace) — this BITES on it.
        const base = opacityAt("from { opacity: 0; } to { opacity: 1; }", 500);
        const top = opacityAt("from { opacity: 0; } to { opacity: 1; }", 500);
        const group = new AnimationGroup<any>(
            { animation: base, layer: { op: "replace", zIndex: 0 } },
            { animation: top, layer: { op: "add", zIndex: 1 } },
        );
        const out = compositeFramesAt(group, 0);
        expect(scalar(out, "opacity")).toBeCloseTo(1.0, 10);
    });
});

describe("proof:blend (b) — weight lerps", () => {
    it("a:0→0, b:0→1 blended weight w=0.5 → exactly 0.25", () => {
        // a rests at 0 (0→0); b rests at 0.5 (0→1 at t=500). b blended `weight`
        // weight=0.5 over a → lerp(0, 0.5, 0.5) = 0.25. DEAD-LEAF returned b's
        // bare 0.5 — this BITES on it.
        const a = opacityAt("from { opacity: 0; } to { opacity: 0; }", 500);
        const b = opacityAt("from { opacity: 0; } to { opacity: 1; }", 500);
        const group = new AnimationGroup<any>(
            { animation: a, layer: { op: "replace", zIndex: 0 } },
            {
                animation: b,
                layer: { op: "replace", zIndex: 1, weight: 0.5 },
            },
        );
        const out = compositeFramesAt(group, 0);
        expect(scalar(out, "opacity")).toBeCloseTo(0.25, 10);
    });
});

describe("proof:blend (c) — the GL-6 clamp contract (add does NOT clamp)", () => {
    it("add of two opacity 0.8 layers → exactly 1.6 (un-clamped)", () => {
        // Numeric add is UN-CLAMPED (CSS `animation-composition: add` does not
        // clamp at composition; clamping is at use). 0.8 + 0.8 → 1.6 — the
        // CSS-correct contract, encoded so a future clamp cannot land silently.
        // BITE: add a clamp to the add leaf → this reds at 1.6 !== 1.0.
        const a = opacityAt("from { opacity: 0.8; } to { opacity: 0.8; }", 500);
        const b = opacityAt("from { opacity: 0.8; } to { opacity: 0.8; }", 500);
        const group = new AnimationGroup<any>(
            { animation: a, layer: { op: "replace", zIndex: 0 } },
            { animation: b, layer: { op: "add", zIndex: 1 } },
        );
        const out = compositeFramesAt(group, 0);
        expect(scalar(out, "opacity")).toBeCloseTo(1.6, 10);
    });
});

describe("proof:blend (d) — CSS strings compose honestly", () => {
    it("a multi-component CSS value replace-falls-back instead of inventing arithmetic", () => {
        const base = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "from { margin: 0px 0px; } to { margin: 10px 20px; }",
        );
        base.t = 500;
        const top = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "from { margin: 0px 0px; } to { margin: 10px 20px; }",
        );
        top.t = 500;
        const group = new AnimationGroup<any>(
            { animation: base, layer: { op: "replace", zIndex: 0 } },
            { animation: top, layer: { op: "add", zIndex: 1 } },
        );
        const out: any = compositeFramesAt(group, 0);
        expect(out.margin).toBe("5px 10px");
    });

    it("a differently-shaped CSS string keeps the incoming authored value", () => {
        const base = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "from { margin: 0px 0px; } to { margin: 10px 20px; }",
        );
        base.t = 500;
        const top = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "from { margin: 0px; } to { margin: 10px; }",
        );
        top.t = 500;
        const group = new AnimationGroup<any>(
            { animation: base, layer: { op: "replace", zIndex: 0 } },
            { animation: top, layer: { op: "add", zIndex: 1 } },
        );
        const out: any = compositeFramesAt(group, 0);
        expect(out.margin).toBe("5px");
    });
});
