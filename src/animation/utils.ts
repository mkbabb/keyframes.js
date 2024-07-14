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

export function lerpComputedValue<T>(t: number, value: InterpolatedVar<T>) {
    const { start, stop, startValueUnit, stopValueUnit } = value;

    startValueUnit.value = start;
    stopValueUnit.value = stop;

    const newstartValueUnit = getComputedValue(
        startValueUnit,
        startValueUnit.targets?.[0],
    );
    const newStopValueUnit = getComputedValue(
        stopValueUnit,
        stopValueUnit.targets?.[0],
    );

    const newUnit =
        newstartValueUnit.unit !== "var"
            ? newstartValueUnit.unit
            : newStopValueUnit.unit;

    const newValue = lerp(t, newstartValueUnit.value, newStopValueUnit.value);

    startValueUnit.value = newValue;
    startValueUnit.unit = newUnit;
}

export function lerpObject<T>(t: number, value: InterpolatedVar<T>) {
    const { start, stop, startValueUnit } = value;

    Object.keys(start).forEach((key) => {
        startValueUnit.value[key] = lerp(t, start[key], stop[key]);
    });
}

export function lerpValue<T>(t: number, value: InterpolatedVar<T>) {
    const { start, stop, startValueUnit, computed } = value;

    if (typeof start === "number" && typeof stop === "number") {
        startValueUnit.value = lerp(t, start, stop);
    } else if (computed) {
        lerpComputedValue(t, value);
    } else if (startValueUnit.unit === "color") {
        lerpObject(t, value);
    }

    return startValueUnit;
}

export function parseAndFlattenObject(input: any) {
    const flat = flattenObject(input);

    const parse = (key: string, value: any) => {
        const childKey = key.split(".").pop();

        if (value instanceof ValueUnit) {
            return value;
        } else if (value instanceof FunctionValue) {
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

        const mainKey = key.split(".").shift();

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
