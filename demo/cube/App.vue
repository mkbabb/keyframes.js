<template>
    <div ref="container" class="container">
        <AnimationControlsGroup
            :animations="animations"
            :super-key="superKey"
            @selected-animation="(s) => (storedControls.selectedAnimation = s)"
        >
            <template #tabs-trigger>
                <TabsList v-if="storedControls.selectedAnimation == 'Matrix'">
                    <TabsTrigger value="matrix-controls">Matrix Controls</TabsTrigger>
                </TabsList>
            </template>

            <template #tabs-content>
                <TabsContent value="matrix-controls">
                    <Card>
                        <CardContent class="grid items-center justify-center gap-4 p-6">
                            <div
                                class="p-0 m-0 h-[fit-content] w-[fit-content] gap-1 grid grid-cols-4 items-center justify-items-center relative shadow-lg"
                            >
                                <div
                                    class="w-14 h-14 shadow-md grid relative rounded-md"
                                    v-for="(value, i) in matrix3dEnd.values"
                                >
                                    <Input
                                        :class="
                                            'absolute top-0 left-0 w-full h-full p-1 text-center text-ellipsis bold text-lg bg-transparent z-10 ' +
                                            [
                                                selectedMatrixCell === i
                                                    ? 'focus:font-bold'
                                                    : '',
                                            ]
                                        "
                                        :model-value="
                                            Math.round(value.value * 100) / 100
                                        "
                                        @update:model-value="
                                            (v) => updateMatrixCell(v, i)
                                        "
                                        :start="getSliderOptionsFromIx(i).bounds[0]"
                                        :end="getSliderOptionsFromIx(i).bounds[1]"
                                        :step="getSliderOptionsFromIx(i).step"
                                        @click="(e) => (selectedMatrixCell = i)"
                                    />
                                    <div
                                        :class="
                                            'absolute top-0 left-0 w-full h-full p-1 text-center text-4xl opacity-20 dark:opacity-50 align-text-bottom ' +
                                            [getAxisFromIx(i).toLocaleLowerCase()]
                                        "
                                    >
                                        <template v-if="getTransformFromIx(i) !== ''">
                                            {{ getTransformFromIx(i)
                                            }}<sub>{{
                                                getAxisFromIx(i).toLowerCase()
                                            }}</sub>
                                        </template>
                                        <template v-else>{{
                                            getAxisFromIx(i)
                                        }}</template>
                                    </div>
                                </div>
                            </div>

                            <Slider
                                :model-value="[
                                    matrix3dEnd.values[selectedMatrixCell].value,
                                ]"
                                @update:model-value="
                                    ([value]) => {
                                        matrix3dEnd.values[selectedMatrixCell].value =
                                            value;
                                    }
                                "
                                :min="
                                    getSliderOptionsFromIx(selectedMatrixCell).bounds[0]
                                "
                                :max="
                                    getSliderOptionsFromIx(selectedMatrixCell).bounds[1]
                                "
                                :step="getSliderOptionsFromIx(selectedMatrixCell).step"
                                class="w-full"
                            ></Slider>

                            <div class="grid grid-cols-2 gap-2">
                                <Button class="cursor-pointer" @click="resetMatrix"
                                    ><RotateCcw class="mr-4" />Reset</Button
                                >
                                <Button
                                    class="cursor-pointer"
                                    @click="fixMatrix"
                                    :class="isFixed ? 'clicked' : ''"
                                    ><Lock class="mr-4" />Fixed
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </template>

            <template #animation-content>
                <div ref="graph" class="graph">
                    <Loader2
                        v-if="!storedControls.selectedAnimation"
                        class="absolute w-48 h-48 animate-spin"
                    ></Loader2>

                    <OrbitalDrag class="cube" @rotate="(v) => orbitalDrag('rotate', v)">
                        <div ref="cube" class="cube">
                            <div
                                v-for="(side, index) in cubeSides"
                                :key="index"
                                :class="['cube-side', side.class]"
                            >
                                {{ side.content }}
                                <span
                                    :class="
                                        'rainbow-wrapper ' +
                                        (rotationAnim.animation.paused ||
                                        !storedControls.selectedAnimation
                                            ? 'opacity-100'
                                            : 'opacity-25')
                                    "
                                    :style="{
                                        animationDelay: `${Math.random() * 10}s`,
                                        animationDuration: `${Math.random() * 10}s`,
                                    }"
                                >
                                </span>
                            </div>
                        </div>
                    </OrbitalDrag>

                    <div class="axis-line x"></div>
                    <div class="axis-line y"></div>
                    <div class="axis-line z"></div>
                </div>
            </template>
        </AnimationControlsGroup>
    </div>
</template>

<script setup lang="ts">
// import { $ref } from "unplugin-vue-macros/macros";
import { onMounted, watch } from "vue";

// @ts-ignore
import "@styles/utils.scss";

import OrbitalDrag from "@components/custom/orbital-drag/OrbitalDrag.vue";

import { RotateCcw, Lock } from "lucide-vue-next";

import { DarkModeToggle } from "@components/custom/dark-mode-toggle";

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@components/ui/hover-card";
import { Avatar, AvatarImage } from "@components/ui/avatar";

import { mat4 } from "gl-matrix";

import {
    AnimationGroup,
    CSSKeyframesAnimation,
    InputAnimationOptions,
} from "@src/animation";
import { easeInBounce, linear, jumpTerms } from "@src/easing";
import { FunctionValue, ValueUnit, transformTargetsStyle } from "@src/units";

import { AnimationControlsGroup } from "@components/custom/animation-controls";

import {
    getStoredAnimationOptions,
    getStoredAnimationGroupControlOptions,
} from "@components/custom/animation-controls/animationStores";

import { Loader2 } from "lucide-vue-next";

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

import { TransformState } from "@components/custom/orbital-drag";

const matrixAxes = ["X", "Y", "Z", "W"];
const sliderAxes = ["X", "Y", "Z"];

let selectedMatrixCell = $ref(0);

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

const getSliderOptionsFromIx = (i: number) => {
    let transform = getTransformFromIx(i);
    transform =
        transform === "T" ? "translate" : transform === "S" ? "scale" : "rotate";

    return transformSliderOptions[transform];
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

        if (matrixAnim.animation.playing()) {
            return;
        }

        transformTargetsStyle(
            0,
            {
                transform: {
                    matrix3d: matrix3dEnd,
                },
            },
            [cube],
        );
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

const orbitalDrag = (category: string, value: TransformState["rotate"]) => {
    const sliderValues = transformSliderValues[category];

    sliderValues.X = value.x;
    sliderValues.Y = value.y;
    sliderValues.Z = value.z;

    updateTransformations();
};

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

const hoverAnimationOptions = getStoredAnimationOptions("Hover", superKey);

const hoverAnim = $ref(
    new CSSKeyframesAnimation({
        ...hoverAnimationOptions.animationOptions,
        ...({
            duration: 2000,
            timingFunction: "easeInOutBounce",
        } as any),
    }).fromVars([
        {
            transform: {
                translateY: "0px",
            },
        },
        {
            transform: {
                translateY: "15px",
            },
        },
        {
            transform: {
                translateY: "0px",
            },
        },
    ]),
);
hoverAnim.animation.name = "Hover";
hoverAnim.animation.superKey = superKey;

const gradientAnimationOptions = getStoredAnimationOptions("Gradient", superKey);

const gradientAnim = $ref(
    new CSSKeyframesAnimation(gradientAnimationOptions.animationOptions)
        .fromCSSKeyframes(/*css*/ `
@keyframes gradient-shift {
    0% {
        background: linear-gradient(
            90deg,
            rgba(255, 0, 0, 1) 0%,
            rgba(255, 127, 0, 1) 12.5%,
            rgba(255, 255, 0, 1) 25%,
            rgba(0, 255, 0, 1) 37.5%,
            rgba(0, 0, 255, 1) 50%,
            rgba(75, 0, 130, 1) 62.5%,
            rgba(143, 0, 255, 1) 75%,
            rgba(255, 0, 0, 1) 87.5%,
            rgba(255, 0, 0, 1) 100%
        );
    }
    12.5% {
        background: linear-gradient(
            90deg,
            rgba(255, 127, 0, 1) 0%,
            rgba(255, 255, 0, 1) 12.5%,
            rgba(0, 255, 0, 1) 25%,
            rgba(0, 0, 255, 1) 37.5%,
            rgba(75, 0, 130, 1) 50%,
            rgba(143, 0, 255, 1) 62.5%,
            rgba(255, 0, 0, 1) 75%,
            rgba(255, 0, 0, 1) 87.5%,
            rgba(255, 127, 0, 1) 100%
        );
    }
    25% {
        background: linear-gradient(
            90deg,
            rgba(255, 255, 0, 1) 0%,
            rgba(0, 255, 0, 1) 12.5%,
            rgba(0, 0, 255, 1) 25%,
            rgba(75, 0, 130, 1) 37.5%,
            rgba(143, 0, 255, 1) 50%,
            rgba(255, 0, 0, 1) 62.5%,
            rgba(255, 127, 0, 1) 75%,
            rgba(255, 255, 0, 1) 87.5%,
            rgba(255, 0, 0, 1) 100%
        );
    }
    37.5% {
        background: linear-gradient(
            90deg,
            rgba(0, 255, 0, 1) 0%,
            rgba(0, 0, 255, 1) 12.5%,
            rgba(75, 0, 130, 1) 25%,
            rgba(143, 0, 255, 1) 37.5%,
            rgba(255, 0, 0, 1) 50%,
            rgba(255, 127, 0, 1) 62.5%,
            rgba(255, 255, 0, 1) 75%,
            rgba(0, 255, 0, 1) 87.5%,
            rgba(255, 0, 0, 1) 100%
        );
    }
    50% {
        background: linear-gradient(
            90deg,
            rgba(0, 0, 255, 1) 0%,
            rgba(75, 0, 130, 1) 12.5%,
            rgba(143, 0, 255, 1) 25%,
            rgba(255, 0, 0, 1) 37.5%,
            rgba(255, 127, 0, 1) 50%,
            rgba(255, 255, 0, 1) 62.5%,
            rgba(0, 255, 0, 1) 75%,
            rgba(0, 0, 255, 1) 87.5%,
            rgba(255, 0, 0, 1) 100%
        );
    }
    62.5% {
        background: linear-gradient(
            90deg,
            rgba(75, 0, 130, 1) 0%,
            rgba(143, 0, 255, 1) 12.5%,
            rgba(255, 0, 0, 1) 25%,
            rgba(255, 127, 0, 1) 37.5%,
            rgba(255, 255, 0, 1) 50%,
            rgba(0, 255, 0, 1) 62.5%,
            rgba(0, 0, 255, 1) 75%,
            rgba(75, 0, 130, 1) 87.5%,
            rgba(255, 0, 0, 1) 100%
        );
    }
    75% {
        background: linear-gradient(
            90deg,
            rgba(143, 0, 255, 1) 0%,
            rgba(255, 0, 0, 1) 12.5%,
            rgba(255, 127, 0, 1) 25%,
            rgba(255, 255, 0, 1) 37.5%,
            rgba(0, 255, 0, 1) 50%,
            rgba(0, 0, 255, 1) 62.5%,
            rgba(75, 0, 130, 1) 75%,
            rgba(143, 0, 255, 1) 87.5%,
            rgba(255, 0, 0, 1) 100%
        );
    }
    87.5% {
        background: linear-gradient(
            90deg,
            rgba(255, 0, 0, 1) 0%,
            rgba(255, 127, 0, 1) 12.5%,
            rgba(255, 255, 0, 1) 25%,
            rgba(0, 255, 0, 1) 37.5%,
            rgba(0, 0, 255, 1) 50%,
            rgba(75, 0, 130, 1) 62.5%,
            rgba(143, 0, 255, 1) 75%,
            rgba(255, 0, 0, 1) 87.5%,
            rgba(255, 0, 0, 1) 100%
        );
    }
    100% {
        background: linear-gradient(
            90deg,
            rgba(255, 0, 0, 1) 0%,
            rgba(255, 127, 0, 1) 12.5%,
            rgba(255, 255, 0, 1) 25%,
            rgba(0, 255, 0, 1) 37.5%,
            rgba(0, 0, 255, 1) 50%,
            rgba(75, 0, 130, 1) 62.5%,
            rgba(143, 0, 255, 1) 75%,
            rgba(255, 0, 0, 1) 87.5%,
            rgba(255, 0, 0, 1) 100%
        );
    }
}`),
);

gradientAnim.animation.name = "Gradient";
gradientAnim.animation.superKey = superKey;

const animations = {
    Rotations: rotationAnim.animation,
    Matrix: matrixAnim.animation,
    Hover: hoverAnim.animation,
    // Gradient: gradientAnim.animation,
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

const changeGraphPerspectiveAnim = new CSSKeyframesAnimation({
    duration: 700,
    timingFunction: "easeInBounce",
}).fromVars([
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
]);

const hoverMatrixGroup = new AnimationGroup(hoverAnim.animation, matrixAnim.animation);

watch(
    () => storedControls.selectedAnimation,
    (selectedAnimation) => {
        // if the selected animation is not matrix and the current control is matrix-controls, set it back to control:
        if (
            selectedAnimation !== "Matrix" &&
            storedControls.selectedControl === "matrix-controls"
        ) {
            storedControls.selectedControl = "controls";
        }
    },
);

onMounted(() => {
    rotationAnim.addTargets(cube);
    matrixAnim.addTargets(cube);
    hoverAnim.addTargets(cube);

    changeGraphPerspectiveAnim.addTargets(graph);

    // const cubeSideEls = cube.querySelectorAll(".cube-side");
    // gradientAnim.addTargets(...cubeSideEls);
    // gradientAnim.play();

    changeGraphPerspectiveAnim.play();

    // hoverMatrixGroup.play();

    hoverAnim.play();

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
    // height: 100%;
    // max-width: 100%;
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
    color: var(--color);
}

.y {
    --color: green;
    color: var(--color);
}

.z {
    --color: blue;
    color: var(--color);
}

.w {
    --color: black;
    color: var(--color);
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
    --side-size: 25vh;
    --side-offset: calc(var(--side-size) / 2);
    --rotationX: 360deg;

    height: calc(var(--side-size) * 2);
    aspect-ratio: 1 / 1;

    border: 1px solid red;

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

    z-index: 10;

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
