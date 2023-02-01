import { CSSKeyframesAnimation } from "../../src/animation";
import { linear } from "../../src/easing";
import { scale } from "../../src/math";
import { parseCSSKeyframes } from "../../src/units";

const boxEl = document.querySelector<HTMLElement>("#box")!;

const floatFrames = /*css*/ `@keyframes float {
	0% {
		box-shadow: 0 5px 15px 0px rgba(0, 0,0,0.6);
		transform: translatey(0px) scale(1);
	}
	50% {
		box-shadow: 0 25px 15px 0px rgba(0,0,0,0.2);
		transform: translatey(-20px) scale(0.99);
	}
	100% {
		box-shadow: 0 5px 15px 0px rgba(0,0,0,0.6);
		transform: translatey(0px) scale(1);
	}
}`;

const exampleFrames = /*css*/ `
@keyframes example {
    0%   {background-color:red; left:0px; top:0px;}
    25%  {background-color:yellow; left:var(--corner); top:0px;}
    50%  {background-color:blue; left:var(--corner); top:200px;}
    75%  {background-color:green; left:0px; top:200px;}
    100% {background-color:red; left:0px; top:0px;}
}`;

// const example = /*css*/ `
// @keyframes example {
//     0%   {background-color:red; left:0px; top:0px;}
//     25%  {background-color:yellow; left:200px; top:0px;}
//     50%  {background-color:blue; left:200px; top:200px;}
//     75%  {background-color:green; left:0px; top:200px;}
//     100% {background-color:red; left:0px; top:0px;}
// }`;

// const moveInputFrames = /*css*/`
// @keyframes example {
//     from {top: 0px; background-color: red;}
//     to {top: 200px; background-color: blue;}
//   }
// `;

const matrixExampleFrames = /*css*/ `
@keyframes matrixExample {
    from {
        top: 0px; background-color: red;
        transform: matrix3d(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1);
    }
    to {
        top: 200px; background-color: blue;
        transform: matrix3d(
            -0.6,       1.34788, 0,        0,
            -2.34788,  -0.6,     0,        0,
             0,         0,       1,        0,
             0,         0,      10,        1);
    }
  }
`;

const motionScaleFrames = /*css*/ `
@keyframes MotionScale {
    from {
      transform: matrix3d(
        1,0,0,0,
        0,1,0,0,
        0,0,1,0,
        -50,-100,0,1.1
      );
    }
    50% {
      transform: matrix3d(
        1,0,0,0,
        0,1,0,0,
        0,0,1,0,
        0,0,0,0.9
      );
    }
    to {
       transform: matrix3d(
        1,0,0,0,
        0,1,0,0,
        0,0,1,0,
        50,100,0,1.1
      );
    }
    }
`;

const frames = parseCSSKeyframes(motionScaleFrames);

const anim = new CSSKeyframesAnimation(
    {
        duration: 2000,
        iterationCount: Infinity,
        direction: "alternate",
        fillMode: "forwards",
        timingFunction: linear,
    },
    boxEl
).fromCSSKeyframes(motionScaleFrames);

const pauseButton = document.querySelector<HTMLElement>("#pause-btn")!;
pauseButton.addEventListener("click", () => {
    anim.pause();
});

const tSlider = document.querySelector<HTMLInputElement>("#t-slider")!;
tSlider.addEventListener("input", () => {
    const t = parseFloat(tSlider.value);
    const s = scale(t, 0, 1, 0, anim.options.duration);

    anim.animation.interpFrames(s);
});

anim.play();
