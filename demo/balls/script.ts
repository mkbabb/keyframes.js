import { CSSCubicBezier } from "@mkbabb/value.js";
import { CSSKeyframesAnimation, resolveKeyframes } from "../../src/animation";

// `resolveKeyframes` returns the legacy `Map<percent, vars>` shape
// from a CSS string by walking value.js's Stylesheet AST.
const parseCSSKeyframes = (input: string) => resolveKeyframes(input).keyframes;

const boxes = document.querySelectorAll<HTMLElement>(".anim .box")!;

const inputFrames = /*css*/ `
@keyframes bounce {
    0% {
      transform: translateY(0px);
    }
    100% {
      transform: translateY(var(--bounce-offset));
    }
}`;

const frames = parseCSSKeyframes(inputFrames);

boxes.forEach((box, i) => {
    box.style.setProperty("--bounce-offset", `${-(i + 10)}em`);

    const anim = new CSSKeyframesAnimation(
        {
            duration: 200 + 100 * i,
            iterationCount: Infinity,
            direction: "alternate",
            fillMode: "forwards",
            timingFunction: CSSCubicBezier(0.2, 0.65, 0.6, 1),
        },
        box,
    ).fromString(inputFrames);

    anim.play();
});
