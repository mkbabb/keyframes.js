<template>
    <div class="grid items-center gap-4">
        <Card class="w-full overflow-visible transition-shadow duration-300 controls-card">
            <CardContent class="relative grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 px-4 py-3">
                <!-- Sliding panel container — both panels always rendered, stacked in same grid cell -->
                <div class="panel-stack col-span-2 grid grid-cols-[subgrid]">
                    <!-- Main controls panel -->
                        <div
                            :class="['panel-layer col-span-2 grid grid-cols-[subgrid] items-center gap-x-3 gap-y-2 w-full', showDetailPanel ? 'panel-inactive' : 'panel-active']"
                        >
                            <LabeledInput
                                :model-value="storedAnimationOptions.animationOptions.duration"
                                label="duration"
                                tooltip="Animation length (e.g. 5s, 200ms)"
                                @update:model-value="(v) => { animation.setDuration(v); storedAnimationOptions.animationOptions.duration = v; }"
                            />

                            <LabeledInput
                                :model-value="storedAnimationOptions.animationOptions.delay"
                                label="delay"
                                tooltip="Delay before start (e.g. 0s, 500ms)"
                                @update:model-value="(v) => { animation.setDelay(v); storedAnimationOptions.animationOptions.delay = v; }"
                            />

                            <IconTooltip text="Repeat count (number or 'infinite')">
                                <label class="instrument-serif text-lg text-muted-foreground cursor-help">iterations</label>
                            </IconTooltip>
                            <Input
                                :class="
                                    storedAnimationOptions.animationOptions.iterationCount === 'infinite' || storedAnimationOptions.animationOptions.iterationCount === Infinity
                                        ? 'instrument-serif text-3xl'
                                        : 'fira-code'
                                "
                                type="string"
                                @change="
                                    (e: Event) => {
                                        const value = (e.target as HTMLInputElement).value;
                                        animation.setIterationCount(value);
                                        storedAnimationOptions.animationOptions.iterationCount =
                                            value;
                                    }
                                "
                                :model-value="
                                    storedAnimationOptions.animationOptions.iterationCount === 'infinite' || storedAnimationOptions.animationOptions.iterationCount === Infinity
                                        ? '∞'
                                        : storedAnimationOptions.animationOptions.iterationCount
                                "
                            />

                            <LabeledSelect
                                :model-value="storedAnimationOptions.animationOptions.direction ?? 'normal'"
                                :is-open="isOpen('direction')"
                                :items="DIRECTIONS"
                                :descriptions="DIRECTION_DESCRIPTIONS"
                                label="direction"
                                tooltip="Playback direction"
                                @update:model-value="(v) => { animation.setDirection(v as any); storedAnimationOptions.animationOptions.direction = v as any; }"
                                @update:open="(v) => setOpen('direction', v)"
                            />

                            <LabeledSelect
                                :model-value="storedAnimationOptions.animationOptions.fillMode ?? 'forwards'"
                                :is-open="isOpen('fillMode')"
                                :items="FILL_MODES"
                                :descriptions="FILL_MODE_DESCRIPTIONS"
                                label="fill mode"
                                tooltip="Style applied when not playing"
                                @update:model-value="(v) => { animation.setFillMode(v as any); storedAnimationOptions.animationOptions.fillMode = v as any; }"
                                @update:open="(v) => setOpen('fillMode', v)"
                            />

                            <div class="flex items-center gap-1.5">
                                <IconTooltip text="Timing function curve">
                                    <label :class="['instrument-serif text-lg text-muted-foreground cursor-help', isDetailEasing ? 'gold-shimmer' : '']">easing</label>
                                </IconTooltip>
                                <IconTooltip text="Edit easing curve">
                                    <button class="easing-edit-btn cursor-pointer p-0.5 hover:scale-110 transition-transform duration-[var(--duration-fast)]" @click.stop="onEditIconClick(storedAnimationOptions.animationOptions.timingFunction as string)">
                                        <Pencil class="w-3.5 h-3.5" />
                                    </button>
                                </IconTooltip>
                            </div>
                            <ResponsiveSelect
                                :model-value="
                                    storedAnimationOptions.animationOptions.timingFunction as any
                                "
                                :items="easingItems"
                                :open="isOpen('easing')"
                                @update:open="(v: boolean) => setOpen('easing', v)"
                                trigger-class="fira-code"
                                group-class="fira-code"
                                title="Easing"
                                @update:model-value="
                                    (key: any) => {
                                        updateTimingFunctionFromName(key);
                                        storedAnimationOptions.animationOptions.timingFunction =
                                            key;
                                    }
                                "
                            >
                                <template #trigger="{ value }">
                                    <span
                                        class="items-center gap-1.5 min-w-0 cursor-pointer"
                                        style="display: flex; overflow: visible; -webkit-line-clamp: unset;"
                                    >
                                        <svg viewBox="-0.05 -0.3 1.1 1.6" class="w-5 h-4 shrink-0">
                                            <path
                                                :d="activeCurvePath"
                                                fill="none"
                                                class="stroke-[hsl(var(--ppmycota-primary,var(--foreground)))]"
                                                stroke-width="0.15"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                        <span :class="['fira-code truncate', isDetailEasing ? 'gold-shimmer' : '']" :title="value as string">{{ value }}</span>
                                    </span>
                                </template>
                                <template #item="{ item }">
                                    <span class="flex items-center gap-1.5">
                                        <svg viewBox="-0.05 -0.3 1.1 1.6" class="w-7 h-5 shrink-0">
                                            <path
                                                :d="getCurvePath(item.value, timingFunctionsAnd)"
                                                fill="none"
                                                class="stroke-[hsl(var(--ppmycota-primary,var(--foreground)))]"
                                                stroke-width="0.18"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                        <span :class="['fira-code', DETAIL_TIMING_FUNCTIONS.has(item.value) ? 'gold-shimmer' : '']">{{ item.value }}</span>
                                    </span>
                                </template>
                                <template #item-extra="{ item }">
                                    <span
                                        v-if="TIMING_DESCRIPTIONS[item.value]"
                                        class="ml-auto pl-2 text-xs text-muted-foreground leading-tight whitespace-nowrap"
                                    >{{ TIMING_DESCRIPTIONS[item.value] }}</span>
                                </template>
                            </ResponsiveSelect>
                        </div>

                    <!-- Detail panel (cubic-bezier / steps) -->
                    <TimingFunctionPanel
                        :class="['panel-layer', showDetailPanel ? 'panel-active' : 'panel-inactive']"
                        :animation="animation"
                        :stored-animation-options="storedAnimationOptions"
                        :timing-functions-and="timingFunctionsAnd"
                        :editing-curve-name="convertedFromName ?? undefined"
                        @exit-detail-panel="exitDetailPanel"
                        @update-timing-function="updateTimingFunctionFromName"
                    />
                </div>

                <template v-if="!showDetailPanel">
                <Separator class="my-1 col-span-2" />

                <!-- Advanced (includes layer settings when grouped) -->
                <div
                    @click="advancedOpen = !advancedOpen"
                    role="button"
                    tabindex="0"
                    @keydown.enter="advancedOpen = !advancedOpen"
                    @keydown.space.prevent="advancedOpen = !advancedOpen"
                    class="col-span-2 grid grid-cols-[subgrid] gap-x-3 items-center w-full py-1.5 cursor-pointer hover:text-foreground text-muted-foreground transition-colors"
                >
                    <span class="instrument-serif text-lg">advanced</span>
                    <div class="flex items-center justify-end px-3">
                        <ChevronDown class="w-4 h-4 opacity-50 transition-transform duration-[var(--duration-normal)]" :class="advancedOpen ? 'rotate-180' : ''" />
                    </div>
                </div>
                <div
                    class="col-span-2 grid grid-cols-[subgrid] transition-[grid-template-rows] duration-[var(--duration-slow)] ease-[var(--ease-standard)]"
                    :class="advancedOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
                >
                    <div class="col-span-2 grid grid-cols-[subgrid] items-center gap-x-3 gap-y-2 overflow-hidden" :class="advancedOpen ? 'pb-2' : ''">
                        <!-- Layer Settings (only when in a group) -->
                        <LayerConfigPanel
                            v-if="isGrouped && layerConfig"
                            :layer-config="layerConfig"
                            :is-open="isOpen"
                            :set-open="setOpen"
                            @update="(v) => emit('layerConfigUpdate', v)"
                        />

                        <ColorInterpolationPanel
                            :animation="animation"
                            :is-open="isOpen"
                            :set-open="setOpen"
                        />
                    </div>
                </div>
                </template>

            </CardContent>
        </Card>

        <!-- Playback controls: teleported to ribbon when this is the active animation -->
        <Teleport v-if="active" to="#controls-ribbon-target" defer>
            <PlaybackRibbon
                :animation="animation"
                :current-t="currentT"
                :is-anim-playing="isAnimPlaying"
                :is-anim-started="isAnimStarted"
                :is-grouped="isGrouped"
                :user-reversed="userReversed"
                @scrub-start="emit('scrubStart')"
                @scrub-end="emit('scrubEnd')"
                @slider-update="(v) => emit('sliderUpdate', v)"
                @toggle-play="toggleAnimation"
                @toggle-reverse="toggleReverse"
            />
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { Animation } from "@src/animation/index";

import { CSSCubicBezier, steppedEase, timingFunctions } from "@src/easing";

import { Card, CardContent } from "@components/ui/card";
import { Input } from "@components/ui/input";

import { Separator } from "@components/ui/separator";

import { camelCaseToHyphen } from "@src/utils";

import { ChevronDown, Pencil } from "lucide-vue-next";
import TimingFunctionPanel from "./TimingFunctionPanel.vue";
import PlaybackRibbon from "./PlaybackRibbon.vue";
import LayerConfigPanel from "./LayerConfigPanel.vue";
import ColorInterpolationPanel from "./ColorInterpolationPanel.vue";
import { useAnimationSync } from "./useAnimationSync";
import IconTooltip from "@components/custom/IconTooltip.vue";
import LabeledSelect from "@components/custom/LabeledSelect.vue";
import LabeledInput from "@components/custom/LabeledInput.vue";
import ResponsiveSelect from "@components/custom/ResponsiveSelect.vue";

import { Teleport, computed, onMounted, ref, watch } from "vue";
import {
    getStoredAnimationOptions,
} from "../animationStores";
import {
    DIRECTIONS,
    FILL_MODES,
} from "@src/animation/constants";
import type {
    AnimationLayerConfig,
    TimingFunction,
    TimingFunctionNames,
} from "@src/animation/constants";
import { useExclusiveSelect } from "@composables/useExclusiveSelect";
import { getCurvePath, generateCurveSVGPath, generateStepSVGPath } from "./timingCurveUtils";
import {
    DIRECTION_DESCRIPTIONS,
    FILL_MODE_DESCRIPTIONS,
    TIMING_DESCRIPTIONS,
} from "../animationDescriptions";

let timingFunctionsAnd = {
    "cubic-bezier": "cubic-bezier",
    ...timingFunctions,
};
timingFunctionsAnd = Object.fromEntries(
    Object.entries(timingFunctionsAnd).map(([k, v]) => [camelCaseToHyphen(k), v]),
) as any;

const DETAIL_TIMING_FUNCTIONS = new Set(["cubic-bezier", "steps"]);

// Named easing → cubic-bezier control point mappings
const NAMED_EASING_BEZIER: Record<string, [number, number, number, number]> = {
    "ease": [0.25, 0.1, 0.25, 1.0],
    "ease-in": [0.42, 0, 1.0, 1.0],
    "ease-out": [0, 0, 0.58, 1.0],
    "ease-in-out": [0.42, 0, 0.58, 1.0],
    "ease-in-sine": [0.47, 0, 0.745, 0.715],
    "ease-out-sine": [0.39, 0.575, 0.565, 1],
    "ease-in-out-sine": [0.445, 0.05, 0.55, 0.95],
    "ease-in-cubic": [0.55, 0.055, 0.675, 0.19],
    "ease-out-cubic": [0.215, 0.61, 0.355, 1],
    "ease-in-out-cubic": [0.645, 0.045, 0.355, 1],
    "ease-in-quad": [0.55, 0.085, 0.68, 0.53],
    "ease-out-quad": [0.25, 0.46, 0.45, 0.94],
    "ease-in-out-quad": [0.455, 0.03, 0.515, 0.955],
    "ease-in-quart": [0.895, 0.03, 0.685, 0.22],
    "ease-out-quart": [0.165, 0.84, 0.44, 1],
    "ease-in-out-quart": [0.77, 0, 0.175, 1],
    "ease-in-quint": [0.755, 0.05, 0.855, 0.06],
    "ease-out-quint": [0.23, 1, 0.32, 1],
    "ease-in-out-quint": [0.86, 0, 0.07, 1],
    "ease-in-expo": [0.95, 0.05, 0.795, 0.035],
    "ease-out-expo": [0.19, 1, 0.22, 1],
    "ease-in-out-expo": [1, 0, 0, 1],
    "ease-in-circ": [0.6, 0.04, 0.98, 0.335],
    "ease-out-circ": [0.075, 0.82, 0.165, 1],
    "ease-in-out-circ": [0.785, 0.135, 0.15, 0.86],
    "ease-in-back": [0.6, -0.28, 0.735, 0.045],
    "ease-out-back": [0.175, 0.885, 0.32, 1.275],
    "ease-in-out-back": [0.68, -0.55, 0.265, 1.55],
    "linear": [0, 0, 1, 1],
};

/** The name of the easing we auto-converted FROM (for subtitle display) */
const convertedFromName = ref<string | null>(null);

const easingItems = Object.keys(timingFunctionsAnd).map((key) => ({
    value: key,
}));

const { animation, isGrouped, layerConfig, active } = defineProps<{
    animation: Animation<any>;
    isGrouped?: boolean;
    layerConfig?: AnimationLayerConfig;
    active?: boolean;
}>();

const storedAnimationOptions = getStoredAnimationOptions(animation);

/** Reactive SVG path for the current timing function (including edited cubic-bezier/steps). */
const activeCurvePath = computed(() => {
    const name = storedAnimationOptions.animationOptions.timingFunction as string;
    if (name === "cubic-bezier") {
        const [x1, y1, x2, y2] = storedAnimationOptions.cubicBezierOptions.controlPoints;
        return generateCurveSVGPath(CSSCubicBezier(x1, y1, x2, y2));
    }
    if (name === "steps") {
        const { steps } = storedAnimationOptions.stepOptions;
        return generateStepSVGPath(steps);
    }
    return getCurvePath(name, timingFunctionsAnd);
});

const advancedOpen = ref(false);

const { isOpen, setOpen } = useExclusiveSelect();

// rAF-driven reactivity bridge: animation is markRaw, so Vue can't track
// property changes. We sync reactive refs every frame for the slider + buttons.
const { currentT, isPlaying: isAnimPlaying, isStarted: isAnimStarted } = useAnimationSync(() => animation);

const userReversed = ref(false);
const toggleReverse = () => {
    animation.reverse();
    userReversed.value = !userReversed.value;
};

// Track whether to show the detail panel — open when a detail timing function
// is selected, but allow the user to close it (back button) without changing
// the active timing function.
const detailPanelDismissed = ref(true);

// Flag: only auto-open the editor when the edit icon was used, not from dropdown selection
const openEditorOnChange = ref(false);

const isDetailEasing = computed(
    () => DETAIL_TIMING_FUNCTIONS.has(
        storedAnimationOptions.animationOptions.timingFunction as string,
    ),
);

const showDetailPanel = computed(
    () => DETAIL_TIMING_FUNCTIONS.has(
        storedAnimationOptions.animationOptions.timingFunction as string,
    ) && !detailPanelDismissed.value,
);

// Re-open the detail panel only when triggered via edit icon
watch(
    () => storedAnimationOptions.animationOptions.timingFunction as string,
    () => {
        if (openEditorOnChange.value) {
            detailPanelDismissed.value = false;
            openEditorOnChange.value = false;
        }
    },
);

/** Called from the edit icon — opens the curve editor */
const onEditIconClick = (currentEasing: string) => {
    openEditorOnChange.value = true;
    onEasingLabelClick(currentEasing);
};

const onEasingLabelClick = (currentEasing: string) => {
    if (currentEasing === "steps") {
        // Open steps editor as-is
        storedAnimationOptions.animationOptions.timingFunction = "steps" as any;
        detailPanelDismissed.value = false;
        return;
    }

    if (currentEasing === "cubic-bezier") {
        // Already cubic-bezier — just open the editor
        detailPanelDismissed.value = false;
        convertedFromName.value = null;
        return;
    }

    // Named easing → auto-convert to cubic-bezier
    const bezierPoints = NAMED_EASING_BEZIER[currentEasing];
    if (bezierPoints) {
        storedAnimationOptions.cubicBezierOptions.controlPoints = [...bezierPoints];
        convertedFromName.value = currentEasing;
    } else {
        // Fallback: linear approximation
        storedAnimationOptions.cubicBezierOptions.controlPoints = [0, 0, 1, 1];
        convertedFromName.value = currentEasing;
    }
    storedAnimationOptions.animationOptions.timingFunction = "cubic-bezier" as any;
    updateTimingFunctionFromName("cubic-bezier");
    detailPanelDismissed.value = false;
};

const exitDetailPanel = () => {
    detailPanelDismissed.value = true;
    convertedFromName.value = null;
};

const emit = defineEmits<{
    (
        e: "sliderUpdate",
        val: {
            t: number;
            animation: Animation<any>;
        },
    ): void;
    (e: "togglePlay"): void;
    (e: "layerConfigUpdate", val: Partial<AnimationLayerConfig>): void;
    (e: "scrubStart"): void;
    (e: "scrubEnd"): void;
}>();

const setAnimationTimingFunction = (timingFunction: TimingFunction) => {
    animation.options.timingFunction = timingFunction;
    animation.frames.forEach((frame) => {
        frame.timingFunction = timingFunction;
    });
};

const updateTimingFunctionFromName = (key: TimingFunctionNames | "cubic-bezier") => {
    let timingFunction = (timingFunctions as Record<string, TimingFunction | ((...args: any[]) => TimingFunction)>)[key] as TimingFunction;

    if (key === "steps") {
        const { steps, jumpTerm } = storedAnimationOptions.stepOptions;
        timingFunction = timingFunctions[key](steps, jumpTerm);
    } else if (key === "cubic-bezier") {
        timingFunction = CSSCubicBezier(
            ...storedAnimationOptions.cubicBezierOptions.controlPoints,
        );
    }
    setAnimationTimingFunction(timingFunction);
};

const prevT = ref(0);
const toggleAnimation = () => {
    if (isGrouped && !animation.started) {
        emit("togglePlay");
        return;
    }

    if (!animation.started && !isGrouped) {
        animation.play();
    } else if (isGrouped) {
        animation.paused = !animation.paused;
    } else {
        animation.pause();

        if (animation.paused) {
            prevT.value = animation.t;
        } else {
            animation.pausedTime += animation.t - prevT.value;
            prevT.value = 0;
        }
    }
};

onMounted(() => {
    updateTimingFunctionFromName(
        storedAnimationOptions.animationOptions.timingFunction as TimingFunctionNames,
    );
});
</script>

<style scoped>
/* Grid-stacked panels: both always rendered, active determines height */
.panel-layer {
    grid-row: 1;
    grid-column: 1 / -1;
    transition: opacity var(--duration-normal) ease;
}
.panel-layer.panel-active {
    opacity: 1;
    pointer-events: auto;
}
.panel-layer.panel-inactive {
    opacity: 0;
    pointer-events: none;
    position: absolute;
    visibility: hidden;
}

.easing-edit-btn {
    color: hsl(var(--color-gold));
}

.gold-shimmer {
    background: linear-gradient(90deg, hsl(var(--color-gold-dark)), hsl(var(--color-gold-light)), hsl(var(--color-gold)), hsl(var(--color-gold-light)), hsl(var(--color-gold-dark)));
    background-size: 200% 100%;
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    animation: shimmer var(--duration-linger) linear infinite;
}

@keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}
</style>
