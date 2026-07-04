/**
 * validate.ts — L.W6 THE AGENT-AUTHORING VERB (the forward direction of the
 * moat: the VALIDATION layer over the compile surface).
 *
 * The kf moat is bi-directional CSS: INGEST → ANIMATE → COMPILE. `compileToCSS`
 * (K.W10) closes the loop from JS back to CSS. `validate` is the FORWARD half —
 * not a new direction but the first question an LLM agent asks before it decides
 * whether to suggest kf at all: "will this `@keyframes` block ship faithfully?"
 *
 * ── A READ-ONLY PROJECTION — NO new engine code. ─────────────────────────────
 * Every PART of the answer already exists and is gate-proven. `validate` is a
 * pure JOIN over three already-typed channels onto ONE agent-shaped envelope:
 *   • `Animation.diagnostics` (adapter `resolveKeyframes`) — every silent
 *     parse/honoring fallback the resolve path used to swallow, now a citable row.
 *   • `CompiledCSS.{eligible,refusals}` (compile `compileToCSS`) — the CC-3
 *     ineligibility report (the four named refusals).
 *   • `WAAPIEligibility` (waapi `isWAAPIEligible`) — the compositor-thread verdict.
 * The distinction from the existing channels is ALTITUDE: a consumer today must
 * call `resolveKeyframes` + `compileToCSS` + `isWAAPIEligible` independently and
 * join the results by hand. The verb does the join, validates parse-safety before
 * compiling, and returns a flat result the LLM branches on WITHOUT scraping a
 * message string. It adds NO new drop-diagnostic — it READS the channels L.W1/L.W2
 * already made honest.
 *
 * ── L.W1 S1 CORRECTION (load-bearing for the @property/!important fixture) ────
 * Keyframe `!important` is SPEC-INVALID per CSS Animations §3, and value.js 0.13.0
 * DROPS the whole declaration at the AST level — correct, it mirrors the browser.
 * kf does NOT honor/emit keyframe `!important` (emitting it would ship invalid
 * CSS). So `validate` over a block containing `opacity: 0 !important` projects the
 * SPEC-FAITHFUL reality: `parseable:true` (the REST of the block parses; value.js
 * does not throw on the dropped declaration), the `@property` block (L.W1 S2) DOES
 * round-trip and is `eligible:true`, and there is NO keyframe-`!important` drop-row
 * in `diagnostics` (value.js silently drops it at the AST — the diagnostic-
 * surfacing of that drop is a value.js-O dispatch, NOT in validate's projection
 * yet). `validate` asserts no claim that `!important` is honored/emitted — that
 * claim was RETRACTED.
 *
 * ── BOUNDARY: HEAVY (value.js-bearing). ──────────────────────────────────────
 * This module statically imports `./engine` (`CSSKeyframesAnimation`), `./compile`
 * (`compileToCSS`), and `./waapi` (`isWAAPIEligible`) — all of which carry static
 * `@mkbabb/value.js` edges — plus value.js's own `parseCSSStylesheet`/
 * `extractKeyframes`. It is reached ONLY via `loadAnimationEngine()`; the LIGHT
 * static barrel re-exports only its erased TYPES (`import type`). `proof:boundary`
 * stays green (the value.js-free light surface stays value.js-free).
 */

import { extractKeyframes, parseCSSStylesheet } from "@mkbabb/value.js";
import { CSSKeyframesAnimation } from "./engine";
import { compileToCSS } from "./compile";
import { isWAAPIEligible } from "./waapi";
import type { Diagnostic } from "./compile/adapter";
import type { CompileOptions, CompileRefusal } from "./compile";
import type { WAAPIEligibility } from "./waapi";

/**
 * Options for {@link validate} / {@link explain}. A thin pass-through to the
 * underlying channels — NOT a new option surface. `compile` forwards verbatim to
 * `compileToCSS` (the ΔE-ε / densify-stop knobs the refusal arm reads).
 */
export interface ValidateOptions {
    /**
     * Forwarded verbatim to `compileToCSS` — the CC-2 densify-stop count + the
     * ΔE-ε ship-vs-refuse threshold the perceptual-oklab refusal arm reads. Omit
     * for the compiler defaults.
     */
    compile?: CompileOptions;
}

/**
 * The flat, agent-shaped envelope `validate` returns — the JOIN over the three
 * typed channels. An LLM agent branches on these fields WITHOUT scraping a
 * message string. Every constituent type (`CompileRefusal`, `Diagnostic`,
 * `WAAPIEligibility`) is already exported from the barrel — the ONLY new type is
 * this envelope.
 */
export interface ValidateResult {
    /**
     * True iff value.js parsed the CSS without a `PARSE_ERROR` diagnostic — the
     * block surfaced at least one recognized stylesheet item (a `@keyframes` /
     * `@property` / style rule). A spec-invalid keyframe `!important` declaration
     * is SILENTLY dropped at the AST by value.js (the L.W1 S1 reality) — that drop
     * is NOT a parse failure, so a block carrying it stays `parseable:true`.
     */
    parseable: boolean;
    /**
     * True iff `compileToCSS` produced an artifact for every child — the compile
     * surface's own `eligible` flag. False when any child refused (see
     * {@link refusals}). Separate from {@link waapi}: a block can be compile-
     * eligible (the CSS round-trips faithfully) yet WAAPI-ineligible (color
     * interpolation, computed units) and vice versa.
     */
    eligible: boolean;
    /**
     * The CC-3 refusals — one per child that could not compile faithfully (the
     * `{ name, reason, message }` trust surface). Empty on a clean compile.
     */
    refusals: CompileRefusal[];
    /**
     * All parse/honoring diagnostics from `resolveKeyframes` — every SILENT
     * fallback the adapter used to swallow, now a citable row with a stable
     * {@link Diagnostic.code}. Empty on a clean parse.
     */
    diagnostics: Diagnostic[];
    /**
     * The WAAPI eligibility verdict — `{ eligible: true }` or
     * `{ eligible: false; reason: string }`. Separate from {@link eligible}: the
     * compositor-thread delegation has its own, narrower bar (no color interp, no
     * computed units, a uniform CSS-twinned easing).
     */
    waapi: WAAPIEligibility;
}

/**
 * Build the throwaway animation the projection reads. `fromString` runs the SAME
 * `resolveKeyframes` path the engine uses — it populates `anim.diagnostics` (the
 * adapter's structured channel) and parses the keyframes into compiled frames the
 * compile + waapi reads consume. No targets are attached (validate is a static
 * read — there is no DOM to animate), so the WAAPI verdict reflects the curve's
 * intrinsic eligibility minus the "has a DOM target" precondition.
 */
const buildAnimation = (css: string): CSSKeyframesAnimation<any> =>
    new CSSKeyframesAnimation<any>().fromString(css);

/**
 * `validate(css, opts?)` — the READ-ONLY projection over the three typed channels
 * onto one {@link ValidateResult} envelope. Async because `compileToCSS` is (its
 * Prettier pass).
 *
 * The pipeline:
 *   1. `parseCSSStylesheet(css)` → the AST; `parseable` is true when value.js
 *      surfaced at least one recognized item and the resolve raised no
 *      `PARSE_ERROR` (the spec-faithful reality — a dropped `!important` decl is
 *      not a parse failure).
 *   2. `CSSKeyframesAnimation.fromString(css)` → the parsed animation +
 *      `anim.diagnostics` (the adapter's silent-fallback channel).
 *   3. `compileToCSS([anim], opts.compile)` → `{ eligible, refusals }`.
 *   4. `isWAAPIEligible(anim)` → the compositor-thread verdict.
 */
export async function validate(
    css: string,
    opts: ValidateOptions = {},
): Promise<ValidateResult> {
    const animation = buildAnimation(css);

    // The adapter's structured channel — every silent parse/honoring fallback the
    // resolve path surfaced (EMPTY_PARSE, COMPOSITION_FALLBACK, any value.js
    // PARSE_ERROR consumed through OnParseError). Read, never re-authored.
    const diagnostics = [...animation.diagnostics];

    // `parseable` — value.js parsed the CSS without a hard parse failure. A
    // `PARSE_ERROR` row (the consumed value.js `OnParseError` shape) flips it
    // false; an `EMPTY_PARSE` row (a non-empty input that yielded zero @keyframes
    // rules) is a frame-less result, also un-parseable as an animation. A
    // spec-invalid keyframe `!important` is NOT in either class — value.js drops
    // that declaration silently at the AST, so the block stays parseable.
    const hardParseFailure = diagnostics.some(
        (d) => d.code === "PARSE_ERROR" || d.code === "EMPTY_PARSE",
    );
    const parseable = css.trim().length > 0 && !hardParseFailure;

    // The compile channel — the CC-3 ineligibility report. `compileToCSS` walks
    // the single-animation child list and reads its `{ eligible, refusals }`.
    const compiled = await compileToCSS([animation], opts.compile ?? {});

    // The WAAPI channel — the compositor-thread verdict (its own narrower bar).
    const waapi = isWAAPIEligible(animation);

    return {
        parseable,
        eligible: compiled.eligible,
        refusals: compiled.refusals,
        diagnostics,
        waapi,
    };
}

/**
 * Recover the `@keyframes` block names from the parsed AST for {@link explain}'s
 * heading line. `extractKeyframes` keys by name; the anonymous-wrap (`@keyframes
 * anonymous`) the adapter applies to a bare stop-list shows through here as
 * `anonymous`. Empty when the input surfaced no @keyframes rules.
 */
const keyframesNames = (css: string): string[] => {
    try {
        return [...extractKeyframes(parseCSSStylesheet(css)).keys()];
    } catch {
        return [];
    }
};

/**
 * `explain(css, opts?)` — the human/LLM-readable companion. Calls
 * {@link validate} and formats the result as a concise, DETERMINISTIC string
 * (field order fixed, no locale-sensitive formatting) so a doctest can assert it
 * byte-for-byte. The shape the demo's ineligibility panel produces, as a
 * first-class library API. An LLM agent can present it verbatim or parse it for a
 * fix suggestion.
 *
 * Format (one block; the `–` bullets enumerate the refusals / WAAPI reason /
 * diagnostics, each on its own line):
 *
 *   @keyframes color-drift:
 *     parseable: yes
 *     compile-eligible: no
 *       – perceptual-oklab: color-drift cannot compile: …
 *     waapi-eligible: no
 *       – color interpolation requires perceptual lerp
 *     diagnostics:
 *       – COMPOSITION_FALLBACK: …
 */
export async function explain(
    css: string,
    opts: ValidateOptions = {},
): Promise<string> {
    const result = await validate(css, opts);
    const names = keyframesNames(css);
    const heading =
        names.length > 0 ? names.join(", ") : "(no @keyframes block)";

    const lines: string[] = [];
    lines.push(`@keyframes ${heading}:`);
    lines.push(`  parseable: ${result.parseable ? "yes" : "no"}`);

    lines.push(`  compile-eligible: ${result.eligible ? "yes" : "no"}`);
    for (const refusal of result.refusals) {
        lines.push(`    – ${refusal.reason}: ${refusal.message}`);
    }

    lines.push(`  waapi-eligible: ${result.waapi.eligible ? "yes" : "no"}`);
    if (!result.waapi.eligible) {
        lines.push(`    – ${result.waapi.reason}`);
    }

    if (result.diagnostics.length > 0) {
        lines.push("  diagnostics:");
        for (const d of result.diagnostics) {
            lines.push(`    – ${d.code}: ${d.message}`);
        }
    }

    return lines.join("\n");
}
