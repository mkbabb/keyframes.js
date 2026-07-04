<template>
    <div class="flex h-full w-full items-center justify-center">
        <EasingTarget />
    </div>
</template>

<script setup lang="ts">
import { computed, h, provide, ref } from "vue";

import PlaybackRibbon from "@components/custom/animation-controls/controls/PlaybackRibbon.vue";

import EasingTarget from "./EasingTarget.vue";
import EasingSidebar from "./EasingSidebar.vue";
import { useEasingDemo } from "./useEasingDemo";
import { EASING_DEMO_KEY, EASING_SUPER_KEY } from "./easingKeys";

const SUPER_KEY = EASING_SUPER_KEY;

const demo = useEasingDemo();
provide(EASING_DEMO_KEY, demo);

// The easing scene's ONLY valid control surface is `easing` (the control-surface
// DFA, H.W11.S4 / I2 — `CONTROL_SURFACES.easing = ['easing']`). The dock + the
// in-panel tab host render the triad FROM that table, so the built-in
// controls/keyframes/timeline triggers no longer exist for this scene — reka
// CANNOT fall back to a non-existent `controls` tab.
//
// I.W2.S1 — the former `storedControls.selectedControl = "easing"` setup POKE is
// DELETED (no legacy beside the replacement). The selected surface is now a
// machine-projected single authority (`selectedControlSurfaceFor`, bound to the
// `<Tabs> :model-value` in AnimationControls): on a switch-in the model-value is
// born `"easing"` on the mounting tick, so the reka `passive`-latch is taken
// correct (the B4 desync cure) without a poke that loses the race.
//
// S.G1 S1c (p10 F4 — writer c) — the former `storedControls.isControlsPanelOpen =
// true` born-open POKE is DELETED too (the last dead write of the three-writer
// chain). On mobile the sheet is born at peek by the host mount-reset
// (useSheetState); on desktop the shell force-opens the rail
// (useSceneMachineShellBinding, ≥1024px-gated). The scene pokes nothing.

// `demo.isPlaying` is now a read-only projection of the machine status (the
// shadow `isPlaying` ref is DELETED, H.W1). The bottom-bar play button routes
// through the App's onPlayStateChange → the machine; the ribbon reads this.
const isPlaying = demo.isPlaying;
const isStarted = ref(true);

// J.W2 S2 (S4-stretch) — the panel mounts FLAT. The easing scene has a SINGLE
// valid surface (`['easing']`), so the `<Tabs>`/`TabsContent` machinery (the
// former `force-mount` belt against reka's model-value latch, and the trigger
// that never rendered under the dock-managed shell) is dead weight — the
// structural source of the `selectedControl` double role
// (`audit/wave-I.W2.md §6`). AnimationControls renders this slot directly for
// single-surface scenes: no model-value to project, no latch to race — the
// panel is mounted BY CONSTRUCTION. The TabsTrigger/TabsContent wrappers are
// DELETED in the same motion (no legacy beside the replacement).
const tabsContent = () => h(EasingSidebar, { demo });

// G3 + G7 (H.W10.S2) — the PRIMARY playback transport is the STANDARD
// PlaybackRibbon (the SAME component cube/amiga mount): a scrubber Slider +
// Play/Reverse on the shared `.btn-playback` `grid-cols-2` skin (equal w/h by
// the layout idiom — G7) + the AnimationVisualizer ball. It binds to the demo's
// contract animation (the sweep time-twin) so the scrubber + visualizer track
// the live progress; the transport emits route to the demo's machine-backed
// play/pause + scrub. The former hand-rolled Play/Pause + Reset fork is DELETED
// (no legacy beside the replacement); the dock owns Reset (it already does for
// every scene). The `ribbonContent` slot is the standard scene-extension seam
// (cube uses it for its Matrix domain verbs) — here the easing scene has no extra
// domain verbs, so the slot mounts the standard ribbon directly (the FLOOR path).
const userReversed = ref(false);

const onScrubUpdate = (v: { t: number }) => {
    const dur = demo.contractAnim.options.duration;
    if (dur > 0) demo.progress.value = Math.max(0, Math.min(1, v.t / dur));
};

const onToggleReverse = () => {
    userReversed.value = !userReversed.value;
    // Flip the contract clock's direction so the standard visualizer/scrubber
    // (which read `effectiveT = reversed ? duration - t : t`) mirror the reverse.
    demo.contractAnim.reversed = userReversed.value;
};

let wasPlayingBeforeScrub = false;
const onScrubStart = () => {
    wasPlayingBeforeScrub = demo.isPlaying.value;
    if (wasPlayingBeforeScrub) demo.pause();
};
const onScrubEnd = () => {
    if (wasPlayingBeforeScrub) demo.play();
    wasPlayingBeforeScrub = false;
};

const ribbonContent = (slotProps: { selectedControl: string }) =>
    slotProps.selectedControl === "easing"
        ? h(PlaybackRibbon, {
              animation: demo.contractAnim,
              currentT: demo.progress.value * demo.contractAnim.options.duration,
              isAnimPlaying: demo.isPlaying.value,
              isAnimStarted: true,
              userReversed: userReversed.value,
              onTogglePlay: () => demo.togglePlay(),
              onToggleReverse,
              onSliderUpdate: onScrubUpdate,
              onScrubStart,
              onScrubEnd,
          })
        : null;

defineExpose({
    animationGroup: computed(() => demo.animationGroup),
    superKey: SUPER_KEY,
    isPlaying,
    isStarted,
    // The easing preview auto-plays on first visit (the former isPlaying =
    // ref(true)). The App reads this on SCENE_READY to dispatch PLAY for a fresh
    // scene, so the machine reaches `playing` and the raw-rAF loop (gated on the
    // machine) actually sweeps.
    autoPlays: true,
    // The raw-rAF ScenePlayback adapter — the App registers it with the machine
    // on SCENE_READY so easing's progress/isPlaying round-trip through the
    // CONTRACT (the literal D12 repro; proof:scene-contract-identity).
    scenePlayback: demo.scenePlayback,
    tabsContent,
    ribbonContent,
});
</script>
