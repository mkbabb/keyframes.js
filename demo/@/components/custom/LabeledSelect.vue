<template>
    <IconTooltip :text="tooltip">
        <label class="instrument-serif text-base text-muted-foreground cursor-help">{{ label }}</label>
    </IconTooltip>
    <Select
        :model-value="modelValue"
        :open="isOpen"
        @update:open="(v: boolean) => emit('update:open', v)"
        @update:model-value="(v: any) => emit('update:modelValue', v)"
    >
        <SelectTrigger class="fira-code">
            <SelectValue />
        </SelectTrigger>
        <SelectContent>
            <SelectGroup class="fira-code">
                <SelectItem
                    v-for="item in items"
                    :key="item"
                    :value="item"
                >
                    {{ item }}
                    <template #extra>
                        <span
                            v-if="descriptions?.[item]"
                            class="ml-auto pl-2 text-[10px] text-muted-foreground whitespace-nowrap"
                        >{{ descriptions[item] }}</span>
                    </template>
                </SelectItem>
            </SelectGroup>
        </SelectContent>
    </Select>
</template>

<script setup lang="ts">
import IconTooltip from "@components/custom/IconTooltip.vue";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select";

defineProps<{
    modelValue: string;
    isOpen: boolean;
    items: readonly string[];
    descriptions?: Record<string, string>;
    label: string;
    tooltip: string;
}>();

const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
    (e: "update:open", value: boolean): void;
}>();
</script>
