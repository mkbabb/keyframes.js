// SERVED MODEL: claude-opus-5[1m]
/**
 * parse-facade.ts — THE Tier-A grammar seam (X.KF.W2).
 *
 * ONE module under `src/animation/**` speaks to value.js's CSS grammar, ONE
 * named set of postures says what happens when a CSS string is bad, and ONE
 * answer is published for "which grammar belongs at this seam". Before this
 * module the seam was **21 parse-surface call sites over 10 runtime importer
 * modules**, each carrying its own `result.ok` branch and its own diagnostic
 * rendering — which is why four separate readings of "what does value.js throw
 * on" had to be reconciled before this wave could be written.
 *
 * WHAT THIS MODULE IS NOT: it mints no grammar. Every parse entry and every
 * collector below is `@mkbabb/value.js/css`'s own export, re-published at one
 * path. The only code here is the funnel — the postures, the single diagnostic
 * renderer, and the declaration pair.
 *
 * ── THE POSTURES ─────────────────────────────────────────────────────────────
 * A call site declares WHICH posture it takes; no site writes `result.ok`.
 *
 *   {@link requireParsed}  THROW    — a refusal becomes the caller's own typed
 *                                     error. The caller supplies the error; the
 *                                     façade owns the decision.
 *   {@link absorbParsed}   ABSORB   — a refusal becomes a declared empty value
 *                                     PLUS the surfaced `ParseIssue[]`.
 *   {@link swallowParsed}  SWALLOW  — a refusal AND a thrown parse both become
 *                                     the fallback; nothing reaches a surface.
 *   {@link orFallback}     FALLBACK — a refusal becomes a declared value; a
 *                                     thrown parse is NOT caught (that is
 *                                     SWALLOW's job, and the two are different
 *                                     postures, not one with an option).
 *
 * **ABSORB IS UNREACHABLE ON THE R1 CLASS, and the façade says so rather than
 * letting a fourth seat rediscover it.** value.js 4.0.0's `parseStylesheet`
 * THROWS — it does not refuse — on the empty-argument colour/`calc()` forms:
 * `parseStylesheet("@keyframes a{from{color:oklch()}}")` is a `TypeError`, not
 * an `ok:false`. A posture that absorbs refusals does not absorb that; only
 * SWALLOW covers both limbs.
 *
 * ── THE FROZEN PARSE BOUNDARY ────────────────────────────────────────────────
 * Every value.js 4.0.0 parse result is DEEP-FROZEN inside a frozen envelope, so
 * a consumer write into a façade result is a loud `TypeError`, never a silent
 * corruption. kf's own resolve lane already preserves that invariant (23 lines
 * over five `src/` modules) and `test/resolve/value4-immutable-resolve.test.ts`
 * already guards it at three assertions; the façade inherits it and publishes
 * it. The contract is pinned executably at `test/compile/valuejs-contract.test.ts`.
 */
import {
    collectAnimationOptions,
    collectCustomFunctions,
    collectKeyframes,
    collectPropertyDescriptors,
    collectStyleRules,
    collectTimelineOptions,
    parseAnimationRange,
    parseAnimationTimeline,
    parseCssScalar,
    parseCssValues,
    parseKeyframeSelector,
    parseStylesheet,
    parseTimingFunction,
    serializeTimelineOptions,
} from "@mkbabb/value.js/css";
import type { ParseIssue, ParseResult } from "@mkbabb/value.js/css";

// ── THE PARSE SURFACE — value.js's own entries, re-published at one path ─────
// Re-published, never re-implemented: the façade is a funnel, not a parser.
// The TYPE surface is deliberately NOT collapsed here — `import type` is erased
// and carries no runtime edge, so a type import of `@mkbabb/value.js/css` at a
// consumer is not a second grammar seam.
export {
    collectAnimationOptions,
    collectCustomFunctions,
    collectKeyframes,
    collectPropertyDescriptors,
    collectStyleRules,
    collectTimelineOptions,
    parseAnimationRange,
    parseAnimationTimeline,
    parseCssScalar,
    parseCssValues,
    parseKeyframeSelector,
    parseStylesheet,
    parseTimingFunction,
    serializeTimelineOptions,
};

/**
 * The single rendering of a value.js `ParseIssue` as human text. Two modules
 * carried byte-identical private copies of this (`selector.ts`'s `issueText`,
 * `adapter.ts`'s `parserMessage`); one grammar seam gets one renderer.
 */
export const formatParseIssue = (issue: ParseIssue): string =>
    `${issue.code} at ${issue.start}-${issue.end}: expected ${issue.expected.join(
        " or ",
    )}, got ${issue.actual ?? "end of input"}`;

/**
 * THROW — the refusal posture. The caller names the error it owes its own
 * domain (an `AnimationOptionError` with a field, a `TypeError` with the source
 * text); the façade owns the branch. A call site never writes `result.ok`.
 */
export function requireParsed<T>(
    result: ParseResult<T>,
    onRefusal: (diagnostics: readonly [ParseIssue, ...ParseIssue[]]) => Error,
): T {
    if (result.ok) return result.value;
    throw onRefusal(result.diagnostics);
}

/**
 * ABSORB — the refusal becomes `empty` and the diagnostics are SURFACED, never
 * dropped. Nothing throws on a refusal; see the module docblock for the R1
 * class this posture cannot reach.
 */
export function absorbParsed<T>(
    result: ParseResult<T>,
    empty: T,
): { readonly value: T; readonly issues: readonly ParseIssue[] } {
    return result.ok
        ? { value: result.value, issues: [] }
        : { value: empty, issues: result.diagnostics };
}

/**
 * SWALLOW — the total posture: a refusal, a THROWN parse and a throwing read
 * all yield `fallback`, and nothing surfaces. The read runs inside the posture
 * on purpose — the seam it replaces guarded parse and collect together, and
 * narrowing the guard here would be a behaviour change dressed as hygiene.
 */
export function swallowParsed<T, R>(
    parse: () => ParseResult<T>,
    read: (value: T) => R,
    fallback: R,
): R {
    try {
        const result = parse();
        return result.ok ? read(result.value) : fallback;
    } catch {
        return fallback;
    }
}

/**
 * FALLBACK — a refusal becomes a declared value. A THROWN parse propagates:
 * this posture decides only what value.js's `ok:false` means at the seam, and a
 * site that also needs the throw covered declares {@link swallowParsed}.
 */
export function orFallback<T, R>(result: ParseResult<T>, fallback: R): T | R {
    return result.ok ? result.value : fallback;
}
