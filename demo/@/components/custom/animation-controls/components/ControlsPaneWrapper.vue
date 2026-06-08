<template>
    <div
        v-show="storedControls.selectedAnimation && !hideControls"
        @transitionend="onPanelTransitionEnd"
        :class="[
            'controls-pane-wrapper col-start-1 row-start-1 min-w-0 relative z-controls',
            'controls-pane--mobile',
            storedControls.isControlsPanelOpen
                ? 'controls-pane--open'
                : 'controls-pane--closed',
            isPaneHovered ? 'controls-pane--hovered' : '',
            isPaneIdle ? 'controls-pane--idle' : '',
        ]"
    >
        <div
            :ref="(el: any) => setPaneEl(el)"
            @mouseenter="onPaneMouseEnter"
            @mouseleave="onPaneMouseLeave"
            :class="[
                'controls-pane group/controls min-w-0',
                isPanelTransitionDone && storedControls.isControlsPanelOpen
                    ? 'overflow-y-auto'
                    : 'overflow-hidden',
                scrollFadeClass,
            ]"
        >
            <div class="controls-content h-full flex flex-col">
                <template
                    v-for="[name, groupObject] in Object.entries(
                        animationGroup.animations,
                    )"
                >
                    <div v-show="storedControls.selectedAnimation == name">
                        <AnimationControls
                            :ref="(el: any) => { if (el) animControlRefs[name] = el }"
                            @slider-update="(v) => emit('sliderUpdate', v)"
                            @keyframes-update="(v) => emit('keyframesUpdate', v)"
                            @toggle-play="emit('togglePlay')"
                            @layer-config-update="
                                (v) => emit('layerConfigUpdate', name, v)
                            "
                            @scrub-start="emit('scrubStart')"
                            @scrub-end="emit('scrubEnd')"
                            :animation="groupObject.animation"
                            :is-playing="isPlaying"
                            :layer-config="groupObject.layer"
                            :active="storedControls.selectedAnimation == name"
                        >
                            <template #tabs-trigger>
                                <slot
                                    name="tabs-trigger"
                                    :selected-animation="
                                        storedControls.selectedAnimation
                                    "
                                    :is-playing="isPlaying"
                                ></slot>
                            </template>

                            <template #tabs-content>
                                <slot
                                    name="tabs-content"
                                    :selected-animation="
                                        storedControls.selectedAnimation
                                    "
                                    :is-playing="isPlaying"
                                ></slot>
                            </template>
                        </AnimationControls>
                    </div>
                </template>

                <!-- Persistent controls ribbon -->
                <RibbonBar
                    v-if="storedControls.selectedAnimation"
                    :stored-controls="storedControls"
                    :active-keyframes-ref="activeKeyframesRef"
                    :active-timeline-ref="activeTimelineRef"
                >
                    <template #ribbon-content="{ selectedControl }">
                        <slot
                            name="ribbon-content"
                            :selected-control="selectedControl"
                        ></slot>
                    </template>
                </RibbonBar>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { AnimationGroup } from "@src/animation/group";
import type { AnimationLayerConfig } from "@src/animation/constants";
import type { Animation } from "@src/animation/engine";
import type { StoredAnimationGroupControlOptions } from "../stores";
import AnimationControls from "../controls/AnimationControls.vue";
import RibbonBar from "./RibbonBar.vue";

defineProps<{
    animationGroup: AnimationGroup<any>;
    storedControls: StoredAnimationGroupControlOptions;
    hideControls?: boolean;
    isPlaying: boolean;
    animControlRefs: Record<string, any>;
    activeKeyframesRef: any;
    activeTimelineRef: any;
    // Layout reactivity (from useControlsLayout) — passed in so the shell
    // stays a thin layout host and the parent owns the composable lifecycle.
    isPanelTransitionDone: boolean;
    isPaneHovered: boolean;
    isPaneIdle: boolean;
    scrollFadeClass: string;
    onPanelTransitionEnd: (e: TransitionEvent) => void;
    onPaneMouseEnter: () => void;
    onPaneMouseLeave: () => void;
    // Forwards the inner scrollable pane element up to the parent's
    // useScrollFade (the composable owner). The wrapper renders the element;
    // the parent measures it.
    setPaneEl: (el: HTMLElement | null) => void;
}>();

const emit = defineEmits<{
    (e: "sliderUpdate", val: { t: number; animation: Animation<any> }): void;
    (e: "keyframesUpdate", val: { animation: Animation<any> }): void;
    (e: "togglePlay"): void;
    (
        e: "layerConfigUpdate",
        name: string,
        val: Partial<AnimationLayerConfig>,
    ): void;
    (e: "scrubStart"): void;
    (e: "scrubEnd"): void;
}>();
</script>

<style scoped>
/* ── Mobile: grid-template-rows drives height, opacity fades ── */
.controls-pane-wrapper {
    display: grid;
    /* Half dock-margin above dock + dock height + half dock-margin gap */
    margin-top: calc(var(--dock-margin) + var(--dock-icon-height));
    /* Fill viewport minus top dock area and bottom menubar */
    max-height: calc(
        100dvh - var(--dock-margin) - var(--dock-icon-height) -
            var(--dock-menubar-reserve)
    );
}
.controls-pane-wrapper.controls-pane--open {
    grid-template-rows: 1fr;
    transition: grid-template-rows var(--duration-panel) var(--ease-out);
}
.controls-pane-wrapper.controls-pane--closed {
    grid-template-rows: 0fr;
    pointer-events: none;
    transition: grid-template-rows var(--duration-panel) var(--ease-standard);
}
.controls-pane {
    min-height: 0;
    transition: opacity var(--duration-panel) var(--ease-standard);
}
.controls-pane--open .controls-pane {
    opacity: 1;
}
.controls-pane--closed .controls-pane {
    opacity: 0;
}

/* ── Desktop: the [rail]-track collapse IS the open/close axis ──
   H.W3.S4 (WV-W3-HIGH-2): the former translateX(-110%) overlay slide is
   DELETED — the pane no longer slides over a centered stage. The grid's
   [rail] track (AnimationControlsGroup) collapses var(--rail-width) ↔ 0 and
   the stage reflows into the freed width; the pane is a real grid column, not
   an overlay. The wrapper clips its fixed-width content as the track shrinks
   (overflow:hidden), the content fades (opacity), and pointer-events drop when
   closed so the collapsed rail captures nothing. No legacy beside replacement. */
@media (min-width: 1024px) {
    .controls-pane-wrapper {
        max-height: none;
        max-width: none;
        margin-top: 0;
        padding-inline: 0;
        display: block;
        /* Clip the fixed-width .controls-content as the [rail] track collapses. */
        overflow: hidden;
    }
    .controls-pane-wrapper.controls-pane--open {
        pointer-events: auto;
        /* Compose the idle-fade opacity transition WITH the open/close
           grid-template-rows transition (F9 — the rest-dim animates; the rows
           are stable at 1fr while open so this is additive, not a re-time). The
           transition lives on the --open selector so it out-specifies the base
           rule and is never clobbered by the open/close state's own transition. */
        transition:
            grid-template-rows var(--duration-panel) var(--ease-out),
            opacity var(--duration-normal) var(--ease-standard);
    }
    .controls-pane-wrapper.controls-pane--closed {
        pointer-events: none;
    }
    .controls-pane--open .controls-pane {
        opacity: 1;
        transition: opacity var(--duration-normal) var(--ease-out);
    }
    .controls-pane--closed .controls-pane {
        opacity: 0;
        transition: opacity var(--duration-fast) var(--ease-in);
    }

    /* ── F9 (H.W9.S6) — the controls idle-fade (restoration) ──
       After IDLE_MS (10s) of GLOBAL window inactivity the OPEN pane rest-dims
       to --controls-idle-opacity, restoring the historical rest-dim the D-era
       refactor dropped (the .controls-pane--hovered class was left vestigial).
       `useIdle` (usePaneHover.ts) owns the WHEN; CSS owns the magnitude +
       transition (above) + the instant lift. The `:not(.controls-pane--hovered)`
       guard keeps the 2s hover-linger lit past the threshold while the cursor
       rests on the pane; :hover / :focus-within lift it to full opacity at once
       — :focus-within is a NAMED a11y improvement over the historical form (a
       keyboard user tabbing in is never left on a ghosted surface). Desktop only
       (the dim is a rail-pane affordance; the mobile drawer is dismissed, not
       dimmed). opacity is compositor-thread (cheap fade). */
    .controls-pane-wrapper.controls-pane--idle:not(.controls-pane--hovered) {
        opacity: var(--controls-idle-opacity, 0.35);
    }
    .controls-pane-wrapper:hover,
    .controls-pane-wrapper:focus-within {
        opacity: 1;
    }

    .controls-content {
        /* Couples to the grid's [rail] track (AnimationControlsGroup) via the
           --rail-width token — the pane IS exactly the rail width (the single
           width authority, H.W3.S3), not a floor that can stretch. box-sizing:
           border-box keeps the shadow-clearance padding inside the budget. */
        width: var(--rail-width);
        box-sizing: border-box;
        /* ── F7 (H.W9.S2) — symmetric shadow-clearance so the cartoon stamp
           clears the wrapper's load-bearing overflow:hidden ──
           The cartoon offset shadow casts bottom-LEFT (--shadow-cartoon-md
           -4px 3px; --shadow-cartoon-lg -6px 4px on hover/focus; +--lift-sm
           -1px hover translate → ~8px left extent worst case). The wrapper's
           overflow:hidden (load-bearing for the [rail]-track collapse — KEEP it)
           clips anything outside this content box. The demo already budgeted
           clearance RIGHT + BOTTOM but the shadow throws LEFT → the bottom-LEFT
           lobe was sliced. Adding padding-LEFT renders the shadow INSIDE the
           padded box so the clip never reaches it. Reconcile, don't fork — keep
           the clip, give the shadow room (the crisp Memphis stamp is intended;
           the slice was the defect). */
        padding-left: 12px;
        padding-right: 12px;
        padding-bottom: 12px;
    }
}

/* ── F9 PRM guard — snap, don't animate the idle-fade ──
   MANDATORY reduced-motion guard (modern-web css §9 — case-by-case, not a
   global 0.01ms). Under PRM the idle dim still APPLIES (it is an opacity rest
   state, legibility-preserving) but the WRAPPER's opacity transition snaps — so
   a motion-sensitive user gets the dim instantly, no fade. Scoped to the desktop
   idle context; the grid-template-rows open/close transition is already
   PRM-neutralized by glass-ui's global bracket (it restricts transition-property
   to opacity/color/bg/border/shadow under PRM), so we restore the --open
   transition to grid-only (dropping the opacity term) rather than killing all
   transitions (which would re-enable the otherwise-neutralized rows animation). */
@media (min-width: 1024px) and (prefers-reduced-motion: reduce) {
    .controls-pane-wrapper.controls-pane--open {
        transition: grid-template-rows var(--duration-panel) var(--ease-out);
    }
}

/* ── Mobile vertical scroll fade ── */
@media (max-width: 1023px) {
    /* Fill available width with side margins on mobile */
    .controls-pane-wrapper {
        max-width: min(440px, 100dvw);
        margin-inline: auto;
        padding-inline: 0.75rem;
    }

    /* The scroll-fade mask degrades to un-faded (fully visible) content on a
       browser without mask-image support — graceful, not broken (D.W3.S3). The
       fade magnitude reads the single-sourced --mask-fade token (G.W10.S5 — the
       former local --mask-fade-width shadow is collapsed).
       scroll-fade-both aliases scroll-fade-y (composable uses -both suffix). */
    @supports (-webkit-mask-image: linear-gradient(#000, #000)) or
        (mask-image: linear-gradient(#000, #000)) {
        .scroll-fade-both {
            mask-image: linear-gradient(
                to bottom,
                transparent,
                black var(--mask-fade),
                black calc(100% - var(--mask-fade)),
                transparent
            );
            -webkit-mask-image: linear-gradient(
                to bottom,
                transparent,
                black var(--mask-fade),
                black calc(100% - var(--mask-fade)),
                transparent
            );
        }
    }
}
</style>
