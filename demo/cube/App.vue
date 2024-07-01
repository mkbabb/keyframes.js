<template>
    <div ref="gridBackground" class="grid-background">
        <AnimationControlsGroup
            :animation-group="animationGroup"
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
                                class="p-0 m-0 h-[fit-content] w-[fit-content] gap-1 grid grid-cols-4 items-center justify-items-center relative"
                            >
                                <div
                                    class="h-20 w-20 shadow-sm grid relative rounded-md"
                                    v-for="(value, i) in matrix3dEnd.values"
                                >
                                    <Input
                                        :class="
                                            'absolute top-0 left-0 w-full h-full p-0 text-center text-ellipsis text-xl bg-transparent z-10 ' +
                                            [
                                                storedControls.matrixOptions
                                                    .selectedMatrixCell === i
                                                    ? 'focus:font-bold'
                                                    : '',
                                            ]
                                        "
                                        :model-value="
                                            (Math.round(value.value * 100) / 100)
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
                                    ].value,
                                ]"
                                @update:model-value="
                                    ([value]) => {
                                        matrix3dEnd.values[
                                            storedControls.matrixOptions.selectedMatrixCell
                                        ].value = value;
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
                                <Button class="cursor-pointer" @click="resetMatrix"
                                    ><RotateCcw class="mr-4" />Reset</Button
                                >
                                <Button
                                    class="cursor-pointer"
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
                        <Loader2
                            v-if="!storedControls.selectedAnimation"
                            class="absolute w-48 h-48 animate-spin"
                        ></Loader2>

                        <OrbitalDrag
                            class="relative preserve-3d flex items-center justify-center justify-items-center"
                            @rotate="(v) => orbitalDrag('rotate', v)"
                            @translate="(v) => orbitalDrag('translate', v)"
                            @scale="(v) => orbitalDrag('scale', v)"
                        >
                            <div
                                ref="cube"
                                class="relative cube preserve-3d flex items-center justify-center justify-items-center animation"
                            >
                                <div
                                    v-for="(side, index) in cubeSides"
                                    :key="index"
                                    :class="[
                                        'cube-side',
                                        side.class,
                                        'absolute z-10 flex items-center justify-center border-primary',
                                        // add a dashed border and change opacity if the group isn't playing:
                                        !animationGroup.playing() ? ' opacity-75' : '',
                                        'transition-all duration-500 ease-in-out',
                                    ]"
                                >
                                    <span class="text-5xl font-bold z-[100]">{{
                                        side.content
                                    }}</span>
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

const MATRIX_AXES = ["x", "y", "z", "w"];

const superKey = "Cube";

const defaultMatrixOptions = {
    fixed: true,

    selectedMatrixCell: 0,

    transformSliderValues: {
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
    },

    transformSliderOptions: {
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
    },
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

const { transformSliderValues, transformSliderOptions } =
    storedControls.matrixOptions as typeof defaultMatrixOptions;

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
    transformSliderValues.translate.x = matrix3dEnd.values[12].value;
    transformSliderValues.translate.y = matrix3dEnd.values[13].value;
    transformSliderValues.translate.z = matrix3dEnd.values[14].value;

    if (!reset) return;

    transformSliderValues.rotate.x = Math.acos(matrix3dEnd.values[0].value);
    transformSliderValues.rotate.y = Math.acos(matrix3dEnd.values[5].value);
    transformSliderValues.rotate.z = Math.acos(matrix3dEnd.values[10].value);

    transformSliderValues.scale.x = matrix3dEnd.values[0].value;
    transformSliderValues.scale.y = matrix3dEnd.values[5].value;
    transformSliderValues.scale.z = matrix3dEnd.values[10].value;
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
        value.value = transformationMatrix[i];
    });

    syncTransformations();
}

const orbitalDrag = (category: string, value: TransformState["rotate"]) => {
    Object.assign(transformSliderValues[category], value);

    updateTransformations();
};

const resetMatrix = () => {
    const toMatrix = mat4.create();
    const fromMatrix = matrix3dEnd.values.map((value) => value.value) as mat4;

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

const animationGroup = $ref(
    new AnimationGroup(
        rotationAnim.animation,
        matrixAnim.animation,
        hoverAnim.animation,
    ),
);

const createRandomMatrixRotationsAnimation = () => {
    const transformFunc = (t, v) => {
        // transformSliderValues.rotate.x += Math.random() * t;
        // transformSliderValues.rotate.y += Math.random() * t;
        // transformSliderValues.rotate.z += Math.random() * t;
        // updateTransformations();
    };

    return new CSSKeyframesAnimation({
        duration: 2000,
        timingFunction: easeInBounce,
    }).fromVars([{ v: 0 }, { v: 1 }], transformFunc);
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

const randomMatrixRotationsAnim = createRandomMatrixRotationsAnimation();

const hoverMatrixGroup = new AnimationGroup(
    hoverAnim.animation,
    matrixAnim.animation,
    randomMatrixRotationsAnim.animation,
);

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
    rotationAnim.addTargets(cube);
    matrixAnim.addTargets(cube);
    hoverAnim.addTargets(cube);

    changeGraphPerspectiveAnim.addTargets(graph);

    const cubeSideEls = cube.querySelectorAll(".cube-side");
    gradientAnim.addTargets(...(cubeSideEls as any));
    // gradientAnim.play();

    changeGraphPerspectiveAnim.play();

    hoverMatrixGroup.play();

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
</style>
