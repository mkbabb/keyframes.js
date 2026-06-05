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
                    <TabsTrigger :ref="(el: any) => setTabTriggerRef('controls', el)" value="controls" :class="tabClasses">Controls</TabsTrigger>
                    <TabsTrigger :ref="(el: any) => setTabTriggerRef('keyframes', el)" value="keyframes" :class="tabClasses">Keyframes</TabsTrigger>
                    <TabsTrigger :ref="(el: any) => setTabTriggerRef('timeline', el)" value="timeline" :class="tabClasses">Timeline</TabsTrigger>
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

                <!-- B-2 (CWV/INP): force-mount the Monaco-heavy keyframes pane and
                     cache it via content-visibility:hidden when inactive, instead
                     of letting reka unmount it (which re-spins Monaco's worker /
                     model / themes on every switch-back). `inert` (not bare
                     aria-hidden, which leaves focusable Monaco descendants in the
                     tab order — the aria-hidden-focus a11y defect) takes the cached
                     pane out of BOTH the tab order and the AT tree while inactive;
                     the focus-move on reveal restores it. Scoped to THIS Monaco
                     pane only — the lightweight controls pane stays unmounted. -->
                <TabsContent
                    value="keyframes"
                    force-mount
                    ref="keyframesPaneEl"
                    :class="['monaco-pane', keyframesActive ? '' : 'inactive']"
                    :inert="!keyframesActive"
                >
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
                        <p class="text-mono-small">Timeline expanded below</p>
                        <Button
                            size="sm"
                            variant="ghost"
                            class="gap-1.5 text-mono-caption normal-case"
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
// Colocated tab-trigger skin + tab-panel slide (uncaged from utils.css, D.W2.S2).
// Non-scoped global rules — the classes land on reka-ui's <TabsTrigger> /
// <TabsContent> DOM shared across this host and the scene tab triggers.
import "./tab-trigger.css";

import { Animation } from "@src/animation/engine";
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
import { ChevronDown, Minimize2 } from "@lucide/vue";
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

// Owned tab-trigger element refs, keyed by tab value. The active tab is the one
// whose key matches `storedControls.selectedControl` (Vue state) — no DOM
// `data-state` re-read.
const tabTriggerEls = new Map<string, HTMLElement>();
const setTabTriggerRef = (value: string, el: any) => {
    const node = (el?.$el ?? el) as HTMLElement | null;
    if (node) tabTriggerEls.set(value, node);
    else tabTriggerEls.delete(value);
};

const isTimelineVisible = computed(() =>
    storedControls.selectedControl === "timeline" || storedControls.isTimelineExpanded,
);

// B-2: the keyframes pane is force-mounted and content-visibility-cached when
// inactive. `keyframesActive` toggles the `.inactive` class + the `inert`
// attribute (inert, not bare aria-hidden, so focusable Monaco descendants leave
// the tab order too — closing the aria-hidden-focus a11y defect).
const keyframesPaneEl = useTemplateRef<any>("keyframesPaneEl");
const keyframesActive = computed(() => storedControls.selectedControl === "keyframes");

// On reveal, move focus into the freshly-shown Monaco pane (the cached pane was
// inert + content-visibility:hidden while inactive) and let Monaco's
// deferred ResizeObserver re-measure now that the box has layout again. reka's
// roving focus stays intact because the pane was force-mounted (never torn down).
watch(keyframesActive, (active) => {
    if (!active) return;
    nextTick(() => {
        // The glass-ui/reka <TabsContent> forwards its root; resolve the DOM
        // node whether the ref is a component instance ($el) or the element.
        const node = (keyframesPaneEl.value?.$el ?? keyframesPaneEl.value) as HTMLElement | undefined;
        // The reka tabpanel root is focusable (tabindex=0) — focus it so the
        // revealed pane owns the tab sequence; Monaco re-measures on the layout
        // pass that content-visibility restoration triggers.
        node?.focus?.();
    });
});

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
    // Active tab = the trigger whose value matches Vue's `selectedControl` —
    // read the state, scroll the OWNED trigger ref (not a DOM `data-state` read).
    const activeBtn = tabTriggerEls.get(storedControls.selectedControl);
    activeBtn?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
};

onMounted(() => {
    // The reka-ui <TabsList> renders the `role=tablist` element; there is no
    // public ref for it, so this is a single DOCUMENTED vendor-DOM contract
    // (the `[data-sonner-toaster]` disposition, D.W3). If reka-ui ships a ref,
    // a later follow-on adopts it.
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
/* B-2: cache the inactive force-mounted Monaco pane. content-visibility:hidden
   keeps the rendered Monaco subtree in memory but skips its layout/paint while
   inactive — a switch-back restores the cached pane instead of re-instantiating
   Monaco's worker/model/themes (the INP win). Baseline 2025-09-15. */
.monaco-pane.inactive {
    content-visibility: hidden;
}

/* Where content-visibility is unsupported, fall back to display:none so the
   force-mounted pane does not render alongside the active one. The cache benefit
   is lost there, but correctness (one visible pane) holds. */
@supports not (content-visibility: hidden) {
    .monaco-pane.inactive {
        display: none;
    }
}

.tabs-overflow-right,
.tabs-overflow-left,
.tabs-overflow-both {
    --tabs-mask-fade: 2.5rem;
}

/* The tab-overflow edge fade degrades to un-faded content on a browser without
   mask-image support — graceful, not a broken mask (D.W3.S3). Both the
   standard and -webkit- prefixed declarations are paired (the prior rules
   carried only the unprefixed form, no-op'ing on older WebKit). */
@supports (-webkit-mask-image: linear-gradient(#000, #000)) or
    (mask-image: linear-gradient(#000, #000)) {
    .tabs-overflow-right {
        mask-image: linear-gradient(to right, black calc(100% - var(--tabs-mask-fade)), transparent);
        -webkit-mask-image: linear-gradient(to right, black calc(100% - var(--tabs-mask-fade)), transparent);
    }
    .tabs-overflow-left {
        mask-image: linear-gradient(to right, transparent, black var(--tabs-mask-fade));
        -webkit-mask-image: linear-gradient(to right, transparent, black var(--tabs-mask-fade));
    }
    .tabs-overflow-both {
        mask-image: linear-gradient(to right, transparent, black var(--tabs-mask-fade), black calc(100% - var(--tabs-mask-fade)), transparent);
        -webkit-mask-image: linear-gradient(to right, transparent, black var(--tabs-mask-fade), black calc(100% - var(--tabs-mask-fade)), transparent);
    }
}
</style>

