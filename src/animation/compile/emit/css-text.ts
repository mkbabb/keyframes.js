import type {
    CSSAnimationOptions,
    CssColor,
    Declaration,
    KeyframeSelector,
    StylesheetItem,
} from "@mkbabb/value.js/css";
import { serializeCssColor } from "@mkbabb/value.js/css";
import type { CssValue } from "@mkbabb/value.js/value";

export const reverseCSSTime = (milliseconds: number): string =>
    milliseconds >= 5000 ? `${milliseconds / 1000}s` : `${milliseconds}ms`;

const reverseIterationCount = (count: number): string =>
    count === Infinity ? "infinite" : String(count);

export const reverseAnimationShorthand = (
    options: CSSAnimationOptions,
): string => [
    options.duration == null ? undefined : reverseCSSTime(options.duration),
    options.timingFunction == null ? undefined : serializeTimingFunction(options.timingFunction),
    options.delay == null ? undefined : reverseCSSTime(options.delay),
    options.iterationCount == null ? undefined : reverseIterationCount(options.iterationCount),
    options.direction,
    options.fillMode,
    options.composition,
    options.name,
].filter((part): part is string => part !== undefined).join(" ");

export const serializeTimingFunction = (value: NonNullable<CSSAnimationOptions["timingFunction"]>): string => {
    switch (value.kind) {
        case "keyword": return value.name;
        case "cubic-bezier": return `cubic-bezier(${value.x1}, ${value.y1}, ${value.x2}, ${value.y2})`;
        case "steps": return `steps(${value.count}, ${value.position})`;
        case "linear-function": return `linear(${value.stops.map((stop) =>
            `${stop.output}${stop.input.map((input) => ` ${input * 100}%`).join("")}`,
        ).join(", ")})`;
    }
};

export const serializeCssValue = (value: CssValue): string => {
    if (value.kind === "call") {
        return `${value.name}(${value.args.map(serializeCssValue).join(", ")})`;
    }
    if (value.kind === "list") {
        const separator = value.separator === "comma" ? ", "
            : value.separator === "slash" ? " / " : " ";
        return value.items.map(serializeCssValue).join(separator);
    }
    const payload = value.payload;
    if (payload.type === "number") return `${payload.value}${payload.unit}`;
    if (payload.type === "keyword") return payload.value;
    const serialized = serializeCssColor(payload.value as CssColor);
    if (!serialized.ok) throw new TypeError("Value returned an unserializable CSS color.");
    return serialized.value;
};

const serializeSelector = (selector: KeyframeSelector): string => {
    if (selector.kind === "percent") return `${selector.value * 100}%`;
    return selector.offset === undefined
        ? selector.name
        : `${selector.name} ${selector.offset * 100}%`;
};

const serializeDeclaration = (declaration: Declaration): string =>
    `${declaration.name}: ${serializeCssValue(declaration.value)}${declaration.important ? " !important" : ""}`;

const indent = (value: string): string =>
    value.split("\n").map((line) => `  ${line}`).join("\n");

export const serializeStylesheetItem = (item: StylesheetItem): string => {
    switch (item.kind) {
        case "keyframes":
            return `@keyframes ${item.name} {\n${item.rules.map((rule) =>
                indent(`${rule.selectors.map(serializeSelector).join(", ")} {\n${rule.declarations.map((declaration) =>
                    indent(`${serializeDeclaration(declaration)};`),
                ).join("\n")}\n}`),
            ).join("\n")}\n}`;
        case "property": {
            const lines: string[] = [];
            if (item.descriptor.syntax !== undefined) lines.push(`syntax: ${item.descriptor.syntax};`);
            if (item.descriptor.inherits !== undefined) lines.push(`inherits: ${item.descriptor.inherits};`);
            if (item.descriptor.initialValue !== undefined) lines.push(`initial-value: ${serializeCssValue(item.descriptor.initialValue)};`);
            return `@property ${item.name} {\n${lines.map(indent).join("\n")}\n}`;
        }
        case "function": {
            const params = item.descriptor.parameters?.map((parameter) => {
                const syntax = parameter.syntax === undefined ? "" : ` ${parameter.syntax}`;
                const fallback = parameter.default === undefined ? "" : `: ${serializeCssValue(parameter.default)}`;
                return `${parameter.name}${syntax}${fallback}`;
            }).join(", ") ?? "";
            const declarations = item.descriptor.declarations?.map((declaration) =>
                `${serializeDeclaration(declaration)};`,
            ) ?? [];
            return `@function ${item.name}(${params}) {\n${declarations.map(indent).join("\n")}\n}`;
        }
        case "style": {
            const declarations = item.declarations.map((declaration) =>
                `${serializeDeclaration(declaration)};`,
            );
            const children = item.children?.map((child) => serializeStylesheetItem(child)) ?? [];
            return `${item.selectors.join(", ")} {\n${[...declarations, ...children].map(indent).join("\n")}\n}`;
        }
        case "scope": {
            const root = item.root?.join(", ") ?? "";
            const limit = item.limit === undefined ? "" : ` to (${item.limit.join(", ")})`;
            return `@scope (${root})${limit} {\n${item.children.map((child) => indent(serializeStylesheetItem(child))).join("\n")}\n}`;
        }
        case "starting-style":
            return `@starting-style {\n${item.children.map((child) => indent(serializeStylesheetItem(child))).join("\n")}\n}`;
        case "scroll-timeline": {
            const lines = Object.entries(item.descriptor).map(([key, value]) => `${key}: ${value};`);
            return `@scroll-timeline ${item.name} {\n${lines.map(indent).join("\n")}\n}`;
        }
        case "view-timeline": {
            const lines = Object.entries(item.descriptor).map(([key, value]) => `${key}: ${value};`);
            return `@view-timeline ${item.name} {\n${lines.map(indent).join("\n")}\n}`;
        }
        case "unknown": {
            const prelude = item.prelude === "" ? "" : ` ${item.prelude}`;
            if (item.children !== undefined) {
                return `@${item.atName}${prelude} {\n${item.children.map((child) => indent(serializeStylesheetItem(child))).join("\n")}\n}`;
            }
            return item.body === null
                ? `@${item.atName}${prelude};`
                : `@${item.atName}${prelude} {${item.body}}`;
        }
    }
};
