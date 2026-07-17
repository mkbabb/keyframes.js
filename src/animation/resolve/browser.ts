import { isLayoutTrackingUnit } from "@mkbabb/value.js/value";
import type { CssValue } from "@mkbabb/value.js/value";
import { parseCssScalar } from "@mkbabb/value.js/css";
import { serializeCssValue } from "../compile/emit/css-text";

let layoutEpoch = 0;
let browserScalarCache = new WeakMap<
    CssValue,
    WeakMap<
        HTMLElement,
        Map<string, Readonly<{ epoch: number; result: ResolvedBrowserScalar }>>
    >
>();

export const getLayoutEpoch = (): number => layoutEpoch;

export const bumpLayoutEpoch = (): number => {
    browserScalarCache = new WeakMap();
    return ++layoutEpoch;
};

if (typeof window !== "undefined") {
    window.addEventListener("resize", bumpLayoutEpoch, { passive: true });
}

const absoluteToPixels = (value: number, unit: string): number => {
    switch (unit) {
        case "cm": return value * (96 / 2.54);
        case "mm": return value * (96 / 25.4);
        case "Q": return value * (96 / (25.4 * 4));
        case "in": return value * 96;
        case "pt": return value * (4 / 3);
        case "pc": return value * 16;
        default: return value;
    }
};

const viewportBasis = (
    unit: string,
    element?: HTMLElement,
): number | undefined => {
    if (typeof window === "undefined") return undefined;
    const match = /^(sv|lv|dv|v)?(w|h|i|b|min|max)$/.exec(unit);
    if (!match) return undefined;

    const variant = match[1] ?? "v";
    const axis = match[2]!;
    const viewport = variant === "sv" ? window.visualViewport : undefined;
    const width = viewport?.width ?? window.innerWidth;
    const height = viewport?.height ?? window.innerHeight;
    const writingMode = element
        ? getComputedStyle(element).writingMode
        : "horizontal-tb";
    const vertical = writingMode.startsWith("vertical") || writingMode.startsWith("sideways");

    switch (axis) {
        case "w": return width;
        case "h": return height;
        case "i": return vertical ? height : width;
        case "b": return vertical ? width : height;
        case "min": return Math.min(width, height);
        case "max": return Math.max(width, height);
    }
};

const queryContainer = (element: HTMLElement): HTMLElement | undefined => {
    let candidate = element.parentElement;
    while (candidate) {
        const type = getComputedStyle(candidate).containerType;
        if (type === "inline-size" || type === "size") return candidate;
        candidate = candidate.parentElement;
    }
    return undefined;
};

/** Resolve a CSS length against the live browser box owned by Keyframes. */
export function convertToPixels(
    value: number,
    unit: string,
    element?: HTMLElement,
    property?: string,
): number {
    const fontRelative = unit === "em" || unit === "rem" || unit === "ex" ||
        unit === "ch" || unit === "cap" || unit === "ic" || unit === "lh" ||
        unit === "rlh";
    if (!isLayoutTrackingUnit(unit) && !fontRelative) {
        return absoluteToPixels(value, unit);
    }

    if (unit === "%" && element?.parentElement && property) {
        const basis = Number.parseFloat(
            getComputedStyle(element.parentElement).getPropertyValue(property),
        );
        return (value / 100) * basis;
    }

    const viewport = viewportBasis(unit, element);
    if (viewport !== undefined) return value * viewport / 100;

    if (unit.startsWith("cq") && element) {
        const container = queryContainer(element);
        if (!container) return value;
        const width = container.clientWidth;
        const height = container.clientHeight;
        const mode = getComputedStyle(container).writingMode;
        const vertical = mode.startsWith("vertical") || mode.startsWith("sideways");
        const inline = vertical ? height : width;
        const block = vertical ? width : height;
        const basis = unit === "cqw" ? width
            : unit === "cqh" ? height
            : unit === "cqi" ? inline
            : unit === "cqb" ? block
            : unit === "cqmin" ? Math.min(width, height)
            : Math.max(width, height);
        return value * basis / 100;
    }

    const styleElement = unit === "rem" || unit === "rlh"
        ? typeof document === "undefined" ? undefined : document.documentElement
        : element;
    if (!styleElement) return value;
    const style = getComputedStyle(styleElement);
    const fontSize = Number.parseFloat(style.fontSize) || 16;
    switch (unit) {
        case "em": case "rem": return value * fontSize;
        case "ex": case "ch": return value * fontSize * 0.5;
        case "cap": return value * fontSize * 0.7;
        case "ic": return value * fontSize;
        case "lh": case "rlh": {
            const lineHeight = Number.parseFloat(style.lineHeight);
            return value * (Number.isFinite(lineHeight) ? lineHeight : fontSize * 1.2);
        }
        default: return absoluteToPixels(value, unit);
    }
}

export class BrowserScalarResolutionError extends TypeError {
    readonly code = "BROWSER_SCALAR_RESOLUTION";

    constructor(
        readonly property: string,
        readonly authoredValue: CssValue,
        readonly actual: string,
    ) {
        super(
            `Could not resolve "${serializeCssValue(authoredValue)}" for "${property}" to a numeric CSS scalar${actual === "" ? "" : ` (computed: "${actual}")`}.`,
        );
        this.name = "BrowserScalarResolutionError";
    }
}

type ResolvedBrowserScalar = Readonly<{
    value: number;
    unit: string;
}>;

const numericScalar = (
    source: string,
    value: CssValue,
    property: string,
): ResolvedBrowserScalar => {
    const parsed = parseCssScalar(source);
    if (!parsed.ok || parsed.value.payload.type !== "number") {
        throw new BrowserScalarResolutionError(property, value, source);
    }
    return Object.freeze({
        value: parsed.value.payload.value,
        unit: parsed.value.payload.unit,
    });
};

const customPropertyName = (value: CssValue): string | undefined => {
    if (value.kind !== "call" || value.name !== "var") return undefined;
    const first = value.args[0];
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

const probeBrowserScalar = (
    value: CssValue,
    target: HTMLElement,
    property: string,
): ResolvedBrowserScalar => {
    if (value.kind === "scalar" && value.payload.type === "number") {
        const { value: amount, unit } = value.payload;
        if (isLayoutTrackingUnit(unit) || [
            "em", "rem", "ex", "ch", "cap", "ic", "lh", "rlh",
        ].includes(unit)) {
            return Object.freeze({
                value: convertToPixels(amount, unit, target, property),
                unit: "px",
            });
        }
        return Object.freeze({ value: amount, unit });
    }

    const customProperty = customPropertyName(value);
    if (customProperty !== undefined) {
        const computed = getComputedStyle(target)
            .getPropertyValue(customProperty)
            .trim();
        const inline = target.style.getPropertyValue(customProperty).trim();
        return numericScalar(computed || inline, value, property);
    }

    const cssProperty = property.split(".", 1)[0] ?? property;
    const original = target.style.getPropertyValue(cssProperty);
    const priority = target.style.getPropertyPriority(cssProperty);
    const authored = serializeCssValue(value);
    let computed = "";
    try {
        target.style.setProperty(cssProperty, authored);
        computed = getComputedStyle(target).getPropertyValue(cssProperty).trim();
    } finally {
        if (original === "") target.style.removeProperty(cssProperty);
        else target.style.setProperty(cssProperty, original, priority);
    }
    return numericScalar(computed, value, property);
};

/** Resolve one immutable CSS endpoint against a live target and layout epoch. */
export function resolveBrowserScalar(
    value: CssValue,
    target: HTMLElement,
    property: string,
): ResolvedBrowserScalar {
    if (!target.isConnected) return probeBrowserScalar(value, target, property);

    let byTarget = browserScalarCache.get(value);
    if (byTarget === undefined) {
        byTarget = new WeakMap();
        browserScalarCache.set(value, byTarget);
    }
    let byProperty = byTarget.get(target);
    if (byProperty === undefined) {
        byProperty = new Map();
        byTarget.set(target, byProperty);
    }
    const cached = byProperty.get(property);
    if (cached?.epoch === layoutEpoch) return cached.result;

    const resolved = probeBrowserScalar(value, target, property);
    const entry = Object.freeze({ result: resolved, epoch: layoutEpoch });
    byProperty.set(property, entry);
    return resolved;
}
