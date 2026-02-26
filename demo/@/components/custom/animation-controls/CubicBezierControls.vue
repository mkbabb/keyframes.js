<template>
    <Card class="grid gap-2 w-full dark:border-none shadow-none border-none p-0">
        <CardHeader class="grid gap-0 p-0">
            <CardTitle class="fraunces">cubic-bézier</CardTitle>
            <div
                class="w-full whitespace-pre h-8 m-0 p-0 mt-1 ml-1 text-xs flex items-center italic justify-items-center gap-2 fira-code"
            >
                {{ timingString.replace("cubic-bezier", "") }}
                <TooltipProvider :delay-duration="200">
                    <Tooltip>
                        <TooltipTrigger as-child>
                            <CopyButton class="hover:scale-105" :text="timingString" />
                        </TooltipTrigger>
                        <TooltipContent class="fira-code text-xs">
                            Copy to clipboard
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </CardHeader>
        <CardContent class="p-0 m-0">
            <svg
                ref="SVGEl"
                class="bezier-curve"
                :viewBox="`0 ${viewBox.minY} 1 ${viewBox.height}`"
                xmlns="http://www.w3.org/2000/svg"
                @mousedown="startDragging"
                @mousemove="onDrag"
                @mouseup="stopDragging"
                @mouseleave="stopDragging"
            >
                <g class="bezier-group">
                    <!-- Grid lines -->
                    <line x1="0" y1="0" x2="1" y2="0" class="grid-line" />
                    <line x1="0" y1="1" x2="1" y2="1" class="grid-line" />
                    <line x1="0" y1="0" x2="0" y2="1" class="grid-line" />
                    <line x1="1" y1="0" x2="1" y2="1" class="grid-line" />

                    <!-- Control handle lines -->
                    <line
                        :x1="controlPoints[0].x"
                        :y1="controlPoints[0].y"
                        :x2="controlPoints[1].x"
                        :y2="controlPoints[1].y"
                        class="handle-line"
                    />
                    <line
                        :x1="controlPoints[3].x"
                        :y1="controlPoints[3].y"
                        :x2="controlPoints[2].x"
                        :y2="controlPoints[2].y"
                        class="handle-line"
                    />

                    <!-- Cubic bezier curve — single smooth C command -->
                    <path :d="bezierPathD" class="bezier-path" />

                    <!-- Control points -->
                    <circle
                        v-for="(point, index) in controlPoints"
                        :key="index"
                        :cx="point.x"
                        :cy="point.y"
                        :data-index="index"
                        :class="[
                            'control-point',
                            index === 0 || index === 3
                                ? 'endpoint'
                                : 'handle',
                        ]"
                    />
                </g>
            </svg>

            <div class="flex gap-2 items-center justify-center mt-2">
                <Select
                    :model-value="selectedPreset"
                    @update:model-value="
                        (key) => {
                            selectedPreset = String(key);
                            updateCubicBezierPreset(String(key));
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
    CardHeader,
    CardTitle,
} from "@components/ui/card";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@components/ui/tooltip";

import { CSSCubicBezier, bezierPresets } from "@src/easing";
import { cubicBezierToString } from "@src/math";
import { Animation } from "@src/animation/index";

import CopyButton from "@components/custom/CopyButton.vue";
import { getStoredAnimationOptions } from "./animationStores";
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

// Compute viewBox to fit all control points with padding
const viewBox = computed(() => {
    const ys = controlPoints.value.map((p) => p.y);
    const minY = Math.min(-0.1, ...ys) - 0.15;
    const maxY = Math.max(1.1, ...ys) + 0.15;
    return { minY, height: maxY - minY };
});

// Proper SVG cubic bezier path — a single smooth curve, no segmentation
const bezierPathD = computed(() => {
    const [p0, p1, p2, p3] = controlPoints.value;
    return `M ${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`;
});

const SVGEl = useTemplateRef<SVGSVGElement>("SVGEl");

const updateTimingFunction = () => {
    storedAnimationOptions.cubicBezierOptions.controlPoints = timingValues.value;

    const timingFunction = CSSCubicBezier(
        ...(timingValues.value as [number, number, number, number]),
    );

    emit("updateTimingFunction", timingFunction);

    return timingFunction;
};

const isDragging = ref(false);
const currentPointIndex = ref<number | null>(null);

// Convert mouse position to SVG coordinate space
const mouseToSVG = (event: MouseEvent): { x: number; y: number } => {
    const svg = SVGEl.value!;
    const rect = svg.getBoundingClientRect();

    // Parse viewBox
    const vb = viewBox.value;

    // Map pixel position to viewBox coordinates
    const x = ((event.clientX - rect.left) / rect.width) * 1; // viewBox width = 1
    const y = vb.minY + ((event.clientY - rect.top) / rect.height) * vb.height;

    // The CSS transform flips Y, so negate
    return { x, y: -y };
};

const startDragging = (event: MouseEvent) => {
    const target = (event.target as SVGElement).closest("circle");
    if (!target) return;

    const index = parseInt(target.getAttribute("data-index")!);
    if (index === 0 || index === 3) return; // endpoints not draggable

    isDragging.value = true;
    currentPointIndex.value = index;
};

const stopDragging = () => {
    isDragging.value = false;
    currentPointIndex.value = null;
};

const onDrag = (event: MouseEvent) => {
    if (!isDragging.value || currentPointIndex.value === null) return;

    const { x, y } = mouseToSVG(event);

    // Clamp x to 0-1 range (CSS spec requirement for cubic-bezier x values)
    const clampedX = Math.max(0, Math.min(1, x));

    controlPoints.value[currentPointIndex.value] = { x: clampedX, y };
    timingValues.value = [
        controlPoints.value[1].x,
        controlPoints.value[1].y,
        controlPoints.value[2].x,
        controlPoints.value[2].y,
    ];

    updateTimingFunction();
};

const updateCubicBezierPreset = (key: string) => {
    timingValues.value = JSON.parse(
        JSON.stringify((bezierPresets as unknown as Record<string, number[]>)[key]),
    );
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

onMounted(() => {
    updateTimingFunction();
});
</script>

<style scoped>
:deep(.bezier-curve) {
    width: 100%;
    aspect-ratio: 1 / 1;

    .bezier-group {
        transform: scaleY(-1);
    }

    .grid-line {
        stroke: hsl(var(--muted-foreground));
        stroke-width: 0.005;
        opacity: 0.25;
    }

    .handle-line {
        stroke: hsl(var(--muted-foreground));
        stroke-width: 0.015;
        stroke-dasharray: 0.03 0.02;
        opacity: 0.5;
    }

    .bezier-path {
        stroke: hsl(var(--ppmycota-primary, var(--foreground)));
        stroke-width: 0.03;
        fill: none;
        stroke-linecap: round;
    }

    .control-point {
        r: 0.04;
        transition: r 0.15s ease, opacity 0.15s ease;
        cursor: move;

        &.endpoint {
            fill: hsl(var(--ppmycota-primary, var(--foreground)));
            stroke: none;
            cursor: default;
            r: 0.025;
            opacity: 0.5;
        }

        &.handle {
            fill: hsl(var(--foreground));
            stroke: hsl(var(--background));
            stroke-width: 0.015;

            &:hover {
                r: 0.06;
            }
        }
    }
}
</style>
