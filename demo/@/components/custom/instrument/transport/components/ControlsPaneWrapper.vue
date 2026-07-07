<template>
    <!-- ── T.H3-ADOPT (OWNER-OVERRIDDEN 2026-07-06) — the mobile sheet is the
         glass-ui `<Drawer mode="live-behind">`; the desktop rail stays the naked
         column ──
         The bespoke peek/half/full sheet (SheetGrabHandle + useSheetGesture/
         useSheetSpring/useSheetState + the sheet CSS) is DELETED. The mobile
         sheet is now glass-ui 4.0.1's `<Drawer>` — the exact peek/half/full
         bottom sheet, whose `--glass-drawer-t` is spring-driven by kf's OWN
         `SpringProgress` transitively (drawer.js:6 `import { SpringProgress }
         from "@mkbabb/keyframes.js"`; :134 `new A({ … })` — the dogfood is
         PRESERVED through the facade). The `.controls-pane` body is SHARED
         between the two layouts via `createReusableTemplate` (the mobile Drawer
         portals it to <body>; the desktop rail keeps it a grid column).

         THE OCCLUSION CONTRACT, best-achievable under the Drawer's forced
         geometry (KF-TO-GLASSUI-BG.md §FORWARDING / BG-11): the Drawer's
         detented sheet is `bottom:0; height:100%` (drawer.css :53/:134) and its
         visible fraction = the active snap fraction (`--glass-drawer-t`), so the
         52dvh stage-reserve is APPROXIMATED by capping the expanded detent —
         subject scenes cap at 0.48 (sheet.top ≈ 52dvh, stage readable),
         editor/storyboard at 0.62 (26dvh strip). What the snap ladder CANNOT
         cure is the bottom-menubar overlap: the Drawer is pinned to `bottom:0`
         with no bottom-inset lever, so the sheet rides OVER the bottom menubar
         at any detent. That is the BG-11 structural gap — FORWARDED to the
         glass-ui tranche and tracked as a BG-11-BLOCKED born-RED backlog row
         (dischargedBy the `--drawer-inset-block-end` publish + re-pin). -->

    <!-- The SHARED control-pane body — defined once, reused in both layouts. -->
    <DefinePaneBody>
        <div
            ref="paneElRef"
            @mouseenter="paneMouseEnter"
            @mouseleave="paneMouseLeave"
            :class="[
                'controls-pane group/controls min-w-0',
                paneScrollable ? 'overflow-y-auto' : 'overflow-hidden',
                scrollFadeClass,
            ]"
        >
            <div class="controls-content h-full flex flex-col">
                <!-- J.W2 S2 — the v-for is KEYED by the animation name so an
                     AnimationControls instance is BORN with its animation (and
                     dies with it). T.B1-β STAGE 1 — the hosts derive from the
                     CHANNEL axis when the scene exposes a facility. -->
                <template
                    v-for="host in controlHosts"
                    :key="host.animation.id"
                >
                    <div v-show="storedControls.selectedAnimation == host.name">
                        <AnimationControls
                            :ref="(el: any) => { if (el) animControlRefs[host.name] = el }"
                            @slider-update="(v) => emit('sliderUpdate', v)"
                            @keyframes-update="(v) => emit('keyframesUpdate', v)"
                            @toggle-play="emit('togglePlay')"
                            @layer-config-update="
                                (v) => emit('layerConfigUpdate', host.name, v)
                            "
                            @scrub-start="emit('scrubStart')"
                            @scrub-end="emit('scrubEnd')"
                            :animation="host.animation"
                            :is-playing="isPlaying"
                            :layer-config="host.layer"
                            :active="storedControls.selectedAnimation == host.name"
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
    </DefinePaneBody>

    <!-- ── MOBILE (< 1024px): the adopted glass-ui Drawer ─────────────────────
         Held permanently OPEN (peek is the resting state — the grab handle stays
         the re-open affordance, mirroring the bespoke peek/half/full); the store
         `isControlsPanelOpen` fact rides `activeSnapPoint` (peek ↔ expanded). The
         `.glass-drawer-handle` glass-ui renders is the swipe/fling gesture surface
         `useSheetGesture` used to hand-roll — glass-ui's `useDrawerSnap` owns the
         detent math + the velocity fling now. `:show-overlay="false"` keeps the
         page-behind stage visible + interactive (mode="live-behind" already drops
         the focus trap + page aria-hidden). -->
    <Drawer
        v-if="isMobileLayout && showSheet"
        mode="live-behind"
        direction="bottom"
        :open="true"
        :snap-points="snapPoints"
        v-model:active-snap-point="activeSnap"
    >
        <DrawerContent
            :show-overlay="false"
            :class="[
                'controls-drawer-content',
                `controls-drawer--stage-${stageMode}`,
            ]"
        >
            <!-- reka DialogContent wants a labelling title; keep it off-screen
                 (the visible facet panels carry their own headings). -->
            <DrawerTitle class="sr-only">Animation controls</DrawerTitle>
            <ReusePaneBody />
        </DrawerContent>
    </Drawer>

    <!-- ── DESKTOP (≥ 1024px): the naked rail column ──────────────────────────
         T.B4 (OD-5, VERDICT #7): the surrounding pane is GONE — the rail is a
         NAKED grid column; the [rail] track collapse IS the open/close axis. -->
    <div
        v-else-if="!isMobileLayout"
        v-show="showSheet"
        @transitionend="onPanelTransitionEnd"
        :class="[
            'controls-pane-wrapper col-start-1 row-start-1 min-w-0 relative z-controls',
            `controls-pane--stage-${stageMode}`,
            storedControls.isControlsPanelOpen
                ? 'controls-pane--open'
                : 'controls-pane--closed',
            isPaneHovered ? 'controls-pane--hovered' : '',
            isPaneIdle ? 'controls-pane--idle' : '',
        ]"
    >
        <ReusePaneBody />
    </div>
</template>

<script setup lang="ts">
import type { AnimationGroup } from "@mkbabb/keyframes.js";
import type { AnimationLayerConfig } from "@mkbabb/keyframes.js";
import type { KeyframesAnimation } from "@mkbabb/keyframes.js";
import type { StoredAnimationGroupControlOptions } from "@state";
import type { SegmentedTabOption } from "@mkbabb/glass-ui/tabs";
import { Drawer, DrawerContent, DrawerTitle } from "@mkbabb/glass-ui/drawer";
import { createReusableTemplate, useMediaQuery } from "@vueuse/core";
import { computed, useTemplateRef } from "vue";
import type { TransportChannel } from "../transportSource";
import AnimationControls from "../controls/AnimationControls.vue";
import RibbonBar from "./RibbonBar.vue";
import { usePaneRegister } from "../composables/usePaneRegister";
import { useControlsLayout } from "../composables/useControlsLayout";
// GLASSUI-GAP: drawerDetentInset (BG-11) — this site is the T.H3-ADOPT Drawer
// consumer; demo/glass-ui-gaps.ts tracks the bottom-inset lever the adoption's
// occlusion contract awaits (see the header block above + KF-TO-GLASSUI-BG.md
// §FORWARDING). The @mkbabb/glass-ui/drawer import above + this marker satisfy
// proof:glass-ui-gap-tripwire CLAUSE B.

// The shared control-pane body: defined once (DefinePaneBody), reused in the
// mobile Drawer AND the desktop rail (ReusePaneBody) — the ONE body, two homes.
const [DefinePaneBody, ReusePaneBody] = createReusableTemplate();

const props = defineProps<{
    animationGroup: AnimationGroup<any>;
    // T.B1-β STAGE 1 — the facility channel axis (host mounts derive from the
    // painting channels when present; the group axis is the fallback).
    channels?: TransportChannel[];
    storedControls: StoredAnimationGroupControlOptions;
    hideControls?: boolean;
    // The mobile STAGE mode-class (H.W7.S1c) — `subject` full-bleeds the stage
    // behind the sheet; `editor`/`storyboard` keep a content card. The mode also
    // tunes the Drawer's max detent (the stage-reserve approximation).
    stageMode?: "subject" | "editor" | "storyboard";
    isPlaying: boolean;
    animControlRefs: Record<string, any>;
    activeKeyframesRef: any;
    activeTimelineRef: any;
    // glass-ui 4.0.0 (BA.W-TABS) — the standalone-host extra-tab options.
    extraTabs?: SegmentedTabOption[];
}>();

// ── T.B1-β STAGE 1 — the host axis ───────────────────────────────────────────
interface ControlHost {
    name: string;
    animation: KeyframesAnimation<any>;
    layer: AnimationLayerConfig | undefined;
}
const controlHosts = computed<ControlHost[]>(() => {
    if (props.channels && props.channels.length > 0) {
        return props.channels.flatMap((c) =>
            c.animation
                ? [
                      {
                          name: c.name,
                          animation: c.animation,
                          layer: props.animationGroup.animations[c.name]?.layer,
                      },
                  ]
                : [],
        );
    }
    return Object.entries(props.animationGroup.animations).map(
        ([name, groupObject]) => ({
            name,
            animation: groupObject.animation,
            layer: groupObject.layer,
        }),
    );
});

// Whether the pane/sheet has anything to show (the former `v-show` predicate).
const showSheet = computed(
    () => !!props.storedControls.selectedAnimation && !props.hideControls,
);

// The resolved stage mode (the pane register concern) lives in usePaneRegister.
const { stageMode } = usePaneRegister({
    stageMode: () => props.stageMode,
});

// R.W6 B.1 — layout composable owns the pane-element ref; no parent prop-drilling.
const paneElRef = useTemplateRef<HTMLElement>("paneElRef");
const {
    isPanelTransitionDone,
    onPanelTransitionEnd,
    isPaneHovered,
    isPaneIdle,
    onPaneMouseEnter: paneMouseEnter,
    onPaneMouseLeave: paneMouseLeave,
    scrollFadeClass,
} = useControlsLayout(props.storedControls, paneElRef);

// ── T.H3-ADOPT — the mobile Drawer open/detent state (was useSheetState) ─────
// The 1023px mobile boundary (the SAME the sheet CSS + the mount-reset use).
const isMobileLayout = useMediaQuery("(max-width: 1023px)");

// MOBILE MOUNT-RESET (peek by default) — the S.G1 S1a three-writer peek cure
// head, preserved: on the mobile layout the sheet is born at PEEK per scene
// entry (the wrapper remounts per scene via the group superKey boundary), so
// this setup-time reset overrides the store's persisted/default open fact.
if (isMobileLayout.value) {
    props.storedControls.isControlsPanelOpen = false;
}

// The detent ladder (fractions of the viewport height the sheet fills, bottom-
// anchored — visible fraction = snap fraction). PEEK keeps the stage maximally
// visible (sheet.top ≈ 0.88·vh); the EXPANDED cap APPROXIMATES the stage-reserve
// (subject 0.48 → sheet.top ≈ 52dvh; editor/storyboard 0.62 → 26dvh strip). The
// bottom-menubar overlap the ladder cannot cure is the BG-11 structural gap.
const PEEK_SNAP = 0.12;
const EXPANDED_SUBJECT = 0.48;
const EXPANDED_EDITOR = 0.62;
const expandedSnap = computed(() =>
    stageMode.value === "subject" ? EXPANDED_SUBJECT : EXPANDED_EDITOR,
);
const snapPoints = computed(() => [PEEK_SNAP, expandedSnap.value]);

// The store open-fact ↔ the Drawer active detent. Open ⇒ expanded; closed ⇒ peek.
// A drag/fling that lands nearer the expanded detent writes the open fact true.
const activeSnap = computed<number>({
    get: () =>
        props.storedControls.isControlsPanelOpen
            ? expandedSnap.value
            : PEEK_SNAP,
    set: (v: number) => {
        const mid = (PEEK_SNAP + expandedSnap.value) / 2;
        props.storedControls.isControlsPanelOpen = Number(v) > mid;
    },
});

// The mobile sheet body scrolls when EXPANDED (glass-ui's Drawer owns the sheet
// motion + rest; the body just needs `overflow-y-auto` at the open detent). The
// desktop path keeps the `isPanelTransitionDone` latch (the max-height
// transitionend gate) — the two dispatch on the layout mode.
const paneScrollable = computed(() =>
    isMobileLayout.value
        ? props.storedControls.isControlsPanelOpen
        : isPanelTransitionDone.value && props.storedControls.isControlsPanelOpen,
);

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

<style scoped src="./ControlsPaneWrapper.css"></style>
