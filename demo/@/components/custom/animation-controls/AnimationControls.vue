<template>
    <DarkModeToggle class="dark-mode-toggle" />

    <Tabs
        :model-value="storedControls.selectedControl"
        @update:model-value="
            (key) => {
                storedControls.selectedControl = key.toString();
            }
        "
    >
        <TabsList class="grid w-full grid-cols-2">
            <TabsTrigger value="controls">Controls</TabsTrigger>
            <TabsTrigger value="keyframes">Keyframes</TabsTrigger>
        </TabsList>

        <TabsContent value="controls" class="h-[75vh] overflow-scroll">
            <Card>
                <CardContent class="pt-4 grid grid-cols-2 gap-1 relative">
                    <Label>Duration</Label>
                    <Input
                        type="string"
                        :model-value="reverseCSSTime(animation.options.duration)"
                        @change="
                            (e) => {
                                const value = (e.target as HTMLInputElement).value;
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
                                const value = (e.target as HTMLInputElement).value;
                                animation.updateDelay(value);
                                storedAnimationOptions.animationOptions.delay = value;
                            }
                        "
                    />

                    <Label>Iteration Count</Label>
                    <Input
                        type="string"
                        @change="
                            (e) => {
                                const value = (e.target as HTMLInputElement).value;
                                animation.updateIterationCount(value);
                                storedAnimationOptions.animationOptions.iterationCount =
                                    value;
                            }
                        "
                        :model-value="
                            isFinite(animation.options.iterationCount)
                                ? animation.options.iterationCount
                                : 'infinite'
                        "
                    />

                    <Label>Direction</Label>
                    <Select
                        :model-value="animation.options.direction"
                        @update:model-value="
                            (key: any) => {
                                animation.updateDirection(key);
                                storedAnimationOptions.animationOptions.direction = key;
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
                                <SelectItem value="alternate">alternate</SelectItem>
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
                                storedAnimationOptions.animationOptions.fillMode = key;
                            }
                        "
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="none">none</SelectItem>
                                <SelectItem value="forwards">forwards</SelectItem>
                                <SelectItem value="backwards">backwards</SelectItem>
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
                            storedAnimationOptions.animationOptions.timingFunction ===
                            'steps'
                        "
                    >
                        <Label>Steps</Label>
                        <Input
                            type="number"
                            :model-value="storedAnimationOptions.stepOptions.steps"
                            @update:model-value="
                                (key: any) => {
                                    storedAnimationOptions.stepOptions.steps = key;
                                    updateTimingFunctionFromName('steps');
                                }
                            "
                        />

                        <Label>Jump Term</Label>
                        <Select
                            :model-value="storedAnimationOptions.stepOptions.jumpTerm"
                            @update:model-value="
                                (key: any) => {
                                    storedAnimationOptions.stepOptions.jumpTerm = key;
                                    updateTimingFunctionFromName('steps');
                                }
                            "
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem v-for="j in jumpTerms" :value="j">
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
                        <CubicBezierControls
                            :animation="animation"
                            @update-timing-function="setAnimationTimingFunction"
                            class="col-span-2"
                        ></CubicBezierControls>
                    </template>

                    <div class="col-span-2 grid grid-cols-2 gap-2 sticky bottom-0">
                        <Slider
                            class="col-span-2 p-2"
                            :min="0"
                            :max="animation.options.duration"
                            @input="sliderUpdate"
                            :model-value="[animation.t]"
                            @update:model-value="([t]) => (animation.t = t)"
                        />

                        <Button class="text-xl" @click="toggleAnimation">
                            <font-awesome-icon
                                class="icon"
                                :icon="
                                    animation.playing()
                                        ? ['fas', 'pause']
                                        : ['fas', 'play']
                                "
                            />
                        </Button>

                        <Button class="text-xl" @click="animation.reverse()">
                            <font-awesome-icon
                                class="icon"
                                :icon="['fas', 'rotate-right']"
                            />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="keyframes" class="h-[75vh] overflow-scroll">
            <KeyframesStringControls :animation="animation"></KeyframesStringControls>
        </TabsContent>
    </Tabs>
</template>

<script setup lang="ts">
import {
    Animation,
    InputAnimationOptions,
    TimingFunction,
    TimingFunctionNames,
} from "@src/animation";

import { timingFunctions, jumpTerms } from "@src/easing";
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
import { Key } from "lucide-vue-next";

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

const emit = defineEmits<{
    (
        e: "sliderUpdate",
        val: {
            t: number;
            animationId: number;
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
            animationId: animation.id,
        });
    }
};

const setAnimationTimingFunction = (timingFunction: TimingFunction) => {
    animation.options.timingFunction = timingFunction;
    animation.frames.forEach((frame) => {
        frame.timingFunction = timingFunction;
    });
};

const updateTimingFunctionFromName = (key: TimingFunctionNames) => {
    let timingFunction = timingFunctions[key] as TimingFunction;

    if (key === "steps") {
        const { steps, jumpTerm } = storedAnimationOptions.stepOptions;
        timingFunction = timingFunctions[key](steps, jumpTerm);
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

<style scoped lang="scss">
.dark-mode-toggle {
    // put it in the top right corner
    position: absolute;
    top: 0;
    right: 0;
    margin: 1rem;
}
</style>
