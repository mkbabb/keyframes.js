<template>
    <!-- G6 + G5 (H.W10.S4) — the easing sidebar NORMALIZED onto the standard
         controls component: ONE `Card surface="cartoon" tier="quiet"` (the H.W9
         quiet register; the Card primitive carries the `rounded-card` token by
         construction — dissolves G2's square-corner) wrapping `Labeled*`
         label-left rows (the H.W9 F1 row idiom) in ONE `panel-content` flow. The
         former ×2 inner sub-Cards + ad-hoc `grid grid-cols-2`/`grid gap-1` row
         containers + the `text-admin-label`/`size="sm"` tightest-rung are DELETED
         (no legacy beside the replacement) — the control sizing lifts to the
         standard scale automatically (G5: same components → same sizes). The
         editable bezier curve stays as the lone HERO element (the H.W9 F2
         bezier-panel precedent: title + tight canvas). -->
    <Card surface="cartoon" tier="quiet" class="easing-editor w-full overflow-visible">
        <!-- H.W11.I1 — the CardContent is the `.labeled-field-grid` (design-idioms
             .css §LABEL-subgrid): all `.labeled-field` rows (value / steps / jump /
             duration) share ONE uniform label-column track via CSS subgrid (the
             widest label sets the width, every row's label cell matches). The
             hero title + canvas + EasingSelect are non-field children → full-width
             (`:not(.labeled-field)`). REPLACES the W9-era per-row
             `:deep(.labeled-field){auto 1fr}`; the label-left direction holds. -->
        <CardContent class="panel-content labeled-field-grid px-4 py-3">
            <!-- Title — the editor's parity header (gestalt parity with the
                 TimingFunctionPanel's titled detail Card). -->
            <h2 class="text-title leading-none">{{ demo.currentEasingName.value }}</h2>

            <!-- Hero curve canvas -->
            <EasingCurveCanvas
                :easing-fn="demo.currentEasingFn.value"
                :svg-path="demo.svgPath.value"
                :progress="demo.progress.value"
                :bezier-points="demo.isBezierEditable.value ? demo.bezierControlPoints.value : undefined"
                :editable="demo.isBezierEditable.value"
                @update:bezier-points="demo.updateBezierPoints"
            />

            <!-- CSS value row (label-left) + inline copy affordance. The
                 LabeledInput is a DIRECT subgrid participant (its "value" label
                 joins the uniform track); the CopyButton trails in the value
                 column, seated on the input via the `.copy-affordance` rule below.
                 A NAMED delta — the only labeled row carrying an inline copy. -->
            <LabeledInput
                class="min-w-0 value-field"
                :model-value="demo.cssValue.value"
                label="value"
                label-class="text-mono-small text-muted-foreground"
                tooltip="cubic-bezier(...), steps(...), or a named easing"
                input-class="css-value-input"
                @update:model-value="onCSSInputValue"
            />
            <CopyButton class="copy-affordance shrink-0 w-4 h-4" :text="demo.cssValue.value" />

            <!-- Grouped curve selector (the easing domain control) -->
            <EasingSelect
                :model-value="demo.currentEasingName.value"
                :timing-functions-and="demo.timingFunctionsAnd"
                @update:model-value="demo.selectEasing"
            />

            <!-- Step options (shown only for steps) — label-left rows -->
            <template v-if="demo.isSteps.value">
                <LabeledInput
                    :model-value="demo.stepOptions.value.steps"
                    type="number"
                    label="steps"
                    label-class="text-mono-small text-muted-foreground"
                    tooltip="Number of discrete steps (1–60)"
                    @update:model-value="onStepsChangeValue"
                />
                <LabeledSelect
                    :model-value="demo.stepOptions.value.jumpTerm"
                    :is-open="jumpOpen"
                    :items="JUMP_TERMS"
                    label="jump"
                    label-class="text-mono-small text-muted-foreground"
                    tooltip="Step jump term"
                    @update:model-value="(v) => { demo.stepOptions.value.jumpTerm = v; }"
                    @update:open="(v) => { jumpOpen = v; }"
                />
            </template>

            <!-- Duration row (label-left) -->
            <LabeledSlider
                :model-value="demo.duration.value"
                label="duration"
                label-class="text-mono-small text-muted-foreground"
                tooltip="Sweep duration (ms)"
                :min="300"
                :max="5000"
                :step="100"
                @update:model-value="(v) => { demo.duration.value = v; }"
            />
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Card, CardContent } from "@mkbabb/glass-ui";
import {
    LabeledInput,
    LabeledSelect,
    LabeledSlider,
} from "@mkbabb/glass-ui/labeled-field";

import CopyButton from "@components/custom/CopyButton.vue";
import EasingSelect from "@components/custom/EasingSelect.vue";
import EasingCurveCanvas from "@components/custom/EasingCurveCanvas.vue";
import type { EasingDemoContext } from "./easingKeys";

const JUMP_TERMS = ["jump-start", "jump-end", "jump-none", "jump-both"] as const;

const props = defineProps<{ demo: EasingDemoContext }>();
const demo = props.demo;

// LabeledSelect open-state (the sidebar has a single select that owns its flag).
const jumpOpen = ref(false);

// LabeledInput emits the raw string value per-input (not a commit Event). Parse
// silently and apply only when valid — the standard AnimationControlsControls
// swallow-malformed-in-progress idiom (`trySetOption`). A partial/invalid value
// is simply not applied (no per-keystroke error toast); the EasingSelect + the
// curve editor remain the primary affordances.
const onCSSInputValue = (value: string) => {
    if (value.trim() === demo.cssValue.value) return;
    demo.parseCSSValue(value);
};

const onStepsChangeValue = (value: string) => {
    const v = parseInt(value, 10);
    if (v > 0) demo.stepOptions.value.steps = v;
};
</script>

<style scoped>
/* H.W4.S1 — the editor root is a container so the EasingCurveCanvas can size
   its block off the CONTAINER inline size (`38cqi`), not the viewport. Pairs
   with the TimingFunctionPanel's own `easing-editor` container so the canvas
   is bounded in BOTH render hosts (the full-rail sidebar AND the in-panel
   detail Card). Baseline-2023 — no fallback owed. */
.easing-editor {
    container-type: inline-size;
    container-name: easing-editor;
}

/* H.W11.I1 — the per-row `:deep(.labeled-field){auto 1fr}` rule (W9 F1, each row
   its OWN `auto` label width) is GONE — REPLACED by the `.labeled-field-grid`
   subgrid idiom on the CardContent (design-idioms.css §LABEL-subgrid): value /
   steps / jump / duration now share ONE uniform label-column track. No legacy
   beside the replacement; the label-left direction holds, strengthened to uniform.

   The value row's inline-copy NAMED delta: the value LabeledInput is a DIRECT
   grid child (its "value" label joins the uniform track via the idiom's subgrid
   rule). The CopyButton is the NEXT direct child; grid auto-flow would drop it on
   its own row, so it is RE-SEATED onto the value row's control cell — pinned to
   the `value` track at its right edge (`justify-self: end`) and pulled up onto the
   input by a one-row negative offset. This is the only labeled row carrying an
   inline affordance (a befitting NAMED delta), yet its label STILL shares the
   uniform width. */
.copy-affordance {
    grid-column: value;
    justify-self: end;
    align-self: start;
    /* Pull up onto the value input's row (one input-height + the row-gap). The
       value <Input> is the standard h-9 (2.25rem); offset by ~1.9rem to seat the
       copy glyph centered on the input's right edge. */
    margin-block-start: -1.9rem;
    margin-inline-end: 0.25rem;
}

/* The free-text easing input keeps user-typed content case-as-typed (the
   mono-caption/normal-case register; a `cubic-bezier(...)` or camelCase easing
   name must read as entered) — an isomorphic guard, not a register change.
   :deep reaches the inner <Input> the LabeledInput renders. */
.panel-content :deep(.css-value-input) {
    text-transform: none;
}
</style>
