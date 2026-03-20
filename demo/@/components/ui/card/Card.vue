<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@utils/utils";

const props = defineProps<{
    class?: HTMLAttributes["class"];
    /** When true, renders as a plain structural wrapper with no border, shadow, or background.
     *  Used when a Card is nested inside another card or serves as a layout container. */
    plain?: boolean;
}>();
</script>

<template>
    <div
        :class="
            cn(
                plain
                    ? 'scrollbar-hidden rounded-xl'
                    : 'scrollbar-hidden rounded-xl border-2 border-border bg-card text-card-foreground shadow-[var(--shadow-card)]',
                props.class,
            )
        "
    >
        <slot />
    </div>
</template>
