<template>
    <Select
        :model-value="modelValue"
        @update:model-value="(v) => emit('update:modelValue', String(v))"
    >
        <SelectTrigger class="font-mono">
            <span
                class="!flex items-center gap-1.5 min-w-0 cursor-pointer ![-webkit-line-clamp:unset] !overflow-visible"
            >
                <svg viewBox="-0.05 -0.3 1.1 1.6" class="w-5 h-4 shrink-0">
                    <path
                        :d="activeCurvePath"
                        fill="none"
                        class="stroke-[var(--ppmycota-primary,var(--foreground))]"
                        stroke-width="0.15"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
                <span
                    :class="[
                        'font-mono truncate',
                        isDetailCurve ? 'gold-shimmer' : '',
                    ]"
                    :title="modelValue"
                >{{ modelValue }}</span>
            </span>
        </SelectTrigger>
        <SelectContent class="max-h-[min(24rem,60dvh)]">
            <template v-for="(group, gi) in EASING_GROUPS" :key="group.family">
                <SelectSeparator v-if="gi > 0" />
                <SelectGroup>
                    <SelectLabel class="text-admin-label text-muted-foreground px-2 py-1">
                        {{ group.family }}
                    </SelectLabel>
                    <SelectItem
                        v-for="item in group.items"
                        :key="item.name"
                        :value="item.name"
                        class="pr-2"
                    >
                        <span class="flex items-center gap-1.5 w-full min-w-0">
                            <svg
                                viewBox="-0.05 -0.3 1.1 1.6"
                                class="w-7 h-5 shrink-0"
                            >
                                <path
                                    :d="getItemPath(item.name)"
                                    fill="none"
                                    class="stroke-[var(--ppmycota-primary,var(--foreground))]"
                                    stroke-width="0.18"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                            <span
                                :class="[
                                    'font-mono text-sm',
                                    item.isDetail ? 'gold-shimmer' : '',
                                ]"
                            >{{ item.name }}</span>
                            <span
                                v-if="item.description"
                                class="ml-auto pl-2 font-mono text-xs text-muted-foreground leading-tight whitespace-nowrap"
                            >{{ item.description }}</span>
                        </span>
                    </SelectItem>
                </SelectGroup>
            </template>
        </SelectContent>
    </Select>
</template>

<script setup lang="ts">
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
} from "@mkbabb/glass-ui";

import { getCurvePath } from "@components/custom/animation-controls/controls/composables/timingCurveUtils";
import {
    EASING_GROUPS,
    type CurveGroupItem,
} from "../../../easing/easingGroups";
import { DETAIL_TIMING_FUNCTIONS } from "@components/custom/animation-controls/animationDescriptions";
import { computed } from "vue";

const props = defineProps<{
    modelValue: string;
    timingFunctionsAnd: Record<string, any>;
}>();

const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
}>();

const isDetailCurve = computed(() =>
    DETAIL_TIMING_FUNCTIONS.has(props.modelValue),
);

const activeCurvePath = computed(() =>
    getCurvePath(props.modelValue, props.timingFunctionsAnd),
);

const getItemPath = (name: string) =>
    getCurvePath(name, props.timingFunctionsAnd);
</script>
