<template>
    <div class="flex h-full w-full items-center justify-center">
        <StartingStyleTarget />
    </div>
</template>

<script setup lang="ts">
import { computed, markRaw, ref } from "vue";

import { AnimationGroup } from "@src/animation/group";
import { CSSKeyframesAnimation } from "@src/animation/engine";
import { springTimingFunction } from "@src/animation/springTimingFunction";
import { getStoredAnimationGroupControlOptions } from "@components/custom/animation-controls/stores";

import StartingStyleTarget from "../../spring/StartingStyleTarget.vue";

const SUPER_KEY = "StartingStyle";

// This scene's motion is the CSS @starting-style / allow-discrete transition in
// StartingStyleTarget (eased by a spring linear()), not an engine-driven rAF
// loop. The bottom-bar transport still requires an AnimationGroup, so this is a
// minimal contract group whose single preview animation dogfoods the same
// springTimingFunction the artifact emits — it drives no scene motion.
const contractAnim = markRaw(
    new CSSKeyframesAnimation({
        duration: 600,
        iterationCount: "infinite",
        direction: "alternate",
        timingFunction: springTimingFunction({
            response: 0.5,
            dampingFraction: 0.45,
        }),
    }).fromVars([{ opacity: 0 }, { opacity: 1 }]),
);
contractAnim.name = "Discrete Preview";
contractAnim.superKey = SUPER_KEY;

const animationGroup = markRaw(new AnimationGroup(contractAnim));
animationGroup.started = true;
animationGroup.paused = true;

const storedControls = getStoredAnimationGroupControlOptions(SUPER_KEY);
storedControls.isControlsPanelOpen = false;

const isPlaying = ref(false);
const isStarted = ref(true);

defineExpose({
    animationGroup: computed(() => animationGroup),
    superKey: SUPER_KEY,
    isPlaying,
    isStarted,
});
</script>
