<template>
    <div class="grid h-screen z-10 p-4 relative">
        <Tabs
            class="overflow-scroll"
            :model-value="storedControls.selectedControl"
            @update:model-value="
                (key) => {
                    storedControls.selectedControl = key.toString();
                }
            "
        >
            <TabsList class="w-full flex gap-2 sticky top-0 overflow-x-scroll">
                <TabsTrigger value="controls">Controls</TabsTrigger>
                <TabsTrigger value="keyframes">Keyframes</TabsTrigger>
                <slot name="tabs-trigger"></slot>
            </TabsList>

            <div>
                <CardHeader class="grid gap-0">
                    <CardTitle>{{
                        controlNames[storedControls.selectedControl] ?? "🙂‍↔️"
                    }}</CardTitle>
                    <div
                        class="w-full h-4 m-0 p-0 mt-2 text-lg flex items-center italic justify-items-center gap-2 fraunces"
                    >
                        {{ animation.name }}
                    </div>
                </CardHeader>

                <TabsContent value="controls">
                    <Card>
                        <CardContent class="pt-4 grid grid-cols-2 gap-1 items-center">
                            <Label>Duration</Label>
                            <Input
                                type="string"
                                :model-value="
                                    reverseCSSTime(animation.options.duration)
                                "
                                @change="
                                    (e) => {
                                        const value = (e.target as HTMLInputElement)
                                            .value;
                                        animation.updateDuration(value);
                                        storedAnimationOptions.animationOptions.duration =
                                            value;
                                    }
                                "
                            />

                            <Label>Delay</Label>
                            <Input
                                type="string"
                                :model-value="reverseCSSTime(animation.options.delay)"
                                @change="
                                    (e) => {
                                        const value = (e.target as HTMLInputElement)
                                            .value;
                                        animation.updateDelay(value);
                                        storedAnimationOptions.animationOptions.delay =
                                            value;
                                    }
                                "
                            />

                            <Label>Iteration Count</Label>
                            <Input
                                :class="!isFinite(animation.options.iterationCount) ? 'text-3xl' : ''"
                                type="string"
                                @change="
                                    (e) => {
                                        const value = (e.target as HTMLInputElement)
                                            .value;
                                        animation.updateIterationCount(value);
                                        storedAnimationOptions.animationOptions.iterationCount =
                                            value;
                                    }
                                "
                                :model-value="
                                    isFinite(animation.options.iterationCount)
                                        ? animation.options.iterationCount
                                        : '∞'
                                "
                            />

                            <Label>Direction</Label>
                            <Select
                                :model-value="animation.options.direction"
                                @update:model-value="
                                    (key: any) => {
                                        animation.updateDirection(key);
                                        storedAnimationOptions.animationOptions.direction =
                                            key;
                                    }
                                "
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="normal">normal</SelectItem>
                                        <SelectItem value="reverse">reverse</SelectItem>
                                        <SelectItem value="alternate"
                                            >alternate</SelectItem
                                        >
                                        <SelectItem value="alternate-reverse"
                                            >alternate-reverse</SelectItem
                                        >
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <Label>Fill Mode</Label>
                            <Select
                                :model-value="animation.options.fillMode"
                                @update:model-value="
                                    (key: any) => {
                                        animation.updateFillMode(key);
                                        storedAnimationOptions.animationOptions.fillMode =
                                            key;
                                    }
                                "
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="none">none</SelectItem>
                                        <SelectItem value="forwards"
                                            >forwards</SelectItem
                                        >
                                        <SelectItem value="backwards"
                                            >backwards</SelectItem
                                        >
                                        <SelectItem value="both">both</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <Label>Timing Function</Label>
                            <Select
                                :model-value="
                                    storedAnimationOptions.animationOptions
                                        .timingFunction as any
                                "
                                @update:model-value="
                                    (key: any) => {
                                        updateTimingFunctionFromName(key);
                                        storedAnimationOptions.animationOptions.timingFunction =
                                            key;
                                    }
                                "
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem
                                            v-for="timingFunction in Object.keys(
                                                timingFunctionsAnd,
                                            )"
                                            :value="timingFunction"
                                        >
                                            {{ timingFunction }}
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <template
                                v-if="
                                    storedAnimationOptions.animationOptions
                                        .timingFunction === 'steps'
                                "
                            >
                                <Separator
                                    class="col-span-2 w-full mt-4 mb-4"
                                ></Separator>
                                <Label>Steps</Label>
                                <Input
                                    type="number"
                                    :model-value="
                                        storedAnimationOptions.stepOptions.steps
                                    "
                                    @update:model-value="
                                        (key: any) => {
                                            storedAnimationOptions.stepOptions.steps =
                                                key;
                                            updateTimingFunctionFromName('steps');
                                        }
                                    "
                                />

                                <Label>Jump Term</Label>
                                <Select
                                    :model-value="
                                        storedAnimationOptions.stepOptions.jumpTerm
                                    "
                                    @update:model-value="
                                        (key: any) => {
                                            storedAnimationOptions.stepOptions.jumpTerm =
                                                key;
                                            updateTimingFunctionFromName('steps');
                                        }
                                    "
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem
                                                v-for="j in jumpTerms"
                                                :value="j"
                                            >
                                                {{ j }}
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </template>

                            <template
                                v-if="
                                    (storedAnimationOptions.animationOptions
                                        .timingFunction as any) === 'cubic-bezier'
                                "
                            >
                                <Separator class="col-span-2 w-full mt-4"></Separator>
                                <CubicBezierControls
                                    :animation="animation"
                                    @update-timing-function="setAnimationTimingFunction"
                                    class="col-span-2"
                                ></CubicBezierControls>
                            </template>

                            <div
                                :class="
                                    'col-span-2 grid grid-cols-1 gap-2 mt-2 mb-2 sticky bottom-0 bg-background p-2 rounded-md' +
                                    (!animation.started ? ' disabled' : '')
                                "
                            >
                                <Slider
                                    class="col-span-2 p-2"
                                    :min="0"
                                    :max="animation.options.duration"
                                    @input="sliderUpdate"
                                    :model-value="[animation.t]"
                                    @update:model-value="([t]) => (animation.t = t)"
                                />

                                <div :class="'grid grid-cols-5 gap-2 w-full'">
                                    <Button
                                        class="col-span-2 text-xl"
                                        @click="toggleAnimation"
                                    >
                                        <font-awesome-icon
                                            class="icon"
                                            :icon="
                                                animation.playing()
                                                    ? ['fas', 'pause']
                                                    : ['fas', 'play']
                                            "
                                        />
                                    </Button>
                                    <Button
                                        class="col-span-2 text-xl"
                                        @click="animation.reverse()"
                                    >
                                        <font-awesome-icon
                                            class="icon"
                                            :icon="['fas', 'rotate-right']"
                                        />
                                    </Button>
                                    <Button
                                        class="col-span-1 text-xl"
                                        @click="
                                            () => {
                                                Object.assign(
                                                    storedAnimationOptions,
                                                    defaultStoredAnimationOptions,
                                                );
                                            }
                                        "
                                        ><Trash></Trash>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="keyframes">
                    <KeyframesStringControls
                        :animation="animation"
                    ></KeyframesStringControls>
                </TabsContent>
                <slot name="tabs-content"></slot>
            </div>
        </Tabs>
    </div>
</template>

<script setup lang="ts">
import {
    Animation,
    InputAnimationOptions,
    TimingFunction,
    TimingFunctionNames,
} from "@src/animation";

import { timingFunctions, jumpTerms, CSSBezier } from "@src/easing";
import { reverseCSSTime, CSSAnimationKeyframes } from "@src/parsing/keyframes";

import { Icon } from "@iconify/vue";

import { Slider } from "@components/ui/slider";
import { Button } from "@components/ui/button";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
} from "@components/ui/menubar";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";

import { Separator } from "@components/ui/separator";

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
    CubicBezierControls,
    KeyframesStringControls,
} from "@components/custom/animation-controls";

import { camelCaseToHyphen } from "@src/utils";

import { DarkModeToggle } from "../dark-mode-toggle";
import { Key, Trash } from "lucide-vue-next";

import { useStorage } from "@vueuse/core";
import {
    StoredAnimationOptions,
    defaultAnimationOptions,
    defaultCubicBezierOptions,
    defaultStepOptions,
    defaultStoredAnimationOptions,
    getStoredAnimationOptions,
    getStoredAnimationGroupControlOptions,
} from "./animationStores";
import { onMounted } from "vue";
import Avatar from "@components/ui/avatar/Avatar.vue";
import AvatarImage from "@components/ui/avatar/AvatarImage.vue";
import HoverCard from "@components/ui/hover-card/HoverCard.vue";
import HoverCardTrigger from "@components/ui/hover-card/HoverCardTrigger.vue";
import HoverCardContent from "@components/ui/hover-card/HoverCardContent.vue";

let timingFunctionsAnd = {
    "cubic-bezier": "cubic-bezier",
    ...timingFunctions,
};
timingFunctionsAnd = Object.fromEntries(
    Object.entries(timingFunctionsAnd).map(([k, v]) => [camelCaseToHyphen(k), v]),
) as any;

const { animation, isGrouped } = defineProps({
    animation: {
        type: Animation,
        required: true,
    },
    isGrouped: {
        type: Boolean,
        required: false,
        default: false,
    },
});

const storedAnimationOptions = getStoredAnimationOptions(animation);
const storedControls = getStoredAnimationGroupControlOptions(animation);

const controlNames = {
    controls: "Controls 🔧",
    keyframes: "Keyframes 📜",
};

const emit = defineEmits<{
    (
        e: "sliderUpdate",
        val: {
            t: number;
            animation: Animation<any>;
        },
    ): void;
}>();

const sliderUpdate = (e: Event) => {
    const t = parseFloat((e.target as HTMLInputElement).value);

    if (!isGrouped) {
        const paused = animation.paused;
        animation.paused = false;
        animation.transformFrames(t);
        animation.paused = paused;
    } else {
        emit("sliderUpdate", {
            t,
            animation,
        });
    }
};

const setAnimationTimingFunction = (timingFunction: TimingFunction) => {
    animation.options.timingFunction = timingFunction;
    animation.frames.forEach((frame) => {
        frame.timingFunction = timingFunction;
    });
};

const updateTimingFunctionFromName = (key: TimingFunctionNames | "cubic-bezier") => {
    let timingFunction = timingFunctions[key] as TimingFunction;

    if (key === "steps") {
        const { steps, jumpTerm } = storedAnimationOptions.stepOptions;
        timingFunction = timingFunctions[key](steps, jumpTerm);
    } else if (key === "cubic-bezier") {
        timingFunction = CSSBezier(
            ...storedAnimationOptions.cubicBezierOptions.controlPoints,
        );
    }

    setAnimationTimingFunction(timingFunction);
};

let prevT = $ref(0);

const toggleAnimation = () => {
    if (!animation.started && !isGrouped) {
        animation.play();
    } else {
        animation.pause(!isGrouped);

        if (animation.paused) {
            prevT = animation.t;
        } else {
            animation.pausedTime += animation.t - prevT;
            prevT = 0;
        }
    }
};

onMounted(() => {
    updateTimingFunctionFromName(
        storedAnimationOptions.animationOptions.timingFunction as TimingFunctionNames,
    );
});
</script>

<style scoped lang="scss"></style>
