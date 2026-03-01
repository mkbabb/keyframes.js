<template>
    <div class="min-w-0">
        <div class="relative" @keydown="onKeyDown">
            <CSSCodeEditor
                ref="editorRef"
                :model-value="cssKeyframesString"
                height="450px"
                :font-size="14"
                :line-numbers="true"
                :border="true"
                @update:model-value="onEditorChange"
            />

            <!-- Floating Paste + Format icons -->
            <div class="absolute top-3 right-8 flex flex-col gap-2 z-10">
                <IconTooltip text="Paste from clipboard">
                    <ClipboardPaste @click="pasteFromClipboard" class="w-5 h-5 cursor-pointer text-muted-foreground hover:text-foreground hover:scale-105 transition-colors" />
                </IconTooltip>
                <IconTooltip text="Format CSS">
                    <Sparkles @click="formatEditor" class="w-5 h-5 cursor-pointer text-muted-foreground hover:text-foreground hover:scale-105 transition-colors" />
                </IconTooltip>
            </div>

            <!-- Floating Apply as CSS button -->
            <IconTooltip text="Apply as CSS">
                <Paintbrush
                    ref="brushEl"
                    @click="() => { applyCSSStyles(); }"
                    :class="[
                        'absolute bottom-3 right-8 w-5 h-5 cursor-pointer hover:scale-105 transition-colors z-10',
                        cssApplied
                            ? 'paintbrush-rainbow'
                            : 'text-muted-foreground hover:text-foreground'
                    ]"
                />
            </IconTooltip>
        </div>
    </div>
</template>
<script setup lang="ts">
import { Animation, CSSKeyframesAnimation } from "@src/animation/index";

import {
    parseCSSAnimationKeyframes,
} from "@src/parsing/keyframes";

import { onMounted, onUnmounted, ref, useTemplateRef } from "vue";

import {
    ClipboardPaste,
    Paintbrush,
    Sparkles,
} from "lucide-vue-next";

import {
    createAnimationUUId,
    getStoredAnimationGroupControlOptions,
} from "./animationStores";
import { toast } from "vue-sonner";

import * as animations from "@src/animation/animations";

import {
    CSSKeyframesToString,
} from "@src/parsing/format";
import IconTooltip from "@components/custom/IconTooltip.vue";
import CSSCodeEditor from "./CSSCodeEditor.vue";

const { animation } = defineProps<{
    animation: Animation<any>;
}>();

const emit = defineEmits<{
    (
        e: "keyframesUpdate",
        val: {
            animation: Animation<any>;
        },
    ): void;
}>();

const animationUUID = createAnimationUUId(animation, animation.superKey);
const keyframesStyleId = `keyframes-style-${animationUUID}`;

const defaultKeyframeControls = {
    selectedKeyframesControl: "keyframes",
    dialogOpen: false,
    keyframes: "",
    addKeyframes: "",
};

const storedControls = getStoredAnimationGroupControlOptions(animation);

storedControls.keyframeControls ??= defaultKeyframeControls;

const editorRef = ref<InstanceType<typeof CSSCodeEditor> | null>(null);
const cssKeyframesString = ref("");
const isFormatting = ref(false);
let formattingTimeoutId: ReturnType<typeof setTimeout> | undefined;
const cssApplied = ref(false);

const getTmpAnimationName = () => {
    return keyframesStyleId.replace("keyframes-style-", "").toLowerCase();
};

const updateCSSAnimationKeyframesStringFromAnimation = async () => {
    cssKeyframesString.value = await CSSKeyframesToString(
        animation,
        getTmpAnimationName(),
    );

    return cssKeyframesString.value;
};

const formatEditor = async () => {
    if (!editorRef.value) return;
    isFormatting.value = true;
    await editorRef.value.formatCSS();
    clearTimeout(formattingTimeoutId);
    formattingTimeoutId = setTimeout(() => { isFormatting.value = false; }, 300);
};

const pasteFromClipboard = async () => {
    try {
        const text = await navigator.clipboard.readText();
        if (text && editorRef.value) {
            editorRef.value.setValue(text);
            toast.success("Pasted from clipboard");
        }
    } catch {
        toast.error("Failed to read clipboard");
    }
};

function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Ï") {
        e.preventDefault();
        formatEditor();
        return;
    }
}

const onEditorChange = (value: string) => {
    const parseAndUpdate = () => {
        const { keyframes } = parseCSSAnimationKeyframes(value);

        const tmpAnimation = new CSSKeyframesAnimation(
            animation.options,
            ...animation.targets,
        ).fromKeyframes(keyframes);

        animation.options = tmpAnimation.options;
        animation.templateFrames = tmpAnimation.templateFrames;

        animation.parse();

        emit("keyframesUpdate", {
            animation,
        });

        storedControls.keyframeControls.keyframes = value;

        if (!isFormatting.value) {
            toast.success("Keyframes parsed 🎉");
        }
    };

    try {
        parseAndUpdate();
    } catch (e: unknown) {
        parseErrorShake.play();

        toast.error("Failed to parse keyframes 🔧", {
            description: (e as Error).message,
            duration: 10000,
        });

        console.error(e);
    }
};

const keyframesStyle = ref<HTMLStyleElement | null>(null);

const prevPaused = ref(false);

const applyCSSStyles = () => {
    if (cssApplied.value) {
        animation.paused = prevPaused.value;
        keyframesStyle.value!.textContent = "";
        animation.targets.forEach((t) => t.classList.remove(getTmpAnimationName()));
        brushAnimation.pause();
        cssApplied.value = false;
    } else {
        prevPaused.value = animation.paused;
        animation.paused = animation.started;
        keyframesStyle.value!.textContent = cssKeyframesString.value;
        animation.targets.forEach((t) => t.classList.add(getTmpAnimationName()));
        brushAnimation.play();
        cssApplied.value = true;
    }
};

const brushEl = useTemplateRef<HTMLElement>("brushEl");

const brushAnimation = new CSSKeyframesAnimation({
    duration: 1200,
    timingFunction: "ease-in-out",
    iterationCount: "infinite",
    direction: "alternate",
}).fromString(
    /*css*/
    `@keyframes paintbrushStroke {
        0% { transform: translateX(0px) rotate(0deg); }
        30% { transform: translateX(2px) rotate(-8deg); }
        70% { transform: translateX(-2px) rotate(8deg); }
        100% { transform: translateX(0px) rotate(0deg); }
    }`,
);

const createKeyframesStyleEl = () => {
    const existingKeyframesStyle = document.head.querySelector(`#${keyframesStyleId}`);

    if (!existingKeyframesStyle) {
        keyframesStyle.value = document.createElement("style");
        keyframesStyle.value.id = keyframesStyleId;

        document.head.appendChild(keyframesStyle.value);
    } else {
        keyframesStyle.value = existingKeyframesStyle as HTMLStyleElement;
    }
};

const parseErrorShake = animations.shake();

onMounted(async () => {
    brushAnimation.setTargets(brushEl.value!);
    createKeyframesStyleEl();
    await updateCSSAnimationKeyframesStringFromAnimation();
});

onUnmounted(() => {
    clearTimeout(formattingTimeoutId);
});

// Expose methods for parent components
defineExpose({
    formatCSS: formatEditor,
    copyCSS: async () => {
        if (cssKeyframesString.value) {
            await navigator.clipboard.writeText(cssKeyframesString.value);
            toast.success("CSS copied to clipboard");
        }
    },
    getCSSString: () => cssKeyframesString.value,
});
</script>

<style scoped></style>
