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
        <div class="easing-editor grid gap-2 w-full">
            <div class="flex items-center justify-between gap-2">
                <h3 class="text-title">{{ kind === "steps" ? "steps" : "cubic-bézier" }}</h3>
                <Button
                    variant="ghost"
                    size="icon"
                    class="h-auto p-1 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="back to controls"
                    @click="emit('exitDetailPanel')"
                >
                    <ArrowLeft class="icon-sm" />
                </Button>
            </div>
            <!-- The `:key` remount re-seats the picker when the KIND flips
                 (glass-ui 4.0.1's modelValue is emit-only — no external
                 write-through / points-in prop; the re-seat gap is forwarded
                 in KF-TO-GLASSUI-BG.md §FORWARDING). A custom stored quad has
                 no seedable preset — the picker opens on its catalogue default
                 and the first authored edit writes through (the initialPoints
                 ask rides the same forward). -->
            <EasingPicker
                :key="pickerKey"
                :mode="kind === 'steps' ? 'steps' : 'bezier'"
                :preset="seedPreset"
                :steps="storedAnimationOptions.stepOptions.steps"
                :term="storedAnimationOptions.stepOptions.jumpTerm as JumpTerm"
                :playback="false"
                label="Easing curve editor"
                @update:model-value="onPickerChange"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { KeyframesAnimation } from "@mkbabb/keyframes.js";
import type { TimingFunctionNames } from "@mkbabb/keyframes.js";
import type { StoredAnimationOptions } from "@state";

import { CSSCubicBezier, bezierPresets } from "@mkbabb/value.js/easing";
import { timingFunctionKind } from "@utils/reference-data/animationDescriptions";

import { Button } from "@mkbabb/glass-ui";
import {
    EasingPicker,
    type EasingPickerValue,
    type JumpTerm,
} from "@mkbabb/glass-ui/easing";

import { computed } from "vue";
import { ArrowLeft } from "@lucide/vue";

const props = defineProps<{
    animation: KeyframesAnimation<any>;
    storedAnimationOptions: StoredAnimationOptions;
    timingFunctionsAnd: Record<string, any>;
    progress?: number;
}>();

const emit = defineEmits<{
    (e: "exitDetailPanel"): void;
    (e: "updateTimingFunction", key: TimingFunctionNames | "cubic-bezier" | string): void;
}>();

// I.W2.S3 — the stored value is a re-parseable LITERAL; the panel keys its
// cubic-bezier-vs-steps view off the KIND (literal-aware).
const kind = computed(() =>
    timingFunctionKind(props.storedAnimationOptions.animationOptions.timingFunction),
);

// ── Seeding (best-effort against the vendor's initial-prop-only seam) ──────
const quadEq = (
    a: readonly number[],
    b: readonly number[],
): boolean => a.length === b.length && a.every((v, i) => Math.abs(v - b[i]!) < 0.0005);

/** Seed the bezier canvas from the STORED quad when the picker's own
 *  catalogue carries a matching preset (else the catalogue default — the
 *  stored literal itself stays authoritative until an authored edit). */
const seedPreset = computed<string | undefined>(() => {
    if (kind.value === "steps") return undefined;
    const stored = props.storedAnimationOptions.cubicBezierOptions
        .controlPoints as readonly number[];
    return Object.keys(bezierPresets).find((n) =>
        quadEq(bezierPresets[n as keyof typeof bezierPresets], stored),
    );
});

const pickerKey = computed(() => `${kind.value}:${seedPreset.value ?? "custom"}`);

// The (re)mount's immediate v-model emission is the SEED echoing back —
// recognized BY VALUE so opening the panel never clobbers the animation's
// stored curve with the catalogue default.
const isSeedEcho = (v: EasingPickerValue): boolean => {
    if (v.mode === "steps") {
        const cur = props.storedAnimationOptions.stepOptions;
        const term = String(cur.jumpTerm);
        return (
            v.steps === cur.steps &&
            (v.term === term || `jump-${v.term}` === term)
        );
    }
    const stored = props.storedAnimationOptions.cubicBezierOptions
        .controlPoints as readonly number[];
    if (quadEq(v.points, stored)) return true;
    // The default-seeded custom case: the echo carries the catalogue seed's
    // quad (not the stored one) — skip it so the stored curve survives open.
    const seed = seedPreset.value;
    if (!seed) {
        // No preset matched the stored quad → the picker mounted on its
        // default; its first emission is that default's quad.
        return quadEq(
            v.points,
            bezierPresets["ease-out-back" as keyof typeof bezierPresets],
        );
    }
    return false;
};

// ── The authored edit → the ONE persist seam ───────────────────────────────
const onPickerChange = (v: EasingPickerValue | undefined) => {
    if (!v || isSeedEcho(v)) return;
    if (v.mode === "steps") {
        props.storedAnimationOptions.stepOptions.steps = v.steps;
        props.storedAnimationOptions.stepOptions.jumpTerm = (
            v.term.startsWith("jump-") ? v.term : `jump-${v.term}`
        ) as any;
        emit("updateTimingFunction", "steps");
        return;
    }
    const pts = v.points as [number, number, number, number];
    props.storedAnimationOptions.cubicBezierOptions.controlPoints = pts;
    const timingFunction = CSSCubicBezier(...pts);
    props.animation.options.timingFunction = timingFunction;
    props.animation.frames.forEach((frame) => {
        frame.timingFunction = timingFunction;
    });
    // The parent's `updateTimingFunctionFromName` re-derives + PERSISTS the
    // complete `cubic-bezier(...)` literal from the live control points
    // (I.W2.S3 — the ONE persist seam), so a re-mount round-trips with no
    // AnimationOptionError.
    emit("updateTimingFunction", "cubic-bezier");
};
</script>

<style scoped>
/* H.W4.S1 lineage — the detail body is a container so the picker's `38cqi`
   canvas sizing resolves off THIS panel's inline size (both render hosts
   bounded; the hand-rolled canvas's measured px-arithmetic clamps died with
   the cluster — the vendor's own clamp(200px, 38cqi, 320px) governs). */
.easing-editor {
    container-type: inline-size;
    container-name: easing-editor;
}
</style>
