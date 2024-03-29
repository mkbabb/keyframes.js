<template>
    <div class="container" @mouseenter="">
        <AnimationControlsGroup
            class="animation-controls"
            :animations="animations"
            @selected-animation="(s) => (selectedAnimation = s)"
        />

        <div
            :class="[
                'matrix-controls',
                !matrixAnim.animation.started || matrixAnim.animation.paused
                    ? 'disabled'
                    : '',
            ]"
        >
            <div class="matrix-input">
                <div class="matrix-cell" v-for="(value, i) in matrix3dEnd.values">
                    <input
                        :value="Math.round(value.value * 100) / 100"
                        @change="
                            ($event) => {
                                updateMatrixCell($event.target.value, i);
                            }
                        "
                    />
                    <div :class="['axis', getAxisFromIx(i).toLocaleLowerCase()]">
                        <template v-if="getTransformFromIx(i) !== ''">
                            {{ getTransformFromIx(i)
                            }}<sub>{{ getAxisFromIx(i).toLowerCase() }}</sub>
                        </template>
                        <template v-else>{{ getAxisFromIx(i) }}</template>
                    </div>
                </div>
            </div>

            <div class="row" v-for="(opt, transform) in transformSliderOptions">
                <template v-for="axis in sliderAxes">
                    <label :class="axis.toLowerCase()">{{ transform + axis }}</label>
                    <input
                        @input="updateTransformations"
                        v-model.number="transformSliderValues[transform][axis]"
                        type="range"
                        :min="opt.bounds[0]"
                        :max="opt.bounds[1]"
                        :step="opt.step"
                        :class="axis.toLowerCase()"
                    />
                </template>
            </div>

            <div class="row">
                <button @click="reset">Reset</button>
                <button @click="fixed">Fixed</button>
            </div>
        </div>

        <div ref="graph" class="graph">
            <div ref="cube" class="cube animation">
                <div class="cube-side side-back">3</div>
                <div class="cube-side side-bottom">6</div>
                <div class="cube-side side-right">2</div>
                <div class="cube-side side-left">4</div>
                <div class="cube-side side-front">1</div>
                <div class="cube-side side-top">5</div>
            </div>

            <p class="axis-line x"></p>
            <p class="axis-line y"></p>
            <p class="axis-line z"></p>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    AnimationGroup,
    CSSKeyframesAnimation,
    Vars,
    CSSKeyframesToString,
} from "../../src/animation";
import { easeInBounce, linear } from "../../src/easing";
import { FunctionValue, ValueArray, ValueUnit } from "../../src/units";
import { mat4 } from "gl-matrix";
import { onMounted } from "vue";
import AnimationControlsGroup from "../components/AnimationControlsGroup.vue";

import "../style.scss";

const matrixAxes = ["X", "Y", "Z", "W"];
const sliderAxes = ["X", "Y", "Z"];

const transformSliderOptions = {
    translate: {
        bounds: [-1000, 1000],
        step: 1,
        value: 0,
    },
    rotate: {
        bounds: [-360, 360],
        step: 1,
        value: 0,
    },
    scale: {
        bounds: [0.1, 2],
        step: 0.01,
        value: 1,
    },
};

const transformSliderValues = {
    translate: {
        X: 0,
        Y: 0,
        Z: 0,
    },
    rotate: {
        X: 0,
        Y: 0,
        Z: 0,
    },
    scale: {
        X: 1,
        Y: 1,
        Z: 1,
    },
};

const getAxisFromIx = (i: number) => matrixAxes[i % matrixAxes.length];
const getTransformFromIx = (i: number) => {
    if (i === 12 || i === 13 || i === 14) {
        return "T";
    } else if (i === 0 || i === 5 || i === 10) {
        return "S";
    } else if (i === 3 || i === 7 || i === 11) {
        return "P";
    } else {
        return "";
    }
};

const matrix3dStart = new FunctionValue(
    "matrix3d",
    [...mat4.create()].map((v) => new ValueUnit(v))
);
const matrix3dEnd = $ref(
    new FunctionValue(
        "matrix3d",
        [...mat4.create()].map((v) => new ValueUnit(v))
    )
);

const syncTransformations = (reset: boolean = false) => {
    transformSliderValues.translate.X = matrix3dEnd.values[12].value;
    transformSliderValues.translate.Y = matrix3dEnd.values[13].value;
    transformSliderValues.translate.Z = matrix3dEnd.values[14].value;

    if (reset) {
        transformSliderValues.rotate.X = Math.acos(matrix3dEnd.values[0].value);
        transformSliderValues.rotate.Y = Math.acos(matrix3dEnd.values[5].value);
        transformSliderValues.rotate.Z = Math.acos(matrix3dEnd.values[10].value);

        transformSliderValues.scale.X = matrix3dEnd.values[0].value;
        transformSliderValues.scale.Y = matrix3dEnd.values[5].value;
        transformSliderValues.scale.Z = matrix3dEnd.values[10].value;
    }
};

const updateMatrixCell = (to: number, ix: number) => {
    const from = matrix3dEnd.values[ix].value;

    new CSSKeyframesAnimation({
        duration: 300,
    })
        .fromVars(
            [
                {
                    value: from,
                },
                {
                    value: to,
                },
            ],
            (t, { value }) => {
                matrix3dEnd.values[ix].value = value;
                syncTransformations();
            }
        )
        .play();
};

const animateUpdateMatrix = (
    fromMatrix: mat4,
    toMatrix: mat4,
    reset: boolean = false
) => {
    const transformFunc = (t, { transform: { matrix3d } }) => {
        matrix3dEnd.values.forEach((value, i) => {
            value.value = matrix3d[i];
            syncTransformations(reset);
        });
    };

    new CSSKeyframesAnimation({
        duration: 500,
        timingFunction: easeInBounce,
    })
        .fromVars(
            [
                {
                    transform: {
                        matrix3d: fromMatrix,
                    },
                },
                {
                    transform: {
                        matrix3d: toMatrix,
                    },
                },
            ],
            transformFunc
        )
        .play();
};

function updateTransformations() {
    const { translate, rotate, scale } = transformSliderValues;

    const translationMatrix = mat4.fromTranslation(mat4.create(), [
        translate.X,
        translate.Y,
        translate.Z,
    ]);
    const scalingMatrix = mat4.fromScaling(mat4.create(), [scale.X, scale.Y, scale.Z]);

    const rotationX = mat4.fromXRotation(mat4.create(), rotate.X * (Math.PI / 180));
    const rotationY = mat4.fromYRotation(mat4.create(), rotate.Y * (Math.PI / 180));
    const rotationZ = mat4.fromZRotation(mat4.create(), rotate.Z * (Math.PI / 180));

    const rotationMatrix = mat4.multiply(mat4.create(), rotationX, rotationY);
    mat4.multiply(rotationMatrix, rotationMatrix, rotationZ);

    const transformationMatrix = mat4.create();
    mat4.multiply(transformationMatrix, translationMatrix, rotationMatrix);
    mat4.multiply(transformationMatrix, transformationMatrix, scalingMatrix);

    matrix3dEnd.values.forEach((value, i) => {
        value.value = transformationMatrix[i];
    });
    syncTransformations();
}

const reset = () => {
    const toMatrix = mat4.create();
    const fromMatrix = matrix3dEnd.values.map((value) => value.value);
    animateUpdateMatrix(fromMatrix, toMatrix, true);
};

const fixed = () => {
    if (matrix3dStart.values == matrix3dEnd.values) {
        matrix3dStart.values = [...mat4.create()].map((v) => new ValueUnit(v));
    } else {
        matrix3dStart.values = matrix3dEnd.values;
    }
};

const matrixAnim = $ref(
    new CSSKeyframesAnimation({
        duration: 5000,
        iterationCount: Infinity,
        fillMode: "forwards",
        direction: "alternate",
        timingFunction: linear,
    }).fromVars([
        {
            transform: {
                matrix3d: matrix3dStart,
            },
        },
        {
            transform: {
                matrix3d: matrix3dEnd,
            },
        },
    ])
);

const rotationAnim = $ref(
    new CSSKeyframesAnimation({
        duration: 5000,
        iterationCount: Infinity,
        fillMode: "forwards",
        direction: "alternate",
        timingFunction: linear,
    }).fromFramesDefaultTransform({
        from: {
            transform: {
                rotateX: "0deg",
                rotateY: "0turn",
                rotateZ: "0deg",
                // matrix3d: matrix3dStart,
            },
        },
        "100%": {
            transform: {
                rotateX: new ValueUnit("--rotationX", "var"),
                rotateY: "1turn",
                rotateZ: "360deg",
                // matrix3d: matrix3dEnd,
            },
        },
    })
);

const animations = {
    Rotations: rotationAnim.animation,
    Matrix: matrixAnim.animation,
};

let selectedAnimation = $ref("");

const cube = $ref<HTMLElement>();
const graph = $ref<HTMLElement>();

onMounted(() => {
    rotationAnim.addTargets(cube);
    matrixAnim.addTargets(cube);

    new CSSKeyframesAnimation({ duration: 500, timingFunction: "easeInBounce" }, graph)
        .fromVars([
            {
                transform: {
                    rotate3d: "(0, 0, 0, 0deg)",
                },
            },
            {
                transform: {
                    rotate3d: "(-1, 1, 0, 30deg)",
                },
            },
        ])
        .play();
});
</script>
<style lang="scss">
body {
    background-size: 1rem;
    background-image: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%202%202%22%3E%3Cpath%20d%3D%22M1%202V0h1v1H0v1z%22%20fill-opacity%3D%22.05%22%2F%3E%3C%2Fsvg%3E");
}

.container {
    --padding: 0.5rem;
    display: grid;
    padding: var(--padding);

    width: 100%;
    height: 100%;

    grid-template-areas: "animation-controls graph matrix-controls";
    grid-template-columns: 25% 2fr 25%;

    gap: 1rem;
    overflow: hidden;
}

.animation-controls {
    grid-area: animation-controls;
}

.graph {
    grid-area: graph;

    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    perspective: 1600px;
    transform-style: preserve-3d;
    position: relative;
}

.x {
    --color: red;
}

.y {
    --color: green;
}

.z {
    --color: blue;
}

.w {
    --color: black;
}

.axis-line {
    width: 200%;
    height: 0px;
    background: transparent;
    border: 1px dashed var(--color);
    margin: 0;
    padding: 0;
    transform-style: preserve-3d;
    opacity: 0.8;

    &.x {
        transform: rotateX(0deg);
    }
    &.y {
        transform: rotateZ(90deg);
    }

    &.z {
        transform: rotateY(90deg);
    }
}

.cube {
    --side-size: 200px;
    --side-offset: calc(var(--side-size) / 2);
    --rotationX: 360deg;

    display: flex;
    align-items: center;
    justify-content: center;
    transform-style: preserve-3d;
}

.cube-side {
    position: absolute;

    display: flex;
    align-items: center;
    justify-content: center;

    width: var(--side-size);
    height: var(--side-size);

    color: white;

    font-size: 2rem;
    border: 1px inset rgba(0, 0, 0, 0.5);
}

.side-front {
    background: rgba(255, 0, 0, 0.8);
    transform: rotateY(0deg) translateZ(var(--side-offset));
}
.side-back {
    background: rgba(0, 255, 0, 0.8);
    transform: rotateY(180deg) translateZ(var(--side-offset));
}
.side-top {
    background: rgba(0, 0, 255, 0.8);
    transform: rotateX(90deg) translateZ(var(--side-offset));
}
.side-bottom {
    background: rgba(255, 255, 0, 0.8);
    transform: rotateX(-90deg) translateZ(var(--side-offset));
}
.side-left {
    background: rgba(255, 0, 255, 0.8);
    transform: rotateY(-90deg) translateZ(var(--side-offset));
}
.side-right {
    background: rgba(0, 255, 255, 0.8);
    transform: rotateY(90deg) translateZ(var(--side-offset));
}

.matrix-controls {
    grid-area: matrix-controls;
    display: grid;
    justify-items: center;
    align-items: center;
    height: fit-content;
    gap: 1rem;
    z-index: 1;
}

.matrix-controls .row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: 0.25rem 0.75rem;
    width: 100%;
}

.matrix-input {
    display: grid;
    width: min-content;
    height: min-content;

    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 0.25rem;
}

.matrix-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    border-radius: 5px;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;

    input {
        font-size: 1.5rem;
        width: 4rem;

        aspect-ratio: 1 / 1;
        text-align: center;
        border-radius: 5px;

        border: none;
        text-overflow: ellipsis;
    }
    .axis {
        pointer-events: none;
        position: absolute;
        opacity: 0.3;
        font-size: 2.5rem;
        color: var(--color);
    }
}

@media screen and (max-width: 900px) {
    :root {
        font-size: 0.9rem;
    }

    .container {
        grid-template-areas: "animation-controls" "graph" "matrix-controls";
        grid-template-columns: auto;
        grid-template-rows: 1fr 60vh 1fr;
        overflow-y: scroll;
        min-height: 100vh;
        min-height: 100dvh;
    }
}
</style>
