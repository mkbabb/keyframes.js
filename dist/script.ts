import { bounceInEase, clamp, easeInBounce, easeInCubic, lerp } from "../src/math.js";
import { Animato } from "../src/animation.js";

const tmp = document.querySelector<HTMLElement>("#tmp");

const anim = new Animato(500);

anim.from(0)
    .do((t) => {
        tmp.style.opacity = "0";
    })
    .ease()
    .from(0, 100)
    .do((t) => {
        const x = lerp(t, 100, 0);
        tmp.style.transform = `translateY(${x}%)`;
    })
    .ease(bounceInEase)
    .from(75, 100)
    .do((t) => {
        const x = lerp(t, 0, 100);
        tmp.style.opacity = `${x}%`;
    })
    .ease();

(async () => {
    await anim.start();
})();
