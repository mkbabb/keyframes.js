<template>
    <!-- G6 + G5 (H.W10.S4) — the easing sidebar NORMALIZED onto the standard
         controls component: ONE `Card surface="cartoon" tier="quiet"` (the H.W9
         quiet register; the Card primitive carries the `rounded-card` token by
         construction — dissolves G2's square-corner) wrapping `Labeled*`
         label-left rows in ONE `panel-content` flow.

         J (H.W12.S7) — the easing sidebar is MINIMAL, controls-like (round-4
         feedback, j-easing-minimalism.md). The `<EasingSelect>` dropdown IS the
         sole easing selector; the curve IS the subject. STRIPPED of redundant
         chrome: the former `<LabeledInput label="value">` CSS-value text input +
         its "value" label + the trailing inline CopyButton (J1+J2 — the dropdown
         replaced the text field; the curve editor + the dropdown name the curve)
         and the `<h2 class="text-title">` scene title (J5 — controls carry no big
         per-scene title). The reclaimed vertical space grows the hero canvas
         (J6) and the duration control runs FULL-WIDTH (J3). One flat CardContent
         (J4 — no nested wrapper). -->
    <Card surface="cartoon" tier="quiet" class="easing-editor w-full overflow-visible">
        <!-- J4 — ONE flat CardContent (no double container). The hero
             EasingEditor + the full-width duration are its only children; the
             optional steps rows join the uniform label-column subgrid. -->
        <CardContent class="panel-content labeled-field-grid px-4 py-3">
            <!-- I.W2.S4 — the ONE shared EasingEditor (the curve dropdown +
                 editable canvas + read-only readout/copy). The rail adapts
                 `demo.*` onto the normalized contract; the SAME editor mounts in
                 the in-panel TimingFunctionPanel, so the curve-change capability +
                 J's minimal chrome are identical everywhere. I.W2.S3 folds back
                 the readout J stripped from this rail (the parity gap) as the
                 complete, re-parseable literal (`readoutLiteral`).

                 S.G3 S2 — "the Gallery" tour is now driven by a VISIBLE
                 gallery-door BUTTON (below), never the former canvas `@dblclick`
                 (mouse-only; mobile browsers do not synthesize a reliable
                 double-click, so on touch the tour was unreachable — SG-8). The
                 wrapper stays (`display: contents`) so the editor remains the
                 full-width hero grid child. -->
            <div class="canvas-egg-host">
                <EasingEditor
                    :easing-fn="demo.currentEasingFn.value"
                    :svg-path="demo.svgPath.value"
                    :progress="demo.progress.value"
                    :current-name="demo.currentEasingName.value"
                    :timing-functions-and="demo.timingFunctionsAnd"
                    :bezier-points="demo.isBezierEditable.value ? demo.bezierControlPoints.value : undefined"
                    :editable="demo.isBezierEditable.value"
                    :readout-value="readoutLiteral"
                    :ghost-path-d="demo.ghostPathD.value"
                    @update:bezier-points="demo.updateBezierPoints"
                    @update:name="demo.selectEasing"
                />
            </div>

            <!-- S.G3 S1/S2 — the VISIBLE gallery-door button: the discoverable,
                 touch-reliable path to the easing-catalogue tour (replacing the
                 sealed canvas double-click). It IS the census tell
                 (`data-gesture-tell="easing:gallery"`) and the manifest gate's
                 touch target; its active state reads `demo.galleryActive`. -->
            <button
                type="button"
                class="gallery-door focus-ring tap-floor"
                data-gesture-tell="easing:gallery"
                :class="{ 'gallery-door--touring': demo.galleryActive.value }"
                :aria-pressed="demo.galleryActive.value"
                aria-label="Gallery — tour the expressive easing catalogue"
                @click="demo.gallery"
            >
                <span class="gallery-door__glyph" aria-hidden="true">⇢</span>
                {{ demo.galleryActive.value ? "touring…" : "Gallery" }}
            </button>

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

            <!-- Duration row — FULL-WIDTH (J3). The `.duration-field` modifier
                 opts the LabeledSlider OUT of the subgrid's 2-track row so the
                 slider spans the full CardContent inner width (label above the
                 track, the controls-like full-bleed posture). It is STILL a
                 glass-ui `.labeled-field` (the normalized-sidebar gate's ≥1-row
                 invariant holds; the rung stays standard). -->
            <LabeledSlider
                class="duration-field"
                :model-value="demo.duration.value"
                label="duration"
                label-class="text-mono-small text-muted-foreground"
                tooltip="Sweep duration (ms)"
                :min="300"
                :max="5000"
                :step="100"
                @update:model-value="(v) => { demo.duration.value = v; }"
            />

            <!-- S.G2 S6 (proof:easing-sidebar-minimal B1) — the sidebar is MINIMAL,
                 controls-like: NO CSS-value text input. The former Q.WC2 writable
                 `<input>` value field (a `cubic-bezier(…)`/`steps(…)` text authoring
                 row) was the redundant chrome the minimal-sidebar gate forbids — the
                 value is already surfaced by the EasingEditor's read-only, copyable
                 readout (`:readout-value`), and the curve is authored by dragging the
                 canvas handles or picking from the sole `<EasingSelect>` dropdown. The
                 text-input authoring path is STRIPPED (fold row 5 backlog discharge). -->

            <!-- P.W7 — the curve PHYSICS telemetry + the "name that curve" egg,
                 colocated in EasingCurvePhysics.vue (S.A0: split at its natural
                 concern seam when the sidebar crossed the 500L demo ceiling —
                 a self-contained read-only instrument over currentEasingFn). -->
            <EasingCurvePhysics :demo="demo" />
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { cubicBezierToString } from "@mkbabb/value.js";
import { Card, CardContent } from "@mkbabb/glass-ui";
import {
    LabeledInput,
    LabeledSelect,
    LabeledSlider,
} from "@mkbabb/glass-ui/labeled-field";

import EasingEditor from "@components/custom/easing-editor/EasingEditor.vue";
import EasingCurvePhysics from "./EasingCurvePhysics.vue";
import type { EasingDemoContext } from "./easingKeys";

const JUMP_TERMS = ["jump-start", "jump-end", "jump-none", "jump-both"] as const;

const props = defineProps<{ demo: EasingDemoContext }>();
const demo = props.demo;

// LabeledSelect open-state (the sidebar has a single select that owns its flag).
const jumpOpen = ref(false);

// I.W2.S3 — the read-only readout's COMPLETE, re-parseable literal. For an
// editable bezier (custom or a named curve with a bezier approximation) it is
// the `cubic-bezier(x1, y1, x2, y2)` literal built from the live control points;
// for steps it is `steps(n, term)`. A bare named curve (`ease-out`) has no
// parametric literal to copy → `undefined` (the dropdown already names it, and
// the editor omits the readout). NEVER the bare `cubic-bezier` keyword.
const readoutLiteral = computed<string | undefined>(() => {
    if (demo.isBezierEditable.value) {
        return cubicBezierToString(...demo.bezierControlPoints.value);
    }
    if (demo.isSteps.value) {
        return `steps(${demo.stepOptions.value.steps}, ${demo.stepOptions.value.jumpTerm})`;
    }
    return undefined;
});

const onStepsChangeValue = (value: string) => {
    const v = parseInt(value, 10);
    if (v > 0) demo.stepOptions.value.steps = v;
};

// P.W7 — the curve-physics telemetry + the "name that curve" egg live in the
// colocated EasingCurvePhysics.vue (S.A0: the 500L-ceiling concern-seam split).
</script>

<style scoped>
/* H.W4.S1 — the editor root is a container so the EasingCurveCanvas can size
   its block off the CONTAINER inline size, not the viewport. Pairs with the
   TimingFunctionPanel's own `easing-editor` container so the canvas is bounded
   in BOTH render hosts (the full-rail sidebar AND the in-panel detail Card).
   Baseline-2023 — no fallback owed. */
.easing-editor {
    container-type: inline-size;
    container-name: easing-editor;
}

/* The egg-host wrapper carries the "Gallery" dblclick without changing layout:
   `display: contents` dissolves its own box so the canvas remains the direct
   full-width grid child (the J6 grow + the subgrid full-bleed rule still apply
   to the canvas), while the wrapper stays in the DOM tree to catch the bubbled
   double-click. */
.canvas-egg-host {
    display: contents;
}

/* J6 (H.W12.S7) — the in-SIDEBAR hero canvas GROWS into the space the value
   input + the scene title freed (the user: "make the bezier visualizer bigger
   as such"). Mirrors the TimingFunctionPanel's in-panel grow idiom, but the
   sidebar is a FULL-HEIGHT rail (~579px pane, not a height-capped detail row),
   so it grows further.

   MEASURE-FIRST against the live easing sidebar (1440×900): post-strip the
   non-canvas chrome (the EasingSelect ~36px + the full-width duration ~44px +
   the px-4/py-3 padding + the two row gaps ≈ the `.easing-curve-canvas-wrapper`
   p-2) measured ≈150px of `scrollHeight − canvasBlockSize`. The pane budget
   before its `overflow-y-auto` engages is ~579px, so the canvas BUDGET ≈ 579 −
   150 ≈ 420px. The `64cqi` term ties the block to the CONTAINER inline width
   (~328px rail → ~210px) and grows toward the cap on a wider rail; the floor
   raises the former 160px to 260px (a REAL grow over the bare 38cqi/160 default);
   the `max-block-size` TRACKS the viewport-height budget (`min(56vh, 420px)`) so
   a short viewport never overflows the pane into scroll. The square LAW holds
   (`aspect-ratio:1` from EasingCurveCanvas — the height clamp only bounds the
   block axis). `:deep()` reaches the child's scoped canvas; this bounded ceiling
   wins over the canvas's own 280 default cap. */
.panel-content :deep(.easing-curve-canvas) {
    block-size: clamp(260px, 64cqi, 360px);
    max-block-size: min(56vh, 420px);
}

/* J3 (H.W12.S7) — the duration control is FULL-WIDTH. The `.duration-field`
   LabeledSlider opts OUT of the subgrid's 2-track `[label] [value]` row (the
   `.labeled-field-grid > .labeled-field { subgrid }` rule) and STACKS instead:
   the label sits on its own line, the slider track spans the full CardContent
   inner width. It stays a real glass-ui `.labeled-field` (the rung + the
   normalized-sidebar ≥1-row invariant hold) — only the row geometry changes,
   a befitting NAMED delta (the sole control deserves the full measure now that
   the input + title are gone). */
.panel-content :deep(.labeled-field.duration-field) {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.25rem;
}
/* The reka Slider root fills the row; the track + range stretch full-bleed. */
.panel-content :deep(.duration-field [data-slot="slider"]),
.panel-content :deep(.duration-field .slider-track) {
    width: 100%;
}

/* The curve-physics telemetry styles live in the colocated
   EasingCurvePhysics.vue (S.A0: the 500L-ceiling concern-seam split). */

/* S.G3 S2 — the gallery-door button. A quiet cartoon-register control (matches
   the sidebar's language), full-width under the canvas, with a 44px tap floor
   (`.tap-floor`) and the demo focus ring (`.focus-ring`). Its `--touring` state
   wears the scene accent while the tour plays. */
.gallery-door {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    width: 100%;
    padding: 0.4rem 0.75rem;
    border: 1px solid color-mix(in srgb, var(--border) 80%, transparent);
    border-radius: var(--radius-md, 0.5rem);
    background: color-mix(in srgb, var(--background) 70%, transparent);
    color: var(--foreground);
    font-family: var(--font-mono);
    font-size: var(--type-small, 0.8125rem);
    letter-spacing: 0.01em;
    cursor: pointer;
    transition:
        background-color var(--duration-fast, 160ms) var(--ease-standard, ease),
        border-color var(--duration-fast, 160ms) var(--ease-standard, ease);
}
.gallery-door:hover {
    background: color-mix(in srgb, var(--color-progress) 8%, var(--background));
    border-color: color-mix(in srgb, var(--color-progress) 40%, var(--border));
}
.gallery-door__glyph {
    color: var(--color-progress);
    font-weight: 700;
}
.gallery-door--touring {
    background: color-mix(in srgb, var(--color-progress) 14%, var(--background));
    border-color: color-mix(in srgb, var(--color-progress) 55%, transparent);
    color: color-mix(in srgb, var(--color-progress) 55%, var(--foreground));
}
</style>
