import { vec3, mat3 } from "gl-matrix";

export const RGBA_MAX = 255;

export const ALPHA_RANGE = {
    "%": { min: 0, max: 100 },
    number: { min: 0, max: 1 },
} as const;

export const RGB_RANGE = {
    "%": ALPHA_RANGE["%"],
    number: { min: 0, max: RGBA_MAX },
} as const;

export const HUE_RANGE = {
    deg: { min: 0, max: 360 },
    number: { min: 0, max: 360 },
    "%": ALPHA_RANGE["%"],
} as const;

export const COLOR_SPACE_RANGES = {
    rgb: {
        r: RGB_RANGE,
        g: RGB_RANGE,
        b: RGB_RANGE,
        alpha: ALPHA_RANGE,
    },
    hsl: {
        h: HUE_RANGE,
        s: { "%": ALPHA_RANGE["%"], number: ALPHA_RANGE.number },
        l: { "%": ALPHA_RANGE["%"], number: ALPHA_RANGE.number },
        alpha: ALPHA_RANGE,
    },
    hsv: {
        h: HUE_RANGE,
        s: { "%": ALPHA_RANGE["%"], number: ALPHA_RANGE.number },
        v: { "%": ALPHA_RANGE["%"], number: ALPHA_RANGE.number },
        alpha: ALPHA_RANGE,
    },
    hwb: {
        h: HUE_RANGE,
        w: { "%": ALPHA_RANGE["%"], number: ALPHA_RANGE.number },
        b: { "%": ALPHA_RANGE["%"], number: ALPHA_RANGE.number },
        alpha: ALPHA_RANGE,
    },
    lab: {
        l: { "%": ALPHA_RANGE["%"], number: ALPHA_RANGE["%"] },
        a: { number: { min: -125, max: 125 }, "%": { min: -100, max: 100 } },
        b: { number: { min: -125, max: 125 }, "%": { min: -100, max: 100 } },
        alpha: ALPHA_RANGE,
    },
    lch: {
        l: { "%": ALPHA_RANGE["%"], number: ALPHA_RANGE["%"] },
        c: { number: { min: 0, max: 150 }, "%": ALPHA_RANGE["%"] },
        h: HUE_RANGE,
        alpha: ALPHA_RANGE,
    },
    oklab: {
        l: { "%": ALPHA_RANGE["%"], number: ALPHA_RANGE["%"] },
        a: { number: { min: -0.4, max: 0.4 }, "%": { min: -100, max: 100 } },
        b: { number: { min: -0.4, max: 0.4 }, "%": { min: -100, max: 100 } },
        alpha: ALPHA_RANGE,
    },
    oklch: {
        l: { "%": ALPHA_RANGE["%"], number: ALPHA_RANGE["%"] },
        c: { number: { min: 0, max: 0.5 }, "%": ALPHA_RANGE["%"] },
        h: HUE_RANGE,
        alpha: ALPHA_RANGE,
    },
    xyz: {
        x: { "%": ALPHA_RANGE["%"], number: ALPHA_RANGE.number },
        y: { "%": ALPHA_RANGE["%"], number: ALPHA_RANGE.number },
        z: { "%": ALPHA_RANGE["%"], number: ALPHA_RANGE.number },
        alpha: ALPHA_RANGE,
    },
    kelvin: {
        kelvin: { number: { min: 1000, max: 40000 } },
        alpha: ALPHA_RANGE,
    },
} as const;

export const ALPHA_DENORM_UNIT = "%";

export const COLOR_SPACE_DENORM_UNITS = {
    rgb: {
        r: "",
        g: "",
        b: "",
        alpha: ALPHA_DENORM_UNIT,
    },
    hsl: {
        h: "deg",
        s: "%",
        l: "%",
        alpha: ALPHA_DENORM_UNIT,
    },
    hsv: {
        h: "deg",
        s: "%",
        v: "%",
        alpha: ALPHA_DENORM_UNIT,
    },
    hwb: {
        h: "deg",
        w: "%",
        b: "%",
        alpha: ALPHA_DENORM_UNIT,
    },
    lab: {
        l: "%",
        a: "",
        b: "",
        alpha: ALPHA_DENORM_UNIT,
    },
    lch: {
        l: "%",
        c: "",
        h: "deg",
        alpha: ALPHA_DENORM_UNIT,
    },
    oklab: {
        l: "%",
        a: "",
        b: "",
        alpha: ALPHA_DENORM_UNIT,
    },
    oklch: {
        l: "%",
        c: "",
        h: "deg",
        alpha: ALPHA_DENORM_UNIT,
    },
    xyz: {
        x: "%",
        y: "%",
        z: "%",
        alpha: ALPHA_DENORM_UNIT,
    },
    kelvin: {
        kelvin: "K",
        alpha: ALPHA_DENORM_UNIT,
    },
} as const;

export type ColorSpace = keyof typeof COLOR_SPACE_RANGES;

// pretty names of the color spaces:
export const COLOR_SPACE_NAMES = {
    rgb: "RGB",
    hsl: "HSL",
    hsv: "HSV",
    hwb: "HWB",
    lab: "Lab",
    lch: "LCh",
    oklab: "OKLab",
    oklch: "OKLCh",
    xyz: "XYZ",
    kelvin: "Kelvin",
} as const;

// From CIE 15:2004 table T.3
export const WHITE_POINT_D65 = vec3.fromValues(
    ...[0.3127 / 0.329, 1.0, (1.0 - 0.3127 - 0.329) / 0.329],
);

export const WHITE_POINT_D50 = vec3.fromValues(
    ...[0.3457 / 0.3585, 1.0, (1.0 - 0.3457 - 0.3585) / 0.3585],
);

export const WHITE_POINT_D65_D50 = mat3.fromValues(
    ...[1.0479297925449969, 0.022946870601609652, -0.05019226628920524],
    ...[0.02962780877005599, 0.9904344267538799, -0.017073799063418826],
    ...[-0.009243040646204504, 0.015055191490298152, 0.7518742814281371],
);
mat3.transpose(WHITE_POINT_D65_D50, WHITE_POINT_D65_D50);

export const WHITE_POINT_D50_D65 = mat3.create();
mat3.invert(WHITE_POINT_D50_D65, WHITE_POINT_D65_D50);

export const WHITE_POINTS = {
    D65: WHITE_POINT_D65,
    D50: WHITE_POINT_D50,
};

export type WhitePoint = keyof typeof WHITE_POINTS;

export const COLOR_NAMES = {
    aliceblue: "#f0f8ff",
    antiquewhite: "#faebd7",
    aqua: "#00ffff",
    aquamarine: "#7fffd4",
    azure: "#f0ffff",
    beige: "#f5f5dc",
    bisque: "#ffe4c4",
    black: "#000000",
    blanchedalmond: "#ffebcd",
    blue: "#0000ff",
    blueviolet: "#8a2be2",
    brown: "#a52a2a",
    burlywood: "#deb887",
    cadetblue: "#5f9ea0",
    chartreuse: "#7fff00",
    chocolate: "#d2691e",
    coral: "#ff7f50",
    cornflowerblue: "#6495ed",
    cornsilk: "#fff8dc",
    crimson: "#dc143c",
    cyan: "#00ffff",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    darkgoldenrod: "#b8860b",
    darkgray: "#a9a9a9",
    darkgreen: "#006400",
    darkgrey: "#a9a9a9",
    darkkhaki: "#bdb76b",
    darkmagenta: "#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: "#ff8c00",
    darkorchid: "#9932cc",
    darkred: "#8b0000",
    darksalmon: "#e9967a",
    darkseagreen: "#8fbc8f",
    darkslateblue: "#483d8b",
    darkslategray: "#2f4f4f",
    darkslategrey: "#2f4f4f",
    darkturquoise: "#00ced1",
    darkviolet: "#9400d3",
    deeppink: "#ff1493",
    deepskyblue: "#00bfff",
    dimgray: "#696969",
    dimgrey: "#696969",
    dodgerblue: "#1e90ff",
    firebrick: "#b22222",
    floralwhite: "#fffaf0",
    forestgreen: "#228b22",
    fuchsia: "#ff00ff",
    gainsboro: "#dcdcdc",
    ghostwhite: "#f8f8ff",
    gold: "#ffd700",
    goldenrod: "#daa520",
    gray: "#808080",
    green: "#008000",
    greenyellow: "#adff2f",
    grey: "#808080",
    honeydew: "#f0fff0",
    hotpink: "#ff69b4",
    indianred: "#cd5c5c",
    indigo: "#4b0082",
    ivory: "#fffff0",
    khaki: "#f0e68c",
    lavender: "#e6e6fa",
    lavenderblush: "#fff0f5",
    lawngreen: "#7cfc00",
    lemonchiffon: "#fffacd",
    lightblue: "#add8e6",
    lightcoral: "#f08080",
    lightcyan: "#e0ffff",
    lightgoldenrodyellow: "#fafad2",
    lightgray: "#d3d3d3",
    lightgreen: "#90ee90",
    lightgrey: "#d3d3d3",
    lightpink: "#ffb6c1",
    lightsalmon: "#ffa07a",
    lightseagreen: "#20b2aa",
    lightskyblue: "#87cefa",
    lightslategray: "#778899",
    lightslategrey: "#778899",
    lightsteelblue: "#b0c4de",
    lightyellow: "#ffffe0",
    lime: "#00ff00",
    limegreen: "#32cd32",
    linen: "#faf0e6",
    magenta: "#ff00ff",
    maroon: "#800000",
    mediumaquamarine: "#66cdaa",
    mediumblue: "#0000cd",
    mediumorchid: "#ba55d3",
    mediumpurple: "#9370db",
    mediumseagreen: "#3cb371",
    mediumslateblue: "#7b68ee",
    mediumspringgreen: "#00fa9a",
    mediumturquoise: "#48d1cc",
    mediumvioletred: "#c71585",
    midnightblue: "#191970",
    mintcream: "#f5fffa",
    mistyrose: "#ffe4e1",
    moccasin: "#ffe4b5",
    navajowhite: "#ffdead",
    navy: "#000080",
    oldlace: "#fdf5e6",
    olive: "#808000",
    olivedrab: "#6b8e23",
    orange: "#ffa500",
    orangered: "#ff4500",
    orchid: "#da70d6",
    palegoldenrod: "#eee8aa",
    palegreen: "#98fb98",
    paleturquoise: "#afeeee",
    palevioletred: "#db7093",
    papayawhip: "#ffefd5",
    peachpuff: "#ffdab9",
    peru: "#cd853f",
    pink: "#ffc0cb",
    plum: "#dda0dd",
    powderblue: "#b0e0e6",
    purple: "#800080",
    rebeccapurple: "#663399",
    red: "#ff0000",
    rosybrown: "#bc8f8f",
    royalblue: "#4169e1",
    saddlebrown: "#8b4513",
    salmon: "#fa8072",
    sandybrown: "#f4a460",
    seagreen: "#2e8b57",
    seashell: "#fff5ee",
    sienna: "#a0522d",
    silver: "#c0c0c0",
    skyblue: "#87ceeb",
    slateblue: "#6a5acd",
    slategray: "#708090",
    slategrey: "#708090",
    snow: "#fffafa",
    springgreen: "#00ff7f",
    steelblue: "#4682b4",
    tan: "#d2b48c",
    teal: "#008080",
    thistle: "#d8bfd8",
    tomato: "#ff6347",
    turquoise: "#40e0d0",
    violet: "#ee82ee",
    wheat: "#f5deb3",
    white: "#ffffff",
    whitesmoke: "#f5f5f5",
    yellow: "#ffff00",
    yellowgreen: "#9acd32",
} as const;
