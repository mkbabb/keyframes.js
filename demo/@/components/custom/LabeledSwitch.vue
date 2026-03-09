<template>
    <IconTooltip :text="tooltip">
        <label class="instrument-serif text-base text-muted-foreground cursor-help">{{ label }}</label>
    </IconTooltip>
    <div class="flex items-center">
        <Switch
            :checked="checked"
            @update:checked="(v: boolean) => emit('update:checked', v)"
        />
    </div>
</template>

<script setup lang="ts">
import IconTooltip from "@components/custom/IconTooltip.vue";
import { Switch } from "@components/ui/switch";

defineProps<{
    checked: boolean;
    label: string;
    tooltip: string;
}>();

const emit = defineEmits<{
    (e: "update:checked", value: boolean): void;
}>();
</script>
