<template>
    <!-- X.KF.W13X.controls · A2-KE-L1-7 — the Controls card is a COMPOSITION
         now, not the owner of five jobs: the options form
         (`ChannelOptionsForm`, with its one guarded commit), the easing row
         (`EasingField`), the ONE drill-in owner (`usePaneStack`: which pane is
         up, what stays mounted through an exit, where focus goes), the ONE
         sub-pane header both sub-panes wear (`SubPaneHeader`), and the ribbon
         mount below. -->
    <div>
        <!-- X-DS pass 1, C1 (KF-C1-07) — no card of its own: the pane host draws the one frame (ControlsPaneWrapper). -->
        <div class="w-full">
            <div class="flex flex-col px-4 py-3">
                <!-- Each pane in its own collapsible row. KF-CO-5 ≡ KF-TFP-7 +
                     KF-CO-46 — a COLLAPSED row is `inert` (out of the Tab order,
                     the pointer and the accessibility tree in one stroke). -->
                <div>
                    <div
                        :class="['panel-row', stack.isOpen('main') ? 'panel-row--active' : 'panel-row--inactive']"
                        :inert="!stack.isOpen('main')"
                    >
                        <div class="panel-content flex w-full flex-col gap-2">
                            <ChannelOptionsForm
                                v-model:open-select="openSelect"
                                :animation="animation"
                                @duration-committed="(ms) => (railDuration = ms)"
                            >
                                <EasingField
                                    ref="easingFieldEl"
                                    :selected-curve-key="selectedCurveKey"
                                    :curve-glyphs="curveGlyphs"
                                    :curve-fn-for="curveFnFor"
                                    :open="openSelect === 'easing'"
                                    @update:open="(v) => (openSelect = v ? 'easing' : null)"
                                    @pick="(name) => onEasingPick(name)"
                                    @edit="openDetail"
                                />
                            </ChannelOptionsForm>

                            <!-- X-DS pass 4 (KF-C4-18) — the disclosure keeps the
                                 field rows' rhythm: the column's 0.5rem gap either
                                 side of its one separator, no extra margin, so the
                                 row is one control height, not a padded band. -->
                            <Separator />

                            <!-- X.KF.W13X.controls · UIA-KF-269 · 273 — the drill
                                 row is the producer's quiet Button (its own focus
                                 ring and hit area; the raw `<button>` with the
                                 demo's `.kf-focus-ring` is gone), and it names the
                                 CONTENT — `layer` compositing — not a bucket
                                 ("advanced").
                                 X-DS pass 1, C1 (KF-C1-15) — the label sits in
                                 the grid's label column at the label ink: no
                                 inline padding of its own, and the quiet
                                 Button's ink token is the label's foreground.
                                 X-DS pass 2 (KF-C2-06) — and at the label's SIZE:
                                 the row's text is the `.label` register
                                 (`--control-label`, 500), not the Button's
                                 `--control-text`, so the column has one size.
                                 X-DS pass 7 (KF-C7-06) — the row states what it
                                 leads to, in its field column at the muted ink:
                                 the current blend when compositing applies, or
                                 "single-target only" (and the row quiet, at the
                                 muted ink) when it does not, so the drill never
                                 reads as live into a pane of disabled rows. -->
                            <Button
                                ref="layerEntryEl"
                                emphasis="quiet"
                                :class="[
                                    'w-full justify-between gap-2 px-0 text-[length:var(--control-label)]',
                                    blendAvailable
                                        ? '[--button-quiet-ink:var(--foreground)]'
                                        : '[--button-quiet-ink:var(--muted-foreground)]',
                                ]"
                                :aria-expanded="stack.isOpen('layer')"
                                :aria-controls="layerPaneId"
                                @click="openLayer"
                            >
                                <span>layer</span>
                                <span class="ms-auto min-w-0 truncate font-normal text-muted-foreground">{{
                                    blendAvailable ? (layerConfig?.op ?? "") : "single-target only"
                                }}</span>
                                <ChevronRight class="icon-sm" />
                            </Button>
                        </div>
                    </div>

                    <!-- The timing-function editor (cubic-bezier / steps). -->
                    <div
                        ref="detailRowEl"
                        :class="['panel-row panel-row--detail', stack.isOpen('detail') ? 'panel-row--active' : 'panel-row--inactive']"
                        :inert="!stack.isOpen('detail')"
                        @transitionend="(e) => stack.onRowTransitionEnd('detail', e)"
                    >
                        <div class="panel-content">
                            <SubPaneHeader
                                ref="detailHeaderEl"
                                :title="detailTitle"
                                @back="closePane"
                            >
                                <template #caption>{{ caption }}</template>
                            </SubPaneHeader>
                            <!-- UIA-KF-036 · A2-KE-X-6 — only the BODY scrolls;
                                 the header above is its sibling. KFA-36 — the
                                 editor stays mounted through its row's collapse
                                 (`isMounted`), and unmounts when it ends. -->
                            <div data-subpane-body class="subpane-body">
                                <TimingFunctionPanel
                                    v-if="stack.isMounted('detail')"
                                    :stored-animation-options="storedAnimationOptions"
                                    :peek-quad="peekQuad"
                                    @authored="onEasingAuthored"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- The layer compositing pane. -->
                    <div
                        :id="layerPaneId"
                        ref="layerRowEl"
                        @transitionend="(e) => stack.onRowTransitionEnd('layer', e)"
                        :class="['panel-row', stack.isOpen('layer') ? 'panel-row--active' : 'panel-row--inactive']"
                        :inert="!stack.isOpen('layer')"
                    >
                        <div class="panel-content flex w-full flex-col gap-2">
                            <!-- UIA-KF-082 · 270 — the reason is stated ONCE, as
                                 the pane's caption: on a multi-target group the
                                 engine never composites layers
                                 (`renderMultiTarget` reads no `entry.layer`), so
                                 every row below is disabled and this line says
                                 why. -->
                            <SubPaneHeader ref="layerHeaderEl" title="layer" @back="closePane">
                                <template #caption>{{
                                    blendAvailable
                                        ? "How this channel blends with the others"
                                        : "Layer compositing applies to single-target groups"
                                }}</template>
                            </SubPaneHeader>
                            <!-- H.W11.I1 — LayerConfigPanel's rows join the SAME
                                 label-column subgrid idiom (one DRY source,
                                 design-idioms.css §LABEL-subgrid). KF-CO-1 /
                                 LP-2 / LP-16 — the blend select's open state
                                 rides the producer's declared `open` pair,
                                 through the card's one-open mutex. -->
                            <div v-if="layerConfig" class="labeled-field-grid">
                                <LayerConfigPanel
                                    :layer-config="layerConfig"
                                    :blend-available="blendAvailable"
                                    :open="openSelect === 'blend'"
                                    @update:open="(v) => (openSelect = v ? 'blend' : null)"
                                    @update="(v) => emit('layerConfigUpdate', v)"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Playback controls: teleported to the ribbon while this is the
             active channel. (A2-KE-L1-24 / UIA-KF-051 — the ribbon's single
             mount from RibbonBar is `.transport`'s one-transport ruling; the
             teleport retires there, in that motion.) -->
        <Teleport v-if="active" to="#controls-ribbon-target" defer>
            <PlaybackRibbon
                :animation="animation"
                :duration="railDuration"
                :current-t="currentT"
                :is-anim-playing="isAnimPlaying"
                :user-reversed="userReversed"
                :preview="sceneControls.ballPreview ?? 'shown'"
                @update:preview="(next) => (sceneControls.ballPreview = next)"
                @scrub-start="
                    () => {
                        wake();
                        emit('scrubStart');
                    }
                "
                @scrub-end="emit('scrubEnd')"
                @scrubbed="wake"
                @slider-update="
                    (v) => {
                        wake();
                        emit('sliderUpdate', v);
                    }
                "
                @toggle-play="toggleAnimation"
                @toggle-reverse="toggleReverse"
            />
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import type { KeyframesAnimation } from "@mkbabb/keyframes.js";
import type { AnimationLayerConfig } from "@mkbabb/keyframes.js";
import type { EasingPickerValue } from "@mkbabb/glass-ui/easing";

import { Button, Separator } from "@mkbabb/glass-ui";
import { ChevronRight } from "@lucide/vue";
import PlaybackRibbon from "@components/playback/PlaybackRibbon.vue";
import { EASING_GROUPS } from "@utils/reference-data/easingGroups";
import { timingFunctionKind } from "@utils/reference-data/animationDescriptions";
import {
    getStoredAnimationGroupControlOptions,
    getStoredAnimationOptions,
} from "@state";

import { computed, ref, toRef, useId, useTemplateRef, watch } from "vue";

import ChannelOptionsForm from "./ChannelOptionsForm.vue";
import EasingField from "./EasingField.vue";
import LayerConfigPanel from "./LayerConfigPanel.vue";
import SubPaneHeader from "./SubPaneHeader.vue";
import TimingFunctionPanel from "./TimingFunctionPanel.vue";
import { useAnimationSync } from "./composables/useAnimationSync";
import { usePaneStack } from "./composables/usePaneStack";
import { usePlaybackToggle } from "./composables/usePlaybackToggle";
import { useTimingFunctionEditor } from "./composables/useTimingFunctionEditor";

const props = defineProps<{
    animation: KeyframesAnimation<any>;
    isPlaying?: boolean;
    // `| undefined` explicit — bound, never omitted, by `ChannelControls.vue`.
    layerConfig?: AnimationLayerConfig | undefined;
    blendAvailable: boolean;
    active?: boolean;
}>();

const emit = defineEmits<{
    (e: "sliderUpdate", val: { t: number; animation: KeyframesAnimation<any> }): void;
    (e: "togglePlay"): void;
    (e: "layerConfigUpdate", val: Partial<AnimationLayerConfig>): void;
    (e: "scrubStart"): void;
    (e: "scrubEnd"): void;
}>();

const storedAnimationOptions = getStoredAnimationOptions(props.animation);
// OA-61 — the ball preview's eye is the scene's view state (the channel's
// scene bucket, the animation's superKey).
const sceneControls = getStoredAnimationGroupControlOptions(props.animation);

// ── KF-CO-15 (the X.KF.W13.b carve, joint with the ribbon's C-2 contract) ────
// The rail's scale is a REACTIVE read of the engine's duration (`animation` is
// markRaw). The form is the one writer of the duration and publishes each
// ACCEPTED value (`durationCommitted`), so the ribbon's rail and its inversion
// share one scale.
const railDuration = ref(props.animation.options.duration);
watch(
    () => props.animation,
    (a) => {
        railDuration.value = a.options.duration;
    },
);

const {
    caption,
    peekQuad,
    selectedCurveKey,
    onCurvePicked,
    beginEdit,
    markAuthored,
    endEdit,
    updateTimingFunctionFromName,
    curveGlyphPath,
    curveFnFor,
} = useTimingFunctionEditor(() => props.animation, storedAnimationOptions);

// X.KF.W13T.k3 · ESC-k2-1 (§0ar) — this card HOLDS the stored-options key, so
// the editor's authored curve is written HERE: the step or quad options first,
// then the kind is installed through the one persist seam. UIA-KF-165 — this
// is the FIRST write of an editing session; opening the editor wrote nothing.
const onEasingAuthored = (v: EasingPickerValue): void => {
    markAuthored();
    if (v.mode === "steps") {
        storedAnimationOptions.stepOptions.steps = v.steps;
        storedAnimationOptions.stepOptions.jumpTerm = v.term;
        updateTimingFunctionFromName("steps");
        return;
    }
    storedAnimationOptions.cubicBezierOptions.controlPoints = [...v.points];
    updateTimingFunctionFromName("cubic-bezier");
};

// OA-7 (§0ao.1) — every picker row's curve glyph, keyed by row name: sampled
// from the easing the row installs, so the draft-kind rows track the store's
// live quad / step options reactively.
const curveGlyphs = computed(
    () =>
        new Map<string, string>(
            EASING_GROUPS.flatMap((g) =>
                g.items.map((i) => [i.name, curveGlyphPath(i.name)] as const),
            ),
        ),
);

// The editor's title names the curve's KIND (literal-aware; a peeked name is
// shown as the cubic-bézier it is edited as).
const detailTitle = computed(() =>
    timingFunctionKind(storedAnimationOptions.animationOptions.timingFunction) === "steps"
        ? "steps"
        : "cubic-bézier",
);

// ── The drill-in (A2-KE-L1-7) — ONE owner for both sub-panes ────────────────
const detailRowEl = useTemplateRef<HTMLElement>("detailRowEl");
const layerRowEl = useTemplateRef<HTMLElement>("layerRowEl");
// X.KF.W13X.controls · UIA-KF-036 · A2-KE-X-6 — a sub-pane that has ARRIVED
// (its row at full height, so no collapsing box is scrolled) brings its header
// into its scroller's view: at 390 the editor opened with its header scrolled
// above the sheet's visible region and the plot below the fold.
const stack = usePaneStack(
    (p) => (p === "detail" ? detailRowEl.value : p === "layer" ? layerRowEl.value : null),
    (p) => (p === "detail" ? detailHeaderEl.value : layerHeaderEl.value)?.reveal(),
);
const layerPaneId = useId();
const detailHeaderEl =
    useTemplateRef<InstanceType<typeof SubPaneHeader>>("detailHeaderEl");
const layerHeaderEl =
    useTemplateRef<InstanceType<typeof SubPaneHeader>>("layerHeaderEl");
const easingFieldEl =
    useTemplateRef<InstanceType<typeof EasingField>>("easingFieldEl");
const layerEntryEl = useTemplateRef<InstanceType<typeof Button>>("layerEntryEl");

/** The one-open-at-a-time mutex across the card's dropdowns (the form's two
 *  selects, the easing popover, the blend select). */
const openSelect = ref<string | null>(null);

// A2-KE-X-6 — drilling in is asking to SEE the pane: the controls panel's one
// open fact (the store field the mobile sheet's detent rides — peek ↔
// expanded; on the desktop rail, already true) is raised, so the editor never
// opens inside the sheet's peek.
const drillIn = (to: "detail" | "layer", opener: HTMLElement | null): void => {
    sceneControls.isControlsPanelOpen = true;
    const header = () => (to === "detail" ? detailHeaderEl : layerHeaderEl).value;
    void stack.push(to, opener, () => header()?.backControl());
};
const openDetail = (opener: HTMLElement | null): void => {
    const stored = storedAnimationOptions.animationOptions.timingFunction;
    if (typeof stored !== "string" || !beginEdit(stored)) return;
    drillIn("detail", opener);
};
const openLayer = (): void => {
    drillIn("layer", (layerEntryEl.value?.$el as HTMLElement | undefined) ?? null);
};
const closePane = (): void => {
    if (stack.isOpen("detail")) endEdit();
    void stack.back();
};

// X.KF.W13W.p — a tile pick is a commit (the popover closes, as a Select
// item's does); KF-CO-23 — a DRAFT-kind tile opens the editor it names.
const onEasingPick = (name: string): void => {
    const opensEditor = onCurvePicked(name);
    openSelect.value = null;
    if (!opensEditor) return;
    drillIn("detail", easingFieldEl.value?.triggerControl() ?? null);
};

// rAF-driven reactivity bridge: animation is markRaw, so Vue can't track its
// property changes; the refs are synced every frame for the ribbon. The
// isPlaying guard comes from the parent (useAnimationGroupPlayback).
const isPlayingRef = toRef(() => props.isPlaying ?? false);
const {
    currentT,
    isPlaying: isAnimPlaying,
    wake,
} = useAnimationSync(() => props.animation, isPlayingRef);

const { userReversed, toggleAnimation, toggleReverse } = usePlaybackToggle(
    () => props.animation,
    () => emit("togglePlay"),
);

// KFA-18 (X.KF.W13V.k) — NO mount-time re-apply of the stored easing: the
// running animation is the truth at mount; the stored easing reaches the
// animation only on a user edit.
</script>

<style scoped>
/* The drill-in rows: each pane in its own row, collapsing through
   `grid-template-rows` 0fr ↔ 1fr (ALREADY-SOTA — KEEP display:grid). */
.panel-row {
    display: grid;
    transition: grid-template-rows var(--duration-normal) var(--ease-standard);
}
.panel-row--active {
    grid-template-rows: 1fr;
}
.panel-row--inactive {
    grid-template-rows: 0fr;
}
.panel-content {
    overflow: hidden;
    min-height: 0;
    /* Inset padding so focus rings (ring-2 + ring-offset-2 = 4px) aren't clipped
       by the overflow:hidden the row collapse requires. */
    padding: 2px;
    margin: -2px;
}
/* X.KF.W13X.controls · KFA-209 — a cross-fade, not a double exposure: the
   leaving pane's fade finishes in the first 40 % of the row window, and the
   arriving pane's fade starts there (the two used to share one 300 ms window,
   both panes' text at mid-opacity together for ~6 frames). */
.panel-row--inactive > .panel-content {
    opacity: 0;
    pointer-events: none;
    transition: opacity calc(var(--duration-normal) * 0.4) var(--ease-standard);
}
.panel-row--active > .panel-content {
    opacity: 1;
    pointer-events: auto;
    transition: opacity calc(var(--duration-normal) * 0.6) var(--ease-standard)
        calc(var(--duration-normal) * 0.4);
}
/* UIA-KF-036 · A2-KE-X-6 — the editor's BODY is the scroller, capped so the
   curve never shifts the page (J.W7b STY-2: `dvh`, the real visible height on
   mobile); the sub-pane header above it is its sibling and never scrolls out. */
.subpane-body {
    max-height: min(50dvh, 480px);
    overflow-y: auto;
}
/* X-DS pass 6 (KF-C6-03) — THE EDITOR FITS THE RAIL. The picker's plot is a
   square as wide as its host, so at 1440×900 the 371 px plot plus its mode
   rows overran the rail and the scroller's bottom fade sat on the live
   Bezier/Steps toggle and the curve select at rest. The host's inline size (and
   so the plot) is capped by the rail's own budget (`--rail-block`,
   ControlsPaneWrapper.css) less the chrome under and around it: the transport
   ribbon and frame insets (≈13.3rem), the sub-pane header (≈4.4rem) and the
   picker's mode rows at their wrapped, three-line height (≈9.4rem), plus the
   frame's bottom inset: 28rem in all, measured at 1440×900 (plot 256 px, the
   surface's scroll range 0). The 16rem floor keeps a usable plot on a short
   rail (below ~800 px of viewport the sub-pane still scrolls, as before).
   Desktop only: on the phone sheet the rail budget does not apply. */
@media (min-width: 1024px) {
    .subpane-body {
        --picker-cap: max(16rem, calc(var(--rail-block, 100dvh) - 28rem));
    }
}
@media (prefers-reduced-motion: reduce) {
    .panel-row,
    .panel-row > .panel-content {
        transition-duration: 0s;
        transition-delay: 0s;
    }
}
</style>
