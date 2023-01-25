import { clamp, lerp, lerpIn } from "./math";
import {
    interpolateObject,
    reverseTransformObject,
    sleep,
    transformObject,
    Value,
} from "./utils";

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
type EasingFunction = (
    t: number,
    from: number,
    distance: number,
    duration: number
) => number;

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

export function animationLoop(drawFunc: (t: number) => undefined | boolean) {
    function animationLoop(t: number) {
        if (drawFunc(t)) {
            return;
        } else {
            requestAnimationFrame(animationLoop);
        }
    }
    requestAnimationFrame(animationLoop);
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
            interpVarValues[v] = createInterpVarValue(v, ix, ix + 1);
        } else if (!(v in startFrame.vars) && v in endFrame.vars) {
            for (let i = ix - 1; i >= 0; i--) {
                if (v in templateFrames[i].vars) {
                    const frame = frames[i];
                    frame.time = calcFrameTime(templateFrames[i], endFrame, duration);
                    frame.interpVarValues[v] = createInterpVarValue(v, i, ix + 1);
                    break;
                }
            }
        }
    });

    return {
        id: startFrame.id,
        time,
        interpVarValues,
        transform: startFrame?.transform ?? (() => {}),
        ease: startFrame?.ease ?? lerpIn,
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

    ease(func: EasingFunction) {
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
                    const { start, stop, distance } = frame.time;
                    const t = frame.ease(dt - start, 0, 1, distance);
                    const vars = {} as InterpVars;

                    Object.entries(frame.interpVarValues).forEach(([v, value]) => {
                        vars[v] = interpolateObject(t, value.start, value.stop);
                    });
                    frame.transform(t, reverseTransformObject(vars) as V);
                });

            return dt >= this.duration;
        };
        animationLoop(drawFunc);
        return await sleep(this.duration);
    }

    async infinite() {
        return await this.start().then(async () => await this.infinite());
    }
}
