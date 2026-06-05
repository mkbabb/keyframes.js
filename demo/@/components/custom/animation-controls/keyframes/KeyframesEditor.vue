<template>
    <div class="contents">
        <Card class="glass-card p-0 m-0">
            <CardContent class="p-2 m-0 mt-0 grid gap-4 relative">
                <KeyframeCardList
                    ref="cardList"
                    :frame-strings="templateFrameStrings"
                    :frames="animation.templateFrames"
                    @update-start="onUpdateStart"
                    @update-c-s-s="onUpdateCSS"
                    @remove="({ event, index }) => removeKeyframe(event, index)"
                    @keydown="onKeyDown"
                />
            </CardContent>
        </Card>

        <div class="grid gap-4 sticky bottom-0 bg-background rounded-panel p-4 pt-4 m-4">
            <Slider
                :model-value="
                    animation.templateFrames.map((frame) => frame.start.value)
                "
                @update:model-value="
                    (starts) => {
                        animation.templateFrames.forEach((frame, i) => {
                            frame.start.value = starts![i];
                        });
                        updateAllStringsAndAnimation();
                    }
                "
                :min="-10"
                :max="110"
                :step="1"
            >
            </Slider>

            <Menubar class="w-full mt-4 flex justify-evenly gap-2 overflow-x-scroll">
                <MenubarMenu>
                    <MenubarTrigger>
                        <WandSparkles></WandSparkles>
                    </MenubarTrigger>
                </MenubarMenu>

                <MenubarMenu>
                    <MenubarTrigger>
                        <KeyframesAddDialog
                            v-model:open="kfControls.dialogOpen"
                            v-model:text="addKeyframesString"
                            :format="updateAddKeyframesString"
                            @submit="addKeyframesStringToAnimation"
                        />
                    </MenubarTrigger>
                </MenubarMenu>

                <MenubarMenu>
                    <MenubarTrigger>
                        <CopyButton
                            class="w-6 h-6 scale-on-hover"
                            :text="cssKeyframesString"
                        />
                    </MenubarTrigger>
                </MenubarMenu>

                <MenubarMenu>
                    <MenubarTrigger>
                        <Paintbrush
                            ref="brush"
                            @click="applyCSSStyles"
                            class="cursor-pointer bg-transparent hover:bg-transparent scale-on-hover"
                        />
                    </MenubarTrigger>
                </MenubarMenu>
            </Menubar>

            <div
                ref="progressBarKeyframesEl"
                class="progress-bar sticky bottom mt-2"
            ></div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { Animation, CSSKeyframesAnimation } from "@src/animation/engine";

import { Card, CardContent, Slider } from "@mkbabb/glass-ui";

import { onMounted, onUnmounted, useTemplateRef, watch } from "vue";
import { useApplyCSS } from "./composables/useApplyCSS";
import { useCodeHighlight } from "./composables/useHighlightCSS";
import { useKeyframesEditor } from "./composables/useKeyframesEditor";

import CopyButton from "@components/custom/CopyButton.vue";
import KeyframeCardList from "./components/KeyframeCardList.vue";
import KeyframesAddDialog from "./components/KeyframesAddDialog.vue";

import { Paintbrush, WandSparkles } from "@lucide/vue";
import { Menubar, MenubarMenu, MenubarTrigger } from "@components/ui/menubar";

import { parseCSSValueUnit } from "@mkbabb/value.js";
import * as animations from "@src/animation/animations";
import { insertTabAtCursor } from "./utils/contenteditable";

const { animation } = defineProps<{
    animation: Animation<any>;
}>();

const emit = defineEmits<{
    (
        e: "sliderUpdate",
        val: { t: number; animationId: number },
    ): void;
    (
        e: "keyframesUpdate",
        val: { animation: Animation<any> },
    ): void;
}>();

const {
    cssKeyframesString,
    addKeyframesString,
    templateFrameStrings,
    keyframesStyleId,
    kfControls,
    updateAllStrings,
    updateAllStringsAndAnimation,
    updateAnimationFromKeyframeString,
    updateAddKeyframesString,
    addKeyframesStringToAnimation,
    removeKeyframeData,
} = useKeyframesEditor(() => animation, emit);

// Mirror the live add-keyframes draft into stored controls so an un-submitted
// draft persists (the original inline input handler set both).
watch(addKeyframesString, (v) => {
    kfControls.addKeyframes = v;
});

const cardList = useTemplateRef<InstanceType<typeof KeyframeCardList>>("cardList");

// Scoped highlight driver — owns the editor's OWN <pre> code blocks (the card
// list's), never the whole document (D.W3.S1).
const { highlightAll } = useCodeHighlight(
    () => cardList.value?.getPreElements() ?? [],
);

const onUpdateStart = ({ val, index }: { val: string; index: number }) => {
    animation.templateFrames[index].start = parseCSSValueUnit(val);
    updateAllStringsAndAnimation();
};

const onUpdateCSS = ({ value, index }: { value: string; index: number }) => {
    updateAnimationFromKeyframeString(value, index);
    animateProgressBar(progressBarKeyframesEl.value!);
};

function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Ï") {
        e.preventDefault();
        return;
    }

    if (e.key === "Tab") {
        e.preventDefault();
        insertTabAtCursor(e.target as HTMLElement);
    }

    highlightAll();
}

const removeKeyframe = async (_e: Event, frameIx: number) => {
    if (animation.templateFrames.length <= 1) {
        return;
    }

    const cards = cardList.value?.cardRefs ?? [];
    const el1 = cards[frameIx];
    const el2 =
        frameIx < cards.length - 1 ? cards[frameIx + 1] : cards[frameIx - 1];

    await animations
        .warpLeft()
        .setTargets(el1)
        .group(animations.jumpUp().setTargets(el2))
        .play();

    removeKeyframeData(frameIx);
};

const progressBarKeyframesEl = useTemplateRef<HTMLElement>("progressBarKeyframesEl");

const animateProgressBar = (el: HTMLElement) => {
    new CSSKeyframesAnimation({ duration: 1000 }, el)
        .fromVars([{ width: "0%" }, { width: "100%" }])
        .play();
};

const { isApplied: cssApplied, toggle: toggleApplyCSS } = useApplyCSS({
    getAnimation: () => animation,
    styleId: keyframesStyleId,
    getCSSString: () => cssKeyframesString.value,
    getClassName: () => keyframesStyleId,
});

const applyCSSStyles = () => {
    toggleApplyCSS();
    if (cssApplied.value) {
        brushAnimation.play();
    } else {
        brushAnimation.pause();
    }
};

const brush = useTemplateRef<HTMLElement>("brush");

const brushAnimation = new CSSKeyframesAnimation({
    duration: 700,
    timingFunction: "linear",
    iterationCount: "infinite",
    direction: "alternate",
}).fromString(
    /*css*/
    `@keyframes paintbrushWipe {
                0%, 100% {
                    transform: rotate(0deg);
                }
                20%, 30%, 40% {
                    transform: rotate(30deg);
                }
                60%, 70%, 80% {
                    transform: rotate(-90deg);
                }
            }`,
);

// Re-highlight the card list whenever the serialized keyframes change.
watch(cssKeyframesString, () => {
    highlightAll();
});

onMounted(() => {
    brushAnimation.setTargets(brush.value!);
    updateAllStrings();
});

onUnmounted(() => {
    brushAnimation.pause();
});
</script>
