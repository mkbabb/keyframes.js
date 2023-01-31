import { Animation, CSSKeyframesToAnimation, keyframes } from "../../src/animation";
import {
    bounceInEase,
    CSSBezier,
    easeInBounce,
    easeInCubic,
    easeInQuad,
} from "../../src/easing";
import { cubicBezier } from "../../src/math";
import { parseCSSKeyframes } from "../../src/units";

const boxes = document.querySelectorAll<HTMLElement>(".box")!;

const inputFrames = `
@keyframes bounce {
    0% {
      transform: translateY(0px);
    }
    100% {
      transform: translateY(
        var(--bounce-offset)
      );
    }
  }`;

const frames = parseCSSKeyframes(inputFrames);

boxes.forEach((box, i) => {
    const anim = CSSKeyframesToAnimation(box, inputFrames, {
        duration: 200 + 100 * (i + 1),
        iterations: Infinity,
        ease: CSSBezier(0.2, 0.65, 0.6, 1),
    });

    anim.loop();
});
