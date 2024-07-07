import { RGBColor } from "d3-color";
import { lerp } from "./math";
import { CSSKeyframes, parseCSSTime } from "./parsing/keyframes";
import { isCSSStyleName } from "./parsing/styleNames";
import {
    CSSValueUnit,
    absoluteLengthUnits,
    getMatrixValues,
    relativeLengthUnits,
} from "./parsing/units";
import { arrayEquals, isObject, memoize } from "./utils";

export interface TransformedVars {
    [arg: string]: ValueArray;
}

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
        | (typeof absoluteLengthUnits)[number]
        | (typeof relativeLengthUnits)[number]
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
        value *= parseFloat(getComputedStyle(element).fontSize);
    } else {
        value = convertAbsoluteUnitToPixels(value, unit);
    }

    return value;
}

export function convertToCh(
    value: number,
    unit:
        | (typeof absoluteLengthUnits)[number]
        | (typeof relativeLengthUnits)[number]
        | string,
    element: HTMLElement,
    property?: string,
): number {
    const pixels = convertToPixels(1, "ch", element, property);
    const ch = convertToPixels(value, unit, element, property);

    return ch / pixels;
}

export function convertToDegrees(value: number, unit: string) {
    if (unit === "grad") {
        value *= 0.9;
    } else if (unit === "rad") {
        value *= 180 / Math.PI;
    } else if (unit === "turn") {
        value *= 360;
    }
    return value;
}

export function convertToDpi(value: number, unit: string) {
    if (unit === "dpcm") {
        value *= 2.54;
    } else if (unit === "dppx") {
        value *= 96;
    }
    return value;
}

export const getComputedValue = memoize(
    (target: HTMLElement, value: ValueUnit<any>) => {
        let computed;

        if (value.unit === "var") {
            computed = getComputedStyle(target).getPropertyValue(value.toString());
            const p = CSSValueUnit.Value.parse(computed);

            return p.status ? p.value : undefined;
        }

        if (value.unit === "calc" && value.property) {
            const originalValue = target.style[value.property];

            const newValue = value.subProperty
                ? `${value.subProperty}(${value.toString()})`
                : value.toString();

            target.style[value.property] = newValue;

            computed = getComputedStyle(target).getPropertyValue(value.property);

            target.style[value.property] = originalValue;

            const p = CSSValueUnit.Value.parse(computed);

            const parsedValue: ValueUnit<any> = p.status ? p.value : undefined;

            if (!parsedValue) {
                return undefined;
            }

            if (parsedValue.unit.startsWith("matrix")) {
                const matrixValues = getMatrixValues(parsedValue);

                const matrixSubValue = matrixValues[value.subProperty];

                if (matrixSubValue) {
                    const outValue = new ValueUnit(matrixSubValue, "px");

                    outValue.setProperty(value.property);
                    outValue.setSubProperty(value.subProperty);

                    return outValue;
                } else {
                    return parsedValue;
                }
            }
        }
    },
);

const lerpColor = (
    t: number,
    left: ValueUnit<RGBColor>,
    right: ValueUnit<RGBColor>,
) => {
    const leftValue = left.value;
    const rightValue = right.value;

    const value = {
        r: lerp(t, leftValue.r, rightValue.r),
        g: lerp(t, leftValue.g, rightValue.g),
        b: lerp(t, leftValue.b, rightValue.b),
    } as RGBColor;

    return value;
};

const lerpVar = (t: number, left: ValueUnit, right: ValueUnit, target: HTMLElement) => {
    const newLeft =
        left.unit === "var" || left.unit === "calc"
            ? getComputedValue(target, left)
            : left;

    const newRight =
        right.unit === "var" || right.unit === "calc"
            ? getComputedValue(target, right)
            : right;

    if (!newLeft || !newRight) {
        return left;
    }

    return newLeft.lerp(t, newRight, target);
};

export class ValueUnit<T = number> {
    subProperty: any;
    property: any;

    constructor(
        public value: T,
        public unit?: string,
        public superType: string[] = [],
    ) {}

    setProperty(property: any) {
        if (!property) {
            return this;
        }

        this.property = property;
        return this;
    }

    setSubProperty(subProperty: any) {
        if (!subProperty) {
            return this;
        }

        this.subProperty = subProperty;
        return this;
    }

    valueOf() {
        if (!this.unit) {
            return this.value;
        }
        return this.toString();
    }

    toJSON() {
        return this.valueOf();
    }

    toString() {
        if (!this.unit || this.unit === "string") {
            return `${this.value}`;
        }

        if (this.unit === "color") {
            const c = this.value as RGBColor;
            return `rgb(${c.r}, ${c.g}, ${c.b})`;
        } else if (this.unit === "var") {
            return `var(${this.value})`;
        } else if (this.unit === "calc") {
            return `calc(${this.value})`;
        } else {
            return `${this.value}${this.unit}`;
        }
    }

    coalesce(other?: ValueUnit<T>) {
        if (!other) {
            return this;
        }

        let unit = this.unit;
        let otherUnit = other.unit;

        let superType = this.superType;
        let otherSuperType = other.superType;

        unit ??= otherUnit;
        otherUnit ??= unit;

        superType ??= otherSuperType;
        otherSuperType ??= superType;

        const outValue = new ValueUnit(this.value, unit, superType);

        outValue.setProperty(this.property ?? other.property);
        outValue.setSubProperty(this.subProperty ?? other.subProperty);

        return outValue;
    }

    lerp(
        t: number,
        other: ValueUnit<T> | FunctionValue<T> | ValueArray<T>,
        target?: HTMLElement,
    ) {
        if (other instanceof FunctionValue || other instanceof ValueArray) {
            return other.lerp(t, this, target);
        }

        if (!other) {
            return this;
        }

        const current = this.coalesce(other);
        other = other?.coalesce(current);

        if (current.unit === "string") {
            return this;
        }

        if (other.unit === "string") {
            return other;
        }

        let outValue: ValueUnit<any>;

        if (
            target &&
            (current.unit === "var" ||
                other.unit === "var" ||
                current.unit === "calc" ||
                other.unit === "calc")
        ) {
            outValue = lerpVar(
                t,
                this as ValueUnit<number>,
                other as ValueUnit<number>,
                target,
            );
        } else if (current.unit !== other.unit) {
            const [left, right] = collapseNumericType(
                current as ValueUnit<number>,
                other as ValueUnit<number>,
                target,
            );

            const value = lerp(t, left.value, right.value);

            outValue = new ValueUnit(value, left.unit, left.superType);
        } else if (current.unit === "color") {
            const value = lerpColor(
                t,
                current as ValueUnit<RGBColor>,
                other as ValueUnit<RGBColor>,
            );

            outValue = new ValueUnit(value, current.unit, current.superType);
        } else {
            const value = lerp(t, current.value as number, other.value as number);
            outValue = new ValueUnit(value, current.unit, current.superType);
        }

        outValue.setProperty(this.property);
        outValue.setSubProperty(this.subProperty);

        return outValue;
    }
}

function lerpMany<T>(
    t: number,
    left: Array<FunctionValue<T> | ValueArray<T> | ValueUnit<T>>,
    right: Array<FunctionValue<T> | ValueArray<T> | ValueUnit<T>>,
    target?: HTMLElement,
) {
    const maxLength = Math.max(left.length, right.length);

    const newLeft = left.concat(
        Array(Math.abs(maxLength - left.length)).fill(left[left.length - 1]),
    );

    const newRight = right.concat(
        Array(Math.abs(maxLength - right.length)).fill(right[right.length - 1]),
    );

    return newLeft.map((l, i) => {
        const r = newRight[i];
        return l.lerp(t, r, target);
    });
}

export class FunctionValue<T = number> {
    values: Array<ValueUnit<T>>;

    property: any;
    subProperty: any;

    constructor(
        public name: string,
        values: ValueUnit<T> | Array<ValueUnit<T>>,
    ) {
        if (Array.isArray(values)) {
            this.values = values;
        } else {
            this.values = [values];
        }
    }

    setProperty(property: any) {
        if (!property) {
            return this;
        }

        this.property = property;

        this.values.forEach((v) => v.setProperty(property));

        return this;
    }

    setSubProperty(subProperty: any) {
        if (!subProperty) {
            return this;
        }

        this.subProperty = subProperty;

        this.values.forEach((v) => v.setSubProperty(subProperty));

        return this;
    }

    valueOf() {
        return this.values.length === 1
            ? this.values[0].valueOf()
            : this.values.map((v) => v.valueOf());
    }

    toJSON() {
        return {
            [this.name]: this.values.map((v) => v.toJSON()),
        };
    }

    toString() {
        const s = this.values.map((v) => v.toString()).join(", ");
        return `${this.name}(${s})`;
    }

    lerp(
        t: number,
        other: FunctionValue<T> | ValueArray<T> | ValueUnit<T>,
        target?: HTMLElement,
    ) {
        const otherValues = other instanceof ValueUnit ? [other] : other.values;

        const arr = lerpMany(t, this.values, otherValues, target);

        const outValue = new FunctionValue(this.name, arr);

        outValue.setProperty(this.property);
        outValue.setSubProperty(this.subProperty);

        return outValue;
    }
}

export class ValueArray<T = number> {
    values: Array<FunctionValue<T> | ValueUnit<T>>;

    property: any;
    subProperty: any;

    constructor(
        values:
            | ValueUnit<T>
            | FunctionValue<T>
            | ValueArray<T>
            | Array<FunctionValue<T> | ValueUnit<T>>,
    ) {
        if (values instanceof ValueArray) {
            this.values = values.values;
        } else if (Array.isArray(values)) {
            this.values = values;
        } else {
            this.values = [values];
        }
    }

    setProperty(property: any) {
        if (!property) {
            return this;
        }

        this.property = property;

        this.values.forEach((v) => v.setProperty(property));

        return this;
    }

    setSubProperty(subProperty: any) {
        if (!subProperty) {
            return this;
        }

        this.subProperty = subProperty;

        this.values.forEach((v) => v.setSubProperty(subProperty));

        return this;
    }

    valueOf() {
        return this.values.length === 1
            ? this.values[0].valueOf()
            : this.values.map((v) => v.valueOf());
    }

    toJSON() {
        return this.values.map((v) => v.toJSON());
    }

    toString() {
        return this.values.map((v) => v.toString()).join(" ");
    }

    lerp(
        t: number,
        other: ValueArray<T> | FunctionValue<T> | ValueUnit<T>,
        target?: HTMLElement,
    ) {
        const otherValues = other instanceof ValueUnit ? [other] : other.values;

        const arr = lerpMany(t, this.values, otherValues, target);
        return new ValueArray(arr);
    }
}

export const isValueType = (
    value: any,
): value is ValueUnit | FunctionValue | ValueArray =>
    value instanceof ValueUnit ||
    value instanceof FunctionValue ||
    value instanceof ValueArray;

export const collapseNumericType = (
    a: ValueUnit<number>,
    b: ValueUnit<number>,
    target?: HTMLElement,
): [ValueUnit<number>, ValueUnit<number>] => {
    if (!arrayEquals(a.superType, b.superType) && a.superType[0] !== "length") {
        return [a, b];
    }

    const [newA, newB] = (() => {
        if (a.superType[0] === "length") {
            return [
                convertToPixels(a.value, a.unit, target),
                convertToPixels(b.value, b.unit, target),
            ];
        } else if (a.superType[0] === "angle") {
            return [
                convertToDegrees(a.value, a.unit),
                convertToDegrees(b.value, b.unit),
            ];
        } else if (a.superType[0] === "time") {
            return [parseCSSTime(a.value + a.unit), parseCSSTime(b.value + b.unit)];
        } else if (a.superType[0] === "resolution") {
            return [convertToDpi(a.value, a.unit), convertToDpi(b.value, b.unit)];
        } else {
            return [a.value, b.value];
        }
    })();

    const [unit, superType] = [a.unit, a.superType];

    return [new ValueUnit(newA, unit, superType), new ValueUnit(newB, unit, superType)];
};

export function transformObject(input: any): TransformedVars {
    const flat = {};
    const flatten = (obj: any, parentKey: string = undefined) => {
        for (const [key, value] of Object.entries(obj)) {
            const currentKey = parentKey ? `${parentKey}.${key}` : key;

            if (isObject(value)) {
                flatten(value, currentKey);
            } else {
                flat[currentKey] = value;
            }
        }
    };

    flatten(input);

    const transformedVars = Object.entries(flat)
        .map(([key, value]) => {
            const childKey = key.split(".").pop();

            if (isValueType(value)) {
                return [key, value];
            }

            const p = CSSKeyframes.FunctionArgs.map((v: Array<ValueUnit>) => {
                if (isCSSStyleName(childKey)) {
                    return new ValueArray(v);
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

    return transformedVars;
}

export function mergeValueObjects<T>(
    currentValue: Object | any | undefined,
    value: Object | any | undefined,
) {
    if (currentValue == null) {
        return value;
    }

    const left: ValueArray<any> = isObject(currentValue)
        ? new ValueArray(Object.values(currentValue) as any)
        : new ValueArray(currentValue);

    const right: ValueArray<any> = isObject(value)
        ? new ValueArray(Object.values(value) as any)
        : new ValueArray(value);

    return new ValueArray([...left.values, ...right.values]);
}

export function reverseTransformObject<T>(
    key: string,
    value: ValueArray<T> | FunctionValue<T> | ValueUnit<T>,
    original: any = {},
) {
    const keys = key.split(".");
    let obj = original;

    if (keys.length === 1) {
        obj[key] = mergeValueObjects(obj[key], value);
        return original;
    }

    keys.forEach((k, i) => {
        if (value != null && i === keys.length - 1) {
            if (obj instanceof ValueArray) {
                const values = new ValueArray(value);
                obj.values.push(...values.values);
            } else {
                obj[k] = value;
            }
        } else {
            if (obj[k] == null) {
                obj[k] = {};
            }
            obj = obj[k];
        }
    });

    return original;
}

export function flattenReverseTransformedObject(
    value: any,
    parentKey: string = undefined,
    acc: string = undefined,
): string {
    const flatValue = (() => {
        if (isObject(value)) {
            return Object.entries(value)
                .map(([key, value]) => {
                    return flattenReverseTransformedObject(value, key, acc);
                })
                .join(" ");
        } else if (Array.isArray(value)) {
            const v = value
                .map((v) => flattenReverseTransformedObject(v, parentKey))
                .join(", ");

            return parentKey ? `${parentKey}(${v})` : v;
        } else {
            return value.toString();
        }
    })();

    return acc ? `${acc} ${flatValue}` : flatValue;
}

export function normalizeTransformVars(vars: any) {
    const transformed = transformObject(vars);
    const reverseTransformedVars = Object.entries(transformed).reduce(
        (acc, [key, value]) => {
            return reverseTransformObject(key, value, acc);
        },
        {},
    );

    const transformedVars = Object.entries(reverseTransformedVars).reduce(
        (acc, [key, value]) => {
            const flatValue = flattenReverseTransformedObject(value, key);

            const parsed = CSSKeyframes.Values.tryParse(flatValue);

            acc[key] = parsed;

            return acc;
        },
        {},
    );

    return transformedVars;
}

export function transformTargetsStyle(t: number, vars: any, targets: HTMLElement[]) {
    const transformedVars = Object.entries(vars).reduce((acc, [key, value]) => {
        const flatValue = flattenReverseTransformedObject(value, key);
        acc[key] = flatValue;
        return acc;
    }, {});

    // targets.forEach((target) => {
    //     Object.entries(transformedVars).forEach(([key, value]) => {
    //         const currentStyleValue = target.style.getPropertyValue(key);
    //         if (!currentStyleValue) {
    //             return;
    //         }
    //         const currentValues = (CSSKeyframes.Values.parse(currentStyleValue) as any)
    //             ?.value?.values;

    //         if (!currentValues) {
    //             return;
    //         }

    //         const newValues = (CSSKeyframes.Values.parse(value as any) as any)?.value
    //             ?.values;
    //         if (!newValues) {
    //             return;
    //         }

    //         let newAdded = false;

    //         currentValues.forEach((v, i) => {
    //             if (v instanceof FunctionValue) {
    //                 const index = newValues.findIndex((rv) => rv.name === v.name);

    //                 if (index === -1) {
    //                     newValues.unshift(v);
    //                     newAdded = true;
    //                 }
    //             }
    //         });

    //         if (!newAdded) {
    //             return;
    //         }

    //         const flatValue = flattenReverseTransformedObject(
    //             new ValueArray(newValues),
    //             key,
    //         );

    //         transformedVars[key] = flatValue;
    //     });
    // });

    targets.forEach((target) => {
        Object.entries(transformedVars).forEach(([key, value]) => {
            target.style.setProperty(key, value as any);
        });
    });
}
