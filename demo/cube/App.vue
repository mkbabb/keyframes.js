<template>
    <div ref="gridBackground" class="grid-background">
        <AnimationControlsGroup
            :animation-group="animationGroup"
            :super-key="superKey"
            @selected-animation="(s) => (storedControls.selectedAnimation = s)"
        >
            <template #tabs-trigger>
                <TabsTrigger
                    v-if="storedControls.selectedAnimation == 'Matrix'"
                    value="matrix-controls"
                    >Matrix Controls</TabsTrigger
                >
            </template>

            <template #tabs-content>
                <TabsContent value="matrix-controls">
                    <Card>
                        <CardContent class="grid items-center justify-center gap-4 p-6">
                            <div
                                class="p-0 m-0 h-[fit-content] w-[fit-content] gap-1 grid grid-cols-4 items-center justify-items-center relative"
                            >
                                <div
                                    class="h-20 w-20 shadow-sm grid relative rounded-md"
                                    v-for="(value, i) in matrix3dEnd.values"
                                >
                                    <Input
                                        :class="
                                            'absolute top-0 left-0 w-full h-full p-0 text-center text-ellipsis text-2xl bg-transparent z-10 fira-code' +
                                            [
                                                storedControls.matrixOptions
                                                    .selectedMatrixCell === i
                                                    ? 'focus:font-bold font-bold'
                                                    : '',
                                            ]
                                        "
                                        :model-value="
                                            (
                                                Math.round(
                                                    (value.valueOf() as number) * 100,
                                                ) / 100
                                            )
                                                .toFixed(2)
                                                .replace(/\.0*$/, '')
                                        "
                                        @update:model-value="
                                            (v) => updateMatrixCell(v, i)
                                        "
                                        :start="getSliderOptionsFromIx(i).bounds[0]"
                                        :end="getSliderOptionsFromIx(i).bounds[1]"
                                        :step="getSliderOptionsFromIx(i).step"
                                        @click="
                                            (e) =>
                                                (storedControls.matrixOptions.selectedMatrixCell =
                                                    i)
                                        "
                                    />
                                    <div
                                        :class="
                                            'absolute top-0 left-0 w-full h-full p-0 text-center text-5xl opacity-20 dark:opacity-75 flex items-center justify-center justify-items-center fraunces ' +
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
                                    matrix3dEnd.values[
                                        storedControls.matrixOptions.selectedMatrixCell
                                    ].valueOf() as number,
                                ]"
                                @update:model-value="
                                    ([value]) => {
                                        matrix3dEnd.values[
                                            storedControls.matrixOptions
                                                .selectedMatrixCell
                                        ].setValue(value);
                                    }
                                "
                                :min="
                                    getSliderOptionsFromIx(
                                        storedControls.matrixOptions.selectedMatrixCell,
                                    ).bounds[0]
                                "
                                :max="
                                    getSliderOptionsFromIx(
                                        storedControls.matrixOptions.selectedMatrixCell,
                                    ).bounds[1]
                                "
                                :step="
                                    getSliderOptionsFromIx(
                                        storedControls.matrixOptions.selectedMatrixCell,
                                    ).step
                                "
                                class="w-full"
                            ></Slider>

                            <div class="grid grid-cols-2 gap-2">
                                <Button
                                    class="cursor-pointer fira-code"
                                    @click="resetMatrix"
                                    ><RotateCcw class="mr-4" />Reset</Button
                                >
                                <Button
                                    class="cursor-pointer fira-code"
                                    @click="
                                        storedControls.matrixOptions.fixed =
                                            !storedControls.matrixOptions.fixed;
                                        fixMatrix();
                                    "
                                    :class="
                                        storedControls.matrixOptions.fixed
                                            ? 'clicked'
                                            : ''
                                    "
                                >
                                    <Lock
                                        v-if="!storedControls.matrixOptions.fixed"
                                        class="mr-4"
                                    />

                                    <LockOpen v-else class="mr-4" />

                                    {{
                                        !storedControls.matrixOptions.fixed
                                            ? "Fixed"
                                            : "Free&nbsp"
                                    }}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </template>

            <template #animation-content>
                <div
                    class="grid items-center justify-items-center justify-center h-screen w-screen overflow-hidden"
                >
                    <div
                        ref="graph"
                        class="graph preserve-3d grid items-center justify-center justify-items-center"
                    >
                        <OrbitalDrag
                            class="relative preserve-3d flex items-center justify-center justify-items-center"
                            v-bind:model-value="transformSliderValues"
                        >
                            <div
                                ref="cube"
                                class="relative cube preserve-3d flex items-center justify-center justify-items-center animation"
                            >
                                <span
                                    class="contents"
                                    v-if="!storedControls.selectedAnimation"
                                >
                                    <Loader2
                                        class="absolute w-[30vw] h-[30vh] animate-spin"
                                    ></Loader2>
                                </span>
                                <div
                                    v-for="(side, index) in cubeSides"
                                    :key="index"
                                    :class="[
                                        'cube-side',
                                        side.class,
                                        'rounded-lg',
                                        'transition-all duration-500 ease-in-out',
                                        'absolute z-10 flex items-center justify-center',
                                    ]"
                                >
                                    <span
                                        :class="
                                            'rainbow-wrapper ' +
                                            (!animationGroup.playing()
                                                ? 'opacity-100'
                                                : 'opacity-25')
                                        "
                                        :style="{
                                            animationDelay: `${Math.random() * 10}s`,
                                            animationDuration: `${Math.random() * 10}s`,
                                        }"
                                    >
                                    </span>
                                    <template v-if="!storedControls.ppMode">
                                        <div
                                            :class="[
                                                'h-full w-full font-bold',
                                                'flex items-center justify-center ',
                                            ]"
                                            :style="{
                                                backgroundColor: side.color,
                                            }"
                                        >
                                            <span
                                                :class="[
                                                    'fraunces text-5xl h-full w-full font-bold',
                                                    'flex items-center justify-center z-50',
                                                ]"
                                                >{{ side.content }}</span
                                            >
                                        </div>
                                    </template>

                                    <template v-else>
                                        <div
                                            class="absolute w-full h-full ppmycota-cube"
                                        ></div>
                                        <div
                                            class="absolute w-full h-full ppmycota-logo-lg"
                                        ></div>
                                    </template>
                                </div>
                            </div>
                        </OrbitalDrag>

                        <div class="axis-line x"></div>
                        <div class="axis-line y"></div>
                        <div class="axis-line z"></div>
                    </div>
                </div>
            </template>
        </AnimationControlsGroup>
    </div>
</template>

<script setup lang="ts">
// import { $ref } from "unplugin-vue-macros/macros";
import { onMounted, reactive, watch } from "vue";

import { Animated } from "@components/custom/animation-controls";

// @ts-ignore
import "@styles/utils.scss";

import OrbitalDrag from "@components/custom/orbital-drag/OrbitalDrag.vue";

import { RotateCcw, Lock, LockOpen } from "lucide-vue-next";

import { DarkModeToggle } from "@components/custom/dark-mode-toggle";

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@components/ui/hover-card";
import { Avatar, AvatarImage } from "@components/ui/avatar";
import { mat4 } from "gl-matrix";
import * as animations from "@src/animation/animations";
import { CSSKeyframesAnimation } from "@src/animation/index";
import { easeInBounce, linear, jumpTerms } from "@src/easing";
import { FunctionValue, ValueUnit } from "@src/units";
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
import { clamp } from "@src/math";
import { transformTargetsStyle } from "@src/animation/utils";
import { AnimationGroup } from "@src/animation/group";

const MATRIX_AXES = ["x", "y", "z", "w"];

const superKey = "Cube";

const defaultMatrixOptions = {
    fixed: true,

    selectedMatrixCell: 0,
};

const storedControls = getStoredAnimationGroupControlOptions(superKey);

storedControls.matrixOptions ??= defaultMatrixOptions;

const createMatrix = () =>
    new FunctionValue(
        "matrix3d",
        [...mat4.create()].map((v) => new ValueUnit(v)),
    );

const matrix3dStart = $ref(createMatrix());
const matrix3dEnd = $ref(createMatrix());

storedControls.ppMode ??= false;

const transformSliderValues = $ref({
    translate: {
        x: 0,
        y: 0,
        z: 0,
    },
    rotate: {
        x: 0,
        y: 0,
        z: 0,
    },
    scale: {
        x: 1,
        y: 1,
        z: 1,
    },
});

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
        bounds: [0.4, 3],
        step: 0.01,
        value: 1,
    },
};

const getAxisFromIx = (i: number) => MATRIX_AXES[i % MATRIX_AXES.length];

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

const syncTransformations = (reset: boolean = false) => {
    const values = matrix3dEnd.valueOf();

    transformSliderValues.translate.x = values[12];
    transformSliderValues.translate.y = values[13];
    transformSliderValues.translate.z = values[14];

    if (!reset) return;

    transformSliderValues.rotate.x = Math.acos(values[0]);
    transformSliderValues.rotate.y = Math.acos(values[5]);
    transformSliderValues.rotate.z = Math.acos(values[10]);

    transformSliderValues.scale.x = values[0];
    transformSliderValues.scale.y = values[5];
    transformSliderValues.scale.z = values[10];
};

const updateMatrixCell = (to: number | string, ix: number) => {
    to = typeof to === "string" ? parseFloat(to) : to;

    const from = matrix3dEnd.valueOf()[ix];

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
            ({ value }) => {
                matrix3dEnd.setValue(value.valueOf(), ix);
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
    const transformFunc = ({ transform: { matrix3d } }) => {
        matrix3d = matrix3d.valueOf();

        matrix3dEnd.values.forEach((value, i) => {
            value.setValue(matrix3d[i]);
            syncTransformations(reset);
        });

        if (matrixAnim.playing()) {
            return;
        }

        transformTargetsStyle(
            {
                transform: {
                    matrix3d: matrix3dEnd,
                },
            },
            [cube],
            false,
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
        translate.x,
        translate.y,
        translate.z,
    ]);
    const scalingMatrix = mat4.fromScaling(mat4.create(), [scale.x, scale.y, scale.z]);

    const rotationX = mat4.fromXRotation(mat4.create(), rotate.x * (Math.PI / 180));
    const rotationY = mat4.fromYRotation(mat4.create(), rotate.y * (Math.PI / 180));
    const rotationZ = mat4.fromZRotation(mat4.create(), rotate.z * (Math.PI / 180));

    const rotationMatrix = mat4.multiply(mat4.create(), rotationX, rotationY);
    mat4.multiply(rotationMatrix, rotationMatrix, rotationZ);

    const transformationMatrix = mat4.create();
    mat4.multiply(transformationMatrix, translationMatrix, rotationMatrix);
    mat4.multiply(transformationMatrix, transformationMatrix, scalingMatrix);

    matrix3dEnd.values.forEach((value, i) => {
        value.setValue(transformationMatrix[i]);
    });

    syncTransformations();
}

watch(transformSliderValues, updateTransformations);

const resetMatrix = () => {
    const toMatrix = mat4.create();
    const fromMatrix = matrix3dEnd.values.map((value) => value.valueOf()) as mat4;

    animateUpdateMatrix(fromMatrix, toMatrix, true);
};

const fixMatrix = () => {
    if (matrix3dStart.values == matrix3dEnd.values) {
        matrix3dStart.values = [...mat4.create()].map((v) => new ValueUnit(v));
    } else {
        matrix3dStart.values = matrix3dEnd.values;
    }
};

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

matrixAnim.name = "Matrix";
matrixAnim.superKey = superKey;

const rotationAnimationOptions = getStoredAnimationOptions("Rotations", superKey);

const rotationAnim = $ref(
    new CSSKeyframesAnimation(rotationAnimationOptions.animationOptions).fromKeyframes({
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

rotationAnim.name = "Rotations";
rotationAnim.superKey = superKey;

const hoverAnimationOptions = getStoredAnimationOptions("Hover", superKey);

const hoverAnim = $ref(animations.hover(hoverAnimationOptions.animationOptions));
hoverAnim.name = "Hover";
hoverAnim.superKey = superKey;

const animationGroup = $ref(
    new AnimationGroup(rotationAnim as any, matrixAnim as any, hoverAnim as any),
);

const cubeSides = [
    { class: "front", content: "1", color: "rgba(255, 0, 0, 0.8)" },
    { class: "right", content: "2", color: "rgba(0, 255, 0, 0.8)" },
    { class: "back", content: "3", color: "rgba(0, 0, 255, 0.8)" },
    { class: "left", content: "4", color: "rgba(255, 255, 0, 0.8)" },
    { class: "top", content: "5", color: "rgba(255, 0, 255, 0.8)" },
    { class: "bottom", content: "6", color: "rgba(0, 255, 255, 0.8)" },
];

const cube = $ref<HTMLElement>();
const graph = $ref<HTMLElement>();

const gridBackground = $ref<HTMLElement>();

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

const hoverMatrixGroup = new AnimationGroup(hoverAnim as any, matrixAnim as any);

watch(
    () => storedControls.selectedAnimation,
    (selectedAnimation) => {
        if (
            selectedAnimation !== "Matrix" &&
            storedControls.selectedControl === "matrix-controls"
        ) {
            storedControls.selectedControl = "controls";
        }
    },
);

watch(
    () => animationGroup.playing(),
    (playing) => {
        if (!playing) {
            hoverMatrixGroup.forcePlay();
            hoverMatrixGroup.play();
        } else {
            hoverMatrixGroup.forcePlay();
            hoverMatrixGroup.paused = true;
        }
    },
);

onMounted(() => {
    rotationAnim.setTargets(cube);
    matrixAnim.setTargets(cube);
    hoverAnim.setTargets(cube);

    changeGraphPerspectiveAnim.setTargets(graph);

    // changeGraphPerspectiveAnim.play();
    // hoverMatrixGroup.play();

    const encodedSVG = encodeURIComponent(`
    <svg class="tmp" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2 2'>
        <path d='M1 2V0h1v1H0v1z' fill-opacity='0.10'/>
    </svg>
`);

    gridBackground.style.backgroundImage = `url("data:image/svg+xml,${encodedSVG}")`;

    fixMatrix();
});
</script>
<style scoped lang="scss">
.grid-background {
    background-size: 1rem !important;
    background-repeat: repeat;
}

.graph {
    perspective: 1200px;
}

.x {
    --color: rgb(218, 59, 59);
    color: var(--color);
}

.y {
    --color: rgb(66, 175, 66);
    color: var(--color);
}

.z {
    --color: rgb(61, 61, 235);
    color: var(--color);
}

.w {
    --color: black;
    color: var(--color);
}

.axis-line {
    width: 1000vw;

    height: 0px;

    border: 1px dashed var(--color);

    opacity: 0.75;

    z-index: -10;
    position: absolute;
    pointer-events: none;

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
}

.cube-side {
    width: var(--side-size);
    height: var(--side-size);

    &.front {
        transform: rotateY(0deg) translateZ(var(--side-offset));
    }
    &.back {
        transform: rotateY(180deg) translateZ(var(--side-offset));
    }
    &.top {
        transform: rotateX(90deg) translateZ(var(--side-offset));
    }
    &.bottom {
        transform: rotateX(-90deg) translateZ(var(--side-offset));
    }
    &.left {
        transform: rotateY(-90deg) translateZ(var(--side-offset));
    }
    &.right {
        transform: rotateY(90deg) translateZ(var(--side-offset));
    }
}
</style>
