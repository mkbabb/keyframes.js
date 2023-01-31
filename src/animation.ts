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

const AnimationDirection = {
    normal: "normal",
    reverse: "reverse",
    alternate: "alternate",
    alternateReverse: "alternate-reverse",
} as const;

export class Animation<V extends Vars> {
    templateFrames: TemplateFrame<V>[] = [];
    transformedVars: TransformedVars[] = [];

    frameId: number = 0;
    prevId: number = 0;

    lerpRange = [0, 1];

    frames: Frame<V>[] = [];
    reversed: boolean = false;

    constructor(
        public duration: number,
        public delay: number = 0,
        public iterations: number = Infinity,
        public direction: string = AnimationDirection.normal
    ) {}

    frame<K extends Vars>(
        start: number,
        vars: Partial<K>,
        transform?: TransformFunction<K>,
        ease: EasingFunction = easeInQuad
    ): Animation<K> {
        const templateFrame = {
            id: this.frameId,
            start,
            vars,
            transform,
            ease,
        };
        this.templateFrames.push(templateFrame);

        this.prevId = this.frameId;
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
                this.duration,
                this.frames
            );
            this.frames.push(frame);
        }
        return this;
    }

    done() {
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
        this.templateFrames.reverse();
        this.transformedVars.reverse();
        this.parseFrames();
        return this;
    }

    async start() {
        if (this.delay > 0) {
            await sleep(this.delay);
        }
        let startTime = undefined as unknown as number;
        let done = false;

        const drawFunc = (t: number) => {
            if (startTime === undefined) {
                startTime = t;
            }
            const dt = clamp(t - startTime, 0, this.duration);

            for (let i = 0; i < this.frames.length; i++) {
                const frame = this.frames[i];
                const { start, stop } = frame.time;

                if (!(dt >= frame.time.start && dt <= frame.time.stop)) {
                    continue;
                }

                const t = scale(dt, start, stop, this.lerpRange[0], this.lerpRange[1]);
                const s = frame.ease(t);

                const reversed = {} as any;

                for (const [key, values] of Object.entries(frame.interpVarValues)) {
                    const lerped = values.start.lerp(s, values.stop);
                    reverseTransformObject(key, lerped, reversed);
                }

                frame.transform(t, reversed);
            }

            if (dt < this.duration) {
                requestAnimationFrame(drawFunc);
            } else {
                done = true;
            }
        };

        requestAnimationFrame(drawFunc);

        return new Promise((resolve) => {
            const interval = setInterval(() => {
                if (done) {
                    clearInterval(interval);
                    resolve();
                }
            }, 1000 / 60);
        });
    }

    async loop() {
        for (let i = 0; i < this.iterations; i++) {
            await this.start();
            this.reverse();
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
    }

    Object.assign(target.style, vars);
};

export function keyframes(
    target: HTMLElement,
    keyframes: Record<number, any>,
    duration: number = 1000
) {
    const anim = new Animation(duration);
    const transform = keyframesTransform(target);

    for (const [key, vars] of Object.entries(keyframes)) {
        anim.frame(parseInt(key), vars, transform);
    }

    return anim;
}

export function CSSKeyframesToAnimation(
    target: HTMLElement,
    keyframes: string,
    duration: number = 1000,
) {
    const frames = parseCSSKeyframes(keyframes);

    const anim = new Animation(duration);
    const transform = keyframesTransform(target);

    for (const [percent, frame] of Object.entries(frames)) {
        anim.frame(Number(percent), frame, transform);
        anim.transformedVars.push(frame);
    }

    anim.parseFrames();
    return anim;
}
