import { vec3, mat3 } from "gl-matrix";
import { clamp } from "../../math";


function cssFiltersToString(filters: number[]): string {
    const fmt = (idx: number, multiplier: number = 1) =>
        Math.round(filters[idx] * multiplier);

    return `invert(${fmt(0)}%) sepia(${fmt(1)}%) saturate(${fmt(2)}%) hue-rotate(${fmt(3, 3.6)}deg) brightness(${fmt(4)}%) contrast(${fmt(5)}%)`;
}

const colorToVec = (color: RGBColor | HSLColor | any): vec3 => {
    if (Array.isArray(color)) {
        return vec3.fromValues(color[0], color[1], color[2]);
    }

    if (color?.h) {
        return vec3.fromValues(color.h, color.s, color.l);
    }
    return vec3.fromValues(color.r, color.g, color.b);
};

const RGBColorToHSLColor = (color: RGBColor): HSLColor => {
    const [h, s, l] = rgb2hsl(color.r, color.g, color.b);
    return hsl(h, s, l);
};

// Constants for SPSA algorithm
const SPSA_ALPHA = 1;
const SPSA_GAMMA = 1 / 6;

const DEFAULT_A = 5;
const DEFAULT_C = 15;

// Maximum values for different filter types
const MAX_PERCENTAGE = 100;
const MAX_SATURATION = 7500;
const MAX_BRIGHTNESS_CONTRAST = 200;
const MAX_HUE_ROTATE = 360;

// Initial values for wide solve
const INITIAL_INVERT = 50;
const INITIAL_SEPIA = 20;
const INITIAL_SATURATE = 3750;
const INITIAL_HUE_ROTATE = 50;
const INITIAL_BRIGHTNESS = 100;
const INITIAL_CONTRAST = 100;

// Constants for color matrices
const RED_LUMINANCE = 0.2126;
const GREEN_LUMINANCE = 0.7152;
const BLUE_LUMINANCE = 0.0722;

function hueRotate(color: RGBColor, angle: number = 0): RGBColor {
    const sin = Math.sin((angle * Math.PI) / 180);
    const cos = Math.cos((angle * Math.PI) / 180);

    const matrix = mat3.fromValues(
        RED_LUMINANCE + cos * (1 - RED_LUMINANCE) - sin * RED_LUMINANCE,
        GREEN_LUMINANCE - cos * GREEN_LUMINANCE - sin * GREEN_LUMINANCE,
        BLUE_LUMINANCE - cos * BLUE_LUMINANCE + sin * (1 - BLUE_LUMINANCE),
        RED_LUMINANCE - cos * RED_LUMINANCE + sin * 0.143,
        GREEN_LUMINANCE + cos * (1 - GREEN_LUMINANCE) + sin * 0.14,
        BLUE_LUMINANCE - cos * BLUE_LUMINANCE - sin * 0.283,
        RED_LUMINANCE - cos * RED_LUMINANCE - sin * (1 - RED_LUMINANCE),
        GREEN_LUMINANCE - cos * GREEN_LUMINANCE + sin * GREEN_LUMINANCE,
        BLUE_LUMINANCE + cos * (1 - BLUE_LUMINANCE) + sin * BLUE_LUMINANCE,
    );

    return applyColorMatrix(color, matrix);
}

function grayscale(color: RGBColor, value: number = 1): RGBColor {
    const matrix = mat3.fromValues(
        RED_LUMINANCE + (1 - RED_LUMINANCE) * (1 - value),
        GREEN_LUMINANCE - GREEN_LUMINANCE * (1 - value),
        BLUE_LUMINANCE - BLUE_LUMINANCE * (1 - value),
        RED_LUMINANCE - RED_LUMINANCE * (1 - value),
        GREEN_LUMINANCE + (1 - GREEN_LUMINANCE) * (1 - value),
        BLUE_LUMINANCE - BLUE_LUMINANCE * (1 - value),
        RED_LUMINANCE - RED_LUMINANCE * (1 - value),
        GREEN_LUMINANCE - GREEN_LUMINANCE * (1 - value),
        BLUE_LUMINANCE + (1 - BLUE_LUMINANCE) * (1 - value),
    );

    return applyColorMatrix(color, matrix);
}

const SEPIA_RED = 0.393;
const SEPIA_GREEN = 0.769;
const SEPIA_BLUE = 0.189;

const SEPIA_RED_GREEN = 0.349;
const SEPIA_GREEN_GREEN = 0.686;
const SEPIA_BLUE_GREEN = 0.168;

const SEPIA_RED_BLUE = 0.272;
const SEPIA_GREEN_BLUE = 0.534;
const SEPIA_BLUE_BLUE = 0.131;

function sepia(color: RGBColor, value: number = 1): RGBColor {
    const matrix = mat3.fromValues(
        SEPIA_RED + (1 - SEPIA_RED) * (1 - value),
        SEPIA_GREEN - SEPIA_GREEN * (1 - value),
        SEPIA_BLUE - SEPIA_BLUE * (1 - value),
        SEPIA_RED_GREEN - SEPIA_RED_GREEN * (1 - value),
        SEPIA_GREEN_GREEN + (1 - SEPIA_GREEN_GREEN) * (1 - value),
        SEPIA_BLUE_GREEN - SEPIA_BLUE_GREEN * (1 - value),
        SEPIA_RED_BLUE - SEPIA_RED_BLUE * (1 - value),
        SEPIA_GREEN_BLUE - SEPIA_GREEN_BLUE * (1 - value),
        SEPIA_BLUE_BLUE + (1 - SEPIA_BLUE_BLUE) * (1 - value),
    );

    return applyColorMatrix(color, matrix);
}

// Saturation filter constants
const SATURATE_RED_FACTOR = 0.213;
const SATURATE_GREEN_FACTOR = 0.715;
const SATURATE_BLUE_FACTOR = 0.072;

function saturate(color: RGBColor, value: number = 1): RGBColor {
    const matrix = mat3.fromValues(
        SATURATE_RED_FACTOR + (1 - SATURATE_RED_FACTOR) * value,
        SATURATE_GREEN_FACTOR - SATURATE_GREEN_FACTOR * value,
        SATURATE_BLUE_FACTOR - SATURATE_BLUE_FACTOR * value,
        SATURATE_RED_FACTOR - SATURATE_RED_FACTOR * value,
        SATURATE_GREEN_FACTOR + (1 - SATURATE_GREEN_FACTOR) * value,
        SATURATE_BLUE_FACTOR - SATURATE_BLUE_FACTOR * value,
        SATURATE_RED_FACTOR - SATURATE_RED_FACTOR * value,
        SATURATE_GREEN_FACTOR - SATURATE_GREEN_FACTOR * value,
        SATURATE_BLUE_FACTOR + (1 - SATURATE_BLUE_FACTOR) * value,
    );

    return applyColorMatrix(color, matrix);
}

function applyColorMatrix(color: RGBColor, matrix: mat3): RGBColor {
    const result = vec3.transformMat3(vec3.create(), colorToVec(color), matrix);

    const clamped = result.map((v) => clamp(v, 0, 255));

    return rgb(clamped[0], clamped[1], clamped[2]);
}

function brightness(color: RGBColor, value: number = 1): RGBColor {
    return linear(color, value);
}

function contrast(color: RGBColor, value: number = 1): RGBColor {
    return linear(color, value, -(0.5 * value) + 0.5);
}

function linear(color: RGBColor, slope: number = 1, intercept: number = 0): RGBColor {
    const vec = colorToVec(color);
    const clamped = vec.map((v) => clamp(v * slope + intercept * 255, 0, 255));
    
    return rgb(clamped[0], clamped[1], clamped[2]);
}

function invert(color: RGBColor, value: number = 1): RGBColor {
    const vec = colorToVec(color);
    const clamped = vec.map((v) =>
        clamp((value + (v / 255) * (1 - 2 * value)) * 255, 0, 255),
    );

    return rgb(clamped[0], clamped[1], clamped[2]);
}

function loss(filters: number[], target: RGBColor, targetHSL: HSLColor): number {
    let color = rgb(0, 0, 0);

    color = invert(color, filters[0] / 100);
    color = sepia(color, filters[1] / 100);
    color = saturate(color, filters[2] / 100);
    color = hueRotate(color, filters[3] * 3.6);
    color = brightness(color, filters[4] / 100);
    color = contrast(color, filters[5] / 100);

    const colorHSL = RGBColorToHSLColor(color);

    return (
        Math.abs(color[0] - target[0]) +
        Math.abs(color[1] - target[1]) +
        Math.abs(color[2] - target[2]) +
        Math.abs(colorHSL[0] - targetHSL[0]) +
        Math.abs(colorHSL[1] - targetHSL[1]) +
        Math.abs(colorHSL[2] - targetHSL[2])
    );
}

function spsa(
    A: number,
    a: number[],
    c: number,
    values: number[],
    iters: number,
    target: RGBColor,
    targetHSL: HSLColor,
): { values: number[]; loss: number } {
    let best: number[] | null = null;
    let bestLoss = Infinity;
    const deltas = new Array(6);
    const highArgs = new Array(6);
    const lowArgs = new Array(6);

    for (let k = 0; k < iters; k++) {
        const ck = c / Math.pow(k + 1, SPSA_GAMMA);
        for (let i = 0; i < 6; i++) {
            deltas[i] = Math.random() > 0.5 ? 1 : -1;
            highArgs[i] = values[i] + ck * deltas[i];
            lowArgs[i] = values[i] - ck * deltas[i];
        }

        const lossDiff =
            loss(highArgs, target, targetHSL) - loss(lowArgs, target, targetHSL);
        for (let i = 0; i < 6; i++) {
            const g = (lossDiff / (2 * ck)) * deltas[i];
            const ak = a[i] / Math.pow(A + k + 1, SPSA_ALPHA);
            values[i] = fixValue(values[i] - ak * g, i);
        }

        const currentLoss = loss(values, target, targetHSL);
        if (currentLoss < bestLoss) {
            best = [...values];
            bestLoss = currentLoss;
        }
    }

    return { values: best!, loss: bestLoss };
}

function fixValue(value: number, idx: number): number {
    let max = MAX_PERCENTAGE;
    if (idx === 2) {
        max = MAX_SATURATION;
    } else if (idx === 4 || idx === 5) {
        max = MAX_BRIGHTNESS_CONTRAST;
    }

    if (idx === 3) {
        // For hue-rotate, we want to keep the value between 0 and 360
        return ((value % MAX_HUE_ROTATE) + MAX_HUE_ROTATE) % MAX_HUE_ROTATE;
    } else {
        return clamp(value, 0, max);
    }
}

function solveNarrow(
    wide: { values: number[]; loss: number },
    target: RGBColor,
    targetHSL: HSLColor,
): { values: number[]; loss: number } {
    const A = wide.loss;
    const c = 2;
    const A1 = A + 1;
    const a = [0.25 * A1, 0.25 * A1, A1, 0.25 * A1, 0.2 * A1, 0.2 * A1];
    return spsa(A, a, c, wide.values, 500, target, targetHSL);
}

function solveWide(
    target: RGBColor,
    targetHSL: HSLColor,
): { values: number[]; loss: number } {
    const a = [60, 180, 18000, 600, 1.2, 1.2];

    let best = { loss: Infinity, values: [] as number[] };
    for (let i = 0; i < 3; i++) {
        if (best.loss > 25) {
            const initial = [
                INITIAL_INVERT,
                INITIAL_SEPIA,
                INITIAL_SATURATE,
                INITIAL_HUE_ROTATE,
                INITIAL_BRIGHTNESS,
                INITIAL_CONTRAST,
            ];
            const result = spsa(
                DEFAULT_A,
                a,
                DEFAULT_C,
                initial,
                1000,
                target,
                targetHSL,
            );
            if (result.loss < best.loss) {
                best = result;
            }
        }
    }
    return best;
}

function solve(target: RGBColor): { values: number[]; loss: number; filter: string } {
    const targetHSL = RGBColorToHSLColor(target);
    const result = solveNarrow(solveWide(target, targetHSL), target, targetHSL);

    return {
        values: result.values,
        loss: result.loss,
        filter: cssFiltersToString(result.values),
    };
}

export function rgb2ColorFilter(color: RGBColor): string {
    const { filter } = solve(color);

    return filter;
}
