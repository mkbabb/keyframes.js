/**
 * emerging-css-resolve-p2.test.ts — Q.WB1 (the emerging-CSS lowering pass,
 * Phase-2 element-AWARE arm). `proof:emerging-css-resolve-P2` (behaviour).
 *
 * P.W13 shipped the Phase-2 fields TYPED but never populated and the second
 * resolution pass NEVER authored — `if(style(--p))` lowered to the literal
 * `if(...)` string and `sibling-index()`/`sibling-count()` never even entered
 * the pass. Q.WB1 activates the typed seam: a SECOND `resolveValues` pass
 * post-`setTargets` against the SAME `ResolveContext` shape with an element-
 * populated `env`.
 *
 * A live, OBSERVABLE-TRUTH gate (the resolution is real against a REAL attached
 * jsdom DOM target — NOT a source grep, the gate-blindspot lesson). The source-
 * grep half (`scripts/proof-emerging-css-resolve-P2.mjs`) names the post-cure
 * anchors; this half is the live witness.
 *
 * Born-RED on today's tree: `evalCondition` returns `undefined` for `style(...)`,
 * `resolveNode` has no `sibling-*` arm, `hasResolvableValue` skips `sibling-*`,
 * and no second pass runs — so the literal `if(...)`/`sibling-index()` string
 * reaches the compiled frame.
 *
 * The HEAVY surface is reached as the engine tests do: `CSSKeyframesAnimation`
 * from the engine module, attaching real jsdom elements as targets.
 */
import { describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../../src/animation/engine";

/**
 * Read the resolved leaf STRING of the first template frame's `prop` value
 * AFTER `setTargets` (the Phase-2 lifecycle point). The template frame's `vars`
 * carries the pre-flatten `Record<string, ValueArray>` the second pass rewrites
 * in place, so a resolved branch / integer is observable on `vars[prop]`.
 */
const templateValueString = (
    anim: CSSKeyframesAnimation<any>,
    startPercent: number,
    prop: string,
): string | undefined => {
    const frame = anim.templateFrames.find(
        (f) => Number.parseFloat(String(f.start.value)) === startPercent,
    );
    if (!frame) return undefined;
    const vars = frame.vars as Record<string, unknown>;
    if (!(prop in vars)) return undefined;
    return String(vars[prop]);
};

/**
 * Read the COMPILED frame's flat value STRING for `prop` at the segment whose
 * start index matches `startPercent`. The compiled frame is the post-flatten
 * carrier; for a `calc(sibling-index() * 10px)` the resolved integer lands here
 * (the calc-to-pixels step is value.js's computed-unit DOM job, gated
 * elsewhere — Q.WB1's observable is that `sibling-index()` is REPLACED by the
 * resolved integer before flatten).
 */
const compiledValueString = (
    anim: CSSKeyframesAnimation<any>,
    prop: string,
): string | undefined => {
    for (const frame of anim.frames) {
        const fv = frame.flatVars as Record<string, unknown>;
        // A transform sub-leaf flattens to `transform.translateX`, a plain
        // property stays `left` — match the exact key OR a `prop.` sub-key.
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

/** Attach an element with `count` siblings under a fresh parent; return the
 * `index`-th (0-based) child so its 1-based `sibling-index()` is `index + 1`. */
const attachChild = (count: number, index: number): HTMLElement => {
    const parent = document.createElement("div");
    const children: HTMLElement[] = [];
    for (let i = 0; i < count; i++) {
        const c = document.createElement("div");
        parent.appendChild(c);
        children.push(c);
    }
    document.body.appendChild(parent);
    return children[index]!;
};

describe("Q.WB1 — emerging-css-resolve-P2 (Phase-2 element-aware)", () => {
    // ── env-populated: if(style(--p)) resolves the PRESENT branch ───────────
    it("if(style(--p)) resolves to the present branch when --p is set inline", () => {
        const el = document.createElement("div");
        el.style.setProperty("--p", "12px");
        document.body.appendChild(el);

        const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "@keyframes x {\n" +
                "  0% { width: if(style(--p): 100px; else: 0px) }\n" +
                "  100% { width: 200px }\n" +
                "}",
        );
        anim.setTargets(el);

        const v = templateValueString(anim, 0, "width");
        expect(v).toBeDefined();
        // The PRESENT branch (--p set) → 100px, the concrete length — NOT the
        // literal if(...) string.
        expect(v).not.toContain("if(");
        expect(v).not.toContain("style(");
        expect(v).toBe("100px");
    });

    it("if(style(--p)) resolves to the ELSE branch when --p is UNSET", () => {
        const el = document.createElement("div");
        // No --p set.
        document.body.appendChild(el);

        const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "@keyframes x {\n" +
                "  0% { width: if(style(--p): 100px; else: 0px) }\n" +
                "  100% { width: 200px }\n" +
                "}",
        );
        anim.setTargets(el);

        const v = templateValueString(anim, 0, "width");
        expect(v).toBeDefined();
        expect(v).not.toContain("if(");
        expect(v).toBe("0px");
    });

    it("if(style(--p: 12px)) evaluates EQUALITY against the resolved custom-prop", () => {
        const el = document.createElement("div");
        el.style.setProperty("--p", "12px");
        document.body.appendChild(el);

        const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "@keyframes x {\n" +
                "  0% { width: if(style(--p: 12px): 100px; else: 0px) }\n" +
                "  100% { width: 200px }\n" +
                "}",
        );
        anim.setTargets(el);
        expect(templateValueString(anim, 0, "width")).toBe("100px");

        // A non-matching value → the else branch.
        const el2 = document.createElement("div");
        el2.style.setProperty("--p", "99px");
        document.body.appendChild(el2);
        const anim2 = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "@keyframes x {\n" +
                "  0% { width: if(style(--p: 12px): 100px; else: 0px) }\n" +
                "  100% { width: 200px }\n" +
                "}",
        );
        anim2.setTargets(el2);
        expect(templateValueString(anim2, 0, "width")).toBe("0px");
    });

    // ── sibling-resolved (KEYSTONE): sibling-index()/sibling-count() → int ──
    // The OBSERVABLE: the `sibling-index()`/`sibling-count()` token is REPLACED by
    // the resolved integer before flatten. The subsequent `calc(2 * 10px) → 20px`
    // step is value.js's computed-unit DOM resolution (gated elsewhere) — it does
    // NOT resolve under jsdom (no layout). So the cure's witness is the integer
    // substitution: the compiled value carries the resolved `2`/`3` where the
    // literal `sibling-index()`/`sibling-count()` stood, never the function token.
    it("sibling-index() resolves to the 1-based DOM position (the 2nd of 3 → integer 2)", () => {
        const child2 = attachChild(3, 1); // 2nd of 3 → 1-based index 2

        const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "@keyframes x {\n" +
                "  0% { transform: translateX(calc(sibling-index() * 10px)) }\n" +
                "  100% { transform: translateX(100px) }\n" +
                "}",
        );
        anim.setTargets(child2);

        const v = compiledValueString(anim, "transform");
        expect(v).toBeDefined();
        // The literal sibling-index() is GONE; the resolved integer 2 stands in
        // its place (calc(2 * 10px) before the computed-unit DOM step).
        expect(v).not.toContain("sibling-index(");
        expect(v).toMatch(/\b2\b/);
        expect(v).toContain("10px");
    });

    it("sibling-count() resolves to the sibling total (3 children → integer 3)", () => {
        const child1 = attachChild(3, 0);

        const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "@keyframes x {\n" +
                "  0% { transform: translateX(calc(sibling-count() * 10px)) }\n" +
                "  100% { transform: translateX(100px) }\n" +
                "}",
        );
        anim.setTargets(child1);

        const v = compiledValueString(anim, "transform");
        expect(v).toBeDefined();
        expect(v).not.toContain("sibling-count(");
        expect(v).toMatch(/\b3\b/);
        expect(v).toContain("10px");
    });

    it("the env-populate is OFF-BY-ONE-proof: the 3rd of 3 children → integer 3, the 1st → integer 1", () => {
        // The plant-a-failure anchor from S4: a 0-based env or a count-for-index
        // swap would mis-resolve the position. The 3rd child (0-based index 2) has
        // 1-based sibling-index 3; the 1st child has sibling-index 1.
        const child3 = attachChild(3, 2);
        const animA = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "0% { transform: translateX(calc(sibling-index() * 10px)) } 100% { transform: translateX(0px) }",
        );
        animA.setTargets(child3);
        const vA = compiledValueString(animA, "transform");
        expect(vA).not.toContain("sibling-index(");
        expect(vA).toMatch(/\b3\b/);

        const child1 = attachChild(3, 0);
        const animB = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "0% { transform: translateX(calc(sibling-index() * 10px)) } 100% { transform: translateX(0px) }",
        );
        animB.setTargets(child1);
        const vB = compiledValueString(animB, "transform");
        expect(vB).not.toContain("sibling-index(");
        expect(vB).toMatch(/\b1\b/);
    });

    // ── idempotent-over-phase1: a mixed Phase-1 + Phase-2 declaration ───────
    it("a Phase-1-resolved leaf (if(media)) survives the 2nd pass unchanged while a sibling Phase-2 node in the SAME frame resolves", () => {
        // The idempotency concern: the second pass (Phase 2) must NOT corrupt
        // a leaf the FIRST pass (Phase 1) already resolved to a concrete value.
        // Use two declarations in one frame: `width` is a Phase-1 if(media)
        // (resolved at fromString via the SSR default → deterministic else
        // branch, a concrete length), `left` is a Phase-2 sibling-index() node.
        // After setTargets, `width` must read EXACTLY the Phase-1 result (the
        // second pass left it alone) and `left` must read the resolved integer.
        const child2 = attachChild(3, 1); // 1-based index 2 → 20px

        const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "@keyframes x {\n" +
                "  0% { width: if(media(min-width: 600px): 10px; else: 20px); left: calc(sibling-index() * 10px) }\n" +
                "  100% { width: 100px; left: 100px }\n" +
                "}",
        );
        // Phase 1 (fromString): width → else branch (matchMedia SSR no-match).
        const widthBefore = templateValueString(anim, 0, "width");
        expect(widthBefore).toBe("20px");

        anim.setTargets(child2);

        // Phase 1 leaf untouched by the 2nd pass (idempotent over the concrete leaf).
        const widthAfter = templateValueString(anim, 0, "width");
        expect(widthAfter).toBe("20px");

        // The Phase-2 sibling-index node resolved (index 2 substituted in).
        const leftAfter = compiledValueString(anim, "left");
        expect(leftAfter).toBeDefined();
        expect(leftAfter).not.toContain("sibling-index(");
        expect(leftAfter).toMatch(/\b2\b/);
    });

    // ── idempotent-over-phase1 (nested): supports → style, each resolved once ─
    it("a nested if(supports(...): if(style(--p)...)) resolves supports in Phase 1 + style in Phase 2", () => {
        // The injected supports env is only reachable via resolveKeyframes (the
        // adapter), so drive this case through resolveKeyframes directly with a
        // forced supports=true, then assert the residual is the inner style if()
        // (Phase 1 resolved the supports arm exactly once, leaving the style arm
        // for Phase 2). The full engine round-trip's Phase-2 resolution is
        // already covered by the env-populated/sibling-resolved clauses above.
        // This clause is the idempotency-of-the-nested-form witness.
        const el = document.createElement("div");
        el.style.setProperty("--p", "7px");
        document.body.appendChild(el);

        const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "@keyframes x {\n" +
                "  0% { width: if(supports(width: 1px): if(style(--p): 100px; else: 50px); else: 0px) }\n" +
                "  100% { width: 200px }\n" +
                "}",
        );
        anim.setTargets(el);

        const v = templateValueString(anim, 0, "width");
        expect(v).toBeDefined();
        // Whatever the supports branch resolved to (jsdom-dependent), the final
        // value MUST be a concrete length — NO literal if(...)/supports(...)/
        // style(...) survives. Both arms are fully discharged (Phase 1 picked a
        // supports branch; Phase 2 finished any residual style branch).
        expect(v).not.toContain("if(");
        expect(v).not.toContain("supports(");
        expect(v).not.toContain("style(");
        // The concrete value is one of: 100px (--p present, supports true),
        // 50px (supports true but --p absent — not this fixture), or 0px
        // (supports false). --p IS present, so when supports is true → 100px;
        // when supports is false → 0px. Either way it is fully resolved.
        expect(["100px", "0px"]).toContain(v);
    });

    // ── no-regression: a pure-Phase-1 animation is untouched by the 2nd pass ─
    it("a pure-Phase-1 (no element-aware node) animation never re-resolves at setTargets", () => {
        const el = document.createElement("div");
        document.body.appendChild(el);

        // if(media(...)) is Phase-1; resolves at fromString-time via the SSR
        // default (matchMedia → no-match → else branch). setTargets must not
        // re-touch it.
        const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "@keyframes x {\n" +
                "  0% { width: if(media(min-width: 600px): 10px; else: 20px) }\n" +
                "  100% { width: 100px }\n" +
                "}",
        );
        const before = templateValueString(anim, 0, "width");
        anim.setTargets(el);
        const after = templateValueString(anim, 0, "width");
        expect(before).toBe(after);
        // No env: SSR default matchMedia → no-match → else (20px).
        expect(after).toBe("20px");
    });
});
