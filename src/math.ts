export function clamp(x: number, lowerLimit: number, upperLimit: number): number {
    if (x < lowerLimit) {
        return lowerLimit;
    } else if (x > upperLimit) {
        return upperLimit;
    }
    return x;
}

export function normalize(x0: number, min: number, max: number): number {
    return (x0 - min) / (max - min);
}

export function deCasteljau(t: number, points: number[]) {
    const n = points.length - 1;
    let b = [...points];

    for (let i = 1; i <= n; i++) {
        for (let j = 0; j <= n - i; j++) {
            b[j] = lerp(t, b[j], b[j + 1]);
        }
    }
    return b[0];
}

export function cubicBezier(t: number, x1: number, y1: number, x2: number, y2: number) {
    return [deCasteljau(t, [0, x1, x2, 1]), deCasteljau(t, [0, y1, y2, 1])];
}

export function easeInBounce(
    t: number,
    from: number,
    distance: number,
    duration: number
) {
    t = cubicBezier(t / duration, 0.09, 0.91, 0.5, 1.5)[1];
    return distance * t + from;
}

export function bounceInEase(
    t: number,
    from: number,
    distance: number,
    duration: number
) {
    t = cubicBezier(t / duration, 0.19, -0.53, 0.83, 0.67)[1];
    return distance * t + from;
}

export function easeInQuad(
    t: number,
    from: number,
    distance: number,
    duration: number
) {
    return distance * (t /= duration) * t + from;
}

export function easeOutQuad(
    t: number,
    from: number,
    distance: number,
    duration: number
) {
    return -distance * (t /= duration) * (t - 2) + from;
}

export function easeInOutQuad(
    t: number,
    from: number,
    distance: number,
    duration: number
) {
    if ((t /= duration / 2) < 1) return (distance / 2) * t * t + from;
    return (-distance / 2) * (--t * (t - 2) - 1) + from;
}

export function easeInCubic(
    t: number,
    from: number,
    distance: number,
    duration: number
) {
    return distance * (t /= duration) * t * t + from;
}

export function easeOutCubic(
    t: number,
    from: number,
    distance: number,
    duration: number
) {
    return distance * ((t = t / duration - 1) * t * t + 1) + from;
}

export function easeInOutCubic(
    t: number,
    from: number,
    distance: number,
    duration: number
) {
    if ((t /= duration / 2) < 1) return (distance / 2) * t * t * t + from;
    return (distance / 2) * ((t -= 2) * t * t + 2) + from;
}

export function smoothStep3(
    t: number,
    from: number,
    distance: number,
    duration: number
) {
    t /= duration;
    return distance * Math.pow(t, 2) * (3 - 2 * t) + from;
}

export function lerpIn(t: number, from: number, distance: number, duration: number) {
    return distance * (t /= duration) + from;
}

export function lerp(t: number, from: number, to: number) {
    return (1 - t) * from + t * to;
}

export function logerp(t: number, from: number, to: number) {
    from = from === 0 ? 1e-9 : from;
    const tt = from * Math.pow(to / from, t);
    return tt;
}

export function interpBezier(t: number, points: number[][]) {
    const x = points.map((xy) => xy[0]);
    const y = points.map((xy) => xy[1]);
    return [deCasteljau(t, x), deCasteljau(t, y)];
}

export function bounceInEaseHalf(
    t: number,
    from: number,
    distance: number,
    duration: number
) {
    const points = [
        [0, 0],
        [0.026, 1.746],
        [0.633, 1.06],
        [1, 0]
    ];
    t = interpBezier(t / duration, points)[1];
    return distance * t + from;
}
