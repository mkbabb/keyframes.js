<template>
    <div
        class="w-full min-h-screen lg:max-w-screen-xl grid lg:grid-cols-3 grid-cols-1 lg:grid-rows-1 justify-items-center justify-center items-center lg:overflow-hidden relative"
        v-bind="$attrs"
    >
        <template
            v-for="[name, groupObject] in Object.entries(animationGroup.animations)"
        >
            <AnimationControls
                v-if="storedControls.selectedAnimation == name"
                class="col-span-1"
                @slider-update="sliderUpdate"
                @keyframes-update="keyframesUpdate"
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
            :class="
                '' +
                (storedControls?.selectedAnimation == null
                    ? 'col-span-3'
                    : 'col-span-2')
            "
        >
            <slot name="animation-content"> </slot>
        </div>

        <div
            class="fixed bottom-0 p-2 m-0 w-screen h-[min-content] flex items-center justify-center justify-items-center"
        >
            <Menubar
                class="p-6 mb-8 lg:mb-2 px-4 flex items-center gap-1 justify-items-center border-none rounded-lg"
            >
                <MenubarMenu>
                    <div class="relative">
                        <Select
                            class="p-0 m-0 cursor-pointer"
                            :model-value="storedControls.selectedAnimation"
                            @update:model-value="
                                (key) => {
                                    return (storedControls.selectedAnimation = key);
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
                                        v-for="key in Object.keys(
                                            animationGroup.animations,
                                        )"
                                    >
                                        <SelectItem class="" :value="key">{{
                                            key
                                        }}</SelectItem>
                                    </template>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </MenubarMenu>

                <MenubarMenu>
                    <MenubarTrigger>
                        <RotateCcw
                            class="p-0 m-0 cursor-pointer hover:scale-105"
                            @click="(e) => reset($el as HTMLElement, false)"
                    /></MenubarTrigger>
                </MenubarMenu>

                <MenubarMenu>
                    <MenubarTrigger>
                        <Trash
                            class="p-0 m-0 cursor-pointer hover:scale-105"
                            @click="(e) => reset(e.target as HTMLElement, true)"
                    /></MenubarTrigger>
                </MenubarMenu>

                <MenubarMenu>
                    <Button
                        class="w-12 h-8 text-xl text-white cursor-pointer rainbow rounded-lg hover:scale-105"
                        @click="toggleAnimationGroup"
                    >
                        <font-awesome-icon
                            class="icon"
                            :icon="
                                animationGroup.playing()
                                    ? ['fas', 'pause']
                                    : ['fas', 'play']
                            "
                        />
                    </Button>
                </MenubarMenu>
            </Menubar>
        </div>
    </div>

    <ClientOnly>
        <Teleport to="html">
            <Toaster
                :toastOptions="{
                    unstyled: true,
                    classes: {
                        toast: 'bg-foreground text-background rounded-md fraunces px-6 py-4 grid grid-cols-1 gap-2 shadow-lg h-32 lg:w-96 w-full ',
                        title: 'font-bold text-xl',
                        description: 'font-normal text-md',
                        actionButton: '',
                        cancelButton: '',
                        closeButton: '',
                    },
                }"
                :theme="isDark ? 'dark' : 'light'"
            />
        </Teleport>
    </ClientOnly>
</template>

<script setup lang="ts">
import { Teleport, onMounted, ref, watch } from "vue";
import { Toaster, toast } from "vue-sonner";

import CommandPalette from "@components/custom/CommandPalette.vue";

import { DarkModeToggle } from "@components/custom/dark-mode-toggle";

import { Avatar, AvatarImage } from "@components/ui/avatar";

import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from "@components/ui/menubar";

import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";

import {
    ArrowBigDown,
    ArrowDown,
    List,
    Pause,
    Play,
    Trash,
    WandSparkles,
} from "lucide-vue-next";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select";

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@components/ui/hover-card";

import { RotateCcw, Lock } from "lucide-vue-next";

import { ArrowBigLeft, Clipboard, Loader2 } from "lucide-vue-next";

import { Animation, CSSKeyframesAnimation } from "@src/animation/index";
import AnimationControls from "./AnimationControls.vue";
import Button from "@components/ui/button/Button.vue";

import {
    getStoredAnimationGroupControlOptions,
    resetAllStores,
} from "./animationStores";
import { SelectIcon } from "radix-vue";
import { useDark, useWindowSize } from "@vueuse/core";
import AnimatedText from "./AnimatedText.vue";
import { rgb2ColorFilter } from "@src/units/color/colorFilter";
import { parseCSSColor } from "@src/parsing/units";
import { AnimationGroup } from "@src/animation/group";

const isDark = useDark({ disableTransition: false });

const { superKey, animationGroup } = defineProps<{
    animationGroup: AnimationGroup<any>;
    superKey?: string;
}>();

const storedControls = getStoredAnimationGroupControlOptions(superKey);

const emit = defineEmits<{
    (e: "selectedAnimation", val: string): void;
}>();

const findAnimationGroupObject = (animation: Animation<any>) => {
    return Object.values(animationGroup.animations).find(
        (a) => a.animation.id == animation.id,
    );
};

const sliderUpdate = ({ t, animation }: { t: number; animation: Animation<any> }) => {
    const groupObject = findAnimationGroupObject(animation);

    const groupAnimation = groupObject.animation;

    const paused = groupAnimation.paused;
    const prevT = groupAnimation.t;

    groupAnimation.paused = false;
    groupAnimation.t = t;

    animationGroup.transformFramesGrouped(t);

    groupAnimation.paused = paused;
    groupAnimation.t = prevT;
};

const toggleAnimationGroup = () => {
    if (!animationGroup.started) {
        if (!storedControls.selectedAnimation) {
            toast.info("Selected rotations!", {
                duration: 3000,
                description: "✨",
            });
            storedControls.selectedAnimation = "Rotations";
        }

        animationGroup.play();
    } else {
        animationGroup.pause();
    }
};

const keyframesUpdate = (e: { animation: Animation<any> }) => {
    const groupObject = findAnimationGroupObject(e.animation);
    if (groupObject != null) {
        groupObject.values = {};
    }
};

const reset = (target: HTMLElement, all: boolean = false) => {
    //     new CSSKeyframesAnimation(
    //         {
    //             duration: 700,
    //             timingFunction: "easeInBounce",
    //         },
    //         target,
    //     )
    //         .fromString(
    //             /*css*/ `@keyframes rotate {
    //     0% {
    //         transform: rotate(0deg);
    //     }
    //     100% {
    //         transform: rotate(360deg);
    //     }
    // }`,
    //         )
    //         .play();

    animationGroup.reset();
    storedControls.selectedAnimation = null;

    if (all) {
        resetAllStores();
        window.location.reload();
    }
};

onMounted(() => {
    const targetColor1 = parseCSSColor("#77d1c8");
    const targetColor2 = parseCSSColor("#a4de6a");

    // const colorFilter1 = rgb2ColorFilter(targetColor1);
    // const colorFilter2 = rgb2ColorFilter(targetColor2);

    // new CSSKeyframesAnimation({
    //     duration: 1000,
    //     iterationCount: "infinite",
    //     direction: "alternate",
    // })
    //     .fromCSSKeyframes(
    //         /*css*/ `@keyframes color-change {
    //         0% {
    //             filter: ${colorFilter1};
    //         }
    //         100% {
    //             filter: ${colorFilter2};
    //         }
    //     }`,
    //         (t, { filter }) => {
    //             const v = filter.toString();

    //             ppmycotaLogoEl.value.style.filter = v;
    //         },
    //     )
    //     .play();
});
</script>

<style scoped lang="scss">
.rainbow {
    --gradient: linear-gradient(
        90deg,
        rgba(255, 0, 0, 1) 0%,
        rgba(255, 127, 0, 1) 12.5%,
        rgba(255, 255, 0, 1) 25%,
        rgba(0, 255, 0, 1) 37.5%,
        rgba(0, 0, 255, 1) 50%,
        rgba(75, 0, 130, 1) 62.5%,
        rgba(143, 0, 255, 1) 75%,
        rgba(255, 0, 0, 1) 87.5%,
        rgba(255, 0, 0, 1) 100%
    );
    background: var(--gradient);
}
</style>
