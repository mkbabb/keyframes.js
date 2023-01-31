import { color, RGBColor } from "d3-color";
import * as P from "parsimmon";
import { lerp } from "./math";

export class Value<T = number> {
    constructor(public value: T, public unit?: string) {}

    toString() {
        if (this.unit === "color") {
            const c = this.value as RGBColor;
            return `rgb(${c.r}, ${c.g}, ${c.b})`;
        } else if (this.unit) {
            return `${this.value}${this.unit}`;
        } else {
            return `${this.value}`;
        }
    }

    lerp(t: number, other: Value<T>): Value<T> {
        let value;

        if (this.unit === "color") {
            value = {
                r: lerp(t, this.value.r, other.value.r),
                g: lerp(t, this.value.g, other.value.g),
                b: lerp(t, this.value.b, other.value.b),
            } as RGBColor;
        } else {
            value = lerp(t, this.value, other.value) as T;
        }

        return new Value(value, this.unit);
    }
}

export function lerpValues(t: number, start: Value[], stop: Value[]): Value[] {
    return start.map((v, i) => v.lerp(t, stop[i]));
}

export function parseCSSUnitValue(): P.Parser<Value[]> {
    const number = P.regexp(/-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/).map(Number);
    const unit = P.regexp(/[a-zA-Z%]+/);

    const numberValue = number.map((value) => {
        console.log(value);
        return new Value(value);
    });

    const cssUnitValue = P.seq(number, unit).map(([value, unit]) => {
        console.log(value, unit);
        return new Value(value, unit);
    });
    const colorValue = P((input, i) => {
        const s = input.slice(i);
        const c = color(s)?.rgb();
        if (c) {
            return P.makeSuccess(i + input.length, new Value(c, "color"));
        } else {
            return P.makeFailure(i, "Invalid color");
        }
    });

    const value = P.alt(cssUnitValue, numberValue, colorValue);

    return P.seq(value, P.optWhitespace)
        .map(([value, _]) => value)
        .many() as P.Parser<Value[]>;
}

export function convertToPixels(
    value: number,
    unit: string,
    element?: HTMLElement,
    property?: string
): number {
    if (unit === "em") {
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
    } else if (unit === "%") {
        const parentValue = parseFloat(
            getComputedStyle(element.parentElement).getPropertyValue(property)
        );
        value = (value / 100) * parentValue;
    }
    return value;
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

export function transformValue(input: string | number): Value[] {
    if (typeof input === "number") {
        return [new Value(input)];
    }
    const value = parseCSSUnitValue().tryParse(input);
    return value;
}
