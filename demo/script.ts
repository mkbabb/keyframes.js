import { Animation } from "../src/animation";
import { bounceInEase, easeInBounce, easeInCubic, easeInQuad } from "../src/easing";
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
};

const transformEnd = {
    x: "50%",
    y: "100%",
};

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

// @keyframes float {
// 	0% {
// 		box-shadow: 0 5px 15px 0px rgba(0,0,0,0.6);
// 		transform: translatey(0px);
// 	}
// 	50% {
// 		box-shadow: 0 25px 15px 0px rgba(0,0,0,0.2);
// 		transform: translatey(-20px);
// 	}
// 	100% {
// 		box-shadow: 0 5px 15px 0px rgba(0,0,0,0.6);
// 		transform: translatey(0px);
// 	}
// }

const transform = (t: number, vars) => {
    const { transform, boxShadow } = vars;
    boxEl.style.transform = `translateY(${transform.y})`;
    boxEl.style.boxShadow = boxShadow;
};

anim.from(0, {
    transform: { y: "0px" },
    boxShadow: "0 5px 15px 0px rgba(0,0,0,0.6)",
})
    .transform(transform)
    .from(50, {
        transform: { y: "-20px" },
        boxShadow: "0 25px 15px 0px rgba(0,0,0,0.2)",
    })
    .transform(transform)
    .from(100, {
        transform: { y: "0px" },
        boxShadow: "0 5px 15px 0px rgba(0,0,0,0.6)",
    });

async function main() {
    await anim.done().loop();
}
main();
