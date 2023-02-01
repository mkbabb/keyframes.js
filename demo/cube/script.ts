import { CSSKeyframesAnimation } from "../../src/animation";
import { linear } from "../../src/easing";
import { ValueArray, ValueUnit } from "../../src/units";
import { debounce } from "../../src/utils";

const cubeEl = document.querySelector<HTMLElement>(".cube")!;

const anim = new CSSKeyframesAnimation(
    {
        duration: 5000,
        iterations: Infinity,
        direction: "alternate",
        fillMode: "forwards",
        ease: linear,
    },
    cubeEl
);

const cells = [];
for (let i = 0; i < 16; i++) {
    const value = i % 5 === 0 ? 1 : 0;
    cells.push(new ValueUnit(value));
}
const matrix3dStart = new ValueArray(cells, ",");
const matrix3dEnd = new ValueArray(cells, ",");

const scaleStart = new ValueUnit(1);
const scaleEnd = new ValueUnit(3.2);

const scaleInput = document.querySelector<HTMLInputElement>("#scale")!;
const scaleUpdate = debounce((e) => {
    scaleEnd.value = +scaleInput.value;
}, 1000);
scaleInput.addEventListener("input", scaleUpdate);

const matrixInputs = document.querySelectorAll(".matrix-input input");

function updateMatrix() {
    matrixInputs.forEach((input, i) => {
        console.log(input.value);
        matrix3dEnd.values[i].value = +input.value;
    });
}
matrixInputs.forEach((input) => {
    input.addEventListener("change", updateMatrix);
});
matrixInputs.forEach((input, i) => {
    input.value = matrix3dStart.values[i].value.toString();
});

anim.fromFramesDefaultTransform({
    from: {
        transform: {
            scale: scaleStart,
            rotateX: "0deg",
            rotateY: "0deg",
            rotateZ: "0deg",
            matrix3d: matrix3dStart,
        },
    },
    "100%": {
        transform: {
            scale: scaleEnd,
            rotateX: "360deg",
            rotateY: "360deg",
            rotateZ: "360deg",
            matrix3d: matrix3dEnd,
        },
    },
});

anim.play();
