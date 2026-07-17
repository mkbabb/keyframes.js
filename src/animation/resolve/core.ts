import type { CssCall, CssList, CssScalar, CssValue } from "@mkbabb/value.js/value";
import { DROP, type ResolveContext, type Resolved } from "./env";
import { resolveFunctionCall, type ResolveNode } from "./function";
import { isStyleConditionIf, resolveIf } from "./conditional";

const MAX_RESOLVE_DEPTH = 32;

const numberScalar = (value: number): CssScalar =>
    Object.freeze({
        kind: "scalar",
        payload: Object.freeze({ type: "number", value, unit: "" }),
    });

const callWith = (node: CssCall, args: readonly CssValue[]): CssCall =>
    Object.freeze({ kind: "call", name: node.name, args: Object.freeze(args) });

const listWith = (node: CssList, items: readonly CssValue[]): CssList =>
    Object.freeze({
        kind: "list",
        separator: node.separator,
        items: Object.freeze(items),
    });

const rewriteChildren = (
    values: readonly CssValue[],
    ctx: ResolveContext,
): Resolved<readonly CssValue[]> => {
    const out: CssValue[] = [];
    let changed = false;
    for (const value of values) {
        const resolved = resolveNode(value, { ...ctx, depth: ctx.depth + 1 });
        if (resolved === DROP) {
            changed = true;
            continue;
        }
        if (resolved !== value) changed = true;
        out.push(resolved);
    }
    return changed ? Object.freeze(out) : values;
};

const resolveNode: ResolveNode = (
    node: CssValue,
    ctx: ResolveContext,
): Resolved<CssValue> => {
    if (ctx.depth > MAX_RESOLVE_DEPTH) return DROP;
    if (node.kind === "scalar") return node;

    if (node.kind === "list") {
        const items = rewriteChildren(node.items, ctx);
        if (items === DROP) return DROP;
        return items === node.items ? node : listWith(node, items);
    }

    if (node.name === "if") {
        return resolveIf(node, { ...ctx, depth: ctx.depth + 1 }, resolveNode);
    }
    if (node.name === "sibling-index") {
        const siblingIndex = ctx.env.siblingIndex;
        return siblingIndex === undefined ? node : numberScalar(siblingIndex());
    }
    if (node.name === "sibling-count") {
        const siblingCount = ctx.env.siblingCount;
        return siblingCount === undefined ? node : numberScalar(siblingCount());
    }
    if (node.name.startsWith("--") && ctx.functions.has(node.name)) {
        return resolveFunctionCall(node, ctx, resolveNode);
    }

    const args = rewriteChildren(node.args, ctx);
    if (args === DROP) return DROP;
    return args === node.args ? node : callWith(node, args);
};

export const resolveValues = (
    value: CssValue,
    ctx: ResolveContext,
): Resolved<CssValue> => resolveNode(value, ctx);

export const hasResolvableValue = (value: unknown): boolean => {
    if (value === null || typeof value !== "object" || !("kind" in value)) {
        return false;
    }
    const node = value as CssValue;
    if (node.kind === "scalar") return false;
    if (node.kind === "list") return node.items.some(hasResolvableValue);
    if (
        node.name === "if" ||
        node.name === "spring" ||
        node.name === "sibling-index" ||
        node.name === "sibling-count" ||
        node.name.startsWith("--")
    ) {
        return true;
    }
    return node.args.some(hasResolvableValue);
};

export const hasPhase2Node = (value: unknown): boolean => {
    if (value === null || typeof value !== "object" || !("kind" in value)) {
        return false;
    }
    const node = value as CssValue;
    if (node.kind === "scalar") return false;
    if (node.kind === "list") return node.items.some(hasPhase2Node);
    if (node.name === "sibling-index" || node.name === "sibling-count") {
        return true;
    }
    if (isStyleConditionIf(node)) return true;
    return node.args.some(hasPhase2Node);
};
