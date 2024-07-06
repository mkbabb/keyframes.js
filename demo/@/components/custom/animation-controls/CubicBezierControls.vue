<template>
    <Card class="grid gap-2 w-full dark:border-none">
        <CardHeader class="grid gap-0">
            <CardTitle>cubic-bézier</CardTitle>
            <div
                class="w-full whitespace-pre h-8 m-0 p-0 mt-1 text-xs flex items-center italic justify-items-center gap-2"
            >
                {{ timingString.replace("cubic-bezier", "")
                }}<CopyButton class="hover:scale-105" :text="timingString" />
            </div>
        </CardHeader>
        <CardContent
            @mouseenter="
                () => {
                    // cubicBezierAnim.pause();
                }
            "
            @mouseleave="
                (e) => {
                    // cubicBezierAnim.pause();
                }
            "
        >
            <svg
                ref="SVGEl"
                class="bezier-curve"
                viewBox="0 -1.5 1 2"
                xmlns="http://www.w3.org/2000/svg"
                @mousedown="startCubicBezierDragging"
                @mousemove="cubicBezierDrag"
                @mouseup="stopCubicBezierDragging"
                @mouseleave="stopCubicBezierDragging"
            >
                <g ref="pathEl"></g>
                <circle
                    v-for="(point, index) in controlPoints"
                    :key="index"
                    :cx="point.x"
                    :cy="point.y"
                    :data-index="index"
                    @mouseover="
                        (e) => {
                            (e.target as HTMLElement).style.setProperty(
                                '--stroke-width',
                                '0.15',
                            );
                        }
                    "
                    @mouseleave="
                        (e) => {
                            (e.target as HTMLElement).style.setProperty(
                                '--stroke-width',
                                '0.1',
                            );
                        }
                    "
                />
            </svg>

            <div class="flex gap-2 items-center justify-center">
                <Snowflake
                    class="hover:scale-105 cursor-pointer w-6 h-6"
                    @click="
                        () => {
                            // cubicBezierAnim.pause();
                        }
                    "
                >
                </Snowflake>
                <Select
                    :model-value="selectedPreset"
                    @update:model-value="
                        (key) => {
                            selectedPreset = key;
                            updateCubicBezierPreset(key as any);
                        }
                    "
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem
                                v-for="p in Object.keys(bezierPresets)"
                                :value="p"
                            >
                                {{ p }}
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@components/ui/card";

import { Label } from "@components/ui/label";
import { CSSCubicBezier, bezierPresets } from "@src/easing";
import { cubicBezierToSVG, cubicBezierToString } from "@src/math";
import { Animation, CSSKeyframesAnimation, TimingFunction } from "@src/animation";

import Button from "@components/ui/button/Button.vue";

import CopyButton from "@components/custom/CopyButton.vue";
import { useStorage } from "@vueuse/core";
import { StoredAnimationOptions, getStoredAnimationOptions } from "./animationStores";
import { Snowflake } from "lucide-vue-next";

const { animation } = defineProps({
    animation: {
        type: Animation<any>,
        required: true,
    },
});

const storedAnimationOptions = getStoredAnimationOptions(animation);

const emit = defineEmits<{
    (e: "updateTimingFunction", timingFunction: TimingFunction): void;
}>();

let selectedPreset = $ref("ease");
let timingValues = $ref(storedAnimationOptions.cubicBezierOptions.controlPoints);
let timingString = computed(() =>
    cubicBezierToString(...(timingValues as [number, number, number, number])),
);

let controlPoints = $ref([
    { x: 0, y: 0 },
    { x: timingValues[0], y: timingValues[1] },
    { x: timingValues[2], y: timingValues[3] },
    { x: 1, y: 1 },
]);

let cubicBezierPath = computed(() => {
    let scaledValues = timingValues.map((v) => v);
    return cubicBezierToSVG(...(scaledValues as [number, number, number, number]));
});

let SVGEl = $ref<SVGSVGElement | null>(null);
let pathEl = $ref<SVGGElement | null>(null);

const updateTimingFunction = () => {
    storedAnimationOptions.cubicBezierOptions.controlPoints = timingValues;

    const timingFunction = CSSCubicBezier(
        ...(timingValues as [number, number, number, number]),
    );

    if (pathEl) {
        pathEl.innerHTML = cubicBezierPath.value;
    }

    emit("updateTimingFunction", timingFunction);

    return timingFunction;
};

let isDragging = $ref(false);
let currentPointIndex = $ref<number | null>(null);

let startCubicBezierDragging = (event: MouseEvent) => {
    const target = (event.target as SVGElement).closest("circle");
    if (target) {
        isDragging = true;
        currentPointIndex = parseInt(target.getAttribute("data-index")!);
    }
};

const stopCubicBezierDragging = () => {
    isDragging = false;
    currentPointIndex = null;
};

const cubicBezierDrag = (event: MouseEvent) => {
    if (isDragging && currentPointIndex !== null) {
        if (currentPointIndex === 0 || currentPointIndex === 3) return;

        const svgRect = pathEl!.getBoundingClientRect();
        const { width, height, left, top } = svgRect;

        const x = (event.clientX - left) / width;
        const y = 1 - (event.clientY - top) / height;

        controlPoints[currentPointIndex] = { x, y };
        timingValues = [
            controlPoints[1].x,
            controlPoints[1].y,
            controlPoints[2].x,
            controlPoints[2].y,
        ];

        updateTimingFunction();
    }
};

const updateCubicBezierPreset = (key: string) => {
    timingValues = JSON.parse(JSON.stringify(bezierPresets[key]));
    controlPoints[1] = {
        x: timingValues[0],
        y: timingValues[1],
    };
    controlPoints[2] = {
        x: timingValues[2],
        y: timingValues[3],
    };

    updateTimingFunction();
};

const cubicBezierAnim = new CSSKeyframesAnimation({
    duration: 1000,
    iterationCount: "infinite",
    direction: "alternate",
}).fromCSSKeyframes(
    /*css*/ `@keyframes move {
            0% {
                transform: translateY(0);
            }
            100% {
                transform: translateY(1.5);
            }
}`,
    (t, { transform }) => {
        const v = transform.valueOf();

        const [y1, y2] = [v, 1 - v];

        controlPoints[1].y = y1;
        controlPoints[2].y = y2;

        timingValues[1] = y1;
        timingValues[3] = y2;

        updateTimingFunction();
    },
);

onMounted(() => {
    updateTimingFunction();

    // cubicBezierAnim.play();
});
</script>

<style scoped lang="scss">
:deep(.bezier-curve) {
    width: 100%;
    aspect-ratio: 1 / 1;
    --stroke-width: 0.1;

    --circle-color: hsl(var(--foreground));
    --path-color: hsl(var(--ppmycota-primary));

    circle {
        r: calc(var(--stroke-width) / 2);
        stroke: var(--circle-color);
        fill: var(--circle-color);
        stroke-width: 0;
        cursor: move;
    }
    circle:nth-child(5),
    circle:nth-child(2) {
        --circle-color: var(--path-color);
        cursor: not-allowed;
    }
    g path {
        stroke: var(--path-color);
        stroke-width: var(--stroke-width);
        fill: none;
    }
    > * {
        --scale: 1;
        transform: scale(var(--scale), calc(-1 * var(--scale)));
    }
}
</style>
