<template>
    <TooltipProvider :delay-duration="100" :skip-delay-duration="0">
    <div
        :class="[
            'controls-layout justify-items-stretch items-start relative',
            `controls-layout--stage-${stageMode}`,
            storedControls.isControlsPanelOpen ? 'controls-layout--open' : 'controls-layout--closed',
        ]"
        v-bind="$attrs"
    >
        <ControlsPaneWrapper
            :animation-group="animationGroup"
            :stored-controls="storedControls"
            :hide-controls="hideControls"
            :stage-mode="stageMode"
            :is-playing="isPlaying"
            :anim-control-refs="animControlRefs"
            :active-keyframes-ref="activeKeyframesRef"
            :active-timeline-ref="activeTimelineRef"
            :is-panel-transition-done="isPanelTransitionDone"
            :is-pane-hovered="isPaneHovered"
            :is-pane-idle="isPaneIdle"
            :scroll-fade-class="scrollFadeClass"
            :on-panel-transition-end="onPanelTransitionEnd"
            :on-sheet-settled="onSheetSettled"
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

        <!-- Animation stage.
             MOBILE (H.W7.S1): the stage LEAVES the grid — `position: fixed;
             inset: 0`, z BELOW z-controls, honoring --work-area-top-offset /
             --dock-band-reserve so the subject parks in the dock-free band and
             is the full-bleed BACKGROUND the controls sheet overlays (no longer
             a 1fr row the open pane starves to ~30px). The former mobile
             `row-start-2` grid placement is DELETED — the stage is no longer a
             grid item on mobile (WV-W7-MED-2: the SHEET rides the --rail-width
             token; the stage takes the fixed full-bleed layer).
             DESKTOP (H.W3.S4): the stage gets its OWN named [stage] track
             (column 2, the 1fr remainder beside the [rail] track). The rail and
             stage are DISJOINT columns: the controls pane occupies [rail] and the
             subject centers in [stage]; closing the pane collapses [rail] to 0 and
             the stage reflows to fill the freed width. The proof:stage-not-clipped
             gate's "cube half-clipped" invariant is the subject. -->
        <div
            class="stage-cell justify-self-stretch self-center min-h-0 h-full overflow-visible overscroll-contain"
        >
            <slot name="animation-content"></slot>
        </div>

        <!-- Teleport target for expanded timeline (content arrives via Teleport
             from AnimationControls). Desktop: aligned to the [rail] track
             (grid-column: rail) + [bottom] row — a vertical extension of the
             controls rail, inheriting --rail-width, NOT a full-grid-span surface
             (H.W3.S4 / a-demo-architecture F2). Mobile (H.W7.S1): the expanded
             timeline is `position: fixed`, anchored ABOVE the bottom menubar band
             — it folds OUT of grid flow so it NEVER re-introduces a third
             consuming row that re-starves the fixed full-bleed stage (the
             single-stage-model invariant). -->
        <div
            id="timeline-expanded-target"
            :class="[
                'timeline-expanded-cell z-dock overflow-hidden',
                'transition-[max-height,opacity] duration-slow ease-standard',
                storedControls.isTimelineExpanded
                    ? 'max-h-[var(--panel-max-h)] border-t border-border/50 glass-wash px-4 py-3'
                    : 'max-h-0',
            ]"
        ></div>

        <!-- Bottom transport dock — hidden when no animation scene is active.
             (J.W2 S4 / CD-1: the menubar-era name is renamed to TransportDock —
             the rename the D FINAL claimed; the component's ROLE was already
             the transport dock, only the name lagged.) -->
        <TransportDock
            ref="transportDockRef"
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
import TransportDock from "./TransportDock.vue";

import {
    getStoredAnimationGroupControlOptions,
    resetAllStores,
} from "./stores";
import { AnimationGroup } from "@src/animation/group";
import { registerShortcut } from "@mkbabb/glass-ui/keyboard";
import { useAnimationGroupPlayback } from "./composables/useAnimationGroupPlayback";
import { useAnimationProgress } from "./composables/useAnimationProgress";
import { useControlsLayout } from "./composables/useControlsLayout";

const { superKey, animationGroup, autoPlay, hideControls, stageMode } = defineProps<{
    animationGroup: AnimationGroup<any>;
    superKey?: string;
    autoPlay?: boolean;
    hideControls?: boolean;
    // The mobile STAGE mode-class (H.W7.S1c) — drives the per-mode overlay
    // register: `subject` full-bleeds the fixed stage (cube/amiga/square),
    // `editor`/`storyboard` keep a content card. Forwarded down to the sheet
    // wrapper so the visible-fraction floor applies to `subject` alone.
    stageMode?: "subject" | "editor" | "storyboard";
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
        storedControls.selectedAnimation = null;
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
} = useAnimationGroupPlayback(() => animationGroup, storedControls, emit);

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
    onSheetSettled,
    isPaneHovered,
    isPaneIdle,
    onPaneMouseEnter,
    onPaneMouseLeave,
    scrollFadeClass,
} = useControlsLayout(storedControls, controlsPaneEl);

const transportDockRef = useTemplateRef<InstanceType<typeof TransportDock>>("transportDockRef");

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
    storedControls.selectedAnimation = null;
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
registerShortcut("R", () => { transportDockRef.value?.resetIconSpin(); reset(); }, { label: "Reset animation", group: "Playback" });
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
   (`fixed`) and the BOTTOM TransportDock (`fixed`) each occupy a
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

/* ── MOBILE (H.W7.S1) — the stack→overlay transposition ──
   The mobile `grid-rows-[auto_1fr_auto]` stack is DELETED (no legacy beside the
   replacement). The stage LEAVES the layout flow and becomes the full-bleed
   FIXED background; the controls pane becomes a bottom SHEET overlaying it
   (ControlsPaneWrapper.vue). The `.controls-layout` root is no longer a 3-row
   grid on mobile — it is a passive positioning context whose only mobile job is
   to host the fixed children. */
@media (max-width: 1023px) {
    /* The layout root's children (stage + sheet + expanded-timeline) are all
       `fixed` on mobile, so it carries no in-flow content; centering is a no-op. */
    .controls-layout {
        align-content: center;
    }

    /* The stage is the FULL-BLEED FIXED BACKGROUND. `inset: 0` fills the
       viewport; the G8 dock-safe primitive (the SHARED `.stage-cell`
       `padding-block: var(--dock-band-reserve)` rule above — KEPT, not forked)
       insets the SUBJECT clear of BOTH affixed dock bands, so it parks in the
       dock-free band and is ALWAYS visible behind the partial sheet. Reusing the
       G8 padding-block (not a fixed top/bottom inset) keeps the ONE dock-safe
       containment primitive (proof:stage-within-docks) — the mobile fixed layer
       and the desktop grid cell share the SAME reserve mechanism (DRY). The box
       is `box-sizing:border-box` (the G8 rule) so the padding sits INSIDE the
       full-viewport frame. z-content (below z-controls, the sheet). NO
       transform/contain/perspective on this element or its ancestors (verified)
       so `fixed` resolves against the viewport (proof:dock-zorder LOW-1). */
    .stage-cell {
        position: fixed;
        inset: 0;
        /* `inset:0` DEFINES the box (full viewport); override the utility
           `h-full` (height:100% would re-assert a viewport box but `inset` is the
           authority) and `self-center`/`justify-self-stretch` (grid-item
           alignment makes a fixed box content-sized + centered → `stretch` to
           fill, so the subject centers WITHIN the padded full-bleed frame). */
        height: auto;
        align-self: stretch;
        justify-self: stretch;
        z-index: var(--z-content, 10);
        /* The orbit surface keeps `touch-action: none` (OrbitalDrag/AmigaScene
           own it on their own roots); this cell is a passive frame, so the swipe
           is owned by the sheet GRAB HANDLE — spatially disjoint (BLK-6). */
    }

    /* The expanded-timeline teleport target FOLDS OUT of grid flow on mobile —
       `position: fixed`, anchored ABOVE the bottom menubar band, full-bleed
       width. It NEVER re-introduces a third consuming row (the single-stage-model
       invariant): collapsed it is `max-h-0` (invisible), expanded it grows
       upward from the menubar anchor. z-dock so it sits above the fixed stage
       but it does NOT overlap the menubar's own controls (anchored just above
       the reserve). */
    .timeline-expanded-cell {
        position: fixed;
        left: 0;
        right: 0;
        bottom: var(--dock-menubar-reserve);
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
        /* `display: grid` is set HERE (desktop only) — the former unconditional
           `grid` utility class on the root was DELETED with the mobile-stack
           transposition (H.W7.S1), since mobile no longer uses a grid (the stage
           is fixed, the sheet is fixed). Desktop keeps the named rail·stage·rail
           grid. */
        display: grid;
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
