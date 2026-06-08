<template>
    <div class="flex h-full w-full items-center justify-center">
        <StartingStyleTarget />
    </div>
</template>

<script setup lang="ts">
import { computed, provide, ref } from "vue";

import { getStoredAnimationGroupControlOptions } from "@components/custom/animation-controls/stores";

import StartingStyleTarget from "../../spring/StartingStyleTarget.vue";
import { useStartingStyleDemo } from "../../spring/useStartingStyleDemo";
import { STARTING_STYLE_DEMO_KEY } from "../../spring/startingStyleKeys";

const SUPER_KEY = "StartingStyle";

// This scene's motion is the declarative CSS @starting-style / allow-discrete
// transition in StartingStyleTarget (eased by a spring linear()), not an
// engine-driven rAF loop. The demo composable owns the `visible` toggle (so the
// ScenePlayback contract can round-trip it) + the dummy bottom-bar transport
// group whose `paused` projects the machine status.
const demo = useStartingStyleDemo();
provide(STARTING_STYLE_DEMO_KEY, demo);

const storedControls = getStoredAnimationGroupControlOptions(SUPER_KEY);
storedControls.isControlsPanelOpen = false;

// `demo.isPlaying` is a read-only projection of the machine status (no private
// shadow). The bottom-bar play button routes through the App's onPlayStateChange
// → the machine; this is the readonly read.
const isPlaying = demo.isPlaying;
const isStarted = ref(true);

defineExpose({
    animationGroup: computed(() => demo.animationGroup),
    superKey: SUPER_KEY,
    isPlaying,
    isStarted,
    // NO autoPlays: this scene's motion is a user-driven discrete CSS transition,
    // not an auto-running preview sweep. The SCENE_READY restore re-seats the
    // `visible` state from the snapshot; the status rests on the snapshot's
    // `playing` (paused on a fresh entry).
    // The raw-rAF ScenePlayback adapter — the App registers it with the machine
    // on SCENE_READY so the `visible` state round-trips through the CONTRACT.
    scenePlayback: demo.scenePlayback,
});
</script>
