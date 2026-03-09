<template>
    <IconTooltip :text="tooltip">
        <label class="instrument-serif text-base text-muted-foreground cursor-help">{{ label }}</label>
    </IconTooltip>
    <Slider
        class="py-2"
        :min="min"
        :max="max"
        :step="step"
        :model-value="[modelValue]"
        @update:model-value="(v: any) => emit('update:modelValue', v[0])"
    />
</template>

<script setup lang="ts">
import IconTooltip from "@components/custom/IconTooltip.vue";
import { Slider } from "@components/ui/slider";

defineProps<{
    modelValue: number;
    label: string;
    tooltip: string;
    min: number;
    max: number;
    step: number;
}>();

const emit = defineEmits<{
    (e: "update:modelValue", value: number): void;
}>();
</script>
