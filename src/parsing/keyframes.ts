// Legacy parser surface. The grammar itself now lives in
// `@mkbabb/value.js` (`parseCSSStylesheet`); this file is a thin
// adapter that produces the historical `Map<percent, vars>` /
// `{keyframes, options, values}` shapes consumers depend on.

import {
    CSSFunction,
    CSSValues,
    extractAnimationOptions,
    extractKeyframes,
    extractProperties,
    extractStyleRules,
    parseCSSStylesheet,
    parseCSSValue,
    type Declaration,
    type KeyframeRule,
    type PropertyDescriptor,
} from "@mkbabb/value.js";
import { hyphenToCamelCase, memoize } from "../utils";
import { ValueArray, type FunctionValue, type ValueUnit } from "../units";

// Re-export the value/percent/time helpers from value.js so existing
// imports continue to resolve.
export {
    parseCSSPercent,
    parseCSSTime,
    reverseCSSIterationCount,
    reverseCSSTime,
} from "@mkbabb/value.js";

// Re-export the property descriptor type.
export type { PropertyDescriptor };

/** Result shape of {@link parseCSSStyleBlock}. */
export interface ParsedStyleBlock {
    properties: Map<string, PropertyDescriptor>;
    keyframes: Map<string, Record<string, unknown>>;
}

/**
 * Parser-object surface. Historically this exposed a constellation
 * of parser combinators; today the only externally-needed entries
 * are `Value` and `FunctionArgs`, both of which live in value.js as
 * `CSSValues.Value` / `CSSFunction.FunctionArgs`. The rest is kept
 * for compatibility but resolves to the same value.js parsers.
 */
export const CSSKeyframes = {
    Value: CSSValues.Value,
    Values: CSSValues.Values,
    FunctionArgs: CSSFunction.FunctionArgs,
    Function: CSSFunction.Function,
};

const declsToVarMap = (rule: KeyframeRule): Record<string, unknown> => {
    const out: Record<string, unknown> = {};
    for (const decl of rule.declarations) {
        // Match the historical convention: kebab-case CSS property
        // names map to camelCase JS keys, except for `--custom`
        // properties which stay verbatim.
        const key = decl.name.startsWith("--")
            ? decl.name
            : hyphenToCamelCase(decl.name);
        out[key] = decl.value;
    }
    // Per-keyframe `animation-timing-function` was lifted out of
    // `decls` into the `KeyframeRule.timingFunction` field. Surface
    // it back under the historical key so callers that read it from
    // the vars map keep working.
    if (rule.timingFunction != null) {
        out.animationTimingFunction = rule.timingFunction;
    }
    return out;
};

const expandSelectors = (
    rules: KeyframeRule[],
): Map<string, Record<string, unknown>> => {
    const out = new Map<string, Record<string, unknown>>();
    for (const rule of rules) {
        const vars = declsToVarMap(rule);
        for (const sel of rule.selectors) {
            const key =
                sel.kind === "percent" ? `${sel.value}%` : sel.name;
            const existing = out.get(key);
            out.set(key, { ...(existing ?? {}), ...vars });
        }
    }
    return out;
};

/**
 * Bare keyframe-stop lists (`from { opacity: 0 } to { opacity: 1 }`)
 * are not valid CSS at the top level — the spec requires an
 * `@keyframes` wrapper. keyframes.js historically accepted both
 * forms, so wrap unwrapped inputs before handing them to the
 * Stylesheet parser.
 */
const wrapBareKeyframes = (input: string): string => {
    const trimmed = input.trim();
    if (/@keyframes\b/i.test(trimmed)) return input;
    if (trimmed.length === 0) return input;
    return `@keyframes anonymous {\n${trimmed}\n}`;
};

const firstKeyframesBlock = (input: string): KeyframeRule[] => {
    const ast = parseCSSStylesheet(wrapBareKeyframes(input));
    for (const rules of extractKeyframes(ast).values()) {
        if (rules.length > 0) return rules;
    }
    return [];
};

/**
 * Parse a `@keyframes` block (or a bare keyframe-stop list) and
 * return a `Map<percent → vars>`. Equivalent to the historical API:
 * percent strings as keys, camelCased property names in the values.
 */
export const parseCSSKeyframes = memoize(
    (input: string): Map<string, Record<string, unknown>> =>
        expandSelectors(firstKeyframesBlock(input)),
);

const declsToOptionsMap = (
    declarations: Declaration[],
): Record<string, string> => {
    const opts: Record<string, string> = {};
    for (const decl of declarations) {
        if (!decl.name.startsWith("animation")) continue;
        const key = hyphenToCamelCase(decl.name)
            .replace(/^animation/, "")
            .replace(/^./, (c) => c.toLowerCase());
        opts[key] = decl.value.toString();
    }
    return opts;
};

const declsToValueMap = (
    declarations: Declaration[],
): Record<string, unknown> => {
    const vals: Record<string, unknown> = {};
    for (const decl of declarations) {
        if (decl.name.startsWith("animation")) continue;
        const key = decl.name.startsWith("--")
            ? decl.name
            : hyphenToCamelCase(decl.name);
        vals[key] = decl.value;
    }
    return vals;
};

/**
 * Parse a CSS string containing `.classname { animation-*: ...; }`
 * style rules alongside `@keyframes` blocks. Returns the keyframes
 * map plus animation options + non-animation values pulled from the
 * first style rule.
 */
export const parseCSSAnimationKeyframes = memoize(
    (
        input: string,
    ): {
        keyframes: Map<string, Record<string, unknown>>;
        options?: Record<string, string>;
        values?: Record<string, unknown>;
    } => {
        const ast = parseCSSStylesheet(wrapBareKeyframes(input));
        const keyframes = expandSelectors(
            (() => {
                for (const rules of extractKeyframes(ast).values()) {
                    if (rules.length > 0) return rules;
                }
                return [];
            })(),
        );

        const styleRules = extractStyleRules(ast);
        if (styleRules.length === 0) {
            return { keyframes };
        }

        const first = styleRules[0]!;
        const out: {
            keyframes: Map<string, Record<string, unknown>>;
            options?: Record<string, string>;
            values?: Record<string, unknown>;
        } = { keyframes };

        const options = declsToOptionsMap(first.declarations);
        const values = declsToValueMap(first.declarations);
        if (Object.keys(options).length > 0) out.options = options;
        if (Object.keys(values).length > 0) out.values = values;
        return out;
    },
);

/**
 * Parse a CSS string containing `@property` declarations alongside
 * `@keyframes` blocks. Returns the property registry plus the
 * keyframes map.
 */
export const parseCSSStyleBlock = memoize(
    (input: string): ParsedStyleBlock => {
        const ast = parseCSSStylesheet(wrapBareKeyframes(input));
        return {
            properties: extractProperties(ast),
            keyframes: expandSelectors(
                (() => {
                    for (const rules of extractKeyframes(ast).values()) {
                        if (rules.length > 0) return rules;
                    }
                    return [];
                })(),
            ),
        };
    },
);

/**
 * Parse a single CSS value (one declaration's right-hand side) into
 * a `ValueUnit` or `FunctionValue`. Memoised re-export of value.js's
 * `parseCSSValue`.
 */
export const parseCSSKeyframesValue = memoize(
    (input: string): ValueUnit | FunctionValue => parseCSSValue(input),
);

/** Subset of {@link parseCSSAnimationKeyframes} for animation-style inputs. */
export const CSSAnimationKeyframes = {
    Value: CSSValues.Value,
    Values: CSSValues.Values,
};
