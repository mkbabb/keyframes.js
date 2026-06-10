<template>
    <div class="flex h-full w-full flex-col items-center justify-center gap-3 px-6 lg:px-8">
        <!-- View switcher (H.W5.S3): one spring curve, two views — the live
             SpringProgress solver, and that same spring linear() easing a real
             @starting-style / allow-discrete transition (the former standalone
             Discrete scene, merged here in one motion). -->
        <div
            class="spring-view-switch glass-resting cartoon-surface flex shrink-0 gap-1 rounded-full p-1"
            role="tablist"
            aria-label="Spring view"
        >
            <button
                type="button"
                role="tab"
                class="spring-view-tab text-small btn-interactive rounded-full px-3.5 py-1"
                :class="{ 'spring-view-active': demo.view.value === 'solver' }"
                :aria-selected="demo.view.value === 'solver'"
                @click="demo.view.value = 'solver'"
            >
                Live solver
            </button>
            <button
                type="button"
                role="tab"
                class="spring-view-tab text-small btn-interactive rounded-full px-3.5 py-1"
                :class="{ 'spring-view-active': demo.view.value === 'discrete' }"
                :aria-selected="demo.view.value === 'discrete'"
                @click="demo.view.value = 'discrete'"
            >
                Discrete transition
            </button>
        </div>

        <div class="min-h-0 w-full flex-1">
            <SpringTarget v-if="demo.view.value === 'solver'" />
            <StartingStyleTarget v-else />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, h, provide, ref } from "vue";
import { TabsContent, TabsTrigger, Button } from "@mkbabb/glass-ui";
import { Eye, EyeOff, Shuffle } from "@lucide/vue";

import { getStoredAnimationGroupControlOptions } from "@components/custom/animation-controls/stores";
import PlaybackRibbon from "@components/custom/animation-controls/controls/PlaybackRibbon.vue";

import SpringTarget from "../../spring/SpringTarget.vue";
import StartingStyleTarget from "../../spring/StartingStyleTarget.vue";
import SpringSidebar from "../../spring/SpringSidebar.vue";
import { useSpringDemo } from "../../spring/useSpringDemo";
import { SPRING_DEMO_KEY } from "../../spring/springKeys";

const SUPER_KEY = "Spring";

const demo = useSpringDemo();
provide(SPRING_DEMO_KEY, demo);

// The spring scene's ONLY valid control surface is `spring` (the control-surface
// DFA, H.W11.S4 / I2 — `CONTROL_SURFACES.spring = ['spring']`). The dock + the
// in-panel tab host render the triad FROM that table, so the built-in
// controls/keyframes/timeline triggers no longer exist for this scene — reka
// CANNOT fall back to a non-existent `controls` tab.
//
// I.W2.S1 — the former `storedControls.selectedControl = "spring"` setup POKE is
// DELETED (no legacy beside the replacement). The selected surface is now a
// machine-projected single authority (bound to the `<Tabs> :model-value` in
// AnimationControls) so the panel is born-selected on switch-in (the B4 cure
// generalizes to every single-surface scene).
const storedControls = getStoredAnimationGroupControlOptions(SUPER_KEY);
storedControls.isControlsPanelOpen = true;

// `demo.isPlaying` is a read-only projection of the machine status (the shadow
// `isPlaying` ref is DELETED, H.W1). The bottom-bar play button routes through
// the App's onPlayStateChange → the machine; the ribbon reads this.
const isPlaying = demo.isPlaying;
const isStarted = ref(true);

const tabsTrigger = (_slotProps: { selectedAnimation: string }) =>
    h(
        TabsTrigger,
        {
            value: "spring",
            class: "tab-trigger-base tab-trigger-underline",
        },
        { default: () => "Spring" },
    );

// I.W2.S2 — `force-mount` the sole `TabsContent` (the construction-time floor).
// The spring scene has a SINGLE valid surface (`['spring']`), so `present` must
// not be gated on reka's `isSelected` race — `force-mount` makes the single
// surface immune to the latch BY CONSTRUCTION (the same belt easing carries).
const tabsContent = () =>
    h(
        TabsContent,
        { value: "spring", class: "h-full", forceMount: true },
        { default: () => h(SpringSidebar, { demo }) },
    );

// G3 + G7 (H.W10.S2) — the spring scene's PRIMARY playback transport is the
// STANDARD PlaybackRibbon (the SAME component cube/amiga mount): a scrubber +
// equal-size Play/Reverse on the shared `.btn-playback` skin + the visualizer
// ball, bound to the demo's contract animation (the sweep time-twin). The former
// hand-rolled Play/Pause + Reset fork is DELETED; the dock owns Reset.
//
// SPRING'S LEGITIMATE DOMAIN VERBS REMAIN as ribbonContent extras (the cube
// model — domain controls beside the standard transport; the harden caveat): the
// solver view keeps Re-seat (flip the spring target), the discrete view keeps
// Reveal/Dismiss (toggle the @starting-style card). The discrete view is a CSS
// transition toggle, NOT a sweep, so the standard sweep transport doesn't apply
// there — its domain verb is the primary control for that face.
const userReversed = ref(false);

const onScrubUpdate = (v: { t: number }) => {
    const dur = demo.contractAnim.options.duration;
    if (dur > 0) demo.progress.value = Math.max(0, Math.min(1, v.t / dur));
};

const onToggleReverse = () => {
    userReversed.value = !userReversed.value;
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

const standardRibbon = () =>
    h(PlaybackRibbon, {
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
    });

// The ribbon is view-aware (H.W5.S3): the live-solver view shows the STANDARD
// transport plus the Re-seat domain verb; the discrete view shows the Reveal/
// Dismiss domain verb — the bottom bar stays meaningful for whichever face of the
// one spring is on stage.
const ribbonContent = (slotProps: { selectedControl: string }) => {
    if (slotProps.selectedControl !== "spring") return null;

    if (demo.view.value === "discrete") {
        return h("div", { class: "grid grid-cols-1 gap-2 w-full" }, [
            h(
                Button,
                {
                    variant: "outline",
                    class: "btn-playback btn-playback-accent",
                    onClick: () => demo.toggleDiscrete(),
                },
                {
                    default: () => [
                        h("span", null, demo.visible.value ? "Dismiss" : "Reveal"),
                        demo.visible.value
                            ? h(EyeOff, { class: "w-4 h-4" })
                            : h(Eye, { class: "w-4 h-4" }),
                    ],
                },
            ),
        ]);
    }

    return h("div", { class: "grid gap-2 w-full" }, [
        standardRibbon(),
        // Re-seat — the spring's domain "go" verb (flip the chase target), beside
        // the standard transport (the permitted ribbonContent domain extra).
        h(
            Button,
            {
                variant: "outline",
                class: "h-8 w-full rounded-full gap-2 text-body btn-interactive",
                onClick: () => demo.toggleTarget(),
            },
            {
                default: () => [
                    h("span", null, "Re-seat"),
                    h(Shuffle, { class: "w-4 h-4" }),
                ],
            },
        ),
    ]);
};

defineExpose({
    animationGroup: computed(() => demo.animationGroup),
    superKey: SUPER_KEY,
    isPlaying,
    isStarted,
    // The spring preview auto-plays on first visit (the former isPlaying =
    // ref(true)). The App reads this on SCENE_READY to dispatch PLAY for a fresh
    // scene, so the machine reaches `playing` and the raw-rAF loop (gated on the
    // machine) actually sweeps.
    autoPlays: true,
    // The raw-rAF ScenePlayback adapter — the App registers it with the machine
    // on SCENE_READY so the spring's sweep phase/isPlaying round-trip through the
    // CONTRACT (the spring↔cube cross-pair the group gate misses).
    scenePlayback: demo.scenePlayback,
    tabsTrigger,
    tabsContent,
    ribbonContent,
});
</script>

<style scoped>
/* The view switcher (H.W5.S3) — a compact segmented control. Rides the shared
   glass-resting/cartoon-surface depth idiom; the active tab takes the progress
   accent the spring scene uses throughout. */
.spring-view-switch {
    align-self: center;
}
.spring-view-tab {
    color: var(--muted-foreground);
    transition:
        color var(--duration-fast, 150ms) ease,
        background-color var(--duration-fast, 150ms) ease;
}
.spring-view-active {
    color: var(--color-progress);
    background: color-mix(in srgb, var(--color-progress) 14%, transparent);
    box-shadow: 0 0 0 1px var(--color-progress) inset;
}
</style>
