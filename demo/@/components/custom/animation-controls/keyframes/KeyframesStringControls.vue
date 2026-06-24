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
import { reverseCSSTime } from "@mkbabb/value.js";
import type { KeyframesAnimation } from "@mkbabb/keyframes.js";
import { kfEngine } from "@utils/kfEngine";

import { onMounted, ref, useTemplateRef } from "vue";
import { useTimeoutFn } from "@vueuse/core";
import { useApplyCSS } from "./composables/useApplyCSS";
import { parseAnimationCSS } from "./utils/parseAnimationCSS";

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

// HEAVY surface from the warmed engine (kfEngine(), L.W8 S1 dogfood inversion) —
// synchronous, since the warm resolves before the app mounts. `presets` is the
// barrel's preset namespace (the old `* as animations`); `CSSKeyframesToString`
// serializes a parsed animation back to CSS; `compileToCSS` (K.W10 CC-4 DEMO LEG)
// powers the "Export CSS" button — the SAME gated compiler the round-trip proves,
// surfacing the CC-3 ineligibility report VERBATIM (the editor as a CSS IDE).
const { CSSKeyframesAnimation, presets, CSSKeyframesToString, compileToCSS } =
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

const editorRef = useTemplateRef<InstanceType<typeof CSSCodeEditor>>("editorRef");
const cssKeyframesString = ref("");
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

const getTmpAnimationName = () => {
    return keyframesStyleId.replace("keyframes-style-", "").toLowerCase();
};

const updateCSSAnimationKeyframesStringFromAnimation = async () => {
    try {
        cssKeyframesString.value = await CSSKeyframesToString(
            animation,
            getTmpAnimationName(),
        );
    } catch (e: unknown) {
        // I.W0 S4 — kill the mis-attributing placeholder. With the value-seam
        // (S1) + serialize-from-template (S2) fixes, the empty-`var()` parse
        // throw no longer reaches here, so this catch fires ONLY for a genuine
        // structural limit (a custom `timingFunction` with no CSS twin —
        // `serializeEasing` throwing). NAME THE ACTUAL condition rather than
        // hard-coding "custom — no CSS twin" for EVERY throw (the old floor
        // mis-attributed the empty-value parse failure to easing and sent
        // triage down the B5→B4 false trail). Never silently degrade to
        // `linear`; the placeholder reports the real reason.
        const reason = (e as Error).message;
        console.warn(
            "[KeyframesString] could not serialize the animation to CSS:",
            reason,
        );
        cssKeyframesString.value = `/* could not serialize: ${reason} */`;
    }

    return cssKeyframesString.value;
};

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

const onEditorChange = async (value: string) => {
    const parseAndUpdate = async () => {
        const { keyframes, options } = await parseAnimationCSS(value);

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
        await parseAndUpdate();
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

const parseErrorShake = presets.shake();

onMounted(async () => {
    brushAnimation.setTargets(brushEl.value!);
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
