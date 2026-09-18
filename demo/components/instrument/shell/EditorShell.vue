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

        <HeaderRibbon placement="right">
            <!-- KF-APP-5 (≡ EditorShell D-1/L-1/C-1) — THE CONSUMER HALF.
                 HeaderRibbon renders its actions with `inert` + `aria-hidden`
                 and zero inline-size until `expanded` (pinned || hovered ||
                 focus-within), and it opens on hover ONLY for a non-touch
                 pointer. Its `#anchor` — the one region that never collapses,
                 whose wrapper carries the producer's own pin toggle, whose
                 focusin expands the band, and into which Escape restores focus
                 (`querySelector("button, a, [tabindex]:not([tabindex='-1'])")`)
                 — was EMPTY. With nothing focusable there the ribbon had no tab
                 stop and no touch affordance at all: Share and the theme toggle
                 were keyboard- and AT-unreachable in the shell, and with the
                 dock's MbabbMenu copies keyboard-inoperable by reka
                 construction, unreachable in the app. The shortcuts modal was
                 wholly unreachable on touch (its only two routes are this
                 ribbon and the `?` shortcut).

                 The cure is to USE the API, not to fight it: one real focusable
                 control in the anchor. Tab reaches it -> focusin expands the
                 band -> the three actions leave `inert` and become tabbable;
                 tapping it pins on touch, where hover never fires; Escape now
                 has a landing target. The producer's own wrapper owns the
                 click, so this button deliberately carries NO handler. The
                 producer half — a collapsed-at-rest toolbar whose empty-anchor
                 state is unreachable by construction — rides the BH relay
                 (O-26 R-11), never a demo-side patch of the seam. -->
            <template #anchor="{ pinned }">
                <Button
                    emphasis="quiet"
                    icon-only
                    size="sm"
                    type="button"
                    :aria-pressed="pinned"
                    :aria-label="
                        pinned
                            ? 'Unpin header actions'
                            : 'Show header actions'
                    "
                    class="scale-on-hover"
                >
                    <PinOff v-if="pinned" />
                    <Pin v-else />
                </Button>
            </template>
            <template #items>
                <slot name="header-left"></slot>
                <slot name="header-right">
                    <SharePopover />
                    <!-- F.W15.S3 — the VISIBLE shortcuts-discovery trigger. The
                         19-shortcut registry was discoverable ONLY via the `?`
                         shortcut (the discoverability paradox); this breaks it
                         with one control. A plain @click on the EXISTING reka
                         Dialog state (shortcutsOpen) — the pragmatic landing for
                         the existing component; the Invoker `command="show-modal"`
                         path is the forward feature-detected idiom (BOOKed, not
                         forced — r-modern-web-2026 F-MW-1). Sits in the header
                         ribbon, not over the dock band → no occlusion (inv δ).

                         EH-8/EH-5, the ribbon's ONE SIZING DECISION: a producer
                         control's box comes from its OWN size vocabulary, never
                         from a demo width utility. `icon-only` already declares
                         square geometry at `--button-size`; the former
                         `aspect-square w-8` set only the INLINE axis (utilities
                         cascade after components), so the box was 32 × md and
                         `aspect-ratio: 1` was inert against two definite
                         dimensions. `size="sm"` asks for the rung instead —
                         `--control-h-sm` = 2.25rem, the SAME rung
                         DarkModeToggle's own base ships, so the two chrome
                         controls agree by construction rather than by
                         coincidence. Rendered ladder + glyph rungs → KF.W9. -->
                    <Tooltip>
                        <TooltipTrigger as-child>
                            <Button
                                emphasis="quiet"
                                icon-only
                                size="sm"
                                aria-label="Show keyboard shortcuts"
                                class="scale-on-hover"
                                @click="shortcutsOpen = true"
                            >
                                <Keyboard class="icon-sm" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Keyboard shortcuts (?)</TooltipContent>
                    </Tooltip>
                    <!-- EH-4 — NO `title` here. DarkModeToggle strips only
                         `class`/`type` from its attrs and spreads the rest onto
                         the same <button> that carries its own state-aware
                         `aria-label` ("Switch to light/dark mode") — a visible
                         "Toggle dark mode" tooltip beside that name is the
                         WCAG 2.5.3 Label-in-Name divergence. The producer names
                         itself; the consumer stays quiet.

                         EH-5 (same one decision as EH-8 above): the former
                         `aspect-square w-8` won the WIDTH alone — the producer's
                         `@layer components` base is
                         `--dark-mode-toggle-size: 2.25rem` with size arms for
                         sm/lg/control/dock and NO `md` arm, so a later-declared
                         utility took the inline axis and left the block axis at
                         2.25rem; with both dimensions definite `aspect-ratio: 1`
                         no-opped. The producer's own box is the box. Rendered
                         magnitude → KF.W9 SS-13. -->
                    <DarkModeToggle class="scale-on-hover" />
                </slot>
            </template>
        </HeaderRibbon>

        <Transition name="fade" appear>
            <!-- T.D9 (OD-4) — the start screen rides z-controls (above the
                 scene subject, below the docks): the φ-band hero deliberately
                 OVERLAPS the die ("it's OK if it sits a bit on top of the
                 cube") and the ink must PRINT OVER the subject
                 deterministically — at z-content the paint order fell to DOM
                 order and the mobile die occluded the glyphs. pointer-events
                 stays none: gestures pass through to the subject. -->
            <div v-if="showStartScreen" class="absolute inset-0 z-controls flex items-center justify-center pointer-events-none">
                <slot name="start-screen">
                    <EditorStartScreen />
                </slot>
            </div>
        </Transition>

        <!-- The single <main> landmark (lighthouse landmark-one-main). A REAL
             layout box — not `display:contents`, which strips the box AND the
             implicit `main` role from the a11y tree. `place-self-stretch` fills
             the grid's single center cell (the full viewport the `contents`
             wrapper transparently passed through); `grid place-items-center`
             re-centers the AnimationControlsGroup work area exactly as the
             shell root did before — byte-identical layout, real landmark box. -->
        <main class="grid place-items-center place-self-stretch">
        <AnimationControlsGroup
            :key="superKey"
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

        <KeyboardShortcutsModal
            v-model:open="shortcutsOpen"
        />
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { initIOSPlatformClass } from "@components/instrument/utils/iosTextEntry";
import { HeaderRibbon } from "@mkbabb/glass-ui/header-ribbon";
import SharePopover from "./SharePopover.vue";
import EditorStartScreen from "./EditorStartScreen.vue";
import KeyboardShortcutsModal from "./KeyboardShortcutsModal.vue";
import AnimationControlsGroup from "@components/instrument/transport/AnimationControlsGroup.vue";

import { registerShortcut } from "@mkbabb/glass-ui/keyboard";
import { DarkModeToggle } from "@mkbabb/glass-ui/dark-mode-toggle";
import { Button } from "@mkbabb/glass-ui";
import { Tooltip, TooltipContent, TooltipTrigger } from "@mkbabb/glass-ui/tooltip";
import { Keyboard, Pin, PinOff } from "@lucide/vue";
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


const shortcutsOpen = ref(false);
registerShortcut("?", () => { shortcutsOpen.value = !shortcutsOpen.value; }, { label: "Show shortcuts", group: "General" });

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
   --graph-major-opacity (12%) deliberately resolves above the former 0.10α
   floor: the substrate is PRESENT and legible behind the glass plate (the
   §Hard-gate clause-g legibility assertion — W6-3 exits on a runtime clause,
   never deferred again). */
.grid-background {
    --graph-line-fine: color-mix(
        in srgb,
        var(--foreground) var(--graph-opacity, 5%),
        transparent
    );
    --graph-line-major: color-mix(
        in srgb,
        var(--foreground) var(--graph-major-opacity, 12%),
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
