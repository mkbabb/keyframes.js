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

export const getComputedValue = memoize((value: ValueUnit, target: HTMLElement) => {
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

            const computed = getComputedStyle(target).getPropertyValue(value.property);

            target.style[value.property] = originalValue;

            const p = parseCSSKeyframesValue(computed);

            if (p instanceof ValueUnit) {
                return p;
            }

            if (p.name.startsWith("matrix")) {
                const matrixValues = unpackMatrixValues(p);

                const matrixSubValue = matrixValues[value.subProperty];

                if (matrixSubValue != null) {
                    return new ValueUnit(matrixSubValue, "px", ["length", "absolute"]);
                }
            }
        }

        return value;
    };

    const newValue = get();

    return newValue.coalesce(value);
});

export const normalizeNumericUnits = (
    a: ValueUnit,
    b: ValueUnit,
): [ValueUnit, ValueUnit] => {
    if (a?.superType?.[0] !== b?.superType?.[0]) {
        return [a, b];
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
};

export function normalizeValueUnits(left: ValueUnit, right: ValueUnit) {
    left = left.coalesce(right);
    right = right.coalesce(left);

    const out = {
        start: left.value,
        stop: right.value,

        startValueUnit: left,
        stopValueUnit: right,
    } as InterpolatedVar<any>;

    if (left.unit === "string") {
        out.start = left.value;
        out.stop = left.value;
    }
    if (right.unit === "string") {
        out.start = right.value;
        out.stop = right.value;
    }

    if (isColorUnit(left) && isColorUnit(right)) {
        const [leftCollapsed, rightCollapsed] = normalizeColorUnits(left, right);

        out.start = JSON.parse(JSON.stringify(leftCollapsed.value));
        out.stop = JSON.parse(JSON.stringify(rightCollapsed.value));

        out.startValueUnit = leftCollapsed;
        out.stopValueUnit = rightCollapsed;
    }

    if (left.unit !== right.unit) {
        const [leftCollapsed, rightCollapsed] = normalizeNumericUnits(left, right);

        out.start = leftCollapsed.value;
        out.stop = rightCollapsed.value;

        out.startValueUnit = leftCollapsed;
        out.stopValueUnit = rightCollapsed;
    }

    out.computed =
        COMPUTED_UNITS.includes(left.unit) || COMPUTED_UNITS.includes(right.unit);

    return out;
}
