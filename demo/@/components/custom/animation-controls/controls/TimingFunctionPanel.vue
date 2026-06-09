<template>
        <div
            class="w-full grid justify-items-center"
        >
            <template v-if="kind === 'cubic-bezier'">
                <!-- H.W11.I6 — the inner Card is GONE (de-nested). The detail editor
                     is a VIEW within the parent controls Card (AnimationControlsControls
                     is itself the `surface="cartoon"` framed surface), so a second Card
                     here was pure card-in-card duplication. The bezier editor now flows
                     into the parent content directly — the `easing-editor` container
                     (the `38cqi` canvas-sizing context, H.W4.S1) moves onto this plain
                     wrapper; the H.W9.F2 title-LEFT / dismiss-RIGHT header pattern is
                     PRESERVED, re-homed onto the flow (no inner Card, no legacy beside
                     the replacement). -->
                <div class="easing-editor grid gap-1 w-full">
                    <!-- H.W9.F2 — title LEFT, dismiss RIGHT: the idiomatic detail-panel
                         header, re-homed onto the de-nested flow. -->
                    <div class="flex items-center justify-between gap-2">
                        <h3 class="text-title">cubic-bézier</h3>
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
                    <!-- I.W2.S4 — the ONE shared EasingEditor. The in-panel detail
                         editor now mounts the SAME component the rail does (the
                         dropdown-via-EasingSelect, the editable canvas, AND the
                         read-only readout/copy — I.W2.S3, the complete `timingString`
                         literal, NEVER the bare `cubic-bezier` keyword). The preset
                         Select is folded into the EasingSelect dropdown the editor
                         already carries, so the divergent in-panel preset picker is
                         RETIRED (one selector, one readout home). -->
                    <EasingEditor
                        :easing-fn="currentBezierFn"
                        :svg-path="currentBezierSvgPath"
                        :progress="progress"
                        :current-name="kind"
                        :timing-functions-and="timingFunctionsAnd"
                        :bezier-points="controlPoints"
                        :editable="true"
                        :readout-value="timingString"
                        @update:bezier-points="onBezierPointsUpdate"
                        @update:name="onSelectName"
                    />
                </div>
            </template>

            <template v-else-if="kind === 'steps'">
                <!-- H.W11.I6 — the inner Card is GONE here too (the steps variant was
                     the same card-in-card shape). The steps editor flows into the parent
                     controls Card directly. -->
                <div class="grid gap-2 w-full">
                    <h3 class="text-title">steps</h3>
                    <!-- Single-column stacked fields (label OVER control), the same
                         shape as the sidebar's LabeledField rows — H.W3.S3b collapsed
                         this panel's own label|control two-track grid. -->
                    <div class="flex flex-col gap-2">
                        <div class="flex flex-col gap-1">
                            <label class="text-mono-caption normal-case text-muted-foreground">count</label>
                            <Input
                                type="number"
                                class="font-mono"
                                :model-value="storedAnimationOptions.stepOptions.steps"
                                @update:model-value="
                                    (key: any) => {
                                        storedAnimationOptions.stepOptions.steps = key;
                                        emit('updateTimingFunction', 'steps' as any);
                                    }
                                "
                            />
                        </div>

                        <div class="flex flex-col gap-1">
                            <label class="text-mono-caption normal-case text-muted-foreground">jump term</label>
                            <Select
                                :model-value="storedAnimationOptions.stepOptions.jumpTerm"
                                @update:model-value="
                                    (key: any) => {
                                        storedAnimationOptions.stepOptions.jumpTerm = key;
                                        emit('updateTimingFunction', 'steps' as any);
                                    }
                                "
                            >
                                <SelectTrigger class="font-mono">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup class="font-mono">
                                        <SelectItem v-for="j in jumpTerms" :value="j">
                                            {{ j }}
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </template>
        </div>
</template>

<script setup lang="ts">
import type { Animation } from "@src/animation/engine";
import type { TimingFunction, TimingFunctionNames } from "@src/animation/constants";
import type { StoredAnimationOptions } from "../stores";

import {
    CSSCubicBezier,
    cubicBezierToString,
    jumpTerms,
} from "@mkbabb/value.js";
import { generateCurveSVGPath } from "./timingCurveUtils";
import { timingFunctionKind } from "../animationDescriptions";

import {
    Button,
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@mkbabb/glass-ui";
import { Input } from "@mkbabb/glass-ui/forms";

import { computed } from "vue";
import { ArrowLeft } from "@lucide/vue";
import EasingEditor from "@components/custom/EasingEditor.vue";

const props = defineProps<{
    animation: Animation<any>;
    storedAnimationOptions: StoredAnimationOptions;
    timingFunctionsAnd: Record<string, any>;
    progress?: number;
}>();

const emit = defineEmits<{
    (e: "exitDetailPanel"): void;
    (e: "updateTimingFunction", key: TimingFunctionNames | "cubic-bezier" | string): void;
}>();

// I.W2.S3 — the stored value is a re-parseable LITERAL now; the panel keys its
// cubic-bezier-vs-steps view off the KIND (literal-aware).
const kind = computed(() =>
    timingFunctionKind(props.storedAnimationOptions.animationOptions.timingFunction),
);

// ── Cubic bezier state ──────────────────────────────────────────

const controlPoints = computed<[number, number, number, number]>(
    () => props.storedAnimationOptions.cubicBezierOptions.controlPoints as [number, number, number, number],
);

const currentBezierFn = computed<TimingFunction>(
    () => CSSCubicBezier(...controlPoints.value),
);

const currentBezierSvgPath = computed(
    () => generateCurveSVGPath(currentBezierFn.value),
);

// The COMPLETE, re-parseable `cubic-bezier(x1, y1, x2, y2)` literal — the value
// the shared EasingEditor reads out + copies (I.W2.S3), NEVER the bare keyword.
const timingString = computed(
    () => cubicBezierToString(...controlPoints.value),
);

const onBezierPointsUpdate = (pts: [number, number, number, number]) => {
    props.storedAnimationOptions.cubicBezierOptions.controlPoints = pts;

    const timingFunction = CSSCubicBezier(...pts);
    props.animation.options.timingFunction = timingFunction;
    props.animation.frames.forEach((frame) => {
        frame.timingFunction = timingFunction;
    });

    // The parent's `updateTimingFunctionFromName` re-derives + PERSISTS the
    // complete `cubic-bezier(...)` literal from the live control points (I.W2.S3
    // — the ONE persist seam), so a re-mount round-trips with no
    // AnimationOptionError.
    emit("updateTimingFunction", "cubic-bezier");
};

// I.W2.S4 — the in-panel editor's shared EasingSelect can now CHANGE the curve
// (the affordance the rail always had). A pick routes through the SAME persist
// seam as the dropdown (the parent maps `updateTimingFunction` →
// `updateTimingFunctionFromName`, which writes the re-parseable literal).
const onSelectName = (name: string) => {
    emit("updateTimingFunction", name as TimingFunctionNames | "cubic-bezier");
};
</script>

<style scoped>
/* H.W4.S1 — the cubic-bézier detail Card is an `easing-editor` container so
   the nested EasingCurveCanvas sizes its block off THIS Card's inline size
   (`38cqi`), bounded in [160px, 280px] — the same container the EasingSidebar
   declares, so the canvas is capped in BOTH render hosts. Baseline-2023
   (container queries Widely available since 2023-02-14) — no fallback owed. */
.easing-editor {
    container-type: inline-size;
    container-name: easing-editor;
}

/* H.W11.I7 — the in-panel bezier canvas GROWS to fill the container (the user:
   "make the bezier controls as BIG/TALL as possible"). I6's inner-Card removal
   freed the vertical space the W9 220px cap was hoarding against (the two
   compose: de-nest → more room → grow the canvas to fill it).

   MEASURE-FIRST against the LIVE detail render (cube scene, the bezier detail
   panel open). The detail-panel host caps at `min(50vh, 480px)` — VIEWPORT-HEIGHT
   bound, so it is 360px at a 720-tall viewport and 450px at 900. The de-nested
   chrome around the canvas (title/readout header + the preset Select + grid gaps)
   + the `.easing-curve-canvas-wrapper` 0.5rem padding measured 136px total
   (`scrollHeight − canvasBlockSize`, live, both viewports). So the canvas BUDGET
   before scroll = `min(50vh, 480px) − 136px` — 224px at 720, 314px at 900.

   THE GROW — `block-size: clamp(232px, 78cqi, 300px)` lands a 232px FLOOR (a REAL
   grow over W9's 220 → `proof:bezier-grown` bites: 232 > 220), growing toward the
   300/46vh ceiling on a wider rail. But the W9 fit-without-scroll invariant
   (`proof:bezier-no-scroll`) is VIEWPORT-HEIGHT bound, NOT rail-inline bound — at a
   720-tall viewport the 360px host could not hold a 232px canvas (232 + 136 = 368 >
   360 → 8px overflow). The 78cqi term ties height to the RAIL inline width (296px →
   231px), which is identical at 720 and 900, so it cannot self-correct for the
   shorter cap. The `max-block-size` therefore TRACKS the viewport-height budget:
   `calc(min(50vh, 480px) − 9rem)` = 360 − 144 = 216px would clamp BELOW 220 at 720
   (too tight), so the trim is `8.5rem` (136px) — exactly the measured chrome — minus
   a 1px sub-pixel guard: `calc(min(50vh, 480px) − 137px)` resolves 223px at 720
   (> 220 → grown; 223 + 136 = 359 ≤ 360 → FITS) and 313px at 900 (the rail-inline
   78cqi floor of 232 wins there — generous height). So both gates hold at BOTH
   anchors: grown above 220 AND fits without scroll. The square LAW is PRESERVED
   (`aspect-ratio:1` from EasingCurveCanvas — the 280px-wide canvas is never shorter
   than width-driven; the height clamp only bounds the block axis). `:deep()` reaches
   the child's scoped canvas; the bounded ceiling wins over the canvas's own 280 cap. */
:deep(.easing-curve-canvas) {
    block-size: clamp(232px, 78cqi, 300px);
    max-block-size: calc(min(50vh, 480px) - 137px);
}

/* I.WZ — the I.W6 native-font reclaim (Plus Jakarta → native sans) re-rendered the
   detail-panel chrome ~4px TALLER, pushing the bezier stack 3px past the
   `min(50vh, 480px)` host cap at a 720-tall viewport → a scrollbar
   (`proof:bezier-no-scroll` + the `proof:bezier-grown` "still fits" clause both red).
   The grown canvas must stay above the W9 220px floor (`proof:bezier-grown` clause 1),
   so the fix RECLAIMS the room from the canvas-wrapper's block padding — scoped to the
   DETAIL panel only (the easing sidebar keeps its `p-2`, it has the pane room). 8px→4px
   each side trims 8px of chrome (5px margin under the 360px cap), the canvas stays 223px
   (> 220 grown). */
:deep(.easing-curve-canvas-wrapper) {
    padding-block: 0.25rem;
}
</style>
