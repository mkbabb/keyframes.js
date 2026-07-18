<template>
    <!-- F1 (H.W9.S3) — blend / z-index / enabled render as glass-ui `.labeled-field`
         rows into ChannelOptions's advanced-sub-pane `.panel-content`,
         where the host's `.panel-content :deep(.labeled-field)` rule gives them the
         label-LEFT / value-RIGHT intra-row [auto_1fr] shape (one DRY source for the
         panel-row split; this component does NOT re-author it). -->
    <template v-if="layerConfig">
        <LabeledSelect
            v-if="blendAvailable"
            :model-value="layerConfig.op"
            :is-open="isOpen('blend')"
            :items="COMPOSITE_OPERATORS"
            :descriptions="COMPOSITE_OPERATOR_DESCRIPTIONS"
            label="blend"
            tooltip="How this layer blends with others"
            @update:model-value="(v) => emit('update', { op: v })"
            @update:open="(v) => setOpen('blend', v)"
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

        <!-- z-index: a raw <LabeledField> + slotted <Input> so blend/z-index/
             enabled are all one-cell rows (one paradigm, H.W3.S2). LabeledField
             owns the label/copy layer; the slot binds controlId/errorId
             manually (the four wrappers auto-wire these — a raw slot does it by
             hand, LabeledField.vue.d.ts:19-26 / WV-W3-LOW-2). -->
        <LabeledField
            label="z-index"
            tooltip="Stacking order in animation group"
            v-slot="{ controlId, errorId }"
        >
            <Input
                :id="controlId"
                :aria-errormessage="errorId"
                type="number"
                class="font-mono"
                :model-value="layerConfig.zIndex"
                @change="(e: Event) => emit('update', { zIndex: parseInt((e.target as HTMLInputElement).value) || 0 })"
            />
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

        <LabeledSwitch
            label="enabled"
            tooltip="Enable/disable this layer"
            :checked="layerConfig.enabled"
            @update:checked="(v: boolean) => emit('update', { enabled: v })"
        />

        <Separator class="my-1" />
    </template>
</template>

<script setup lang="ts">
import type { AnimationLayerConfig } from "@mkbabb/keyframes.js";
import { LabeledField, LabeledSelect, LabeledSlider, LabeledSwitch } from "@mkbabb/glass-ui/labeled-field";
import { Input } from "@mkbabb/glass-ui/forms";
import { Separator } from "@mkbabb/glass-ui";
import { COMPOSITE_OPERATOR_DESCRIPTIONS } from "@utils/reference-data/animationDescriptions";

const COMPOSITE_OPERATORS = ["replace", "add", "accumulate"] as const;

defineProps<{
    layerConfig: AnimationLayerConfig;
    blendAvailable: boolean;
    isOpen: (name: string) => boolean;
    setOpen: (name: string, open: boolean) => void;
}>();

const emit = defineEmits<{
    (e: "update", val: Partial<AnimationLayerConfig>): void;
}>();

</script>
