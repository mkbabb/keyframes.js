<template>
    <div
        class="relative grid min-h-dvh lg:h-dvh w-dvw items-center justify-items-stretch lg:justify-items-center lg:justify-center"
    >
        <div
            v-if="gridBackground"
            ref="gridBackgroundEl"
            class="grid-background pointer-events-none fixed inset-0 h-dvh w-dvw"
        ></div>

        <EditorHeader>
            <template #left>
                <slot name="header-left"></slot>
            </template>
            <template #right>
                <slot name="header-right">
                    <SharePopover />
                    <DarkModeToggle
                        title="Toggle dark mode"
                        class="aspect-square w-8 hover:scale-105 hover:opacity-50"
                    />
                </slot>
            </template>
        </EditorHeader>

        <template v-if="showStartScreen && !storedControls.selectedAnimation">
            <slot name="start-screen">
                <EditorStartScreen />
            </slot>
        </template>

        <AnimationControlsGroup
            :animation-group="animationGroup"
            :super-key="superKey"
            @play-state-change="onPlayStateChange"
        >
            <template #tabs-trigger="slotProps">
                <slot name="tabs-trigger" v-bind="slotProps"></slot>
            </template>

            <template #tabs-content>
                <slot name="tabs-content"></slot>
            </template>

            <template #animation-content="slotProps">
                <slot name="target" v-bind="slotProps"></slot>
            </template>
        </AnimationControlsGroup>
    </div>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from "vue";
import EditorHeader from "./EditorHeader.vue";
import SharePopover from "./SharePopover.vue";
import EditorStartScreen from "./EditorStartScreen.vue";
import { DarkModeToggle } from "@components/custom/dark-mode-toggle";
import { AnimationControlsGroup } from "@components/custom/animation-controls";
import { getStoredAnimationGroupControlOptions } from "@components/custom/animation-controls/animationStores";
import type { AnimationGroup } from "@src/animation/group";

import "@styles/utils.css";
import "@styles/style.css";

const props = withDefaults(
    defineProps<{
        animationGroup: AnimationGroup<any>;
        superKey?: string;
        showStartScreen?: boolean;
        gridBackground?: boolean;
    }>(),
    {
        superKey: undefined,
        showStartScreen: true,
        gridBackground: true,
    },
);

const emit = defineEmits<{
    (e: "playStateChange", playing: boolean): void;
}>();

const storedControls = getStoredAnimationGroupControlOptions(props.superKey);

const gridBackgroundEl = useTemplateRef<HTMLElement>("gridBackgroundEl");

const onPlayStateChange = (playing: boolean) => {
    emit("playStateChange", playing);
};

onMounted(() => {
    if (props.gridBackground && gridBackgroundEl.value) {
        const encodedSVG = encodeURIComponent(`
    <svg class="tmp" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2 2'>
        <path d='M1 2V0h1v1H0v1z' fill-opacity='0.10'/>
    </svg>
`);
        gridBackgroundEl.value.style.backgroundImage = `url("data:image/svg+xml,${encodedSVG}")`;
    }
});
</script>

<style scoped>
.grid-background {
    background-size: 1rem !important;
    background-repeat: repeat;
}
</style>
