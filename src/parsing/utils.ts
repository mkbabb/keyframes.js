import P from "parsimmon";

export const istring = (str: string) =>
    P((input, i) => {
        const s = input.slice(i);
        if (s.toLowerCase().startsWith(str.toLowerCase())) {
            return P.makeSuccess(i + str.length, str);
        } else {
            return P.makeFailure(i, `Expected ${str}`);
        }
    });

export const identifier = P.regexp(/-?[a-zA-Z][a-zA-Z0-9-]*/);

export const none = P.string("none");

export const integer = P.regexp(/-?\d+/).map(Number);

export const number = P.regexp(/-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/).map(Number);

export const opt = <T>(p: P.Parser<T>) => P.alt(p, P.succeed(undefined));

// const unaryMathFunctions = {
//     sin: Math.sin,
//     cos: Math.cos,
//     tan: Math.tan,
//     asin: Math.asin,
//     acos: Math.acos,
//     atan: Math.atan,
//     var: (x: string) => x,
// } as const;

// const binaryMathFunctions = {
//     pow: Math.pow,
//     atan2: Math.atan2,
//     min: Math.min,
//     max: Math.max,
//     clamp: clamp,
// } as const;

// const mathFunctions = {
//     ...unaryMathFunctions,
//     ...binaryMathFunctions,
// };

// const evaluateMathFunction = (
//     funcName: keyof typeof mathFunctions,
//     values: ValueUnit[],
// ) => {
//     // @ts-ignore
//     const collapsed: ValueUnit = values.reduce((acc, v) => {
//         return collapseNumericType(acc, v);
//     }, values[0])[0];

//     const flatValues = values
//         .map((v) => v.value)
//         .map((v) => {
//             if (collapsed.superType && collapsed.superType[0] === "angle") {
//                 return convertToDegrees(v, collapsed.unit) * (Math.PI / 180);
//             } else {
//                 return v;
//             }
//         });
//     const func = mathFunctions[funcName];

//     // @ts-ignore
//     const value = func(...flatValues);

//     if (value) {
//         return new ValueUnit(value, collapsed.unit, collapsed.superType);
//     } else {
//         return undefined;
//     }
// };

// function evaluateMathOperator(
//     operator: string,
//     left: ValueUnit,
//     right: ValueUnit,
// ): ValueUnit {
//     [left, right] = collapseNumericType(left, right);

//     if (!left.unit && right.unit) {
//         [left, right] = [right, left];
//     } else if (right.unit && !arrayEquals(left.superType, right.superType)) {
//         return undefined;
//     }

//     const value = (() => {
//         switch (operator) {
//             case "+":
//                 return left.value + right.value;
//             case "-":
//                 return left.value - right.value;
//             case "*":
//                 return left.value * right.value;
//             case "/":
//                 return left.value / right.value;
//             case "//":
//                 return Math.floor(left.value / right.value);
//             case "^":
//                 return Math.pow(left.value, right.value);
//             default:
//                 throw new Error(`Unknown operator ${operator}`);
//         }
//     })();

//     return new ValueUnit(value, left.unit, left.superType);
// }

// const reduceMathOperators = (left: ValueUnit, rest: any[]) => {
//     if (rest.length === 0) {
//         return left;
//     }
//     const value = rest.reduce((acc, [op, right]) => {
//         if (typeof acc === "string" || !(right instanceof ValueUnit)) {
//             return `${acc} ${op} ${right}`;
//         }

//         const v = evaluateMathOperator(op, acc, right);
//         if (!v) {
//             return `${acc} ${op} ${right}`;
//         } else {
//             return v;
//         }
//     }, left);

//     return value;
// };

// const MathValue: P.Language = P.createLanguage({
//     ws: () => P.optWhitespace,
//     lparen: (r) => P.string("(").trim(r.ws),
//     rparen: (r) => P.string(")").trim(r.ws),
//     comma: (r) => P.string(",").trim(r.ws),

//     String: () => P.regexp(/[^\(\)\{\}\s,;]+/).map((x) => new ValueUnit(x)),

//     termOperators: (r) => P.alt(...["*", "/", "//"].map(P.string)).trim(r.ws),
//     factorOperators: (r) => P.alt(...["+", "-"].map(P.string)).trim(r.ws),
//     pow: (r) => P.string("^").trim(r.ws),

//     Expression: (r) =>
//         P.alt(r.Function, r.Term).map((v) => {
//             console.log(v);
//             return v;
//         }),

//     FunctionArgs: (r) =>
//         P.sepBy1(r.Expression, r.comma).trim(r.ws).wrap(r.lparen, r.rparen),
//     Function: (r) =>
//         P.seq(P.alt(...Object.keys(mathFunctions).map(P.string)), r.FunctionArgs).map(
//             ([name, args]) => {
//                 const v = evaluateMathFunction(
//                     name as keyof typeof mathFunctions,
//                     args,
//                 );

//                 if (v) {
//                     return v;
//                 } else {
//                     return new FunctionValue(name, args);
//                 }
//             },
//         ),

//     Term: (r) =>
//         P.seqMap(
//             r.Factor,
//             P.seq(r.termOperators, r.Factor).many(),
//             reduceMathOperators,
//         ),
//     Factor: (r) =>
//         P.seqMap(r.Atom, P.seq(r.factorOperators, r.Term).many(), reduceMathOperators),

//     CSSVariable: (r) =>
//         P.string("--")
//             .then(identifier)
//             .map((v) => {
//                 return new ValueUnit("--" + v, "var");
//             }),

//     Atom: (r) => P.alt(r.CSSVariable, r.Expression).trim(r.ws),
// });
