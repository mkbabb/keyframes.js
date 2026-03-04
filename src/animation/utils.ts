import { timingFunctions } from "@src/easing";
import { any as parseAny } from "@mkbabb/parse-that";
import { lerp } from "../math";
import { CSSKeyframes } from "../parsing/keyframes";
import { tryParse } from "../parsing/utils";
import { FunctionValue, ValueArray, ValueUnit } from "../units";
import { COMPUTED_UNITS } from "../units/constants";
import { getComputedValue, normalizeValueUnits } from "../units/normalize";
import { flattenObject, unflattenObjectToString } from "../units/utils";
import type {
    HueInterpolationMethod,
    InterpolatedVar,
    TemplateAnimationFrame,
    TimingFunction,
    TimingFunctionNames,
    Vars,
} from "./constants";
import type { Color } from "@src/units/color";

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

export const getTimingFunction = (
    timingFunction: TimingFunction | TimingFunctionNames | undefined,
): TimingFunction | undefined => {
    if (typeof timingFunction === "string") {
        const resolved = timingFunctions[timingFunction];
        if (typeof resolved === "function" && resolved.length <= 1) {
            return resolved as TimingFunction;
        }
        return undefined;
    } else if (timingFunction == null) {
        return undefined;
    }

    return timingFunction;
};

export function lerpComputedValue(
    t: number,
    { start, stop, value }: InterpolatedVar<any>,
) {
    const target = start.targets?.[0] ?? stop.targets?.[0];
    if (!target) {
        throw new Error(
            "Cannot interpolate computed values without a target element.",
        );
    }

    const newStartValueUnit = getComputedValue(start, target);
    const newStopValueUnit = getComputedValue(stop, target);

    const newUnit = !COMPUTED_UNITS.includes(newStartValueUnit.unit)
        ? newStartValueUnit.unit
        : newStopValueUnit.unit;

    const newValue = lerp(t, newStartValueUnit.value, newStopValueUnit.value);

    value.value = newValue;
    value.unit = newUnit;

    return value;
}

export function lerpColorValue(
    t: number,
    { start, stop, value }: InterpolatedVar<Color>,
) {
    start.value.keys().forEach((key: string) => {
        value.value[key] = lerp(t, start.value[key], stop.value[key]);
    });
    return value;
}

export function lerpObjectValue(
    t: number,
    { start, stop, value }: InterpolatedVar<Record<string, number>>,
) {
    Object.keys(start.value as Record<string, number>).forEach((key) => {
        (value.value as Record<string, number>)[key] = lerp(
            t,
            (start.value as Record<string, number>)[key]!,
            (stop.value as Record<string, number>)[key]!,
        );
    });
    return value;
}

export function lerpValue(t: number, value: InterpolatedVar<any>) {
    const { start, stop, computed } = value;

    if (typeof start.value === "number" && typeof stop.value === "number") {
        value.value.value = lerp(t, start.value, stop.value);
    } else if (start.unit === "color") {
        lerpColorValue(t, value as InterpolatedVar<Color>);
    } else if (computed) {
        lerpComputedValue(t, value);
    }

    return value;
}

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

        const p = tryParse(
            parseAny(
                CSSKeyframes.FunctionArgs.map((v: ValueArray) => {
                    v.setSubProperty(childKey);
                    return v;
                }),
                CSSKeyframes.Value,
            ),
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
        return normalizeValueUnits(l, r, colorSpace, hueMethod);
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
