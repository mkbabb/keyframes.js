import P from "parsimmon";
export declare const CSSKeyframes: P.Language;
export declare const CSSClass: P.Language;
export declare const CSSAnimationKeyframes: P.Language;
export declare const parseCSSKeyframes: (input: string) => Record<string, any>;
export declare const parseCSSPercent: (input: string | number) => number;
export declare function parseCSSTime(input: string): number;
export declare const reverseCSSTime: (time: number) => string;
export declare const reverseCSSIterationCount: (count: number) => string;
