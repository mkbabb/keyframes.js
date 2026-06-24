import {
    extractAnimationOptions,
    extractFunctions,
    extractKeyframes,
    extractProperties,
    parseCSSStylesheet,
    ValueArray,
    type CustomFunctionDescriptor,
    type KeyframeRule,
    type OnParseError,
    type ParseDiagnostic,
    type PropertyDescriptor,
    type Stylesheet,
} from "@mkbabb/value.js";
import {
    DROP,
    hasResolvableValue,
    makeResolveContext,
    resolveValues,
    type ResolveContext,
    type ResolveEnv,
} from "./resolve";

/**
 * The stable diagnostic `code`s the kf-side sink emits (K.W7 S4). A FLAT,
 * additive enum — NOT a logging framework — so a programmatic consumer branches
 * on the reason without scraping a message string (the J.W1 typed-throw idiom
 * lifted onto the structured field). The engine-internal rows
 * (`EMPTY_PARSE`/`UNKNOWN_TIMING_FN`) were J.W1-landed as typed throws; W7 lifts
 * them onto this field. `COMPOSITION_FALLBACK` is the K.W7 honesty row (the
 * non-numeric composite leaf's refusal). `PARSE_ERROR` carries the value.js
 * `OnParseError` producer's structured diagnostic verbatim. The CORS-skip /
 * WAAPI-reason rows are AUTHORED here but POPULATED by K.W8 (which owns the
 * CSSOM walk that produces them).
 */
export type DiagnosticCode =
    | "EMPTY_PARSE"
    | "UNKNOWN_TIMING_FN"
    | "COMPOSITION_FALLBACK"
    | "PARSE_ERROR"
    | "CORS_SKIP"
    | "WAAPI_INELIGIBLE"
    // The ingest-domain takeover REFUSAL (K.W8 / L.W3 S3). Distinct from
    // `WAAPI_INELIGIBLE` (a genuine Web-Animations-API ABSENCE — the element has
    // no `getAnimations()`): `ADOPT_REFUSE` is the API-PRESENT-but-cannot-adopt
    // class — no running animation by that name, the `@keyframes` rule could not
    // be found/reconstructed, or a scroll-driven `currentTime` carries a unit kf
    // cannot map. A consumer branches on the code to tell "WAAPI absent" from
    // "adopt refused" WITHOUT scraping the message (the stable-`code` contract).
    | "ADOPT_REFUSE";

/**
 * A structured parse/honoring diagnostic (K.W7 S4). Extends the value.js
 * `ParseDiagnostic` producer (the CONSUMED shape — `message`/`offset`/`line`/
 * `column`/`expected`/`input`) with a stable kf-side {@link DiagnosticCode} and
 * an optional `property` (the leaf a `COMPOSITION_FALLBACK` names). The
 * value.js half (`message`/`offset`/…) is `Partial` because the engine-internal
 * rows (EMPTY_PARSE, COMPOSITION_FALLBACK) are NOT byte-offset parse failures —
 * they carry a `message` + `code` only; a row sourced from the value.js
 * `OnParseError` producer carries the full positional record. NOT a kf-local
 * re-author of the producer: it CONSUMES `ParseDiagnostic`'s field shape and
 * widens it with the stable code (inv-16 published-only consumption holds).
 */
export interface Diagnostic extends Partial<ParseDiagnostic> {
    /** A stable, branch-on-able code — never scrape `message`. */
    code: DiagnosticCode;
    /** The human-readable summary (always present; the producer's or kf's). */
    message: string;
    /** The CSS property a `COMPOSITION_FALLBACK` refuses to composite. */
    property?: string;
}

/**
 * Result of normalising a CSS keyframes input down to the shape the
 * `CSSKeyframesAnimation.fromString` flow expects: a `Map<percent →
 * vars>` of ready-to-add frames, plus side data (per-keyframe timing
 * functions, the `@property` registry, and any animation-shorthand
 * options that came from a sibling style rule).
 */
export interface ResolvedKeyframes {
    /** percent-string → flat `{prop: value}` snapshot */
    keyframes: Map<string, Record<string, unknown>>;
    /** per-keyframe `animation-timing-function`, keyed by percent string */
    timingFunctions: Map<string, string>;
    /**
     * per-keyframe `animation-composition` (`replace` | `add` | `accumulate`),
     * keyed by percent string — value.js lifts it onto `rule.composition`; the
     * adapter used to drop it. Captured (F.W8); honoring it (→ WAAPI
     * `composite` / rAF accumulate) is BOOKed, not half-wired.
     */
    composition: Map<string, string>;
    /** `@property --foo { ... }` registry */
    properties: Map<string, PropertyDescriptor>;
    /**
     * `@function --foo(...) { ... }` descriptor registry (P.W13 — the emerging-CSS
     * resolve seam). Collected via value.js `extractFunctions` exactly as
     * `properties` is collected via `extractProperties`. Threaded into the
     * {@link resolveValues} pass's {@link ResolveContext} so the dashed-function
     * `@function` CALL-inlining lands greenable the moment value.js-P publishes
     * the call-parse arm; the descriptor is captured NOW (a read-only registry —
     * the inlining that CONSUMES it is the value.js-P-gated seam in
     * `resolve-values.ts`).
     */
    functions: Map<string, CustomFunctionDescriptor>;
    /**
     * Animation options recovered from a top-level style rule's
     * `animation` shorthand or longhand declarations (if any). Empty
     * when the input has no matching style rule.
     */
    options: ReturnType<typeof extractAnimationOptions>;

    /**
     * Structured parse/honoring diagnostics (K.W7 S4) — every SILENT fallback
     * the resolve path used to swallow, now a citable row. CONSUMES the value.js
     * 0.12.0 `ParseDiagnostic`/`OnParseError` producer (N2 row 10): a failed
     * parse surfaced through `OnParseError` lands here as a `PARSE_ERROR` row,
     * and the kf-side fallbacks (`EMPTY_PARSE`, and the engine's
     * `COMPOSITION_FALLBACK`) join it. A FLAT additive array with stable
     * {@link DiagnosticCode}s, NOT a logging framework. Empty on a clean parse.
     * K.W8 populates the ingest rows (`CORS_SKIP`, `WAAPI_INELIGIBLE`) it owns.
     */
    diagnostics: Diagnostic[];

    /**
     * The parsed CSS `Stylesheet` AST the resolve walked (L.W2 S1). Surfaced so a
     * caller can recover scroll-grammar (`animation-timeline`/`animation-range`)
     * from the SAME parse via `extractTimelineOptions(resolved.stylesheet)` —
     * `CSSKeyframesAnimation.fromString` threads it onto `scrollOptions` so the
     * compiler's EMIT half (CC-6) can serialize the scroll longhands back out. A
     * read-only metadata field; the keyframe/option resolution is unchanged.
     */
    stylesheet: Stylesheet;
}

const declsToVarMap = (
    rule: KeyframeRule,
    ctx: ResolveContext,
): Record<string, unknown> => {
    const out: Record<string, unknown> = {};
    for (const decl of rule.declarations) {
        // `decl.value` is a ValueArray; the existing
        // `parseAndFlattenObject` pipeline handles either ValueArray
        // or string values, so we pass the ValueArray through.
        let value: unknown = decl.value;
        // P.W13 — the element-INDEPENDENT emerging-CSS lowering pass, at the
        // resolveKeyframes → flatten seam. Only paid on a declaration that
        // CARRIES a lowerable node (`if(...)`/`spring(...)`); the common
        // all-concrete keyframe is untouched (zero-cost structural sniff). The
        // pass returns the SAME node type (a `ValueArray`), so the downstream
        // flatten/compile/interpolation runs EXACTLY as today.
        if (value instanceof ValueArray && hasResolvableValue(value)) {
            const resolved = resolveValues(value, ctx);
            if (resolved === DROP) {
                // Guaranteed-invalid (an `if()` with no matching branch + no
                // else) → OMIT the declaration entirely: the prior/initial value
                // wins per the CSS guaranteed-invalid rule. NOT an empty-string
                // value (which would corrupt interpolation).
                continue;
            }
            value = resolved;
        }
        out[decl.name] = value;
    }
    return out;
};

const formatSelectorPercent = (rule: KeyframeRule): string[] => {
    const out: string[] = [];
    for (const sel of rule.selectors) {
        if (sel.kind === "percent") {
            out.push(`${sel.value}%`);
        } else {
            // Scroll-driven named selectors aren't yet wired into
            // the animation engine; surface them as their literal
            // name for the consumer to handle.
            out.push(sel.name);
        }
    }
    return out;
};

/**
 * Pick the first @keyframes block from the stylesheet — the AST
 * supports multiple, but the legacy `fromString` interface assumed
 * one. Multi-keyframes inputs aggregate by name; the consumer should
 * call `parseCSSStylesheet` directly if it needs the full set.
 */
const pickKeyframes = (ast: Stylesheet): KeyframeRule[] => {
    const all = extractKeyframes(ast);
    for (const rules of all.values()) {
        if (rules.length > 0) return rules;
    }
    return [];
};

/**
 * Normalise a CSS string (or pre-parsed Stylesheet) into the shape
 * `CSSKeyframesAnimation.fromString` consumes. The single entry
 * point: replaces the legacy `parseCSSKeyframes` /
 * `parseCSSStyleBlock` / `parseCSSAnimationKeyframes` fork.
 *
 * Bare keyframe-stop lists (`from { … } to { … }`) historically work even
 * though they are not valid top-level CSS. F.W8 decides that on the parsed
 * AST, not a regex sniff: parse the raw input; if it surfaced ZERO @keyframes
 * rules and the input is non-empty, re-wrap as `@keyframes anonymous { … }`
 * and re-parse. A leading `/* @keyframes … *​/` comment no longer defeats the
 * detection (the PX-1 comment-defeat bug — the regex `/@keyframes\b/` matched
 * inside a comment and skipped the wrap, yielding a silent empty parse).
 *
 * K.W8 SIBLING — `resolveLiveKeyframes` (`./ingest`) is the LIVE-CSSOM analogue
 * of this STRING normaliser: where `resolveKeyframes` normalises a string of
 * CSS, `resolveLiveKeyframes` walks `document.styleSheets`, serialises each
 * `CSSKeyframesRule` via `rule.cssText`, and feeds THAT text into THIS function
 * — the parser pointed FORWARD at the web the page already ships. It lives in a
 * separate module (`./ingest`) to avoid an `engine → adapter → ingest → engine`
 * import cycle; reach it via `loadAnimationEngine()` (the `index.ts` HEAVY edge).
 */
export const resolveKeyframes = (
    input: string | Stylesheet,
    env?: ResolveEnv,
): ResolvedKeyframes => {
    const diagnostics: Diagnostic[] = [];
    // The CONSUMED value.js producer (N2 row 10): a sink of the published
    // `OnParseError` shape. The kf-side honesty rows AND any value.js parse
    // diagnostic flow through this ONE sink — every row that lands on the
    // channel passes through the producer's `(ParseDiagnostic) => void` contract
    // (NOT a re-authored kf-local logger). A value.js parse that emits a
    // `ParseDiagnostic` (K.W8 wires its CSSOM walk through this) lands as a
    // `PARSE_ERROR` row; the engine-internal EMPTY_PARSE row rides the same sink.
    // Ready for K.W8: a value.js parse derailment, surfaced through the
    // producer's `OnParseError` contract, lands as a `PARSE_ERROR` row verbatim
    // (the consumed `ParseDiagnostic` shape carried whole). The CSSOM walk K.W8
    // owns threads THIS sink into its per-sheet parse so one bad sheet becomes a
    // row, not a thrown abort. Authored here; populated when that producer lands.
    const onParseError: OnParseError = (d: ParseDiagnostic) => {
        diagnostics.push({ ...d, code: "PARSE_ERROR" });
    };
    void onParseError;
    // The engine-internal honesty rows ride the SAME flat channel — a stable
    // `code` + a `message`, the consumed `ParseDiagnostic` field shape widened.
    const sink = (code: DiagnosticCode, extra: Partial<Diagnostic>): void => {
        diagnostics.push({ code, message: extra.message ?? code, ...extra });
    };

    let ast = typeof input === "string" ? parseCSSStylesheet(input) : input;
    let rules = pickKeyframes(ast);

    if (typeof input === "string" && rules.length === 0 && input.trim()) {
        ast = parseCSSStylesheet(`@keyframes anonymous {\n${input.trim()}\n}`);
        rules = pickKeyframes(ast);
    }

    // EMPTY_PARSE (K.W7 S4, lifting the J.W1 engine-internal row onto the
    // structured field). A NON-EMPTY input that surfaced ZERO @keyframes rules
    // even after the bare-list re-wrap is a SILENT empty parse — the adapter
    // historically returned an empty `keyframes` Map with no signal, so a
    // consumer got a frame-less animation with no reason. Mirror it as a citable
    // row (never a throw — resolve stays lenient, the J.W1 forgiving-language
    // posture; the diagnostic is the honesty surface, not a fail-loud).
    if (typeof input === "string" && rules.length === 0 && input.trim()) {
        sink("EMPTY_PARSE", {
            message:
                "the input is non-empty but parsed to zero @keyframes rules " +
                "(no animatable stops) — the resulting animation has no frames",
            input,
        });
    }

    const keyframes = new Map<string, Record<string, unknown>>();
    const timingFunctions = new Map<string, string>();
    const composition = new Map<string, string>();

    // P.W13 — the `@function` descriptor registry + the element-INDEPENDENT
    // resolution context, built from the FINAL ast (after the bare-list re-wrap,
    // so `extractFunctions` reads the same tree the keyframes came from). `env`
    // is injectable for testing (jsdom carries neither `CSS.supports` nor a
    // faithful `matchMedia`); it defaults to SSR-safe no-ops via
    // `makeResolveContext`. ONE context per resolve — the `seen` cycle-guard is
    // only consumed by the value.js-P-gated `@function` inlining arm (today a
    // no-op seam that never mutates it), so sharing it across declarations is
    // benign; the per-call depth ceiling is the active guard.
    const functions = extractFunctions(ast);
    const resolveCtx = makeResolveContext(functions, env);

    for (const rule of rules) {
        const vars = declsToVarMap(rule, resolveCtx);
        for (const percentText of formatSelectorPercent(rule)) {
            // Multiple selectors share one body (e.g. `0%, 50% { ... }`).
            // Merge with any existing entry at that percent so later
            // declarations override earlier ones (CSS cascade).
            const existing = keyframes.get(percentText);
            keyframes.set(percentText, { ...(existing ?? {}), ...vars });
            if (rule.timingFunction != null) {
                timingFunctions.set(percentText, rule.timingFunction);
            }
            // value.js lifts per-keyframe `animation-composition` onto
            // `rule.composition`; capture it instead of dropping it (F.W8).
            const ruleComposition = (rule as { composition?: string })
                .composition;
            if (ruleComposition != null) {
                composition.set(percentText, ruleComposition);
            }
        }
    }

    return {
        keyframes,
        timingFunctions,
        composition,
        properties: extractProperties(ast),
        functions,
        options: extractAnimationOptions(ast),
        diagnostics,
        stylesheet: ast,
    };
};
