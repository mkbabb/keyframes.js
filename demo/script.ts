import {
    bounceInEase,
    clamp,
    easeInBounce,
    easeInCubic,
    lerp,
    lerpIn,
} from "../src/math";
import { Animation } from "../src/animation";
import { sleep } from "../src/utils";

const boxEl = document.querySelector<HTMLElement>("#box")!;

const anim = new Animation(5000);

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

anim.from(0, {
    transform: {
        x: "0%",
        y: "0%",
    },
    color: "#C462D8",
})
    .transform(transformFunc)
    .from(50, {
        color: "#6280D8",
    })
    .transform(transformFunc)
    .from(75, {
        color: "#52E898",
        fontSize: "1rem",
    })
    .transform(transformFunc)
    .ease(easeInBounce)
    .from(100, {
        transform: {
            x: "50%",
            y: "100%",
        },
        color: "#E85252",
        fontSize: "1.5rem",
    });

while (true) {
    await anim.done().start();
    await anim.reverse().done().start();
    anim.reverse();
}
