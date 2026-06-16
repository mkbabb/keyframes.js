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
                <SegmentedTabs
                    variant="pill"
                    :options="stripOptions"
                    :model-value="selectedControlSurface"
                    @update:model-value="selectControl"
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
                    <AnimationControlsControls
                        :animation="animation"
                        :is-playing="isPlayingProp"
                        :layer-config="layerConfig"
                        :active="active"
                        @slider-update="(v) => emit('sliderUpdate', v)"
                        @toggle-play="emit('togglePlay')"
                        @layer-config-update="(v) => emit('layerConfigUpdate', v)"
                        @scrub-start="emit('scrubStart')"
                        @scrub-end="emit('scrubEnd')"
                    ></AnimationControlsControls>
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
                    v-if="hasSurface('keyframes')"
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
                        <p class="text-mono-small">Timeline expanded below</p>
                        <Button
                            size="sm"
                            variant="ghost"
                            class="gap-1.5 text-mono-caption normal-case"
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
import "./tab-trigger.css";

import { Animation } from "@src/animation/engine";
import type { AnimationLayerConfig } from "@src/animation/constants";

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
import { SegmentedTabs } from "@mkbabb/glass-ui/tabs";
import type { SegmentedTabOption } from "@mkbabb/glass-ui/tabs";

import {
    computed,
    defineAsyncComponent,
    inject,
    Teleport,
    useTemplateRef,
    watch,
} from "vue";
import {
    ACTIVE_CONTROL_CONDITIONALS_KEY,
    ACTIVE_SUPER_KEY,
    TABS_EXTERNALLY_MANAGED_KEY,
} from "../injectionKeys";
import { ChevronDown, Minimize2 } from "@lucide/vue";
import { useTabStripScroll } from "./composables/useTabStripScroll";
import { useKeyframesPaneReveal } from "./composables/useKeyframesPaneReveal";
import {
    useSceneMachine,
    BUILT_IN_SURFACES,
    type ControlSurface,
} from "../stores";

const KeyframesStringControls = defineAsyncComponent(() => import("../keyframes/KeyframesStringControls.vue"));
const KeyframeTimeline = defineAsyncComponent(() => import("../timeline/KeyframeTimeline.vue"));
import AnimationControlsControls from "./AnimationControlsControls.vue";
import { getStoredAnimationGroupControlOptions } from "../stores";

const { animation, isPlaying: isPlayingProp, layerConfig, active, extraTabs } = defineProps<{
    animation: Animation<any>;
    isPlaying?: boolean;
    layerConfig?: AnimationLayerConfig;
    active?: boolean;
    // glass-ui 4.0.0 (BA.W-TABS) — the STANDALONE-host extra-tab seam. A non-
    // scene-machine host (the playground EditorShell, `tabsExternallyManaged`
    // false) has no `extraControlTabs` machine projection to ride, so it injects
    // its scene-specific strip options AS DATA here (the SAME options-driven
    // pattern the machine-driven host gets from `extraControlTabs`), instead of a
    // reka `<TabsTrigger>`. The corresponding panel rides the `tabs-content` slot
    // gated on `selectedControlSurface` (the host owns its panel, exactly as the
    // built-in surfaces do). Empty by default — machine-driven hosts ignore it.
    extraTabs?: SegmentedTabOption[];
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
const BUILT_IN_TAB_META: Record<string, { value: string; label: string }> = {
    controls: { value: "controls", label: "Controls" },
    keyframes: { value: "keyframes", label: "Keyframes" },
    timeline: { value: "timeline", label: "Timeline" },
};
const hasSurface = (surface: ControlSurface): boolean =>
    !tabsExternallyManaged || machine.controlSurfaces.value.includes(surface);
const builtInTabs = computed(() =>
    BUILT_IN_SURFACES.filter(
        (s) => !tabsExternallyManaged || machine.controlSurfaces.value.includes(s),
    ).map((s) => BUILT_IN_TAB_META[s]!),
);

// glass-ui 4.0.0 (BA.W-TABS) — the `<SegmentedTabs>` strip is OPTIONS-DRIVEN, so
// the scene-specific tabs (easing/spring sidebars, cube's conditional
// matrix-controls) ride the strip as DATA, unioned onto the built-in triad. The
// metadata is the machine's `extraControlTabs` projection (the SAME source the
// dock reads), keyed off `activeScene` × the active conditionals — synchronously
// correct per tick, no reka `<TabsTrigger>` injection, no cross-realm tab context.
// A STANDALONE host (the playground EditorShell, not scene-machine-routed) gets no
// extra tabs (its activeScene rests on `home`), mirroring `builtInTabs`/`hasSurface`.
const stripOptions = computed<SegmentedTabOption[]>(() => {
    // A scene-machine-driven host derives its extra tabs from the machine's
    // `extraControlTabs` projection; a STANDALONE host (the playground) injects
    // them via the `extraTabs` prop (the same DATA shape, sourced from the host
    // instead of the machine) — see the `extraTabs` prop note.
    const extra: SegmentedTabOption[] = tabsExternallyManaged
        ? machine
              .extraControlTabs(activeConditionals?.value)
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

// J.W2 S2 — the ACTIVE scene's superKey + the currently-active conditional
// surfaces (App-provided; undefined on a standalone host). The superKey is
// atomic with `machine.activeScene`, so the write gate below can never lag the
// transition; the conditionals make the projection conditional-surface-aware
// (cube's matrix-controls falls back AT the authority when Matrix deselects).
const activeSuperKey = inject(ACTIVE_SUPER_KEY, undefined);
const activeConditionals = inject(ACTIVE_CONTROL_CONDITIONALS_KEY, undefined);

// Does THIS host's store belong to the ACTIVE scene? During the NAVIGATE →
// SCENE_READY window the controls still host the LEAVING scene's animations
// (the App swaps `currentAnimationGroup` only on SCENE_READY) — a host whose
// `animation.superKey` is not the active scene's must NOT write the destination
// scene's projection into its own (the leaving scene's) store. This is the
// suspend-on-leave half of the single-writer contract: the leaving scene's
// preference SURVIVES the transition and fully resumes on re-entry (the
// perf-battery §2 `selectedControl:"spring"`-in-the-Easing-store corruption,
// cured structurally).
const isActiveSceneHost = computed(
    () =>
        !activeSuperKey ||
        activeSuperKey.value === (animation.superKey ?? "default"),
);

// ── THE SELECTED-SURFACE SINGLE AUTHORITY (I.W2.S1 · OWNS the I.W1-shared mount)
// The `<Tabs> :model-value` is a MACHINE-PROJECTED, synchronously-correct value:
// the active scene's selected surface resolved as a PURE FUNCTION of (the DFA
// set × the group's stored pick) via `selectedControlSurfaceFor`. On a scene
// SWITCH this is born `"easing"` on the very tick the reka `<Tabs>` root mounts,
// so its `useVModel` `passive`-latch is taken CORRECT (not `undefined`/stale) —
// the B4 desync (the panel selected-but-`data-state="inactive"` on switch-in) is
// fixed at its source, no `nextTick` re-assert. The mount is order-independent:
// it depends only on (DFA surfaces × the active group's pick), never on flush-
// completion order — this is the single-authority I.W1's S3 consumes for B2's
// resumed scene. The STANDALONE host (playground EditorShell, not scene-machine-
// routed) keeps the raw stored pick (its activeScene stays the `home` default,
// so the projection would be `undefined`); the DFA projection gates ONLY when
// `tabsExternallyManaged`, mirroring `hasSurface`/`builtInTabs`.
const selectedControlSurface = computed<string>(() =>
    tabsExternallyManaged
        ? machine.selectedControlSurface(
              storedControls.selectedControl,
              activeConditionals?.value,
          ) ?? storedControls.selectedControl
        : storedControls.selectedControl,
);

// Reconcile the store to the single authority — THE ONE WRITER (J.W2 S2).
// Downstream store-reading computeds (the timeline-visible / keyframes-active
// gates below, the ribbon's `selectedControl`, the dock trigger) read
// `storedControls.selectedControl`; when the machine projection corrects a
// stale pick (a single-surface scene entered with another scene's stored
// selection; a matrix-controls pick whose Matrix condition lapsed), write it
// BACK so the store mirrors the authority. This is a derivation-sync, NOT a
// latch re-assert — idempotent, fires only on genuine divergence, and the
// projection (not this write) is what the `<Tabs>` binds, so it can never race
// the mount. Replaces the per-scene `setup` pokes (EasingScene/SpringScene) and
// the CubeScene matrix-fallback watch, all DELETED — every fallback is a
// function OF the DFA, computed here. The `isActiveSceneHost` gate is the
// suspend-on-leave half: a stale-mounted host (NAVIGATE → SCENE_READY window)
// never writes a cross-scene projection into the leaving scene's store.
watch(
    selectedControlSurface,
    (surface) => {
        if (
            tabsExternallyManaged &&
            surface &&
            isActiveSceneHost.value &&
            storedControls.selectedControl !== surface
        ) {
            storedControls.selectedControl = surface;
        }
    },
    { immediate: true },
);

const emit = defineEmits<{
    (
        e: "sliderUpdate",
        val: {
            t: number;
            animation: Animation<any>;
        },
    ): void;
    (
        e: "keyframesUpdate",
        val: {
            animation: Animation<any>;
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
// inactive; its reveal-focus concern lives in useKeyframesPaneReveal (the K.WZ
// proof:demo-no-oversize seam; zero behavior change). The template ref stays
// declared here (template refs resolve in setup scope) and is passed in.
const keyframesPaneEl = useTemplateRef<any>("keyframesPaneEl");
const { keyframesActive } = useKeyframesPaneReveal({ storedControls, keyframesPaneEl });

// --- Overflow detection + active-tab scroll-into-view (colocated composable) ---
// The DFA strip itself (`stripOptions` ← `builtInTabs`) stays here; the overflow
// fade + the active-tab scroll-into-view plumbing live in useTabStripScroll
// (the K.WZ proof:demo-no-oversize seam; zero behavior change).
const { overflowClass, reMeasure } = useTabStripScroll({ tabsHeaderEl });

const selectControl = (key: string | number) => {
    // J.W2 S2 — the user-pick path ALSO writes the DFA projection of the pick
    // (not the raw key), so every value that ever lands in the field is a
    // projection of the single authority: an invalid pick (a keyboard shortcut
    // firing a surface this scene doesn't have) resolves to the scene's valid
    // surface instead of transiting through the store.
    const pick = key.toString();
    storedControls.selectedControl = tabsExternallyManaged
        ? machine.selectedControlSurface(pick, activeConditionals?.value) ?? pick
        : pick;
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

