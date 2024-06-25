export declare const arrayEquals: (a: any[], b: any[]) => boolean;
export declare function sleep(ms: number): Promise<unknown>;
export declare function waitUntil(condition: () => boolean, delay?: number): Promise<void>;
export declare function debounce(func: Function, wait?: number, waitingFunc?: any): (...args: Array<any>) => void;
export declare const hyphenToCamelCase: (str: string) => string;
export declare function camelCaseToHyphen(str: string): string;
export declare function requestAnimationFrame(callback: FrameRequestCallback): number | NodeJS.Immediate;
export declare function cancelAnimationFrame(handle: number | undefined | null | any): void;
