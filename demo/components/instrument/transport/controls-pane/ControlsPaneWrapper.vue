<template>
    <!-- ── X.KF.W13R.m (DRAWER-DETENT-REACH, COHESION §0cd) — glass 8.0.0 folded
         `Drawer` WHOLE into `Sheet` (glass `336dacf9`, "the detent is a size"):
         the mobile sheet is `<Dialog :modal="false">` + `<SheetContent
         side="bottom" :detents>`. The 7.0.0 Drawer was a full-height sheet
         TRANSLATED to its snap, so ~384px of controls never entered an 844px
         viewport; the Sheet takes its BLOCK-SIZE from the rung
         (`--detent-t · 100dvh`) and its region scrolls (`scroll`), so every
         control row is reachable at every rung. The history below is kept as
         written; where it names `Drawer`, `--glass-drawer-t` or
         `--drawer-inset-block-end`, read the Sheet, `--detent-t` and the
         `bottom` lift set on `<SheetContent>`. ──
         ── T.H3-ADOPT (OWNER-OVERRIDDEN 2026-07-06) — the mobile sheet is the
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

         THE OCCLUSION CONTRACT under the Drawer's geometry (D-B1 / N-2 / C-2,
         BG-11 DISCHARGED): the detented sheet's visible fraction is the active
         snap fraction (`--glass-drawer-t`), so the stage-reserve is
         APPROXIMATED by capping the open detent — every stage mode at
         `OPEN_SNAP` (0.36; the derivation sits beside the constant; the 0.62
         editor rung is retired, X.KF.W13X.mobile, with a FULL rung above). The bottom-menubar overlap the
         ladder could not cure is cured at the producer's own lever: installed
         glass-ui 7.0.0 publishes `--drawer-inset-block-end` (`:root { … 0px }`
         + `.glass-drawer[data-glass-drawer-snap-points="true"]
         [data-glass-drawer-direction="bottom"] { bottom: var(…); height:
         calc(100% − var(…)) }`, `dist/components/drawer/styles.css`), and this
         consumer sets it on `<DrawerContent>` below to the demo's stable dock
         band, so the sheet's bottom edge sits ABOVE the menubar at every detent.
         The BG-11 born-RED row's dischargedBy condition (the publish) is MET and
         consumed here; the four cross-file comments that still call the gap
         structural (layout.css:99 · TransportDock.vue · AnimationControlsGroup
         .css · CubeScene.vue) are stale prose in files this unit does not own. -->

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
                     ChannelControls instance is BORN with its animation (and
                     dies with it). T.B1-β STAGE 1 — the hosts derive from the
                     CHANNEL axis when the scene exposes a facility. -->
                <template
                    v-for="host in controlHosts"
                    :key="host.animation.id"
                >
                    <!-- X.KF.W13V.c (C1-1) — `.controls-surface` is the
                         desktop rail's ONE scroller: the rail is bounded above
                         the menubar band (ControlsPaneWrapper.css), so a
                         surface taller than the rail scrolls HERE while the
                         persistent ribbon below stays in view. -->
                    <div
                        v-show="storedControls.selectedAnimation == host.name"
                        class="controls-surface"
                    >
                        <!-- LP-1 — THE WRITE→RENDER EDGE. `host.layer` and
                             `host.blendAvailable` are re-read from the engine
                             at this edge on every layer write (see
                             `controlHosts` + `onLayerConfigUpdate`), so the
                             panel below renders the engine's post-write truth
                             rather than a snapshot taken at mount. -->
                        <ChannelControls
                            :ref="(el) => { if (el) emit('channelControlsRef', host.name, el) }"
                            @slider-update="(v) => emit('sliderUpdate', v)"
                            @keyframes-update="(v) => emit('keyframesUpdate', v)"
                            @toggle-play="emit('togglePlay')"
                            @layer-config-update="
                                (v) => onLayerConfigUpdate(host.name, v)
                            "
                            @scrub-start="emit('scrubStart')"
                            @scrub-end="emit('scrubEnd')"
                            :animation="host.animation"
                            :is-playing="isPlaying"
                            :layer-config="host.layer"
                            :blend-available="host.blendAvailable"
                            :active="storedControls.selectedAnimation == host.name"
                        >
                            <!-- X.KF.W13X.mobile (UIA-KF-008) — the scene
                                 facet body renders ONLY on its own surface,
                                 gated here in the one pane host so no scene
                                 can forget (easing Curve and spring Physics
                                 were ungated and stacked under Controls,
                                 Keyframes and Timeline). -->
                            <template v-if="selectedIsFacet" #tabs-content>
                                <slot
                                    name="tabs-content"
                                    :selected-animation="
                                        storedControls.selectedAnimation
                                    "
                                    :is-playing="isPlaying"
                                ></slot>
                            </template>
                        </ChannelControls>
                    </div>
                </template>

                <!-- X.KF.W13V.s2 (§0cw ESC-s-1 (b)) — a master-clock channel
                     (Sequence) paints no one Animation, so no ChannelControls
                     host is born for it; its one surface is the Timeline pane
                     in Sequence mode — the items as lanes, re-timed on the lane,
                     the master scrub as the playhead. -->
                <div
                    v-for="host in sequenceHosts"
                    :key="host.name"
                    v-show="storedControls.selectedAnimation == host.name"
                    class="controls-surface pl-4 pr-4 lg:pr-7 pt-2 pb-3"
                >
                    <SequenceTimeline :source="host.sequence" />
                </div>

                <!-- Persistent controls ribbon (its actions address one
                     Animation's keyframes, so a Sequence host carries none). -->
                <RibbonBar
                    v-if="storedControls.selectedAnimation && !selectedIsSequence"
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

    <!-- ── MOBILE (< 1024px): the adopted glass-ui Sheet (detented) ──────────
         Held permanently OPEN (peek is the resting state — the sheet's grip is
         the re-open affordance and carries the ladder for the keyboard); the
         store `isControlsPanelOpen` fact rides `v-model:detent` (peek ↔
         expanded). glass's `useSheetDetents` owns the detent math, the drag and
         the fling. `:modal="false"` is the former `mode="live-behind"`: reka's
         non-modal arm drops the focus trap, page aria-hidden and the scrim, so
         the page-behind stage stays visible + interactive. The sheet's own
         dismissals (the ✕, Esc, an outside press, a flick onto 0) request a
         close; the sheet stays mounted and PARKS at peek — the store fact goes
         false, never the dialog's open. -->
    <Dialog
        v-if="isMobileLayout && showSheet"
        :modal="false"
        :open="true"
        @update:open="(open: boolean) => { if (!open) emit('setControlsPanelOpen', false); }"
    >
        <!-- KF-SKEL-9 — the `controls-drawer--stage-*` emission is DELETED (the
             decision is the emitter's, taken whole in `AnimationControlsGroup`;
             the rationale, including why ADOPT is barred, lives at that site so
             the nine names have one home and not three). -->
        <!-- D-B1 — the sheet's bottom edge sits ABOVE the menubar: the sheet
             pins `bottom: 0` at zero specificity (`:where()`, sheet/styles.css:
             "a consumer's own sizing utility WINS"), so the lift is a `:style`
             on the content element (merged onto the portalled
             `[data-slot=sheet-content]`), NEVER a scoped selector: a Teleport
             child is not this component's subTree, so the consumer's `data-v-*`
             cannot reach it (MISS-1). The STABLE band (the monotonic peak of the
             measured menubar, layout.css) over the live one: the sheet's bottom
             edge must never drop mid-session when the menubar momentarily
             measures shorter; over-reservation only ever keeps the subject MORE
             clear; and no cycle forms — the lift does not feed the menubar's
             measure. SS-13 measures the tether at both detents.
             X.KF.W13V.s (OA-40) — the lift is the WHOLE transport band
             (`--stage-bottom-inset` = the bottom anchor + the stable band,
             layout.css), not the band depth alone: `--dock-band-reserve-stable`
             omitted the anchor the transport floats at, so the sheet's bottom
             edge sat ≈49 px INSIDE the transport and the collapsed pill
             covered its last control row (the owner's "fill mode"). The
             sheet now rests on top of the transport, never under it. -->
        <SheetContent
            :side="sheetSide"
            :detents="snapPoints"
            v-model:detent="activeSnap"
            scroll
            class="controls-drawer-content"
            :style="sheetStyle"
        >
            <!-- reka DialogContent wants a labelling title; keep it off-screen
                 (the visible facet panels carry their own headings). -->
            <DialogTitle class="sr-only">Animation controls</DialogTitle>
            <ReusePaneBody />
        </SheetContent>
    </Dialog>

    <!-- ── DESKTOP (≥ 1024px): the naked rail column ──────────────────────────
         T.B4 (OD-5, VERDICT #7): the surrounding pane is GONE — the rail is a
         NAKED grid column; the [rail] track collapse IS the open/close axis. -->
    <div
        v-else-if="!isMobileLayout"
        v-show="showSheet"
        @transitionend="onPanelTransitionEnd"
        :class="[
            'controls-pane-wrapper col-start-1 row-start-1 min-w-0 relative z-controls',
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
import {
    BUILT_IN_SURFACES,
    type ControlSurface,
    type StoredAnimationGroupControlOptions,
} from "@state";
import { Dialog, DialogTitle } from "@mkbabb/glass-ui/dialog";
import { SheetContent } from "@mkbabb/glass-ui/sheet";
import { createReusableTemplate, useMediaQuery } from "@vueuse/core";
import { computed, shallowRef, useTemplateRef, watch, type ComponentPublicInstance } from "vue";
import type { TransportChannel } from "../transportSource";
import ChannelControls from "../channel-controls/ChannelControls.vue";
import RibbonBar from "./RibbonBar.vue";
import SequenceTimeline from "../../timeline/SequenceTimeline.vue";
import { useControlsLayout } from "../ControlsPaneWrapper/useControlsLayout";
// The sheet's bottom lift above the menubar is the `bottom` style set on
// `<SheetContent>` in the template (D-B1; glass 10's sheet pins `bottom: 0` at
// zero specificity, and its 7.0.0 `--drawer-inset-block-end` lever is gone).

// The shared control-pane body: defined once (DefinePaneBody), reused in the
// mobile Sheet AND the desktop rail (ReusePaneBody) — the ONE body, two homes.
const [DefinePaneBody, ReusePaneBody] = createReusableTemplate();

const props = defineProps<{
    animationGroup: AnimationGroup<any>;
    blendAvailable: boolean;
    // T.B1-β STAGE 1 — the facility channel axis (host mounts derive from the
    // painting channels when present; the group axis is the fallback).
    // `| undefined` explicit — bound, never omitted, by the group above.
    channels?: TransportChannel[] | undefined;
    storedControls: StoredAnimationGroupControlOptions;
    hideControls?: boolean;
    // The mobile STAGE mode-class (H.W7.S1c). X.KF.W13X.mobile (UIA-KF-217) —
    // the pane no longer reads it: the detent ladder is one ladder for every
    // mode (the editor rung was lowered onto the stage floor). The binding in
    // AnimationControlsGroup (`.transport`'s file) retires with this
    // declaration; until then it is declared so it does not fall through.
    stageMode?: "subject" | "editor" | "storyboard" | undefined;
    isPlaying: boolean;
    activeKeyframesRef: any;
    activeTimelineRef: any;
}>();

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
    // X.KF.W13T.k3 · ESC-k2-1 (§0ar) — the two writes this pane used to make
    // into its PROPS now go to their owner, `AnimationControlsGroup`, which
    // resolves the group's stored options (`getStoredAnimationGroupControlOptions`)
    // and holds the channel-controls registry. The pane still READS
    // `storedControls` — the same reactive store object — so a read right after
    // the owner's synchronous write is already current.
    (e: "channelControlsRef", name: string, el: Element | ComponentPublicInstance): void;
    (e: "setControlsPanelOpen", open: boolean): void;
}>();

// ── T.B1-β STAGE 1 — the host axis ───────────────────────────────────────────
interface ControlHost {
    name: string;
    animation: KeyframesAnimation<any>;
    layer: AnimationLayerConfig | undefined;
    blendAvailable: boolean;
}

// ── LP-1 (X.KF.W12.b) — THE WRITE→RENDER EDGE ────────────────────────────────
// The group is `shallowRef(markRaw(…))`-held and every layer object hangs off
// that never-proxied graph, so no engine write is observable to Vue: the
// engine's `setLayerConfig` is `Object.assign(entry.layer, config)` +
// `invalidateEntries()`, which flips a private dirty flag and publishes no
// event, and `singleTarget` is a plain getter re-derived on the engine's own
// schedule. Every controlled widget in the layer panel was therefore frozen at
// the value it read at mount — including for the user's OWN write.
//
// The edge is this component's `controlHosts` projection: it depends on
// `layerRevision`, which the one demo write path bumps AFTER the engine has
// written (`onLayerConfigUpdate` — the parent's handler runs synchronously
// inside `emit`, and it is the engine's `setLayerConfig`), and it re-reads the
// whole prop surface from the engine at that moment — a fresh `layer` snapshot
// (a new object identity, so the panel's props change and every widget renders
// the engine's post-write truth, engine normalisation included) AND
// `blendAvailable` from the group's live `singleTarget` (the LP-1 rider: both
// operands of the weight gate were untracked reads). The parent's
// `blendAvailable` prop stays a re-derivation trigger (a parent re-render with
// a changed reading re-runs this projection); the VALUE is always the group's.
//
// What this edge does NOT cover, stated so nobody reads it as more: a layer
// write that never crosses this component (a scene calling the group directly,
// or a `transitionLayer` spring advancing `weight` per frame) is invisible until
// the next write through here. A live subscription needs an engine-side seam
// (`invalidateEntries` is dirty-flag-only) — that ask is KF.W5's, declared at
// the wave record, never a demo-side poke into the engine's objects.
const layerRevision = shallowRef(0);

const onLayerConfigUpdate = (
    name: string,
    config: Partial<AnimationLayerConfig>,
) => {
    // The parent's handler is the engine write (AnimationControlsGroup →
    // useAnimationGroupActions.updateLayerConfig → group.setLayerConfig); it
    // has completed when `emit` returns.
    emit("layerConfigUpdate", name, config);
    layerRevision.value += 1;
};

const controlHosts = computed<ControlHost[]>(() => {
    // Tracked inputs: the revision (every write through this edge) and the
    // parent's reading (a re-derivation trigger); the values are the group's.
    void layerRevision.value;
    void props.blendAvailable;
    const blendAvailable = props.animationGroup.singleTarget;
    const snapshot = (
        layer: AnimationLayerConfig | undefined,
    ): AnimationLayerConfig | undefined => (layer ? { ...layer } : undefined);

    if (props.channels && props.channels.length > 0) {
        return props.channels.flatMap((c) =>
            c.animation
                ? [
                      {
                          name: c.name,
                          animation: c.animation,
                          layer: snapshot(
                              props.animationGroup.animations[c.name]?.layer,
                          ),
                          blendAvailable,
                      },
                  ]
                : [],
        );
    }
    return Object.entries(props.animationGroup.animations).map(
        ([name, groupObject]) => ({
            name,
            animation: groupObject.animation,
            layer: snapshot(groupObject.layer),
            blendAvailable,
        }),
    );
});

// X.KF.W13V.s2 — the master-clock channels (Sequence): the Timeline pane's
// Sequence mode mounts on these instead of a ChannelControls host.
const sequenceHosts = computed(() =>
    (props.channels ?? []).flatMap((c) =>
        c.sequence ? [{ name: c.name, sequence: c.sequence }] : [],
    ),
);
const selectedIsSequence = computed(() =>
    sequenceHosts.value.some((h) => h.name === props.storedControls.selectedAnimation),
);

// X.KF.W13X.mobile (UIA-KF-008) — a scene facet (easing Curve, spring Physics,
// cube Matrix Controls) is any surface outside the BUILT_IN triad.
const selectedIsFacet = computed(
    () =>
        !BUILT_IN_SURFACES.includes(
            props.storedControls.selectedControl as ControlSurface,
        ),
);

// Whether the pane/sheet has anything to show (the former `v-show` predicate).
const showSheet = computed(
    () => !!props.storedControls.selectedAnimation && !props.hideControls,
);


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

// ── T.H3-ADOPT — the mobile Sheet open/detent state (was useSheetState) ──────
// The 1023px mobile boundary (the SAME the sheet CSS + the mount-reset use).
const isMobileLayout = useMediaQuery("(max-width: 1023px)");

// MOBILE MOUNT-RESET (peek by default) — the S.G1 S1a three-writer peek cure
// head, preserved: on the mobile layout the sheet is born at PEEK per scene
// entry (the wrapper remounts per scene via the group superKey boundary), so
// this setup-time reset overrides the store's persisted/default open fact.
if (isMobileLayout.value) {
    emit("setControlsPanelOpen", false);
}

// The detent ladder. A detent `t` is a SIZE of the viewport (`t · 100dvh`, or
// `t · 100dvw` for a side sheet; glass 10's Sheet), and the sheet is lifted
// above the transport band (D-B1, `--stage-bottom-inset`), so a bottom rung `t`
// leaves `1 − b − t` of stage above it. PEEK is the grab-handle rest (the glass
// chrome floor wins below it); OPEN keeps the 0.45 unoccluded stage floor, net
// of the ~0.11 top-dock band: `1 − b − t − 0.11 ≥ 0.45`, so 0.36 holds it up to
// b = 0.08 (a 64px band on 800px).
// X.KF.W13X.mobile (UIA-KF-217 · A2-KE-L2-10) — ONE open rung for every stage
// mode, plus a FULL rung for editing. The 0.62 editor rung was floor-exempt and
// covered the spring track at every phone (the sheet top at 169-260 against the
// track's bottom at 319-429), and the 0.36 rung left the pane a 171-257px scroll
// window for 700+px of controls. The editor rung is lowered onto the floor, and
// the editing room moves to a third rung the user asks for: FULL is the whole
// band between the two docks, the sheet's size capped at the band by
// `fullBand` below (so the rung reads 1 and the cap is the band, whatever the
// dock heights measure).
// X.KF.W13X.mobile (A2-KE-L2-3) — on a short viewport (a phone in landscape,
// ≤ 500px tall) the bottom ladder is degenerate: the glass chrome floor (204px)
// exceeds both 0.12 and 0.36 of 390px, so PEEK and OPEN were the same box and
// covered the whole stage band. There the sheet is the desktop rail's analogue,
// a RIGHT side sheet between the two dock bands, whose rungs are widths. Its
// rest is the rail itself, not a grip strip: a 0.12 strip (112px at 932) crushed
// the pane to a sliver whose controls overflowed into the notch band. PEEK 0.36
// rests the rail (304px at 844, the stage's centred subject clear of it at 540),
// OPEN 0.46 keeps the subject's centre clear (the sheet's edge at 456 > 422),
// FULL 0.6 is the editing room.
const isShortLayout = useMediaQuery("(max-width: 1023px) and (max-height: 500px)");
const sheetSide = computed(() => (isShortLayout.value ? "right" : "bottom"));
const PEEK_SNAP = computed(() => (isShortLayout.value ? 0.36 : 0.12));
const OPEN_SNAP = computed(() => (isShortLayout.value ? 0.46 : 0.36));
const FULL_SNAP = computed(() => (isShortLayout.value ? 0.6 : 1));
const snapPoints = computed(() => [PEEK_SNAP.value, OPEN_SNAP.value, FULL_SNAP.value]);
// The band the sheet lives in: above the transport, below the top dock. The
// bottom sheet's FULL rung is capped at it; the side sheet spans it.
const fullBand = "calc(100dvh - var(--stage-top-inset) - var(--stage-bottom-inset))";
const sheetStyle = computed(() =>
    isShortLayout.value
        ? { top: "var(--stage-top-inset)", bottom: "var(--stage-bottom-inset)", height: "auto" }
        : { bottom: "var(--stage-bottom-inset)", maxBlockSize: fullBand },
);

// The store open-fact ↔ the Sheet's active rung. Closed ⇒ PEEK; open ⇒ OPEN,
// or FULL once the user has taken the sheet there (`atFull`, local: the store
// knows open/closed only). A drag, fling or grip key lands on the NEAREST rung;
// a null or a flick onto 0 reads as peek.
const atFull = shallowRef(false);
watch(
    () => props.storedControls.isControlsPanelOpen,
    (open) => {
        if (!open) atFull.value = false;
    },
);
const activeSnap = computed<number | null>({
    get: () =>
        !props.storedControls.isControlsPanelOpen
            ? PEEK_SNAP.value
            : atFull.value
              ? FULL_SNAP.value
              : OPEN_SNAP.value,
    set: (v: number | null) => {
        const t = v ?? 0;
        const nearest = snapPoints.value.reduce((a, c) =>
            Math.abs(c - t) < Math.abs(a - t) ? c : a,
        );
        atFull.value = nearest === FULL_SNAP.value;
        emit("setControlsPanelOpen", nearest !== PEEK_SNAP.value);
    },
});

// The mobile sheet body scrolls when EXPANDED (glass-ui's Sheet owns the sheet
// motion + rest; the body just needs `overflow-y-auto` at the open detent). The
// desktop path keeps the `isPanelTransitionDone` latch (the max-height
// transitionend gate) — the two dispatch on the layout mode.
const paneScrollable = computed(() =>
    isMobileLayout.value
        ? props.storedControls.isControlsPanelOpen
        : isPanelTransitionDone.value && props.storedControls.isControlsPanelOpen,
);

</script>

<style scoped src="./ControlsPaneWrapper.css"></style>
