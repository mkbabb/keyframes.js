<template>
    <div
        class="relative grid h-dvh max-h-dvh w-dvw overflow-hidden items-center justify-items-stretch lg:justify-items-center lg:justify-center"
    >
        <div
            v-if="gridBackground"
            ref="gridBackgroundEl"
            class="grid-background pointer-events-none fixed inset-0 h-dvh w-dvw"
        ></div>

        <!-- Mobile controls toggle — fixed top-left, independent of HeaderRibbon -->
        <div
            v-if="storedControls.selectedAnimation"
            class="fixed top-0 left-0 z-40 px-4 pt-4 pb-2 lg:hidden"
        >
            <button
                @click="storedControls.isControlsPanelOpen = !storedControls.isControlsPanelOpen"
                class="p-1.5 rounded-lg cursor-pointer transition-colors"
                :class="storedControls.isControlsPanelOpen ? 'text-foreground' : 'text-muted-foreground'"
            >
                <Minus v-if="storedControls.isControlsPanelOpen" class="w-5 h-5" />
                <PanelLeft v-else class="w-5 h-5" />
            </button>
        </div>

        <HeaderRibbon ref="headerRibbonRef" position="right">
            <template #items>
                <slot name="header-left"></slot>
                <slot name="header-right">
                    <SharePopover />
                    <DarkModeToggle
                        title="Toggle dark mode"
                        class="aspect-square w-8 hover:scale-105"
                    />
                </slot>
            </template>
            <template #anchor="{ pinned, toggled }">
                <slot name="header-anchor" :pinned="pinned" :toggled="toggled"></slot>
            </template>
        </HeaderRibbon>

        <template v-if="showStartScreen">
            <slot name="start-screen">
                <EditorStartScreen />
            </slot>
        </template>

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

        <KeyboardShortcutsModal
            v-model:open="shortcutsOpen"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from "vue";
import { Minus, PanelLeft } from "lucide-vue-next";
import { initIOSPlatformClass } from "@utils/iosTextEntry";
import { HeaderRibbon } from "@components/custom/header-ribbon";
import SharePopover from "./SharePopover.vue";
import EditorStartScreen from "./EditorStartScreen.vue";
import KeyboardShortcutsModal from "@components/custom/KeyboardShortcutsModal.vue";
import { DarkModeToggle } from "@components/custom/dark-mode-toggle";
import { AnimationControlsGroup } from "@components/custom/animation-controls";
import { getStoredAnimationGroupControlOptions } from "@components/custom/animation-controls/animationStores";
import { registerShortcut } from "@composables/useKeyboardShortcuts";
import type { AnimationGroup } from "@src/animation/group";

import "@styles/utils.css";
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

const storedControls = computed(() => getStoredAnimationGroupControlOptions(props.superKey));

const headerRibbonRef = ref<InstanceType<typeof HeaderRibbon> | null>(null);

const shortcutsOpen = ref(false);
registerShortcut("?", () => { shortcutsOpen.value = !shortcutsOpen.value; }, { label: "Show shortcuts", group: "General" });

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

defineExpose({ headerRibbonRef });
</script>

<style scoped>
.grid-background {
    background-size: 1rem !important;
    background-repeat: repeat;
}

</style>
