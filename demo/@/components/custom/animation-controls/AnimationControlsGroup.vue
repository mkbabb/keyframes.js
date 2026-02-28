<template>
    <TooltipProvider :delay-duration="100" :skip-delay-duration="0">
    <div
        class="w-full min-h-dvh lg:h-dvh grid lg:grid-cols-3 grid-cols-1 lg:grid-rows-[1fr_auto] grid-rows-[auto_auto_auto] justify-items-stretch lg:justify-items-center items-center relative"
        v-bind="$attrs"
    >
        <template
            v-for="[name, groupObject] in Object.entries(animationGroup.animations)"
        >
            <AnimationControls
                v-if="storedControls.selectedAnimation == name"
                class="col-span-1 lg:row-start-1 lg:overflow-y-auto lg:max-h-full"
                @slider-update="sliderUpdate"
                @keyframes-update="keyframesUpdate"
                @toggle-play="toggleAnimationGroup"
                :animation="groupObject.animation"
                :is-grouped="true"
            >
                <template #tabs-trigger>
                    <slot name="tabs-trigger"></slot>
                </template>

                <template #tabs-content>
                    <slot name="tabs-content"></slot>
                </template>
            </AnimationControls>
        </template>

        <div
            :class="[
                'justify-self-stretch min-h-0 h-[100dvh] lg:h-auto overflow-visible',
                storedControls?.selectedAnimation
                    ? 'lg:col-start-2 lg:col-end-4'
                    : 'lg:col-start-1 lg:col-end-4',
                'col-span-full lg:row-start-1 row-start-2'
            ]"
        >
            <slot name="animation-content"> </slot>
        </div>

        <div
            class="p-2 m-0 z-50 flex items-center justify-center justify-items-center col-span-full row-start-3 lg:row-start-2"
        >
            <Menubar
                class="p-1.5 px-3 flex items-center gap-2 justify-items-center border-none rounded-xl"
            >
                <MenubarMenu>
                    <IconTooltip text="Select animation">
                    <div class="relative">
                        <Select
                            class="p-0 m-0 cursor-pointer"
                            :model-value="storedControls.selectedAnimation"
                            @update:model-value="
                                (key) => {
                                    storedControls.selectedAnimation = String(key);
                                    if (!animationGroup.started) {
                                        animationGroup.play();
                                        syncPlayState(true);
                                    }
                                }
                            "
                        >
                            <SelectTrigger
                                class="border-none rounded-none h-4 focus:ring-0 hover:scale-105 fira-code"
                            >
                                <SelectIcon v-if="!storedControls.selectedAnimation"
                                    ><List></List
                                ></SelectIcon>
                                <SelectValue class="text-ellipsis">{{
                                    storedControls.selectedAnimation
                                }}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup class="fira-code">
                                    <template
                                        v-for="[key, groupObj] in Object.entries(
                                            animationGroup.animations,
                                        )"
                                    >
                                        <SelectItem class="" :value="key">
                                            <span class="flex items-center gap-2">
                                                <span
                                                    :class="[
                                                        'inline-block w-2 h-2 rounded-full',
                                                        isPlaying
                                                            ? 'bg-green-500'
                                                            : animationGroup.started
                                                              ? 'bg-yellow-500'
                                                              : 'bg-gray-400',
                                                    ]"
                                                ></span>
                                                <span :class="storedControls.selectedAnimation === key ? 'font-bold' : ''">{{ key }}</span>
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
                    <RotateCcw
                        ref="resetIconEl"
                        class="p-0 m-0 cursor-pointer hover:scale-105"
                        @click="() => { resetIconSpin(); reset(false); }"
                    />
                </IconTooltip>

                <IconTooltip text="Clear all & reload">
                    <Trash
                        ref="trashIconEl"
                        class="p-0 m-0 cursor-pointer hover:scale-105"
                        @click="() => { trashIconShake(); reset(true); }"
                    />
                </IconTooltip>

                <MenubarMenu>
                    <IconTooltip :text="isPlaying ? 'Pause' : 'Play'">
                        <Button
                            :class="[
                                'w-10 h-7 text-xl text-white cursor-pointer rounded-xl hover:scale-105',
                                isPlaying ? 'rainbow-vivid' : 'rainbow-pastel',
                            ]"
                            @click="toggleAnimationGroup"
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

            </Menubar>
        </div>
    </div>

    </TooltipProvider>

    <Teleport to="html">
        <Toaster
            :toastOptions="{
                unstyled: true,
                classes: {
                    toast: 'bg-foreground text-background rounded-xl fraunces px-4 py-3 grid grid-cols-1 gap-1 shadow-lg lg:w-80 w-64 max-w-[90vw]',
                    title: 'font-bold text-base',
                    description: 'font-normal text-sm',
                    actionButton: '',
                    cancelButton: '',
                    closeButton: '',
                },
            }"
            theme="system"
        />
    </Teleport>
</template>

<script setup lang="ts">
import { ref, Teleport, useTemplateRef } from "vue";
import { Toaster, toast } from "vue-sonner";

import {
    Menubar,
    MenubarMenu,
} from "@components/ui/menubar";

import {
    List,
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
import { TooltipProvider } from "@components/ui/tooltip";

import { Animation, CSSKeyframesAnimation } from "@src/animation/index";
import AnimationControls from "./AnimationControls.vue";
import Button from "@components/ui/button/Button.vue";

import {
    getStoredAnimationGroupControlOptions,
    resetAllStores,
} from "./animationStores";
import { SelectIcon } from "reka-ui";
import { AnimationGroup } from "@src/animation/group";

const { superKey, animationGroup } = defineProps<{
    animationGroup: AnimationGroup<any>;
    superKey?: string;
}>();

const storedControls = getStoredAnimationGroupControlOptions(superKey);

// Auto-select first animation on fresh load so controls are visible immediately
if (!storedControls.selectedAnimation) {
    const allNames = Object.keys(animationGroup.animations);
    storedControls.selectedAnimation = allNames[0] ?? null;
}

const emit = defineEmits<{
    (e: "playStateChange", playing: boolean): void;
}>();

// Reactive flag for play state — animationGroup is markRaw so its internal
// state changes don't trigger Vue re-renders. We sync this manually.
const isPlaying = ref(animationGroup.playing());

const syncPlayState = (playing?: boolean) => {
    if (playing === undefined) {
        playing = animationGroup.playing();
    }
    isPlaying.value = playing;
    emit("playStateChange", playing);
};

const findAnimationGroupObject = (animation: Animation<any>) => {
    return Object.values(animationGroup.animations).find(
        (a) => a.animation.id == animation.id,
    );
};

const sliderUpdate = ({ t, animation }: { t: number; animation: Animation<any> }) => {
    const groupObject = findAnimationGroupObject(animation);
    const groupAnimation = groupObject!.animation;
    const wasPaused = groupAnimation.paused;

    groupAnimation.paused = false;
    groupAnimation.t = t;

    // Adjust startTime so the next tick() continues from the scrubbed position
    // instead of reverting to the previous time.
    if (groupAnimation.startTime !== undefined) {
        groupAnimation.startTime = performance.now() - t;
        groupAnimation.pausedTime = 0;
    }

    animationGroup.transformFramesGrouped(t);
    groupAnimation.paused = wasPaused;
};

const toggleAnimationGroup = () => {
    if (!animationGroup.started) {
        if (!storedControls.selectedAnimation) {
            const allNames = Object.keys(animationGroup.animations);
            storedControls.selectedAnimation = allNames[0] ?? null;
        }

        animationGroup.play();
        syncPlayState(true);
    } else {
        animationGroup.pause();
        syncPlayState();
    }
};

const keyframesUpdate = (e: { animation: Animation<any> }) => {
    const groupObject = findAnimationGroupObject(e.animation);
    if (groupObject != null) {
        groupObject.values = {};
    }
};

const reset = (all: boolean = false) => {
    animationGroup.stop();
    syncPlayState();
    storedControls.selectedAnimation = null as any;

    if (all) {
        resetAllStores();
        window.location.reload();
    }
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
    if (resetIconEl.value) {
        resetSpinAnim.setTargets(resetIconEl.value);
        resetSpinAnim.reset();
        resetSpinAnim.play();
    }
};

const trashIconShake = () => {
    if (trashIconEl.value) {
        trashShakeAnim.setTargets(trashIconEl.value);
        trashShakeAnim.reset();
        trashShakeAnim.play();
    }
};

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
