<template>
    <div class="flex h-full w-full items-center justify-center">
        <SequenceTarget />
    </div>
</template>

<script setup lang="ts">
import { computed, provide, ref } from "vue";

import { getStoredAnimationGroupControlOptions } from "@components/custom/animation-controls/stores";

import SequenceTarget from "../../sequence/SequenceTarget.vue";
import { useSequenceDemo } from "../../sequence/useSequenceDemo";
import { SEQUENCE_DEMO_KEY } from "../../sequence/sequenceKeys";

const SUPER_KEY = "Sequence";

const demo = useSequenceDemo();
provide(SEQUENCE_DEMO_KEY, demo);

// The scene's transport (play/pause/reverse/timeScale/scrub — the F.W9 contract)
// lives ON the target (SequenceTarget), self-contained like the spring rail. The
// contract AnimationGroup satisfies the editor's bottom-bar handle; it drives no
// scene motion (the Sequence's own loop does). The PLAYBACK authority is the
// machine + the raw-rAF ScenePlayback adapter (H.W1) — `demo.isPlaying` is now a
// read-only projection of the machine status.
const storedControls = getStoredAnimationGroupControlOptions(SUPER_KEY);
storedControls.isControlsPanelOpen = false;

defineExpose({
    animationGroup: computed(() => demo.animationGroup),
    superKey: SUPER_KEY,
    isPlaying: demo.isPlaying,
    isStarted: ref(true),
    // The raw-rAF ScenePlayback adapter — the App registers it with the machine
    // on SCENE_READY so the Sequence's progress/isPlaying round-trip through the
    // CONTRACT (these temporal scenes have NO AnimationGroup position; the dummy
    // transport host drives no motion). proof:scene-contract-identity.
    scenePlayback: demo.scenePlayback,
});
</script>
