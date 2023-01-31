import { Animation, keyframes } from "../../src/animation";
import { bounceInEase, easeInBounce, easeInCubic, easeInQuad } from "../../src/easing";
import { parseCSSKeyframes } from "../../src/units";
import { sleep } from "../../src/utils";

const boxEl = document.querySelector<HTMLElement>("#box")!;

// const anim = new Animation(2000);
// anim.from(0, { color: "green", opacity: "100%", y: 100, nested: { x: 0, y: 0 } })
//     .transform((t, vars) => {
//         const { opacity, y, nested, color } = vars;

//         console.log(vars);

//         tmp.style.backgroundColor = color;
//         tmp.style.opacity = opacity;
//         tmp.style.transform = `translateY(${y}%)`;
//     })

//     .ease(easeInBounce)
//     .from(100, { color: "blue", opacity: "100%", y: 0, nested: { x: 100, y: 100 } })
//     .done()
//     .start();

// const anim = new Animation(2000);
// const transformFunc = (t: number, vars) => {
//     const { transform, color, fontSize } = vars;

//     if (transform) {
//         boxEl.style.transform = `translate(${transform.x}, ${transform.y})`;
//     }
//     if (color) {
//         boxEl.style.backgroundColor = color;
//     }
//     if (fontSize) {
//         boxEl.style.fontSize = fontSize;
//     }
// };

// const transformStart = {
//     x: "0%",
//     y: "0%",
// };

// const transformEnd = {
//     x: "50%",
//     y: "100%",
// };

// anim.from(0, {
//     transform: transformStart,
//     color: "#C462D8",
// })
//     .transform(transformFunc)
//     .from(52, {
//         color: "#6280D8",
//     })
//     .transform(transformFunc)
//     .from(75, {
//         color: "#52E898",
//         fontSize: "1rem",
//     })
//     .transform(transformFunc)
//     .from(100, {
//         transform: transformEnd,
//         color: "#E85252",
//         fontSize: "3rem",
//     });

// const inputFrames = `@keyframes float {
// 	0% {
// 		box-shadow: 0 5px 15px 0px rgba(0,0,0,0.6);
// 		transform: translatey(0px) scale(1);
// 	}
// 	50% {
// 		box-shadow: 0 25px 15px 0px rgba(0,0,0,0.2);
// 		transform: translatey(-20px) scale(0.5);
// 	}
// 	100% {
// 		box-shadow: 0 5px 15px 0px rgba(0,0,0,0.6);
// 		transform: translatey(0px) scale(1);
// 	}
// }`;

const inputFrames = `
@keyframes example {
    0%   {background-color:red; left:0px; top:0px;}
    25%  {background-color:yellow; left:200px; top:0px;}
    50%  {background-color:blue; left:200px; top:200px;}
    75%  {background-color:green; left:0px; top:200px;}
    100% {background-color:red; left:0px; top:0px;}
  }
`;

const frames = parseCSSKeyframes(inputFrames);
console.log(frames);

const anim = keyframes(boxEl, frames, 4000);

async function main() {
    await anim.done().loop();
}
main();
