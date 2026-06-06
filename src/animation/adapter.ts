import {
    extractAnimationOptions,
    extractKeyframes,
    extractProperties,
    parseCSSStylesheet,
    type KeyframeRule,
    type PropertyDescriptor,
    type Stylesheet,
} from "@mkbabb/value.js";

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
     * Animation options recovered from a top-level style rule's
     * `animation` shorthand or longhand declarations (if any). Empty
     * when the input has no matching style rule.
     */
    options: ReturnType<typeof extractAnimationOptions>;
}

const declsToVarMap = (rule: KeyframeRule): Record<string, unknown> => {
    const out: Record<string, unknown> = {};
    for (const decl of rule.declarations) {
        // `decl.value` is a ValueArray; the existing
        // `parseAndFlattenObject` pipeline handles either ValueArray
        // or string values, so we pass the ValueArray through.
        out[decl.name] = decl.value;
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
 */
export const resolveKeyframes = (
    input: string | Stylesheet,
): ResolvedKeyframes => {
    let ast = typeof input === "string" ? parseCSSStylesheet(input) : input;
    let rules = pickKeyframes(ast);

    if (typeof input === "string" && rules.length === 0 && input.trim()) {
        ast = parseCSSStylesheet(`@keyframes anonymous {\n${input.trim()}\n}`);
        rules = pickKeyframes(ast);
    }

    const keyframes = new Map<string, Record<string, unknown>>();
    const timingFunctions = new Map<string, string>();
    const composition = new Map<string, string>();

    for (const rule of rules) {
        const vars = declsToVarMap(rule);
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
        options: extractAnimationOptions(ast),
    };
};
