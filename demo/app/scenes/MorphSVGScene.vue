<template>
    <div class="flex h-full w-full items-center justify-center">
        <MorphTarget />
    </div>
</template>

<script setup lang="ts">
import { computed, provide, ref } from "vue";

import { getStoredAnimationGroupControlOptions } from "@components/custom/animation-controls/stores";

import MorphTarget from "../../morph/MorphTarget.vue";
import { useMorphDemo } from "../../morph/useMorphDemo";
import { MORPH_DEMO_KEY } from "../../morph/morphKeys";

const SUPER_KEY = "Morph";

const demo = useMorphDemo();
provide(MORPH_DEMO_KEY, demo);

// The morph IS a CSSKeyframesAnimation in the contract group, so the editor's
// existing bottom-bar transport drives play/pause directly — no custom transport.
// The control-surface DFA (CONTROL_SURFACES.morph = []) is the AUTHORITY on this
// being a self-contained, panel-less stage (beside sequence/motion-path): the
// dock shows NO control affordance for an empty DFA set. The local closed-default
// keeps the panel container collapsed.
const storedControls = getStoredAnimationGroupControlOptions(SUPER_KEY);
storedControls.isControlsPanelOpen = false;

defineExpose({
    animationGroup: computed(() => demo.animationGroup.value),
    superKey: SUPER_KEY,
    // The machine-native playback (the read-only projection) + the group
    // ScenePlayback adapter the App registers on SCENE_READY (the morph
    // CSSKeyframesAnimation's `t` round-trips across suspend/restore).
    isPlaying: demo.isPlaying,
    isStarted: ref(true),
    scenePlayback: demo.scenePlayback,
    // The morph is a continuously-LOOPING showcase (alternate + infinite) — it
    // is alive the moment you land, like the easing preview. autoPlays: true
    // makes the App dispatch PLAY on SCENE_READY (the morph breathes on entry).
    autoPlays: true,
});
</script>
