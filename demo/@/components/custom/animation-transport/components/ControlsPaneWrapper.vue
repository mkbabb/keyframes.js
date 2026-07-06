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

        <!-- T.B4 (OD-5, VERDICT #7 — "remove the surrounding pane, it's
             superfluous"). The former desktop `glass-wash rounded-card`
             subject-stage wrap is DELETED: the pane CONTAINER is a NAKED column
             now — no glass wash, no rounded slab, no border on the column
             itself. The two floating GlassPanel instruments (the facet body +
             the playback ribbon, below) are the only plates; the stage bleeds
             through the gap between them. The K.W4-F2 ↔ T-#7 reconciliation
             (lane 10 §1.5): K's cure targeted two HEAVY cartoon cards competing;
             T ships LIGHT floating glass cards + zero wrappers — neither failed
             pole (heavy twin cards / bordered enclosure) returns. -->
        <div
            ref="paneElRef"
            @mouseenter="paneMouseEnter"
            @mouseleave="paneMouseLeave"
            :class="[
                'controls-pane group/controls min-w-0',
                isPanelTransitionDone && storedControls.isControlsPanelOpen
                    ? 'overflow-y-auto'
                    : 'overflow-hidden',
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
                     whose immediate derivation-sync projects into ITS OWN store.

                     T.B1-β STAGE 1 — the hosts derive from the CHANNEL axis when
                     the scene exposes a facility (each painting channel mounts
                     an honest AnimationControls host on its OWN animation); the
                     group axis is the fallback (`controlHosts` below). -->
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
    </div>
</template>

<script setup lang="ts">
import type { AnimationGroup } from "@mkbabb/keyframes.js";
import type { AnimationLayerConfig } from "@mkbabb/keyframes.js";
import type { KeyframesAnimation } from "@mkbabb/keyframes.js";
import type { StoredAnimationGroupControlOptions } from "@state";
import type { SegmentedTabOption } from "@mkbabb/glass-ui/tabs";
import { computed, useTemplateRef } from "vue";
import type { TransportChannel } from "../transportSource";
import AnimationControls from "../controls/AnimationControls.vue";
import RibbonBar from "./RibbonBar.vue";
import SheetGrabHandle from "./SheetGrabHandle.vue";
import { useSheetState } from "../composables/useSheetState";
import { usePaneRegister } from "../composables/usePaneRegister";
import { useControlsLayout } from "../composables/useControlsLayout";

const props = defineProps<{
    animationGroup: AnimationGroup<any>;
    // T.B1-β STAGE 1 — the facility channel axis (host mounts derive from the
    // painting channels when present; the group axis is the fallback).
    channels?: TransportChannel[];
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

// ── T.B1-β STAGE 1 — the host axis ───────────────────────────────────────────
// The AnimationControls hosts mount from the CHANNEL axis when the scene
// exposes a facility: every channel that carries a painting `animation` gets an
// honest host (its layer config resolves through the group by name when the
// channel mirrors a group member; a light-scene channel has none). The group
// axis (`Object.entries(group.animations)`) is the fallback for a non-migrated
// scene / a standalone host.
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

// The resolved stage mode (the pane register concern) lives in usePaneRegister
// (the K.WZ proof:demo-no-oversize seam). T.B4 (OD-5): `isDesktop` left with the
// deleted glass-wash subject-stage wrap — the naked rail needs no desktop break.
const { stageMode } = usePaneRegister({
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

<style scoped src="./ControlsPaneWrapper.css"></style>
