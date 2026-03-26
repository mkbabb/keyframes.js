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
                v-model:open="ppmycotaHoverOpen"
            >
                <HoverCardTrigger>
                    <div
                        ref="ppmycotaLogoEl"
                        @click="setPPMode()"
                        class="ppmycota-logo-sm m-0 h-8 w-8 lg:h-10 lg:w-10 cursor-pointer stroke-2 p-0 font-bold hover:scale-105"
                    ></div>
                </HoverCardTrigger>
                <HoverCardContent class="z-[var(--z-modal)] p-4 min-w-[17rem] instrument-serif">
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
            <DropdownMenu>
                <DropdownMenuTrigger as-child>
                    <Button
                        :class="[
                            'm-0 p-0 text-xs lg:text-sm transition-all duration-[var(--duration-fast)] font-mono font-normal',
                            toggled
                                ? 'underline underline-offset-4 text-foreground decoration-2'
                                : pinned
                                    ? 'underline underline-offset-4 text-foreground'
                                    : 'no-underline',
                        ]"
                        variant="link"
                    >@mbabb</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent class="z-[var(--z-modal)] min-w-[17rem] w-auto instrument-serif text-base">
                    <DropdownMenuLabel class="font-normal px-3 py-2">
                        <div class="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage
                                    src="https://avatars.githubusercontent.com/u/2848617?v=4"
                                ></AvatarImage>
                            </Avatar>
                            <div class="flex-1 min-w-0">
                                <span class="font-mono text-sm font-semibold text-foreground">@mbabb</span>
                                <p class="mt-0.5 text-xs italic text-muted-foreground">CSS keyframe animation engine</p>
                            </div>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem as-child>
                        <a href="https://github.com/mkbabb" target="_blank" rel="noopener noreferrer" class="cursor-pointer">GitHub Profile</a>
                    </DropdownMenuItem>
                    <DropdownMenuItem as-child>
                        <a href="https://github.com/mkbabb/keyframes.js" target="_blank" rel="noopener noreferrer" class="cursor-pointer">View Project on GitHub</a>
                    </DropdownMenuItem>
                    <DropdownMenuItem as-child>
                        <a href="https://ppmycota.com" target="_blank" rel="noopener noreferrer" class="cursor-pointer">ppmycota.com</a>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </template>

        <template #start-screen>
            <EditorStartScreen hint="or drag M. cubert &#x1F642;&#x200D;&#x2194;&#xFE0F;" />
        </template>

        <template #tabs-trigger="{ selectedAnimation }">
            <TabsTrigger
                v-if="selectedAnimation === 'Matrix'"
                value="matrix-controls"
                class="tab-trigger-base tab-trigger-underline"
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
                    class="h-8 gap-1.5 fira-code text-xs px-3 rounded-lg btn-interactive"
                    @click="resetMatrix()"
                >
                    <RotateCcw class="w-3.5 h-3.5" /> Reset
                </Button>
                <Button size="sm" variant="outline"
                    class="h-8 gap-1.5 fira-code text-xs px-3 rounded-lg btn-interactive"
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    Avatar,
    AvatarImage,
    Button,
    TabsContent,
    TabsTrigger,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
    DarkModeToggle,
} from "@mkbabb/glass-ui";
import { Lock, LockOpen, RotateCcw } from "lucide-vue-next";

import { EditorShell, EditorStartScreen } from "@components/custom/editor-shell";
import { SharePopover } from "@components/custom/editor-shell";
import { MatrixEditor } from "@components/custom/matrix-editor";
import CubeTarget from "./CubeTarget.vue";

import { getStoredAnimationGroupControlOptions, initFromHash } from "@components/custom/animation-controls/stores";

// Restore shared state from URL hash before components read stored options
initFromHash();
import { useTransformState } from "@components/custom/matrix-editor/useTransformState";
import { useCubeAnimations } from "./useCubeAnimations";



const superKey = "Cube";

const storedControls = getStoredAnimationGroupControlOptions(superKey);
storedControls.ppMode ??= false;

const editorShellRef = ref<InstanceType<typeof EditorShell> | null>(null);
const headerRibbonRef = computed(() => editorShellRef.value?.headerRibbonRef);

const ppmycotaHoverOpen = ref(false);

// Auto-dismiss ppmycota hover card
let autoDismissTimer: ReturnType<typeof setTimeout> | undefined;
const AUTO_DISMISS_MS = 4000;

function clearAutoDismiss() {
    if (autoDismissTimer != null) {
        clearTimeout(autoDismissTimer);
        autoDismissTimer = undefined;
    }
}

watch(ppmycotaHoverOpen, (open) => {
    if (open) {
        clearAutoDismiss();
        autoDismissTimer = setTimeout(() => { ppmycotaHoverOpen.value = false; }, AUTO_DISMISS_MS);
    }
});

watch(() => headerRibbonRef.value?.isToggled, (toggled) => {
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
});
</script>

<style scoped></style>
