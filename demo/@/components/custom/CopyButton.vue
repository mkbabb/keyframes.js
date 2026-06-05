<template>
    <button
        type="button"
        :aria-label="isCopied ? 'Copied to clipboard' : label"
        class="cursor-pointer relative inline-block text-foreground p-0 m-0 bg-transparent border-0"
        @click="handleClick"
    >
        <Clipboard class="clipboard" ref="clipboard" />
        <ClipboardCheck
            class="clipboard opacity-0"
            ref="clipboardChecked"
        />
        <!-- One AT-only status sink: announces the copy to screen readers
             without a visual change (the icon swap is the sighted feedback). -->
        <span class="sr-only" role="status" aria-live="polite">{{ liveStatus }}</span>
    </button>
</template>

<script setup lang="ts">
import { Clipboard, ClipboardCheck } from "@lucide/vue";

import { onMounted, ref, useTemplateRef } from "vue";
import type { InputAnimationOptions } from "@src/animation/constants";
import { CSSKeyframesAnimation } from "@src/animation/engine";
import { AnimationGroup } from "@src/animation/group";
import { copyText } from "@utils/clipboard";

const props = defineProps({
    text: {
        type: String,
        required: true,
    },
    label: {
        type: String,
        default: "Copy to clipboard",
    },
});

const isCopied = ref(false);
// AT-only live announcement — empty until a copy fires (re-armed each click so
// a repeat copy re-announces). The sighted feedback is the icon swap.
const liveStatus = ref("");

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
    copyText(props.text);

    isCopied.value = true;
    // Re-arm the announcement (clear then set on the next tick) so a repeat
    // copy re-fires the live region even though the text is unchanged.
    liveStatus.value = "";
    requestAnimationFrame(() => {
        liveStatus.value = "Copied to clipboard";
    });

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
