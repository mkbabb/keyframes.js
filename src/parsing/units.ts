import { color, RGBColor } from "d3-color";
import P from "parsimmon";
import { lerp } from "../math";
import { arrayEquals } from "../utils";
import { CSSKeyframes, parseCSSTime } from "./keyframes";

export interface TransformedVars {
    [arg: string]: ValueArray;
}

export const getComputedValue = (target: HTMLElement, key: string) => {
    const computed = getComputedStyle(target).getPropertyValue("--" + key);
    const p = CSSValueUnit.value.parse(computed);
    return p.status ? p.value : undefined;
};

export class ValueUnit<T = number> {
    constructor(
        public value: T,
        public unit?: string,
        public superType: string[] = []
    ) {
        // TODO! This is a hack to parse colors
        const c = color(value as string);
        if (c) {
            this.unit = "color";
            this.value = c as unknown as T;
        }
    }

    toString() {
        if (this.unit === "color") {
            const c = this.value as RGBColor;
            return `rgb(${c.r}, ${c.g}, ${c.b})`;
        } else if (this.unit) {
            if (this.unit === "var") {
                return `var(--${this.value})`;
            } else if (this.unit === "calc") {
                return `calc(${this.value})`;
            } else {
                return `${this.value}${this.unit}`;
            }
        } else {
            return `${this.value}`;
        }
    }

    lerp(t: number, other: ValueUnit<T>, target?: HTMLElement): ValueUnit<T> {
        if (this.unit === "color") {
            const value = {
                r: lerp(t, this.value.r, other.value.r),
                g: lerp(t, this.value.g, other.value.g),
                b: lerp(t, this.value.b, other.value.b),
            } as RGBColor;
            return new ValueUnit(value, this.unit);
        } else if (target && (this.unit === "var" || other.unit === "var")) {
            const left =
                this.unit === "var"
                    ? getComputedValue(target, this.value as string)
                    : this;
            const right =
                other.unit === "var"
                    ? getComputedValue(target, other.value as string)
                    : other;
            return left.lerp(t, right, target) as ValueUnit;
        } else if (this.unit !== other.unit) {
            const [left, right] = collapseNumericType(this, other, target);
            const value = lerp(t, left.value, right.value);
            return new ValueUnit(value, left.unit);
        } else {
            const value = lerp(t, this.value, other.value);
            return new ValueUnit(value, this.unit);
        }
    }
}

export class FunctionValue {
    constructor(public name: string, public values: ValueUnit[]) {}

    toString() {
        const s = this.values.map((v) => v.toString()).join(", ");
        return `${this.name}(${s})`;
    }

    lerp(t: number, other: FunctionValue, target?: HTMLElement): FunctionValue {
        const minLength = Math.min(this.values.length, other.values.length);
        const arr = [];
        for (let i = 0; i < minLength; i++) {
            const v = this.values[i];
            const o = other.values[i];
            arr.push(v.lerp(t, o, target));
        }
        return new FunctionValue(this.name, arr);
    }
}

export class ValueArray {
    constructor(public values: Array<FunctionValue | ValueUnit>) {}

    toString() {
        return this.values.map((v) => v.toString()).join(" ");
    }

    lerp(t: number, other: ValueArray, target?: HTMLElement) {
        const minLength = Math.min(this.values.length, other.values.length);
        const arr = [];
        for (let i = 0; i < minLength; i++) {
            const v = this.values[i];
            const o = other.values[i];
            arr.push(v.lerp(t, o, target));
        }
        return new ValueArray(arr);
    }
}

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
                const p = CSSKeyframes.value
                    .or(
                        CSSKeyframes.functionValuePart.map(
                            (v) => new FunctionValue(currentKey, v)
                        )
                    )
                    .tryParse(String(input));
                // return p.status ? p.value : undefined;
                return p;
            }
        } else {
            if (input instanceof ValueUnit) {
                return new ValueArray([input]);
            } else {
                return input;
            }
        }
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

export const collapseNumericType = (
    a: ValueUnit,
    b: ValueUnit,
    target?: HTMLElement
) => {
    if (a.superType[0] === "length") {
        const [aPx, bPx] = [
            convertToPixels(a.value, a.unit, target),
            convertToPixels(b.value, b.unit, target),
        ];
        return [
            new ValueUnit(aPx, "px", ["length", "absolute"]),
            new ValueUnit(bPx, "px", ["length", "absolute"]),
        ];
    } else if (!arrayEquals(a.superType, b.superType)) {
        return [a, b];
    } else if (a.superType[0] === "angle") {
        const [aDeg, bDeg] = [
            convertToDegrees(a.value, a.unit),
            convertToDegrees(b.value, b.unit),
        ];
        return [
            new ValueUnit(aDeg, "deg", ["angle"]),
            new ValueUnit(bDeg, "deg", ["angle"]),
        ];
    } else if (a.superType[0] === "time") {
        const [aMs, bMs] = [
            parseCSSTime(a.value + a.unit),
            parseCSSTime(b.value + b.unit),
        ];
        return [new ValueUnit(aMs, "ms", ["time"]), new ValueUnit(bMs, "ms", ["time"])];
    } else if (a.superType[0] === "resolution") {
        const [aDpi, bDpi] = [
            convertToDpi(a.value, a.unit),
            convertToDpi(b.value, b.unit),
        ];
        return [
            new ValueUnit(aDpi, "dpi", ["resolution"]),
            new ValueUnit(bDpi, "dpi", ["resolution"]),
        ];
    } else {
        return [a, b];
    }
};

export const absoluteLengthUnits = ["px", "cm", "mm", "Q", "in", "pc", "pt"] as const;
export const relativeLengthUnits = [
    "em",
    "ex",
    "ch",
    "rem",
    "lh",
    "rlh",
    "vw",
    "vh",
    "vmin",
    "vmax",
    "vb",
    "vi",
    "svw",
    "svh",
    "lvw",
    "lvh",
    "dvw",
    "dvh",
] as const;
export const lengthUnits = [...absoluteLengthUnits, ...relativeLengthUnits] as const;

export const timeUnits = ["s", "ms"] as const;
export const angleUnits = ["deg", "rad", "grad", "turn"] as const;
export const percentageUnits = ["%"] as const;
export const resolutionUnits = ["dpi", "dpcm", "dppx"] as const;

export const units = [
    ...lengthUnits,
    ...timeUnits,
    ...angleUnits,
    ...percentageUnits,
    ...resolutionUnits,
] as const;

export const CSSValueUnit = P.createLanguage({
    identifier: () => P.regexp(/[a-zA-Z][a-zA-Z0-9-]+/),
    integer: () => P.regexp(/-?[1-9]\d*/).map(Number),
    number: () => P.regexp(/-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/).map(Number),

    lengthUnit: () => P.alt(...lengthUnits.map(P.string)),
    angleUnit: () => P.alt(...angleUnits.map(P.string)),
    timeUnit: () => P.alt(...timeUnits.map(P.string)),
    resolutionUnit: () => P.alt(...resolutionUnits.map(P.string)),
    percentageUnit: () => P.alt(...percentageUnits.map(P.string)),

    lengthValue: (r) =>
        P.seq(r.number, r.lengthUnit).map(([value, unit]) => {
            let superType = ["length"];
            if (relativeLengthUnits.includes(unit)) {
                superType.push("relative");
            } else if (absoluteLengthUnits.includes(unit)) {
                superType.push("absolute");
            }
            return new ValueUnit(value, unit, superType);
        }),
    angleValue: (r) =>
        P.seq(r.number, r.angleUnit).map(([value, unit]) => {
            return new ValueUnit(value, unit, ["angle"]);
        }),
    timeValue: (r) =>
        P.seq(r.number, r.timeUnit).map(([value, unit]) => {
            return new ValueUnit(value, unit, ["time"]);
        }),
    resolutionValue: (r) =>
        P.seq(r.number, r.resolutionUnit).map(([value, unit]) => {
            return new ValueUnit(value, unit, ["resolution"]);
        }),
    percentageValue: (r) =>
        P.seq(r.integer, r.percentageUnit).map(([value, unit]) => {
            return new ValueUnit(value, unit, ["percentage"]);
        }),

    colorValue: () =>
        P((input, i) => {
            const s = input.slice(i);
            const c = color(s)?.rgb();
            if (c) {
                return P.makeSuccess(i + input.length, new ValueUnit(c, "color"));
            } else {
                return P.makeFailure(i, "Invalid color");
            }
        }).map((x) => new ValueUnit(x, "color", ["color"])),

    value: (r) =>
        P.alt(
            r.lengthValue,
            r.angleValue,
            r.timeValue,
            r.resolutionValue,
            r.percentageValue,
            r.colorValue,
            r.number.or(r.identifier).map((x) => new ValueUnit(x))
        ).trim(P.optWhitespace) as P.Parser<ValueUnit>,
});

export function parseCSSValueUnit(input: string) {
    return CSSValueUnit.value.tryParse(input);
}
