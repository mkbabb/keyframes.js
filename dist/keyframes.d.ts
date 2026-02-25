import { InterpolatedVar } from '@mkbabb/value.js';
import { timingFunctions } from '@mkbabb/value.js';
import { ValueArray } from '@mkbabb/value.js';
import { ValueUnit } from '@mkbabb/value.js';

declare class Animation_2<V extends Vars = any> {
    id: number;
    name: string | undefined;
    superKey: string | undefined;
    targets: HTMLElement[];
    options: AnimationOptions;
    templateFrames: TemplateAnimationFrame<V>[];
    parsedVars: any[];
    frameId: number;
    frames: AnimationFrame<V>[];
    handleId: number | any;
    startTime: number | undefined;
    pausedTime: number;
    prevTime: number;
    t: number;
    iteration: number;
    started: boolean;
    done: boolean;
    reversed: boolean;
    paused: boolean;
    unflatten: boolean;
    private resolvePromise;
    constructor(options?: Partial<InputAnimationOptions>, targets?: HTMLElement[] | HTMLElement | undefined, name?: string | undefined, superKey?: string | undefined);
    convertFrameStart(frame: TemplateAnimationFrame<V>): TemplateAnimationFrame<V>;
    addFrame<K extends V>(start: number | string | ValueUnit<number>, vars: Partial<K>, transform?: TransformFunction<K>, timingFunction?: TimingFunction | TimingFunctionNames): Animation_2<K>;
    createFrame(startIx: number, endIx: number): AnimationFrame<V>;
    reconcileVars(ix: number): void;
    parse(): this;
    setTimingFunction(timingFunction: InputAnimationOptions["timingFunction"]): this;
    setIterationCount(iterationCount: InputAnimationOptions["iterationCount"]): this;
    setDuration(duration: InputAnimationOptions["duration"]): this;
    setDelay(delay: InputAnimationOptions["delay"]): this;
    setDirection(direction: InputAnimationOptions["direction"]): this;
    setFillMode(fillMode: InputAnimationOptions["fillMode"]): this;
    setOptions(options: Partial<InputAnimationOptions>): this;
    reverse(): this;
    fillForwards(): void;
    fillBackwards(): void;
    interpFrames(t: number, transformFrames?: boolean): {};
    onStart(): Promise<void>;
    onEnd(): Promise<void>;
    tick(t: number): Promise<number>;
    draw(t: number): Promise<void>;
    play(): Promise<void>;
    pause(draw?: boolean): this;
    stop(): void;
    playing(): boolean;
    reset(): this;
    setTargets(...targets: HTMLElement[]): this;
    group(...animations: Animation_2<V>[]): AnimationGroup<V>;
}
export { Animation_2 as Animation }

declare interface AnimationFrame<V extends Vars> {
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

declare class AnimationGroup<V extends Vars> {
    animations: AnimationGroupObject<V>;
    transform: TransformFunction<V>;
    superKey: string | undefined;
    paused: boolean;
    started: boolean;
    done: boolean;
    singleTarget: boolean;
    handleId: number | any;
    resolvePromise: ((value: void | PromiseLike<void>) => void) | null;
    constructor(...animations: Animation_2<V>[]);
    setSuperKey(superKey: string): this;
    setTargets(...targets: HTMLElement[]): this;
    onStart(): this;
    onEnd(): this;
    transformFramesGrouped(t: number): Vars<ValueArray<any>>;
    tick(t: number): Promise<this>;
    draw(t: number): Promise<void>;
    play(): Promise<unknown>;
    pause(): this;
    reset(): this;
    stop(): this;
    playing(): boolean;
    forcePause(): void;
    forcePlay(): void;
}

declare interface AnimationGroupObject<V extends Vars> {
    [key: string]: {
        animation: Animation_2<V>;
        values: Vars<ValueArray>;
    };
}

declare type AnimationOptions = {
    duration: number;
    delay: number;
    iterationCount: number;
    direction: (typeof DIRECTIONS)[number];
    fillMode: (typeof FILL_MODES)[number];
    timingFunction: TimingFunction;
};

export declare class CSSKeyframesAnimation<V extends Vars> extends Animation_2<V> {
    constructor(options?: Partial<InputAnimationOptions>, ...targets: HTMLElement[]);
    fromVars(vars: V[], transform?: TransformFunction<V>): this;
    fromKeyframes(keyframes: Map<string, Partial<V>> | Record<string, Partial<V>>, transform?: TransformFunction<V>): this;
    fromString(keyframes: string, transform?: TransformFunction<V>): this;
    transform(vars: any): void;
}

declare const DIRECTIONS: readonly ["normal", "reverse", "alternate", "alternate-reverse"];

declare const FILL_MODES: readonly ["none", "forwards", "backwards", "both"];

export declare const getAnimationId: (animation: Animation_2 | string) => string;

declare type InputAnimationOptions = Partial<{
    duration: number | string;
    delay: number | string;
    iterationCount: number | string | "infinite" | undefined;
    direction: (typeof DIRECTIONS)[number];
    fillMode: (typeof FILL_MODES)[number];
    timingFunction: TimingFunction | TimingFunctionNames | undefined;
}>;

declare interface TemplateAnimationFrame<V extends Vars> {
    id: number;
    start: ValueUnit;
    vars: V;
    transform?: TransformFunction<V>;
    timingFunction?: TimingFunction;
}

declare type TimingFunction = (t: number) => number;

declare type TimingFunctionNames = keyof typeof timingFunctions;

declare type TransformFunction<V extends Vars> = (v: V, t: number) => void;

declare type Vars<T = any> = {
    [arg: string]: number | string | T;
};

export { }
