import P from "parsimmon";
import { FunctionValue, ValueArray, ValueUnit } from "../units";
import { camelCaseToHyphen, hyphenToCamelCase, memoize } from "../utils";
import { CSSValueUnit } from "./units";
import * as utils from "./utils";

const handleFunc = (r: P.Language, name?: P.Parser<any>) => {
    return P.seq(
        name ? name : utils.identifier,
        r.FunctionArgs.wrap(r.lparen, r.rparen),
    );
};

const handleVar = (r: P.Language) => {
    return P.string("var")
        .then(r.String.trim(r.ws).wrap(r.lparen, r.rparen))
        .map((value) => {
            return new ValueUnit(value, "var");
        });
};

const handleCalc = (r: P.Language) => {
    const calcContent = P.lazy(() =>
        P.alt(
            P.regexp(/[^()]+/),
            calcContent
                .atLeast(1)
                .wrap(r.lparen, r.rparen)
                .map((nested) => `(${nested.join(" ")})`),
        ).atLeast(1),
    );

    return P.string("calc")
        .then(
            P.alt(
                r.Value.trim(r.ws)
                    .wrap(r.lparen, r.rparen)
                    .map((v) => v),
                calcContent.wrap(r.lparen, r.rparen).map((parts) => parts.join(" ")),
            ),
        )
        .map((v) => {
            return v instanceof ValueUnit ? v : new ValueUnit(v, "calc");
        });
};

const TRANSFORM_FUNCTIONS = ["translate", "scale", "rotate", "skew"];
const TRANSFORM_DIMENSIONS = ["x", "y", "z"];

const transformDimensions = TRANSFORM_DIMENSIONS.map(utils.istring);
const transformFunctions = TRANSFORM_FUNCTIONS.map(utils.istring);

const handleTransform = (r: P.Language) => {
    const nameParser = P.seq(
        P.alt(...transformFunctions),
        P.alt(...transformDimensions, P.string("")),
    );

    const makeTransformName = (name: string, dim: string) => {
        return name + dim.toUpperCase();
    };

    const p = handleFunc(r, nameParser);

    return p.map(([[name, dim], values]: [string[], ValueUnit[]]) => {
        name = name.toLowerCase();

        const transformObject = {};

        if (dim) {
            const newName = name + dim.toUpperCase();
            transformObject[newName] = values[0];
        } else if (values.length === 1) {
            TRANSFORM_DIMENSIONS.forEach((d, i) => {
                const newName = makeTransformName(name, d);
                transformObject[newName] = values[0];
            });
        } else {
            values.forEach((v, i) => {
                const newName = makeTransformName(name, TRANSFORM_DIMENSIONS[i]);
                transformObject[newName] = v;
            });
        }

        const newValues = Object.entries(transformObject).map(([k, v]) => {
            return new FunctionValue(k, [v as any]);
        });

        return new ValueArray(...newValues);
    });
};

const gradientDirections = {
    left: "270",
    right: "90",
    top: "0",
    bottom: "180",
};

const handleGradient = (r: P.Language) => {
    const name = P.alt(...["linear-gradient", "radial-gradient"].map(utils.istring));
    const sideOrCorner = P.seq(
        P.string("to").skip(r.ws),
        P.alt(...["left", "right", "top", "bottom"].map(utils.istring)),
    ).map(([to, direction]) => {
        direction = gradientDirections[direction.toLowerCase()];
        return new ValueUnit(direction, "deg");
    });

    const direction = P.alt(CSSValueUnit.Angle, sideOrCorner);

    const lengthPercentage = P.alt(CSSValueUnit.Length, CSSValueUnit.Percentage);

    const linearColorStop = P.seq(
        CSSValueUnit.Color,
        P.sepBy(lengthPercentage, r.ws),
    ).map(([color, stops]: [any, any]) => {
        if (!stops) {
            return [color];
        } else {
            return [color, ...stops];
        }
    });

    const colorStopList = P.seq(
        linearColorStop,
        r.comma.trim(r.ws).then(linearColorStop.or(lengthPercentage)).many(),
    ).map(([first, rest]) => {
        return [first, ...rest];
    });

    const linearGradient = P.seq(
        name,
        P.seq(utils.opt(direction.skip(r.comma)), colorStopList)
            .trim(r.ws)
            .wrap(r.lparen, r.rparen)
            .map(([direction, stops]) => {
                if (!direction) {
                    return [stops];
                } else {
                    return [direction, ...stops].flat();
                }
            }),
    ).map(([name, values]) => {
        return new FunctionValue(name, values);
    });

    return linearGradient;
};

const handleCubicBezier = (r: P.Language) => {
    return handleFunc(r, P.string("cubic-bezier")).map((v) => {
        return new FunctionValue("cubic-bezier", v[1]);
    });
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

    Rule: (r) => P.string("@keyframes").trim(r.ws).then(utils.identifier),

    String: () => P.regexp(/[^\(\)\{\}\s,;]+/).map((x) => new ValueUnit(x)),

    FunctionArgs: (r) =>
        r.Value.sepBy(r.comma.or(r.ws))
            .trim(r.ws)
            .map((v) => new ValueArray(...v)),

    Function: (r) =>
        P.alt(
            handleTransform(r),
            handleVar(r),
            handleCalc(r),
            handleGradient(r),
            handleCubicBezier(r),
            handleFunc(r).map(([name, values]) => {
                return new FunctionValue(name, values);
            }),
        ),

    JSON: (r) =>
        P.seq(r.lcurly, P.regexp(/[^{}]+/), r.rcurly).map((x) => {
            const s = x.join("\n");
            let obj = eval("(" + s + ")");
            return new ValueUnit(obj, "json");
        }),

    Value: (r) => P.alt(CSSValueUnit.Value, r.Function, r.JSON, r.String).trim(r.ws),

    Values: (r) => r.Value.sepBy(r.ws),

    Variables: (r) =>
        P.seq(
            utils.identifier
                .skip(r.colon)
                .trim(r.ws)
                .map((x) => hyphenToCamelCase(x)),
            r.Values.skip(r.semi).trim(r.ws),
        ).map(([name, values]) => {
            values = new ValueArray(...values).flat();

            values.setProperty(name);

            return {
                [name]: values,
            };
        }),

    TimePercentage: (r) =>
        P.alt(
            CSSValueUnit.TimePercentage.trim(r.ws).map((v) => {
                return v.toString();
            }),
            utils.number.map((v) => {
                return `${v}%`;
            }),
        ),
    TimePercentages: (r) => r.TimePercentage.sepBy(r.comma).trim(r.ws),

    Body: (r) =>
        r.Variables.many()
            .trim(r.ws)
            .wrap(r.lcurly, r.rcurly)
            .map((values) => Object.assign({}, ...values)),

    Keyframe: (r) =>
        P.seq(r.TimePercentages, r.Body).map(([percents, values]) => {
            return percents.reduce((acc, percent) => {
                acc.set(percent, values);
                return acc;
            }, new Map<string, any>());
        }),
    Keyframes: (r) =>
        P.alt(
            r.Rule.then(
                r.Keyframe.atLeast(1).trim(r.ws).wrap(r.lcurly, r.rcurly).trim(r.ws),
            ),
            r.Keyframe.atLeast(1).trim(r.ws),
        ).map((keyframes) => {
            return keyframes.reduce((acc, keyframe) => {
                for (let [percent, values] of keyframe) {
                    if (!acc.has(percent)) {
                        acc.set(percent, values);
                    } else {
                        acc.set(percent, { ...acc.get(percent), ...values });
                    }
                }
                return acc;
            }, new Map<string, any[]>());
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

    Rule: (r) => r.dot.trim(r.ws).then(utils.identifier).trim(r.ws),
    Class: (r) =>
        r.Rule.then(
            CSSKeyframes.Body.map((values) => {
                const options = {};

                for (let [key, value] of Object.entries(values)) {
                    if (key.includes("animation")) {
                        const newKey = key
                            .replace(/^animation/i, "")
                            .replace(/^\w/, (c) => c.toLowerCase());

                        const newValue = camelCaseToHyphen(value.toString());
                        options[newKey] = newValue;

                        delete values[key];
                    }
                }

                return {
                    options,
                    values,
                };
            }),
        ),
});

export const CSSAnimationKeyframes = P.createLanguage({
    ws: () => P.optWhitespace,
    Value: (r) =>
        P.alt(
            CSSClass.Class.or(P.whitespace).map((value) => {
                return value;
            }),
            CSSKeyframes.Keyframes.map((value) => {
                return {
                    keyframes: value,
                };
            }),
        ),
    Values: (r) =>
        r.Value.sepBy(r.ws).map((values) => {
            {
                return Object.assign({}, ...values);
            }
        }),
});

export const parseCSSKeyframesValue = memoize(
    (input: string): ValueUnit | FunctionValue => {
        return CSSKeyframes.Value.tryParse(input);
    },
);

export const parseCSSKeyframes = memoize(
    (input: string): Map<string, any> => CSSKeyframes.Keyframes.tryParse(input),
);

export const parseCSSAnimationKeyframes = memoize((input: string) => {
    const { options, values, keyframes } = CSSAnimationKeyframes.Values.tryParse(input);
    return {
        options,
        values,
        keyframes,
    };
});

export const parseCSSPercent = memoize((input: string | number): number =>
    CSSValueUnit.Percentage.tryParse(String(input)).valueOf(),
);

export const parseCSSTime = memoize((input: string) => {
    return CSSValueUnit.Time.map((v: ValueUnit) => {
        if (v.unit === "ms") {
            return v.value;
        } else if (v.unit === "s") {
            return v.value * 1000;
        } else {
            return v.value;
        }
    }).tryParse(input) as number;
});

export const reverseCSSTime = memoize((time: number): string => {
    if (time >= 5000) {
        return `${time / 1000}s`;
    } else {
        return `${time}ms`;
    }
});

export const reverseCSSIterationCount = memoize((count: number): string => {
    if (count === Infinity) {
        return "infinite";
    } else {
        return String(count);
    }
});
