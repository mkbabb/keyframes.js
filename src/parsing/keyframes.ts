import P from "parsimmon";
import { CSSValueUnit } from "./units";
import { hyphenToCamelCase, arrayEquals } from "../utils";
import {
    collapseNumericType,
    ValueUnit,
    FunctionValue,
    ValueArray,
    convertToDegrees,
} from "../units";

const istring = (str: string) =>
    P((input, i) => {
        const s = input.slice(i);
        if (s.toLowerCase().startsWith(str.toLowerCase())) {
            return P.makeSuccess(i + str.length, str);
        } else {
            return P.makeFailure(i, `Expected ${str}`);
        }
    });

const TRANSFORM_FUNCTIONS = ["translate", "scale", "rotate", "skew"].map(istring);
const DIMS = ["x", "y", "z"].map(istring);

const handleFunc = (r: P.Language, name?: P.Parser<any>) => {
    return P.seq(name ? name : r.identifier, r.functionArgs).map((v) => {
        console.log(v);
        return v;
    });
};

const handleTransform = (r: P.Language) => {
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
        P.alt(
            P.regexp(/\d+/).skip(P.string("%").or(P.string(""))),
            P.string("from").map(() => "0"),
            P.string("to").map(() => "100")
        )
            .trim(r.ws)
            .map(Number),

    string: () => P.regexp(/[^\(\)\{\}\s,\+\-\*\/;]+/).map((x) => new ValueUnit(x)),

    functionArgs: (r) =>
        r.lparen.skip(r.ws).then(r.valuePart.sepBy(r.comma)).skip(r.ws).skip(r.rparen),

    function: (r) =>
        P.alt(
            handleTransform(r),
            handleVar(r),
            handleCalc(r),
            handleFunc(r).map(([name, values]) => new FunctionValue(name, values))
        ),

    valuePart: (r) => P.alt(CSSValueUnit.value, r.function, r.string).trim(r.ws),

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
