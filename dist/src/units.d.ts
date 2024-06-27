export interface TransformedVars {
    [arg: string]: ValueArray;
}
export declare function convertAbsoluteUnitToPixels(value: number, unit: string): number;
export declare function convertToPixels(value: number, unit: string, element?: HTMLElement, property?: string): number;
export declare function convertToDegrees(value: number, unit: string): number;
export declare function convertToDpi(value: number, unit: string): number;
export declare const getComputedValue: (target: HTMLElement, key: string) => any;
export declare class ValueUnit<T = number> {
    value: T;
    unit?: string;
    superType: string[];
    constructor(value: T, unit?: string, superType?: string[]);
    valueOf(): string | T;
    toString(): string;
    lerp(t: number, other: ValueUnit<T> | FunctionValue<T> | ValueArray<T>, target?: HTMLElement): any;
}
export declare class FunctionValue<T = number> {
    name: string;
    values: Array<ValueUnit<T>>;
    constructor(name: string, values: ValueUnit<T> | Array<ValueUnit<T>>);
    valueOf(): (string | T)[];
    toString(): string;
    lerp(t: number, other: FunctionValue<T> | ValueArray<T> | ValueUnit<T>, target?: HTMLElement): FunctionValue;
}
export declare class ValueArray<T = number> {
    values: Array<FunctionValue<T> | ValueUnit<T>>;
    constructor(values: ValueUnit<T> | FunctionValue<T> | ValueArray<T> | Array<FunctionValue<T> | ValueUnit<T>>);
    valueOf(): (string | T | (string | T)[])[];
    toString(): string;
    lerp(t: number, other: ValueArray<T> | FunctionValue<T> | ValueUnit<T>, target?: HTMLElement): any;
}
export declare const isValueType: (value: any) => value is ValueUnit | FunctionValue | ValueArray;
export declare const collapseNumericType: (a: ValueUnit<number>, b: ValueUnit<number>, target?: HTMLElement) => [ValueUnit<number>, ValueUnit<number>];
export declare function transformObject(input: any): TransformedVars;
export declare function reverseTransformObject<T>(key: string, value: ValueUnit<T> | FunctionValue<T> | ValueArray<T>, original?: any): any;
export declare function transformTargetsStyle(t: number, vars: any, targets: HTMLElement[]): void;
