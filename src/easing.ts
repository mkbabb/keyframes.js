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
