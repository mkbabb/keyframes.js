/**
 * emerging-css-resolve-fn.test.ts — Q.WB2 (the emerging-CSS lowering pass,
 * the `@function` CALL-inlining arm). `proof:emerging-css-resolve-fn` (behaviour).
 *
 * P.W13 threaded the `@function` DEFINITION registry (`extractFunctions` →
 * `ResolveContext.functions`) and left the CALL-inlining as a typed-but-inert
 * seam at `resolve-values.ts`'s dashed-function branch — it returned the
 * `--ident(args)` call UNCHANGED because value.js's generic producer dropped a
 * dashed-call's args. value.js 1.2.0 ships the dashed-call parse arm
 * (`--double(50px)` → `FunctionValue("--double", [CssValue(50, px)])`) + the
 * `coerceToSyntax(valueText, syntax)` resolve-path validator. Q.WB2 activates the
 * seam: bind → coerce → substitute → evaluate, cycle-guarded by `ctx.seen`.
 *
 * A live behaviour check: the inlining runs against the real engine compile
 * rather than a source-shape proxy.
 *
 * The observable (mirroring the Q.WB1 `sibling-*` idiom): the `--ident(args)`
 * call is REPLACED, before flatten, by its substituted `result` expression — the
 * `var(--param)` swapped for the bound-and-coerced arg, the `--ident(...)` token
 * GONE. The subsequent `calc(50px * 2) → 100px` reduction is value.js's
 * computed-unit DOM step (gated elsewhere — it does NOT run under jsdom, no
 * layout). So the cure's witness is the SUBSTITUTION: the compiled value carries
 * `calc(50px * 2)` where the literal `--double(50px)` stood, never the call token.
 *
 * Born-RED on the pre-1.2.0 / pre-activation tree: the dashed branch returns the
 * call UNCHANGED, so the literal `--double(50px)` reaches the compiled frame.
 */
import { describe, expect, it } from "vitest";
import type { CssValue } from "@mkbabb/value.js/value";
import { CSSKeyframesAnimation } from "../../src/animation/engine";
import { serializeCssValue } from "../../src/animation/compile/emit/css-text";

/**
 * Read the COMPILED frame's flat value STRING for `prop` (the post-flatten,
 * post-resolve carrier). The lowered `@function` call surfaces here as its
 * substituted `result` expression — `calc(50px * 2)` where `--double(50px)`
 * stood. A DROPped declaration (the cycle-guard, a guaranteed-invalid call) is
 * ABSENT from `flatVars`, so a missing key is the DROP witness.
 */
const compiledValueString = (
    anim: CSSKeyframesAnimation<any>,
    prop: string,
): string | undefined => {
    for (const frame of anim.frames) {
        const fv = frame.flatVars as Record<string, unknown>;
        const matchKeys = Object.keys(fv).filter(
            (k) => k === prop || k.startsWith(prop + "."),
        );
        if (matchKeys.length === 0) continue;
        const parts: string[] = [];
        for (const k of matchKeys) {
            const leaf = fv[k];
            parts.push(
                Array.isArray(leaf)
                    ? leaf.map((u) => String(u)).join(" ")
                    : String(leaf),
            );
        }
        return parts.join(" ");
    }
    return undefined;
};

/**
 * Read the resolved leaf STRING of a template frame's `prop` value (the
 * pre-flatten carrier `resolveValues` rewrote). A DROPped declaration omits the
 * key entirely → `undefined`.
 */
const templateValueString = (
    anim: CSSKeyframesAnimation<any>,
    startPercent: number,
    prop: string,
): string | undefined => {
    const frame = anim.templateFrames.find(
        (f) => f.start.kind === "percent" && f.start.value * 100 === startPercent,
    );
    if (!frame) return undefined;
    const vars = frame.vars as Record<string, unknown>;
    if (!(prop in vars)) return undefined;
    return serializeCssValue(vars[prop] as CssValue);
};

describe("Q.WB2 — emerging-css-resolve-fn (@function call-inlining)", () => {
    // ── S.C4/S2 — THE KF-1 RUNTIME VECTOR (owner ruling 5; the value.js-2.0.x
    //    consume-edge gate clause). The spec-form typed param with a default —
    //    `--f(--x <length>: 0px)` — must arrive from value.js's extractFunctions
    //    as the CLEAN split {name:"--x", syntax:"<length>", default:"0px"}
    //    (value.js ≤1.2.0 mis-split it as {name:"--x <length>", type:"0px"} —
    //    the shim kf deleted at S2 compensated for exactly that). The vector
    //    exercises BOTH clean fields end-to-end: the MISSING positional takes
    //    the parsed default (0px), and a syntax-mismatched arg falls back to it.
    it("KF-1: --f(--x <length>: 0px) — the clean typed-param split rides the resolve path (missing positional → the 0px default)", () => {
        const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "@function --f(--x <length>: 0px) { result: calc(var(--x) + 10px); }\n" +
                "@keyframes z {\n" +
                "  0% { width: --f(); }\n" +
                "  100% { width: 200px; }\n" +
                "}",
        );
        const v = compiledValueString(anim, "width");
        // The call token is GONE and the default (0px) was substituted — the
        // clean `.default` field parsed and bound (a mis-split 1.2.0-shaped
        // descriptor would have DROPped the frame: no recoverable default).
        expect(v).toBeDefined();
        expect(v).not.toContain("--f(");
        expect(v).toContain("0px");
    });

    // ── inline-evaluates (KEYSTONE): --double(50px) → calc(50px * 2) ─────────
    it("inlines a registered @function call: --double(50px) substitutes var(--x)→50px and drops the call token", () => {
        const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "@function --double(--x) { result: calc(var(--x) * 2); }\n" +
                "@keyframes z {\n" +
                "  0% { width: --double(50px); }\n" +
                "  100% { width: 200px; }\n" +
                "}",
        );

        const v = compiledValueString(anim, "width");
        expect(v).toBeDefined();
        // The literal --double(...) call is GONE; the substituted result stands
        // in its place: the var(--x) became 50px, the `* 2` doubling preserved.
        // (calc→100px is value.js's DOM computed-unit step, not run under jsdom.)
        expect(v).not.toContain("--double(");
        expect(v).toContain("calc");
        expect(v).toContain("50px");
        expect(v).toMatch(/\b2\b/);
    });

    // ── nested-lowering: --double(--triple(10px)) → calc(calc(10px*3)*2) ─────
    it("recurses into a nested call: --double(--triple(10px)) lowers the inner --triple first", () => {
        const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "@function --double(--x) { result: calc(var(--x) * 2); }\n" +
                "@function --triple(--y) { result: calc(var(--y) * 3); }\n" +
                "@keyframes z {\n" +
                "  0% { width: --double(--triple(10px)); }\n" +
                "  100% { width: 200px; }\n" +
                "}",
        );

        const v = compiledValueString(anim, "width");
        expect(v).toBeDefined();
        // BOTH call tokens are GONE; the inner --triple(10px) lowered to a
        // calc(10px * 3) which became --double's bound arg → calc(calc(10px*3)*2).
        expect(v).not.toContain("--double(");
        expect(v).not.toContain("--triple(");
        expect(v).toContain("10px");
        expect(v).toMatch(/\b3\b/); // the inner *3
        expect(v).toMatch(/\b2\b/); // the outer *2
    });

    // ── cycle-guard: a self-referential @function DROPs at first re-entry ────
    it("a self-referential @function DROPs (never hangs): --a calls --a", () => {
        const t0 = Date.now();
        const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "@function --a(--x) { result: --a(var(--x)); }\n" +
                "@keyframes z {\n" +
                "  0% { width: --a(50px); }\n" +
                "  100% { width: 200px; }\n" +
                "}",
        );
        // Bounded: the cycle-guard DROPs at the FIRST re-entry (via ctx.seen),
        // never recursing to the depth ceiling, never blowing the stack.
        expect(Date.now() - t0).toBeLessThan(2000);

        // The guaranteed-invalid self-reference DROPs the declaration: the 0%
        // `width` is OMITTED (the prior/initial value wins per the CSS
        // guaranteed-invalid rule), so the key is absent from both carriers.
        expect(templateValueString(anim, 0, "width")).toBeUndefined();
        const compiled = compiledValueString(anim, "width");
        // The 100% frame's literal `200px` remains; the 0% lowered-away value is
        // gone, so the compiled width never carries a `--a(` token.
        if (compiled !== undefined) {
            expect(compiled).not.toContain("--a(");
        }
    });

    // ── coerce-fallback (ACTIVE — value.js 1.2.0 ships coerceToSyntax): a
    //    type-mismatched arg falls back to the param default, never a NaN ─────
    it("coerces a typed arg: --dbl(red) with --x <length> default 0px falls back to 0px (NOT red, NOT NaN)", () => {
        const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "@function --dbl(--x <length>: 0px) { result: calc(var(--x) * 2); }\n" +
                "@keyframes z {\n" +
                "  0% { width: --dbl(red); }\n" +
                "  100% { width: 200px; }\n" +
                "}",
        );

        const v = compiledValueString(anim, "width");
        expect(v).toBeDefined();
        // `red` failed the <length> coercion → the param default 0px substituted
        // (the CSS Functions & Mixins L1 fallback). NEVER a spliced `calc(red*2)`.
        expect(v).not.toContain("--dbl(");
        expect(v).not.toContain("red");
        expect(v).not.toContain("NaN");
        expect(v).toContain("0px");
    });

    // ── coerce-pass: a matching typed arg passes through un-substituted ──────
    it("a matching typed arg passes coercion: --dbl(50px) with --x <length> keeps 50px", () => {
        const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "@function --dbl(--x <length>: 0px) { result: calc(var(--x) * 2); }\n" +
                "@keyframes z {\n" +
                "  0% { width: --dbl(50px); }\n" +
                "  100% { width: 200px; }\n" +
                "}",
        );

        const v = compiledValueString(anim, "width");
        expect(v).toBeDefined();
        expect(v).not.toContain("--dbl(");
        // The valid arg (50px) won, NOT the default — the substituted operand is
        // exactly `50px`, not `0px`. (`50px` lexically contains the substring
        // `0px`, so assert the OPERAND identity, not a substring-absence.)
        expect(v).toMatch(/\bcalc\(\s*50px\b/);
    });

    // ── surplus-arg: more args than params is a guaranteed-invalid call → DROP
    it("a surplus arg DROPs the declaration: --double(50px, 99px) has more args than params", () => {
        const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "@function --double(--x) { result: calc(var(--x) * 2); }\n" +
                "@keyframes z {\n" +
                "  0% { width: --double(50px, 99px); }\n" +
                "  100% { width: 200px; }\n" +
                "}",
        );
        // Guaranteed-invalid (2 args, 1 param) → the 0% width is OMITTED.
        expect(templateValueString(anim, 0, "width")).toBeUndefined();
    });

    // ── missing-positional: an absent arg takes the param default ────────────
    it("a missing positional takes the param default: --dbl() with --x <length> default 0px → 0px", () => {
        const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "@function --dbl(--x <length>: 0px) { result: calc(var(--x) * 2); }\n" +
                "@keyframes z {\n" +
                "  0% { width: --dbl(); }\n" +
                "  100% { width: 200px; }\n" +
                "}",
        );
        const v = compiledValueString(anim, "width");
        expect(v).toBeDefined();
        expect(v).not.toContain("--dbl(");
        expect(v).toContain("0px");
    });

    // ── no-regression: a non-@function call (an UNregistered dashed name) is
    //    left intact (only registered names inline) ──────────────────────────
    it("an UNregistered dashed call is left intact (only registered @function names inline)", () => {
        const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "@keyframes z {\n" +
                "  0% { width: --unregistered(50px); }\n" +
                "  100% { width: 200px; }\n" +
                "}",
        );
        // No descriptor → the dashed branch is not taken → the call recurses as a
        // generic function (children resolved, name kept). It is NOT inlined, so
        // the resolve pass leaves the literal call on the template frame (the
        // downstream compiler owns an unknown-function flatten — out of scope).
        const v = templateValueString(anim, 0, "width");
        expect(v).toBeDefined();
        expect(v).toContain("--unregistered(");
    });
});
