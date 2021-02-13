import { easeInBounce } from "../src/math.js";
import { Animation } from "../src/animation.js";
const tmp = document.querySelector("#tmp");
const anim = new Animation(1000);
// anim.from(0, { x: 0 })
//     .do((t, vars) => {
//         const { x } = vars;
//         tmp.style.opacity = `${x}%`;
//     })
//     .from(50, { x: 50, y: 100 })
//     .do((t, vars) => {
//         const { y } = vars;
//         tmp.style.transform = `translateY(${y}%)`;
//     })
//     .ease(easeInCubic)
//     .from(100, { y: 0 })
//     .done();
anim.from(0, { x: 0, y: 1000 })
    .do((t, vars) => {
    const { x, y } = vars;
    tmp.style.opacity = `${x}%`;
    tmp.style.transform = `translateY(${y}%)`;
})
    .ease(easeInBounce)
    .from(100, { x: 100, y: 0 })
    .done();
anim.start();
//# sourceMappingURL=script.js.map