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
    toString(): string;
    lerp(t: number, other: ValueUnit<T>, target?: HTMLElement): any;
}
export declare class FunctionValue<T = number> {
    name: string;
    values: ValueUnit<T>[];
    constructor(name: string, values: ValueUnit<T>[]);
    toString(): string;
    lerp(t: number, other: FunctionValue<T>, target?: HTMLElement): FunctionValue;
}
export declare class ValueArray<T = number> {
    values: Array<FunctionValue<T> | ValueUnit<T>>;
    constructor(values: Array<FunctionValue<T> | ValueUnit<T>>);
    toString(): string;
    lerp(t: number, other: ValueArray<T>, target?: HTMLElement): ValueArray<number>;
}
export declare const collapseNumericType: (a: ValueUnit, b: ValueUnit, target?: HTMLElement) => ValueUnit<number>[];
export declare function transformObject(input: any): TransformedVars;
export declare function reverseTransformObject(key: string, values: ValueArray, original?: any): any;
export declare const reverseTransformValue: (value: any) => any;
