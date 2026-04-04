<template>
    <div
        :class="[
            'fixed z-dock pointer-events-none w-fit flex items-center px-4 pt-4 pb-2',
            position === 'left' ? 'top-0 left-0' : 'top-0 right-0',
        ]"
        @mouseleave="onGroupMouseLeave"
    >
        <!-- Left extra slot (e.g. ppmycota logo in keyframes.js) -->
        <div v-if="$slots.left" class="pointer-events-auto shrink-0 mr-2">
            <slot name="left"></slot>
        </div>

        <div
            class="pointer-events-auto flex items-center h-6"
            @mouseenter="onRibbonMouseEnter"
        >
            <!-- When position=left: anchor first, then items expand right -->
            <!-- When position=right: items first (expand left), then anchor -->
            <template v-if="position === 'right'">
                <div
                    :class="[
                        'header-items-wrapper header-items-right flex items-center gap-3',
                        isVisible ? '' : 'header-collapsed-right',
                    ]"
                >
                    <slot name="items"></slot>
                </div>
            </template>

            <div class="shrink-0" @click="onAnchorClick">
                <slot name="anchor" :pinned="isPinned" :toggled="isToggled"></slot>
            </div>

            <template v-if="position === 'left'">
                <div
                    :class="[
                        'header-items-wrapper header-items-left flex items-center gap-3',
                        isVisible ? '' : 'header-collapsed-left',
                    ]"
                >
                    <slot name="items"></slot>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from "vue";

const props = withDefaults(
    defineProps<{
        position?: "left" | "right";
        hideTimeoutMs?: number;
    }>(),
    {
        position: "left",
        hideTimeoutMs: 2000,
    },
);

const isExpanded = ref(false);
const isPinned = ref(false);
const isToggled = ref(false);
const isMouseOver = ref(false);

let hoverTimeout: ReturnType<typeof setTimeout> | undefined;

const isVisible = computed(() => isExpanded.value || isPinned.value);

function clearHoverTimeout() {
    if (hoverTimeout != null) {
        clearTimeout(hoverTimeout);
        hoverTimeout = undefined;
    }
}

function startHideTimeout() {
    // Don't schedule collapse while mouse is still over the ribbon
    if (isMouseOver.value) return;
    clearHoverTimeout();
    hoverTimeout = setTimeout(() => {
        isExpanded.value = false;
    }, props.hideTimeoutMs);
}

function onRibbonMouseEnter() {
    isMouseOver.value = true;
    clearHoverTimeout();
    isExpanded.value = true;
}

function onGroupMouseLeave() {
    isMouseOver.value = false;
    if (!isPinned.value) {
        startHideTimeout();
    }
}

function onAnchorClick() {
    if (isPinned.value) {
        isPinned.value = false;
        isToggled.value = false;
        startHideTimeout();
    } else {
        isPinned.value = true;
        isExpanded.value = true;
        isToggled.value = true;
        clearHoverTimeout();
    }
}

onBeforeUnmount(() => {
    clearHoverTimeout();
});

defineExpose({ isPinned, isExpanded, isVisible, isToggled });
</script>

<style scoped>
.header-items-wrapper {
    --header-max-width: 500px;
    max-width: var(--header-max-width);
    opacity: 1;
    overflow: visible;
    transition:
        max-width var(--duration-slow) var(--ease-standard),
        margin var(--duration-slow) var(--ease-standard),
        opacity var(--duration-normal) var(--ease-decelerate);
}

.header-items-left {
    margin-left: 0.75rem;
}
.header-items-right {
    margin-right: 0.75rem;
}

:is(.header-collapsed-left, .header-collapsed-right) {
    max-width: 0;
    opacity: 0;
    pointer-events: none;
    overflow: hidden;
}
.header-collapsed-left {
    margin-left: 0;
}
.header-collapsed-right {
    margin-right: 0;
}
</style>
