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
import { scale } from "./math";
import { parseCSSKeyframes, ValueArray, ValueUnit } from "./units";
import {
    reverseTransformObject,
    sleep,
    TransformedVars,
    transformObject,
    waitUntil,
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
type InterpVars = {
    [arg: string]: InterpValue;
};

type Vars = {
    [arg: string]: number | string | any;
};

type TransformFunction<V extends Vars> = (t: number, v: V) => void;
type EasingFunction = (t: number) => number;

export interface Keyframe<V extends Vars> {
    vars: V;
    transform?: TransformFunction<V>;
    ease?: EasingFunction;
}

interface TemplateAnimationFrame<V extends Vars> {
    id: number;
    start: number;
    vars: V;
    transform?: TransformFunction<V>;
    ease?: EasingFunction;
}

interface AnimationFrame<V extends Vars> {
    id: number;
    time: {
        start: number;
        stop: number;
    };
    interpVars: InterpVars;
    transform: TransformFunction<V>;
    ease: EasingFunction;
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
        ease: startFrame.ease!,
    };
}

type AnimationOptions = {
    duration: number;
    delay: number;
    iterations: number;
    direction: "normal" | "reverse" | "alternate" | "alternate-reverse";
    fillMode: "none" | "forwards" | "backwards" | "both";
    ease: EasingFunction;
};

const defaultOptions: AnimationOptions = {
    duration: 1000,
    delay: 0,
    iterations: 1,
    direction: "normal",
    fillMode: "none",
    ease: easeInOutCubic,
};

export class Animation<V extends Vars> {
    options: AnimationOptions;

    templateFrames: TemplateAnimationFrame<V>[] = [];
    transformedVars: TransformedVars[] = [];

    frameId: number = 0;
    frames: AnimationFrame<V>[] = [];

    startTime: number | undefined = undefined;
    pausedTime: number = 0;
    prevTime: number = 0;
    t: number;

    done: boolean = false;
    reversed: boolean = false;
    paused: boolean = false;

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
        this.transformVars().parseFrames();
        return this;
    }

    reverse() {
        this.reversed = !this.reversed;
        return this;
    }

    pause() {
        this.paused = !this.paused;
        return this;
    }

    fillForwards() {
        this.interpFrames(this.options.duration);
    }

    fillBackwards() {
        this.interpFrames(0);
    }

    interpFrames(t: number, reversedVars: TransformedVars = {}) {
        t = this.reversed ? this.options.duration - t : t;

        for (let i = 0; i < this.frames.length; i++) {
            const frame = this.frames[i];
            const { start, stop } = frame.time;

            if (t < start || t > stop) {
                continue;
            }

            const s = scale(t, start, stop, 0, 1);
            const e = frame.ease(s);

            for (const [key, values] of Object.entries(frame.interpVars)) {
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
            this.interpFrames(t);
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

export class CSSKeyframesAnimation<V extends Vars> {
    options: AnimationOptions;
    targets: HTMLElement[];
    animation: Animation<V>;

    constructor(options: Partial<AnimationOptions> = {}, ...targets: HTMLElement[]) {
        this.options = { ...defaultOptions, ...options };
        this.targets = targets;
    }

    fromFrames(keyframes: Record<number, Keyframe<V>>) {
        this.animation = new Animation<V>(this.options, this.targets?.[0]);

        for (const [percent, frame] of Object.entries(keyframes)) {
            this.animation.frame(
                parseInt(percent),
                frame.vars,
                this.transform.bind(this)
            );
        }
        this.animation.parse();
        return this;
    }

    fromCSS(keyframes: string) {
        this.animation = new Animation<V>(this.options, this.targets?.[0]);

        const frames = parseCSSKeyframes(keyframes);
        for (const [percent, frame] of Object.entries(frames)) {
            this.animation.frame(Number(percent), frame, this.transform.bind(this));
            this.animation.transformedVars.push(frame);
        }
        this.animation.parseFrames();
        return this;
    }

    transform(t: number, vars: V) {
        for (const [key, value] of Object.entries(vars)) {
            if (typeof value === "object") {
                vars[key] = Object.entries(value)
                    .map(([key, value]) => {
                        return `${key}(${value})`;
                    })
                    .join(" ");
            }

            this.targets.forEach((target) => {
                target.style[key] = vars[key];
            });
        }
    }

    async play() {
        return await this.animation.play();
    }

    pause() {
        this.animation.pause();
        return this;
    }
}
