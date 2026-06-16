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

    </TooltipProvider>

    <!-- The document-level singletons (rainbow-gradient SVG defs + the Toaster
         teleport) live in the colocated DemoGlobalChrome sub-component — they
         resolve against the DOCUMENT, not this layout grid (the J.W7a
         fix-round proof:demo-no-oversize seam; zero appearance delta). -->
    <DemoGlobalChrome />
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, useTemplateRef, watch, watchEffect } from "vue";

import { TooltipProvider } from "@mkbabb/glass-ui";

import ControlsPaneWrapper from "./components/ControlsPaneWrapper.vue";
import DemoGlobalChrome from "./components/DemoGlobalChrome.vue";
import TransportDock from "./TransportDock.vue";

import { getStoredAnimationGroupControlOptions } from "./stores";
import { AnimationGroup } from "@src/animation/group";
import { useAnimationGroupActions } from "./composables/useAnimationGroupActions";
import { useControlsKeyboardShortcuts } from "./composables/useControlsKeyboardShortcuts";
import { useAnimationGroupPlayback } from "./composables/useAnimationGroupPlayback";
import { useAnimationProgress } from "./composables/useAnimationProgress";
import { useControlsLayout } from "./composables/useControlsLayout";

const { superKey, animationGroup, autoPlay, hideControls, stageMode, hasControlSurfaces = true } = defineProps<{
    animationGroup: AnimationGroup<any>;
    superKey?: string;
    autoPlay?: boolean;
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
    getActiveT,
    scrubActive,
    cycleAnimation,
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

<style scoped>
.controls-layout {
    width: min(100dvw, var(--work-area-max-width, 100dvw));
    height: min(100dvh, var(--work-area-max-height, 100dvh));
    max-width: 100dvw;
    max-height: 100dvh;
    margin: auto;
    /* K.W3 M2 — the macro grid becomes a CONTAINER (the existing-idiom promotion:
       the micro tier already uses container queries at TimingFunctionPanel.vue +
       style.css:.container-inline-size, and subgrid at .labeled-field-grid; this
       promotes the SAME mechanism to the macro tier). `inline-size` ONLY (NOT
       `size`/both-axes): the block-size is already definite here (height:
       min(100dvh, --work-area-max-height)), and `size` would collapse descendants
       with no definite block-size (modern-web css-layout §4 "Do not"). Two jobs:
       (1) the desktop/mobile FORK below queries this box via @container instead of
       @media (min/max-width) — the macro tier reads ITS box, not the viewport;
       (2) the DESCENDANT cqi/cqb consumers resolve against the clamped work-area
       card — M1's --rail-width clamp(20rem, 26cqi, 30rem) on `.controls-content`
       and C6's --target-viewport-w/h: 30cqi/30cqb on the cube-target loader both
       now track the card, not the raw viewport. */
    container-type: inline-size;
    container-name: controls-layout;

    /* K.W3 M1+M2+M4 — the named rail·stage·rail grid (H.W3.S4) is the
       UNCONDITIONAL base: `display: grid` + the template resolve at every width
       (mobile's children override to `position: fixed` in the @container fork
       below, so the grid is inert there — no in-flow items). The template MUST be
       unconditional because `.controls-layout` is itself the container
       (container-type above) and an element can NOT match its own @container
       query — so a desktop-only `@container (min-width:64rem)` on THIS element's
       own `display`/template would never apply. The mobile transposition (to the
       fixed bottom-sheet + full-bleed stage overlay) is the @container-gated
       FORK (the @media → @container conversion lands on the MOBILE deviation,
       which targets DESCENDANTS that CAN query their ancestor container — the
       former @media (max-width:1023px) viewport fork DIES with it).
         • [rail] var(--rail-track): the DERIVED --rail-width clamp (20rem floor,
           26cqi tracking the work-area card, 30rem ceiling — no fixed 400px). The
           open/close axis is the [rail] track between var(--rail-width) and 0px
           (PRESERVED — only the open-width literal changed from 400px to the
           clamp).
         • [stage] minmax(0, 1fr): the SUBJECT GROWS into the M4 surplus past the
           lifted C2/C3 ceilings (center-card-with-growing-stage — the rail stays
           bounded chrome, the stage is content). minmax(0,1fr) (not bare 1fr)
           lets the stage shrink below its content min so a wide subject never
           forces horizontal overflow of the card. */
    display: grid;
    --rail-track: var(--rail-width);
    grid-template-columns: [rail] var(--rail-track) [stage] minmax(0, 1fr);
    grid-template-rows: [top] auto [stage] 1fr [bottom] auto;
    transition: grid-template-columns var(--duration-slow) var(--spring-snappy);
}

/* The open/close + railless track-collapse (the [rail] track between
   var(--rail-width) and 0px) — UNCONDITIONAL beside the base template it drives
   (H.W3.S4; J.W7a XH-1 ghost-rail collapse). On mobile the children are fixed,
   so a collapsed/held rail track is inert there. */
.controls-layout--closed {
    --rail-track: 0px;
}
.controls-layout--railless {
    --rail-track: 0px;
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

/* ── MOBILE — the stack→overlay transposition (H.W7.S1) ──
   The mobile `grid-rows-[auto_1fr_auto]` stack is DELETED (no legacy beside the
   replacement). The stage LEAVES the layout flow and becomes the full-bleed
   FIXED background; the controls pane becomes a bottom SHEET overlaying it
   (ControlsPaneWrapper.vue). The `.controls-layout` root is no longer a 3-row
   grid on mobile — it is a passive positioning context whose only mobile job is
   to host the fixed children.

   K.W3 M2 (the @media-vs-@container SEAM, resolved by relationship): the
   DESKTOP rail·stage PLACEMENT fork is a @container query (below — the component
   reads ITS box, the existing-idiom promotion). The MOBILE full-bleed
   transposition stays @media (max-width: 1023px) because it is a VIEWPORT
   relationship, NOT a container one: the stage goes `position: fixed; inset: 0`
   to fill the VIEWPORT (not its container), and the sheet anchors to the
   viewport's bottom — modern-web css-layout §4's own rule ("container queries =
   component context; media queries = global page layout / the viewport-filling
   layer"). So the @media fork that DIED is the desktop one (→ @container); the
   mobile full-bleed-to-viewport keeps @media, the correct query for a
   viewport-relative layer (and the proof:mobile-single-page S1 contract). */
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
        /* J.W7a S5 / XH-4 (D22) — the mobile inset reserves the REAL
           scene-switcher band, not just the band depth: the pill is anchored at
           --dock-top-anchor below the viewport top (ChromeDock consumes the SAME
           token), so the band it occupies = anchor + --dock-band-reserve. The
           former reserve counted only the depth term and let stage-level chrome
           (the easing metric header strip, the spring view toggle) rise INTO
           the pill's band (cross-hierarchy #4). The top-center band now has ONE
           occupant — the scene-switcher — by construction. The reserve stays
           SYMMETRIC (the G8 one-envelope contract, proof:stage-within-docks):
           the bottom edge takes the same enlarged band, which also lifts the
           centred subjects clear of the bottom transport pill.

           J.WZ (S1 stage-rect-invariant): the reserve reads the STABLE band
           (--dock-top-band-reserve-stable, peak-derived) NOT the live
           --dock-top-band-reserve. The live token folds --menubar-measured-h,
           which oscillates ±8px as the bottom sheet toggles (the GlassDock
           reflows) — feeding it into THIS fixed full-bleed frame's padding-block
           SHIFTED the stage rect on every open/close (proof:mobile-single-page
           clause (b)). The stable token only ever grows, so the frame holds still;
           the sheet anchor (ControlsPaneWrapper) keeps the live token so it still
           clears the menubar the user sees (proof:live-session-mobile). */
        padding-block: var(--dock-top-band-reserve-stable);
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

/* ── Desktop: the named rail·stage·rail item PLACEMENTS (H.W3.S4; K.W3 M2) ──
   The grid + the named template themselves are the UNCONDITIONAL base (above —
   an element can't match its own @container query). What is genuinely
   desktop-only is the PLACEMENT of the children INTO the named cells: the pane
   in [rail], the subject in [stage], the timeline in [rail]/[bottom]. These
   target DESCENDANTS of `.controls-layout`, which CAN query their ancestor
   container — so the @media (min-width:1024px) → @container (min-width:64rem)
   promotion lands HERE (the macro tier reads ITS box). On mobile (the
   @container max-width:64rem fork above) these same children override to
   `position: fixed`, leaving grid flow, so these placements are inert there. */
@container controls-layout (min-width: 64rem) {
    /* The controls pane occupies the [rail] track, the [stage] content row. */
    .controls-layout > :deep(.controls-pane-wrapper) {
        grid-column: rail;
        grid-row: stage;
    }

    /* The subject gets its OWN [stage] track (the former full-grid stage span
       is deleted). K.W3 M3 — the stage cell publishes `anchor-name: --stage` so
       the docks can TETHER to its (clamped) rect under @supports
       (anchor-name: --x) — the forward-idiom enhancement over the always-correct
       bounded-min() anchor floor (style.css). anchor-name is inert where
       unsupported (the docks fall back to the capped --dock-*-anchor offset), so
       this is a pure progressive enhancement, never a re-layout. */
    .stage-cell {
        grid-column: stage;
        grid-row: stage;
        anchor-name: --stage;
    }

    /* The expanded timeline is a vertical extension of the rail: [rail] track,
       [bottom] row (not a full-grid span). */
    .timeline-expanded-cell {
        grid-column: rail;
        grid-row: bottom;
    }
}
</style>
