<template>
    <div class="easing-editor glass-resting cartoon-surface p-3 grid gap-3">
        <!-- H.W4.S2 — the editor's parity header (gestalt parity with the
             TimingFunctionPanel's titled detail Card). `text-title` is the
             φ^(3/2) rung; the name reads off the live selection. -->
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

        <!-- CSS value bar -->
        <Card surface="cartoon" tier="quiet" class="p-0">
            <CardContent class="flex items-center gap-2 p-2">
                <Input
                    :model-value="demo.cssValue.value"
                    class="css-value-input text-mono-caption normal-case flex-1 min-w-0"
                    placeholder="cubic-bezier(...) or easing name"
                    @keydown.enter="onCSSInput"
                    @blur="onCSSInput"
                />
                <CopyButton class="shrink-0 w-4 h-4" :text="demo.cssValue.value" />
            </CardContent>
        </Card>

        <!-- Grouped curve selector -->
        <EasingSelect
            :model-value="demo.currentEasingName.value"
            :timing-functions-and="demo.timingFunctionsAnd"
            @update:model-value="demo.selectEasing"
        />

        <!-- Step options (shown only for steps) -->
        <Card v-if="demo.isSteps.value" surface="cartoon" tier="quiet" class="p-0">
            <CardContent class="grid grid-cols-2 gap-2 p-2">
                <div class="grid gap-1">
                    <label class="text-admin-label text-muted-foreground">steps</label>
                    <Input
                        type="number"
                        :model-value="demo.stepOptions.value.steps"
                        :min="1"
                        :max="60"
                        class="text-mono-caption normal-case"
                        @change="onStepsChange"
                    />
                </div>
                <div class="grid gap-1">
                    <label class="text-admin-label text-muted-foreground">jump</label>
                    <Select
                        :model-value="demo.stepOptions.value.jumpTerm"
                        @update:model-value="(v) => { demo.stepOptions.value.jumpTerm = String(v); }"
                    >
                        <SelectTrigger class="text-mono-caption normal-case">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem
                                v-for="jt in JUMP_TERMS"
                                :key="jt"
                                :value="jt"
                                class="text-mono-caption normal-case"
                            >
                                {{ jt }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>

        <!-- Duration control -->
        <div class="flex items-center gap-2 px-1">
            <label class="text-admin-label text-muted-foreground shrink-0">duration</label>
            <div class="duration-slider flex-1">
                <Slider
                    size="sm"
                    :model-value="[demo.duration.value]"
                    :min="300"
                    :max="5000"
                    :step="100"
                    @update:model-value="(v: any) => { demo.duration.value = v[0]; }"
                />
            </div>
            <Input
                :model-value="(demo.duration.value / 1000).toFixed(1) + 's'"
                class="duration-input text-mono-caption normal-case text-muted-foreground shrink-0 w-14 text-right"
                @keydown.enter="onDurationInput"
                @blur="onDurationInput"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    Card,
    CardContent,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Slider,
} from "@mkbabb/glass-ui";
import { Input } from "@mkbabb/glass-ui/forms";
import { toast } from "vue-sonner";

import CopyButton from "@components/custom/CopyButton.vue";
import EasingSelect from "@components/custom/EasingSelect.vue";
import EasingCurveCanvas from "@components/custom/EasingCurveCanvas.vue";
import type { EasingDemoContext } from "./easingKeys";
import { parseCSSTime } from "@mkbabb/value.js";

const JUMP_TERMS = ["jump-start", "jump-end", "jump-none", "jump-both"];

const props = defineProps<{ demo: EasingDemoContext }>();
const demo = props.demo;

const onCSSInput = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    if (value.trim() === demo.cssValue.value) return;
    const ok = demo.parseCSSValue(value);
    if (!ok) {
        toast.error("Invalid easing value", {
            description: "Try cubic-bezier(...), steps(...), or a named function",
            duration: 2000,
        });
    }
};

const onDurationInput = (e: Event) => {
    const raw = (e.target as HTMLInputElement).value.trim();
    if (!raw) return;
    let ms: number;
    try {
        ms = parseCSSTime(raw);
    } catch {
        const num = parseFloat(raw);
        if (isNaN(num)) return;
        ms = num < 20 ? num * 1000 : num;
    }
    demo.duration.value = Math.max(300, Math.min(5000, Math.round(ms / 100) * 100));
};

const onStepsChange = (e: Event) => {
    const v = parseInt((e.target as HTMLInputElement).value, 10);
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

/* The free-text easing input adopts the mono-caption rung for size/family,
   but keeps user-typed content case-as-typed (the mono-caption register
   uppercases; a `cubic-bezier(...)` or camelCase easing name must read as
   entered) — an isomorphic guard, not a register change. */
.css-value-input {
    text-transform: none;
}

/* Geometry is the `size` prop (size="sm" → 4px track / 12px thumb), not a
   wrapper token — the size-axis root class shadows wrapper-set geometry
   custom properties (Qρ §5.4). Only the colour tokens carry here. */
.duration-slider {
    --slider-track-bg: color-mix(in srgb, var(--color-slider-track) 15%, transparent);
    --slider-range-bg: color-mix(in srgb, var(--color-slider-track) 40%, transparent);
    --slider-thumb-bg: var(--color-progress);
}
.duration-slider:hover {
    --slider-thumb-bg: color-mix(in srgb, var(--color-progress) 80%, transparent);
}
.duration-input {
    height: auto;
    padding: 0.125rem 0.25rem;
    border-color: transparent;
    background: transparent;
    /* Editable readout — keep the typed `2.0s` case-as-typed (mono-caption
       uppercases; isomorphic guard). */
    text-transform: none;
}
.duration-input:focus {
    border-color: var(--border);
    background: var(--background);
}
</style>
