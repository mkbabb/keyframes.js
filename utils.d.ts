import { ValueArray } from "./units";
export declare function sleep(ms: number): Promise<unknown>;
export interface TransformedVars {
    [arg: string]: ValueArray;
}
export declare function transformObject(input: any): TransformedVars;
export declare function reverseTransformObject(key: string, values: ValueArray, original: any): any;
export declare function waitUntil(condition: () => boolean, delay?: number): Promise<void>;
export declare function debounce(func: Function, wait?: number): (...args: Array<any>) => void;
