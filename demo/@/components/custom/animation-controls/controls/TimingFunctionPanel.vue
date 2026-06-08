<template>
        <div
            class="w-full grid justify-items-center"
        >
            <Button
                variant="ghost"
                class="flex items-center gap-1.5 text-small text-muted-foreground hover:text-foreground transition-colors mb-2 justify-self-start px-0 h-auto"
                @click="emit('exitDetailPanel')"
            >
                <ArrowLeft class="icon-sm" />
                back to controls
            </Button>

            <template
                v-if="(storedAnimationOptions.animationOptions.timingFunction as any) === 'cubic-bezier'"
            >
                <!-- S2-COMPOSITE (D14): the deliberately-glassy interactive panel.
                     The cubic-bézier editor is the one direct-manipulation surface
                     the user wants glassy — so it keeps the iOS catch-light AND
                     gains cartoon depth. `surface="cartoon"` mints the offset-stamp
                     depth (and drops `shadow-card`); `glass-specular-track` (glass-
                     ui's `@layer` class, applied directly) brings the `::before`
                     catch-light back so it composes over the glass tier; and
                     `.cartoon-specular` names the composite + carries the refined
                     intensity tune. The Card prop API emits cartoon XOR specular —
                     it structurally cannot express the composite, so this single
                     demo class-composition of glass-ui classes is the correct seam.
                     `useSpecularPointer` wires the cursor + calms the intensity
                     (0.22 rest / 0.4 hover). -->
                <Card ref="bezierCardRef" surface="cartoon" class="cartoon-specular glass-specular-track grid gap-0 w-full p-0">
                    <CardHeader class="grid gap-0 p-0 pb-1">
                        <CardTitle class="text-heading">cubic-bézier</CardTitle>
                        <p v-if="editingCurveName" class="text-mono-caption normal-case text-muted-foreground ml-1 mb-0.5">editing: {{ editingCurveName }}</p>
                        <div
                            class="w-full whitespace-pre h-6 m-0 p-0 ml-1 text-mono-caption normal-case flex items-center italic justify-items-center gap-2"
                        >
                            {{ timingString.replace("cubic-bezier", "") }}
                            <TooltipProvider :delay-duration="200">
                                <Tooltip>
                                    <TooltipTrigger as-child>
                                        <CopyButton class="scale-on-hover icon-md" :text="timingString" />
                                    </TooltipTrigger>
                                    <TooltipContent class="text-mono-caption normal-case">
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
                <Card surface="cartoon">
                    <CardHeader class="p-0 pb-2">
                        <CardTitle class="text-heading">steps</CardTitle>
                    </CardHeader>
                    <!-- Single-column stacked fields (label OVER control), the same
                         shape as the sidebar's LabeledField rows — H.W3.S3b collapsed
                         this panel's own label|control two-track grid. -->
                    <CardContent class="p-0 flex flex-col gap-2">
                        <div class="flex flex-col gap-1">
                            <label class="text-mono-caption normal-case text-muted-foreground">count</label>
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
                        </div>

                        <div class="flex flex-col gap-1">
                            <label class="text-mono-caption normal-case text-muted-foreground">jump term</label>
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
                        </div>
                    </CardContent>
                </Card>
            </template>
        </div>
</template>

<script setup lang="ts">
import type { Animation } from "@src/animation/engine";
import type { TimingFunction, TimingFunctionNames } from "@src/animation/constants";
import type { StoredAnimationOptions } from "../stores";

import {
    bezierPresets,
    CSSCubicBezier,
    cubicBezierToString,
    jumpTerms,
} from "@mkbabb/value.js";
import { generateCurveSVGPath } from "./timingCurveUtils";

import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
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
import { Input } from "@mkbabb/glass-ui/forms";

import { computed, ref } from "vue";
import { ArrowLeft } from "@lucide/vue";
import CopyButton from "@components/custom/CopyButton.vue";
import EasingCurveCanvas from "@components/custom/EasingCurveCanvas.vue";
import { useSpecularPointer } from "@composables/useSpecularPointer";

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

// S2-COMPOSITE / S3 — wire the cursor-tracked, calmed catch-light onto the
// composite bezier Card. The Card root is a reka-ui Primitive (a div); its
// instance `$el` is that DOM node. The composable no-ops under reduced motion
// and single-sources the intensity tune (0.22 rest → 0.4 hover) the
// `.cartoon-specular` recipe projects onto the `::before`.
const bezierCardRef = ref<{ $el: HTMLElement } | null>(null);
useSpecularPointer(() => bezierCardRef.value?.$el ?? null);

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
