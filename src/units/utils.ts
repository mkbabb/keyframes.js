import { isObject } from "../utils";
import { ValueUnit, FunctionValue, ValueArray } from ".";
import {
    ABSOLUTE_LENGTH_UNITS,
    ANGLE_UNITS,
    MatrixValues,
    RELATIVE_LENGTH_UNITS,
    RESOLUTION_UNITS,
    STYLE_NAMES,
    TIME_UNITS,
} from "./constants";

export function traverseObject<T>(
    obj: T,
    fn: (key: string, value: ValueUnit, parentKey?: string) => void,
    parentKey?: string,
) {
    for (const [key, value] of Object.entries(obj)) {
        if (isObject(value)) {
            const newParentKey = parentKey ? `${parentKey}.${key}` : key;
            traverseObject(value, fn, newParentKey);
        } else if (Array.isArray(value)) {
            value.forEach((v, i) => traverseObject(v, fn, `${key}[${i}]`));
        } else {
            fn(key, value, parentKey);
        }
    }
}

export const valueUnitValueOf = (
    value: ValueUnit | FunctionValue,
): [string | undefined, any[]] => {
    if (value instanceof ValueUnit) {
        return [undefined, [value.valueOf()]];
    } else if (Array.isArray(value)) {
        return [undefined, value.map((v) => v.valueOf())];
    } else {
        const [name, valueUnitValues] = Object.entries(value)[0];

        return [name, valueUnitValues.map((v) => v.valueOf())];
    }
};

export const valueUnitToString = (
    value: ValueUnit | FunctionValue | Array<ValueUnit | FunctionValue>,
): string => {
    if (value instanceof ValueUnit) {
        return value.toString();
    } else if (Array.isArray(value)) {
        return value.map(valueUnitToString).join(" ");
    } else {
        const [name, values] = Object.entries(value)[0];

        return `${name}(${values.map(valueUnitToString).join(", ")})`;
    }
};

export const flattenObject = (obj: any) => {
    const flat = {};

    const flatten = (obj: any, parentKey: string = undefined) => {
        if (Array.isArray(obj)) {
            obj.forEach((v, i) => flatten(v, parentKey));
        } else if (obj instanceof FunctionValue) {
            const newKey = parentKey ? `${parentKey}.${obj.name}` : obj.name;
            obj.args.forEach((v, i) => flatten(v, newKey));
        } else if (isObject(obj)) {
            for (const [key, value] of Object.entries(obj)) {
                const currentKey = parentKey ? `${parentKey}.${key}` : key;
                flatten(value, currentKey);
            }
        } else {
            if (flat[parentKey]) {
                flat[parentKey].push(obj);
            } else {
                flat[parentKey] = new ValueArray(obj).flat();
            }
        }
    };

    flatten(obj);

    return flat;
};

export const unflattenObject = (flatObj: Record<string, any[]>): any => {
    const result: any = {};

    for (const [flatKey, values] of Object.entries(flatObj)) {
        const keys = flatKey.split(".");
        let current = result;

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const isLastKey = i === keys.length - 1;

            if (isLastKey) {
                if (Array.isArray(current)) {
                    current.push(values);
                } else {
                    current[key] = values;
                }
            } else {
                if (!(key in current)) {
                    current[key] = {};
                }
                current = current[key];
            }
        }
    }

    return result;
};

export const unflattenObjectToString = (flatObj: Record<string, any[]>): any => {
    const result: any = {};

    for (const [flatKey, values] of Object.entries(flatObj)) {
        const keys = flatKey.split(".");
        const propertyKey = keys[0];

        let current = result[propertyKey] ?? "";

        let leftS = "";
        let rightS = "";

        for (let i = 1; i < keys.length; i++) {
            leftS += `${keys[i]}(`;
            rightS += ")";
        }

        current += ` ${leftS}${values.toString()}${rightS}`;

        result[propertyKey] = current.trim();
    }

    return result;
};

const setStyleNames = new Set(STYLE_NAMES);

export function isCSSStyleName(value: any): value is (typeof STYLE_NAMES)[number] {
    return setStyleNames.has(value);
}

export const unpackMatrixValues = (value: ValueUnit | FunctionValue): MatrixValues => {
    const [name, values] = valueUnitValueOf(value);

    if (!name?.startsWith("matrix")) {
        throw new Error("Input must be a matrix or matrix3d value");
    }

    const defaultValues: MatrixValues = {
        scaleX: 1,
        scaleY: 1,
        scaleZ: 1,
        skewX: 0,
        skewY: 0,
        skewZ: 0,
        translateX: 0,
        translateY: 0,
        translateZ: 0,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        perspectiveX: 0,
        perspectiveY: 0,
        perspectiveZ: 0,
        perspectiveW: 1,
    };

    if (name === "matrix") {
        // 2D matrix: [a, b, c, d, tx, ty]
        return {
            ...defaultValues,
            scaleX: values[0] ?? 1,
            skewY: values[1] ?? 0,
            skewX: values[2] ?? 0,
            scaleY: values[3] ?? 1,
            translateX: values[4] ?? 0,
            translateY: values[5] ?? 0,
            rotateZ: Math.atan2(values[1] ?? 0, values[0] ?? 1),
            rotateY: Math.atan2(-(values[2] ?? 0), values[0] ?? 1),
            rotateX: Math.atan2(values[1] ?? 0, values[3] ?? 1),
        };
    } else if (name === "matrix3d") {
        if (values.length === 4) {
            // Alternative 3D matrix form: [a4, b4, c4, d4]
            return {
                ...defaultValues,
                translateX: values[0] ?? 0,
                translateY: values[1] ?? 0,
                translateZ: values[2] ?? 0,
                perspectiveW: values[3] ?? 1,
            };
        } else if (values.length === 16) {
            // Standard 3D matrix: [m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44]
            return {
                scaleX: values[0] ?? 1,
                skewY: values[1] ?? 0,
                skewX: values[4] ?? 0,
                scaleY: values[5] ?? 1,
                scaleZ: values[10] ?? 1,
                skewZ: values[2] ?? 0,
                translateX: values[12] ?? 0,
                translateY: values[13] ?? 0,
                translateZ: values[14] ?? 0,
                rotateX: Math.atan2(-(values[9] ?? 0), values[10] ?? 1),
                rotateY: Math.atan2(
                    values[8] ?? 0,
                    Math.sqrt(
                        Math.pow(values[0] ?? 1, 2) + Math.pow(values[1] ?? 0, 2),
                    ),
                ),
                rotateZ: Math.atan2(values[1] ?? 0, values[0] ?? 1),
                perspectiveX: values[3] ?? 0,
                perspectiveY: values[7] ?? 0,
                perspectiveZ: values[11] ?? 0,
                perspectiveW: values[15] ?? 1,
            };
        }
    }

    throw new Error("Unsupported matrix type or invalid number of values");
};

export function convertAbsoluteUnitToPixels(value: number, unit: string) {
    let pixels = value;
    if (unit === "cm") {
        pixels *= 96 / 2.54;
    } else if (unit === "mm") {
        pixels *= 96 / 25.4;
    } else if (unit === "in") {
        pixels *= 96;
    } else if (unit === "pt") {
        pixels *= 4 / 3;
    } else if (unit === "pc") {
        pixels *= 16;
    }

    return pixels;
}

export function convertToPixels(
    value: number,
    unit:
        | (typeof ABSOLUTE_LENGTH_UNITS)[number]
        | (typeof RELATIVE_LENGTH_UNITS)[number]
        | string,
    element?: HTMLElement,
    property?: string,
): number {
    if (unit === "em" && element) {
        value *= parseFloat(getComputedStyle(element).fontSize);
    } else if (unit === "rem") {
        value *= parseFloat(getComputedStyle(document.documentElement).fontSize);
    } else if (unit === "vh") {
        value *= window.innerHeight / 100;
    } else if (unit === "vw") {
        value *= window.innerWidth / 100;
    } else if (unit === "vmin") {
        value *= Math.min(window.innerHeight, window.innerWidth) / 100;
    } else if (unit === "vmax") {
        value *= Math.max(window.innerHeight, window.innerWidth) / 100;
    } else if (unit === "%" && element?.parentElement && property) {
        const parentValue = parseFloat(
            getComputedStyle(element.parentElement).getPropertyValue(property),
        );
        value = (value / 100) * parentValue;
    } else if (unit === "ex" || unit === "ch") {
        value *= parseFloat(getComputedStyle(element).fontSize) ?? 16;
    } else {
        value = convertAbsoluteUnitToPixels(value, unit);
    }

    return value;
}

export function convertToMs(value: number, unit: (typeof TIME_UNITS)[number]) {
    if (unit === "s") {
        value *= 1000;
    }
    return value;
}

export function convertToDegrees(value: number, unit: (typeof ANGLE_UNITS)[number]) {
    if (unit === "grad") {
        value *= 0.9;
    } else if (unit === "rad") {
        value *= 180 / Math.PI;
    } else if (unit === "turn") {
        value *= 360;
    }
    return value;
}

export function convertToDPI(value: number, unit: (typeof RESOLUTION_UNITS)[number]) {
    if (unit === "dpcm") {
        value *= 2.54;
    } else if (unit === "dppx") {
        value *= 96;
    }
    return value;
}


