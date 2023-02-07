import { easeInOutCubic, timingFunctions } from "./easing";
import { clamp, scale } from "./math";
import {
    parseCSSKeyframes,
    parseCSSPercent,
    parseCSSTime,
    reverseCSSTime,
} from "./parsing/keyframes";
import {
    FunctionValue,
    reverseTransformObject,
    TransformedVars,
    transformObject,
    ValueArray,
} from "./units";
import { camelCaseToHyphen, sleep } from "./utils";

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

function calcFrameTime<V extends Vars>(
    startFrame: TemplateAnimationFrame<V>,
    endFrame: TemplateAnimationFrame<V>,
    duration: number
) {
    let [start, stop] = [startFrame.start, endFrame.start];
    start = (start * duration) / 100;
    stop = (stop * duration) / 100;
    return {
        start,
        stop,
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
    frames: AnimationFrame<V>[]
): AnimationFrame<V> {
    const [startFrame, endFrame] = [templateFrames[ix], templateFrames[ix + 1]];
    const [startVars, endVars] = [transformedVars[ix], transformedVars[ix + 1]];

    const time = calcFrameTime(startFrame, endFrame, duration);

    const interpVars: InterpVars = {};

    const allVars = [...new Set([...Object.keys(startVars), ...Object.keys(endVars)])];

    const createInterpVarValue = (
        v: string,
        startIx: number,
        endIx: number
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
                duration
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
    timingFunction: keyof typeof timingFunctions | TimingFunction;
};

const defaultOptions: AnimationOptions = {
    duration: 1000,
    delay: 0,
    iterationCount: 1,
    direction: "normal",
    fillMode: "forwards",
    timingFunction: easeInOutCubic,
};

const getTimingFunction = (
    timingFunction: keyof typeof timingFunctions | TimingFunction
): TimingFunction | typeof timingFunction | undefined => {
    if (typeof timingFunction === "string") {
        return timingFunctions[timingFunction];
    } else if (timingFunction == null) {
        return undefined;
    }
    return timingFunction;
};

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
        options: Partial<AnimationOptions>,
        public target: HTMLElement = document.documentElement
    ) {
        this.options = { ...defaultOptions, ...options };
        this.options.timingFunction = getTimingFunction(this.options.timingFunction);
    }

    frame<K extends V>(
        start: number,
        vars: Partial<K>,
        transform?: TransformFunction<K>,
        timingFunction?: TimingFunction
    ): Animation<K> {
        const templateFrame = {
            id: this.frameId,
            start,
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
        this.templateFrames.sort((a, b) => a.start - b.start);

        for (let i = 0; i < this.templateFrames.length - 1; i++) {
            const frame = parseTemplateFrame(
                i,
                this.templateFrames,
                this.transformedVars,
                this.options.duration,
                this.frames
            );
            this.frames.push(frame);
        }
        return this;
    }

    updateIterationCount(iterationCount: number | "infinite") {
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

    parse() {
        this.transformVars().parseFrames();
        return this;
    }

    reverse() {
        this.reversed = !this.reversed;
        return this;
    }

    pause() {
        if (this.paused) {
            requestAnimationFrame(this.draw.bind(this));
        }
        if (this.started) {
            this.paused = !this.paused;
        }
        return this;
    }

    reset() {
        this.startTime = undefined;
        this.pausedTime = 0;
        this.prevTime = 0;
        this.t = 0;

        this.started = false;
        this.paused = false;

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
                reverseTransformObject(
                    k,
                    v.start.lerp(e, v.stop, this.target),
                    reversedVars
                );
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

        this.t = clamp(t - this.startTime, 0, this.options.duration);

        if (this.t === this.options.duration) {
            this.onEnd();
            return this.options.duration;
        } else {
            return this.t;
        }
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

export function reverseTransformStyle(t: number, vars: any) {
    for (const [key, value] of Object.entries(vars)) {
        if (typeof value === "object") {
            let s = "";
            for (const [k, v] of Object.entries(value)) {
                s += v.includes("(") ? v : `${k}(${v}) `;
            }
            vars[key] = s;
        }
    }
    return vars;
}

function transformTargetsStyle(t: number, vars: any, targets: HTMLElement[]) {
    for (const [key, value] of Object.entries(vars)) {
        if (typeof value === "object") {
            let s = "";
            for (const [k, v] of Object.entries(value)) {
                s += v.includes("(") ? v : `${k}(${v}) `;
            }
            vars[key] = s;
        }
        targets.forEach((target) => {
            target.style[key] = vars[key];
        });
    }
}

export class CSSKeyframesAnimation<V extends Vars> {
    options: AnimationOptions;
    targets: HTMLElement[];
    animation: Animation<V>;

    constructor(options: Partial<AnimationOptions> = {}, ...targets: HTMLElement[]) {
        this.options = { ...defaultOptions, ...options };
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
        return this;
    }

    fromFramesDefaultTransform(keyframes: Record<string, Partial<V>>) {
        this.initAnimation();

        for (const [percent, frame] of Object.entries(keyframes)) {
            this.animation.frame(
                parseCSSPercent(percent),
                frame,
                this.transform.bind(this)
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

    fromFrames(keyframes: Record<string, Keyframe<V>>) {
        this.initAnimation();

        for (const [percent, frame] of Object.entries(keyframes)) {
            const [vars, transform, timingFunction] = frame;
            this.animation.frame(
                parseCSSPercent(percent),
                vars,
                transform,
                getTimingFunction(timingFunction)
            );
        }

        this.animation.parse();

        return this;
    }

    fromCSSKeyframes(keyframes: string) {
        this.initAnimation();

        const frames = parseCSSKeyframes(keyframes);

        for (const [percent, frame] of Object.entries(frames)) {
            this.animation.frame(Number(percent), frame, this.transform.bind(this));
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
        if (this.paused) {
            requestAnimationFrame(this.draw.bind(this));
        }
        if (this.started) {
            this.paused = !this.paused;
            this.animationGroup.forEach((groupObject) => {
                groupObject.animation.paused = this.paused;
            });
        }
        return this;
    }

    transformFrames(t: number) {
        let groupedValues: Vars<ValueArray> = {};

        let done = true;
        for (const groupObject of this.animationGroup) {
            const { animation, values } = groupObject;
            done = done && animation.done;
            if (!animation.done && !animation.paused) {
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
            groupObject.animation.tick(t);
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

function objectToString(key: string, value: any) {
    if (typeof value === "object" && !(value instanceof ValueArray)) {
        return Object.entries(value)
            .map(([k, v]) => {
                // k = camelCaseToHyphen(k);
                if (v instanceof FunctionValue) {
                    return String(v);
                } else {
                    return `${k}(${v})`;
                }
            })
            .join(" ");
    } else {
        return String(value);
    }
}

import prettier from "prettier";
import parserPostCSS from "prettier/parser-postcss";

export function CSSKeyframesToString<V extends Vars>(
    animation: Animation<V>,
    name: string = "animation",
    printWidth: number = 80
): string {
    const options = animation.options;
    const keyframeCss = animation.templateFrames
        .map((frame) => {
            let css = `  ${frame.start}% {\n`;
            for (let [name, v] of Object.entries(frame.vars)) {
                name = camelCaseToHyphen(name);
                let s = objectToString(name, v);

                css += `  ${name}: ${s};\n`;
            }
            css += "  }\n";
            return css;
        })
        .join("");

    let animationCss = `.${name} {\n`;

    animationCss += `  animation-name: ${name};\n`;

    const duration = reverseCSSTime(options.duration);
    animationCss += `  animation-duration: ${duration};\n`;
    Object.entries(timingFunctions).forEach(([name, func]) => {
        if (func === options.timingFunction) {
            animationCss += `  animation-timing-function: ${name};\n`;
        }
    });
    animationCss += `  animation-iteration-count: ${
        isFinite(options.iterationCount) ? options.iterationCount : "infinite"
    };\n`;
    animationCss += `  animation-direction: ${options.direction};\n`;

    if (options.delay > 0) {
        animationCss += `  animation-delay: ${reverseCSSTime(options.delay)};\n`;
    }

    animationCss += `}\n`;

    const keyframes = `${animationCss}\n@keyframes ${name} {\n${keyframeCss}}`;

    return prettier.format(keyframes, {
        parser: "css",
        plugins: [parserPostCSS],
        printWidth,
    });
}
