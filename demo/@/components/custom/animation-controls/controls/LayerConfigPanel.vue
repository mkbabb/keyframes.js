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
            <label class="instrument-serif text-base text-muted-foreground cursor-help">z-index</label>
        </IconTooltip>
        <Input
            type="number"
            class="fira-code"
            :model-value="layerConfig.zIndex"
            @change="(e: Event) => emit('update', { zIndex: parseInt((e.target as HTMLInputElement).value) || 0 })"
        />

        <template v-if="layerConfig.blendMode === 'weighted'">
            <IconTooltip text="Blend weight (0 = none, 1 = full)">
                <label class="instrument-serif text-base text-muted-foreground cursor-help">weight</label>
            </IconTooltip>
            <Slider
                class="py-2"
                :min="0"
                :max="1"
                :step="0.01"
                :model-value="[layerConfig.weight]"
                @update:model-value="(v: any) => emit('update', { weight: v[0] })"
            />
        </template>

        <IconTooltip text="Enable/disable this layer">
            <label class="instrument-serif text-base text-muted-foreground cursor-help">enabled</label>
        </IconTooltip>
        <div class="flex items-center">
            <Switch
                :checked="layerConfig.enabled"
                @update:checked="(v: boolean) => emit('update', { enabled: v })"
            />
        </div>

        <Separator class="col-span-2 my-1" />
    </template>
</template>

<script setup lang="ts">
import type { AnimationLayerConfig } from "@src/animation/constants";
import IconTooltip from "@components/custom/IconTooltip.vue";
import LabeledSelect from "@components/custom/LabeledSelect.vue";
import { Input } from "@components/ui/input";
import { Slider } from "@components/ui/slider";
import { Separator } from "@components/ui/separator";
import { Switch } from "@components/ui/switch";

const BLEND_MODES = ["replace", "add", "weighted"] as const;

const BLEND_MODE_DESCRIPTIONS: Record<string, string> = {
    "replace": "overwrites lower layers",
    "add": "accumulates with layers",
    "weighted": "lerps by weight factor",
};

defineProps<{
    layerConfig: AnimationLayerConfig;
    isOpen: (name: string) => boolean;
    setOpen: (name: string, open: boolean) => void;
}>();

const emit = defineEmits<{
    (e: "update", val: Partial<AnimationLayerConfig>): void;
}>();
</script>
