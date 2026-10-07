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
import { markRaw, useTemplateRef } from "vue";
import { useLiveMini } from "@composables/useLiveMini";
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

useLiveMini(storyboard, () => live, () => {
    rows.forEach((row, i) => row.setTargets(balls.value![i]!));
    storyboard.seek(0);
});
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
                :style="{ top: `${1 + i * 20}%`, background: `var(${INKS[i]}, currentColor)` }"
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
   traveller rides x 1 → 16.6 (78% of the box) by `--ball-p`.
   X-DS pass 2 · KF-C2-11 — the glyph's MINIMUM STROKE: the rails were 1px at
   30% (near-invisible hairlines) and the travellers 12% of the box (~2 px), so
   at rest the icon read as nothing beside its neighbours. The rails are now a
   1.5px stroke at 45%, the travellers 18% of the box (~3 px), each centred on
   its rail; the travel (78% of the box) and the data are unchanged (OA-32). */
.rail {
    position: absolute;
    left: 10%;
    right: 10%;
    height: 1.5px;
    margin-top: -0.75px;
    border-radius: 1px;
    opacity: 0.45;
}
.ball {
    position: absolute;
    left: 1%;
    width: 18%;
    height: 18%;
    border-radius: 50%;
    translate: calc(var(--ball-p, 0) * 433%) 0;
}
</style>
