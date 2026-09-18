<template>
    <div
        class="flex flex-col h-full w-full overflow-hidden z-content relative isolate"
    >
        <!-- J.W2 S2 (S4-stretch) — the FLAT mount for a facility whose derived
             surface set is exactly ONE surface: no `<Tabs>`/`TabsContent`
             machinery, no reka model-value latch (the structural source of the
             `selectedControl` double role, `audit/wave-I.W2.md §6`), the sole
             panel renders directly. CC-D-7/L-4 (KF.W6): under the live T.B2
             derivation (`surfacesFor`, `state/controlSurfaces.ts`) NO shipped
             facility produces a one-member set — easing and spring, the two the
             earlier note named as its examples, each derive the built-in triad
             plus their signature facet — so this branch is currently
             UNREACHABLE. It is kept, not deleted: the delete is a NO-WAVE-OWNER
             decision the bank holds, and this note claims only what the
             derivation can be read to prove. `selectedControl` keeps ONLY its
             preference role (read by ribbon/dock); the derivation-sync in
             `useSelectedControlSurface` writes it back per host. -->
        <div
            v-if="isSingleSurfaceScene"
            class="pl-4 pr-7 pt-2 pb-2 w-full flex-1 min-h-0 flex flex-col justify-start"
        >
            <div class="flex-1 min-h-0 overflow-y-auto flex flex-col pb-1">
                <!-- The flat-mount PANEL HOST — the exact analogue of the
                     deleted `<TabsContent>` wrapper, on BOTH its axes:
                     · PIXEL PARITY: TabsContent carried a default `mt-2` (8px)
                       and the scenes passed `h-full`; the flat mount renders
                       the SAME box the Tabs mount did (the visual-lock
                       baseline) — a source swap, not an appearance delta.
                     · NAMED SEAM: `single-surface-panel` (style-free) replaces
                       the `[role="tabpanel"][data-state="active"]` anchor the
                       pane probes key on (proof:easing-sidebar-{normalized,
                       minimal}); a bare tabpanel role without a tablist would
                       be an ARIA defect, so the seam is a class, not a role. -->
                <div class="single-surface-panel mt-2 h-full">
                    <slot name="tabs-content"></slot>
                </div>
            </div>
        </div>

        <div
            v-else
            class="pl-4 pr-7 pt-2 pb-2 w-full flex-1 min-h-0 flex flex-col justify-start"
        >
            <div ref="tabsContentEl" class="flex-1 min-h-0 overflow-y-auto flex flex-col pb-1">
                <!-- THE CONTROL SURFACES. Each is a plain div gated on the active
                     surface (`selectedControlSurface`) under the SAME DFA gate (a
                     scene whose valid set omits a surface mounts NO pane — the
                     easing scene never spins up the Monaco keyframes pane).

                     THE PANELS' NAMING, DECIDED WITH THE STRIP'S FATE (CC-D-2/C-3
                     + N-4). There is no in-panel strip any more: the header that
                     rendered one sat behind `v-if="!tabsExternallyManaged"`, which
                     the App holds permanently false, and it is deleted. The dock's
                     controls `<Select>` is the sole surface switcher, so these are
                     NOT a tablist's panels and no `role="tab"` owns them. `role`
                     and `data-state` are RETAINED DELIBERATELY, not by inertia:
                     the `[data-state="active"][role="tabpanel"]` panel-enter rule
                     (`styles/tab-idiom.css`) and the pane probes key on exactly
                     that pair, and retiring the rule is an open decision this wave
                     does not own — so stripping the attributes here would pre-empt
                     it. What REMAINS open is the accessible NAME (no
                     `aria-labelledby`/`aria-label` on any of the four sites — the
                     fourth is `CubeScene.vue`'s `h()`-rendered matrix panel): that
                     is the a11y spec input the row is banked as, and it is stated
                     here rather than improvised. -->
                <div
                    v-if="hasSurface('controls') && selectedControlSurface === 'controls'"
                    role="tabpanel"
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
                    data-state="active"
                    tabindex="0"
                >
                    <!-- Placeholder shown in the tab when timeline is expanded to bottom bar -->
                    <div
                        v-if="storedControls.isTimelineExpanded"
                        class="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground"
                    >
                        <ChevronDown class="w-6 h-6 animate-bounce" />
                        <p class="text-small font-medium">Timeline expanded below</p>
                        <Button
                            size="sm"
                            emphasis="quiet"
                            class="gap-1.5 text-small font-medium"
                            @click="storedControls.isTimelineExpanded = false"
                        >
                            <Minimize2 class="icon-sm" />
                            Collapse
                        </Button>
                    </div>
                </div>

                <!-- Scene-specific panels (cube's matrix-controls body, the
                     easing/spring sidebars). These flow through the `tabs-content`
                     slot AS BEFORE; the scene gates its own body on the active
                     surface. NOTE: the scene-supplied bodies that wrapped content
                     in a reka `<TabsContent>` must re-home onto a plain gated div
                     (a cross-cluster follow-on — reported, not edited here). -->
                <slot name="tabs-content"></slot>

                <!-- Timeline: outside the gated panels but inside the scrollable
                     area so Teleport lifecycle isn't tied to a panel mount/unmount
                     (which breaks moveTeleport). When collapsed, renders in-place
                     here. When expanded, teleports to bottom bar. -->
                <Teleport to="#timeline-expanded-target" :disabled="!storedControls.isTimelineExpanded" defer>
                    <div
                        v-if="isTimelineVisible"
                        :key="storedControls.selectedControl"
                        class="animate-in fade-in slide-in-from-right-2 duration-fast"
                    >
                        <KeyframeTimeline
                            ref="timelineRef"
                            :targets="animation.targets"
                            :animation-options="animation.options"
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
// they painted; what survives in `styles/tab-idiom.css` is the non-scoped
// `[data-state=active][role=tabpanel]` panel-slide, which still lands on this
// host's plain gated panel divs (see the template note above).

import type { KeyframesAnimation } from "@mkbabb/keyframes.js";
import type { AnimationLayerConfig } from "@mkbabb/keyframes.js";

import { Button } from "@mkbabb/glass-ui";

import {
    computed,
    defineAsyncComponent,
    inject,
    Teleport,
    useTemplateRef,
} from "vue";
import { TABS_EXTERNALLY_MANAGED_KEY } from "../injectionKeys";
import { ChevronDown, Minimize2 } from "@lucide/vue";
import { useKeyframesPaneReveal } from "./composables/useKeyframesPaneReveal";
import { useSelectedControlSurface } from "./composables/useSelectedControlSurface";
import {
    useSceneMachine,
    BUILT_IN_SURFACES,
    SURFACE_META,
    type ControlSurface,
} from "@state";

const KeyframesStringControls = defineAsyncComponent(() => import("../../keyframes/KeyframesStringControls.vue"));
const KeyframeTimeline = defineAsyncComponent(() => import("../../timeline/KeyframeTimeline.vue"));
import ChannelOptions from "./ChannelOptions.vue";
import { getStoredAnimationGroupControlOptions } from "@state";

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

// True when the surfaces are switched externally (the dock's controls
// `<Select>`), which at the frontier is ALWAYS: `App.vue` provides it `true`
// unconditionally and is the only mount path to this component. That is exactly
// why the in-panel header this file used to render behind `!tabsExternallyManaged`
// was dead code and is deleted.
//
// THE FLAG ITSELF SURVIVES THAT DELETE, deliberately and not by oversight. It is
// no longer only the strip's gate: it also gates `hasSurface`'s DFA filter,
// `builtInTabs`, `isSingleSurfaceScene`'s flat mount, and the machine projection
// + the derivation-sync writer inside `useSelectedControlSurface`. Dropping the provide while
// the `inject` default stays `false` would silently flip all four; folding the
// axis away honestly means editing `useSelectedControlSurface`, which is outside
// what this change may touch. So the dead BRANCH goes and the live axis stays,
// and the residual — a fork whose only provider is a constant — is recorded here
// rather than half-cured.
const tabsExternallyManaged = inject(TABS_EXTERNALLY_MANAGED_KEY, false);

// ── THE CONTROL-SURFACE DFA (H.W11.S4 / I2) ─────────────────────────────────
// The active scene's valid control-surface set, projected from the W1 machine
// (the third orthogonal axis). The built-in {controls,keyframes,timeline} triad
// is rendered FROM `builtInTabs` (the DFA-valid subset) + each pane is gated by
// `hasSurface`, so an INVALID surface CANNOT render per scene (the easing scene
// shows ONLY its slotted easing tab — no keyframes/timeline node). Reading the
// SAME projection the dock reads keeps the two tab hosts in lockstep — one
// authority, no drift.
//
// The DFA gates ONLY when the host is the scene-machine-driven shell
// (`tabsExternallyManaged`). A STANDALONE host (the playground EditorShell, which
// does NOT route through the scene machine — its activeScene stays the `home`
// default) shows the FULL built-in triad: it is the standalone editor, not a
// per-scene DFA-gated surface.
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
// from dropped-in-one-host to carried-in-the-only-host. `builtInTabs` stays for
// the DFA arithmetic below, not for a strip.
const hasSurface = (surface: ControlSurface): boolean =>
    !tabsExternallyManaged || machine.controlSurfaces.value.includes(surface);
const builtInTabs = computed(() =>
    BUILT_IN_SURFACES.filter(
        (s) => !tabsExternallyManaged || machine.controlSurfaces.value.includes(s),
    ).map((s) => SURFACE_META[s]),
);

// J.W2 S2 (S4-stretch) — a facility whose derived surface set is exactly ONE
// surface mounts its panel FLAT: no `<Tabs>` machinery, no model-value latch,
// no double role for `selectedControl`. Machine-driven hosts only (the
// standalone playground shell keeps the full triad Tabs). CC-D-7/L-4: no
// shipped facility derives such a set today (easing and spring derive four
// surfaces each — see the template note), so this computed is currently always
// `false`; the branch survives pending the bank's NO-WAVE-OWNER delete.
const isSingleSurfaceScene = computed(
    () =>
        tabsExternallyManaged &&
        machine.controlSurfaces.value.length === 1 &&
        builtInTabs.value.length === 0,
);

// ── THE SELECTED-SURFACE SINGLE AUTHORITY (colocated composable) ────────────
// The machine-projected, synchronously-correct active surface + the
// derivation-sync writer (CC-L-18: ONE watch PER HOST over the shared store —
// N writers, each `!==`-guarded to the same projection, so the effect is
// single-writer while the old singular name was not; the composable's own
// docblock still carries the old name and is outside this unit's set)
// + the suspend-on-leave gate + the user-pick DFA
// projection all live in useSelectedControlSurface (the K.WZ proof:demo-no-
// oversize seam; zero behavior change). `builtInTabs` deliberately stays HERE
// (the scene-control-DFA source anchor greps the host). The
// cube matrix-controls conditional is now folded into the derived surface set
// (T.B2 — the Matrix channel's facet), so no `activeConditionals` inject remains.
const { selectedControlSurface, projectPick } = useSelectedControlSurface({
    animation,
    storedControls,
    tabsExternallyManaged,
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
const timelineRef = useTemplateRef<InstanceType<typeof KeyframeTimeline>>("timelineRef");
const tabsContentEl = useTemplateRef<HTMLElement>("tabsContentEl");

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
});

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
