<template>
    <div
        class="container grid h-screen w-full grid-cols-3 m-0 p-0 relative items-center overflow-hidden"
    >
        <div
            class="info-bar absolute top-0 right-0 p-2 flex flex-row-reverse gap-4 items-center z-[200]"
        >
            <DarkModeToggle class="dark-mode-toggle" />
            <HoverCard>
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
                class="start-screen-text absolute flex items-center w-screen h-64 gap-2 left-4 top-0"
            >
                <h1 class="font-bold text-7xl">
                    <span
                        class="lift-down"
                        v-for="(char, index) in startScreenText"
                        :key="index"
                        :style="{
                            animationDelay: `${index * 0.3}s`,
                            animationDuration: `${startScreenText.length * 0.3 + 3}s`,
                        }"
                    >
                        {{ char }}
                    </span>
                    <span
                        class="dot-fade"
                        v-for="(char, index) in ellipsisText"
                        :key="index"
                        :style="{
                            animationDelay: `${index * 0.3}s`,
                            animationDuration: `${ellipsisText.length * 0.3 + 1}s`,
                        }"
                    >
                        {{ char }}
                    </span>
                </h1>
            </div>
        </template>

        <template
            v-for="[name, groupObject] in Object.entries(animationGroup.animations)"
        >
            <AnimationControls
                v-if="storedControls.selectedAnimation == name"
                class="animation-controls col-span-1"
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

        <div :class="storedControls.selectedAnimation ? 'col-span-2' : 'col-span-3'">
            <slot name="animation-content"> </slot>
        </div>

        <div
            class="menu-bar col-span-3 absolute bottom-0 p-4 m-0 w-screen h-[min-content] flex items-center justify-center"
        >
            <Menubar>
                <MenubarMenu>
                    <Select
                        :model-value="storedControls.selectedAnimation"
                        @update:model-value="
                            (key) => {
                                storedControls.selectedAnimation = key;
                            }
                        "
                    >
                        <SelectTrigger
                            class="border-none rounded-none h-4 outline-none focus:outline-none"
                        >
                            <SelectValue class="text-ellipsis">{{
                                storedControls.selectedAnimation
                            }}</SelectValue>
                            <SelectIcon v-if="!storedControls.selectedAnimation"
                                ><List></List
                            ></SelectIcon>
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
                </MenubarMenu>

                <MenubarMenu>
                    <MenubarTrigger>
                        <WandSparkles></WandSparkles>
                    </MenubarTrigger>
                </MenubarMenu>

                <MenubarMenu>
                    <MenubarTrigger>
                        <RotateCcw
                            class="p-0 m-0 cursor-pointer"
                            ref="resetSelectedAnimationEl"
                            @click="
                                () => resetSelectedAnimation(resetSelectedAnimationEl)
                            "
                    /></MenubarTrigger>
                </MenubarMenu>

                <MenubarMenu>
                    <Button
                        class="w-12 h-8 text-xl text-white cursor-pointer rainbow rounded-lg focus:bg-none"
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
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

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

import { List, WandSparkles } from "lucide-vue-next";

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

import { getStoredAnimationGroupControlOptions } from "./animationStores";
import { SelectIcon } from "radix-vue";

let startScreenText = $ref("Select an animation");
startScreenText = startScreenText.replace(/ /g, "\u00a0");
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

const resetSelectedAnimationEl = $ref<HTMLElement>();

const resetSelectedAnimation = (target: HTMLElement) => {
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

    storedControls.selectedAnimation = null;
    animationGroup.reset();
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

    &:hover {
        background: var(--gradient);
    }
}

.lift-down {
    display: inline-block;
    animation: liftDown 3s ease-in-out infinite;
    animation-fill-mode: forwards;
}

@keyframes liftDown {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-5px);
    }
}

.dot-fade {
    display: inline-block;
    animation: dotFade 4s ease-in-out infinite;
    animation-fill-mode: forwards;
}

@keyframes dotFade {
    0%,
    100% {
        opacity: 0;
    }
    50% {
        opacity: 1;
    }
}

@media (max-width: 640px) {
    .container {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr 1fr;
        gap: 0;

        height: 100%;
        position: relative;
    }

    .animation-controls {
        grid-row: span 1;
        height: 50px;
    }

    .animation-content {
        grid-row: 2;
    }

    .menu-bar {
        position: sticky !important;
    }
}
</style>
