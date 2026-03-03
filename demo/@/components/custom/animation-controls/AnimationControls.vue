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
            <div ref="tabsHeaderEl" class="relative w-fit max-w-full mb-0 flex-shrink-0 flex items-stretch bg-gray-100/90 dark:bg-gray-700/85 backdrop-blur-sm rounded-t-lg">
                <!-- Bouncy sliding indicator -->
                <div
                    ref="sliderEl"
                    class="absolute bottom-0 z-20 rounded-t-lg bg-gray-900/10 dark:bg-white/10 border-b-2 border-gray-900/30 dark:border-white/40 pointer-events-none"
                    :style="sliderStyle"
                />

                <TabsList
                    class="relative z-10 flex items-stretch justify-start bg-transparent p-0 gap-0 flex-1 min-w-0 overflow-x-auto h-auto rounded-none tabs-list-scrollable"
                >
                    <TabsTrigger
                        value="controls"
                        class="file-tab"
                    >Controls</TabsTrigger>
                    <TabsTrigger
                        value="keyframes"
                        class="file-tab"
                    >Keyframes</TabsTrigger>
                    <TabsTrigger
                        value="timeline"
                        class="file-tab"
                    >Timeline</TabsTrigger>
                    <slot name="tabs-trigger"></slot>
                </TabsList>
                <!-- Overflow indicator — click to scroll and reveal next tab -->
                <button
                    v-if="hasOverflow"
                    @click="scrollToNextTab"
                    class="shrink-0 z-20 inline-flex items-center pl-8 pr-2 -ml-10 rounded-tr-lg bg-gray-100 dark:bg-gray-700 text-gray-400 hover:text-gray-700 dark:text-white/50 dark:hover:text-white/80 text-sm fraunces select-none cursor-pointer transition-colors"
                >&hellip;</button>
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
            ? "width 0.25s ease-out, transform 0.25s ease-out, height 0.2s ease"
            : "none";
        sliderStyle.width = `${w}px`;
        sliderStyle.height = `${h}px`;
        sliderStyle.transform = `translateX(${x}px)`;
    });
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
            if (value) selectControl(value);
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
</script>

<style scoped>
.tabs-list-scrollable {
    scrollbar-width: none;
}
.tabs-list-scrollable::-webkit-scrollbar {
    display: none;
}

/* File-tab styling: inactive tabs get a subtle outline, active tab is solid */
:deep(.file-tab) {
    flex-shrink: 0;
    border-radius: 0;
    border-top-left-radius: var(--radius);
    border-top-right-radius: var(--radius);
    background: transparent;
    font-family: "Fraunces", serif;
    border: 1px solid transparent;
    border-bottom: none;
    color: rgb(107 114 128); /* gray-500 */
    transition: color 0.15s ease, border-color 0.15s ease, background 0.15s ease;
}
:deep(.file-tab[data-state="inactive"]) {
    border-color: rgb(107 114 128 / 0.3);
}
:deep(.file-tab[data-state="inactive"]:hover) {
    border-color: rgb(107 114 128 / 0.5);
    color: rgb(55 65 81); /* gray-700 */
}
:deep(.file-tab[data-state="active"]) {
    color: rgb(17 24 39); /* gray-900 */
    box-shadow: none;
}

:global(.dark) :deep(.file-tab) {
    color: rgb(255 255 255 / 0.6);
}
:global(.dark) :deep(.file-tab[data-state="inactive"]) {
    border-color: rgb(255 255 255 / 0.15);
}
:global(.dark) :deep(.file-tab[data-state="inactive"]:hover) {
    border-color: rgb(255 255 255 / 0.3);
    color: rgb(255 255 255 / 0.8);
}
:global(.dark) :deep(.file-tab[data-state="active"]) {
    color: white;
}
</style>
