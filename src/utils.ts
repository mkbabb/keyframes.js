import { RGBColor } from "d3-color";
import { lerp } from "./math";
import { transformValue, Value } from "./units";

export async function sleep(ms: number) {
    return await new Promise((resolve) => setTimeout(resolve, ms));
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
