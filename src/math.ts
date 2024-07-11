// Constrains a value between a lower and upper bound
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

// Linear mapping of a value from one range to another
export function scale(
    value: number,
    fromMin: number,
    fromMax: number,
    toMin: number = 0,
    toMax: number = 1,
) {
    // Calculate slope of the linear function
    const slope = (toMax - toMin) / (fromMax - fromMin);
    // Apply linear transformation
    return (value - fromMin) * slope + toMin;
}

// Linear interpolation between two values
export function lerp(t: number, start: number, end: number) {
    // t is the interpolation factor [0, 1]
    return (1 - t) * start + t * end;
}

// Logarithmic interpolation between two values
export function logerp(t: number, start: number, end: number) {
    // Prevent division by zero or log(0)
    start = start === 0 ? 1e-9 : start;
    // Interpolate in logarithmic space
    return start * Math.pow(end / start, t);
}

// De Casteljau's algorithm for Bézier curve evaluation
export function deCasteljau(t: number, points: number[]) {
    const n = points.length - 1;
    const b = [...points];
    // Iteratively interpolate points
    for (let i = 1; i <= n; i++) {
        for (let j = 0; j <= n - i; j++) {
            b[j] = lerp(t, b[j], b[j + 1]);
        }
    }
    return b[0];
}

// Cubic Bézier curve evaluation
export function cubicBezier(t: number, x1: number, y1: number, x2: number, y2: number) {
    // Evaluate x and y components separately
    return [deCasteljau(t, [0, x1, x2, 1]), deCasteljau(t, [0, y1, y2, 1])];
}

// Generalized Bézier curve interpolation
export function interpBezier(t: number, points: number[][]) {
    // Separate x and y coordinates
    const xCoords = points.map((xy) => xy[0]);
    const yCoords = points.map((xy) => xy[1]);
    // Interpolate x and y separately
    return [deCasteljau(t, xCoords), deCasteljau(t, yCoords)];
}

export function cubicBezierToSVG(x1: number, y1: number, x2: number, y2: number) {
    let path = `M${0} ${0}`;

    let points = `
    <circle cx="${x1}" cy="${y1}"/>
    <circle cx="${0}" cy="${0}"/>
    <circle cx="${x2}" cy="${y2}"/>
    <circle cx="${1}" cy="${1}"/>`;

    for (let t = 0; t <= 1; t += 0.001) {
        const [x, y] = cubicBezier(t, x1, y1, x2, y2);
        path += ` L${x} ${y}`;
    }

    return `<path d="${path}"/>`;
}

export function cubicBezierToString(x1: number, y1: number, x2: number, y2: number) {
    const formatNumber = (n: number) => {
        let s = n.toFixed(2);
        return s;
    };

    return `cubic-bezier(${formatNumber(x1)}, ${formatNumber(y1)}, ${formatNumber(x2)}, ${formatNumber(y2)})`;
}
