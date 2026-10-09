<template>
    <!-- T.E8 (directive #27; OD-5 R2 fold) — ONE editor: the glass-ui
         `EasingPicker` IS the Curve facet body. The hand-rolled 1,082L
         `instrument/easing/` cluster (EasingEditor + EasingCurveCanvas +
         DemoControlPoint + EasingSelect) is DELETED — the demo consumes the
         published curve-authoring primitive instead of duplicating it
         (bezier drag + native steps mode + the COMPLETE re-parseable
         readout literal with copy — the F7 truncation class is dead by
         construction). The named-curve SELECTION surface is the T.E6
         specimen gallery (the tiles); THIS panel is the bezier/steps
         AUTHORING surface (the clean BG-8 division: the gallery is the
         scene's, the editor is EasingPicker's — the bounce family stays
         kf-owned until glass-ui's named catalogue covers it). -->
    <!-- X-DS pass 1, C1 (KF-C1-07) — no card of its own: the pane host draws the one frame (ControlsPaneWrapper), so this surface is flat inside it. -->
    <div
        class="easing-sidebar w-full"
        :style="seat.containerStyle"
    >
        <div class="panel-content p-0">
            <!-- X.KF.W13X.sq+dh (§0dz, addendum (e)) — the pane wears glass's
                 section anatomy (the ConfiguratorLayer the Spring and Sequence
                 panes wear): one labelled section holding the curve editor and
                 its duration. The editor sits on the BARE surface: the pane's
                 Card is the one plate, so no second tinted card nests inside it
                 (the same one-frame rule as the Sequence stage, `.sq`). -->
            <ConfiguratorLayer label="Easing" default-open body-class="flex flex-col">
                <!-- KF-ES-12 ≡ KF-TFP-1 — the picker sits in the shared
                     `useEasingPickerSeat` (channel-controls/composables), the SAME
                     seat the transport's TimingFunctionPanel uses. A tile that
                     names a curve in the demo's bezier map re-seats by REMOUNT on
                     the `preset` initial prop (the only way 7.0.0 displays a named
                     preset — `EasingPickerValue` has no preset field); a steps
                     tile, a custom quad and a preset pick inside the picker itself
                     reach the MOUNTED picker through the vendor's own `modelValue`
                     write-through, so the picker is never torn down under the
                     user's hands (KF-ES-5), and the echo filter is measured against
                     the LIVE truth, never a stale seed (KF-ES-1). `:playback="false"`:
                     the picker's travel dot is a private one-shot rAF clock, NOT the
                     scene sweep (BG-9); the gallery race IS the motion preview, so
                     a second uncoordinated clock stays off this surface. -->
                <!-- UIA-KF-093 (+ UIA-KF-091's consumer half) — the catalogue gap
                     shows the SELECTED curve. An engine-native curve (the bounce
                     family) has no cubic-bezier, so the editor cannot draw it: the
                     Curve facet shows glass's display plot of the curve the stage
                     runs (glass README: EasingCurve is the DISPLAY primitive for
                     curves the picker cannot author), with no second literal and no
                     second copy (the header literal is the one copy). The authoring
                     picker stays seated but hidden until the user departs into a
                     custom curve — the edit gesture IS the departure. -->
                <EasingCurve
                    v-if="showGapPlot"
                    class="gap-plot"
                    :strokes="[{ d: gapPlot.d, tone: 'ink' }]"
                    :clipped="gapLeavesFrame"
                    :label="`${demo.currentEasingName.value} curve`"
                />
                <EasingPicker
                    v-show="!showGapPlot"
                    :key="seat.key.value"
                    v-bind="seat.seed.value"
                    :model-value="seat.model.value"
                    :playback="false"
                    surface="bare"
                    label="Easing curve editor"
                    @update:model-value="seat.onPickerChange"
                />

                <!-- BG-8 (the honest catalogue gap, quiet): an engine-native curve
                     (bounce/elastic families) is not expressible as one
                     cubic-bezier — the tile + header literal carry the selection;
                     authoring here departs into a custom cubic-bezier. -->
                <!-- UIA-KF-054 (easing limb) — status copy in the small register,
                     sentence case; the curve's identifier is the one code chip and
                     is never uppercased (DESIGN.md §8). -->
                <p
                    v-if="catalogueGap"
                    class="gap-caption text-small text-muted-foreground"
                >
                    <code data-register="code">{{ demo.currentEasingName.value }}</code>
                    is engine-native: no cubic-bezier reproduces it, so editing it
                    here departs into a custom curve.
                </p>
                <Button
                    v-if="showGapPlot"
                    variant="outline"
                    size="sm"
                    class="self-start"
                    @click="departed = true"
                >
                    Edit as a custom curve
                </Button>

                <Separator />
                <!-- The duration param — X.KF.W13V.y (OA-51; DESIGN-NOTE N-2): the
                     PARAM ROW idiom (`.param-row`, design-idioms.css) — label and
                     live value on one line, the slider spanning the row beneath. -->
                <div class="param-row">
                    <LabeledSlider
                        :model-value="demo.duration.value"
                        label="duration"
                        :min="300"
                        :max="5000"
                        :step="100"
                        :value-text="(v: number) => `${v} milliseconds`"
                        @update:model-value="(v) => { demo.duration.value = v; }"
                    />
                    <output class="param-value" aria-hidden="true">{{ demo.duration.value }} ms</output>
                </div>
            </ConfiguratorLayer>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Separator } from "@mkbabb/glass-ui";
import { Button } from "@mkbabb/glass-ui/button";
import { LabeledSlider } from "@mkbabb/glass-ui/labeled-field";
import { ConfiguratorLayer } from "@mkbabb/glass-ui/configurator";
import {
    EasingCurve,
    EasingPicker,
    type EasingPickerValue,
} from "@mkbabb/glass-ui/easing";
import { curvePlot, unitEasingFrame } from "@utils/curvePlot";
import { namedEasing } from "@utils/reference-data/timingCurveUtils";

import {
    nameForQuad,
    seatTruthFor,
    useEasingPickerSeat,
    type SeatTruth,
} from "@components/instrument/transport/channel-controls/composables/useEasingPickerSeat";
import type { EasingDemoContext } from "./easingKeys";

const props = defineProps<{ demo: EasingDemoContext }>();
const demo = props.demo;

// ── Where the truth lives: the demo context (the scene's ONE authoring seam) ──
// glass-ui's bezier catalogue is value.js `bezierPresets` (30 keys); the demo's
// named map (NAMED_EASING_BEZIER, 29) is a byte-exact STRICT SUBSET of it —
// sole delta `smooth-step-3`, zero value differences. A NAMED re-seat happens
// only when the DEMO's map knows the name, never `bezierPresets`: a name the
// caption below calls engine-native must not be seated as a preset under its
// own caption (COHESION §0j.C KF-SS3 preserves `smooth-step-3`'s class — a
// smoothstep polynomial is not a cubic bezier). The two catalogues are NEVER
// merged. An engine-native name (bounce/elastic) keeps the mounted picker on
// the live quad — nothing to seat, and a departure edits from there (BG-8).
// X.KF.W13X.r4pane · A2-KE-L1-5 — the truth mapping and the quad → named-curve
// lookup are the seat's ONE copy (`seatTruthFor` / `nameForQuad`), shared with
// the controls card's detail editor; a preset pick lands as the NAME when the
// quads agree (selection stays named).
const truth = (): SeatTruth => {
    const { steps, jumpTerm } = demo.stepOptions.value;
    return seatTruthFor({
        name: demo.currentEasingName.value,
        isSteps: demo.currentEasingName.value === "steps",
        points: demo.bezierControlPoints.value,
        steps,
        term: jumpTerm,
    });
};

// ── Picker emissions → the demo's ONE authoring seam ───────────────────────
const onAuthored = (v: EasingPickerValue) => {
    if (v.mode === "steps") {
        const cur = demo.stepOptions.value;
        if (cur.steps !== v.steps || cur.jumpTerm !== v.term) {
            demo.stepOptions.value = { steps: v.steps, jumpTerm: v.term };
        }
        if (!demo.isSteps.value) demo.selectEasing("steps");
        return;
    }
    // bezier: a preset pick that matches a named curve SELECTS it; anything
    // else is an authored custom curve through the demo's one seam (flips to
    // "cubic-bezier" — honest by construction).
    const named = nameForQuad(v.points);
    if (named && named !== demo.currentEasingName.value) {
        demo.selectEasing(named);
        return;
    }
    demo.updateBezierPoints([...v.points]);
};

const seat = useEasingPickerSeat(truth, onAuthored);

// The catalogue-gap caption: the selection is neither bezier-expressible nor
// steps (BG-8 — the bounce/elastic families stay kf-owned).
const catalogueGap = ref(false);
// The user's departure from a gap curve into authoring (UIA-KF-093): the
// picker is revealed; a new selection returns to the display plot.
const departed = ref(false);
const syncGap = (name: string) => {
    catalogueGap.value =
        name !== "cubic-bezier" &&
        !demo.isBezierEditable.value &&
        !demo.isSteps.value;
};
syncGap(demo.currentEasingName.value);
const showGapPlot = computed(() => catalogueGap.value && !departed.value);
// The display stroke from the function the stage runs (the same `namedEasing`
// the specimen tile plots), in glass's plot space (unit square, value 1 on top).
const gapPlot = computed(() =>
    curvePlot(namedEasing(demo.currentEasingName.value), unitEasingFrame()),
);
// The bounce family overshoots the unit box (value.js `ease-in-bounce` peaks
// near 1.18): glass marks a plot that leaves its frame on the crossed edges.
const gapLeavesFrame = computed(() =>
    gapPlot.value.vertices.some(({ v }) => v > 1 || v < 0),
);
watch(
    () => demo.currentEasingName.value,
    () => {
        departed.value = false;
    },
);

// A tile selection (or any other external write of the scene's curve) re-seats
// the picker; the seat decides remount-vs-write.
watch(
    () => [
        demo.currentEasingName.value,
        ...demo.bezierControlPoints.value,
        demo.stepOptions.value.steps,
        demo.stepOptions.value.jumpTerm,
    ],
    () => {
        syncGap(demo.currentEasingName.value);
        seat.reseat();
    },
);
</script>

<style scoped>
/* X-DS pass 7 (KF-C7-02) — THE EDITOR FITS THE RAIL, on the Easing route too.
   The cube's sub-pane took the rail's named budget (`--rail-block`,
   ControlsPaneWrapper.css; KF-C6-03), but this route's picker stayed uncapped:
   its square plot took the full column, so at 1440×900 the section's own
   duration row sat below the surface, under the ribbon. The same budget, less
   this route's measured chrome (31.5rem at 1440×900): the transport ribbon
   and frame insets (≈13.3rem), the section header, the separator and the
   duration param row, and the picker's mode rows. Those rows wrap to three
   lines below ~20rem of width, and a plot wide enough to keep them on two
   cannot fit this rail, so the budget counts the three-line wrap. The section
   body also drops its doubled rhythm (`gap-3` on top of the layer's own
   `space-y-2`): the separator keeps the 0.5rem either side the cube's pane
   uses (KF-C4-18). Served: plot 200 px, the surface's scroll range 0. The
   11rem floor keeps a usable plot on a short rail (below ~880 px of viewport
   the surface still scrolls, the KF-C3-06 class). At 1080 tall the plot is
   361 px, uncapped.
   Desktop only: on the phone sheet the rail budget does not apply. */
/* X-DS pass 8 (KF-C8-01) — THE BUDGET CAPS THE PLOT, NOT THE PICKER. Pass 7
   spent the rail's block budget as an inline cap on the whole picker, so the
   mode strip, the preset select and the readout sat in a ~200 px column of a
   367 px pane, the mode rows wrapped, and the readout literal truncated. The
   plot is a square, so its block size IS its inline size: the cap now lands on
   the plot's frame alone (glass's `easing-curve` slot and the handle overlay
   share that one box), centred, and the control row takes the pane's full
   measure on one line. At lg the pane's readout chip goes: the stage header
   already prints the complete literal with its copy control (one print per
   fact, UIA-KF-091), and this chip was the lesser, truncated one. Below lg the
   chip stays. glass exposes no plot-size or readout hook yet (O-87 rider), so
   both reach the picker through its data-slot contract — layout only, no paint.
   With the strip on one line and no chip row, the measured chrome under the
   budget is 25.5rem (was 31.5rem with the three-line wrap). */
/* X-DS pass 9 (KF-C9-10) — THE BUDGET FOLLOWS THE SURFACE, AT EVERY LAPTOP
   HEIGHT. The 25.5rem chrome was measured at 1440x900, where the pane is
   403 px wide and the control row holds one line. On a narrower pane (350 px
   at 1280, 328 px at 1024) that row and the duration row wrap, and the chrome
   under the plot grows by ~46 px, so the surface scrolled at 1280x760 (451
   against 406). The pane's own inline size (this sidebar is its inline-size
   container) now picks the budget: below 24rem it counts the wrapped rows
   (28.5rem). The floor drops to 9rem, so the cap, not the floor, binds at the
   common laptop heights (1280x760: a ~163 px plot, no scroll).
   X-DS pass 10 (KF-C10-02) — the transport's scrub gained its labelled time
   line (label + readout over the rail, the param-row idiom), so the chrome
   under the plot grows by that line: 25.5 → 27.5rem, 28.5 → 30.5rem, and
   the floor drops 9 → 8rem, because at 1280x760 and 1280x800 the 9rem floor
   bound and the surface scrolled by 5 and 10 px.
   X-DS pass 16 (KF-C20-02) — the plot-frame rule itself is ONE shared rule
   (layout.css), shared with the cube's drill-in; this route sets its budget. */
@media (min-width: 1024px) {
    .easing-sidebar {
        --picker-cap: max(8rem, calc(var(--rail-block, 100dvh) - 27.5rem));
    }
    @container (inline-size < 24rem) {
        .easing-sidebar > .panel-content {
            --picker-cap: max(8rem, calc(var(--rail-block, 100dvh) - 30.5rem));
        }
    }
    .easing-sidebar :deep([data-slot="easing-controls"] > button:has(> code)) {
        display: none;
    }
}
</style>
