<template>
    <div
        class="pointer-events-none absolute top-0 left-0 right-0 lg:left-auto z-50 flex items-center justify-between lg:justify-end lg:gap-4 p-2 lg:p-4"
    >
        <div class="pointer-events-auto flex items-center gap-2">
            <slot name="left"></slot>
        </div>

        <div class="pointer-events-auto flex items-center gap-2 lg:gap-4">
            <slot name="header-actions"></slot>
            <slot name="right">
                <SharePopover />
                <DarkModeToggle
                    title="Toggle dark mode"
                    class="aspect-square w-8 hover:scale-105 hover:opacity-50"
                />
            </slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import SharePopover from "./SharePopover.vue";
import { DarkModeToggle } from "@components/custom/dark-mode-toggle";
</script>
