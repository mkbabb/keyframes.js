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
 * Linking an escaped-name sibling feeds its text to `resolveKeyframes`. value.js
 * **4.0.0** refused a CSS escape — and any non-ASCII identifier — in the
 * DECLARATION-VALUE position (`parseCssValues("pu\\+lse")` → ok:false
 * [css_syntax] expected ["scalar"]), so every escaped-name reconstruction
 * surfaced a citable `PARSE_ERROR` instead of riding the sibling's options, and
 * clause (c) pinned that state as a tripwire. **RE-CUT AT THE 4.1.0 REPIN
 * (KF.W3 .c1, 2026-11-02) — the tripwire fired as designed**: 4.1.0's value
 * grammar accepts those idents (`parseCssValues("pu\\+lse")` and
 * `parseCssValues("puélse")` → ok:true), so five of the six names below now
 * link END TO END — no diagnostic, the sibling's 2500ms on the object (clause
 * b). The one 4.1.0 still refuses is the escaped PAREN, `a\(b`, at the
 * stylesheet RULE level (`expected rule, got @keyframes a\…(b`): clause (c)
 * keeps that real subject, so the ingest is still proven honest — a citable
 * diagnostic, never a silent drop — where the grammar's bound now sits.
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

/** The one of them value.js 4.1.0 still refuses (clause c's subject). */
const REFUSED = "a\\(b";
/** The rest: accepted by 4.1.0's grammar, so they link end to end (clause b). */
const ACCEPTED = ESCAPED.filter(([name]) => name !== REFUSED);

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
    // reconstruction. At value.js 4.1.0 the grammar accepts these escaped idents,
    // so the linkage is observable where it matters most: END TO END — the
    // reconstruction is clean and the sibling's 2500ms is on the object (at
    // 4.0.0 it could only be read off a refusal's `input`; clause c keeps that
    // reading for the name 4.1.0 still refuses).
    for (const [name, what] of ACCEPTED) {
        it(`links "${name}" (${what}) — its sibling's options ride the parse`, () => {
            const sheet = installSheet(
                `@keyframes ${name} ${STOPS} .t { animation: ${name} 2500ms linear; }`,
            );
            const { animations, diagnostics } = fromStyleSheets([sheet]);
            // Walk-level rows are for unreadable SHEETS; this one is readable.
            expect(diagnostics.length).toBe(0);
            const ingested = animations.get(name);
            expect(ingested).toBeDefined();
            expect(ingested!.diagnostics).toEqual([]);
            expect(ingested!.animation.templateFrames.length).toBe(2);
            expect(ingested!.animation.options.duration).toBe(2500);
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

describe("G-W2-4 clause (c) — the grammar's bound at value.js 4.1.0, held citably", () => {
    it("the 4.0.0 value-grammar refusal is gone: `pu\\+lse` reconstructs with no PARSE_ERROR", () => {
        // THE TRIPWIRE, RE-CUT (KF.W3 .c1). Through 4.0.0 this case asserted the
        // value.js-side REFUSAL (`expected ["scalar"]`); 4.1.0 accepts the ident
        // and the assertion went RED exactly as it promised to. It now states the
        // 4.1.0 contract, so a grammar that regresses to refusing escaped idents
        // turns it RED again.
        const sheet = installSheet(
            `@keyframes pu\\+lse ${STOPS} .t { animation: pu\\+lse 2500ms linear; }`,
        );
        const ingested = fromStyleSheets([sheet]).animations.get("pu\\+lse")!;
        expect(ingested.diagnostics.map((d) => d.code)).not.toContain("PARSE_ERROR");
        expect(ingested.animation.options.duration).toBe(2500);
    });

    it("an escaped paren is still REFUSED, citably — a PARSE_ERROR naming it, never a silent drop", () => {
        // The negative control keeps a REAL subject: 4.1.0's stylesheet grammar
        // refuses the escaped paren at the RULE level (`expected rule, got
        // @keyframes a\…(b`; the realm re-escapes the backslash, so the count of
        // them is not asserted). The linkage still happened — the refusal's
        // `input` carries the sibling's text first — and the sibling's options
        // do NOT silently ride an animation that was never reconstructed.
        const sheet = installSheet(
            `@keyframes ${REFUSED} ${STOPS} .t { animation: ${REFUSED} 2500ms linear; }`,
        );
        const ingested = fromStyleSheets([sheet]).animations.get(REFUSED)!;
        const parseError = ingested.diagnostics.find(
            (d) => d.code === "PARSE_ERROR",
        );
        expect(parseError).toBeDefined();
        expect(parseError!.message).toMatch(/@keyframes a\\+\(b/);
        expect(
            parseError!.input?.startsWith(`.t { animation: ${REFUSED} 2500ms linear; }`),
        ).toBe(true);
        expect(ingested.animation.templateFrames.length).toBe(0);
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
