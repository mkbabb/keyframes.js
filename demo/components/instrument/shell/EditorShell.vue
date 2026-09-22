<template>
    <div
        class="editor-shell relative grid h-dvh max-h-dvh w-dvw overflow-hidden place-items-center bg-background"
    >
        <!-- T.D13 (OD-2) — the ambient-backdrop seam. DOM-ordered BEFORE the
             grid-background so a host-supplied wash (the home hero's Aurora)
             paints over the bg-background field but UNDER the graph-paper ink
             lines — the wash tints the paper; the lines stay crisp. Empty by
             default (no layer, no cost). -->
        <slot name="backdrop"></slot>
        <div
            v-if="gridBackground"
            class="grid-background pointer-events-none fixed inset-0 h-dvh w-dvw"
        ></div>

        <!-- X.KF.W13T.k3 · R-k-1 (COHESION §0ar, OA-6) — THE HEADER RIBBON IS
             RETIRED, at every viewport. The app had TWO chromes: at 390 the
             expanded top dock and this ribbon (Share · Keyboard shortcuts ·
             theme) painted over each other. There is one chrome now — the three
             controls ride `ChromeDock` as its "App" group on the producer's dock
             family (fourier's AppDock idiom, F.W11), with their accessible names
             unchanged, and the shortcuts dialog + the `?` shortcut moved WITH
             the control that opens them (one home per control). The shell keeps
             no header slots: nothing filled them. -->

        <Transition name="fade" appear>
            <!-- T.D9 (OD-4) — the start screen rides z-controls (above the
                 scene subject, below the docks): the φ-band hero deliberately
                 OVERLAPS the die ("it's OK if it sits a bit on top of the
                 cube") and the ink must PRINT OVER the subject
                 deterministically — at z-content the paint order fell to DOM
                 order and the mobile die occluded the glyphs. pointer-events
                 stays none: gestures pass through to the subject.
                 KF-EST-19 — THE DEFAULT-SLOT FALLBACK IS DELETED. It was
                 unreachable (`App.vue` supplies `#start-screen`
                 unconditionally) AND it DIVERGED from the live call by dropping
                 `hint`, so the only way it could ever have fired was as a
                 silent change to the page — dead code whose one behaviour was
                 to be wrong. The slot stays; its content is the app's.
                 KF-EST-20 — `flex items-center justify-center` is deleted with
                 it: a flex container cannot lay out an ABSOLUTELY POSITIONED
                 child, and the hero band is exactly that, so the three
                 utilities centred nothing. `absolute inset-0` and `z-controls`
                 STAY and are load-bearing: this box is the hero band's
                 containing block (its whole `top` derivation is measured from
                 here) and the stacking context the band paints inside. -->
            <div v-if="showStartScreen" class="absolute inset-0 z-controls pointer-events-none">
                <slot name="start-screen"></slot>
            </div>
        </Transition>

        <!-- The single <main> landmark (lighthouse landmark-one-main). A REAL
             layout box — not `display:contents`, which strips the box AND the
             implicit `main` role from the a11y tree. `place-self-stretch` fills
             the grid's single center cell (the full viewport the `contents`
             wrapper transparently passed through); `grid place-items-center`
             re-centers the AnimationControlsGroup work area exactly as the
             shell root did before — byte-identical layout, real landmark box. -->
        <!-- KF-SKEL-1 — THE PERSISTENT SCENE ANNOUNCER (W6-M). The skeleton's
             own `role="status"` region was born INSIDE the `<Suspense>` and died
             with it: a live region that does not exist before its text changes
             presents no announcement window at all, which is why putting text
             into that region was ruled INSUFFICIENT. The announcer therefore
             lives HERE — above `.scene-host` (App.vue's swap host, three levels
             down through `#animation-content`) in the one wrapper that outlives
             every suspension: the shell mounts once for the app's life, while
             `AnimationControlsGroup` below is `:key`ed to `superKey` and
             remounts on every swap. The in-tree idiom is `CopyButton.vue`'s
             sr-only `role="status" aria-live="polite"` span, which likewise
             persists across its own updates. The transient fallback now WRITES
             here through `SCENE_ANNOUNCER_KEY` instead of carrying a region of
             its own, so the mount ("Loading scene") and the resolve ("Scene
             ready") are two text changes inside ONE region that was already in
             the accessibility tree. SR speech capture is KF.W9 / SS-13's. -->
        <span class="sr-only" role="status" aria-live="polite">{{ sceneStatus }}</span>

        <main class="grid place-items-center place-self-stretch">
        <AnimationControlsGroup
            :key="superKey ?? ''"
            :animation-group="animationGroup"
            :channels="channels"
            :super-key="superKey"
            :auto-play="autoPlay"
            :hide-controls="showStartScreen"
            :stage-mode="stageMode"
            :has-control-surfaces="hasControlSurfaces"
            @play-state-change="onPlayStateChange"
            @start-state-change="(s: boolean) => emit('startStateChange', s)"
        >
            <template #tabs-content>
                <slot name="tabs-content"></slot>
            </template>

            <template #ribbon-content="slotProps">
                <slot name="ribbon-content" v-bind="slotProps"></slot>
            </template>

            <template #animation-content>
                <slot name="target"></slot>
            </template>
        </AnimationControlsGroup>
        </main>

    </div>
</template>

<script lang="ts">
import type { InjectionKey } from "vue";

/**
 * KF-SKEL-1 — the scene announcer's provide key. The PROVIDER owns the key (the
 * demo's own `*Keys.ts` convention, inlined here because the announcer has no
 * other consumer): the shell supplies the persistent live region and the
 * transient `<Suspense>` fallback writes one line into it. `inject`ing it is
 * OPTIONAL by contract — a standalone host that mounts `SceneSkeleton` without
 * this shell simply announces nothing rather than throwing.
 */
export const SCENE_ANNOUNCER_KEY: InjectionKey<(message: string) => void> =
    Symbol("scene-announcer");
</script>

<script setup lang="ts">
import { provide, ref } from "vue";

import { initIOSPlatformClass } from "@components/instrument/utils/iosTextEntry";
import AnimationControlsGroup from "@components/instrument/transport/AnimationControlsGroup.vue";

import type { AnimationGroup } from "@mkbabb/keyframes.js";
import type { TransportChannel } from "@components/instrument/transport/transportSource";

import "@styles/style.css";

initIOSPlatformClass();

const props = withDefaults(
    defineProps<{
        animationGroup: AnimationGroup<any>;
        // T.B1-β STAGE 1 — the active scene's `SceneFacility.channels`,
        // forwarded to the transport as the whole channel axis (labels + host
        // mounts + scrub round-trip). `undefined` for a non-migrated scene / a
        // standalone host → the transport falls back to the group's keys.
        // `| undefined` is explicit because the App BINDS an `undefined` value
        // (App.vue:35, `currentChannels`) rather than omitting the attribute, and
        // `exactOptionalPropertyTypes` distinguishes the two.
        channels?: TransportChannel[] | undefined;
        // `| undefined` is explicit: `withDefaults` below declares
        // `superKey: undefined` as this prop's own default.
        superKey?: string | undefined;
        showStartScreen?: boolean;
        gridBackground?: boolean;
        autoPlay?: boolean;
        // T.B8 — the `machinePlaying` prop is RETIRED. It existed only to sync
        // the transport's former private `isPlaying` shadow to the machine (the
        // S.A0 stale-`false` race); `useAnimationGroupPlayback` now derives
        // `isPlaying` DIRECTLY from `machine.status`, so there is no shadow to
        // sync — the edge is redundant and gone.
        // The mobile STAGE mode-class (H.W7.S1c) — `subject` full-bleeds the
        // stage behind the sheet; `editor`/`storyboard` keep a content card.
        // Typed as the union inline (the shared `@` subtree owns its own
        // contract; the app passes `currentScene.stageMode` from the descriptor).
        stageMode?: "subject" | "editor" | "storyboard";
        // J.W7a S5 / XH-1 (D20) — the active scene's DFA control-surface set is
        // non-empty. `false` collapses the [rail] track + hides the pane wrapper
        // (the ghost-rail kill). The App passes the machine projection; a
        // non-App host (the playground) takes the TRUE default — rail unchanged.
        hasControlSurfaces?: boolean;
    }>(),
    {
        superKey: undefined,
        showStartScreen: true,
        gridBackground: true,
        autoPlay: false,
        stageMode: "subject",
        hasControlSurfaces: true,
    },
);

const emit = defineEmits<{
    (e: "playStateChange", playing: boolean): void;
    (e: "startStateChange", started: boolean): void;
}>();


// KF-SKEL-1 — the announcer's one piece of state. Empty at boot so nothing is
// spoken on first paint; the fallback sets it on mount and clears it to the
// resolved line on unmount.
const sceneStatus = ref("");
provide(SCENE_ANNOUNCER_KEY, (message: string) => {
    sceneStatus.value = message;
});

const onPlayStateChange = (playing: boolean) => {
    emit("playStateChange", playing);
};


</script>

<style scoped>
/* dvh fallback (W3.S3) — the shell + grid background size with the `dvh`
   dynamic-viewport unit (h-dvh / max-h-dvh on the root, h-dvh on the grid).
   On a browser without `dvh` support (older Safari/Firefox) those rules drop
   silently and the shell mis-sizes. This @supports-not path supplies the
   static-viewport `vh` baseline so the shell still fills the screen there. On
   any `dvh`-capable browser this block does not apply — the happy path is
   byte-identical. */
@supports not (height: 100dvh) {
    /* A browser without `dvh` also lacks `dvw` (same spec) — supply the static
       `vw` width baseline alongside the height so the shell does not mis-size
       horizontally either. */
    .editor-shell {
        height: 100vh;
        max-height: 100vh;
        width: 100vw;
    }
    .grid-background {
        height: 100vh;
        width: 100vw;
    }
}

/* J.W7a S4 (D19 — the W6-3 substrate-depth fold, the terminal verdict).
   The former substrate was a single 1rem corner-tick data-URI at 0.10α (+ a
   duplicated dark twin) — "at display zoom it reads as off-white texture, not
   a designed grid" (pane-home H4; cross-grid-math C5), leaving the glass plate
   nothing to refract against (the I.W6 S3 deferral, wave-I.W6.md §6 W6-3).
   REPLACED (no legacy beside the replacement — both data-URIs die) by a
   deliberate two-tier engineering graph paper: fine lines at --graph-pitch
   (1rem) + bolder major lines at --graph-major (5rem), all four layers reading
   the demo-owned --graph-* tokens (design-idioms.css). The lines mix over
   --foreground, so the dark theme retints from the SAME rules — the duplicated
   dark data-URI is retired with its light twin. The major layer's
   --graph-major-opacity deliberately resolves above the former 0.10α floor:
   the substrate is PRESENT and legible behind the glass plate (the §Hard-gate
   clause-g legibility assertion — W6-3 exits on a runtime clause, never
   deferred again).

   KF-SKEL-20 (W6-N, re-homed from KF.W5) — THE NUMBER IS NOT RESTATED HERE, and
   the reason is that restating it is exactly what went wrong. Two tokens were
   carrying THREE different numbers inside a comment that calls itself a
   hard-gate legibility assertion: this prose said the major tier was 12%, the
   `var()` fallbacks below said 5% / 12%, and the DECLARATIONS
   (`design-idioms.css`, `--graph-opacity` / `--graph-major-opacity`) said
   3% / 11%. An assertion about a floor cannot be audited when the floor is
   spelled three ways, so the cure gives the pair ONE authority instead of a
   fourth spelling: the fallbacks are deleted (both tokens are declared at
   `:root` in a sheet this shell imports, so the defaults were unreachable
   anyway and existed only to drift), and this comment now names the tokens and
   the relation — major ABOVE the 10% floor — with the magnitudes read from the
   declaration at use. Same defect class as KF-SKEL-14 one component up: a
   comment either becomes true or is deleted. */
.grid-background {
    --graph-line-fine: color-mix(
        in srgb,
        var(--foreground) var(--graph-opacity),
        transparent
    );
    --graph-line-major: color-mix(
        in srgb,
        var(--foreground) var(--graph-major-opacity),
        transparent
    );
    background-image:
        linear-gradient(to right, var(--graph-line-major) 1px, transparent 1px),
        linear-gradient(to bottom, var(--graph-line-major) 1px, transparent 1px),
        linear-gradient(to right, var(--graph-line-fine) 1px, transparent 1px),
        linear-gradient(to bottom, var(--graph-line-fine) 1px, transparent 1px);
    background-size:
        var(--graph-major) var(--graph-major),
        var(--graph-major) var(--graph-major),
        var(--graph-pitch) var(--graph-pitch),
        var(--graph-pitch) var(--graph-pitch);
    background-repeat: repeat;
}
</style>
