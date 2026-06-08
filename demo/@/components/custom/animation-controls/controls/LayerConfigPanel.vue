<template>
    <!-- F1 (H.W9.S3) — blend / z-index / enabled render as glass-ui `.labeled-field`
         rows into AnimationControlsControls's advanced-sub-pane `.panel-content`,
         where the host's `.panel-content :deep(.labeled-field)` rule gives them the
         label-LEFT / value-RIGHT intra-row [auto_1fr] shape (one DRY source for the
         panel-row split; this component does NOT re-author it). -->
    <template v-if="layerConfig">
        <LabeledSelect
            :model-value="layerConfig.blendMode"
            :is-open="isOpen('blend')"
            :items="BLEND_MODES"
            :descriptions="BLEND_MODE_DESCRIPTIONS"
            label="blend"
            tooltip="How this layer blends with others"
            @update:model-value="(v) => emit('update', { blendMode: v })"
            @update:open="(v) => setOpen('blend', v)"
        />

        <!-- z-index: a raw <LabeledField> + slotted <Input> so blend/z-index/
             enabled are all one-cell rows (one paradigm, H.W3.S2). LabeledField
             owns the IconTooltip + label layer; the slot binds controlId/errorId
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

        <template v-if="layerConfig.blendMode === 'weighted'">
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
import type { AnimationLayerConfig } from "@src/animation/constants";
import { LabeledField, LabeledSelect, LabeledSlider, LabeledSwitch } from "@mkbabb/glass-ui/labeled-field";
import { Input } from "@mkbabb/glass-ui/forms";
import { Separator } from "@mkbabb/glass-ui";
import { BLEND_MODE_DESCRIPTIONS } from "../animationDescriptions";

const BLEND_MODES = ["replace", "add", "weighted"] as const;

defineProps<{
    layerConfig: AnimationLayerConfig;
    isOpen: (name: string) => boolean;
    setOpen: (name: string, open: boolean) => void;
}>();

const emit = defineEmits<{
    (e: "update", val: Partial<AnimationLayerConfig>): void;
}>();

</script>
