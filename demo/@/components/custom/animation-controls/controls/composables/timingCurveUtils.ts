import { CSSCubicBezier, timingFunctions } from "@mkbabb/value.js";

// Generate SVG path data for a timing function curve
export function generateCurveSVGPath(fn: (t: number) => number, n = 32): string {
    const pts: string[] = [];
    for (let i = 0; i <= n; i++) {
        const t = i / n;
        const v = fn(t);
        pts.push(`${t.toFixed(3)},${(1 - v).toFixed(3)}`);
    }
    return `M ${pts.join(" L ")}`;
}

// Step function: draw explicit staircase (not sampled)
export function generateStepSVGPath(n = 4): string {
    const parts = ["M 0,1"];
    for (let i = 0; i < n; i++) {
        const y = (1 - (i + 1) / n).toFixed(3);
        const x1 = (i / n).toFixed(3);
        const x2 = ((i + 1) / n).toFixed(3);
        parts.push(`L ${x1},${y}`, `L ${x2},${y}`);
    }
    return parts.join(" ");
}

const curvePathCache = new Map<string, string>();

export function getCurvePath(
    name: string,
    timingFunctionsAnd: Record<string, any>,
): string {
    const cached = curvePathCache.get(name);
    if (cached) return cached;

    let path: string;
    if (name === "cubic-bezier") {
        path = generateCurveSVGPath(CSSCubicBezier(0.4, 0, 0.2, 1));
    } else if (name === "steps") {
        path = generateStepSVGPath(4);
    } else if (name === "step-start") {
        path = generateStepSVGPath(1);
    } else if (name === "step-end") {
        path = "M 0,1 L 1,1 L 1,0";
    } else {
        const fn = timingFunctionsAnd[name];
        path =
            typeof fn === "function"
                ? generateCurveSVGPath(fn)
                : generateCurveSVGPath((t: number) => t);
    }

    curvePathCache.set(name, path);
    return path;
}
