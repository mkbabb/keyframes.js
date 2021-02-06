export function clamp(x: number, lowerLimit: number, upperLimit: number) {
    if (x < lowerLimit) {
        return lowerLimit;
    } else if (x > upperLimit) {
        return upperLimit;
    }
    return x;
}

export function normalize(x0: number, min: number, max: number) {
    return (x0 - min) / (max - min);
}

function DeCasteljau(t: number, points: number[]) {
    const dp: Map<string, number> = new Map();

    const inner = function (
        t: number,
        points: number[],
        ix1: number,
        ix2: number,
        n: number
    ) {
        let k = `${n}${ix1}${ix2}`;

        if (dp.has(k)) {
            return dp.get(k);
        }

        let b0: number, b1: number;

        if (n == 1) {
            b0 = points[ix1];
            b1 = points[ix2];
        } else {
            n--;
            b0 = inner(t, points, ix1, ix2, n);
            b1 = inner(t, points, ix2, ix2 + 1, n);
        }
        let v = (1 - t) * b0 + t * b1;
        dp.set(k, v);

        return v;
    };
    return inner(t, points, 0, 1, points.length - 1);
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
