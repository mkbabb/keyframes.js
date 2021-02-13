import { bounceInEase, clamp, easeInBounce, easeInCubic, lerp } from "../src/math.js";
import { Animato } from "../src/animation.js";

const tmp = document.querySelector<HTMLElement>("#tmp");

const anim = new Animato(1000);

anim.from(0, { x: 0 })
    .do((obj) => {
        const { x } = obj;
        console.log("x: ", obj.x);
        tmp.style.opacity = `${x}%`;
    })
    .ease()
    .from(50, { x: 100, y: 100 })
    .do((obj) => {
        const { y } = obj;
        console.log("y: ", obj.y);

        tmp.style.transform = `translateY(${y}%)`;
    })
    .ease()
    .from(100, { y: 0 });

anim.start();
