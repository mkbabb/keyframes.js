import {
    extractAnimationOptions,
    extractStyleRules,
    parseCSSStylesheet,
    type CSSAnimationOptions,
} from "@mkbabb/value.js";
import { loadAnimationEngine } from "@mkbabb/keyframes.js";

/**
 * Pure CSS → AST parse adapter.
 *
 * Produces the legacy `{ keyframes, options, values }` shape from value.js's
 * Stylesheet AST. `keyframes` is the Map from `resolveKeyframes`; `options` are
 * CSS animation-* longhands / shorthand from any top-level style rule; `values`
 * are the non-animation declarations from that style rule.
 *
 * Inputs that lack a `@keyframes` block are wrapped in an anonymous one (the
 * superset guard from the editor call site), so both a full stylesheet and a
 * bare declaration list are tolerated.
 *
 * No Vue reactivity, no side effects. ASYNC because `resolveKeyframes` is HEAVY
 * (reached through `loadAnimationEngine()` after the L.W8 S1 dogfood inversion);
 * value.js's AST parse/extract stay synchronous, only the kf resolve awaits.
 */
export const parseAnimationCSS = async (input: string) => {
    const { resolveKeyframes } = await loadAnimationEngine();
    const ast = parseCSSStylesheet(
        /@keyframes\b/i.test(input)
            ? input
            : `@keyframes anonymous {\n${input}\n}`,
    );
    const resolved = resolveKeyframes(ast);
    const options: CSSAnimationOptions = extractAnimationOptions(ast);
    const values: Record<string, unknown> = {};
    for (const rule of extractStyleRules(ast)) {
        for (const decl of rule.declarations) {
            if (!decl.name.startsWith("animation"))
                values[decl.name] = decl.value;
        }
    }
    return { keyframes: resolved.keyframes, options, values };
};
