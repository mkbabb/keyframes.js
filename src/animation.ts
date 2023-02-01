import {
    bounceInEase,
    bounceInEaseHalf,
    easeInBounce,
    easeInCubic,
    easeInOutCubic,
    easeInOutQuad,
    easeInQuad,
    easeOutCubic,
    easeOutQuad,
    smoothStep3,
} from "./easing";
import { clamp, lerp, scale } from "./math";
import { parseCSSKeyframes, ValueArray, ValueUnit } from "./units";
import {
    reverseTransformObject,
    sleep,
    TransformedVars,
    transformObject,
} from "./utils";

export const easingFunctions = {
    easeInQuad,
    easeOutQuad,
    easeInOutQuad,
    easeInCubic,
    easeOutCubic,
    easeInOutCubic,
    easeInBounce,
    bounceInEase,
    bounceInEaseHalf,
    smoothStep3,
};

type InterpValue = {
    start: ValueArray;
    stop: ValueArray;
};

type Vars = {
    [arg: string]: number | string | any;
};

type InterpVars = {
    [arg: string]: InterpValue;
};

type TransformFunction<V> = (t: number, v: V) => void;
type EasingFunction = (t: number) => number;

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
    };
    interpVarValues: InterpVars;
    transform: TransformFunction<V>;
    ease: EasingFunction;
}

function calcFrameTime<V extends Vars>(
    startFrame: TemplateFrame<V>,
    endFrame: TemplateFrame<V>,
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
    templateFrames: TemplateFrame<V>[],
    transformedVars: TransformedVars[],
    duration: number,
    frames: Frame<V>[]
): Frame<V> {
    const [startFrame, endFrame] = [templateFrames[ix], templateFrames[ix + 1]];
    const [startVars, endVars] = [transformedVars[ix], transformedVars[ix + 1]];

    const time = calcFrameTime(startFrame, endFrame, duration);

    const interpVarValues: InterpVars = {};

    const allVars = [...new Set([...Object.keys(startVars), ...Object.keys(endVars)])];

    const createInterpVarValue = (v: string, startIx: number, endIx: number) => {
        return {
            start: transformedVars[startIx][v],
            stop: transformedVars[endIx][v],
        };
    };

    allVars.forEach((v) => {
        if (v in startVars && v in endVars) {
            // Default case - both frames have the variable
            interpVarValues[v] = createInterpVarValue(v, ix, ix + 1);
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
            oldFrame.interpVarValues[v] = createInterpVarValue(v, oldFrameIx, ix + 1);
        }
    });

    let transform = startFrame.transform;
    let ease = startFrame.ease;

    if (transform == null) {
        const transformIx = seekPreviousValue(ix, frames, (f) => f.transform != null);
        transform = frames[transformIx].transform;
    }
    if (ease == null) {
        const easeIx = seekPreviousValue(ix, frames, (f) => f.ease != null);
        ease = frames[easeIx]?.ease ?? easeInOutCubic;
    }

    return {
        id: startFrame.id,
        time,
        interpVarValues,
        transform,
        ease,
    };
}

type AnimationOptions = {
    duration?: number;
    delay?: number;
    iterations?: number;
    direction?: "normal" | "reverse" | "alternate" | "alternate-reverse";
    fillMode?: "none" | "forwards" | "backwards" | "both";
    ease?: EasingFunction;
};

const defaultOptions: AnimationOptions = {
    duration: 1000,
    delay: 0,
    iterations: 1,
    direction: "normal",
    fillMode: "none",
    ease: easeInOutCubic,
};

const waitUntil = async (condition: () => boolean, delay: number = 1000 / 60) => {
    return await new Promise<void>((resolve, reject) => {
        const interval = setInterval(() => {
            if (condition()) {
                clearInterval(interval);
                resolve();
            }
        }, delay);
    });
};

export class Animation<V extends Vars> {
    options: AnimationOptions;

    templateFrames: TemplateFrame<V>[] = [];
    transformedVars: TransformedVars[] = [];

    frameId: number = 0;
    frames: Frame<V>[] = [];

    paused: boolean = false;
    startTime: number = undefined;
    pausedTime: number = 0;
    prevTime: number = 0;
    done: boolean = false;
    t: number;
    lerpRange = [0, 1];

    constructor(
        options: Partial<AnimationOptions>,
        public target: HTMLElement = document.documentElement
    ) {
        this.options = { ...defaultOptions, ...options };
    }

    frame<K extends V>(
        start: number,
        vars: Partial<K>,
        transform?: TransformFunction<K>,
        ease?: EasingFunction
    ): Animation<K> {
        const templateFrame = {
            id: this.frameId,
            start,
            vars,
            transform,
            ease: ease ?? this.options.ease,
        } as TemplateFrame<K>;

        this.templateFrames.push(templateFrame);
        this.frameId += 1;

        return this as unknown as Animation<K>;
    }

    parseVars() {
        this.transformedVars = this.templateFrames.map((frame) => {
            return transformObject(frame.vars);
        });
        return this;
    }

    parseFrames() {
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

    parse() {
        this.parseVars().parseFrames();
        return this;
    }

    reverse() {
        const reversedFrames = this.templateFrames
            .map((frame) => {
                return {
                    start: frame.start,
                    transform: frame.transform,
                    ease: frame.ease,
                };
            })
            .reverse();
        this.templateFrames.forEach((frame, n) => {
            Object.assign(frame, reversedFrames[n]);
        });
        this.parseFrames();
        this.lerpRange.reverse();
        return this;
    }

    fillForwards() {
        this.lerpFrames(this.options.duration);
    }

    fillBackwards() {
        this.lerpFrames(0);
    }

    lerpFrames(t: number, reversedVars: TransformedVars = {}) {
        for (let i = 0; i < this.frames.length; i++) {
            const frame = this.frames[i];
            const { start, stop } = frame.time;

            if (t < start || t > stop) {
                continue;
            }

            const s = scale(t, start, stop, this.lerpRange[0], this.lerpRange[1]);
            const e = frame.ease(s);

            for (const [key, values] of Object.entries(frame.interpVarValues)) {
                const lerped = values.start.lerp(e, values.stop, this.target);
                reverseTransformObject(key, lerped, reversedVars);
            }

            frame.transform(t, reversedVars as V);
        }
    }

    async onStart() {
        if (this.options.fillMode === "backwards" || this.options.fillMode === "both") {
            this.fillBackwards();
        }
        if (this.options.delay > 0) {
            await sleep(this.options.delay);
        }
        this.done = false;
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
        this.done = true;
        this.startTime = undefined;
        this.pausedTime = 0;
        this.prevTime = 0;
    }

    async draw(t: number) {
        if (this.startTime === undefined) {
            this.onStart();
            this.startTime = t;
        }

        t = t - this.startTime;
        const dt = t - this.prevTime;
        this.prevTime = t;

        if (this.paused) {
            this.pausedTime += dt;
            return requestAnimationFrame(this.draw.bind(this));
        } else {
            this.startTime += this.pausedTime;
            t -= this.pausedTime;
            this.pausedTime = 0;
        }

        this.t = t;

        if (t >= this.options.duration) {
            return this.onEnd();
        } else {
            this.lerpFrames(t);
            return requestAnimationFrame(this.draw.bind(this));
        }
    }

    async play() {
        if (
            this.options.direction === "reverse" ||
            this.options.direction === "alternate-reverse"
        ) {
            this.reverse();
        }
        for (let i = 0; i < this.options.iterations; i++) {
            if (
                i > 0 &&
                (this.options.direction === "alternate" ||
                    this.options.direction === "alternate-reverse")
            ) {
                this.reverse();
            }
            requestAnimationFrame(this.draw.bind(this));
            await sleep(this.options.duration);
            await waitUntil(() => this.done);
        }
    }
}

export const keyframesTransform = (target: HTMLElement) => (t: number, vars) => {
    for (const [key, value] of Object.entries(vars)) {
        if (typeof value === "object") {
            vars[key] = Object.entries(value)
                .map(([key, value]) => {
                    return `${key}(${value})`;
                })
                .join(" ");
        }
        target.style[key] = vars[key];
    }
};

export function keyframes(
    target: HTMLElement,
    keyframes: Record<number, any>,
    options: Partial<AnimationOptions> = {}
) {
    const anim = new Animation(options, target);
    const transform = keyframesTransform(target);

    for (const [key, vars] of Object.entries(keyframes)) {
        anim.frame(parseInt(key), vars, transform);
    }

    return anim;
}

export function CSSKeyframesToAnimation(
    target: HTMLElement,
    keyframes: string,
    options: Partial<AnimationOptions> = {}
) {
    const frames = parseCSSKeyframes(keyframes);

    const anim = new Animation(options, target);
    const transform = keyframesTransform(target);

    for (const [percent, frame] of Object.entries(frames)) {
        anim.frame(Number(percent), frame, transform);
        anim.transformedVars.push(frame);
    }

    anim.parseFrames();
    return anim;
}
