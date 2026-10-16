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
import { markRaw, useTemplateRef } from "vue";
import { useLiveMini } from "@composables/useLiveMini";
import type { Vars } from "@mkbabb/keyframes.js";
import { kfEngine } from "@kf-engine";
import { SQUARE_TOUR_OPTIONS, TOUR_CORNER, squareTourKeyframes } from "./squareMotion";

const { live = false } = defineProps<{ live?: boolean }>();

// X-DS pass 2 · KF-C2-11 — a SUBJECT-FIRST crop. The frame used to be the
// tour's whole reach (corners + the turning subject, 360 px), so the box at
// rest shrank to a ~3 px speck in the 16-20 px glyph.
// X-DS r7 pass 7 (KF-C7-01) — THE PATH IS LEGIBLE AT REST. Two subject-widths
// of frame (a 120 px box in 240) put the resting box over the dart's whole
// middle, so only the two top-corner stubs and the bottom tip showed: a cat's
// head, not a tour. The frame is now the path's own reach (the corners plus a
// margin for the stroke), and the box is drawn at two fifths of the corner
// offset's span, so at rest it sits at the dart's heart and every one of the
// path's four segments runs visibly out from under it to its corner. The tour
// data and motion are unchanged (OA-32); only the drawn size is.
const REGION = 2 * TOUR_CORNER + 20;
const SIDE = 0.8 * TOUR_CORNER; // the drawn subject, px (72 of the 200 px frame)
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

useLiveMini(tour, () => live);

const REST_FILL = squareTourKeyframes()["0%"].backgroundColor;
// X-DS r7 pass 6 (KF-C6-02) — the field is a HAIRLINE path: a 14-unit stroke
// (about 1.2 px, round joins at acute angles) read as solid grey wedges. At 5
// units in the 200 px frame (0.5 px, the KF-C6-02 weight) and 0.35 opacity it
// reads as a drawn path. The motion is unchanged.
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
                <path :d="FIELD" fill="none" stroke="currentColor" stroke-opacity="0.35" stroke-width="5" stroke-linejoin="round" />
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
    border-radius: 20%; /* the authored 24 px of a 120 px subject, at any drawn size */
}
</style>
