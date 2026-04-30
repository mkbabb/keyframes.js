<template>
    <span
        class="cursor-pointer relative inline-block text-foreground p-0 m-0"
        @click="handleClick"
    >
        <Clipboard class="clipboard" ref="clipboard" />
        <ClipboardCheck
            class="clipboard opacity-0"
            ref="clipboardChecked"
        />
    </span>
</template>

<script setup lang="ts">
import { Clipboard, ClipboardCheck } from "lucide-vue-next";

import { onMounted, ref, useTemplateRef } from "vue";
import type { InputAnimationOptions } from "@src/animation/constants";
import { CSSKeyframesAnimation } from "@src/animation";
import { AnimationGroup } from "@src/animation/group";
import { copyText } from "@utils/clipboard";

const { text } = defineProps({
    text: {
        type: String,
        required: true,
    },
});

const isCopied = ref(false);

const clipboard = useTemplateRef<HTMLElement>("clipboard");
const clipboardChecked = useTemplateRef<HTMLElement>("clipboardChecked");

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
    copyText(text);

    isCopied.value = true;

    group.play();
};

onMounted(() => {
    clipboardCheckedAnim.setTargets(clipboardChecked.value!);
    clipboardAnim.setTargets(clipboard.value!);
});
</script>
<style scoped>
.clipboard {
    bottom: 0;
    left: 0;
    height: 100%;
    width: 100%;

    position: absolute;
}
</style>
