<template>
    <TooltipProvider :delay-duration="100" :skip-delay-duration="0">
    <div
        class="flex flex-col h-full w-full overflow-hidden z-content relative isolate"
    >
        <!-- J.W2 S2 (S4-stretch) — single-surface scenes mount FLAT. A scene
             whose DFA set is exactly ONE scene-specific surface (easing/spring)
             has NO tab to switch, so the `<Tabs>`/`TabsContent` machinery (and
             its reka model-value latch — the structural source of the
             `selectedControl` double role, `audit/wave-I.W2.md §6`) is bypassed
             entirely: the sole panel renders directly. There is no
             `:model-value` to project here — `selectedControl` keeps ONLY its
             preference role (read by ribbon/dock), owned by the single writer
             (the derivation-sync below). -->
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
            <!-- Tabs header (hidden when managed externally via ChromeDock).
                 glass-ui 4.0.0 (BA.W-TABS) — the reka `<Tabs>`/`<TabsList>` strip
                 is the canonical `<SegmentedTabs>` (panel-nav `role=tablist`/`tab`,
                 one indicator engine). K.W4 S4 (U-K12) — the material is `pill`
                 (the glass-track slider chip), NOT the near-invisible `underline`
                 ink-hairline rule the user called an "unlabeled divider". The strip
                 is OPTIONS-DRIVEN: `stripOptions`
                 unions the DFA-valid built-in triad with the scene-specific tabs
                 (the machine's `extraControlTabs` data), so the former
                 `tabs-trigger` slot + per-trigger reka injection retire — every tab
                 is data. The strip's own overflow fade comes from `<FadingScroll>`
                 at the consumer level in BA, but the ≤4-tab control strip never
                 overflows, so no scroller is wired here (the `useScrollFade`
                 overflow probe is retained below for the scroll-into-view of the
                 active tab on a narrow viewport). -->
            <div v-if="!tabsExternallyManaged" ref="tabsHeaderEl" class="relative w-fit flex items-center justify-center flex-shrink-0 glass-wash rounded-panel px-2 py-0.5 overflow-hidden">
                <!-- K.W4 S4 (U-K12) — the in-panel control strip is the PILL
                     register, not the near-invisible `underline` (the user's
                     verdict: "pills if tabs at all"). `variant="pill"` is the
                     3.13.0/4.0.0 glass-track slider — a legible on-brand chip the
                     active tab reads as, where the underline ink-hairline "read as
                     an unlabeled divider" (`live-dock-tabs-selects.md §1`). The
                     display-font register on the option labels is W2's single
                     `--font-display` authority (consumed via `tab-trigger.css`,
                     not re-authored here — the W2 boundary). -->
                <!-- R.W6 / DM-5 CONTINGENCY KILL — the kf-internal KfPillTabs
                     replaces glass-ui SegmentedTabs: the installed 4.0.1 pill emits
                     the orientation attribute UNCONDITIONALLY on its `role=group`,
                     forcing an undefined-binding suppress (the DM-5 band-aid
                     P-invariant-28 forbids re-carrying). KfPillTabs is a
                     `role=tablist`/`tab` strip — ARIA-correct by construction. The
                     `:options="stripOptions"` (←builtInTabs) DFA-driven contract is
                     unchanged (proof:scene-control-dfa D1). -->
                <KfPillTabs
                    :options="stripOptions"
                    :model-value="selectedControlSurface"
                    aria-label="Control surface"
                    @update:model-value="selectControl"
                    @pointerenter="warmKeyframes"
                    @focusin="warmKeyframes"
                    :class="['w-fit max-w-full min-w-0', overflowClass]"
                />
            </div>

            <div ref="tabsContentEl" class="flex-1 min-h-0 overflow-y-auto flex flex-col pb-1">
                <!-- glass-ui 4.0.0 (BA.W-TABS) — `<SegmentedTabs>` owns the STRIP
                     only; the content panels are owned HERE. Each formerly-reka
                     `<TabsContent value="x">` is now a plain `[role=tabpanel]` div
                     gated on the active surface (`selectedControlSurface`), keeping
                     the SAME DFA gate (a scene whose valid set omits a surface
                     mounts NO pane — the easing scene never spins up the Monaco
                     keyframes pane) and the SAME panel boxes. The
                     `[role=tabpanel][data-state=active]` seam the pane probes key on
                     (proof:easing-sidebar) is reproduced explicitly: `role`,
                     `data-state`, and a `tabindex` so the revealed panel is
                     focusable, matching the prior reka tabpanel contract. -->
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
    </TooltipProvider>
</template>

<script setup lang="ts">
// Colocated tab-trigger skin + tab-panel slide (uncaged from utils.css, D.W2.S2).
// glass-ui 4.0.0 (BA.W-TABS) — this host's strip is now `<SegmentedTabs>` (its own
// underline chrome), so the `.tab-trigger-*` skin no longer paints HERE; the
// non-scoped `[data-state=active][role=tabpanel]` panel-slide STILL lands on this
// host's plain gated panel divs (which carry `role=tabpanel` + `data-state`), and
// the `.tab-trigger-*` classes survive for the scene tab triggers that still
// reference them (a cross-cluster follow-on migrates those).

import type { KeyframesAnimation } from "@mkbabb/keyframes.js";
import type { AnimationLayerConfig } from "@mkbabb/keyframes.js";

import { TooltipProvider, Button } from "@mkbabb/glass-ui";
// glass-ui 4.0.0 (BA.W-TABS) — the reka `Tabs`/`TabsList`/`TabsTrigger`/`TabsContent`
// family LEFT the root barrel. The canonical panel-nav is `<SegmentedTabs
// variant="underline">` from `/tabs` (an options-driven STRIP, not a compound
// component): the strip renders `role=tablist`/`tab` buttons from `:options`, and
// the CONTENT panels are owned by THIS consumer (plain divs gated on the active
// value — there is no `<TabsContent>` context). The scene-specific surfaces that
// formerly injected reka `<TabsTrigger>` via the `tabs-trigger` slot now ride the
// strip AS DATA through the machine's `extraControlTabs` projection (the same
// metadata the dock reads), so no cross-realm reka tab-context is needed.
import KfPillTabs from "../KfPillTabs.vue";
import type { KfPillTabOption } from "../composables/useKfPillTabs";

import {
    computed,
    defineAsyncComponent,
    inject,
    Teleport,
    useTemplateRef,
    watch,
} from "vue";
import { TABS_EXTERNALLY_MANAGED_KEY } from "../injectionKeys";
import { ChevronDown, Minimize2 } from "@lucide/vue";
import { useTabStripScroll } from "./composables/useTabStripScroll";
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

const { animation, isPlaying: isPlayingProp, layerConfig, active, extraTabs } = defineProps<{
    animation: KeyframesAnimation<any>;
    isPlaying?: boolean;
    layerConfig?: AnimationLayerConfig;
    blendAvailable: boolean;
    active?: boolean;
    // glass-ui 4.0.0 (BA.W-TABS) — the STANDALONE-host extra-tab seam. A non-
    // scene-machine host (the playground EditorShell, `tabsExternallyManaged`
    // false) has no `extraControlTabs` machine projection to ride, so it injects
    // its scene-specific strip options AS DATA here (the SAME options-driven
    // pattern the machine-driven host gets from `extraControlTabs`), instead of a
    // reka `<TabsTrigger>`. The corresponding panel rides the `tabs-content` slot
    // gated on `selectedControlSurface` (the host owns its panel, exactly as the
    // built-in surfaces do). Empty by default — machine-driven hosts ignore it.
    extraTabs?: KfPillTabOption[];
}>();

const storedControls = getStoredAnimationGroupControlOptions(animation);

// When true, the tab header is hidden (tabs are managed externally, e.g. via ChromeDock)
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
const hasSurface = (surface: ControlSurface): boolean =>
    !tabsExternallyManaged || machine.controlSurfaces.value.includes(surface);
const builtInTabs = computed(() =>
    BUILT_IN_SURFACES.filter(
        (s) => !tabsExternallyManaged || machine.controlSurfaces.value.includes(s),
    ).map((s) => SURFACE_META[s]),
);

// glass-ui 4.0.0 (BA.W-TABS) — the `<SegmentedTabs>` strip is OPTIONS-DRIVEN, so
// the scene-specific tabs (easing/spring sidebars, cube's conditional
// matrix-controls) ride the strip as DATA, unioned onto the built-in triad. The
// metadata is the machine's `extraControlTabs` projection (the SAME source the
// dock reads), keyed off `activeScene` × the active conditionals — synchronously
// correct per tick, no reka `<TabsTrigger>` injection, no cross-realm tab context.
// A STANDALONE host (the playground EditorShell, not scene-machine-routed) gets no
// extra tabs (its activeScene rests on `home`), mirroring `builtInTabs`/`hasSurface`.
const stripOptions = computed<KfPillTabOption[]>(() => {
    // A scene-machine-driven host derives its extra tabs from the machine's
    // `extraControlTabs` projection; a STANDALONE host (the playground) injects
    // them via the `extraTabs` prop (the same DATA shape, sourced from the host
    // instead of the machine) — see the `extraTabs` prop note.
    const extra: KfPillTabOption[] = tabsExternallyManaged
        ? machine
              .extraControlTabs()
              .map((t) => ({ value: t.value, label: t.label }))
        : (extraTabs ?? []);
    return [...builtInTabs.value, ...extra];
});

// J.W2 S2 (S4-stretch) — a scene whose DFA set is exactly ONE scene-specific
// surface (easing → ['easing'], spring → ['spring']) mounts its panel FLAT:
// no `<Tabs>` machinery, no model-value latch, no double role for
// `selectedControl`. Machine-driven hosts only (the standalone playground shell
// keeps the full triad Tabs).
const isSingleSurfaceScene = computed(
    () =>
        tabsExternallyManaged &&
        machine.controlSurfaces.value.length === 1 &&
        builtInTabs.value.length === 0,
);

// ── THE SELECTED-SURFACE SINGLE AUTHORITY (colocated composable) ────────────
// The machine-projected, synchronously-correct active surface + THE ONE WRITER
// (the derivation-sync) + the suspend-on-leave gate + the user-pick DFA
// projection all live in useSelectedControlSurface (the K.WZ proof:demo-no-
// oversize seam; zero behavior change). `stripOptions`/`builtInTabs` deliberately
// stay HERE (the proof:scene-control-dfa D1 source anchor greps the host). The
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
const tabsHeaderEl = useTemplateRef<HTMLElement>("tabsHeaderEl");

const isTimelineVisible = computed(() =>
    storedControls.selectedControl === "timeline" || storedControls.isTimelineExpanded,
);

// B-2: the keyframes pane is force-mounted + content-visibility-cached when
// inactive; its reveal-focus + the T.G9 idle/interaction warm live in
// useKeyframesPaneReveal (the K.WZ proof:demo-no-oversize seam). The template ref
// stays declared here (template refs resolve in setup scope) and is passed in.
// `keyframesWarmed` gates the FIRST mount off the scene's LCP critical path (the
// Monaco-eager regression); `warmKeyframes` is the interaction gate (tab hover/
// focus). Once warmed the force-mount + content-visibility cache is unchanged.
const keyframesPaneEl = useTemplateRef<any>("keyframesPaneEl");
const { keyframesActive, keyframesWarmed, warmKeyframes } = useKeyframesPaneReveal({
    storedControls,
    keyframesPaneEl,
});

// --- Overflow detection + active-tab scroll-into-view (colocated composable) ---
// The DFA strip itself (`stripOptions` ← `builtInTabs`) stays here; the overflow
// fade + the active-tab scroll-into-view plumbing live in useTabStripScroll
// (the K.WZ proof:demo-no-oversize seam; zero behavior change).
const { overflowClass, reMeasure } = useTabStripScroll({ tabsHeaderEl });

const selectControl = (key: string | number) => {
    // The user-pick path writes the DFA projection of the pick (not the raw key)
    // — see useSelectedControlSurface.projectPick (the single-authority owner).
    storedControls.selectedControl = projectPick(key.toString());
    reMeasure();
};

// Re-measure when slot content changes (e.g., Matrix Controls tab appearing)
watch(() => storedControls.selectedControl, reMeasure);

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

/* The tab-overflow edge fade degrades to un-faded content on a browser without
   mask-image support — graceful, not a broken mask (D.W3.S3). Both the
   standard and -webkit- prefixed declarations are paired (the prior rules
   carried only the unprefixed form, no-op'ing on older WebKit). The fade
   magnitude reads the single-sourced --mask-fade token (G.W10.S5 — the former
   local --tabs-mask-fade shadow is collapsed). */
@supports (-webkit-mask-image: linear-gradient(#000, #000)) or
    (mask-image: linear-gradient(#000, #000)) {
    .tabs-overflow-right {
        mask-image: linear-gradient(to right, black calc(100% - var(--mask-fade)), transparent);
        -webkit-mask-image: linear-gradient(to right, black calc(100% - var(--mask-fade)), transparent);
    }
    .tabs-overflow-left {
        mask-image: linear-gradient(to right, transparent, black var(--mask-fade));
        -webkit-mask-image: linear-gradient(to right, transparent, black var(--mask-fade));
    }
    .tabs-overflow-both {
        mask-image: linear-gradient(to right, transparent, black var(--mask-fade), black calc(100% - var(--mask-fade)), transparent);
        -webkit-mask-image: linear-gradient(to right, transparent, black var(--mask-fade), black calc(100% - var(--mask-fade)), transparent);
    }
}
</style>
