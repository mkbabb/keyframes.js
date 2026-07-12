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
    <Card surface="cartoon" tier="quiet" class="easing-editor w-full overflow-visible">
        <CardContent class="panel-content flex flex-col gap-3 px-4 py-3">
            <!-- The picker RE-SEEDS from tile selection when the curve is in
                 its bezier catalogue (or is a steps curve): the `:key` remount
                 carries the initial-prop seed — glass-ui 4.0.1's modelValue is
                 EMIT-ONLY (no external write-through / points-in prop), so a
                 remount is the only blessed re-seat seam (forwarded as the
                 §FORWARDING easing-adoption gap set, BG-9-adjacent). A custom
                 drag (name → "cubic-bezier") does NOT remount — the picker
                 already holds the authored points. `:playback="false"`: the
                 picker's travel dot is a private one-shot rAF clock, NOT the
                 scene sweep (BG-9); the gallery race IS the motion preview,
                 so a second uncoordinated clock stays off this surface. -->
            <EasingPicker
                :key="pickerSeed.key"
                :mode="pickerSeed.mode"
                :preset="pickerSeed.preset"
                :steps="pickerSeed.steps"
                :term="pickerSeed.term"
                :playback="false"
                label="Easing curve editor"
                @update:model-value="onPickerChange"
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
                {{ demo.currentEasingName.value }} is engine-native — editing
                here authors a custom cubic-bezier
            </p>

            <!-- Duration row — FULL-WIDTH (J3 posture kept from the previous
                 sidebar: label above, track spans the panel inner width). -->
            <LabeledSlider
                class="duration-field"
                :model-value="demo.duration.value"
                label="duration"
                label-class="text-small font-medium text-muted-foreground"
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
import { ref, watch } from "vue";
import { Card, CardContent } from "@mkbabb/glass-ui";
import { LabeledSlider } from "@mkbabb/glass-ui/labeled-field";
import {
    EasingPicker,
    type EasingPickerValue,
    type JumpTerm,
} from "@mkbabb/glass-ui/easing";
import { bezierPresets } from "@mkbabb/value.js/easing";

import { NAMED_EASING_BEZIER } from "@utils/reference-data/animationDescriptions";
import type { EasingDemoContext } from "./easingKeys";

const props = defineProps<{ demo: EasingDemoContext }>();
const demo = props.demo;

// ── The seed: tile selection → picker initial props (remount re-seat) ──────
// glass-ui's bezier catalogue is value.js `bezierPresets`; the demo's named
// map (NAMED_EASING_BEZIER) is wider (quart/quint) and differs on some quads
// (sine) — seed by PRESET only when the picker's own catalogue knows the name
// (the honest vendor seam; the wider-coverage ask is BG-8).
interface PickerSeed {
    key: string;
    mode: "bezier" | "steps";
    preset?: string;
    steps?: number;
    term?: JumpTerm;
}

let seedCount = 0;
const seedFor = (name: string): PickerSeed | null => {
    if (name === "steps" || name === "step-start" || name === "step-end") {
        const stepSeed =
            name === "steps"
                ? {
                      steps: demo.stepOptions.value.steps,
                      term: demo.stepOptions.value.jumpTerm as JumpTerm,
                  }
                : name === "step-start"
                  ? { steps: 1, term: "jump-start" as JumpTerm }
                  : { steps: 1, term: "jump-end" as JumpTerm };
        return { key: `steps:${name}:${++seedCount}`, mode: "steps", ...stepSeed };
    }
    if (name in bezierPresets) {
        return { key: `bezier:${name}:${++seedCount}`, mode: "bezier", preset: name };
    }
    // "cubic-bezier" (a live custom edit — the picker authored it, never
    // remount) and engine-native names (bounce/elastic — nothing to seed)
    // keep the mounted picker.
    return null;
};

const pickerSeed = ref<PickerSeed>(
    seedFor(demo.currentEasingName.value) ?? {
        key: "bezier:initial",
        mode: "bezier",
        preset: "ease",
    },
);

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

// A (re)mount's immediate v-model emission is the SEED echoing back, not a
// user edit — recognized BY VALUE (not ordering) so a tile click never
// masquerades as an authored custom curve, and a lost/duplicated echo can
// never swallow a real edit.
const isSeedEcho = (v: EasingPickerValue): boolean => {
    const seed = pickerSeed.value;
    if (v.mode !== seed.mode) return false;
    if (seed.mode === "steps") {
        const seedTerm = seed.term ?? "end";
        return (
            v.steps === (seed.steps ?? 4) &&
            (v.term === seedTerm || v.term === seedTerm.replace(/^jump-/, ""))
        );
    }
    const quad =
        bezierPresets[(seed.preset ?? "") as keyof typeof bezierPresets];
    return !!quad && quadEq(quad, v.points);
};

watch(
    () => demo.currentEasingName.value,
    (name) => {
        syncGap(name);
        const seed = seedFor(name);
        if (seed) pickerSeed.value = seed;
    },
);

// ── Picker emissions → the demo's ONE authoring seam ───────────────────────
const quadEq = (
    a: readonly [number, number, number, number],
    b: readonly [number, number, number, number],
): boolean => a.every((v, i) => Math.abs(v - b[i]!) < 0.0005);

/** Match an authored quad back to a demo-named curve (a picker preset pick
 *  lands as the NAME when the quads agree — selection stays named). */
const nameForQuad = (
    q: readonly [number, number, number, number],
): string | undefined =>
    Object.keys(NAMED_EASING_BEZIER).find((n) =>
        quadEq(NAMED_EASING_BEZIER[n]!, q),
    );

const onPickerChange = (v: EasingPickerValue | undefined) => {
    if (!v) return;
    if (isSeedEcho(v)) return;
    if (v.mode === "steps") {
        const jumpTerm = (
            v.term.startsWith("jump-") ? v.term : `jump-${v.term}`
        ) as typeof demo.stepOptions.value.jumpTerm;
        const cur = demo.stepOptions.value;
        if (cur.steps !== v.steps || cur.jumpTerm !== jumpTerm) {
            demo.stepOptions.value = { steps: v.steps, jumpTerm };
        }
        if (!demo.isSteps.value) demo.selectEasing("steps");
        return;
    }
    // bezier: a no-op echo (points equal the live selection's quad) is ignored;
    // a preset pick that matches a named curve SELECTS it; anything else is an
    // authored custom curve through the demo's one seam (flips to
    // "cubic-bezier" — honest by construction).
    if (
        demo.isBezierEditable.value &&
        quadEq(demo.bezierControlPoints.value, v.points)
    ) {
        return;
    }
    const named = nameForQuad(v.points);
    if (named && named !== demo.currentEasingName.value) {
        demo.selectEasing(named);
        return;
    }
    demo.updateBezierPoints(v.points);
};
</script>

<style scoped>
/* H.W4.S1 lineage — the facet body is a container so the picker's `38cqi`
   canvas sizing resolves off the CONTAINER inline size, not the viewport. */
.easing-editor {
    container-type: inline-size;
    container-name: easing-editor;
}

/* The duration control is FULL-WIDTH (the J3 posture): label on its own line,
   the slider track spans the panel inner width. */
.panel-content :deep(.labeled-field.duration-field) {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.25rem;
}
.panel-content :deep(.duration-field [data-slot="slider"]),
.panel-content :deep(.duration-field .slider-track) {
    width: 100%;
}
</style>
