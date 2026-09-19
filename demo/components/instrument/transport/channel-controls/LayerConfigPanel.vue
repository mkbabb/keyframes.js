<template>
    <!-- F1 (H.W9.S3) — blend / z-index / enabled render as glass-ui `.labeled-field`
         rows into ChannelOptions's advanced-sub-pane `.panel-content`,
         where the host's `.panel-content :deep(.labeled-field)` rule gives them the
         label-LEFT / value-RIGHT intra-row [auto_1fr] shape (one DRY source for the
         panel-row split; this component does NOT re-author it). -->
    <template v-if="layerConfig">
        <!-- KF-CO-1 / LP-2 — `open` is the producer's DECLARED prop
             (`LabeledSelectProps.open?: boolean`, emit `update:open`). The
             former `is-open` spelling reached nothing, and the absent Boolean
             prop cast to `false` was forwarded unconditionally into reka's
             SelectRoot, pinning this select controlled-shut. -->
        <LabeledSelect
            v-if="blendAvailable"
            :model-value="layerConfig.op"
            :open="open"
            :items="COMPOSITE_OPERATORS"
            :descriptions="COMPOSITE_OPERATOR_DESCRIPTIONS"
            label="blend"
            tooltip="How this layer blends with others"
            @update:model-value="(v) => emit('update', { op: v as AnimationLayerConfig['op'] })"
            @update:open="(v) => emit('update:open', v)"
        />
        <LabeledField
            v-else
            label="blend"
            tooltip="Blend modes apply only when layers share one target"
        >
            <span class="text-small text-muted-foreground text-right">
                independent targets
            </span>
        </LabeledField>

        <!-- z-index: a raw <LabeledField> + a slotted control so blend/z-index/
             enabled are all one-cell rows (one paradigm, H.W3.S2). LabeledField
             owns the label/copy layer; the slot binds controlId/errorId
             manually (the four wrappers auto-wire these — a raw slot does it by
             hand, LabeledField.vue.d.ts:19-26 / WV-W3-LOW-2).
             LP-8 ≡ KF-CO-35 (S-9, EVALUATED → ADOPTED here, W6-I): the control
             is the producer's `NumberField` (`./number-field`, 7.0.0). The
             hand-rolled `<Input type="number">` sat outside the primitive's
             declared type union, invented data on a blank commit
             (`parseInt(…) || 0` — an empty field became a zero z-index) and
             committed on blur only. The NumberField emits a NUMBER payload
             through its own model, so the commit is `Number.isFinite`-gated:
             a blank or unparsable entry commits NOTHING, an integer step is
             the domain's own, and the stepper buttons give the row a keyboard
             and pointer increment it never had. `id` rides the root (reka
             hands it to the input through its context); the error linkage
             lands on the input, which forwards its attrs. The mono face and
             tabular numerals are the primitive's own (`.number-field__input`),
             so the caller's `font-mono` is not re-authored. The SECOND site
             of this evaluation — TimelineCaret's inline percent editor
             (C-4 / D·M-9, MISS-α6) — is DECLINED at the caret, in writing
             there. -->
        <LabeledField
            label="z-index"
            tooltip="Stacking order in animation group"
            v-slot="{ controlId, errorId }"
        >
            <NumberField
                :id="controlId"
                :model-value="layerConfig.zIndex"
                :step="1"
                :format-options="{ maximumFractionDigits: 0 }"
                @update:model-value="
                    (v: number) => {
                        if (Number.isFinite(v)) emit('update', { zIndex: v });
                    }
                "
            >
                <NumberFieldContent>
                    <NumberFieldDecrement />
                    <NumberFieldInput :aria-errormessage="errorId" />
                    <NumberFieldIncrement />
                </NumberFieldContent>
            </NumberField>
        </LabeledField>

        <template v-if="blendAvailable && layerConfig.op === 'replace'">
            <LabeledSlider
                label="weight"
                tooltip="Blend weight (0 = none, 1 = full)"
                :model-value="layerConfig.weight"
                :min="0"
                :max="1"
                :step="0.01"
                @update:model-value="(v: number) => emit('update', { weight: v })"
            />
        </template>

        <!-- KF-CO-8 ≡ LP-3 — the switch rides the producer's DECLARED model
             (`LabeledSwitchProps.modelValue: boolean`, emit `update:modelValue`).
             `checked`/`update:checked` were unknown to the installed component:
             the absent Boolean `modelValue` cast to `false` rendered the switch
             permanently OFF while the engine default is `enabled: true`, and
             the click listened for an event that was never fired. -->
        <LabeledSwitch
            label="enabled"
            tooltip="Enable/disable this layer"
            :model-value="layerConfig.enabled"
            @update:model-value="(v: boolean) => emit('update', { enabled: v })"
        />

        <Separator class="my-1" />
    </template>
</template>

<script setup lang="ts">
import type { AnimationLayerConfig } from "@mkbabb/keyframes.js";
import { LabeledField, LabeledSelect, LabeledSlider, LabeledSwitch } from "@mkbabb/glass-ui/labeled-field";
import {
    NumberField,
    NumberFieldContent,
    NumberFieldDecrement,
    NumberFieldIncrement,
    NumberFieldInput,
} from "@mkbabb/glass-ui/number-field";
import { Separator } from "@mkbabb/glass-ui/separator";
import { COMPOSITE_OPERATOR_DESCRIPTIONS } from "@utils/reference-data/animationDescriptions";

const COMPOSITE_OPERATORS = ["replace", "add", "accumulate"] as const;

defineProps<{
    layerConfig: AnimationLayerConfig;
    blendAvailable: boolean;
    /** The blend select's open state — the host's one-open-at-a-time mutex
     *  drives it through `open` / `update:open` (LP-16: a declared model,
     *  not a stringly-typed callback pair). Required, never absent: an absent
     *  Boolean prop casts to `false` and would pin the select shut. */
    open: boolean;
}>();

const emit = defineEmits<{
    (e: "update", val: Partial<AnimationLayerConfig>): void;
    (e: "update:open", open: boolean): void;
}>();

</script>
