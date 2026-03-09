<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@utils/utils";

const props = defineProps<{
    class?: HTMLAttributes["class"];
}>();
</script>

<template>
    <div
        :class="
            cn(
                'scrollbar-hidden rounded-xl border-2 border-gray-700 bg-card text-card-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] dark:shadow-[8px_8px_0px_0px_hsl(var(--shadow)/0.5)]',
                props.class,
            )
        "
    >
        <slot />
    </div>
</template>
