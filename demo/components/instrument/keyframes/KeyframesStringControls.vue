<template>
    <div class="min-w-0">
        <!-- D-4 (X.KF.W12.e) — the editor WELL is the parse-error shake's
             target: the element whose buffer failed to parse is the element
             that moves. The preset used to be constructed target-less. -->
        <div ref="editorWellRef" class="relative" @keydown="onKeyDown">
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

import { h, onMounted, ref, useTemplateRef } from "vue";
import { useTimeoutFn } from "@vueuse/core";
import { useKeyframeBrushApply } from "./composables/useKeyframeBrushApply";
import { useKeyframesEditor } from "./composables/useKeyframesEditor";

import { toast, ToastAction, type ToastHandle } from "@mkbabb/glass-ui/toast";
import { copyText } from "@utils/clipboard";

// HEAVY surface from the warmed engine (kfEngine(), L.W8 S1 dogfood inversion) —
// synchronous, since the warm resolves before the app mounts. `presets` is the
// barrel's preset namespace (the old `* as animations`); `compileToCSS`
// (K.W10 CC-4 DEMO LEG) powers the "Export CSS" button — the SAME gated compiler
// the round-trip proves, surfacing the CC-3 ineligibility report VERBATIM (the
// editor as a CSS IDE).
//
// D-23 (X.KF.W12.e, §0u part (2)) — `CSSKeyframesAnimation` is gone from the
// destructure: it has had no reader in this file since the brush moved into its
// own seat, and it was the whole of the file's claim on that class. It was also
// TS6133 `(55,9)`, one of the two in-bounds diagnostics this unit owed. The
// other was a `getTmpAnimationName` destructure, dead at its binding the same
// way — and the accessor behind it is now deleted outright (N-8: ONE name, and
// `keyframesStyleId` is it).
const { presets, compileToCSS } = kfEngine();

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
// own awaits. The parse toast additionally holds ONE live handle, so a stray
// one REPLACES rather than stacks (KF-CE-36): the previous parse toast is
// dismissed before the next is raised.
const isFormatting = ref(false);
let parseToast: ToastHandle | undefined;
const raiseParseToast = (options: Parameters<typeof toast>[0]) => {
    parseToast?.dismiss();
    parseToast = toast(options);
};

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
        toast({
            title: "Could not format CSS",
            tone: "destructive",
            description: (e as Error).message,
            duration: 10000,
            action: h(ToastAction, { altText: "Retry", onClick: () => void formatEditor() }, () => "Retry"),
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

const applyEditorChange = async (value: string) => {
    try {
        await updateFromString(value);
        if (!isFormatting.value) {
            raiseParseToast({ title: "Keyframes parsed 🎉", tone: "success" });
        }
    } catch (e: unknown) {
        shakeEditorWell();

        raiseParseToast({
            title: "Failed to parse keyframes 🔧",
            tone: "destructive",
            description: (e as Error).message,
            duration: 10000,
        });

        console.error(e);
    }
};

// N-7 (X.KF.W12.e) — THE TRANSPLANTS LAND IN THE ORDER THEY WERE TYPED.
//
// The handler was `async` and invoked straight off `update:model-value`, so two
// edits arriving inside one another's await window raced: `updateFromString`
// suspends three times before `adoptCompiled` writes the animation, and the last
// call to RESOLVE won — not the last edit the user made. A slow parse followed
// by a fast one silently reinstated the older buffer over the newer one, in both
// the animation and the store it rewrites.
//
// The editor is a single sequential source, so the handler is a queue of one:
// each call chains onto the previous run's settlement. The tail never rejects —
// `applyEditorChange` catches every failure itself — so nothing accumulates an
// unhandled rejection, and the returned promise is the caller's handle for the
// same settlement (which is what the gate awaits).
let editorChangeTail: Promise<void> = Promise.resolve();

const onEditorChange = (value: string): Promise<void> => {
    editorChangeTail = editorChangeTail.then(() => applyEditorChange(value));
    return editorChangeTail;
};

// D-5 / L-M-4 / C-4 (X.KF.W12.e) — NO `templateRef`, AND NO DECOY.
//
// This pane's Apply affordance is the ribbon's button, not a glyph of its own.
// The seat's contract used to make `templateRef` mandatory, so the file rendered
// a `class="hidden"` `<Paintbrush>` purely to satisfy it — and then ran a 700 ms
// infinite wiggle on that invisible element, forever, in a pane the controls
// wrapper force-mounts and never unmounts. The contract is optional now
// (`useKeyframeBrushApply`), so the decoy, its icon import, the engine read and
// the preset parse all go with it; the apply identity is unchanged.
const { applyCSSStyles, clearApplied, cssApplied } = useKeyframeBrushApply({
    animation,
    styleId: keyframesStyleId,
    getCSSString: () => cssKeyframesString.value,
});

// D-4 / L-M-3 / C-3 (X.KF.W12.e) — THE PARSE-ERROR SHAKE HAS SOMETHING TO
// SHAKE, AND COSTS NOTHING UNTIL A PARSE ACTUALLY FAILS.
//
// The bank's row is two defects on one line: `presets.shake()` was constructed
// at EVERY setup — a full `fromString` parse of the preset's stop list — and was
// never given targets, so the `play()` in the catch above drove ZERO elements.
// All of the cost, none of the motion. Binding targets at mount cures the second
// half and leaves the first standing, so both fall together here: the preset is
// built ON the first parse failure, over the well the editor sits in, and
// memoized for the rest of the instance's life. A session that never fails to
// parse never parses the preset — the same accounting D-5 applied to the brush
// glyph one file over (no glyph ⇒ no engine read, no parse, no loop).
//
// The target is the editor WELL: the element whose buffer failed to parse is the
// element that moves. The folder's own idiom is this one (`KeyframesEditor.vue`:
// `presets.warpLeft().setTargets(leaving)`), and `setTargets` is the only
// populator the engine has — a preset factory takes options, never targets.
//
// D-25 rides with it and is no longer vacuous. The bank booked D-25 INFO
// *because* neither animation rendered (D-4 here, D-5 at the brush); D-5's decoy
// is deleted and this one now renders, so the standalone play path's
// `respectReducedMotion` opt-in is live work rather than a formality — the same
// one PRM motion KF-KE-8 gave the delete choreography and this unit gave the
// brush. Under the preference the failure still announces itself through the
// toast and the console; it stops moving the pane.
const editorWellRef = useTemplateRef<HTMLElement>("editorWellRef");

let parseErrorShake: ReturnType<typeof presets.shake> | undefined;

const shakeEditorWell = () => {
    const well = editorWellRef.value;
    if (well === null) return;

    parseErrorShake ??= presets
        .shake({ respectReducedMotion: true })
        .setTargets(well);

    void parseErrorShake.play();
};

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
                toast({
                    title: `Could not compile "${refusal.name}"`,
                    tone: "warning",
                    description: refusal.message,
                    duration: 10000,
                });
            }
        } else {
            // Nothing compiled — the whole animation exceeds pure CSS. Show the
            // VERBATIM refusal reasons (no softened "could not compile").
            for (const refusal of compiled.refusals) {
                toast({
                    title: `Cannot compile to CSS — ${refusal.reason}`,
                    tone: "destructive",
                    description: refusal.message,
                    duration: 10000,
                });
            }
        }
    } catch (e: unknown) {
        toast({
            title: "Export CSS failed 🔧",
            tone: "destructive",
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
