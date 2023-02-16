import P from "parsimmon";
import { CSSValueUnit, integer, number, identifier, none, opt } from "./units";
import { hyphenToCamelCase, arrayEquals } from "../utils";
import {
    collapseNumericType,
    ValueUnit,
    FunctionValue,
    ValueArray,
    convertToDegrees,
} from "../units";
import { clamp } from "../math";

const istring = (str: string) =>
    P((input, i) => {
        const s = input.slice(i);
        if (s.toLowerCase().startsWith(str.toLowerCase())) {
            return P.makeSuccess(i + str.length, str);
        } else {
            return P.makeFailure(i, `Expected ${str}`);
        }
    });

const unaryMathFunctions = {
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    asin: Math.asin,
    acos: Math.acos,
    atan: Math.atan,
    var: (x: string) => x,
} as const;

const binaryMathFunctions = {
    pow: Math.pow,
    atan2: Math.atan2,
    min: Math.min,
    max: Math.max,
    clamp: clamp,
} as const;

const mathFunctions = {
    ...unaryMathFunctions,
    ...binaryMathFunctions,
};

const evaluateMathFunction = (
    funcName: keyof typeof mathFunctions,
    values: ValueUnit[]
) => {
    const collapsed = values.reduce((acc, v) => {
        return collapseNumericType(acc, v);
    }, values[0])[0];

    const flatValues = values
        .map((v) => v.value)
        .map((v) => {
            if (collapsed.superType && collapsed.superType[0] === "angle") {
                return convertToDegrees(v, collapsed.unit) * (Math.PI / 180);
            } else {
                return v;
            }
        });
    const func = mathFunctions[funcName];
    const value = func(...flatValues);

    if (value) {
        return new ValueUnit(value, collapsed.unit, collapsed.superType);
    } else {
        return undefined;
    }
};

function evaluateMathOperator(
    operator: string,
    left: ValueUnit,
    right: ValueUnit
): ValueUnit {
    [left, right] = collapseNumericType(left, right);

    if (!left.unit && right.unit) {
        [left, right] = [right, left];
    } else if (right.unit && !arrayEquals(left.superType, right.superType)) {
        return undefined;
    }

    const value = (() => {
        switch (operator) {
            case "+":
                return left.value + right.value;
            case "-":
                return left.value - right.value;
            case "*":
                return left.value * right.value;
            case "/":
                return left.value / right.value;
            case "//":
                return Math.floor(left.value / right.value);
            case "^":
                return Math.pow(left.value, right.value);
            default:
                throw new Error(`Unknown operator ${operator}`);
        }
    })();

    return new ValueUnit(value, left.unit, left.superType);
}

const reduceMathOperators = (left: ValueUnit, rest: any[]) => {
    if (rest.length === 0) {
        return left;
    }
    const value = rest.reduce((acc, [op, right]) => {
        if (typeof acc === "string" || !(right instanceof ValueUnit)) {
            return `${acc} ${op} ${right}`;
        }

        const v = evaluateMathOperator(op, acc, right);
        if (!v) {
            return `${acc} ${op} ${right}`;
        } else {
            return v;
        }
    }, left);

    return value;
};

const MathValue: P.Language = P.createLanguage({
    ws: () => P.optWhitespace,
    lparen: (r) => P.string("(").trim(r.ws),
    rparen: (r) => P.string(")").trim(r.ws),
    comma: (r) => P.string(",").trim(r.ws),

    termOperators: (r) => P.alt(...["*", "/", "//"].map(P.string)).trim(r.ws),
    factorOperators: (r) => P.alt(...["+", "-"].map(P.string)).trim(r.ws),
    pow: (r) => P.string("^").trim(r.ws),

    Expression: (r) => P.alt(r.Function, r.Term),

    FunctionArgs: (r) =>
        P.sepBy1(r.Expression, r.comma).trim(r.ws).wrap(r.lparen, r.rparen),
    Function: (r) =>
        P.seq(P.alt(...Object.keys(mathFunctions).map(P.string)), r.FunctionArgs).map(
            ([name, args]) => {
                const v = evaluateMathFunction(
                    name as keyof typeof mathFunctions,
                    args
                );

                if (v) {
                    return v;
                } else {
                    return new FunctionValue(name, args);
                }
            }
        ),

    Term: (r) =>
        P.seqMap(
            r.Factor,
            P.seq(r.termOperators, r.Factor).many(),
            reduceMathOperators
        ),
    Factor: (r) =>
        P.seqMap(r.Atom, P.seq(r.factorOperators, r.Term).many(), reduceMathOperators),

    CSSVariable: (r) =>
        P.string("--")
            .then(identifier)
            .map((v) => {
                return new ValueUnit("--" + v, "var");
            }),

    Atom: (r) => P.alt(CSSValueUnit.Value, r.CSSVariable, r.Expression).trim(r.ws),
});

const handleCalc = (r: P.Language) => {
    return P.string("calc")
        .then(MathValue.Expression.trim(r.ws).wrap(r.lparen, r.rparen))
        .map((v) => {
            if (v instanceof ValueUnit) {
                return v;
            } else {
                return new ValueUnit(v, "calc");
            }
        });
};

const TRANSFORM_FUNCTIONS = ["translate", "scale", "rotate", "skew"].map(istring);
const DIMS = ["x", "y", "z"].map(istring);

const handleFunc = (r: P.Language, name?: P.Parser<any>) => {
    return P.seq(name ? name : identifier, r.FunctionArgs).map((v) => {
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
        .then(r.String.trim(r.ws).wrap(r.lparen, r.rparen))
        .map((value) => {
            return new ValueUnit(value, "var");
        });
};

const handleGradient = (r: P.Language) => {
    const name = P.alt(...["linear-gradient", "radial-gradient"].map(istring));
    const sideOrCorner = P.seq(
        P.string("to").skip(r.ws),
        P.alt(...["left", "right", "top", "bottom"].map(istring))
    )
        .map((v) => v.join(" "))
        .map((v) => new ValueUnit(v, "string"));
    const direction = P.alt(CSSValueUnit.Angle, sideOrCorner);

    const lengthPercentage = P.alt(CSSValueUnit.Length, CSSValueUnit.Percentage);

    const linearColorStop = P.seq(
        CSSValueUnit.Color,
        P.sepBy(lengthPercentage, r.ws)
    ).map(([color, stops]) => {
        if (!stops) {
            return [color];
        } else {
            return [color, ...stops];
        }
    });

    const colorStopList = P.seq(
        linearColorStop,
        r.comma.trim(r.ws).then(linearColorStop.or(lengthPercentage)).many()
    ).map(([first, rest]) => 
    {
        return [first, ...rest].map(v => new ValueArray(v));
    });

    const linearGradient = P.seq(
        name,
        P.seq(opt(direction.skip(r.comma)), colorStopList)
            .trim(r.ws)
            .wrap(r.lparen, r.rparen)
            .map(([direction, stops]) => {
                if (!direction) {
                    return [stops];
                } else {
                    return [direction, ...stops].flat();
                }
            })
    ).map(([name, values]) => new FunctionValue(name, values));

    return linearGradient;
};

export const CSSKeyframes = P.createLanguage({
    ws: () => P.optWhitespace,

    semi: () => P.string(";"),
    colon: () => P.string(":"),
    lcurly: () => P.string("{"),
    rcurly: () => P.string("}"),
    lparen: () => P.string("("),
    rparen: () => P.string(")"),

    comma: () => P.string(","),

    Rule: (r) => P.string("@keyframes").trim(r.ws).then(identifier),

    String: () => P.regexp(/[^\(\)\{\}\s,;]+/).map((x) => new ValueUnit(x)),

    FunctionArgs: (r) => r.Value.sepBy(r.comma).trim(r.ws).wrap(r.lparen, r.rparen),
    Function: (r) =>
        P.alt(
            handleTransform(r),
            handleVar(r),
            handleCalc(r),
            handleGradient(r),
            handleFunc(r).map(([name, values]) => new FunctionValue(name, values))
        ),

    Value: (r) => P.alt(CSSValueUnit.Value, r.Function, r.String).trim(r.ws),
    Values: (r) => r.Value.sepBy(r.ws).map((x) => new ValueArray(x)),

    Variables: (r) =>
        P.seq(
            identifier
                .skip(r.colon)
                .trim(r.ws)
                .map((x) => hyphenToCamelCase(x)),
            r.Values.skip(r.semi).trim(r.ws)
        ).map(([name, value]) => {
            return {
                [name]: value,
            };
        }),

    Percent: (r) =>
        P.alt(
            integer.skip(P.string("%").or(P.string(""))),
            P.string("from").map(() => "0"),
            P.string("to").map(() => "100")
        )
            .trim(r.ws)
            .map(Number),

    Percents: (r) => r.Percent.sepBy(r.comma).trim(r.ws),

    Body: (r) =>
        r.Variables.many()
            .trim(r.ws)
            .wrap(r.lcurly, r.rcurly)
            .map((values) => Object.assign({}, ...values)),

    Keyframe: (r) =>
        P.seq(r.Percents, r.Body).map(([percents, values]) => {
            const keyframe = {};
            for (const percent of percents) {
                keyframe[percent] = values;
            }
            return keyframe;
        }),

    Keyframes: (r) =>
        r.Rule.then(
            r.Keyframe.atLeast(1).trim(r.ws).wrap(r.lcurly, r.rcurly).trim(r.ws)
        ).map((frame) => {
            return Object.assign({}, ...frame);
        }),
});

export const CSSClass = P.createLanguage({
    ws: () => P.optWhitespace,

    semi: () => P.string(";"),
    colon: () => P.string(":"),
    lcurly: () => P.string("{"),
    rcurly: () => P.string("}"),
    lparen: () => P.string("("),
    rparen: () => P.string(")"),

    comma: () => P.string(","),
    dot: () => P.string("."),

    Rule: (r) => r.dot.trim(r.ws).then(identifier).trim(r.ws),
    Class: (r) =>
        r.Rule.then(
            CSSKeyframes.Body.map((values) => {
                const options = {};
                for (let [key, value] of Object.entries(values)) {
                    if (key.includes("animation")) {
                        let newKey = key
                            .replace(/^animation/i, "")
                            .replace(/^\w/, (c) => c.toLowerCase());
                        options[newKey] = value.toString();
                        delete values[key];
                    }
                }

                return {
                    options,
                    values,
                };
            })
        ),
});

export const CSSAnimationKeyframes = P.createLanguage({
    ws: () => P.optWhitespace,
    Value: (r) =>
        P.alt(
            CSSClass.Class,
            CSSKeyframes.Keyframes.map((value) => {
                return {
                    keyframes: value,
                };
            })
        ),
    Values: (r) => r.Value.sepBy(r.ws).map((values) => Object.assign({}, ...values)),
});

export const parseCSSKeyframes = (input: string): Record<string, any> =>
    CSSKeyframes.Keyframes.tryParse(input);

export const parseCSSPercent = (input: string | number): number =>
    CSSKeyframes.Percent.tryParse(String(input));

export function parseCSSTime(input: string): number {
    return CSSValueUnit.Time.map((v: ValueUnit) => {
        if (v.unit === "ms") {
            return v.value;
        } else if (v.unit === "s") {
            return v.value * 1000;
        } else {
            return v.value;
        }
    }).tryParse(input);
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
