<template>
    <div
        :class="[
            'px-2 py-1.5 pb-[max(calc(var(--dock-margin)/2),env(safe-area-inset-bottom))] m-0 flex items-center justify-center justify-items-center',
            'fixed left-0 right-0 z-dock',
        ]"
        style="bottom: var(--work-area-bottom-offset, 0px);"
    >
        <!--
            Always-expanded so the play/pause and other transport buttons
            stay at a stable x position. When the dock collapsed to a
            summary pill and expanded on hover, the summary's play button
            and the full layer's play button sat at different x — a user
            who hovered the collapsed button then clicked without moving
            the mouse would land on a sibling button instead.
        -->
        <GlassDock ref="dockRef" :always-expanded="true" :fit-content="true">
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
                            <DockSelectTrigger
                                aria-label="Select animation"
                                class="instrument-serif text-lg"
                            >
                                <SelectIcon v-if="!storedControls.selectedAnimation"
                                    ><List></List
                                ></SelectIcon>
                                <SelectValue class="text-ellipsis">{{
                                    storedControls.selectedAnimation
                                }}</SelectValue>
                            </DockSelectTrigger>
                            <SelectContent class="min-w-[12rem]">
                                <SelectGroup class="instrument-serif text-xl">
                                    <template
                                        v-for="name in animationNames"
                                    >
                                        <SelectItem class="py-2 px-3" hide-indicator :value="name">
                                            <span class="flex items-center gap-2">
                                                <span
                                                    :class="[
                                                        'status-dot w-2.5 h-2.5',
                                                        !isPlaying && isStarted
                                                            ? 'status-dot--paused'
                                                            : !isPlaying
                                                              ? 'status-dot--idle'
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
                    <DockIconButton title="Reset animation" @click="() => { resetIconSpin(); emit('reset', false); }">
                        <RotateCcw
                            ref="resetIconEl"
                            class="icon-lg"
                        />
                    </DockIconButton>
                </IconTooltip>

                <IconTooltip text="Clear all & reload">
                    <DockIconButton title="Clear all & reload" @click="() => { trashIconShake(); emit('reset', true); }">
                        <Trash
                            ref="trashIconEl"
                            class="icon-lg"
                        />
                    </DockIconButton>
                </IconTooltip>

                <IconTooltip :text="isPlaying ? 'Pause' : 'Play'">
                    <Button
                        :aria-label="isPlaying ? 'Pause animation' : 'Play animation'"
                        :class="[
                            'dock-play-btn text-xl text-white rounded-full p-0',
                            'w-10 h-10 shrink-0',
                            isPlaying ? 'rainbow-vivid' : 'rainbow-pastel',
                        ]"
                        @click="emit('togglePlay')"
                    >
                        <Pause v-if="isPlaying" class="icon-lg" />
                        <Play v-else class="icon-lg pl-0.5" />
                    </Button>
                </IconTooltip>

                <!-- Timeline controls merged into menubar when expanded -->
                <template v-if="storedControls.isTimelineExpanded">
                    <div class="dock-separator"></div>

                    <IconTooltip text="Collapse timeline">
                        <DockIconButton title="Collapse timeline" @click="emit('expandTimeline', false)">
                            <Minimize2 class="icon-lg" />
                        </DockIconButton>
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
                    :aria-label="isPlaying ? 'Pause animation' : 'Play animation'"
                    :class="[
                        'dock-play-btn text-white rounded-full p-0',
                        'w-8 h-8 shrink-0 text-sm',
                        isPlaying ? 'rainbow-vivid' : 'rainbow-pastel',
                    ]"
                    @click.stop="onCollapsedPlayClick()"
                >
                    <Pause v-if="isPlaying" class="icon-md" />
                    <Play v-else class="icon-md pl-px" />
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
    DockIconButton,
    DockSelectTrigger,
} from "@mkbabb/glass-ui/dock";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectValue,
    Button,
} from "@mkbabb/glass-ui";
import { IconTooltip } from "@mkbabb/glass-ui/icon-tooltip";

import { RotateCcw } from "lucide-vue-next";

import { CSSKeyframesAnimation } from "@src/animation/index";
import { SelectIcon } from "reka-ui";
import { GlassDock } from "@components/custom/dock";

import type { StoredAnimationGroupControlOptions } from "./stores";

const dockRef = useTemplateRef<InstanceType<typeof GlassDock>>("dockRef");

function onCollapsedPlayClick() {
    dockRef.value?.expand();
    emit('togglePlay');
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

/** Set a single CSS custom property; the stylesheet computes gradient + shadow. */
const dotStyle = (name: string): Record<string, string> => {
    const p = animationProgress[name] ?? 0;
    return { "--dot-p": String(p) };
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
/* Progress dot: conic gradient + glow driven by --dot-p (0–1) custom property.
   Avoids per-frame string allocation — only the property value changes. */
.status-dot[style*="--dot-p"] {
    --deg: calc(var(--dot-p) * 360deg);
    --glow-spread: calc(2px + var(--dot-p) * 3px);
    --glow-blur: calc(var(--dot-p) * 1.5px);
    background: conic-gradient(
        var(--color-progress) var(--deg),
        color-mix(in srgb, var(--color-progress) 15%, transparent) var(--deg)
    );
    box-shadow: 0 0 var(--glow-spread) var(--glow-blur) color-mix(in srgb, var(--color-progress) 40%, transparent);
}
</style>
