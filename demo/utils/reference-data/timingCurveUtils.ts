import {
    CubicBezier,
    easing,
    steppedEase,
    type EasingFunction,
    type JumpPosition,
} from "@mkbabb/value.js/easing";

type EasingResult =
    | { readonly ok: true; readonly value: EasingFunction }
    | { readonly ok: false; readonly error: { readonly code: string } };

const requireEasing = (
    result: EasingResult,
    source: string,
): EasingFunction => {
    if (!result.ok) {
        throw new Error(
            `Invalid easing ${JSON.stringify(source)}: ${result.error.code}`,
        );
    }
    return result.value;
};

export const cubicBezierEasing = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
): EasingFunction =>
    requireEasing(
        CubicBezier(x1, y1, x2, y2),
        `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`,
    );

export const steppedEasing = (
    count: number,
    position: JumpPosition = "jump-end",
): EasingFunction =>
    requireEasing(steppedEase(count, position), `steps(${count}, ${position})`);

export const namedEasing = (name: string): EasingFunction => {
    if (name === "step-start") return steppedEasing(1, "jump-start");
    if (name === "step-end") return steppedEasing(1, "jump-end");
    return requireEasing(easing(name), name);
};

export function generateCurveSVGPath(fn: EasingFunction, n = 32): string {
    const pts: string[] = [];
    for (let i = 0; i <= n; i++) {
        const t = i / n;
        const v = fn(t);
        pts.push(`${t.toFixed(3)},${(1 - v).toFixed(3)}`);
    }
    return `M ${pts.join(" L ")}`;
}

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

export function getCurvePath(name: string): string {
    const cached = curvePathCache.get(name);
    if (cached) return cached;

    let path: string;
    if (name === "cubic-bezier") {
        path = generateCurveSVGPath(cubicBezierEasing(0.4, 0, 0.2, 1));
    } else if (name === "steps") {
        path = generateStepSVGPath(4);
    } else if (name === "step-start") {
        path = generateStepSVGPath(1);
    } else if (name === "step-end") {
        path = "M 0,1 L 1,1 L 1,0";
    } else {
        path = generateCurveSVGPath(namedEasing(name));
    }

    curvePathCache.set(name, path);
    return path;
}
