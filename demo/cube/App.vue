<template>
    <div
        ref="container"
        class="container grid w-screen h-screen p-2 m-0 grid-cols-3 overflow-hidden items-center justify-center justify-items-center"
    >
        <AnimationControlsGroup
            :animations="animations"
            :super-key="superKey"
            @selected-animation="(s) => (storedControls.selectedAnimation = s)"
        />

        <div ref="graph" class="graph">
            <div ref="cube" class="cube animation">
                <div
                    v-for="(side, index) in cubeSides"
                    :key="index"
                    :class="['cube-side', side.class]"
                >
                    {{ side.content }}
                    <span
                        :class="
                            !rotationAnim.animation.playing() ? 'rainbow-wrapper' : ''
                        "
                        :style="{
                            animationDelay: `${Math.random() * 2}s`,
                        }"
                    >
                    </span>
                </div>
            </div>

            <div class="axis-line x"></div>
            <div class="axis-line y"></div>
            <div class="axis-line z"></div>
        </div>

        <div class="grid items-center gap-2 z-10">
            <Card class="mt-4 grid items-center justify-center">
                <CardContent
                    class="p-0 m-0 h-[fit-content] w-[fit-content] gap-1 grid grid-cols-4 items-center justify-items-center relative"
                >
                    <div
                        class="w-14 h-14 shadow-md grid relative rounded-md"
                        v-for="(value, i) in matrix3dEnd.values"
                    >
                        <input
                            class="absolute top-0 left-0 w-full h-full p-1 text-center text-ellipsis bold text-lg bg-transparent"
                            :value="Math.round(value.value * 100) / 100"
                            @change="
                                (e) => {
                                    updateMatrixCell(
                                        (e.target as HTMLInputElement).value,
                                        i,
                                    );
                                }
                            "
                        />
                        <div
                            :class="
                                ['axis', getAxisFromIx(i).toLocaleLowerCase()] +
                                // line hight of 0 add:
                                ' absolute top-0 left-0 w-full h-full p-1 text-center text-4xl opacity-20 align-text-bottom'
                            "
                        >
                            <template v-if="getTransformFromIx(i) !== ''">
                                {{ getTransformFromIx(i)
                                }}<sub>{{ getAxisFromIx(i).toLowerCase() }}</sub>
                            </template>
                            <template v-else>{{ getAxisFromIx(i) }}</template>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div class="grid grid-cols-2 gap-2">
                <Button @click="resetMatrix">Reset</Button>
                <Button @click="fixMatrix" :class="isFixed ? 'clicked' : ''">
                    Fixed
                </Button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// import { $ref } from "unplugin-vue-macros/macros";
import { onMounted } from "vue";

import { mat4 } from "gl-matrix";

import { CSSKeyframesAnimation, InputAnimationOptions } from "@src/animation";
import { easeInBounce, linear, jumpTerms } from "@src/easing";
import { FunctionValue, ValueUnit } from "@src/units";

import { AnimationControlsGroup } from "@components/custom/animation-controls";

import {
    getStoredAnimationOptions,
    getStoredAnimationGroupControlOptions,
} from "@components/custom/animation-controls/animationStores";

import { Icon } from "@iconify/vue";

import { Slider } from "@components/ui/slider";
import { Button } from "@components/ui/button";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
} from "@components/ui/menubar";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select";

import "@styles/style.scss";

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
    [...mat4.create()].map((v) => new ValueUnit(v)),
);
const matrix3dEnd = $ref(
    new FunctionValue(
        "matrix3d",
        [...mat4.create()].map((v) => new ValueUnit(v)),
    ),
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

const updateMatrixCell = (to: number | string, ix: number) => {
    to = typeof to === "string" ? parseFloat(to) : to;

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
            },
        )
        .play();
};

const animateUpdateMatrix = (
    fromMatrix: mat4,
    toMatrix: mat4,
    reset: boolean = false,
) => {
    const transformFunc = (t, { transform: { matrix3d } }) => {
        matrix3d = matrix3d.valueOf();

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
            transformFunc,
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

const resetMatrix = () => {
    const toMatrix = mat4.create();
    const fromMatrix = matrix3dEnd.values.map((value) => value.value) as mat4;
    animateUpdateMatrix(fromMatrix, toMatrix, true);
};

let isFixed = $ref(false);

const fixMatrix = () => {
    isFixed = !isFixed;

    if (matrix3dStart.values == matrix3dEnd.values) {
        matrix3dStart.values = [...mat4.create()].map((v) => new ValueUnit(v));
    } else {
        matrix3dStart.values = matrix3dEnd.values;
    }
};

const superKey = "Cube";

const storedControls = getStoredAnimationGroupControlOptions(superKey);

const matrixAnimationOptions = getStoredAnimationOptions("Matrix", superKey);

const matrixAnim = $ref(
    new CSSKeyframesAnimation(matrixAnimationOptions.animationOptions).fromVars([
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
    ]),
);
matrixAnim.animation.name = "Matrix";
matrixAnim.animation.superKey = superKey;

const rotationAnimationOptions = getStoredAnimationOptions("Rotations", superKey);

const rotationAnim = $ref(
    new CSSKeyframesAnimation(
        rotationAnimationOptions.animationOptions,
    ).fromKeyframesDefaultTransform({
        from: {
            transform: {
                rotateX: "0deg",
                rotateY: "0turn",
                rotateZ: "0deg",
            },
        },
        "100%": {
            transform: {
                rotateX: new ValueUnit("--rotationX", "var"),
                rotateY: "1turn",
                rotateZ: "360deg",
            },
        },
    }),
);
rotationAnim.animation.name = "Rotations";
rotationAnim.animation.superKey = superKey;

storedControls.selectedAnimation ??= "Rotations";
storedControls.selectedControl ??= "controls";

const animations = {
    Rotations: rotationAnim.animation,
    Matrix: matrixAnim.animation,
};

const cubeSides = [
    { class: "front", content: "1" },
    { class: "right", content: "2" },
    { class: "back", content: "3" },
    { class: "left", content: "4" },
    { class: "top", content: "5" },
    { class: "bottom", content: "6" },
];

const cube = $ref<HTMLElement>();
const graph = $ref<HTMLElement>();
const container = $ref<HTMLElement>();

onMounted(() => {
    rotationAnim.addTargets(cube);
    matrixAnim.addTargets(cube);

    new CSSKeyframesAnimation({ duration: 500, timingFunction: "easeInBounce" }, graph)
        .fromVars([
            {
                transform: {
                    rotate3d: "0, 0, 0, 0deg",
                },
            },
            {
                transform: {
                    rotate3d: "-1, 1, 0, 30deg",
                },
            },
        ])
        .play();

    const encodedSVG = encodeURIComponent(`
    <svg class="tmp" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2 2'>
        <path d='M1 2V0h1v1H0v1z' fill-opacity='0.10'/>
    </svg>
`);

    container.style.backgroundImage = `url("data:image/svg+xml,${encodedSVG}")`;
});
</script>
<style scoped lang="scss">
.container {
    background-size: 1rem !important;
}

.graph {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    perspective: 1600px;
    transform-style: preserve-3d;
    position: relative;
    align-self: center;
}

.x {
    --color: red !important;
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
    width: 1000vw;
    height: 0px;
    background: transparent;
    border: 1px dashed var(--color);
    margin: 0;
    padding: 0;
    transform-style: preserve-3d;
    opacity: 0.75;
    position: absolute;

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
    position: relative;
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
    border: 1px inset rgba(0, 0, 0, 0.37);

    &.front {
        background: rgba(255, 0, 0, 0.8);
        transform: rotateY(0deg) translateZ(var(--side-offset));
    }
    &.back {
        background: rgba(0, 255, 0, 0.8);
        transform: rotateY(180deg) translateZ(var(--side-offset));
    }
    &.top {
        background: rgba(0, 0, 255, 0.8);
        transform: rotateX(90deg) translateZ(var(--side-offset));
    }
    &.bottom {
        background: rgba(255, 255, 0, 0.8);
        transform: rotateX(-90deg) translateZ(var(--side-offset));
    }
    &.left {
        background: rgba(255, 0, 255, 0.8);
        transform: rotateY(-90deg) translateZ(var(--side-offset));
    }
    &.right {
        background: rgba(0, 255, 255, 0.8);
        transform: rotateY(90deg) translateZ(var(--side-offset));
    }
}

@media screen and (max-width: 768px) {
    .container {
        grid-template-columns: 1fr;
        grid-template-rows: repeat(3, 1fr);
        overflow: scroll;
        height: min-content;
    }
    
}
</style>
