<template>
    <div class="w-full grid justify-items-center">
        <!-- T.E8 + OD-5 R2 ("that curve preview in the top left needs to be
             improved dramatically") — the detail panel's hand-rolled curve
             editor (EasingEditor → EasingCurveCanvas + DemoControlPoint, the
             instrument/easing cluster) is DELETED; the body IS glass-ui's
             published `EasingPicker` (bezier drag + native steps mode + the
             COMPLETE re-parseable readout literal + copy). One vendor
             primitive, both modes — the hand-built steps count/term rows die
             with the canvas. The H.W9.F2 title-LEFT / dismiss-RIGHT header
             survives. -->
        <div class="grid gap-2 w-full" :style="seat.containerStyle">
            <div class="flex items-center justify-between gap-2">
                <h3 class="text-title">{{ kind === "steps" ? "steps" : "cubic-bézier" }}</h3>
                <!-- KF-CO-13 — the disclosure the editor computed and never
                     rendered: the name this editor was opened FROM. A name the
                     catalogue expresses as one bezier was converted; an
                     engine-native name (no bezier reproduces it) is a
                     DEPARTURE — nothing is persisted until an edit is authored. -->
                <p
                    v-if="convertedFrom !== null"
                    class="text-small text-muted-foreground"
                >
                    {{
                        kind === "cubic-bezier"
                            ? `from ${convertedFrom}`
                            : `departing from ${convertedFrom} — engine-native, no cubic-bezier reproduces it`
                    }}
                </p>
                <Button
                    ref="backEl"
                    emphasis="quiet"
                    icon-only
                    class="h-auto p-1 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="back to controls"
                    @click="emit('exitDetailPanel')"
                >
                    <ArrowLeft class="icon-sm" />
                </Button>
            </div>
            <!-- KF-TFP-1 ≡ KF-ES-12 — the picker sits in the shared
                 `useEasingPickerSeat` (specified in the KF.W12 record before it
                 was written). The `:key` bumps ONLY on an external NAMED
                 re-seat; a custom quad, the step count and the term reach the
                 MOUNTED picker through the vendor's own `modelValue`
                 write-through (7.0.0 — the "emit-only" premise this seat once
                 cited was 4.0.1's). The first drag off a preset-matched quad
                 therefore never remounts, and a reopen on a custom stored quad
                 seats THAT quad, not the vendor's default (KF-TFP-2). -->
            <EasingPicker
                :key="seat.key.value"
                v-bind="seat.seed.value"
                :model-value="seat.model.value"
                :playback="false"
                label="Easing curve editor"
                @update:model-value="seat.onPickerChange"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { StoredAnimationOptions } from "@state";

import {
    NAMED_EASING_BEZIER,
    timingFunctionKind,
} from "@utils/reference-data/animationDescriptions";

import { Button } from "@mkbabb/glass-ui";
import { EasingPicker, type EasingPickerValue } from "@mkbabb/glass-ui/easing";

import { computed, useTemplateRef, watch } from "vue";
import { ArrowLeft } from "@lucide/vue";
import {
    quadEq,
    useEasingPickerSeat,
    type SeatTruth,
} from "./composables/useEasingPickerSeat";

const props = defineProps<{
    storedAnimationOptions: StoredAnimationOptions;
    /** The name the editor was opened from (`null` when opened on a curve
     *  that was already cubic-bezier / steps) — rendered as the disclosure. */
    convertedFrom: string | null;
}>();

const emit = defineEmits<{
    (e: "exitDetailPanel"): void;
    /** X.KF.W13T.k3 · ESC-k2-1 — the authored curve, handed to the store's
     *  owner. This panel READS `storedAnimationOptions` and never writes it. */
    (e: "authored", value: EasingPickerValue): void;
}>();

// KF-CO-46 — the host carries focus INTO this pane when it opens (the pencil
// that opened it is inert once its row collapses); the Back control is the
// pane's first and only navigation affordance, so it is the landing.
const backEl = useTemplateRef<InstanceType<typeof Button>>("backEl");
const focusBack = () => {
    backEl.value?.$el.focus();
};
defineExpose({ focusBack });

// I.W2.S3 — the stored value is a re-parseable LITERAL; the panel keys its
// cubic-bezier-vs-steps view off the KIND (literal-aware).
const kind = computed(() =>
    timingFunctionKind(props.storedAnimationOptions.animationOptions.timingFunction),
);

// ── Where the truth lives: the STORE (the persisted literal + its parameters) ──
// The two singular step keywords are their own curves (`steps(1, jump-*)`,
// KF-CO-10) and never the authored `stepOptions`; a departure (KF-CO-13 — an
// engine-native name opened in the editor) is a bezier seat on the stored quad.
// `presetName` is resolved against the demo's NAMED_EASING_BEZIER only — never
// value.js `bezierPresets` (KF-ES-3's cure-lock: the catalogues are not merged).
const nameForQuad = (q: readonly [number, number, number, number]) =>
    Object.keys(NAMED_EASING_BEZIER).find((n) =>
        quadEq(NAMED_EASING_BEZIER[n]!, q),
    );

const truth = (): SeatTruth => {
    const stored = props.storedAnimationOptions.animationOptions.timingFunction;
    const { controlPoints } = props.storedAnimationOptions.cubicBezierOptions;
    const { steps, jumpTerm } = props.storedAnimationOptions.stepOptions;
    if (stored === "step-start" || stored === "step-end") {
        return {
            mode: "steps",
            points: controlPoints,
            steps: 1,
            term: stored === "step-start" ? "jump-start" : "jump-end",
        };
    }
    if (kind.value === "steps") {
        return { mode: "steps", points: controlPoints, steps, term: jumpTerm };
    }
    return {
        mode: "bezier",
        points: controlPoints,
        steps,
        term: jumpTerm,
        presetName: nameForQuad(controlPoints),
    };
};

// ── The authored edit → the ONE persist seam ───────────────────────────────
// KF-CO-40 ≡ KF-TFP-5 (N-10) — the parent owns the ENGINE; the parent's
// `updateTimingFunctionFromName` builds the easing with its faithful CSS twin
// (EE-02) and PERSISTS the complete literal (I.W2.S3 — the ONE persist seam).
// X.KF.W13T.k3 · ESC-k2-1 (§0ar) — the STORE write moves to the component that
// holds the key: `ChannelOptions` resolves `getStoredAnimationOptions(animation)`
// and is the owner, so this panel EMITS the authored value and the owner writes
// the step / quad options and then installs the kind. The prop is read-only
// here (vue/no-mutating-props, rows :151 · :152 · :156 at 5e5f4028).
const onAuthored = (v: EasingPickerValue) => {
    emit("authored", v);
};

const seat = useEasingPickerSeat(truth, onAuthored);

// An EXTERNAL change of the stored curve (the dropdown, the keyframes pane's
// persist, a reload) re-seats the mounted picker; the seat decides whether
// that is a model write or — for a named preset it does not show — a remount.
watch(
    () => [
        props.storedAnimationOptions.animationOptions.timingFunction,
        ...props.storedAnimationOptions.cubicBezierOptions.controlPoints,
        props.storedAnimationOptions.stepOptions.steps,
        props.storedAnimationOptions.stepOptions.jumpTerm,
    ],
    () => seat.reseat(),
);
</script>
