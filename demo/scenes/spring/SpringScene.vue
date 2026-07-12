<template>
    <!-- J.W7a S5 / XH-4 (D22) — the view switcher (H.W5.S3) RELOCATES out of
         the top-center band into the RAIL (SpringSidebar's head): the floating
         pill above the stage card stacked into the SAME band the scene-switcher
         dock occupies and collided with it on mobile (cross-hierarchy #4,
         `spring-mobile.png`). The top-center band now has ONE occupant; the
         view fork lives with the spring's other controls. -->
    <div class="flex h-full w-full flex-col items-center justify-center px-6 lg:px-8">
        <div class="min-h-0 w-full flex-1">
            <SpringTarget v-if="demo.view.value === 'solver'" />
            <StartingStyleTarget v-else />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, h, provide, ref } from "vue";
import { Button } from "@mkbabb/glass-ui";
import { Eye, EyeOff, Shuffle } from "@lucide/vue";

import PlaybackRibbon from "@components/instrument/transport/controls/PlaybackRibbon.vue";

import SpringTarget from "./SpringTarget.vue";
import StartingStyleTarget from "./StartingStyleTarget.vue";
import SpringPhysicsFacet from "./SpringPhysicsFacet.vue";
import { useSpringDemo } from "./useSpringDemo";
import { SPRING_DEMO_KEY, SPRING_SCENE_ID } from "./springKeys";

const SCENE_ID = SPRING_SCENE_ID;

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
//
// S.G1 S1c (p10 F4 — writer c) — the former `storedControls.isControlsPanelOpen =
// true` born-open POKE is DELETED too (the last dead write of the three-writer
// chain). On mobile the sheet is born at peek by the host mount-reset
// (useSheetState); on desktop the shell force-opens the rail
// (useSceneMachineShellBinding, ≥1024px-gated). The scene pokes nothing.

// `demo.isPlaying` is a read-only projection of the machine status (the shadow
// `isPlaying` ref is DELETED, H.W1). The bottom-bar play button routes through
// the App's onPlayStateChange → the machine; the ribbon reads this.
const isPlaying = demo.isPlaying;
const isStarted = ref(true);

// J.W2 S2 (S4-stretch) — the panel mounts FLAT. The spring scene has a SINGLE
// valid surface (`['spring']`), so the `<Tabs>`/`TabsContent` machinery (the
// former `force-mount` belt against reka's model-value latch, and the trigger
// that never rendered under the dock-managed shell) is dead weight — the
// structural source of the `selectedControl` double role
// (`audit/wave-I.W2.md §6`). AnimationControls renders this slot directly for
// single-surface scenes: no model-value to project, no latch to race — the
// panel is mounted BY CONSTRUCTION. The TabsTrigger/TabsContent wrappers are
// DELETED in the same motion (no legacy beside the replacement).
const tabsContent = () => h(SpringPhysicsFacet, { demo });

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
    const dur = demo.springEditAnim.options.duration;
    // K.W4 S2 + F5 — route the scrub through `scrubTo` (the ONE continuous seam):
    // it moves the thumb + the visualizer + the live ball together AND works
    // while idle (scrub-while-idle — the playhead is set without play first). The
    // former `demo.progress.value = …` wrote only the 6 Hz text mirror, so an
    // idle scrub repainted nothing.
    if (dur > 0) demo.scrubTo(v.t / dur);
};

const onToggleReverse = () => {
    userReversed.value = !userReversed.value;
    demo.springEditAnim.reversed = userReversed.value;
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
        // T.B1-β/T.B7 — the ribbon binds the Sweep CHANNEL's REAL animation
        // (`springEditAnim`, the two-way KeyframesEditor animation whose clock
        // is the sweep time-twin) — the opacity decoy `contractAnim` is DEAD.
        animation: demo.springEditAnim,
        // K.W4 S2 — the scrubber thumb reads the CONTINUOUS 60 Hz position
        // channel (`scrubberPhase`), NOT the 6 Hz `progress` text mirror that
        // made the thumb visibly STEP (live-spring-sequence-mp-verdict.md §2). A
        // single position read per frame moves only the thumb (the badges ride
        // the 6 Hz throttle elsewhere) — the slider is born-continuous.
        currentT:
            demo.scrubberPhase.value * demo.springEditAnim.options.duration,
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
    // T.B1-β/T.B7 — the SceneFacility descriptor (Sweep + Entry channels, the
    // `spring` facet, the raw-rAF playback). The decoy `animationGroup` expose
    // is DELETED with the contract-group decoy; the shell binds the facility.
    facility: computed(() => demo.facility),
    superKey: SCENE_ID,
    isPlaying,
    isStarted,
    // T.G3 — the scene RESTS on entry (no auto-play). VERDICT #19: the spring
    // sampler swept forever at idle, burning ~33% of a core (90 layouts/s) with
    // no gesture ("god awful"). The raw-rAF loop gates on
    // `machine.status === 'playing'`, so a paused-on-entry machine leaves the loop
    // un-armed → zero rAF ticks, zero style recalc/layout at rest
    // (proof:perf-counters). The sampler sweeps + the ball springs the instant the
    // user presses Play (or taps the rail — `reseat` re-arms the loop directly).
    autoPlays: false,
    // The raw-rAF ScenePlayback adapter — the App registers it with the machine
    // on SCENE_READY so the spring's sweep phase/isPlaying round-trip through the
    // CONTRACT (the spring↔cube cross-pair the group gate misses).
    scenePlayback: demo.scenePlayback,
    tabsContent,
    ribbonContent,
});
</script>

<!-- J.W7a S5 / XH-4 (D22) — the `.spring-view-*` switcher rules moved WITH the
     markup into SpringSidebar.vue (no legacy beside the replacement). -->
