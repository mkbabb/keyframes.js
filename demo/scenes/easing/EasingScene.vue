<template>
    <div class="flex h-full w-full items-center justify-center">
        <EasingTarget />
    </div>
</template>

<script setup lang="ts">
import { computed, h, provide, ref } from "vue";

import PlaybackRibbon from "@components/playback/PlaybackRibbon.vue";

import EasingTarget from "./EasingTarget.vue";
import EasingSidebar from "./EasingSidebar.vue";
import { useEasingDemo } from "./useEasingDemo";
import { EASING_DEMO_KEY, EASING_SCENE_ID } from "./easingKeys";

const SCENE_ID = EASING_SCENE_ID;

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
    const dur = demo.previewAnim.options.duration;
    if (dur > 0) demo.progress.value = Math.max(0, Math.min(1, v.t / dur));
};

const onToggleReverse = () => {
    userReversed.value = !userReversed.value;
    // Flip the preview clock's direction so the standard visualizer/scrubber
    // (which read `effectiveT = reversed ? duration - t : t`) mirror the reverse.
    demo.previewAnim.reversed = userReversed.value;
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
              // T.B1-β — the ribbon binds the REAL preview channel animation
              // (its timingFunction IS the edited easing); the decoy is DEAD.
              animation: demo.previewAnim,
              currentT: demo.progress.value * demo.previewAnim.options.duration,
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
    // T.B1-β — the SceneFacility descriptor (the ONE real preview channel, the
    // `easing` facet, the raw-rAF playback). The decoy `animationGroup` expose
    // is DELETED with the contract-group decoy; the shell binds the facility.
    facility: demo.facility,
    superKey: SCENE_ID,
    isStarted,
    // T.G3 — the scene RESTS on entry (no auto-play). VERDICT #19: a scene that
    // sweeps forever with no gesture burned a full core at idle ("god awful").
    // The raw-rAF loop gates on `machine.status === 'playing'`, so a paused-on-
    // entry machine leaves the loop un-armed → zero rAF ticks, zero style recalc
    // at rest (proof:perf-counters). The preview sweeps the instant the user
    // presses Play (the dock/Space transport); the composed first frame stands
    // still until then.
    autoPlays: false,
    // The raw-rAF ScenePlayback adapter — the App registers it with the machine
    // on SCENE_READY so easing's progress/isPlaying round-trip through the
    // CONTRACT (the literal D12 repro; proof:scene-contract-identity).
    tabsContent,
    ribbonContent,
});
</script>
