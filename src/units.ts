import { color } from "d3-color";
import * as P from "parsimmon";

export type Value = {
    value: number | object;
    unit: string;
};

export function parseCSSUnitValue(): P.Parser<{ value: number; unit: string }> {
    const number = P.regexp(/-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/).map(Number);
    const unit = P.regexp(/[a-zA-Z%]+/);

    return P.seq(number, unit).map(([value, unit]) => {
        return { value, unit };
    });
}

export function convertToPixels(
    value: number,
    unit: string,
    element?: HTMLElement,
    property?: string
): number {
    if (unit === "em") {
        value *= parseFloat(getComputedStyle(element).fontSize);
    } else if (unit === "rem") {
        value *= parseFloat(getComputedStyle(document.documentElement).fontSize);
    } else if (unit === "vh") {
        value *= window.innerHeight / 100;
    } else if (unit === "vw") {
        value *= window.innerWidth / 100;
    } else if (unit === "vmin") {
        value *= Math.min(window.innerHeight, window.innerWidth) / 100;
    } else if (unit === "vmax") {
        value *= Math.max(window.innerHeight, window.innerWidth) / 100;
    } else if (unit === "%") {
        const parentValue = parseFloat(
            getComputedStyle(element.parentElement).getPropertyValue(property)
        );
        value = (value / 100) * parentValue;
    }
    return value;
}

export function convertAbsoluteUnitToPixels(value: number, unit: string) {
    let pixels = value;
    if (unit === "cm") {
        pixels *= 96 / 2.54;
    } else if (unit === "mm") {
        pixels *= 96 / 25.4;
    } else if (unit === "in") {
        pixels *= 96;
    } else if (unit === "pt") {
        pixels *= 4 / 3;
    } else if (unit === "pc") {
        pixels *= 16;
    }
    return pixels;
}

export function transformValue(input: string | number): Value {
    if (typeof input === "number") {
        return {
            value: input,
            unit: "",
        };
    }

    try {
        return parseCSSUnitValue().tryParse(input);
    } catch (e) {
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
