import { $ } from "yajr/src/dollar";

import { smoothAnimate } from "./animation";

import { clamp, easeInOutCubic } from "./math";

function createProgressBar(
    el: HTMLElement,
    colors: string | any[],
    leftAttrs: any,
    rightAttrs: any
) {
    let i = 0;
    for (const color of colors) {
        const shape = $(document.createElement("div"));

        if (i === 0) {
            shape.setattr(leftAttrs);
        }
        if (i === colors.length - 1) {
            shape.setattr(rightAttrs);
        }

        shape.classList.add("progress-bar");

        if (String(color).indexOf("gradient") !== -1) {
            shape.style.backgroundImage = color;
        } else {
            shape.style.backgroundColor = color;
        }
        el.appendChild(shape);
        i++;
    }
}

async function animateProgressBar(
    el: HTMLElement,
    to: number,
    from: number,
    duration: any,
    stops?: number
) {
    to = to === undefined ? 1 : to;
    from = from === undefined ? 0 : from;
    duration = duration === undefined ? 1000 : duration;
    stops = stops === undefined ? el.children.length : stops;

    const elStep = Math.floor(stops / el.children.length);

    const setProgressBar = function (el: { children: any }, t: any) {
        const step = 1 / stops;
        let s = t;

        for (const child of el.children) {
            let v = 0;
            for (let i = 0; i < elStep; i++) {
                if (s > 0) {
                    if (s - step > 0) {
                        v += step;
                    } else {
                        v += s;
                    }
                    s -= step;
                } else {
                    break;
                }
            }
            child.style.width = `${100 * v}%`;
        }
    };

    let elArray: any[];
    if (!(el instanceof Array)) {
        elArray = [el];
    } else {
        elArray = el;
    }

    for (const el of elArray) {
        el.setAttribute("percent-complete", to);
    }

    const transformFunc = function (v: any) {
        for (const el of elArray) {
            setProgressBar(el, v);
        }
        return false;
    };

    await smoothAnimate(to, from, duration, transformFunc, easeInOutCubic);
}

async function animateProgressBarWrapper(
    el: HTMLElement,
    duration: number,
    stops: number
) {
    duration = duration === undefined ? 1000 : duration;
    stops = stops === undefined ? el.children.length : stops;

    const step = 1 / stops;

    const from = parseFloat(el.getAttribute("percent-complete")) || 0;
    const to = clamp(from + step, 0, 1);

    await animateProgressBar(el, to, from, duration, stops);
}
