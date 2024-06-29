<template>
    <Card class="border-none m-0 p-0">
        <CardHeader>
            <CardTitle class="grid items-center">
                <Button class="text-sm">
                    {{ timingString }}
                    <CopyButton
                        class="text-background relative bg-transparent hover:bg-transparent hover:scale-105"
                        :text="timingString"
                    />
                </Button>
            </CardTitle>
        </CardHeader>
        <CardContent>
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
                        <SelectItem v-for="p in Object.keys(bezierPresets)" :value="p">
                            {{ p }}
                        </SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
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
import { CSSBezier, bezierPresets } from "@src/easing";
import { svgCubicBezier } from "@src/math";
import { Animation, TimingFunction } from "@src/animation";

import Button from "@components/ui/button/Button.vue";

import CopyButton from "@components/custom/CopyButton.vue";
import { useStorage } from "@vueuse/core";
import { StoredAnimationOptions, getStoredAnimationOptions } from "./animationOptions";

const cubicBezierToString = (values: number[]) => {
    return `cubic-bezier(${values.map((v) => v.toFixed(2)).join(", ")})`;
};

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
let timingString = computed(() => cubicBezierToString(timingValues));

let controlPoints = $ref([
    { x: 0.01, y: 0 },
    { x: timingValues[0], y: timingValues[1] },
    { x: timingValues[2], y: timingValues[3] },
    { x: 0.97, y: 1 },
]);

let cubicBezierPath = computed(() => {
    let scaledValues = timingValues.map((v) => v);
    return svgCubicBezier(...(scaledValues as [number, number, number, number]));
});

let SVGEl = $ref<SVGSVGElement | null>(null);
let pathEl = $ref<SVGGElement | null>(null);

const updateTimingFunction = () => {
    const scaledValues = timingValues.map((v) => v);

    storedAnimationOptions.cubicBezierOptions.controlPoints = scaledValues;

    const timingFunction = CSSBezier(
        ...(scaledValues as [number, number, number, number]),
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

const copyToClipboard = async (value: string) => {
    navigator.clipboard.writeText(value);
};

onMounted(() => {
    updateTimingFunction();
});
</script>

<style scoped lang="scss">
:deep(.bezier-curve) {
    width: 100%;
    aspect-ratio: 1 / 1;
    --stroke-width: 0.1;

    --circle-color: hsl(var(--foreground));
    --path-color: rgb(137, 20, 239);

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
        stroke: rgb(137, 20, 239);
        stroke-width: var(--stroke-width);
        fill: none;
    }
    > * {
        --scale: 1;
        transform: scale(var(--scale), calc(-1 * var(--scale)));
    }
}
</style>
