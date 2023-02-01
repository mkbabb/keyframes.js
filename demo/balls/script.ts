import { Animation, CSSKeyframesAnimation } from "../../src/animation";
import {
    bounceInEase,
    CSSBezier,
    easeInBounce,
    easeInCubic,
    easeInQuad,
} from "../../src/easing";
import { cubicBezier } from "../../src/math";
import { parseCSSKeyframes } from "../../src/units";

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
    const anim = new CSSKeyframesAnimation(
        {
            duration: 200 + 100 * i,
            iterationCount: Infinity,
            direction: "alternate",
            fillMode: "forwards",
            timingFunction: CSSBezier(0.2, 0.65, 0.6, 1),
        },
        box
    ).fromCSSKeyframes(inputFrames);

    anim.play();
});
