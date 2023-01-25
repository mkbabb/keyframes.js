export declare function sleep(ms: number): Promise<unknown>;
export declare type Value = {
    value: number | object;
    unit: string;
};
export declare function transformValue(input: string | number): Value;
export declare function transformObject(input: any): object;
export declare function reverseTransformObject(input: any): number | string | object;
export declare function interpolateObject(t: number, start: any, stop: any): any;
