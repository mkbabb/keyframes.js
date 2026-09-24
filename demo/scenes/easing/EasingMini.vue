<script setup lang="ts">
/**
 * KF.W13U.d2 (OA-32) — the Easing scene's dock icon: a bounded miniature of
 * the preview, played by keyframes.js at the curve and duration the scene opens
 * on (`easingMotion.ts`, read by `useEasingDemo` too).
 *
 * X.KF.W13W.b (OA-56) — THE BALL RIDES THE CURVE. The icon was curve, rail,
 * ball: the ball swept a flat rail under the curve. Now the stroke and the
 * ball come from ONE plot (`EASING_MINI_PLOT`, the shared `curvePlot`
 * primitive): the carriage spans the curve's own box, and the engine plays the
 * plot's vertices as linear keyframes (`EASING_MINI_KEYFRAMES`) under the
 * preview's options, so the ball walks the drawn stroke out and back. No rail.
 * `live` plays (the dock's chosen scene); otherwise the carriage rests at the
 * curve's start (`--curve-rest`). Reduced motion: the engine's gate snaps —
 * onto a keyframe, i.e. a vertex of the stroke.
 */
import { markRaw, onBeforeUnmount, onMounted, useTemplateRef, watch } from "vue";
import { kfEngine } from "@kf-engine";
import {
    EASING_DEFAULT_DURATION,
    EASING_MINI_KEYFRAMES,
    EASING_MINI_PLOT,
    EASING_PREVIEW_OPTIONS,
} from "./easingMotion";

const { live = false } = defineProps<{ live?: boolean }>();

const INK = "hsl(248, 88%, 71%)"; // the scene glyph's violet
const REST = EASING_MINI_PLOT.place(0);

const carriageEl = useTemplateRef<HTMLElement>("carriageEl");

const { CSSKeyframesAnimation } = kfEngine();
const preview = markRaw(
    new CSSKeyframesAnimation({
        ...EASING_PREVIEW_OPTIONS,
        duration: EASING_DEFAULT_DURATION,
        timingFunction: "linear",
        respectReducedMotion: true,
    }).fromString(EASING_MINI_KEYFRAMES),
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
        <span class="plot" data-layer="curve">
            <svg class="curve" :viewBox="EASING_MINI_PLOT.viewBox" preserveAspectRatio="none" aria-hidden="true">
                <path :d="EASING_MINI_PLOT.d" fill="none" stroke="var(--mini-ink)" stroke-width="0.12" stroke-linecap="round" vector-effect="none" />
            </svg>
            <span ref="carriageEl" class="curve-carriage carriage" data-layer="ball" :style="{ '--curve-rest': REST }">
                <span class="curve-ball ball" />
            </span>
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
/* The plot box: the curve's svg and the ball's carriage share it. The box is
   inset so a ball centred on either end of the curve stays inside the icon. */
.plot {
    position: absolute;
    left: 15%;
    top: 12.5%;
    width: 70%;
    height: 75%;
}
.curve {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
}
/* The ball: 20 % of the icon's height (75 % box → 26.667 % of the carriage). */
.ball {
    width: auto;
    height: 26.667%;
    aspect-ratio: 1;
    background: var(--mini-ink);
    box-shadow: none;
}
</style>
