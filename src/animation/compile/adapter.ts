import {
    collectAnimationOptions,
    collectCustomFunctions,
    collectKeyframes,
    collectPropertyDescriptors,
    collectStyleRules,
    parseStylesheet,
    type CSSAnimationOptions,
    type CSSPropertyDescriptor,
    type CustomFunctionDescriptor,
    type KeyframeRule,
    type ParseIssue,
    type Stylesheet,
} from "@mkbabb/value.js/css";
import type { CssValue } from "@mkbabb/value.js/value";
import {
    DROP,
    hasResolvableValue,
    makeResolveContext,
    resolveValues,
    type ResolveContext,
    type ResolveEnv,
} from "../resolve";
import { serializeTimingFunction } from "./emit/css-text";

/**
 * The stable diagnostic `code`s the kf-side sink emits (K.W7 S4). A FLAT,
 * additive enum — NOT a logging framework — so a programmatic consumer branches
 * on the reason without scraping a message string (the J.W1 typed-throw idiom
 * lifted onto the structured field). The engine-internal rows
 * (`EMPTY_PARSE`/`UNKNOWN_TIMING_FN`) were J.W1-landed as typed throws; W7 lifts
 * them onto this field. `COMPOSITION_FALLBACK` is the K.W7 honesty row (the
 * non-numeric composite leaf's refusal). The CORS-skip /
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
    | "ADOPT_REFUSE"
    // R.W3 §2A — `CSS.registerProperty` UA rejection (not the benign
    // duplicate-name `InvalidModificationError`). A typed `@property` the UA
    // refuses means the WAAPI path animates that custom discretely (silent
    // regression vs the rAF path's JS interpolation). Surfaced so the author
    // can branch on the code without scraping the message.
    | "PROPERTY_REGISTER_REJECTED"
    // R.W3 §2C — a `@function` arg parse failed its declared `<syntax>` and
    // the param's default also failed to parse (value.js 1.2.0 bug — the
    // default was mis-assigned to `type`). The entire `--fn()` call silently
    // DROPs the declaration; this code surfaces that absorption.
    | "CUSTOM_FN_ARG_DROP";

/**
 * A structured parse/honoring diagnostic (K.W7 S4). Extends the Value 4
 * `ParseIssue` shape (the consumed shape — `message`/`offset`/`line`/
 * `column`/`expected`/`input`) with a stable kf-side {@link DiagnosticCode} and
 * an optional `property` (the leaf a `COMPOSITION_FALLBACK` names). The
 * value.js half (`message`/`offset`/…) is `Partial` because the engine-internal
 * rows (EMPTY_PARSE, COMPOSITION_FALLBACK) are NOT byte-offset parse failures —
 * they carry a `message` + `code` only. Positional fields are retained for
 * ingest callers that attach source locations.
 * widens it with the stable code (inv-16 published-only consumption holds).
 */
export interface Diagnostic extends Omit<Partial<ParseIssue>, "code"> {
    /** A stable, branch-on-able code — never scrape `message`. */
    code: DiagnosticCode;
    /** The human-readable summary (always present; the producer's or kf's). */
    message: string;
    /** The CSS property a `COMPOSITION_FALLBACK` refuses to composite. */
    property?: string;
    /** Original source for a parser issue, when available. */
    input?: string;
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
    properties: Map<string, CSSPropertyDescriptor>;
    /**
     * `@function --foo(...) { ... }` descriptor registry (P.W13 — the emerging-CSS
     * resolve seam). Collected via Value's `collectCustomFunctions` exactly as
     * `properties` is collected via `collectPropertyDescriptors`. Threaded into the
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
    options: CSSAnimationOptions;

    /**
     * Structured parse/honoring diagnostics (K.W7 S4) — every SILENT fallback
     * the resolve path used to swallow, now a citable row. CONSUMES the value.js
     * Value 4 `ParseIssue` producer: a failed parse lands here as a
     * `PARSE_ERROR` row,
     * and the kf-side fallbacks (`EMPTY_PARSE`, and the engine's
     * `COMPOSITION_FALLBACK`) join it. A FLAT additive array with stable
     * {@link DiagnosticCode}s, NOT a logging framework. Empty on a clean parse.
     * K.W8 populates the ingest rows (`CORS_SKIP`, `WAAPI_INELIGIBLE`) it owns.
     */
    diagnostics: Diagnostic[];

    /**
     * The parsed CSS `Stylesheet` AST the resolve walked (L.W2 S1). Surfaced so a
     * caller can recover scroll-grammar (`animation-timeline`/`animation-range`)
     * from the SAME parse via `collectTimelineOptions(resolved.stylesheet)` —
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
        // Value 4 declarations carry immutable CssValue nodes. The compiler
        // consumes that final object directly.
        let value: CssValue = decl.value;
        // P.W13 — the element-INDEPENDENT emerging-CSS lowering pass, at the
        // resolveKeyframes → flatten seam. Only paid on a declaration that
        // CARRIES a lowerable node (`if(...)`/`spring(...)`); the common
        // all-concrete keyframe is untouched (zero-cost structural sniff). The
        // pass returns the SAME node type (a `CssValue`), so the downstream
        // flatten/compile/interpolation runs EXACTLY as today.
        if (hasResolvableValue(value)) {
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
            out.push(`${sel.value * 100}%`);
        } else {
            // Scroll-driven named selectors aren't yet wired into
            // the animation engine; surface them as their literal
            // name for the consumer to handle.
            out.push(
                sel.offset === undefined
                    ? sel.name
                    : `${sel.name} ${sel.offset * 100}%`,
            );
        }
    }
    return out;
};

/**
 * Pick the first @keyframes block from the stylesheet — the AST
 * supports multiple, but the legacy `fromString` interface assumed
 * one. Multi-keyframes inputs aggregate by name; the consumer should call
 * Value's `parseStylesheet` directly if it needs the full set.
 */
const pickKeyframes = (ast: Stylesheet): readonly KeyframeRule[] => {
    const topLevel = collectKeyframes(ast).filter(
        (row) => row.path.length === 1,
    );
    const firstName = topLevel[0]?.rule.name;
    if (firstName === undefined) return [];
    return (
        topLevel.filter((row) => row.rule.name === firstName).at(-1)?.rule
            .rules ?? []
    );
};

const parserMessage = (issue: ParseIssue): string =>
    `${issue.code} at ${issue.start}-${issue.end}: expected ${issue.expected.join(" or ")}, got ${issue.actual ?? "end of input"}`;

const parseSource = (
    source: string,
): { ast: Stylesheet; issues: readonly ParseIssue[] } => {
    const result = parseStylesheet(source);
    return result.ok
        ? { ast: result.value, issues: [] }
        : { ast: [], issues: result.diagnostics };
};

const collectDescriptorMap = <
    T extends { readonly name: string; readonly descriptor: unknown },
>(
    rows: readonly { readonly rule: T; readonly path: readonly number[] }[],
): Map<string, T["descriptor"]> => {
    const map = new Map<string, T["descriptor"]>();
    for (const row of rows) {
        if (row.path.length === 1) map.set(row.rule.name, row.rule.descriptor);
    }
    return map;
};

const selectedStyleDeclarations = (ast: Stylesheet) =>
    collectStyleRules(ast)
        .filter((row) => row.path.length === 1)
        .at(-1)?.rule.declarations ?? [];

/**
 * Normalise a CSS string (or pre-parsed Stylesheet) into the shape
 * `CSSKeyframesAnimation.fromString` consumes. The single entry
 * point, replacing the former multi-parser fork.
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
    // Engine-internal honesty rows use one flat channel: a stable `code` +
    // `message`, with optional parser-position fields for ingest callers.
    const sink = (code: DiagnosticCode, extra: Partial<Diagnostic>): void => {
        diagnostics.push({ code, message: extra.message ?? code, ...extra });
    };

    let issues: readonly ParseIssue[] = [];
    let ast: Stylesheet;
    if (typeof input === "string") {
        const parsed = parseSource(input);
        ast = parsed.ast;
        issues = parsed.issues;
    } else {
        ast = input;
    }
    let rules = pickKeyframes(ast);

    if (typeof input === "string" && rules.length === 0 && input.trim()) {
        const wrapped = parseSource(
            `@keyframes anonymous {\n${input.trim()}\n}`,
        );
        if (pickKeyframes(wrapped.ast).length > 0) {
            ast = wrapped.ast;
            issues = wrapped.issues;
            rules = pickKeyframes(ast);
        }
    }

    if (typeof input === "string") {
        for (const issue of issues) {
            sink("PARSE_ERROR", {
                message: parserMessage(issue),
                input,
                start: issue.start,
                end: issue.end,
                expected: issue.expected,
                actual: issue.actual,
            });
        }
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
    // so `collectCustomFunctions` reads the same tree the keyframes came from). `env`
    // is injectable for testing (jsdom carries neither `CSS.supports` nor a
    // faithful `matchMedia`); it defaults to SSR-safe no-ops via
    // `makeResolveContext`. ONE context per resolve — the `seen` cycle-guard is
    // only consumed by the value.js-P-gated `@function` inlining arm (today a
    // no-op seam that never mutates it), so sharing it across declarations is
    // benign; the per-call depth ceiling is the active guard.
    const functions = collectDescriptorMap(collectCustomFunctions(ast));
    // R.W3 §2C: thread the diagnostics array into the resolve context so the
    // @function resolver can push CUSTOM_FN_ARG_DROP rows for silent DROP events.
    const resolveCtx = makeResolveContext(functions, env, diagnostics);

    for (const rule of rules) {
        const vars = declsToVarMap(rule, resolveCtx);
        for (const percentText of formatSelectorPercent(rule)) {
            // Multiple selectors share one body (e.g. `0%, 50% { ... }`).
            // Merge with any existing entry at that percent so later
            // declarations override earlier ones (CSS cascade).
            const existing = keyframes.get(percentText);
            keyframes.set(percentText, { ...(existing ?? {}), ...vars });
            if (rule.timingFunction != null) {
                timingFunctions.set(
                    percentText,
                    serializeTimingFunction(rule.timingFunction),
                );
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
        properties: collectDescriptorMap(collectPropertyDescriptors(ast)),
        functions,
        options:
            collectAnimationOptions(selectedStyleDeclarations(ast)).at(0) ?? {},
        diagnostics,
        stylesheet: ast,
    };
};
