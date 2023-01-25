import { bounceInEase, easeInBounce, easeInCubic, lerpIn, easeInOutCubic, easeOutCubic, easeInOutQuad, easeOutQuad, easeInQuad, smoothStep3, bounceInEaseHalf } from "./math";
import { Value } from "./utils";
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
    lerpIn: typeof lerpIn;
};
declare type InterpValue = {
    start: Value | any;
    stop: Value | any;
    distance?: number;
};
declare type Vars = {
    [arg: string]: number | string | any;
};
declare type InterpVars = {
    [arg: string]: InterpValue;
};
declare type TransformFunction<V> = (t: number, v: V) => void;
declare type EasingFunction = (t: number, from: number, distance: number, duration: number) => number;
interface TemplateFrame<V extends Vars> {
    id: number;
    start: number;
    vars: V;
    transform?: TransformFunction<V>;
    ease?: EasingFunction;
}
interface Frame<V extends Vars> {
    id: number;
    time: {
        start: number;
        stop: number;
        distance: number;
    };
    interpVarValues: InterpVars;
    transform: TransformFunction<V>;
    ease: EasingFunction;
}
export declare function animationLoop(drawFunc: (t: number) => undefined | boolean): void;
export declare function parseTemplateFrame<V extends Vars>(ix: number, templateFrames: TemplateFrame<V>[], transformedFrameVars: InterpVars[], duration: number, frames: Frame<V>[]): Frame<V>;
export declare class Animation<V extends Vars> {
    duration: number;
    templateFrames: TemplateFrame<V>[];
    templateFrame: TemplateFrame<V> | undefined;
    frameId: number;
    prevId: number;
    frames: Frame<V>[];
    constructor(duration: number);
    from<K extends Vars>(start: number, vars: Partial<K>): Animation<K>;
    transform<K extends V>(func: TransformFunction<K>): this;
    ease(func?: EasingFunction): this;
    done(): this;
    reverse(): this;
    start(): Promise<unknown>;
}
export {};
