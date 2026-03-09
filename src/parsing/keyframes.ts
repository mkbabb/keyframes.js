import {
    Parser,
    all,
    any,
    regex,
    string,
    whitespace,
} from "@mkbabb/parse-that";
import { FunctionValue, ValueArray, ValueUnit } from "../units";
import { camelCaseToHyphen, hyphenToCamelCase, memoize } from "../utils";
import { CSSValueUnit } from "./units";
import { identifier, number, tryParse } from "./utils";

// Import shared parsers from value.js instead of duplicating them
import { CSSFunction } from "@mkbabb/value.js";

const stripCSSComments = (input: string): string =>
    input.replace(/\/\*[\s\S]*?\*\//g, "");

const stripImportant = (input: string): string =>
    input.replace(/\s*!important/gi, "");

const sanitizeCSSInput = (input: string): string =>
    stripImportant(stripCSSComments(input));

const lparen = string("(");
const rparen = string(")");
const semi = string(";");
const colon = string(":");
const lcurly = string("{");
const rcurly = string("}");
const comma = string(",");
const dot = string(".");

const ws = whitespace;

const flattenParsedValues = (
    values: unknown[],
): Array<ValueUnit | FunctionValue> => {
    const out: Array<ValueUnit | FunctionValue> = [];
    for (const value of values.flat(Infinity)) {
        if (value instanceof ValueUnit || value instanceof FunctionValue) {
            out.push(value);
            continue;
        }
        throw new TypeError(
            `Expected parsed CSS value node, got ${typeof value}.`,
        );
    }
    return out;
};

// Use value.js shared parsers for transforms, gradients, var(), calc(), etc.
// These were previously duplicated here — now they come from CSSFunction.Function
const Function_ = CSSFunction.Function;

const JSON_: Parser<any> = all(lcurly, regex(/[^{}]+/), rcurly).map(
    (x: string[]) => {
        const s = x.join("\n");
        const obj = JSON.parse(s);
        return new ValueUnit(obj, "json");
    },
);

const Value: Parser<any> = any(
    CSSValueUnit.Value,
    Function_,
    JSON_,
    regex(/[^\(\)\{\}\s,;]+/).map((x: string) => new ValueUnit(x)),
).trim(ws);

const Values = Value.sepBy(ws);

const Variables = all(
    identifier
        .skip(colon)
        .trim(ws)
        .map((x: string) => hyphenToCamelCase(x)),
    Values.skip(semi.opt()).trim(ws),
).map((result: any) => {
    const [name, values] = result as [string, any[]];
    const va = new ValueArray(...flattenParsedValues(values));
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

const Keyframe = all(TimePercentages, Body).map(
    ([percents, values]: [string[], any]) => {
        return percents.reduce((acc: Map<string, any>, percent: string) => {
            acc.set(percent, values);
            return acc;
        }, new Map<string, any>());
    },
);

const Keyframes = any(
    Rule.next(Keyframe.many(1).trim(ws).wrap(lcurly, rcurly).trim(ws)),
    Keyframe.many(1).trim(ws),
).map((keyframes: Map<string, any>[]) => {
    return keyframes.reduce(
        (acc: Map<string, any[]>, keyframe: Map<string, any>) => {
            for (const [percent, values] of keyframe) {
                if (!acc.has(percent)) {
                    acc.set(percent, values);
                } else {
                    acc.set(percent, { ...acc.get(percent), ...values });
                }
            }
            return acc;
        },
        new Map<string, any[]>(),
    );
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
    FunctionArgs: CSSFunction.FunctionArgs,
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
        return tryParse(Value, sanitizeCSSInput(input));
    },
);

export const parseCSSKeyframes = memoize(
    (input: string): Map<string, any> =>
        tryParse(Keyframes, sanitizeCSSInput(input)),
);

export const parseCSSAnimationKeyframes = memoize((input: string): {
    keyframes: any;
    options?: Record<string, any>;
    values?: any;
} => {
    const result = tryParse(
        AnimationValues,
        sanitizeCSSInput(input),
    ) as { options?: Record<string, any>; values?: any; keyframes: any };
    const out: { keyframes: any; options?: Record<string, any>; values?: any } = {
        keyframes: result.keyframes,
    };
    if (result.options != null) out.options = result.options;
    if (result.values != null) out.values = result.values;
    return out;
});

export const parseCSSPercent = memoize((input: string | number): number =>
    (tryParse(CSSValueUnit.Percentage, String(input)) as ValueUnit).valueOf(),
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
