import { timingFunctions } from "@src/easing";
import { lerp } from "../math";
import { CSSKeyframes } from "../parsing/keyframes";
import { FunctionValue, ValueArray, ValueUnit } from "../units";
import { COMPUTED_UNITS } from "../units/constants";
import { getComputedValue, normalizeValueUnits } from "../units/normalize";
import { flattenObject, isCSSStyleName, unflattenObjectToString } from "../units/utils";
import {
    InterpolatedVar,
    TemplateAnimationFrame,
    TimingFunction,
    TimingFunctionNames,
    Vars,
} from "./constants";
import { Color } from "@src/units/color";

export const getTimingFunction = (
    timingFunction: TimingFunction | TimingFunctionNames | undefined,
): TimingFunction | undefined => {
    if (typeof timingFunction === "string") {
        return timingFunctions[timingFunction] as TimingFunction | undefined;
    } else if (timingFunction == null) {
        return undefined;
    }

    return timingFunction;
};

export function lerpComputedValue<T>(
    t: number,
    { start, stop, value }: InterpolatedVar<T>,
) {
    const newStartValueUnit = getComputedValue(start.clone(), start.targets?.[0]);
    const newStopValueUnit = getComputedValue(stop.clone(), stop.targets?.[0]);

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
    start.value.keys().forEach((key) => {
        value.value[key] = lerp(t, start.value[key], stop.value[key]);
    });
    return value;
}

export function lerpObjectValue<T>(
    t: number,
    { start, stop, value }: InterpolatedVar<T>,
) {
    Object.keys(start.value).forEach((key) => {
        value.value[key] = lerp(t, start.value[key], stop.value[key]);
    });
    return value;
}

export function lerpValue<T>(t: number, value: InterpolatedVar<T>) {
    const { start, stop, computed } = value;

    if (typeof start.value === "number" && typeof stop.value === "number") {
        value.value.value = lerp(t, start.value, stop.value);
    } else if (start.unit === "color") {
        lerpColorValue(t, value);
    } else if (computed) {
        lerpComputedValue(t, value);
    }

    return value;
}

export function parseAndFlattenObject(input: any) {
    const flat = flattenObject(input);

    const parse = (key: string, value: any) => {
        const childKey = key.split(".").pop();
        const mainKey = key.split(".").shift();

        if (value instanceof ValueUnit) {
            value.setProperty(mainKey);
            return value;
        } else if (value instanceof FunctionValue) {
            value.setProperty(mainKey);
            value.setSubProperty(childKey);

            return value.values.flat();
        } else if (value instanceof ValueArray) {
            return value.map((v) => parse(key, v)).flat();
        }

        const p = CSSKeyframes.FunctionArgs.map((v) => {
            v.setSubProperty(childKey);
            return v;
        })
            .or(CSSKeyframes.Value)
            .tryParse(String(value)) as ValueUnit | ValueArray;

        p.setProperty(mainKey);

        return p;
    };

    const parsedVars = Object.entries(flat)
        .map(([key, value]) => [key, parse(key, value)])
        .reduce((acc, [key, value]) => {
            acc[key as string] = value;
            return acc;
        }, {});

    return parsedVars;
}

export const createInterpVarValue = (
    v: string,
    startIx: number,
    endIx: number,
    vars: any[],
) => {
    const left = vars[startIx][v];
    const right = vars[endIx][v];

    const maxLength = Math.max(left.length, right.length);

    const newLeft = left.concat(
        Array(Math.abs(maxLength - left.length)).fill(new ValueUnit(0)),
    );
    const newRight = right.concat(
        Array(Math.abs(maxLength - right.length)).fill(new ValueUnit(0)),
    );

    return newLeft.map((l, i) => normalizeValueUnits(l, newRight[i]));
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
            target.style[key] = value;
        });
    });
}
