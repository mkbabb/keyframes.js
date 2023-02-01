import { CSSKeyframesAnimation } from "../../src/animation";
import { easeInBounce, linear } from "../../src/easing";
import { FunctionValue, ValueArray, ValueUnit } from "../../src/units";
import { mat4 } from "gl-matrix";

const axes = ["x", "y", "z", "w"];

const cells = [];
for (let i = 0; i < 16; i++) {
    const value = i % 5 === 0 ? 1 : 0;
    cells.push(new ValueUnit(value));
}
const matrix3dStart = new FunctionValue("matrix3d", cells);
const matrix3dEnd = new FunctionValue("matrix3d", cells);

const matrixInput = document.querySelector(".matrix-input")!;

const updateMatrix3d = (i, value) => {
    matrix3dEnd.values[i].value = parseFloat(value);
};

for (let i = 0; i < 16; i++) {
    const axis = axes[i % 4];

    const cell = document.createElement("div");
    cell.classList.add("matrix-cell");

    const input = document.createElement("input");

    input.type = "text";
    input.value = matrix3dStart.values[i].value.toString();

    input.addEventListener("change", function () {
        updateMatrix3d(i, this.value);
    });
    input.classList.add(axis);

    const axisIndicator = document.createElement("div");
    axisIndicator.classList.add("axis");
    axisIndicator.classList.add(axis);

    if (i === 12 || i === 13 || i === 14) {
        axisIndicator.textContent += "T";
    } else if (i === 0 || i === 5 || i === 10) {
        axisIndicator.textContent += "S";
    }
    axisIndicator.textContent += axis;

    cell.appendChild(input);
    cell.appendChild(axisIndicator);

    matrixInput.appendChild(cell);
}

const translateX = document.querySelector<HTMLElement>("#translateX");
const translateY = document.querySelector<HTMLElement>("#translateY");
const translateZ = document.querySelector<HTMLElement>("#translateZ");
const rotateX = document.querySelector<HTMLElement>("#rotateX");
const rotateY = document.querySelector<HTMLElement>("#rotateY");
const rotateZ = document.querySelector<HTMLElement>("#rotateZ");
const scaleX = document.querySelector<HTMLElement>("#scaleX");
const scaleY = document.querySelector<HTMLElement>("#scaleY");
const scaleZ = document.querySelector<HTMLElement>("#scaleZ");

const transforms = [
    translateX,
    translateY,
    translateZ,
    rotateX,
    rotateY,
    rotateZ,
    scaleX,
    scaleY,
    scaleZ,
];

function updateMatrixInput(matrix: mat4) {
    for (let i = 0; i < 16; i++) {
        updateMatrix3d(i, matrix[i]);
    }
    document.querySelectorAll(".matrix-cell input").forEach((input, i) => {
        input.value = matrix[i].toString();
    });
}

function updateTransformations() {
    const translate = mat4.fromTranslation(mat4.create(), [
        parseFloat(translateX.value),
        parseFloat(translateY.value),
        parseFloat(translateZ.value),
    ]);
    const scale = mat4.fromScaling(mat4.create(), [
        parseFloat(scaleX.value),
        parseFloat(scaleY.value),
        parseFloat(scaleZ.value),
    ]);

    const rotationX = mat4.fromXRotation(
        mat4.create(),
        parseFloat(rotateX.value) * (Math.PI / 180)
    );
    const rotationY = mat4.fromYRotation(
        mat4.create(),
        parseFloat(rotateY.value) * (Math.PI / 180)
    );
    const rotationZ = mat4.fromZRotation(
        mat4.create(),
        parseFloat(rotateZ.value) * (Math.PI / 180)
    );

    const rotation = mat4.multiply(mat4.create(), rotationX, rotationY);
    mat4.multiply(rotation, rotation, rotationZ);

    const matrix = mat4.multiply(mat4.create(), translate, rotation);
    mat4.multiply(matrix, matrix, scale);

    updateMatrixInput(matrix);
}
transforms.forEach((transform) => {
    transform.addEventListener("input", updateTransformations);
});

const resetButton = document.querySelector("#reset-btn")!;
resetButton.addEventListener("click", () => {
    transforms.forEach((transform, i) => {
        if (transform.id.startsWith("scale")) {
            transform.value = "1";
        } else {
            transform.value = "0";
        }
    });
    const matrix = mat4.create();
    const fromMatrix = matrix3dEnd.values.map((value) => value.value);

    const transformFunc = (t, vars) => {
        const { transform } = vars;
        const { matrix3d } = transform;
        updateMatrixInput(matrix3d);
    };

    const resetAnimation = new CSSKeyframesAnimation({
        duration: 500,
        timingFunction: easeInBounce,
    }).fromFrames({
        from: [
            {
                transform: {
                    matrix3d: fromMatrix,
                },
            },
            transformFunc,
        ],
        to: [
            {
                transform: {
                    matrix3d: matrix,
                },
            },
        ],
    });
    resetAnimation.play();
});

const cubeEl = document.querySelector<HTMLElement>(".cube")!;

const anim = new CSSKeyframesAnimation(
    {
        duration: 5000,
        iterationCount: Infinity,
        direction: "alternate",
        fillMode: "forwards",
        timingFunction: linear,
    },
    cubeEl
);

anim.fromFramesDefaultTransform({
    from: {
        transform: {
            scale: 1,
            rotateX: "0deg",
            rotateY: "0deg",
            rotateZ: "0deg",
            matrix3d: matrix3dStart,
        },
    },
    "100%": {
        transform: {
            scale: new ValueUnit("scale", "var"),
            rotateX: "360deg",
            rotateY: "360deg",
            rotateZ: "360deg",
            matrix3d: matrix3dEnd,
        },
    },
});

anim.play();
