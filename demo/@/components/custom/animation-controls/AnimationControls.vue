<template>
    <TooltipProvider :delay-duration="100" :skip-delay-duration="0">
    <div
        class="flex flex-col h-full w-full z-10 relative lg:max-w-screen-md isolate"
    >
        <Tabs
            class="p-4 pt-12 lg:pt-2 w-full flex-1 min-h-0 flex flex-col justify-start"
            :model-value="storedControls.selectedControl"
            @update:model-value="selectControl"
        >
            <TabsList
                class="overflow-x-scroll w-full flex items-center justify-around fraunces bg-background border-4 border-gray-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] dark:shadow-gray-700 rounded-xl scrollbar-hidden mb-1"
            >
                <TabsTrigger value="controls">Controls</TabsTrigger>
                <TabsTrigger value="keyframes">Keyframes</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <slot name="tabs-trigger"></slot>
            </TabsList>

            <div ref="tabsContentEl" class="flex-1 min-h-0 overflow-y-auto flex flex-col pb-5 pr-3">
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

                <TabsContent value="keyframes">
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
                    <!-- Placeholder shown in the tab when timeline is expanded to bottom bar -->
                    <div
                        v-if="storedControls.isTimelineExpanded"
                        class="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground"
                    >
                        <ChevronDown class="w-6 h-6 animate-bounce" />
                        <p class="fira-code text-sm">Timeline expanded below</p>
                        <Button
                            size="sm"
                            variant="ghost"
                            class="gap-1.5 cursor-pointer fira-code text-xs"
                            @click="storedControls.isTimelineExpanded = false"
                        >
                            <Minimize2 class="w-3.5 h-3.5" />
                            Collapse
                        </Button>
                    </div>
                </TabsContent>

                <slot name="tabs-content"></slot>

                <!-- Timeline: outside TabsContent but inside scrollable area so Teleport lifecycle
                     isn't tied to TabsContent mount/unmount (which breaks moveTeleport).
                     When collapsed, renders in-place here. When expanded, teleports to bottom bar. -->
                <Teleport to="#timeline-expanded-target" :disabled="!storedControls.isTimelineExpanded" defer>
                    <KeyframeTimeline
                        v-if="isTimelineVisible"
                        :targets="animation.targets"
                        :animation-options="animation.options"
                        :expanded="storedControls.isTimelineExpanded"
                        @toggle-expand="storedControls.isTimelineExpanded = !storedControls.isTimelineExpanded"
                    />
                </Teleport>
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

import { computed, defineAsyncComponent, ref, Teleport, useTemplateRef } from "vue";
import { ChevronDown, Minimize2 } from "lucide-vue-next";
import { Button } from "@components/ui/button";

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

const isTimelineVisible = computed(() =>
    storedControls.selectedControl === "timeline" || storedControls.isTimelineExpanded,
);

const selectControl = (key: string | number) => {
    storedControls.selectedControl = key.toString();
};
</script>

<style scoped></style>
