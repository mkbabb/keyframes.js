import { InterpolatedVar } from "@src/animation/constants";
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
                const originalValue = target.style[value.property];

                const newValue = value.subProperty
                    ? `${value.subProperty}(${value.toString()})`
                    : value.toString();

                target.style[value.property] = newValue;

                const computed = getComputedStyle(target).getPropertyValue(
                    value.property,
                );

                target.style[value.property] = originalValue;

                const p = parseCSSKeyframesValue(computed);

                if (p instanceof ValueUnit) {
                    return p;
                }

                if (p.name.startsWith("matrix")) {
                    const matrixValues = unpackMatrixValues(p);

                    const matrixSubValue = matrixValues[value.subProperty];

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
    { keyFn: (value, target) => `${value.toString()}-${JSON.stringify(target)}` },
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
                    value: convertToPixels(value.value, value.unit, value.targets?.[0]),
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
                return { value: value.value, unit: value.unit };
        }
    };

    const [newA, newB] = [convertToNormalizedUnit(a), convertToNormalizedUnit(b)];

    if (inplace) {
        a.value = newA.value;
        a.unit = newA.unit;

        b.value = newB.value;
        b.unit = newB.unit;

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

export function normalizeValueUnits(left: ValueUnit, right: ValueUnit) {
    left = left.coalesce(right, true);
    right = right.coalesce(left, true);

    const out = {
        start: left,
        stop: right,
        value: left.clone(),
    } as InterpolatedVar<any>;

    if (isColorUnit(left) && isColorUnit(right)) {
        const [leftCollapsed, rightCollapsed] = normalizeColorUnits(
            left,
            right,
            "lab",
            true,
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
        COMPUTED_UNITS.includes(left.unit) || COMPUTED_UNITS.includes(right.unit);

    return out;
}
