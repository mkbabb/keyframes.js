<template>
    <TooltipProvider :delay-duration="100" :skip-delay-duration="0">
    <div
        class="flex flex-col h-full w-full z-10 relative overflow-x-hidden lg:overflow-hidden lg:max-w-screen-md lg:w-[400px]"
    >
        <Tabs
            class="p-4 pt-12 lg:pt-4 w-full flex-1 min-h-0 flex flex-col justify-start"
            :model-value="storedControls.selectedControl"
            @update:model-value="selectControl"
        >
            <span class="grid">
                <TabsList
                    class="overflow-x-scroll w-full flex items-center justify-around fraunces bg-transparent scrollbar-hidden pr-10 lg:pr-0"
                >
                    <TabsTrigger value="controls">Controls</TabsTrigger>
                    <TabsTrigger value="keyframes">Keyframes</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    <slot name="tabs-trigger"></slot>
                </TabsList>
            </span>

            <div ref="tabsContentEl" class="flex-1 min-h-0 overflow-y-auto flex flex-col pr-3 pb-3">
                <TabsContent value="controls">
                    <AnimationControlsControls
                        :animation="animation"
                        :is-grouped="isGrouped"
                        @slider-update="
                            (v) => {
                                emit('sliderUpdate', v);
                            }
                        "
                        @toggle-play="emit('togglePlay')"
                    ></AnimationControlsControls>
                </TabsContent>

                <TabsContent value="keyframes" class="flex-1 min-h-0 flex flex-col">
                    <KeyframesStringControls
                        @keyframes-update="
                            (v) => {
                                emit('keyframesUpdate', v);
                            }
                        "
                        :animation="animation"
                    ></KeyframesStringControls>
                </TabsContent>

                <TabsContent value="timeline">
                    <KeyframeTimeline
                        :targets="animation.targets"
                        :animation-options="animation.options"
                    />
                </TabsContent>

                <slot name="tabs-content"></slot>
            </div>
        </Tabs>
    </div>
    </TooltipProvider>
</template>

<script setup lang="ts">
import { Animation } from "@src/animation/index";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { TooltipProvider } from "@components/ui/tooltip";

import { defineAsyncComponent, onMounted, useTemplateRef } from "vue";

const KeyframesStringControls = defineAsyncComponent(() => import("./KeyframesStringControls.vue"));
const KeyframeTimeline = defineAsyncComponent(() => import("./KeyframeTimeline.vue"));
import AnimationControlsControls from "./AnimationControlsControls.vue";
import { getStoredAnimationGroupControlOptions } from "./animationStores";

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

const storedControls = getStoredAnimationGroupControlOptions(animation);

const emit = defineEmits<{
    (
        e: "sliderUpdate",
        val: {
            t: number;
            animation: Animation<any>;
        },
    ): void;
    (
        e: "keyframesUpdate",
        val: {
            animation: Animation<any>;
        },
    ): void;
    (e: "togglePlay"): void;
}>();

const tabsContentEl = useTemplateRef<HTMLElement>("tabsContentEl");

const selectControl = (key: string | number) => {
    storedControls.selectedControl = key.toString();
};

onMounted(() => {});
</script>

<style scoped></style>
