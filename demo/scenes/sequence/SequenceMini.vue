<script setup lang="ts">
/**
 * KF.W13U.d2 (OA-32) — the Sequence scene's dock icon: a bounded miniature of
 * the storyboard, played by keyframes.js's own `Sequence` from the scene's
 * data (`sequenceMotion.ts`, read by `useSequenceDemo` too): `ROW_COUNT` rows,
 * each the row glide (`sequenceRowKeyframes` over `ROW_DURATION` under the
 * `ROW_GLIDE` spring) inserted at its `stagger` offset. Stacking as on the
 * stage: the rails, then the travellers.
 *
 * The travellers read `--ball-p` (the engine's write) as a fraction of their
 * rail's travel, so they never leave it; the root clips and contains its
 * paint. The storyboard ping-pongs (`yoyo`, repeating) so the icon keeps
 * telling it. `live` plays (the dock's chosen scene); otherwise the rows rest
 * at their start. Reduced motion: the Sequence's own gate snaps to rest.
 */
import { markRaw, onBeforeUnmount, onMounted, useTemplateRef, watch } from "vue";
import { Sequence, springTimingFunction, stagger } from "@mkbabb/keyframes.js";
import { kfEngine } from "@kf-engine";
import {
    ROW_COUNT,
    ROW_DURATION,
    ROW_GLIDE,
    STAGGER_EACH,
    sequenceRowKeyframes,
    type BallVars,
} from "./sequenceMotion";

const { live = false } = defineProps<{ live?: boolean }>();

const INKS = ["--rainbow-violet", "--rainbow-blue", "--rainbow-cyan", "--rainbow-green", "--rainbow-violet"];
const ROWS = Array.from({ length: ROW_COUNT }, (_, i) => i);

const balls = useTemplateRef<HTMLElement[]>("balls");

const { CSSKeyframesAnimation } = kfEngine();
const glide = springTimingFunction(ROW_GLIDE);
const delays = stagger(ROW_COUNT, { each: STAGGER_EACH, from: "first" }).delays(ROW_COUNT);
const rows = ROWS.map(() =>
    markRaw(
        new CSSKeyframesAnimation<BallVars>({
            duration: ROW_DURATION,
            fillMode: "forwards",
            timingFunction: glide,
        }).fromKeyframes(sequenceRowKeyframes()),
    ),
);
const storyboard = markRaw(new Sequence<BallVars>());
rows.forEach((row, i) => storyboard.add(row, delays[i]!));
storyboard.repeat(Infinity).yoyo(true);

onMounted(() => {
    rows.forEach((row, i) => row.setTargets(balls.value![i]!));
    storyboard.seek(0);
    watch(
        () => live,
        (on) => {
            if (on) void storyboard.play();
            else storyboard.stop();
        },
        { immediate: true },
    );
});
onBeforeUnmount(() => storyboard.stop());
</script>

<template>
    <span class="scene-mini" :data-live="live ? '' : undefined">
        <span class="layer" data-layer="rails">
            <span
                v-for="i in ROWS"
                :key="i"
                class="rail"
                :style="{ top: `${10 + i * 20}%`, background: `var(${INKS[i]}, currentColor)` }"
            />
        </span>
        <span class="layer" data-layer="travellers">
            <span
                v-for="i in ROWS"
                :key="i"
                ref="balls"
                class="ball"
                :style="{ top: `${4 + i * 20}%`, background: `var(${INKS[i]}, currentColor)` }"
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
.layer {
    position: absolute;
    inset: 0;
}
/* The box is 20 units: five rails at y 2, 6, 10, 14, 18 from x 2 to 18; a
   traveller (2.4 units) rides 1 → 16.6 by `--ball-p` (650% of its own width). */
.rail {
    position: absolute;
    left: 10%;
    right: 10%;
    height: 1px;
    opacity: 0.3;
}
.ball {
    position: absolute;
    left: 5%;
    width: 12%;
    height: 12%;
    border-radius: 50%;
    translate: calc(var(--ball-p, 0) * 650%) 0;
}
</style>
