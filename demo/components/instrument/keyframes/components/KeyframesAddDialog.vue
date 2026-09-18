<template>
    <CSSPasteDialog
        v-model:open="open"
        v-model:text="text"
        title="Add keyframes"
        description="Append @keyframes stops to the current animation"
        button-label="Add keyframes"
        :button-icon="FileIcon"
        :submit="onSubmit"
    >
        <template #trigger>
            <DialogTrigger as-child>
                <button
                    type="button"
                    aria-label="Add keyframes"
                    class="inline-flex items-center justify-center cursor-pointer scale-on-hover rounded-lg bg-transparent border-none p-0"
                >
                    <FilePlus2 class="stroke-2"></FilePlus2>
                </button>
            </DialogTrigger>
        </template>
        <template #footer-extra>
            <div ref="progressBarEl" class="progress-bar w-full bottom mt-2"></div>
        </template>
    </CSSPasteDialog>
</template>

<script setup lang="ts">
import { useTemplateRef, watch } from "vue";
import { useMagicKeys } from "@vueuse/core";
import { DialogTrigger } from "@mkbabb/glass-ui";
import { FileIcon, FilePlus2 } from "@lucide/vue";
import { loadAnimationEngine } from "@mkbabb/keyframes.js";
import CSSPasteDialog from "@components/instrument/timeline/CSSPasteDialog.vue";

/**
 * The Add-keyframes dialog — a THIN ADAPTER over the one CSS-paste shell
 * (KF.W7 G15 / R-7 ≡ KAD-F3). This file used to re-author 80 lines of that
 * shell as 161: the same toaster guard, the same `onInput`, the same well, plus
 * a `DialogDescription` nested INSIDE `DialogTitle` (`<h2><h3/><p/></h2>` —
 * KAD-6) and a footer carrying a literal `class` token in its class string.
 * All of that dies with the template; the filename, the import site and the
 * mount contract (`v-model:open` · `v-model:text` · `:format` · `@submit`) are
 * unchanged, so its one live consumer needs no edit.
 *
 * S-9 (W6-I) — the shell's well is now the producer's `Textarea`, and TWO of
 * the four deltas this adapter kept die with the contenteditable host they
 * reached into: hljs recolouring of the well (a native textarea has no
 * innerHTML to paint — KAD-3's "inert for the whole session" highlighting,
 * KAD-18's `hljs` plate and the `pre-class` seam are gone together, not
 * patched) and Tab-insert + per-keystroke recolour (a Tab in a textarea moves
 * focus, the a11y-correct default; CPD R-20). What survives here, and only
 * this:
 *   1. the `DialogTrigger` — through the shell's `trigger` slot, so reka's root
 *      context still reaches it and the `<button aria-label="Add keyframes">`
 *      DOM shape `useToolbarKeyboard`'s roving tabindex depends on is preserved
 *      verbatim;
 *   2. Shift+Alt+F reformat — which EMITS `update:text` with the formatted
 *      result (KAD-13: the `format` prop's JSDoc declared a pure formatter
 *      while the wiring secretly wrote the parent model and `reformat()` never
 *      emitted; this IS R-7's text-hoisting constraint, in one line). The model
 *      write is the whole of it now — the textarea renders the model.
 *
 * The progress bar rides `footer-extra` unchanged (KAD-15 → KF.W6).
 */
const props = defineProps<{
    /** Formats the raw string and RETURNS the result; writes nothing. */
    format: (raw: string) => Promise<string>;
}>();

const emit = defineEmits<{
    (e: "submit", value: string): void;
}>();

const open = defineModel<boolean>("open", { required: true });
const text = defineModel<string>("text", { required: true });

const progressBarEl = useTemplateRef<HTMLElement>("progressBarEl");

const reformat = async () => {
    text.value = await props.format(text.value);
};

const animateProgressBar = async () => {
    if (!progressBarEl.value) return;
    const { CSSKeyframesAnimation } = await loadAnimationEngine();
    new CSSKeyframesAnimation({ duration: 1000 }, progressBarEl.value)
        .fromVars([{ width: "0%" }, { width: "100%" }])
        .play();
};

// The parent owns this dialog's close (`useKeyframeOps` closes on its own
// success path), so the submit returns VOID and the shell leaves `open` alone —
// the shell's void-return rule preserves that contract exactly.
const onSubmit = (value: string): void => {
    emit("submit", value);
    animateProgressBar();
};

// Shift+Alt+F (or the dead-key Ï variant) reformats while the dialog is open.
const keys = useMagicKeys({ reactive: true });
watch(
    () => (keys["Shift"] && keys["Alt"] && keys["F"]) || keys["Ï"],
    (v) => {
        if (v && open.value) {
            reformat();
        }
    },
);
</script>
