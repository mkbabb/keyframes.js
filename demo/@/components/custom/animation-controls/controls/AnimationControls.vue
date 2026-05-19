<template>
    <TooltipProvider :delay-duration="100" :skip-delay-duration="0">
    <div
        class="flex flex-col h-full w-full overflow-hidden z-content relative lg:max-w-screen-md isolate"
    >
        <Tabs
            class="pl-4 pr-7 pt-2 pb-2 w-full flex-1 min-h-0 flex flex-col justify-start"
            :model-value="storedControls.selectedControl"
            @update:model-value="selectControl"
        >
            <!-- Tabs header (hidden when managed externally via TopDock) -->
            <div v-if="!tabsExternallyManaged" ref="tabsHeaderEl" class="relative w-fit flex items-center justify-center flex-shrink-0 glass-wash rounded-panel px-1 py-0.5 overflow-hidden">
                <TabsList
                    ref="tabsListRef"
                    :class="[
                        'relative flex items-center justify-center bg-transparent p-0 gap-0 w-fit max-w-full min-w-0 overflow-x-auto h-auto rounded-none scrollbar-hidden',
                        overflowClass,
                    ]"
                >
                    <TabsTrigger value="controls" :class="tabClasses">Controls</TabsTrigger>
                    <TabsTrigger value="keyframes" :class="tabClasses">Keyframes</TabsTrigger>
                    <TabsTrigger value="timeline" :class="tabClasses">Timeline</TabsTrigger>
                    <slot name="tabs-trigger"></slot>
                </TabsList>
            </div>

            <div ref="tabsContentEl" class="flex-1 min-h-0 overflow-y-auto flex flex-col pb-1">
                <TabsContent value="controls">
                    <AnimationControlsControls
                        :animation="animation"
                        :is-grouped="isGrouped"
                        :is-playing="isPlayingProp"
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
                        <p class="font-mono text-sm">Timeline expanded below</p>
                        <Button
                            size="sm"
                            variant="ghost"
                            class="gap-1.5 font-mono text-xs"
                            @click="storedControls.isTimelineExpanded = false"
                        >
                            <Minimize2 class="icon-sm" />
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
                        class="animate-in fade-in slide-in-from-right-2 duration-fast"
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

import { Tabs, TabsContent, TabsList, TabsTrigger, TooltipProvider, Button } from "@mkbabb/glass-ui";

import {
    computed,
    defineAsyncComponent,
    inject,
    nextTick,
    onMounted,
    ref,
    Teleport,
    useTemplateRef,
    watch,
} from "vue";
import { TABS_EXTERNALLY_MANAGED_KEY } from "../injectionKeys";
import { ChevronDown, Minimize2 } from "lucide-vue-next";
import { useScrollFade } from "../composables/useScrollFade";

const KeyframesStringControls = defineAsyncComponent(() => import("../keyframes/KeyframesStringControls.vue"));
const KeyframeTimeline = defineAsyncComponent(() => import("../timeline/KeyframeTimeline.vue"));
import AnimationControlsControls from "./AnimationControlsControls.vue";
import { getStoredAnimationGroupControlOptions } from "../stores";

const { animation, isGrouped, isPlaying: isPlayingProp, layerConfig, active } = defineProps<{
    animation: Animation<any>;
    isGrouped?: boolean;
    isPlaying?: boolean;
    layerConfig?: AnimationLayerConfig;
    active?: boolean;
}>();

const storedControls = getStoredAnimationGroupControlOptions(animation);

// When true, the tab header is hidden (tabs are managed externally, e.g. via TopDock)
const tabsExternallyManaged = inject(TABS_EXTERNALLY_MANAGED_KEY, false);

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
}>();

const keyframesControlsRef = ref<InstanceType<typeof KeyframesStringControls> | null>(null);
const timelineRef = ref<InstanceType<typeof KeyframeTimeline> | null>(null);
const tabsContentEl = useTemplateRef<HTMLElement>("tabsContentEl");
const tabsHeaderEl = useTemplateRef<HTMLElement>("tabsHeaderEl");
const tabsListRef = useTemplateRef<HTMLElement>("tabsListRef");

const isTimelineVisible = computed(() =>
    storedControls.selectedControl === "timeline" || storedControls.isTimelineExpanded,
);

const tabClasses = "tab-trigger-base tab-trigger-pill";

// --- Overflow detection (left + right) via shared composable ---
const tabsListElRef = ref<HTMLElement | null>(null);

const { fadeClass: overflowClass, check: checkOverflow } = useScrollFade({
    el: tabsListElRef,
    axis: "x",
    classPrefix: "tabs-overflow",
    observeEl: tabsHeaderEl,
});

const scrollActiveTabIntoView = () => {
    const header = tabsHeaderEl.value;
    if (!header) return;
    const activeBtn = header.querySelector<HTMLElement>("button[data-state=active]");
    activeBtn?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
};

onMounted(() => {
    tabsListElRef.value =
        tabsHeaderEl.value?.querySelector<HTMLElement>("[role=tablist]") ?? null;
    scrollActiveTabIntoView();
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
.tabs-overflow-right,
.tabs-overflow-left,
.tabs-overflow-both {
    --tabs-mask-fade: 2.5rem;
}
.tabs-overflow-right {
    mask-image: linear-gradient(to right, black calc(100% - var(--tabs-mask-fade)), transparent);
}
.tabs-overflow-left {
    mask-image: linear-gradient(to right, transparent, black var(--tabs-mask-fade));
}
.tabs-overflow-both {
    mask-image: linear-gradient(to right, transparent, black var(--tabs-mask-fade), black calc(100% - var(--tabs-mask-fade)), transparent);
}
</style>

