<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted, useTemplateRef, provide, inject } from "vue";
import type { Ref } from "vue";

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

const expanded = ref(!props.startCollapsed);
let collapseTimer: ReturnType<typeof setTimeout> | null = null;
let ignoreEvents = true;

const dockEl = useTemplateRef<HTMLElement>("dockEl");

// Child components (e.g. DockPopover, Select) can hold the dock open.
// Provided via inject so any descendant in the slot tree can use it.
let keepOpenCount = 0;

function keepOpen() {
    keepOpenCount++;
    clearTimer();
}

function release() {
    keepOpenCount = Math.max(0, keepOpenCount - 1);
    if (keepOpenCount === 0) scheduleCollapse();
}

provide("dockKeepOpen", keepOpen);
provide("dockRelease", release);

// When inside an AnimationControlsGroup, drive its controls pane hover state
const controlsPaneHover = inject<Ref<boolean> | null>("controlsPaneHover", null);

onMounted(() => {
    setTimeout(() => {
        ignoreEvents = false;
    }, 600);
});

function clearTimer() {
    if (collapseTimer) {
        clearTimeout(collapseTimer);
        collapseTimer = null;
    }
}

function scheduleCollapse() {
    if (keepOpenCount > 0) return;
    clearTimer();
    collapseTimer = setTimeout(() => {
        expanded.value = false;
    }, props.collapseDelay);
}

function onEnter() {
    if (ignoreEvents) return;
    clearTimer();
    expanded.value = true;
    if (controlsPaneHover) controlsPaneHover.value = true;
}

function onLeave(e: MouseEvent) {
    if (controlsPaneHover) controlsPaneHover.value = false;
    // If mouse moved to a descendant (e.g. absolutely-positioned child
    // that extends beyond dock bounds), don't collapse
    const root = dockEl.value;
    if (root && e.relatedTarget instanceof Node && root.contains(e.relatedTarget)) return;
    // If a child component is holding the dock open (e.g. Select portal), skip
    if (keepOpenCount > 0) return;
    scheduleCollapse();
}

function onFocusOut(e: FocusEvent) {
    const root = e.currentTarget as HTMLElement;
    if (e.relatedTarget && root.contains(e.relatedTarget as Node)) return;
    if (keepOpenCount > 0) return;
    scheduleCollapse();
}

function onClickSummary() {
    clearTimer();
    expanded.value = true;
    scheduleCollapse();
}

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

// Click-away collapse: when expanded, a pointerdown outside the dock collapses it
function onPointerDownOutside(e: PointerEvent) {
    const root = dockEl.value;
    if (!root || root.contains(e.target as Node)) return;
    if (keepOpenCount > 0) return;
    clearTimer();
    expanded.value = false;
}

let removeClickAway: (() => void) | null = null;

watch(expanded, (isExpanded) => {
    if (isExpanded) {
        // Use capture phase so we get the event before anything else
        document.addEventListener("pointerdown", onPointerDownOutside, true);
        removeClickAway = () => {
            document.removeEventListener("pointerdown", onPointerDownOutside, true);
            removeClickAway = null;
        };
    } else {
        removeClickAway?.();
    }
});

defineExpose({ expanded, expand: onEnter, collapse: () => { expanded.value = false; }, keepOpen, release });
onUnmounted(() => {
    clearTimer();
    removeClickAway?.();
});
</script>

<template>
    <div
        ref="dockEl"
        class="glass-dock"
        :class="{ expanded, collapsed: !expanded, 'fit-content': fitContent }"
        @mouseenter="onEnter"
        @mouseleave="onLeave"
        @focusin="onEnter"
        @focusout="onFocusOut"
        @transitionend="onTransitionEnd"
    >
        <div class="dock-layers">
            <div :class="['dock-layer dock-layer--full', { 'layer-active': expanded }]">
                <slot />
            </div>
            <div :class="['dock-layer dock-layer--summary', { 'layer-active': !expanded }]" @click="onClickSummary">
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
