import { parseCssValues } from "@mkbabb/value.js/css";
import type { CssCall, CssList, CssScalar, CssValue } from "@mkbabb/value.js/value";
import type { Vars } from "../../constants";
import {
    createInterpSlot,
    interpolateSlot,
    serializeInterpSlot,
    type InterpSlot,
} from "../frame/interp-slot";
import type {
    CompiledValue,
    CompileValueOptions,
    ParsedVarMap,
    ValueTemplate,
} from "./ast";

const isCssValue = (value: unknown): value is CssValue => {
    if (value === null || typeof value !== "object") return false;
    const kind = (value as { kind?: unknown }).kind;
    return kind === "scalar" || kind === "call" || kind === "list";
};

const scalarNumber = (value: number): CssScalar => ({
    kind: "scalar",
    payload: { type: "number", value, unit: "" },
});

const parseAuthoredValue = (value: unknown, key: string): CssValue => {
    if (isCssValue(value)) return value;
    if (typeof value === "number") return scalarNumber(value);
    if (typeof value === "string") {
        const parsed = parseCssValues(value);
        if (parsed.ok) return parsed.value;
        const issue = parsed.diagnostics[0];
        throw new TypeError(
            `Invalid CSS value for "${key}" at ${issue.start}-${issue.end}: expected ${issue.expected.join(" or ")}.`,
        );
    }
    if (Array.isArray(value)) {
        return {
            kind: "list",
            separator: "space",
            items: value.map((entry) => parseAuthoredValue(entry, key)),
        };
    }
    throw new TypeError(`Unsupported authored value for "${key}".`);
};

export function parseAndFlattenObject(
    input: Record<string, unknown>,
): ParsedVarMap {
    const out: ParsedVarMap = {};
    const visit = (value: unknown, path: string): void => {
        if (
            value !== null &&
            typeof value === "object" &&
            !Array.isArray(value) &&
            !isCssValue(value)
        ) {
            for (const [key, child] of Object.entries(value)) {
                visit(child, path === "" ? key : `${path}.${key}`);
            }
            return;
        }
        if (path === "") throw new TypeError("An animation value requires a property name.");
        out[path] = parseAuthoredValue(value, path);
    };
    visit(input, "");
    return out;
}

const FUNCTION_IDENTITY: Readonly<Record<string, Readonly<{ value: number; unit: string }>>> = {
    brightness: { value: 1, unit: "" },
    contrast: { value: 1, unit: "" },
    saturate: { value: 1, unit: "" },
    opacity: { value: 1, unit: "" },
    grayscale: { value: 0, unit: "" },
    sepia: { value: 0, unit: "" },
    invert: { value: 0, unit: "" },
    blur: { value: 0, unit: "px" },
    "hue-rotate": { value: 0, unit: "deg" },
    scale: { value: 1, unit: "" },
    scaleX: { value: 1, unit: "" },
    scaleY: { value: 1, unit: "" },
    scaleZ: { value: 1, unit: "" },
    scale3d: { value: 1, unit: "" },
    translate: { value: 0, unit: "px" },
    translateX: { value: 0, unit: "px" },
    translateY: { value: 0, unit: "px" },
    translateZ: { value: 0, unit: "px" },
    translate3d: { value: 0, unit: "px" },
    rotate: { value: 0, unit: "deg" },
    rotateX: { value: 0, unit: "deg" },
    rotateY: { value: 0, unit: "deg" },
    rotateZ: { value: 0, unit: "deg" },
    skew: { value: 0, unit: "deg" },
    skewX: { value: 0, unit: "deg" },
    skewY: { value: 0, unit: "deg" },
};

const identityCall = (call: CssCall): CssCall => {
    const identity = FUNCTION_IDENTITY[call.name];
    if (identity === undefined) {
        throw new TypeError(`No interpolation identity is defined for CSS function "${call.name}".`);
    }
    return {
        kind: "call",
        name: call.name,
        args: call.args.map(() => ({
            kind: "scalar",
            payload: {
                type: "number",
                value: identity.value,
                unit: identity.unit,
            },
        })),
    };
};

const uniqueCalls = (items: readonly CssValue[]): items is readonly CssCall[] => {
    if (!items.every((item) => item.kind === "call")) return false;
    return new Set(items.map((item) => item.name)).size === items.length;
};

const alignCallLists = (
    left: readonly CssCall[],
    right: readonly CssCall[],
): readonly [readonly CssCall[], readonly CssCall[]] => {
    const names = [...left.map((call) => call.name)];
    for (const call of right) if (!names.includes(call.name)) names.push(call.name);
    const leftByName = new Map(left.map((call) => [call.name, call]));
    const rightByName = new Map(right.map((call) => [call.name, call]));
    return [
        names.map((name) => leftByName.get(name) ?? identityCall(rightByName.get(name)!)),
        names.map((name) => rightByName.get(name) ?? identityCall(leftByName.get(name)!)),
    ];
};

const computedValue = (value: CssValue): boolean =>
    value.kind === "call" && (value.name === "var" || value.name === "calc");

const singletonItem = (value: CssValue): CssValue | undefined =>
    value.kind === "list" && value.items.length === 1
        ? value.items[0]
        : undefined;

const repeatLike = (value: CssValue, shape: CssValue): CssValue =>
    shape.kind === "list"
        ? {
              kind: "list",
              separator: shape.separator,
              items: shape.items.map((item) => repeatLike(value, item)),
          }
        : value;

export function compileValuePair(
    left: CssValue,
    right: CssValue,
    options: CompileValueOptions,
): CompiledValue {
    const slots: InterpSlot[] = [];

    const align = (leftValue: CssValue, rightValue: CssValue): ValueTemplate => {
        let a = leftValue;
        let b = rightValue;
        const aSingleton = singletonItem(a);
        const bSingleton = singletonItem(b);
        const namedCallLists =
            a.kind === "list" &&
            b.kind === "list" &&
            uniqueCalls(a.items) &&
            uniqueCalls(b.items);
        if (aSingleton !== undefined && b.kind !== "list") {
            a = aSingleton;
        } else if (bSingleton !== undefined && a.kind !== "list") {
            b = bSingleton;
        } else if (a.kind === "scalar" && b.kind === "list") {
            a = repeatLike(a, b);
        } else if (b.kind === "scalar" && a.kind === "list") {
            b = repeatLike(b, a);
        } else if (!namedCallLists && a.kind === "list" && aSingleton !== undefined && b.kind === "list" &&
            (a.separator !== b.separator || a.items.length !== b.items.length)) {
            a = repeatLike(aSingleton, b);
        } else if (!namedCallLists && b.kind === "list" && bSingleton !== undefined && a.kind === "list" &&
            (b.separator !== a.separator || b.items.length !== a.items.length)) {
            b = repeatLike(bSingleton, a);
        }
        if (computedValue(a) || computedValue(b) ||
            (a.kind === "call" && b.kind === "call" && a.name !== b.name) ||
            (a.kind !== b.kind && (a.kind === "call" || b.kind === "call"))) {
            const index = slots.length;
            slots.push(createInterpSlot(a, b, options));
            return { kind: "slot", index };
        }
        if (a.kind === "scalar" && b.kind === "scalar") {
            const index = slots.length;
            slots.push(createInterpSlot(a, b, options));
            return { kind: "slot", index };
        }
        if (a.kind === "call" && b.kind === "call") {
            if (a.name !== b.name) {
                throw new TypeError(
                    `Cannot interpolate CSS functions "${a.name}" and "${b.name}" for "${options.property}".`,
                );
            }
            if (a.args.length !== b.args.length) {
                throw new TypeError(
                    `Cannot interpolate different arities of CSS function "${a.name}" for "${options.property}".`,
                );
            }
            return {
                kind: "call",
                name: a.name,
                args: a.args.map((arg, index) => align(arg, b.args[index]!)),
            };
        }
        if (a.kind === "list" && b.kind === "list") {
            if (a.separator !== b.separator) {
                throw new TypeError(
                    `Cannot interpolate CSS lists with different separators for "${options.property}".`,
                );
            }
            let leftItems = a.items;
            let rightItems = b.items;
            if (uniqueCalls(leftItems) && uniqueCalls(rightItems)) {
                [leftItems, rightItems] = alignCallLists(leftItems, rightItems);
            } else if (leftItems.length !== rightItems.length) {
                throw new TypeError(
                    `Cannot interpolate CSS lists with different lengths for "${options.property}".`,
                );
            }
            return {
                kind: "list",
                separator: a.separator,
                items: leftItems.map((item, index) => align(item, rightItems[index]!)),
            };
        }

        throw new TypeError(
            `Cannot interpolate unlike CSS AST nodes "${a.kind}" and "${b.kind}" for "${options.property}".`,
        );
    };

    return { template: align(left, right), slots };
}

export function interpolateCompiledValue(
    value: CompiledValue,
    progress: number,
    target?: HTMLElement,
): void {
    for (const slot of value.slots) interpolateSlot(slot, progress, target);
}

const separatorText = (separator: CssList["separator"]): string =>
    separator === "comma" ? ", " : separator === "slash" ? " / " : " ";

export function serializeCompiledValue(value: CompiledValue): string {
    const render = (node: ValueTemplate): string => {
        if (node.kind === "slot") return serializeInterpSlot(value.slots[node.index]!);
        if (node.kind === "list") {
            return node.items.map(render).join(separatorText(node.separator));
        }
        const separator = node.name === "calc" ? " " : ", ";
        return `${node.name}(${node.args.map(render).join(separator)})`;
    };
    return render(value.template);
}

export function transformTargetsStyle<V extends Vars>(
    vars: V,
    targets: HTMLElement[],
): void {
    for (const target of targets) {
        for (const [property, value] of Object.entries(vars)) {
            if (value === undefined) {
                target.style.removeProperty(property);
                continue;
            }
            if (value !== null && typeof value === "object") continue;
            target.style.setProperty(property, String(value));
        }
    }
}
