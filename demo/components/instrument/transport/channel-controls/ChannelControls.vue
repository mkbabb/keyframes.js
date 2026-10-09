<template>
    <div
        class="flex flex-col h-full w-full overflow-hidden z-content relative isolate"
    >
        <div
            class="w-full flex-1 min-h-0 flex flex-col justify-start"
        >
            <div class="flex-1 min-h-0 overflow-y-auto flex flex-col">
                <!-- THE CONTROL SURFACES. Each is a plain div gated on the active
                     surface (`selectedControlSurface`) under the SAME DFA gate (a
                     scene whose valid set omits a surface mounts NO pane — the
                     easing scene never spins up the Monaco keyframes pane).

                     THE PANELS' NAMING, DECIDED WITH THE STRIP'S FATE (CC-D-2/C-3
                     + N-4). There is no in-panel strip any more: the header that
                     rendered one sat behind a constant-false gate, and it is deleted
                     (the gate itself folded at X.KF.W13X.r4pane, A2-KE-L1-12). The dock's
                     controls `<Select>` is the sole surface switcher, so these are
                     NOT a tablist's panels and no `role="tab"` owns them. `role`
                     and `data-state` are RETAINED DELIBERATELY, not by inertia:
                     the pane probes key on that pair, and the panel-enter rule
                     keys on `data-surface-panel` + `data-state` (design-idioms.css
                     §surface-panel; X.KF.W13X.lib, A2-KE-L1-21). X.KF.W13X.controls · UIA-KF-275 (the tabpanel limb) —
                     each panel here is NAMED by its surface's registry label
                     (`SURFACE_META`, the same words the dock's surface items
                     read); the fourth site, `CubeScene.vue`'s `h()`-rendered
                     matrix panel, is the scene's (UIA-KF-161's hosting). -->
                <div
                    v-if="hasSurface('controls') && selectedControlSurface === 'controls'"
                    role="tabpanel"
                    data-surface-panel
                    :aria-label="SURFACE_META.controls.label"
                    data-state="active"
                    tabindex="0"
                >
                    <ChannelOptions
                        :animation="animation"
                        :is-playing="isPlayingProp"
                        :layer-config="layerConfig"
                        :blend-available="blendAvailable"
                        :active="active"
                        @slider-update="(v) => emit('sliderUpdate', v)"
                        @toggle-play="emit('togglePlay')"
                        @layer-config-update="(v) => emit('layerConfigUpdate', v)"
                        @scrub-start="emit('scrubStart')"
                        @scrub-end="emit('scrubEnd')"
                    ></ChannelOptions>
                </div>

                <!-- B-2 (CWV/INP): FORCE-MOUNT the Monaco-heavy keyframes pane and
                     cache it via content-visibility:hidden when inactive, instead
                     of unmounting it (which re-spins Monaco's worker / model /
                     themes on every switch-back). With reka gone the force-mount is
                     literal: the pane is ALWAYS rendered while the surface is valid
                     (`v-if` on `hasSurface`, NOT on the active value) and toggles
                     visibility via the `.inactive` class + `inert`. `inert` (not
                     bare aria-hidden, which leaves focusable Monaco descendants in
                     the tab order — the aria-hidden-focus a11y defect) takes the
                     cached pane out of BOTH the tab order and the AT tree while
                     inactive; the focus-move on reveal restores it. `data-state`
                     mirrors the active flag for the panel-slide seam. -->
                <div
                    v-if="hasSurface('keyframes') && keyframesWarmed"
                    role="tabpanel"
                    data-surface-panel
                    :aria-label="SURFACE_META.keyframes.label"
                    :data-state="keyframesActive ? 'active' : 'inactive'"
                    :tabindex="keyframesActive ? 0 : -1"
                    ref="keyframesPaneEl"
                    :class="['monaco-pane', keyframesActive ? '' : 'inactive']"
                    :inert="!keyframesActive"
                >
                    <KeyframesStringControls
                        ref="keyframesControlsRef"
                        @keyframes-update="
                            (v) => {
                                emit('keyframesUpdate', v);
                            }
                        "
                        :animation="animation"
                    ></KeyframesStringControls>
                </div>

                <div
                    v-if="hasSurface('timeline') && selectedControlSurface === 'timeline'"
                    role="tabpanel"
                    data-surface-panel
                    :aria-label="SURFACE_META.timeline.label"
                    data-state="active"
                    tabindex="0"
                >
                    <!-- X.KF.W13X.controls · UIA-KF-061 · 282 — the rail's
                         "Timeline expanded below" placeholder is deleted: a
                         dead card with a forever-bouncing chevron (untokenized,
                         never reduced-motion gated) and a FOURTH collapse
                         control, which at 390 pointed down at a timeline that
                         sits above the sheet. The expanded surface's own
                         collapse is the verb (demo/DESIGN.md §3, one control
                         per verb). -->
                </div>

                <!-- X.KF.W13X.r4pane · UIA-KF-161 (hosting) — a scene FACET
                     (cube's Matrix, easing's Curve, spring's Physics) is a surface
                     THIS host hosts, exactly as it hosts the built-in three: one
                     plain gated panel, named by the surface's registry label
                     (`SURFACE_META`, the dock's own words). The scene hands only
                     its BODY through the `tabs-content` slot (the pane gates the
                     slot to the facet surface, ControlsPaneWrapper); the matrix
                     body no longer renders its own `role=tabpanel` from a
                     scene-side `h()`. -->
                <div
                    v-if="$slots['tabs-content'] && facetSurfaceLabel"
                    role="tabpanel"
                    data-surface-panel
                    :aria-label="facetSurfaceLabel"
                    data-state="active"
                    tabindex="0"
                >
                    <slot name="tabs-content"></slot>
                </div>

                <!-- Timeline: outside the gated panels but inside the scrollable
                     area so Teleport lifecycle isn't tied to a panel mount/unmount
                     (which breaks moveTeleport). When collapsed, renders in-place
                     here. When expanded, teleports to bottom bar.
                     KFA-56 / UIA-KF-019 (X.KF.W13X.timeline) — only the ACTIVE
                     channel mounts its timeline: the inactive hosts are hidden
                     by v-show, which a Teleport escapes, so expanding stacked
                     all three channels' timelines in the cell and Tab walked
                     into the hidden ones. The session survives the unmount
                     (KFA-58, useTimeline's per-channel owner). -->
                <Teleport to="#timeline-expanded-target" :disabled="!storedControls.isTimelineExpanded" defer>
                    <div
                        v-if="active && isTimelineVisible && KeyframeTimeline"
                        :key="storedControls.selectedControl"
                        class="animate-in fade-in slide-in-from-right-2 duration-fast"
                    >
                        <component
                            :is="KeyframeTimeline"
                            ref="timelineRef"
                            :targets="animation.targets"
                            :animation-options="animation.options"
                            :clock="animation"
                            :expanded="storedControls.isTimelineExpanded"
                            @toggle-expand="storedControls.isTimelineExpanded = !storedControls.isTimelineExpanded"
                        />
                    </div>
                </Teleport>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// This host renders NO tab strip. The `.tab-trigger-*` skin and the second
// authored copy of it that the pill strip carried are deleted with the strip
// they painted; what survives is design-idioms.css's non-scoped
// `[data-surface-panel][data-state=active]` panel-slide, which lands on this
// host's plain gated panel divs (see the template note above).

import type { KeyframesAnimation } from "@mkbabb/keyframes.js";
import type { AnimationLayerConfig } from "@mkbabb/keyframes.js";


import {
    computed,
    defineAsyncComponent,
    markRaw,
    shallowRef,
    Teleport,
    toRef,
    useTemplateRef,
    watch,
} from "vue";
import type KeyframeTimelineComponent from "../../timeline/KeyframeTimeline.vue";
import { useKeyframesPaneReveal } from "./composables/useKeyframesPaneReveal";
import { useSelectedControlSurface } from "./composables/useSelectedControlSurface";
import {
    useSceneMachine,
    BUILT_IN_SURFACES,
    SURFACE_META,
    type ControlSurface,
} from "@state";

const KeyframesStringControls = defineAsyncComponent(() => import("../../keyframes/KeyframesStringControls.vue"));
// X.KF.W13X.controls · KFA-119 — the timeline module is fetched at the idle
// warm (the same post-LCP moment the keyframes pane warms) or when the timeline
// is first asked for, and once fetched it renders SYNCHRONOUSLY. Behind
// `defineAsyncComponent`, the first Timeline switch waited on the chunk and
// even a cached module resolved a frame late: the slot rendered 0 px tall for
// 2-3 frames and the ribbon card below jumped up and back.
const KeyframeTimeline = shallowRef<typeof KeyframeTimelineComponent | null>(null);
let timelineLoad: Promise<void> | undefined;
const loadKeyframeTimeline = (): void => {
    timelineLoad ??= import("../../timeline/KeyframeTimeline.vue").then((m) => {
        KeyframeTimeline.value = markRaw(m.default);
    });
};
import ChannelOptions from "./ChannelOptions.vue";
import { getChannelControlsState, getStoredAnimationGroupControlOptions } from "@state";

const { animation, isPlaying: isPlayingProp, layerConfig, active } = defineProps<{
    animation: KeyframesAnimation<any>;
    // `| undefined` explicit: both are BOUND by every host
    // (`ControlsPaneWrapper.vue:50-58`), and `layerConfig` is an index read off
    // the layer map, so a present `undefined` is its ordinary value.
    isPlaying?: boolean | undefined;
    layerConfig?: AnimationLayerConfig | undefined;
    blendAvailable: boolean;
    active?: boolean;
}>();

const storedControls = getStoredAnimationGroupControlOptions(animation);

// ── THE CONTROL-SURFACE DFA (H.W11.S4 / I2) ─────────────────────────────────
// The active scene's valid control-surface set, projected from the W1 machine
// (the third orthogonal axis). Each built-in {controls,keyframes,timeline} pane
// is gated by `hasSurface` (the DFA-valid subset), so an INVALID surface CANNOT render per scene (the easing scene
// shows ONLY its slotted easing tab — no keyframes/timeline node). Reading the
// SAME projection the dock reads keeps the two tab hosts in lockstep — one
// authority, no drift.
//
// X.KF.W13X.r4pane (A2-KE-L1-12) — the host is ALWAYS the scene-machine-driven
// shell: the former `tabsExternallyManaged` axis had one provider (`App.vue`)
// passing the constant `true`, the App is the only mount path to this host, so
// its "standalone" arms were dead and are folded away with the key.
const machine = useSceneMachine();
// T.B2 — the tab {label,icon} metadata resolves from the ONE `SURFACE_META`
// registry (controlSurfaces.ts); the former local `BUILT_IN_TAB_META` copy
// (one of the three hand-synced sites) is DELETED.
//
// CAPABILITY RECORD for the deleted strip (CC-L-17/C-11). The strip consumed
// `SURFACE_META` and rendered LABELS ONLY: the registry's `icon` (and any
// tooltip) was silently dropped on the way in. Nothing is retired by the
// delete — the surviving switcher, the dock's controls `<Select>`, renders the
// registry icon at both its trigger and every item, so the capability moves
// from dropped-in-one-host to carried-in-the-only-host.
const hasSurface = (surface: ControlSurface): boolean =>
    machine.controlSurfaces.value.includes(surface);

// ── THE SELECTED-SURFACE SINGLE AUTHORITY (colocated composable) ────────────
// The machine-projected, synchronously-correct active surface + the
// derivation-sync writer (CC-L-18: ONE watch PER HOST over the shared store —
// N writers, each `!==`-guarded to the same projection, so the effect is
// single-writer while the old singular name was not; the composable's own
// docblock still carries the old name and is outside this unit's set)
// + the suspend-on-leave gate + the user-pick DFA
// projection all live in useSelectedControlSurface (the K.WZ proof:demo-no-
// oversize seam; zero behavior change). The
// cube matrix-controls conditional is now folded into the derived surface set
// (T.B2 — the Matrix channel's facet), so no `activeConditionals` inject remains.
const { selectedControlSurface, projectPick } = useSelectedControlSurface({
    animation,
    storedControls,
});

// UIA-KF-161 — the facet panel's name: the active surface's registry label,
// when the active surface is a scene facet (not one of the built-in three).
const facetSurfaceLabel = computed(() => {
    const surface = selectedControlSurface.value as ControlSurface;
    return BUILT_IN_SURFACES.includes(surface) ? null : SURFACE_META[surface]?.label ?? null;
});

const emit = defineEmits<{
    (
        e: "sliderUpdate",
        val: {
            t: number;
            animation: KeyframesAnimation<any>;
        },
    ): void;
    (
        e: "keyframesUpdate",
        val: {
            animation: KeyframesAnimation<any>;
        },
    ): void;
    (e: "togglePlay"): void;
    (e: "layerConfigUpdate", val: Partial<AnimationLayerConfig>): void;
    (e: "scrubStart"): void;
    (e: "scrubEnd"): void;
}>();

const keyframesControlsRef = useTemplateRef<InstanceType<typeof KeyframesStringControls>>("keyframesControlsRef");
const timelineRef =
    useTemplateRef<InstanceType<typeof KeyframeTimelineComponent>>("timelineRef");

const isTimelineVisible = computed(() =>
    storedControls.selectedControl === "timeline" || storedControls.isTimelineExpanded,
);

// B-2: the keyframes pane is force-mounted + content-visibility-cached when
// inactive; its reveal-focus + the T.G9 idle/interaction warm live in
// useKeyframesPaneReveal (the K.WZ proof:demo-no-oversize seam). The template ref
// stays declared here (template refs resolve in setup scope) and is passed in.
// `keyframesWarmed` gates the FIRST mount off the scene's LCP critical path (the
// Monaco-eager regression); the idle warm and the select warm both live in the
// composable. The INTERACTION warm used to hang off the deleted strip's
// pointerenter/focusin on a node that never rendered; it now lives on the dock's
// controls `<Select>` (`app/dock/ChromeDock.vue`), which prefetches this pane's
// chunk so the select-time mount lands on a warm module cache. Once warmed the
// force-mount + content-visibility cache is unchanged.
const keyframesPaneEl = useTemplateRef<any>("keyframesPaneEl");
const { keyframesActive, keyframesWarmed } = useKeyframesPaneReveal({
    storedControls,
    keyframesPaneEl,
    // X.KF.W13X.esc1 (ESC-mobile-1) — the channel's warm flag lives in the store.
    keyframesWarmed: toRef(getChannelControlsState(animation), "keyframesWarmed"),
});
// KFA-119 — the idle warm, or the first ask, fetches the timeline module.
watch(
    [keyframesWarmed, isTimelineVisible],
    ([warmed, visible]) => {
        if (visible || (warmed && hasSurface("timeline"))) loadKeyframeTimeline();
    },
    { immediate: true },
);

const selectControl = (key: string | number) => {
    // The user-pick path writes the DFA projection of the pick (not the raw key)
    // — see useSelectedControlSurface.projectPick (the single-authority owner).
    // Still reached: the keyboard shortcuts route here through
    // `AnimationControlsGroup`'s `switchTab` over the exposed handle.
    storedControls.selectedControl = projectPick(key.toString());
};

defineExpose({
    keyframesControlsRef,
    timelineRef,
    selectControl,
});
</script>

<style scoped>
/* B-2: cache the inactive force-mounted Monaco pane. content-visibility:hidden
   keeps the rendered Monaco subtree in memory but skips its layout/paint while
   inactive — a switch-back restores the cached pane instead of re-instantiating
   Monaco's worker/model/themes (the INP win). Baseline 2025-09-15. */
.monaco-pane.inactive {
    content-visibility: hidden;
}

/* Where content-visibility is unsupported, fall back to display:none so the
   force-mounted pane does not render alongside the active one. The cache benefit
   is lost there, but correctness (one visible pane) holds. */
@supports not (content-visibility: hidden) {
    .monaco-pane.inactive {
        display: none;
    }
}
</style>
