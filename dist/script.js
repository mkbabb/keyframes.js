import { easeInCubic, lerp } from "../src/math.js";
import { smoothAnimateInternal } from "../src/animation.js";
const tmp = document.querySelector("#tmp");
class animato {
    constructor(duration) {
        this.duration = duration;
        this.frames = [];
    }
    from(start, stop) {
        const that = this;
        if (stop == null) {
            stop = start;
            start = 0;
        }
        const frame = {
            start: (this.duration * start) / 100,
            stop: (this.duration * stop) / 100
        };
        return {
            do: (func) => {
                that.frames.push({
                    do: func,
                    ...frame
                });
                return that;
            }
        };
    }
    start() {
        const transformFunc = (t) => {
            this.frames.forEach((frame) => {
                const v = t * this.duration;
                if (v >= frame.start && v <= frame.stop) {
                    frame.do(t);
                }
            });
        };
        smoothAnimateInternal(this.duration, transformFunc, easeInCubic);
    }
}
const anim = new animato(1000);
anim.from(0, 100)
    .do((t) => {
    const x = lerp(t, 500, 0);
    tmp.style.transform = `translateY(${x}%)`;
})
    .from(0, 100)
    .do((t) => {
    const x = lerp(t, 0, 50);
    tmp.style.opacity = `${x}%`;
});
anim.start();
//# sourceMappingURL=script.js.map