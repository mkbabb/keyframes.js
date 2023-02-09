import { color, RGBColor } from "d3-color";
import { lerp } from "./math";
import { arrayEquals } from "./utils";
import { CSSKeyframes, parseCSSTime } from "./parsing/keyframes";
import { CSSValueUnit } from "./parsing/units";

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
    unit: string,
    element?: HTMLElement,
    property?: string
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
            getComputedStyle(element.parentElement).getPropertyValue(property)
        );
        value = (value / 100) * parentValue;
    } else {
        value = convertAbsoluteUnitToPixels(value, unit);
    }

    return value;
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

export const getComputedValue = (target: HTMLElement, key: string) => {
    const computed = getComputedStyle(target).getPropertyValue(key);
    const p = CSSValueUnit.value.parse(computed);

    return p.status ? p.value : undefined;
};

const lerpColor = (
    t: number,
    left: ValueUnit<RGBColor>,
    right: ValueUnit<RGBColor>
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
        left.unit === "var" ? getComputedValue(target, String(left.value)) : left;
    const newRight =
        right.unit === "var" ? getComputedValue(target, String(right.value)) : right;

    return newLeft.lerp(t, newRight, target);
};

export class ValueUnit<T = number> {
    constructor(
        public value: T,
        public unit?: string,
        public superType: string[] = []
    ) {}

    toString() {
        if (!this.unit) {
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

    lerp(t: number, other: ValueUnit<T>, target?: HTMLElement) {
        if (this.unit !== other.unit) {
            const [left, right] = collapseNumericType(this, other, target);
            const value = lerp(t, left.value, right.value);
            return new ValueUnit(value, left.unit, left.superType);
        } else if (target && (this.unit === "var" || other.unit === "var")) {
            return lerpVar(t, this, other, target);
        } else if (this.unit === "color") {
            const value = lerpColor(
                t,
                this as ValueUnit<RGBColor>,
                other as ValueUnit<RGBColor>
            );
            return new ValueUnit(value, this.unit, this.superType);
        }
        
        const value = lerp(t, this.value as number, other.value as number);
        return new ValueUnit(value, this.unit, this.superType);
    }
}

function lerpMany<T>(
    t: number,
    left: Array<FunctionValue<T> | ValueUnit<T>>,
    right: Array<FunctionValue<T> | ValueUnit<T>>,
    target?: HTMLElement
) {
    const minLength = Math.min(left.length, right.length);
    const arr = [];
    for (let i = 0; i < minLength; i++) {
        const l = left[i];
        const r = right[i];
        arr.push(l.lerp(t, r, target));
    }
    return arr;
}

export class FunctionValue<T = number> {
    constructor(public name: string, public values: ValueUnit<T>[]) {}

    toString() {
        const s = this.values.map((v) => v.toString()).join(", ");
        return `${this.name}(${s})`;
    }

    lerp(t: number, other: FunctionValue<T>, target?: HTMLElement): FunctionValue {
        const arr = lerpMany(t, this.values, other.values, target);
        return new FunctionValue(this.name, arr);
    }
}

export class ValueArray<T = number> {
    constructor(public values: Array<FunctionValue<T> | ValueUnit<T>>) {}

    toString() {
        return this.values.map((v) => v.toString()).join(" ");
    }

    lerp(t: number, other: ValueArray<T>, target?: HTMLElement) {
        const arr = lerpMany(t, this.values, other.values, target);
        return new ValueArray(arr);
    }
}

export const collapseNumericType = (
    a: ValueUnit,
    b: ValueUnit,
    target?: HTMLElement
) => {
    if (!arrayEquals(a.superType, b.superType)) {
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
            return [a, b];
        }
    })();

    const [unit, superType] = [a.unit, a.superType];

    return [new ValueUnit(newA, unit, superType), new ValueUnit(newB, unit, superType)];
};

export function transformObject(input: any): TransformedVars {
    const output = {} as TransformedVars;

    const recurse = (
        input: any,
        parentKey: string = "",
        currentKey: string = ""
    ): FunctionValue | ValueArray | undefined => {
        const isValue =
            input instanceof ValueUnit ||
            input instanceof FunctionValue ||
            input instanceof ValueArray;

        if (!isValue) {
            if (typeof input === "object") {
                for (const [k, v] of Object.entries(input)) {
                    const currentKey = parentKey ? `${parentKey}.${k}` : k;
                    const transformedValues = recurse(v, currentKey, k);

                    if (transformedValues !== undefined) {
                        output[currentKey] = transformedValues;
                    }
                }
            } else {
                const p = CSSKeyframes.FunctionArgs.map(
                    (v) => new FunctionValue(currentKey, v)
                )
                    .or(CSSKeyframes.Value)
                    .tryParse(String(input));

                return p;
            }
        }

        return input;
    };

    recurse(input);
    return output;
}

export function reverseTransformObject(
    key: string,
    values: ValueArray,
    original: any
): any {
    const keys = key.split(".");
    let obj = original;

    for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        if (values !== undefined && i === keys.length - 1) {
            obj[k] = values.toString();
        } else {
            obj = obj[k] ?? (obj[k] = {});
        }
    }
    return original;
}

export const reverseTransformValue = (value: any) => {
    if (value instanceof FunctionValue) {
        return (
            value.name + "(" + value.values.map(reverseTransformValue).join(", ") + ")"
        );
    } else if (value instanceof ValueUnit) {
        return value.toString();
    } else if (value instanceof ValueArray) {
        return value.values.map(reverseTransformValue).join(", ");
    } else if (typeof value === "object") {
        return Object.entries(value)
            .map(([key, value]: [string, ValueArray | FunctionValue]) => {
                return [key, value.values.map(reverseTransformValue).join(" ")];
            })
            .reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
            }, {});
    }
};
