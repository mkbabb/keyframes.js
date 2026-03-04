import type { InterpolatedVar, HueInterpolationMethod } from "@mkbabb/value.js";
import { ValueUnit } from ".";
import { parseCSSKeyframesValue } from "../parsing/keyframes";
import { parseCSSValueUnit } from "../parsing/units";
import { memoize } from "../utils";
import { normalizeColorUnits } from "./color/normalize";
import {
    ANGLE_UNITS,
    COMPUTED_UNITS,
    LENGTH_UNITS,
    RESOLUTION_UNITS,
    TIME_UNITS,
} from "./constants";
import {
    convertToDegrees,
    convertToDPI,
    convertToMs,
    convertToPixels,
    unpackMatrixValues,
} from "./utils";

type ColorValueUnit = Parameters<typeof normalizeColorUnits>[0];
type NormalizeColorSpace = Parameters<typeof normalizeColorUnits>[2];

const MATRIX_SUB_PROPERTIES = new Set([
    "scaleX",
    "scaleY",
    "scaleZ",
    "skewX",
    "skewY",
    "skewZ",
    "translateX",
    "translateY",
    "translateZ",
    "rotateX",
    "rotateY",
    "rotateZ",
    "perspectiveX",
    "perspectiveY",
    "perspectiveZ",
    "perspectiveW",
] as const);

const isLengthUnit = (unit: unknown): unit is (typeof LENGTH_UNITS)[number] => {
    return (
        typeof unit === "string" &&
        (LENGTH_UNITS as readonly string[]).includes(unit)
    );
};

const isAngleUnit = (unit: unknown): unit is (typeof ANGLE_UNITS)[number] => {
    return (
        typeof unit === "string" &&
        (ANGLE_UNITS as readonly string[]).includes(unit)
    );
};

const isTimeUnit = (unit: unknown): unit is (typeof TIME_UNITS)[number] => {
    return (
        typeof unit === "string" &&
        (TIME_UNITS as readonly string[]).includes(unit)
    );
};

const isResolutionUnit = (
    unit: unknown,
): unit is (typeof RESOLUTION_UNITS)[number] => {
    return (
        typeof unit === "string" &&
        (RESOLUTION_UNITS as readonly string[]).includes(unit)
    );
};

const isComputedUnit = (
    unit: unknown,
): unit is (typeof COMPUTED_UNITS)[number] => {
    return (
        typeof unit === "string" &&
        (COMPUTED_UNITS as readonly string[]).includes(unit)
    );
};

const isMatrixSubProperty = (
    value: string,
): value is typeof MATRIX_SUB_PROPERTIES extends Set<infer T> ? T : never => {
    return MATRIX_SUB_PROPERTIES.has(
        value as typeof MATRIX_SUB_PROPERTIES extends Set<infer T> ? T : never,
    );
};

const toNumericValue = (value: unknown, context: string): number => {
    if (typeof value !== "number" || !Number.isFinite(value)) {
        throw new TypeError(
            `Expected numeric ${context}, got ${String(value)}.`,
        );
    }
    return value;
};

const asColorValueUnit = (value: ValueUnit): ColorValueUnit => {
    if (value.unit !== "color") {
        throw new TypeError("Expected a color ValueUnit.");
    }
    return value as unknown as ColorValueUnit;
};

const styleRecord = (style: CSSStyleDeclaration): Record<string, string> =>
    style as unknown as Record<string, string>;

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
    (value: ValueUnit, target?: HTMLElement) => {
        const get = () => {
            if (!target) {
                return value;
            }

            if (value.unit === "var") {
                const computed = getComputedStyle(target).getPropertyValue(
                    value.value,
                );
                return parseCSSValueUnit(computed);
            }

            if (
                value.unit === "calc" &&
                value.property &&
                value.subProperty &&
                value.value &&
                target
            ) {
                const style = styleRecord(target.style);
                const originalValue = style[value.property] ?? "";

                const newValue = value.subProperty
                    ? `${value.subProperty}(${value.toString()})`
                    : value.toString();

                style[value.property] = newValue;

                const computed = getComputedStyle(target).getPropertyValue(
                    value.property,
                );

                style[value.property] = originalValue;

                const p = parseCSSKeyframesValue(computed);

                if (p instanceof ValueUnit) {
                    return p;
                }

                if (p.name.startsWith("matrix")) {
                    const matrixValues = unpackMatrixValues(p);

                    if (isMatrixSubProperty(value.subProperty)) {
                        const matrixSubValue = matrixValues[value.subProperty];

                        if (matrixSubValue != null) {
                            return new ValueUnit(matrixSubValue, "px", [
                                "length",
                                "absolute",
                            ]);
                        }
                    }
                }
            }

            return value;
        };

        const newValue = get();

        return newValue.coalesce(value);
    },
    {
        keyFn: (value: ValueUnit, target?: HTMLElement) =>
            `${value.toString()}-${target ? getElementId(target) : "null"}`,
        // Don't cache when the element is disconnected (e.g. inside a Teleport
        // defer DocumentFragment). Layout-dependent units like cqw/vh resolve
        // to 0 without a live DOM context.
        shouldCache: (
            _result: ValueUnit,
            _value: ValueUnit,
            target?: HTMLElement,
        ) => !target || target.isConnected,
    },
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
        const numericValue = toNumericValue(value.value, "ValueUnit");

        switch (superType) {
            case "length":
                if (!isLengthUnit(value.unit)) {
                    throw new TypeError(
                        `Unsupported length unit: ${String(value.unit)}`,
                    );
                }
                return {
                    value: convertToPixels(
                        numericValue,
                        value.unit,
                        value.targets?.[0],
                    ),
                    unit: "px",
                };
            case "angle":
                if (!isAngleUnit(value.unit)) {
                    throw new TypeError(
                        `Unsupported angle unit: ${String(value.unit)}`,
                    );
                }
                return {
                    value: convertToDegrees(numericValue, value.unit),
                    unit: "deg",
                };
            case "time":
                if (!isTimeUnit(value.unit)) {
                    throw new TypeError(
                        `Unsupported time unit: ${String(value.unit)}`,
                    );
                }
                return {
                    value: convertToMs(numericValue, value.unit),
                    unit: "ms",
                };
            case "resolution":
                if (!isResolutionUnit(value.unit)) {
                    throw new TypeError(
                        `Unsupported resolution unit: ${String(value.unit)}`,
                    );
                }
                return {
                    value: convertToDPI(numericValue, value.unit),
                    unit: "dpi",
                };
            default:
                return {
                    value: numericValue,
                    unit: typeof value.unit === "string" ? value.unit : "",
                };
        }
    };

    const [newA, newB] = [
        convertToNormalizedUnit(a),
        convertToNormalizedUnit(b),
    ];

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

export function normalizeValueUnits(
    left: ValueUnit,
    right: ValueUnit,
    colorSpace: string = "oklab",
    hueMethod?: HueInterpolationMethod,
) {
    left = left.coalesce(right);
    right = right.coalesce(left);

    const out = {
        start: left,
        stop: right,
        value: left.clone(),
        computed: false,
    } as InterpolatedVar<unknown>;

    if (left.unit === "color" && right.unit === "color") {
        const [leftCollapsed, rightCollapsed] = normalizeColorUnits(
            asColorValueUnit(left),
            asColorValueUnit(right),
            colorSpace as NormalizeColorSpace,
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

    out.computed = isComputedUnit(left.unit) || isComputedUnit(right.unit);

    return out;
}
