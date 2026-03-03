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
            <div ref="tabsHeaderEl" class="relative w-fit max-w-full mb-0 flex-shrink-0 flex items-stretch bg-gray-200 dark:bg-gray-700 rounded-t-lg">
                <!-- Bouncy sliding indicator -->
                <div
                    ref="sliderEl"
                    class="absolute bottom-0 z-0 rounded-t-lg bg-white dark:bg-gray-500/30 border-b-2 border-gray-300 dark:border-gray-400/30 pointer-events-none"
                    :style="sliderStyle"
                />

                <TabsList
                    class="relative z-10 flex items-stretch justify-start bg-transparent p-0 gap-0 flex-1 min-w-0 overflow-x-auto h-auto rounded-none scrollbar-hidden"
                >
                    <TabsTrigger
                        value="controls"
                        :class="fileTabClasses"
                    >Controls</TabsTrigger>
                    <TabsTrigger
                        value="keyframes"
                        :class="fileTabClasses"
                    >Keyframes</TabsTrigger>
                    <TabsTrigger
                        value="timeline"
                        :class="fileTabClasses"
                    >Timeline</TabsTrigger>
                    <slot name="tabs-trigger"></slot>
                </TabsList>
                <!-- Overflow indicator — click to scroll and reveal next tab -->
                <button
                    v-if="hasOverflow"
                    @click="scrollToNextTab"
                    class="shrink-0 z-20 inline-flex items-center pl-8 pr-2 -ml-10 rounded-tr-lg text-gray-400 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white text-sm fraunces select-none cursor-pointer transition-colors"
                >&hellip;</button>
            </div>

            <div ref="tabsContentEl" class="flex-1 min-h-0 overflow-y-auto flex flex-col pb-5 pr-3">
                <TabsContent value="controls">
                    <AnimationControlsControls
                        :animation="animation"
                        :is-grouped="isGrouped"
                        :layer-config="layerConfig"
                        :active="active"
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
                    <div
                        v-if="isTimelineVisible"
                        :key="storedControls.selectedControl"
                        class="animate-in fade-in slide-in-from-right-2 duration-150"
                    >
                        <KeyframeTimeline
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

const { animation, isGrouped, layerConfig, active } = defineProps<{
    animation: Animation<any>;
    isGrouped?: boolean;
    layerConfig?: AnimationLayerConfig;
    active?: boolean;
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

const fileTabClasses = [
    "shrink-0 rounded-none rounded-t-lg bg-transparent fraunces",
    "border border-transparent border-b-0",
    "text-gray-500 dark:text-gray-300",
    "transition-colors duration-150",
    // Inactive
    "data-[state=inactive]:border-gray-400/40",
    "data-[state=inactive]:hover:border-gray-500/60",
    "data-[state=inactive]:hover:text-gray-700",
    "dark:data-[state=inactive]:border-gray-400/20",
    "dark:data-[state=inactive]:hover:border-gray-400/40",
    "dark:data-[state=inactive]:hover:text-gray-100",
    // Active
    "data-[state=active]:text-gray-900 data-[state=active]:font-semibold data-[state=active]:shadow-none",
    "data-[state=active]:hover:text-gray-900",
    "dark:data-[state=active]:text-white",
    "dark:data-[state=active]:hover:text-white",
].join(" ");

// --- Bouncy sliding indicator ---
const sliderStyle = reactive({
    width: "0px",
    height: "0px",
    transform: "translateX(0px)",
    transition: "none",
});

const updateSlider = (animate = true) => {
    const doUpdate = () => {
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
            ? "width 0.25s ease-out, transform 0.25s ease-out, height 0.2s ease"
            : "none";
        sliderStyle.width = `${w}px`;
        sliderStyle.height = `${h}px`;
        sliderStyle.transform = `translateX(${x}px)`;
    };

    // Animated updates need nextTick (DOM state change pending).
    // Non-animated (scroll) updates run synchronously for tight tracking.
    if (animate) {
        nextTick(doUpdate);
    } else {
        doUpdate();
    }
};

// --- Overflow detection + scroll ---
const hasOverflow = ref(false);

const getTabsList = () => tabsHeaderEl.value?.querySelector<HTMLElement>("[role=tablist]");

const checkOverflow = () => {
    const list = getTabsList();
    if (!list) return;
    // True when there's more content to the right
    hasOverflow.value = list.scrollLeft + list.clientWidth < list.scrollWidth - 2;
};

const scrollToNextTab = () => {
    const list = getTabsList();
    if (!list) return;
    const buttons = list.querySelectorAll<HTMLElement>("button");
    const listRect = list.getBoundingClientRect();

    // Find first button whose right edge is past the visible area and select it
    for (const btn of buttons) {
        const btnRect = btn.getBoundingClientRect();
        if (btnRect.right > listRect.right + 2) {
            // Extract tab value from reka-ui id: "reka-tabs-…-trigger-{value}"
            const id = btn.id ?? "";
            const triggerIdx = id.indexOf("-trigger-");
            const value = triggerIdx >= 0 ? id.slice(triggerIdx + 9) : null;
            if (value) {
                // Set directly without animated slider bounce
                storedControls.selectedControl = value;
                updateSlider(false);
                nextTick(() => {
                    checkOverflow();
                    scrollActiveTabIntoView();
                });
            }
            break;
        }
    }
};

const scrollActiveTabIntoView = () => {
    const header = tabsHeaderEl.value;
    if (!header) return;
    const activeBtn = header.querySelector<HTMLElement>("button[data-state=active]");
    activeBtn?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
};

const onTabsScroll = () => {
    checkOverflow();
    updateSlider(false);
};

let resizeObserver: ResizeObserver | undefined;
let tabsListEl: HTMLElement | undefined;

onMounted(() => {
    updateSlider(false);
    checkOverflow();
    scrollActiveTabIntoView();

    const header = tabsHeaderEl.value;
    if (header) {
        resizeObserver = new ResizeObserver(() => {
            updateSlider(false);
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
    updateSlider(true);
    nextTick(() => {
        checkOverflow();
        scrollActiveTabIntoView();
    });
};

// Re-measure when slot content changes (e.g., Matrix Controls tab appearing)
watch(
    () => storedControls.selectedControl,
    () => {
        updateSlider(true);
        nextTick(() => {
            checkOverflow();
            scrollActiveTabIntoView();
        });
    },
);

defineExpose({
    keyframesControlsRef,
});
</script>

