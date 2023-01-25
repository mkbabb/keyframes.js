import { color, RGBColor } from "d3-color";

export type Value = {
    value: number;
    unit: string;
};

function convertRemToPixels(rem: number) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

function percentageHandler(input: string, scale?: number) {
    const value = parseFloat(input.slice(0, -1));

    if (scale) {
        return {
            value: (value / 100) * scale,
            unit: "px",
        };
    } else {
        return {
            value,
            unit: "%",
        };
    }
}

function pxHandler(input: string) {
    const value = parseFloat(input.slice(0, -2));
    return {
        value,
        unit: "px",
    };
}

function remHandler(input: string) {
    const value = parseFloat(input.slice(0, -3));
    return {
        value,
        unit: "rem",
    };
}

export function transformValue(input: string | number): number | Value | RGBColor {
    if (typeof input === "number") {
        return input;
    }

    if (input.endsWith("%")) {
        return percentageHandler(input);
    } else if (input.endsWith("rem")) {
        return remHandler(input);
    } else if (input.endsWith("px")) {
        return pxHandler(input);
    } else if (input.startsWith("rgb") || input.startsWith("hsl")) {
        return color(input)!.rgb();
    } else {
        return color(input)?.rgb() ?? parseFloat(input);
    }
}
