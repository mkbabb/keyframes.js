import { Animation } from "../../src/animation";

const boxEl = document.querySelector<HTMLElement>("#box")!;

const anim = new Animation({
    duration: 2000,
    iterations: Infinity,
    direction: "alternate",
    fillMode: "forwards",
});
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
    n: {
        a: 0,
    },
};

const transformEnd = {
    x: "50%",
    y: "100%",
    n: {
        a: 1,
    },
};

anim.frame(
    0,
    {
        transform: transformStart,
        color: "#C462D8",
    },
    transformFunc
)
    .frame(
        50,
        {
            color: "#6280D8",
        },
        transformFunc
    )

    .frame(
        75,
        {
            color: "#52E898",
            fontSize: "1rem",
        },
        transformFunc
    )
    .frame(
        100,
        {
            transform: transformEnd,
            color: "#E85252",
            fontSize: "3rem",
        },
        transformFunc
    );

anim.parse();

async function main() {
    await anim.play();
}

main();
