<template>
    <div
        class="editor-shell relative grid h-dvh max-h-dvh w-dvw overflow-hidden place-items-center bg-background"
    >
        <div
            v-if="gridBackground"
            class="grid-background pointer-events-none fixed inset-0 h-dvh w-dvw"
        ></div>

        <HeaderRibbon ref="headerRibbonRef" position="right">
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
                         ribbon, not over the dock band → no occlusion (inv δ). -->
                    <IconTooltip text="Keyboard shortcuts (?)">
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Show keyboard shortcuts"
                            class="aspect-square w-8 scale-on-hover"
                            @click="shortcutsOpen = true"
                        >
                            <Keyboard class="icon-sm" />
                        </Button>
                    </IconTooltip>
                    <DarkModeToggle
                        title="Toggle dark mode"
                        class="aspect-square w-8 scale-on-hover"
                    />
                </slot>
            </template>
            <template #anchor="{ pinned, toggled }">
                <slot name="header-anchor" :pinned="pinned" :toggled="toggled"></slot>
            </template>
        </HeaderRibbon>

        <Transition name="fade" appear>
            <div v-if="showStartScreen" class="absolute inset-0 z-content flex items-center justify-center pointer-events-none">
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
            :super-key="superKey"
            :auto-play="autoPlay"
            :machine-playing="machinePlaying"
            :hide-controls="showStartScreen"
            :stage-mode="stageMode"
            :has-control-surfaces="hasControlSurfaces"
            :extra-tabs="extraTabs"
            @play-state-change="onPlayStateChange"
            @start-state-change="(s: boolean) => emit('startStateChange', s)"
        >
            <template #tabs-trigger="slotProps">
                <slot name="tabs-trigger" v-bind="slotProps"></slot>
            </template>

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
import { ref, useTemplateRef } from "vue";

import { initIOSPlatformClass } from "@utils/iosTextEntry";
import { HeaderRibbon } from "@mkbabb/glass-ui/header-ribbon";
import SharePopover from "./SharePopover.vue";
import EditorStartScreen from "./EditorStartScreen.vue";
import KeyboardShortcutsModal from "@components/custom/KeyboardShortcutsModal.vue";
import AnimationControlsGroup from "@components/custom/animation-transport/AnimationControlsGroup.vue";

import { registerShortcut } from "@mkbabb/glass-ui/keyboard";
import { DarkModeToggle } from "@mkbabb/glass-ui/controls";
import { Button } from "@mkbabb/glass-ui";
import { IconTooltip } from "@mkbabb/glass-ui/icon-tooltip";
import type { SegmentedTabOption } from "@mkbabb/glass-ui/tabs";
import { Keyboard } from "@lucide/vue";
import type { AnimationGroup } from "@mkbabb/keyframes.js";

import "@styles/style.css";

initIOSPlatformClass();

const props = withDefaults(
    defineProps<{
        animationGroup: AnimationGroup<any>;
        superKey?: string;
        showStartScreen?: boolean;
        gridBackground?: boolean;
        autoPlay?: boolean;
        // S.A0 — the machine → transport intent edge, threaded through to
        // AnimationControlsGroup (see its prop note). A machine-driven host
        // (the App) passes the machine's `playing` status; a standalone host
        // (the playground) omits it (undefined — the transport never syncs).
        machinePlaying?: boolean;
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
        // glass-ui 4.0.0 (BA.W-TABS) — standalone-host extra control-strip tabs
        // (the playground's "Assets" tab), threaded down to the options-driven
        // SegmentedTabs strip. The playground supplies the Assets tab here AS
        // DATA + renders its panel via the `tabs-content` slot (gated on the
        // active surface), replacing the retired reka `<TabsTrigger>`/`<TabsContent>`
        // it injected before glass-ui removed the reka Tabs wrapper. The App
        // host leaves this empty and rides the scene machine's projection.
        extraTabs?: SegmentedTabOption[];
    }>(),
    {
        superKey: undefined,
        showStartScreen: true,
        gridBackground: true,
        autoPlay: false,
        stageMode: "subject",
        hasControlSurfaces: true,
        extraTabs: () => [],
    },
);

const emit = defineEmits<{
    (e: "playStateChange", playing: boolean): void;
    (e: "startStateChange", started: boolean): void;
}>();

const headerRibbonRef = useTemplateRef<InstanceType<typeof HeaderRibbon>>("headerRibbonRef");

const shortcutsOpen = ref(false);
registerShortcut("?", () => { shortcutsOpen.value = !shortcutsOpen.value; }, { label: "Show shortcuts", group: "General" });

const onPlayStateChange = (playing: boolean) => {
    emit("playStateChange", playing);
};


defineExpose({ headerRibbonRef });
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
