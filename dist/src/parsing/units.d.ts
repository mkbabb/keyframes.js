import { default as P } from 'parsimmon';

export declare const absoluteLengthUnits: readonly ["px", "cm", "mm", "Q", "in", "pc", "pt"];
export declare const relativeLengthUnits: readonly ["em", "ex", "ch", "rem", "lh", "rlh", "vw", "vh", "vmin", "vmax", "vb", "vi", "svw", "svh", "lvw", "lvh", "dvw", "dvh"];
export declare const lengthUnits: readonly ["px", "cm", "mm", "Q", "in", "pc", "pt", "em", "ex", "ch", "rem", "lh", "rlh", "vw", "vh", "vmin", "vmax", "vb", "vi", "svw", "svh", "lvw", "lvh", "dvw", "dvh"];
export declare const timeUnits: readonly ["s", "ms"];
export declare const angleUnits: readonly ["deg", "rad", "grad", "turn"];
export declare const percentageUnits: readonly ["%"];
export declare const resolutionUnits: readonly ["dpi", "dpcm", "dppx"];
export declare const units: readonly ["px", "cm", "mm", "Q", "in", "pc", "pt", "em", "ex", "ch", "rem", "lh", "rlh", "vw", "vh", "vmin", "vmax", "vb", "vi", "svw", "svh", "lvw", "lvh", "dvw", "dvh", "s", "ms", "deg", "rad", "grad", "turn", "%", "dpi", "dpcm", "dppx"];
export declare const identifier: P.Parser<string>;
export declare const none: P.Parser<"none">;
export declare const integer: P.Parser<number>;
export declare const number: P.Parser<number>;
export declare const opt: <T>(p: P.Parser<T>) => P.Parser<any>;
export declare const CSSColor: P.Language;
export declare const CSSValueUnit: P.Language;
export declare function parseCSSValueUnit(input: string): any;
