import { Parser, all, any, regex, string, whitespace } from "@mkbabb/parse-that";
import { FunctionValue, ValueArray, ValueUnit } from "../units";
import { camelCaseToHyphen, hyphenToCamelCase, memoize } from "../utils";
import { CSSValueUnit } from "./units";
import { istring, identifier, number, tryParse } from "./utils";

const lparen = string("(");
const rparen = string(")");
const semi = string(";");
const colon = string(":");
const lcurly = string("{");
const rcurly = string("}");
const comma = string(",");
const dot = string(".");

const ws = whitespace;

const FunctionArgs: Parser<ValueArray> = Parser.lazy(() =>
    Value.sepBy(any(comma, ws))
        .trim(ws)
        .map((v: ValueUnit[]) => new ValueArray(...v)),
);

const handleFunc = (name?: Parser<any>) => {
    return all(
        name ? name : identifier,
        FunctionArgs.wrap(lparen, rparen),
    );
};

const handleVar = () => {
    const varContent = regex(/[^)]+/);
    return string("var")
        .next(varContent.trim(ws).wrap(lparen, rparen))
        .map((value: string) => {
            return new ValueUnit(value, "var");
        });
};

const handleCalc = () => {
    const calcContent: Parser<string[]> = Parser.lazy(() =>
        any(
            regex(/[^()]+/),
            calcContent
                .many(1)
                .wrap(lparen, rparen)
                .map((nested: string[][]) => `(${nested.join(" ")})`),
        ).many(1),
    );

    return string("calc")
        .next(
            any(
                Parser.lazy(() => Value).trim(ws)
                    .wrap(lparen, rparen),
                calcContent
                    .wrap(lparen, rparen)
                    .map((parts: unknown) => (parts as string[]).join(" ")),
            ),
        )
        .map((v: any) => {
            return v instanceof ValueUnit ? v : new ValueUnit(v, "calc");
        });
};

const TRANSFORM_FUNCTIONS = ["translate", "scale", "rotate", "skew"];
const TRANSFORM_DIMENSIONS = ["x", "y", "z"];

const transformDimensions = TRANSFORM_DIMENSIONS.map(istring);
const transformFunctions = TRANSFORM_FUNCTIONS.map(istring);

const handleTransform = () => {
    const nameParser = all(
        any(...transformFunctions),
        any(...transformDimensions, string("")),
    );

    const makeTransformName = (name: string, dim: string) => {
        return name + dim.toUpperCase();
    };

    const p = handleFunc(nameParser);

    return p.map(([[name, dim], values]: any) => {
        const lowerName = (name as string).toLowerCase();

        const transformObject: Record<string, any> = {};

        if (dim) {
            const newName = lowerName + (dim as string).toUpperCase();
            transformObject[newName] = values[0];
        } else if (values.length === 1) {
            TRANSFORM_DIMENSIONS.forEach((d) => {
                const newName = makeTransformName(lowerName, d);
                transformObject[newName] = values[0];
            });
        } else {
            values.forEach((v: any, i: number) => {
                const newName = makeTransformName(lowerName, TRANSFORM_DIMENSIONS[i]);
                transformObject[newName] = v;
            });
        }

        const newValues = Object.entries(transformObject).map(([k, v]) => {
            return new FunctionValue(k, [v as any]);
        });

        return new ValueArray(...newValues);
    });
};

const gradientDirections: Record<string, string> = {
    left: "270",
    right: "90",
    top: "0",
    bottom: "180",
};

const handleGradient = () => {
    const name = any(...["linear-gradient", "radial-gradient"].map(istring));
    const sideOrCorner = all(
        string("to").skip(ws),
        any(...["left", "right", "top", "bottom"].map(istring)),
    ).map(([, direction]: [string, string]) => {
        const dir = gradientDirections[direction.toLowerCase()];
        return new ValueUnit(dir, "deg");
    });

    const direction = any(CSSValueUnit.Angle, sideOrCorner);

    const lengthPercentage = any(CSSValueUnit.Length, CSSValueUnit.Percentage);

    const linearColorStop = all(
        CSSValueUnit.Color,
        lengthPercentage.sepBy(ws),
    ).map(([color, stops]: [any, any]) => {
        if (!stops || stops.length === 0) {
            return [color];
        } else {
            return [color, ...stops];
        }
    });

    const colorStopList = all(
        linearColorStop,
        comma.trim(ws).next(any(linearColorStop, lengthPercentage)).many(),
    ).map(([first, rest]: [any, any[]]) => {
        return [first, ...rest];
    });

    const linearGradient = all(
        name,
        all(direction.skip(comma).opt(), colorStopList)
            .trim(ws)
            .wrap(lparen, rparen)
            .map(([dir, stops]: [any, any]) => {
                if (!dir) {
                    return [stops];
                } else {
                    return [dir, ...stops].flat();
                }
            }),
    ).map(([name, values]: [string, any[]]) => {
        return new FunctionValue(name, values as any[]);
    });

    return linearGradient;
};

const handleCubicBezier = () => {
    return handleFunc(string("cubic-bezier")).map((v: any) => {
        return new FunctionValue("cubic-bezier", v[1]);
    });
};

const CSSString = regex(/[^\(\)\{\}\s,;]+/).map((x: string) => new ValueUnit(x));

const Function_: Parser<any> = any(
    handleTransform(),
    handleVar(),
    handleCalc(),
    handleGradient(),
    handleCubicBezier(),
    handleFunc().map(([name, values]: [string, any]) => {
        return new FunctionValue(name, values);
    }),
);

const JSON_: Parser<any> = all(lcurly, regex(/[^{}]+/), rcurly).map(
    (x: string[]) => {
        const s = x.join("\n");
        const obj = JSON.parse(s);
        return new ValueUnit(obj, "json");
    },
);

const Value: Parser<any> = any(CSSValueUnit.Value, Function_, JSON_, CSSString).trim(ws);

const Values = Value.sepBy(ws);

const Variables = all(
    identifier
        .skip(colon)
        .trim(ws)
        .map((x: string) => hyphenToCamelCase(x)),
    Values.skip(semi).trim(ws),
).map(([name, values]: [string, any[]]) => {
    const va = new ValueArray(...values).flat() as any;
    va.setProperty(name);
    return {
        [name]: va,
    };
});

const TimePercentage = any(
    CSSValueUnit.TimePercentage.trim(ws).map((v: ValueUnit) => {
        return v.toString();
    }),
    number.map((v: number) => {
        return `${v}%`;
    }),
);
const TimePercentages = TimePercentage.sepBy(comma).trim(ws);

const Body = Variables.many()
    .trim(ws)
    .wrap(lcurly, rcurly)
    .map((values: Record<string, any>[]) => Object.assign({}, ...values));

const Rule = string("@keyframes").trim(ws).next(identifier);

const Keyframe = all(TimePercentages, Body).map(([percents, values]: [string[], any]) => {
    return percents.reduce((acc: Map<string, any>, percent: string) => {
        acc.set(percent, values);
        return acc;
    }, new Map<string, any>());
});

const Keyframes = any(
    Rule.next(
        Keyframe.many(1).trim(ws).wrap(lcurly, rcurly).trim(ws),
    ),
    Keyframe.many(1).trim(ws),
).map((keyframes: Map<string, any>[]) => {
    return keyframes.reduce((acc: Map<string, any[]>, keyframe: Map<string, any>) => {
        for (const [percent, values] of keyframe) {
            if (!acc.has(percent)) {
                acc.set(percent, values);
            } else {
                acc.set(percent, { ...acc.get(percent), ...values });
            }
        }
        return acc;
    }, new Map<string, any[]>());
});

// CSSClass language
const ClassRule = dot.trim(ws).next(identifier).trim(ws);

const CSSClassBody = Body.map((values: Record<string, any>) => {
    const options: Record<string, any> = {};

    for (const [key, value] of Object.entries(values)) {
        if (key.includes("animation")) {
            const newKey = key
                .replace(/^animation/i, "")
                .replace(/^\w/, (c: string) => c.toLowerCase());

            const newValue = camelCaseToHyphen(value.toString());
            options[newKey] = newValue;

            delete values[key];
        }
    }

    return {
        options,
        values,
    };
});

const CSSClass = ClassRule.next(CSSClassBody);

// CSSAnimationKeyframes
const AnimationValue: Parser<any> = any(
    CSSClass.map((value: any) => value),
    Keyframes.map((value: Map<string, any>) => ({
        keyframes: value,
    })),
);

const AnimationValues = AnimationValue.sepBy(ws).map((values: any[]) => {
    return Object.assign({}, ...values);
});

// Exported parsers
export const CSSKeyframes = {
    Value,
    Values,
    FunctionArgs,
    Function: Function_,
    JSON: JSON_,
    Body,
    Rule,
    Keyframe,
    Keyframes,
    TimePercentage,
    TimePercentages,
    Variables,
};

export const CSSAnimationKeyframes = {
    Value: AnimationValue,
    Values: AnimationValues,
};

export const parseCSSKeyframesValue = memoize(
    (input: string): ValueUnit | FunctionValue => {
        return tryParse(Value, input);
    },
);

export const parseCSSKeyframes = memoize(
    (input: string): Map<string, any> => tryParse(Keyframes, input),
);

export const parseCSSAnimationKeyframes = memoize((input: string) => {
    const { options, values, keyframes } = tryParse(AnimationValues, input);
    return {
        options,
        values,
        keyframes,
    };
});

export const parseCSSPercent = memoize((input: string | number): number =>
    tryParse(CSSValueUnit.Percentage, String(input)).valueOf(),
);

export const parseCSSTime = memoize((input: string) => {
    return tryParse(
        CSSValueUnit.Time.map((v: ValueUnit) => {
            if (v.unit === "ms") {
                return v.value;
            } else if (v.unit === "s") {
                return v.value * 1000;
            } else {
                return v.value;
            }
        }),
        input,
    ) as number;
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
