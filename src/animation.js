import { clamp, lerp, lerpIn } from "./math.js";
export function animationLoop(drawFunc) {
    function animationLoop(t) {
        if (drawFunc(t)) {
            return;
        }
        else {
            requestAnimationFrame(animationLoop);
        }
    }
    requestAnimationFrame(animationLoop);
}
const defaultDo = (t, v) => {
    return undefined;
};
const defaultEase = lerpIn;
export class Animation {
    constructor(duration) {
        this.duration = duration;
        this.templateFrames = [];
        this.frames = [];
        this.frameId = 0;
        this.prevId = 0;
    }
    from(start, vars) {
        if (this.frameId > 0) {
            this.templateFrames.push(this.templateFrame);
        }
        this.templateFrame = {
            id: this.frameId,
            start: start,
            vars: vars,
            do: defaultDo,
            ease: defaultEase
        };
        this.prevId = this.frameId;
        this.frameId += 1;
        return this;
    }
    do(func) {
        this.templateFrame.do = func;
        return this;
    }
    ease(func) {
        this.templateFrame.ease = func;
        return this;
    }
    done() {
        this.templateFrames.push(this.templateFrame);
        this.templateFrames = this.templateFrames.sort((a, b) => a.start > b.start ? 1 : -1);
        for (let i = 0; i < this.templateFrames.length - 1; i++) {
            const startFrame = this.templateFrames[i];
            const endFrame = this.templateFrames[i + 1];
            let [start, stop] = [startFrame.start, endFrame.start];
            start = (start * this.duration) / 100;
            stop = (stop * this.duration) / 100;
            const time = {
                start,
                stop,
                distance: stop - start
            };
            const uVars = new Set([
                ...Object.keys(startFrame.vars),
                ...Object.keys(endFrame.vars)
            ]);
            const vars = {};
            const varValues = {};
            for (const v of uVars) {
                if (v in startFrame.vars && v in endFrame.vars) {
                    vars[v] = {
                        start: startFrame.vars[v],
                        stop: endFrame.vars[v]
                    };
                    varValues[v] = 0;
                }
            }
            const frame = {
                id: startFrame.id,
                time: time,
                vars: vars,
                varValues: varValues,
                do: startFrame.do,
                ease: startFrame.ease
            };
            this.frames.push(frame);
        }
    }
    start() {
        let startTime = undefined;
        const drawFunc = (t) => {
            if (startTime === undefined) {
                startTime = t;
            }
            const dt = t - startTime;
            const c = clamp(dt, 0, this.duration);
            this.frames
                .filter((frame) => c >= frame.time.start && c <= frame.time.stop)
                .forEach((frame) => {
                const { start, distance } = frame.time;
                const s = clamp(c - start, 0, distance);
                const t = frame.ease(s, 0, 1, distance);
                for (const v in frame.varValues) {
                    const varTime = frame.vars[v];
                    frame.varValues[v] = lerp(t, varTime.start, varTime.stop);
                }
                frame.do(t, frame.varValues);
            });
            return dt >= this.duration;
        };
        return animationLoop(drawFunc);
    }
}
//# sourceMappingURL=animation.js.map