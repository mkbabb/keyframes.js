<template>
    <span
        v-bind="$attrs"
        class="cursor-pointer relative text-foreground p-0 m-0"
        @click="handleClick"
    >
        <Clipboard v-bind="$attrs" class="clipboard" ref="clipboard" />
        <ClipboardCheck
            v-bind="$attrs"
            class="clipboard opacity-0"
            ref="clipboardChecked"
        />
    </span>
</template>

<script setup lang="ts">
import { Clipboard, ClipboardCheck } from "lucide-vue-next";

import { Button } from "@components/ui/button";

import { on } from "events";
import { onMounted } from "vue";
import { InputAnimationOptions } from "@src/animation/constants";
import { CSSKeyframesAnimation } from "@src/animation";
import { AnimationGroup } from "@src/animation/group";

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
    duration: 200,
    timingFunction: "bounceInEase",
};

const clipboardCheckedAnim = new CSSKeyframesAnimation(options)
    .fromString(/*css*/ `@keyframes fade-in {
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
    .fromString(/*css*/ `@keyframes fade-out {
            0%, 100% {
                transform: scale(1);

            }
            50% {
                transform: scale(1.25);

            }
        }`);

const group = new AnimationGroup(clipboardAnim, clipboardCheckedAnim);

group.singleTarget = false;

const handleClick = () => {
    copyToClipboard(text);

    isCopied = true;

    group.play();
};

onMounted(() => {
    clipboardCheckedAnim.setTargets(clipboardChecked);
    clipboardAnim.setTargets(clipboard);
});
</script>
<style scoped lang="scss">
.clipboard {
    bottom: 0;
    left: 0;
    height: 100%;
    width: 100%;

    position: absolute;
}
</style>
