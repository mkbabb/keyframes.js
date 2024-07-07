import { rgb, hsl, lab, lch } from "d3-color";
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
export const resolutionUnits = ["dpi", "dpcm", "dppx", "cqw"] as const;

export const units = [
    ...lengthUnits,
    ...timeUnits,
    ...angleUnits,
    ...percentageUnits,
    ...resolutionUnits,
] as const;

export const identifier = P.regexp(/-?[a-zA-Z][a-zA-Z0-9-]*/);

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

// Algorithm based off of https://tannerhelland.com/2012/09/18/convert-temperature-rgb-algorithm-code.html
const kelvin2rgb = (temp: number): [number, number, number] => {
    // Clamp temperature to valid range
    temp = Math.max(1000, Math.min(40000, temp)) / 100;

    let r, g, b;

    // Calculate red
    if (temp <= 66) {
        r = 255;
    } else {
        r = temp - 60;
        r = 329.698727446 * r ** -0.1332047592;
        r = Math.max(0, Math.min(255, r));
    }

    // Calculate green
    if (temp <= 66) {
        g = temp;
        g = 99.4708025861 * Math.log(g) - 161.1195681661;
    } else {
        g = temp - 60;
        g = 288.1221695283 * g ** -0.0755148492;
    }
    g = Math.max(0, Math.min(255, g));

    // Calculate blue
    if (temp >= 66) {
        b = 255;
    } else if (temp <= 19) {
        b = 0;
    } else {
        b = temp - 10;
        b = 138.5177312231 * Math.log(b) - 305.0447927307;
        b = Math.max(0, Math.min(255, b));
    }

    return [Math.round(r), Math.round(g), Math.round(b)];
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

export const rgb2hsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;

    if (max === min) {
        return [0, 0, l];
    }

    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    let h = 0;
    switch (max) {
        case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
        case g:
            h = (b - r) / d + 2;
            break;
        case b:
            h = (r - g) / d + 4;
            break;
    }

    h /= 6;

    return [h, s, l];
};

export const getMatrixValues = (value: ValueUnit<any>) => {
    if (!value.unit.startsWith("matrix")) {
        return value;
    }

    const values = value.value as number[];

    if (value.unit === "matrix") {
        return {
            scaleX: values[0],
            skewX: values[1],
            skewY: values[2],
            scaleY: values[3],
            translateX: values[4],
            translateY: values[5],
        };
    } else if (value.unit === "matrix3d") {
        return {
            scaleX: values[0],
            skewX: values[1],
            skewY: values[2],
            skewZ: values[3],
            translateX: values[4],
            translateY: values[5],
            translateZ: values[6],
            perspectiveX: values[7],
            perspectiveY: values[8],
            perspectiveZ: values[9],
            perspectiveW: values[10],
            rotateX: values[11],
            rotateY: values[12],
            rotateZ: values[13],
            rotateW: values[14],
        };
    }
};

const colorOptionalAlpha = (r: P.Language, colorType: string) => {
    const name = P.string(colorType)
        .skip(opt(P.string("a")))
        .trim(P.optWhitespace);

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
        return [x, y, z, a ?? 1];
    });
};

export const CSSColor = P.createLanguage({
    colorValue: () =>
        P.alt(
            integer.skip(P.string("%")).map((x) => x / 100),
            number,
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
                .map(P.string),
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

    kelvin: () =>
        P.regexp(/([0-9]+)k/i).map((x) => {
            const [r, g, b] = kelvin2rgb(parseInt(x));
            return rgb(r, g, b);
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
        P.alt(r.hex, r.kelvin, r.rgb, r.hsl, r.hsv, r.hwb, r.lab, r.lch, r.name).trim(
            P.optWhitespace,
        ),
});

export const CSSValueUnit = P.createLanguage({
    lengthUnit: () => P.alt(...lengthUnits.map(P.string)),
    angleUnit: () => P.alt(...angleUnits.map(P.string)),
    timeUnit: () => P.alt(...timeUnits.map(P.string)),
    resolutionUnit: () => P.alt(...resolutionUnits.map(P.string)),
    percentageUnit: () => P.alt(...percentageUnits.map(P.string)),

    comma: () => P.string(","),
    space: () => P.string(" "),

    sep: (r) => r.comma.or(r.space).trim(P.optWhitespace),

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
        P.seq(number, r.percentageUnit).map(([value, unit]) => {
            return new ValueUnit(value, unit, ["percentage"]);
        }),
    Color: (r) => CSSColor.Value.map((x) => new ValueUnit(x, "color")),

    Slash: () =>
        P.string("/")
            .trim(P.optWhitespace)
            .map(() => new ValueUnit("/", "string")),

    Matrix: (r) =>
        number
            .sepBy(r.sep)
            .wrap(P.string("matrix("), P.string(")"))
            .map(([a, b, c, d, e, f]) => {
                return new ValueUnit([a, b, c, d, e, f], "matrix");
            }),

    Matrix3d: (r) =>
        number
            .sepBy(r.sep)
            .wrap(P.string("matrix3d("), P.string(")"))
            .map(([a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p]) => {
                return new ValueUnit(
                    [a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p],
                    "matrix3d",
                );
            }),

    Value: (r) =>
        P.alt(
            r.Length,
            r.Angle,
            r.Time,
            r.Resolution,
            r.Percentage,
            r.Color,
            r.Matrix,
            r.Matrix3d,
            r.Slash,
            P.alt(number, none).map((x) => new ValueUnit(x)),
        ).trim(P.optWhitespace),
});

export function parseCSSValueUnit(input: string) {
    return CSSValueUnit.Value.tryParse(input);
}

export function parseCSSColor(input: string) {
    return CSSColor.Value.tryParse(input);
}
