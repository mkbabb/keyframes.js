import { Animation, keyframes } from "../../src/animation";
import { bounceInEase, easeInBounce, easeInCubic, easeInQuad } from "../../src/easing";
import { lerpValues, parseCSSKeyframes, Value } from "../../src/units";
import { sleep, transformObject } from "../../src/utils";

const boxEl = document.querySelector<HTMLElement>("#box")!;

const floatInputFrames = `@keyframes float {
	0% {
		box-shadow: 0 5px 15px 0px rgba(0,0,0,0.6) translate(0, 0);
		transform: translatey(0px) scale(1);
	}
	50% {
		box-shadow: 0 25px 15px 0px rgba(0,0,0,0.2);
		transform: translatey(-20px) scale(0.5);
	}
	100% {
		box-shadow: 0 5px 15px 0px rgba(0,0,0,0.6);
		transform: translatey(0px) scale(1);
	}
}`;

const moveInputFrames = `
@keyframes example {
    0%   {background-color:red; left:0px; top:0px;}
    25%  {background-color:yellow; left:200px; top:0px;}
    50%  {background-color:blue; left:200px; top:200px;}
    75%  {background-color:green; left:0px; top:200px;}
    100% {background-color:red; left:0px; top:0px;}
  }
`;

export function flatten(input: any) {
    const output: any = {};

    const recurse = (input: any, parentKey: string = "") => {
        if (typeof input === "object") {
            for (const [k, v] of Object.entries(input)) {
                const currentKey = parentKey ? `${parentKey}.${k}` : k;

                if (v instanceof Array) {
                    for (let i = 0; i < v.length; i++) {
                        const value = v[i];

                        if (!(value instanceof Value) && !value?.rgba) {
                            recurse(value, currentKey);
                        } else {
                            if (!output[currentKey]) {
                                output[currentKey] = [];
                            }

                            output[currentKey].push(value);
                        }
                    }
                } else {
                    output[currentKey] = [v];
                }
            }
        } else {
            return input;
        }
    };

    recurse(input);

    return output;
}

const frames = parseCSSKeyframes(floatInputFrames);

const [start, end] = [flatten(frames[0]), flatten(frames[100])];

const anim = keyframes(boxEl, frames, 4000);

async function main() {
    await anim.done().loop();
}
main();
