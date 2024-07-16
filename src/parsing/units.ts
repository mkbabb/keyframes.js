import {
    Color,
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
} from "@src/units/color";
import P from "parsimmon";
import { ValueUnit } from "../units";
import { COLOR_NAMES } from "../units/color/constants";
import { hex2rgb, kelvin2rgb } from "../units/color/utils";
import {
    ABSOLUTE_LENGTH_UNITS,
    ANGLE_UNITS,
    LENGTH_UNITS,
    PERCENTAGE_UNITS,
    RELATIVE_LENGTH_UNITS,
    RESOLUTION_UNITS,
    TIME_UNITS,
} from "../units/constants";
import { convertToDegrees } from "../units/utils";
import * as utils from "./utils";

const createColorValueUnit = (value: Color) => {
    return new ValueUnit(
        value,
        "color",
        ["color", value.colorSpace],
        undefined,
        "color",
    );
};

const colorOptionalAlpha = (r: P.Language, colorSpace: string) => {
    const name = P.string(colorSpace).skip(utils.opt(utils.istring("a")));

    const optionalAlpha = P.alt(
        P.seq(r.colorValue.skip(r.alphaSep), r.colorValue),
        P.seq(r.colorValue),
    );

    const args = P.seq(
        r.colorValue.skip(r.sep),
        r.colorValue.skip(r.sep),
        optionalAlpha,
    )
        .trim(P.optWhitespace)
        .wrap(P.string("("), P.string(")"));

    return name.then(args).map(([x, y, [z, a]]) => {
        return [x, y, z, a ?? new ValueUnit(1)];
    });
};

export const CSSColor = P.createLanguage({
    colorValue: () =>
        P.alt(
            CSSValueUnit.Percentage,
            CSSValueUnit.Angle.map((x) => {
                const deg = convertToDegrees(x.value, x.unit);
                return new ValueUnit(deg, "deg", ["angle"]);
            }),
            P.alt(utils.number, utils.integer).map((x) => new ValueUnit(x)),
            utils.none.map(() => new ValueUnit(0)),
        ),

    comma: () => P.string(","),
    space: () => P.regex(/\s+/),
    div: () => P.string("/"),

    sep: (r) => P.alt(r.comma.trim(P.optWhitespace), r.space),

    alphaSep: (r) => P.alt(r.div.trim(P.optWhitespace), r.sep),

    name: () =>
        P.alt(
            ...Object.keys(COLOR_NAMES)
                .sort((a, b) => b.length - a.length)
                .map(P.string),
        ).map((x) => {
            const c = COLOR_NAMES[x];
            const { r, g, b } = hex2rgb(c);
            return createColorValueUnit(new RGBColor(r, g, b));
        }),

    hex: () =>
        P.regexp(/#[0-9a-fA-F]{3,8}/).map((x) => {
            const { r, g, b, alpha } = hex2rgb(x);
            return createColorValueUnit(new RGBColor(r, g, b, alpha));
        }),

    kelvin: () =>
        utils.number.skip(utils.istring("k")).map((kelvin) => {
            const rgb = kelvin2rgb(new KelvinColor(kelvin));
            return createColorValueUnit(rgb);
        }),

    rgb: (r) =>
        colorOptionalAlpha(r, "rgb").map(([r, g, b, alpha]) =>
            createColorValueUnit(new RGBColor(r, g, b, alpha)),
        ),

    hsl: (r) =>
        colorOptionalAlpha(r, "hsl").map(([h, s, l, alpha]) =>
            createColorValueUnit(new HSLColor(h, s, l, alpha)),
        ),

    hsv: (r) =>
        colorOptionalAlpha(r, "hsv").map(([h, s, v, alpha]) => {
            return createColorValueUnit(new HSVColor(h, s, v, alpha));
        }),

    hwb: (r) =>
        colorOptionalAlpha(r, "hwb").map(([h, w, b, alpha]) =>
            createColorValueUnit(new HWBColor(h, w, b, alpha)),
        ),

    lab: (r) =>
        colorOptionalAlpha(r, "lab").map(([l, a, b, alpha]) =>
            createColorValueUnit(new LABColor(l, a, b, alpha)),
        ),

    lch: (r) =>
        colorOptionalAlpha(r, "lch").map(([l, c, h, alpha]) =>
            createColorValueUnit(new LCHColor(l, c, h, alpha)),
        ),

    oklab: (r) =>
        colorOptionalAlpha(r, "oklab").map(([l, a, b, alpha]) =>
            createColorValueUnit(new OKLABColor(l, a, b, alpha)),
        ),

    oklch: (r) =>
        colorOptionalAlpha(r, "oklch").map(([l, c, h, alpha]) =>
            createColorValueUnit(new OKLCHColor(l, c, h, alpha)),
        ),

    xyz: (r) =>
        colorOptionalAlpha(r, "xyz").map(([x, y, z, alpha]) =>
            createColorValueUnit(new XYZColor(x, y, z, alpha)),
        ),

    Value: (r) =>
        P.alt(
            r.hex,
            r.kelvin,
            r.rgb,
            r.hsl,
            r.hsv,
            r.hwb,
            r.lab,
            r.lch,
            r.oklab,
            r.oklch,
            r.xyz,
            r.name,
        ).trim(P.optWhitespace),
});

export const CSSValueUnit = P.createLanguage({
    lengthUnit: () => P.alt(...LENGTH_UNITS.map(utils.istring)),
    angleUnit: () => P.alt(...ANGLE_UNITS.map(utils.istring)),
    timeUnit: () => P.alt(...TIME_UNITS.map(utils.istring)),
    resolutionUnit: () => P.alt(...RESOLUTION_UNITS.map(utils.istring)),
    percentageUnit: () => P.alt(...PERCENTAGE_UNITS.map(utils.istring)),

    comma: () => P.string(","),
    space: () => P.string(" "),

    sep: (r) => r.comma.or(r.space).trim(P.optWhitespace),

    Length: (r) =>
        P.seq(utils.number, r.lengthUnit).map(([value, unit]) => {
            let superType = ["length"];
            if (RELATIVE_LENGTH_UNITS.includes(unit)) {
                superType.push("relative");
            } else if (ABSOLUTE_LENGTH_UNITS.includes(unit)) {
                superType.push("absolute");
            }
            return new ValueUnit(value, unit, superType);
        }),

    Angle: (r) =>
        P.seq(utils.number, r.angleUnit).map(([value, unit]) => {
            return new ValueUnit(value, unit, ["angle"]);
        }),

    Time: (r) =>
        P.seq(utils.number, r.timeUnit).map(([value, unit]) => {
            return new ValueUnit(value, unit, ["time"]);
        }),

    TimePercentage: (r) => P.alt(r.Percentage, r.Time),

    Resolution: (r) =>
        P.seq(utils.number, r.resolutionUnit).map(([value, unit]) => {
            return new ValueUnit(value, unit, ["resolution"]);
        }),

    Percentage: (r) =>
        P.alt(
            P.seq(utils.number, r.percentageUnit),
            utils.istring("from").map(() => [0, "%"]),
            utils.istring("to").map(() => [100, "%"]),
        ).map(([value, unit]) => {
            return new ValueUnit(value, unit, ["percentage"]);
        }),

    Color: (r) => CSSColor.Value,

    Slash: () =>
        P.string("/")
            .trim(P.optWhitespace)
            .map(() => new ValueUnit("/", "string")),

    Value: (r) =>
        P.alt(
            r.Length,
            r.Angle,
            r.Time,
            r.Resolution,
            r.Percentage,
            r.Color,
            r.Slash,
            utils.number.map((x) => new ValueUnit(x)),
            utils.none.map(() => new ValueUnit(0)),
        ).trim(P.optWhitespace),
});

export function parseCSSValueUnit(input: string): ValueUnit {
    return CSSValueUnit.Value.tryParse(input);
}

export function parseCSSColor(input: string): ValueUnit {
    return CSSColor.Value.tryParse(input);
}
