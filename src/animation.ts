import { easeInOutCubic, timingFunctions } from "./easing";
import { scale } from "./math";
import { parseCSSKeyframes, parseCSSPercent, parseCSSTime } from "./parsing/keyframes";
import { CSSValueUnit } from "./parsing/units";
import {
    TransformedVars,
    ValueArray,
    ValueUnit,
    mergeValueObjects,
    normalizeTransformVars,
    reverseTransformObject,
    transformObject,
    transformTargetsStyle,
} from "./units";
import { requestAnimationFrame, sleep } from "./utils";

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

export type TransformFunction<V extends Vars> = (t: number, v: V) => void;
export type TimingFunction = (t: number) => number;
export type TimingFunctionNames = keyof typeof timingFunctions;

export type Keyframe<V extends Vars> = [
    vars: V,
    transform?: TransformFunction<V>,
    timingFunction?: TimingFunction,
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

function calcFrameTime<V extends Vars>(
    startFrame: TemplateAnimationFrame<V>,
    endFrame: TemplateAnimationFrame<V>,
    duration: number,
) {
    const [start, stop] = [startFrame.start, endFrame.start];
    return {
        start: (start.value * duration) / 100,
        stop: (stop.value * duration) / 100,
    };
}

function seekPreviousValue<T>(ix: number, values: T[], pred: (f: T) => boolean) {
    for (let i = ix - 1; i >= 0; i--) {
        if (pred(values[i])) {
            return i;
        }
    }
    return undefined;
}

export function parseTemplateFrame<V extends Vars>(
    ix: number,
    templateFrames: TemplateAnimationFrame<V>[],
    transformedVars: TransformedVars[],
    duration: number,
    frames: AnimationFrame<V>[],
): AnimationFrame<V> {
    const [startFrame, endFrame] = [templateFrames[ix], templateFrames[ix + 1]];
    const [startVars, endVars] = [transformedVars[ix], transformedVars[ix + 1]];

    const time = calcFrameTime(startFrame, endFrame, duration);

    const interpVars: InterpVars = {};

    const allVars = [...new Set([...Object.keys(startVars), ...Object.keys(endVars)])];

    const createInterpVarValue = (
        v: string,
        startIx: number,
        endIx: number,
    ): InterpValue => {
        return {
            start: transformedVars[startIx][v],
            stop: transformedVars[endIx][v],
        };
    };

    allVars.forEach((v) => {
        if (v in startVars && v in endVars) {
            // Default case - both frames have the variable
            interpVars[v] = createInterpVarValue(v, ix, ix + 1);
        } else if (!(v in startVars) && v in endVars) {
            // Degenerate case - only the end frame has the variable
            // Find the last frame that has that variable
            const oldFrameIx = seekPreviousValue(ix, transformedVars, (f) => v in f);
            if (oldFrameIx == null) {
                return;
            }
            const oldFrame = frames[oldFrameIx];
            oldFrame.time = calcFrameTime(
                templateFrames[oldFrameIx],
                endFrame,
                duration,
            );
            oldFrame.interpVars[v] = createInterpVarValue(v, oldFrameIx, ix + 1);
        }
    });

    let transform = startFrame.transform;
    if (transform == null) {
        const transformIx = seekPreviousValue(ix, frames, (f) => f.transform != null)!;
        transform = frames[transformIx].transform;
    }
    return {
        id: startFrame.id,
        time,
        interpVars,
        transform,
        timingFunction: startFrame.timingFunction!,
    };
}

export type AnimationOptions = {
    duration: number;
    delay: number;
    iterationCount: number;
    direction: "normal" | "reverse" | "alternate" | "alternate-reverse";
    fillMode: "none" | "forwards" | "backwards" | "both";
    timingFunction: TimingFunction;
};

const defaultOptions: AnimationOptions = {
    duration: 1000,
    delay: 0,
    iterationCount: 1,
    direction: "normal",
    fillMode: "forwards",
    timingFunction: easeInOutCubic,
};

export type InputAnimationOptions = Partial<{
    duration: number | string;
    delay: number | string;
    iterationCount: number | string | "infinite" | undefined;
    direction: typeof defaultOptions.direction;
    fillMode: typeof defaultOptions.fillMode;
    timingFunction: TimingFunction | TimingFunctionNames | undefined;
}>;

const getTimingFunction = (
    timingFunction: TimingFunction | TimingFunctionNames | undefined,
): TimingFunction | undefined => {
    if (typeof timingFunction === "string") {
        return timingFunctions[timingFunction] as TimingFunction | undefined;
    } else if (timingFunction == null) {
        return undefined;
    }

    return timingFunction;
};

let nextId = 0;

export class Animation<V extends Vars> {
    id: number = nextId++;
    name: string | undefined;
    superKey: string | undefined;

    targets: HTMLElement[];

    options: AnimationOptions;

    templateFrames: TemplateAnimationFrame<V>[] = [];
    transformedVars: TransformedVars[] = [];

    normalizedTransformedVars: TransformedVars[] = [];

    frameId: number = 0;

    frames: AnimationFrame<V>[] = [];
    normalizedFrames: AnimationFrame<V>[] = [];

    handleId: number | any = undefined;

    startTime: number | undefined = undefined;
    pausedTime: number = 0;
    prevTime: number = 0;
    t: number = 0;

    iteration: number = 0;

    started: boolean = false;
    done: boolean = false;
    reversed: boolean = false;
    paused: boolean = false;

    private resolvePromise: ((value: void | PromiseLike<void>) => void) | null = null;

    constructor(
        options: Partial<InputAnimationOptions>,
        targets: HTMLElement[] | HTMLElement | undefined = undefined,
        name: string | undefined = undefined,
        superKey: string | undefined = undefined,
    ) {
        this.options = { ...defaultOptions, ...options } as AnimationOptions;
        this.parseOptions(options);

        this.targets =
            targets == null ? [] : Array.isArray(targets) ? targets : [targets];

        this.name = name;
        this.superKey = superKey;
    }

    normalizeFrameTime(frame: TemplateAnimationFrame<V>, i: number) {
        if (frame.start.unit === "s") {
            frame.start.value != frame.start.value;
            frame.start.unit = "ms";
        }

        if (frame.start.unit !== "%") {
            frame.start.unit = "%";

            const nextTime = i > 0 ? this.templateFrames[i - 1].start.value : 0;

            const msValue =
                (nextTime * this.options.duration) / 100 + frame.start.value;
            const percent = (msValue / this.options.duration) * 100;

            frame.start.value = percent;
        }

        return frame;
    }

    frame<K extends V>(
        start: number | string | ValueUnit<number>,
        vars: Partial<K>,
        transform?: TransformFunction<K>,
        timingFunction?: TimingFunction | TimingFunctionNames,
    ): Animation<K> {
        if (typeof start === "number") {
            start = String(start) + "%";
        } else if (typeof start === "string") {
            start = start;
        } else if (start instanceof ValueUnit) {
            start = String(start);
        }

        const parsedStart = CSSValueUnit.Value.tryParse(start)!;

        const templateFrame = {
            id: this.frameId,
            start: parsedStart,
            vars,
            transform,
            timingFunction:
                getTimingFunction(timingFunction) ?? this.options.timingFunction,
        } as TemplateAnimationFrame<K>;

        this.templateFrames.push(templateFrame);
        this.frameId += 1;

        return this as unknown as Animation<K>;
    }

    updateFrom(other: Animation<V>) {
        Object.keys(this).forEach((key) => {
            if (other[key]) {
                this[key] = other[key];
            }
        });
        return this;
    }

    transformVars() {
        this.transformedVars = this.templateFrames.map((frame) => {
            return transformObject(frame.vars);
        });
        // this.normalizedTransformedVars = this.templateFrames.map((frame) => {
        //     return normalizeTransformVars(frame.vars);
        // });
        return this;
    }

    parseFrames() {
        this.frames = [];
        this.normalizedFrames = [];

        for (let i = 0; i < this.templateFrames.length; i++) {
            const frame = this.templateFrames[i];
            this.normalizeFrameTime(frame, i);
        }

        this.templateFrames.sort((a, b) => a.start.value - b.start.value);

        for (let i = 0; i < this.templateFrames.length - 1; i++) {
            const frame = parseTemplateFrame(
                i,
                this.templateFrames,
                this.transformedVars,
                this.options.duration,
                this.frames,
            );

            this.frames.push(frame);
        }

        return this;
    }

    updateTimingFunction(timingFunction: InputAnimationOptions["timingFunction"]) {
        this.options.timingFunction =
            getTimingFunction(timingFunction) ?? easeInOutCubic;
        return this;
    }

    updateIterationCount(iterationCount: InputAnimationOptions["iterationCount"]) {
        if (
            !iterationCount ||
            iterationCount === "infinite" ||
            iterationCount === "∞" ||
            iterationCount === "Infinity"
        ) {
            this.options.iterationCount = Infinity;
        } else if (typeof iterationCount === "string") {
            this.options.iterationCount = parseFloat(iterationCount.trim());
        } else {
            this.options.iterationCount = iterationCount;
        }
        return this;
    }

    updateDuration(duration: InputAnimationOptions["duration"]) {
        if (typeof duration === "string") {
            duration = parseCSSTime(duration);
        }

        const prevDuration = this.options.duration;
        const ratio = duration / prevDuration;

        for (let i = 0; i < this.frames.length; i++) {
            const frame = this.frames[i];
            frame.time.start *= ratio;
            frame.time.stop *= ratio;
        }

        this.options.duration = duration;

        return this;
    }

    updateDelay(delay: InputAnimationOptions["delay"]) {
        if (typeof delay === "string") {
            delay = parseCSSTime(delay);
        }
        this.options.delay = delay;
        return this;
    }

    updateDirection(direction: InputAnimationOptions["direction"]) {
        this.options.direction = direction;
        return this;
    }

    updateFillMode(fillMode: InputAnimationOptions["fillMode"]) {
        this.options.fillMode = fillMode;
        return this;
    }

    parseOptions(options: Partial<InputAnimationOptions>) {
        this.updateTimingFunction(options.timingFunction);
        this.updateDuration(options.duration);
        this.updateIterationCount(options.iterationCount);
        this.updateDelay(options.delay);

        return this;
    }

    parse() {
        this.transformVars().parseFrames();
        return this;
    }

    reverse() {
        this.reversed = !this.reversed;
        return this;
    }

    fillForwards() {
        this.transformFrames(this.options.duration);
    }

    fillBackwards() {
        this.transformFrames(0);
    }

    transformFrames(t: number) {
        return this.interpFrames(t, undefined, true);
    }

    interpFrames(
        t: number,
        values: Vars<ValueArray> | undefined = undefined,
        transformFrame: boolean = false,
    ) {
        t = this.reversed ? this.options.duration - t : t;
        values ??= {};

        for (let i = 0; i < this.frames.length; i++) {
            const frame = this.frames[i];

            const { start, stop } = frame.time;

            if (t < start || t > stop) {
                continue;
            }

            const s = scale(t, start, stop, 0, 1);
            const e = frame.timingFunction(s);

            const reversedValues = {};

            for (const [k, v] of Object.entries(frame.interpVars)) {
                const interpValue = v.start.lerp(e, v.stop, this.targets?.[0]);

                if (!transformFrame) {
                    values[k] = interpValue;
                } else {
                    reverseTransformObject(k, interpValue, reversedValues);
                }
            }

            if (transformFrame) {
                frame.transform(t, reversedValues as V);
            }
        }
    }

    async onStart() {
        this.reversed = false;
        if (
            this.options.direction === "reverse" ||
            this.options.direction === "alternate-reverse" ||
            (this.options.direction === "alternate" && this.iteration % 2 === 1)
        ) {
            this.reverse();
        }

        if (this.options.fillMode === "backwards" || this.options.fillMode === "both") {
            this.fillBackwards();
        }

        if (this.options.delay > 0) {
            this.pause();
            await sleep(this.options.delay);
            this.pause();
        }

        this.started = true;
    }

    onEnd() {
        if (this.options.fillMode === "forwards" || this.options.fillMode === "both") {
            this.fillForwards();
        } else if (
            this.options.fillMode === "none" ||
            this.options.fillMode === "backwards"
        ) {
            this.fillBackwards();
        }

        this.startTime = undefined;

        if (this.iteration === this.options.iterationCount - 1) {
            this.done = true;
            this.iteration = 0;
        } else {
            this.iteration += 1;
        }
    }

    async tick(t: number) {
        if (this.startTime === undefined) {
            await this.onStart();
            this.startTime = t + this.options.delay;
        }

        if (this.paused && this.pausedTime === 0) {
            this.pausedTime = t;
            return this.t;
        } else if (this.pausedTime > 0 && !this.paused) {
            const dt = t - this.pausedTime;
            this.startTime += dt;
            this.pausedTime = 0;
        }

        this.t = t - this.startTime;

        if (this.t >= this.options.duration) {
            this.onEnd();
            this.t = this.options.duration;
        }
        return this.t;
    }

    async draw(t: number) {
        t = await this.tick(t);

        if (this.paused) {
            return;
        }

        this.transformFrames(t);

        if (!this.done) {
            this.handleId = requestAnimationFrame(this.draw.bind(this));
        } else {
            this.reset();
            if (this.resolvePromise) {
                this.resolvePromise();
            }
        }
    }

    async play(): Promise<void> {
        return new Promise((resolve) => {
            this.resolvePromise = resolve;
            this.handleId = requestAnimationFrame(this.draw.bind(this));
        });
    }

    pause(draw: boolean = true) {
        if (this.paused && draw) {
            this.handleId = requestAnimationFrame(this.draw.bind(this));
        }
        if (this.started) {
            this.paused = !this.paused;
        }
        return this;
    }

    stop() {
        cancelAnimationFrame(this.handleId);
        this.reset();
    }

    playing() {
        return !(!this.started || this.paused);
    }

    reset() {
        this.done = false;
        this.started = false;
        this.paused = false;

        return this;
    }

    setTargets(...targets: HTMLElement[]) {
        this.targets = targets;
        return this;
    }

    group(...animations: Animation<V>[]) {
        return new AnimationGroup<V>(this, ...animations);
    }
}

export const getAnimationId = (animation: Animation<any> | string): string => {
    if (typeof animation === "string") return animation;

    return animation.name ?? String(animation.id);
};

export type Keyframes<V> = Array<
    [number | string, Partial<V>, TransformFunction<V>?, TimingFunction?]
>;

export class CSSKeyframesAnimation<V extends Vars> {
    options: AnimationOptions;
    targets: HTMLElement[];
    animation: Animation<V>;

    constructor(
        options: Partial<InputAnimationOptions> = {},
        ...targets: HTMLElement[]
    ) {
        this.options = { ...defaultOptions, ...options } as AnimationOptions;
        this.targets = targets;
    }

    setTargets(...targets: HTMLElement[]) {
        this.targets = targets;
        if (this.animation) {
            this.animation.setTargets(...targets);
        }
        return this;
    }

    initAnimation() {
        this.animation = new Animation<V>(this.options, this.targets?.[0]);
        this.options = this.animation.options;
        return this;
    }

    fromKeyframesDefaultTransform(keyframes: Record<string, Partial<V>>) {
        this.initAnimation();

        for (const [percent, frame] of Object.entries(keyframes)) {
            this.animation.frame(
                parseCSSPercent(percent),
                frame,
                this.transform.bind(this),
            );
        }

        this.animation.parse();

        return this;
    }

    fromVars(vars: V[], transform?: TransformFunction<V>) {
        this.initAnimation();
        transform = transform ?? this.transform.bind(this);

        for (let i = 0; i < vars.length; i++) {
            const v = vars[i];
            const percent = Math.round((i / (vars.length - 1)) * 100);
            this.animation.frame(percent, v, transform);
        }
        this.animation.parse();
        return this;
    }

    fromKeyframes(keyframes: Keyframes<V>) {
        this.initAnimation();

        for (const [percent, vars, transform, timingFunction] of keyframes) {
            this.animation.frame(
                percent,
                vars,
                transform,
                getTimingFunction(timingFunction),
            );
        }

        this.animation.parse();

        return this;
    }

    fromCSSKeyframes(
        keyframes: string | Record<string, Partial<V>>,
        transform?: TransformFunction<V>,
    ) {
        this.initAnimation();
        transform = transform ?? this.transform.bind(this);

        const frames =
            typeof keyframes === "string" ? parseCSSKeyframes(keyframes) : keyframes;

        for (const [percent, frame] of Object.entries(frames)) {
            this.animation.frame(Number(percent), frame, transform);
            this.animation.transformedVars.push(frame);
        }

        this.animation.parse();

        return this;
    }

    transform(t: number, vars: any) {
        transformTargetsStyle(t, vars, this.animation.targets);
    }

    async play() {
        return await this.animation.play();
    }

    pause() {
        this.animation.pause();
        return this;
    }

    stop() {
        this.animation.stop();
        return this;
    }

    group(...animations: Array<Animation<V> | CSSKeyframesAnimation<V>>) {
        return new AnimationGroup<V>(
            this.animation,
            ...animations.map((animation) => {
                if (animation instanceof CSSKeyframesAnimation) {
                    return animation.animation;
                }
                return animation;
            }),
        );
    }
}

export interface AnimationGroupObject<V> {
    [key: string]: {
        animation: Animation<V>;
        values: Vars<ValueArray>;
    };
}

export class AnimationGroup<V> {
    animations: AnimationGroupObject<V> = {};
    transform: TransformFunction<V>;

    superKey: string | undefined;

    paused = false;
    started = false;
    done = false;

    singleTarget = true;
    handleId: number | any = undefined;
    resolvePromise: ((value: void | PromiseLike<void>) => void) | null = null;

    constructor(...animations: Animation<V>[]) {
        for (const animation of animations) {
            this.transform ??= animation.frames[0].transform;

            const name = getAnimationId(animation);

            this.animations[name] = {
                values: {},
                animation,
            };
        }

        this.singleTarget = animations.every(
            (animation) => animation.targets[0] === animations[0].targets[0],
        );
    }

    fromObject(object: Record<string, Animation<V>>) {
        const g = new AnimationGroup<V>();

        for (const [name, animation] of Object.entries(object)) {
            g.transform ??= animation.frames[0].transform;

            g.animations[name] = {
                values: {},
                animation,
            };
        }

        return g;
    }

    setSuperKey(superKey: string) {
        this.superKey = superKey;
        Object.values(this.animations).forEach((groupObject) => {
            groupObject.animation.superKey = superKey;
        });
        return this;
    }

    setTargets(...targets: HTMLElement[]) {
        Object.values(this.animations).forEach((groupObject) => {
            groupObject.animation.setTargets(...targets);
        });
        const animations = Object.values(this.animations).map(
            (groupObject) => groupObject.animation,
        );
        this.singleTarget = animations.every(
            (animation) => animation.targets[0] === animations[0].targets[0],
        );
        return this;
    }

    onStart() {
        this.started = true;
        return this;
    }

    onEnd() {
        // this.reset();
        return this;
    }

    transformFramesGrouped(t: number) {
        let groupedValues: Vars<ValueArray> = {};

        let done = true;
        for (const groupObject of Object.values(this.animations)) {
            const { animation, values } = groupObject;

            done = done && animation.done;

            if (!(animation.done || animation.paused)) {
                animation.interpFrames(animation.t, values, false);
            }

            groupedValues = Object.entries(values).reduce((acc, [key, value]) => {
                acc[key] = mergeValueObjects(acc[key], value);
                return acc;
            }, groupedValues);
        }

        this.done = done;

        const reversedVars = {};
        Object.entries(groupedValues).forEach(([key, value]: [string, ValueArray]) => {
            reverseTransformObject(key, value, reversedVars);
        });

        this.transform(t, reversedVars as V);

        return reversedVars;
    }

    async tick(t: number) {
        if (!this.started) {
            this.onStart();
        }

        Object.values(this.animations).forEach(async (groupObject) => {
            if (
                !groupObject.animation.paused ||
                groupObject.animation.pausedTime === 0
            ) {
                await groupObject.animation.tick(t);
            }
        });

        if (this.done) {
            this.onEnd();
        }

        return this;
    }

    async draw(t: number) {
        await this.tick(t);

        if (this.paused) {
            return;
        }

        if (this.singleTarget) {
            this.transformFramesGrouped(t);
        } else {
            this.done = Object.values(this.animations)
                .map(({ animation }) => {
                    animation.transformFrames(animation.t);
                    return animation;
                })
                .every((animation) => animation.done);
        }

        if (!this.done) {
            this.handleId = requestAnimationFrame(this.draw.bind(this));
        } else {
            this.reset();
            if (this.resolvePromise) {
                this.resolvePromise();
            }
        }
    }

    async play() {
        return new Promise((resolve) => {
            this.resolvePromise = resolve;
            this.handleId = requestAnimationFrame(this.draw.bind(this));
        });
    }

    pause() {
        const prevPaused = this.paused;

        if (this.started) {
            this.paused = !this.paused;
            Object.values(this.animations).forEach((groupObject) => {
                groupObject.animation.pause(false);
            });
        }

        if (prevPaused) {
            requestAnimationFrame(this.draw.bind(this));
        }

        return this;
    }

    reset() {
        Object.values(this.animations).forEach((groupObject) => {
            groupObject.animation.reset();
        });

        this.started = false;
        this.done = false;
        this.paused = false;

        return this;
    }

    stop() {
        cancelAnimationFrame(this.handleId);
        this.reset();

        return this;
    }

    playing() {
        return !(!this.started || this.paused);
    }

    forcePause() {
        this.paused = true;
        Object.values(this.animations).forEach((groupObject) => {
            groupObject.animation.paused = true;
        });
    }

    forcePlay() {
        this.paused = false;
        Object.values(this.animations).forEach((groupObject) => {
            groupObject.animation.paused = false;
        });
    }
}
