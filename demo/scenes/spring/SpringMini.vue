<script setup lang="ts">
/**
 * KF.W13U.d2 (OA-32) — the Spring scene's dock icon: a bounded miniature of the
 * preset field — the scene's four canonical springs (`SPRING_PRESETS`, the
 * same rows `useSpringDemo` races), each lane's ball driven by keyframes.js
 * under `springTimingFunction` of ITS preset's response and damping, over the
 * spring's own settle window (`response × 4`, the library's default span).
 * Stacking as on the stage: the lanes, then the balls riding them.
 *
 * Each sweep is translateX 0 → 100% of a carriage whose width IS the lane's
 * travel; the spring's overshoot lives inside the lane's end margin, and the
 * root clips and contains its paint. `live` plays (the dock's chosen scene);
 * otherwise the balls rest at the lane starts. Reduced motion: the engine's
 * gate snaps (the field's own `respectReducedMotion`, `SPRING_BASE`).
 */
import { markRaw, onBeforeUnmount, onMounted, useTemplateRef, watch } from "vue";
import { springTimingFunction } from "@mkbabb/keyframes.js";
import { kfEngine } from "@kf-engine";
import { SPRING_BASE, SPRING_PRESETS } from "./springPresets";

const { live = false } = defineProps<{ live?: boolean }>();

const INKS = ["--rainbow-violet", "--rainbow-blue", "--rainbow-cyan", "--rainbow-green"];
const SWEEP = `@keyframes spring-lane {
    from { transform: translateX(0%); }
    to   { transform: translateX(100%); }
}`;

const carriages = useTemplateRef<HTMLElement[]>("carriages");

const { CSSKeyframesAnimation } = kfEngine();
const lanes = SPRING_PRESETS.map((preset) =>
    markRaw(
        new CSSKeyframesAnimation({
            duration: preset.response * 4 * 1000,
            iterationCount: "infinite",
            direction: "alternate",
            timingFunction: springTimingFunction({
                response: preset.response,
                dampingFraction: preset.dampingFraction,
            }),
            respectReducedMotion: SPRING_BASE.respectReducedMotion,
        }).fromString(SWEEP),
    ),
);

onMounted(() => {
    lanes.forEach((lane, i) => lane.setTargets(carriages.value![i]!));
    watch(
        () => live,
        (on) => {
            for (const lane of lanes) {
                if (on) void lane.play();
                else lane.stop();
            }
        },
        { immediate: true },
    );
});
onBeforeUnmount(() => lanes.forEach((lane) => lane.stop()));
</script>

<template>
    <span class="scene-mini" :data-live="live ? '' : undefined">
        <span class="layer" data-layer="lanes">
            <span
                v-for="(preset, i) in SPRING_PRESETS"
                :key="preset.name"
                class="lane"
                :style="{ top: `${16 + i * 20}%`, background: `var(${INKS[i]}, currentColor)` }"
            />
        </span>
        <span class="layer" data-layer="balls">
            <span
                v-for="(preset, i) in SPRING_PRESETS"
                :key="preset.name"
                ref="carriages"
                class="carriage"
                :style="{ top: `${8.5 + i * 20}%` }"
            >
                <span class="ball" :style="{ background: `var(${INKS[i]}, currentColor)` }" />
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
.layer {
    position: absolute;
    inset: 0;
}
/* The box is 20 units: four lanes at y 3.5, 7.5, 11.5, 15.5 from x 2 to 15
   (the end margin holds the bouncy preset's overshoot). */
.lane {
    position: absolute;
    left: 10%;
    width: 65%;
    height: 1px;
    opacity: 0.35;
}
.carriage {
    position: absolute;
    left: 2.5%;
    width: 65%;
    height: 15%;
}
.ball {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    aspect-ratio: 1;
    border-radius: 50%;
}
</style>
