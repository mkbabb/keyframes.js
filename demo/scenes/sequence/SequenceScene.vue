<template>
    <SequenceTarget />
</template>

<script setup lang="ts">
import { provide, ref } from "vue";

import SequenceTarget from "./SequenceTarget.vue";
import { useSequenceDemo } from "./useSequenceDemo";
import { SEQUENCE_DEMO_KEY, SEQUENCE_SCENE_ID } from "./sequenceKeys";

const SCENE_ID = SEQUENCE_SCENE_ID;

const demo = useSequenceDemo();
provide(SEQUENCE_DEMO_KEY, demo);

// The stage is the subject (OA-46): the transport is the shell's dock
// (play/pause through the SceneFacility's playback adapter), and the two
// editing verbs — the master-clock scrub and the row re-time (with its reset)
// — are the shared Timeline pane's Sequence mode, opened from the dock's
// Timeline item like every scene's (X.KF.W13V.s2 · §0cw); the facility's
// channel carries them. The PLAYBACK authority is the scene machine;
// `demo.isPlaying` is a read-only projection of its status.
//
// The target is the scene's root: it is already the centred, width-bounded,
// full-height column, so no wrapper repeats those declarations around it (D21).

defineExpose({
    // The SceneFacility is the shell's whole contract with this scene: its ONE
    // "Sequence" channel is the transport label; `facility.playback` is the
    // adapter the shell registers with the machine. A facility-only scene has no
    // `animationGroup` and exposes no separate playback identity.
    facility: demo.facility,
    superKey: SCENE_ID,
    isStarted: ref(true),
});
</script>
