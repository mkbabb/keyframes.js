import { RGBColor } from "d3-color";
import { lerp } from "./math";
import { CSSKeyframes, parseCSSTime } from "./parsing/keyframes";
import { isCSSStyleName } from "./parsing/styleNames";
import { CSSValueUnit } from "./parsing/units";
import { arrayEquals, isObject } from "./utils";

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
    const p = CSSValueUnit.Value.parse(computed);

    return p.status ? p.value : undefined;
};

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
        left.unit === "var" ? getComputedValue(target, String(left.value)) : left;
    const newRight =
        right.unit === "var" ? getComputedValue(target, String(right.value)) : right;

    return newLeft.lerp(t, newRight, target);
};

export class ValueUnit<T = number> {
    constructor(
        public value: T,
        public unit?: string,
        public superType: string[] = [],
    ) {}

    valueOf() {
        if (!this.unit) {
            return this.value;
        }
        return this.toString();
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

    lerp(
        t: number,
        other: ValueUnit<T> | FunctionValue<T> | ValueArray<T>,
        target?: HTMLElement,
    ) {
        if (other instanceof FunctionValue || other instanceof ValueArray) {
            return other.lerp(t, this, target);
        }

        if (this.unit === "string" || other.unit === "string") {
            return this;
        }

        if (target && (this.unit === "var" || other.unit === "var")) {
            return lerpVar(
                t,
                this as ValueUnit<number>,
                other as ValueUnit<number>,
                target,
            );
        }

        if (this.unit !== other.unit) {
            const [left, right] = collapseNumericType(
                this as ValueUnit<number>,
                other as ValueUnit<number>,
                target,
            );
            const value = lerp(t, left.value, right.value);
            return new ValueUnit(value, left.unit, left.superType);
        } else if (this.unit === "color") {
            const value = lerpColor(
                t,
                this as ValueUnit<RGBColor>,
                other as ValueUnit<RGBColor>,
            );
            return new ValueUnit(value, this.unit, this.superType);
        }

        const value = lerp(t, this.value as number, other.value as number);
        return new ValueUnit(value, this.unit, this.superType);
    }
}

function lerpMany<T>(
    t: number,
    left: Array<FunctionValue<T> | ValueArray<T> | ValueUnit<T>>,
    right: Array<FunctionValue<T> | ValueArray<T> | ValueUnit<T>>,
    target?: HTMLElement,
) {
    const minLength = Math.min(left.length, right.length);
    const arr = [];

    for (let i = 0; i < minLength; i++) {
        const l = left[i];
        const r = right[i];

        const lerped = l.lerp(t, r, target);
        arr.push(lerped);
    }

    return arr;
}

export class FunctionValue<T = number> {
    values: Array<ValueUnit<T>>;

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

    valueOf() {
        return this.values.length === 1
            ? this.values[0].valueOf()
            : this.values.map((v) => v.valueOf());
    }

    toString() {
        const s = this.values.map((v) => v.toString()).join(", ");
        return `${this.name}(${s})`;
    }

    lerp(
        t: number,
        other: FunctionValue<T> | ValueArray<T> | ValueUnit<T>,
        target?: HTMLElement,
    ): FunctionValue {
        const otherValues = other instanceof ValueUnit ? [other] : other.values;

        const arr = lerpMany(t, this.values, otherValues, target);

        return new FunctionValue(this.name, arr);
    }
}

export class ValueArray<T = number> {
    values: Array<FunctionValue<T> | ValueUnit<T>>;

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

    valueOf() {
        return this.values.length === 1
            ? this.values[0].valueOf()
            : this.values.map((v) => v.valueOf());
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

function mergeValueObjects<T>(
    currentValue: Object | undefined,
    value: ValueArray<T> | FunctionValue<T> | ValueUnit<T>,
) {
    if (currentValue == null) {
        return value;
    }

    const left: ValueArray<T> = new ValueArray(Object.values(currentValue) as any);
    const right = new ValueArray(value);

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
            obj[k] = mergeValueObjects(obj[k], value);
        } else {
            if (obj[k] == null) {
                obj[k] = {};
            }
            obj = obj[k];
        }
    });

    return original;
}

export function transformTargetsStyle(t: number, vars: any, targets: HTMLElement[]) {
    function flatten(
        value: any,
        parentKey: string = undefined,
        acc: string = undefined,
    ): string {
        const flatValue = (() => {
            if (isObject(value)) {
                return Object.entries(value)
                    .map(([key, value]) => {
                        return flatten(value, key, acc);
                    })
                    .join(" ");
            } else if (Array.isArray(value)) {
                const v = value.map((v) => flatten(v, parentKey)).join(", ");
                return `${parentKey}(${v})`;
            } else {
                return value.toString();
            }
        })();

        return acc ? `${acc} ${flatValue}` : flatValue;
    }

    const transformedVars = Object.entries(vars).reduce((acc, [key, value]) => {
        const flatValue = flatten(value, key);
        acc[key] = flatValue;
        return acc;
    }, {});

    targets.forEach((target) => {
        Object.assign(target.style, transformedVars);
    });
}
