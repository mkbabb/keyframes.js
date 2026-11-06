/**
 * `colorSpace` accepts every space value.js names. value.js 4.3.0 made
 * `xyz-d50` and `display-p3-linear` spaces of their own; before this the
 * accept-list stopped at `jzazbz`, so `setColorSpace("xyz-d50")` threw.
 */
import { describe, expect, it } from "vitest";
import { convertColor, parseCssColor } from "@mkbabb/value.js/color";
import { CSSKeyframesAnimation } from "../../src/animation/engine";
import { AnimationOptionError } from "../../src/animation/internal/errors";

const midpoint = (colorSpace: string): string => {
    const a = new CSSKeyframesAnimation({}, document.createElement("div"));
    a.fromString(
        `@keyframes p { from { color: rgb(255, 0, 0) } to { color: rgb(0, 0, 255) } }`,
    );
    a.setColorSpace(colorSpace as never);
    const value = a.at(0.5).color;
    if (typeof value !== "string" || value.length === 0) throw new Error("no color at 0.5");
    return value;
};

/** The midpoint's colour, read back in XYZ D65 (one frame for every space). */
const inXyz = (css: string): readonly number[] => {
    const parsed = parseCssColor(css);
    if (!parsed.ok) throw new Error(`unparsable midpoint ${css}`);
    const xyz = convertColor(parsed.value, "xyz");
    if (!xyz.ok) throw new Error(`no xyz for ${css}`);
    return xyz.value.channels as readonly number[];
};

describe("colorSpace accepts the value.js 4.3 spaces", () => {
    // A linear mix is the same colour in two spaces one linear map apart, so
    // each new space's midpoint, written in its own space, is its linear
    // sibling's colour.
    it.each([
        ["xyz-d50", "xyz"],
        ["display-p3-linear", "srgb-linear"],
    ])("%s mixes, and its midpoint is %s's", (space, sibling) => {
        const own = midpoint(space);
        expect(own.startsWith(`color(${space} `)).toBe(true);
        const [a, b] = [inXyz(own), inXyz(midpoint(sibling))];
        a.forEach((c, i) => expect(c).toBeCloseTo(b[i]!, 6));
    });

    it("still refuses a space value.js does not name", () => {
        expect(() => midpoint("xyz-d51")).toThrow(AnimationOptionError);
    });
});
