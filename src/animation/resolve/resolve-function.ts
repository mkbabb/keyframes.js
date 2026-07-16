import {
    coerceToSyntax,
    type CustomFunctionParameter,
} from "@mkbabb/value.js/css";
import type { CssCall, CssList, CssValue } from "@mkbabb/value.js/value";
import { serializeCssValue } from "../compile/emit/css-text";
import { DROP, type ResolveContext, type Resolved } from "./env";

export type ResolveNode = (
    node: CssValue,
    ctx: ResolveContext,
) => Resolved<CssValue>;

const coerceArg = (
    arg: CssValue,
    param: CustomFunctionParameter,
): Resolved<CssValue> => {
    if (param.syntax === undefined) return arg;
    const coerced = coerceToSyntax(serializeCssValue(arg), param.syntax);
    if (coerced.ok) return coerced.value;
    return param.default ?? DROP;
};

const varName = (node: CssValue): string | undefined => {
    if (node.kind !== "call" || node.name !== "var") return undefined;
    const first = node.args[0];
    if (first?.kind === "scalar" && first.payload.type === "keyword") {
        return first.payload.value;
    }
    if (first?.kind === "list") {
        const head = first.items[0];
        if (head?.kind === "scalar" && head.payload.type === "keyword") {
            return head.payload.value;
        }
    }
    return undefined;
};

const frozenCall = (node: CssCall, args: readonly CssValue[]): CssCall =>
    Object.freeze({ kind: "call", name: node.name, args: Object.freeze(args) });

const frozenList = (node: CssList, items: readonly CssValue[]): CssList =>
    Object.freeze({
        kind: "list",
        separator: node.separator,
        items: Object.freeze(items),
    });

const substituteParams = (
    node: CssValue,
    binding: ReadonlyMap<string, CssValue>,
): CssValue => {
    const ident = varName(node);
    if (ident !== undefined) return binding.get(ident) ?? node;
    if (node.kind === "scalar") return node;

    const children = node.kind === "call" ? node.args : node.items;
    const rewritten = children.map((child) => substituteParams(child, binding));
    if (rewritten.every((child, index) => child === children[index])) return node;
    return node.kind === "call"
        ? frozenCall(node, rewritten)
        : frozenList(node, rewritten);
};

export const resolveFunctionCall = (
    node: CssCall,
    ctx: ResolveContext,
    resolveNode: ResolveNode,
): Resolved<CssValue> => {
    if (ctx.seen.has(node.name)) return DROP;

    const descriptor = ctx.functions.get(node.name);
    if (descriptor?.result === undefined) return DROP;

    const parameters = descriptor.parameters ?? [];
    if (node.args.length > parameters.length) return DROP;

    const binding = new Map<string, CssValue>();
    for (let index = 0; index < parameters.length; index++) {
        const parameter = parameters[index]!;
        const argument = node.args[index];
        const bound = argument === undefined
            ? parameter.default ?? DROP
            : coerceArg(argument, parameter);
        if (bound === DROP) {
            ctx.diagnostics?.push({
                code: "CUSTOM_FN_ARG_DROP",
                property: parameter.name,
                message: `--fn() argument for ${parameter.name} did not satisfy ${parameter.syntax ?? "its required value"} and has no default.`,
            });
            return DROP;
        }
        binding.set(parameter.name, bound);
    }

    const substituted = substituteParams(descriptor.result, binding);
    ctx.seen.add(node.name);
    try {
        return resolveNode(substituted, { ...ctx, depth: ctx.depth + 1 });
    } finally {
        ctx.seen.delete(node.name);
    }
};
