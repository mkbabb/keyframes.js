import P from "parsimmon";
export declare class ValueUnit<T = number> {
    value: T;
    unit?: string;
    constructor(value: T, unit?: string);
    toString(): string;
    lerp(t: number, other: ValueUnit<T>, target?: HTMLElement): any;
}
export declare class FunctionValue {
    name: string;
    values: ValueUnit[];
    constructor(name: string, values: ValueUnit[]);
    toString(): string;
    lerp(t: number, other: FunctionValue, target?: HTMLElement): FunctionValue;
}
export declare class ValueArray {
    values: Array<FunctionValue | ValueUnit>;
    constructor(values: Array<FunctionValue | ValueUnit>);
    toString(): string;
    lerp(t: number, other: ValueArray, target?: HTMLElement): ValueArray;
}
export declare function parseCSSUnitValue(): P.Parser<ValueUnit[]>;
export declare function convertAbsoluteUnitToPixels(value: number, unit: string): number;
export declare function convertToPixels(value: number, unit: string, element?: HTMLElement, property?: string): number;
export declare const toCamelCase: (str: string) => string;
export declare const CSSValueUnit: P.Language;
export declare const CSSKeyframes: P.Language;
export declare const parseCSSKeyframes: (input: string) => Record<string, any>;
export declare const parseCSSPercent: (input: string | number) => number;
