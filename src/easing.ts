import { cubicBezier, interpBezier } from "./math";

export function linear(t: number) {
    return t;
}

export function easeInQuad(t: number) {
    return t * t;
}

export function easeOutQuad(t: number) {
    return -t * (t - 2);
}

export function easeInOutQuad(t: number) {
    if ((t /= 0.5) < 1) return 0.5 * t * t;
    return -0.5 * (--t * (t - 2) - 1);
}

export function easeInCubic(t: number) {
    return t * t * t;
}

export function easeOutCubic(t: number) {
    return (t = t - 1) * t * t + 1;
}

export function easeInOutCubic(t: number) {
    if ((t /= 0.5) < 1) return 0.5 * t * t * t;
    return 0.5 * ((t -= 2) * t * t + 2);
}

export function smoothStep3(t: number) {
    return t * t * (3 - 2 * t);
}

export const CSSCubicBezier =
    (x1: number, y1: number, x2: number, y2: number) => (t: number) => {
        {
            t = cubicBezier(t, x1, y1, x2, y2)[1];
            return t;
        }
    };

export function easeInBounce(t: number) {
    t = CSSCubicBezier(0.09, 0.91, 0.5, 1.5)(t);
    return t;
}

export function bounceInEase(t: number) {
    t = CSSCubicBezier(0.09, 0.91, 0.5, 1.5)(t);
    return t;
}

export function bounceInEaseHalf(t: number) {
    const points = [
        [0, 0],
        [0.026, 1.746],
        [0.633, 1.06],
        [1, 0],
    ];
    t = interpBezier(t, points)[1];
    return t;
}

export function bounceOutEase(t: number) {
    const points = [
        [0, 0],
        [0.367, 0.94],
        [0.974, 0.254],
        [1, 0],
    ];
    t = interpBezier(t, points)[1];
    return t;
}

export function bounceOutEaseHalf(t: number) {
    const points = [
        [0, 0],
        [0.026, 1.746],
        [0.633, 1.06],
        [1, 0],
    ];
    t = interpBezier(t, points)[1];
    return t;
}

export function bounceInOutEase(t: number) {
    const points = [
        [0, 0],
        [0.026, 1.746],
        [0.633, 1.06],
        [1, 0],
    ];
    t = interpBezier(t, points)[1];
    return t;
}

export function easeInSine(t: number) {
    return 1 - Math.cos((t * Math.PI) / 2);
}

export function easeOutSine(t: number) {
    return Math.sin((t * Math.PI) / 2);
}

export function easeInOutSine(t: number) {
    return -(Math.cos(Math.PI * t) - 1) / 2;
}

export function easeInCirc(t: number) {
    return 1 - Math.sqrt(1 - t * t);
}

export function easeOutCirc(t: number) {
    return Math.sqrt(1 - --t * t);
}

export function easeInOutCirc(t: number) {
    if ((t /= 0.5) < 1) return -(Math.sqrt(1 - t * t) - 1) / 2;
    return (Math.sqrt(1 - (t -= 2) * t) + 1) / 2;
}

export function easeInExpo(t: number) {
    return t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
}

export function easeOutExpo(t: number) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function easeInOutExpo(t: number) {
    if (t === 0) return 0;
    if (t === 1) return 1;
    if ((t /= 0.5) < 1) return 0.5 * Math.pow(2, 10 * (t - 1));
    return 0.5 * (2 - Math.pow(2, -10 * --t));
}

export const jumpTerms = [
    "jump-start",
    "jump-end",
    "jump-none",
    "jump-both",
    "start",
    "end",
    "both",
] as const;

function jumpStart(t: number, steps: number): number {
    return Math.floor(t * steps) / steps;
}

function jumpEnd(t: number, steps: number): number {
    return Math.ceil(t * steps) / steps;
}

function jumpBoth(t: number, steps: number): number {
    return t === 0 || t === 1 ? t : jumpStart(t, steps);
}

function jumpNone(t: number, steps: number): number {
    return Math.round(t * steps) / steps;
}

export function steppedEase(
    steps: number,
    jumpTerm: (typeof jumpTerms)[number] = "jump-start",
) {
    switch (jumpTerm) {
        case "jump-none":
            return (t: number) => jumpNone(t, steps);
        case "jump-start":
        case "start":
            return (t: number) => jumpStart(t, steps);
        case "jump-end":
        case "end":
            return (t: number) => jumpEnd(t, steps);
        case "jump-both":
        case "both":
            return (t: number) => jumpBoth(t, steps);
    }
}

export function stepStart() {
    return steppedEase(1, "jump-start");
}

export function stepEnd() {
    return steppedEase(1, "jump-end");
}

export const bezierPresets = {
    ease: [0.25, 0.1, 0.25, 1],
    "ease-in": [0.42, 0, 1, 1],
    "ease-out": [0, 0, 0.58, 1],
    "ease-in-out": [0.42, 0, 0.58, 1],
    "ease-in-back": [0.6, -0.28, 0.735, 0.045],
    "ease-out-back": [0.175, 0.885, 0.32, 1.275],
    "ease-in-out-back": [0.68, -0.55, 0.265, 1.55],
} as const;

export const timingFunctions = {
    linear,
    easeInQuad,
    "ease-in-quad": easeInQuad, // "easeInQuad",

    easeOutQuad,
    "ease-out-quad": easeOutQuad, // "easeOutQuad",

    easeInOutQuad,
    "ease-in-out-quad": easeInOutQuad, // "easeInOutQuad",

    easeInCubic,
    "ease-in-cubic": easeInCubic,

    easeOutCubic,
    "ease-out-cubic": easeOutCubic,

    easeInOutCubic,
    "ease-in-out-cubic": easeInOutCubic,

    easeInBounce,
    "ease-in-bounce": easeInBounce, // "easeInBounce",

    bounceInEase,
    "bounce-in-ease": bounceInEase,

    bounceInEaseHalf,
    "bounce-in-ease-half": bounceInEaseHalf,

    bounceOutEase,
    "bounce-out-ease": bounceOutEase,

    bounceOutEaseHalf,
    "bounce-out-ease-half": bounceOutEaseHalf,

    bounceInOutEase,
    "bounce-in-out-ease": bounceInOutEase,

    easeInSine,
    "ease-in-sine": easeInSine,

    easeOutSine,
    "ease-out-sine": easeOutSine,

    easeInOutSine,
    "ease-in-out-sine": easeInOutSine,

    easeInCirc,
    "ease-in-circ": easeInCirc,

    easeOutCirc,
    "ease-out-circ": easeOutCirc,

    easeInOutCirc,
    "ease-in-out-circ": easeInOutCirc,

    easeInExpo,
    "ease-in-expo": easeInExpo,

    easeOutExpo,
    "ease-out-expo": easeOutExpo,

    easeInOutExpo,
    "ease-in-out-expo": easeInOutExpo,

    smoothStep3,
    "smooth-step-3": smoothStep3,

    ease: CSSCubicBezier(...bezierPresets.ease),
    "ease-in": CSSCubicBezier(...bezierPresets["ease-in"]),
    "ease-out": CSSCubicBezier(...bezierPresets["ease-out"]),
    "ease-in-out": CSSCubicBezier(...bezierPresets["ease-in-out"]),
    "ease-in-back": CSSCubicBezier(...bezierPresets["ease-in-back"]),
    "ease-out-back": CSSCubicBezier(...bezierPresets["ease-out-back"]),
    "ease-in-out-back": CSSCubicBezier(...bezierPresets["ease-in-out-back"]),
    steps: steppedEase,
    "step-start": stepStart,
    "step-end": stepEnd,
} as const;
