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
                'scrollbar-hidden rounded-xl border-2 border-border bg-card text-card-foreground shadow-[var(--shadow-card)]',
                props.class,
            )
        "
    >
        <slot />
    </div>
</template>
