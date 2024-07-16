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
import { COLOR_SPACE_RANGES, ColorSpace, RGBA_MAX } from "./constants";

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
    const v = 1 - b;

    let sv: number;
    if (v === 0) {
        sv = 0;
    } else {
        sv = 1 - w / v;
    }
    // Then convert HSV to HSL
    return hsv2hsl(new HSVColor(h, sv, v, alpha));
};

// Input and output values in range [0, 1]
export const hsl2hwb = ({ h, s, l, alpha }: HSLColor): HWBColor => {
    // Convert HSL to HSV first
    const v = l + s * Math.min(l, 1 - l);

    let w: number;
    if (v === 0) {
        w = 0;
    } else {
        w = 1 - l / v;
    }

    const b = 1 - v;

    return new HWBColor(h, w, b, alpha);
};

// Input and output values in range [0, 1]
export const rgb2hsl = ({ r, g, b, alpha }: RGBColor): HSLColor => {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    // Lightness: average of the largest and smallest color components
    const l = (max + min) / 2;

    if (Math.abs(max - min) < 1e-6) {
        // Achromatic case: no hue or saturation
        return new HSLColor(0, 0, l, alpha);
    }

    const c = max - min;

    const s = c / (1 - Math.abs(2 * l - 1));

    // Hue: determined by which color component is maximum
    // Initial calculation gives h in [0, 6) range
    let h: number;
    switch (max) {
        case r:
            // Red is max: h in [0, 2)
            h = ((g - b) / c) % 6;
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
    if (h < 0) h += 1;

    // if (Math.abs(h) < 1e-6) h = 0;
    // else if (Math.abs(h - 1) < 1e-6) h = 1;

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

export function xyz2lab({ x, y, z, alpha }: XYZColor): LABColor {
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

    return new LABColor(
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
        alpha,
    );
}

export function lab2xyz({ l, a, b, alpha }: LABColor): XYZColor {
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

    return new XYZColor(x, y, z, alpha);
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
    const r = linearToSrgb(linearRGB[0]);
    const g = linearToSrgb(linearRGB[1]);
    const b = linearToSrgb(linearRGB[2]);

    return new RGBColor(r, g, b, alpha);
}

// Input and output values in range [0, 1]
export function lch2lab({ l, c, h, alpha }: LCHColor): LABColor {
    const hRad = h * 2 * Math.PI;

    return new LABColor(l, Math.cos(hRad) * c, Math.sin(hRad) * c, alpha);
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

    const c = Math.sqrt(a * a + b * b) / COLOR_SPACE_RANGES.lch.c.number.max;

    let h = Math.atan2(b, a) / (2 * Math.PI);
    if (h < 0) h += 1;

    return new LCHColor(l, c, h, alpha);
}

const XYZ_TO_LMS_MATRIX = mat3.fromValues(
    ...[0.8189330101, 0.0329845436, 0.0482003018],
    ...[0.3618667424, 0.9293118715, 0.2643662691],
    ...[-0.1288597137, 0.0361456387, 0.633851707],
);

const LMS_TO_XYZ_MATRIX = mat3.create();
mat3.invert(LMS_TO_XYZ_MATRIX, XYZ_TO_LMS_MATRIX);

const LMS_TO_OKLAB_MATRIX = mat3.fromValues(
    ...[0.2104542553, 0.793617785, -0.0040720468],
    ...[1.9779984951, -2.428592205, 0.4505937099],
    ...[0.0259040371, 0.7827717662, -0.808675766],
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
    const xyz = vec3.create();
    vec3.transformMat3(xyz, lms, XYZ_TO_LMS_MATRIX);
    const [x, y, z] = xyz;

    return new XYZColor(x, y, z, alpha);
}

// Input and output values in range [0, 1]
export function xyz2oklab({ x, y, z, alpha }: XYZColor): OKLABColor {
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
    const [l, a, b] = oklab;

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
        alpha,
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
    // Convert OKLCh to OKLab
    const hRadians = h * 2 * Math.PI; // h is now in [0, 1] range
    const a = c * Math.cos(hRadians);
    const b = c * Math.sin(hRadians);

    return oklab2lab(new OKLABColor(l, a, b, alpha));
}

// Input and output values in range [0, 1]
export function lab2oklch(lab: LABColor): OKLCHColor {
    // Convert OKLab to OKLCh
    const { l, a, b, alpha } = lab2oklab(lab);
    const c = Math.sqrt(a * a + b * b);

    let h = Math.atan2(b, a) / (2 * Math.PI);
    if (h < 0) h += 1; // Ensure h is in [0, 1]

    return new OKLCHColor(l, c, h, alpha);
}

// Input and output values in range [0, 1]
export function oklab2oklch({ l, a, b, alpha }: OKLABColor): OKLCHColor {
    const c = Math.sqrt(a * a + b * b);

    let h = Math.atan2(b, a) / (2 * Math.PI);
    if (h < 0) h += 1; // Ensure h is in [0, 1]

    return new OKLCHColor(l, c, h, alpha);
}

// Input and output values in range [0, 1]
export function oklch2oklab({ l, c, h, alpha }: OKLCHColor): OKLABColor {
    const hRadians = h * 2 * Math.PI;
    const a = c * Math.cos(hRadians);
    const b = c * Math.sin(hRadians);

    return new OKLABColor(l, a, b, alpha);
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
    const oklab = xyz2lab(xyz);
    return lab2oklch(oklab);
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
    xyz: { to: (color: XYZColor) => color, from: (color: XYZColor) => color },
} as const;

export function color2<T, C extends ColorSpace>(color: Color<T>, to: C) {
    const toXYZFn = XYZ_FUNCTIONS[color.colorSpace]["to"] as (
        color: Color<T>,
    ) => XYZColor<T>;

    const xyz = toXYZFn(color);

    const fromXYZFn = XYZ_FUNCTIONS[to as ColorSpace]["from"] as (
        color: XYZColor<T>,
    ) => ColorSpaceMap<T>[C];

    return fromXYZFn(xyz);
}
