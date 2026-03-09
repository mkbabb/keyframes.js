<template>
    <div
        :class="[
            'p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] m-0 z-50 flex items-center justify-center justify-items-center transition-all duration-300 ease-out',
            'fixed bottom-0 left-0 right-0 lg:static lg:col-span-full lg:row-start-3',
        ]"
    >
        <Menubar
            class="flex items-center justify-items-center border-none rounded-xl p-2.5 px-5 gap-4 bg-muted/50"
        >
            <MenubarMenu>
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
                            class="border-none rounded-none h-4 focus:ring-0 hover:scale-105 instrument-serif text-lg bg-transparent"
                        >
                            <SelectIcon v-if="!storedControls.selectedAnimation"
                                ><List></List
                            ></SelectIcon>
                            <SelectValue class="text-ellipsis">{{
                                storedControls.selectedAnimation
                            }}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup class="instrument-serif text-base">
                                <template
                                    v-for="name in animationNames"
                                >
                                    <SelectItem class="" :value="name">
                                        <span class="flex items-center gap-2">
                                            <span
                                                :class="[
                                                    'inline-block w-2.5 h-2.5 rounded-full transition-colors duration-300',
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
            </MenubarMenu>

            <IconTooltip text="Reset animation">
                <span class="flex items-center gap-1.5 cursor-pointer" @click="() => { resetIconSpin(); emit('reset', false); }">
                    <RotateCcw
                        ref="resetIconEl"
                        class="p-0 m-0 hover:scale-105"
                    />
                    <span class="instrument-serif text-lg whitespace-nowrap">Reset</span>
                </span>
            </IconTooltip>

            <IconTooltip text="Clear all & reload">
                <span class="flex items-center gap-1.5 cursor-pointer" @click="() => { trashIconShake(); emit('reset', true); }">
                    <Trash
                        ref="trashIconEl"
                        class="p-0 m-0 hover:scale-105"
                    />
                    <span class="instrument-serif text-lg whitespace-nowrap">Clear</span>
                </span>
            </IconTooltip>

            <MenubarMenu>
                <IconTooltip :text="isPlaying ? 'Pause' : 'Play'">
                    <Button
                        :class="[
                            'text-xl text-white cursor-pointer rounded-xl hover:scale-105 transition-all duration-150',
                            'w-14 h-8',
                            isPlaying ? 'rainbow-vivid' : 'rainbow-pastel',
                        ]"
                        @click="emit('togglePlay')"
                    >
                        <font-awesome-icon
                            class="icon"
                            :icon="
                                isPlaying
                                    ? ['fas', 'pause']
                                    : ['fas', 'play']
                            "
                        />
                    </Button>
                </IconTooltip>
            </MenubarMenu>

            <!-- Timeline controls merged into menubar when expanded -->
            <template v-if="storedControls.isTimelineExpanded">
                <!-- Vertical divider -->
                <div class="w-px h-5 bg-border/60 mx-1"></div>

                <IconTooltip text="Collapse timeline">
                    <Minimize2
                        class="p-0 m-0 cursor-pointer hover:scale-105"
                        @click="emit('expandTimeline', false)"
                    />
                </IconTooltip>

                <span class="instrument-serif text-base text-muted-foreground whitespace-nowrap">Timeline</span>
            </template>

        </Menubar>
    </div>
</template>

<script setup lang="ts">
import { useTemplateRef } from "vue";

import {
    Menubar,
    MenubarMenu,
} from "@components/ui/menubar";

import {
    List,
    Minimize2,
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

import type { StoredAnimationGroupControlOptions } from "./animationStores";

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
    transition: filter 0.3s ease;
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
    transition: filter 0.3s ease;
}
</style>
