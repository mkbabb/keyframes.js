export function clamp(x: number, lowerLimit: number, upperLimit: number): number {
    if (x < lowerLimit) {
        return lowerLimit;
    } else if (x > upperLimit) {
        return upperLimit;
    }
    return x;
}

export function scale(
    t: number,
    x1: number,
    x2: number,
    y1: number = 0,
    y2: number = 1
) {
    const m = (y2 - y1) / (x2 - x1);
    return (t - x1) * m + y1;
}

export function lerp(t: number, from: number, to: number) {
    return (1 - t) * from + t * to;
}

export function logerp(t: number, from: number, to: number) {
    from = from === 0 ? 1e-9 : from;
    const tt = from * Math.pow(to / from, t);
    return tt;
}

export function deCasteljau(t: number, points: number[]) {
    const n = points.length - 1;
    const b = [...points];

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

export function interpBezier(t: number, points: number[][]) {
    const x = points.map((xy) => xy[0]);
    const y = points.map((xy) => xy[1]);
    return [deCasteljau(t, x), deCasteljau(t, y)];
}

export function svgCubicBezier(x1: number, y1: number, x2: number, y2: number) {
    let path = `M${0} ${0}`;
    let points = `
    <circle cx="${x1}" cy="${y1}"/>
    <circle cx="${0}" cy="${0}"/>
    <circle cx="${x2}" cy="${y2}"/>
    <circle cx="${1}" cy="${1}"/>`;

    for (let t = 0; t <= 1; t += 0.01) {
        const [x, y] = cubicBezier(t, x1, y1, x2, y2);
        path += ` L${x} ${y}`;
    }

    return `<g transform="scale(1, -1) ">${points}<path d="${path}"/></g>`;
}
