<template>
    <!-- T.E8 + OD-5 R2 — the detail pane's body IS glass-ui's published
         `EasingPicker` (bezier drag + native steps mode + the complete
         re-parseable readout literal + copy). One vendor primitive, both modes.
         X.KF.W13X.controls · UIA-KF-079 · 080 · 036 — the header (title,
         caption, Back) is no longer this body's: the card renders the ONE
         `SubPaneHeader` both sub-panes share, as a sibling of the scrolled
         body this panel fills.
         UIA-KF-116 / 167 — the picker's own PRESET row still repeats the
         card's easing picker one step back: glass 10.1.0's `EasingPicker`
         declares no prop to hide it (`initial playback label surface class
         modelValue`), so that half is the producer's (O-59) and is adopted when
         it lands — never hidden here with a copied producer selector. -->
    <!-- X-DS pass 6 (KF-C6-03) — the host's inline size is capped by the
         rail's free height (`--picker-cap`, ChannelOptions.vue), so the square
         plot and its mode rows fit the rail and no edge fade sits on a control. -->
    <div class="grid w-full max-w-(--picker-cap) gap-2" :style="seat.containerStyle">
        <!-- KF-TFP-1 ≡ KF-ES-12 — the picker sits in the shared
             `useEasingPickerSeat`. The `:key` bumps ONLY on an external NAMED
             re-seat; a custom quad, the step count and the term reach the
             MOUNTED picker through the vendor's own `modelValue`
             write-through, so the first drag off a preset-matched quad never
             remounts, and a reopen on a custom stored quad seats THAT quad.
             X-DS pass 2 · KF-C2-03 — `surface="bare"`, as the Easing scene's
             sidebar: the controls frame is the one plate (no card in a card). -->
        <EasingPicker
            :key="seat.key.value"
            v-bind="seat.seed.value"
            :model-value="seat.model.value"
            :playback="false"
            surface="bare"
            label="Easing curve editor"
            @update:model-value="seat.onPickerChange"
        />
    </div>
</template>

<script setup lang="ts">
import type { StoredAnimationOptions } from "@state";

import { timingFunctionKind } from "@utils/reference-data/animationDescriptions";
import { EasingPicker, type EasingPickerValue } from "@mkbabb/glass-ui/easing";

import { watch } from "vue";
import {
    nameForQuad,
    useEasingPickerSeat,
    type Quad,
    type SeatTruth,
} from "./composables/useEasingPickerSeat";

const props = defineProps<{
    storedAnimationOptions: StoredAnimationOptions;
    /** UIA-KF-165 — the named curve a PEEK seats (read, never written);
     *  `undefined` when the editor shows the stored curve itself. */
    peekQuad: Quad | undefined;
}>();

const emit = defineEmits<{
    /** X.KF.W13T.k3 · ESC-k2-1 — the authored curve, handed to the store's
     *  owner. This panel READS `storedAnimationOptions` and never writes it. */
    (e: "authored", value: EasingPickerValue): void;
}>();

// ── Where the truth lives: the STORE (the persisted literal + its parameters),
// or — while the user only looks at a named curve — that name's own quad.
// The two singular step keywords are their own curves (`steps(1, jump-*)`,
// KF-CO-10) and never the authored `stepOptions`; a departure (KF-CO-13 — an
// engine-native name) is a bezier seat on the stored quad.
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
    if (timingFunctionKind(stored) === "steps") {
        return { mode: "steps", points: controlPoints, steps, term: jumpTerm };
    }
    const points = props.peekQuad ?? controlPoints;
    return {
        mode: "bezier",
        points,
        steps,
        term: jumpTerm,
        presetName: nameForQuad(points),
    };
};

// ── The authored edit → the store's owner (the card) ────────────────────────
// KF-CO-40 ≡ KF-TFP-5 (N-10) — the card owns the ENGINE and the store key; its
// `updateTimingFunctionFromName` builds the easing with its faithful CSS twin
// and PERSISTS the complete literal (the ONE persist seam).
const seat = useEasingPickerSeat(truth, (v) => emit("authored", v));

// An EXTERNAL change of the stored curve (the dropdown, the keyframes pane's
// persist, a reload) or of the peeked name re-seats the mounted picker; the
// seat decides whether that is a model write or a remount.
watch(
    () => [
        props.storedAnimationOptions.animationOptions.timingFunction,
        ...props.storedAnimationOptions.cubicBezierOptions.controlPoints,
        props.storedAnimationOptions.stepOptions.steps,
        props.storedAnimationOptions.stepOptions.jumpTerm,
        ...(props.peekQuad ?? []),
    ],
    () => seat.reseat(),
);
</script>
