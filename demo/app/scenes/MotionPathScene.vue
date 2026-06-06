<template>
    <div class="flex h-full w-full items-center justify-center">
        <MotionPathTarget />
    </div>
</template>

<script setup lang="ts">
import { computed, provide } from "vue";

import { getStoredAnimationGroupControlOptions } from "@components/custom/animation-controls/stores";

import MotionPathTarget from "../../motion-path/MotionPathTarget.vue";
import { useMotionPathDemo } from "../../motion-path/useMotionPathDemo";
import { MOTION_PATH_DEMO_KEY } from "../../motion-path/motionPathKeys";

const SUPER_KEY = "MotionPath";

const demo = useMotionPathDemo();
provide(MOTION_PATH_DEMO_KEY, demo);

// The MotionPath animation IS a CSSKeyframesAnimation in the contract group, so
// the editor's existing bottom-bar transport drives play/pause/scrub directly —
// no custom transport. Open the controls panel on desktop like the other scenes.
const storedControls = getStoredAnimationGroupControlOptions(SUPER_KEY);
storedControls.isControlsPanelOpen = false;

defineExpose({
    animationGroup: computed(() => demo.animationGroup.value),
    superKey: SUPER_KEY,
    isPlaying: demo.isPlaying,
    isStarted: demo.isStarted,
});
</script>
