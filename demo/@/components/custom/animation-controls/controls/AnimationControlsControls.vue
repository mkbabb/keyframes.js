<template>
    <div class="grid items-center gap-4">
        <Card class="w-full overflow-visible transition-shadow duration-300 controls-card">
            <CardContent class="relative grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 px-4 py-3">
                <!-- Sliding panel container -->
                <div class="relative w-full overflow-clip p-1 -m-1 col-span-2 grid grid-cols-[subgrid]">
                    <Transition name="panel-fade">
                    <!-- Main controls panel -->
                        <div
                            v-if="!showDetailPanel"
                            key="main"
                            class="col-span-2 grid grid-cols-[subgrid] items-center gap-x-3 gap-y-2 w-full"
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
                                <label class="instrument-serif text-base text-muted-foreground cursor-help">iterations</label>
                            </IconTooltip>
                            <Input
                                :class="[
                                    storedAnimationOptions.animationOptions.iterationCount === 'infinite' || storedAnimationOptions.animationOptions.iterationCount === Infinity
                                        ? 'instrument-serif text-3xl'
                                        : 'fira-code',
                                ]"
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

                            <IconTooltip text="Timing function curve">
                                <label class="instrument-serif text-base text-muted-foreground cursor-help">easing</label>
                            </IconTooltip>
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
                                    <span class="items-center gap-1.5 min-w-0" style="display: flex; overflow: visible; -webkit-line-clamp: unset;">
                                        <svg viewBox="-0.05 -0.3 1.1 1.6" class="w-5 h-4 shrink-0">
                                            <path
                                                :d="getCurvePath(value as string, timingFunctionsAnd)"
                                                fill="none"
                                                class="stroke-[hsl(var(--ppmycota-primary,var(--foreground)))]"
                                                stroke-width="0.15"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                        <span :class="['fira-code truncate', DETAIL_TIMING_FUNCTIONS.has(value as string) ? 'gold-shimmer' : '']" :title="value as string">{{ value }}</span>
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
                                        class="ml-auto pl-2 text-[10px] text-muted-foreground leading-tight whitespace-nowrap"
                                    >{{ TIMING_DESCRIPTIONS[item.value] }}</span>
                                </template>
                            </ResponsiveSelect>
                        </div>

                    <!-- Detail panel (cubic-bezier / steps) -->
                    <TimingFunctionPanel
                        v-else
                        key="detail"
                        :animation="animation"
                        :stored-animation-options="storedAnimationOptions"
                        :timing-functions-and="timingFunctionsAnd"
                        @exit-detail-panel="exitDetailPanel"
                        @update-timing-function="updateTimingFunctionFromName"
                    />
                    </Transition>
                </div>

                <template v-if="!showDetailPanel">
                <Separator class="my-2 col-span-2" />

                <!-- Advanced (includes layer settings when grouped) -->
                <div
                    @click="advancedOpen = !advancedOpen"
                    role="button"
                    tabindex="0"
                    @keydown.enter="advancedOpen = !advancedOpen"
                    @keydown.space.prevent="advancedOpen = !advancedOpen"
                    class="col-span-2 grid grid-cols-[subgrid] gap-x-3 items-center w-full py-1.5 cursor-pointer hover:text-foreground text-muted-foreground transition-colors"
                >
                    <span class="instrument-serif text-base">advanced</span>
                    <div class="flex items-center justify-end px-3">
                        <ChevronDown class="w-4 h-4 opacity-50 transition-transform duration-200" :class="advancedOpen ? 'rotate-180' : ''" />
                    </div>
                </div>
                <div
                    class="col-span-2 grid grid-cols-[subgrid] transition-[grid-template-rows] duration-350 ease-[cubic-bezier(0.4,0,0.2,1)]"
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

import { ChevronDown } from "lucide-vue-next";
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
import { getCurvePath } from "./timingCurveUtils";
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

const showDetailPanel = computed(
    () => DETAIL_TIMING_FUNCTIONS.has(
        storedAnimationOptions.animationOptions.timingFunction as string,
    ) && !detailPanelDismissed.value,
);

// Re-open the detail panel when user selects a detail timing function
// (watches value change) or re-selects the same one (watches dropdown close)
watch(
    () => storedAnimationOptions.animationOptions.timingFunction as string,
    () => {
        detailPanelDismissed.value = false;
    },
);
watch(
    () => isOpen('easing'),
    (nowOpen, wasOpen) => {
        if (wasOpen && !nowOpen) {
            const tf = storedAnimationOptions.animationOptions.timingFunction as string;
            if (DETAIL_TIMING_FUNCTIONS.has(tf)) {
                detailPanelDismissed.value = false;
            }
        }
    },
);

const exitDetailPanel = () => {
    detailPanelDismissed.value = true;
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
/* Crossfade: entering panel provides height; leaving panel overlays and fades out */
.panel-fade-enter-active {
    transition: opacity 0.15s ease;
}
.panel-fade-leave-active {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    pointer-events: none;
    transition: opacity 0.1s ease;
}
.panel-fade-enter-from,
.panel-fade-leave-to {
    opacity: 0;
}

.gold-shimmer {
    background: linear-gradient(90deg, #b8860b, #ffd700, #daa520, #ffd700, #b8860b);
    background-size: 200% 100%;
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    animation: shimmer 3s linear infinite;
}

@keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}
</style>
