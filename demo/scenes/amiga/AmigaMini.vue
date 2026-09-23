<script setup lang="ts">
/**
 * KF.W13U.d2 (OA-32) — the Amiga scene's dock icon: a bounded miniature of the
 * stage, painted from the SAME `AnimationGroup` the scene plays
 * (`useAmigaDemo()` — the linear spin, the wall-to-wall X sweep and the
 * per-segment gravity bounce, driven by keyframes.js). The stage's stacking is
 * kept in paint order: the room grid, then the floor shadow, then the ball.
 *
 * Only the pose is miniaturised: the authored arc (x ±WALL_X, y FLOOR_Y↔APEX_Y)
 * maps into the 20-unit box at `UNIT` px per world unit, so the ball moves a
 * few pixels and never leaves the box (the root also contains its paint).
 * `live` plays the group (the dock's chosen scene); otherwise the icon rests
 * at the home pose. Reduced motion: the group's own gate snaps to rest.
 */
import { onBeforeUnmount, shallowRef, useId, watch } from "vue";
import { FLOOR_Y, useAmigaDemo, type AmigaPose } from "./useAmigaDemo";

const { live = false } = defineProps<{ live?: boolean }>();

const VIEW = 20;
const UNIT = 0.9; // px per world unit — the miniature's amplitude
const R = 4.5; // the ball's drawn radius
const FLOOR = 17.5; // the floor line (svg y)
const TILT_DEG = 16; // the Boing-Ball's 0.28-rad axis tilt, in the checker

// The checker: 4 rows × 6 columns of 3-unit cells, alternating — one cell of
// travel is a full checker phase, so the spin's ±π maps onto ±3 units.
const CELLS = Array.from({ length: 24 }, (_, i) => ({ r: Math.floor(i / 6), c: i % 6 }))
    .filter(({ r, c }) => (r + c) % 2 === 0)
    .map(({ r, c }) => ({ x: -9 + c * 3, y: -6 + r * 3 }));
const clipId = `amiga-mini-${useId()}`;

const frame = shallowRef({ x: VIEW / 2, y: FLOOR - R, spin: 0, lift: 0 });

const paint = (pose: Readonly<AmigaPose>) => {
    const lift = (pose.py - FLOOR_Y) * UNIT; // height above the floor slam
    frame.value = {
        x: VIEW / 2 + pose.px * UNIT,
        y: FLOOR - R - lift,
        spin: pose.spin,
        lift,
    };
};

const { animationGroup, pose } = useAmigaDemo(paint);
paint(pose);

watch(
    () => live,
    (on) => {
        if (on) void animationGroup.play();
        else animationGroup.stop();
    },
    { immediate: true },
);
onBeforeUnmount(() => animationGroup.stop());
</script>

<template>
    <span class="scene-mini" :data-live="live ? '' : undefined">
        <svg :viewBox="`0 0 ${VIEW} ${VIEW}`" aria-hidden="true">
            <defs>
                <clipPath :id="clipId">
                    <circle :cx="frame.x" :cy="frame.y" :r="R" />
                </clipPath>
            </defs>
            <g data-layer="grid" stroke="#b9b9c6" stroke-width="0.6">
                <path d="M2 2V18M6 2V18M10 2V18M14 2V18M18 2V18M2 2H18M2 6H18M2 10H18M2 14H18M2 18H18" />
            </g>
            <ellipse
                data-layer="shadow"
                :cx="frame.x + 1.2"
                :cy="FLOOR"
                :rx="R * (1 - frame.lift / 20)"
                :ry="1.1"
                fill="rgba(0,0,0,0.28)"
            />
            <g data-layer="ball" :clip-path="`url(#${clipId})`">
                <circle :cx="frame.x" :cy="frame.y" :r="R" fill="#ffffff" />
                <g
                    fill="var(--amiga-red, #e21b1b)"
                    :transform="`translate(${frame.x} ${frame.y}) rotate(${TILT_DEG}) translate(${(frame.spin / Math.PI) * 3} 0)`"
                >
                    <rect v-for="(cell, i) in CELLS" :key="i" :x="cell.x" :y="cell.y" width="3" height="3" />
                </g>
            </g>
        </svg>
    </span>
</template>

<style scoped>
.scene-mini {
    display: inline-block;
    overflow: hidden;
    contain: strict;
}
.scene-mini > svg {
    display: block;
    width: 100%;
    height: 100%;
}
</style>
