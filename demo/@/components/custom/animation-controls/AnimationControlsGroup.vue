<template>
    <TooltipProvider :delay-duration="100" :skip-delay-duration="0">
    <div
        :class="[
            'controls-layout grid grid-cols-1 grid-rows-[auto_1fr_auto] lg:grid-rows-[1fr_auto] lg:grid-cols-[var(--controls-pane-width)_1fr_1fr] justify-items-stretch items-start relative',
        ]"
        v-bind="$attrs"
    >
        <ControlsPaneWrapper
            :animation-group="animationGroup"
            :stored-controls="storedControls"
            :hide-controls="hideControls"
            :is-playing="isPlaying"
            :anim-control-refs="animControlRefs"
            :active-keyframes-ref="activeKeyframesRef"
            :active-timeline-ref="activeTimelineRef"
            :is-panel-transition-done="isPanelTransitionDone"
            :is-pane-hovered="isPaneHovered"
            :scroll-fade-class="scrollFadeClass"
            :on-panel-transition-end="onPanelTransitionEnd"
            :on-pane-mouse-enter="onPaneMouseEnter"
            :on-pane-mouse-leave="onPaneMouseLeave"
            :set-pane-el="(el) => { controlsPaneEl = el; }"
            @slider-update="sliderUpdate"
            @keyframes-update="keyframesUpdate"
            @toggle-play="toggleAnimationGroup"
            @layer-config-update="(name, v) => updateLayerConfig(name, v)"
            @scrub-start="onScrubStart"
            @scrub-end="onScrubEnd"
        >
            <template #tabs-trigger="slotProps">
                <slot name="tabs-trigger" v-bind="slotProps"></slot>
            </template>
            <template #tabs-content="slotProps">
                <slot name="tabs-content" v-bind="slotProps"></slot>
            </template>
            <template #ribbon-content="slotProps">
                <slot name="ribbon-content" v-bind="slotProps"></slot>
            </template>
        </ControlsPaneWrapper>

        <!-- Animation stage. Mobile: a dedicated 1fr row track (row 2) below the
             `auto` controls-pane row — the pane no longer overlays/clips the
             stage at narrow widths (Qσ V1). Desktop: the stage spans the FULL
             3-col grid (col 1-4) so the subject centers in the viewport, NOT
             in cols 2-3 — which, when the controls pane is closed/hidden,
             collapsed the `1fr 1fr` tracks to zero width and jammed the cube
             off the right edge (B.W3 BLOCKER: the cube was ~half-clipped at
             1280/1440). The controls-pane (col-1, z-controls, position:
             relative) overlays the stage's left edge when open — its own
             --controls-pane-width backdrop sits above the centered stage (the
             grid track + the pane min-width single-source that width via the
             token), so an open pane frames the subject without shifting it. -->
        <div
            :class="[
                'justify-self-stretch self-center min-h-0 h-full overflow-visible overscroll-contain col-span-full row-start-2 lg:row-start-1 lg:row-end-auto lg:col-start-1 lg:col-end-4',
            ]"
        >
            <slot name="animation-content"></slot>
        </div>

        <!-- Teleport target for expanded timeline (content arrives via Teleport from AnimationControls) -->
        <div
            id="timeline-expanded-target"
            :class="[
                'col-span-full row-start-3 lg:row-start-2 z-dock overflow-hidden',
                'transition-[max-height,opacity] duration-slow ease-standard',
                storedControls.isTimelineExpanded
                    ? 'max-h-[var(--panel-max-h)] border-t border-border/50 glass-wash px-4 py-3'
                    : 'max-h-0',
            ]"
        ></div>

        <!-- Bottom menubar — hidden when no animation scene is active -->
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

    <!-- Hidden SVG gradient definition for rainbow icon strokes. The defs stay
         here (top-level, demo-global) because the Apply-CSS paintbrush in the
         ribbon strokes `url(#rainbow-gradient)` — the gradient must live where
         the SVG reference can resolve it. Stops reference the demo-owned
         --rainbow-* family (design-idioms.css). -->
    <svg width="0" height="0" class="absolute">
        <defs>
            <linearGradient id="rainbow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" :style="{ stopColor: 'var(--rainbow-red)' }" />
                <stop offset="20%" :style="{ stopColor: 'var(--rainbow-orange)' }" />
                <stop offset="40%" :style="{ stopColor: 'var(--rainbow-yellow)' }" />
                <stop offset="60%" :style="{ stopColor: 'var(--rainbow-green)' }" />
                <stop offset="80%" :style="{ stopColor: 'var(--rainbow-blue)' }" />
                <stop offset="100%" :style="{ stopColor: 'var(--rainbow-violet)' }" />
            </linearGradient>
        </defs>
    </svg>

    </TooltipProvider>

    <Teleport to="html">
        <Toaster
            :toastOptions="{
                unstyled: true,
                classes: {
                    toast: 'bg-foreground text-background rounded-xl text-body px-4 py-3 grid grid-cols-1 gap-1 shadow-lg lg:w-80 w-64 max-w-[90vw]',
                    title: 'font-bold text-body',
                    description: 'font-normal text-small',
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
import { computed, onMounted, reactive, ref, Teleport, useTemplateRef, watch, watchEffect } from "vue";

import { Toaster } from "vue-sonner";

import { TooltipProvider } from "@mkbabb/glass-ui";

import { Animation } from "@src/animation/engine";
import ControlsPaneWrapper from "./components/ControlsPaneWrapper.vue";
import AnimationMenuBar from "./AnimationMenuBar.vue";

import {
    getStoredAnimationGroupControlOptions,
    resetAllStores,
} from "./stores";
import { AnimationGroup } from "@src/animation/group";
import { registerShortcut } from "@mkbabb/glass-ui/keyboard";
import { useAnimationGroupPlayback } from "./composables/useAnimationGroupPlayback";
import { useAnimationProgress } from "./composables/useAnimationProgress";
import { useControlsLayout } from "./composables/useControlsLayout";

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

// --- Controls pane layout (open-state, hover, transition, scroll-fade) ---
const controlsPaneEl = ref<HTMLElement | null>(null);

const {
    isPanelTransitionDone,
    onPanelTransitionEnd,
    isPaneHovered,
    onPaneMouseEnter,
    onPaneMouseLeave,
    scrollFadeClass,
} = useControlsLayout(storedControls, controlsPaneEl);

const menuBarRef = useTemplateRef<InstanceType<typeof AnimationMenuBar>>("menuBarRef");

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
    // resetAllStores() now also wipes the scene-machine persist key, so the
    // active-scene fact resets to HOME_SCENE_ID on reload. The old raw
    // `localStorage.setItem("keyframes-js-active-scene", "home")` write is
    // DELETED — the machine owns that fact (H.W1); the legacy key is read by
    // nobody.
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
// Undo / redo over the timeline keyframe state (F.W14.S1) — bound through the
// ONE existing registry (not a second window listener), so they inherit the
// editable-target skip + surface in the KeyboardShortcutsModal. The destructive
// timeline ops (clear / removeKeyframe / inline CSS edits) become reversible.
registerShortcut("Mod+Z", () => activeTimelineRef.value?.undo?.(), { preventDefault: true, label: "Undo", group: "Actions" });
registerShortcut("Mod+Shift+Z", () => activeTimelineRef.value?.redo?.(), { preventDefault: true, label: "Redo", group: "Actions" });

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
.controls-layout {
    width: min(100dvw, var(--work-area-max-width, 100dvw));
    height: min(100dvh, var(--work-area-max-height, 100dvh));
    max-width: 100dvw;
    max-height: 100dvh;
    margin: auto;
}

@media (max-width: 1023px) {
    .controls-layout {
        align-content: center;
    }
}
</style>
