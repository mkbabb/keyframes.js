<template>
    <TooltipProvider :delay-duration="100" :skip-delay-duration="0">
    <div
        :class="[
            'controls-layout grid grid-cols-1 grid-rows-[auto_1fr_auto] justify-items-stretch items-start relative',
            storedControls.isControlsPanelOpen ? 'controls-layout--open' : 'controls-layout--closed',
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
            :is-pane-idle="isPaneIdle"
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
             stage at narrow widths (Qσ V1). Desktop: the stage gets its OWN
             named [stage] track (column 2, the 1fr remainder beside the [rail]
             track) — H.W3.S4 (WV-W3-HIGH-3) replaced the former full-grid stage
             span. The rail and stage are now DISJOINT columns: the controls pane
             occupies [rail] and the subject centers in [stage], so an open pane no
             longer overlays the subject — closing the pane collapses the [rail]
             track to 0 and the stage reflows to fill the freed width. The B.W3
             "cube half-clipped" invariant is the proof:stage-not-clipped gate's
             subject; if the [stage]-track form clips at 1280/1440 the conservative
             span-to-the-grid-end form (col-start: rail / col-end: -1) is the
             documented fallback. -->
        <div
            class="stage-cell justify-self-stretch self-center min-h-0 h-full overflow-visible overscroll-contain row-start-2"
        >
            <slot name="animation-content"></slot>
        </div>

        <!-- Teleport target for expanded timeline (content arrives via Teleport
             from AnimationControls). Desktop: aligned to the [rail] track (grid-column:
             rail) + [bottom] row — the expanded timeline is a vertical extension of
             the controls rail, inheriting --rail-width, NOT a full-grid-span
             surface (H.W3.S4 / a-demo-architecture F2). Mobile: the lone column at row 3. -->
        <div
            id="timeline-expanded-target"
            :class="[
                'timeline-expanded-cell row-start-3 z-dock overflow-hidden',
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
    isPaneIdle,
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

/* ── G8 (H.W10.S5) — the [stage]-track dock-safe containment PRIMITIVE ──
   The SINGLE dock-safe envelope for EVERY scene subject. The TOP ChromeDock
   (`fixed`) and the BOTTOM AnimationMenuBar (`fixed`) each occupy a
   --dock-band-reserve band that overlays the work-area's top/bottom edges (the
   work-area centers with `margin:auto`, so its edges sit at the optical
   top/bottom offset — INSIDE the fixed dock bands). The [stage]/[top]/[bottom]
   grid rows did NOT reserve those bands: [top] auto collapsed to 0 (the dock is
   out of flow) and [stage] 1fr spanned UNDER both docks. cube/amiga don't clip
   because their subjects CENTER in the cell (no edge to clip); the easing/spring
   stages STRETCH (`h-full`/`flex-1`) so their top edge ran under the top dock
   (the G8 clip). This reserves the dock band on the stage cell ITSELF —
   box-sizing:border-box + symmetric padding-block === --dock-band-reserve — so
   the stage SUBJECT is inset clear of BOTH dock bands, once, for every scene
   (DRY; no per-scene `dock-inset`). ZERO hardcoded numbers: the inset IS the
   existing cycle-free --dock-band-reserve token (dock-icon-height + dock-margin
   + safe-area-inset-bottom). The former per-scene `dock-inset` (bottom-only,
   so the top clipped) is DELETED with this — no legacy beside the replacement.
   This sits on .stage-cell (not the [top]/[bottom] grid rows) so the expanded
   timeline in the [bottom] row keeps its own `auto`-sized growth track. */
.stage-cell {
    box-sizing: border-box;
    padding-block: var(--dock-band-reserve);
}

@media (max-width: 1023px) {
    .controls-layout {
        align-content: center;
    }
}

/* ── Desktop: the named rail·stage·rail frame (H.W3.S4) ──
   ONE grid, one --rail-width token. The former 3-track
   [rail 1fr 1fr] grid (whose `1fr 1fr` siblings collapsed to 0px and forced
   the stage to span the whole grid) collapses to two named columns: [rail] is
   the controls rail + the expanded timeline; [stage] is the centered subject.
   The open/close axis IS the [rail] track width (var(--rail-width) ↔ 0) —
   this REPLACES the deleted translateX(-110%) overlay slide (no legacy beside
   replacement, WV-W3-HIGH-2). Closing the pane collapses [rail] to 0 and the
   stage reflows to fill the freed width. Rows: [top] auto (reserved for the
   H.W4 hero / dock, F7) · [stage] 1fr (the main content) · [bottom] auto (the
   expanded timeline + the fixed menubar's reserve). */
@media (min-width: 1024px) {
    .controls-layout {
        --rail-track: var(--rail-width);
        grid-template-columns: [rail] var(--rail-track) [stage] 1fr;
        grid-template-rows: [top] auto [stage] 1fr [bottom] auto;
        transition: grid-template-columns var(--duration-slow) var(--spring-snappy);
    }
    .controls-layout--closed {
        --rail-track: 0px;
    }

    /* The controls pane occupies the [rail] track, the [stage] content row. */
    .controls-layout > :deep(.controls-pane-wrapper) {
        grid-column: rail;
        grid-row: stage;
    }

    /* The subject gets its OWN [stage] track (the former full-grid stage span
       is deleted). */
    .stage-cell {
        grid-column: stage;
        grid-row: stage;
    }

    /* The expanded timeline is a vertical extension of the rail: [rail] track,
       [bottom] row (not a full-grid span). */
    .timeline-expanded-cell {
        grid-column: rail;
        grid-row: bottom;
    }
}
</style>
