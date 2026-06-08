<template>
        <div
            class="w-full grid justify-items-center"
        >
            <template
                v-if="(storedAnimationOptions.animationOptions.timingFunction as any) === 'cubic-bezier'"
            >
                <!-- H.W9.F8/F3/F6 — the calm glass+cartoon register. `surface="cartoon"`
                     mints the offset-stamp depth over a `tier="quiet"` glass plate
                     (0.50α/10px — the pre-cartoon glass the user remembers). The
                     tracked specular catch-light is REMOVED (F3 too-dramatic + F6
                     consistency): this panel is now a plain quiet-glass cartoon Card
                     like its siblings, distinguished only by being a
                     direct-manipulation surface. -->
                <Card surface="cartoon" tier="quiet" class="easing-editor grid gap-0 w-full p-0">
                    <!-- H.W9.F2 — title LEFT, dismiss RIGHT: the idiomatic detail-panel
                         header. The back affordance is baked into the CardHeader row;
                         the former standalone top-LEFT button is gone (no legacy beside
                         its replacement). -->
                    <CardHeader class="grid gap-0 p-0 pb-1">
                        <div class="flex items-center justify-between gap-2">
                            <CardTitle class="text-title">cubic-bézier</CardTitle>
                            <Button
                                variant="ghost"
                                size="icon"
                                class="h-auto p-1 text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="back to controls"
                                @click="emit('exitDetailPanel')"
                            >
                                <ArrowLeft class="icon-sm" />
                            </Button>
                        </div>
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
                <Card surface="cartoon" tier="quiet">
                    <CardHeader class="p-0 pb-2">
                        <CardTitle class="text-title">steps</CardTitle>
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

<style scoped>
/* H.W4.S1 — the cubic-bézier detail Card is an `easing-editor` container so
   the nested EasingCurveCanvas sizes its block off THIS Card's inline size
   (`38cqi`), bounded in [160px, 280px] — the same container the EasingSidebar
   declares, so the canvas is capped in BOTH render hosts. Baseline-2023
   (container queries Widely available since 2023-02-14) — no fallback owed. */
.easing-editor {
    container-type: inline-size;
    container-name: easing-editor;
}

/* H.W9.F2 — the in-panel bezier canvas ceiling is a NAMED panel-context clamp
   TIGHTER than the full-rail 280px (the EasingSidebar full-rail render keeps
   280; this detail-panel render takes a smaller cap so the whole panel FITS
   without scrolling under the detail-cap). NOT a contradiction of H.W4's
   full-rail 280 ceiling — W4's `proof:easing-canvas-bounded` is the full-rail
   ceiling; this is a tighter context-specific clamp. The square LAW is
   PRESERVED (the canvas keeps `aspect-ratio:1` from EasingCurveCanvas; only the
   `block-size` ceiling drops). `:deep()` reaches the child component's scoped
   canvas. The lower `max-block-size` wins over the canvas's own 280 cap. */
:deep(.easing-curve-canvas) {
    block-size: clamp(160px, 38cqi, 220px);
    max-block-size: 220px;
}
</style>
