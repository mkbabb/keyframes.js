import { easeInOutCubic, timingFunctions } from "../easing";
import type { ValueArray, ValueUnit, InterpolatedVar } from "../units";
import type { HueInterpolationMethod } from "@mkbabb/value.js";
export type { InterpolatedVar } from "../units";
export type { HueInterpolationMethod } from "@mkbabb/value.js";

export const DIRECTIONS = [
    "normal",
    "reverse",
    "alternate",
    "alternate-reverse",
] as const;

export const FILL_MODES = ["none", "forwards", "backwards", "both"] as const;

export type TimingFunctionNames = keyof typeof timingFunctions;

export type Vars<T = any> = {
    [arg: string]: number | string | T;
};

export type TransformFunction<V extends Vars> = (v: V, t: number) => void;

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

    start: ValueUnit;

    ixs: {
        start: number;
        stop: number;
    };

    time: {
        start: number;
        stop: number;
    };

    flatVars: V;
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

    useWAAPI: boolean;

    colorSpace: string;

    hueMethod?: HueInterpolationMethod;
};

export type InputAnimationOptions = Partial<{
    duration: number | string;
    delay: number | string;

    iterationCount: number | string | "infinite" | undefined;

    direction: (typeof DIRECTIONS)[number];
    fillMode: (typeof FILL_MODES)[number];

    timingFunction: TimingFunction | TimingFunctionNames | undefined;

    /** When true (default), eligible animations may use the Web Animations API for compositor-thread execution. Set to false to force rAF. */
    useWAAPI: boolean;

    colorSpace?: string;

    hueMethod?: HueInterpolationMethod;
}>;

export const defaultOptions: AnimationOptions = {
    duration: 1000,
    delay: 0,
    iterationCount: 1,
    direction: "normal",
    fillMode: "forwards",
    timingFunction: easeInOutCubic,
    useWAAPI: true,
    colorSpace: "oklab",
};

export type BlendMode = "replace" | "add" | "weighted";

export interface AnimationLayerConfig {
    /** Higher wins. Default: 0 */
    zIndex: number;
    /** 0–1 for 'weighted' blend mode. Default: 1 */
    weight: number;
    /** Default: 'replace' (backward compat) */
    // TODO(MEDIUM): Drop backward-compat defaulting and require callers to choose blend mode explicitly.
    blendMode: BlendMode;
    /** Layer toggle. Default: true */
    enabled: boolean;
    /** Optional property whitelist — only these properties will be output from this layer */
    properties?: Set<string>;
}

export const defaultLayerConfig: AnimationLayerConfig = {
    zIndex: 0,
    weight: 1,
    blendMode: "replace",
    enabled: true,
};
