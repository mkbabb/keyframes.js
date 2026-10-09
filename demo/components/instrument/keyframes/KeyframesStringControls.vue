<template>
    <!-- UIA-KF-275 (X.KF.W13X.keyframes) — the pane NAMES what it edits. It
         opened straight onto line 1 of the code, with no name and no state
         beside the source (the toasts are the only other channel). A compact
         header carries the animation's name as authored (`Spring Keyframes`,
         not the buffer's CSS ident) — the region's accessible name —
         and one status line (parsed · parse error · applied) announced
         politely where it changes, beside the buffer it describes.
         X-DS pass 1 (KF-P1-16) — the header is the code well's FIRST ROW,
         inside the card (the editor's `#header` slot), under a hairline: it
         hung on the page grid above the card, anchored to no surface.
         C1 (KF-C1-07) — the well is unframed (`border` false): the pane host
         draws the one frame (ControlsPaneWrapper), so a framed well here was a
         card in a card. -->
    <section class="min-w-0" :aria-labelledby="headingId">
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
                :border="false"
                @update:model-value="onEditorChange"
            >
                <template #header>
                    <!-- X-DS pass 9 (KF-C9-07) — the pane's one inset
                         (`--configurator-pad-inline`) and one title rung (glass's
                         configurator section label), as the scene facets. -->
                    <header class="flex items-center justify-between gap-2 border-b border-border px-(--configurator-pad-inline) py-2">
                        <h3 :id="headingId" class="configurator-section-label min-w-0 truncate">
                            {{ animationName }}
                        </h3>
                        <span
                            role="status"
                            aria-live="polite"
                            class="text-caption text-muted-foreground flex shrink-0 items-center gap-1.5"
                        >
                            <StatusDot :state="paneStatus.dot" size="sm" motion="off" />
                            {{ paneStatus.text }}
                        </span>
                    </header>
                </template>
            </CSSCodeEditor>
        </div>
    </section>
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

import { computed, h, onMounted, useId, useTemplateRef } from "vue";
import { useKeyframeBrushApply } from "./composables/useKeyframeBrushApply";
import { useKeyframesEditor } from "./composables/useKeyframesEditor";

import { toast, ToastAction, type ToastHandle } from "@mkbabb/glass-ui/toast";
import { StatusDot } from "@mkbabb/glass-ui/status-dot";
import { copyWithToast } from "@composables/copyWithToast";

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
    sheetCSSString,
    keyframesStyleId,
    animationName,
    parseState,
    updateFromString,
    updateCSSAnimationKeyframesStringFromAnimation,
} = useKeyframesEditor(() => animation, emit);

const editorRef = useTemplateRef<InstanceType<typeof CSSCodeEditor>>("editorRef");

// THE ONE FORMAT BOUNDARY (KF-CE-9 + KF-CE-37 ≡ RibbonBar M-3/C-8). Both
// format affordances — the chord below and the ribbon's Format button
// (`RibbonBar.vue`, through this component's exposed `formatCSS`) — reach
// `formatEditor`, and it is the only place a format's rejection is caught:
// prettier refuses the ordinary mid-edit buffer (an unclosed block, a stray
// `}`), and before this boundary that rejection floated unhandled. The house
// idiom (`withErrorToastAsync`, one file over) is written here in its own
// form: toast + description + Retry.
//
// UIA-KF-219 (X.KF.W13X.r4panes) — an ACCEPTED edit raises no toast: the
// editor and the stage already show it, and a success toast on every parse was
// the chatter the row names. So the `isFormatting` latch (and its 300 ms grace)
// that kept a format-induced parse from toasting "Keyframes parsed" over "CSS
// formatted" has no toast left to guard and is gone with it. A REFUSED edit
// still toasts, once: the parse toast holds ONE live handle, so a repeat
// refusal REPLACES rather than stacks (KF-CE-36), and the next accepted edit
// dismisses it, because the refusal it reported is over.
let parseToast: ToastHandle | undefined;
const raiseParseToast = (options: Parameters<typeof toast>[0]) => {
    parseToast?.dismiss();
    parseToast = toast(options);
};
const clearParseToast = () => {
    parseToast?.dismiss();
    parseToast = undefined;
};

const formatEditor = async () => {
    if (!editorRef.value) return;
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

// The buffer's parse state (`parseState`, above), for the header's status line
// (UIA-KF-275): the last edit either adopted (`parsed`) or refused (`error`);
// the initial buffer is the animation's own projection, so it starts parsed.
// X.KF.W13X.esc1 — it is the channel's, held in the store with the buffer.

const applyEditorChange = async (value: string) => {
    // X.KF.W13X.esc1 — the channel's buffer records what the user wrote (the
    // editor already shows it, so the model write is a no-op there); a refused
    // edit stays in the store as the channel's draft.
    cssKeyframesString.value = value;
    try {
        await updateFromString(value);
        parseState.value = "parsed";
        clearParseToast();
    } catch (e: unknown) {
        parseState.value = "error";
        shakeEditorWell();

        raiseParseToast({
            title: "Could not parse keyframes",
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
    getCSSString: () => sheetCSSString.value,
});

const headingId = useId();

// Applied outranks the parse state: an applied sheet is what the target shows.
const paneStatus = computed(() => {
    if (cssApplied.value) return { dot: "active", text: "Applied" } as const;
    if (parseState.value === "error")
        return { dot: "error", text: "Parse error" } as const;
    return { dot: "success", text: "Parsed" } as const;
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
// element that moves. `setTargets` is the only populator the engine has — a
// preset factory takes options, never targets.
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

// X.KF.W13X.esc1 (ESC-mobile-1) — the buffer is the channel's (the store). A
// mount re-projects it from the engine, except over an unparsed draft: that
// text is the user's and the engine never held it, so the swap back to the
// channel shows it as written, with its "Parse error" status.
onMounted(async () => {
    if (parseState.value === "error" && cssKeyframesString.value) return;
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
            await copyWithToast(compiled.css, "Compiled CSS copied");
        } else if (compiled.css) {
            // Partial: some children compiled, some refused — copy what shipped,
            // name what did not (the honest-refusal clause).
            await copyWithToast(compiled.css, "Compiled CSS copied (partial)");
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
            title: "Could not compile CSS",
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
            await copyWithToast(cssKeyframesString.value, "CSS copied to clipboard");
        }
    },
    exportCompiledCSS,
    // The CSS the Apply press injects (the style id's one name, N-8) — the
    // buffer shows the same animation under `displayName` (UIA-KF-174).
    getCSSString: () => sheetCSSString.value,
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
