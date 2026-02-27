<template>
    <div class="relative grid min-h-dvh lg:h-dvh w-dvw items-center justify-items-stretch lg:justify-items-center lg:justify-center">
        <div
            ref="gridBackground"
            class="grid-background pointer-events-none fixed inset-0 h-dvh w-dvw"
        ></div>

        <div
            class="pointer-events-none absolute top-0 left-0 right-0 lg:left-auto z-50 flex items-center justify-between lg:justify-end lg:gap-4 p-2 lg:p-4"
        >
            <!-- PP + @mbabb -->
            <div class="pointer-events-auto flex items-center gap-2">
                <HoverCard
                    :open-delay="0"
                    v-model:open="hoverCardStates.ppmycota"
                >
                    <HoverCardTrigger
                        ><div
                            ref="ppmycotaLogoEl"
                            @click="
                                (e) => {
                                    hoverCardStates.ppmycota = true;
                                    setPPMode();
                                }
                            "
                            class="ppmycota-logo-sm m-0 h-8 w-8 lg:h-12 lg:w-12 cursor-pointer stroke-2 p-0
                                font-bold hover:scale-105"
                        ></div>
                    </HoverCardTrigger>
                    <HoverCardContent class="z-[100]">
                        <div class="h-fit-content flex gap-4 p-4">
                            <div
                                class="ppmycota-logo-sm z-20 h-12 w-12 cursor-pointer stroke-2 font-bold
                                    hover:scale-105"
                            ></div>
                            <div>
                                <h4 class="fraunces">🙂‍↔️ 🌱 🍄‍🟫</h4>
                                <p>
                                    <a
                                        class="fraunces font-bold hover:underline"
                                        href="https://ppmycota.com"
                                        >ppmycota.com</a
                                    >
                                </p>
                            </div>
                        </div>
                    </HoverCardContent>
                </HoverCard>

                <HoverCard
                    v-model:open="hoverCardStates.mbabb"
                    :open-delay="0"
                >
                    <HoverCardTrigger
                        @click="hoverCardStates.mbabb = true"
                        class="fira-code"
                        ><Button class="m-0 cursor-pointer p-0 text-xs lg:text-sm" variant="link"
                            >@mbabb</Button
                        >
                    </HoverCardTrigger>
                    <HoverCardContent class="z-[100]">
                        <div class="fira-code flex gap-4 p-4">
                            <Avatar>
                                <AvatarImage
                                    src="https://avatars.githubusercontent.com/u/2848617?v=4"
                                >
                                </AvatarImage>
                            </Avatar>
                            <div>
                                <h4 class="text-sm font-semibold hover:underline">
                                    <a href="https://github.com/mkbabb">@mbabb</a>
                                </h4>
                                <p>
                                    Check out the project on
                                    <a
                                        class="font-bold hover:underline"
                                        href="https://github.com/mkbabb/keyframes.js"
                                        >GitHub</a
                                    >🎉
                                </p>
                            </div>
                        </div>
                    </HoverCardContent>
                </HoverCard>
            </div>

            <!-- Share + Dark mode -->
            <div class="pointer-events-auto flex items-center gap-2 lg:gap-4">
                <Popover v-model:open="sharePopoverOpen">
                    <PopoverTrigger as-child>
                        <Share2
                            title="Share"
                            :class="[
                                'w-5 h-5 cursor-pointer hover:scale-105 transition-colors',
                                sharePopoverOpen ? 'opacity-100' : 'hover:opacity-50'
                            ]"
                        />
                    </PopoverTrigger>
                    <PopoverContent class="w-72 p-2" align="end">
                        <div class="flex items-center gap-1.5">
                            <Input
                                v-model="loadHashInput"
                                placeholder="Paste share URL..."
                                class="fira-code text-xs h-8 flex-1"
                                @keydown.enter="loadFromInput"
                            />
                            <Button
                                size="sm"
                                variant="ghost"
                                class="h-8 w-8 p-0 shrink-0 cursor-pointer"
                                @click="loadFromInput"
                                title="Load shared state"
                            >
                                <ArrowRight class="w-4 h-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                class="h-8 w-8 p-0 shrink-0 cursor-pointer"
                                @click="shareState"
                                title="Copy share link"
                            >
                                <Clipboard class="w-4 h-4" />
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
                <DarkModeToggle
                    title="Toggle dark mode"
                    class="aspect-square w-8 hover:scale-105 hover:opacity-50"
                />
            </div>
        </div>

        <template v-if="!storedControls.selectedAnimation">
            <div
                class="absolute left-0 top-0 mt-20 grid h-0 w-screen items-center gap-0 px-6 lg:mt-16"
            >
                <h1
                    class="fraunces grid p-0 text-5xl font-bold lg:flex lg:text-7xl"
                >
                    <div>
                        <AnimatedText
                            class="depth-text"
                            :text="startScreenText"
                        ></AnimatedText>
                    </div>

                    <div>
                        <AnimatedText
                            class="dot-fade depth-text"
                            :text="ellipsisText"
                        ></AnimatedText>
                    </div>
                </h1>
                <h2 class="fraunces w-full text-4xl font-light italic">
                    from the list
                    <List class="inline"></List> below.
                </h2>
                <h2
                    class="fraunces w-full text-xl font-light italic opacity-50"
                >
                    or drag M. cubért
                    <span class="text-start not-italic leading-none">🙂‍↔️</span>
                </h2>
            </div>
        </template>

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
                        <CardContent
                            class="grid items-center justify-center gap-4 p-6"
                        >
                            <div
                                class="relative m-0 grid h-[fit-content] w-[fit-content] grid-cols-4 items-center
                                    justify-items-center gap-1 p-0"
                            >
                                <div
                                    class="relative grid h-20 w-20 rounded-lg shadow-sm"
                                    v-for="(value, i) in matrix3dEnd.values"
                                >
                                    <Input
                                        :class="
                                            `fira-code absolute left-0 top-0 z-10 h-full w-full text-ellipsis bg-transparent
                                            p-0 text-center text-2xl` +
                                            [
                                                storedControls.matrixOptions
                                                    .selectedMatrixCell === i
                                                    ? 'font-bold focus:font-bold'
                                                    : '',
                                            ]
                                        "
                                        :model-value="
                                            (
                                                Math.round(
                                                    (value.valueOf() as number) *
                                                        100,
                                                ) / 100
                                            )
                                                .toFixed(2)
                                                .replace(/\.0*$/, '')
                                        "
                                        @update:model-value="
                                            (v) => updateMatrixCell(v, i)
                                        "
                                        :start="
                                            matrixCellMeta[i].sliderOptions.bounds[0]
                                        "
                                        :end="
                                            matrixCellMeta[i].sliderOptions.bounds[1]
                                        "
                                        :step="matrixCellMeta[i].sliderOptions.step"
                                        @click="
                                            storedControls.matrixOptions.selectedMatrixCell = i
                                        "
                                    />
                                    <div
                                        :class="
                                            `fraunces absolute left-0 top-0 flex h-full w-full items-center justify-center
                                            justify-items-center p-0 text-center text-5xl opacity-20 dark:opacity-75 ` +
                                            [matrixCellMeta[i].axis.toLocaleLowerCase()]
                                        "
                                    >
                                        <template
                                            v-if="matrixCellMeta[i].transform !== ''"
                                        >
                                            {{ matrixCellMeta[i].transform
                                            }}<sub>{{
                                                matrixCellMeta[i].axis.toLowerCase()
                                            }}</sub>
                                        </template>
                                        <template v-else>{{
                                            matrixCellMeta[i].axis
                                        }}</template>
                                    </div>
                                </div>
                            </div>

                            <Slider
                                :model-value="[
                                    matrix3dEnd.values[
                                        storedControls.matrixOptions
                                            .selectedMatrixCell
                                    ].valueOf() as number,
                                ]"
                                @update:model-value="
                                    (val: any) => {
                                        matrix3dEnd.values[
                                            storedControls.matrixOptions
                                                .selectedMatrixCell
                                        ].setValue(val[0]);
                                    }
                                "
                                :min="
                                    matrixCellMeta[storedControls.matrixOptions.selectedMatrixCell].sliderOptions.bounds[0]
                                "
                                :max="
                                    matrixCellMeta[storedControls.matrixOptions.selectedMatrixCell].sliderOptions.bounds[1]
                                "
                                :step="
                                    matrixCellMeta[storedControls.matrixOptions.selectedMatrixCell].sliderOptions.step
                                "
                                class="w-full"
                            ></Slider>

                            <div class="grid grid-cols-2 gap-2">
                                <IconTooltip text="Reset matrix">
                                    <Button
                                        class="fira-code cursor-pointer"
                                        @click="resetMatrix"
                                        ><RotateCcw class="mr-4" />Reset</Button
                                    >
                                </IconTooltip>
                                <IconTooltip :text="storedControls.matrixOptions.fixed ? 'Unlock matrix' : 'Lock matrix'">
                                    <Button
                                        class="fira-code cursor-pointer"
                                        @click="
                                            storedControls.matrixOptions.fixed =
                                                !storedControls.matrixOptions.fixed
                                        "
                                        :class="
                                            storedControls.matrixOptions.fixed
                                                ? 'clicked'
                                                : ''
                                        "
                                    >
                                        <Lock
                                            v-if="
                                                !storedControls.matrixOptions.fixed
                                            "
                                            class="mr-4"
                                        />

                                        <LockOpen v-else class="mr-4" />

                                        {{
                                            !storedControls.matrixOptions.fixed
                                                ? "Fixed"
                                                : "Free&nbsp"
                                        }}
                                    </Button>
                                </IconTooltip>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </template>

            <template #animation-content>
                <div
                    class="grid h-full w-full max-w-full items-center justify-center justify-items-center
                        overflow-visible"
                >
                    <div
                        ref="graph"
                        class="graph preserve-3d grid items-center justify-center justify-items-center"
                    >
                        <OrbitalDrag
                            class="preserve-3d relative flex items-center justify-center justify-items-center"
                            v-model="transformSliderValues"
                        >
                            <div
                                ref="cube"
                                class="cube preserve-3d animation relative flex items-center justify-center
                                    justify-items-center"
                            >
                                <span
                                    class="contents"
                                    v-if="!storedControls.selectedAnimation"
                                >
                                    <Loader2
                                        class="absolute h-[30vh] w-[30vw] animate-spin"
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
                                                'flex items-center justify-center',
                                            ]"
                                            :style="{
                                                backgroundColor: side.color,
                                            }"
                                        >
                                            <span
                                                :class="[
                                                    'fraunces h-full w-full text-5xl font-bold',
                                                    'flex items-center justify-center',
                                                ]"
                                                >{{ side.content }}</span
                                            >
                                        </div>
                                    </template>

                                    <template v-else>
                                        <div
                                            class="ppmycota-cube absolute h-full w-full"
                                        ></div>
                                        <div
                                            class="ppmycota-logo-lg absolute h-full w-full"
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
import { computed, markRaw, onMounted, ref, shallowRef, useTemplateRef, watch } from "vue";
import "@styles/utils.css";
import OrbitalDrag from "@components/custom/orbital-drag/OrbitalDrag.vue";
import { RotateCcw, Lock, LockOpen, Loader2, List, Share2, Clipboard, ArrowRight } from "lucide-vue-next";
import { DarkModeToggle } from "@components/custom/dark-mode-toggle";
import IconTooltip from "@components/custom/IconTooltip.vue";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@components/ui/hover-card";
import { Avatar, AvatarImage } from "@components/ui/avatar";
import { mat4 } from "gl-matrix";
import * as animations from "@src/animation/animations";
import { CSSKeyframesAnimation } from "@src/animation/index";
import { easeInBounce } from "@src/easing";
import { FunctionValue, ValueUnit } from "@src/units";
import {
    AnimationControlsGroup,
    AnimatedText,
} from "@components/custom/animation-controls";
import {
    getStoredAnimationOptions,
    getStoredAnimationGroupControlOptions,
    encodeStateToHash,
    getAllState,
    decodeStateFromHash,
} from "@components/custom/animation-controls/animationStores";
import { Slider } from "@components/ui/slider";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { TabsContent, TabsTrigger } from "@components/ui/tabs";
import { Popover, PopoverTrigger, PopoverContent } from "@components/ui/popover";

import "@styles/style.css";

import { transformTargetsStyle } from "@src/animation/utils";
import { AnimationGroup } from "@src/animation/group";
import { toast } from "vue-sonner";

const startScreenText = ref("Select an animation");
const ellipsisText = ref("...");

const MATRIX_AXES = ["x", "y", "z", "w"];

const superKey = "Cube";

const defaultMatrixOptions = {
    fixed: true,
    selectedMatrixCell: 0,
};

const storedControls = getStoredAnimationGroupControlOptions(superKey);

storedControls.matrixOptions ??= defaultMatrixOptions;

const ppmycotaLogoEl = useTemplateRef<HTMLElement>("ppmycotaLogoEl");

const hoverCardStates = ref({
    ppmycota: false,
    mbabb: false,
});

const sharePopoverOpen = ref(false);
const loadHashInput = ref("");

const shareState = async () => {
    const state = getAllState();
    const hash = encodeStateToHash(state);
    const url = `${window.location.origin}${window.location.pathname}#${hash}`;

    try {
        await navigator.clipboard.writeText(url);
        sharePopoverOpen.value = false;
        toast.success("Link copied to clipboard!", {
            duration: 3000,
            description: "Share this URL to restore the current animation state.",
        });
    } catch {
        window.location.hash = hash;
        sharePopoverOpen.value = false;
        toast.info("URL updated — copy from address bar", {
            duration: 5000,
        });
    }
};

const loadFromInput = () => {
    let hash = loadHashInput.value.trim();
    if (!hash) return;

    // Extract hash from URL if a full URL was pasted
    const hashIndex = hash.indexOf("#");
    if (hashIndex !== -1) {
        hash = hash.slice(hashIndex + 1);
    }

    const state = decodeStateFromHash(hash);
    if (!state) {
        toast.error("Invalid shared state", { duration: 3000 });
        return;
    }

    // Apply state and reload
    window.location.hash = hash;
    sharePopoverOpen.value = false;
    window.location.reload();
};

const setPPMode = () => {
    storedControls.ppMode = !storedControls.ppMode;

    if (storedControls.ppMode) {
        toast.success("PP Mode activated!", {
            duration: 3000,
            description: "PP Mode",
        });
    } else {
        toast.error("PP Mode deactivated!", {
            duration: 3000,
            description: "PP Mode",
        });
    }
};

const createMatrix = () =>
    new FunctionValue(
        "matrix3d",
        [...mat4.create()].map((v) => new ValueUnit(v)),
    );

const matrix3dStart = ref(createMatrix());
const matrix3dEnd = ref(createMatrix());

storedControls.ppMode ??= false;

const transformSliderValues = ref({
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
    matrix: mat4.create(),
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
    }
    return "";
};

const getSliderOptionsFromIx = (i: number) => {
    const transform = getTransformFromIx(i);
    const key =
        transform === "T"
            ? "translate"
            : transform === "S"
              ? "scale"
              : "rotate";

    return transformSliderOptions[key];
};

// Pre-computed metadata for the 16 matrix cells to avoid recalculating in template
const matrixCellMeta = computed(() =>
    Array.from({ length: 16 }, (_, i) => ({
        axis: getAxisFromIx(i),
        transform: getTransformFromIx(i),
        sliderOptions: getSliderOptionsFromIx(i),
    })),
);

const syncTransformations = (reset: boolean = false) => {
    const values = matrix3dEnd.value.valueOf();

    transformSliderValues.value.translate.x = values[12];
    transformSliderValues.value.translate.y = values[13];
    transformSliderValues.value.translate.z = values[14];

    if (!reset) return;

    transformSliderValues.value.rotate.x = Math.acos(values[0]);
    transformSliderValues.value.rotate.y = Math.acos(values[5]);
    transformSliderValues.value.rotate.z = Math.acos(values[10]);

    transformSliderValues.value.scale.x = values[0];
    transformSliderValues.value.scale.y = values[5];
    transformSliderValues.value.scale.z = values[10];
};

const updateMatrixCell = (to: number | string, ix: number) => {
    const toNum = typeof to === "string" ? parseFloat(to) : to;
    const from = matrix3dEnd.value.valueOf()[ix];

    new CSSKeyframesAnimation({
        duration: 300,
    })
        .fromVars(
            [
                {
                    value: from,
                },
                {
                    value: toNum,
                },
            ],
            ({ value }) => {
                matrix3dEnd.value.setValue(value.valueOf(), ix);
                syncTransformations();
            },
        )
        .play();
};

const cubeEl = useTemplateRef<HTMLElement>("cube");
const graphEl = useTemplateRef<HTMLElement>("graph");
const gridBackgroundEl = useTemplateRef<HTMLElement>("gridBackground");

const animateUpdateMatrix = (
    fromMatrix: mat4,
    toMatrix: mat4,
    reset: boolean = false,
) => {
    const transformFunc = ({ transform: { matrix3d } }: any) => {
        const matrixValues = matrix3d.valueOf();

        matrix3dEnd.value.values.forEach((value, i) => {
            value.setValue(matrixValues[i]);
            syncTransformations(reset);
        });

        if (matrixAnim.value.playing()) {
            return;
        }

        transformTargetsStyle(
            {
                transform: {
                    matrix3d: matrix3dEnd.value,
                },
            },
            [cubeEl.value!],
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
    const { translate, rotate, scale } = transformSliderValues.value;

    const translationMatrix = mat4.fromTranslation(mat4.create(), [
        translate.x,
        translate.y,
        translate.z,
    ]);
    const scalingMatrix = mat4.fromScaling(mat4.create(), [
        scale.x,
        scale.y,
        scale.z,
    ]);

    const rotationX = mat4.fromXRotation(
        mat4.create(),
        rotate.x * (Math.PI / 180),
    );
    const rotationY = mat4.fromYRotation(
        mat4.create(),
        rotate.y * (Math.PI / 180),
    );
    const rotationZ = mat4.fromZRotation(
        mat4.create(),
        rotate.z * (Math.PI / 180),
    );

    const rotationMatrix = mat4.multiply(mat4.create(), rotationX, rotationY);
    mat4.multiply(rotationMatrix, rotationMatrix, rotationZ);

    const transformationMatrix = mat4.create();
    mat4.multiply(transformationMatrix, translationMatrix, rotationMatrix);
    mat4.multiply(transformationMatrix, transformationMatrix, scalingMatrix);

    matrix3dEnd.value.values.forEach((value, i) => {
        value.setValue(transformationMatrix[i]);
    });
    matrix3dStart.value.values.forEach((value, i) => {
        value.setValue(transformationMatrix[i]);
    });

    syncTransformations();
}

let transformUpdateScheduled = false;
watch(transformSliderValues, () => {
    if (!transformUpdateScheduled) {
        transformUpdateScheduled = true;
        requestAnimationFrame(() => {
            transformUpdateScheduled = false;
            updateTransformations();

            if (cubeEl.value) {
                transformTargetsStyle(
                    {
                        transform: {
                            matrix3d: matrix3dEnd.value,
                        },
                    },
                    [cubeEl.value],
                    false,
                );
            }
        });
    }
}, { deep: true });

const resetMatrix = () => {
    const toMatrix = mat4.create();
    const fromMatrix = matrix3dEnd.value.values.map((value) =>
        value.valueOf(),
    ) as mat4;

    animateUpdateMatrix(fromMatrix, toMatrix, true);
};

const matrixAnimationOptions = getStoredAnimationOptions("Matrix", superKey);

const matrixAnim = shallowRef(
    markRaw(new CSSKeyframesAnimation(matrixAnimationOptions.animationOptions).fromVars(
        [
            {
                transform: {
                    matrix3d: matrix3dStart.value,
                },
            },
            {
                transform: {
                    matrix3d: matrix3dEnd.value,
                },
            },
        ],
    )),
);

matrixAnim.value.name = "Matrix";
matrixAnim.value.superKey = superKey;

const rotationAnimationOptions = getStoredAnimationOptions(
    "Rotations",
    superKey,
);

const rotationAnim = shallowRef(
    markRaw(new CSSKeyframesAnimation(
        rotationAnimationOptions.animationOptions,
    ).fromKeyframes({
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
    })),
);

rotationAnim.value.name = "Rotations";
rotationAnim.value.superKey = superKey;

const hoverAnimationOptions = getStoredAnimationOptions("Hover", superKey);

const hoverAnim = shallowRef(
    markRaw(animations.hover(hoverAnimationOptions.animationOptions)),
);
hoverAnim.value.name = "Hover";
hoverAnim.value.superKey = superKey;

const animationGroup = shallowRef(
    markRaw(new AnimationGroup(
        rotationAnim.value as any,
        matrixAnim.value as any,
        hoverAnim.value as any,
    )),
);


const cubeSides = [
    {
        class: "front",
        content: "1",
        color: "rgba(255, 0, 0, 0.8)",
    },
    {
        class: "right",
        content: "2",
        color: "rgba(0, 255, 0, 0.8)",
    },
    {
        class: "back",
        content: "3",
        color: "rgba(0, 0, 255, 0.8)",
    },
    {
        class: "left",
        content: "4",
        color: "rgba(255, 255, 0, 0.8)",
    },
    {
        class: "top",
        content: "5",
        color: "rgba(255, 0, 255, 0.8)",
    },
    {
        class: "bottom",
        content: "6",
        color: "rgba(0, 255, 255, 0.8)",
    },
];

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

// Separate animation instances for the idle hover/matrix group
// to avoid conflicting with animationGroup's managed flag.
const idleHoverAnim = animations.hover(hoverAnimationOptions.animationOptions);
idleHoverAnim.name = "IdleHover";

const idleMatrixAnim = new CSSKeyframesAnimation(matrixAnimationOptions.animationOptions).fromVars(
    [
        { transform: { matrix3d: matrix3dStart.value } },
        { transform: { matrix3d: matrix3dEnd.value } },
    ],
);
idleMatrixAnim.name = "IdleMatrix";

const hoverMatrixGroup = new AnimationGroup(
    idleHoverAnim as any,
    idleMatrixAnim as any,
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
    () => animationGroup.value.playing(),
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
    rotationAnim.value.setTargets(cubeEl.value!);
    matrixAnim.value.setTargets(cubeEl.value!);
    hoverAnim.value.setTargets(cubeEl.value!);

    idleHoverAnim.setTargets(cubeEl.value!);
    idleMatrixAnim.setTargets(cubeEl.value!);

    changeGraphPerspectiveAnim.setTargets(graphEl.value!);

    changeGraphPerspectiveAnim.play();

    hoverMatrixGroup.play();

    const encodedSVG = encodeURIComponent(`
    <svg class="tmp" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2 2'>
        <path d='M1 2V0h1v1H0v1z' fill-opacity='0.10'/>
    </svg>
`);

    gridBackgroundEl.value!.style.backgroundImage = `url("data:image/svg+xml,${encodedSVG}")`;
});
</script>
<style scoped>
.grid-background {
    background-size: 1rem !important;
    background-repeat: repeat;

    /* perspective: 900px; */

    /* transform:  rotate3d(-1, 1, 0, 30deg) rotateX(90deg)  ; */
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
    --side-size: min(25vh, 25vw);
    --side-offset: calc(var(--side-size) / 2);
    --rotationX: 360deg;

    height: calc(var(--side-size) * 2);
    will-change: transform;
    contain: style;
}

.cube-side {
    width: var(--side-size);
    height: var(--side-size);
    backface-visibility: hidden;
    will-change: transform;

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
