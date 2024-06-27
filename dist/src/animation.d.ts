import { timingFunctions } from './easing';
import { TransformedVars, ValueArray, ValueUnit } from './units';

type InterpValue = {
    start: ValueArray;
    stop: ValueArray;
};
type InterpVars = {
    [arg: string]: InterpValue;
};
export type Vars<T = any> = {
    [arg: string]: number | string | T;
};
type TransformFunction<V extends Vars> = (t: number, v: V) => void;
type TimingFunction = (t: number) => number;
type TimingFunctionNames = keyof typeof timingFunctions;
export type Keyframe<V extends Vars> = [
    vars: V,
    transform?: TransformFunction<V>,
    timingFunction?: TimingFunction
];
interface TemplateAnimationFrame<V extends Vars> {
    id: number;
    start: ValueUnit;
    vars: V;
    transform?: TransformFunction<V>;
    timingFunction?: TimingFunction;
}
interface AnimationFrame<V extends Vars> {
    id: number;
    time: {
        start: number;
        stop: number;
    };
    interpVars: InterpVars;
    transform: TransformFunction<V>;
    timingFunction: TimingFunction;
}
export declare function parseTemplateFrame<V extends Vars>(ix: number, templateFrames: TemplateAnimationFrame<V>[], transformedVars: TransformedVars[], duration: number, frames: AnimationFrame<V>[]): AnimationFrame<V>;
type AnimationOptions = {
    duration: number;
    delay: number;
    iterationCount: number;
    direction: "normal" | "reverse" | "alternate" | "alternate-reverse";
    fillMode: "none" | "forwards" | "backwards" | "both";
    timingFunction: TimingFunction;
};
declare const defaultOptions: AnimationOptions;
type InputAnimationOptions = {
    duration: number | string;
    delay: number | string;
    iterationCount: number | "infinite";
    direction: typeof defaultOptions.direction;
    fillMode: typeof defaultOptions.fillMode;
    timingFunction: TimingFunction | TimingFunctionNames;
};
export declare class Animation<V extends Vars> {
    target: HTMLElement;
    id: number;
    options: AnimationOptions;
    templateFrames: TemplateAnimationFrame<V>[];
    transformedVars: TransformedVars[];
    frameId: number;
    frames: AnimationFrame<V>[];
    startTime: number | undefined;
    pausedTime: number;
    prevTime: number;
    t: number;
    iteration: number;
    started: boolean;
    done: boolean;
    reversed: boolean;
    paused: boolean;
    constructor(options: Partial<InputAnimationOptions>, target?: HTMLElement);
    frame<K extends V>(start: number | string, vars: Partial<K>, transform?: TransformFunction<K>, timingFunction?: TimingFunction | TimingFunctionNames): Animation<K>;
    transformVars(): this;
    parseFrames(): this;
    updateTimingFunction(timingFunction: TimingFunction | TimingFunctionNames): this;
    updateIterationCount(iterationCount: number | string | "infinite"): this;
    updateDuration(duration: number | string): this;
    updateDelay(delay: number | string): this;
    parseOptions(options: Partial<InputAnimationOptions>): this;
    parse(): this;
    reverse(): this;
    pause(draw?: boolean): this;
    playing(): boolean;
    reset(): this;
    fillForwards(): void;
    fillBackwards(): void;
    transformFrames(t: number): void;
    interpFrames(t: number, values: Vars<ValueArray>): void;
    onStart(): Promise<void>;
    onEnd(): void;
    tick(t: number): number;
    draw(t: number): void;
    play(): void;
}
export type Keyframes<V> = Array<[
    number | string,
    Partial<V>,
    TransformFunction<V>?,
    TimingFunction?
]>;
export declare class CSSKeyframesAnimation<V extends Vars> {
    options: AnimationOptions;
    targets: HTMLElement[];
    animation: Animation<V>;
    constructor(options?: Partial<InputAnimationOptions>, ...targets: HTMLElement[]);
    addTargets(...targets: HTMLElement[]): this;
    initAnimation(): this;
    fromKeyframesDefaultTransform(keyframes: Record<string, Partial<V>>): this;
    fromVars(vars: V[], transform?: TransformFunction<V>): this;
    fromKeyframes(keyframes: Keyframes<V>): this;
    fromCSSKeyframes(keyframes: string | Record<string, Partial<V>>, transform?: TransformFunction<V>): this;
    transform(t: number, vars: any): void;
    play(): void;
    pause(): this;
}
export interface AnimationGroupObject<V> {
    animation: Animation<V>;
    values: Vars<ValueArray>;
}
export declare class AnimationGroup<V> {
    animationGroup: AnimationGroupObject<V>[];
    transform: TransformFunction<V>;
    paused: boolean;
    started: boolean;
    done: boolean;
    constructor(...animations: Animation<V>[]);
    reset(): this;
    onStart(): this;
    onEnd(): this;
    pause(): this;
    playing(): boolean;
    transformFrames(t: number): {};
    tick(t: number): this;
    draw(t: number): void;
    play(): this;
}
export {};
