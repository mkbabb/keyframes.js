export function clamp(x, lowerLimit, upperLimit) {
    if (x < lowerLimit) {
        return lowerLimit;
    }
    else if (x > upperLimit) {
        return upperLimit;
    }
    return x;
}
export function normalize(x0, min, max) {
    return (x0 - min) / (max - min);
}
function deCasteljau(t, points) {
    const dp = new Map();
    const inner = function (i, j, n) {
        const key = `${n}${i}${j}`;
        if (dp.has(key)) {
            return dp.get(key);
        }
        const [b0, b1] = (() => {
            if (n == 1) {
                return [points[i], points[j]];
            }
            else {
                n -= 1;
                return [inner(i, j, n), inner(j, j + 1, n)];
            }
        })();
        const value = (1 - t) * b0 + t * b1;
        dp.set(key, value);
        return value;
    };
    return inner(0, 1, points.length - 1);
}
export function cubicBezier(t, x1, y1, x2, y2) {
    return [deCasteljau(t, [0, x1, x2, 1]), deCasteljau(t, [0, y1, y2, 1])];
}
export function easeInBounce(t, from, distance, duration) {
    t = cubicBezier(t / duration, 0.09, 0.91, 0.5, 1.5)[1];
    return distance * t + from;
}
export function bounceInEase(t, from, distance, duration) {
    t = cubicBezier(t / duration, 0.19, -0.53, 0.83, 0.67)[1];
    return distance * t + from;
}
export function easeInQuad(t, from, distance, duration) {
    return distance * (t /= duration) * t + from;
}
export function easeOutQuad(t, from, distance, duration) {
    return -distance * (t /= duration) * (t - 2) + from;
}
export function easeInOutQuad(t, from, distance, duration) {
    if ((t /= duration / 2) < 1)
        return (distance / 2) * t * t + from;
    return (-distance / 2) * (--t * (t - 2) - 1) + from;
}
export function easeInCubic(t, from, distance, duration) {
    return distance * (t /= duration) * t * t + from;
}
export function easeOutCubic(t, from, distance, duration) {
    return distance * ((t = t / duration - 1) * t * t + 1) + from;
}
export function easeInOutCubic(t, from, distance, duration) {
    if ((t /= duration / 2) < 1)
        return (distance / 2) * t * t * t + from;
    return (distance / 2) * ((t -= 2) * t * t + 2) + from;
}
export function smoothStep3(t, from, distance, duration) {
    t /= duration;
    return distance * Math.pow(t, 2) * (3 - 2 * t) + from;
}
export function lerpIn(t, from, distance, duration) {
    return distance * (t /= duration) + from;
}
export function lerp(t, from, to) {
    return (1 - t) * from + t * to;
}
export function logerp(t, from, to) {
    from = from === 0 ? 1e-9 : from;
    const tt = from * Math.pow(to / from, t);
    return tt;
}
export function interpBezier(t, points) {
    const x = points.map((xy) => xy[0]);
    const y = points.map((xy) => xy[1]);
    return [deCasteljau(t, x), deCasteljau(t, y)];
}
export function bounceInEaseHalf(t, from, distance, duration) {
    const points = [
        [0, 0],
        [0.026, 1.746],
        [0.633, 1.06],
        [1, 0]
    ];
    t = interpBezier(t / duration, points)[1];
    return distance * t + from;
}
//# sourceMappingURL=math.js.map