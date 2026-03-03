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
            <!-- Filing tabs header -->
            <div ref="tabsHeaderEl" class="relative mr-3 mb-0 flex-shrink-0 flex items-stretch bg-card rounded-t-lg">
                <!-- Bouncy sliding indicator -->
                <div
                    ref="sliderEl"
                    class="absolute bottom-0 z-20 rounded-t-lg bg-accent/10 border-b-2 border-accent pointer-events-none"
                    :style="sliderStyle"
                />

                <TabsList
                    class="relative z-10 flex items-stretch justify-start bg-transparent p-0 gap-0 flex-1 min-w-0 overflow-clip h-auto rounded-none"
                >
                    <TabsTrigger
                        value="controls"
                        class="shrink-0 rounded-none rounded-t-lg bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground fraunces"
                    >Controls</TabsTrigger>
                    <TabsTrigger
                        value="keyframes"
                        class="shrink-0 rounded-none rounded-t-lg bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground fraunces"
                    >Keyframes</TabsTrigger>
                    <TabsTrigger
                        value="timeline"
                        class="shrink-0 rounded-none rounded-t-lg bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground fraunces"
                    >Timeline</TabsTrigger>
                    <slot name="tabs-trigger"></slot>
                </TabsList>
                <!-- Overflow indicator (overlaps to cover partial text) -->
                <span
                    v-if="hasOverflow"
                    class="shrink-0 z-20 inline-flex items-center pl-6 pr-1 -ml-8 bg-card text-muted-foreground text-sm fraunces select-none"
                >&hellip;</span>
            </div>

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

import {
    computed,
    defineAsyncComponent,
    nextTick,
    onMounted,
    onUnmounted,
    reactive,
    ref,
    Teleport,
    useTemplateRef,
    watch,
} from "vue";
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
const tabsHeaderEl = useTemplateRef<HTMLElement>("tabsHeaderEl");
const sliderEl = useTemplateRef<HTMLElement>("sliderEl");

const isTimelineVisible = computed(() =>
    storedControls.selectedControl === "timeline" || storedControls.isTimelineExpanded,
);

// --- Bouncy sliding indicator ---
const sliderStyle = reactive({
    width: "0px",
    height: "0px",
    transform: "translateX(0px)",
    transition: "none",
});

const updateSlider = (animate = true) => {
    nextTick(() => {
        const header = tabsHeaderEl.value;
        if (!header) return;

        const list = header.querySelector<HTMLElement>("[role=tablist]");
        const activeBtn = header.querySelector<HTMLElement>("button[data-state=active]");
        if (!activeBtn || !list) return;

        // Position slider relative to header
        const headerRect = header.getBoundingClientRect();
        const btnRect = activeBtn.getBoundingClientRect();

        const x = btnRect.left - headerRect.left;
        const w = btnRect.width;
        const h = btnRect.height;

        sliderStyle.transition = animate
            ? "width 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), height 0.2s ease"
            : "none";
        sliderStyle.width = `${w}px`;
        sliderStyle.height = `${h}px`;
        sliderStyle.transform = `translateX(${x}px)`;
    });
};

// --- Overflow detection ---
const hasOverflow = ref(false);

const checkOverflow = () => {
    const header = tabsHeaderEl.value;
    if (!header) return;
    const list = header.querySelector<HTMLElement>("[role=tablist]");
    if (!list) return;
    hasOverflow.value = list.scrollWidth > list.clientWidth + 2;
};

let resizeObserver: ResizeObserver | undefined;

onMounted(() => {
    updateSlider(false);
    checkOverflow();

    const header = tabsHeaderEl.value;
    if (header) {
        resizeObserver = new ResizeObserver(() => {
            updateSlider(false);
            checkOverflow();
        });
        resizeObserver.observe(header);
    }
});

onUnmounted(() => {
    resizeObserver?.disconnect();
});

const selectControl = (key: string | number) => {
    storedControls.selectedControl = key.toString();
    updateSlider(true);
    nextTick(checkOverflow);
};

// Re-measure when slot content changes (e.g., Matrix Controls tab appearing)
watch(
    () => storedControls.selectedControl,
    () => {
        updateSlider(true);
        nextTick(checkOverflow);
    },
);
</script>

<style scoped></style>
