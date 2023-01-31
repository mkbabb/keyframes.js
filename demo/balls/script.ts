import { Animation, keyframes } from "../../src/animation";
import { bounceInEase, easeInBounce, easeInCubic, easeInQuad } from "../../src/easing";
import { parseCSSKeyframes } from "../../src/units";

const boxes = document.querySelectorAll<HTMLElement>(".box")!;

const inputFrames = `
@keyframes bounce {
    0% {
        transform: translateY(var(--bounce-offset));
    }
    100% {
        transform: translateY(var(--bounce-offset));
    }
  }
`;

const frames = parseCSSKeyframes(inputFrames);
console.log(frames);

// const anim = keyframes(boxEl, frames, 4000);

// async function main() {
//     await anim.done().loop();
// }
// main();
