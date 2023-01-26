import {
    bounceInEase,
    clamp,
    easeInBounce,
    easeInCubic,
    easeInQuad,
    lerp,
    lerpIn,
} from "../src/easing";
import { Animation } from "../src/animation";
import { sleep } from "../src/utils";

const boxEl = document.querySelector<HTMLElement>("#box")!;

const anim = new Animation(2000);

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

const transformFunc = (t: number, vars) => {
    const { transform, color, fontSize } = vars;

    if (transform) {
        boxEl.style.transform = `translate(${transform.x}, ${transform.y})`;
    }
    if (color) {
        boxEl.style.backgroundColor = color;
    }
    if (fontSize) {
        boxEl.style.fontSize = fontSize;
    }
};

const transformStart = {
    x: "0%",
    y: "0%",
    hey: 0,
};

const transformEnd = {
    x: "50%",
    y: "100%",
    hey: 1,
};

anim.from(0, {
    transform: transformStart,
    color: "#C462D8",
})
    .transform(transformFunc)
    .ease(easeInQuad)
    .from(50, {
        color: "#6280D8",
    })
    .transform(transformFunc)
    .ease(easeInQuad)
    .from(75, {
        color: "#52E898",
        fontSize: "1rem",
    })
    .transform(transformFunc)
    .ease(easeInQuad)
    .from(100, {
        transform: transformEnd,
        color: "#E85252",
        fontSize: "3rem",
    });

async function main() {
    while (true) {
        await anim.done().start();
        await anim.reverse().done().start();
        anim.reverse();
    }
}
main();
