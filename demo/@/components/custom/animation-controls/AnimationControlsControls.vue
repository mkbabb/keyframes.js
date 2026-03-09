<template>
    <div class="grid items-center gap-4">
        <Card class="w-full overflow-visible transition-shadow duration-300 controls-card">
            <CardContent class="relative grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 px-4 py-3">
                <!-- Sliding panel container -->
                <div class="relative w-full overflow-clip p-1 -m-1 col-span-2 grid grid-cols-[subgrid]">
                    <!-- Main controls panel -->
                    <Transition name="slide-main">
                        <div
                            v-if="!showDetailPanel"
                            key="main"
                            class="col-span-2 grid grid-cols-[subgrid] items-center gap-x-3 gap-y-2 w-full"
                        >
                            <IconTooltip text="Animation length (e.g. 5s, 200ms)">
                                <label class="instrument-serif text-base text-muted-foreground cursor-help">duration</label>
                            </IconTooltip>
                            <Input
                                type="string"
                                :model-value="storedAnimationOptions.animationOptions.duration"
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
                                <label class="instrument-serif text-base text-muted-foreground cursor-help">delay</label>
                            </IconTooltip>
                            <Input
                                class="fira-code"
                                type="string"
                                :model-value="storedAnimationOptions.animationOptions.delay"
                                @change="
                                    (e: Event) => {
                                        const value = (e.target as HTMLInputElement).value;
                                        animation.setDelay(value);
                                        storedAnimationOptions.animationOptions.delay = value;
                                    }
                                "
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

                            <IconTooltip text="Playback direction">
                                <label class="instrument-serif text-base text-muted-foreground cursor-help">direction</label>
                            </IconTooltip>
                            <Select
                                :model-value="storedAnimationOptions.animationOptions.direction ?? 'normal'"
                                :open="isSelectOpen('direction')"
                                @update:open="(v: boolean) => onSelectOpenChange('direction', v)"
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
                                        >
                                            {{ direction }}
                                            <template #extra>
                                                <span v-if="DIRECTION_DESCRIPTIONS[direction]" class="ml-auto pl-2 text-[10px] text-muted-foreground whitespace-nowrap">{{ DIRECTION_DESCRIPTIONS[direction] }}</span>
                                            </template>
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <IconTooltip text="Style applied when not playing">
                                <label class="instrument-serif text-base text-muted-foreground cursor-help">fill mode</label>
                            </IconTooltip>
                            <Select
                                :model-value="storedAnimationOptions.animationOptions.fillMode ?? 'forwards'"
                                :open="isSelectOpen('fillMode')"
                                @update:open="(v: boolean) => onSelectOpenChange('fillMode', v)"
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
                                        <SelectItem
                                            v-for="mode in FILL_MODES"
                                            :value="mode"
                                        >
                                            {{ mode }}
                                            <template #extra>
                                                <span v-if="FILL_MODE_DESCRIPTIONS[mode]" class="ml-auto pl-2 text-[10px] text-muted-foreground whitespace-nowrap">{{ FILL_MODE_DESCRIPTIONS[mode] }}</span>
                                            </template>
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <IconTooltip text="Timing function curve">
                                <label class="instrument-serif text-base text-muted-foreground cursor-help">easing</label>
                            </IconTooltip>
                            <ResponsiveSelect
                                :model-value="
                                    storedAnimationOptions.animationOptions.timingFunction as any
                                "
                                :items="easingItems"
                                :open="isSelectOpen('easing')"
                                @update:open="(v: boolean) => onSelectOpenChange('easing', v)"
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
                                    <span class="flex items-center gap-1.5">
                                        <svg viewBox="-0.05 -0.3 1.1 1.6" class="w-6 h-4 shrink-0">
                                            <path
                                                :d="getCurvePath(value as string)"
                                                fill="none"
                                                class="stroke-[hsl(var(--ppmycota-primary,var(--foreground)))]"
                                                stroke-width="0.2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                        <span :class="['fira-code', DETAIL_TIMING_FUNCTIONS.has(value as string) ? 'gold-shimmer' : '']">{{ value }}</span>
                                    </span>
                                </template>
                                <template #item="{ item }">
                                    <span class="flex items-center gap-1.5">
                                        <svg viewBox="-0.05 -0.3 1.1 1.6" class="w-7 h-5 shrink-0">
                                            <path
                                                :d="getCurvePath(item.value)"
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
                    </Transition>

                    <!-- Detail panel (cubic-bezier / steps) -->
                    <TimingFunctionPanel
                        :animation="animation"
                        :stored-animation-options="storedAnimationOptions"
                        :show-detail-panel="showDetailPanel"
                        :timing-functions-and="timingFunctionsAnd"
                        @exit-detail-panel="exitDetailPanel"
                        @update-timing-function="updateTimingFunctionFromName"
                    />
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
                        <template v-if="isGrouped && layerConfig">
                            <IconTooltip text="Stacking order in animation group">
                                <label class="instrument-serif text-base text-muted-foreground cursor-help">z-index</label>
                            </IconTooltip>
                            <Input
                                type="number"
                                class="fira-code"
                                :model-value="layerConfig.zIndex"
                                @change="(e: Event) => emitLayerUpdate({ zIndex: parseInt((e.target as HTMLInputElement).value) || 0 })"
                            />

                            <IconTooltip text="How this layer blends with others">
                                <label class="instrument-serif text-base text-muted-foreground cursor-help">blend</label>
                            </IconTooltip>
                            <Select
                                :model-value="layerConfig.blendMode"
                                :open="isSelectOpen('blend')"
                                @update:open="(v: boolean) => onSelectOpenChange('blend', v)"
                                @update:model-value="(v: any) => emitLayerUpdate({ blendMode: v })"
                            >
                                <SelectTrigger class="fira-code">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup class="fira-code">
                                        <SelectItem v-for="bm in ['replace', 'add', 'weighted']" :key="bm" :value="bm">
                                            {{ bm }}
                                            <template #extra>
                                                <span class="ml-auto pl-2 text-[10px] text-muted-foreground whitespace-nowrap">{{ BLEND_MODE_DESCRIPTIONS[bm] }}</span>
                                            </template>
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <template v-if="layerConfig.blendMode === 'weighted'">
                                <IconTooltip text="Blend weight (0 = none, 1 = full)">
                                    <label class="instrument-serif text-base text-muted-foreground cursor-help">weight</label>
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
                                <label class="instrument-serif text-base text-muted-foreground cursor-help">enabled</label>
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
                            <label class="instrument-serif text-base text-muted-foreground cursor-help">WAAPI</label>
                        </IconTooltip>
                        <div class="flex items-center">
                            <Switch
                                :checked="animation.options.useWAAPI"
                                @update:checked="(v: boolean) => { animation.options.useWAAPI = v; }"
                            />
                        </div>

                        <IconTooltip text="Color interpolation space">
                            <label class="instrument-serif text-base text-muted-foreground cursor-help">color space</label>
                        </IconTooltip>
                        <Select
                            :model-value="animation.options.colorSpace ?? 'oklab'"
                            :open="isSelectOpen('colorSpace')"
                            @update:open="(v: boolean) => onSelectOpenChange('colorSpace', v)"
                            @update:model-value="(v: any) => { animation.options.colorSpace = v; }"
                        >
                            <SelectTrigger class="fira-code">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup class="fira-code">
                                    <SelectItem v-for="cs in COLOR_SPACES" :key="cs" :value="cs">
                                        {{ cs }}
                                        <template #extra>
                                            <span v-if="COLOR_SPACE_DESCRIPTIONS[cs]" class="ml-auto pl-2 text-[10px] text-muted-foreground whitespace-nowrap">{{ COLOR_SPACE_DESCRIPTIONS[cs] }}</span>
                                        </template>
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <template v-if="HUE_COLOR_SPACES.has(animation.options.colorSpace ?? 'oklab')">
                            <IconTooltip text="Hue interpolation method">
                                <label class="instrument-serif text-base text-muted-foreground cursor-help">hue method</label>
                            </IconTooltip>
                            <Select
                                :model-value="animation.options.hueMethod ?? 'shorter'"
                                :open="isSelectOpen('hueMethod')"
                                @update:open="(v: boolean) => onSelectOpenChange('hueMethod', v)"
                                @update:model-value="(v: any) => { animation.options.hueMethod = v; }"
                            >
                                <SelectTrigger class="fira-code">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup class="fira-code">
                                        <SelectItem v-for="hm in HUE_METHODS" :key="hm" :value="hm">
                                            {{ hm }}
                                            <template #extra>
                                                <span v-if="HUE_METHOD_DESCRIPTIONS[hm]" class="ml-auto pl-2 text-[10px] text-muted-foreground whitespace-nowrap">{{ HUE_METHOD_DESCRIPTIONS[hm] }}</span>
                                            </template>
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </template>
                    </div>
                </div>
                </template>

            </CardContent>
        </Card>

        <!-- Playback controls: teleported to ribbon when this is the active animation -->
        <Teleport v-if="active" to="#controls-ribbon-target" defer>
            <div :class="['w-full grid gap-2', !isAnimStarted ? 'disabled' : '']">
                <IconTooltip text="Scrub animation timeline">
                    <Slider
                        class="p-2 timeline-slider"
                        :min="0"
                        :max="animation.options.duration"
                        :model-value="[currentT]"
                        @update:model-value="(val: any) => scrubTo(val[0])"
                        @pointerdown="onSliderDown"
                        @value-commit="onSliderCommit"
                    />
                </IconTooltip>

                <div class="grid grid-cols-2 gap-2 w-full">
                    <Button
                        :class="[
                            'h-8 w-full rounded-lg gap-2 instrument-serif text-base cursor-pointer hover:scale-105 active:scale-95 transition-transform',
                            isGrouped && !isAnimStarted
                                ? 'bg-accent-red/30 text-accent-red border-accent-red/40 hover:bg-accent-red/50'
                                : '',
                        ]"
                        variant="outline"
                        @click="toggleAnimation"
                    >
                        <span>{{ isAnimPlaying ? 'Pause' : 'Play' }}</span>
                        <font-awesome-icon
                            class="icon w-4 h-4"
                            :icon="
                                isAnimPlaying
                                    ? ['fas', 'pause']
                                    : ['fas', 'play']
                            "
                        />
                    </Button>
                    <Button
                        :class="[
                            'h-8 w-full rounded-lg gap-2 instrument-serif text-base cursor-pointer hover:scale-105 active:scale-95 transition-transform',
                            userReversed
                                ? 'bg-primary/10 border-primary/40'
                                : '',
                        ]"
                        variant="outline"
                        @click="toggleReverse"
                    >
                        <span>Reverse</span>
                        <ArrowLeftRight
                            :class="[
                                'w-5 h-5 transition-transform duration-200',
                                userReversed ? 'scale-x-[-1]' : '',
                            ]"
                        />
                    </Button>
                </div>

                <AnimationVisualizer
                    class="w-full"
                    :animation="animation"
                    @scrub="scrubTo"
                    @drag-start="emit('scrubStart')"
                    @drag-end="emit('scrubEnd')"
                ></AnimationVisualizer>
            </div>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { Animation } from "@src/animation/index";

import { CSSCubicBezier, steppedEase, timingFunctions } from "@src/easing";
import { reverseCSSTime } from "@src/parsing/keyframes";

import { Button } from "@components/ui/button";
import { Slider } from "@components/ui/slider";

import { Card, CardContent } from "@components/ui/card";
import { Input } from "@components/ui/input";

import { Separator } from "@components/ui/separator";
import { Switch } from "@components/ui/switch";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select";

import { camelCaseToHyphen } from "@src/utils";

import { ArrowLeftRight, ChevronDown } from "lucide-vue-next";
import TimingFunctionPanel from "./TimingFunctionPanel.vue";
import { useAnimationSync } from "./useAnimationSync";
import IconTooltip from "@components/custom/IconTooltip.vue";
import ResponsiveSelect from "@components/custom/ResponsiveSelect.vue";

import { Teleport, computed, onMounted, onUnmounted, ref, watch } from "vue";
import {
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

const easingItems = Object.keys(timingFunctionsAnd).map((key) => ({
    value: key,
}));

const DIRECTION_DESCRIPTIONS: Record<string, string> = {
    "normal": "plays forward",
    "reverse": "plays backward",
    "alternate": "forward then backward",
    "alternate-reverse": "backward then forward",
};

const FILL_MODE_DESCRIPTIONS: Record<string, string> = {
    "none": "no styles when idle",
    "forwards": "keeps end state",
    "backwards": "applies start state before delay",
    "both": "forwards + backwards",
};

const BLEND_MODE_DESCRIPTIONS: Record<string, string> = {
    "replace": "overwrites lower layers",
    "add": "accumulates with layers",
    "weighted": "lerps by weight factor",
};

const COLOR_SPACE_DESCRIPTIONS: Record<string, string> = {
    "oklab": "perceptually uniform (default)",
    "srgb": "standard RGB gamut",
    "lab": "CIE L*a*b* perceptual",
    "lch": "cylindrical lab (hue aware)",
    "oklch": "cylindrical oklab (hue aware)",
};

const HUE_METHOD_DESCRIPTIONS: Record<string, string> = {
    "shorter": "shortest arc",
    "longer": "longest arc",
    "increasing": "always clockwise",
    "decreasing": "always counter-clockwise",
};

// Pithy descriptions for each timing function
const TIMING_DESCRIPTIONS: Record<string, string> = {
    "cubic-bezier": "custom curve",
    "linear": "constant velocity",
    "ease": "gentle start & end",
    "ease-in": "slow start, fast end",
    "ease-out": "fast start, slow end",
    "ease-in-out": "slow start & end",
    "ease-in-back": "pulls back first",
    "ease-out-back": "overshoots, settles",
    "ease-in-out-back": "pull back & overshoot",
    "ease-in-quad": "quadratic acceleration",
    "ease-out-quad": "quadratic deceleration",
    "ease-in-out-quad": "quadratic both",
    "ease-in-cubic": "cubic acceleration",
    "ease-out-cubic": "cubic deceleration",
    "ease-in-out-cubic": "cubic both",
    "ease-in-sine": "sinusoidal ramp up",
    "ease-out-sine": "sinusoidal ramp down",
    "ease-in-out-sine": "sinusoidal both",
    "ease-in-circ": "circular ramp up",
    "ease-out-circ": "circular ramp down",
    "ease-in-out-circ": "circular both",
    "ease-in-expo": "exponential ramp",
    "ease-out-expo": "exponential decay",
    "ease-in-out-expo": "exponential both",
    "ease-in-bounce": "bouncing ramp up",
    "bounce-in-ease": "bounce entrance",
    "bounce-in-ease-half": "half bounce in",
    "bounce-out-ease": "bounce landing",
    "bounce-out-ease-half": "half bounce out",
    "bounce-in-out-ease": "bounce both ends",
    "smooth-step3": "hermite interpolation",
    "smooth-step-3": "hermite interpolation",
    "steps": "discrete jumps",
    "step-start": "jump at start",
    "step-end": "jump at end",
};

// Generate SVG path data for a timing function curve
function generateCurveSVGPath(fn: (t: number) => number, n = 32): string {
    const pts: string[] = [];
    for (let i = 0; i <= n; i++) {
        const t = i / n;
        const v = fn(t);
        pts.push(`${t.toFixed(3)},${(1 - v).toFixed(3)}`);
    }
    return `M ${pts.join(" L ")}`;
}

// Step function: draw explicit staircase (not sampled)
function generateStepSVGPath(n = 4): string {
    const parts = ["M 0,1"];
    for (let i = 0; i < n; i++) {
        const y = (1 - (i + 1) / n).toFixed(3);
        const x1 = (i / n).toFixed(3);
        const x2 = ((i + 1) / n).toFixed(3);
        parts.push(`L ${x1},${y}`, `L ${x2},${y}`);
    }
    return parts.join(" ");
}

const curvePathCache = new Map<string, string>();

function getCurvePath(name: string): string {
    const cached = curvePathCache.get(name);
    if (cached) return cached;

    let path: string;
    if (name === "cubic-bezier") {
        path = generateCurveSVGPath(CSSCubicBezier(0.4, 0, 0.2, 1));
    } else if (name === "steps") {
        path = generateStepSVGPath(4);
    } else if (name === "step-start") {
        path = generateStepSVGPath(1);
    } else if (name === "step-end") {
        path = "M 0,1 L 1,1 L 1,0";
    } else {
        const fn = (timingFunctionsAnd as Record<string, any>)[name];
        path = typeof fn === "function"
            ? generateCurveSVGPath(fn)
            : generateCurveSVGPath((t: number) => t);
    }

    curvePathCache.set(name, path);
    return path;
}

const { animation, isGrouped, layerConfig, active } = defineProps<{
    animation: Animation<any>;
    isGrouped?: boolean;
    layerConfig?: AnimationLayerConfig;
    active?: boolean;
}>();

const storedAnimationOptions = getStoredAnimationOptions(animation);

const advancedOpen = ref(false);

// Only one dropdown open at a time
const openSelect = ref<string | null>(null);
const isSelectOpen = (name: string) => openSelect.value === name;
const onSelectOpenChange = (name: string, open: boolean) => {
    openSelect.value = open ? name : null;
};

// rAF-driven reactivity bridge: animation is markRaw, so Vue can't track
// property changes. We sync reactive refs every frame for the slider + buttons.
const { currentT, isPlaying: isAnimPlaying, isStarted: isAnimStarted } = useAnimationSync(animation);

const userReversed = ref(false);
const toggleReverse = () => {
    animation.reverse();
    userReversed.value = !userReversed.value;
};

// Track whether to show the detail panel — open when a detail timing function
// is selected, but allow the user to close it (back button) without changing
// the active timing function.
const detailPanelDismissed = ref(false);

const showDetailPanel = computed(
    () => DETAIL_TIMING_FUNCTIONS.has(
        storedAnimationOptions.animationOptions.timingFunction as string,
    ) && !detailPanelDismissed.value,
);

// Re-open the detail panel when user re-selects a detail timing function
watch(
    () => storedAnimationOptions.animationOptions.timingFunction as string,
    () => {
        detailPanelDismissed.value = false;
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

const emitLayerUpdate = (updates: Partial<AnimationLayerConfig>) => {
    emit("layerConfigUpdate", updates);
};

let sliderScrubActive = false;

const onSliderDown = () => {
    sliderScrubActive = true;
    emit("scrubStart");
    window.addEventListener("pointerup", onSliderUp, { once: true });
};

const onSliderUp = () => {
    if (sliderScrubActive) {
        sliderScrubActive = false;
        emit("scrubEnd");
    }
};

const onSliderCommit = () => {
    if (sliderScrubActive) {
        sliderScrubActive = false;
        window.removeEventListener("pointerup", onSliderUp);
        emit("scrubEnd");
    }
};

const scrubTo = (effectiveT: number) => {
    // Slider and visualizer operate in effectiveT space (visual position).
    // Convert to raw t for internal animation state.
    const rawT = animation.reversed
        ? animation.options.duration - effectiveT
        : effectiveT;

    if (!isGrouped) {
        const paused = animation.paused;
        animation.paused = false;
        animation.t = rawT;
        animation.interpFrames(effectiveT, true);
        animation.paused = paused;
    } else {
        emit("sliderUpdate", {
            t: rawT,
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

onUnmounted(() => {
    // Clean up any pending pointerup listener from slider scrubbing
    window.removeEventListener("pointerup", onSliderUp);
});

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
.timeline-slider {
    --slider-track-color: hsl(142 40% 72%);
    --slider-border-color: hsl(142 40% 60%);
}
:global(.dark) .timeline-slider {
    --slider-track-color: hsl(142 30% 40%);
    --slider-border-color: hsl(142 30% 50%);
}
.timeline-slider :deep(.bg-primary) {
    background-color: var(--slider-track-color);
}
.timeline-slider :deep(.border-primary) {
    border-color: var(--slider-border-color);
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
