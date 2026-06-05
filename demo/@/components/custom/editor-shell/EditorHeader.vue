<template>
    <div
        class="pointer-events-none absolute top-0 left-0 right-0 z-dock flex items-center justify-between px-4 py-2"
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
                        class="aspect-square w-8 scale-on-hover hover:opacity-50"
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
import { ref, computed } from "vue";
import { useTimeoutFn } from "@vueuse/core";
import SharePopover from "./SharePopover.vue";
import { DarkModeToggle } from "@mkbabb/glass-ui/controls";

const isExpanded = ref(false);
const isPinned = ref(false);

const isVisible = computed(() => isExpanded.value || isPinned.value);

// Hover-out collapse timer (W1.S4) — vueuse owns the handle + auto-cleanup on
// unmount (tryOnScopeDispose), replacing the hand-rolled setTimeout/clearTimeout
// bookkeeping. `immediate: false` so it only runs when started.
const { start: startHideTimeout, stop: clearHoverTimeout } = useTimeoutFn(
    () => {
        isExpanded.value = false;
    },
    2000,
    { immediate: false },
);

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
</script>

<style scoped>
.header-items-wrapper {
    max-width: 500px;
    margin-right: 0.75rem;
    opacity: 1;
    transition:
        max-width var(--duration-slow) var(--ease-standard),
        margin-right var(--duration-slow) var(--ease-standard),
        opacity var(--duration-normal) var(--ease-decelerate);
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
