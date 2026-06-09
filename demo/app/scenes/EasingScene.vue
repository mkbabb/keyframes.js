<template>
    <div class="flex h-full w-full items-center justify-center">
        <EasingTarget />
    </div>
</template>

<script setup lang="ts">
import { computed, h, provide, ref } from "vue";
import { TabsContent, TabsTrigger } from "@mkbabb/glass-ui";

import { getStoredAnimationGroupControlOptions } from "@components/custom/animation-controls/stores";
import PlaybackRibbon from "@components/custom/animation-controls/controls/PlaybackRibbon.vue";

import EasingTarget from "../../easing/EasingTarget.vue";
import EasingSidebar from "../../easing/EasingSidebar.vue";
import { useEasingDemo } from "../../easing/useEasingDemo";
import { EASING_DEMO_KEY } from "../../easing/easingKeys";

const SUPER_KEY = "Easing";

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
const storedControls = getStoredAnimationGroupControlOptions(SUPER_KEY);
storedControls.isControlsPanelOpen = true;

// `demo.isPlaying` is now a read-only projection of the machine status (the
// shadow `isPlaying` ref is DELETED, H.W1). The bottom-bar play button routes
// through the App's onPlayStateChange → the machine; the ribbon reads this.
const isPlaying = demo.isPlaying;
const isStarted = ref(true);

const extraControlTabs = computed(() => [
    { value: "easing", label: "Easing", icon: "Activity" },
]);

const tabsTrigger = (_slotProps: { selectedAnimation: string }) =>
    h(
        TabsTrigger,
        {
            value: "easing",
            class: "tab-trigger-base tab-trigger-underline",
        },
        { default: () => "Easing" },
    );

// I.W2.S2 — `force-mount` the sole `TabsContent` (the construction-time floor).
// The easing scene has a SINGLE valid surface (`['easing']`), so there is no
// other panel to switch to — `present` must NOT be gated on reka's `isSelected`
// race at all. `force-mount` (the same escape AnimationControls uses for the
// Monaco keyframes pane) makes this single-surface panel immune to the latch BY
// CONSTRUCTION: the EasingSidebar's curve canvas + dropdown are ALWAYS mounted
// regardless of the `<Tabs>` model-value latch. S1 makes the model-value born
// correct; S2 is the belt that can't go wrong for the single-surface case.
const tabsContent = () =>
    h(
        TabsContent,
        { value: "easing", class: "h-full", forceMount: true },
        { default: () => h(EasingSidebar, { demo }) },
    );

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
    tabsTrigger,
    tabsContent,
    ribbonContent,
    extraControlTabs,
});
</script>
