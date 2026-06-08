<template>
    <div class="flex h-full w-full items-center justify-center">
        <EasingTarget />
    </div>
</template>

<script setup lang="ts">
import { computed, h, nextTick, onMounted, provide, ref } from "vue";
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

// Always default to the Easing tab when entering this scene
const storedControls = getStoredAnimationGroupControlOptions(SUPER_KEY);
storedControls.selectedControl = "easing";
storedControls.isControlsPanelOpen = true;

// The Easing controls tab is provided via the `tabs-content` SLOT, so reka's
// <Tabs> registers it AFTER its own controls/keyframes/timeline children. When
// the slotted `easing` TabsContent registers a tick later than reka's init read
// of `selectedControl`, reka falls back to its first built-in tab (`controls`)
// and does not re-evaluate. Re-assert the default AFTER mount + a tick so the
// `easing` tab is selected deterministically once its content is registered —
// the "always default to the Easing tab" intent, made order-independent.
onMounted(() => {
    nextTick(() => {
        storedControls.selectedControl = "easing";
    });
});

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

const tabsContent = () =>
    h(
        TabsContent,
        { value: "easing", class: "h-full" },
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
