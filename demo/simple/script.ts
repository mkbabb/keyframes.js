import { CSSKeyframesAnimation } from "../../src/animation";

const boxEl = document.querySelector<HTMLElement>("#box")!;

const anim = new CSSKeyframesAnimation({
    duration: 2000,
    iterations: Infinity,
    direction: "alternate",
    fillMode: "forwards",
});

const transformFunc = (t: number, vars) => {
    const { transform, backgroundColor, fontSize, rotate } = vars;

    if (transform) {
        boxEl.style.transform = `translate(${transform.x}, ${transform.y})`;
        boxEl.style.transform += ` scale(${transform.a.b.c.d})`;
    }
    if (backgroundColor) {
        boxEl.style.backgroundColor = backgroundColor;
    }
    if (fontSize) {
        boxEl.style.fontSize = fontSize;
    }
    if (rotate) {
        boxEl.style.transform += ` rotate(${rotate})`;
    }
};

const transformStart = {
    x: "-50%",
    y: "-100%",
    a: {
        b: {
            c: {
                d: "75%",
            },
        },
    },
};

const transformEnd = {
    x: "50%",
    y: "100%",
    a: {
        b: {
            c: {
                d: "200%",
            },
        },
    },
};

anim.fromFrames({
    0: [
        {
            rotate: "0turn",
            transform: transformStart,
            backgroundColor: "#C462D8",
        },
        transformFunc,
    ],
    50: [
        {
            backgroundColor: "#6280D8",
        },
    ],
    75: [
        {
            backgroundColor: "#52E898",
            fontSize: "1rem",
        },
    ],
    100: [
        {
            rotate: "1turn",
            transform: transformEnd,
            backgroundColor: "#E85252",
            fontSize: "3rem",
        },
    ],
});

anim.play();
