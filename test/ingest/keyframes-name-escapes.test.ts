// SERVED MODEL: claude-opus-5[1m]
/**
 * keyframes-name-escapes.test.ts — X.KF.W2 · G-W2-4: the CSSOM ingest's
 * sibling-rule linkage against an `@keyframes` IDENTIFIER THAT IS NOT A SAFE
 * REGEX.
 *
 * ── WHAT WAS WRONG (born-RED, measured at kf `7d958f21` before the cure) ─────
 * The linkage in `ingest/cssom.ts` built
 *   `new RegExp(\`\\banimation(?:-name)?\\s*:[^;}]*\\b${name}\\b\`)`
 * out of the `@keyframes` rule's OWN identifier and tested it against each style
 * rule's `cssText`. That identifier is AUTHOR-controlled and may carry regex
 * metacharacters — CSS escapes make `@keyframes pu\+lse` and `@keyframes a\(b`
 * perfectly legal — so the interpolation had two outcomes and no third:
 *
 *   (i)  it THREW. Where the CSSOM reports the UNESCAPED identifier — what a
 *        browser's `CSSKeyframesRule.name` gives, e.g. `pu(lse` for `@keyframes
 *        pu\(lse` — the interpolated source is an invalid pattern and
 *        `new RegExp` raised `SyntaxError: Invalid regular expression … Unterminated
 *        group`. That construction sat ABOVE the per-rule `try/catch` (which
 *        lives in `reconstructFromRule`) and outside the per-sheet one (which
 *        wraps only the `cssRules` read), so the throw left `resolveLiveKeyframes`
 *        entirely and aborted the whole walk — the exact "never an uncaught
 *        throw" the module's VJ-9 tripwire comment claims for the ingest.
 *
 *   (ii) it MIS-MATCHED, silently. Where the CSSOM reports the RAW escaped text
 *        (jsdom's reading), `\bpu\+lse\b` looks for the literal `pu+lse`, which
 *        no stylesheet contains: the sibling `.class { animation: … }` was never
 *        found and its options were DROPPED with no diagnostic. All six escaped
 *        names below returned `false` against their own sibling rule.
 *
 * ── THE CURE (root, not escape-hatch) ────────────────────────────────────────
 * The identifier never becomes a pattern. `declaredAnimationNames` reads the
 * identifiers the CSSOM has ALREADY parsed out of each style rule's declaration
 * block (`animation-name` ∪ the `animation` shorthand) and the linkage is string
 * EQUALITY over them. Clause (d) pins the precision that buys: `\b` treated the
 * `-` in `my-pulse` as a boundary, so a rule naming a DIFFERENT animation
 * answered to `pulse`; equality does not.
 *
 * ── THE BOUND THIS FIXTURE MEASURES AND DOES NOT HIDE (clause c) ─────────────
 * Linking an escaped-name sibling now feeds its text to `resolveKeyframes`, and
 * value.js **4.0.0** (the installed pin; OP-5 forbids a repin) refuses a CSS
 * escape — and any non-ASCII identifier — in the DECLARATION-VALUE position:
 *   parseCssValues("pu\\+lse")  → ok:false [css_syntax] expected ["scalar"]
 *   parseCssValues("puélse")    → ok:false [css_syntax] expected ["scalar"]
 * while the `@keyframes` NAME position accepts both. So the reconstruction of an
 * escaped-name animation surfaces a citable `PARSE_ERROR` naming the identifier
 * instead of riding the sibling's options. That is the module's own VJ-9
 * tripwire BITING rather than a kf defect: the ingest is honest (a diagnostic,
 * never a silent drop) and its robustness widens when the grammar does. Clause
 * (c) asserts that state deliberately, so the day value.js accepts escaped idents
 * this fixture goes red and the row is re-cut rather than rediscovered.
 */
import { describe, expect, it } from "vitest";
import { fromStyleSheets } from "../../src/animation/ingest";

/** Install a `<style>` sheet into the document; return its live CSSStyleSheet. */
const installSheet = (css: string): CSSStyleSheet => {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
    return style.sheet!;
};

const STOPS = "{ 0% { opacity: 0 } 100% { opacity: 1 } }";

/** Run `fn`, reporting a throw as a readable value rather than a raw stack. */
const noThrow = <T>(fn: () => T): { outcome: string; value?: T } => {
    try {
        return { outcome: "no throw", value: fn() };
    } catch (e) {
        return {
            outcome: `threw ${
                e instanceof Error ? `${e.name}: ${e.message}` : String(e)
            }`,
        };
    }
};

/**
 * A minimal duck-typed CSSOM over the module's documented DOM-free injection
 * seam (`fromStyleSheets(sheets)`): `isKeyframesRule`/`isGroupingRule` recognise
 * rules STRUCTURALLY — `type === 7` + `name` + `cssText`, and `type === 1` +
 * `cssText` — precisely so the walk is not coupled to one CSSOM implementation.
 * This fake reports the identifier the way a BROWSER's `CSSKeyframesRule.name`
 * does: UNESCAPED. jsdom cannot produce that reading (it reports the raw source
 * text, escapes included), and it is the reading that made `new RegExp` throw.
 */
const browserLikeSheet = (raw: string, escaped: string): CSSStyleSheet => {
    const styleRule = {
        type: 1,
        cssText: `.t { animation: ${escaped} 2500ms linear; }`,
        style: {
            getPropertyValue: (prop: string) =>
                prop === "animation" ? `${raw} 2500ms linear` : "",
        },
    };
    const keyframesRule = {
        type: 7,
        name: raw,
        cssText: `@keyframes ${escaped} ${STOPS}`,
    };
    return { cssRules: [styleRule, keyframesRule] } as unknown as CSSStyleSheet;
};

/** The names a `@keyframes` author can legally write that a regex cannot hold. */
const ESCAPED = [
    ["pu\\+lse", "plus"],
    ["a\\(b", "open paren"],
    ["wi\\*ld", "star"],
    ["qu\\?ery", "question mark"],
    ["cl\\[ass", "open bracket"],
    ["back\\\\slash", "backslash"],
] as const;

describe("G-W2-4 clause (a) — no identifier throws out of the walk", () => {
    // The browser reading: `CSSKeyframesRule.name` unescaped. Each of these is an
    // invalid regular expression the moment it is interpolated, and pre-cure each
    // aborted the ENTIRE walk from inside `walkSheet` — above every guard.
    for (const raw of ["pu(lse", "a)b", "x{2,}", "[unclosed", "a|b*+"]) {
        it(`\`${raw}\` walks without throwing`, () => {
            const escaped = raw.replace(/[^\w-]/g, (c) => `\\${c}`);
            const run = noThrow(() =>
                fromStyleSheets([browserLikeSheet(raw, escaped)]),
            );
            expect(run.outcome).toBe("no throw");
            // And the walk still produced the rule, keyed by the reported name.
            expect(run.value!.animations.get(raw)).toBeDefined();
        });
    }

    it("the jsdom reading (raw escaped text) does not throw either", () => {
        for (const [name] of ESCAPED) {
            const sheet = installSheet(
                `@keyframes ${name} ${STOPS} .t { animation: ${name} 2500ms linear; }`,
            );
            expect(noThrow(() => fromStyleSheets([sheet])).outcome).toBe(
                "no throw",
            );
        }
    });
});

describe("G-W2-4 clause (b) — the escaped name LINKS its sibling rule", () => {
    // Pre-cure the pattern never matched, so the sibling text never reached the
    // reconstruction. The reconstruction's own diagnostic carries the exact
    // `input` it was handed, which is where the linkage is observable: the
    // sibling's declaration text is IN it, ahead of the `@keyframes` block.
    for (const [name, what] of ESCAPED) {
        it(`links "${name}" (${what}) — its sibling's text rides the parse`, () => {
            const sheet = installSheet(
                `@keyframes ${name} ${STOPS} .t { animation: ${name} 2500ms linear; }`,
            );
            const { animations, diagnostics } = fromStyleSheets([sheet]);
            // Walk-level rows are for unreadable SHEETS; this one is readable.
            expect(diagnostics.length).toBe(0);
            const ingested = animations.get(name);
            expect(ingested).toBeDefined();
            const inputs = ingested!.diagnostics.map((d) => d.input ?? "");
            expect(inputs.length).toBeGreaterThan(0);
            expect(
                inputs.every((input) =>
                    input.startsWith(`.t { animation: ${name} 2500ms linear; }`),
                ),
            ).toBe(true);
        });
    }

    it("a sheet with NO sibling hands the @keyframes block alone", () => {
        // The control for clause (b): when nothing names the animation there is
        // no sibling to link, the block parses clean, and no row is produced.
        const sheet = installSheet(`@keyframes on\\+ly ${STOPS}`);
        const ingested = fromStyleSheets([sheet]).animations.get("on\\+ly")!;
        expect(ingested.diagnostics).toEqual([]);
        expect(ingested.animation.templateFrames.length).toBe(2);
    });
});

describe("G-W2-4 clause (c) — the linked sibling is REFUSED, citably, by value.js 4.0.0", () => {
    it("an escaped identifier surfaces a PARSE_ERROR naming it — never a silent drop", () => {
        // THE DECLARED TRIPWIRE. This asserts the value.js-side bound, not a kf
        // behaviour: `pu\+lse` is a legal CSS ident that the 4.0.0 VALUE grammar
        // rejects (`expected ["scalar"]`), so the sibling-bearing source cannot
        // be reconstructed. When value.js accepts escaped idents this assertion
        // goes RED — deliberately: that is the signal to re-cut the row, not a
        // flake. Nothing here is narrowed to make it pass.
        const sheet = installSheet(
            `@keyframes pu\\+lse ${STOPS} .t { animation: pu\\+lse 2500ms linear; }`,
        );
        const ingested = fromStyleSheets([sheet]).animations.get("pu\\+lse")!;
        const codes = ingested.diagnostics.map((d) => d.code);
        expect(codes).toContain("PARSE_ERROR");
        const parseError = ingested.diagnostics.find(
            (d) => d.code === "PARSE_ERROR",
        )!;
        expect(parseError.message).toContain("pu\\+lse");
    });

    it("a value.js-parsable declaration DOES ride the linkage end to end", () => {
        // The linkage's own contract, isolated from the grammar bound above: the
        // CSSOM reports the identifier the BROWSER way (`pu+lse`, unescaped),
        // the declaration text the reconstruction is handed is one value.js
        // parses, and the sibling's 2500ms lands on the reconstructed object.
        // Pre-cure `\bpu+lse\b` read the `+` as a QUANTIFIER — a valid pattern
        // that matches `puuulse` and never the rule — so the link was lost and
        // the engine default rode. This is the mis-match arm, end to end.
        const styleRule = {
            type: 1,
            cssText: ".t { animation-duration: 2500ms; }",
            style: {
                getPropertyValue: (prop: string) =>
                    prop === "animation-name" ? "pu+lse" : "",
            },
        };
        const keyframesRule = {
            type: 7,
            name: "pu+lse",
            cssText: `@keyframes pu\\+lse ${STOPS}`,
        };
        const sheet = {
            cssRules: [styleRule, keyframesRule],
        } as unknown as CSSStyleSheet;
        const ingested = fromStyleSheets([sheet]).animations.get("pu+lse")!;
        expect(ingested.diagnostics).toEqual([]);
        expect(ingested.animation.templateFrames.length).toBe(2);
        expect(ingested.animation.options.duration).toBe(2500);
    });
});

describe("G-W2-4 clause (d) — equality, not substring: no foreign rule is linked", () => {
    it("`animation: my-pulse` does not answer to `@keyframes pulse`", () => {
        // `\bpulse\b` matched INSIDE `my-pulse` (the `-` is a word boundary), so
        // the pre-cure linkage pulled a foreign rule's options onto this
        // animation. Identifier equality cannot: no sibling is found and the
        // engine default rides instead of the foreign 2500ms.
        const sheet = installSheet(
            `@keyframes pulse ${STOPS} .other { animation: my-pulse 2500ms linear; }`,
        );
        const a = fromStyleSheets([sheet]).animations.get("pulse")!;
        expect(a.animation.options.duration).not.toBe(2500);
    });

    it("the plain-identifier control still links end to end (no regression)", () => {
        const sheet = installSheet(
            `@keyframes plainname ${STOPS} .t { animation: plainname 2500ms linear; }`,
        );
        const a = fromStyleSheets([sheet]).animations.get("plainname")!;
        expect(a.animation.options.duration).toBe(2500);
    });
});
