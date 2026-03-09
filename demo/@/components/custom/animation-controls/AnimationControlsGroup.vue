<template>
    <TooltipProvider :delay-duration="100" :skip-delay-duration="0">
    <div
        :class="[
            'controls-layout w-dvw h-dvh grid grid-cols-1 grid-rows-[auto_1fr_auto] lg:grid-rows-[1fr_auto_auto] lg:grid-cols-[380px_1fr_1fr] justify-items-stretch items-start relative',
        ]"
        v-bind="$attrs"
    >
        <div
            v-show="storedControls.selectedAnimation"
            @transitionend="onPanelTransitionEnd"
            :class="[
                'controls-pane group/controls col-start-1 row-start-1 lg:row-start-1 min-w-0 relative z-10 transition-[max-height,opacity] duration-350 ease-[cubic-bezier(0.4,0,0.2,1)] lg:!max-h-full lg:!mt-0',
                storedControls.isControlsPanelOpen
                    ? 'max-h-[calc(100dvh-7rem)] mt-12 visible'
                    : 'max-h-0 opacity-0 pointer-events-none invisible',
                isPanelTransitionDone && storedControls.isControlsPanelOpen
                    ? 'overflow-y-auto'
                    : 'overflow-hidden',
                isMinimized ? 'controls-minimized' : '',
            ]"
        >
            <!-- Restore button — appears when accordion is collapsed (desktop only) -->
            <button
                v-if="storedControls.selectedAnimation"
                @click="isMinimized = false"
                class="restore-btn hidden lg:flex"
                title="Restore controls"
            >
                <PanelLeft class="w-4 h-4" />
            </button>

            <!-- Accordion content wrapper — shrinks width when minimized -->
            <div class="controls-content-wrapper h-full overflow-hidden">
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
                                @minimize="isMinimized = true"
                                :animation="groupObject.animation"
                                :is-grouped="true"
                                :layer-config="groupObject.layer"
                                :active="storedControls.selectedAnimation == name"
                                :show-minimize="true"
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
        </div>

        <div
            :class="[
                'justify-self-stretch self-center min-h-0 h-full overflow-visible overscroll-contain col-span-full row-start-1 -row-end-1 lg:row-end-auto',
                storedControls?.selectedAnimation
                    ? 'lg:col-start-2 lg:col-end-4'
                    : 'lg:col-start-1 lg:col-end-4',
            ]"
        >
            <slot name="animation-content" :selected-animation="storedControls.selectedAnimation" :is-playing="isPlaying"> </slot>
        </div>

        <!-- Teleport target for expanded timeline (content arrives via Teleport from AnimationControls) -->
        <div
            id="timeline-expanded-target"
            :class="[
                'col-span-full row-start-3 lg:row-start-2 z-40 transition-[max-height,opacity] duration-350 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden',
                storedControls.isTimelineExpanded
                    ? 'max-h-[60vh] border-t border-border/50 bg-background/95 backdrop-blur-sm px-4 py-3'
                    : 'max-h-0',
            ]"
        ></div>

        <!-- Bottom menubar -->
        <AnimationMenuBar
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
import { computed, reactive, ref, Teleport, watchEffect } from "vue";
import { Toaster, toast } from "vue-sonner";

import {
    Camera,
    Copy,
    Download,

    FilePlus2,
    Paintbrush,
    PanelLeft,
    Sparkles,
    Upload,
    X,
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

const { superKey, animationGroup } = defineProps<{
    animationGroup: AnimationGroup<any>;
    superKey?: string;
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
const isMinimized = ref(false);

import { watch } from "vue";

watch(() => storedControls.isControlsPanelOpen, (open) => {
    if (!open) isPanelTransitionDone.value = false;
});

const onPanelTransitionEnd = (e: TransitionEvent) => {
    if (e.propertyName === 'max-height' && storedControls.isControlsPanelOpen) {
        isPanelTransitionDone.value = true;
    }
};

// Validate stored selection — clear stale values via watchEffect (reacts to group changes)
watchEffect(() => {
    if (
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
} = useAnimationGroupPlayback(animationGroup, storedControls, emit as any);

const { animationProgress } = useAnimationProgress(animationGroup, isPlaying);

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
@media (min-width: 1024px) {
    /* Controls pane: idle→75% after 10s, hover→100% immediately.
       !important overrides Tailwind opacity-0/invisible from mobile collapse. */
    .controls-pane {
        opacity: 0.75 !important;
        visibility: visible !important;
        pointer-events: auto !important;
        transition: opacity 0.5s ease-out 10s;
        overflow: hidden;
        --controls-card-shadow: 4px 4px 0px 0px rgba(0,0,0,0.5);
        --controls-card-shadow-hover: 5px 5px 0px 0px rgba(0,0,0,0.6);
    }
    .controls-pane:hover {
        opacity: 1 !important;
        transition: opacity 0.2s ease-out;
    }
    .controls-pane :deep(.controls-card) {
        box-shadow: var(--controls-card-shadow);
        transition: box-shadow 0.3s ease-out;
    }
    .controls-pane:hover :deep(.controls-card) {
        box-shadow: var(--controls-card-shadow-hover);
    }

    /* Accordion collapse — width shrinks instead of translateX */
    .controls-content-wrapper {
        width: 100%;
        overflow: hidden;
        transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                    opacity 0.25s ease-out;
        opacity: 1;
    }
    .controls-content {
        min-width: 380px;
    }
    .controls-minimized .controls-content-wrapper {
        width: 0;
        opacity: 0;
        pointer-events: none;
    }

    /* Restore button — positioned absolutely, tracks the shrinking edge */
    .restore-btn {
        position: absolute;
        top: 0.75rem;
        left: 0;
        z-index: 20;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 0.5rem;
        color: hsl(var(--muted-foreground));
        cursor: pointer;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.25s ease-out 0.15s,
                    background-color 0.15s ease-out;
        border: none;
        background: transparent;
    }
    .restore-btn:hover {
        background: hsl(var(--accent));
        color: hsl(var(--foreground));
    }
    .controls-minimized .restore-btn {
        opacity: 1;
        pointer-events: auto;
    }
    .controls-minimized {
        opacity: 1 !important;
    }
}
@media (min-width: 1024px) {
    :global(.dark) .controls-pane {
        --controls-card-shadow: 4px 4px 0px 0px hsl(var(--shadow) / 0.3);
        --controls-card-shadow-hover: 5px 5px 0px 0px hsl(var(--shadow) / 0.4);
    }
}
</style>
