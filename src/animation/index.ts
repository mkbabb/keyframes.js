import { convertToMs, unflattenObject } from "@src/units/utils";
import { easeInOutCubic } from "../easing";
import { clamp, scale } from "../math";
import { parseCSSKeyframes, parseCSSPercent, parseCSSTime } from "../parsing/keyframes";
import { parseCSSValueUnit } from "../parsing/units";
import { ValueUnit } from "../units";
import {
    isObject,
    memoizeDecorator,
    requestAnimationFrame,
    seekPreviousValue,
    sleep,
} from "../utils";
import {
    AnimationFrame,
    AnimationOptions,
    InputAnimationOptions,
    TemplateAnimationFrame,
    TimingFunction,
    TimingFunctionNames,
    TransformFunction,
    Vars,
    defaultOptions,
} from "./constants";
import { AnimationGroup } from "./group";
import {
    calcFrameTime,
    createInterpVarValue,
    getTimingFunction,
    lerpValue,
    parseAndFlattenObject,
    transformTargetsStyle,
} from "./utils";

export const getAnimationId = (animation: Animation | string): string => {
    if (typeof animation === "string") return animation;
    return animation.name ?? String(animation.id);
};

let nextId = 0;

export class Animation<V extends Vars = any> {
    id: number = nextId++;
    name: string | undefined;
    superKey: string | undefined;

    targets: HTMLElement[];

    options: AnimationOptions;

    templateFrames: TemplateAnimationFrame<V>[] = [];
    parsedVars: any[] = [];

    frameId: number = 0;

    frames: AnimationFrame<V>[] = [];

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

    unflatten: boolean = true;

    private resolvePromise: ((value: void | PromiseLike<void>) => void) | null = null;

    constructor(
        options?: Partial<InputAnimationOptions>,
        targets?: HTMLElement[] | HTMLElement | undefined,
        name?: string | undefined,
        superKey?: string | undefined,
    ) {
        this.options = {} as AnimationOptions;

        this.setOptions({ ...defaultOptions, ...(options ?? {}) });

        this.targets =
            targets == null ? [] : Array.isArray(targets) ? targets : [targets];

        this.name = name;
        this.superKey = superKey;
    }

    convertFrameStart(frame: TemplateAnimationFrame<V>) {
        if (
            frame.start.unit === "s" ||
            frame.start.unit === "ms" ||
            !frame.start.unit
        ) {
            const value = convertToMs(frame.start.value, frame.start.unit);

            frame.start.value = (value / this.options.duration) * 100;
            frame.start.unit = "%";
        }
        frame.start.value = clamp(frame.start.value, 0, 100);

        return frame;
    }

    addFrame<K extends V>(
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

        const parsedStart = parseCSSValueUnit(start);

        let templateFrame = {
            id: this.frameId,
            start: parsedStart,
            vars,
            transform,
            timingFunction:
                getTimingFunction(timingFunction) ?? this.options.timingFunction,
        } as TemplateAnimationFrame<K>;

        this.convertFrameStart(templateFrame);

        this.templateFrames.push(templateFrame);
        this.frameId += 1;

        return this as unknown as Animation<K>;
    }

    createFrame(startIx: number, endIx: number): AnimationFrame<V> {
        const [startFrame, endFrame] = [
            this.templateFrames[startIx],
            this.templateFrames[endIx],
        ];

        const ixs = {
            start: startIx,
            stop: endIx,
        };

        const time = calcFrameTime(startFrame, endFrame, this.options.duration);

        let transform = startFrame.transform;

        if (transform == null) {
            const transformIx = seekPreviousValue(
                startIx,
                this.frames,
                (f) => f.transform != null,
            )!;
            transform = this.frames[transformIx].transform;
        }

        let timingFunction = startFrame.timingFunction;
        if (timingFunction == null) {
            const timingFunctionIx = seekPreviousValue(
                startIx,
                this.frames,
                (f) => f.timingFunction != null,
            )!;
            timingFunction = this.frames[timingFunctionIx].timingFunction;
        }

        const id = this.frameId++;

        return {
            id,
            ixs,
            start: startFrame.start,
            time,
            vars: undefined,
            flatVars: undefined,
            interpVars: {},
            transform,
            timingFunction,
        };
    }

    reconcileVars(ix: number) {
        const startVars = this.parsedVars[ix];

        Object.keys(startVars).forEach((v) => {
            const varIx = this.parsedVars.findIndex((f, i) => i > ix && f[v] != null);

            if (varIx === -1) {
                return;
            }

            const [startIx, endIx] = [ix, varIx];

            const frameIx = this.frames.findIndex(
                (f) => f.ixs.start === startIx && f.ixs.stop === endIx,
            );
            const frame =
                frameIx !== -1
                    ? this.frames[frameIx]
                    : this.createFrame(startIx, endIx);

            frame.interpVars[v] = createInterpVarValue(
                v,
                startIx,
                endIx,
                this.parsedVars,
            );

            if (frameIx === -1) {
                this.frames.push(frame);
            }
        });
    }

    parse() {
        this.frames = [];

        this.templateFrames.sort((a, b) => a.start.value - b.start.value);

        this.parsedVars = this.templateFrames.map((frame) => {
            const parsed = parseAndFlattenObject(frame.vars);

            Object.values(parsed).forEach((values) => {
                (values as any).setTargets(this.targets);
            });

            return parsed;
        });

        for (let i = 0; i < this.templateFrames.length - 1; i++) {
            this.frames.push(this.createFrame(i, i + 1));
        }

        // Perform variable reconciliation
        this.frames.forEach((_, ix) => this.reconcileVars(ix));

        // Sort frames by start time, then by stop time
        this.frames.sort((a, b) => {
            if (a.time.start === b.time.start) {
                return a.time.stop - b.time.stop;
            }
            return a.time.start - b.time.start;
        });

        // Filter out frames that have no interpolated variables
        this.frames = this.frames.filter(
            (frame) =>
                frame.interpVars != null && Object.keys(frame.interpVars).length > 0,
        );

        // Set the vars for each frame
        this.frames.forEach((frame) => {
            frame.flatVars = Object.entries(frame.interpVars).reduce(
                (acc, [key, value]) => {
                    acc[key] = value.map((v) => v.value);
                    return acc;
                },
                {} as any,
            );
            frame.vars = unflattenObject(frame.flatVars);
        });

        return this;
    }

    setTimingFunction(timingFunction: InputAnimationOptions["timingFunction"]) {
        this.options.timingFunction =
            getTimingFunction(timingFunction) ?? easeInOutCubic;
        return this;
    }

    setIterationCount(iterationCount: InputAnimationOptions["iterationCount"]) {
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

    setDuration(duration: InputAnimationOptions["duration"]) {
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

    setDelay(delay: InputAnimationOptions["delay"]) {
        if (typeof delay === "string") {
            delay = parseCSSTime(delay);
        }
        this.options.delay = delay;
        return this;
    }

    setDirection(direction: InputAnimationOptions["direction"]) {
        this.options.direction = direction;
        return this;
    }

    setFillMode(fillMode: InputAnimationOptions["fillMode"]) {
        this.options.fillMode = fillMode;
        return this;
    }

    setOptions(options: Partial<InputAnimationOptions>) {
        this.setTimingFunction(options.timingFunction);
        this.setDuration(options.duration);
        this.setIterationCount(options.iterationCount);
        this.setDelay(options.delay);
        this.setDirection(options.direction);
        this.setFillMode(options.fillMode);
        return this;
    }

    reverse() {
        this.reversed = !this.reversed;
        return this;
    }

    fillForwards() {
        this.interpFrames(this.options.duration, true);
    }

    fillBackwards() {
        this.interpFrames(0, true);
    }

    interpFrames(t: number, transformFrames: boolean = false) {
        t = this.reversed ? this.options.duration - t : t;

        return this.frames
            .map((frame) => {
                const { start, stop } = frame.time;

                if (t < start || t > stop) {
                    return;
                }

                const scaled = scale(t, start, stop, 0, 1);
                const eased = frame.timingFunction(scaled);

                Object.values(frame.interpVars).forEach((values: any) => {
                    values.forEach((v) => {
                        lerpValue(eased, v);
                    });
                });

                if (transformFrames) {
                    frame.transform(this.unflatten ? frame.vars : frame.flatVars, t);
                }

                return frame.flatVars;
            })
            .reduce((acc, vars) => {
                return { ...acc, ...vars };
            }, {});
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

    async onEnd() {
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
            await this.onEnd();
            this.t = this.options.duration;
        }
        return this.t;
    }

    async draw(t: number) {
        t = await this.tick(t);

        if (this.paused) {
            return;
        }

        this.interpFrames(t, true);

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

        this.frames.forEach((frame) => {
            Object.values(frame.interpVars).forEach((values) => {
                values.forEach(({ start, stop, value }) => {
                    start.setTargets(this.targets);
                    stop.setTargets(this.targets);
                    value.setTargets(this.targets);
                });
            });
        });

        return this;
    }

    group(...animations: Animation<V>[]) {
        return new AnimationGroup<V>(this, ...animations);
    }
}

export class CSSKeyframesAnimation<V extends Vars> extends Animation<V> {
    constructor(options?: Partial<InputAnimationOptions>, ...targets: HTMLElement[]) {
        super(options, targets);

        this.unflatten = false;
    }

    fromVars(vars: V[], transform?: TransformFunction<V>) {
        this.unflatten = transform != null;
        transform ??= this.transform.bind(this);

        for (let i = 0; i < vars.length; i++) {
            const v = vars[i];
            const percent = Math.round((i / (vars.length - 1)) * 100);
            this.addFrame(percent, v, transform);
        }

        this.parse();

        return this;
    }

    fromKeyframes(
        keyframes: Map<string, Partial<V>> | Record<string, Partial<V>>,
        transform?: TransformFunction<V>,
    ) {
        this.unflatten = transform != null;
        transform ??= this.transform.bind(this);

        if (isObject(keyframes)) {
            keyframes = new Map(Object.entries(keyframes));
        }

        for (const [percent, frame] of (keyframes as any).entries()) {
            this.addFrame(percent, frame, transform);
        }

        this.parse();
        return this;
    }

    fromString(keyframes: string, transform?: TransformFunction<V>) {
        this.unflatten = transform != null;
        transform ??= this.transform.bind(this);

        const p = parseCSSKeyframes(keyframes);

        for (const [percent, frame] of p.entries()) {
            this.addFrame(percent, frame, transform);
            this.parsedVars.push(frame);
        }

        this.parse();

        return this;
    }

    transform(vars: any) {
        transformTargetsStyle(vars, this.targets);
    }
}
