import { color, RGBColor } from "d3-color";
import { lerp } from "./math";

export async function sleep(ms: number) {
    return await new Promise((resolve) => setTimeout(resolve, ms));
}

export type Value = {
    value: number | object;
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

export function transformValue(input: string | number): Value {
    if (typeof input === "number") {
        return {
            value: input,
            unit: "",
        };
    }

    // TODO! handle more units.
    if (input.endsWith("%")) {
        return percentageHandler(input);
    } else if (input.endsWith("rem")) {
        return remHandler(input);
    } else if (input.endsWith("px")) {
        return pxHandler(input);
    } else {
        const c = color(input)?.rgb();
        if (c != null) {
            return {
                value: c,
                unit: "color",
            };
        }
        return {
            value: parseFloat(input),
            unit: "",
        };
    }
}

export function transformObject(input: any): object {
    if (typeof input === "object") {
        const output = {} as any;
        for (const [key, value] of Object.entries(input)) {
            output[key] = transformObject(value);
        }
        return output;
    }

    return transformValue(input);
}

export function reverseTransformObject(input: any): number | string | object {
    if (typeof input === "object" && input?.value == null && input?.unit == null) {
        const output = {} as any;
        for (const [key, value] of Object.entries(input)) {
            output[key] = reverseTransformObject(value);
        }
        return output;
    }

    const { value, unit } = input as Value;

    if (unit === "") {
        return value;
    } else if (unit === "color") {
        const c = value as RGBColor;
        return `rgb(${c.r}, ${c.g}, ${c.b})`;
    } else {
        return `${value}${unit}`;
    }
}

export function interpolateObject(t: number, start: any, stop: any): any {
    if (typeof start === "object") {
        const output = {} as any;
        for (const key of Object.keys(start)) {
            output[key] = interpolateObject(t, start[key], stop[key]);
        }
        return output;
    } else if (typeof start === "number" && typeof stop === "number") {
        return lerp(t, start, stop);
    }
    return start;
}
