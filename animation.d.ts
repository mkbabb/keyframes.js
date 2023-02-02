import { bounceInEase, bounceInEaseHalf, easeInBounce, easeInCubic, easeInOutCubic, easeInOutQuad, easeInQuad, easeOutCubic, easeOutQuad, smoothStep3 } from "./easing";
import { ValueArray } from "./units";
import { TransformedVars } from "./utils";
export declare const easingFunctions: {
    easeInQuad: typeof easeInQuad;
    easeOutQuad: typeof easeOutQuad;
    easeInOutQuad: typeof easeInOutQuad;
    easeInCubic: typeof easeInCubic;
    easeOutCubic: typeof easeOutCubic;
    easeInOutCubic: typeof easeInOutCubic;
    easeInBounce: typeof easeInBounce;
    bounceInEase: typeof bounceInEase;
    bounceInEaseHalf: typeof bounceInEaseHalf;
    smoothStep3: typeof smoothStep3;
};
type InterpValue = {
    start: ValueArray;
    stop: ValueArray;
};
type InterpVars = {
    [arg: string]: InterpValue;
};
type Vars = {
    [arg: string]: number | string | any;
};
type TransformFunction<V extends Vars> = (t: number, v: V) => void;
type TimingFunction = (t: number) => number;
export type Keyframe<V extends Vars> = [
    vars: V,
    transform?: TransformFunction<V>,
    timingFunction?: TimingFunction
];
interface TemplateAnimationFrame<V extends Vars> {
    id: number;
    start: number;
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
export declare class Animation<V extends Vars> {
    target: HTMLElement;
    options: AnimationOptions;
    templateFrames: TemplateAnimationFrame<V>[];
    transformedVars: TransformedVars[];
    frameId: number;
    frames: AnimationFrame<V>[];
    startTime: number | undefined;
    pausedTime: number;
    prevTime: number;
    t: number;
    done: boolean;
    reversed: boolean;
    paused: boolean;
    constructor(options: Partial<AnimationOptions>, target?: HTMLElement);
    frame<K extends V>(start: number, vars: Partial<K>, transform?: TransformFunction<K>, timingFunction?: TimingFunction): Animation<K>;
    transformVars(): this;
    parseFrames(): this;
    parse(): this;
    reverse(): this;
    pause(): this;
    fillForwards(): void;
    fillBackwards(): void;
    interpFrames(t: number, reversedVars?: TransformedVars): void;
    onStart(): Promise<void>;
    onEnd(): void;
    draw(t: number): Promise<number | void>;
    play(): Promise<void>;
}
export declare class CSSKeyframesAnimation<V extends Vars> {
    options: AnimationOptions;
    targets: HTMLElement[];
    animation: Animation<V>;
    constructor(options?: Partial<AnimationOptions>, ...targets: HTMLElement[]);
    initAnimation(): this;
    fromFramesDefaultTransform(keyframes: Record<string, Partial<V>>): this;
    fromFrames(keyframes: Record<string, Keyframe<V>>): this;
    fromCSSKeyframes(keyframes: string): this;
    transform(t: number, vars: any): void;
    play(): Promise<void>;
    pause(): this;
}
export {};
