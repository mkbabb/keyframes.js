<template>
    <IconTooltip :text="tooltip">
        <label class="instrument-serif text-base text-muted-foreground cursor-help">{{ label }}</label>
    </IconTooltip>
    <Input
        :type="type ?? 'string'"
        :class="[iosNoZoomClass, inputClass ?? 'fira-code']"
        :model-value="modelValue"
        @change="(e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).value)"
    />
</template>

<script setup lang="ts">
import IconTooltip from "@components/custom/IconTooltip.vue";
import { Input } from "@components/ui/input";
import { getIOSNoZoomTextEntryClass } from "@utils/iosTextEntry";

defineProps<{
    modelValue: string | number;
    label: string;
    tooltip: string;
    inputClass?: string;
    type?: string;
}>();

const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
}>();

const iosNoZoomClass = getIOSNoZoomTextEntryClass();
</script>
