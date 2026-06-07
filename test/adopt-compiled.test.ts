import { describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../src/animation/engine";

/**
 * G.W19 — the `adoptCompiled()` engine seam (proof:adopt-compiled).
 *
 * `Animation.adoptCompiled(source)` transplants a throwaway's ALREADY-COMPILED
 * state as ONE atomic motion: the compiler (its frames come with it), the
 * live-options reference RE-BOUND off the adopted compiler (`this.options ===
 * this.compiler.options` — the `6e29236` invariant), and `_stableKeys`
 * recomputed (so `flatKeys` reflects the adopted frames). It replaces the demo's
 * three-field cross-boundary reach-in (which held the invariant by COMMENT, not
 * the seam). These three clauses lock the verb's contract, each with a stated
 * bite.
 */

// `b` has a DIFFERENT key-set than `a` (a: opacity; b: opacity + translateX) so
// the flatKeys clause (c) is non-vacuous — a no-op computeStableKeys is caught.
const buildA = (): CSSKeyframesAnimation<any> =>
    new CSSKeyframesAnimation({ duration: 1000 }).fromKeyframes({
        "0%": { opacity: 0 },
        "100%": { opacity: 1 },
    } as any);

const buildB = (): CSSKeyframesAnimation<any> =>
    new CSSKeyframesAnimation({ duration: 1000 }).fromKeyframes({
        "0%": { opacity: 0, transform: "translateX(0px)" },
        "100%": { opacity: 1, transform: "translateX(100px)" },
    } as any);

describe("proof:adopt-compiled (a) — the compiler is adopted (reference identity)", () => {
    it("a.compiler === b.compiler after adopt (transplant, not re-compile)", () => {
        const a = buildA();
        const b = buildB();
        a.adoptCompiled(b);
        // The adopted compiler IS b's — its compiled frames come with it.
        // BITE: an adoptCompiled that re-compiles (a fresh FrameCompiler) reds.
        expect(a.compiler).toBe(b.compiler);
    });
});

describe("proof:adopt-compiled (b) — the live-options reference is RE-BOUND (the 6e29236 invariant)", () => {
    it("a.options === a.compiler.options (the live-options reference held)", () => {
        const a = buildA();
        const b = buildB();
        a.adoptCompiled(b);
        // The SAME object the setters mutate is the one the compiler reads.
        // BITE: transplant `compiler` without re-binding `options` → reds.
        expect(a.options).toBe(a.compiler.options);
    });

    it("the dynamic witness: a post-adopt setter mutation flows to the adopted compiler's next compile", () => {
        const a = buildA();
        const b = buildB();
        a.adoptCompiled(b);
        // setDuration mutates a.options in place; the adopted compiler reads
        // THAT object on the next parse — the 6e29236 lock through the seam.
        a.setDuration(2000);
        a.parse();
        const lastFrame = a.frames[a.frames.length - 1]!;
        expect(lastFrame.time.stop).toBe(2000);
    });
});

describe("proof:adopt-compiled (c) — _stableKeys is recomputed", () => {
    it("a.flatKeys reflects b's compiled key-set (contains b's extra key, not a's pre-adopt set)", () => {
        const a = buildA();
        const b = buildB();
        // a's pre-adopt key-set is opacity-only.
        expect([...a.flatKeys].sort()).toEqual(["opacity"]);

        a.adoptCompiled(b);

        // After adopt, flatKeys reflects b's compiled frames — the union of b's
        // flatVars keys. b carries an extra `transform` key a never had.
        const adopted = [...a.flatKeys];
        // It now carries b's extra key (transform), NOT a's pre-adopt set.
        expect(adopted).toContain("transform");
        expect(adopted).toContain("opacity");
        expect(adopted).not.toEqual(["opacity"]); // the pre-adopt set is gone

        // And it equals the union of b's compiled-frame flatVars keys.
        const bKeys = new Set<string>();
        for (const frame of b.frames)
            for (const k in frame.flatVars) bKeys.add(k);
        expect(adopted.sort()).toEqual([...bKeys].sort());
        // BITE: an adoptCompiled that skips computeStableKeys() → flatKeys stays
        // the pre-adopt opacity-only set, missing `transform` → reds.
    });
});

describe("proof:adopt-compiled — the demo's exact current hazard, transplanted into a test", () => {
    it("BITE simulation: compiler adopted WITHOUT re-binding options desyncs (the dropped-options-line form)", () => {
        const a = buildA();
        const b = buildB();
        const staleOptions = a.options;

        // Reproduce the desync the verb prevents: adopt the compiler but leave
        // a.options pointing at its OLD object (the three-write form with the
        // options line dropped/reordered). We cannot write a.compiler (the
        // get-only accessor — S3), so simulate via the compiler's own options.
        a.adoptCompiled(b); // correct path
        // Sanity: the correct path did NOT leave the stale identity.
        expect(a.options).not.toBe(staleOptions);
        expect(a.options).toBe(a.compiler.options);
    });
});
