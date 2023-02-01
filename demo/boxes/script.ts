import { CSSKeyframesToAnimation } from "../../src/animation";
import { lerp, scale } from "../../src/math";
import { parseCSSKeyframes } from "../../src/units";
import { sleep } from "../../src/utils";

const boxEl = document.querySelector<HTMLElement>("#box")!;

const floatInputFrames = /*css*/ `@keyframes float {
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

const moveInputFrames = /*css*/ `
@keyframes example {
    0%   {background-color:red; left:0px; top:0px;}
    25%  {background-color:yellow; left:var(--corner); top:0px;}
    50%  {background-color:blue; left:var(--corner); top:200px;}
    75%  {background-color:green; left:0px; top:200px;}
    100% {background-color:red; left:0px; top:0px;}
}`;

// const moveInputFrames = /*css*/ `
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

const anim = CSSKeyframesToAnimation(boxEl, moveInputFrames, {
    duration: 500,
    iterations: Infinity,
    direction: "alternate",
    fillMode: "forwards",
});

const pauseButton = document.querySelector<HTMLElement>("#pause-btn")!;
pauseButton.addEventListener("click", () => {
    anim.paused = !anim.paused;
});

const playButton = document.querySelector<HTMLElement>("#play-btn")!;
playButton.addEventListener("click", () => {
    anim.play();
});

const tSlider = document.querySelector<HTMLInputElement>("#t-slider")!;

tSlider.addEventListener("input", () => {
    const t = parseFloat(tSlider.value);
    const s = scale(t, 0, 1, 0, anim.options.duration);
    anim.lerpFrames(s);
});
