import { timingFunctions } from "@src/easing";
import { clamp, lerp } from "../math";
import { CSSKeyframes } from "../parsing/keyframes";
import { FunctionValue, ValueArray, ValueUnit } from "../units";
import { COMPUTED_UNITS } from "../units/constants";
import { getComputedValue, normalizeValueUnits } from "../units/normalize";
import { flattenObject, isCSSStyleName, unflattenObjectToString } from "../units/utils";
import { seekPreviousValue } from "../utils";
import {
    AnimationFrame,
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
    const newRightValueUnit = getComputedValue(
        stopValueUnit,
        stopValueUnit.targets?.[0],
    );

    startValueUnit.value = lerp(
        t,
        newstartValueUnit.value,
        newRightValueUnit.value,
    ) as any;
}

export function lerpObject<T>(t: number, value: InterpolatedVar<T>) {
    const { start, stop, startValueUnit } = value;

    Object.keys(start).forEach((key) => {
        startValueUnit.value[key] = lerp(t, start[key], stop[key]);
    });
}

export function lerpValue<T>(t: number, value: InterpolatedVar<T>) {
    const { start, stop, startValueUnit, stopValueUnit } = value;

    if (typeof start === "number" && typeof stop === "number") {
        startValueUnit.value = lerp(t, start, stop);
    } else if (
        COMPUTED_UNITS.includes(startValueUnit.unit) ||
        COMPUTED_UNITS.includes(stopValueUnit.unit)
    ) {
        lerpComputedValue(t, value);
    } else if (startValueUnit.unit === "color") {
        lerpObject(t, value);
    }

    return startValueUnit;
}

export function parseAndFlattenObject(input: any) {
    const flat = flattenObject(input);

    const parse = (key: string, childKey: string, value: any) => {
        const p = CSSKeyframes.FunctionArgs.map((v: Array<ValueUnit>) => {
            if (isCSSStyleName(childKey)) {
                return v;
            } else {
                return new FunctionValue(childKey, v);
            }
        })
            .or(CSSKeyframes.Value)
            .tryParse(String(value)) as ValueUnit | ValueArray | FunctionValue;

        const mainKey = key.split(".").shift();

        p.setProperty(mainKey);

        return [key, p];
    };

    const parsedVars = Object.entries(flat)
        .map(([key, value]) => {
            if (
                value instanceof ValueUnit ||
                value instanceof FunctionValue ||
                value instanceof ValueArray
            ) {
                return [key, value];
            }

            const childKey = key.split(".").pop();

            return parse(key, childKey, value);
        })
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
    t: number,
    vars: V,
    targets: HTMLElement[],
) {
    const styleStringVars = unflattenObjectToString(vars);

    targets.forEach((target) => {
        Object.entries(styleStringVars).forEach(([key, value]) => {
            target.style.setProperty(key, value);
        });
    });
}
