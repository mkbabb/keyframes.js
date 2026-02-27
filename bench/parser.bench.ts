import { bench, describe } from "vitest";
import { CSSKeyframesAnimation } from "../src/animation";

const simpleKeyframes = `
    from { opacity: 0; }
    to { opacity: 1; }
`;

const complexKeyframes = Array.from({ length: 11 }, (_, i) => {
    const pct = Math.round((i / 10) * 100);
    return `${pct}% { opacity: ${i / 10}; transform: translateX(${i * 20}px) translateY(${i * 10}px); }`;
}).join("\n");

describe("parseCSSKeyframes", () => {
    bench("simple 2-stop (cold)", () => {
        new CSSKeyframesAnimation({ duration: 1000 }).fromString(simpleKeyframes);
    });

    bench("complex 11-stop (cold)", () => {
        new CSSKeyframesAnimation({ duration: 1000 }).fromString(complexKeyframes);
    });
});

describe("fromString end-to-end", () => {
    bench("simple 2-stop full pipeline", () => {
        const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(simpleKeyframes);
        // Simulate one frame of interpolation
        anim.interpFrames(500, false);
    });

    bench("complex 11-stop full pipeline", () => {
        const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(complexKeyframes);
        anim.interpFrames(500, false);
    });
});
