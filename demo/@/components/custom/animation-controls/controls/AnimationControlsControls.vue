<template>
    <div class="grid items-center gap-4">
        <Card class="w-full overflow-visible transition-shadow duration-normal glass-card">
            <CardContent class="relative grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 px-4 py-3">
                <!-- Sliding panel container — each panel in its own collapsible row -->
                <div class="panel-stack col-span-2 grid grid-cols-[subgrid]">
                    <!-- Main controls panel -->
                    <div :class="['panel-row', !(showDetailPanel || advancedOpen) ? 'panel-row--active' : 'panel-row--inactive']">
                        <div class="panel-content grid grid-cols-[subgrid] items-center gap-x-3 gap-y-2 w-full">
                            <LabeledInput
                                :model-value="storedAnimationOptions.animationOptions.duration ?? '5s'"
                                label="duration"
                                tooltip="Animation length (e.g. 5s, 200ms)"
                                @update:model-value="(v) => { animation.setDuration(v); storedAnimationOptions.animationOptions.duration = v; }"
                            />

                            <LabeledInput
                                :model-value="storedAnimationOptions.animationOptions.delay ?? '0ms'"
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
                                        : 'font-mono'
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
                                        : storedAnimationOptions.animationOptions.iterationCount ?? 'infinite'
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
                                @update:open="(v: boolean | undefined) => setOpen('direction', v ?? false)"
                            />

                            <LabeledSelect
                                :model-value="storedAnimationOptions.animationOptions.fillMode ?? 'forwards'"
                                :is-open="isOpen('fillMode')"
                                :items="FILL_MODES"
                                :descriptions="FILL_MODE_DESCRIPTIONS"
                                label="fill mode"
                                tooltip="Style applied when not playing"
                                @update:model-value="(v) => { animation.setFillMode(v as any); storedAnimationOptions.animationOptions.fillMode = v as any; }"
                                @update:open="(v: boolean | undefined) => setOpen('fillMode', v ?? false)"
                            />

                            <div class="flex items-center gap-1.5">
                                <IconTooltip text="Timing function curve">
                                    <label :class="['instrument-serif text-lg text-muted-foreground cursor-help', isDetailEasing ? 'gold-shimmer' : '']">easing</label>
                                </IconTooltip>
                                <IconTooltip text="Edit easing curve">
                                    <DockIconButton compact title="Edit easing curve" class="easing-edit-btn" @click.stop="onEditIconClick(storedAnimationOptions.animationOptions.timingFunction as string)">
                                        <Pencil class="icon-sm" />
                                    </DockIconButton>
                                </IconTooltip>
                            </div>
                            <EasingSelect
                                :model-value="storedAnimationOptions.animationOptions.timingFunction as string"
                                :timing-functions-and="timingFunctionsAnd"
                                @update:model-value="
                                    (key: string) => {
                                        updateTimingFunctionFromName(key);
                                        storedAnimationOptions.animationOptions.timingFunction = key;
                                    }
                                "
                            />

                            <Separator class="my-1 col-span-2" />

                            <!-- Advanced — navigate to sub-pane -->
                            <div
                                @click="advancedOpen = true"
                                role="button"
                                tabindex="0"
                                @keydown.enter="advancedOpen = true"
                                @keydown.space.prevent="advancedOpen = true"
                                class="col-span-2 grid grid-cols-[subgrid] gap-x-3 items-center w-full py-1.5 cursor-pointer hover:text-foreground text-muted-foreground transition-colors"
                            >
                                <span class="instrument-serif text-lg">advanced</span>
                                <div class="flex items-center justify-end px-3">
                                    <ChevronRight class="icon-md opacity-50" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Detail panel (cubic-bezier / steps) -->
                    <div :class="['panel-row panel-row--detail', showDetailPanel ? 'panel-row--active' : 'panel-row--inactive']">
                        <div class="panel-content">
                            <TimingFunctionPanel
                                :animation="animation"
                                :stored-animation-options="storedAnimationOptions"
                                :timing-functions-and="timingFunctionsAnd"
                                :progress="normalizedProgress"
                                v-bind="convertedFromName != null ? { editingCurveName: convertedFromName } : {}"
                                @exit-detail-panel="exitDetailPanel"
                                @update-timing-function="updateTimingFunctionFromName"
                            />
                        </div>
                    </div>

                    <!-- Advanced sub-pane -->
                    <div :class="['panel-row', advancedOpen && !showDetailPanel ? 'panel-row--active' : 'panel-row--inactive']">
                        <div class="panel-content grid grid-cols-[subgrid] items-start gap-x-3 gap-y-2 w-full">
                            <div class="col-span-2 flex items-center gap-1 mb-1">
                                <DockIconButton
                                    compact
                                    title="Back"
                                    class="text-muted-foreground"
                                    @click="advancedOpen = false"
                                >
                                    <ArrowLeft class="icon-md" />
                                </DockIconButton>
                                <span class="instrument-serif text-lg text-muted-foreground">advanced</span>
                            </div>

                            <!-- Layer Settings (only when in a group) -->
                            <LayerConfigPanel
                                v-if="isGrouped && layerConfig"
                                :layer-config="layerConfig"
                                :is-open="isOpen"
                                :set-open="setOpen"
                                @update="(v) => emit('layerConfigUpdate', v)"
                            />

                        </div>
                    </div>
                </div>

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

import { Card, CardContent, DockIconButton, Input, Separator, IconTooltip, LabeledSelect, LabeledInput } from "@mkbabb/glass-ui";

import { ChevronRight, ArrowLeft, Pencil } from "lucide-vue-next";
import TimingFunctionPanel from "./TimingFunctionPanel.vue";
import PlaybackRibbon from "./PlaybackRibbon.vue";
import LayerConfigPanel from "./LayerConfigPanel.vue";
import { useAnimationSync } from "./composables/useAnimationSync";
import { useTimingFunctionEditor } from "./composables/useTimingFunctionEditor";
import EasingSelect from "@components/custom/EasingSelect.vue";

import { Teleport, computed, onMounted, ref, toRef } from "vue";
import {
    getStoredAnimationOptions,
} from "../stores";
import {
    DIRECTIONS,
    FILL_MODES,
} from "@src/animation/constants";
import type {
    AnimationLayerConfig,
    TimingFunctionNames,
} from "@src/animation/constants";
import {
    DIRECTION_DESCRIPTIONS,
    FILL_MODE_DESCRIPTIONS,
} from "../animationDescriptions";

const props = defineProps<{
    animation: Animation<any>;
    isGrouped?: boolean;
    isPlaying?: boolean;
    layerConfig?: AnimationLayerConfig;
    active?: boolean;
}>();

const storedAnimationOptions = getStoredAnimationOptions(props.animation);

const {
    timingFunctionsAnd,
    convertedFromName,
    advancedOpen,
    isDetailEasing,
    showDetailPanel,
    onEditIconClick,
    exitDetailPanel,
    updateTimingFunctionFromName,
} = useTimingFunctionEditor(() => props.animation, storedAnimationOptions);

// Exclusive select mutex: only one dropdown open at a time
const openSelect = ref<string | null>(null);
const isOpen = (name: string) => openSelect.value === name;
const setOpen = (name: string, open: boolean) => { openSelect.value = open ? name : null; };

// rAF-driven reactivity bridge: animation is markRaw, so Vue can't track
// property changes. We sync reactive refs every frame for the slider + buttons.
// isPlaying guard comes from the parent (useAnimationGroupPlayback) — not polled.
const isPlayingRef = toRef(() => props.isPlaying ?? false);
const { currentT, isPlaying: isAnimPlaying, isStarted: isAnimStarted } = useAnimationSync(() => props.animation, isPlayingRef);

const normalizedProgress = computed(() => {
    const dur = props.animation.options.duration;
    if (!dur || dur <= 0) return 0;
    return Math.max(0, Math.min(1, currentT.value / dur));
});

const userReversed = ref(false);
const toggleReverse = () => {
    props.animation.reverse();
    userReversed.value = !userReversed.value;
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

const prevT = ref(0);
const toggleAnimation = () => {
    if (props.isGrouped) {
        emit("togglePlay");
        return;
    }

    if (!props.animation.started) {
        props.animation.play();
    } else {
        props.animation.pause();

        if (props.animation.paused) {
            prevT.value = props.animation.t;
        } else {
            props.animation.pausedTime += props.animation.t - prevT.value;
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
/* Collapsible panel rows: each panel in its own row that animates height via grid-template-rows */
.panel-row {
    display: grid;
    grid-column: 1 / -1;
    grid-template-columns: subgrid;
    transition: grid-template-rows var(--duration-normal) var(--ease-standard);
}
.panel-row--active {
    grid-template-rows: 1fr;
}
.panel-row--inactive {
    grid-template-rows: 0fr;
}
.panel-content {
    overflow: hidden;
    min-height: 0;
    grid-column: 1 / -1;
    /* Inset padding so focus rings (ring-2 + ring-offset-2 = 4px) aren't clipped
       by the overflow:hidden required for grid-template-rows collapse animation. */
    padding: 2px;
    margin: -2px;
    transition: opacity var(--duration-normal) var(--ease-standard);
}
.panel-row--active > .panel-content {
    opacity: 1;
    pointer-events: auto;
}
.panel-row--inactive > .panel-content {
    opacity: 0;
    pointer-events: none;
}

/* Constrain detail panel height so the bezier editor doesn't shift the page */
.panel-row--detail.panel-row--active > .panel-content {
    max-height: min(50vh, 480px);
    overflow-y: auto;
}

.easing-edit-btn {
    color: var(--color-gold);
}
</style>
