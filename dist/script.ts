import {
    bounceInEase,
    easeInBounce,
    easeInCubic,
    lerp,
    normalize
} from "../src/math.js";
import {
    animationLoop,
    smoothAnimate,
    smoothAnimateInternal
} from "../src/animation.js";

const tmp = document.querySelector<HTMLElement>("#tmp");

// const transformFunc = (v, t) => {
//     const x = lerp(t, 500, 0);

//     tmp.style.opacity = `${v}%`;
//     tmp.style.transform = `translateY(${x}%)`;

//     return false;
// };

interface Frame {
    start: number;
    stop: number;
    do?: (t: number) => void;
}

class animato {
    duration: number;

    frames: Frame[];

    constructor(duration: number) {
        this.duration = duration;
        this.frames = [];
    }

    from(start: number, stop?: number) {
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
        const transformFunc = (t: number) => {
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
