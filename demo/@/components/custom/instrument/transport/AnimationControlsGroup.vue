<template>
    <TooltipProvider :delay-duration="100" :skip-delay-duration="0">
    <div
        :class="[
            'controls-layout justify-items-stretch items-start relative',
            `controls-layout--stage-${stageMode}`,
            storedControls.isControlsPanelOpen ? 'controls-layout--open' : 'controls-layout--closed',
            hasControlSurfaces ? '' : 'controls-layout--railless',
        ]"
        v-bind="$attrs"
    >
        <!-- SQ-T3 (T.B4 / lane 04 rec 3) — no chrome without content: the pane
             wrapper mounts IFF the scene's control-surface DFA set is non-empty
             (`hasControlSurfaces` = surfacesFor(scene).length > 0). home + any
             empty-set scene render ZERO `.controls-pane-wrapper` nodes — the
             mobile-sheet occlusion recurrence (an empty sheet with a grab handle
             over a void) cannot mount. proof:panel-naked-rail asserts this. -->
        <ControlsPaneWrapper
            v-if="hasControlSurfaces"
            :animation-group="animationGroup"
            :channels="channels"
            :stored-controls="storedControls"
            :hide-controls="hideControls"
            :stage-mode="stageMode"
            :is-playing="isPlaying"
            :anim-control-refs="animControlRefs"
            :active-keyframes-ref="activeKeyframesRef"
            :active-timeline-ref="activeTimelineRef"
            :extra-tabs="extraTabs"
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

        <!-- Bottom transport dock — T.C2: the transport MOUNTS iff the scene
             exposes ≥1 painting channel (`transportNames.length > 0`). Home derives
             `transportNames = []` (no facility, empty group), so the transport does
             NOT render — home is COMPASS ONLY (VERDICT #6, shot 06: the orphaned
             home transport cluster is deleted at the root; the start-screen CTA
             lives in the start screen). Coordinates with T.B2 (home → [] channels).
             (J.W2 S4 / CD-1: the menubar-era name is renamed to TransportDock.) -->
        <TransportDock
            v-if="transportNames.length > 0"
            ref="transportDockRef"
            :stored-controls="storedControls"
            :is-playing="isPlaying"
            :is-started="isStarted"
            :animation-progress="animationProgress"
            :animation-names="transportNames"
            @toggle-play="toggleAnimationGroup"
            @reset="(all: boolean) => all ? clear() : reset()"
            @select-animation="onSelectAnimation"
            @expand-timeline="(v) => { storedControls.isTimelineExpanded = v; }"
        />
    </div>

    </TooltipProvider>

    <!-- The document-level singletons (rainbow-gradient SVG defs + the Toaster
         teleport) live in the colocated DemoGlobalChrome sub-component — they
         resolve against the DOCUMENT, not this layout grid (the J.W7a
         fix-round proof:demo-no-oversize seam; zero appearance delta). -->
    <DemoGlobalChrome />
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, useTemplateRef, watchEffect } from "vue";

import { TooltipProvider } from "@mkbabb/glass-ui";
import type { SegmentedTabOption } from "@mkbabb/glass-ui/tabs";

import ControlsPaneWrapper from "./components/ControlsPaneWrapper.vue";
import DemoGlobalChrome from "./components/DemoGlobalChrome.vue";
import TransportDock from "./TransportDock.vue";

import { getStoredAnimationGroupControlOptions } from "@state";
import type { AnimationGroup, KeyframesAnimation } from "@mkbabb/keyframes.js";
import type { TransportChannel } from "./transportSource";
import { useAnimationGroupActions } from "./composables/useAnimationGroupActions";
import { useControlsKeyboardShortcuts } from "./composables/useControlsKeyboardShortcuts";
import { useAnimationGroupPlayback } from "./composables/useAnimationGroupPlayback";
import { useAnimationProgress } from "./composables/useAnimationProgress";

const { superKey, animationGroup, channels, autoPlay, hideControls, stageMode, hasControlSurfaces = true, extraTabs } = defineProps<{
    animationGroup: AnimationGroup<any>;
    // T.B1-β STAGE 1 — the active scene's `SceneFacility.channels`. When
    // present, they ARE the transport axis (select labels, host mounts, the
    // selection/validation set, the scrub round-trip — the honest channel set);
    // `undefined` falls back to the group's animation keys (a non-migrated scene /
    // a standalone host).
    channels?: TransportChannel[];
    superKey?: string;
    autoPlay?: boolean;
    // T.B8 — the `machinePlaying` prop is RETIRED. `useAnimationGroupPlayback`
    // now projects `isPlaying` directly off `machine.status` (the single
    // authority), so there is no private shadow ref to sync to the machine — the
    // S.A0 stale-`false` cold-race the prop cured is impossible by construction.
    hideControls?: boolean;
    // The mobile STAGE mode-class (H.W7.S1c) — drives the per-mode overlay
    // register: `subject` full-bleeds the fixed stage (cube/amiga/square),
    // `editor`/`storyboard` keep a content card. Forwarded down to the sheet
    // wrapper so the visible-fraction floor applies to `subject` alone.
    stageMode?: "subject" | "editor" | "storyboard";
    // J.W7a S5 / XH-1 (D20) — does the active scene's control-surface DFA set
    // contain ANY surface? `false` (the empty-DFA scenes: sequence/motion-path)
    // COLLAPSES the desktop [rail] track to 0 regardless of the stored open
    // flag, so the hollow 400px ghost rail (the vacant grab-pill card over a
    // void) cannot render — the stage reflows to fill. The MOBILE sheet axis is
    // untouched (the H.W7 single-page model keeps its peek shell). Threaded
    // from the App's machine projection (`controlSurfacesFor(activeScene)`);
    // defaults TRUE so a non-App host (the playground) keeps its rail.
    hasControlSurfaces?: boolean;
    // glass-ui 4.0.0 (BA.W-TABS) — standalone-host extra tabs (the playground's
    // "Assets" tab), forwarded down to AnimationControls' options-driven strip.
    // A scene-machine-driven host (the App) leaves this empty and rides the
    // machine's `extraControlTabs` projection instead.
    extraTabs?: SegmentedTabOption[];
}>();

const storedControls = getStoredAnimationGroupControlOptions(superKey);

// T.B1-β STAGE 1 — the transport axis: the facility's channels when the scene
// exposes them (the honest set), else the group's animation keys (the legacy
// path, for a non-migrated scene / a standalone host).
const transportNames = computed(
    () => channels?.map((c) => c.name) ?? Object.keys(animationGroup.animations),
);

/** The selected channel (facility scenes only; undefined on the group path). */
const selectedChannel = computed(() =>
    channels?.find((c) => c.name === storedControls.selectedAnimation),
);

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

// Validate stored selection — clear stale values via watchEffect (reacts to
// group/channel changes). T.B1-β STAGE 1: the valid-name set is the CHANNEL
// axis when the scene exposes one, else the group keys. Skip validation when
// the axis is empty (e.g. empty placeholder during init) to avoid clearing a
// valid localStorage selection before the real axis arrives.
watchEffect(() => {
    const validNames =
        channels?.map((c) => c.name) ?? Object.keys(animationGroup.animations);
    if (
        validNames.length > 0 &&
        storedControls.selectedAnimation &&
        !validNames.includes(storedControls.selectedAnimation)
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
    sliderUpdate: groupSliderUpdate,
    getActiveT: groupGetActiveT,
    scrubActive: groupScrubActive,
    cycleAnimation,
} = useAnimationGroupPlayback(() => animationGroup, storedControls, emit);

// T.B1-β STAGE 1 — the CHANNEL-capable scrub seam. A scrub whose animation is a
// facility channel's routes through THAT channel's `setProgress` (the uniform
// raf round-trip — the group cannot `setChildTime` an animation it does not
// hold); the group path is the fallback for group scenes / standalone hosts.
const sliderUpdate = (val: { t: number; animation: KeyframesAnimation<any> }) => {
    const ch = channels?.find(
        (c) => c.animation && c.animation.id === val.animation.id,
    );
    if (ch) {
        const dur = val.animation.options.duration ?? 1000;
        ch.setProgress(dur > 0 ? val.t / dur : 0);
        return;
    }
    groupSliderUpdate(val);
};

/** The selected axis-member's normalized t (channel first, group fallback). */
const getActiveT = (): number => {
    const ch = selectedChannel.value;
    if (ch) return Math.max(0, Math.min(1, ch.progress()));
    return groupGetActiveT();
};

/** Scrub the selected axis-member to a normalized fraction (channel first). */
const scrubActive = (fraction: number) => {
    const ch = selectedChannel.value;
    if (ch) {
        ch.setProgress(Math.max(0, Math.min(1, fraction)));
        return;
    }
    groupScrubActive(fraction);
};

const { animationProgress } = useAnimationProgress(
    () => animationGroup,
    isPlaying,
    () => channels,
);

// T.B8 — the two former resync watches (the `animationGroup`-change resync and
// the `machinePlaying` intent edge) are BOTH deleted: `isPlaying`/`isStarted`
// are machine-derived computeds now, so a group swap or a machine-initiated
// start settles them automatically — there is no shadow ref to re-seat.

// Auto-play on mount if requested (e.g. when navigating from home to a scene).
// Route through the machine (syncPlayState → PLAY) and gate on !isPlaying so a
// scene the machine already restored to playing is never toggled OFF.
onMounted(() => {
    if (
        autoPlay &&
        !isPlaying.value &&
        Object.keys(animationGroup.animations).length > 0
    ) {
        syncPlayState(true);
    }
});

const transportDockRef = useTemplateRef<InstanceType<typeof TransportDock>>("transportDockRef");

// The group-mutation action helpers (layer-config / keyframes-edit invalidate /
// reset / clear) live in the colocated useAnimationGroupActions composable (the
// K.WZ proof:demo-no-oversize seam; zero behavior change).
const { updateLayerConfig, keyframesUpdate, reset, clear } = useAnimationGroupActions({
    getGroup: () => animationGroup,
    storedControls,
    findAnimationGroupObject,
    syncPlayState,
});

// --- Keyboard shortcuts (colocated composable — the K.WZ proof:demo-no-oversize
// seam; zero behavior change). The action closures pass IN; the component still
// owns the playback/ref state they mutate. switchTab stays here: it drives the
// component-owned animControlRefs registry. The scrub/cycle actions live with
// the playback state they mutate — useAnimationGroupPlayback (getActiveT /
// scrubActive / cycleAnimation).
function switchTab(tab: string) {
    const name = storedControls.selectedAnimation;
    if (!name) return;
    const ctrl = animControlRefs[name];
    ctrl?.selectControl?.(tab);
}

useControlsKeyboardShortcuts({
    toggleAnimationGroup,
    reset,
    resetIconSpin: () => transportDockRef.value?.resetIconSpin(),
    getActiveT,
    scrubActive,
    cycleAnimation,
    switchTab,
    activeKeyframesRef,
    activeTimelineRef,
});

</script>

<style scoped src="./AnimationControlsGroup.css"></style>
