import {
    collectAnimationOptions,
    collectStyleRules,
    type CSSAnimationOptions,
} from "@mkbabb/value.js/css";
import { loadAnimationEngine } from "@mkbabb/keyframes.js";
import { serializeTimingFunction } from "@src/animation/compile/emit/css-text";

type EditorAnimationOptions = Omit<CSSAnimationOptions, "timingFunction"> & {
    timingFunction?: string;
};

/**
 * Pure CSS → AST parse adapter.
 *
 * Produces the editor's `{ keyframes, options, values }` projection from the
 * engine adapter's Stylesheet AST. `keyframes` is the normalized selector Map;
 * `options` are
 * CSS animation-* longhands / shorthand from any top-level style rule; `values`
 * are the non-animation declarations from that style rule.
 *
 * No Vue reactivity, no side effects. The engine adapter is the single grammar
 * authority, including its bare-stop-list handling; this module performs no
 * regex pre-detection or second parse.
 */
export const parseAnimationCSS = async (input: string) => {
    const { resolveKeyframes } = await loadAnimationEngine();
    const resolved = resolveKeyframes(input);
    const parseIssue = resolved.diagnostics.find(
        (diagnostic) => diagnostic.code === "PARSE_ERROR",
    );
    if (parseIssue !== undefined) {
        throw new TypeError(`Invalid animation CSS: ${parseIssue.message}`);
    }
    const ast = resolved.stylesheet;
    const rows = collectStyleRules(ast);
    const selectedDeclarations =
        rows.filter((row) => row.path.length === 1).at(-1)?.rule.declarations ??
        [];
    const parsedOptions: CSSAnimationOptions =
        collectAnimationOptions(selectedDeclarations).at(0) ?? {};
    const { timingFunction, ...rest } = parsedOptions;
    const options: EditorAnimationOptions =
        timingFunction === undefined
            ? rest
            : {
                  ...rest,
                  timingFunction: serializeTimingFunction(timingFunction),
              };
    const values: Record<string, unknown> = {};
    for (const { rule } of rows) {
        for (const decl of rule.declarations) {
            if (!decl.name.startsWith("animation"))
                values[decl.name] = decl.value;
        }
    }
    return { keyframes: resolved.keyframes, options, values };
};
