import { ValueUnit } from ".";
import { parseCSSKeyframesValue } from "../parsing/keyframes";
import { parseCSSValueUnit } from "../parsing/units";
import { memoize } from "../utils";
import {
    convertToDegrees,
    convertToDPI,
    convertToMs,
    convertToPixels,
    unpackMatrixValues,
    valueUnitValueOf,
} from "./utils";

export const getComputedValue = memoize(
    (value: ValueUnit<any>, target: HTMLElement) => {
        if (value.unit === "var") {
            const computed = getComputedStyle(target).getPropertyValue(
                value.toString(),
            );

            const newValue = parseCSSValueUnit(computed);

            newValue.setSubProperty(value.subProperty);
            newValue.setProperty(value.property);
            newValue.setTargets(value.targets);
        }

        if (
            value.unit === "calc" &&
            value.property &&
            value.subProperty &&
            value.value
        ) {
            const originalValue = target.style[value.property];

            const newValue = value.subProperty
                ? `${value.subProperty}(${value.toString()})`
                : value.toString();

            target.style[value.property] = newValue;

            const computed = getComputedStyle(target).getPropertyValue(value.property);

            target.style[value.property] = originalValue;

            const p = parseCSSKeyframesValue(computed);

            const [name, values] = valueUnitValueOf(p);

            if (name?.startsWith("matrix")) {
                const matrixValues = unpackMatrixValues(p);

                let matrixSubValue = matrixValues[value.subProperty];

                if (matrixSubValue != null) {
                    return new ValueUnit(
                        matrixSubValue,
                        "px",
                        ["length", "absolute"],
                        value.subProperty,
                        value.property,
                        value.targets,
                    );
                }
            }

            return p;
        }

        return value;
    },
);

export const normalizeNumericUnits = (
    a: ValueUnit<any>,
    b: ValueUnit<any>,
): [ValueUnit<any>, ValueUnit<any>] => {
    if (a?.superType?.[0] !== b?.superType?.[0]) {
        return [a, b]; // Return original values if types don't match
    }

    const convertToNormalizedUnit = (
        value: ValueUnit<any>,
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

// const lerpComputed = <T>(
//     t: number,
//     left: ValueUnit<T>,
//     right: ValueUnit<T>,
//     target: HTMLElement,
// ) => {
//     const newLeft =
//         left.unit === "var" || left.unit === "calc"
//             ? getComputedValue(target, left)
//             : left;

//     const newRight =
//         right.unit === "var" || right.unit === "calc"
//             ? getComputedValue(target, right)
//             : right;

//     if (!newLeft || !newRight) {
//         return left;
//     }

//     return lerpValueUnit(t, newLeft, newRight, target);
// };

// const BLACKLISTED_COALESCE_UNITS = ["string", "var", "calc"];

// function coalesceValueUnits<T>(left: ValueUnit<T>, right?: ValueUnit<T>): ValueUnit<T> {
//     if (!right) {
//         return left;
//     }

//     let leftUnit = left.unit;
//     let rightUnit = right.unit;

//     if (
//         BLACKLISTED_COALESCE_UNITS.includes(leftUnit) ||
//         BLACKLISTED_COALESCE_UNITS.includes(rightUnit)
//     ) {
//         return left;
//     }

//     return new ValueUnit(
//         left.value,
//         leftUnit ?? rightUnit,
//         left.superType ?? right.superType,
//         left.subProperty ?? right.subProperty,
//         left.property ?? right.property,
//     );
// }

// export function normalizeValueUnits<T>(
//     left: ValueUnit<T>,
//     right?: ValueUnit<T>,
//     target?: HTMLElement,
// ): ValueUnit<T> {
//     left = coalesceValueUnits(left, right);
//     right = coalesceValueUnits(right, left);

//     if (left.unit === "string") {
//         return left;
//     }
//     if (right.unit === "string") {
//         return right;
//     }

//     const outValue = (() => {
//         if (
//             target &&
//             (left.unit === "var" ||
//                 right.unit === "var" ||
//                 left.unit === "calc" ||
//                 right.unit === "calc")
//         ) {
//             return lerpComputed(t, left, right, target);
//         } else if (left.unit === "color") {
//             const value = lerpColor(
//                 t,
//                 left as ValueUnit<RGBColor>,
//                 right as ValueUnit<RGBColor>,
//             );
//             return new ValueUnit(value, left.unit, left.superType);
//         } else if (left.unit !== right.unit) {
//             const [leftCollapsed, rightCollapsed] = normalizeNumericUnits(
//                 left as ValueUnit<number>,
//                 right as ValueUnit<number>,
//                 target,
//             );
//             const value = lerp(t, leftCollapsed.value, rightCollapsed.value);

//             return new ValueUnit(value, leftCollapsed.unit, leftCollapsed.superType);
//         } else {
//             const value = lerp(t, left.value as number, right.value as number);

//             return new ValueUnit(value, left.unit, left.superType);
//         }
//     })();

//     outValue.subProperty = left.subProperty;
//     outValue.property = left.property;

//     return outValue as any;
// }

// export function lerpValueUnit<T>(
//     t: number,
//     left: ValueUnit<T>,
//     right?: ValueUnit<T>,
//     target?: HTMLElement,
// ): ValueUnit<T> {
//     left = coalesceValueUnits(left, right);
//     right = coalesceValueUnits(right, left);

//     if (left.unit === "string") {
//         return left;
//     }
//     if (right.unit === "string") {
//         return right;
//     }

//     const outValue = (() => {
//         if (
//             target &&
//             (left.unit === "var" ||
//                 right.unit === "var" ||
//                 left.unit === "calc" ||
//                 right.unit === "calc")
//         ) {
//             return lerpComputed(t, left, right, target);
//         } else if (left.unit === "color") {
//             const value = lerpColor(
//                 t,
//                 left as ValueUnit<RGBColor>,
//                 right as ValueUnit<RGBColor>,
//             );
//             return new ValueUnit(value, left.unit, left.superType);
//         } else if (left.unit !== right.unit) {
//             const [leftCollapsed, rightCollapsed] = collapseNumericType(
//                 left as ValueUnit<number>,
//                 right as ValueUnit<number>,
//                 target,
//             );
//             const value = lerp(t, leftCollapsed.value, rightCollapsed.value);

//             return new ValueUnit(value, leftCollapsed.unit, leftCollapsed.superType);
//         } else {
//             const value = lerp(t, left.value as number, right.value as number);

//             return new ValueUnit(value, left.unit, left.superType);
//         }
//     })();

//     outValue.subProperty = left.subProperty;
//     outValue.property = left.property;

//     return outValue as any;
// }

// export function lerpFunctionValue<T>(
//     t: number,
//     left: FunctionValue<T>,
//     right: FunctionValue<T>,
//     target?: HTMLElement,
// ): FunctionValue<T> {
//     if (left == null) {
//         return right;
//     }
//     if (right == null) {
//         return left;
//     }

//     const newLeft = left.args.map((l, i) => {
//         const r = right.args[i];
//         return lerpValue(t, l, r, target);
//     });

//     return newLeft as any;
// }

// export function lerpValueArray<T>(
//     t: number,
//     left: Array<ValueUnit<T> | FunctionValue<T>>,
//     right: Array<ValueUnit<T> | FunctionValue<T>>,
//     target?: HTMLElement,
// ): Array<ValueUnit<T> | FunctionValue<T>> {
//     if (left == null) {
//         return right;
//     }
//     if (right == null) {
//         return left;
//     }

//     const maxLength = Math.max(left.length, right.length);

//     let newLeft = left.concat(
//         Array(Math.abs(maxLength - left.length)).fill(new ValueUnit(0)),
//     );

//     let newRight = right.concat(
//         Array(Math.abs(maxLength - right.length)).fill(new ValueUnit(0)),
//     );

//     return newLeft.map((l, i) => {
//         const r = newRight[i];
//         return lerpValue(t, l, r, target);
//     }) as any;
// }

// export function lerpValue<T>(
//     t: number,
//     left: ValueUnit<T> | FunctionValue<T> | ValueArray<T>,
//     right: ValueUnit<T> | FunctionValue<T> | ValueArray<T>,
//     target?: HTMLElement,
// ) {
//     if (left instanceof ValueArray) {
//         right = right instanceof ValueArray ? right : new ValueArray(right);
//         return lerpValueArray(t, left, right, target);
//     } else if (left instanceof FunctionValue && right instanceof FunctionValue) {
//         return lerpFunctionValue(t, left, right, target);
//     } else {
//         return lerpValueUnit(t, left as any, right as any, target);
//     }
// }
