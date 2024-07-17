import { mat3, vec3 } from "gl-matrix";
import {
    Color,
    ColorSpaceMap,
    HSLColor,
    HSVColor,
    HWBColor,
    KelvinColor,
    LABColor,
    LCHColor,
    OKLABColor,
    OKLCHColor,
    RGBColor,
    XYZColor,
} from ".";
import { clamp, scale } from "../../math";
import {
    COLOR_SPACE_RANGES,
    ColorSpace,
    RGBA_MAX,
    WHITE_POINTS,
    WHITE_POINT_D50_D65,
    WHITE_POINT_D65_D50,
    WhitePoint,
} from "./constants";
import { normalizeColor } from "./normalize";

const normalizeColorComponent = (
    v: number,
    colorSpace: ColorSpace,
    component: string,
    inverse: boolean = false,
) => {
    const { min, max } = COLOR_SPACE_RANGES[colorSpace][component]["number"];

    const [toMin, toMax, fromMin, fromMax] = inverse
        ? [min, max, 0, 1]
        : [0, 1, min, max];

    return scale(v, fromMin, fromMax, toMin, toMax);
};

const HEX_BASE = 16;

// Outputs values in range [0, 255], alpha in [0, 1]
export const hex2rgb = (hex: string): RGBColor => {
    hex = hex.slice(1);
    if (hex.length <= 4) {
        // Expand shorthand (e.g., "03F" to "0033FF")
        const r = parseInt(hex[0] + hex[0], HEX_BASE);
        const g = parseInt(hex[1] + hex[1], HEX_BASE);
        const b = parseInt(hex[2] + hex[2], HEX_BASE);
        const alpha = hex[3] ? parseInt(hex[3] + hex[3], HEX_BASE) / RGBA_MAX : 1;

        return new RGBColor(r, g, b, alpha);
    } else {
        // Parse full form
        const r = parseInt(hex.slice(0, 2), HEX_BASE);
        const g = parseInt(hex.slice(2, 4), HEX_BASE);
        const b = parseInt(hex.slice(4, 6), HEX_BASE);
        const alpha =
            hex.length === 8 ? parseInt(hex.slice(6, 8), HEX_BASE) / RGBA_MAX : 1;

        return new RGBColor(r, g, b, alpha);
    }
};

// Input values in range [0, 1]
export const rgb2hex = ({ r, g, b, alpha }: RGBColor): string => {
    const hex = (value: number) => {
        const hex = value.toString(HEX_BASE);
        return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${hex(r)}${hex(g)}${hex(b)}${alpha < 1 ? hex(Math.round(alpha * RGBA_MAX)) : ""}`;
};

const MIN_TEMP = 1000;
const MAX_TEMP = 40000;
const TEMP_SCALE = 100;

// Based on approximations by Tanner Helland: https://tannerhelland.com/2012/09/18/convert-temperature-rgb-algorithm-code.html
// Valid for temperatures between 1000K and 40,000K
export const kelvin2rgb = ({ kelvin, alpha }: KelvinColor): RGBColor => {
    // Clamp temperature to valid range and scale down
    kelvin = clamp(kelvin, MIN_TEMP, MAX_TEMP) / TEMP_SCALE;
    let r, g, b;

    // Red calculation
    if (kelvin <= 66) {
        // Red is always 255 for temperatures up to 6600K
        r = RGBA_MAX;
    } else {
        // For higher temperatures, use a power function approximation
        // R-squared value for this approximation is 0.988
        r = kelvin - 60;
        r = 329.698727446 * r ** -0.1332047592;
    }
    r = clamp(r, 0, RGBA_MAX) / RGBA_MAX;

    // Green calculation
    if (kelvin <= 66) {
        // Below 6600K, use a logarithmic approximation
        // R-squared value for this approximation is 0.996
        g = kelvin;
        g = 99.4708025861 * Math.log(g) - 161.1195681661;
    } else {
        // Above 6600K, use a power function approximation
        // R-squared value for this approximation is 0.987
        g = kelvin - 60;
        g = 288.1221695283 * g ** -0.0755148492;
    }
    g = clamp(g, 0, RGBA_MAX) / RGBA_MAX;

    // Blue calculation
    if (kelvin >= 66) {
        // Blue is always 255 for temperatures 6600K and above
        b = RGBA_MAX;
    } else if (kelvin <= 19) {
        // Blue is always 0 for temperatures 1900K and below
        b = 0;
    } else {
        // Between 1900K and 6600K, use a logarithmic approximation
        // R-squared value for this approximation is 0.998
        b = kelvin - 10;
        b = 138.5177312231 * Math.log(b) - 305.0447927307;
    }
    b = clamp(b, 0, RGBA_MAX) / RGBA_MAX;

    return new RGBColor(r, g, b, alpha);
};

// Input values in range [0, 1]
export const rgb2kelvin = ({ r, g, b, alpha }: RGBColor): KelvinColor => {
    // Ensure input values are within valid range
    r = clamp(r * RGBA_MAX, 0, RGBA_MAX);
    g = clamp(g * RGBA_MAX, 0, RGBA_MAX);
    b = clamp(b * RGBA_MAX, 0, RGBA_MAX);

    let kelvin;

    // Determine temperature range based on blue value
    if (b === RGBA_MAX) {
        // Temperature is 6600K or above
        kelvin = 6600;
    } else if (b === 0) {
        // Temperature is 1900K or below
        kelvin = 1900;
    } else {
        // Temperature is between 1900K and 6600K
        // Reverse the blue calculation
        kelvin = Math.exp((b + 305.0447927307) / 138.5177312231) + 10;
    }

    // Refine temperature based on red value
    if (r < RGBA_MAX) {
        // Temperature is above 6600K
        const redTemp = (329.698727446 / r) ** (1 / -0.1332047592) + 60;
        kelvin = Math.max(kelvin, redTemp);
    }

    // Refine temperature based on green value
    const greenTemp =
        kelvin <= 6600
            ? Math.exp((g + 161.1195681661) / 99.4708025861)
            : (288.1221695283 / g) ** (1 / -0.0755148492) + 60;

    // Average the temperatures from different channels
    kelvin = (kelvin + greenTemp) / 2;

    // Scale and clamp the final temperature
    kelvin = clamp(Math.round(kelvin * TEMP_SCALE), MIN_TEMP, MAX_TEMP);

    return new KelvinColor(kelvin, alpha);
};

// Input and output values in range [0, 1]
export const hsv2hsl = ({ h, s, v, alpha }: HSVColor): HSLColor => {
    // L is average of highest and lowest RGB values
    const l = v - (v * s) / 2;

    // S is recalculated to match HSL's definition
    let sl: number;
    if (l === 0 || l === 1) {
        sl = 0;
    } else {
        sl = (v - l) / Math.min(l, 1 - l);
    }

    return new HSLColor(h, sl, l, alpha);
};

// Input and output values in range [0, 1]
export const hsl2hsv = ({ h, s, l, alpha }: HSLColor): HSVColor => {
    // V is the highest RGB value
    const v = l + s * Math.min(l, 1 - l);

    // S is recalculated to match HSV's definition
    let sv: number;
    if (v === 0) {
        sv = 0;
    } else {
        sv = 2 * (1 - l / v);
    }

    return new HSVColor(h, sv, v, alpha);
};

// Input and output values in range [0, 1]
export const hwb2hsl = ({ h, w, b, alpha }: HWBColor): HSLColor => {
    // Convert HWB to HSV first
    let s: number, v: number;

    const sum = w + b;
    if (sum >= 1) {
        v = w / sum;
        s = 0;
    } else {
        v = 1 - b;
        s = v === 0 ? 0 : 1 - w / v;
    }

    // Then convert HSV to HSL
    return hsv2hsl(new HSVColor(h, s, v, alpha));
};

// Input and output values in range [0, 1]
export const hsl2hwb = ({ h, s, l, alpha }: HSLColor): HWBColor => {
    // Convert HSL to HSV first
    const { h: hh, s: ss, v } = hsl2hsv(new HSLColor(h, s, l, alpha));

    return new HWBColor(hh, v * (1 - ss), 1 - v, alpha);
};

// Input and output values in range [0, 1]
export const rgb2hsl = ({ r, g, b, alpha }: RGBColor): HSLColor => {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    // Lightness: average of the largest and smallest color components
    const l = (max + min) / 2;

    // Chroma: the "colorfulness" of the color
    const c = max - min;

    // Saturation: determined by lightness and chroma
    let s = c / (1 - Math.abs(2 * l - 1));

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

    if (s < 0) {
        h += 0.5;
        s = Math.abs(s);
    }
    if (h >= 1) {
        h -= 1;
    }

    return new HSLColor(h, s, l, alpha);
};

// Input and output values in range [0, 1]
export function hsl2rgb({ h, s, l, alpha }: HSLColor): RGBColor {
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
    return new RGBColor(r + m, g + m, b + m, alpha);
}

// Constants for LAB color space calculations
const LAB_EPSILON = 216 / 24389; // Actual value is (6/29)^3
const LAB_EPSILON_3 = 24 / 116;

const LAB_KAPPA = 24389 / 27; // Actual value is (29/3)^3

const LAB_KAPPA_EPSILON = 8; // Product of KAPPA and EPSILON; exactly 8

const LAB_OFFSET = 16; // Offset for L* calculation

// Constants for scaling factors in LAB calculations
const LAB_SCALE_L = 116;
const LAB_SCALE_A = 500;
const LAB_SCALE_B = 200;

function xyzToD50(xyz: XYZColor): vec3 {
    const xyzv = vec3.fromValues(xyz.x, xyz.y, xyz.z);

    if (xyz.whitePoint === "D50") {
        return xyzv;
    } else if (xyz.whitePoint === "D65") {
        return vec3.transformMat3(xyzv, xyzv, WHITE_POINT_D65_D50);
    }

    throw new Error(`Unsupported white point: ${xyz.whitePoint}`);
}

function xyzToD65(xyz: XYZColor): vec3 {
    const xyzv = vec3.fromValues(xyz.x, xyz.y, xyz.z);

    if (xyz.whitePoint === "D65") {
        return xyzv;
    } else if (xyz.whitePoint === "D50") {
        return vec3.transformMat3(xyzv, xyzv, WHITE_POINT_D50_D65);
    }

    throw new Error(`Unsupported white point: ${xyz.whitePoint}`);
}

export function xyz2lab(xyz: XYZColor, toWhitePoint: WhitePoint = "D50"): LABColor {
    const labFunction = (value: number) =>
        value > LAB_EPSILON
            ? Math.cbrt(value)
            : (LAB_KAPPA * value + LAB_OFFSET) / LAB_SCALE_L;

    const whitePoint = WHITE_POINTS[toWhitePoint];

    const [x, y, z] = xyzToD50(xyz);

    // Normalize XYZ values relative to the given white point
    const [xr, yr, zr] = [x, y, z].map((value, index) => value / whitePoint[index]);

    const [fx, fy, fz] = [xr, yr, zr].map(labFunction);

    // Calculate L*, a*, and b* values
    const l = LAB_SCALE_L * fy - LAB_OFFSET; // L* = 116 * f(Y/Yn) - 16
    const a = LAB_SCALE_A * (fx - fy); // a* = 500 * [f(X/Xn) - f(Y/Yn)]
    const b = LAB_SCALE_B * (fy - fz); // b* = 200 * [f(Y/Yn) - f(Z/Zn)]

    const lab = new LABColor(
        scale(
            l,
            COLOR_SPACE_RANGES.lab.l.number.min,
            COLOR_SPACE_RANGES.lab.l.number.max,
        ),
        scale(
            a,
            COLOR_SPACE_RANGES.lab.a.number.min,
            COLOR_SPACE_RANGES.lab.a.number.max,
        ),
        scale(
            b,
            COLOR_SPACE_RANGES.lab.b.number.min,
            COLOR_SPACE_RANGES.lab.b.number.max,
        ),
        xyz.alpha,
    );

    lab.whitePoint = toWhitePoint;

    return lab;
}

export function lab2xyz(lab: LABColor): XYZColor {
    const labFunctionXZ = (value: number) =>
        value > LAB_EPSILON_3
            ? value ** 3
            : (LAB_SCALE_L * value - LAB_OFFSET) / LAB_KAPPA;

    const labFunctionY = (value: number) =>
        value > LAB_KAPPA_EPSILON
            ? ((value + LAB_OFFSET) / LAB_SCALE_L) ** 3
            : value / LAB_KAPPA;

    const whitePoint = WHITE_POINTS[lab.whitePoint];

    let { l, a, b, alpha } = lab;

    l = scale(
        l,
        0,
        1,
        COLOR_SPACE_RANGES.lab.l.number.min,
        COLOR_SPACE_RANGES.lab.l.number.max,
    );
    a = scale(
        a,
        0,
        1,
        COLOR_SPACE_RANGES.lab.a.number.min,
        COLOR_SPACE_RANGES.lab.a.number.max,
    );
    b = scale(
        b,
        0,
        1,
        COLOR_SPACE_RANGES.lab.b.number.min,
        COLOR_SPACE_RANGES.lab.b.number.max,
    );

    // Inverse of the xyz2lab function
    const fy = (l + LAB_OFFSET) / LAB_SCALE_L; // f(Y/Yn) = (L* + 16) / 116
    const fx = a / LAB_SCALE_A + fy; // f(X/Xn) = a* / 500 + f(Y/Yn)
    const fz = fy - b / LAB_SCALE_B; // f(Z/Zn) = f(Y/Yn) - b* / 200

    // Apply the inverse lab function to each value
    const [xr, yr, zr] = [labFunctionXZ(fx), labFunctionY(l), labFunctionXZ(fz)];

    // Denormalize XYZ values relative to the given white point
    let [x, y, z] = [xr, yr, zr].map((value, index) => value * whitePoint[index]);

    const xyz = new XYZColor(x, y, z, alpha);
    xyz.whitePoint = lab.whitePoint;

    // All XYZ outputs are relative to D65:
    [x, y, z] = xyzToD65(xyz);

    xyz.whitePoint = "D65";

    xyz.x = x;
    xyz.y = y;
    xyz.z = z;

    return xyz;
}

// Constants for RGB to XYZ conversion
const RGB_XYZ_MATRIX = mat3.fromValues(
    ...[0.41239079926595934, 0.357584339383878, 0.1804807884018343],
    ...[0.21263900587151027, 0.715168678767756, 0.07219231536073371],
    ...[0.01933081871559182, 0.11919477979462598, 0.9505321522496607],
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

export function rgb2xyz({ r, g, b, alpha }: RGBColor): XYZColor {
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

    return new XYZColor(x, y, z, alpha);
}

export function xyz2rgb({ x, y, z, alpha }: XYZColor): RGBColor {
    // Transform XYZ to linear RGB
    const linearRGB = vec3.create();
    vec3.transformMat3(linearRGB, vec3.fromValues(x, y, z), XYZ_RGB_MATRIX);

    // Convert linear RGB to sRGB
    const [r, g, b] = linearRGB.map(linearToSrgb);

    return new RGBColor(r, g, b, alpha);
}

// Input and output values in range [0, 1]
export function lch2lab({ l, c, h, alpha }: LCHColor): LABColor {
    c = scale(
        c,
        0,
        1,
        COLOR_SPACE_RANGES.lch.c.number.min,
        COLOR_SPACE_RANGES.lch.c.number.max,
    );

    const hRad = h * 2 * Math.PI;
    const a = Math.cos(hRad) * c;
    const b = Math.sin(hRad) * c;

    return new LABColor(
        l,
        scale(
            a,
            COLOR_SPACE_RANGES.lab.a.number.min,
            COLOR_SPACE_RANGES.lab.a.number.max,
        ),
        scale(
            b,
            COLOR_SPACE_RANGES.lab.b.number.min,
            COLOR_SPACE_RANGES.lab.b.number.max,
        ),
        alpha,
    );
}

// Input and output values in range [0, 1]
export function lab2lch({ l, a, b, alpha }: LABColor): LCHColor {
    a = scale(
        a,
        0,
        1,
        COLOR_SPACE_RANGES.lab.a.number.min,
        COLOR_SPACE_RANGES.lab.a.number.max,
    );
    b = scale(
        b,
        0,
        1,
        COLOR_SPACE_RANGES.lab.b.number.min,
        COLOR_SPACE_RANGES.lab.b.number.max,
    );

    const c = Math.hypot(a, b);

    let h = Math.atan2(b, a) / (2 * Math.PI);
    if (h < 0) h += 1;

    return new LCHColor(
        l,
        scale(
            c,
            COLOR_SPACE_RANGES.lch.c.number.min,
            COLOR_SPACE_RANGES.lch.c.number.max,
        ),
        h,
        alpha,
    );
}

const XYZ_TO_LMS_MATRIX = mat3.fromValues(
    ...[0.819022437996703, 0.3619062600528904, -0.1288737815209879],
    ...[0.0329836539323885, 0.9292868615863434, 0.0361446663506424],
    ...[0.0481771893596242, 0.2642395317527308, 0.6335478284694309],
);
mat3.transpose(XYZ_TO_LMS_MATRIX, XYZ_TO_LMS_MATRIX);

const LMS_TO_XYZ_MATRIX = mat3.create();
mat3.invert(LMS_TO_XYZ_MATRIX, XYZ_TO_LMS_MATRIX);

const LMS_TO_OKLAB_MATRIX = mat3.fromValues(
    ...[0.210454268309314, 0.7936177747023054, -0.0040720430116193],
    ...[1.9779985324311684, -2.4285922420485799, 0.450593709617411],
    ...[0.0259040424655478, 0.7827717124575296, -0.8086757549230774],
);
mat3.transpose(LMS_TO_OKLAB_MATRIX, LMS_TO_OKLAB_MATRIX);

const OKLAB_TO_LMS_MATRIX = mat3.create();
mat3.invert(OKLAB_TO_LMS_MATRIX, LMS_TO_OKLAB_MATRIX);

// Input and output values in range [0, 1]
export function oklab2xyz({ l, a, b, alpha }: OKLABColor): XYZColor {
    a = scale(
        a,
        0,
        1,
        COLOR_SPACE_RANGES.oklab.a.number.min,
        COLOR_SPACE_RANGES.oklab.a.number.max,
    );
    b = scale(
        b,
        0,
        1,
        COLOR_SPACE_RANGES.oklab.b.number.min,
        COLOR_SPACE_RANGES.oklab.b.number.max,
    );

    // Convert OKLab to LMS
    const lms = vec3.create();
    vec3.transformMat3(lms, vec3.fromValues(l, a, b), OKLAB_TO_LMS_MATRIX);

    // Apply non-linearity (LMS to linear LMS)
    lms.forEach((value, index) => {
        lms[index] = value ** 3;
    });

    // Convert linear LMS to XYZ
    let [x, y, z] = vec3.transformMat3(vec3.create(), lms, LMS_TO_XYZ_MATRIX);

    return new XYZColor(x, y, z, alpha);
}

// Input and output values in range [0, 1]
export function xyz2oklab(xyz: XYZColor): OKLABColor {
    const { x, y, z } = xyz;

    // Convert XYZ to linear LMS
    const lms = vec3.create();
    vec3.transformMat3(lms, vec3.fromValues(x, y, z), XYZ_TO_LMS_MATRIX);

    // Apply non-linearity (linear LMS to LMS)
    lms.forEach((value, index) => {
        lms[index] = Math.cbrt(value);
    });

    // Convert LMS to OKLab
    const [l, a, b] = vec3.transformMat3(vec3.create(), lms, LMS_TO_OKLAB_MATRIX);

    return new OKLABColor(
        l,
        scale(
            a,
            COLOR_SPACE_RANGES.oklab.a.number.min,
            COLOR_SPACE_RANGES.oklab.a.number.max,
        ),
        scale(
            b,
            COLOR_SPACE_RANGES.oklab.b.number.min,
            COLOR_SPACE_RANGES.oklab.b.number.max,
        ),
        xyz.alpha,
    );
}

// Input and output values in range [0, 1]
export function oklab2lab(oklab: OKLABColor): LABColor {
    const xyz = oklab2xyz(oklab);
    return xyz2lab(xyz);
}

// Input and output values in range [0, 1]
export function lab2oklab(lab: LABColor): OKLABColor {
    const xyz = lab2xyz(lab);
    return xyz2oklab(xyz);
}

// Input and output values in range [0, 1]
export function oklch2lab({ l, c, h, alpha }: OKLCHColor): LABColor {
    c = scale(
        c,
        0,
        1,
        COLOR_SPACE_RANGES.oklch.c.number.min,
        COLOR_SPACE_RANGES.oklch.c.number.max,
    );

    // Convert OKLCh to OKLab
    const hRadians = h * 2 * Math.PI; // h is now in [0, 1] range

    return oklab2lab(
        new OKLABColor(
            l,
            scale(
                c * Math.cos(hRadians),
                COLOR_SPACE_RANGES.oklab.a.number.min,
                COLOR_SPACE_RANGES.oklab.a.number.max,
            ),
            scale(
                c * Math.sin(hRadians),
                COLOR_SPACE_RANGES.oklab.b.number.min,
                COLOR_SPACE_RANGES.oklab.b.number.max,
            ),
            alpha,
        ),
    );
}

export function lab2oklch(lab: LABColor): OKLCHColor {
    const lch = lab2lch(lab);
    return new OKLCHColor(lch.l, lch.c, lch.h, lab.alpha);
}

// Input and output values in range [0, 1]
export function oklab2oklch({ l, a, b, alpha }: OKLABColor): OKLCHColor {
    const lab = new LABColor(l, a, b, alpha);
    const lch = lab2lch(lab);
    return new OKLCHColor(lch.l, lch.c, lch.h, alpha);
}

// Input and output values in range [0, 1]
export function oklch2oklab({ l, c, h, alpha }: OKLCHColor): OKLABColor {
    const lch = new LCHColor(l, c, h, alpha);
    const lab = lch2lab(lch);
    return new OKLABColor(lab.l, lab.a, lab.b, alpha);
}

// Conversion functions to normalize any given space to XYZ and back

export function hsl2xyz(hsl: HSLColor) {
    const rgb = hsl2rgb(hsl);
    return rgb2xyz(rgb);
}

export function xyz2hsl(xyz: XYZColor) {
    const rgb = xyz2rgb(xyz);
    return rgb2hsl(rgb);
}

export function hsv2xyz(hsv: HSVColor): XYZColor {
    const hsl = hsv2hsl(hsv);
    return hsl2xyz(hsl);
}

export function xyz2hsv(xyz: XYZColor): HSVColor {
    const hsl = xyz2hsl(xyz);
    return hsl2hsv(hsl);
}

export function hwb2xyz(hwb: HWBColor): XYZColor {
    const hsl = hwb2hsl(hwb);
    return hsl2xyz(hsl);
}

export function xyz2hwb(xyz: XYZColor): HWBColor {
    const hsl = xyz2hsl(xyz);
    return hsl2hwb(hsl);
}

export function lch2xyz(lch: LCHColor): XYZColor {
    const lab = lch2lab(lch);

    const tmp = normalizeColor(lab.clone(), true);

    return lab2xyz(lab);
}

export function xyz2lch(xyz: XYZColor): LCHColor {
    const lab = xyz2lab(xyz);
    return lab2lch(lab);
}

export function oklch2xyz(oklch: OKLCHColor): XYZColor {
    const lab = oklch2lab(oklch);
    return lab2xyz(lab);
}

export function xyz2oklch(xyz: XYZColor): OKLCHColor {
    const oklab = xyz2oklab(xyz);
    return lab2oklch(oklab);
}

export function kelvin2xyz(kelvin: KelvinColor): XYZColor {
    const rgb = kelvin2rgb(kelvin);
    return rgb2xyz(rgb);
}

export function xyz2kelvin(xyz: XYZColor): KelvinColor {
    const rgb = xyz2rgb(xyz);
    return rgb2kelvin(rgb);
}

const XYZ_FUNCTIONS = {
    rgb: { to: rgb2xyz, from: xyz2rgb },

    hsl: { to: hsl2xyz, from: xyz2hsl },
    hsv: { to: hsv2xyz, from: xyz2hsv },
    hwb: { to: hwb2xyz, from: xyz2hwb },

    lab: { to: lab2xyz, from: xyz2lab },
    lch: { to: lch2xyz, from: xyz2lch },

    oklab: { to: oklab2xyz, from: xyz2oklab },
    oklch: { to: oklch2xyz, from: xyz2oklch },

    kelvin: { to: kelvin2xyz, from: xyz2kelvin },

    xyz: { to: (color: XYZColor) => color, from: (color: XYZColor) => color },
} as const;

export function color2<T, C extends ColorSpace>(color: Color<T>, to: C) {
    const toXYZFn = XYZ_FUNCTIONS[color.colorSpace]["to"] as any;

    const xyz = toXYZFn(color);

    const fromXYZFn = XYZ_FUNCTIONS[to as ColorSpace]["from"] as (
        color: XYZColor<T>,
    ) => ColorSpaceMap<T>[C];

    return fromXYZFn(xyz);
}
