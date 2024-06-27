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

export const CSSBezier =
    (x1: number, y1: number, x2: number, y2: number) => (t: number) => {
        {
            t = cubicBezier(t, x1, y1, x2, y2)[1];
            return t;
        }
    };

export function easeInBounce(t: number) {
    t = CSSBezier(0.09, 0.91, 0.5, 1.5)(t);
    return t;
}

export function bounceInEase(t: number) {
    t = CSSBezier(0.09, 0.91, 0.5, 1.5)(t);
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
    easeOutQuad,
    easeInOutQuad,
    easeInCubic,
    easeOutCubic,
    easeInOutCubic,
    easeInBounce,
    bounceInEase,
    bounceInEaseHalf,
    smoothStep3,

    ease: CSSBezier(...bezierPresets.ease),
    "ease-in": CSSBezier(...bezierPresets["ease-in"]),
    "ease-out": CSSBezier(...bezierPresets["ease-out"]),
    "ease-in-out": CSSBezier(...bezierPresets["ease-in-out"]),
    "ease-in-back": CSSBezier(...bezierPresets["ease-in-back"]),
    "ease-out-back": CSSBezier(...bezierPresets["ease-out-back"]),
    "ease-in-out-back": CSSBezier(...bezierPresets["ease-in-out-back"]),
    steps: steppedEase,
    "step-start": stepStart,
    "step-end": stepEnd,
} as const;
