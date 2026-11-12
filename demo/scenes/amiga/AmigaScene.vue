<template>
    <AmigaTarget />
</template>

<script setup lang="ts">
import { onBeforeUnmount, provide } from "vue";

import { facilityFromGroup } from "@composables/scene-facility";

import AmigaTarget from "./AmigaTarget.vue";
import { useAmigaDemo } from "./useAmigaDemo";
import { AMIGA_DEMO_KEY, AMIGA_SCENE_ID } from "./amigaKeys";

// A2-KE-L1-16 — the Scene → Target seam every other scene keeps: the scene owns
// the demo (the group + its pose sink), the facility and the shell contract;
// AmigaTarget owns the stage (the WebGL room, the compose, the gesture).
const demo = useAmigaDemo();
provide(AMIGA_DEMO_KEY, demo);

onBeforeUnmount(() => {
    demo.animationGroup.stop();
});

const facility = facilityFromGroup(() => demo.animationGroup);

defineExpose({
    // T.B1 STAGE 1 — the additive SceneFacility: amiga's REAL group members are
    // the painting channels. The facility's playback is the standard group adapter.
    facility,
    // C-13 — the exposed KEY is the shell's contract and keeps its name.
    superKey: AMIGA_SCENE_ID,
    // owner-1112 (item 5) — the Boing IS the scene: it bounces on its first
    // entry of a page load, as the cube plays (it rested mid-air at home until
    // Play was pressed, the one subject that arrived still). A return resumes
    // the captured snapshot, so a paused Boing stays paused (item 7).
    autoPlays: true,
});
</script>
