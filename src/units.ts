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

const toCamelCase = (str: string) =>
    str.replace(/([-_][a-z])/gi, (group) =>
        group.toUpperCase().replace("-", "").replace("_", "")
    );

const istring = (str: string) =>
    P((input, i) => {
        const s = input.slice(i);
        if (s.toLowerCase().startsWith(str.toLowerCase())) {
            return P.makeSuccess(i + str.length, str);
        } else {
            return P.makeFailure(i, `Expected ${str}`);
        }
    });

const CSSValueUnit = P.createLanguage({
    number: () => P.regexp(/-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/).map(Number),
    unit: () => P.regexp(/[a-zA-Z%]+/),

    numberValue: (r) =>
        r.number.map((value) => {
            return new Value(value);
        }),

    unitValue: (r) =>
        P.seq(r.number, r.unit).map(([value, unit]) => {
            return new Value(value, unit);
        }),

    colorValue: () =>
        P((input, i) => {
            const s = input.slice(i);
            const c = color(s)?.rgb();

            if (c) {
                return P.makeSuccess(i + input.length, new Value(c, "color"));
            } else {
                return P.makeFailure(i, "Invalid color");
            }
        }),

    value: (r) => P.alt(r.unitValue, r.numberValue, r.colorValue),
});

const TRANSFORM_FUNCTIONS = ["translate", "scale", "rotate", "skew"];
const DIMS = ["x", "y", "z"];

const CSSKeyFrame = P.createLanguage({
    identifier: () => P.regexp(/[a-zA-Z][a-zA-Z0-9-]+/).map((x) => toCamelCase(x)),
    ws: () => P.optWhitespace,

    rule: (r) => r.ws.then(P.string("@keyframes")).skip(r.ws).then(r.identifier),

    semi: () => P.string(";"),
    colon: () => P.string(":"),
    lcurly: () => P.string("{"),
    rcurly: () => P.string("}"),
    lparen: () => P.string("("),
    rparen: () => P.string(")"),

    percent: (r) =>
        r.ws
            .then(
                P.alt(
                    P.regexp(/\d+/).skip(P.string("%")),
                    P.string("from"),
                    P.string("to")
                )
            )
            .skip(r.ws),

    valueUnit: () => CSSValueUnit.value,

    functionValuePart: (r) => r.valuePart.sepBy(r.ws.then(P.string(",")).skip(r.ws)),

    transforms: (r) =>
        P.seq(
            P.alt(...TRANSFORM_FUNCTIONS.map(istring)),
            P.alt(...DIMS.map(istring), P.string("")),
            r.lparen
                .skip(r.ws)
                .then(r.valueUnit.sepBy(r.ws.then(P.string(",")).skip(r.ws)))
                .skip(r.ws)
                .skip(r.rparen)
        ).map(([name, dim, values]) => {
            name = name.toLowerCase();

            if (dim) {
                return {
                    [name + dim.toUpperCase()]: values[0],
                };
            } else {
                const [x, y, z] = values;
                const out = {
                    [name + "X"]: x,
                };
                if (y) {
                    out[name + "Y"] = y;
                }
                if (z) {
                    out[name + "Z"] = z;
                }
                return out;
            }
        }),

    functionValue: (r) =>
        P.alt(
            r.transforms,
            P.seq(
                r.identifier,
                r.ws
                    .skip(r.lparen)
                    .skip(r.ws)
                    .then(r.functionValuePart)
                    .skip(r.ws)
                    .skip(r.rparen)
                    .skip(r.ws)
            ).map(([name, value]) => {
                return {
                    [name]: value,
                };
            })
        ),

    valuePart: (r) => P.alt(r.functionValue, r.valueUnit).skip(r.ws),

    value: (r) => r.valuePart.sepBy(r.ws),

    values: (r) =>
        P.seq(
            r.identifier.skip(r.ws).skip(r.colon).skip(r.ws),
            r.value.skip(r.ws).skip(r.semi).skip(r.ws)
        ).map(([name, value]) => {
            return {
                [name]: value,
            };
        }),

    frame: (r) =>
        P.seq(
            r.percent.skip(r.ws).skip(r.lcurly).skip(r.ws),
            r.values.atLeast(1).skip(r.ws).skip(r.rcurly)
        ).map(([percent, values]) => {
            return {
                [percent]: Object.assign({}, ...values),
            };
        }),
    keyframe: (r) =>
        r.rule
            .skip(r.ws)
            .skip(r.lcurly)
            .skip(r.ws)
            .then(r.frame.many())
            .skip(r.ws)
            .skip(r.rcurly)
            .skip(r.ws)
            .map((frame) => {
                return Object.assign({}, ...frame);
            }),
});

export const parseCSSKeyframes = (input: string): Record<string, any> =>
    CSSKeyFrame.keyframe.tryParse(input);
