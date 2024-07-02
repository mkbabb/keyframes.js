<template>
    <div
        class="w-full h-screen grid lg:grid-cols-3 grid-cols-1 lg:grid-rows-1 justify-items-center justify-center items-center overflow-scroll lg:overflow-hidden relative"
        v-bind="$attrs"
    >
        <div
            :class="
                'z-[100] col-span-3 absolute top-0 w-full lg:w-min lg:right-0 m-0 px-6 pt-2 flex flex-row-reverse lg:gap-4 gap-6 items-center justify-items-center lg:justify-center justify-between ' +
                (!storedControls.selectedAnimation ? 'lg:mt-20' : '')
            "
        >
            <DarkModeToggle
                class="hover:opacity-50 hover:scale-105 w-8 aspect-square"
            />
            <HoverCard :open-delay="1">
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

            <HoverCard :open-delay="1">
                <HoverCardTrigger
                    ><div
                        ref="ppmycotaLogoEl"
                        @click="setPPMode"
                        class="ppmycota-logo-sm z-20 w-12 h-12 stroke-2 font-bold hover:scale-105 cursor-pointer"
                    ></div>
                </HoverCardTrigger>
                <HoverCardContent>
                    <div class="flex gap-4 h-fit-content p-4">
                        <div
                            ref="ppmycotaLogoEl"
                            class="ppmycota-logo-sm z-20 w-12 h-12 stroke-2 font-bold hover:scale-105 cursor-pointer"
                        ></div>
                        <div>
                            <h4 class="fraunces">🙂‍↔️ 🌱 🍄‍🟫</h4>
                            <p>
                                <a
                                    class="fraunces font-bold hover:underline"
                                    href="https://ppmycota.com"
                                    >ppmycota.com</a
                                >
                            </p>
                        </div>
                    </div>
                </HoverCardContent>
            </HoverCard>
        </div>

        <template v-if="!storedControls.selectedAnimation">
            <div
                class="absolute mt-16 px-6 w-screen h-0 grid items-center gap-0 left-0 top-0"
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
                    ? 'mt-16 col-span-3'
                    : 'col-span-2')
            "
        >
            <slot name="animation-content"> </slot>
        </div>

        <div
            class="fixed bottom-0 p-2 m-0 w-screen h-[min-content] flex items-center justify-center justify-items-center"
        >
            <Menubar
                class="p-6 pl-4 pr-4 flex items-center gap-1 justify-items-center border-none"
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
            <Toaster :theme="isDark ? 'dark' : 'light'" />
        </Teleport>
    </ClientOnly>
</template>

<script setup lang="ts">
import { Teleport, onMounted, ref, watch } from "vue";
import { Toaster, toast } from "vue-sonner";

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
import { useDark, useWindowSize } from "@vueuse/core";
import AnimatedText from "./AnimatedText.vue";
import { rgb2ColorFilter } from "@src/colorFilter";
import { parseCSSColor } from "@src/parsing/units";

const isDark = useDark({ disableTransition: false });

let startScreenText = $ref("Select an animation");
let ellipsisText = $ref("...");

const ppmycotaLogoEl = $ref<HTMLElement>(null);

const { superKey, animationGroup } = defineProps<{
    animationGroup: AnimationGroup<any>;
    superKey?: string;
}>();

const storedControls = getStoredAnimationGroupControlOptions(superKey);

const emit = defineEmits<{
    (e: "selectedAnimation", val: string): void;
}>();

const setPPMode = () => {
    const colorFilter1 =
        "invert(83%) sepia(25%) saturate(519%) hue-rotate(123deg) brightness(85%) contrast(103%)";
    const colorFilter2 =
        "invert(58%) sepia(34%) saturate(2172%) hue-rotate(219deg) brightness(98%) contrast(106%)";

    if (storedControls.ppMode) {
        // ppmycotaLogoEl.style.filter = colorFilter2;
        toast.success("PP Mode activated! 🎉", {
            duration: 2000,
            description: "🙂‍↔️ 🌱 🍄‍🟫",
        });
    } else {
        // ppmycotaLogoEl.style.filter = colorFilter1;
        toast.error("PP Mode deactivated! 😢", {
            duration: 2000,
            description: "🙂‍↔️ 🌱 🍄‍🟫",
        });
    }

    storedControls.ppMode = !storedControls.ppMode;
};

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
