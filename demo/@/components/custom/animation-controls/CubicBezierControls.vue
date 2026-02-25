<template>
    <Card class="grid gap-2 w-full dark:border-none shadow-none border-none p-0">
        <CardHeader class="grid gap-0 p-0">
            <CardTitle class="fraunces">cubic-bézier</CardTitle>
            <div
                class="w-full whitespace-pre h-8 m-0 p-0 mt-1 ml-1 text-xs flex items-center italic justify-items-center gap-2 fira-code"
            >
                {{ timingString.replace("cubic-bezier", "")
                }}<CopyButton class="hover:scale-105" :text="timingString" />
            </div>
        </CardHeader>
        <CardContent
        class="p-0 m-0"
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
                    <SelectTrigger class="fira-code">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup class="fira-code">
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
import { ref, computed, onMounted, useTemplateRef } from "vue";
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
import { Animation, CSSKeyframesAnimation } from "@src/animation/index";

import Button from "@components/ui/button/Button.vue";

import CopyButton from "@components/custom/CopyButton.vue";
import { useStorage } from "@vueuse/core";
import type { StoredAnimationOptions } from "./animationStores";
import { getStoredAnimationOptions } from "./animationStores";
import { Snowflake } from "lucide-vue-next";
import type { TimingFunction } from "@src/animation/constants";

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

const selectedPreset = ref("ease");
const timingValues = ref(storedAnimationOptions.cubicBezierOptions.controlPoints);
const timingString = computed(() =>
    cubicBezierToString(...(timingValues.value as [number, number, number, number])),
);

const controlPoints = ref([
    { x: 0, y: 0 },
    { x: timingValues.value[0], y: timingValues.value[1] },
    { x: timingValues.value[2], y: timingValues.value[3] },
    { x: 1, y: 1 },
]);

const cubicBezierPath = computed(() => {
    const scaledValues = timingValues.value.map((v) => v);
    return cubicBezierToSVG(...(scaledValues as [number, number, number, number]));
});

const SVGEl = useTemplateRef<SVGSVGElement>("SVGEl");
const pathEl = useTemplateRef<SVGGElement>("pathEl");

const updateTimingFunction = () => {
    storedAnimationOptions.cubicBezierOptions.controlPoints = timingValues.value;

    const timingFunction = CSSCubicBezier(
        ...(timingValues.value as [number, number, number, number]),
    );

    if (pathEl.value) {
        pathEl.value.innerHTML = cubicBezierPath.value;
    }

    emit("updateTimingFunction", timingFunction);

    return timingFunction;
};

const isDragging = ref(false);
const currentPointIndex = ref<number | null>(null);

const startCubicBezierDragging = (event: MouseEvent) => {
    const target = (event.target as SVGElement).closest("circle");
    if (target) {
        isDragging.value = true;
        currentPointIndex.value = parseInt(target.getAttribute("data-index")!);
    }
};

const stopCubicBezierDragging = () => {
    isDragging.value = false;
    currentPointIndex.value = null;
};

const cubicBezierDrag = (event: MouseEvent) => {
    if (isDragging.value && currentPointIndex.value !== null) {
        if (currentPointIndex.value === 0 || currentPointIndex.value === 3) return;

        const svgRect = pathEl.value!.getBoundingClientRect();
        const { width, height, left, top } = svgRect;

        const x = (event.clientX - left) / width;
        const y = 1 - (event.clientY - top) / height;

        controlPoints.value[currentPointIndex.value] = { x, y };
        timingValues.value = [
            controlPoints.value[1].x,
            controlPoints.value[1].y,
            controlPoints.value[2].x,
            controlPoints.value[2].y,
        ];

        updateTimingFunction();
    }
};

const updateCubicBezierPreset = (key: string) => {
    timingValues.value = JSON.parse(JSON.stringify(bezierPresets[key]));
    controlPoints.value[1] = {
        x: timingValues.value[0],
        y: timingValues.value[1],
    };
    controlPoints.value[2] = {
        x: timingValues.value[2],
        y: timingValues.value[3],
    };

    updateTimingFunction();
};

const cubicBezierAnim = new CSSKeyframesAnimation({
    duration: 1000,
    iterationCount: "infinite",
    direction: "alternate",
}).fromString(
    /*css*/ `@keyframes move {
            0% {
                transform: translateY(0);
            }
            100% {
                transform: translateY(1.5);
            }
}`,
    ({ transform }) => {
        const v = transform.valueOf();

        const [y1, y2] = [v, 1 - v];

        controlPoints.value[1].y = y1;
        controlPoints.value[2].y = y2;

        timingValues.value[1] = y1;
        timingValues.value[3] = y2;

        updateTimingFunction();
    },
);

onMounted(() => {
    updateTimingFunction();

    // cubicBezierAnim.play();
});
</script>

<style scoped>
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
