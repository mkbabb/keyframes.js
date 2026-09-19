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

// The scene is its own instrument: the transport surface is the shell's dock
// (play/pause through the SceneFacility's playback adapter) plus the two verbs
// that live ON the target — the master-clock scrub and the row re-time (with
// its reset). Nothing here opens or closes a controls panel: this scene has no
// panel, and no stored panel option to hold shut (the former closed-default
// wrote a key nothing read — SC-1/D23). The PLAYBACK authority is the scene
// machine; `demo.isPlaying` is a read-only projection of its status.
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
