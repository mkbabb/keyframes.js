<template>
    <EditorShell
        :animation-group="animationGroup"
        :super-key="superKey"
        @play-state-change="isGroupPlaying = $event"
    >
        <template #header-left>
            <HoverCard
                :open-delay="0"
                v-model:open="hoverCardStates.ppmycota"
            >
                <HoverCardTrigger>
                    <div
                        ref="ppmycotaLogoEl"
                        @click="setPPMode()"
                        class="ppmycota-logo-sm m-0 h-8 w-8 lg:h-12 lg:w-12 cursor-pointer stroke-2 p-0 font-bold hover:scale-105"
                    ></div>
                </HoverCardTrigger>
                <HoverCardContent class="z-[100]">
                    <div class="h-fit-content flex gap-4 p-4">
                        <div
                            class="ppmycota-logo-sm z-20 h-12 w-12 cursor-pointer stroke-2 font-bold hover:scale-105"
                        ></div>
                        <div>
                            <h4 class="fraunces">&#x1F642;&#x200D;&#x2194;&#xFE0F; &#x1F331; &#x1F344;&#x200D;&#x1F7EB;</h4>
                            <p>
                                <a
                                    class="fraunces font-bold hover:underline"
                                    href="https://ppmycota.com"
                                    >ppmycota.com</a
                                >
                            </p>
                        </div>
                    </div>
                </HoverCardContent>
            </HoverCard>

            <HoverCard
                v-model:open="hoverCardStates.mbabb"
                :open-delay="0"
            >
                <HoverCardTrigger
                    @click="hoverCardStates.mbabb = true"
                    class="fira-code"
                >
                    <Button
                        class="m-0 cursor-pointer p-0 text-xs lg:text-sm"
                        variant="link"
                        >@mbabb</Button
                    >
                </HoverCardTrigger>
                <HoverCardContent class="z-[100]">
                    <div class="fira-code flex gap-4 p-4">
                        <Avatar>
                            <AvatarImage
                                src="https://avatars.githubusercontent.com/u/2848617?v=4"
                            ></AvatarImage>
                        </Avatar>
                        <div>
                            <h4 class="text-sm font-semibold hover:underline">
                                <a href="https://github.com/mkbabb"
                                    >@mbabb</a
                                >
                            </h4>
                            <p>
                                Check out the project on
                                <a
                                    class="font-bold hover:underline"
                                    href="https://github.com/mkbabb/keyframes.js"
                                    >GitHub</a
                                >&#x1F389;
                            </p>
                        </div>
                    </div>
                </HoverCardContent>
            </HoverCard>
        </template>

        <template #start-screen>
            <EditorStartScreen
                title="Select an animation"
                ellipsis="..."
                subtitle="from the list"
                subtitle-suffix="below."
                hint="or drag M. cubert &#x1F642;&#x200D;&#x2194;&#xFE0F;"
            />
        </template>

        <template #tabs-trigger="{ selectedAnimation }">
            <TabsTrigger
                v-if="selectedAnimation === 'Matrix'"
                value="matrix-controls"
                class="shrink-0 rounded-none rounded-t-lg bg-transparent fraunces border border-transparent border-b-0 text-gray-500 dark:text-gray-300 transition-colors duration-150 data-[state=inactive]:hover:border-gray-500/60 data-[state=inactive]:hover:text-gray-700 dark:data-[state=inactive]:hover:border-gray-400/40 dark:data-[state=inactive]:hover:text-gray-100 data-[state=active]:text-gray-900 data-[state=active]:font-semibold data-[state=active]:shadow-none data-[state=active]:hover:text-gray-900 dark:data-[state=active]:text-white dark:data-[state=active]:hover:text-white"
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
                :pp-mode="storedControls.ppMode ?? false"
                :show-loader="!storedControls.selectedAnimation"
                v-model:transform="transformSliderValues"
            />
        </template>
    </EditorShell>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

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
import { MatrixEditor } from "@components/custom/matrix-editor";
import CubeTarget from "./CubeTarget.vue";

import { getStoredAnimationGroupControlOptions } from "@components/custom/animation-controls/animationStores";
import { useTransformState } from "@composables/useTransformState";
import { useCubeAnimations } from "./useCubeAnimations";

import { toast } from "vue-sonner";

const superKey = "Cube";

const storedControls = getStoredAnimationGroupControlOptions(superKey);
storedControls.ppMode ??= false;

const hoverCardStates = ref({
    ppmycota: false,
    mbabb: false,
});

const isGroupPlaying = ref(false);

const cubeTargetRef = ref<InstanceType<typeof CubeTarget>>();

const cubeElRef = ref<HTMLElement | undefined>();

const {
    matrix3dStart,
    matrix3dEnd,
    transformSliderValues,
    matrixCellMeta,
    updateMatrixCell,
    resetMatrix,
} = useTransformState(isGroupPlaying, cubeElRef);

const { animationGroup, setTargets } = useCubeAnimations(
    matrix3dStart,
    matrix3dEnd,
);

const setPPMode = () => {
    storedControls.ppMode = !storedControls.ppMode;
    if (storedControls.ppMode) {
        toast.success("PP Mode activated!", {
            duration: 3000,
            description: "PP Mode",
        });
    } else {
        toast.error("PP Mode deactivated!", {
            duration: 3000,
            description: "PP Mode",
        });
    }
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
</script>
