<template>
    <div class="flex h-full w-full items-center justify-center">
        <SequenceTarget />
    </div>
</template>

<script setup lang="ts">
import { computed, provide, ref } from "vue";

import { getStoredAnimationGroupControlOptions } from "@state";

import SequenceTarget from "./SequenceTarget.vue";
import { useSequenceDemo } from "./useSequenceDemo";
import { SEQUENCE_DEMO_KEY, SEQUENCE_SCENE_ID } from "./sequenceKeys";

const SCENE_ID = SEQUENCE_SCENE_ID;

const demo = useSequenceDemo();
provide(SEQUENCE_DEMO_KEY, demo);

// The scene's transport (play/pause/reverse/timeScale/scrub — the F.W9 contract)
// lives ON the target (SequenceTarget), self-contained like the spring rail. The
// contract AnimationGroup satisfies the editor's bottom-bar handle; it drives no
// scene motion (the Sequence's own loop does). The PLAYBACK authority is the
// machine + the raw-rAF ScenePlayback adapter (H.W1) — `demo.isPlaying` is now a
// read-only projection of the machine status. The control-surface DFA (H.W11.S4
// / I2 — `CONTROL_SURFACES.sequence = []`) is the AUTHORITY on this being a
// self-contained, panel-less stage: the dock shows NO control affordance for an
// empty DFA set. The local closed-default keeps the panel container collapsed.
const storedControls = getStoredAnimationGroupControlOptions(SCENE_ID);
storedControls.isControlsPanelOpen = false;

defineExpose({
    // T.B1 STAGE 1 — the SceneFacility replaces the deleted contract group. Its
    // ONE "Sequence" channel is the transport label; `facility.playback` is the
    // raw-rAF adapter the shell registers with the machine. `scenePlayback` is
    // also exposed as the STABLE bind-target identity the shell's once-per-entry
    // ready-guard keys on (a facility-only scene has no `animationGroup`).
    facility: computed(() => demo.facility),
    superKey: SCENE_ID,
    isPlaying: demo.isPlaying,
    isStarted: ref(true),
    scenePlayback: demo.scenePlayback,
});
</script>
