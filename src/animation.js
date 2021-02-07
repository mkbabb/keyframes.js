import { clamp, bounceInEase, easeInOutCubic, smoothStep3 } from "./math";
import { getOffset, sleep } from "./utils";
class Clock {
    constructor(autoStart = true, timeStep = 1000 / 60, timeOut = 120) {
        this.autoStart = autoStart;
        this.timeStep = Math.floor(timeStep);
        this.timeOut = timeOut;
    }
    start() {
        this.startTime = Date.now();
        this.prevTime = this.startTime;
        this.elapsedTime = 0;
        this.elapsedTicks = 0;
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
        if (this.autoStart && !this.running) {
            this.start();
        }
        else if (this.running) {
            const currentTime = Date.now();
            this.delta = currentTime - this.prevTime;
            this.prevTime = currentTime;
            this.elapsedTime += this.delta;
            this.elapsedTicks += this.timeStep;
        }
        return this.delta;
    }
}
async function smoothAnimate(to, from, duration, transformFunc, timingFunc) {
    const distance = to - from;
    const clock = new Clock();
    let handle = null;
    function draw() {
        const c = clamp(clock.elapsedTicks, 0, duration);
        const v = timingFunc(c, from, distance, duration);
        const t = timingFunc(c, 0, 1, duration);
        return transformFunc(v, t) ?? false;
    }
    function animationLoop() {
        clock.tick();
        let delta = clock.delta;
        let updateSteps = 0;
        let force = false;
        while (delta >= clock.timeStep) {
            delta -= clock.timeStep;
            clock.tick();
            if (updateSteps++ >= clock.timeOut || force) {
                break;
            }
        }
        force = draw();
        if (force || clock.elapsedTicks / duration >= 1) {
            return true;
        }
        else {
            handle = requestAnimationFrame(animationLoop);
            return false;
        }
    }
    clock.start();
    handle = requestAnimationFrame(animationLoop);
    await sleep(duration);
    return handle;
}
function animationLoopOuter(updateFunc, drawFunc, timeStep = 1000 / 60, timeOut = 120) {
    const clock = new Clock(true, timeStep, timeOut);
    let handle = null;
    let force = false;
    let intervalId = null;
    function update() {
        return updateFunc(clock.elapsedTicks) ?? false;
    }
    function draw() {
        return drawFunc(clock.elapsedTicks) ?? false;
    }
    function animationLoop() {
        clock.tick();
        let delta = clock.delta;
        let updateSteps = 0;
        while (delta >= clock.timeStep) {
            delta -= clock.timeStep;
            clock.tick();
            if (updateSteps++ >= clock.timeOut || force) {
                break;
            }
        }
        force = force || draw();
        if (force) {
            return true;
        }
        else {
            handle = requestAnimationFrame(animationLoop);
            return false;
        }
    }
    intervalId = setInterval(() => {
        force = force || update();
        if (force) {
            clearInterval(intervalId);
            cancelAnimationFrame(handle);
        }
    }, clock.timeStep);
    clock.start();
    handle = requestAnimationFrame(animationLoop);
    return handle;
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
export { sleep, smoothAnimate, animateElements, animationLoopOuter, smoothScroll, smoothRotate, slideLeft, slideRight, slideRightWrap, fadeOut, rippleButton };
