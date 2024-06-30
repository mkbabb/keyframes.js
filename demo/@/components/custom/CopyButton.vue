<template>
    <Button
        v-bind="$attrs"
        class="relative p-0 m-0 bg-transparent hover:bg-transparent hover:scale-105"
        @click="handleClick"
    >
        <Clipboard class="clipboard" ref="clipboard" />
        <ClipboardCheck class="clipboard opacity-0" ref="clipboardChecked" />
    </Button>
</template>

<script setup lang="ts">
import { Clipboard, ClipboardCheck } from "lucide-vue-next";

import { Button } from "@components/ui/button";

import {
    AnimationGroup,
    CSSKeyframesAnimation,
    InputAnimationOptions,
} from "@src/animation";
import { on } from "events";
import { onMounted } from "vue";

const { text } = defineProps({
    text: {
        type: String,
        required: true,
    },
});

let isCopied = $ref(false);

const clipboard = $ref<HTMLElement>(null);
const clipboardChecked = $ref<HTMLElement>(null);

const copyToClipboard = (text) => {
    navigator.clipboard
        .writeText(text)
        .then(() => {})
        .catch((err) => {
            console.error("Could not copy text: ", err);
        });
};

const options: Partial<InputAnimationOptions> = {
    duration: 400,
    timingFunction: "bounceInEase",
};

const clipboardCheckedAnim = new CSSKeyframesAnimation(options)
    .fromCSSKeyframes(/*css*/ `@keyframes fade-in {
            0%, 100% {
                transform: scale(1);
                opacity: 0;
            }
            50% {
                transform: scale(1.25);
                opacity: 1;
            }
        }`);

const clipboardAnim = new CSSKeyframesAnimation(options)
    .fromCSSKeyframes(/*css*/ `@keyframes fade-out {
            0%, 100% {
                transform: scale(1);

            }
            50% {
                transform: scale(1.25);

            }
        }`);

const group = new AnimationGroup(
    clipboardAnim.animation,
    clipboardCheckedAnim.animation,
);

group.singleTarget = false;

const handleClick = () => {
    copyToClipboard(text);

    isCopied = true;

    group.play();
};

onMounted(() => {
    clipboardCheckedAnim.addTargets(clipboardChecked);
    clipboardAnim.addTargets(clipboard);
});
</script>
<style scoped lang="scss">
.clipboard {
    position: absolute;
}
</style>
