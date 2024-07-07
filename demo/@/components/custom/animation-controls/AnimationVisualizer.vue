<template>
    <Card class="p-2 w-full h-full max-w-screen-sm">
        <CardContent class="w-full h-12 p-0 m-0 left-0 top-0 relative">
            <div class="w-full h-full relative container-inline-size">
                <OrbitalDrag v-bind:model-value="transformValues">
                    <div
                        ref="ballEl"
                        class="animate-ball absolute z-30 rounded-full bg-red-500 h-12 w-12 border-gray-700 dark:shadow-gray-700 bg-card text-card-foreground shadow-[4px_2px_0px_0px_rgba(0,0,0,0.8)]"
                    ></div>
                </OrbitalDrag>

                <div
                    ref="startBallEl"
                    class="absolute top-0 left-0 rounded-full bg-red-200 z-10 h-full aspect-square dark:shadow-gray-700 bg-card text-card-foreground shadow-[4px_2px_0px_0px_rgba(0,0,0,0.8)]"
                ></div>

                <div
                    ref="endBallEl"
                    class="absolute top-0 translate-x-[calc(100cqw_-_100%)] rounded-full bg-red-200 z-10 h-full aspect-square dark:shadow-gray-700 bg-card text-card-foreground shadow-[4px_2px_0px_0px_rgba(0,0,0,0.8)]"
                ></div>
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import {
    Animation,
    AnimationOptions,
    CSSKeyframesAnimation,
    InputAnimationOptions,
} from "@src/animation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";

import { KeyframesStringControls } from "@components/custom/animation-controls";

import * as animations from "@src/animations";
import { Ref, computed, onMounted, onUnmounted, watch } from "vue";
import AnimationControlsControls from "./AnimationControlsControls.vue";
import { getStoredAnimationGroupControlOptions } from "./animationStores";
import Card from "@components/ui/card/Card.vue";
import { CardContent, CardTitle } from "@components/ui/card";
import CardHeader from "@components/ui/card/CardHeader.vue";
import OrbitalDrag from "../orbital-drag/OrbitalDrag.vue";
import { FunctionValue, ValueUnit } from "@src/units";
import { parseCSSValueUnit } from "@src/parsing/units";
import { parseCSSKeyframesValue } from "@src/parsing/keyframes";

import { getComputedValue } from "@src/units";

window.addEventListener("resize", () => {
    getComputedValue.cache.clear();
});

const animationOptions = defineModel<AnimationOptions>({
    type: Object,
    required: true,
});

const transformValues = $ref({} as any);

const ballStartValues = $ref({
    translateX: parseCSSKeyframesValue("translateX(0px)"),
    translateY: parseCSSKeyframesValue("translateY(0px)"),
});

const ballEndValues = $ref({
    translateX: parseCSSKeyframesValue("translateX(0px)"),
    translateY: parseCSSKeyframesValue("translateY(20px)"),
});

const getOptions = () => {
    return {
        ...animationOptions.value,
        duration: 1000,
        iterationCount: Infinity,
    } as AnimationOptions;
};

watch(animationOptions.value, (value) => {
    const options = getOptions();

    ballAnim.options = options;
    ballAnim.animation.options = options;
});

watch(transformValues, (value) => {
    const { x, y, z } = value.translate;

    ballStartValues.translateX.values[0].value = x;
    ballStartValues.translateY.values[0].value = y;

    ballEndValues.translateX.values[0].value = x;
    ballEndValues.translateY.values[0].value = y;
});

const ballEl = $ref<HTMLElement | null>(null);

const ballAnim = new CSSKeyframesAnimation().fromCSSKeyframes(/*css*/ `
@keyframes ball {
    0%, 10%, 20% {
        transform: translateX(0);
        opacity: 1;
    }
    90%, 80%,  100% {
        opacity: 0.5;
        transform: translateX(calc(   calc(100cqw - 100%   )));
    }
}
`);

const ballTranslationAnim = new CSSKeyframesAnimation({
    iterationCount: Infinity,
    duration: 1000,
}).fromVars([
    {
        transform: {
            translateX: ballStartValues.translateX,
            translateY: ballStartValues.translateY,
        },
    },
    {
        transform: {
            translateX: ballEndValues.translateX,
            translateY: ballEndValues.translateY,
        },
    },
]);

onMounted(() => {
    const options = getOptions();

    ballAnim.options = options;
    ballAnim.animation.options = options;

    ballAnim.setTargets(ballEl);
    ballTranslationAnim.setTargets(ballEl);

    ballAnim.group(ballTranslationAnim).play();
});

onUnmounted(() => {
    ballAnim.stop();
});
</script>

<style scoped lang="scss">
@keyframes ball {
    0%,
    10%,
    20% {
        transform: translateX(0);
    }
    90%,
    80%,
    100% {
        transform: translateX(calc(calc(100cqw - 100%)));
    }
}
.animate-ball {
    // animation: ball 1s linear infinite alternate;
}
</style>
