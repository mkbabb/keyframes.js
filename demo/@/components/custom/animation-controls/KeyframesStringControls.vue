<template>
    <div class="flex flex-col h-full min-h-0 min-w-0">
    <Card class="p-0 m-0 flex-1 min-h-0 flex flex-col overflow-hidden">
        <CardContent class="relative m-0 p-0 grid grid-cols-1 flex-1 min-h-0">
            <div
                @keydown="onKeyDown"
                ref="cssKeyframesStringEl"
                class="h-full min-h-[350px] w-full rounded-lg"
            ></div>

            <!-- Floating Apply as CSS button -->
            <IconTooltip text="Apply as CSS">
                <Paintbrush
                    ref="brushEl"
                    @click="() => { applyCSSStyles(); }"
                    :class="[
                        'absolute bottom-3 right-3 w-5 h-5 cursor-pointer hover:scale-105 transition-colors z-10',
                        cssApplied
                            ? 'paintbrush-rainbow'
                            : 'text-muted-foreground hover:text-foreground'
                    ]"
                />
            </IconTooltip>
        </CardContent>
    </Card>
    </div>
</template>
<script setup lang="ts">
import { Animation, CSSKeyframesAnimation } from "@src/animation/index";

import {
    parseCSSAnimationKeyframes,
} from "@src/parsing/keyframes";
import { debounce } from "@src/utils";
import {
    Card,
    CardContent,
} from "@components/ui/card";

import { onMounted, onUnmounted, ref, useTemplateRef, watch } from "vue";

import {
    Paintbrush,
} from "lucide-vue-next";

import DarkTheme from "monaco-themes/themes/Dracula.json";
import LightTheme from "monaco-themes/themes/GitHub.json";

import { useDark } from "@vueuse/core";


import {
    createAnimationUUId,
    getStoredAnimationGroupControlOptions,
} from "./animationStores";
import { toast } from "vue-sonner";

import * as animations from "@src/animation/animations";

import * as monaco from "monaco-editor";
import { convert2 } from "@src/units/utils";
import {
    CSSKeyframesToString,
    formatCSS,
} from "@src/parsing/format";
import IconTooltip from "@components/custom/IconTooltip.vue";

monaco.editor.defineTheme("dark-theme", DarkTheme as any);
monaco.editor.defineTheme("light-theme", LightTheme as any);

monaco.languages.register({ id: "css" });

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

const cssKeyframesStringEl = useTemplateRef<HTMLElement>("cssKeyframesStringEl");
const cssKeyframesString = ref("");
const isFormatting = ref(false);
let formattingTimeoutId: ReturnType<typeof setTimeout> | undefined;
const cssApplied = ref(false);

const getFormatWidth = () => {
    const el = cssKeyframesStringEl.value;
    if (el == null || el.offsetWidth == null) {
        return undefined;
    }
    return convert2(el.offsetWidth, "px", "ch", el);
};

const getTmpAnimationName = () => {
    return keyframesStyleId.replace("keyframes-style-", "").toLowerCase();
};

const updateCSSAnimationKeyframesStringFromAnimation = async () => {
    cssKeyframesString.value = await CSSKeyframesToString(
        animation,
        getTmpAnimationName(),
        getFormatWidth(),
    );

    return cssKeyframesString.value;
};

const formatCSSKeyframesString = async (
    editor: monaco.editor.IStandaloneCodeEditor,
) => {
    const keyframesString = await formatCSS(editor.getValue(), getFormatWidth());

    const cursorPosition = editor.getPosition();

    isFormatting.value = true;
    editor.setValue(keyframesString);
    editor.setPosition(cursorPosition!);
    clearTimeout(formattingTimeoutId);
    formattingTimeoutId = setTimeout(() => { isFormatting.value = false; }, 300);

    toast.success("Keyframes formatted");

    return keyframesString;
};

function onKeyDown(e: KeyboardEvent) {
    const { target, key } = e;

    if (key === "Ï") {
        e.preventDefault();
        formatCSSKeyframesString(cssKeyframesStringEditor);
        return;
    }
}

const updateAnimationFromKeyframesString = debounce(
    (editor: monaco.editor.IStandaloneCodeEditor) => {
        const keyframesString = editor.getValue();

        const parseAndUpdate = () => {
            const { options, values, keyframes } =
                parseCSSAnimationKeyframes(keyframesString);

            const tmpAnimation = new CSSKeyframesAnimation(
                options,
                ...animation.targets,
            ).fromKeyframes(keyframes);

            animation.options = tmpAnimation.options;
            animation.templateFrames = tmpAnimation.templateFrames;

            animation.parse();

            emit("keyframesUpdate", {
                animation,
            });

            storedControls.keyframeControls.keyframes = keyframesString;

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
                action: {
                    label: "Retry",
                    onClick: () => {
                        updateAnimationFromKeyframesString(editor);
                    },
                },
            });

            console.error(e);
        }
    },
    200,
    false,
);

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

const isDark = useDark({ disableTransition: false });

const setCodeTheme = () => {
    monaco.editor.setTheme(isDark.value ? "dark-theme" : "light-theme");
};
watch(isDark, () => {
    setCodeTheme();
});

const createKeyframesStyleEl = (el?: HTMLElement) => {
    const existingKeyframesStyle = document.head.querySelector(`#${keyframesStyleId}`);

    if (!existingKeyframesStyle) {
        keyframesStyle.value = document.createElement("style");
        keyframesStyle.value.id = keyframesStyleId;

        document.head.appendChild(keyframesStyle.value);
    } else {
        keyframesStyle.value = existingKeyframesStyle as HTMLStyleElement;
    }
};

let cssKeyframesStringEditor: monaco.editor.IStandaloneCodeEditor;

const parseErrorShake = animations.shake();

onMounted(async () => {
    brushAnimation.setTargets(brushEl.value!);

    createKeyframesStyleEl();

    await updateCSSAnimationKeyframesStringFromAnimation();

    cssKeyframesStringEditor = monaco.editor.create(cssKeyframesStringEl.value!, {
        value: cssKeyframesString.value,
        language: "css",
        fontLigatures: true,
        theme: isDark.value ? "dark-theme" : "light-theme",
        fontSize: 14,
        fontFamily: "Fira Code",
        minimap: { enabled: false },
        wordWrap: "on",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        padding: {
            top: 16,
            bottom: 16,
        },
    });

    cssKeyframesStringEditor.onDidChangeModelContent(() => {
        updateAnimationFromKeyframesString(cssKeyframesStringEditor);
    });

    parseErrorShake.setTargets(cssKeyframesStringEl.value!);
});

onUnmounted(() => {
    clearTimeout(formattingTimeoutId);
    cssKeyframesStringEditor?.dispose();
});

// Expose methods for parent components
defineExpose({
    formatCSS: () => formatCSSKeyframesString(cssKeyframesStringEditor),
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
