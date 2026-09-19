<template>
    <!-- J.W7a S5 / XH-4 (D22) — the view switcher (H.W5.S3) RELOCATED out of
         the top-center band: the floating pill above the stage card stacked
         into the SAME band the scene-switcher dock occupies and collided with
         it on mobile (cross-hierarchy #4, `spring-mobile.png`). The top-center
         band now has ONE occupant.
         KF-SS-31 (W6-N, re-homed from KF.W5) — COMMENT ROT, and the
         destination named here was the load-bearing half: this said the fork
         moved into the head of a spring "sidebar" component, and **no file of
         that name exists at any path in this repository** — a `git ls-tree -r
         --name-only HEAD` census for it returns nothing, at this clock as at
         the spec's. Eleven comments across seven files still route a
         reader to it. A route to a file that does not exist is worse than no
         route: it costs the next reader a search that cannot terminate. The
         destination is dropped rather than replaced with a guess — what is
         TRUE and checkable is the negative (the band has one occupant), and
         the fork's live home is whatever `demo.view` is bound from. -->
    <!-- SEAT CENSUS RE-PIN, and it MOVES: the banked figure for that phantom
         name is 12 comment sites / 8 files, measured at `origin/master`
         `81a56990`.
         Re-measured at this seat's bytes it is **11 sites / 7 files** — the
         twelfth died with `KfPillTabs.vue` in this wave's own S-1 delete
         family, so the drop is a CURE's consequence, not a contradiction. The
         re-pin and `G-W6-10`'s witness column are ONE FIGURE (the wave's
         PROPAGATION LOCK: a correction of either updates both in the same
         motion), and the unit's receipt carries both ends. Of the eleven,
         FIVE are cured in this commit (two here, three in
         `StartingStyleTarget.vue`); the remaining six are DECLARED, never
         silently cured, because their files are outside this unit's writable
         set: `KeyframesEditor.vue` ×2, `SpringHeatmap.vue`,
         `SpringPhysicsFacet.vue` (this wave's §Bounds, another unit's), and
         `useSpringHotPath.ts`, `useSpringLinearStops.ts` (outside §Bounds
         entirely — they route to KF.W0's re-count law). -->
    <!-- KF-SS-38 — POST-KILL RESIDUE, recorded and deliberately NOT acted on.
         The row's parent claim — that "Re-seat" names the wrong operation —
         is a seat-ratified KILL: `toggleTarget` IS
         `reseat(target.value > 0.5 ? 0 : 1)` (`useSpringDemo.ts`, re-read this
         seat), so the verb is exactly right and the sweep must not resurrect
         the claim. What survives is a COPY question and only that: "Re-seat"
         is jargon the on-stage copy never teaches, and the ribbon's own button
         is where a reader first meets it. Changing user-facing copy is a
         design decision this wave does not hold (the KF-EST-7 class,
         NO-WAVE-OWNER), so the question is written down and the label is left
         exactly as the owner blessed it. -->
    <!-- KF-SS-27 — `items-center` and `justify-center` are DELETED as no-ops:
         this is a flex COLUMN whose single child is `w-full flex-1`, so
         cross-axis centring has nothing to centre and main-axis centring has
         nothing to distribute. Dead layout classes on a scene's only markup are
         worse than none — the next reader reasons about a layout that is not
         happening. -->
    <div class="flex h-full w-full flex-col px-6 lg:px-8">
        <div class="min-h-0 w-full flex-1">
            <SpringTarget v-if="demo.view.value === 'solver'" />
            <StartingStyleTarget v-else />
        </div>
    </div>
</template>

<script setup lang="ts">
import { h, provide, ref } from "vue";
// KF-SS-29 — the SUBPATH, not the root barrel. `./button` is published (a 71-byte
// re-export) and the sibling file in this very directory already imports that
// way, so the root-barrel import here was a per-file divergence rather than a
// house choice. (The weight argument is dead — the barrel is side-effect-free
// except for CSS and tree-shakes to parity — which is exactly why the row is
// about idiom consistency and nothing else.)
import { Button } from "@mkbabb/glass-ui/button";
import { Eye, EyeOff, Shuffle } from "@lucide/vue";

import PlaybackRibbon from "@components/playback/PlaybackRibbon.vue";

import SpringTarget from "./SpringTarget.vue";
import StartingStyleTarget from "./StartingStyleTarget.vue";
import SpringPhysicsFacet from "./SpringPhysicsFacet.vue";
import { useSpringDemo } from "./useSpringDemo";
import { SPRING_DEMO_KEY, SPRING_SCENE_ID } from "./springKeys";

// KF-SS-34 — the one-use `SCENE_ID` alias is deleted; `SPRING_SCENE_ID` is
// already the name, already imported, and already what the rest of the file says.
const demo = useSpringDemo();
provide(SPRING_DEMO_KEY, demo);

// The spring scene's ONLY valid control surface is `spring`.
//
// KF-SS-31 — A DELETED AUTHORITY TABLE WAS CITED AS LIVE. This used to read
// "the control-surface DFA, H.W11.S4 / I2 — `CONTROL_SURFACES.spring =
// ['spring']`", naming a per-scene exclusion TABLE as the authority for the
// claim. That table is gone: `demo/state/controlSurfaces.ts` records that T.B2
// INVERTED the hand-maintained `CONTROL_SURFACES` / `CONDITIONAL_SURFACES` rows
// into a DERIVATION off the live scene facility — "COMPUTED from 'does the
// selected channel paint' — never declared per scene". So the authority for
// "one surface here" is not a row anyone can look up; it is that this scene
// paints exactly one channel, and the derivation reads it. Citing the deleted
// table made the claim look verifiable while sending its reader to a symbol the
// tree does not define. The dock + the
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
// the App's onPlayStateChange → the machine; the scrub handlers below read
// `demo.isPlaying` directly. The local `isPlaying` alias this comment used to
// introduce was read by nothing — deleted with its clause (X.KF.W4 K3).
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
        // T.B1-β/T.B7 — the ribbon binds the Sweep CHANNEL's REAL animation:
        // `springEditAnim`, the two-way KeyframesEditor animation whose clock is
        // the sweep time-twin.
        //
        // KF-SS-31 — A PHANTOM IDENTIFIER WAS NARRATED. The clause this
        // replaces ended "the opacity decoy `contractAnim` is DEAD", and
        // `contractAnim` is declared NOWHERE in `demo/`: four comments name it,
        // zero code defines it (re-measured this seat). Backticks around a
        // symbol are a promise that the reader can go and find it; a reader
        // who took this one would grep four comments narrating each other. The
        // fact worth keeping is the POSITIVE one — which animation the ribbon
        // binds and why — and it is stated above without a name only the
        // history can resolve.
        animation: demo.springEditAnim,
        // K.W4 S2 — the scrubber thumb reads the CONTINUOUS 60 Hz position
        // channel (`scrubberPhase`), NOT the 6 Hz `progress` text mirror that
        // made the thumb visibly STEP (live-spring-sequence-mp-verdict.md §2). A
        // single position read per frame moves only the thumb (the badges ride
        // the 6 Hz throttle elsewhere) — the slider is born-continuous.
        currentT:
            demo.scrubberPhase.value * demo.springEditAnim.options.duration,
        isAnimPlaying: demo.isPlaying.value,
        // KF-SS-34 / KF-ES-18 — this was a hardcoded `true` sitting beside a
        // scene-level `isStarted` ref carrying the same fact. Two authorities for
        // one boolean, and the literal is the one that would go stale first.
        isAnimStarted: isStarted.value,
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
// KF-SS-23 — THE DEAD GUARD IS GONE. This opened with
// `if (slotProps.selectedControl !== "spring") return null;`, which can never be
// true: `SPRING_SCENE_ID` is the scene's one control surface (the derivation
// reads the single painting channel — see the note above), so the parameter is
// the constant "spring" at every call. It was not merely dead, it was MISLEADING:
// it read as the live gate that decides whether this ribbon renders, which is why
// the genuinely missing gate one level up went unnoticed for as long as it did. A
// guard that cannot fire is a claim that something is being checked.
const ribbonContent = () => {
    if (demo.view.value === "discrete") {
        // KF-SS-27 — `grid-cols-1` deleted: `grid` already lays one column, and
        // the SAME construct 20 lines below was written without it. One shape.
        return h("div", { class: "grid gap-2 w-full" }, [
            h(
                Button,
                {
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
        // KF-SS-19 — the Re-seat cell wore a hand-rolled skin three lines from
        // its accent-skinned sibling, breaking the transport band's own one-voice
        // law and missing the `.btn-playback` hover family entirely. It joins the
        // band. `h-8` goes with it: the height-break arm of this row is a ruled
        // KILL because `h-8` never reached the rendered element in the first
        // place, so carrying it forward would preserve a class that does nothing
        // in the name of a defect that does not exist.
        h(
            Button,
            {
                class: "btn-playback w-full gap-2",
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
    facility: demo.facility,
    superKey: SPRING_SCENE_ID,
    isStarted,
    // T.G3 — the scene RESTS on entry (no auto-play). VERDICT #19: the spring
    // sampler swept forever at idle, burning ~33% of a core (90 layouts/s) with
    // no gesture ("god awful"). The raw-rAF loop finds NEITHER intent armed on a
    // paused-on-entry machine → zero rAF ticks, zero style recalc/layout at rest
    // (proof:perf-counters).
    //
    // KF-SS-1 / C-1 — WHAT THIS SENTENCE USED TO CLAIM AND COULD NOT DO. It read
    // "the sampler sweeps + the ball springs the instant the user presses Play
    // (or taps the rail — `reseat` re-arms the loop directly)". The parenthesis
    // was false in exactly the state this expose declares: `reseat` did arm the
    // loop, and the loop's first frame then self-terminated on
    // `machine.status !== 'playing'` before the solver ticked, so a rail tap on
    // entry moved the ghost marker and the ARIA value and left the ball parked.
    // The comment asserted the behaviour the gate forbade, and the on-stage copy
    // inherited it.
    //
    // The two intents are now distinct (`useSpringDemo`, the loop's own note):
    // PLAY-intent starts the unbounded SAMPLER SWEEP and only the transport
    // dispatches it; CHASE-intent is the rail's, runs the SOLVER to its own
    // settle, and stops itself. So: the sampler sweeps when the user presses
    // Play; the ball springs when the user taps the rail — and rest-on-entry is
    // untouched, because a scene nobody has touched has neither.
    autoPlays: false,
    // KF-SS-31 — THE ORPHANED COMMENT. What stood here described "the raw-rAF
    // ScenePlayback adapter … registered with the machine on SCENE_READY", i.e.
    // a `scenePlayback` member — which this expose does NOT carry (the adapter
    // reaches the shell as `facility.playback`, named at the top of this bag).
    // Sitting immediately above `tabsContent` it read as that entry's docblock
    // and described something else entirely. The two members below are what
    // they are: render functions the transport calls for this scene's panel and
    // ribbon content.
    tabsContent,
    ribbonContent,
});
</script>

<!-- KF-SS-31 — the second of this file's two routes to the phantom sidebar. It
     said the `.spring-view-*` switcher rules "moved WITH the markup" into that
     component's file; the file exists at no path. This component declares no
     scoped styles, and the reason is the whole of what a reader needs: the view
     switcher's markup and rules both left this scene (J.W7a S5 / XH-4 D22), so
     there is nothing here to style. -->
