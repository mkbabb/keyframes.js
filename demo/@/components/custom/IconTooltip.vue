<template>
    <Tooltip>
        <TooltipTrigger as-child>
            <slot />
        </TooltipTrigger>
        <TooltipContent class="fira-code text-xs">{{ text }}</TooltipContent>
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
