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
import type { KeyframesAnimation } from "@mkbabb/keyframes.js";
import { kfEngine } from "@utils/kfEngine";

import { onMounted, ref, useTemplateRef } from "vue";
import { useTimeoutFn } from "@vueuse/core";
import { useKeyframeBrushApply } from "./composables/useKeyframeBrushApply";
import { useKeyframesEditor } from "./composables/useKeyframesEditor";

import {
    Paintbrush,
} from "@lucide/vue";

import { toast } from "vue-sonner";
import { copyText } from "@utils/clipboard";

// HEAVY surface from the warmed engine (kfEngine(), L.W8 S1 dogfood inversion) —
// synchronous, since the warm resolves before the app mounts. `presets` is the
// barrel's preset namespace (the old `* as animations`); `CSSKeyframesToString`
// serializes a parsed animation back to CSS; `compileToCSS` (K.W10 CC-4 DEMO LEG)
// powers the "Export CSS" button — the SAME gated compiler the round-trip proves,
// surfacing the CC-3 ineligibility report VERBATIM (the editor as a CSS IDE).
const { CSSKeyframesAnimation, presets, compileToCSS } =
    kfEngine();

import CSSCodeEditor from "./CSSCodeEditor.vue";

const { animation } = defineProps<{
    animation: KeyframesAnimation<any>;
}>();

const emit = defineEmits<{
    (
        e: "keyframesUpdate",
        val: {
            animation: KeyframesAnimation<any>;
        },
    ): void;
}>();

const {
    cssKeyframesString,
    keyframesStyleId,
    getTmpAnimationName,
    updateFromString,
    updateCSSAnimationKeyframesStringFromAnimation,
} = useKeyframesEditor(() => animation, emit);

const editorRef = useTemplateRef<InstanceType<typeof CSSCodeEditor>>("editorRef");
const isFormatting = ref(false);

// Reset the formatting flag 300ms after a format completes. useTimeoutFn
// owns the handle + auto-cleans on unmount; re-calling start() restarts it.
const { start: startFormattingReset } = useTimeoutFn(
    () => {
        isFormatting.value = false;
    },
    300,
    { immediate: false },
);

const formatEditor = async () => {
    if (!editorRef.value) return;
    isFormatting.value = true;
    await editorRef.value.formatCSS();
    startFormattingReset();
};

function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Ï") {
        e.preventDefault();
        formatEditor();
        return;
    }
}

const onEditorChange = async (value: string) => {
    try {
        await updateFromString(value);
        if (!isFormatting.value) toast.success("Keyframes parsed 🎉");
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

const { applyCSSStyles, cssApplied } = useKeyframeBrushApply({
    animation,
    styleId: keyframesStyleId,
    getCSSString: () => cssKeyframesString.value,
    templateRef: "brushEl",
});

const parseErrorShake = presets.shake();

onMounted(async () => {
    await updateCSSAnimationKeyframesStringFromAnimation();
});

// K.W10 CC-4 (DEMO LEG) — Export CSS: compile the CURRENT animation to a
// ZERO-RUNTIME CSS artifact via the SAME gated `compileToCSS` (the round-trip's
// BACKWARD half), copy it, and surface the CC-3 ineligibility report VERBATIM
// (the named refusal IS the product value — it teaches where kf's unique axes
// exceed pure CSS). A `weighted` blend / custom renderer / un-densifiable oklab
// REFUSES with its typed reason; the JS playback stays the only faithful path.
const exportCompiledCSS = async () => {
    try {
        const compiled = await compileToCSS([animation]);
        if (compiled.eligible && compiled.css) {
            await copyText(
                compiled.css,
                "Compiled CSS copied — zero-runtime, paste & ship 🎉",
            );
        } else if (compiled.css) {
            // Partial: some children compiled, some refused — copy what shipped,
            // name what did not (the honest-refusal clause).
            await copyText(compiled.css, "Compiled CSS copied (partial)");
            for (const refusal of compiled.refusals) {
                toast.warning(`Could not compile "${refusal.name}"`, {
                    description: refusal.message,
                    duration: 10000,
                });
            }
        } else {
            // Nothing compiled — the whole animation exceeds pure CSS. Show the
            // VERBATIM refusal reasons (no softened "could not compile").
            for (const refusal of compiled.refusals) {
                toast.error(`Cannot compile to CSS — ${refusal.reason}`, {
                    description: refusal.message,
                    duration: 10000,
                });
            }
        }
    } catch (e: unknown) {
        toast.error("Export CSS failed 🔧", {
            description: (e as Error).message,
            duration: 10000,
        });
        console.error(e);
    }
};

// Expose methods for parent components
defineExpose({
    formatCSS: formatEditor,
    copyCSS: async () => {
        if (cssKeyframesString.value) {
            await copyText(cssKeyframesString.value, "CSS copied to clipboard");
        }
    },
    exportCompiledCSS,
    getCSSString: () => cssKeyframesString.value,
    applyCSSStyles,
    cssApplied,
});
</script>

<style scoped></style>
