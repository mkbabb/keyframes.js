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

            <!-- Hidden brush element for animation target -->
            <Paintbrush
                ref="brushEl"
                class="hidden"
            />
        </div>
    </div>
</template>
<script setup lang="ts">
import {
    extractAnimationOptions,
    extractStyleRules,
    parseCSSStylesheet,
    reverseCSSTime,
} from "@mkbabb/value.js";
import {
    Animation,
    CSSKeyframesAnimation,
    resolveKeyframes,
} from "@src/animation/index";


import { onMounted, onUnmounted, ref, useTemplateRef } from "vue";
import { useApplyCSS } from "./composables/useApplyCSS";

import {
    Paintbrush,
} from "@lucide/vue";

import {
    createAnimationUUId,
    getStoredAnimationGroupControlOptions,
    getStoredAnimationOptions,
} from "../stores";
import { toast } from "vue-sonner";
import { copyText } from "@utils/clipboard";

import * as animations from "@src/animation/animations";

import { CSSKeyframesToString } from "@src/animation/format";

const parseCSSAnimationKeyframes = (input: string) => {
    const ast = parseCSSStylesheet(input);
    const resolved = resolveKeyframes(ast);
    const options = extractAnimationOptions(ast);
    const values: Record<string, unknown> = {};
    for (const rule of extractStyleRules(ast)) {
        for (const decl of rule.declarations) {
            if (!decl.name.startsWith("animation"))
                values[decl.name] = decl.value;
        }
    }
    return { keyframes: resolved.keyframes, options, values };
};
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

function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Ï") {
        e.preventDefault();
        formatEditor();
        return;
    }
}

const storedAnimationOptions = getStoredAnimationOptions(animation);

const syncStoredOptionsFromAnimation = (parsedOptions?: Record<string, any>) => {
    const opts = animation.options;
    const stored = storedAnimationOptions.animationOptions;

    stored.duration = reverseCSSTime(opts.duration);
    stored.delay = reverseCSSTime(opts.delay);
    stored.iterationCount = isFinite(opts.iterationCount)
        ? opts.iterationCount
        : "infinite";
    stored.direction = opts.direction;
    stored.fillMode = opts.fillMode;

    // Use the raw parsed timing function name (string) when available,
    // since reverse-lookup by function reference is unreliable (closures).
    if (parsedOptions?.timingFunction) {
        stored.timingFunction = parsedOptions.timingFunction;
    }
};

const onEditorChange = (value: string) => {
    const parseAndUpdate = () => {
        const { keyframes, options } = parseCSSAnimationKeyframes(value);

        const tmpAnimation = new CSSKeyframesAnimation(
            animation.options,
            ...animation.targets,
        ).fromKeyframes(keyframes);

        // Apply parsed animation options (duration, easing, etc.) if present
        if (options) {
            animation.setOptions(options);
        }

        animation.templateFrames = tmpAnimation.templateFrames;

        animation.parse();

        // Sync stored animation options so the Controls tab reflects changes.
        // Pass the raw parsed options so we can use the string timing function
        // name directly (avoids unreliable function-reference reverse-lookup).
        syncStoredOptionsFromAnimation(options);

        emit("keyframesUpdate", {
            animation,
        });

        storedControls.keyframeControls!.keyframes = value;

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

const { isApplied: cssApplied, toggle: toggleApplyCSS, clear: clearApplyCSS } = useApplyCSS({
    getAnimation: () => animation,
    styleId: keyframesStyleId,
    getCSSString: () => cssKeyframesString.value,
    getClassName: () => getTmpAnimationName(),
});

const applyCSSStyles = () => {
    toggleApplyCSS();
    if (cssApplied.value) {
        brushAnimation.play();
    } else {
        brushAnimation.pause();
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

const parseErrorShake = animations.shake();

onMounted(async () => {
    brushAnimation.setTargets(brushEl.value!);
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
            await copyText(cssKeyframesString.value, "CSS copied to clipboard");
        }
    },
    getCSSString: () => cssKeyframesString.value,
    applyCSSStyles,
    cssApplied,
});
</script>

<style scoped></style>
