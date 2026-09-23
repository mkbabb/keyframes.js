<script setup lang="ts">
/**
 * KF.W13U.d2 (OA-32) — the Square scene's dock icon: a bounded miniature of
 * the diamond tour, played by keyframes.js from the scene's OWN tour data
 * (`SQUARE_TOUR_OPTIONS` + `squareTourKeyframes`, the same pair
 * `useSquareDemo` builds its Play animation from): the corners, the full turn,
 * the corner swell and the colour sweep. Stacking as on the stage: the tour's
 * field under the subject.
 *
 * The tour is authored in px at the desktop envelope; the stage is scaled by
 * `SCALE`, so the ±90px corners become a few pixels and the root clips and
 * contains its paint. `live` plays (the dock's chosen scene); otherwise the
 * icon rests at the tour's start. Reduced motion: the engine's gate snaps.
 */
import { markRaw, onBeforeUnmount, onMounted, useTemplateRef, watch } from "vue";
import type { Vars } from "@mkbabb/keyframes.js";
import { kfEngine } from "@kf-engine";
import { SQUARE_TOUR_OPTIONS, TOUR_CORNER, squareTourKeyframes } from "./squareMotion";

const { live = false } = defineProps<{ live?: boolean }>();

const SIDE = 120; // the authored subject, px
const REGION = 2 * (TOUR_CORNER + SIDE * 0.75); // the corners + the turning subject's reach
const SCALE = 20 / REGION;

interface TourVars extends Vars {
    transform?: { x?: unknown; y?: unknown; rotate?: unknown; a?: { b?: { c?: { d?: unknown } } } };
    backgroundColor?: unknown;
}
const n = (v: unknown, fallback: number) => {
    const parsed = typeof v === "number" ? v : parseFloat(String(v));
    return Number.isFinite(parsed) ? parsed : fallback;
};

const boxEl = useTemplateRef<HTMLElement>("boxEl");

const paint = (vars: TourVars) => {
    const el = boxEl.value;
    if (!el) return;
    const t = vars.transform;
    const d = t?.a?.b?.c?.d;
    const scale = typeof d === "string" && d.trim().endsWith("%") ? n(d, 100) / 100 : n(d, 1);
    el.style.transform = `translate(${n(t?.x, 0)}px, ${n(t?.y, 0)}px) rotate(${n(t?.rotate, 0)}deg) scale(${scale})`;
    if (vars.backgroundColor != null) el.style.backgroundColor = String(vars.backgroundColor);
};

const { CSSKeyframesAnimation } = kfEngine();
const tour = markRaw(
    new CSSKeyframesAnimation<TourVars>({ ...SQUARE_TOUR_OPTIONS, respectReducedMotion: true }).fromKeyframes(
        squareTourKeyframes(),
        paint,
    ),
);

onMounted(() => {
    watch(
        () => live,
        (on) => {
            if (on) void tour.play();
            else tour.stop();
        },
        { immediate: true },
    );
});
onBeforeUnmount(() => tour.stop());

const REST_FILL = squareTourKeyframes()["0%"].backgroundColor;
const FIELD = `M0 0L${TOUR_CORNER} ${-TOUR_CORNER}L0 ${TOUR_CORNER}L${-TOUR_CORNER} ${-TOUR_CORNER}Z`;
</script>

<template>
    <span class="scene-mini" :data-live="live ? '' : undefined">
        <span class="stage" :style="{ transform: `scale(${SCALE})` }">
            <svg
                class="layer"
                data-layer="field"
                :viewBox="`${-REGION / 2} ${-REGION / 2} ${REGION} ${REGION}`"
                :style="{ width: `${REGION}px`, height: `${REGION}px` }"
                aria-hidden="true"
            >
                <path :d="FIELD" fill="none" stroke="currentColor" stroke-opacity="0.35" stroke-width="14" stroke-linejoin="round" />
            </svg>
            <span
                ref="boxEl"
                class="box"
                data-layer="box"
                :style="{ width: `${SIDE}px`, height: `${SIDE}px`, margin: `${-SIDE / 2}px 0 0 ${-SIDE / 2}px`, backgroundColor: REST_FILL }"
            />
        </span>
    </span>
</template>

<style scoped>
.scene-mini {
    position: relative;
    display: inline-block;
    overflow: hidden;
    contain: strict;
}
.stage {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
}
.layer {
    position: absolute;
    left: 0;
    top: 0;
    translate: -50% -50%;
}
.box {
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 24px;
}
</style>
