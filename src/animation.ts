import {
    clamp,
    bounceInEase,
    easeInOutCubic,
    smoothStep3,
    lerp,
    lerpIn
} from "./math.js";

import { getOffset, sleep } from "./utils.js";

class Clock {
    timeStep: number;
    timeOut: number;
    startTime: number;
    prevTime: number;
    elapsedTime: number;
    elapsedFrames: number;
    running: boolean;
    delta: number;

    constructor(timeStep = 1000 / 60, timeOut = 120) {
        this.timeStep = Math.floor(timeStep);
        this.timeOut = timeOut;
    }
    start() {
        this.startTime = performance.now();
        this.prevTime = this.startTime;
        this.elapsedTime = 0;
        this.elapsedFrames = 0;
        this.running = true;
        this.delta = 0;
    }
    stop() {
        this.running = false;
    }
    reset() {
        this.start();
    }
    tick() {
        this.delta = 0;

        if (this.running) {
            const currentTime = performance.now();

            this.delta = currentTime - this.prevTime;

            this.prevTime = currentTime;
            this.elapsedTime += this.delta;
        } else {
            this.start();
        }

        return this.delta;
    }
}

export function animationLoop(
    drawFunc: (clock: any) => undefined | boolean,
    timeStep = 1000 / 60
) {
    const clock = new Clock(timeStep);

    async function animationLoop() {
        clock.tick();

        if (drawFunc(clock)) {
            return;
        } else {
            requestAnimationFrame(animationLoop);
        }
    }
    requestAnimationFrame(animationLoop);
}

type InterpValue = {
    start: number;
    stop: number;
    distance?: number;
};

type VarValues = {
    [arg: string]: number;
};

type doFunc = (t: number, v: VarValues) => void;
type easeFunc = (t: number, from: number, distance: number, duration: number) => number;

const defaultDo = (t: number, v: VarValues) => {};
const defaultEase = lerpIn;

interface Frame {
    id: number;
    time?: InterpValue;
    vars?: InterpValue;
    varValues?: VarValues;

    do?: doFunc;
    ease?: easeFunc;
}

interface TemplateFrame {
    id: number;
    start: number;
    vars: VarValues;
    do?: doFunc;
    ease?: easeFunc;
}

export class Animation {
    duration: number;

    templateFrames: TemplateFrame[];
    templateFrame: TemplateFrame;

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

    from(start: number, vars: VarValues) {
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

    do(func: doFunc) {
        this.templateFrame.do = func;
        return this;
    }

    ease(func: easeFunc) {
        this.templateFrame.ease = func;
        return this;
    }

    done() {
        this.templateFrames.push(this.templateFrame);

        this.templateFrames = this.templateFrames.sort((a, b) =>
            a.start > b.start ? 1 : -1
        );

        for (let i = 0; i < this.templateFrames.length - 1; i++) {
            const startFrame = this.templateFrames[i];
            const endFrame = this.templateFrames[i + 1];

            let [start, stop] = [startFrame.start, endFrame.start];

            if (start == stop) {
            }

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
            const varValues: VarValues = {};

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
                vars: <InterpValue>vars,
                varValues: varValues,
                do: startFrame.do,
                ease: startFrame.ease
            };

            this.frames.push(frame);
        }
    }

    async start() {
        const drawFunc = (clock: Clock) => {
            const c = clamp(clock.elapsedTime, 0, this.duration);
            const error = clock.timeStep;

            this.frames.forEach((frame) => {
                const { start, stop, distance } = frame.time;

                if (c >= start - error && c <= stop + error) {
                    const s = clamp(c - start, 0, distance);
                    const t = frame.ease(s, 0, 1, distance);

                    for (const v in frame.varValues) {
                        const varTime = frame.vars[v];
                        frame.varValues[v] = lerp(t, varTime.start, varTime.stop);
                    }

                    frame.do(t, frame.varValues);
                }
            });

            if (clock.elapsedTime >= this.duration) {
                return true;
            } else {
                return false;
            }
        };

        animationLoop(drawFunc);

        return await sleep(this.duration);
    }
}

/**
 * Legacy
 */

export async function smoothAnimateInternal(
    duration: number,
    transformFunc: (t: number) => void,
    timingFunc: (t: number, from: number, distance: number, duration: number) => number
) {
    function drawFunc(clock: Clock): boolean {
        const c = clamp(clock.elapsedTime, 0, duration);
        const t = timingFunc(c, 0, 1, duration);

        transformFunc(t);

        if (clock.elapsedTime >= duration) {
            return true;
        } else {
            return false;
        }
    }

    animationLoop(drawFunc);

    await sleep(duration);
}

async function smoothAnimate(
    to: number,
    from: number,
    duration: number,
    transformFunc: (v: number, t?: number) => undefined | boolean,
    timingFunc: (t: number, from: number, distance: number, duration: number) => number
) {
    const wrapper = (t: number) => {
        const v = lerp(t, from, to);
        return transformFunc(v, t);
    };

    smoothAnimateInternal(duration, wrapper, timingFunc);
}

async function blockCSSTimingTransition(
    el: HTMLElement | Array<HTMLElement>,
    func: (...args: any) => any
) {
    const elArray = !(el instanceof Array) ? [el] : el;

    const transitions = elArray.map(function (el) {
        const trans = el.style.transition;
        el.style.transition = "none";
        return trans;
    });

    await func();

    elArray.forEach(function (el, index) {
        el.style.transition = transitions[index];
    });
}

async function animateElements(
    el: HTMLElement | Array<HTMLElement>,
    to = window.innerWidth,
    from = 0,
    duration = 1000,
    transformFunc?: (el: HTMLElement, v: number) => undefined | boolean,
    timingFunc = easeInOutCubic
): Promise<void> {
    const elArray = !(el instanceof Array) ? [el] : el;

    const wrap = function (v: number) {
        for (const el of elArray) {
            transformFunc(el, v);
        }
        return false;
    };

    const animate = async function () {
        await smoothAnimate(to, from, duration, wrap, timingFunc);
    };

    await blockCSSTimingTransition(elArray, animate);
}

async function slideRight(
    el: HTMLElement | Array<HTMLElement>,
    to?: number,
    from?: number,
    duration?: number
) {
    const transformFunc = function (el: HTMLElement, v: number) {
        el.style.transform = `translateX(${v}px)`;
        return false;
    };
    await animateElements(el, to, from, duration, transformFunc);
}

async function slideLeft(
    el: HTMLElement | Array<HTMLElement>,
    to?: number,
    from?: number,
    duration?: number
) {
    const transformFunc = function (el: HTMLElement, v: number) {
        el.style.transform = `translateX(${v}px)`;
        return false;
    };
    await animateElements(el, to, from, duration, transformFunc);
}

async function fadeOut(el: HTMLElement | Array<HTMLElement>, duration?: number) {
    const to = 1;
    const from = 0;

    const transformFunc = function (el: HTMLElement, v: number) {
        el.style.opacity = String(to - v);
        return false;
    };
    await animateElements(el, to, from, duration, transformFunc);
}

async function smoothRotate(
    el: HTMLElement | Array<HTMLElement>,
    to: number,
    from: number,
    duration: number,
    rad = false
) {
    const suffix = rad ? "rad" : "deg";

    const transformFunc = function (el: HTMLElement, v: number) {
        el.style.transform = `rotate(${v}${suffix})`;
        el.setAttribute("rotation", String(v));
        return false;
    };
    await animateElements(el, to, from, duration, transformFunc);
}

async function rippleButton(
    ev: MouseEvent,
    buttonEl: HTMLElement,
    rippleEl: HTMLElement,
    to: number,
    from: number,
    duration: number
) {
    const buttonOffset = getOffset(buttonEl);

    const centerX = buttonOffset.left + buttonOffset.width / 2;
    const centerY = buttonOffset.top + buttonOffset.height / 2;

    const x = ev.pageX - centerX;
    const y = ev.pageY - centerY;

    Object.assign(rippleEl.style, {
        transform: `translate(${x}px, ${y}px)`,
        width: 0,
        height: 0
    });

    const transformFunc = function (v: number, t: number) {
        const r = `${v}rem`;

        Object.assign(rippleEl.style, {
            opacity: String(1 - t),
            width: r,
            height: r
        });

        return false;
    };
    await smoothAnimate(to, from, duration, transformFunc, smoothStep3);
}

async function slideRightWrap(
    el: HTMLElement,
    to: number,
    from: number,
    duration: number,
    func: (...args: any) => any
) {
    const width = window.innerWidth;
    const time = duration / 3;

    await slideRight(el, width, 0, time);

    el.classList.add("hidden");
    func();

    await slideLeft(el, -width, width, time);

    el.classList.remove("hidden");

    await slideRight(el, to, from - width, time);
}

async function smoothScroll(to: any, from: any, duration: any) {
    const transformFunc = function (v: number) {
        window.scroll(0, v);
        return false;
    };
    await smoothAnimate(to, from, duration, transformFunc, bounceInEase);
}

export {
    sleep,
    smoothAnimate,
    animateElements,
    smoothScroll,
    smoothRotate,
    slideLeft,
    slideRight,
    slideRightWrap,
    fadeOut,
    rippleButton
};
