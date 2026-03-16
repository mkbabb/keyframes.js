<template>
    <div
        :class="[
            'px-2 py-1.5 pb-[max(var(--dock-margin),env(safe-area-inset-bottom))] m-0 flex items-center justify-center justify-items-center',
            'fixed bottom-0 left-0 right-0 z-40',
        ]"
    >
        <GlassDock ref="dockRef" :collapse-delay="2500" :start-collapsed="true" :fit-content="true">
            <!-- Expanded state: full controls -->
            <div class="flex items-center gap-3">
                <IconTooltip text="Select animation">
                    <div class="relative flex items-center gap-1.5">
                        <Select
                            class="p-0 m-0 cursor-pointer"
                            :model-value="storedControls.selectedAnimation"
                            @update:model-value="
                                (key) => {
                                    emit('selectAnimation', String(key));
                                }
                            "
                        >
                            <SelectTrigger
                                class="dock-select-trigger border-none rounded-none h-auto focus:ring-0 instrument-serif text-lg bg-transparent"
                            >
                                <SelectIcon v-if="!storedControls.selectedAnimation"
                                    ><List></List
                                ></SelectIcon>
                                <SelectValue class="text-ellipsis">{{
                                    storedControls.selectedAnimation
                                }}</SelectValue>
                            </SelectTrigger>
                            <SelectContent class="min-w-[12rem]">
                                <SelectGroup class="instrument-serif text-xl">
                                    <template
                                        v-for="name in animationNames"
                                    >
                                        <SelectItem class="py-2 px-3" hide-indicator :value="name">
                                            <span class="flex items-center gap-2">
                                                <span
                                                    :class="[
                                                        'inline-block w-2.5 h-2.5 rounded-full transition-colors duration-[var(--duration-fast)]',
                                                        !isPlaying && isStarted
                                                            ? 'bg-yellow-500'
                                                            : !isPlaying
                                                              ? 'bg-gray-400'
                                                              : '',
                                                    ]"
                                                    :style="isPlaying ? dotStyle(name) : {}"
                                                ></span>
                                                <span :class="storedControls.selectedAnimation === name ? 'font-bold' : ''">{{ name }}</span>
                                            </span>
                                        </SelectItem>
                                    </template>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </IconTooltip>

                <!-- Vertical divider -->
                <div class="dock-separator"></div>

                <IconTooltip text="Reset animation">
                    <button class="dock-icon-btn" @click="() => { resetIconSpin(); emit('reset', false); }">
                        <RotateCcw
                            ref="resetIconEl"
                            class="w-5 h-5"
                        />
                    </button>
                </IconTooltip>

                <IconTooltip text="Clear all & reload">
                    <button class="dock-icon-btn" @click="() => { trashIconShake(); emit('reset', true); }">
                        <Trash
                            ref="trashIconEl"
                            class="w-5 h-5"
                        />
                    </button>
                </IconTooltip>

                <IconTooltip :text="isPlaying ? 'Pause' : 'Play'">
                    <Button
                        :class="[
                            'dock-play-btn text-xl text-white cursor-pointer rounded-full p-0',
                            'w-10 h-10 shrink-0',
                            isPlaying ? 'rainbow-vivid' : 'rainbow-pastel',
                        ]"
                        @click="emit('togglePlay')"
                    >
                        <Pause v-if="isPlaying" class="w-5 h-5" />
                        <Play v-else class="w-5 h-5 pl-0.5" />
                    </Button>
                </IconTooltip>

                <!-- Timeline controls merged into menubar when expanded -->
                <template v-if="storedControls.isTimelineExpanded">
                    <div class="dock-separator"></div>

                    <IconTooltip text="Collapse timeline">
                        <button class="dock-icon-btn" @click="emit('expandTimeline', false)">
                            <Minimize2 class="w-5 h-5" />
                        </button>
                    </IconTooltip>

                    <span class="dock-label instrument-serif text-lg whitespace-nowrap">Timeline</span>
                </template>
            </div>

            <!-- Collapsed state: animation name first, play button on right -->
            <template #collapsed>
                <span v-if="storedControls.selectedAnimation" class="instrument-serif text-lg text-foreground whitespace-nowrap font-semibold">
                    {{ storedControls.selectedAnimation }}
                </span>
                <Button
                    :class="[
                        'dock-play-btn text-white cursor-pointer rounded-full p-0',
                        'w-8 h-8 shrink-0 text-sm',
                        isPlaying ? 'rainbow-vivid' : 'rainbow-pastel',
                    ]"
                    @click.stop="onCollapsedPlayClick()"
                >
                    <Pause v-if="isPlaying" class="w-4 h-4" />
                    <Play v-else class="w-4 h-4 pl-px" />
                </Button>
            </template>
        </GlassDock>
    </div>
</template>

<script setup lang="ts">
import { useTemplateRef } from "vue";

import {
    List,
    Minimize2,
    Pause,
    Play,
    Trash,
} from "lucide-vue-next";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select";

import { RotateCcw } from "lucide-vue-next";
import IconTooltip from "@components/custom/IconTooltip.vue";

import { CSSKeyframesAnimation } from "@src/animation/index";
import Button from "@components/ui/button/Button.vue";
import { SelectIcon } from "reka-ui";
import { GlassDock } from "@components/custom/dock";

import type { StoredAnimationGroupControlOptions } from "./animationStores";

const dockRef = useTemplateRef<InstanceType<typeof GlassDock>>("dockRef");

function onCollapsedPlayClick() {
    emit('togglePlay'); // No expand — user tapped play, not the dock
}

const { storedControls, isPlaying, isStarted, animationProgress, animationNames } = defineProps<{
    storedControls: StoredAnimationGroupControlOptions;
    isPlaying: boolean;
    isStarted: boolean;
    animationProgress: Record<string, number>;
    animationNames: string[];
}>();

const emit = defineEmits<{
    (e: "togglePlay"): void;
    (e: "reset", all: boolean): void;
    (e: "selectAnimation", name: string): void;
    (e: "expandTimeline", expanded: boolean): void;
}>();

const dotStyle = (name: string): Record<string, string> => {
    const p = animationProgress[name] ?? 0;
    const deg = p * 360;
    return {
        background: `conic-gradient(rgb(34, 197, 94) ${deg}deg, rgba(34, 197, 94, 0.15) ${deg}deg)`,
        boxShadow: `0 0 ${2 + p * 3}px ${p * 1.5}px rgba(34, 197, 94, 0.4)`,
    };
};

/** Resolve a template ref to a raw HTMLElement (handles component instances). */
const resolveEl = (ref: any): HTMLElement | null => {
    if (!ref) return null;
    if (ref instanceof HTMLElement) return ref;
    return ref.$el instanceof HTMLElement ? ref.$el : null;
};

const resetIconEl = useTemplateRef<HTMLElement>("resetIconEl");
const trashIconEl = useTemplateRef<HTMLElement>("trashIconEl");

const resetSpinAnim = new CSSKeyframesAnimation({
    duration: 400,
    timingFunction: "easeOutCubic",
}).fromString(/*css*/ `@keyframes twist {
    0% { transform: perspective(200px) rotateY(0deg) scale(1); }
    40% { transform: perspective(200px) rotateY(-180deg) scale(0.85); }
    100% { transform: perspective(200px) rotateY(-360deg) scale(1); }
}`);

const trashShakeAnim = new CSSKeyframesAnimation({
    duration: 400,
    timingFunction: "easeInOutCubic",
}).fromString(/*css*/ `@keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-3px) rotate(-5deg); }
    40% { transform: translateX(3px) rotate(5deg); }
    60% { transform: translateX(-2px) rotate(-3deg); }
    80% { transform: translateX(2px) rotate(3deg); }
}`);

const resetIconSpin = () => {
    const el = resolveEl(resetIconEl.value);
    if (el) {
        resetSpinAnim.setTargets(el);
        resetSpinAnim.reset();
        resetSpinAnim.play();
    }
};

const trashIconShake = () => {
    const el = resolveEl(trashIconEl.value);
    if (el) {
        trashShakeAnim.setTargets(el);
        trashShakeAnim.reset();
        trashShakeAnim.play();
    }
};

defineExpose({ resetIconSpin, trashIconShake });
</script>

<style scoped>
.rainbow-pastel {
    background: linear-gradient(
        90deg,
        hsl(0, 50%, 78%) 0%,
        hsl(25, 55%, 76%) 12.5%,
        hsl(50, 55%, 78%) 25%,
        hsl(130, 35%, 74%) 37.5%,
        hsl(220, 45%, 76%) 50%,
        hsl(260, 35%, 76%) 62.5%,
        hsl(280, 40%, 78%) 75%,
        hsl(0, 50%, 78%) 100%
    );
}
.rainbow-vivid {
    background: linear-gradient(
        90deg,
        hsl(0, 85%, 60%) 0%,
        hsl(30, 90%, 55%) 14%,
        hsl(55, 90%, 55%) 28%,
        hsl(130, 70%, 50%) 42%,
        hsl(210, 80%, 55%) 57%,
        hsl(260, 70%, 60%) 71%,
        hsl(300, 75%, 60%) 85%,
        hsl(0, 85%, 60%) 100%
    );
}
</style>
