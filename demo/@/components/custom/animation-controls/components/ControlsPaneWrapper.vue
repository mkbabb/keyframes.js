<template>
    <div
        v-show="storedControls.selectedAnimation && !hideControls"
        @transitionend="onPanelTransitionEnd"
        :class="[
            'controls-pane-wrapper col-start-1 row-start-1 min-w-0 relative z-controls',
            'controls-pane--mobile',
            `controls-pane--stage-${stageMode}`,
            storedControls.isControlsPanelOpen
                ? 'controls-pane--open'
                : 'controls-pane--closed',
            isPaneHovered ? 'controls-pane--hovered' : '',
            isPaneIdle ? 'controls-pane--idle' : '',
        ]"
        :style="sheetStyle"
    >
        <!-- ── MOBILE GRAB HANDLE (H.W7.S1a / BLK-6) ──
             The DEDICATED, spatially-DISJOINT gesture surface that owns the
             sheet open/close swipe — extracted as the colocated SheetGrabHandle
             sub-component (markup + gesture engine + pill CSS travel together;
             the J.W0-S5 proof:demo-no-oversize seam). It v-models the same
             `sheetOpen` intent the spring below reads. -->
        <SheetGrabHandle
            v-show="!!storedControls.selectedAnimation && !hideControls"
            v-model:open="sheetOpen"
        />

        <!-- J.W7a S1 (D5 / C16 + C2) — on a desktop SUBJECT stage (cube/amiga/
             square: the subject floats full-bleed behind the chrome) the pane
             adopts the PUBLISHED `glass-wash` surface (the lightest tier of the
             glass ladder, translucent backdrop-blur) so the stage bleeds
             through and the subject wins hierarchy — "the fix is making the
             chrome visually lighter (glass-wash), not smaller" (pane-cube
             §design-hierarchy). The inner option cards keep their cartoon+quiet
             register; only the pane CONTAINER washes. Desktop-only by the
             reactive media query (the mobile sheet keeps its own card paint);
             editor/storyboard stages (contained plates) keep today's pane. -->
        <div
            ref="paneElRef"
            @mouseenter="paneMouseEnter"
            @mouseleave="paneMouseLeave"
            :class="[
                'controls-pane group/controls min-w-0',
                isPanelTransitionDone && storedControls.isControlsPanelOpen
                    ? 'overflow-y-auto'
                    : 'overflow-hidden',
                stageMode === 'subject' && isDesktop ? 'glass-wash rounded-card' : '',
                scrollFadeClass,
            ]"
        >
            <div class="controls-content h-full flex flex-col">
                <!-- J.W2 S2 — the v-for is KEYED by the animation name so an
                     AnimationControls instance is BORN with its animation (and
                     dies with it). Un-keyed, the group swap at SCENE_READY
                     patched the first instance IN PLACE with the new scene's
                     animation prop: its setup-captured per-superKey store stayed
                     the LEAVING scene's, and the (already-projected) watch source
                     never re-fired — so the single writer never wrote the new
                     scene's surface. Keyed, every scene entry gets a fresh host
                     whose immediate derivation-sync projects into ITS OWN store. -->
                <template
                    v-for="[name, groupObject] in Object.entries(
                        animationGroup.animations,
                    )"
                    :key="groupObject.animation.id"
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
                            :extra-tabs="extraTabs"
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
import type { AnimationGroup } from "@mkbabb/keyframes.js";
import type { AnimationLayerConfig } from "@mkbabb/keyframes.js";
import type { KeyframesAnimation } from "@mkbabb/keyframes.js";
import type { StoredAnimationGroupControlOptions } from "../stores";
import type { SegmentedTabOption } from "@mkbabb/glass-ui/tabs";
import { useTemplateRef } from "vue";
import AnimationControls from "../controls/AnimationControls.vue";
import RibbonBar from "./RibbonBar.vue";
import SheetGrabHandle from "./SheetGrabHandle.vue";
import { useSheetState } from "../composables/useSheetState";
import { usePaneRegister } from "../composables/usePaneRegister";
import { useControlsLayout } from "../composables/useControlsLayout";

const props = defineProps<{
    animationGroup: AnimationGroup<any>;
    storedControls: StoredAnimationGroupControlOptions;
    hideControls?: boolean;
    // The mobile STAGE mode-class (H.W7.S1c) — `subject` full-bleeds the stage
    // behind the sheet; `editor`/`storyboard` keep a content card. The sheet
    // itself is always a content card; the mode tunes the register only.
    stageMode?: "subject" | "editor" | "storyboard";
    isPlaying: boolean;
    animControlRefs: Record<string, any>;
    activeKeyframesRef: any;
    activeTimelineRef: any;
    // glass-ui 4.0.0 (BA.W-TABS) — the standalone-host extra-tab options,
    // forwarded down to each AnimationControls' `extraTabs` seam (the playground
    // injects its "Assets" tab here, AS DATA, not via a reka `<TabsTrigger>`).
    extraTabs?: SegmentedTabOption[];
}>();

// The resolved stage mode + desktop break (the pane register concern) live in
// usePaneRegister (the K.WZ proof:demo-no-oversize seam; zero behavior change).
const { stageMode, isDesktop } = usePaneRegister({
    stageMode: () => props.stageMode,
});

// R.W6 B.1 — layout composable owns the pane-element ref; no parent prop-drilling.
const paneElRef = useTemplateRef<HTMLElement>("paneElRef");
const {
    isPanelTransitionDone,
    onPanelTransitionEnd,
    onSheetSettled,
    isPaneHovered,
    isPaneIdle,
    onPaneMouseEnter: paneMouseEnter,
    onPaneMouseLeave: paneMouseLeave,
    scrollFadeClass,
} = useControlsLayout(props.storedControls, paneElRef);

// The bottom-sheet open-intent + SpringProgress motion (useSheetState). `sheetOpen`
// v-models the grab handle; `sheetStyle` is the `--sheet-t` the mobile CSS reads.
const { sheetOpen, sheetStyle } = useSheetState({
    storedControls: props.storedControls,
    onSettled: onSheetSettled,
});

const emit = defineEmits<{
    (e: "sliderUpdate", val: { t: number; animation: KeyframesAnimation<any> }): void;
    (e: "keyframesUpdate", val: { animation: KeyframesAnimation<any> }): void;
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
/* ── K.W4 F2 — ONE SUBTLE BORDER wrapping the two control elements ──
   The user's live verdict: "the glass card panel should be ONE SUBTLE BORDER
   wrapping the two control elements (the controls card + the playback card), NOT
   two heavy separate glass cards." Pre-cure the controls pane read as two
   floating heavy cartoon cards — the AnimationControls panel and the RibbonBar
   (playback) card, each with its own offset-stamp depth + border, separated by a
   gap. The cure GROUPS them: ONE subtle border + radius + a faint surface tint
   around `.controls-content`, so the two inner cards read as SECTIONS of one
   cohesive panel rather than two competing cards.

   GATE-HONEST: the inner cartoon Cards KEEP their gated register — the
   `surface="cartoon" tier="quiet"` translucency (proof:glass-and-cartoon) AND
   the `--shadow-cartoon-md` offset-stamp depth that grows on hover
   (proof:cartoon-is-panel-depth) are UNTOUCHED (no :deep override strips them).
   This wrapper border is PURELY additive — it groups the cards visually without
   altering the per-card surface the gates probe. The cohesion is a unifying
   container, not a flattening of the cards.

   The border reads off the design-system --border token at a low-saturation
   wash; the radius matches the card family (--radius-card); a faint
   --card-tinted plate behind the group gives it the "one panel" read. Desktop
   only via the @media block below (the mobile sheet IS already one bordered
   card — the sheet register, see the mobile block). */
.controls-content {
    position: relative;
}
@media (min-width: 1024px) {
    .controls-content {
        border: 1px solid color-mix(in srgb, var(--border) 70%, transparent);
        border-radius: var(--radius-card, 1rem);
        background: color-mix(in srgb, var(--card) 22%, transparent);
        /* The group padding owns the breathing room between the wrapping border
           and the inner cards (the cards' own padding stays inside). The existing
           shadow-clearance padding (below) is preserved — this adds the inset so
           the wrapping border does not crowd the inner cartoon cards' stamp. */
        padding-top: 0.5rem;
    }
}

/* ── MOBILE BOTTOM SHEET (H.W7.S1/S2) — the SpringProgress drawer ──
   The 550ms CSS `grid-template-rows` ease is DELETED (no legacy beside the
   replacement). The sheet is a `position: fixed` bottom card whose HEIGHT
   springs between two DETENTS, both ≤70dvh (NEVER full-height — WV-W7-HIGH-5),
   driven by `--sheet-t` ∈ [0,1] (the engine's own SpringProgress via
   useSheetSpring). The near-full-viewport max-height + the stale
   `max-width:440px` cap are DELETED (folded into the full-bleed sheet width;
   WV-W7-F6).

   DETENTS (the visible UNOCCLUDED stage fraction is measured against the SHEET
   TOP, not the sheet's layout box):
     • peek      (--sheet-t = 0): the grab handle + a transport sliver — the
                  stage is maximally visible behind it.
     • expanded  (--sheet-t = 1): --sheet-detent-expanded (≤70dvh) of controls.
   height = lerp(peek, expanded, --sheet-t). The OPEN axis is the spring's
   `--sheet-t`, NOT a CSS height transition (the gate greps that no
   `transition: …height/grid-template-rows` survives on this sheet). */
.controls-pane-wrapper {
    --sheet-detent-peek: calc(var(--dock-icon-height) + 1.25rem);
    /* The 0.45 visible-stage-fraction FLOOR (subject class, WV-W7-HIGH-3) caps
       the expanded sheet. The unoccluded visible stage =
         sheet.top − stage.top = (100dvh − reserve − height) − stageTop,
       where reserve = --dock-menubar-reserve (the sheet's bottom anchor) and
       stageTop = the stage's top inset (--dock-band-reserve when slack is tiny).
       J.W7a S1 (D6 / A-01) — the subject-class expanded detent TIGHTENS from
       0.52 to 0.48 (the 4% reduction the pane-amiga lane names): the amiga
       sphere projects at the stage centre, and at the 0.52 detent the sheet
       boundary cut it to a top hemisphere on mobile-open. Requiring visible
       ≥ 0.52·100dvh (over the 0.45 floor) gives:
         height ≤ 0.48·100dvh − reserve − stageTop,
       so the centred sphere clears the sheet for all phone heights (paired
       with the camera-space lift in AmigaScene). This is the DEFAULT expanded
       detent — the subject scenes (cube/amiga/square) keep the stage as the
       protagonist BACKGROUND, so the sheet stays clear of the floor. It is
       ALSO ≤70dvh (NEVER full-height — WV-W7-HIGH-5) by construction. */
    --sheet-detent-expanded: max(
        var(--sheet-detent-peek),
        calc(
            0.48 * 100dvh - var(--dock-menubar-reserve) -
                var(--dock-band-reserve)
        )
    );
}

@media (max-width: 1023px) {
    .controls-pane-wrapper {
        position: fixed;
        left: 0;
        right: 0;
        /* Anchored ABOVE the bottom menubar band so the sheet rides over the
           fixed stage but never occludes the menubar (inv δ). Full-bleed width
           (no 440px cap); internal padding owns the breathing room. */
        bottom: var(--dock-menubar-reserve);
        /* lerp(peek, expanded, --sheet-t) — the spring drives the height; there
           is NO CSS height transition (the spring IS the motion). */
        height: calc(
            var(--sheet-detent-peek) +
                (
                    var(--sheet-detent-expanded) - var(--sheet-detent-peek)
                ) * var(--sheet-t, 0)
        );
        max-height: var(--sheet-detent-expanded);
        margin: 0;
        padding-inline: 0;
        display: flex;
        flex-direction: column;
        /* The sheet card register — a glass surface lifting off the full-bleed
           stage. Rounded top corners, a top hairline, an upward shadow. */
        background: var(--popover, var(--card));
        border-top-left-radius: var(--radius-card, 1rem);
        border-top-right-radius: var(--radius-card, 1rem);
        box-shadow: 0 -0.5rem 1.5rem -0.5rem hsl(0 0% 0% / 0.18);
        overflow: hidden;
        /* The sheet body owns the swipe-free zone; the handle owns the gesture
           (BLK-6). Scoped to pan-y so a vertical content scroll still works. */
        touch-action: pan-y;
    }
    /* Closed (peek) → only the handle + sliver intercepts pointer; the rest of
       the (collapsed) sheet area is out of the way of the stage below. The
       handle ALWAYS stays interactive (it is the re-open affordance). */
    .controls-pane-wrapper.controls-pane--closed .controls-pane {
        pointer-events: none;
    }

    /* The inner scroll body fills the remaining sheet height under the handle
       and fades its content with the detent (peek → near-hidden). */
    .controls-pane {
        min-height: 0;
        flex: 1 1 auto;
        opacity: calc(0.15 + 0.85 * var(--sheet-t, 0));
    }

    /* The grab handle's own CSS lives with its gesture surface —
       SheetGrabHandle.vue (the colocated sub-component, S1a/BLK-6). */

    /* ── Mode-class register (S1c) ──
       The sheet is ALWAYS a content card; what differs is the STAGE behind it
       and the expanded CEILING. The 0.45 visible-fraction FLOOR applies ONLY to
       the `subject` class (cube/amiga/square — the stage IS the background, so
       the default detent above keeps it ≥0.45 visible). For `editor` (easing —
       the curve/ball ARE the content) and `storyboard` (sequence/path/spring —
       the rows/path ARE the content) the stage is a CONTAINED card whose own
       on-stage content is the protagonist, NOT a background to preserve — so the
       sheet may rise to the full 70dvh ceiling (still NEVER full-height —
       WV-W7-HIGH-5) without violating any floor (none applies to these modes). */
    .controls-pane-wrapper.controls-pane--stage-editor,
    .controls-pane-wrapper.controls-pane--stage-storyboard {
        --sheet-detent-expanded: min(
            70dvh,
            calc(
                100dvh - var(--dock-band-reserve) - var(--dock-menubar-reserve) -
                    0.5rem
            )
        );
    }
}

/* ── PRM: the spring's own respectReducedMotion snaps --sheet-t in one emit
   (useSheetSpring), so the sheet jumps detents with no fade. No CSS transition
   exists on the height/transform axis to neutralize — the engine owns it. The
   content opacity is a static function of --sheet-t (no transition), so it too
   lands instantly under PRM. Nothing further to guard here. */

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
        /* The desktop open/close axis is the [rail]-track collapse on the
           AnimationControlsGroup grid (var(--rail-width) ↔ 0), NOT this wrapper's
           own rows — so the former vestigial `grid-template-rows` transition is
           DELETED (H.W7.S2: no `grid-template-rows` ease survives in this sheet
           file; the mobile sheet is sprung, the desktop axis is the track). Only
           the F9 idle-fade OPACITY transition remains (the rest-dim animates). */
        transition: opacity var(--duration-normal) var(--ease-standard);
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
   global 0.01ms). Under PRM the desktop idle dim still APPLIES (it is an opacity
   rest state, legibility-preserving) but its transition SNAPS — a motion-
   sensitive user gets the dim instantly, no fade. With the former vestigial
   grid-template-rows transition now DELETED (H.W7.S2), the only remaining
   desktop transition is the opacity idle-fade; dropping it here neutralizes the
   fade under PRM. (The mobile sheet's PRM snap is owned by the SpringProgress's
   own respectReducedMotion — no CSS here.) */
@media (min-width: 1024px) and (prefers-reduced-motion: reduce) {
    .controls-pane-wrapper.controls-pane--open {
        transition: none;
    }
}

/* ── Mobile vertical scroll fade ── */
@media (max-width: 1023px) {
    /* WV-W7-F6: the stale `max-width: min(440px, 100dvw)` + `margin-inline:auto`
       cap is DELETED — the sheet is FULL-BLEED width (left/right:0 above); the
       internal padding owns the breathing room. The sheet body padding gives the
       controls their inset. */
    .controls-content {
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
