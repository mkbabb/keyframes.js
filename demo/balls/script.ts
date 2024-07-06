import { CSSKeyframesAnimation } from "../../src/animation";
import { CSSCubicBezier } from "../../src/easing";
import { parseCSSKeyframes } from "../../src/parsing/keyframes";

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
    ).fromCSSKeyframes(inputFrames);

    anim.play();
});
