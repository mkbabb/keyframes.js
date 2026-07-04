/**
 * blend.test.ts — G.W17 (the dead `add`/`weighted` blend-leaf correction).
 * proof:blend — the value-level twin to proof:zero-alloc.
 *
 * The `add` + `weighted` blend arms guarded on a bare `ValueUnit`, but the leaf
 * is a `ValueUnit[]` (a one-element array for a scalar property, an N-element
 * array for a multi-component leaf), so `isNumericUnit(existing)` was ALWAYS
 * false and both arms collapsed to last-writer-wins `replace`. The fix guards on
 * the ARRAY and loops `min(existing.length, incoming.length)` elements, blending
 * each numeric pair in place (zero-alloc intact), replacing a non-numeric index.
 *
 * These four clauses assert EXACT blended VALUES — the gap GL-1 closes (the
 * existing suite asserts config get/set + buffer identity, never a number):
 *   (a) add accumulates           — two opacity 0→1 children → 1.0 (not 0.5)
 *   (b) weighted lerps            — lerp(0, 0.5, 0.5) → 0.25 (not 0.5)
 *   (c) the GL-6 clamp contract   — add of two opacity 0.8 → 1.6 (un-clamped)
 *   (d) the multi-component leaf  — element-wise, min(len), no special case
 */
import { describe, expect, it } from "vitest";
import { ValueUnit } from "@mkbabb/value.js";
import { CSSKeyframesAnimation } from "../src/animation/engine";
import { AnimationGroup } from "../src/animation/group";
import { compositeFramesAt } from "./support/group-probe";

/** Build a parsed `opacity` animation sampled at `t` (its own clock). */
const opacityAt = (css: string, t: number): CSSKeyframesAnimation<any> => {
    const a = new CSSKeyframesAnimation({ duration: 1000 }).fromString(css);
    a.t = t;
    return a;
};

/** Read the scalar value of a single-element `ValueUnit[]` leaf. */
const scalar = (out: Record<string, any>, key: string): number => {
    const leaf = out[key];
    expect(Array.isArray(leaf)).toBe(true);
    expect(leaf[0]).toBeInstanceOf(ValueUnit);
    return leaf[0].value;
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
            { animation: base, layer: { blendMode: "replace", zIndex: 0 } },
            { animation: top, layer: { blendMode: "add", zIndex: 1 } },
        );
        const out = compositeFramesAt(group, 0);
        expect(scalar(out, "opacity")).toBeCloseTo(1.0, 10);
    });
});

describe("proof:blend (b) — weighted lerps", () => {
    it("a:0→0, b:0→1 blended weighted w=0.5 → exactly 0.25", () => {
        // a rests at 0 (0→0); b rests at 0.5 (0→1 at t=500). b blended `weighted`
        // weight=0.5 over a → lerp(0, 0.5, 0.5) = 0.25. DEAD-LEAF returned b's
        // bare 0.5 — this BITES on it.
        const a = opacityAt("from { opacity: 0; } to { opacity: 0; }", 500);
        const b = opacityAt("from { opacity: 0; } to { opacity: 1; }", 500);
        const group = new AnimationGroup<any>(
            { animation: a, layer: { blendMode: "replace", zIndex: 0 } },
            {
                animation: b,
                layer: { blendMode: "weighted", zIndex: 1, weight: 0.5 },
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
            { animation: a, layer: { blendMode: "replace", zIndex: 0 } },
            { animation: b, layer: { blendMode: "add", zIndex: 1 } },
        );
        const out = compositeFramesAt(group, 0);
        expect(scalar(out, "opacity")).toBeCloseTo(1.6, 10);
    });
});

describe("proof:blend (d) — the multi-component leaf (GL-2)", () => {
    it("blends EACH element of a multi-element ValueUnit[] in place (add)", () => {
        // `margin: 0px 0px → 10px 20px` stays ONE key `margin` whose leaf is a
        // 2-element ValueUnit[] ([5, 10] at t=500) — NOT split into per-component
        // keys. The element loop blends each: base [5,10] + incoming [5,10] →
        // [10, 20]. BITE: revert the loop to a length-1 access → only index 0
        // blends, index 1 reds.
        const base = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "from { margin: 0px 0px; } to { margin: 10px 20px; }",
        );
        base.t = 500;
        const top = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "from { margin: 0px 0px; } to { margin: 10px 20px; }",
        );
        top.t = 500;
        const group = new AnimationGroup<any>(
            { animation: base, layer: { blendMode: "replace", zIndex: 0 } },
            { animation: top, layer: { blendMode: "add", zIndex: 1 } },
        );
        const out: any = compositeFramesAt(group, 0);
        const leaf = out["margin"];
        expect(Array.isArray(leaf)).toBe(true);
        expect(leaf.length).toBe(2);
        expect(leaf[0].value).toBeCloseTo(10, 10);
        expect(leaf[1].value).toBeCloseTo(20, 10);
    });

    it("loops min(existing.length, incoming.length) — no out-of-range read", () => {
        // base `margin: 0px 0px → 10px 20px` (length 2, [5,10]); top
        // `margin: 0px → 10px` (length 1, [5]) added over it. min(2,1)=1 → ONLY
        // index 0 accumulates (5+5=10); index 1 is untouched (stays 10) — no
        // over-read of the shorter incoming array. BITE: drop the `min` and
        // over-read → the differing-length blend reds (reads incoming[1] which is
        // undefined, corrupting index 1 or throwing).
        const base = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "from { margin: 0px 0px; } to { margin: 10px 20px; }",
        );
        base.t = 500;
        const top = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "from { margin: 0px; } to { margin: 10px; }",
        );
        top.t = 500;
        const group = new AnimationGroup<any>(
            { animation: base, layer: { blendMode: "replace", zIndex: 0 } },
            { animation: top, layer: { blendMode: "add", zIndex: 1 } },
        );
        const out: any = compositeFramesAt(group, 0);
        const leaf = out["margin"];
        expect(Array.isArray(leaf)).toBe(true);
        expect(leaf.length).toBe(2);
        // index 0 accumulated (5 + 5); index 1 untouched (min() did not reach it).
        expect(leaf[0].value).toBeCloseTo(10, 10);
        expect(leaf[1].value).toBeCloseTo(10, 10);
    });
});
