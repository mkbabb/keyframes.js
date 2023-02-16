import { color, RGBColor, rgb, hsl, hcl, lab, lch } from "d3-color";
import P from "parsimmon";
import { ValueUnit } from "../units";
import { colorNames } from "./colorNames";

export const absoluteLengthUnits = ["px", "cm", "mm", "Q", "in", "pc", "pt"] as const;
export const relativeLengthUnits = [
    "em",
    "ex",
    "ch",
    "rem",
    "lh",
    "rlh",
    "vw",
    "vh",
    "vmin",
    "vmax",
    "vb",
    "vi",
    "svw",
    "svh",
    "lvw",
    "lvh",
    "dvw",
    "dvh",
] as const;
export const lengthUnits = [...absoluteLengthUnits, ...relativeLengthUnits] as const;

export const timeUnits = ["s", "ms"] as const;
export const angleUnits = ["deg", "rad", "grad", "turn"] as const;
export const percentageUnits = ["%"] as const;
export const resolutionUnits = ["dpi", "dpcm", "dppx"] as const;

export const units = [
    ...lengthUnits,
    ...timeUnits,
    ...angleUnits,
    ...percentageUnits,
    ...resolutionUnits,
] as const;

export const identifier = P.regexp(/[a-zA-Z][a-zA-Z0-9-]+/);
export const none = P.string("none");
export const integer = P.regexp(/-?\d+/).map(Number);
export const number = P.regexp(/-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/).map(Number);

export const opt = <T>(p: P.Parser<T>) => P.alt(p, P.succeed(undefined));

const hex2rgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
};

const hsv2hsl = (h: number, s: number, v: number) => {
    const l = ((2 - s) * v) / 2;
    const sl = l !== 0 && l !== 1 ? (s * v) / (l < 0.5 ? l * 2 : 2 - l * 2) : 0;
    return [h, sl, l];
};

const hwb2hsl = (h: number, w: number, b: number) => {
    const l = (1 - b) / 2;
    const sl = w === 1 ? 0 : w === 0 ? 1 : (1 - w - b) / (1 - b);
    return [h, sl, l];
};

const colorOptionalAlpha = (r: P.Language, colorType: string) => {
    const name = P.string(colorType)
        .skip(opt(P.string("a")))
        .trim(P.optWhitespace);

    const optionalAlpha = P.alt(
        P.seq(r.colorValue.skip(r.alphaSep), r.colorValue),
        P.seq(r.colorValue)
    );
    const args = P.seq(
        r.colorValue.skip(r.sep),
        r.colorValue.skip(r.sep),
        optionalAlpha
    )
        .trim(P.optWhitespace)
        .wrap(P.string("("), P.string(")"));

    return name.then(args).map(([x, y, [z, a]]) => {
        return [x, y, z, a ?? 1];
    });
};

export const CSSColor = P.createLanguage({
    colorValue: () =>
        P.alt(
            integer.skip(P.string("%")).map((x) => x / 100),
            number
        ),

    comma: () => P.string(","),
    space: () => P.string(" "),
    div: () => P.string("/"),

    sep: (r) => r.comma.or(r.space).trim(P.optWhitespace),
    alphaSep: (r) => r.sep.or(r.div).trim(P.optWhitespace),

    name: () =>
        P.alt(
            ...Object.keys(colorNames)
                .sort((a, b) => b.length - a.length)
                .map(P.string)
        ).map((x) => {
            const c = colorNames[x];
            const [r, g, b] = hex2rgb(c);
            return rgb(r, g, b);
        }),

    hex: () =>
        P.regexp(/#[0-9a-fA-F]{3,6}/).map((x) => {
            const hex = x.slice(1);
            const r = hex.length === 3 ? hex[0] + hex[0] : hex.slice(0, 2);
            const g = hex.length === 3 ? hex[1] + hex[1] : hex.slice(2, 4);
            const b = hex.length === 3 ? hex[2] + hex[2] : hex.slice(4, 6);
            return rgb(parseInt(r, 16), parseInt(g, 16), parseInt(b, 16));
        }),

    rgb: (r) => colorOptionalAlpha(r, "rgb").map(([r, g, b, a]) => rgb(r, g, b, a)),
    hsl: (r) => colorOptionalAlpha(r, "hsl").map(([h, s, l, a]) => hsl(h, s, l, a)),
    hsv: (r) =>
        colorOptionalAlpha(r, "hsv").map(([h, s, v, a]) => {
            const [hh, ss, ll] = hsv2hsl(h, s, v);
            return hsl(hh, ss, ll, a);
        }),
    hwb: (r) =>
        colorOptionalAlpha(r, "hwb").map(([h, w, b, a]) => {
            const [hh, ss, ll] = hwb2hsl(h, w, b);
            return hsl(hh, ss, ll, a);
        }),
    lab: (r) =>
        colorOptionalAlpha(r, "lab").map(([l, a, b, alpha]) => lab(l, a, b, alpha)),
    lch: (r) =>
        colorOptionalAlpha(r, "lch").map(([l, c, h, alpha]) => lch(l, c, h, alpha)),

    Value: (r) =>
        P.alt(r.hex, r.rgb, r.hsl, r.hsv, r.hwb, r.lab, r.lch, r.name).trim(
            P.optWhitespace
        ),
});

export const CSSValueUnit = P.createLanguage({
    lengthUnit: () => P.alt(...lengthUnits.map(P.string)),
    angleUnit: () => P.alt(...angleUnits.map(P.string)),
    timeUnit: () => P.alt(...timeUnits.map(P.string)),
    resolutionUnit: () => P.alt(...resolutionUnits.map(P.string)),
    percentageUnit: () => P.alt(...percentageUnits.map(P.string)),

    Length: (r) =>
        P.seq(number, r.lengthUnit).map(([value, unit]) => {
            let superType = ["length"];
            if (relativeLengthUnits.includes(unit)) {
                superType.push("relative");
            } else if (absoluteLengthUnits.includes(unit)) {
                superType.push("absolute");
            }
            return new ValueUnit(value, unit, superType);
        }),
    Angle: (r) =>
        P.seq(number, r.angleUnit).map(([value, unit]) => {
            return new ValueUnit(value, unit, ["angle"]);
        }),
    Time: (r) =>
        P.seq(number, r.timeUnit).map(([value, unit]) => {
            return new ValueUnit(value, unit, ["time"]);
        }),
    Resolution: (r) =>
        P.seq(number, r.resolutionUnit).map(([value, unit]) => {
            return new ValueUnit(value, unit, ["resolution"]);
        }),
    Percentage: (r) =>
        P.seq(integer, r.percentageUnit).map(([value, unit]) => {
            return new ValueUnit(value, unit, ["percentage"]);
        }),
    Color: (r) => CSSColor.Value.map((x) => new ValueUnit(x, "color")),

    Value: (r) =>
        P.alt(
            r.Length,
            r.Angle,
            r.Time,
            r.Resolution,
            r.Percentage,
            r.Color,
            P.alt(number, none).map((x) => new ValueUnit(x))
        ).trim(P.optWhitespace),
});

export function parseCSSValueUnit(input: string) {
    return CSSValueUnit.Value.tryParse(input);
}
