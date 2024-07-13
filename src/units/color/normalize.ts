import { V } from "vite/dist/node/types.d-aGj9QkWt";
import { ValueUnit } from "..";
import { scale } from "../../math";
import {
    Color,
    ColorSpace,
    ColorSpaceMap,
    HSLColor,
    HSVColor,
    HWBColor,
    LABColor,
    LCHColor,
    OKLABColor,
    OKLCHColor,
    RGBColor,
    XYZColor,
    color2,
} from "./utils";

// Constants for color space ranges
const COLOR_RANGES = {
    RGB: {
        r: { min: 0, max: 255 },
        g: { min: 0, max: 255 },
        b: { min: 0, max: 255 },
        percentage: { min: 0, max: 100 },
    },
    HSL: {
        h: { deg: { min: 0, max: 360 }, percentage: { min: 0, max: 100 } },
        s: { percentage: { min: 0, max: 100 } },
        l: { percentage: { min: 0, max: 100 } },
    },
    HSV: {
        h: { deg: { min: 0, max: 360 }, percentage: { min: 0, max: 100 } },
        s: { percentage: { min: 0, max: 100 } },
        v: { percentage: { min: 0, max: 100 } },
    },
    HWB: {
        h: { deg: { min: 0, max: 360 }, percentage: { min: 0, max: 100 } },
        w: { percentage: { min: 0, max: 100 } },
        b: { percentage: { min: 0, max: 100 } },
    },
    LAB: {
        l: { percentage: { min: 0, max: 100 } },
        a: { number: { min: -125, max: 125 }, percentage: { min: -100, max: 100 } },
        b: { number: { min: -125, max: 125 }, percentage: { min: -100, max: 100 } },
    },
    LCH: {
        l: { percentage: { min: 0, max: 100 } },
        c: { number: { min: 0, max: 230 }, percentage: { min: 0, max: 100 } },
        h: { deg: { min: 0, max: 360 }, percentage: { min: 0, max: 100 } },
    },
    OKLAB: {
        l: { percentage: { min: 0, max: 100 } },
        a: { number: { min: -0.4, max: 0.4 }, percentage: { min: -100, max: 100 } },
        b: { number: { min: -0.4, max: 0.4 }, percentage: { min: -100, max: 100 } },
    },
    OKLCH: {
        l: { percentage: { min: 0, max: 100 } },
        c: { number: { min: 0, max: 0.5 }, percentage: { min: 0, max: 100 } },
        h: { deg: { min: 0, max: 360 }, percentage: { min: 0, max: 100 } },
    },
    XYZ: {
        x: { percentage: { min: 0, max: 100 } },
        y: { percentage: { min: 0, max: 100 } },
        z: { percentage: { min: 0, max: 100 } },
    },
    ALPHA: { percentage: { min: 0, max: 100 } },
} as const;

const normalizeValue = (value: number, min: number, max: number) =>
    scale(value, min, max, 0, 1);

const denormalizeValue = (normalizedValue: number, min: number, max: number) =>
    scale(normalizedValue, 0, 1, min, max);

// Alpha normalization and denormalization
const normalizeAlpha = (v: ValueUnit) => {
    if (v.unit === "%")
        return normalizeValue(
            v.value,
            COLOR_RANGES.ALPHA.percentage.min,
            COLOR_RANGES.ALPHA.percentage.max,
        );
    return v.value;
};
const denormalizeAlpha = (v: number) =>
    new ValueUnit(
        denormalizeValue(
            v,
            COLOR_RANGES.ALPHA.percentage.min,
            COLOR_RANGES.ALPHA.percentage.max,
        ),
        "%",
    );

// RGB normalization and denormalization
const normalizeRGB = (v: ValueUnit, component: "r" | "g" | "b") => {
    if (v.unit === "%")
        return normalizeValue(
            v.value,
            COLOR_RANGES.RGB.percentage.min,
            COLOR_RANGES.RGB.percentage.max,
        );
    return normalizeValue(
        v.value,
        COLOR_RANGES.RGB[component].min,
        COLOR_RANGES.RGB[component].max,
    );
};
const denormalizeRGB = (v: number, component: "r" | "g" | "b") =>
    new ValueUnit(
        Math.round(
            denormalizeValue(
                v,
                COLOR_RANGES.RGB[component].min,
                COLOR_RANGES.RGB[component].max,
            ),
        ),
        "",
    );

// Hue normalization and denormalization
const normalizeHue = (v: ValueUnit) => {
    if (v.unit === "deg")
        return normalizeValue(
            v.value,
            COLOR_RANGES.HSL.h.deg.min,
            COLOR_RANGES.HSL.h.deg.max,
        );
    if (v.unit === "%")
        return normalizeValue(
            v.value,
            COLOR_RANGES.HSL.h.percentage.min,
            COLOR_RANGES.HSL.h.percentage.max,
        );
    return v.value;
};
const denormalizeHue = (v: number) =>
    new ValueUnit(
        Math.round(
            denormalizeValue(v, COLOR_RANGES.HSL.h.deg.min, COLOR_RANGES.HSL.h.deg.max),
        ),
        "deg",
    );

// Color percentage normalization and denormalization
const normalizeColorPercentage = (v: ValueUnit) =>
    normalizeValue(
        v.value,
        COLOR_RANGES.RGB.percentage.min,
        COLOR_RANGES.RGB.percentage.max,
    );
const denormalizeColorPercentage = (v: number) =>
    new ValueUnit(
        denormalizeValue(
            v,
            COLOR_RANGES.RGB.percentage.min,
            COLOR_RANGES.RGB.percentage.max,
        ),
        "%",
    );

// LAB normalization and denormalization
const normalizeAB = (v: ValueUnit, component: "a" | "b") => {
    if (v.unit === "%")
        return normalizeValue(
            v.value,
            COLOR_RANGES.LAB[component].percentage.min,
            COLOR_RANGES.LAB[component].percentage.max,
        );
    return normalizeValue(
        v.value,
        COLOR_RANGES.LAB[component].number.min,
        COLOR_RANGES.LAB[component].number.max,
    );
};
const denormalizeAB = (v: number, component: "a" | "b") =>
    new ValueUnit(
        denormalizeValue(
            v,
            COLOR_RANGES.LAB[component].number.min,
            COLOR_RANGES.LAB[component].number.max,
        ),
        "",
    );

// LCH normalization and denormalization
const normalizeC = (v: ValueUnit) => {
    if (v.unit === "%")
        return normalizeValue(
            v.value,
            COLOR_RANGES.LCH.c.percentage.min,
            COLOR_RANGES.LCH.c.percentage.max,
        );
    return normalizeValue(
        v.value,
        COLOR_RANGES.LCH.c.number.min,
        COLOR_RANGES.LCH.c.number.max,
    );
};
const denormalizeC = (v: number) =>
    new ValueUnit(
        denormalizeValue(
            v,
            COLOR_RANGES.LCH.c.number.min,
            COLOR_RANGES.LCH.c.number.max,
        ),
        "",
    );

// OKLAB normalization and denormalization
const normalizeOKAB = (v: ValueUnit, component: "a" | "b") => {
    if (v.unit === "%")
        return normalizeValue(
            v.value,
            COLOR_RANGES.OKLAB[component].percentage.min,
            COLOR_RANGES.OKLAB[component].percentage.max,
        );
    return normalizeValue(
        v.value,
        COLOR_RANGES.OKLAB[component].number.min,
        COLOR_RANGES.OKLAB[component].number.max,
    );
};
const denormalizeOKAB = (v: number, component: "a" | "b") =>
    new ValueUnit(
        denormalizeValue(
            v,
            COLOR_RANGES.OKLAB[component].number.min,
            COLOR_RANGES.OKLAB[component].number.max,
        ),
        "",
    );

// OKLCH normalization and denormalization
const normalizeOKC = (v: ValueUnit) => {
    if (v.unit === "%")
        return normalizeValue(
            v.value,
            COLOR_RANGES.OKLCH.c.percentage.min,
            COLOR_RANGES.OKLCH.c.percentage.max,
        );
    return normalizeValue(
        v.value,
        COLOR_RANGES.OKLCH.c.number.min,
        COLOR_RANGES.OKLCH.c.number.max,
    );
};
const denormalizeOKC = (v: number) =>
    new ValueUnit(
        denormalizeValue(
            v,
            COLOR_RANGES.OKLCH.c.number.min,
            COLOR_RANGES.OKLCH.c.number.max,
        ),
        "",
    );

export const normalizeRGBValueUnits = (rgb: RGBColor<ValueUnit<number>>): RGBColor => ({
    r: normalizeRGB(rgb.r, "r"),
    g: normalizeRGB(rgb.g, "g"),
    b: normalizeRGB(rgb.b, "b"),
    alpha: normalizeAlpha(rgb.alpha),
});

export const normalizeHSLValueUnits = (hsl: HSLColor<ValueUnit<number>>): HSLColor => ({
    h: normalizeHue(hsl.h),
    s: normalizeColorPercentage(hsl.s),
    l: normalizeColorPercentage(hsl.l),
    alpha: normalizeAlpha(hsl.alpha),
});

export const normalizeHSVValueUnits = (hsv: HSVColor<ValueUnit<number>>): HSVColor => ({
    h: normalizeHue(hsv.h),
    s: normalizeColorPercentage(hsv.s),
    v: normalizeColorPercentage(hsv.v),
    alpha: normalizeAlpha(hsv.alpha),
});

export const normalizeHWBValueUnits = (hwb: HWBColor<ValueUnit<number>>): HWBColor => ({
    h: normalizeHue(hwb.h),
    w: normalizeColorPercentage(hwb.w),
    b: normalizeColorPercentage(hwb.b),
    alpha: normalizeAlpha(hwb.alpha),
});

export const normalizeLABValueUnits = (lab: LABColor<ValueUnit<number>>): LABColor => ({
    l: normalizeColorPercentage(lab.l),
    a: normalizeAB(lab.a, "a"),
    b: normalizeAB(lab.b, "b"),
    alpha: normalizeAlpha(lab.alpha),
});

export const normalizeLCHValueUnits = (lch: LCHColor<ValueUnit<number>>): LCHColor => ({
    l: normalizeColorPercentage(lch.l),
    c: normalizeC(lch.c),
    h: normalizeHue(lch.h),
    alpha: normalizeAlpha(lch.alpha),
});

export const normalizeOKLABValueUnits = (
    oklab: OKLABColor<ValueUnit<number>>,
): OKLABColor => ({
    l: normalizeColorPercentage(oklab.l),
    a: normalizeOKAB(oklab.a, "a"),
    b: normalizeOKAB(oklab.b, "b"),
    alpha: normalizeAlpha(oklab.alpha),
});

export const normalizeOKLCHValueUnits = (
    oklch: OKLCHColor<ValueUnit<number>>,
): OKLCHColor => ({
    l: normalizeColorPercentage(oklch.l),
    c: normalizeOKC(oklch.c),
    h: normalizeHue(oklch.h),
    alpha: normalizeAlpha(oklch.alpha),
});

export const normalizeXYZValueUnits = (xyz: XYZColor<ValueUnit<number>>): XYZColor => ({
    x: normalizeColorPercentage(xyz.x),
    y: normalizeColorPercentage(xyz.y),
    z: normalizeColorPercentage(xyz.z),
    alpha: normalizeAlpha(xyz.alpha),
});

// Denormalization functions for each color space
export const denormalizeRGBValueUnits = (
    rgb: RGBColor,
): RGBColor<ValueUnit<number>> => ({
    r: denormalizeRGB(rgb.r, "r"),
    g: denormalizeRGB(rgb.g, "g"),
    b: denormalizeRGB(rgb.b, "b"),
    alpha: denormalizeAlpha(rgb.alpha),
});

export const denormalizeHSLValueUnits = (
    hsl: HSLColor,
): HSLColor<ValueUnit<number>> => ({
    h: denormalizeHue(hsl.h),
    s: denormalizeColorPercentage(hsl.s),
    l: denormalizeColorPercentage(hsl.l),
    alpha: denormalizeAlpha(hsl.alpha),
});

export const denormalizeHSVValueUnits = (
    hsv: HSVColor,
): HSVColor<ValueUnit<number>> => ({
    h: denormalizeHue(hsv.h),
    s: denormalizeColorPercentage(hsv.s),
    v: denormalizeColorPercentage(hsv.v),
    alpha: denormalizeAlpha(hsv.alpha),
});

export const denormalizeHWBValueUnits = (
    hwb: HWBColor,
): HWBColor<ValueUnit<number>> => ({
    h: denormalizeHue(hwb.h),
    w: denormalizeColorPercentage(hwb.w),
    b: denormalizeColorPercentage(hwb.b),
    alpha: denormalizeAlpha(hwb.alpha),
});

export const denormalizeLABValueUnits = (
    lab: LABColor,
): LABColor<ValueUnit<number>> => ({
    l: denormalizeColorPercentage(lab.l),
    a: denormalizeAB(lab.a, "a"),
    b: denormalizeAB(lab.b, "b"),
    alpha: denormalizeAlpha(lab.alpha),
});

export const denormalizeLCHValueUnits = (
    lch: LCHColor,
): LCHColor<ValueUnit<number>> => ({
    l: denormalizeColorPercentage(lch.l),
    c: denormalizeC(lch.c),
    h: denormalizeHue(lch.h),
    alpha: denormalizeAlpha(lch.alpha),
});

export const denormalizeOKLABValueUnits = (
    oklab: OKLABColor,
): OKLABColor<ValueUnit<number>> => ({
    l: denormalizeColorPercentage(oklab.l),
    a: denormalizeOKAB(oklab.a, "a"),
    b: denormalizeOKAB(oklab.b, "b"),
    alpha: denormalizeAlpha(oklab.alpha),
});

export const denormalizeOKLCHValueUnits = (
    oklch: OKLCHColor,
): OKLCHColor<ValueUnit<number>> => ({
    l: denormalizeColorPercentage(oklch.l),
    c: denormalizeOKC(oklch.c),
    h: denormalizeHue(oklch.h),
    alpha: denormalizeAlpha(oklch.alpha),
});

export const denormalizeXYZValueUnits = (
    xyz: XYZColor,
): XYZColor<ValueUnit<number>> => ({
    x: denormalizeColorPercentage(xyz.x),
    y: denormalizeColorPercentage(xyz.y),
    z: denormalizeColorPercentage(xyz.z),
    alpha: denormalizeAlpha(xyz.alpha),
});

export const normalizeColorUnit = (color: ValueUnit) => {
    const value = color.value;
    const colorType = (color.superType?.[1] ?? "rgb") as ColorSpace;

    const normalizedValue = (() => {
        switch (colorType) {
            case "rgb":
                return normalizeRGBValueUnits(value);
            case "hsl":
                return normalizeHSLValueUnits(value);
            case "hsv":
                return normalizeHSVValueUnits(value);
            case "hwb":
                return normalizeHWBValueUnits(value);
            case "lab":
                return normalizeLABValueUnits(value);
            case "lch":
                return normalizeLCHValueUnits(value);
            case "oklab":
                return normalizeOKLABValueUnits(value);
            case "oklch":
                return normalizeOKLCHValueUnits(value);
            case "xyz":
                return normalizeXYZValueUnits(value);
            default:
                return value;
        }
    })();

    return new ValueUnit(
        normalizedValue,
        color.unit,
        color.superType ?? ["color", colorType],
        color.subProperty,
        color.property,
        color.targets,
    ) as ValueUnit<Color, "color">;
};

export const denormalizeColorUnit = (color: ValueUnit) => {
    const value = color.value;
    const colorType = color.superType?.[1] ?? "rgb";

    const denormalizedValue = (() => {
        switch (colorType) {
            case "rgb":
                return denormalizeRGBValueUnits(value);
            case "hsl":
                return denormalizeHSLValueUnits(value);
            case "hsv":
                return denormalizeHSVValueUnits(value);
            case "hwb":
                return denormalizeHWBValueUnits(value);
            case "lab":
                return denormalizeLABValueUnits(value);
            case "lch":
                return denormalizeLCHValueUnits(value);
            case "oklab":
                return denormalizeOKLABValueUnits(value);
            case "oklch":
                return denormalizeOKLCHValueUnits(value);
            case "xyz":
                return denormalizeXYZValueUnits(value);
            default:
                return value;
        }
    })();

    return new ValueUnit(
        denormalizedValue,
        color.unit,
        color.superType ?? ["color", colorType],
        color.subProperty,
        color.property,
        color.targets,
    ) as ValueUnit<Color, "color">;
};

export const normalizeColorUnits = (
    a: ValueUnit<Color, "color">,
    b: ValueUnit<Color, "color">,
) => {
    const to = "lab" as ColorSpace;

    const [newA, newB] = [normalizeColorUnit(a), normalizeColorUnit(b)];
    const [normA, normB] = [color2(newA.value, to), color2(newB.value, to)];

    return [
        new ValueUnit(
            normA,
            "color",
            ["color", to as ColorSpace],
            a.subProperty,
            a.property,
            a.targets,
        ),
        new ValueUnit(
            normB,
            "color",
            ["color", to as ColorSpace],
            b.subProperty,
            b.property,
            b.targets,
        ),
    ];
};
