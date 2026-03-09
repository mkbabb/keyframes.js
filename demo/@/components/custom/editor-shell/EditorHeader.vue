<template>
    <div
        class="pointer-events-none absolute top-0 left-0 right-0 lg:left-auto z-50 flex items-center justify-between lg:justify-end lg:gap-4 p-2 lg:p-4"
    >
        <!-- Left section: always visible -->
        <div class="pointer-events-auto flex items-center gap-2">
            <slot name="left"></slot>
        </div>

        <div class="pointer-events-auto flex items-center gap-0">
            <!-- Collapsible right items — accordion width -->
            <div :class="['header-items-wrapper overflow-hidden flex items-center gap-2 lg:gap-4', isCollapsed ? 'header-collapsed' : '']">
                <slot name="header-actions"></slot>
                <slot name="right">
                    <SharePopover />
                    <DarkModeToggle
                        title="Toggle dark mode"
                        class="aspect-square w-8 hover:scale-105 hover:opacity-50"
                    />
                </slot>
            </div>

            <!-- Three-dot toggle (desktop only) — always in same position -->
            <button
                @click="isCollapsed = !isCollapsed"
                class="hidden lg:flex items-center justify-center p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 cursor-pointer transition-colors shrink-0"
                :title="isCollapsed ? 'Show header' : 'Collapse header'"
            >
                <EllipsisVertical class="w-4 h-4" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { EllipsisVertical } from "lucide-vue-next";
import SharePopover from "./SharePopover.vue";
import { DarkModeToggle } from "@components/custom/dark-mode-toggle";

const isCollapsed = ref(false);
</script>

<style scoped>
@media (min-width: 1024px) {
    .header-items-wrapper {
        max-width: 500px;
        opacity: 1;
        transition: max-width 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                    opacity 0.25s ease-out;
    }
    .header-collapsed {
        max-width: 0;
        opacity: 0;
        pointer-events: none;
    }
}
</style>
