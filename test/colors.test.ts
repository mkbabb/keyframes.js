import { describe, expect, it } from "vitest";
import { parseCSSColor } from "../src/parsing/units";
import { normalizeColorUnit } from "../src/units/color/normalize";
import * as ColorConversions from "../src/units/color/utils";

// Define base colors using CSS color syntax
const baseColors = {
    rgb: [
        "rgb(255, 255, 255)",
        "rgb(255, 230, 255)",
        "rgb(255, 204, 204)",
        "rgb(255, 230, 204)",
        "rgb(255, 255, 204)",
        "rgb(204, 255, 204)",
        "rgb(204, 255, 255)",
        "rgb(204, 204, 255)",
        "rgb(255, 204, 255)",
        "rgb(255, 204, 230)",
        "rgb(255, 204, 255)",
        "rgb(204, 204, 204)",
        "rgb(0, 0, 0)",
    ],
    hsl: [
        "hsl(0, 0%, 100%)",
        "hsl(0, 100%, 90%)",
        "hsl(20, 100%, 90%)",
        "hsl(40, 100%, 90%)",
        "hsl(80, 100%, 90%)",
        "hsl(160, 100%, 90%)",
        "hsl(200, 100%, 90%)",
        "hsl(240, 100%, 90%)",
        "hsl(280, 100%, 90%)",
        "hsl(320, 100%, 90%)",
        "hsl(0, 0%, 80%)",
        "hsl(0, 0%, 0%)",
    ],
    hsv: [
        "hsv(0, 0%, 100%)",
        "hsv(0, 20%, 100%)",
        "hsv(20, 20%, 100%)",
        "hsv(40, 20%, 100%)",
        "hsv(80, 20%, 100%)",
        "hsv(160, 20%, 100%)",
        "hsv(200 20% 100%)",
        "hsv(240, 20%, 100%)",
        "hsv(280, 20%, 100%)",
        "hsv(320, 20%, 100%)",
        "hsv(0, 0%, 80%)",
        "hsv(0, 0%, 0%)",
    ],
    hwb: [
        "hwb(0 0% 0%)",
        "hwb(0 10% 10%)",
        "hwb(20 10% 10%)",
        "hwb(40 10% 10%)",
        "hwb(80 10% 10%)",
        "hwb(160 10% 10%)",
        "hwb(200 10% 10%)",
        "hwb(240 10% 10%)",
        "hwb(280 10% 10%)",
        "hwb(320 10% 10%)",
        "hwb(0 0% 20%)",
        "hwb(0 0% 100%)",
    ],
    lab: [
        "lab(100% 0 0)",
        "lab(88% 16 7)",
        "lab(92% 8 18)",
        "lab(97% -8 21)",
        "lab(92% -23 18)",
        "lab(94% -19 -7)",
        "lab(83% 11 -30)",
        "lab(85% 25 -21)",
        "lab(86% 23 -9)",
        "lab(85% 25 -6)",
        "lab(82% 0 0)",
        "lab(0% 0 0)",
    ],
    lch: [
        "lch(100% 0 0)",
        "lch(88% 17 24)",
        "lch(92% 20 66)",
        "lch(97% 22 111)",
        "lch(92% 29 142)",
        "lch(94% 20 200)",
        "lch(83% 32 290)",
        "lch(85% 33 320)",
        "lch(86% 25 338)",
        "lch(85% 26 347)",
        "lch(82% 0 0)",
        "lch(0% 0 0)",
    ],
    oklab: [
        "oklab(100% 0 0)",
        "oklab(93% 0.03 0.01)",
        "oklab(95% 0.01 0.03)",
        "oklab(98% -0.02 0.04)",
        "oklab(95% -0.06 0.03)",
        "oklab(96% -0.04 -0.01)",
        "oklab(90% 0.02 -0.07)",
        "oklab(91% 0.05 -0.05)",
        "oklab(92% 0.05 -0.02)",
        "oklab(91% 0.05 -0.01)",
        "oklab(89% 0 0)",
        "oklab(0% 0 0)",
    ],
    oklch: [
        "oklch(100% 0 0)",
        "oklch(93% 0.03 18)",
        "oklch(95% 0.03 72)",
        "oklch(98% 0.04 116)",
        "oklch(95% 0.07 153)",
        "oklch(96% 0.04 195)",
        "oklch(90% 0.07 288)",
        "oklch(91% 0.07 315)",
        "oklch(92% 0.05 338)",
        "oklch(91% 0.05 349)",
        "oklch(89% 0 0)",
        "oklch(0% 0 0)",
    ],
    xyz: [
        "xyz(95% 100% 108%)",
        "xyz(83% 72% 57%)",
        "xyz(88% 80% 95%)",
        "xyz(97% 100% 82%)",
        "xyz(86% 100% 88%)",
        "xyz(91% 100% 112%)",
        "xyz(81% 67% 84%)",
        "xyz(84% 68% 82%)",
        "xyz(85% 68% 80%)",
        "xyz(84% 68% 80%)",
        "xyz(80% 0% 0%)",
        "xyz(0% 0% 0%)",
    ],
    kelvin: [
        "6500K",
        "5000K",
        "4000K",
        "3000K",
        "2000K",
        "1000K",
        "500K",
        "300K",
        "200K",
        "100K",
        "0K",
    ],
};

// Define the conversion pairs to test
const conversionPairs = [
    // ["rgb", "hsl"],

    ["rgb", "lab"],
    // ["hsl", "lab"],
    // ["hsv", "lab"],
    // ["hwb", "lab"],
    // ["lch", "lab"],
    // ["oklab", "lab"],
    // ["oklch", "lab"],

    // ["rgb", "xyz"],
    // ["hsl", "xyz"],
    // ["hsv", "xyz"],
    // ["hwb", "xyz"],
    // ["lab", "xyz"],
    // ["lch", "xyz"],
    // ["oklab", "xyz"],
    // ["oklch", "xyz"],
];

describe("Color Conversion Tests", () => {
    conversionPairs.forEach(([fromSpace, toSpace]) => {
        const fromToFunction = ColorConversions[`${fromSpace}2${toSpace}`];
        const toFromFunction = ColorConversions[`${toSpace}2${fromSpace}`];

        const colorSpaceHeader = `${fromSpace.toUpperCase()} -> ${toSpace.toUpperCase()}`;

        if (!fromToFunction || !toFromFunction) {
            console.warn(`Conversion functions for ${colorSpaceHeader} not found`);
            return;
        }

        it(`should convert colors from ${colorSpaceHeader} and back`, () => {
            baseColors[fromSpace].forEach((colorString, index) => {
                const colorUnit = parseCSSColor(colorString);

                const color = normalizeColorUnit(colorUnit).value;

                let backConverted = color;
                let converted = color;

                for (let i = 0; i < 10; i++) {
                    converted = fromToFunction(...Object.values(backConverted));
                    backConverted = toFromFunction(...Object.values(converted));
                }

                Object.entries(color).forEach(([key, value]) => {
                    expect(
                        value,
                        `${colorUnit}, ${key} not close to original value`,
                    ).toBeCloseTo(backConverted[key], 6);
                });
            });
        });
    });
});
