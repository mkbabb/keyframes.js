<template>
    <div
        class="pointer-events-none absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2"
        @mouseleave="onGroupMouseLeave"
    >
        <!-- Left side — mobile sidebar toggle slot -->
        <div class="pointer-events-auto shrink-0">
            <slot name="left"></slot>
        </div>

        <div
            class="pointer-events-auto flex items-center"
            @mouseenter="onRibbonMouseEnter"
        >
            <!-- Collapsible items — accordion width -->
            <div
                :class="[
                    'header-items-wrapper overflow-hidden flex items-center gap-2 lg:gap-4',
                    isVisible ? '' : 'header-collapsed',
                ]"
            >
                <slot name="items">
                    <SharePopover />
                    <DarkModeToggle
                        title="Toggle dark mode"
                        class="aspect-square w-8 hover:scale-105 hover:opacity-50"
                    />
                </slot>
            </div>

            <!-- Anchor — always visible, click to pin/unpin -->
            <div
                class="shrink-0"
                @click="onAnchorClick"
            >
                <slot name="anchor" :pinned="isPinned"></slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from "vue";
import SharePopover from "./SharePopover.vue";
import { DarkModeToggle } from "@components/custom/dark-mode-toggle";

const isExpanded = ref(false);
const isPinned = ref(false);

let hoverTimeout: ReturnType<typeof setTimeout> | undefined;

const isVisible = computed(() => isExpanded.value || isPinned.value);

function clearHoverTimeout() {
    if (hoverTimeout != null) {
        clearTimeout(hoverTimeout);
        hoverTimeout = undefined;
    }
}

function startHideTimeout() {
    clearHoverTimeout();
    hoverTimeout = setTimeout(() => {
        isExpanded.value = false;
    }, 2000);
}

function onRibbonMouseEnter() {
    clearHoverTimeout();
    isExpanded.value = true;
}

function onGroupMouseLeave() {
    if (!isPinned.value) {
        startHideTimeout();
    }
}

function onAnchorClick() {
    if (isPinned.value) {
        isPinned.value = false;
        startHideTimeout();
    } else {
        isPinned.value = true;
        isExpanded.value = true;
        clearHoverTimeout();
    }
}

onBeforeUnmount(() => {
    clearHoverTimeout();
});
</script>

<style scoped>
.header-items-wrapper {
    max-width: 500px;
    margin-right: 0.75rem;
    opacity: 1;
    transition:
        max-width 0.35s cubic-bezier(0.4, 0, 0.2, 1),
        margin-right 0.35s cubic-bezier(0.4, 0, 0.2, 1),
        opacity 0.25s ease-out;
    overflow: visible;
}
.header-collapsed {
    max-width: 0;
    margin-right: 0;
    opacity: 0;
    pointer-events: none;
    overflow: hidden;
}
</style>
