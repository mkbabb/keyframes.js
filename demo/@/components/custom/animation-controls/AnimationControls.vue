<template>
    <div
        class="grid lg:h-screen h-full max-h-screen-md w-full max-w-screen-md z-10 relative overflow-y-scroll"
    >
        <Tabs
            class="p-4 w-full h-full flex flex-col justify-start"
            :model-value="storedControls.selectedControl"
            @update:model-value="selectControl"
        >
            <span class="grid">
                <TabsList
                    class="overflow-x-scroll w-full flex items-center justify-around fraunces bg-transparent text-3xl scrollbar-hidden"
                >
                    <TabsTrigger value="controls">Controls</TabsTrigger>
                    <TabsTrigger value="keyframes">Keyframes</TabsTrigger>
                    <slot name="tabs-trigger"></slot>
                </TabsList>
            </span>

            <div ref="tabsContentEl" class="contents">
                <TabsContent value="controls">
                    <AnimationControlsControls
                        :animation="animation"
                        :is-grouped="isGrouped"
                        @slider-update="
                            (v) => {
                                emit('sliderUpdate', v);
                            }
                        "
                    ></AnimationControlsControls>
                </TabsContent>

                <TabsContent value="keyframes">
                    <KeyframesStringControls
                        @keyframes-update="
                            (v) => {
                                emit('keyframesUpdate', v);
                            }
                        "
                        :animation="animation"
                    ></KeyframesStringControls>
                </TabsContent>
                <slot name="tabs-content"></slot>
            </div>
        </Tabs>
    </div>
</template>

<script setup lang="ts">
import { Animation } from "@src/animation/index";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";

import { KeyframesStringControls } from "@components/custom/animation-controls";

import * as animations from "@src/animation/animations";
import { onMounted } from "vue";
import AnimationControlsControls from "./AnimationControlsControls.vue";
import { getStoredAnimationGroupControlOptions } from "./animationStores";

const tabsContentEl = $ref<HTMLElement>(null);

const fadeOut = animations
    .blurOut({ duration: 100 })
    .group(animations.fadeOut({ duration: 50 }));

const fadeIn = animations
    .blurIn({ duration: 100 })
    .group(animations.fadeIn({ duration: 50 }));

const selectControl = async (key: string) => {
    const activeChild = tabsContentEl?.querySelector(
        `[data-state="active"]`,
    ) as HTMLElement;

    fadeOut.stop();
    fadeIn.stop();

    await fadeOut.setTargets(activeChild).play();

    storedControls.selectedControl = key.toString();

    const newActiveChild = tabsContentEl?.querySelector(
        `[id$="${key}"]`,
    ) as HTMLElement;

    await fadeIn.setTargets(newActiveChild).play();
};

const { animation, isGrouped } = defineProps({
    animation: {
        type: Animation,
        required: true,
    },
    isGrouped: {
        type: Boolean,
        required: false,
        default: false,
    },
});

const storedControls = getStoredAnimationGroupControlOptions(animation);

const emit = defineEmits<{
    (
        e: "sliderUpdate",
        val: {
            t: number;
            animation: Animation<any>;
        },
    ): void;
    (
        e: "keyframesUpdate",
        val: {
            animation: Animation<any>;
        },
    ): void;
}>();

onMounted(() => {});
</script>

<style scoped lang="scss"></style>
