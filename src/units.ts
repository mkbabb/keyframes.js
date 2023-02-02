import { color, RGBColor } from "d3-color";
import P from "parsimmon";
import { lerp } from "./math";

const getComputedValue = (target: HTMLElement, key: string) => {
    const computed = getComputedStyle(target).getPropertyValue("--" + key);

    const p = CSSKeyframes.valueUnit.parse(computed);
    return p.status ? p.value : undefined;
};

export class ValueUnit<T = number> {
    constructor(public value: T, public unit?: string) {
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
        } else if (this.unit && this.unit !== "var") {
            return `${this.value}${this.unit}`;
        } else {
            return `${this.value}`;
        }
    }

    lerp(t: number, other: ValueUnit<T>, target?: HTMLElement) {
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
            const left = convertToPixels(this.value, this.unit, target);
            const right = convertToPixels(other.value, other.unit, target);

            const value = lerp(t, left, right);
            return new ValueUnit(value, "px");
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

    lerp(t: number, other: ValueArray, target?: HTMLElement): ValueArray {
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

export function parseCSSUnitValue(): P.Parser<ValueUnit[]> {
    const number = P.regexp(/-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/).map(Number);
    const unit = P.regexp(/[a-zA-Z%]+/);

    const numberValue = number.map((value) => {
        return new ValueUnit(value);
    });

    const cssUnitValue = P.seq(number, unit).map(([value, unit]) => {
        return new ValueUnit(value, unit);
    });

    const colorValue = P((input, i) => {
        const s = input.slice(i);
        const c = color(s)?.rgb();
        if (c) {
            return P.makeSuccess(i + input.length, new ValueUnit(c, "color"));
        } else {
            return P.makeFailure(i, "Invalid color");
        }
    });

    const value = P.alt(colorValue, cssUnitValue, numberValue);

    return P.seq(value, P.optWhitespace)
        .map(([value, _]) => value)
        .many() as P.Parser<ValueUnit[]>;
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

export const toCamelCase = (str: string) =>
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

const enclosed = (
    r: P.Language,
    args: P.Parser<any>,
    left?: P.Parser<any>,
    right?: P.Parser<any>
) => {
    left = left ?? r.lparen;
    right = right ?? r.rparen;

    return r.ws.skip(left).skip(r.ws).then(args).skip(r.ws).skip(right).skip(r.ws);
};

export const CSSValueUnit = P.createLanguage({
    number: () => P.regexp(/-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/).map(Number),
    unit: () => P.regexp(/[a-zA-Z%]+/),

    numberValue: (r) =>
        r.number.map((value) => {
            return new ValueUnit(value);
        }),

    unitValue: (r) =>
        P.seq(r.number, r.unit).map(([value, unit]) => {
            return new ValueUnit(value, unit);
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
        }),

    value: (r) =>
        P.alt(r.colorValue, r.unitValue, r.numberValue) as P.Parser<ValueUnit>,
});

const TRANSFORM_FUNCTIONS = ["translate", "scale", "rotate", "skew"].map(istring);
const DIMS = ["x", "y", "z"].map(istring);

export const CSSKeyframes = P.createLanguage({
    identifier: () => P.regexp(/[a-zA-Z][a-zA-Z0-9-]+/),
    ws: () => P.optWhitespace,

    rule: (r) => r.ws.then(P.string("@keyframes")).skip(r.ws).then(r.identifier),

    semi: () => P.string(";"),
    colon: () => P.string(":"),
    lcurly: () => P.string("{"),
    rcurly: () => P.string("}"),
    lparen: () => P.string("("),
    rparen: () => P.string(")"),

    commaWhitespace: (r) => r.ws.then(P.string(",")).skip(r.ws),

    percent: (r) =>
        r.ws
            .then(
                P.alt(
                    P.regexp(/\d+/).skip(P.string("%").or(P.string(""))),
                    P.string("from").map(() => "0"),
                    P.string("to").map(() => "100")
                )
            )
            .skip(r.ws)
            .map(Number),

    unitValue: () => P.regexp(/[^(){},;\s]+/).map((x) => new ValueUnit(x)),

    valueUnit: (r) =>
        r.ws
            .then(P.alt(CSSValueUnit.value, r.unitValue))
            .skip(r.ws) as P.Parser<ValueUnit>,

    transforms: (r) =>
        P.seq(
            P.alt(...TRANSFORM_FUNCTIONS),
            P.alt(...DIMS, P.string("")),
            enclosed(r, r.functionValuePart)
        ).map(([name, dim, values]: [string, string, ValueUnit[]]) => {
            name = name.toLowerCase();
            if (dim) {
                return new FunctionValue(name + dim.toUpperCase(), [values[0]]);
            } else if (values.length === 1) {
                return new FunctionValue(name, [values[0]]);
            } else {
                return new FunctionValue(name, values);
            }
        }),

    variable: (r) =>
        P.string("var")
            .then(enclosed(r, P.string("--").then(r.identifier)))
            .map((name) => {
                return new ValueUnit(name, "var");
            }),
    calc: (r) =>
        P.string("calc")
            .then(enclosed(r, r.valuePart.many()))
            .map((value) => {
                return new ValueUnit(value, "calc");
            }),

    functionValuePart: (r) => r.valuePart.sepBy(r.commaWhitespace),

    functionValue: (r) =>
        P.alt(
            r.transforms,
            r.variable,
            r.calc,
            P.seq(r.identifier, enclosed(r, r.functionValuePart)).map(
                ([name, value]) => {
                    return new FunctionValue(name, value);
                }
            )
        ),

    valuePart: (r) => P.alt(r.functionValue, r.valueUnit).skip(r.ws),

    value: (r) => r.valuePart.sepBy(r.ws).map((x) => new ValueArray(x)),

    values: (r) =>
        P.seq(
            r.identifier
                .skip(r.ws)
                .skip(r.colon)
                .skip(r.ws)
                .map((x) => toCamelCase(x)),
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
    CSSKeyframes.keyframe.tryParse(input);

export const parseCSSPercent = (input: string | number): number =>
    CSSKeyframes.percent.tryParse(String(input));
