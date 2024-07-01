declare class Animation_2<V extends Vars> {
    id: number;
    name: string | undefined;
    superKey: string | undefined;
    target: HTMLElement | undefined;
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
    constructor(options: Partial<InputAnimationOptions>, target?: HTMLElement | undefined, name?: string | undefined, superKey?: string | undefined);
    frame<K extends V>(start: number | string | ValueUnit<number>, vars: Partial<K>, transform?: TransformFunction<K>, timingFunction?: TimingFunction | TimingFunctionNames): Animation_2<K>;
    updateFrom(other: Animation_2<V>, merge?: boolean): this;
    transformVars(): this;
    parseFrames(): this;
    updateTimingFunction(timingFunction: InputAnimationOptions["timingFunction"]): this;
    updateIterationCount(iterationCount: InputAnimationOptions["iterationCount"]): this;
    updateDuration(duration: InputAnimationOptions["duration"]): this;
    updateDelay(delay: InputAnimationOptions["delay"]): this;
    updateDirection(direction: InputAnimationOptions["direction"]): this;
    updateFillMode(fillMode: InputAnimationOptions["fillMode"]): this;
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
export { Animation_2 as Animation }

declare interface AnimationFrame<V extends Vars> {
    id: number;
    time: {
        start: number;
        stop: number;
    };
    interpVars: InterpVars;
    transform: TransformFunction<V>;
    timingFunction: TimingFunction;
}

export declare class AnimationGroup<V> {
    animations: AnimationGroupObject<V>;
    transform: TransformFunction<V>;
    superKey: string | undefined;
    paused: boolean;
    started: boolean;
    done: boolean;
    singleTarget: boolean;
    constructor(...animations: Animation_2<V>[]);
    fromObject(object: Record<string, Animation_2<V>>): AnimationGroup<V>;
    setSuperKey(superKey: string): this;
    reset(): this;
    onStart(): this;
    onEnd(): this;
    pause(): this;
    forcePause(): void;
    forcePlay(): void;
    playing(): boolean;
    transformFramesGrouped(t: number): {};
    tick(t: number): this;
    draw(t: number): void;
    play(): this;
}

export declare interface AnimationGroupObject<V> {
    [key: string]: {
        animation: Animation_2<V>;
        values: Vars<ValueArray>;
    };
}

export declare type AnimationOptions = {
    duration: number;
    delay: number;
    iterationCount: number;
    direction: "normal" | "reverse" | "alternate" | "alternate-reverse";
    fillMode: "none" | "forwards" | "backwards" | "both";
    timingFunction: TimingFunction;
};

declare function bounceInEase(t: number): number;

declare function bounceInEaseHalf(t: number): number;

declare function bounceInOutEase(t: number): number;

declare function bounceOutEase(t: number): number;

declare function bounceOutEaseHalf(t: number): number;

export declare class CSSKeyframesAnimation<V extends Vars> {
    options: AnimationOptions;
    targets: HTMLElement[];
    animation: Animation_2<V>;
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

declare const defaultOptions: AnimationOptions;

declare function easeInBounce(t: number): number;

declare function easeInCirc(t: number): number;

declare function easeInCubic(t: number): number;

declare function easeInExpo(t: number): number;

declare function easeInOutCirc(t: number): number;

declare function easeInOutCubic(t: number): number;

declare function easeInOutExpo(t: number): number;

declare function easeInOutQuad(t: number): number;

declare function easeInOutSine(t: number): number;

declare function easeInQuad(t: number): number;

declare function easeInSine(t: number): number;

declare function easeOutCirc(t: number): number;

declare function easeOutCubic(t: number): number;

declare function easeOutExpo(t: number): number;

declare function easeOutQuad(t: number): number;

declare function easeOutSine(t: number): number;

declare class FunctionValue<T = number> {
    name: string;
    values: Array<ValueUnit<T>>;
    constructor(name: string, values: ValueUnit<T> | Array<ValueUnit<T>>);
    valueOf(): string | T | (string | T)[];
    toJSON(): {
        [x: string]: (string | T)[];
    };
    toString(): string;
    lerp(t: number, other: FunctionValue<T> | ValueArray<T> | ValueUnit<T>, target?: HTMLElement): FunctionValue;
}

export declare const getAnimationId: (animation: Animation_2<any> | string) => string;

export declare type InputAnimationOptions = {
    duration: number | string;
    delay: number | string;
    iterationCount: number | string | "infinite" | undefined;
    direction: typeof defaultOptions.direction;
    fillMode: typeof defaultOptions.fillMode;
    timingFunction: TimingFunction | TimingFunctionNames | undefined;
};

declare type InterpValue = {
    start: ValueArray;
    stop: ValueArray;
};

declare type InterpVars = {
    [arg: string]: InterpValue;
};

declare const jumpTerms: readonly ["jump-start", "jump-end", "jump-none", "jump-both", "start", "end", "both"];

declare type Keyframe_2<V extends Vars> = [
vars: V,
transform?: TransformFunction<V>,
timingFunction?: TimingFunction
];
export { Keyframe_2 as Keyframe }

export declare type Keyframes<V> = Array<[
number | string,
Partial<V>,
TransformFunction<V>?,
TimingFunction?
]>;

declare function linear(t: number): number;

export declare function parseTemplateFrame<V extends Vars>(ix: number, templateFrames: TemplateAnimationFrame<V>[], transformedVars: TransformedVars[], duration: number, frames: AnimationFrame<V>[]): AnimationFrame<V>;

declare function smoothStep3(t: number): number;

declare function stepEnd(): (t: number) => number;

declare function steppedEase(steps: number, jumpTerm?: (typeof jumpTerms)[number]): (t: number) => number;

declare function stepStart(): (t: number) => number;

declare interface TemplateAnimationFrame<V extends Vars> {
    id: number;
    start: ValueUnit;
    vars: V;
    transform?: TransformFunction<V>;
    timingFunction?: TimingFunction;
}

export declare type TimingFunction = (t: number) => number;

export declare type TimingFunctionNames = keyof typeof timingFunctions;

declare const timingFunctions: {
    readonly linear: typeof linear;
    readonly easeInQuad: typeof easeInQuad;
    readonly "ease-in-quad": typeof easeInQuad;
    readonly easeOutQuad: typeof easeOutQuad;
    readonly "ease-out-quad": typeof easeOutQuad;
    readonly easeInOutQuad: typeof easeInOutQuad;
    readonly "ease-in-out-quad": typeof easeInOutQuad;
    readonly easeInCubic: typeof easeInCubic;
    readonly "ease-in-cubic": typeof easeInCubic;
    readonly easeOutCubic: typeof easeOutCubic;
    readonly "ease-out-cubic": typeof easeOutCubic;
    readonly easeInOutCubic: typeof easeInOutCubic;
    readonly "ease-in-out-cubic": typeof easeInOutCubic;
    readonly easeInBounce: typeof easeInBounce;
    readonly "ease-in-bounce": typeof easeInBounce;
    readonly bounceInEase: typeof bounceInEase;
    readonly "bounce-in-ease": typeof bounceInEase;
    readonly bounceInEaseHalf: typeof bounceInEaseHalf;
    readonly "bounce-in-ease-half": typeof bounceInEaseHalf;
    readonly bounceOutEase: typeof bounceOutEase;
    readonly "bounce-out-ease": typeof bounceOutEase;
    readonly bounceOutEaseHalf: typeof bounceOutEaseHalf;
    readonly "bounce-out-ease-half": typeof bounceOutEaseHalf;
    readonly bounceInOutEase: typeof bounceInOutEase;
    readonly "bounce-in-out-ease": typeof bounceInOutEase;
    readonly easeInSine: typeof easeInSine;
    readonly "ease-in-sine": typeof easeInSine;
    readonly easeOutSine: typeof easeOutSine;
    readonly "ease-out-sine": typeof easeOutSine;
    readonly easeInOutSine: typeof easeInOutSine;
    readonly "ease-in-out-sine": typeof easeInOutSine;
    readonly easeInCirc: typeof easeInCirc;
    readonly "ease-in-circ": typeof easeInCirc;
    readonly easeOutCirc: typeof easeOutCirc;
    readonly "ease-out-circ": typeof easeOutCirc;
    readonly easeInOutCirc: typeof easeInOutCirc;
    readonly "ease-in-out-circ": typeof easeInOutCirc;
    readonly easeInExpo: typeof easeInExpo;
    readonly "ease-in-expo": typeof easeInExpo;
    readonly easeOutExpo: typeof easeOutExpo;
    readonly "ease-out-expo": typeof easeOutExpo;
    readonly easeInOutExpo: typeof easeInOutExpo;
    readonly "ease-in-out-expo": typeof easeInOutExpo;
    readonly smoothStep3: typeof smoothStep3;
    readonly "smooth-step-3": typeof smoothStep3;
    readonly ease: (t: number) => number;
    readonly "ease-in": (t: number) => number;
    readonly "ease-out": (t: number) => number;
    readonly "ease-in-out": (t: number) => number;
    readonly "ease-in-back": (t: number) => number;
    readonly "ease-out-back": (t: number) => number;
    readonly "ease-in-out-back": (t: number) => number;
    readonly steps: typeof steppedEase;
    readonly "step-start": typeof stepStart;
    readonly "step-end": typeof stepEnd;
};

declare interface TransformedVars {
    [arg: string]: ValueArray;
}

export declare type TransformFunction<V extends Vars> = (t: number, v: V) => void;

declare class ValueArray<T = number> {
    values: Array<FunctionValue<T> | ValueUnit<T>>;
    constructor(values: ValueUnit<T> | FunctionValue<T> | ValueArray<T> | Array<FunctionValue<T> | ValueUnit<T>>);
    valueOf(): string | T | (string | T | (string | T)[])[];
    toJSON(): (string | T | {
        [x: string]: (string | T)[];
    })[];
    toString(): string;
    lerp(t: number, other: ValueArray<T> | FunctionValue<T> | ValueUnit<T>, target?: HTMLElement): any;
}

declare class ValueUnit<T = number> {
    value: T;
    unit?: string;
    superType: string[];
    constructor(value: T, unit?: string, superType?: string[]);
    valueOf(): string | T;
    toJSON(): string | T;
    toString(): string;
    lerp(t: number, other: ValueUnit<T> | FunctionValue<T> | ValueArray<T>, target?: HTMLElement): any;
}

export declare type Vars<T = any> = {
    [arg: string]: number | string | T;
};

export { }
