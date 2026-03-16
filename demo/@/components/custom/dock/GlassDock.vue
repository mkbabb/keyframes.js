<script setup lang="ts">
import { watch, nextTick, useTemplateRef, inject } from "vue";
import type { Ref } from "vue";
import { useDockState } from "@composables/useDockState";

const props = withDefaults(
    defineProps<{
        collapseDelay?: number;
        startCollapsed?: boolean;
        fitContent?: boolean;
    }>(),
    {
        collapseDelay: 1800,
        startCollapsed: true,
        fitContent: false,
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

// When inside an AnimationControlsGroup, drive its controls pane hover state
const controlsPaneHover = inject<Ref<boolean> | null>("controlsPaneHover", null);

watch(expanded, (isExpanded) => {
    if (controlsPaneHover) controlsPaneHover.value = isExpanded;
});

// Animate width between states by measuring natural sizes
watch(expanded, () => {
    const el = dockEl.value;
    if (!el) return;

    // Capture current rendered width
    const from = el.getBoundingClientRect().width;

    // Let DOM update with new active layer
    nextTick(() => {
        // Remove explicit width to measure natural size of new state
        el.style.width = "";
        const to = el.getBoundingClientRect().width;

        // Set to old width, then animate to new
        el.style.width = `${from}px`;
        requestAnimationFrame(() => {
            el.style.width = `${to}px`;
        });
    });
});

function onTransitionEnd(e: TransitionEvent) {
    if (e.propertyName === "width" && e.target === dockEl.value) {
        // Clear explicit width so element returns to natural sizing
        dockEl.value!.style.width = "";
    }
}

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
        <div class="dock-layers">
            <div :class="['dock-layer dock-layer--full', { 'layer-active': expanded }]" :inert="!expanded">
                <slot />
            </div>
            <div :class="['dock-layer dock-layer--summary', { 'layer-active': !expanded }]" :inert="expanded" @click="onClickCollapsed">
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
    overflow: visible;
    white-space: nowrap;
    transition:
        width 0.4s var(--ease-spring),
        padding 0.4s var(--ease-spring),
        box-shadow var(--duration-normal) var(--ease-standard),
        transform 0.4s var(--ease-spring),
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
}

.dock-layer {
    grid-area: 1 / 1;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-height: 2rem;
    white-space: nowrap;
    transition: opacity var(--duration-normal) var(--ease-standard);
}

.dock-layer.layer-active {
    opacity: 1;
    pointer-events: auto;
}

.dock-layer:not(.layer-active) {
    opacity: 0;
    pointer-events: none;
    position: absolute;
    visibility: hidden;
}
</style>
