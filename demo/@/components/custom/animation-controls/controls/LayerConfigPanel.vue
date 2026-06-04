<template>
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

        <IconTooltip text="Stacking order in animation group">
            <label class="text-body text-muted-foreground cursor-help">z-index</label>
        </IconTooltip>
        <Input
            type="number"
            class="font-mono"
            :model-value="layerConfig.zIndex"
            @change="(e: Event) => emit('update', { zIndex: parseInt((e.target as HTMLInputElement).value) || 0 })"
        />

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

        <Separator class="col-span-2 my-1" />
    </template>
</template>

<script setup lang="ts">
import type { AnimationLayerConfig } from "@src/animation/constants";
import { LabeledSelect, LabeledSlider, LabeledSwitch } from "@mkbabb/glass-ui/labeled-field";
import { IconTooltip } from "@mkbabb/glass-ui/icon-tooltip";
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
