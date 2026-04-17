import { CSSCubicBezier, timingFunctions } from "@src/easing";
import { any as parseAny } from "@mkbabb/parse-that";
import {
    lerpColorValue,
    lerpComputedValue,
    lerpNumericValue,
    lerpValue,
    normalizeValueUnits,
    prepareInterpVar,
} from "@mkbabb/value.js";
import { CSSKeyframes } from "../parsing/keyframes";
import { tryParse } from "../parsing/utils";
import { FunctionValue, ValueArray, ValueUnit } from "../units";
import { flattenObject, unflattenObjectToString } from "../units/utils";
import type {
    HueInterpolationMethod,
    TemplateAnimationFrame,
    TimingFunction,
    TimingFunctionNames,
    Vars,
} from "./constants";

// Re-export value.js interpolation primitives so consumers of
// keyframes.js continue to find them at this path. New code should
// import from @mkbabb/value.js directly.
export {
    lerpColorValue,
    lerpComputedValue,
    lerpNumericValue,
    lerpValue,
};

export type ParsedVarMap = Record<string, ValueArray>;

const flattenToValueUnits = (value: unknown): ValueUnit[] => {
    if (value instanceof ValueUnit) {
        return [value.clone()];
    }

    if (value instanceof FunctionValue) {
        return value.values.flatMap((entry) => flattenToValueUnits(entry));
    }

    if (value instanceof ValueArray) {
        return value.flatMap((entry) => flattenToValueUnits(entry));
    }

    throw new TypeError(
        `Expected ValueUnit/FunctionValue/ValueArray, got ${typeof value}`,
    );
};

const splitPathKey = (key: string): { mainKey: string; childKey: string } => {
    const childKey = key.split(".").pop();
    const mainKey = key.split(".").shift();

    if (!childKey || !mainKey) {
        throw new Error(`Invalid flattened key: ${key}`);
    }

    return { mainKey, childKey };
};

const applyPropertyContext = (
    values: ValueArray,
    mainKey: string,
    childKey: string,
) => {
    values.setProperty(mainKey);
    if (childKey !== mainKey) {
        values.setSubProperty(childKey);
    }
    return values;
};

/**
 * Match a CSS `cubic-bezier(x1, y1, x2, y2)` literal. Accepts
 * arbitrary whitespace and signed decimals. Standards-compliant
 * CSS timing-function syntax, as specified by CSS Easing Level 1.
 */
const CUBIC_BEZIER_LITERAL =
    /^\s*cubic-bezier\s*\(\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\)\s*$/i;

/**
 * Resolve a timing-function input to a callable `TimingFunction`.
 *
 * Accepts:
 *   - a `TimingFunction` — returned as-is
 *   - a named entry in `timingFunctions` (`ease-out-cubic`,
 *     `easeOutCubic`, `linear`, etc.) — looked up in the registry
 *   - a CSS `cubic-bezier(x1, y1, x2, y2)` literal string —
 *     parsed to control points and resolved via `CSSCubicBezier`
 *   - `undefined` or a name/literal the registry can't find —
 *     returns `undefined` so callers can fall back to their
 *     default (usually `easeInOutCubic`)
 *
 * Higher-arity factory entries (`steps`, `step-start`, `step-end`)
 * live in the registry but require construction arguments; they
 * return `undefined` here so callers can invoke them explicitly.
 */
export const getTimingFunction = (
    timingFunction: TimingFunction | TimingFunctionNames | string | undefined,
): TimingFunction | undefined => {
    if (timingFunction == null) {
        return undefined;
    }
    if (typeof timingFunction !== "string") {
        return timingFunction;
    }

    // CSS `cubic-bezier(x1, y1, x2, y2)` literal.
    const bezierMatch = timingFunction.match(CUBIC_BEZIER_LITERAL);
    if (bezierMatch) {
        const parts = bezierMatch.slice(1, 5).map((s) =>
            Number.parseFloat(s ?? ""),
        );
        if (parts.length === 4 && parts.every((n) => Number.isFinite(n))) {
            const [x1, y1, x2, y2] = parts as [number, number, number, number];
            return CSSCubicBezier(x1, y1, x2, y2);
        }
    }

    const resolved = timingFunctions[timingFunction as TimingFunctionNames];
    if (typeof resolved === "function" && resolved.length <= 1) {
        return resolved as TimingFunction;
    }
    return undefined;
};

// lerpComputedValue / lerpColorValue / lerpNumericValue / lerpValue
// now live in @mkbabb/value.js. Re-exported above for keyframes.js
// API compatibility.

const tryParseCache = new Map<string, ValueArray>();

export function parseAndFlattenObject(
    input: Record<string, unknown>,
): ParsedVarMap {
    const flat = flattenObject(input) as Record<string, unknown>;

    const parse = (key: string, value: unknown): ValueArray => {
        const { childKey, mainKey } = splitPathKey(key);

        if (value instanceof ValueUnit) {
            return applyPropertyContext(
                new ValueArray(...flattenToValueUnits(value)),
                mainKey,
                childKey,
            );
        } else if (value instanceof FunctionValue) {
            const flattened = value.values.flatMap((entry) =>
                flattenToValueUnits(parse(key, entry)),
            );
            return applyPropertyContext(
                new ValueArray(...flattened),
                mainKey,
                childKey,
            );
        } else if (value instanceof ValueArray) {
            const flattened = value.flatMap((entry) =>
                flattenToValueUnits(parse(key, entry)),
            );
            return applyPropertyContext(
                new ValueArray(...flattened),
                mainKey,
                childKey,
            );
        }

        const strValue = String(value);
        const cacheKey = `${childKey}:${strValue}`;
        const cached = tryParseCache.get(cacheKey);
        if (cached) {
            return applyPropertyContext(cached.clone(), mainKey, childKey);
        }

        // value.js and keyframes.js each ship their own copy of
        // @mkbabb/parse-that under different node_modules realms,
        // so the Parser<T> classes are nominally distinct from
        // TypeScript's perspective. The runtime is the same. Cast
        // to `any` to bypass the cross-realm type comparison.
        const fnArgs = (CSSKeyframes.FunctionArgs as any).map(
            (v: ValueArray) => {
                v.setSubProperty(childKey);
                return v;
            },
        );
        const p = tryParse(
            (parseAny as any)(fnArgs, CSSKeyframes.Value),
            strValue,
        ) as ValueUnit | ValueArray | FunctionValue;

        const parsed = applyPropertyContext(
            new ValueArray(...flattenToValueUnits(p)),
            mainKey,
            childKey,
        );
        tryParseCache.set(cacheKey, parsed.clone());

        return parsed;
    };

    const parsedVars = Object.entries(flat).reduce<ParsedVarMap>(
        (acc, [key, value]) => {
            acc[key] = parse(key, value);
            return acc;
        },
        {},
    );

    return parsedVars;
}

export const createInterpVarValue = (
    v: string,
    startIx: number,
    endIx: number,
    vars: ParsedVarMap[],
    colorSpace: string = "oklab",
    hueMethod?: HueInterpolationMethod,
) => {
    const startVars = vars[startIx];
    const endVars = vars[endIx];
    if (!startVars || !endVars) {
        throw new Error(
            `Invalid interpolation frame bounds (${startIx} -> ${endIx}).`,
        );
    }

    const left = startVars[v];
    const right = endVars[v];
    if (!left || !right) {
        throw new Error(`Missing variable "${v}" in interpolation bounds.`);
    }

    const maxLength = Math.max(left.length, right.length);
    const padToLength = (arr: ValueArray): ValueUnit[] => {
        const out = arr.map((entry) => {
            if (!(entry instanceof ValueUnit)) {
                throw new TypeError(
                    `Interpolation for "${v}" requires ValueUnit leaves.`,
                );
            }
            return entry;
        });

        while (out.length < maxLength) {
            out.push(new ValueUnit(0));
        }
        return out;
    };

    const newLeft = padToLength(left);
    const newRight = padToLength(right);

    return newLeft.map((l, i) => {
        const r = newRight[i];
        if (!r) {
            throw new Error(
                `Missing right-hand interpolation value at index ${i}.`,
            );
        }
        if (!(l instanceof ValueUnit) || !(r instanceof ValueUnit)) {
            throw new TypeError(
                `Interpolation for "${v}" requires ValueUnit leaves.`,
            );
        }
        const opts: { colorSpace?: string; hueMethod?: HueInterpolationMethod } = { colorSpace };
        if (hueMethod !== undefined) opts.hueMethod = hueMethod;
        return prepareInterpVar(normalizeValueUnits(l, r, opts));
    });
};

export function calcFrameTime<V extends Vars>(
    startFrame: TemplateAnimationFrame<V>,
    endFrame: TemplateAnimationFrame<V>,
    duration: number,
) {
    const [start, stop] = [startFrame.start, endFrame.start];

    return {
        start: (start.value * duration) / 100,
        stop: (stop.value * duration) / 100,
    };
}

/**
 * Default DOM-style renderer used by `Animation.transform` when no
 * user-supplied transform is provided. Marked with the
 * `keyframes.defaultRenderer` Symbol so the WAAPI eligibility check
 * can detect "user supplied a custom transform" without resorting to
 * fragile function-identity comparisons.
 */
export function transformTargetsStyle<V extends Vars>(
    vars: V,
    targets: HTMLElement[],
    flat: boolean = true,
) {
    vars = flat ? vars : (flattenObject(vars) as V);

    const styleStringVars = unflattenObjectToString(vars);

    targets.forEach((target) => {
        Object.entries(styleStringVars).forEach(([key, value]) => {
            target.style.setProperty(key, value);
        });
    });
}
(transformTargetsStyle as any)[Symbol.for("keyframes.defaultRenderer")] = true;
