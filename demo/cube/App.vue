<template>
    <EditorShell
        ref="editorShellRef"
        :animation-group="animationGroup"
        :super-key="superKey"
        @play-state-change="(v: boolean) => isGroupPlaying = v"
        @start-state-change="(v: boolean) => isGroupStarted = v"
    >
        <template #header-left>
            <HoverCard
                :open-delay="200"
                :close-delay="150"
                v-model:open="hoverCardStates.ppmycota"
            >
                <HoverCardTrigger>
                    <div
                        ref="ppmycotaLogoEl"
                        @click="setPPMode()"
                        class="ppmycota-logo-sm m-0 h-8 w-8 lg:h-10 lg:w-10 cursor-pointer stroke-2 p-0 font-bold hover:scale-105"
                    ></div>
                </HoverCardTrigger>
                <HoverCardContent class="z-[100] p-4 min-w-[17rem] instrument-serif">
                    <div class="flex items-center gap-3">
                        <div
                            class="ppmycota-logo-sm z-20 h-10 w-10 shrink-0 stroke-2 font-bold"
                        ></div>
                        <div class="flex-1 min-w-0">
                            <a href="https://ppmycota.com" target="_blank" rel="noopener noreferrer" class="text-sm font-semibold text-foreground hover:underline">ppmycota</a>
                            <p class="mt-0.5 text-xs italic text-muted-foreground">&#x1F642;&#x200D;&#x2194;&#xFE0F; &#x1F331; &#x1F344;&#x200D;&#x1F7EB;</p>
                        </div>
                    </div>
                    <hr class="my-2 border-border/50" />
                    <a href="https://ppmycota.com" target="_blank" rel="noopener noreferrer" class="block text-sm text-foreground hover:underline">ppmycota.com</a>
                </HoverCardContent>
            </HoverCard>
        </template>

        <template #header-right>
            <TooltipProvider :delay-duration="300">
                <Tooltip>
                    <TooltipTrigger as-child>
                        <span class="inline-flex">
                            <SharePopover />
                        </span>
                    </TooltipTrigger>
                    <TooltipContent class="instrument-serif text-base">Share or load animation state</TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <DarkModeToggle
                title="Toggle dark mode"
                class="aspect-square w-8 hover:scale-105"
            />
        </template>

        <template #header-anchor="{ pinned, toggled }">
            <HoverCard
                v-model:open="hoverCardStates.mbabb"
                :open-delay="300"
                :close-delay="200"
            >
                <HoverCardTrigger>
                    <Button
                        :class="[
                            'm-0 cursor-pointer p-0 text-xs lg:text-sm transition-all duration-200 font-mono font-normal',
                            toggled
                                ? 'underline underline-offset-4 text-foreground decoration-2'
                                : pinned
                                    ? 'underline underline-offset-4 text-foreground'
                                    : 'no-underline',
                        ]"
                        variant="link"
                    >@mbabb</Button>
                </HoverCardTrigger>
                <HoverCardContent class="z-[100] p-4 min-w-[17rem] instrument-serif">
                    <div class="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage
                                src="https://avatars.githubusercontent.com/u/2848617?v=4"
                            ></AvatarImage>
                        </Avatar>
                        <div class="flex-1 min-w-0">
                            <a href="https://github.com/mkbabb" target="_blank" rel="noopener noreferrer" class="font-mono text-sm font-semibold text-foreground hover:underline">@mbabb</a>
                            <p class="mt-0.5 text-xs italic text-muted-foreground">CSS keyframe animation engine</p>
                        </div>
                    </div>
                    <hr class="my-2 border-border/50" />
                    <a href="https://github.com/mkbabb/keyframes.js" target="_blank" rel="noopener noreferrer" class="block text-sm text-foreground hover:underline">View project on GitHub 🎉</a>
                </HoverCardContent>
            </HoverCard>
        </template>

        <template #start-screen>
            <EditorStartScreen hint="or drag M. cubert &#x1F642;&#x200D;&#x2194;&#xFE0F;" />
        </template>

        <template #tabs-trigger="{ selectedAnimation }">
            <TabsTrigger
                v-if="selectedAnimation === 'Matrix'"
                value="matrix-controls"
                class="shrink-0 instrument-serif px-3 py-1.5 text-lg bg-transparent rounded-none transition-colors duration-150 data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground data-[state=active]:text-foreground data-[state=active]:font-semibold border-b-2 border-transparent data-[state=active]:border-foreground"
                >Matrix Controls</TabsTrigger
            >
        </template>

        <template #tabs-content>
            <TabsContent value="matrix-controls">
                <MatrixEditor
                    :matrix3d-end="matrix3dEnd"
                    :matrix-cell-meta="matrixCellMeta"
                    :super-key="superKey"
                    @update-matrix-cell="updateMatrixCell"
                    @reset-matrix="resetMatrix"
                />
            </TabsContent>
        </template>

        <template #ribbon-content="{ selectedControl }">
            <template v-if="selectedControl === 'matrix-controls'">
                <Button size="sm" variant="outline"
                    class="h-8 gap-1.5 cursor-pointer fira-code text-xs px-3 rounded-lg hover:scale-105 active:scale-95 transition-transform"
                    @click="resetMatrix()"
                >
                    <RotateCcw class="w-3.5 h-3.5" /> Reset
                </Button>
                <Button size="sm" variant="outline"
                    class="h-8 gap-1.5 cursor-pointer fira-code text-xs px-3 rounded-lg hover:scale-105 active:scale-95 transition-transform"
                    @click="storedControls.matrixOptions.fixed = !storedControls.matrixOptions.fixed"
                >
                    <Lock v-if="!storedControls.matrixOptions?.fixed" class="w-3.5 h-3.5" />
                    <LockOpen v-else class="w-3.5 h-3.5" />
                    {{ storedControls.matrixOptions?.fixed ? 'Free' : 'Fixed' }}
                </Button>
            </template>
        </template>

        <template #target>
            <CubeTarget
                ref="cubeTargetRef"
                :is-playing="isGroupPlaying"
                :is-started="isGroupStarted"
                :pp-mode="storedControls.ppMode ?? false"
                :show-loader="!storedControls.selectedAnimation"
                v-model:transform="transformSliderValues"
            />
        </template>
    </EditorShell>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@components/ui/hover-card";
import { Avatar, AvatarImage } from "@components/ui/avatar";
import { Button } from "@components/ui/button";
import { TabsContent, TabsTrigger } from "@components/ui/tabs";
import { Lock, LockOpen, RotateCcw } from "lucide-vue-next";

import { EditorShell, EditorStartScreen } from "@components/custom/editor-shell";
import { SharePopover } from "@components/custom/editor-shell";
import { DarkModeToggle } from "@components/custom/dark-mode-toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@components/ui/tooltip";
import { MatrixEditor } from "@components/custom/matrix-editor";
import CubeTarget from "./CubeTarget.vue";

import { getStoredAnimationGroupControlOptions, initFromHash } from "@components/custom/animation-controls/animationStores";

// Restore shared state from URL hash before components read stored options
initFromHash();
import { useTransformState } from "@composables/useTransformState";
import { useCubeAnimations } from "./useCubeAnimations";



const superKey = "Cube";

const storedControls = getStoredAnimationGroupControlOptions(superKey);
storedControls.ppMode ??= false;

const editorShellRef = ref<InstanceType<typeof EditorShell> | null>(null);
const headerRibbonRef = computed(() => editorShellRef.value?.headerRibbonRef);

const hoverCardStates = ref({
    ppmycota: false,
    mbabb: false,
});

// Auto-dismiss hover cards after a timeout
let autoDismissTimer: ReturnType<typeof setTimeout> | undefined;
const AUTO_DISMISS_MS = 4000;

function clearAutoDismiss() {
    if (autoDismissTimer != null) {
        clearTimeout(autoDismissTimer);
        autoDismissTimer = undefined;
    }
}

function scheduleAutoDismiss(key: keyof typeof hoverCardStates.value) {
    clearAutoDismiss();
    autoDismissTimer = setTimeout(() => {
        hoverCardStates.value[key] = false;
    }, AUTO_DISMISS_MS);
}

// Exclusive hovers: opening one dismisses the other
watch(() => hoverCardStates.value.ppmycota, (open) => {
    if (open) {
        hoverCardStates.value.mbabb = false;
        scheduleAutoDismiss("ppmycota");
    }
});

watch(() => hoverCardStates.value.mbabb, (open) => {
    if (open && mbabbClickCooldown) {
        hoverCardStates.value.mbabb = false;
        return;
    }
    if (open) {
        hoverCardStates.value.ppmycota = false;
        scheduleAutoDismiss("mbabb");
    }
});

// mbabb click cooldown prevents hover from immediately reopening the card after anchor click.
let mbabbClickCooldown = false;
let mbabbCooldownTimer: ReturnType<typeof setTimeout> | undefined;

watch(() => headerRibbonRef.value?.isToggled, (toggled) => {
    hoverCardStates.value.mbabb = false;
    mbabbClickCooldown = true;
    clearTimeout(mbabbCooldownTimer);
    mbabbCooldownTimer = setTimeout(() => { mbabbClickCooldown = false; }, 600);
    // Only sync controls panel on desktop — mobile uses its own toggle
    if (window.innerWidth >= 1024) {
        storedControls.isControlsPanelOpen = !!toggled;
    }
});

const isGroupPlaying = ref(false);
const isGroupStarted = ref(false);

const cubeTargetRef = ref<InstanceType<typeof CubeTarget>>();

const cubeElRef = ref<HTMLElement | undefined>();

const {
    matrix3dStart,
    matrix3dEnd,
    transformSliderValues,
    matrixCellMeta,
    updateMatrixCell,
    resetMatrix,
} = useTransformState(isGroupPlaying, isGroupStarted, cubeElRef);

const { animationGroup, setTargets } = useCubeAnimations(
    matrix3dStart,
    matrix3dEnd,
);

const setPPMode = () => {
    storedControls.ppMode = !storedControls.ppMode;
};

watch(
    () => storedControls.selectedAnimation,
    (selectedAnimation) => {
        if (
            selectedAnimation !== "Matrix" &&
            storedControls.selectedControl === "matrix-controls"
        ) {
            storedControls.selectedControl = "controls";
        }
    },
);

onMounted(() => {
    const cubeEl = cubeTargetRef.value?.cubeEl;
    const graphEl = cubeTargetRef.value?.graphEl;

    if (cubeEl && graphEl) {
        cubeElRef.value = cubeEl;
        setTargets(cubeEl, graphEl);
    }
});

onBeforeUnmount(() => {
    clearAutoDismiss();
    clearTimeout(mbabbCooldownTimer);
});
</script>

<style scoped></style>
