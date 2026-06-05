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
            :hide-controls="showStartScreen"
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
import { ref } from "vue";

import { initIOSPlatformClass } from "@utils/iosTextEntry";
import { HeaderRibbon } from "@mkbabb/glass-ui/header-ribbon";
import SharePopover from "./SharePopover.vue";
import EditorStartScreen from "./EditorStartScreen.vue";
import KeyboardShortcutsModal from "@components/custom/KeyboardShortcutsModal.vue";
import AnimationControlsGroup from "@components/custom/animation-controls/AnimationControlsGroup.vue";

import { registerShortcut } from "@mkbabb/glass-ui/keyboard";
import { DarkModeToggle } from "@mkbabb/glass-ui/controls";
import type { AnimationGroup } from "@src/animation/group";

import "@styles/style.css";

initIOSPlatformClass();

const props = withDefaults(
    defineProps<{
        animationGroup: AnimationGroup<any>;
        superKey?: string;
        showStartScreen?: boolean;
        gridBackground?: boolean;
        autoPlay?: boolean;
    }>(),
    {
        superKey: undefined,
        showStartScreen: true,
        gridBackground: true,
        autoPlay: false,
    },
);

const emit = defineEmits<{
    (e: "playStateChange", playing: boolean): void;
    (e: "startStateChange", started: boolean): void;
}>();

const headerRibbonRef = ref<InstanceType<typeof HeaderRibbon> | null>(null);

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
    .editor-shell {
        height: 100vh;
        max-height: 100vh;
    }
    .grid-background {
        height: 100vh;
    }
}

.grid-background {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2 2'%3E%3Cpath d='M1 2V0h1v1H0v1z' fill-opacity='0.10'/%3E%3C/svg%3E");
    background-size: 1rem;
    background-repeat: repeat;
}
:where(.dark) .grid-background {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2 2'%3E%3Cpath d='M1 2V0h1v1H0v1z' fill='white' fill-opacity='0.08'/%3E%3C/svg%3E");
}
</style>
