<template>
    <!-- Q.WC3 S2 — the PHONE scene-switcher: a NATIVE CSS scroll-snap carousel
         (NOT a shrunk 3D ring). The phone-correct gesture is native swipe/snap,
         so the platform owns the gesture + the snap; the demo owns only the cards
         + the scroll-driven falloff `@keyframes`. The centered card scales up +
         brightens; the flanks dim — driven by a per-card scroll `view-timeline`
         (on the COMPOSITOR, zero per-frame Vue recompute). A snapped card → tap →
         the SAME `runSceneSwitch`/scene-switch commit as the dock (the phone VIEW
         of one switcher, not a parallel feature). Rendered only on the phone-narrow
         breakpoint (the desktop keeps the dock Select). -->
    <nav
        ref="scrollerEl"
        class="scene-carousel"
        aria-label="Scenes"
        @scroll="onScroll"
    >
        <button
            v-for="scene in scenes"
            :key="scene.id"
            ref="cardEls"
            type="button"
            class="scene-carousel-card"
            :class="{ 'scene-carousel-card--active': scene.id === activeSceneId }"
            :aria-current="scene.id === activeSceneId ? 'page' : undefined"
            :data-scene-id="scene.id"
            @click="onPick(scene.id)"
        >
            <span class="scene-carousel-icon" aria-hidden="true">
                <component :is="scene.icon" class="icon-lg" />
            </span>
            <span class="scene-carousel-label">{{ scene.label }}</span>
        </button>
    </nav>
</template>

<script setup lang="ts">
import { useTemplateRef } from "vue";

import { scenes } from "../../../app/scenes";
import { useScrollSnapScene } from "@composables/useScrollSnapScene";

const props = defineProps<{
    /** The currently-active scene id (drives the `--active` highlight). */
    activeSceneId: string;
}>();

const emit = defineEmits<{
    /** A snapped card → tap → switch scene via the host's `runSceneSwitch`. */
    (e: "pick", id: string): void;
}>();

const scrollerEl = useTemplateRef<HTMLElement>("scrollerEl");
const cardEls = useTemplateRef<HTMLElement[]>("cardEls");

// The composable owns the snapped-card tracking (a scroll-snap-events / nearest-
// center read) — the demo owns only the cards + the falloff @keyframes (KISS).
const { onScroll, scrollToScene } = useScrollSnapScene({
    scroller: scrollerEl,
    cards: cardEls,
    getActiveId: () => props.activeSceneId,
});

const onPick = (id: string) => {
    scrollToScene(id);
    emit("pick", id);
};

defineExpose({ scrollToScene });
</script>

<style scoped>
/* The scroller — native horizontal scroll-snap. The platform owns the swipe +
   the snap; the demo owns the cards. */
.scene-carousel {
    display: flex;
    gap: 0.75rem;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    /* The first/last card snaps to CENTER → pad so the edge cards can reach the
       middle of the viewport. */
    padding-inline: calc(50cqw - 4rem);
    padding-block: 0.5rem;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    container-type: inline-size;
}
.scene-carousel::-webkit-scrollbar {
    display: none;
}

.scene-carousel-card {
    flex: 0 0 auto;
    scroll-snap-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    inline-size: 8rem;
    block-size: 8rem;
    padding: 1rem;
    border-radius: var(--radius-card, 1rem);
    border: 1px solid var(--border);
    background: color-mix(in srgb, var(--card, var(--background)) 92%, transparent);
    color: var(--foreground);
    cursor: pointer;
    /* The STATIC fallback (no scroll-driven support): all cards visible at a
       uniform scale — still a usable phone carousel. */
}

.scene-carousel-card--active {
    border-color: var(--ball-tone, var(--color-progress, var(--primary)));
    box-shadow: 0 0 0 1px var(--ball-tone, var(--color-progress, var(--primary)));
}

.scene-carousel-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    inline-size: 2.5rem;
    block-size: 2.5rem;
}

.scene-carousel-label {
    font-family: var(--font-mono);
    font-size: var(--type-admin-label, 0.75rem);
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

/* The scroll-driven falloff — the centered card scales/brightens, the flanks dim.
   MANDATORY modern-web floor: gated on `@supports ((animation-timeline: view())
   and (animation-range: entry))` (the `animation-range` arm filters partial
   support); the static fallback above is the progressive-enhancement floor.
   COMPOSITOR-only properties (transform/opacity/filter) — zero layout. */
@supports ((animation-timeline: view()) and (animation-range: entry)) {
    @keyframes kf-carousel-falloff {
        0% {
            scale: 0.82;
            opacity: 0.5;
            filter: brightness(0.8);
        }
        50% {
            scale: 1;
            opacity: 1;
            filter: brightness(1.05);
        }
        100% {
            scale: 0.82;
            opacity: 0.5;
            filter: brightness(0.8);
        }
    }
    .scene-carousel-card {
        animation: kf-carousel-falloff linear both;
        /* declare the timeline + range AFTER the shorthand so it is not reset. */
        view-timeline: --card inline;
        animation-timeline: --card;
    }
}

/* PRM — disable the scale/brightness falloff (the cards stay a plain snap
   scroller, still usable). */
@media (prefers-reduced-motion: reduce) {
    .scene-carousel {
        scroll-behavior: auto;
    }
    .scene-carousel-card {
        animation: none;
        scale: 1;
        opacity: 1;
        filter: none;
    }
}
</style>
