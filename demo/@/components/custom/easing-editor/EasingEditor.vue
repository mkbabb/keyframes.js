<template>
    <!-- I.W2.S4 — THE ONE EASING EDITOR. The single curve-editing component the
         TWO former bezier hosts (EasingSidebar — the rail; TimingFunctionPanel —
         the in-panel cube/amiga detail) now BOTH mount, so the curve-change
         affordance + J's minimal chrome are IDENTICAL everywhere. It owns three
         things only: the editable curve canvas (the subject), the curve
         dropdown (the sole selector — J1), and a READ-ONLY copyable value readout
         (I.W2.S3 — the one parity gap J's strip cost, restored as a passive
         readout + copy, NOT the J-stripped editable text input).

         The host adapts its OWN state to this normalized contract (props in,
         events out), so the editor stays state-shape-agnostic: the rail feeds it
         `demo.*`, the detail panel feeds it `storedAnimationOptions.*`, and the
         editor's behaviour — and the re-parseable readout literal — is the same
         in both. -->
    <div class="easing-editor-core grid w-full gap-2">
        <!-- The hero canvas — the subject. The host owns the (optional) Gallery
             easter-egg dblclick wrapper; the editor only renders + emits. -->
        <EasingCurveCanvas
            :easing-fn="easingFn"
            :svg-path="svgPath"
            :progress="progress"
            :bezier-points="editable ? bezierPoints : undefined"
            :editable="editable"
            :ghost-path-d="ghostPathD"
            @update:bezier-points="(pts) => emit('update:bezierPoints', pts)"
        />

        <!-- The grouped curve selector — the SOLE easing selector (J1). The
             dropdown names the curve; the canvas shows it. No text field. -->
        <EasingSelect
            :model-value="currentName"
            :timing-functions-and="timingFunctionsAnd"
            @update:model-value="(name) => emit('update:name', name)"
        />

        <!-- I.W2.S3 — the read-only curve VALUE READOUT + copy. The value is the
             COMPLETE, re-parseable `cubic-bezier(x1, y1, x2, y2)` / `steps(n, …)`
             literal (NEVER the bare `cubic-bezier` keyword) — both the displayed
             text AND the CopyButton's copied value. Shown only when there is a
             literal to surface (an editable bezier / steps); a bare named curve
             (`ease-out`) has no parametric literal to copy, so the readout is
             omitted for it (the dropdown already names it). Passive: no input,
             consistent with J's minimal chrome. -->
        <div
            v-if="readoutValue"
            class="easing-readout flex items-center justify-center gap-2 m-0 p-0 text-mono-caption normal-case italic min-w-0"
        >
            <span class="easing-readout-value" :title="readoutValue">{{ readoutValue }}</span>
            <TooltipProvider :delay-duration="200">
                <Tooltip>
                    <TooltipTrigger as-child>
                        <CopyButton class="scale-on-hover icon-md shrink-0" :text="readoutValue" />
                    </TooltipTrigger>
                    <TooltipContent class="text-mono-caption normal-case">
                        Copy to clipboard
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@mkbabb/glass-ui";

import CopyButton from "@components/custom/CopyButton.vue";
import EasingCurveCanvas from "@components/custom/easing-editor/EasingCurveCanvas.vue";
import EasingSelect from "@components/custom/easing-editor/EasingSelect.vue";

// The normalized contract BOTH hosts adapt their state onto. `readoutValue` is
// the COMPLETE re-parseable literal the host produces (the rail's `demo.cssValue`
// / the panel's `cubicBezierToString(...)`) — the value surfaced AND copied.
defineProps<{
    easingFn: (t: number) => number;
    svgPath: string;
    currentName: string;
    timingFunctionsAnd: Record<string, any>;
    progress?: number;
    bezierPoints?: [number, number, number, number];
    editable?: boolean;
    /** The complete, re-parseable `cubic-bezier(…)`/`steps(…)` literal to read
     *  out + copy. Falsy → no readout (a bare named curve has no literal). */
    readoutValue?: string;
    /** Q.WC2 S2 — the ORIGINAL named curve's `d` for the comparison-DIFF ghost
     *  (present only on a named→custom edit; absent → no ghost). */
    ghostPathD?: string;
}>();

const emit = defineEmits<{
    (e: "update:bezierPoints", points: [number, number, number, number]): void;
    (e: "update:name", name: string): void;
}>();
</script>

<style scoped>
/* S.G2 S6 — the readout literal is UN-TRUNCATED: the complete, re-parseable
   `cubic-bezier(…)`/`steps(…)` literal reads out in full (it wraps within the
   card if long) beside the copy affordance, replacing the former single-line
   truncation + the deleted writable value-input row. The value is short (a
   cubic-bezier / steps literal), so it fits the minimal sidebar without stealing
   the bezier's space. */
.easing-readout-value {
    /* The COMPLETE re-parseable literal, un-truncated (S.G2) — but on ONE line:
       a wrapped literal grows the detail stack past the min(50vh,480px) cap
       (proof:bezier-no-scroll). Horizontal scroll INSIDE the readout's own box
       keeps the full text present + selectable at any width (the CopyButton
       carries the whole literal regardless). */
    max-width: 100%;
    white-space: nowrap;
    overflow-x: auto;
    scrollbar-width: thin;
}
</style>
