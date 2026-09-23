<script setup lang="ts">
/**
 * KF.W13U.d2 (OA-32) — the Cube scene's dock icon: a bounded miniature of the
 * die, turned by the scene's OWN channels through keyframes.js — the Rotations
 * keyframes (`cubeSpinKeyframes`, the same data `useCubeDemo` plays) and the
 * Hover preset, each built from the scene's stored options for that channel.
 * The stage's stacking is kept by the same nesting the scene uses (KF.W13U.w:
 * one element per transform owner): bob · pose · spin, six crayon faces.
 *
 * The die is authored at `SIDE` px and the stage is scaled by `SCALE`, so every
 * authored amplitude (the 5px bob, the face offsets) shrinks with it; the root
 * clips and contains its paint. The Matrix channel is the user's editor state
 * (scene-local), so the pose layer rests at identity here. `live` plays the
 * group (the dock's chosen scene); otherwise the icon rests. Reduced motion:
 * the group's own gate snaps to rest.
 */
import { markRaw, onBeforeUnmount, onMounted, useTemplateRef, watch } from "vue";
import { kfEngine } from "@kf-engine";
import { getStoredAnimationOptions } from "@state";
import { CUBE_SCENE_ID } from "./cubeKeys";
import { CUBE_ANIMATION_NAMES, cubeSpinKeyframes } from "./cubeMotion";

const { live = false } = defineProps<{ live?: boolean }>();

const SIDE = 120; // the authored die, px
const SCALE = 0.1; // the miniature: a 12px die in the 20px box

const FACES = [
    { color: "var(--face-1)", transform: "rotateY(0deg)" },
    { color: "var(--face-2)", transform: "rotateY(90deg)" },
    { color: "var(--face-3)", transform: "rotateY(180deg)" },
    { color: "var(--face-4)", transform: "rotateY(-90deg)" },
    { color: "var(--face-5)", transform: "rotateX(90deg)" },
    { color: "var(--face-6)", transform: "rotateX(-90deg)" },
].map((f) => ({ ...f, transform: `${f.transform} translateZ(${SIDE / 2}px)` }));

const bobEl = useTemplateRef<HTMLElement>("bobEl");
const cubeEl = useTemplateRef<HTMLElement>("cubeEl");

const { CSSKeyframesAnimation, AnimationGroup, presets } = kfEngine();
const optionsOf = (name: string) => ({
    ...getStoredAnimationOptions(name, CUBE_SCENE_ID).animationOptions,
});
const spin = new CSSKeyframesAnimation(optionsOf(CUBE_ANIMATION_NAMES.Rotations)).fromKeyframes(
    cubeSpinKeyframes(),
);
const bob = presets.hover(optionsOf(CUBE_ANIMATION_NAMES.Hover));
const group = markRaw(new AnimationGroup(spin, bob));
// The channels paint different elements (the scene's own declared opt-out).
group.singleTarget = false;

onMounted(() => {
    spin.setTargets(cubeEl.value!);
    bob.setTargets(bobEl.value!);
    watch(
        () => live,
        (on) => {
            if (on) void group.play();
            else group.stop();
        },
        { immediate: true },
    );
});
onBeforeUnmount(() => group.stop());
</script>

<template>
    <span class="scene-mini" :data-live="live ? '' : undefined">
        <span class="stage" :style="{ width: `${SIDE}px`, height: `${SIDE}px`, transform: `translate(-50%, -50%) scale(${SCALE})` }">
            <span ref="bobEl" class="layer" data-layer="bob">
                <span class="layer" data-layer="pose">
                    <span ref="cubeEl" class="layer die" data-layer="cube">
                        <span
                            v-for="(face, i) in FACES"
                            :key="i"
                            class="face"
                            :style="{ backgroundColor: face.color, transform: face.transform }"
                        />
                    </span>
                </span>
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
.stage {
    position: absolute;
    top: 50%;
    left: 50%;
    perspective: 600px;
    transform-style: preserve-3d;
}
.layer {
    position: absolute;
    inset: 0;
    transform-style: preserve-3d;
}
.die {
    --rotationX: 360deg;
}
.face {
    position: absolute;
    inset: 0;
    border-radius: 12px;
    backface-visibility: hidden;
}
</style>
