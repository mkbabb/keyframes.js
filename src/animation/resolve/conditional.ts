import type { CssCall, CssList, CssScalar, CssValue } from "@mkbabb/value.js/value";
import { serializeCssValue } from "../compile/emit/css-text";
import { DROP, type ResolveContext, type Resolved } from "./env";
import type { ResolveNode } from "./function";

type IfClause = Readonly<{
    condition: CssValue;
    consequent: CssValue;
    fallback: boolean;
}>;

const isKeyword = (value: CssValue, keyword: string): value is CssScalar =>
    value.kind === "scalar" &&
    value.payload.type === "keyword" &&
    value.payload.value.toLowerCase() === keyword;

const packed = (items: readonly CssValue[]): CssValue | undefined => {
    if (items.length === 0) return undefined;
    if (items.length === 1) return items[0];
    return Object.freeze({
        kind: "list",
        separator: "space",
        items: Object.freeze([...items]),
    });
};

const legacyClauses = (list: CssList): readonly IfClause[] => {
    const rows: CssValue[][] = [[]];
    for (const item of list.items) {
        if (isKeyword(item, ";")) rows.push([]);
        else rows.at(-1)!.push(item);
    }

    const clauses: IfClause[] = [];
    for (const row of rows) {
        const colon = row.findIndex((item) => isKeyword(item, ":"));
        if (colon < 0) continue;
        const condition = packed(row.slice(0, colon));
        const consequent = packed(row.slice(colon + 1));
        if (condition === undefined || consequent === undefined) continue;
        clauses.push(Object.freeze({
            condition,
            consequent,
            fallback: isKeyword(condition, "else"),
        }));
    }
    return Object.freeze(clauses);
};

const clausesOf = (fn: CssCall): readonly IfClause[] => {
    if (fn.args.length === 1 && fn.args[0]?.kind === "list") {
        return legacyClauses(fn.args[0]);
    }
    const condition = fn.args[0];
    const consequent = fn.args[1];
    if (condition === undefined || consequent === undefined) return [];
    const clauses: IfClause[] = [
        Object.freeze({ condition, consequent, fallback: false }),
    ];
    const fallback = fn.args[2];
    if (fallback !== undefined) {
        clauses.push(Object.freeze({
            condition: Object.freeze({
                kind: "scalar",
                payload: Object.freeze({ type: "keyword", value: "else" }),
            }),
            consequent: fallback,
            fallback: true,
        }));
    }
    return Object.freeze(clauses);
};

const serializedArgs = (call: CssCall): string =>
    call.args.map(serializeCssValue).join(", ");

const evalStyleCondition = (
    call: CssCall,
    customProps: (name: string) => string | undefined,
): boolean => {
    const argument = call.args[0];
    if (argument === undefined) return false;
    if (argument.kind === "scalar" && argument.payload.type === "keyword") {
        return customProps(argument.payload.value) !== undefined;
    }
    if (argument.kind !== "list") return false;

    const colon = argument.items.findIndex((item) => isKeyword(item, ":"));
    const property = argument.items[0];
    if (
        property?.kind !== "scalar" ||
        property.payload.type !== "keyword"
    ) {
        return false;
    }
    const actual = customProps(property.payload.value);
    if (actual === undefined) return false;
    if (colon < 0) return true;

    const expected = packed(argument.items.slice(colon + 1));
    if (expected === undefined) return false;
    const normalize = (value: string) => value.trim().replace(/\s+/g, " ");
    return normalize(actual) === normalize(serializeCssValue(expected));
};

const evalCondition = (
    condition: CssValue,
    ctx: ResolveContext,
): boolean | undefined => {
    if (isKeyword(condition, "else")) return true;
    if (condition.kind !== "call") return false;

    if (condition.name === "supports") {
        return ctx.env.supports?.(serializedArgs(condition)) ?? false;
    }
    if (condition.name === "media") {
        return ctx.env.matchMedia?.(serializedArgs(condition))?.matches ?? false;
    }
    if (condition.name === "style") {
        const customProps = ctx.env.customProps;
        return customProps === undefined
            ? undefined
            : evalStyleCondition(condition, customProps);
    }
    return false;
};

export const resolveIf = (
    fn: CssCall,
    ctx: ResolveContext,
    resolveNode: ResolveNode,
): Resolved<CssValue> => {
    const clauses = clausesOf(fn);
    if (clauses.length === 0) return DROP;

    for (const clause of clauses) {
        const decision = clause.fallback ? true : evalCondition(clause.condition, ctx);
        if (decision === undefined) return fn;
        if (decision) return resolveNode(clause.consequent, ctx);
    }
    return DROP;
};

export const isStyleConditionIf = (node: CssCall): boolean =>
    node.name === "if" &&
    clausesOf(node).some(
        (clause) =>
            clause.condition.kind === "call" &&
            clause.condition.name === "style",
    );
