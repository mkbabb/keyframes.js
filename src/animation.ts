import { easeInOutCubic, timingFunctions } from "./easing";
import { scale } from "./math";
import { parseCSSKeyframes, parseCSSPercent, parseCSSTime } from "./parsing/keyframes";
import { CSSValueUnit } from "./parsing/units";
import {
    TransformedVars,
    ValueArray,
    ValueUnit,
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
            // Find the last frame that has the variable
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

type AnimationOptions = {
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

type InputAnimationOptions = {
    duration: number | string;
    delay: number | string;
    iterationCount: number | "infinite";
    direction: typeof defaultOptions.direction;
    fillMode: typeof defaultOptions.fillMode;
    timingFunction: TimingFunction | TimingFunctionNames;
};

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

// const normalizeFrameStartTime = (frame: TemplateAnimationFrame<any>, duration: number) => {
//     let value = frame.start.value;

//     if (frame.start.unit === "s") {
//         value = (value / duration) * 100;
//     }

//     if (frame.start.unit === "ms") {
//         frame.start.unit = "%";

//         const nextTime = i > 0 ? this.templateFrames[i - 1].start.value : 0;

//         const msValue =
//             (nextTime * this.options.duration) / 100 + frame.start.value;
//         const percent = (msValue / this.options.duration) * 100;

//         frame.start.value = percent;
//     }
// }

let nextId = 0;

export class Animation<V extends Vars> {
    id: number = nextId++;
    options: AnimationOptions;

    templateFrames: TemplateAnimationFrame<V>[] = [];
    transformedVars: TransformedVars[] = [];

    frameId: number = 0;
    frames: AnimationFrame<V>[] = [];

    startTime: number | undefined = undefined;
    pausedTime: number = 0;
    prevTime: number = 0;
    t: number = 0;

    iteration: number = 0;

    started: boolean = false;
    done: boolean = false;
    reversed: boolean = false;
    paused: boolean = false;

    constructor(
        options: Partial<InputAnimationOptions>,
        public target: HTMLElement | undefined = undefined,
    ) {
        this.options = { ...defaultOptions, ...options } as AnimationOptions;

        this.parseOptions(options);
    }

    frame<K extends V>(
        start: number | string,
        vars: Partial<K>,
        transform?: TransformFunction<K>,
        timingFunction?: TimingFunction | TimingFunctionNames,
    ): Animation<K> {
        start = typeof start === "number" ? String(start) + "%" : start;
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

    transformVars() {
        this.transformedVars = this.templateFrames.map((frame) => {
            return transformObject(frame.vars);
        });
        return this;
    }

    parseFrames() {
        for (let i = 0; i < this.templateFrames.length; i++) {
            const frame = this.templateFrames[i];

            // Normalize start time to percentage
            if (frame.start.unit === "ms") {
                frame.start.unit = "%";

                const nextTime = i > 0 ? this.templateFrames[i - 1].start.value : 0;

                const msValue =
                    (nextTime * this.options.duration) / 100 + frame.start.value;
                const percent = (msValue / this.options.duration) * 100;

                frame.start.value = percent;
            }
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

    updateTimingFunction(timingFunction: TimingFunction | TimingFunctionNames) {
        this.options.timingFunction = getTimingFunction(timingFunction);
        return this;
    }

    updateIterationCount(iterationCount: number | string | "infinite") {
        if (iterationCount === "infinite") {
            this.options.iterationCount = Infinity;
        } else if (typeof iterationCount === "string") {
            this.options.iterationCount = parseFloat(iterationCount);
        } else {
            this.options.iterationCount = iterationCount;
        }
        return this;
    }

    updateDuration(duration: number | string) {
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

    updateDelay(delay: number | string) {
        if (typeof delay === "string") {
            delay = parseCSSTime(delay);
        }
        this.options.delay = delay;
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

    pause(draw: boolean = true) {
        if (this.paused && draw) {
            requestAnimationFrame(this.draw.bind(this));
        }
        if (this.started) {
            this.paused = !this.paused;
        }
        return this;
    }

    playing() {
        return !(!this.started || this.paused);
    }

    reset() {
        this.startTime = undefined;
        return this;
    }

    fillForwards() {
        this.transformFrames(this.options.duration);
    }

    fillBackwards() {
        this.transformFrames(0);
    }

    transformFrames(t: number) {
        t = this.reversed ? this.options.duration - t : t;

        for (let i = 0; i < this.frames.length; i++) {
            const frame = this.frames[i];
            const { start, stop } = frame.time;

            if (t < start || t > stop) {
                continue;
            }

            const s = scale(t, start, stop, 0, 1);
            const e = frame.timingFunction(s);

            const reversedVars = {};
            for (const [k, v] of Object.entries(frame.interpVars)) {
                const newValue = v.start.lerp(e, v.stop, this.target);

                reverseTransformObject(k, newValue, reversedVars);
            }

            frame.transform(t, reversedVars as V);
        }
    }

    interpFrames(t: number, values: Vars<ValueArray>) {
        t = this.reversed ? this.options.duration - t : t;

        for (let i = 0; i < this.frames.length; i++) {
            const frame = this.frames[i];
            const { start, stop } = frame.time;

            if (t < start || t > stop) {
                continue;
            }

            const s = scale(t, start, stop, 0, 1);
            const e = frame.timingFunction(s);

            for (const [k, v] of Object.entries(frame.interpVars)) {
                values[k] = v.start.lerp(e, v.stop, this.target);
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

        this.reset();

        if (this.iteration === this.options.iterationCount - 1) {
            this.done = true;
            this.iteration = 0;
        } else {
            this.iteration += 1;
        }
    }

    tick(t: number) {
        if (this.startTime === undefined) {
            this.onStart();
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

    draw(t: number) {
        t = this.tick(t);

        if (this.paused) {
            return;
        }

        this.transformFrames(t);

        if (!this.done) {
            requestAnimationFrame(this.draw.bind(this));
        }
    }

    play() {
        requestAnimationFrame(this.draw.bind(this));
    }
}

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

    addTargets(...targets: HTMLElement[]) {
        this.targets = targets;
        if (this.animation) {
            this.animation.target = targets[0];
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

        this.animation.parseFrames();

        return this;
    }

    transform(t: number, vars: any) {
        transformTargetsStyle(t, vars, this.targets);
    }

    play() {
        return this.animation.play();
    }

    pause() {
        this.animation.pause();
        return this;
    }
}

export interface AnimationGroupObject<V> {
    animation: Animation<V>;
    values: Vars<ValueArray>;
}

export class AnimationGroup<V> {
    animationGroup: AnimationGroupObject<V>[] = [];
    transform: TransformFunction<V>;

    paused = false;
    started = false;
    done = false;

    constructor(...animations: Animation<V>[]) {
        this.transform = animations[0].frames[0].transform;

        for (const animation of animations) {
            this.animationGroup.push({
                values: {},
                animation,
            });
        }
    }

    reset() {
        this.animationGroup.forEach((groupObject) => {
            groupObject.animation.reset();
        });
        this.started = false;
        this.done = false;
        this.paused = false;
        return this;
    }

    onStart() {
        this.started = true;
        return this;
    }

    onEnd() {
        this.reset();
        this.done = true;
        return this;
    }

    pause() {
        const prevPaused = this.paused;

        if (this.started) {
            this.paused = !this.paused;
            this.animationGroup.forEach((groupObject) => {
                groupObject.animation.pause(false);
            });
        }
        if (prevPaused) {
            requestAnimationFrame(this.draw.bind(this));
        }

        return this;
    }

    playing() {
        return !(!this.started || this.paused);
    }

    transformFrames(t: number) {
        let groupedValues: Vars<ValueArray> = {};

        let done = true;
        for (const groupObject of this.animationGroup) {
            const { animation, values } = groupObject;

            done = done && animation.done;

            if (!(animation.done || animation.paused)) {
                animation.interpFrames(animation.t, values);
            }

            groupedValues = { ...values, ...groupedValues };
        }
        this.done = done;

        const reversedVars = {};
        Object.entries(groupedValues).forEach(([key, value]: [string, ValueArray]) => {
            reverseTransformObject(key, value, reversedVars);
        });

        this.transform(t, reversedVars as V);

        return reversedVars;
    }

    tick(t: number) {
        if (!this.started) {
            this.onStart();
        }

        for (const groupObject of this.animationGroup) {
            if (
                !groupObject.animation.paused ||
                groupObject.animation.pausedTime === 0
            ) {
                groupObject.animation.tick(t);
            }
        }

        if (this.done) {
            this.onEnd();
        }
        return this;
    }

    draw(t: number) {
        this.tick(t);

        if (this.paused) {
            return;
        }

        this.transformFrames(t);

        if (!this.done) {
            requestAnimationFrame(this.draw.bind(this));
        }
    }

    play() {
        this.onStart();
        requestAnimationFrame(this.draw.bind(this));
        return this;
    }
}
