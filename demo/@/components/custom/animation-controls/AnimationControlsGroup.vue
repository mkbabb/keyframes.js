<template>
    <div
        class="w-full h-screen max-w-screen-xl grid lg:grid-cols-3 grid-cols-1 lg:grid-rows-1 justify-items-center justify-center items-center overflow-scroll lg:overflow-hidden relative"
        v-bind="$attrs"
    >
        <div
            class="info-bar absolute top-0 w-full lg:w-min lg:right-0 p-4 pl-6 pr-6 lg:p-4 flex flex-row-reverse lg:gap-4 gap-6 items-center justify-between lg:justify-end"
        >
            <DarkModeToggle />
            <HoverCard :open-delay="0">
                <HoverCardTrigger
                    ><Button class="p-0 m-0 cursor-pointer" variant="link"
                        >@mbabb</Button
                    >
                </HoverCardTrigger>
                <HoverCardContent>
                    <div class="flex gap-4">
                        <Avatar>
                            <AvatarImage
                                src="https://avatars.githubusercontent.com/u/2848617?v=4"
                            >
                            </AvatarImage>
                        </Avatar>
                        <div>
                            <h4 class="text-sm font-semibold hover:underline">
                                <a href="https://github.com/mkbabb">@mbabb</a>
                            </h4>
                            <p>
                                Check out the project on
                                <a
                                    class="font-bold hover:underline"
                                    href="https://github.com/mkbabb/keyframes.js"
                                    >GitHub</a
                                >🎉
                            </p>
                        </div>
                    </div>
                </HoverCardContent>
            </HoverCard>
        </div>

        <template v-if="!storedControls.selectedAnimation">
            <div
                class="start-screen-text absolute mt-16 p-4 w-screen h-0 grid items-center gap-0 left-0 top-0"
            >
                <h1 class="fraunces font-bold lg:text-7xl text-5xl p-0 grid lg:flex">
                    <div>
                        <AnimatedText
                            class="depth-text"
                            :text="startScreenText"
                        ></AnimatedText>
                    </div>

                    <div>
                        <AnimatedText
                            class="dot-fade depth-text"
                            :text="ellipsisText"
                        ></AnimatedText>
                    </div>
                </h1>
                <h2 class="fraunces italic font-light text-4xl w-full">
                    from the list <List class="inline"></List> below.
                </h2>
                <h2 class="fraunces italic font-light text-xl w-full opacity-50">
                    or drag M. cubért
                    <span class="not-italic leading-none text-start">🙂‍↔️</span>
                </h2>
            </div>
        </template>

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
            <Menubar class="flex items-center gap-1 justify-items-center border-none">
                <MenubarMenu>
                    <div class="relative">
                        <Select
                            class="p-0 m-0 cursor-pointer"
                            :model-value="storedControls.selectedAnimation"
                            @update:model-value="
                                (key) => {
                                    storedControls.selectedAnimation = key;
                                }
                            "
                        >
                            <SelectTrigger
                                class="border-none rounded-none h-4 focus:ring-0"
                            >
                                <SelectIcon v-if="!storedControls.selectedAnimation"
                                    ><List></List
                                ></SelectIcon>
                                <SelectValue class="text-ellipsis">{{
                                    storedControls.selectedAnimation
                                }}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem
                                        v-for="key in Object.keys(
                                            animationGroup.animations,
                                        )"
                                        :key="key"
                                        :value="key"
                                        >{{ key }}</SelectItem
                                    >
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </MenubarMenu>

                <MenubarMenu>
                    <MenubarTrigger>
                        <RotateCcw
                            class="p-0 m-0 cursor-pointer hover:scale-105"
                            @click="(e) => reset(e.target as HTMLElement, false)"
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
                        class="w-12 h-8 text-xl text-white cursor-pointer rainbow rounded-lg focus:bg-none hover:scale-105"
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
            <Toaster />
        </Teleport>
    </ClientOnly>
</template>

<script setup lang="ts">
import { Teleport, onMounted, ref, watch } from "vue";
import { Toaster } from "vue-sonner";

import CommandPalette from "@components/custom/CommandPalette.vue";

import { DarkModeToggle } from "@components/custom/dark-mode-toggle";

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

import { Animation, AnimationGroup, CSSKeyframesAnimation, Vars } from "@src/animation";
import AnimationControls from "./AnimationControls.vue";
import Button from "@components/ui/button/Button.vue";

import {
    getStoredAnimationGroupControlOptions,
    resetAllStores,
} from "./animationStores";
import { SelectIcon } from "radix-vue";
import { useWindowSize } from "@vueuse/core";
import AnimatedText from "./AnimatedText.vue";

let startScreenText = $ref("Select an animation");
let ellipsisText = $ref("...");

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

const sliderUpdate = ({ t, animation }) => {
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
    new CSSKeyframesAnimation(
        {
            duration: 700,
            timingFunction: "easeInBounce",
        },
        target,
    )
        .fromCSSKeyframes(
            /*css*/ `@keyframes rotate {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}`,
        )
        .play();

    animationGroup.reset();
    storedControls.selectedAnimation = null;

    if (all) {
        // resetAllStores();
        window.location.reload();
    }
};

onMounted(() => {});
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
