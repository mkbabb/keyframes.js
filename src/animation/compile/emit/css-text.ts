import type {
    CSSAnimationOptions,
    CssTimeUnit,
    Declaration,
    KeyframeSelector,
    StylesheetItem,
} from "@mkbabb/value.js/css";
import type { CssEasingLiteral } from "../../constants";
import { serializeAdmittedValue } from "./serialize-value";

/**
 * ms → a CSS time literal, in the unit the author wrote (UIA-KF-177).
 *
 * value.js 4.1.0's `CSSAnimationOptions` carries the authored `<time>` unit
 * beside the number (`durationUnit` / `delayUnit`), and kf's options keep it
 * from ingest, so an authored `500ms` emits `500ms` and an authored `0.05s`
 * emits `0.05s`. A time with no authored unit (a programmatic number, an
 * external stagger offset) has no spelling to keep, so it takes the shortest
 * exact literal, seconds on a tie (the CSSOM's canonical unit;
 * X.KF.W13X.r4lib). Every spelling parses back to the same milliseconds.
 */
export const reverseCSSTime = (milliseconds: number, unit?: CssTimeUnit): string => {
    const seconds = `${milliseconds / 1000}s`;
    const ms = `${milliseconds}ms`;
    if (unit === "s") return seconds;
    if (unit === "ms") return ms;
    return seconds.length <= ms.length ? seconds : ms;
};

const reverseIterationCount = (count: number): string =>
    count === Infinity ? "infinite" : String(count);

export const reverseAnimationShorthand = (
    options: CSSAnimationOptions,
): string => [
    options.duration == null ? undefined : reverseCSSTime(options.duration, options.durationUnit),
    options.timingFunction == null ? undefined : serializeTimingFunction(options.timingFunction),
    options.delay == null ? undefined : reverseCSSTime(options.delay, options.delayUnit),
    options.iterationCount == null ? undefined : reverseIterationCount(options.iterationCount),
    options.direction,
    options.fillMode,
    options.composition,
    options.name,
].filter((part): part is string => part !== undefined).join(" ");

export const serializeTimingFunction = (value: NonNullable<CSSAnimationOptions["timingFunction"]>): CssEasingLiteral => {
    switch (value.kind) {
        case "keyword": return value.name;
        case "cubic-bezier": return `cubic-bezier(${value.x1}, ${value.y1}, ${value.x2}, ${value.y2})`;
        case "steps": return `steps(${value.count}, ${value.position})`;
        case "linear-function": return `linear(${value.stops.map((stop) =>
            `${stop.output}${stop.input.map((input) => ` ${input * 100}%`).join("")}`,
        ).join(", ")})`;
    }
};

/**
 * THE keyframe-selector serializer (X.KF.W8 MISS-β2 · G3) — one body for
 * `50%` / `entry` / `entry 50%`, owned here beside the declaration serializer
 * it is the peer of (the value half is value.js's, via `./serialize-value`). `emit/format/format.ts` held a second,
 * byte-equivalent copy (`selectorText`) and now imports this one: the same
 * "a serializer with two implementations is the Tier-D defect this seam exists
 * to stop" the {@link serializeDeclaration} docblock states, applied to the
 * selector half.
 *
 * Exported for the sub-zone barrel as well, so a consumer never needs the deep
 * path. The PACKAGE surface (`public.ts` / `load-engine.ts`) is KF.W5's and
 * does not name it, which is why the demo still carries its own reading — see
 * this unit's ESC-d1.
 */
export const serializeSelector = (selector: KeyframeSelector): string => {
    if (selector.kind === "percent") return `${selector.value * 100}%`;
    return selector.offset === undefined
        ? selector.name
        : `${selector.name} ${selector.offset * 100}%`;
};

/**
 * The ONE declaration emitter. Exported so `compile/parse-facade.ts` can
 * publish the emit half of its declaration pair from this module rather than
 * author a second copy — a serializer with two implementations is the Tier-D
 * defect this seam exists to stop, not a convenience.
 */
export const serializeDeclaration = (declaration: Declaration): string =>
    `${declaration.name}: ${serializeAdmittedValue(declaration.value)}${declaration.important ? " !important" : ""}`;

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
            if (item.descriptor.initialValue !== undefined) lines.push(`initial-value: ${serializeAdmittedValue(item.descriptor.initialValue)};`);
            return `@property ${item.name} {\n${lines.map(indent).join("\n")}\n}`;
        }
        case "function": {
            const params = item.descriptor.parameters?.map((parameter) => {
                const syntax = parameter.syntax === undefined ? "" : ` ${parameter.syntax}`;
                const fallback = parameter.default === undefined ? "" : `: ${serializeAdmittedValue(parameter.default)}`;
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
