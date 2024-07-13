import { easeInOutCubic, timingFunctions } from "../easing";
import { ValueArray, ValueUnit } from "../units";

const DIRECTIONS = ["normal", "reverse", "alternate", "alternate-reverse"] as const;

const FILL_MODES = ["none", "forwards", "backwards", "both"] as const;

export type TimingFunctionNames = keyof typeof timingFunctions;

export type Vars<T = any> = {
    [arg: string]: number | string | T;
};

export type InterpolatedVar<T> = {
    start: T;
    stop: T;

    startValueUnit: ValueUnit;
    stopValueUnit: ValueUnit;
};

export type TransformFunction<V extends Vars> = (t: number, v: V) => void;

export type TimingFunction = (t: number) => number;

export interface TemplateAnimationFrame<V extends Vars> {
    id: number;
    start: ValueUnit;
    vars: V;

    transform?: TransformFunction<V>;
    timingFunction?: TimingFunction;
}

export interface AnimationFrame<V extends Vars> {
    id: number;

    ixs: {
        start: number;
        stop: number;
    };

    time: {
        start: number;
        stop: number;
    };

    vars: V;

    interpVars: {
        [arg: string]: Array<InterpolatedVar<V>>;
    };

    transform: TransformFunction<V>;

    timingFunction: TimingFunction;
}

export type AnimationOptions = {
    duration: number;

    delay: number;

    iterationCount: number;

    direction: (typeof DIRECTIONS)[number];

    fillMode: (typeof FILL_MODES)[number];

    timingFunction: TimingFunction;
};

export type InputAnimationOptions = Partial<{
    duration: number | string;
    delay: number | string;

    iterationCount: number | string | "infinite" | undefined;

    direction: (typeof DIRECTIONS)[number];
    fillMode: (typeof FILL_MODES)[number];

    timingFunction: TimingFunction | TimingFunctionNames | undefined;
}>;

export const defaultOptions: AnimationOptions = {
    duration: 1000,
    delay: 0,
    iterationCount: 1,
    direction: "normal",
    fillMode: "forwards",
    timingFunction: easeInOutCubic,
};
