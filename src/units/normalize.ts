import type { InterpolatedVar, HueInterpolationMethod } from "@mkbabb/value.js";
import { ValueUnit } from ".";
import { parseCSSKeyframesValue } from "../parsing/keyframes";
import { parseCSSValueUnit } from "../parsing/units";
import { memoize } from "../utils";
import { normalizeColorUnits } from "./color/normalize";
import { COMPUTED_UNITS } from "./constants";
import {
    convertToDegrees,
    convertToDPI,
    convertToMs,
    convertToPixels,
    isColorUnit,
    unpackMatrixValues,
} from "./utils";

const elementIdMap = new WeakMap<HTMLElement, number>();
let nextElementId = 0;
const getElementId = (el: HTMLElement) => {
    let id = elementIdMap.get(el);
    if (id === undefined) {
        id = nextElementId++;
        elementIdMap.set(el, id);
    }
    return id;
};

export const getComputedValue = memoize(
    (value: ValueUnit, target: HTMLElement) => {
        const get = () => {
            if (!target) {
                return value;
            }

            if (value.unit === "var") {
                const computed = getComputedStyle(target).getPropertyValue(value.value);
                return parseCSSValueUnit(computed);
            }

            if (
                value.unit === "calc" &&
                value.property &&
                value.subProperty &&
                value.value &&
                target
            ) {
                const originalValue = (target.style as any)[value.property as string];

                const newValue = value.subProperty
                    ? `${value.subProperty}(${value.toString()})`
                    : value.toString();

                (target.style as any)[value.property as string] = newValue;

                const computed = getComputedStyle(target).getPropertyValue(
                    value.property as string,
                );

                (target.style as any)[value.property as string] = originalValue;

                const p = parseCSSKeyframesValue(computed);

                if (p instanceof ValueUnit) {
                    return p;
                }

                if (p.name.startsWith("matrix")) {
                    const matrixValues = unpackMatrixValues(p);

                    const matrixSubValue = (matrixValues as any)[value.subProperty as string];

                    if (matrixSubValue != null) {
                        return new ValueUnit(matrixSubValue, "px", [
                            "length",
                            "absolute",
                        ]);
                    }
                }
            }

            return value;
        };

        const newValue = get();

        return newValue.coalesce(value);
    },
    { keyFn: (value: any, target: any) => `${value.toString()}-${target ? getElementId(target) : 'null'}` },
);

export const normalizeNumericUnits = (
    a: ValueUnit,
    b: ValueUnit,
    inplace: boolean = false,
): [ValueUnit, ValueUnit] => {
    if (a?.superType?.[0] !== b?.superType?.[0]) {
        if (inplace) {
            return [a, b];
        } else {
            return [a.clone(), b.clone()];
        }
    }

    const convertToNormalizedUnit = (
        value: ValueUnit,
    ): { value: number; unit: string } => {
        const superType = value?.superType?.[0];

        switch (superType) {
            case "length":
                return {
                    value: convertToPixels(value.value, value.unit as any, value.targets?.[0]),
                    unit: "px",
                };
            case "angle":
                return {
                    value: convertToDegrees(value.value, value.unit as any),
                    unit: "deg",
                };
            case "time":
                return {
                    value: convertToMs(value.value, value.unit as any),
                    unit: "ms",
                };
            case "resolution":
                return {
                    value: convertToDPI(value.value, value.unit as any),
                    unit: "dpi",
                };
            default:
                return { value: value.value, unit: value.unit as string };
        }
    };

    const [newA, newB] = [convertToNormalizedUnit(a), convertToNormalizedUnit(b)];

    if (inplace) {
        a.value = newA.value;
        a.unit = newA.unit as any;

        b.value = newB.value;
        b.unit = newB.unit as any;

        return [a, b];
    } else {
        return [
            new ValueUnit(
                newA.value,
                newA.unit,
                a.superType,
                a.subProperty,
                a.property,
                a.targets,
            ),
            new ValueUnit(
                newB.value,
                newB.unit,
                b.superType,
                b.subProperty,
                b.property,
                b.targets,
            ),
        ];
    }
};

export function normalizeValueUnits(left: ValueUnit, right: ValueUnit, colorSpace: string = "oklab", hueMethod?: HueInterpolationMethod) {
    left = left.coalesce(right);
    right = right.coalesce(left);

    const out = {
        start: left,
        stop: right,
        value: left.clone(),
    } as InterpolatedVar<any>;

    if (isColorUnit(left as any) && isColorUnit(right as any)) {
        const [leftCollapsed, rightCollapsed] = normalizeColorUnits(
            left as any,
            right as any,
            colorSpace as any,
            true,
            false,
            false,
            hueMethod,
        );

        out.start = leftCollapsed;
        out.stop = rightCollapsed;
        out.value = leftCollapsed.clone();
    }

    if (left.unit !== right.unit) {
        const [leftCollapsed, rightCollapsed] = normalizeNumericUnits(
            left,
            right,
            true,
        );

        out.start = leftCollapsed;
        out.stop = rightCollapsed;
        out.value = leftCollapsed.clone();
    }

    out.computed =
        (COMPUTED_UNITS as readonly string[]).includes(left.unit as string) ||
        (COMPUTED_UNITS as readonly string[]).includes(right.unit as string);

    return out;
}
