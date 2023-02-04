import { color, RGBColor } from "d3-color";
import P from "parsimmon";
import { lerp } from "./math";
import { hyphenToCamelCase } from "./utils";

const getComputedValue = (target: HTMLElement, key: string) => {
    const computed = getComputedStyle(target).getPropertyValue("--" + key);

    const p = CSSKeyframes.valueUnit.parse(computed);
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

    lerp(t: number, other: ValueUnit<T>, target?: HTMLElement) {
        if (other == null) {
            return this;
        }

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
    disabled: boolean = false;

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

const arrayEquals = (a: any[], b: any[]) => {
    if (!a || !b || a.length !== b.length) {
        return false;
    }
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
};

const collapseNumericType = (a: ValueUnit, b: ValueUnit) => {
    if (!arrayEquals(a.superType, b.superType)) {
        return [a, b];
    } else if (a.superType[0] === "length" && a.superType[1] === "absolute") {
        const [aPx, bPx] = [
            convertToPixels(a.value, a.unit),
            convertToPixels(b.value, b.unit),
        ];
        return [
            new ValueUnit(aPx, "px", ["length", "absolute"]),
            new ValueUnit(bPx, "px", ["length", "absolute"]),
        ];
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

const istring = (str: string) =>
    P((input, i) => {
        const s = input.slice(i);
        if (s.toLowerCase().startsWith(str.toLowerCase())) {
            return P.makeSuccess(i + str.length, str);
        } else {
            return P.makeFailure(i, `Expected ${str}`);
        }
    });

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

const TRANSFORM_FUNCTIONS = ["translate", "scale", "rotate", "skew"].map(istring);
const DIMS = ["x", "y", "z"].map(istring);

const handleFunc = (r: P.Language, name?: P.Parser<any>) => {
    return P.seq(
        name ? name : r.identifier,
        r.lparen.skip(r.ws).then(r.functionValuePart).skip(r.ws).skip(r.rparen)
    ).map((v) => {
        console.log(v);
        return v;
    });
};

const handleTransforms = (r: P.Language) => {
    const name = P.seq(P.alt(...TRANSFORM_FUNCTIONS), P.alt(...DIMS, P.string("")));
    const p = handleFunc(r, name);

    return p.map(([[name, dim], values]: [string[], ValueUnit[]]) => {
        name = name.toLowerCase();
        if (dim) {
            return new FunctionValue(name + dim.toUpperCase(), [values[0]]);
        } else if (values.length === 1) {
            return new FunctionValue(name, [values[0]]);
        } else {
            return new FunctionValue(name, values);
        }
    });
};

const handleVar = (r: P.Language) => {
    return P.string("var")
        .then(r.lparen)
        .skip(r.ws)
        .then(P.string("--"))
        .then(r.identifier)
        .skip(r.ws)
        .skip(r.rparen)
        .map((value: ValueArray) => {
            return new ValueUnit(value, "var");
        });
};

const OPERATORS = ["+", "-", "*", "/"];

const mathFunctions = [
    "min",
    "max",
    "clamp",
    "sin",
    "cos",
    "tan",
    "asin",
    "acos",
    "atan",
    "atan2",
] as const;

const MATH_FUNCTIONS = [...mathFunctions].map(P.string);

const evaluateMathFunction = (func: string, value: ValueUnit) => {
    value.value = (() => {
        if (value.superType && value.superType[0] === "angle") {
            return Math[func](
                convertToDegrees(value.value, value.unit) * (Math.PI / 180)
            );
        } else {
            return Math[func](value.value);
        }
    })();
    return new ValueArray([value]);
};

const binaryMathExpression = (r: P.Language) =>
    P.seq(
        r.mathFunctionExpression,
        P.seq(r.ws.then(r.operator).skip(r.ws), r.mathValue).many()
    ).map(([a, bs]) => {
        if (bs.length === 0) {
            return a;
        }
        let v = a.values[0];

        for (let [operator, b] of bs) {
            b = b.values[0];
            [v, b] = collapseNumericType(v, b);

            if (!v.unit && b.unit) {
                [v, b] = [b, v];
            } else if (b.unit && !arrayEquals(v.superType, b.superType)) {
                throw new Error(`Units of ${v.unit} !== ${b.unit}`);
            }

            switch (operator) {
                case "+":
                    v = new ValueUnit(v.value + b.value, v.unit, v.superType);
                    break;
                case "-":
                    v = new ValueUnit(v.value - b.value, v.unit, v.superType);
                    break;
                case "*":
                    v = new ValueUnit(v.value * b.value, v.unit, v.superType);
                    break;
                case "/":
                    v = new ValueUnit(v.value / b.value, v.unit, v.superType);
                    break;
                case "min":
                    v = new ValueUnit(Math.min(v.value, b.value), v.unit, v.superType);
                    break;
                case "max":
                    v = new ValueUnit(Math.max(v.value, b.value), v.unit, v.superType);
                    break;
            }
        }
        return new ValueArray([v]);
    });

const handleCalc = (r: P.Language) => {
    return P.string("calc")
        .then(r.lparen)
        .skip(r.ws)
        .then(r.mathValue)
        .skip(r.ws)
        .skip(r.rparen)
        .map((value: ValueArray) => {
            if (value.values.length === 1) {
                return value.values[0];
            } else {
                return new ValueUnit(value.values.join(" "), "calc");
            }
        });
};

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

    comma: (r) => P.string(","),

    operator: () => P.alt(...OPERATORS.map(P.string)).trim(P.optWhitespace),

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

    any: () => P.regexp(/[^\(\)\{\}\s,\+\-\*\/;]+/).map((x) => new ValueUnit(x)),

    valueUnit: (r) =>
        r.ws.then(P.alt(CSSValueUnit.value, r.any)).trim(r.ws) as P.Parser<ValueUnit>,

    functionValuePart: (r) => r.valuePart.sepBy(r.comma),

    func: (r) =>
        P.alt(
            handleTransforms(r),
            handleVar(r),
            handleCalc(r),
            handleFunc(r).map(([name, values]) => new FunctionValue(name, values))
        ),

    valuePart: (r) => P.alt(r.func, r.valueUnit).skip(r.ws),

    value: (r) => r.valuePart.sepBy(r.ws).map((x) => new ValueArray(x)),

    mathFunction: (r) =>
        P.seq(
            P.alt(...MATH_FUNCTIONS).skip(r.ws),
            r.lparen.skip(r.ws).then(r.mathValue).skip(r.ws).skip(r.rparen)
        ).map(([func, values]) => {
            const v = evaluateMathFunction(func, values.values[0]);
            return v;
        }),

    mathFunctionExpression: (r) => r.mathFunction.or(r.value),

    mathValue: (r) => binaryMathExpression(r).or(r.mathFunctionExpression),

    values: (r) =>
        P.seq(
            r.identifier
                .skip(r.ws)
                .skip(r.colon)
                .skip(r.ws)
                .map((x) => hyphenToCamelCase(x)),
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

export function parseCSSTime(input: string): number {
    return CSSValueUnit.timeValue
        .map((v: ValueUnit) => {
            if (v.unit === "ms") {
                return v.value;
            } else if (v.unit === "s") {
                return v.value * 1000;
            } else {
                return v.value;
            }
        })
        .tryParse(input);
}

export const reverseCSSTime = (time: number): string => {
    if (time >= 5000) {
        return `${time / 1000}s`;
    } else {
        return `${time}ms`;
    }
};

export const reverseCSSIterationCount = (count: number): string => {
    if (count === Infinity) {
        return "infinite";
    } else {
        return String(count);
    }
};
