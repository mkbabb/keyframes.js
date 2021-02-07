import { easeInBounce, lerp } from "../src/math.js";
import { smoothAnimate } from "../src/animation.js";
const tmp = document.querySelector("#tmp");
const transformFunc = (v, t) => {
    const x = lerp(t, 500, 0);
    tmp.style.opacity = `${v}%`;
    tmp.style.transform = `translateY(${x}%)`;
    return false;
};
smoothAnimate(100, 0, 1000, transformFunc, easeInBounce);
//# sourceMappingURL=script.js.map