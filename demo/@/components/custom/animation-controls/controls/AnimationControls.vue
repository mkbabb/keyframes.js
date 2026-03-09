<template>
    <TooltipProvider :delay-duration="100" :skip-delay-duration="0">
    <div
        class="flex flex-col h-full w-full overflow-hidden z-10 relative lg:max-w-screen-md isolate"
    >
        <Tabs
            class="p-4 pt-2 pb-2 w-full flex-1 min-h-0 flex flex-col justify-start"
            :model-value="storedControls.selectedControl"
            @update:model-value="selectControl"
        >
            <!-- Tabs header -->
            <div ref="tabsHeaderEl" class="relative w-full flex items-center flex-shrink-0 bg-muted/50 rounded-lg px-1 py-0.5">
                <TabsList
                    ref="tabsListRef"
                    :class="[
                        'relative flex items-center justify-start bg-transparent p-0 gap-0 flex-1 min-w-0 overflow-x-auto h-auto rounded-none scrollbar-hidden',
                        overflowClass,
                    ]"
                >
                    <TabsTrigger value="controls" :class="tabClasses">Controls</TabsTrigger>
                    <TabsTrigger value="keyframes" :class="tabClasses">Keyframes</TabsTrigger>
                    <TabsTrigger value="timeline" :class="tabClasses">Timeline</TabsTrigger>
                    <slot name="tabs-trigger"></slot>
                </TabsList>
                <button
                    v-if="showMinimize"
                    @click="emit('minimize')"
                    class="hidden lg:flex shrink-0 ml-1 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer transition-colors"
                    title="Minimize controls"
                >
                    <Minus class="w-3.5 h-3.5" />
                </button>
            </div>

            <div ref="tabsContentEl" class="flex-1 min-h-0 overflow-y-auto flex flex-col pb-1 pr-3">
                <TabsContent value="controls">
                    <AnimationControlsControls
                        :animation="animation"
                        :is-grouped="isGrouped"
                        :layer-config="layerConfig"
                        :active="active"
                        @slider-update="(v) => emit('sliderUpdate', v)"
                        @toggle-play="emit('togglePlay')"
                        @layer-config-update="(v) => emit('layerConfigUpdate', v)"
                        @scrub-start="emit('scrubStart')"
                        @scrub-end="emit('scrubEnd')"
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
                    <div
                        v-if="isTimelineVisible"
                        :key="storedControls.selectedControl"
                        class="animate-in fade-in slide-in-from-right-2 duration-150"
                    >
                        <KeyframeTimeline
                            ref="timelineRef"
                            :targets="animation.targets"
                            :animation-options="animation.options"
                            :expanded="storedControls.isTimelineExpanded"
                            @toggle-expand="storedControls.isTimelineExpanded = !storedControls.isTimelineExpanded"
                        />
                    </div>
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
    ref,
    Teleport,
    useTemplateRef,
    watch,
} from "vue";
import { ChevronDown, Minus, Minimize2 } from "lucide-vue-next";
import { Button } from "@components/ui/button";

const KeyframesStringControls = defineAsyncComponent(() => import("../keyframes/KeyframesStringControls.vue"));
const KeyframeTimeline = defineAsyncComponent(() => import("../timeline/KeyframeTimeline.vue"));
import AnimationControlsControls from "./AnimationControlsControls.vue";
import { getStoredAnimationGroupControlOptions } from "../animationStores";

const { animation, isGrouped, layerConfig, active, showMinimize } = defineProps<{
    animation: Animation<any>;
    isGrouped?: boolean;
    layerConfig?: AnimationLayerConfig;
    active?: boolean;
    showMinimize?: boolean;
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
    (e: "scrubStart"): void;
    (e: "scrubEnd"): void;
    (e: "minimize"): void;
}>();

const keyframesControlsRef = ref<InstanceType<typeof KeyframesStringControls> | null>(null);
const timelineRef = ref<InstanceType<typeof KeyframeTimeline> | null>(null);
const tabsContentEl = useTemplateRef<HTMLElement>("tabsContentEl");
const tabsHeaderEl = useTemplateRef<HTMLElement>("tabsHeaderEl");
const tabsListRef = useTemplateRef<HTMLElement>("tabsListRef");

const isTimelineVisible = computed(() =>
    storedControls.selectedControl === "timeline" || storedControls.isTimelineExpanded,
);

const tabClasses = [
    "shrink-0 instrument-serif px-3 py-1.5 text-lg bg-transparent rounded-none",
    "transition-colors duration-150",
    "data-[state=inactive]:text-muted-foreground",
    "data-[state=inactive]:hover:text-foreground",
    "data-[state=active]:text-foreground data-[state=active]:font-semibold",
    "border-b-2 border-transparent",
    "data-[state=active]:border-foreground",
].join(" ");

// --- Overflow detection (left + right) ---
const overflowLeft = ref(false);
const overflowRight = ref(false);

const overflowClass = computed(() => {
    if (overflowLeft.value && overflowRight.value) return "tabs-overflow-both";
    if (overflowLeft.value) return "tabs-overflow-left";
    if (overflowRight.value) return "tabs-overflow-right";
    return "";
});

const getTabsList = () => tabsHeaderEl.value?.querySelector<HTMLElement>("[role=tablist]");

const checkOverflow = () => {
    const list = getTabsList();
    if (!list) return;
    overflowLeft.value = list.scrollLeft > 2;
    overflowRight.value = list.scrollLeft + list.clientWidth < list.scrollWidth - 2;
};

const scrollActiveTabIntoView = () => {
    const header = tabsHeaderEl.value;
    if (!header) return;
    const activeBtn = header.querySelector<HTMLElement>("button[data-state=active]");
    activeBtn?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
};

const onTabsScroll = () => {
    checkOverflow();
};

let resizeObserver: ResizeObserver | undefined;
let tabsListEl: HTMLElement | undefined;

onMounted(() => {
    checkOverflow();
    scrollActiveTabIntoView();

    const header = tabsHeaderEl.value;
    if (header) {
        resizeObserver = new ResizeObserver(() => {
            checkOverflow();
        });
        resizeObserver.observe(header);
    }

    tabsListEl = getTabsList() ?? undefined;
    tabsListEl?.addEventListener("scroll", onTabsScroll);
});

onUnmounted(() => {
    resizeObserver?.disconnect();
    tabsListEl?.removeEventListener("scroll", onTabsScroll);
});

const selectControl = (key: string | number) => {
    storedControls.selectedControl = key.toString();
    nextTick(() => {
        checkOverflow();
        scrollActiveTabIntoView();
    });
};

// Re-measure when slot content changes (e.g., Matrix Controls tab appearing)
watch(
    () => storedControls.selectedControl,
    () => {
        nextTick(() => {
            checkOverflow();
            scrollActiveTabIntoView();
        });
    },
);

defineExpose({
    keyframesControlsRef,
    timelineRef,
    selectControl,
    tabClasses,
});
</script>

<style scoped>
.tabs-overflow-right {
    mask-image: linear-gradient(to right, black calc(100% - 2.5rem), transparent);
    -webkit-mask-image: linear-gradient(to right, black calc(100% - 2.5rem), transparent);
}
.tabs-overflow-left {
    mask-image: linear-gradient(to right, transparent, black 2.5rem);
    -webkit-mask-image: linear-gradient(to right, transparent, black 2.5rem);
}
.tabs-overflow-both {
    mask-image: linear-gradient(to right, transparent, black 2.5rem, black calc(100% - 2.5rem), transparent);
    -webkit-mask-image: linear-gradient(to right, transparent, black 2.5rem, black calc(100% - 2.5rem), transparent);
}
</style>

