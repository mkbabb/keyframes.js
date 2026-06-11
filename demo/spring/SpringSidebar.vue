<template>
    <!-- J.W7c LANE B (U5 + U8) — the spring control panel REDESIGNED FROM FIRST
         PRINCIPLES onto the cube/amiga main control grammar. The former panel was
         a stack of MISMATCHED idioms (a hand-rolled tablist switch, two bare
         label-left sliders that never joined a uniform label column, a 2×2 chip
         grid, a REDUNDANT 4-row "canonical springs" comparison list re-naming the
         same four presets the chips already select, and a jammed lone Monaco
         editor). The redesign:
           • ONE `Card surface="cartoon" tier="quiet"` (the W2/W9 control register),
           • the view switcher is the IDIOMATIC `<SegmentedTabs variant="segmented">`
             (glass-ui 3.11.2) — NOT a hand-rolled `role=tablist` (U5 congruence),
           • the params ride the shared `.labeled-field-grid` UNIFORM-label-column
             subgrid idiom (design-idioms.css §LABEL-subgrid) — the SAME grammar
             AnimationControlsControls + EasingSidebar consume (U5: cube grammar),
           • the redundant comparison list is DELETED (no legacy beside the
             replacement) — the preset CELLS are the single preset surface, each
             carrying its OWN live track ball so the comparison is IN the cell,
           • a NEW ARTIFACT section with a KEYFRAMES VARIANT (U5): a second
             `<SegmentedTabs>` forks the spring's emitted artifact between the CSS
             `linear()` stops and a real `@keyframes` block — both sampled from the
             ONE `springTimingFunction → Easing` / `springLinearStops` feedstock. -->
    <Card surface="cartoon" tier="quiet" class="w-full overflow-visible">
        <CardContent class="panel-content flex flex-col gap-3 px-4 py-3">
            <!-- View switcher — the IDIOMATIC SegmentedTabs (U5). One spring
                 curve, two stages: the live SpringProgress solver, and that same
                 spring linear() easing a real @starting-style transition. The
                 segmented pill-slider REPLACES the former hand-rolled
                 `role=tablist` + the scoped `.spring-view-*` active rules. -->
            <SegmentedTabs
                v-model="viewModel"
                :options="VIEW_OPTIONS"
                variant="segmented"
                class="spring-view-tabs shrink-0"
            />

            <!-- Live params — the UNIFORM label-column grammar (the cube's bar).
                 The two sliders join ONE `.labeled-field-grid` so their labels
                 ("response" / "damping (ζ)") resolve the SAME width — congruent
                 with AnimationControlsControls / EasingSidebar (U5). -->
            <div class="labeled-field-grid">
                <LabeledSlider
                    :model-value="demo.response.value"
                    label="response"
                    label-class="text-mono-small text-muted-foreground"
                    tooltip="Spring response time (s) — higher = slower"
                    :min="0.1"
                    :max="1.2"
                    :step="0.01"
                    @update:model-value="(v) => { demo.response.value = v; }"
                />
                <LabeledSlider
                    :model-value="demo.dampingFraction.value"
                    label="damping (ζ)"
                    label-class="text-mono-small text-muted-foreground"
                    tooltip="Damping fraction (ζ) — <1 overshoots, ≥1 settles"
                    :min="0.2"
                    :max="1.5"
                    :step="0.01"
                    @update:model-value="(v) => { demo.dampingFraction.value = v; }"
                />
            </div>

            <!-- Preset cells — the SINGLE preset surface (the redundant comparison
                 list is GONE). Each `<ToggleChip variant="cell">` (the published
                 glass-ui 3.9.0 reka-Toggle primitive) selects a canonical preset
                 AND carries its OWN live track ball, so the racing comparison the
                 deleted list duplicated now lives IN the cell — one surface, no
                 dead-checkerboard list. PIXEL-ISOMORPHIC consume: the utility
                 classes are consumer configuration through the primitive's `class`
                 prop (the outline-pill geometry + the scene-semantic
                 `--color-progress` active ring on the primitive's own
                 `data-state` seam). -->
            <div class="preset-grid grid grid-cols-2 gap-2">
                <ToggleChip
                    v-for="(t, i) in demo.tracks"
                    :key="t.preset.name"
                    variant="cell"
                    :model-value="isActivePreset(t)"
                    :title="t.preset.blurb"
                    class="preset-cell rounded-pill border-none bg-background px-3 pt-1.5 pb-2 h-auto items-start gap-1 font-medium leading-normal whitespace-nowrap btn-interactive hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-background data-[state=on]:shadow-[inset_0_0_0_1px_var(--color-progress)]"
                    @update:model-value="applyPreset(t.preset)"
                >
                    <span class="preset-name-row flex w-full flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                        <span class="text-small text-foreground capitalize">{{ t.preset.name }}</span>
                        <span class="text-mono-caption text-muted-foreground">{{ t.preset.response }} / {{ t.preset.dampingFraction }}</span>
                    </span>
                    <!-- The cell's OWN live track ball — the comparison is IN the
                         cell now (painter-positioned, J.W2 S5 hot path; no reactive
                         :style on the 60 Hz path). -->
                    <span class="preset-track relative block w-full h-2">
                        <span class="progress-rail"></span>
                        <span
                            :ref="(el: any) => setTrackBallEl(i, el)"
                            class="progress-ball preset-ball"
                        ></span>
                    </span>
                </ToggleChip>
            </div>

            <!-- ── ARTIFACT section — the KEYFRAMES VARIANT (U5) ──────────────
                 The spring's emitted artifact, forked by a second SegmentedTabs:
                   • `linear()`   — the CSS `linear()` stops (the existing
                     springLinearStops surface, two-way bound to the editor);
                   • `@keyframes` — a REAL `@keyframes` block sampled from the SAME
                     springTimingFunction → Easing feedstock (the keyframes section
                     for spring the user asked for). Both read the ONE
                     (response, dampingFraction) the sliders + cells drive. -->
            <div class="artifact-section grid gap-2">
                <div class="flex items-center justify-between gap-2">
                    <SegmentedTabs
                        v-model="artifactModel"
                        :options="ARTIFACT_OPTIONS"
                        variant="underline"
                        class="artifact-tabs min-w-0 flex-1"
                    />
                    <CopyButton class="shrink-0 w-4 h-4" :text="artifactCss" />
                </div>
                <CSSCodeEditor
                    v-model="artifactCss"
                    height="132px"
                    :font-size="12"
                    :line-numbers="false"
                    :padding="8"
                    :border="false"
                />
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { computed, onMounted, onScopeDispose, ref, watch } from "vue";
import { Card, CardContent } from "@mkbabb/glass-ui";
import { LabeledSlider } from "@mkbabb/glass-ui/labeled-field";
import { ToggleChip } from "@mkbabb/glass-ui/toggle-chip";
import { SegmentedTabs } from "@mkbabb/glass-ui/tabs";
import type { SegmentedTabOption } from "@mkbabb/glass-ui/tabs";

import { springTimingFunction } from "@src/animation/springTimingFunction";

import { useSpringLinearStops } from "./useSpringLinearStops";
import CopyButton from "@components/custom/CopyButton.vue";
import CSSCodeEditor from "@components/custom/animation-controls/keyframes/CSSCodeEditor.vue";

import type { SpringDemoContext } from "./springKeys";
import type { SpringPreset, SpringTrack } from "./useSpringDemo";

const props = defineProps<{ demo: SpringDemoContext }>();
const demo = props.demo;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

// ── View switcher (the SegmentedTabs model bridges the demo's `view` ref) ──────
// SegmentedTabs' v-model is `string | string[]`; the spring view is the
// single-select union, so a narrow getter/setter pair keeps the demo ref typed.
const VIEW_OPTIONS: SegmentedTabOption[] = [
    { label: "Live solver", value: "solver" },
    { label: "Discrete transition", value: "discrete" },
];
const viewModel = computed<string>({
    get: () => demo.view.value,
    set: (v) => {
        if (v === "solver" || v === "discrete") demo.view.value = v;
    },
});

// ── J.W2 S5 (DS-3) — the preset-cell ball painter ──────────────────────────────
// The 4 cell balls are the 60 Hz hot path: positioned by a registered painter
// reading the demo's non-reactive `springLive` snapshot (direct `style.left`
// writes, off the Vue render graph).
const trackBallEls: (HTMLElement | null)[] = [];
const setTrackBallEl = (i: number, el: any) => {
    trackBallEls[i] = (el as HTMLElement) ?? null;
};

let unregisterPainter: (() => void) | null = null;
onMounted(() => {
    unregisterPainter = demo.registerSpringPainter(() => {
        const values = demo.springLive.trackValues;
        for (let i = 0; i < trackBallEls.length; i++) {
            const el = trackBallEls[i];
            if (el) el.style.left = `${clamp01(values[i] ?? 0) * 100}%`;
        }
    });
});
onScopeDispose(() => unregisterPainter?.());

const isActivePreset = (t: SpringTrack) =>
    Math.abs(demo.response.value - t.preset.response) < 1e-6 &&
    Math.abs(demo.dampingFraction.value - t.preset.dampingFraction) < 1e-6;

const applyPreset = (preset: SpringPreset) => {
    demo.response.value = preset.response;
    demo.dampingFraction.value = preset.dampingFraction;
};

// ── The ARTIFACT fork — `linear()` vs `@keyframes` (the KEYFRAMES VARIANT) ──────
const ARTIFACT_OPTIONS: SegmentedTabOption[] = [
    { label: "linear()", value: "linear" },
    { label: "@keyframes", value: "keyframes" },
];
const artifactModel = ref<string>("linear");

// CSS `linear()` token sampled from the live params — the ONE springLinearStops
// surface (useSpringLinearStops, H.W5.S3).
const springLinear = useSpringLinearStops(
    () => demo.response.value,
    () => demo.dampingFraction.value,
);

// The KEYFRAMES variant — sample the SAME springTimingFunction Easing at the
// canonical percentage stops and emit a real `@keyframes` block. The position
// value is the spring's normalized displacement at each phase (overshoot > 1 for
// ζ < 1), expressed as a `transform: translateX(<v>*100%)` keyframe — the
// keyframes section the user asked for, fed by the ONE Easing feedstock.
const KEYFRAME_STOPS = [0, 0.25, 0.5, 0.75, 1] as const;
const springKeyframes = computed<string>(() => {
    const easing = springTimingFunction({
        response: demo.response.value,
        dampingFraction: demo.dampingFraction.value,
    });
    const rows = KEYFRAME_STOPS.map((t) => {
        const v = easing.fn(t);
        const pct = Math.round(t * 100);
        return `    ${pct}% { transform: translateX(${(v * 100).toFixed(2)}%); }`;
    });
    return `@keyframes spring {\n${rows.join("\n")}\n}`;
});

// The editor's bound text follows the active artifact. The editor is read-mostly
// here (the model mirrors the generated artifact); switching tabs re-seeds it.
const generatedArtifact = computed(() =>
    artifactModel.value === "keyframes"
        ? springKeyframes.value
        : `--spring-easing: ${springLinear.value};`,
);
const artifactCss = ref("");
watch(generatedArtifact, (css) => { artifactCss.value = css; }, { immediate: true });
</script>

<style scoped>
/* ── §LABEL-subgrid consume ──
   The params ride the shared `.labeled-field-grid` idiom (design-idioms.css —
   the DRY home). Each glass-ui `.labeled-field` (LabeledSlider) participates in
   the ONE uniform [label] auto [value] 1fr subgrid track via the global rule;
   nothing is re-authored here (the former scoped per-row `:deep(.labeled-field)
   { auto 1fr }` is DELETED — no legacy beside the replacement). */

/* The SegmentedTabs primitive carries its own segmented/underline chrome from
   glass-ui (3.11.2) — the former hand-rolled `.spring-view-*` switcher rules are
   DELETED. The view tabs center; the artifact tabs sit flush-left in their row. */
.spring-view-tabs {
    align-self: center;
}

/* ── Preset cells — the SINGLE preset surface (the comparison list is gone) ──
   Each cell stacks its name-row over its OWN live track ball. The rail + ball
   geometry come from the shared .progress-rail / .progress-ball idiom
   (design-idioms.css); the preset ball is the smallest + quietest indicator, so
   it suppresses the glow and rides `left:` (the idiom centers vertically; this
   scoped modifier centers horizontally + sets the per-site size). The rail tint
   lifts to 14% (from the idiom's 8% default) so the short in-cell track reads as
   a clear groove at rest — the per-site legibility delta the idiom's --rail-tint
   seam exists for (the same axis EasingTarget/SpringTarget tune). */
.preset-track .progress-rail {
    --rail-tint: 14%;
}
.preset-ball {
    --ball-size: 0.85rem;
    --ball-glow: 0%;
    margin-left: calc(var(--ball-size) / -2);
    will-change: left;
}

/* The artifact underline tabs are a QUIET fork header — trim the default tab
   rung (glass-ui's `.segmented-tab` is ~16px) to the mono-caption size so the
   `linear()` / `@keyframes` labels read as a sub-section fork, not a second loud
   switch competing with the view tabs above + the serif stage. The `.segmented-
   tab` deep target wins the glass-ui scoped-attribute specificity; the mono
   family matches the CSS-artifact register the editor below carries. */
.artifact-tabs :deep(.segmented-tab) {
    font-family: var(--font-mono);
    font-size: var(--type-caption);
}
</style>
