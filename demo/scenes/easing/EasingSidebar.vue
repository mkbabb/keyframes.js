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
    <Card
        tier="quiet"
        class="cartoon-surface w-full overflow-visible"
        :style="seat.containerStyle"
    >
        <CardContent class="panel-content flex flex-col gap-3 px-4 py-3">
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
            <EasingPicker
                :key="seat.key.value"
                v-bind="seat.seed.value"
                :model-value="seat.model.value"
                :playback="false"
                label="Easing curve editor"
                @update:model-value="seat.onPickerChange"
            />

            <!-- BG-8 (the honest catalogue gap, quiet): an engine-native curve
                 (bounce/elastic families) is not expressible as one
                 cubic-bezier — the tile + header literal carry the selection;
                 authoring here departs into a custom cubic-bezier. -->
            <p
                v-if="catalogueGap"
                class="text-mono-caption text-muted-foreground"
                data-register="code"
            >
                {{ demo.currentEasingName.value }} is engine-native — no
                cubic-bezier reproduces it, so editing here departs into a
                custom curve
            </p>

            <Separator />
            <!-- The duration param — X.KF.W13V.y (OA-51; DESIGN-NOTE N-2): the
                 PARAM ROW idiom (`.param-row`, design-idioms.css) — label and
                 live value on one line, the slider spanning the row beneath. -->
            <div class="param-row">
                <LabeledSlider
                    :model-value="demo.duration.value"
                    label="duration"
                    tooltip="Sweep duration (ms)"
                    :min="300"
                    :max="5000"
                    :step="100"
                    :value-text="(v: number) => `${v} milliseconds`"
                    @update:model-value="(v) => { demo.duration.value = v; }"
                />
                <output class="param-value" aria-hidden="true">{{ demo.duration.value }} ms</output>
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Card, CardContent, Separator } from "@mkbabb/glass-ui";
import { LabeledSlider } from "@mkbabb/glass-ui/labeled-field";
import { EasingPicker, type EasingPickerValue } from "@mkbabb/glass-ui/easing";

import {
    NAMED_EASING_BEZIER,
    NAMED_EASING_BEZIER_ENTRIES,
} from "@utils/reference-data/animationDescriptions";
import {
    quadEq,
    useEasingPickerSeat,
    type SeatTruth,
} from "@components/instrument/transport/channel-controls/composables/useEasingPickerSeat";
import type { EasingDemoContext } from "./easingKeys";
import type { EasingName } from "./useEasingDemo";

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
const truth = (): SeatTruth => {
    const name = demo.currentEasingName.value;
    const points = demo.bezierControlPoints.value;
    const { steps, jumpTerm } = demo.stepOptions.value;
    if (name === "step-start" || name === "step-end") {
        return {
            mode: "steps",
            points,
            steps: 1,
            term: name === "step-start" ? "jump-start" : "jump-end",
        };
    }
    if (name === "steps") {
        return { mode: "steps", points, steps, term: jumpTerm };
    }
    return {
        mode: "bezier",
        points,
        steps,
        term: jumpTerm,
        presetName: name in NAMED_EASING_BEZIER ? name : undefined,
    };
};

/** Match an authored quad back to a demo-named curve (a picker preset pick
 *  lands as the NAME when the quads agree — selection stays named). */
const nameForQuad = (
    q: readonly [number, number, number, number],
): EasingName | undefined =>
    NAMED_EASING_BEZIER_ENTRIES.find(([, quad]) => quadEq(quad, q))?.[0];

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
const syncGap = (name: string) => {
    catalogueGap.value =
        name !== "cubic-bezier" &&
        !demo.isBezierEditable.value &&
        !demo.isSteps.value;
};
syncGap(demo.currentEasingName.value);

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
