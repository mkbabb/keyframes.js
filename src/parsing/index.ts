import { rgb2xyz, xyz2rgb } from "../units/color/utils";
import config from "../../tailwind.config";
import { FunctionValue, ValueArray, ValueUnit } from "../units";
import { normalizeColorUnitsToLAB } from "../units/color/normalize";
import { getComputedValue, normalizeNumericUnits } from "../units/normalize";
import { flattenObject, isCSSStyleName, unflattenObjectToString } from "../units/utils";
import { compileTailwindCss } from "../utils";
import { CSSKeyframes, parseCSSKeyframes } from "./keyframes";
import { lerp } from "@src/math";

// const parsed = {
//     "0%": {
//         backgroundColor: "red",
//         transform: [
//             "red",
//             {
//                 translateX: 0,
//                 scale: {
//                     first: [0, 0],
//                     transform: [
//                         "red",
//                         {
//                             translateX: 0,
//                             scale: {
//                                 first: [0, 0],
//                             },
//                         },
//                     ],
//                 },
//             },
//         ],
//     },
//     "100%": {
//         backgroundColor: "blue",
//         transform: [
//             { translateX: "calc(100% - 20px)" },
//             {
//                 translateY: "calc(50vh + 10%)",
//                 scale: {
//                     first: [1, 2],
//                     transform: [
//                         { translateX: "calc(100% - 20px)" },
//                         {
//                             translateY: "calc(50vh + 10%)",
//                             scale: {
//                                 first: [1, 2],
//                             },
//                         },
//                     ],
//                 },
//             },
//         ],
//     },
// };

const ballAnim = /*css*/ `
    @keyframes ball {
        0% {
            background-color: theme("colors.gray.400");
            border-radius: translate(scale(0), 0) 25% / 25% 25%;
            transform: red translateX(0) translateZ(0) ;
        }
        0% {
           width: 10%;
        }
        25% {
            background-color: hsl(50% 100 50);
            border-radius: translate(scale(2), 2) 50% / 50% 50%;
        }
        100% {
            transform: translate(calc(100% - 20px), calc(50vh + 10%));   
        }
    }`;

const BLACKLISTED_COALESCE_UNITS = ["string", "var", "calc"];

const COMPUTED_UNITS = ["var", "calc"];

function coalesceValueUnits<T>(left: ValueUnit<T>, right?: ValueUnit<T>): ValueUnit<T> {
    if (!right) {
        return left;
    }

    let leftUnit = left.unit;
    let rightUnit = right.unit;

    if (
        BLACKLISTED_COALESCE_UNITS.includes(leftUnit) ||
        BLACKLISTED_COALESCE_UNITS.includes(rightUnit)
    ) {
        return left;
    }

    return new ValueUnit(
        left.value,
        leftUnit ?? rightUnit,
        left.superType ?? right.superType,
        left.subProperty ?? right.subProperty,
        left.property ?? right.property,
        left.targets ?? right.targets,
    );
}

export type InterpolatedVariable<T = any> = {
    start: T;
    stop: T;

    leftValueUnit: ValueUnit<T>;
    rightValueUnit: ValueUnit<T>;
};

export function normalizeValueUnits<T>(left: ValueUnit<T>, right: ValueUnit<T>) {
    left = coalesceValueUnits(left, right);
    right = coalesceValueUnits(right, left);

    const out = {
        start: left.value,
        stop: right.value,

        leftValueUnit: left,
        rightValueUnit: right,
    };

    if (left.unit === "string") {
        out.start = left.value;
        out.stop = left.value;
    }
    if (right.unit === "string") {
        out.start = right.value;
        out.stop = right.value;
    }

    if (left.unit === "color" && right.unit === "color") {
        const [leftCollapsed, rightCollapsed] = normalizeColorUnitsToLAB(left, right);

        out.start = leftCollapsed.value;
        out.stop = rightCollapsed.value;

        out.leftValueUnit = leftCollapsed;
        out.rightValueUnit = rightCollapsed;
    }

    if (left.unit !== right.unit) {
        const [leftCollapsed, rightCollapsed] = normalizeNumericUnits(left, right);

        out.start = leftCollapsed.value;
        out.stop = rightCollapsed.value;

        out.leftValueUnit = leftCollapsed;
        out.rightValueUnit = rightCollapsed;
    }

    return out;
}

export function lerpValue<T = any>(t: number, value: InterpolatedVariable<T>) {
    const { start, stop, leftValueUnit, rightValueUnit } = value;

    // if start and stop are both numbers, lerp like numbers
    if (typeof start === "number" && typeof stop === "number") {
        leftValueUnit.value = lerp(t, start, stop) as any;
    } else if (
        COMPUTED_UNITS.includes(leftValueUnit.unit) ||
        COMPUTED_UNITS.includes(rightValueUnit.unit)
    ) {
        // @ts-ignore
        leftValueUnit.value = getComputedValue(start, leftValueUnit.targets?.[0]);
        // @ts-ignore
        rightValueUnit.value = getComputedValue(stop, rightValueUnit.targets?.[0]);
        // @ts-ignore
        leftValueUnit.value = lerp(t, leftValueUnit.value, rightValueUnit.value) as any;
    } else if (leftValueUnit.unit === "color") {
        Object.keys(start).forEach((key) => {
            leftValueUnit.value[key] = lerp(t, start[key], stop[key]);
        });
    }

    return leftValueUnit;
}

export function parseAndFlattenObject(input: any) {
    const flat = flattenObject(input);

    const parsedVars = Object.entries(flat)
        .map(([key, value]) => {
            const childKey = key.split(".").pop();

            if (
                value instanceof ValueUnit ||
                value instanceof FunctionValue ||
                value instanceof ValueArray
            ) {
                return [key, value];
            }

            const p = CSSKeyframes.FunctionArgs.map((v: Array<ValueUnit>) => {
                if (isCSSStyleName(childKey)) {
                    return v;
                } else {
                    return new FunctionValue(childKey, v);
                }
            })
                .or(CSSKeyframes.Value)
                .tryParse(String(value));

            return [key, p];
        })
        .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});

    return parsedVars;
}

function seekPreviousValue<T>(ix: number, values: T[], pred: (f: T) => boolean) {
    for (let i = ix - 1; i >= 0; i--) {
        if (pred(values[i])) {
            return i;
        }
    }
    return undefined;
}

const createInterpVarValue = (
    v: string,
    startIx: number,
    endIx: number,
    vars: any[],
) => {
    let left = vars[startIx][v];
    let right = vars[endIx][v];

    const maxLength = Math.max(left.length, right.length);

    let newLeft = left.concat(
        Array(Math.abs(maxLength - left.length)).fill(new ValueUnit(0)),
    );
    let newRight = right.concat(
        Array(Math.abs(maxLength - right.length)).fill(new ValueUnit(0)),
    );

    return newLeft.map((l, i) => normalizeValueUnits(l, newRight[i]));
};

export function reconcileVars(ix: number, vars: any[], frames: any[]) {
    const [startVars, endVars] = [vars[ix], vars[ix + 1]];

    const interpVars = {};

    const allVars = [...new Set([...Object.keys(startVars), ...Object.keys(endVars)])];

    allVars.forEach((v) => {
        if (v in startVars && v in endVars) {
            // Default case - both frames have the variable
            interpVars[v] = createInterpVarValue(v, ix, ix + 1, vars);
        } else if (!(v in startVars) && v in endVars) {
            // Degenerate case - only the end frame has the variable
            // Find the last frame that has that variable
            const oldFrameIx = seekPreviousValue(ix, vars, (f) => v in f);

            if (oldFrameIx != null && frames[oldFrameIx] != null) {
                const oldFrame = frames[oldFrameIx];
                oldFrame.interpVars[v] = createInterpVarValue(
                    v,
                    oldFrameIx,
                    ix + 1,
                    vars,
                );
            } else {
                return;
            }
        }
    });

    if (Object.keys(interpVars).length === 0) {
        return undefined;
    }
    return interpVars;
}

async function main() {
    const compiled = await compileTailwindCss(ballAnim, config);

    const parsed = parseCSSKeyframes(compiled);

    const vars = [];
    for (const [key, value] of parsed.entries()) {
        const flat1 = flattenObject(value);

        const string1 = unflattenObjectToString(flat1);

        console.log(key, flat1, string1);

        vars.push(flat1);
    }

    const frames = [];

    for (let i = 0; i < vars.length - 1; i++) {
        const interpVars = reconcileVars(i, vars, frames);
        if (interpVars == null) {
            continue;
        }

        frames.push({ interpVars });
    }

    for (const frame of frames) {
        frame.vars = Object.entries(frame.interpVars).reduce((acc, [key, value]) => {
            // @ts-ignore
            acc[key] = value.map((v) => v.leftValueUnit);
            return acc;
        }, {});
    }

    for (const frame of frames) {
        for (const [key, values] of Object.entries(frame.interpVars)) {
            const lerped = (values as any).map((v, i) => {
                return lerpValue(0.5, v as InterpolatedVariable);
            });

            console.log(key, lerped);
        }

        const s = unflattenObjectToString(frame.vars);

        console.log(s);
    }

    console.log(frames);

    // const left = frames[0];
    // const right = frames[1];

    // for (const [key, value] of Object.entries(left)) {
    //     const r = right[key] != null ? right[key] : new ValueUnit(0);

    //     const lerped = lerpValue(0.5, value as any, r);

    //     console.log(key, value, r, lerped);
    // }
}

main();
