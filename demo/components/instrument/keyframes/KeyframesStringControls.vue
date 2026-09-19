<template>
    <div class="min-w-0">
        <div class="relative" @keydown="onKeyDown">
            <CSSCodeEditor
                ref="editorRef"
                :model-value="cssKeyframesString"
                aria-label="Keyframes CSS"
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
// THE ONE FOCUS OWNER ON A KEYFRAMES ACTIVATION (KSC N-9), decided with the
// strip's fate. Two composables used to claim `focus()` on the same activation:
// the pill strip's roving-focus restore (which moved focus back onto the tab the
// user arrowed from) and `useKeyframesPaneReveal`'s reveal-focus (which moves
// focus INTO the revealed panel that hosts this editor). The strip is deleted,
// so the contest is over by construction — and the survivor is named here rather
// than left implicit: `useKeyframesPaneReveal` OWNS the focus on activation, and
// this component does not take it. Nothing in this file calls `focus()`; if a
// future affordance needs to, it coordinates with that owner instead of racing
// it.
import type { KeyframesAnimation } from "@mkbabb/keyframes.js";
import { kfEngine } from "@kf-engine";

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

// THE ONE FORMAT BOUNDARY (KF-CE-9 + KF-CE-37 ≡ RibbonBar M-3/C-8). Both
// format affordances — the chord below and the ribbon's Format button
// (`RibbonBar.vue`, through this component's exposed `formatCSS`) — reach
// `formatEditor`, and it is the only place a format's rejection is caught:
// prettier refuses the ordinary mid-edit buffer (an unclosed block, a stray
// `}`), and before this boundary that rejection floated unhandled while
// `isFormatting` stayed true for the session, silencing every later
// "Keyframes parsed" toast. The house idiom (`withErrorToastAsync`, one file
// over) is written here in its own form: toast + description + Retry. The
// latch releases in `finally` — on success AND on rejection.
//
// `isFormatting` exists to keep the format-induced parse from ALSO toasting
// "Keyframes parsed" over "CSS formatted": the formatted text reaches the
// model synchronously inside `formatCSS` (KF-CE-7), so `onEditorChange` runs
// while the latch is up; the 300 ms grace after release covers the parse's
// own awaits. The parse toast additionally carries a stable id, so a stray
// one REPLACES rather than stacks (KF-CE-36).
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
    try {
        await editorRef.value.formatCSS();
    } catch (e: unknown) {
        toast.error("Could not format CSS", {
            description: (e as Error).message,
            duration: 10000,
            action: { label: "Retry", onClick: () => void formatEditor() },
        });
        console.error(e);
    } finally {
        startFormattingReset();
    }
};

// KF-CE-35 — the format accelerator is the editors' Format-Document chord,
// Shift+Alt+F, matched on the PHYSICAL key so it is the same chord on every
// layout: the former `e.key === "Ï"` was that chord's macOS dead-key OUTPUT,
// matched nothing on Windows/Linux, and made `Ï` untypeable in the buffer.
// `preventDefault` only when the chord matches.
function onKeyDown(e: KeyboardEvent) {
    if (e.altKey && e.shiftKey && !e.ctrlKey && !e.metaKey && e.code === "KeyF") {
        e.preventDefault();
        void formatEditor();
    }
}

const onEditorChange = async (value: string) => {
    try {
        await updateFromString(value);
        if (!isFormatting.value) {
            toast.success("Keyframes parsed 🎉", { id: "kf-parse" });
        }
    } catch (e: unknown) {
        parseErrorShake.play();

        toast.error("Failed to parse keyframes 🔧", {
            id: "kf-parse",
            description: (e as Error).message,
            duration: 10000,
        });

        console.error(e);
    }
};

const { applyCSSStyles, clearApplied, cssApplied } = useKeyframeBrushApply({
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
// exceed pure CSS). A `weight` blend / custom renderer / un-densifiable oklab
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
    // RB-6 (X.KF.W12.e) — the Apply toggle is the RIBBON's, behind
    // `v-if="selectedControl === 'keyframes'"`, while this pane is force-mounted
    // and never unmounts. The affordance's own branch takes the applied identity
    // down when it leaves, through this handle, so the state cannot outlive the
    // only control that can undo it.
    clearAppliedCSS: clearApplied,
    cssApplied,
});
</script>

<style scoped></style>
