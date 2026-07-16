import { describe, expect, it } from "vitest";
import {
    collectCustomFunctions,
    parseCssValue,
    parseStylesheet,
    type CustomFunctionDescriptor,
} from "@mkbabb/value.js/css";
import type { CssValue } from "@mkbabb/value.js/value";
import { serializeCssValue } from "../../src/animation/compile/emit/css-text";
import {
    DROP,
    makeResolveContext,
    resolveValues,
} from "../../src/animation/resolve";

const value = (source: string): CssValue => {
    const parsed = parseCssValue(source);
    if (!parsed.ok) {
        throw new TypeError(`Invalid fixture: ${parsed.diagnostics[0].code}`);
    }
    return parsed.value;
};

const functions = (source: string): Map<string, CustomFunctionDescriptor> => {
    const parsed = parseStylesheet(source);
    if (!parsed.ok) {
        throw new TypeError(`Invalid stylesheet fixture: ${parsed.diagnostics[0].code}`);
    }
    return new Map(
        collectCustomFunctions(parsed.value).map(({ rule }) => [
            rule.name,
            rule.descriptor,
        ]),
    );
};

describe("Value 4 immutable resolver", () => {
    it("retains identity for an unchanged tree", () => {
        const input = value("calc(1px + 2px)");
        const resolved = resolveValues(input, makeResolveContext(new Map()));

        expect(resolved).toBe(input);
        expect(Object.isFrozen(resolved)).toBe(true);
    });

    it("selects a conditional branch from the producer AST", () => {
        const input = value(
            "if(supports(color: lch(0 0 0)): red; else: blue)",
        );
        const resolved = resolveValues(
            input,
            makeResolveContext(new Map(), { supports: () => true }),
        );

        expect(resolved).not.toBe(DROP);
        expect(serializeCssValue(resolved as CssValue)).toBe("rgb(255 0 0)");
    });

    it("replaces sibling-index with a frozen numeric scalar", () => {
        const resolved = resolveValues(
            value("calc(sibling-index() * 10px)"),
            makeResolveContext(new Map(), { siblingIndex: () => 2 }),
        );

        expect(resolved).not.toBe(DROP);
        expect(serializeCssValue(resolved as CssValue)).toContain("2");
        expect(Object.isFrozen(resolved)).toBe(true);
    });

    it("inlines a typed custom function without cloning or reparsing defaults", () => {
        const registry = functions(
            "@function --double(--x <length>: 0px) { result: calc(var(--x) * 2); }",
        );
        const resolved = resolveValues(
            value("--double(5px)"),
            makeResolveContext(registry),
        );

        expect(resolved).not.toBe(DROP);
        const text = serializeCssValue(resolved as CssValue);
        expect(text).not.toContain("--double");
        expect(text).not.toContain("var(");
        expect(text).toContain("5px");
        expect(Object.isFrozen(resolved)).toBe(true);
    });
});
