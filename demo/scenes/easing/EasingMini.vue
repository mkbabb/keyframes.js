<script setup lang="ts">
/**
 * KF.W13U.d2 (OA-32) — the Easing scene's dock icon: a bounded miniature of
 * the preview, played by keyframes.js from the scene's OWN preview data
 * (`EASING_PREVIEW_KEYFRAMES` under `EASING_PREVIEW_OPTIONS`, at the curve and
 * duration the scene opens on — `easingMotion.ts`, read by `useEasingDemo`
 * too). Stacking as on the stage: the curve, the rail, the ball riding it.
 *
 * The keyframes sweep translateX 0 → 100% of the carriage, whose width IS the
 * rail's travel, so the ball never leaves the rail; the root clips and
 * contains its paint. `live` plays (the dock's chosen scene); otherwise the
 * ball rests at the rail's start. Reduced motion: the engine's gate snaps.
 */
import { markRaw, onBeforeUnmount, onMounted, useTemplateRef, watch } from "vue";
import { kfEngine } from "@kf-engine";
import { generateCurveSVGPath, namedEasing } from "@utils/reference-data/timingCurveUtils";
import {
    EASING_DEFAULT_DURATION,
    EASING_DEFAULT_NAME,
    EASING_PREVIEW_KEYFRAMES,
    EASING_PREVIEW_OPTIONS,
} from "./easingMotion";

const { live = false } = defineProps<{ live?: boolean }>();

const INK = "hsl(248, 88%, 71%)"; // the scene glyph's violet
const CURVE = generateCurveSVGPath(namedEasing(EASING_DEFAULT_NAME));

const carriageEl = useTemplateRef<HTMLElement>("carriageEl");

const { CSSKeyframesAnimation } = kfEngine();
const preview = markRaw(
    new CSSKeyframesAnimation({
        ...EASING_PREVIEW_OPTIONS,
        duration: EASING_DEFAULT_DURATION,
        timingFunction: EASING_DEFAULT_NAME,
        respectReducedMotion: true,
    }).fromString(EASING_PREVIEW_KEYFRAMES),
);

onMounted(() => {
    preview.setTargets(carriageEl.value!);
    watch(
        () => live,
        (on) => {
            if (on) void preview.play();
            else preview.stop();
        },
        { immediate: true },
    );
});
onBeforeUnmount(() => preview.stop());
</script>

<template>
    <span class="scene-mini" :data-live="live ? '' : undefined" :style="{ '--mini-ink': INK }">
        <svg class="curve" data-layer="curve" viewBox="-0.1 -0.1 1.2 1.2" preserveAspectRatio="none" aria-hidden="true">
            <path :d="CURVE" fill="none" stroke="var(--mini-ink)" stroke-width="0.12" stroke-linecap="round" vector-effect="none" />
        </svg>
        <span class="rail" data-layer="rail" />
        <span ref="carriageEl" class="carriage" data-layer="ball">
            <span class="ball" />
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
/* The box is 20 units: the curve fills 3..17 × 1..13, the rail sits at 17. */
.curve {
    position: absolute;
    left: 15%;
    top: 5%;
    width: 70%;
    height: 60%;
}
.rail {
    position: absolute;
    left: 15%;
    right: 15%;
    top: 82.5%;
    height: 1px;
    background: var(--mini-ink);
    opacity: 0.4;
}
.carriage {
    position: absolute;
    left: 5%;
    width: 70%;
    top: 72.5%;
    height: 20%;
}
.ball {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    aspect-ratio: 1;
    border-radius: 50%;
    background: var(--mini-ink);
}
</style>
