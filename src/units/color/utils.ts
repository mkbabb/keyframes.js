import { mat3, vec3 } from "gl-matrix";
import { clamp } from "../../math";

// Color space types
export type RGBColor<T = number> = { r: T; g: T; b: T; alpha: T };
export type HSLColor<T = number> = { h: T; s: T; l: T; alpha: T };
export type HSVColor<T = number> = { h: T; s: T; v: T; alpha: T };
export type HWBColor<T = number> = { h: T; w: T; b: T; alpha: T };
export type LABColor<T = number> = { l: T; a: T; b: T; alpha: T };
export type LCHColor<T = number> = { l: T; c: T; h: T; alpha: T };
export type OKLABColor<T = number> = { l: T; a: T; b: T; alpha: T };
export type OKLCHColor<T = number> = { l: T; c: T; h: T; alpha: T };
export type XYZColor<T = number> = { x: T; y: T; z: T; alpha: T };
export type KelvinColor<T = number> = { kelvin: T; alpha: T };

const HEX_BASE = 16;
export const RGBA_MAX = 255;

// Outputs values in range [0, 255], alpha in [0, 1]
export const hex2rgb = (hex: string): RGBColor => {
    hex = hex.slice(1);
    if (hex.length <= 4) {
        // Expand shorthand (e.g., "03F" to "0033FF")
        const r = parseInt(hex[0] + hex[0], HEX_BASE);
        const g = parseInt(hex[1] + hex[1], HEX_BASE);
        const b = parseInt(hex[2] + hex[2], HEX_BASE);
        const alpha = hex[3] ? parseInt(hex[3] + hex[3], HEX_BASE) / RGBA_MAX : 1;

        return { r, g, b, alpha };
    } else {
        // Parse full form
        const r = parseInt(hex.slice(0, 2), HEX_BASE);
        const g = parseInt(hex.slice(2, 4), HEX_BASE);
        const b = parseInt(hex.slice(4, 6), HEX_BASE);
        const alpha =
            hex.length === 8 ? parseInt(hex.slice(6, 8), HEX_BASE) / RGBA_MAX : 1;

        return { r, g, b, alpha };
    }
};

const MIN_TEMP = 1000;
const MAX_TEMP = 40000;
const TEMP_SCALE = 100;

// Based on approximations by Tanner Helland: https://tannerhelland.com/2012/09/18/convert-temperature-rgb-algorithm-code.html
// Valid for temperatures between 1000K and 40,000K
export const kelvin2rgb = (temp: number, alpha: number = 1): RGBColor => {
    // Clamp temperature to valid range and scale down
    temp = clamp(temp, MIN_TEMP, MAX_TEMP) / TEMP_SCALE;
    let r, g, b;

    // Red calculation
    if (temp <= 66) {
        // Red is always 255 for temperatures up to 6600K
        r = RGBA_MAX;
    } else {
        // For higher temperatures, use a power function approximation
        // R-squared value for this approximation is 0.988
        r = temp - 60;
        r = 329.698727446 * r ** -0.1332047592;
    }
    r = clamp(r, 0, RGBA_MAX) / RGBA_MAX;

    // Green calculation
    if (temp <= 66) {
        // Below 6600K, use a logarithmic approximation
        // R-squared value for this approximation is 0.996
        g = temp;
        g = 99.4708025861 * Math.log(g) - 161.1195681661;
    } else {
        // Above 6600K, use a power function approximation
        // R-squared value for this approximation is 0.987
        g = temp - 60;
        g = 288.1221695283 * g ** -0.0755148492;
    }
    g = clamp(g, 0, RGBA_MAX) / RGBA_MAX;

    // Blue calculation
    if (temp >= 66) {
        // Blue is always 255 for temperatures 6600K and above
        b = RGBA_MAX;
    } else if (temp <= 19) {
        // Blue is always 0 for temperatures 1900K and below
        b = 0;
    } else {
        // Between 1900K and 6600K, use a logarithmic approximation
        // R-squared value for this approximation is 0.998
        b = temp - 10;
        b = 138.5177312231 * Math.log(b) - 305.0447927307;
    }
    b = clamp(b, 0, RGBA_MAX) / RGBA_MAX;

    return { r, g, b, alpha };
};

// Input values in range [0, 1]
export const rgb2kelvin = (
    r: number,
    g: number,
    b: number,
    alpha: number = 1,
): KelvinColor => {
    // Ensure input values are within valid range
    r = clamp(r * RGBA_MAX, 0, RGBA_MAX);
    g = clamp(g * RGBA_MAX, 0, RGBA_MAX);
    b = clamp(b * RGBA_MAX, 0, RGBA_MAX);

    let temp;

    // Determine temperature range based on blue value
    if (b === RGBA_MAX) {
        // Temperature is 6600K or above
        temp = 6600;
    } else if (b === 0) {
        // Temperature is 1900K or below
        temp = 1900;
    } else {
        // Temperature is between 1900K and 6600K
        // Reverse the blue calculation
        temp = Math.exp((b + 305.0447927307) / 138.5177312231) + 10;
    }

    // Refine temperature based on red value
    if (r < RGBA_MAX) {
        // Temperature is above 6600K
        const redTemp = (329.698727446 / r) ** (1 / -0.1332047592) + 60;
        temp = Math.max(temp, redTemp);
    }

    // Refine temperature based on green value
    const greenTemp =
        temp <= 6600
            ? Math.exp((g + 161.1195681661) / 99.4708025861)
            : (288.1221695283 / g) ** (1 / -0.0755148492) + 60;

    // Average the temperatures from different channels
    temp = (temp + greenTemp) / 2;

    // Scale and clamp the final temperature
    temp = clamp(Math.round(temp * TEMP_SCALE), MIN_TEMP, MAX_TEMP);

    return { kelvin: temp, alpha };
};

// Input and output values in range [0, 1]
export const hsv2hsl = (
    h: number,
    s: number,
    v: number,
    alpha: number = 1,
): HSLColor => {
    // L is average of highest and lowest RGB values
    const l = v - (v * s) / 2;

    // S is recalculated to match HSL's definition
    let sl: number;
    if (l === 0 || l === 1) {
        sl = 0;
    } else {
        sl = (v - l) / Math.min(l, 1 - l);
    }

    return { h, s: sl, l, alpha };
};

// Input and output values in range [0, 1]
export const hsl2hsv = (
    h: number,
    s: number,
    l: number,
    alpha: number = 1,
): HSVColor => {
    // V is the highest RGB value
    const v = l + s * Math.min(l, 1 - l);

    // S is recalculated to match HSV's definition
    let sv: number;
    if (v === 0) {
        sv = 0;
    } else {
        sv = 2 * (1 - l / v);
    }

    return { h, s: sv, v, alpha };
};

// Input and output values in range [0, 1]
export const hwb2hsl = (
    h: number,
    w: number,
    b: number,
    alpha: number = 1,
): HSLColor => {
    // Convert HWB to HSV first
    const v = 1 - b;

    let sv: number;
    if (v === 0) {
        sv = 0;
    } else {
        sv = 1 - w / v;
    }

    // Then convert HSV to HSL
    return hsv2hsl(h, sv, v, alpha);
};

// Input and output values in range [0, 1]
export const hsl2hwb = (
    h: number,
    s: number,
    l: number,
    alpha: number = 1,
): HWBColor => {
    // Convert HSL to HSV first
    const v = l + s * Math.min(l, 1 - l);

    let w: number;
    if (v === 0) {
        w = 0;
    } else {
        w = 1 - l / v;
    }

    // Then convert HSV to HWB
    return { h, w, b: 1 - v, alpha };
};

// Input and output values in range [0, 1]
export const rgb2hsl = (
    r: number,
    g: number,
    b: number,
    alpha: number = 1,
): HSLColor => {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    // Lightness: average of the largest and smallest color components
    const l = (max + min) / 2;

    if (Math.abs(max - min) < 1e-6) {
        // Achromatic case: no hue or saturation
        return { h: 0, s: 0, l, alpha };
    }

    const c = max - min;

    const s = c / (1 - Math.abs(2 * l - 1));

    // Hue: determined by which color component is maximum
    // Initial calculation gives h in [0, 6) range
    let h: number;
    switch (max) {
        case r:
            // Red is max: h in [0, 2)
            h = (g - b) / c + (g < b ? 6 : 0);
            break;
        case g:
            // Green is max: h in [2, 4)
            h = (b - r) / c + 2;
            break;
        case b:
            // Blue is max: h in [4, 6)
            h = (r - g) / c + 4;
            break;
    }
    // Normalize h to [0, 1) range
    h /= 6;

    return { h, s, l, alpha };
};

// Input and output values in range [0, 1]
export function hsl2rgb(h: number, s: number, l: number, alpha: number = 1): RGBColor {
    // Chroma: the "colorfulness" of the color
    const c = (1 - Math.abs(2 * l - 1)) * s;

    // Second largest component of the color
    const x = c * (1 - Math.abs(((h * 6) % 2) - 1));

    // Amount to add to each component to match lightness
    const m = l - c / 2;

    let r: number, g: number, b: number;

    // Determine RGB based on hue sector
    if (h < 1 / 6) {
        [r, g, b] = [c, x, 0]; // Red to Yellow
    } else if (h < 2 / 6) {
        [r, g, b] = [x, c, 0]; // Yellow to Green
    } else if (h < 3 / 6) {
        [r, g, b] = [0, c, x]; // Green to Cyan
    } else if (h < 4 / 6) {
        [r, g, b] = [0, x, c]; // Cyan to Blue
    } else if (h < 5 / 6) {
        [r, g, b] = [x, 0, c]; // Blue to Magenta
    } else {
        [r, g, b] = [c, 0, x]; // Magenta to Red
    }

    // Add lightness component to each RGB value
    // The resulting r, g, b values are guaranteed to be in the [0, 1] range
    return {
        r: r + m,
        g: g + m,
        b: b + m,
        alpha,
    };
}

// D65 Standard Illuminant values
const WHITE_POINT_D65 = vec3.fromValues(
    ...[
        0.95047, // X
        1.0, // Y
        1.08883, // Z
    ],
);

// Constants for LAB color space calculations
const LAB_EPSILON = 0.008856; // Actual value is (6/29)^3
const LAB_KAPPA = 903.3; // Actual value is (29/3)^3
const LAB_OFFSET = 16; // Offset for L* calculation

// Constants for scaling factors in LAB calculations
const LAB_SCALE_L = 116;
const LAB_SCALE_A = 500;
const LAB_SCALE_B = 200;

export function xyz2lab(x: number, y: number, z: number, alpha: number = 1): LABColor {
    // Normalize XYZ values relative to the D65 white point
    const xr = x / WHITE_POINT_D65[0];
    const yr = y / WHITE_POINT_D65[1];
    const zr = z / WHITE_POINT_D65[2];

    // Apply the lab function to each normalized value
    const fx =
        xr > LAB_EPSILON ? Math.cbrt(xr) : (LAB_KAPPA * xr + LAB_OFFSET) / LAB_SCALE_L;
    const fy =
        yr > LAB_EPSILON ? Math.cbrt(yr) : (LAB_KAPPA * yr + LAB_OFFSET) / LAB_SCALE_L;
    const fz =
        zr > LAB_EPSILON ? Math.cbrt(zr) : (LAB_KAPPA * zr + LAB_OFFSET) / LAB_SCALE_L;

    // Calculate L*, a*, and b* values
    const l = LAB_SCALE_L * fy - LAB_OFFSET; // L* = 116 * f(Y/Yn) - 16
    const a = LAB_SCALE_A * (fx - fy); // a* = 500 * [f(X/Xn) - f(Y/Yn)]
    const b = LAB_SCALE_B * (fy - fz); // b* = 200 * [f(Y/Yn) - f(Z/Zn)]

    return { l, a, b, alpha };
}

export function lab2xyz(l: number, a: number, b: number, alpha: number = 1): XYZColor {
    // Inverse of the xyz2lab function
    const fy = (l + LAB_OFFSET) / LAB_SCALE_L;
    const fx = a / LAB_SCALE_A + fy;
    const fz = fy - b / LAB_SCALE_B;

    // Apply the inverse lab function to each value
    const xr =
        fx ** 3 > LAB_EPSILON ? fx ** 3 : (fx * LAB_SCALE_L - LAB_OFFSET) / LAB_KAPPA;
    const yr =
        l > LAB_KAPPA * LAB_EPSILON
            ? ((l + LAB_OFFSET) / LAB_SCALE_L) ** 3
            : l / LAB_KAPPA;
    const zr =
        fz ** 3 > LAB_EPSILON ? fz ** 3 : (fz * LAB_SCALE_L - LAB_OFFSET) / LAB_KAPPA;

    // Denormalize XYZ values
    const x = xr * WHITE_POINT_D65[0];
    const y = yr * WHITE_POINT_D65[1];
    const z = zr * WHITE_POINT_D65[2];

    return { x, y, z, alpha };
}

// Constants for RGB to XYZ conversion
const RGB_XYZ_MATRIX = mat3.fromValues(
    ...[0.4124564, 0.3575761, 0.1804375],
    ...[0.2126729, 0.7151522, 0.072175],
    ...[0.0193339, 0.119192, 0.9503041],
);
mat3.transpose(RGB_XYZ_MATRIX, RGB_XYZ_MATRIX);

const XYZ_RGB_MATRIX = mat3.create();
mat3.invert(XYZ_RGB_MATRIX, RGB_XYZ_MATRIX);

// Constants for sRGB to linear RGB conversion
const SRGB_GAMMA = 2.4; // sRGB gamma
const SRGB_OFFSET = 0.055; // sRGB offset
const SRGB_SLOPE = 12.92; // sRGB slope for low values

const SRGB_TRANSITION = 0.04045; // sRGB transition point
const SRGB_LINEAR_TRANSITION = SRGB_TRANSITION / SRGB_SLOPE; // sRGB linear transition point

// Helper function to convert sRGB to linear RGB
function srgbToLinear(channel: number): number {
    // sRGB uses a piecewise function:
    // - A linear portion for low values (below the transition point)
    // - A power function for higher values
    // This accounts for the non-linear perception of brightness by human eyes
    if (channel <= SRGB_TRANSITION) {
        // Linear function for low values
        return channel / SRGB_SLOPE;
    } else {
        // Power function: removes gamma correction
        return ((channel + SRGB_OFFSET) / (1 + SRGB_OFFSET)) ** SRGB_GAMMA;
    }
}

// Helper function to convert linear RGB to sRGB
function linearToSrgb(channel: number): number {
    // This function is the inverse of srgbToLinear
    // It applies the sRGB transfer function to convert linear RGB values back to sRGB
    if (channel <= SRGB_LINEAR_TRANSITION) {
        // Linear function for low values
        return channel * SRGB_SLOPE;
    } else {
        // Power function: applies gamma correction
        return (1 + SRGB_OFFSET) * channel ** (1 / SRGB_GAMMA) - SRGB_OFFSET;
    }
}

export function rgb2xyz(r: number, g: number, b: number, alpha: number = 1): XYZColor {
    // Convert sRGB values to linear RGB
    const linearRGB = vec3.fromValues(
        srgbToLinear(r),
        srgbToLinear(g),
        srgbToLinear(b),
    );

    // Transform linear RGB to XYZ using the standardized matrix
    // This matrix is derived from the CIE color matching functions
    // and the sRGB primaries
    const result = vec3.create();
    vec3.transformMat3(result, linearRGB, RGB_XYZ_MATRIX);

    const [x, y, z] = result;
    return { x, y, z, alpha };
}

export function xyz2rgb(x: number, y: number, z: number, alpha: number = 1): RGBColor {
    // Transform XYZ to linear RGB
    const linearRGB = vec3.create();
    vec3.transformMat3(linearRGB, vec3.fromValues(x, y, z), XYZ_RGB_MATRIX);

    // Convert linear RGB to sRGB
    const r = linearToSrgb(linearRGB[0]);
    const g = linearToSrgb(linearRGB[1]);
    const b = linearToSrgb(linearRGB[2]);

    return { r, g, b, alpha };
}

// Input and output values in range [0, 1]
export function rgb2lab(r: number, g: number, b: number, alpha: number = 1) {
    const { x, y, z } = rgb2xyz(r, g, b, alpha);
    return xyz2lab(x, y, z, alpha);
}

// Input and output values in range [0, 1]
export function lab2rgb(l: number, a: number, b: number, alpha: number = 1) {
    const { x, y, z } = lab2xyz(l, a, b, alpha);
    return xyz2rgb(x, y, z, alpha);
}

// Input and output values in range [0, 1]
export function hsl2lab(h: number, s: number, l: number, alpha: number = 1) {
    const { r, g, b } = hsl2rgb(h, s, l, alpha);
    return rgb2lab(r, g, b, alpha);
}

// Input and output values in range [0, 1]
export function lab2hsl(l: number, a: number, b: number, alpha: number = 1) {
    const { r, g, b: bb } = lab2rgb(l, a, b, alpha);
    return rgb2hsl(r, g, bb, alpha);
}

// Input and output values in range [0, 1]
export function hsv2lab(h: number, s: number, v: number, alpha: number = 1): LABColor {
    const { h: hh, s: ss, l } = hsv2hsl(h, s, v, alpha);
    return hsl2lab(hh, ss, l, alpha);
}

// Input and output values in range [0, 1]
export function lab2hsv(l: number, a: number, b: number, alpha: number = 1): HSVColor {
    const { h, s, l: ll } = lab2hsl(l, a, b, alpha);
    return hsl2hsv(h, s, ll, alpha);
}

// Input and output values in range [0, 1]
export function hwb2lab(h: number, w: number, b: number, alpha: number = 1) {
    const { h: hh, s, l } = hwb2hsl(h, w, b, alpha);
    return hsl2lab(hh, s, l, alpha);
}

// Input and output values in range [0, 1]
export function lab2hwb(l: number, a: number, b: number, alpha: number = 1) {
    const { h, s, l: ll } = lab2hsl(l, a, b, alpha);
    return hsl2hwb(h, s, ll, alpha);
}

// Input and output values in range [0, 1]
export function lch2lab(l: number, c: number, h: number, alpha: number = 1): LABColor {
    const hRad = h * 2 * Math.PI;
    return {
        l: l,
        a: Math.cos(hRad) * c,
        b: Math.sin(hRad) * c,
        alpha,
    };
}

// Input and output values in range [0, 1]
export function lab2lch(l: number, a: number, b: number, alpha: number = 1): LCHColor {
    const c = Math.sqrt(a * a + b * b);
    let h = Math.atan2(b, a) / (2 * Math.PI);
    if (h < 0) h += 1; // Ensure h is in [0, 1]
    return { l, c, h, alpha };
}

const LMS_TO_XYZ_MATRIX = mat3.fromValues(
    ...[0.8189330101, 0.0329845436, 0.0482003018],
    ...[0.3618667424, 0.9293118715, 0.2643662691],
    ...[-0.1288597137, 0.0361456387, 0.633851707],
);
mat3.transpose(LMS_TO_XYZ_MATRIX, LMS_TO_XYZ_MATRIX);

const XYZ_TO_LMS_MATRIX = mat3.create();
mat3.invert(XYZ_TO_LMS_MATRIX, LMS_TO_XYZ_MATRIX);

const LMS_TO_OKLAB_MATRIX = mat3.fromValues(
    ...[0.2104542553, 0.793617785, -0.0040720468],
    ...[1.9779984951, -2.428592205, 0.4505937099],
    ...[0.0259040371, 0.7827717662, -0.808675766],
);
mat3.transpose(LMS_TO_OKLAB_MATRIX, LMS_TO_OKLAB_MATRIX);

const OKLAB_TO_LMS_MATRIX = mat3.create();
mat3.invert(OKLAB_TO_LMS_MATRIX, LMS_TO_OKLAB_MATRIX);

// Input and output values in range [0, 1]
export function oklab2xyz(
    l: number,
    a: number,
    b: number,
    alpha: number = 1,
): XYZColor {
    // Convert OKLab to LMS
    const lms = vec3.create();
    vec3.transformMat3(lms, vec3.fromValues(l, a, b), OKLAB_TO_LMS_MATRIX);

    // Apply non-linearity (LMS to linear LMS)
    lms.forEach((value, index) => {
        lms[index] = value ** 3;
    });

    // Convert linear LMS to XYZ
    const xyz = vec3.create();
    vec3.transformMat3(xyz, lms, LMS_TO_XYZ_MATRIX);

    return { x: xyz[0], y: xyz[1], z: xyz[2], alpha: alpha };
}

// Input and output values in range [0, 1]
export function xyz2oklab(
    x: number,
    y: number,
    z: number,
    alpha: number = 1,
): OKLABColor {
    // Convert XYZ to linear LMS
    const lms = vec3.create();
    vec3.transformMat3(lms, vec3.fromValues(x, y, z), XYZ_TO_LMS_MATRIX);

    // Apply non-linearity (linear LMS to LMS)
    lms.forEach((value, index) => {
        lms[index] = Math.cbrt(value);
    });

    // Convert LMS to OKLab using matrix multiplication
    const oklab = vec3.create();
    vec3.transformMat3(oklab, lms, LMS_TO_OKLAB_MATRIX);

    return { l: oklab[0], a: oklab[1], b: oklab[2], alpha: alpha };
}

// Input and output values in range [0, 1]
export function oklab2lab(l: number, a: number, b: number, alpha: number = 1) {
    const { x, y, z } = oklab2xyz(l, a, b, alpha);
    return xyz2lab(x, y, z, alpha);
}

// Input and output values in range [0, 1]
export function lab2oklab(l: number, a: number, b: number, alpha: number = 1) {
    const { x, y, z } = lab2xyz(l, a, b, alpha);
    return xyz2oklab(x, y, z, alpha);
}

// Input and output values in range [0, 1]
export function oklch2lab(l: number, c: number, h: number, alpha: number = 1) {
    // Convert OKLCh to OKLab
    const hRadians = h * 2 * Math.PI; // h is now in [0, 1] range
    const a = c * Math.cos(hRadians);
    const b = c * Math.sin(hRadians);

    return oklab2lab(l, a, b, alpha);
}

// Input and output values in range [0, 1]
export function lab2oklch(
    l: number,
    a: number,
    b: number,
    alpha: number = 1,
): OKLCHColor {
    // Convert OKLab to OKLCh
    const { l: ll, a: aa, b: bb } = lab2oklab(l, a, b, alpha);
    const c = Math.sqrt(aa * aa + bb * bb);

    let h = Math.atan2(bb, aa) / (2 * Math.PI);
    if (h < 0) h += 1; // Ensure h is in [0, 1]

    return { l, c, h, alpha };
}

// Input and output values in range [0, 1]
export function oklab2oklch(l: number, a: number, b: number, alpha: number = 1) {
    const c = Math.sqrt(a * a + b * b);

    let h = Math.atan2(b, a) / (2 * Math.PI);
    if (h < 0) h += 1; // Ensure h is in [0, 1]

    return { l, c, h, alpha };
}

// Input and output values in range [0, 1]
export function oklch2oklab(
    l: number,
    c: number,
    h: number,
    alpha: number = 1,
): OKLABColor {
    const hRadians = h * 2 * Math.PI;
    const a = c * Math.cos(hRadians);
    const b = c * Math.sin(hRadians);

    return { l, a, b, alpha };
}

// Input and output values in range [0, 1]
export function oklch2xyz(l: number, c: number, h: number, alpha: number = 1) {
    const { l: ll, a, b } = oklch2lab(l, c, h, alpha);
    return lab2xyz(ll, a, b, alpha);
}

// Input and output values in range [0, 1]
export function xyz2oklch(x: number, y: number, z: number, alpha: number = 1) {
    const { l, a, b } = xyz2oklab(x, y, z, alpha);
    return oklab2oklch(l, a, b, alpha);
}
