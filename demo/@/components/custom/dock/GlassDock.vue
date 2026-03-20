<script setup lang="ts">
import { watch, useTemplateRef, inject } from "vue";
import type { Ref } from "vue";
import { useDockState } from "@composables/useDockState";
import { useDockTransition } from "@composables/useDockTransition";

const props = withDefaults(
    defineProps<{
        collapseDelay?: number;
        startCollapsed?: boolean;
        fitContent?: boolean;
        fadeMs?: number;
    }>(),
    {
        collapseDelay: 1800,
        startCollapsed: true,
        fitContent: false,
        fadeMs: 60,
    },
);

const dockEl = useTemplateRef<HTMLElement>("dockEl");

const {
    expanded,
    isPinned,
    onMouseEnter,
    onMouseLeave,
    onFocusIn,
    onFocusOut,
    onClickCollapsed,
    keepOpen,
    release,
    expand,
    collapse,
} = useDockState({
    collapseDelay: props.collapseDelay,
    rootEl: dockEl,
});

const { visualExpanded, isTransitioning, onTransitionEnd } = useDockTransition({
    expanded,
    rootEl: dockEl,
    fadeMs: props.fadeMs,
});

// When inside an AnimationControlsGroup, drive its controls pane hover state
const controlsPaneHover = inject<Ref<boolean> | null>("controlsPaneHover", null);

watch(expanded, (isExpanded) => {
    if (controlsPaneHover) controlsPaneHover.value = isExpanded;
});

defineExpose({ expanded, isPinned, expand, collapse, keepOpen, release });
</script>

<template>
    <div
        ref="dockEl"
        class="glass-dock"
        :class="{ expanded, collapsed: !expanded, 'fit-content': fitContent }"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave($event)"
        @focusin="onFocusIn"
        @focusout="onFocusOut"
        @transitionend="onTransitionEnd"
    >
        <div class="dock-layers" :class="{ 'dock-transitioning': isTransitioning }">
            <div :class="['dock-layer dock-layer--full', { 'layer-active': visualExpanded }]" :inert="!expanded">
                <slot />
            </div>
            <div :class="['dock-layer dock-layer--summary', { 'layer-active': !visualExpanded }]" :inert="expanded" @click="onClickCollapsed">
                <slot name="collapsed" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.glass-dock {
    display: inline-flex;
    align-items: center;
    padding: 0.375rem 0.75rem;
    border-radius: var(--radius-pill);
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border: 1px solid var(--glass-border);
    box-shadow: var(--glass-shadow);
    white-space: nowrap;
    transition:
        width var(--duration-normal) var(--ease-dock),
        padding var(--duration-normal) var(--ease-dock),
        box-shadow var(--duration-normal) var(--ease-standard),
        transform var(--duration-normal) var(--ease-dock),
        background var(--duration-normal) var(--ease-standard),
        border-color var(--duration-normal) var(--ease-standard);
}

/* ── Collapsed: compact pill ── */
.glass-dock.collapsed {
    cursor: pointer;
    padding: 0.375rem 0.75rem;
    background: hsl(var(--card) / 0.92);
    border-color: hsl(var(--border) / 0.7);
    box-shadow:
        var(--shadow-sm),
        0 0 0 1px hsl(var(--foreground) / 0.06);
}

.glass-dock.collapsed:hover {
    background: hsl(var(--card) / 0.96);
    border-color: hsl(var(--border));
    box-shadow:
        0 4px 20px hsl(var(--foreground) / 0.18),
        0 0 0 1px hsl(var(--foreground) / 0.1);
    transform: scale(1.03);
}

/* ── Layer stacking via grid ── */
.dock-layers {
    display: grid;
    transition: opacity 60ms var(--ease-standard);
}

.dock-layers.dock-transitioning {
    opacity: 0;
}

.dock-layer {
    grid-area: 1 / 1;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-height: 2rem;
    white-space: nowrap;
}

.dock-layer.layer-active {
    pointer-events: auto;
}

.dock-layer:not(.layer-active) {
    pointer-events: none;
    position: absolute;
    visibility: hidden;
}
</style>
