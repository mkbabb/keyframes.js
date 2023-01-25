import { clamp, lerp, lerpIn } from "./math";
import { transformValue, Value } from "./utils";
import { color, rgb, RGBColor } from "d3-color";

type InterpValue = {
    start: number;
    stop: number;
    distance?: number;
    unit?: string;
};

type Vars = {
    [arg: string]: number | string;
};

type InterpVars = {
    [arg: string]: InterpValue;
};

type doFunc = (t: number, v: Vars) => void;
type easeFunc = (t: number, from: number, distance: number, duration: number) => number;

interface TemplateFrame {
    id: number;
    start: number;
    vars: Vars;
    do?: doFunc;
    ease?: easeFunc;
}

interface Frame {
    id: number;
    time: Partial<InterpValue>;
    vars: Vars;
    interpVarValues: InterpVars;
    do: doFunc;
    ease: easeFunc;
}

export function animationLoop(drawFunc: (t: number) => undefined | boolean): void {
    function animationLoop(t: number) {
        if (drawFunc(t)) {
            return;
        } else {
            requestAnimationFrame(animationLoop);
        }
    }

    requestAnimationFrame(animationLoop);
}

export function parseFrame(
    startFrame: TemplateFrame,
    endFrame: TemplateFrame,
    duration: number
): Frame {
    let [start, stop] = [startFrame.start, endFrame.start];
    start = (start * duration) / 100;
    stop = (stop * duration) / 100;
    console.log("hey");

    const time: Partial<InterpValue> = {
        start,
        stop,
        distance: stop - start,
    };

    const allVars = [
        ...new Set([...Object.keys(startFrame.vars), ...Object.keys(endFrame.vars)]),
    ];

    const interpVarValues: InterpVars = {};
    const vars: Vars = {};

    const addVar = (v: string, start: number, stop: number, unit: string = "") => {
        interpVarValues[v] = {
            start,
            stop,
            distance: stop - start,
            unit,
        };
        vars[v] = 0;
    };

    allVars
        .filter((v) => v in startFrame.vars && v in endFrame.vars)
        .forEach((v) => {
            const startValue = transformValue(startFrame.vars[v]);
            const endValue = transformValue(endFrame.vars[v]);

            console.log(startFrame.vars[v], endFrame.vars[v]);

            if (typeof startValue === "number" && typeof endValue === "number") {
                addVar(v, startValue, endValue);
            } else if (
                startValue?.value !== undefined &&
                endValue?.value !== undefined
            ) {
                addVar(v, startValue.value, endValue.value, startValue.unit);
            } else if (
                startValue?.r !== undefined &&
                startValue?.g !== undefined &&
                startValue?.b !== undefined
            ) {
                Object.entries(startValue).forEach(([k, colorValue]) => {
                    const key = `${v}-${k}`;
                    addVar(key, colorValue, endValue[k]);
                });
            }
        });

    return {
        id: startFrame.id,
        time,
        vars,
        interpVarValues,
        do: startFrame?.do ?? (() => {}),
        ease: startFrame?.ease ?? lerpIn,
    };
}

export class Animation {
    duration: number;

    templateFrames: TemplateFrame[];
    templateFrame: TemplateFrame | undefined;

    frameId: number;
    prevId: number;

    frames: Frame[];

    constructor(duration: number) {
        this.duration = duration;
        this.templateFrames = [];
        this.frames = [];
        this.frameId = 0;
        this.prevId = 0;
    }

    from(start: number, vars: Vars) {
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

        return this;
    }

    do(func: doFunc) {
        if (this.templateFrame !== undefined) {
            this.templateFrame.do = func;
        }
        return this;
    }

    ease(func: easeFunc) {
        if (this.templateFrame !== undefined) {
            this.templateFrame.ease = func;
        }
        return this;
    }

    done() {
        if (this.templateFrame !== undefined) {
            this.templateFrames.push(this.templateFrame);
        }

        this.templateFrames = this.templateFrames.sort((a, b) =>
            a.start > b.start ? 1 : -1
        );
        console.log("hey")

        for (let i = 0; i < this.templateFrames.length - 1; i++) {
            const startFrame = this.templateFrames[i];
            const endFrame = this.templateFrames[i + 1];

            const frame = parseFrame(startFrame, endFrame, this.duration);

            this.frames.push(frame);
        }
    }

    start(): void {
        let startTime = undefined as unknown as number;

        const drawFunc = (t: number) => {
            if (startTime === undefined) {
                startTime = t;
            }

            const dt = t - startTime;
            const c = clamp(dt, 0, this.duration);

            this.frames
                .filter(
                    (frame: Frame) => c >= frame.time.start! && c <= frame.time.stop!
                )
                .forEach((frame: Frame) => {
                    const { start, distance } = frame.time;

                    const s = clamp(c - start!, 0, distance!);
                    const t = frame.ease(s, 0, 1, distance!);

                    Object.entries(frame.interpVarValues).forEach(([v, value]) => {
                        frame.vars[v] = lerp(t, value.start, value.stop);
                    });

                    frame.do(t, frame.vars);
                });

            return dt >= this.duration;
        };

        return animationLoop(drawFunc);
    }
}
