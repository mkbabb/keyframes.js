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
            <div class="flex items-center gap-2 mb-1">
                <!-- Copy & Format actions -->
                <div class="flex items-center gap-1">
                    <IconTooltip text="Copy CSS">
                        <CopyButton
                            class="w-4 h-4 hover:scale-105 cursor-pointer"
                            :text="keyframesControlsRef?.getCSSString?.() ?? ''"
                        />
                    </IconTooltip>
                    <IconTooltip text="Format CSS">
                        <WandSparkles
                            class="w-4 h-4 cursor-pointer hover:scale-105 hover:opacity-50 text-muted-foreground hover:text-foreground"
                            @click="keyframesControlsRef?.formatCSS?.()"
                        />
                    </IconTooltip>
                </div>

                <TabsList
                    class="overflow-x-scroll w-full flex items-center justify-around fraunces bg-background border-4 border-gray-700 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] dark:shadow-gray-700 rounded-xl scrollbar-hidden pr-10 lg:pr-0"
                >
                    <TabsTrigger value="controls">Controls</TabsTrigger>
                    <TabsTrigger value="keyframes">Keyframes</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    <slot name="tabs-trigger"></slot>
                </TabsList>
            </div>

            <div ref="tabsContentEl" class="flex-1 min-h-0 overflow-y-auto flex flex-col pr-3 pb-3">
                <TabsContent value="controls">
                    <AnimationControlsControls
                        :animation="animation"
                        :is-grouped="isGrouped"
                        :layer-config="layerConfig"
                        @slider-update="
                            (v) => {
                                emit('sliderUpdate', v);
                            }
                        "
                        @toggle-play="emit('togglePlay')"
                        @layer-config-update="(v) => emit('layerConfigUpdate', v)"
                    ></AnimationControlsControls>
                </TabsContent>

                <TabsContent value="keyframes" class="flex-1 min-h-0 flex flex-col">
                    <KeyframesStringControls
                        ref="keyframesControlsRef"
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
import type { AnimationLayerConfig } from "@src/animation/constants";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { TooltipProvider } from "@components/ui/tooltip";

import { defineAsyncComponent, ref, useTemplateRef } from "vue";

import { WandSparkles } from "lucide-vue-next";
import CopyButton from "@components/custom/CopyButton.vue";
import IconTooltip from "@components/custom/IconTooltip.vue";

const KeyframesStringControls = defineAsyncComponent(() => import("./KeyframesStringControls.vue"));
const KeyframeTimeline = defineAsyncComponent(() => import("./KeyframeTimeline.vue"));
import AnimationControlsControls from "./AnimationControlsControls.vue";
import { getStoredAnimationGroupControlOptions } from "./animationStores";

const { animation, isGrouped, layerConfig } = defineProps<{
    animation: Animation<any>;
    isGrouped?: boolean;
    layerConfig?: AnimationLayerConfig;
}>();

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
    (e: "layerConfigUpdate", val: Partial<AnimationLayerConfig>): void;
}>();

const keyframesControlsRef = ref<InstanceType<typeof KeyframesStringControls> | null>(null);
const tabsContentEl = useTemplateRef<HTMLElement>("tabsContentEl");

const selectControl = (key: string | number) => {
    storedControls.selectedControl = key.toString();
};
</script>

<style scoped></style>
