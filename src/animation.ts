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
import { clamp, scale } from "./math";
import { Value } from "./units";
import { interpolateObject, reverseTransformObject, transformObject } from "./utils";

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
    start: Value | any;
    stop: Value | any;
    distance?: number;
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
        distance: number;
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
        distance: stop - start,
    };
}

function seekPreviousFrame(
    ix: number,
    frames: TemplateFrame<any>[],
    pred: (f: TemplateFrame<any>) => boolean
) {
    for (let i = ix - 1; i >= 0; i--) {
        if (pred(frames[i])) {
            return i;
        }
    }
    return undefined;
}

export function parseTemplateFrame<V extends Vars>(
    ix: number,
    templateFrames: TemplateFrame<V>[],
    transformedFrameVars: InterpVars[],
    duration: number,
    frames: Frame<V>[]
): Frame<V> {
    const [startFrame, endFrame] = [templateFrames[ix], templateFrames[ix + 1]];
    const time = calcFrameTime(startFrame, endFrame, duration);

    const interpVarValues: InterpVars = {};

    const allVars = [
        ...new Set([...Object.keys(startFrame.vars), ...Object.keys(endFrame.vars)]),
    ];

    const createInterpVarValue = (v: string, startIx: number, endIx: number) => {
        return {
            start: transformedFrameVars[startIx][v],
            stop: transformedFrameVars[endIx][v],
        };
    };

    allVars.forEach((v) => {
        if (v in startFrame.vars && v in endFrame.vars) {
            // Default case - both frames have the variable
            interpVarValues[v] = createInterpVarValue(v, ix, ix + 1);
        } else if (!(v in startFrame.vars) && v in endFrame.vars) {
            // Degenerate case - only the end frame has the variable
            // Find the last frame that has the variable
            const oldFrameIx = seekPreviousFrame(
                ix,
                templateFrames,
                (f) => v in f.vars
            );
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
        const transformIx = seekPreviousFrame(ix, frames, (f) => f.transform != null);
        transform = frames[transformIx].transform;
    }
    if (ease == null) {
        const easeIx = seekPreviousFrame(ix, frames, (f) => f.ease != null);
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

export class Animation<V extends Vars> {
    duration: number;

    templateFrames: TemplateFrame<V>[];
    templateFrame: TemplateFrame<V> | undefined;

    frameId: number;
    prevId: number;

    frames: Frame<V>[];

    constructor(duration: number) {
        this.duration = duration;
        this.templateFrames = [];
        this.frames = [];
        this.frameId = 0;
        this.prevId = 0;
    }

    from<K extends Vars>(start: number, vars: Partial<K>): Animation<K> {
        if (this.frameId > 0 && this.templateFrame !== undefined) {
            this.templateFrames.push(this.templateFrame);
        }

        this.templateFrame = {
            id: this.frameId,
            start,
            vars,
        };

        this.prevId = this.frameId;
        this.frameId += 1;

        return this as unknown as Animation<K>;
    }

    transform<K extends V>(func: TransformFunction<K>) {
        if (this.templateFrame !== undefined) {
            this.templateFrame.transform = func;
        }
        return this;
    }

    ease(func: EasingFunction = bounceInEase) {
        if (this.templateFrame !== undefined) {
            this.templateFrame.ease = func;
        }
        return this;
    }

    done() {
        if (this.templateFrame !== undefined) {
            this.templateFrames.push(this.templateFrame);
            this.templateFrame = undefined;
        }

        this.templateFrames = this.templateFrames.sort((a, b) =>
            a.start > b.start ? 1 : -1
        );

        const transformedFrameVars = this.templateFrames.map((frame) =>
            transformObject(frame.vars)
        ) as InterpVars[];

        for (let i = 0; i < this.templateFrames.length - 1; i++) {
            const frame = parseTemplateFrame(
                i,
                this.templateFrames,
                transformedFrameVars,
                this.duration,
                this.frames
            );
            this.frames.push(frame);
        }
        return this;
    }

    reverse() {
        if (this.templateFrame !== undefined) {
            this.templateFrames.push(this.templateFrame);
            this.templateFrame = undefined;
        }
        const frameTimes = this.templateFrames
            .map((frame) => ({
                start: frame.start,
                transform: frame.transform,
                ease: frame.ease,
            }))
            .reverse();

        this.templateFrames.forEach((frame, i) => {
            frame.start = frameTimes[i].start;
            frame.transform = frameTimes[i].transform;
            frame.ease = frameTimes[i].ease;
        });
        this.templateFrames.reverse();
        return this;
    }

    async start() {
        let startTime = undefined as unknown as number;
        let done = false;

        const drawFunc = (t: number) => {
            if (startTime === undefined) {
                startTime = t;
            }
            const dt = clamp(t - startTime, 0, this.duration);

            this.frames
                .filter(
                    (frame: Frame<V>) => dt >= frame.time.start && dt <= frame.time.stop
                )
                .forEach((frame: Frame<V>) => {
                    const { start, stop } = frame.time;
                    const t = scale(dt, start, stop, 0, 1);
                    const s = frame.ease(t);

                    const vars = {} as InterpVars;
                    Object.entries(frame.interpVarValues).forEach(([v, value]) => {
                        vars[v] = interpolateObject(s, value.start, value.stop);
                    });
                    frame.transform(t, reverseTransformObject(vars) as V);
                });

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
}
