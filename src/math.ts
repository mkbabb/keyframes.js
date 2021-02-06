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

function DeCasteljau(t: number, points: number[]) {
    const dp: Map<string, number> = new Map();

    const inner = function (i: number, j: number, n: number) {
        const key = `${n}${i}${j}`;

        if (dp.has(key)) {
            return dp.get(key);
        }

        const [b0, b1] = (() => {
            if (n == 1) {
                return [points[i], points[j]];
            } else {
                return [inner(i, j, n - 1), inner(j, j + 1, n - 1)];
            }
        })();

        const value = (1 - t) * b0 + t * b1;
        dp.set(key, value);

        return value;
    };
    return inner(0, 1, points.length - 1);
}

export function cubicBezier(t: number, x1: number, y1: number, x2: number, y2: number) {
    return [DeCasteljau(t, [0, x1, x2, 1]), DeCasteljau(t, [0, y1, y2, 1])];
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
    let tt = from * Math.pow(to / from, t);
    return tt;
}

export function interpBezier(t: number, points: number[][]) {
    let x = points.map((xy) => xy[0]);
    let y = points.map((xy) => xy[1]);
    return [DeCasteljau(t, x), DeCasteljau(t, y)];
}

export function bounceInEaseHalf(
    t: number,
    from: number,
    distance: number,
    duration: number
) {
    let points = [
        [0, 0],
        [0.026, 1.746],
        [0.633, 1.06],
        [1, 0]
    ];
    t = interpBezier(t / duration, points)[1];
    return distance * t + from;
}
