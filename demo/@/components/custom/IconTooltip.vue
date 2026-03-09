<template>
    <Tooltip>
        <TooltipTrigger as-child>
            <slot />
        </TooltipTrigger>
        <TooltipContent class="instrument-serif text-base">{{ text }}</TooltipContent>
    </Tooltip>
</template>

<script setup lang="ts">
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@components/ui/tooltip";

defineProps<{
    text: string;
}>();
</script>
