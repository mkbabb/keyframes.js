/**
 * composition-honored.test.ts — K.W7 (THE FIDELITY FLOOR): the engine HONORS
 * the `animation-composition` operator the author declared. proof:composition-
 * honored (the value proof; the source-shape lock rides
 * `scripts/proof-composition-honored.mjs`).
 *
 * BORN-RED WITNESS (the frontier sense): on the pre-cure tree the engine has
 * ZERO reads of the captured `resolved.composition` Map — `engine.ts` drops the
 * operator — so a `composite:add` keyframe runs as silent `replace`. Every
 * clause below asserts the SUM (the engine's own apply write); each reds on
 * exactly that dropped-operator shape.
 *
 *   (a) rAF `add` produces the SUM        — underlying 0.3 + lerp(0.5,0.5) = 0.8
 *   (b) rAF `accumulate` is repeat-aware   — iteration 2 stacks onto iter-1 end
 *   (c) rAF↔WAAPI parity                   — same keyframe, same composite kw
 *   (d) the non-numeric fallback is HONEST — color add → replace + diagnostic
 *
 * The diagnostics-channel mirror (clause (e)) lives in
 * `test/diagnostics-channel.test.ts` (proof:diagnostics-channel).
 */
import { describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../../src/animation/engine";
import { toWAAPIOptions, toWAAPIKeyframes } from "../../src/animation/waapi";

const mkEl = (style: Record<string, string> = {}): HTMLElement => {
    const el = document.createElement("div");
    for (const [k, v] of Object.entries(style)) el.style.setProperty(k, v);
    return el;
};

/** Read the engine's apply-write for `opacity` off the target's inline style. */
const opacityOf = (el: HTMLElement): number =>
    Number.parseFloat(el.style.getPropertyValue("opacity") || "NaN");

describe("K.W7 clause (a) — rAF `add` produces the SUM (not the replace)", () => {
    it("underlying 0.3 + lerp(0.5,0.5) composites to 0.8 at the mid-frame", () => {
        const el = mkEl({ opacity: "0.3" });
        const a = new CSSKeyframesAnimation({ duration: 1000 }, el);
        a.fromString(
            "@keyframes x { 0% { opacity: 0.5 } 100% { opacity: 0.5; animation-composition: add } }",
        );
        // The engine-write channel: interpFrames(apply=true) mutates the inline
        // style. The composited operator makes that write the SUM.
        a.interpFrames(500, true);
        // BITE: with the operator dropped, the mid-frame would be the replace
        // (0.5). The SUM (0.8) is a write the `replace` path provably cannot make.
        expect(opacityOf(el)).toBeCloseTo(0.8, 5);
    });

    it("a pure-`replace` keyframe is UNCHANGED — the operator gates the work", () => {
        const el = mkEl({ opacity: "0.3" });
        const a = new CSSKeyframesAnimation({ duration: 1000 }, el);
        a.fromString("@keyframes r { 0% { opacity: 0.5 } 100% { opacity: 0.9 } }");
        a.interpFrames(0, true);
        // No composition → the legacy replace write (0.5), NOT a composite onto
        // the underlying 0.3. The honoring is surgical: replace is untouched.
        expect(opacityOf(el)).toBeCloseTo(0.5, 5);
    });

    it("the add is UN-CLAMPED (CSS does not clamp at composition)", () => {
        const el = mkEl({ opacity: "0.8" });
        const a = new CSSKeyframesAnimation({ duration: 1000 }, el);
        a.fromString(
            "@keyframes x { 0% { opacity: 0.8 } 100% { opacity: 0.8; animation-composition: add } }",
        );
        a.interpFrames(1000, true);
        // 0.8 + 0.8 = 1.6 — un-clamped, the same GL-6 contract the group's add
        // leaf holds. Clamping is at USE, not at composition.
        expect(opacityOf(el)).toBeCloseTo(1.6, 5);
    });
});

describe("K.W7 clause (b) — rAF `accumulate` is repeat-aware", () => {
    it("iteration 2 stacks onto iteration 1's end (not a fresh replace)", () => {
        const el = mkEl({ opacity: "0" });
        const a = new CSSKeyframesAnimation(
            { duration: 1000, iterationCount: 2 },
            el,
        );
        a.fromString(
            "@keyframes acc { 0% { opacity: 0 } 100% { opacity: 0.4; animation-composition: accumulate } }",
        );
        // Iteration 0 end → 0.4 (base 0 + lerp 0.4).
        a.interpFrames(1000, true);
        expect(opacityOf(el)).toBeCloseTo(0.4, 5);
        // Iteration 1 end → 0.8 (base 0 + 1·(0.4−0) prior-iteration net + lerp 0.4).
        // BITE: a fresh replace each iteration would read 0.4 again — distinct.
        a.iteration = 1;
        a.interpFrames(1000, true);
        expect(opacityOf(el)).toBeCloseTo(0.8, 5);
    });
});

describe("K.W7 clause (c) — rAF↔WAAPI parity (the operator honored identically)", () => {
    it("the WAAPI options carry the same `composite:add` the rAF path honors", () => {
        const el = mkEl({ opacity: "0.3" });
        const a = new CSSKeyframesAnimation({ duration: 1000 }, el);
        a.fromString(
            "@keyframes x { 0% { opacity: 0.5 } 100% { opacity: 0.5; animation-composition: add } }",
        );
        const opts = toWAAPIOptions(a) as KeyframeEffectOptions & {
            composite?: string;
        };
        // BITE (born-RED): pre-cure `waapi.ts` emits ZERO composite — the WAAPI
        // path runs `replace` while the rAF path runs `add`, a silent infidelity.
        expect(opts.composite).toBe("add");
    });

    it("the WAAPI keyframes carry the RAW effect (the compositor adds the base)", () => {
        // Parity rests on this: the rAF apply composites (writes the SUM); the
        // WAAPI sample stays the raw effect and the compositor's `composite:add`
        // adds the underlying value ITSELF. Sampling the same value at apply=false
        // must NOT double-count the base.
        const el = mkEl({ opacity: "0.3" });
        const a = new CSSKeyframesAnimation({ duration: 1000 }, el);
        a.fromString(
            "@keyframes x { 0% { opacity: 0.5 } 100% { opacity: 0.5; animation-composition: add } }",
        );
        const kfs = toWAAPIKeyframes(a) as Array<Record<string, unknown>>;
        // Every emitted keyframe's opacity is the raw 0.5 effect (NOT the 0.8
        // SUM) — so the compositor adds the 0.3 base exactly once. The rAF
        // apply (clause a) reaches the SAME 0.8 by adding the base on its side.
        for (const kf of kfs) {
            if (kf.opacity != null) {
                expect(Number.parseFloat(String(kf.opacity))).toBeCloseTo(0.5, 5);
            }
        }
        // And the rAF apply at the same offset reaches the SUM — parity in
        // miniature: raw-effect (0.5) + base (0.3) = 0.8 on either backend.
        a.interpFrames(500, true);
        expect(opacityOf(el)).toBeCloseTo(0.8, 5);
    });

    it("a pure-`replace` animation emits NO composite (byte-identical options)", () => {
        const el = mkEl({ opacity: "0.3" });
        const a = new CSSKeyframesAnimation({ duration: 1000 }, el);
        a.fromString("@keyframes r { 0% { opacity: 0.5 } 100% { opacity: 0.9 } }");
        const opts = toWAAPIOptions(a) as KeyframeEffectOptions & {
            composite?: string;
        };
        // No behavioural change on the replace majority — `composite` is absent.
        expect(opts.composite).toBeUndefined();
    });
});

describe("K.W7 clause (d) — the non-numeric fallback is HONEST", () => {
    it("a color `add` falls back to replace AND emits COMPOSITION_FALLBACK", () => {
        const el = mkEl({ color: "rgb(10, 20, 30)" });
        const a = new CSSKeyframesAnimation({ duration: 1000 }, el);
        a.fromString(
            "@keyframes c { 0% { color: rgb(0,0,0) } 100% { color: rgb(100,100,100); animation-composition: add } }",
        );
        a.interpFrames(500, true);
        // It did NOT produce a garbage SUM color — the leaf kept its lerped value
        // (a valid color string), never a numeric add over color channels.
        const written = el.style.getPropertyValue("color");
        expect(written).toMatch(/rgb|color|oklab|#/i);
        // …AND the fallback is CITED — never silent (the honest-refusal clause).
        const codes = a.diagnostics.map((d) => d.code);
        expect(codes).toContain("COMPOSITION_FALLBACK");
        const row = a.diagnostics.find((d) => d.code === "COMPOSITION_FALLBACK");
        expect(row?.property).toBeDefined();
    });

    it("the fallback row is emitted ONCE per property, not once per frame", () => {
        const el = mkEl({ color: "rgb(10, 20, 30)" });
        const a = new CSSKeyframesAnimation({ duration: 1000 }, el);
        a.fromString(
            "@keyframes c { 0% { color: rgb(0,0,0) } 100% { color: rgb(100,100,100); animation-composition: add } }",
        );
        a.interpFrames(250, true);
        a.interpFrames(500, true);
        a.interpFrames(750, true);
        const fallbacks = a.diagnostics.filter(
            (d) => d.code === "COMPOSITION_FALLBACK",
        );
        expect(fallbacks.length).toBe(1);
    });
});
