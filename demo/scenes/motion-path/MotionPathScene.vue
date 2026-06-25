<template>
    <div class="flex h-full w-full items-center justify-center">
        <MotionPathTarget />
    </div>
</template>

<script setup lang="ts">
import { computed, provide } from "vue";

import { getStoredAnimationGroupControlOptions } from "@components/custom/animation-controls/stores";

import MotionPathTarget from "./MotionPathTarget.vue";
import { useMotionPathDemo } from "./useMotionPathDemo";
import { MOTION_PATH_DEMO_KEY, MOTION_PATH_SUPER_KEY } from "./motionPathKeys";

const SUPER_KEY = MOTION_PATH_SUPER_KEY;

const demo = useMotionPathDemo();
provide(MOTION_PATH_DEMO_KEY, demo);

// The MotionPath animation IS a CSSKeyframesAnimation in the contract group, so
// the editor's existing bottom-bar transport drives play/pause/scrub directly —
// no custom transport. The control-surface DFA (H.W11.S4 / I2 —
// `CONTROL_SURFACES["motion-path"] = []`) is the AUTHORITY on this being a
// self-contained, panel-less stage: the dock shows NO control affordance for an
// empty DFA set. The local closed-default keeps the panel container collapsed.
const storedControls = getStoredAnimationGroupControlOptions(SUPER_KEY);
storedControls.isControlsPanelOpen = false;

defineExpose({
    animationGroup: computed(() => demo.animationGroup.value),
    superKey: SUPER_KEY,
    // S5c — `isPlaying` is now a READ-ONLY machine-status projection (the D12
    // shadow ref is deleted); the App must NOT write it. Exposing `scenePlayback`
    // (the group adapter) makes the App treat playback as machine-owned
    // (`ownsPlayback` true ⇒ it routes play/pause through the machine, never an
    // `isPlaying =` write) and round-trips the traveller's offset-distance
    // position across suspend/restore via the group snapshot.
    isPlaying: demo.isPlaying,
    isStarted: demo.isStarted,
    scenePlayback: demo.scenePlayback,
});
</script>
