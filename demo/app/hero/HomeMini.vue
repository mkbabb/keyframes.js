<script setup lang="ts">
/**
 * Home's dock icon: a house.
 *
 * FIFTY-FOURTH (owner, 23 Nov 2026: "home should be a home icon"). Home wore
 * the hero's three-dot ellipsis (X.KF.W13X.esc2 · ESC-dock-3), which read as
 * "more", not as a place. It is now the shared map's Home glyph (the house,
 * the same meaning on every app), drawn the way the scene icons beside it are:
 * one flat fill in the demo's violet (`--color-progress`, the Easing and
 * Spring miniatures' ink), no outline glyph, no gloss. The doorway is cut out
 * of the fill, so the plate behind it shows through in either theme.
 *
 * Home is a place, not an animation, so the house does not play: `live` (the
 * dock's chosen scene) is accepted like every miniature's and changes nothing.
 */
defineProps<{ live?: boolean }>();

/** A house on a 24-unit square: the roof's eaves overhang the walls, the
 *  doorway is a notch in the floor line. One closed path, its corners rounded
 *  by a stroke of the same ink. */
const HOUSE =
    "M12 3.2 L21 10.6 L18.8 10.6 L18.8 20.4 L14.6 20.4 L14.6 15.4 " +
    "Q14.6 13.2 12 13.2 Q9.4 13.2 9.4 15.4 L9.4 20.4 L5.2 20.4 L5.2 10.6 L3 10.6 Z";
</script>

<template>
    <span class="scene-mini" data-layer="house">
        <svg class="house" viewBox="0 0 24 24" aria-hidden="true">
            <path :d="HOUSE" />
        </svg>
    </span>
</template>

<style scoped>
.scene-mini {
    position: relative;
    display: inline-block;
    overflow: hidden;
    contain: strict;
}
.house {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
}
.house path {
    fill: var(--color-progress, currentColor);
    stroke: var(--color-progress, currentColor);
    stroke-width: 1.4;
    stroke-linejoin: round;
}
</style>
