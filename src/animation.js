import { clamp, bounceInEase, easeInOutCubic, smoothStep3, lerp, lerpIn } from "./math.js";
import { getOffset, sleep } from "./utils.js";
class Clock {
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
        }
        else {
            this.start();
        }
        return this.delta;
    }
}
export function animationLoop(drawFunc, timeStep = 1000 / 60) {
    const clock = new Clock(timeStep);
    async function animationLoop() {
        clock.tick();
        if (drawFunc(clock)) {
            return;
        }
        else {
            requestAnimationFrame(animationLoop);
        }
    }
    requestAnimationFrame(animationLoop);
}
const defaultDo = (t, v) => { };
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
    async start() {
        const drawFunc = (clock) => {
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
            }
            else {
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
export async function smoothAnimateInternal(duration, transformFunc, timingFunc) {
    function drawFunc(clock) {
        const c = clamp(clock.elapsedTime, 0, duration);
        const t = timingFunc(c, 0, 1, duration);
        transformFunc(t);
        if (clock.elapsedTime >= duration) {
            return true;
        }
        else {
            return false;
        }
    }
    animationLoop(drawFunc);
    await sleep(duration);
}
async function smoothAnimate(to, from, duration, transformFunc, timingFunc) {
    const wrapper = (t) => {
        const v = lerp(t, from, to);
        return transformFunc(v, t);
    };
    smoothAnimateInternal(duration, wrapper, timingFunc);
}
async function blockCSSTimingTransition(el, func) {
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
async function animateElements(el, to = window.innerWidth, from = 0, duration = 1000, transformFunc, timingFunc = easeInOutCubic) {
    const elArray = !(el instanceof Array) ? [el] : el;
    const wrap = function (v) {
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
async function slideRight(el, to, from, duration) {
    const transformFunc = function (el, v) {
        el.style.transform = `translateX(${v}px)`;
        return false;
    };
    await animateElements(el, to, from, duration, transformFunc);
}
async function slideLeft(el, to, from, duration) {
    const transformFunc = function (el, v) {
        el.style.transform = `translateX(${v}px)`;
        return false;
    };
    await animateElements(el, to, from, duration, transformFunc);
}
async function fadeOut(el, duration) {
    const to = 1;
    const from = 0;
    const transformFunc = function (el, v) {
        el.style.opacity = String(to - v);
        return false;
    };
    await animateElements(el, to, from, duration, transformFunc);
}
async function smoothRotate(el, to, from, duration, rad = false) {
    const suffix = rad ? "rad" : "deg";
    const transformFunc = function (el, v) {
        el.style.transform = `rotate(${v}${suffix})`;
        el.setAttribute("rotation", String(v));
        return false;
    };
    await animateElements(el, to, from, duration, transformFunc);
}
async function rippleButton(ev, buttonEl, rippleEl, to, from, duration) {
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
    const transformFunc = function (v, t) {
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
async function slideRightWrap(el, to, from, duration, func) {
    const width = window.innerWidth;
    const time = duration / 3;
    await slideRight(el, width, 0, time);
    el.classList.add("hidden");
    func();
    await slideLeft(el, -width, width, time);
    el.classList.remove("hidden");
    await slideRight(el, to, from - width, time);
}
async function smoothScroll(to, from, duration) {
    const transformFunc = function (v) {
        window.scroll(0, v);
        return false;
    };
    await smoothAnimate(to, from, duration, transformFunc, bounceInEase);
}
export { sleep, smoothAnimate, animateElements, smoothScroll, smoothRotate, slideLeft, slideRight, slideRightWrap, fadeOut, rippleButton };
//# sourceMappingURL=animation.js.map