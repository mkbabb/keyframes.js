<template>
        <div
            class="col-span-2 w-full grid justify-items-center"
        >
            <Button
                variant="ghost"
                class="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2 instrument-serif justify-self-start px-0 h-auto"
                @click="emit('exitDetailPanel')"
            >
                <ArrowLeft class="icon-sm" />
                back to controls
            </Button>

            <template
                v-if="(storedAnimationOptions.animationOptions.timingFunction as any) === 'cubic-bezier'"
            >
                <Card plain class="grid gap-0 w-full p-0">
                    <CardHeader class="grid gap-0 p-0 pb-1">
                        <CardTitle class="instrument-serif">cubic-bézier</CardTitle>
                        <p v-if="editingCurveName" class="font-mono text-xs text-muted-foreground ml-1 mb-0.5">editing: {{ editingCurveName }}</p>
                        <div
                            class="w-full whitespace-pre h-6 m-0 p-0 ml-1 text-xs flex items-center italic justify-items-center gap-2 font-mono"
                        >
                            {{ timingString.replace("cubic-bezier", "") }}
                            <TooltipProvider :delay-duration="200">
                                <Tooltip>
                                    <TooltipTrigger as-child>
                                        <CopyButton class="hover:scale-105 icon-md" :text="timingString" />
                                    </TooltipTrigger>
                                    <TooltipContent class="font-mono text-xs">
                                        Copy to clipboard
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </CardHeader>
                    <CardContent class="p-0 m-0 grid gap-2">
                        <EasingCurveCanvas
                            :easing-fn="currentBezierFn"
                            :svg-path="currentBezierSvgPath"
                            :progress="progress"
                            :bezier-points="controlPoints"
                            :editable="true"
                            @update:bezier-points="onBezierPointsUpdate"
                        />

                        <div class="flex gap-2 items-center justify-center">
                            <Select
                                :model-value="selectedPreset"
                                @update:model-value="(key) => updatePreset(String(key))"
                            >
                                <SelectTrigger class="font-mono">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup class="font-mono">
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

            <template
                v-else-if="storedAnimationOptions.animationOptions.timingFunction === 'steps'"
            >
                <Card plain>
                    <CardHeader class="p-0 pb-2">
                        <CardTitle class="instrument-serif">steps</CardTitle>
                    </CardHeader>
                    <CardContent class="p-0 grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2">
                        <label class="font-mono text-xs text-muted-foreground">count</label>
                        <Input
                            type="number"
                            class="font-mono"
                            :model-value="storedAnimationOptions.stepOptions.steps"
                            @update:model-value="
                                (key: any) => {
                                    storedAnimationOptions.stepOptions.steps = key;
                                    emit('updateTimingFunction', 'steps' as any);
                                }
                            "
                        />

                        <label class="font-mono text-xs text-muted-foreground">jump term</label>
                        <Select
                            :model-value="storedAnimationOptions.stepOptions.jumpTerm"
                            @update:model-value="
                                (key: any) => {
                                    storedAnimationOptions.stepOptions.jumpTerm = key;
                                    emit('updateTimingFunction', 'steps' as any);
                                }
                            "
                        >
                            <SelectTrigger class="font-mono">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup class="font-mono">
                                    <SelectItem v-for="j in jumpTerms" :value="j">
                                        {{ j }}
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>
            </template>
        </div>
</template>

<script setup lang="ts">
import type { Animation } from "@src/animation/index";
import type { TimingFunction, TimingFunctionNames } from "@src/animation/constants";
import type { StoredAnimationOptions } from "../stores";

import { CSSCubicBezier, bezierPresets, jumpTerms } from "@src/easing";
import { cubicBezierToString } from "@src/math";
import { generateCurveSVGPath } from "./composables/timingCurveUtils";

import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Input,
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@mkbabb/glass-ui";

import { computed, ref } from "vue";
import { ArrowLeft } from "lucide-vue-next";
import CopyButton from "@components/custom/CopyButton.vue";
import EasingCurveCanvas from "@components/custom/EasingCurveCanvas.vue";

const props = defineProps<{
    animation: Animation<any>;
    storedAnimationOptions: StoredAnimationOptions;
    timingFunctionsAnd: Record<string, any>;
    editingCurveName?: string;
    progress?: number;
}>();

const emit = defineEmits<{
    (e: "exitDetailPanel"): void;
    (e: "updateTimingFunction", key: TimingFunctionNames | "cubic-bezier"): void;
}>();

// ── Cubic bezier state ──────────────────────────────────────────

const selectedPreset = ref("ease");

const controlPoints = computed<[number, number, number, number]>(
    () => props.storedAnimationOptions.cubicBezierOptions.controlPoints as [number, number, number, number],
);

const currentBezierFn = computed<TimingFunction>(
    () => CSSCubicBezier(...controlPoints.value),
);

const currentBezierSvgPath = computed(
    () => generateCurveSVGPath(currentBezierFn.value),
);

const timingString = computed(
    () => cubicBezierToString(...controlPoints.value),
);

const onBezierPointsUpdate = (pts: [number, number, number, number]) => {
    props.storedAnimationOptions.cubicBezierOptions.controlPoints = pts;

    const timingFunction = CSSCubicBezier(...pts);
    props.animation.options.timingFunction = timingFunction;
    props.animation.frames.forEach((frame) => {
        frame.timingFunction = timingFunction;
    });

    emit("updateTimingFunction", "cubic-bezier");
};

const updatePreset = (key: string) => {
    selectedPreset.value = key;
    const pts = (bezierPresets as unknown as Record<string, number[]>)[key];
    if (pts) {
        onBezierPointsUpdate([pts[0], pts[1], pts[2], pts[3]] as [number, number, number, number]);
    }
};
</script>
