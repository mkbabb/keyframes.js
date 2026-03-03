<template>
    <div class="grid items-center gap-4">
        <Card class="w-full overflow-visible">
            <CardContent class="relative grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 px-4 py-3">
                <!-- Sliding panel container -->
                <div class="relative w-full overflow-clip p-1 -m-1 col-span-2">
                    <!-- Main controls panel -->
                    <Transition name="slide-main">
                        <div
                            v-if="!showDetailPanel"
                            key="main"
                            class="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2 w-full"
                        >
                            <IconTooltip text="Animation length (e.g. 5s, 200ms)">
                                <label class="fira-code text-xs text-muted-foreground cursor-help">duration</label>
                            </IconTooltip>
                            <Input
                                type="string"
                                :model-value="reverseCSSTime(animation.options.duration)"
                                class="fira-code"
                                @change="
                                    (e: Event) => {
                                        const value = (e.target as HTMLInputElement).value;
                                        animation.setDuration(value);
                                        storedAnimationOptions.animationOptions.duration = value;
                                    }
                                "
                            />

                            <IconTooltip text="Delay before start (e.g. 0s, 500ms)">
                                <label class="fira-code text-xs text-muted-foreground cursor-help">delay</label>
                            </IconTooltip>
                            <Input
                                class="fira-code"
                                type="string"
                                :model-value="reverseCSSTime(animation.options.delay)"
                                @change="
                                    (e: Event) => {
                                        const value = (e.target as HTMLInputElement).value;
                                        animation.setDelay(value);
                                        storedAnimationOptions.animationOptions.delay = value;
                                    }
                                "
                            />

                            <IconTooltip text="Repeat count (number or 'infinite')">
                                <label class="fira-code text-xs text-muted-foreground cursor-help">iterations</label>
                            </IconTooltip>
                            <Input
                                :class="[
                                    !isFinite(animation.options.iterationCount)
                                        ? 'fraunces text-3xl'
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
                                    isFinite(animation.options.iterationCount)
                                        ? animation.options.iterationCount
                                        : '∞'
                                "
                            />

                            <IconTooltip text="Playback direction">
                                <label class="fira-code text-xs text-muted-foreground cursor-help">direction</label>
                            </IconTooltip>
                            <Select
                                :model-value="animation.options.direction"
                                @update:model-value="
                                    (key: any) => {
                                        animation.setDirection(key);
                                        storedAnimationOptions.animationOptions.direction = key;
                                    }
                                "
                            >
                                <SelectTrigger class="fira-code">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup class="fira-code">
                                        <SelectItem
                                            v-for="direction in DIRECTIONS"
                                            :value="direction"
                                            >{{ direction }}</SelectItem
                                        >
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <IconTooltip text="Style applied when not playing">
                                <label class="fira-code text-xs text-muted-foreground cursor-help">fill mode</label>
                            </IconTooltip>
                            <Select
                                :model-value="animation.options.fillMode"
                                @update:model-value="
                                    (key: any) => {
                                        animation.setFillMode(key);
                                        storedAnimationOptions.animationOptions.fillMode = key;
                                    }
                                "
                            >
                                <SelectTrigger class="fira-code">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup class="fira-code">
                                        <template v-for="mode in FILL_MODES">
                                            <SelectItem :value="mode">{{ mode }}</SelectItem>
                                        </template>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <IconTooltip text="Timing function curve">
                                <label class="fira-code text-xs text-muted-foreground cursor-help">easing</label>
                            </IconTooltip>
                            <Select
                                :model-value="
                                    storedAnimationOptions.animationOptions.timingFunction as any
                                "
                                @update:model-value="
                                    (key: any) => {
                                        updateTimingFunctionFromName(key);
                                        storedAnimationOptions.animationOptions.timingFunction =
                                            key;
                                    }
                                "
                            >
                                <SelectTrigger class="fira-code">
                                    <span class="flex items-center gap-1.5">
                                        <span
                                            v-if="DETAIL_TIMING_FUNCTIONS.has(storedAnimationOptions.animationOptions.timingFunction as string)"
                                            class="inline-block w-1.5 h-1.5 rounded-full bg-foreground/50 shrink-0"
                                        ></span>
                                        <SelectValue />
                                    </span>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup class="fira-code">
                                        <SelectItem
                                            v-for="timingFunction in Object.keys(
                                                timingFunctionsAnd,
                                            )"
                                            :value="timingFunction"
                                        >
                                            <span class="flex items-center gap-1.5">
                                                <span
                                                    v-if="DETAIL_TIMING_FUNCTIONS.has(timingFunction)"
                                                    class="inline-block w-1.5 h-1.5 rounded-full bg-foreground/50 shrink-0"
                                                    :title="'Has granular controls'"
                                                ></span>
                                                {{ timingFunction }}
                                            </span>
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </Transition>

                    <!-- Detail panel (cubic-bezier / steps) -->
                    <Transition name="slide-detail">
                        <div
                            v-if="showDetailPanel"
                            key="detail"
                            class="w-full grid justify-items-center"
                        >
                            <button
                                class="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors mb-2 fira-code justify-self-start"
                                @click="exitDetailPanel"
                            >
                                <ArrowLeft class="w-3.5 h-3.5" />
                                back to controls
                            </button>

                            <template
                                v-if="(storedAnimationOptions.animationOptions.timingFunction as any) === 'cubic-bezier'"
                            >
                                <CubicBezierControls
                                    :animation="animation"
                                    @update-timing-function="setAnimationTimingFunction"
                                    class="w-full"
                                ></CubicBezierControls>
                            </template>

                            <template
                                v-else-if="storedAnimationOptions.animationOptions.timingFunction === 'steps'"
                            >
                                <Card class="border-none shadow-none">
                                    <CardHeader class="p-0 pb-2">
                                        <CardTitle class="fraunces">steps</CardTitle>
                                    </CardHeader>
                                    <CardContent class="p-0 grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2">
                                        <label class="fira-code text-xs text-muted-foreground">count</label>
                                        <Input
                                            type="number"
                                            class="fira-code"
                                            :model-value="storedAnimationOptions.stepOptions.steps"
                                            @update:model-value="
                                                (key: any) => {
                                                    storedAnimationOptions.stepOptions.steps = key;
                                                    updateTimingFunctionFromName('steps');
                                                }
                                            "
                                        />

                                        <label class="fira-code text-xs text-muted-foreground">jump term</label>
                                        <Select
                                            :model-value="storedAnimationOptions.stepOptions.jumpTerm"
                                            @update:model-value="
                                                (key: any) => {
                                                    storedAnimationOptions.stepOptions.jumpTerm = key;
                                                    updateTimingFunctionFromName('steps');
                                                }
                                            "
                                        >
                                            <SelectTrigger class="fira-code">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup class="fira-code">
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
                    </Transition>
                </div>

                <Separator class="my-2 col-span-2" />

                <!-- Advanced (includes layer settings when grouped) -->
                <Collapsible class="col-span-2 grid grid-cols-[subgrid]">
                    <CollapsibleTrigger class="col-span-2 flex items-center justify-between w-full py-1.5 fira-code text-xs cursor-pointer hover:text-foreground text-muted-foreground transition-colors">
                        <span>advanced</span>
                        <div class="flex items-center px-3 mr-2">
                            <ChevronDown class="w-4 h-4 opacity-50 transition-transform" />
                        </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent class="col-span-2 grid grid-cols-[subgrid] items-center gap-x-3 gap-y-2 pb-2">
                        <!-- Layer Settings (only when in a group) -->
                        <template v-if="isGrouped && layerConfig">
                            <IconTooltip text="Stacking order in animation group">
                                <label class="fira-code text-xs text-muted-foreground cursor-help">z-index</label>
                            </IconTooltip>
                            <Input
                                type="number"
                                class="fira-code"
                                :model-value="layerConfig.zIndex"
                                @change="(e: Event) => emitLayerUpdate({ zIndex: parseInt((e.target as HTMLInputElement).value) || 0 })"
                            />

                            <IconTooltip text="How this layer blends with others">
                                <label class="fira-code text-xs text-muted-foreground cursor-help">blend</label>
                            </IconTooltip>
                            <Select
                                :model-value="layerConfig.blendMode"
                                @update:model-value="(v: any) => emitLayerUpdate({ blendMode: v })"
                            >
                                <SelectTrigger class="fira-code">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup class="fira-code">
                                        <SelectItem value="replace">replace</SelectItem>
                                        <SelectItem value="add">add</SelectItem>
                                        <SelectItem value="weighted">weighted</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <template v-if="layerConfig.blendMode === 'weighted'">
                                <IconTooltip text="Blend weight (0 = none, 1 = full)">
                                    <label class="fira-code text-xs text-muted-foreground cursor-help">weight</label>
                                </IconTooltip>
                                <Slider
                                    class="py-2"
                                    :min="0"
                                    :max="1"
                                    :step="0.01"
                                    :model-value="[layerConfig.weight]"
                                    @update:model-value="(v: any) => emitLayerUpdate({ weight: v[0] })"
                                />
                            </template>

                            <IconTooltip text="Enable/disable this layer">
                                <label class="fira-code text-xs text-muted-foreground cursor-help">enabled</label>
                            </IconTooltip>
                            <div class="flex items-center">
                                <Switch
                                    :checked="layerConfig.enabled"
                                    @update:checked="(v: boolean) => emitLayerUpdate({ enabled: v })"
                                />
                            </div>

                            <Separator class="col-span-2 my-1" />
                        </template>

                        <IconTooltip text="Use Web Animations API for compositor-thread execution">
                            <label class="fira-code text-xs text-muted-foreground cursor-help">WAAPI</label>
                        </IconTooltip>
                        <div class="flex items-center">
                            <Switch
                                :checked="animation.options.useWAAPI"
                                @update:checked="(v: boolean) => { animation.options.useWAAPI = v; }"
                            />
                        </div>

                        <IconTooltip text="Color interpolation space">
                            <label class="fira-code text-xs text-muted-foreground cursor-help">color space</label>
                        </IconTooltip>
                        <Select
                            :model-value="animation.options.colorSpace ?? 'oklab'"
                            @update:model-value="(v: any) => { animation.options.colorSpace = v; }"
                        >
                            <SelectTrigger class="fira-code">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup class="fira-code">
                                    <SelectItem v-for="cs in COLOR_SPACES" :key="cs" :value="cs">{{ cs }}</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <template v-if="HUE_COLOR_SPACES.has(animation.options.colorSpace ?? 'oklab')">
                            <IconTooltip text="Hue interpolation method">
                                <label class="fira-code text-xs text-muted-foreground cursor-help">hue method</label>
                            </IconTooltip>
                            <Select
                                :model-value="animation.options.hueMethod ?? 'shorter'"
                                @update:model-value="(v: any) => { animation.options.hueMethod = v; }"
                            >
                                <SelectTrigger class="fira-code">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup class="fira-code">
                                        <SelectItem v-for="hm in HUE_METHODS" :key="hm" :value="hm">{{ hm }}</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </template>
                    </CollapsibleContent>
                </Collapsible>

                <Separator class="my-2 col-span-2" />

                <!-- Slider, buttons, visualizer — always visible -->
                <div
                    :class="
                        'col-span-2 mt-2 w-full h-full grid gap-2 bg-background rounded-xl' +
                        (!isAnimStarted ? ' disabled' : '')
                    "
                >
                    <IconTooltip text="Scrub animation timeline">
                        <Slider
                            class="col-span-2 p-2 timeline-slider"
                            :min="0"
                            :max="animation.options.duration"
                            @input="sliderUpdate"
                            :model-value="[currentT]"
                            @update:model-value="(val: any) => (animation.t = val[0])"
                        />
                    </IconTooltip>

                    <div class="col-span-2 grid grid-cols-3 gap-2 w-full">
                        <IconTooltip :text="isAnimPlaying ? 'Pause' : (isGrouped && !isAnimStarted ? 'Start animation group' : 'Play')">
                            <Button
                                :class="[
                                    'h-10 w-full rounded-xl p-0',
                                    isGrouped && !isAnimStarted
                                        ? 'bg-accent-red/30 text-accent-red border-accent-red/40 hover:bg-accent-red/50'
                                        : '',
                                ]"
                                :variant="isGrouped && !isAnimStarted ? 'outline' : 'outline'"
                                @click="toggleAnimation"
                            >
                                <font-awesome-icon
                                    class="icon text-sm"
                                    :icon="
                                        isAnimPlaying
                                            ? ['fas', 'pause']
                                            : ['fas', 'play']
                                    "
                                />
                            </Button>
                        </IconTooltip>
                        <IconTooltip text="Reverse direction">
                            <Button class="h-10 w-full rounded-xl p-0" variant="outline" @click="animation.reverse()">
                                <font-awesome-icon
                                    class="icon text-sm"
                                    :icon="['fas', 'rotate-right']"
                                />
                            </Button>
                        </IconTooltip>
                        <IconTooltip text="Reset to defaults">
                            <Button
                                class="h-10 w-full rounded-xl p-0"
                                variant="outline"
                                @click="
                                    () => {
                                        Object.assign(
                                            storedAnimationOptions,
                                            defaultStoredAnimationOptions,
                                        );
                                    }
                                "
                                ><Trash class="w-4 h-4" />
                            </Button>
                        </IconTooltip>
                    </div>

                    <AnimationVisualizer
                        class="col-span-2 w-full"
                        :animation="animation"
                    ></AnimationVisualizer>
                </div>
            </CardContent>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { Animation } from "@src/animation/index";

import { CSSCubicBezier, jumpTerms, timingFunctions } from "@src/easing";
import { reverseCSSTime } from "@src/parsing/keyframes";

import { Button } from "@components/ui/button";
import { Slider } from "@components/ui/slider";

import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Input } from "@components/ui/input";

import { Separator } from "@components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@components/ui/collapsible";
import { Switch } from "@components/ui/switch";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select";

import { CubicBezierControls } from "@components/custom/animation-controls";

import { camelCaseToHyphen } from "@src/utils";

import { Trash, ArrowLeft, ChevronDown } from "lucide-vue-next";
import IconTooltip from "@components/custom/IconTooltip.vue";

import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import {
    defaultStoredAnimationOptions,
    getStoredAnimationOptions,
} from "./animationStores";
import AnimationVisualizer from "./AnimationVisualizer.vue";
import {
    DIRECTIONS,
    FILL_MODES,
} from "@src/animation/constants";
import type {
    AnimationLayerConfig,
    TimingFunction,
    TimingFunctionNames,
} from "@src/animation/constants";

const COLOR_SPACES = ["oklab", "srgb", "lab", "lch", "oklch"] as const;
const HUE_METHODS = ["shorter", "longer", "increasing", "decreasing"] as const;
const HUE_COLOR_SPACES = new Set(["lch", "oklch", "hsl"]);

let timingFunctionsAnd = {
    "cubic-bezier": "cubic-bezier",
    ...timingFunctions,
};
timingFunctionsAnd = Object.fromEntries(
    Object.entries(timingFunctionsAnd).map(([k, v]) => [camelCaseToHyphen(k), v]),
) as any;

const DETAIL_TIMING_FUNCTIONS = new Set(["cubic-bezier", "steps"]);

const { animation, isGrouped, layerConfig } = defineProps<{
    animation: Animation<any>;
    isGrouped?: boolean;
    layerConfig?: AnimationLayerConfig;
}>();

const storedAnimationOptions = getStoredAnimationOptions(animation);

// rAF-driven reactivity bridge: animation is markRaw, so Vue can't track
// property changes. We sync reactive refs every frame for the slider + buttons.
const currentT = ref(animation.effectiveT);
const isAnimPlaying = ref(animation.playing());
const isAnimStarted = ref(animation.started);
let syncRafId: number | null = null;

const syncAnimationState = () => {
    currentT.value = animation.effectiveT;
    isAnimPlaying.value = animation.playing();
    isAnimStarted.value = animation.started;
    syncRafId = requestAnimationFrame(syncAnimationState);
};

onMounted(() => {
    syncRafId = requestAnimationFrame(syncAnimationState);
});

onUnmounted(() => {
    if (syncRafId !== null) {
        cancelAnimationFrame(syncRafId);
    }
});

// Track whether to show the detail panel
const showDetailPanel = computed(
    () => DETAIL_TIMING_FUNCTIONS.has(
        storedAnimationOptions.animationOptions.timingFunction as string,
    ),
);

// Store the previous non-detail timing function for the back button
const previousTimingFunction = ref<string>("ease-in-out");

watch(
    () => storedAnimationOptions.animationOptions.timingFunction as string,
    (newVal, oldVal) => {
        if (oldVal && !DETAIL_TIMING_FUNCTIONS.has(oldVal as string)) {
            previousTimingFunction.value = oldVal as string;
        }
    },
);

const exitDetailPanel = () => {
    const prev = previousTimingFunction.value;
    storedAnimationOptions.animationOptions.timingFunction = prev as any;
    updateTimingFunctionFromName(prev as TimingFunctionNames);
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
}>();

const emitLayerUpdate = (updates: Partial<AnimationLayerConfig>) => {
    emit("layerConfigUpdate", updates);
};

const sliderUpdate = (e: Event) => {
    const t = parseFloat((e.target as HTMLInputElement).value);

    if (!isGrouped) {
        const paused = animation.paused;
        animation.paused = false;
        animation.interpFrames(t, true);
        animation.paused = paused;
    } else {
        emit("sliderUpdate", {
            t,
            animation,
        });
    }
};

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
/* Slide transitions for controls ↔ detail panels */
.slide-main-enter-active,
.slide-detail-enter-active {
    transition: opacity 0.15s ease;
}
.slide-main-leave-active,
.slide-detail-leave-active {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    transition: opacity 0.1s ease;
}
.slide-main-enter-from,
.slide-main-leave-to,
.slide-detail-enter-from,
.slide-detail-leave-to {
    opacity: 0;
}

/* Timeline slider: pastel green track */
.timeline-slider :deep(.bg-primary) {
    background-color: hsl(142 40% 72%);
}
.timeline-slider :deep(.border-primary) {
    border-color: hsl(142 40% 60%);
}
:global(.dark) .timeline-slider :deep(.bg-primary) {
    background-color: hsl(142 30% 40%);
}
:global(.dark) .timeline-slider :deep(.border-primary) {
    border-color: hsl(142 30% 50%);
}
</style>
