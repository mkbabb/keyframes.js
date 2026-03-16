<template>
    <TooltipProvider :delay-duration="100" :skip-delay-duration="0">
    <div
        :class="[
            'controls-layout w-dvw h-dvh grid grid-cols-1 grid-rows-[auto_1fr] lg:grid-rows-[1fr_auto] lg:grid-cols-[400px_1fr_1fr] justify-items-stretch items-start relative',
        ]"
        v-bind="$attrs"
    >
        <div
            ref="controlsPaneEl"
            v-show="storedControls.selectedAnimation && !hideControls"
            @transitionend="onPanelTransitionEnd"
            @mouseenter="onPaneMouseEnter"
            @mouseleave="onPaneMouseLeave"
            @scroll="checkVerticalOverflow"
            :class="[
                'controls-pane group/controls col-start-1 row-start-1 lg:row-start-1 min-w-0 relative z-[var(--z-controls)]',
                'controls-pane--mobile',
                storedControls.isControlsPanelOpen
                    ? 'controls-pane--open'
                    : 'controls-pane--closed',
                isPaneHovered ? 'controls-pane--hovered' : '',
                isPanelTransitionDone && storedControls.isControlsPanelOpen
                    ? 'overflow-y-auto'
                    : 'overflow-hidden',
                scrollFadeClass,
            ]"
        >
                <div class="controls-content h-full overflow-hidden flex flex-col">
                    <template
                        v-for="[name, groupObject] in Object.entries(animationGroup.animations)"
                    >
                        <div v-show="storedControls.selectedAnimation == name">
                            <AnimationControls
                                :ref="(el: any) => { if (el) animControlRefs[name] = el }"
                                @slider-update="sliderUpdate"
                                @keyframes-update="keyframesUpdate"
                                @toggle-play="toggleAnimationGroup"
                                @layer-config-update="(v) => updateLayerConfig(name, v)"
                                @scrub-start="onScrubStart"
                                @scrub-end="onScrubEnd"
                                :animation="groupObject.animation"
                                :is-grouped="true"
                                :layer-config="groupObject.layer"
                                :active="storedControls.selectedAnimation == name"
                            >
                                <template #tabs-trigger>
                                    <slot name="tabs-trigger" :selected-animation="storedControls.selectedAnimation" :is-playing="isPlaying"></slot>
                                </template>

                                <template #tabs-content>
                                    <slot name="tabs-content" :selected-animation="storedControls.selectedAnimation" :is-playing="isPlaying"></slot>
                                </template>
                            </AnimationControls>
                        </div>
                    </template>

                    <!-- Persistent controls ribbon -->
                    <div v-if="storedControls.selectedAnimation" class="flex-shrink-0 pl-4 pr-7 pb-2">
                        <Card class="overflow-visible controls-card">
                            <CardContent class="p-3">
                                <!-- Controls tab: filled via Teleport from AnimationControlsControls -->
                                <div id="controls-ribbon-target" v-show="storedControls.selectedControl === 'controls'"></div>

                                <!-- Keyframes tab -->
                                <div v-if="storedControls.selectedControl === 'keyframes'" class="flex items-center justify-center gap-2 flex-wrap">
                                    <Button size="sm" variant="outline"
                                        :class="RIBBON_BUTTON_CLASS"
                                        @click="activeKeyframesRef?.copyCSS?.()"
                                    >
                                        <Copy class="w-3.5 h-3.5" /> Copy
                                    </Button>
                                    <Button size="sm" variant="outline"
                                        :class="RIBBON_BUTTON_CLASS"
                                        @click="activeKeyframesRef?.formatCSS?.()"
                                    >
                                        <Sparkles class="w-3.5 h-3.5" /> Format
                                    </Button>
                                    <Button size="sm" variant="outline"
                                        :class="RIBBON_BUTTON_CLASS"
                                        @click="activeKeyframesRef?.applyCSSStyles?.()"
                                    >
                                        <Paintbrush class="w-3.5 h-3.5" /> Apply CSS
                                    </Button>
                                </div>

                                <!-- Timeline tab -->
                                <div v-else-if="storedControls.selectedControl === 'timeline'" class="flex items-center justify-center gap-2 flex-wrap">
                                    <Button size="sm" variant="outline"
                                        :class="RIBBON_BUTTON_CLASS"
                                        @click="activeTimelineRef?.snapshot?.()"
                                    >
                                        <Camera class="w-3.5 h-3.5" /> Snapshot
                                    </Button>
                                    <Button size="sm" variant="outline"
                                        :class="RIBBON_BUTTON_CLASS"
                                        @click="activeTimelineRef?.openImportDialog?.()"
                                    >
                                        <Download class="w-3.5 h-3.5" /> Import
                                    </Button>
                                    <Button size="sm" variant="outline"
                                        :class="RIBBON_BUTTON_CLASS"
                                        @click="activeTimelineRef?.exportCSS?.()"
                                    >
                                        <Upload class="w-3.5 h-3.5" /> Export
                                    </Button>
                                    <Button size="sm" variant="outline"
                                        :class="RIBBON_BUTTON_CLASS"
                                        @click="activeTimelineRef?.openAddCSSDialog?.()"
                                    >
                                        <FilePlus2 class="w-3.5 h-3.5" /> Add CSS
                                    </Button>
                                </div>

                                <!-- Other tabs (matrix controls, etc.) via slot -->
                                <div v-else-if="storedControls.selectedControl !== 'controls'" class="flex items-center justify-center gap-2 flex-wrap">
                                    <slot name="ribbon-content" :selected-control="storedControls.selectedControl"></slot>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
        </div>

        <div
            :class="[
                'justify-self-stretch self-center min-h-0 h-full overflow-visible overscroll-contain col-span-full row-start-1 -row-end-1 lg:row-end-auto lg:col-start-2 lg:col-end-4',
            ]"
        >
            <slot name="animation-content"></slot>
        </div>

        <!-- Teleport target for expanded timeline (content arrives via Teleport from AnimationControls) -->
        <div
            id="timeline-expanded-target"
            :class="[
                'col-span-full row-start-2 z-[var(--z-dock)] overflow-hidden',
                'transition-[max-height,opacity] duration-350 ease-[var(--ease-standard)]',
                storedControls.isTimelineExpanded
                    ? 'max-h-[60vh] border-t border-border/50 glass px-4 py-3'
                    : 'max-h-0',
            ]"
        ></div>

        <!-- Bottom menubar — hidden when no animation scene is active -->
        <AnimationMenuBar
            v-show="!hideControls"
            ref="menuBarRef"
            :stored-controls="storedControls"
            :is-playing="isPlaying"
            :is-started="isStarted"
            :animation-progress="animationProgress"
            :animation-names="Object.keys(animationGroup.animations)"
            @toggle-play="toggleAnimationGroup"
            @reset="(all: boolean) => all ? clear() : reset()"
            @select-animation="onSelectAnimation"
            @expand-timeline="(v) => { storedControls.isTimelineExpanded = v; }"
        />
    </div>

    </TooltipProvider>

    <Teleport to="html">
        <Toaster
            :toastOptions="{
                unstyled: true,
                classes: {
                    toast: 'bg-foreground text-background rounded-xl instrument-serif px-4 py-3 grid grid-cols-1 gap-1 shadow-lg lg:w-80 w-64 max-w-[90vw]',
                    title: 'font-bold text-base',
                    description: 'font-normal text-sm',
                    actionButton: '',
                    cancelButton: '',
                    closeButton: '',
                },
            }"
            theme="system"
        />
    </Teleport>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, provide, reactive, ref, Teleport, useTemplateRef, watchEffect } from "vue";
import type { Ref } from "vue";
import { Toaster, toast } from "vue-sonner";

import {
    Camera,
    Copy,
    Download,

    FilePlus2,
    Paintbrush,
    Sparkles,
    Upload,
} from "lucide-vue-next";

import { TooltipProvider } from "@components/ui/tooltip";

import { Animation } from "@src/animation/index";
import AnimationControls from "./controls/AnimationControls.vue";
import AnimationMenuBar from "./AnimationMenuBar.vue";
import Button from "@components/ui/button/Button.vue";
import { Card, CardContent } from "@components/ui/card";

import {
    getStoredAnimationGroupControlOptions,
    resetAllStores,
} from "./animationStores";
import { AnimationGroup } from "@src/animation/group";
import { registerShortcut } from "@composables/useKeyboardShortcuts";
import { useAnimationGroupPlayback } from "./useAnimationGroupPlayback";
import { useAnimationProgress } from "./useAnimationProgress";

const RIBBON_BUTTON_CLASS = "h-8 gap-1.5 cursor-pointer instrument-serif text-base px-3 rounded-lg hover:scale-105 active:scale-95 transition-transform";

const { superKey, animationGroup, autoPlay, hideControls } = defineProps<{
    animationGroup: AnimationGroup<any>;
    superKey?: string;
    autoPlay?: boolean;
    hideControls?: boolean;
}>();

const storedControls = getStoredAnimationGroupControlOptions(superKey);

// Collect refs to each AnimationControls for ribbon actions
const animControlRefs = reactive<Record<string, any>>({});

const activeKeyframesRef = computed(() => {
    const name = storedControls.selectedAnimation;
    return name ? animControlRefs[name]?.keyframesControlsRef : null;
});

const activeTimelineRef = computed(() => {
    const name = storedControls.selectedAnimation;
    return name ? animControlRefs[name]?.timelineRef : null;
});

// Track whether the panel's max-height transition has completed
const isPanelTransitionDone = ref(storedControls.isControlsPanelOpen);

import { watch } from "vue";

watch(() => storedControls.isControlsPanelOpen, (open) => {
    if (!open) isPanelTransitionDone.value = false;
});

const onPanelTransitionEnd = (e: TransitionEvent) => {
    if (e.propertyName === 'max-height' && storedControls.isControlsPanelOpen) {
        isPanelTransitionDone.value = true;
    }
};

// Auto-show controls pane when switching tabs while pane is hidden
watch(() => storedControls.selectedControl, (newVal, oldVal) => {
    if (newVal !== oldVal && !storedControls.isControlsPanelOpen) {
        storedControls.isControlsPanelOpen = true;
    }
});

// Validate stored selection — clear stale values via watchEffect (reacts to group changes).
// Skip validation when the group has no animations (e.g. empty placeholder during init)
// to avoid clearing a valid localStorage selection before the real group arrives.
watchEffect(() => {
    const hasAnimations = Object.keys(animationGroup.animations).length > 0;
    if (
        hasAnimations &&
        storedControls.selectedAnimation &&
        !animationGroup.animations[storedControls.selectedAnimation]
    ) {
        storedControls.selectedAnimation = null as any;
    }
});

const emit = defineEmits<{
    (e: "playStateChange", playing: boolean): void;
    (e: "startStateChange", started: boolean): void;
}>();

const {
    isPlaying,
    isStarted,
    syncPlayState,
    findAnimationGroupObject,
    onSelectAnimation,
    toggleAnimationGroup,
    onScrubStart,
    onScrubEnd,
    sliderUpdate,
} = useAnimationGroupPlayback(() => animationGroup, storedControls, emit as any);

const { animationProgress } = useAnimationProgress(() => animationGroup, isPlaying);

// Sync play state when the animationGroup prop changes (e.g. after scene-switch
// restoration sets the group to playing). Without this, isPlaying/isStarted refs
// stay stale from the initial mount.
watch(() => animationGroup, () => {
    const group = animationGroup;
    if (group.started) {
        syncPlayState();
    }
}, { flush: 'post' });

// Auto-play on mount if requested (e.g. when navigating from home to a scene).
onMounted(() => {
    if (autoPlay && Object.keys(animationGroup.animations).length > 0) {
        toggleAnimationGroup();
    }
});

// --- Controls pane hover with linger delay ---
// Pane becomes opaque when hovering the pane itself OR any dock (top/bottom).
// A linger timer keeps it opaque briefly after mouse leaves.
const isPaneDirectHover = ref(false);
// Injected from App.vue — shared between TopDock and bottom dock GlassDock instances
const isDockHovered = inject<Ref<boolean>>("controlsPaneHover", ref(false));
const isPaneHovered = computed(() => isPaneDirectHover.value || isDockHovered.value);

let paneHoverTimer: ReturnType<typeof setTimeout> | null = null;
const HOVER_LINGER_MS = 2000;

function clearHoverTimer() {
    if (paneHoverTimer) {
        clearTimeout(paneHoverTimer);
        paneHoverTimer = null;
    }
}

function scheduleHoverEnd() {
    clearHoverTimer();
    paneHoverTimer = setTimeout(() => {
        isPaneDirectHover.value = false;
        paneHoverTimer = null;
    }, HOVER_LINGER_MS);
}

function onPaneMouseEnter() {
    clearHoverTimer();
    isPaneDirectHover.value = true;
}

function onPaneMouseLeave() {
    scheduleHoverEnd();
}

onUnmounted(() => {
    clearHoverTimer();
});

// --- Mobile vertical scroll fade ---
const controlsPaneEl = useTemplateRef<HTMLElement>("controlsPaneEl");
const overflowTop = ref(false);
const overflowBottom = ref(false);

const scrollFadeClass = computed(() => {
    if (overflowTop.value && overflowBottom.value) return "scroll-fade-both";
    if (overflowTop.value) return "scroll-fade-top";
    if (overflowBottom.value) return "scroll-fade-bottom";
    return "";
});

function checkVerticalOverflow() {
    const el = controlsPaneEl.value;
    if (!el) {
        overflowTop.value = false;
        overflowBottom.value = false;
        return;
    }
    overflowTop.value = el.scrollTop > 2;
    overflowBottom.value = el.scrollTop + el.clientHeight < el.scrollHeight - 2;
}

let scrollFadeResizeObserver: ResizeObserver | null = null;

watch(isPanelTransitionDone, () => checkVerticalOverflow());

onMounted(() => {
    scrollFadeResizeObserver = new ResizeObserver(() => checkVerticalOverflow());
    const el = controlsPaneEl.value;
    if (el) scrollFadeResizeObserver.observe(el);
});

onUnmounted(() => {
    scrollFadeResizeObserver?.disconnect();
});

const menuBarRef = ref<InstanceType<typeof AnimationMenuBar> | null>(null);

const updateLayerConfig = (name: string, config: Partial<import("@src/animation/constants").AnimationLayerConfig>) => {
    animationGroup.setLayerConfig(name, config);
};

const keyframesUpdate = (e: { animation: Animation<any> }) => {
    const groupObject = findAnimationGroupObject(e.animation);
    if (groupObject != null) {
        groupObject.values = {};
    }
};

const reset = () => {
    animationGroup.stop();
    syncPlayState();
};

const clear = () => {
    animationGroup.stop();
    syncPlayState();
    storedControls.selectedAnimation = null as any;
    resetAllStores();
    window.location.reload();
};

// --- Keyboard shortcuts ---

registerShortcut("Space", () => toggleAnimationGroup(), { preventDefault: true, label: "Play / Pause", group: "Playback" });
registerShortcut("Escape", () => reset(), { label: "Stop animation", group: "Playback" });
registerShortcut("R", () => { menuBarRef.value?.resetIconSpin(); reset(); }, { label: "Reset animation", group: "Playback" });
registerShortcut("ArrowLeft", () => scrubActive(getActiveT() - 0.01), { preventDefault: true, label: "Scrub back", group: "Playback" });
registerShortcut("ArrowRight", () => scrubActive(getActiveT() + 0.01), { preventDefault: true, label: "Scrub forward", group: "Playback" });
registerShortcut("Shift+ArrowLeft", () => scrubActive(getActiveT() - 0.1), { preventDefault: true, label: "Scrub back (large)", group: "Playback" });
registerShortcut("Shift+ArrowRight", () => scrubActive(getActiveT() + 0.1), { preventDefault: true, label: "Scrub forward (large)", group: "Playback" });
registerShortcut("Home", () => scrubActive(0), { preventDefault: true, label: "Jump to start", group: "Playback" });
registerShortcut("End", () => scrubActive(1), { preventDefault: true, label: "Jump to end", group: "Playback" });
registerShortcut("[", () => cycleAnimation(-1), { label: "Previous animation", group: "Navigation" });
registerShortcut("]", () => cycleAnimation(1), { label: "Next animation", group: "Navigation" });
registerShortcut("1", () => switchTab("controls"), { label: "Controls tab", group: "Navigation" });
registerShortcut("2", () => switchTab("keyframes"), { label: "Keyframes tab", group: "Navigation" });
registerShortcut("3", () => switchTab("timeline"), { label: "Timeline tab", group: "Navigation" });
registerShortcut("Mod+S", () => activeKeyframesRef.value?.copyCSS?.(), { preventDefault: true, label: "Copy CSS", group: "Actions" });
registerShortcut("Delete", () => activeTimelineRef.value?.removeSelectedKeyframe?.(), { label: "Delete keyframe", group: "Actions" });

function getActiveT(): number {
    const name = storedControls.selectedAnimation;
    if (!name) return 0;
    const groupObj = animationGroup.animations[name];
    if (!groupObj) return 0;
    const anim = groupObj.animation;
    const dur = anim.options.duration ?? 1000;
    return dur > 0 ? anim.t / dur : 0;
}

function scrubActive(fraction: number) {
    const name = storedControls.selectedAnimation;
    if (!name) return;
    const groupObj = animationGroup.animations[name];
    if (!groupObj) return;
    const anim = groupObj.animation;
    const dur = anim.options.duration ?? 1000;
    const t = Math.max(0, Math.min(dur, fraction * dur));
    sliderUpdate({ t, animation: anim });
}

function switchTab(tab: string) {
    const name = storedControls.selectedAnimation;
    if (!name) return;
    const ctrl = animControlRefs[name];
    ctrl?.selectControl?.(tab);
}

function cycleAnimation(direction: number) {
    const names = Object.keys(animationGroup.animations);
    if (names.length === 0) return;
    const currentIdx = names.indexOf(storedControls.selectedAnimation ?? "");
    const nextIdx = (currentIdx + direction + names.length) % names.length;
    storedControls.selectedAnimation = names[nextIdx]!;
    if (!animationGroup.started) {
        animationGroup.play();
        syncPlayState(true);
    }
}

</script>

<style scoped>
/* ── Mobile: slide open/closed via max-height ── */
.controls-pane--mobile {
    transition:
        max-height 0.5s var(--ease-spring),
        opacity 0.3s ease;
}
.controls-pane--open {
    max-height: calc(100dvh - 7rem);
    margin-top: 3rem;
    opacity: 1;
    visibility: visible;
    transition:
        max-height 0.5s var(--ease-spring),
        opacity 0.3s ease,
        visibility 0s 0s;
}
.controls-pane--closed {
    max-height: 0;
    opacity: 0;
    pointer-events: none;
    visibility: hidden;
    transition:
        max-height 0.5s var(--ease-spring),
        opacity 0.3s ease,
        visibility 0s 0.5s;
}

/* ── Desktop ── */
@media (min-width: 1024px) {
    .controls-pane--mobile {
        max-height: none;
        margin-top: 0;
        transform-origin: center center;
    }
    .controls-pane--open {
        max-height: none;
        opacity: 0.75;
        transform: scale(1);
        visibility: visible;
        pointer-events: auto;
        transition:
            opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1),
            transform 0.5s var(--ease-spring),
            visibility 0s 0s;
    }
    .controls-pane--closed {
        max-height: none;
        opacity: 0;
        transform: scale(0.96);
        visibility: hidden;
        pointer-events: none;
        transition:
            opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1),
            transform 0.5s var(--ease-spring),
            visibility 0s 0.5s;
    }
    /* Hovered via pane or dock: fully opaque */
    .controls-pane--hovered.controls-pane--open {
        opacity: 1;
        transition:
            opacity 0.3s cubic-bezier(0, 0, 0.2, 1),
            transform 0.3s ease-out;
    }

    .controls-pane :deep(.controls-card) {
        box-shadow: var(--shadow-card);
        transition: box-shadow 0.3s ease-out;
        backdrop-filter: var(--glass-blur-heavy);
        -webkit-backdrop-filter: var(--glass-blur-heavy);
        background: hsl(var(--background) / 0.6);
    }
    .controls-pane--hovered :deep(.controls-card) {
        box-shadow: var(--shadow-card-hover);
    }

    .controls-content {
        min-width: 400px;
    }
}

/* ── Mobile vertical scroll fade ── */
@media (max-width: 1023px) {
    .scroll-fade-top {
        mask-image: linear-gradient(to bottom, transparent, black 2.5rem);
        -webkit-mask-image: linear-gradient(to bottom, transparent, black 2.5rem);
    }
    .scroll-fade-bottom {
        mask-image: linear-gradient(to bottom, black calc(100% - 2.5rem), transparent);
        -webkit-mask-image: linear-gradient(to bottom, black calc(100% - 2.5rem), transparent);
    }
    .scroll-fade-both {
        mask-image: linear-gradient(to bottom, transparent, black 2.5rem, black calc(100% - 2.5rem), transparent);
        -webkit-mask-image: linear-gradient(to bottom, transparent, black 2.5rem, black calc(100% - 2.5rem), transparent);
    }
}
</style>
