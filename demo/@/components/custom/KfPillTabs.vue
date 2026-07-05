<template>
    <!-- R.W6 / DM-5 CONTINGENCY KILL — a kf-internal, ARIA-compliant pill tab
         strip. It replaces `<SegmentedTabs variant="pill" :aria-orientation=
         undefined-suppress at the two band-aid sites (SpringSidebar +
         AnimationControls): glass-ui 4.0.1's SegmentedTabs emits the orientation
         attribute UNCONDITIONALLY on its `role=group` pill variant (a WCAG breach
         on a non-composite container), so the demo carried an undefined-binding
         suppress that P-invariant-28 forbids carrying a 9th tranche. This strip is
         ARIA-correct BY CONSTRUCTION — a `role=tablist` of `role=tab` buttons
         (a panel switcher, the right pattern), where `aria-orientation` is a
         VALID, complete contract that needs no suppress. No dependency on the
         glass-ui collapse-crossfade or its aria guard. -->
    <div
        role="tablist"
        :aria-orientation="orientation"
        :aria-label="ariaLabel"
        :data-glassui-gap="gap.id"
        class="kf-pill-tabs glass-wash"
    >
        <button
            v-for="opt in options"
            :key="opt.value"
            type="button"
            role="tab"
            :aria-selected="opt.value === modelValue"
            :tabindex="opt.value === rovingValue ? 0 : -1"
            :disabled="opt.disabled"
            :data-value="opt.value"
            class="kf-pill-tab"
            :data-state="opt.value === modelValue ? 'active' : 'inactive'"
            @click="select(opt.value)"
            @keydown="onKeydown($event, opt.value)"
        >
            {{ opt.label }}
        </button>
    </div>
</template>

<script setup lang="ts">
// The roving-tabindex keyboard core + the canonical option shape live in the
// colocated composable (S.B7 S6) so both are unit-tested via a representative
// tablist host — the useToolbarKeyboard precedent. KfPillTabOption is re-exported
// so `import type { KfPillTabOption } from ".../KfPillTabs.vue"` keeps resolving.
import { useKfPillTabs } from "./useKfPillTabs";
import type { KfPillTabOption } from "./useKfPillTabs";
// GLASSUI-GAP: segmentedTabsAriaOrientation — this kf-internal pill strip is a
// band-aid for glass-ui's SegmentedTabs pill emitting aria-orientation on
// role=group (BG-1) + coupling material to role (BG-3). It dies on the re-pin;
// proof:glass-ui-gap-tripwire flips RED the instant glassCaps.ariaGuard is
// satisfied while this file survives. See demo/glass-ui-gaps.ts.
import { glassUiGap } from "../../../glass-ui-gaps";
const gap = glassUiGap("segmentedTabsAriaOrientation");

const {
    options,
    modelValue,
    orientation = "horizontal",
    ariaLabel,
} = defineProps<{
    options: KfPillTabOption[];
    modelValue: string;
    /** Valid on `role=tablist` (default horizontal) — the complete WCAG contract. */
    orientation?: "horizontal" | "vertical";
    ariaLabel?: string;
}>();

const emit = defineEmits<{ "update:modelValue": [value: string] }>();

const select = (value: string) => {
    if (value !== modelValue) emit("update:modelValue", value);
};

// Roving-tabindex arrow/Home/End navigation with FOCUS movement (a12 F1 fix).
const { rovingValue, onKeydown } = useKfPillTabs({
    options: () => options,
    orientation: () => orientation,
    modelValue: () => modelValue,
    select: (value) => emit("update:modelValue", value),
});
</script>

<style scoped>
/* The glass-track pill strip — the legible chip register the user asked for
   ("pills if tabs at all"), the same look the retired SegmentedTabs pill carried,
   sourced from design tokens (no re-authored colours). */
.kf-pill-tabs {
    display: inline-flex;
    align-items: center;
    gap: 0.125rem;
    border-radius: var(--radius-panel, var(--radius-lg));
    padding: 0.125rem;
}

.kf-pill-tab {
    flex-shrink: 0;
    background: transparent;
    border: 0;
    cursor: pointer;
    padding: 0.25rem 0.75rem;
    border-radius: var(--radius-lg);
    font-family: var(--font-display);
    font-size: var(--type-prose, 1rem);
    letter-spacing: 0.02em;
    color: var(--muted-foreground);
    /* Narrow transition (no `all`) — only the activation channels change. */
    transition:
        color var(--duration-fast) var(--ease-standard),
        background var(--duration-fast) var(--ease-standard),
        font-weight var(--duration-fast) var(--ease-standard);
}
.kf-pill-tab:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
.kf-pill-tab[data-state="inactive"]:hover {
    color: var(--foreground);
    background: color-mix(in srgb, var(--foreground) 5%, transparent);
}
.kf-pill-tab[data-state="active"] {
    color: var(--foreground);
    font-weight: 600;
    background: color-mix(in srgb, var(--foreground) 8%, transparent);
}
.kf-pill-tab:focus-visible {
    outline: 2px solid var(--color-progress, var(--accent-red, currentColor));
    outline-offset: 1px;
}
</style>
