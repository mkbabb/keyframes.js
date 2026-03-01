<template>
    <TooltipProvider :delay-duration="100" :skip-delay-duration="0">
    <div
        class="w-dvw min-h-dvh lg:h-dvh grid lg:grid-cols-[380px_1fr_1fr] grid-cols-1 lg:grid-rows-[1fr_auto_auto] grid-rows-[auto_auto_auto_auto] justify-items-stretch items-center relative"
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
                @layer-config-update="(v) => updateLayerConfig(name, v)"
                :animation="groupObject.animation"
                :is-grouped="true"
                :layer-config="groupObject.layer"
            >
                <template #tabs-trigger>
                    <slot name="tabs-trigger" :selected-animation="storedControls.selectedAnimation" :is-playing="isPlaying"></slot>
                </template>

                <template #tabs-content>
                    <slot name="tabs-content" :selected-animation="storedControls.selectedAnimation" :is-playing="isPlaying"></slot>
                </template>
            </AnimationControls>
        </template>

        <div
            :class="[
                'justify-self-stretch min-h-0 h-[100dvh] lg:h-full overflow-visible',
                storedControls?.selectedAnimation
                    ? 'lg:col-start-2 lg:col-end-4'
                    : 'lg:col-start-1 lg:col-end-4',
                'col-span-full lg:row-start-1 row-start-2'
            ]"
        >
            <slot name="animation-content" :selected-animation="storedControls.selectedAnimation" :is-playing="isPlaying"> </slot>
        </div>

        <!-- Teleport target for expanded timeline (content arrives via Teleport from AnimationControls) -->
        <div
            id="timeline-expanded-target"
            :class="[
                'col-span-full lg:row-start-2 row-start-3 z-40 transition-all duration-150 ease-out overflow-hidden',
                storedControls.isTimelineExpanded
                    ? 'max-h-[60vh] border-t border-border/50 bg-background/95 backdrop-blur-sm px-4 py-3'
                    : 'max-h-0',
            ]"
        ></div>

        <!-- Bottom menubar -->
        <div
            :class="[
                'p-2 m-0 z-50 flex items-center justify-center justify-items-center col-span-full',
                'lg:row-start-3 row-start-4',
            ]"
        >
            <Menubar
                ref="menubarEl"
                :class="[
                    'flex items-center justify-items-center border-none rounded-xl transition-[padding,gap] duration-150 ease-out',
                    isMenuExpanded ? 'p-2.5 px-5 gap-4' : 'p-1.5 px-3 gap-2',
                ]"
                @mouseenter="onMenuEnter"
                @mouseleave="onMenuLeave"
            >
                <MenubarMenu>
                    <IconTooltip text="Select animation">
                    <div class="relative flex items-center gap-1.5">
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
                    <span class="flex items-center gap-1.5 cursor-pointer" @click="() => { resetIconSpin(); reset(false); }">
                        <RotateCcw
                            ref="resetIconEl"
                            class="p-0 m-0 hover:scale-105"
                        />
                        <span v-if="isMenuExpanded" class="fira-code text-xs whitespace-nowrap">Reset</span>
                    </span>
                </IconTooltip>

                <IconTooltip text="Clear all & reload">
                    <span class="flex items-center gap-1.5 cursor-pointer" @click="() => { trashIconShake(); reset(true); }">
                        <Trash
                            ref="trashIconEl"
                            class="p-0 m-0 hover:scale-105"
                        />
                        <span v-if="isMenuExpanded" class="fira-code text-xs whitespace-nowrap">Clear</span>
                    </span>
                </IconTooltip>

                <MenubarMenu>
                    <IconTooltip :text="isPlaying ? 'Pause' : 'Play'">
                        <Button
                            :class="[
                                'text-xl text-white cursor-pointer rounded-xl hover:scale-105 transition-all duration-150',
                                isMenuExpanded ? 'w-14 h-8' : 'w-10 h-7',
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

                <!-- Timeline controls merged into menubar when expanded -->
                <template v-if="storedControls.isTimelineExpanded">
                    <!-- Vertical divider -->
                    <div class="w-px h-5 bg-border/60 mx-1"></div>

                    <IconTooltip text="Collapse timeline">
                        <Minimize2
                            class="p-0 m-0 cursor-pointer hover:scale-105"
                            @click="storedControls.isTimelineExpanded = false"
                        />
                    </IconTooltip>

                    <span class="fira-code text-[10px] text-muted-foreground whitespace-nowrap">Timeline</span>
                </template>

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
import { onUnmounted, ref, Teleport, useTemplateRef } from "vue";
import { Toaster, toast } from "vue-sonner";

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

const updateLayerConfig = (name: string, config: Partial<import("@src/animation/constants").AnimationLayerConfig>) => {
    animationGroup.setLayerConfig(name, config);
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

/** Resolve a template ref to a raw HTMLElement (handles component instances). */
const resolveEl = (ref: any): HTMLElement | null => {
    if (!ref) return null;
    if (ref instanceof HTMLElement) return ref;
    return ref.$el instanceof HTMLElement ? ref.$el : null;
};

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

// --- Springy expandable menubar ---
const menubarEl = useTemplateRef<HTMLElement>("menubarEl");
const isMenuExpanded = ref(false);
let collapseTimeoutId: ReturnType<typeof setTimeout> | undefined;

const expandAnim = new CSSKeyframesAnimation({
    duration: 180,
    timingFunction: "easeOutCubic",
    fillMode: "forwards",
}).fromString(/*css*/ `@keyframes menuExpand {
    0%   { transform: scaleX(0.9) scaleY(0.95); }
    100% { transform: scaleX(1) scaleY(1); }
}`);

const collapseAnim = new CSSKeyframesAnimation({
    duration: 150,
    timingFunction: "easeOutCubic",
    fillMode: "forwards",
}).fromString(/*css*/ `@keyframes menuCollapse {
    0%   { transform: scaleX(1) scaleY(1); }
    100% { transform: scaleX(0.9) scaleY(0.95); }
}`);

const onMenuEnter = () => {
    clearTimeout(collapseTimeoutId);
    const wasExpanded = isMenuExpanded.value;
    isMenuExpanded.value = true;
    if (!wasExpanded) {
        const el = resolveEl(menubarEl.value);
        if (el) {
            collapseAnim.reset();
            expandAnim.setTargets(el);
            expandAnim.reset();
            expandAnim.play();
        }
    }
};

const onMenuLeave = () => {
    clearTimeout(collapseTimeoutId);
    collapseTimeoutId = setTimeout(() => {
        isMenuExpanded.value = false;
        const el = resolveEl(menubarEl.value);
        if (el) {
            expandAnim.reset();
            collapseAnim.setTargets(el);
            collapseAnim.reset();
            collapseAnim.play();
        }
    }, 2000);
};

onUnmounted(() => {
    clearTimeout(collapseTimeoutId);
});

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
