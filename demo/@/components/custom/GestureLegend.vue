<template>
    <!-- S.G3 S1 — the drafting-stamp gesture legend. ONE per scene: a small,
         corner-set rubber-stamp that NAMES the scene's otherwise-sealed gestures
         (the hidden-affordance systemic, fold row 67). Each row is the census
         TELL for its manifest entry (`data-gesture-tell="scene:id"`) — the
         browser-actuated proof:gesture-manifest gate asserts each tell exists +
         is visible on fresh entry, so a documented-but-unshown gesture cannot
         pass. Fades after first use (`used`) — a discovered delight, not a
         permanent chrome band (proportion, per the spec). -->
    <aside
        class="gesture-legend text-mono-caption"
        :class="{ 'gesture-legend--used': used }"
        :aria-label="`${scene} gesture hints`"
    >
        <ul class="gesture-legend__list">
            <li
                v-for="item in items"
                :key="item.id"
                class="gesture-legend__row"
                :data-gesture-tell="`${scene}:${item.id}`"
            >
                <span class="gesture-legend__glyph" aria-hidden="true">{{ item.glyph }}</span>
                <span class="gesture-legend__label">{{ item.label }}</span>
            </li>
        </ul>
    </aside>
</template>

<script setup lang="ts">
/**
 * GestureLegend — the shared drafting-stamp gesture legend (S.G3 S1).
 *
 * `items` are the scene's gestures ({ id, glyph, label }); each renders a stamp
 * row carrying `data-gesture-tell="<scene>:<id>"` — the stable contract the
 * gesture-manifest census points its `tell` at. `used` fades the whole stamp once
 * the scene reports its first gesture fired (fade-after-first-use); the element
 * stays in the DOM so the census contract is never structurally broken, but it
 * recedes so the stage is uncluttered after discovery.
 */
export interface GestureLegendItem {
    /** The gesture id — pairs with the manifest entry (`scene:id`). */
    id: string;
    /** A tiny glyph cue (an arrow, a double-dot, a hand) — decorative. */
    glyph: string;
    /** The human legend text ("double-tap: derby", "drag: re-seat"). */
    label: string;
}

defineProps<{
    /** The scene id (spring / cube / amiga / …) — namespaces each tell. */
    scene: string;
    /** The scene's gesture rows. */
    items: GestureLegendItem[];
    /** Fade the stamp once the scene's first gesture has fired. */
    used?: boolean;
}>();
</script>

<style scoped>
/* The stamp: a small, corner-set drafting mark. Muted mono micro-caption inside a
   thin dashed rule — the "rubber stamp" proportion (never a chrome bar). It sits
   in the stage's top-left, pointer-transparent so it never eats a gesture. */
.gesture-legend {
    position: absolute;
    top: 0.75rem;
    left: 0.75rem;
    z-index: var(--z-content);
    pointer-events: none;
    padding: 0.3rem 0.5rem;
    border: 1px dashed color-mix(in srgb, var(--muted-foreground) 42%, transparent);
    border-radius: var(--radius-sm, 0.375rem);
    background: color-mix(in srgb, var(--background) 62%, transparent);
    backdrop-filter: blur(2px);
    color: var(--muted-foreground);
    max-width: min(72cqi, 18rem);
    /* Fade-after-first-use (PRM-guarded below). */
    transition: opacity var(--duration-slow, 420ms) var(--ease-out, ease-out);
    opacity: 0.9;
}

.gesture-legend--used {
    opacity: 0;
}

.gesture-legend__list {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    margin: 0;
    padding: 0;
    list-style: none;
}

.gesture-legend__row {
    display: flex;
    align-items: baseline;
    gap: 0.4rem;
    line-height: 1.25;
    white-space: nowrap;
}

.gesture-legend__glyph {
    flex: none;
    font-size: 0.85em;
    opacity: 0.8;
    color: color-mix(in srgb, var(--color-progress) 60%, var(--muted-foreground));
}

.gesture-legend__label {
    letter-spacing: 0.01em;
}

@media (max-width: 640px) {
    .gesture-legend {
        top: 0.5rem;
        left: 0.5rem;
        padding: 0.25rem 0.4rem;
        font-size: var(--type-micro, 0.6875rem);
    }
}

@media (prefers-reduced-motion: reduce) {
    .gesture-legend {
        /* Snap — no fade animation (the stamp is either shown or not). */
        transition: none;
    }
}
</style>
