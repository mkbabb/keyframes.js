<template>
    <!-- KAD-18 ≡ KF-KE-24 — the well's PLATE, recorded at the site that
         sets it. `hljs` is a RUNTIME-INJECTED, UNLAYERED rule
         (`.hljs{background:#0d1117}`), so it outranks the shell's own
         surface utility here: the demo's editable-well token
         (`--input-on-glass`, R-24) paints at the timeline's paste mount and
         is INERT at this one, and the hard `#ffffff`/`#0d1117` plate lands
         inside the warm `--card` surface instead. The TOKEN DECISION is this
         wave's and is stated at KeyframesEditor: a plate reads the surface it
         is on. The MECHANISM that makes it reachable here — layering the
         injected sheet, or re-tokenizing the theme — belongs to the editor
         pipeline (EDITOR/KFED-UNIT) and is not pre-empted; the shell's class
         is deliberately left intact so the cure lands in one place when that
         pipeline does, rather than being deleted as dead today and re-added
         tomorrow. -->
    <CSSPasteDialog
        ref="shell"
        v-model:open="open"
        v-model:text="text"
        title="Add keyframes"
        description="Append @keyframes stops to the current animation"
        button-label="Add keyframes"
        :button-icon="FileIcon"
        pre-class="hljs"
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
import { useEventListener, useMagicKeys } from "@vueuse/core";
import { DialogTrigger } from "@mkbabb/glass-ui";
import { FileIcon, FilePlus2 } from "@lucide/vue";
import { loadAnimationEngine } from "@mkbabb/keyframes.js";
import CSSPasteDialog from "@components/instrument/timeline/CSSPasteDialog.vue";
import { useCodeHighlight } from "../composables/useHighlightCSS";
import { insertTabAtCursor } from "../utils/contenteditable";

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
 * FOUR genuine deltas survive here, and only these four:
 *   1. the `DialogTrigger` — through the shell's `trigger` slot, so reka's root
 *      context still reaches it and the `<button aria-label="Add keyframes">`
 *      DOM shape `useToolbarKeyboard`'s roving tabindex depends on is preserved
 *      verbatim;
 *   2. hljs highlighting of the shell's well, reached through the `textEl` the
 *      shell exposes (L-4's falsifier: the `<pre>` identity is HELD by the
 *      shell and PUBLISHED through the seam R-19 called dead);
 *   3. Tab-insert + per-keystroke recolour, bound to that same element;
 *   4. Shift+Alt+F reformat — which now EMITS `update:text` with the formatted
 *      result (KAD-13: the `format` prop's JSDoc declared a pure formatter
 *      while the wiring secretly wrote the parent model and `reformat()` never
 *      emitted; this IS R-7's text-hoisting constraint, in one line).
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

const shell = useTemplateRef<InstanceType<typeof CSSPasteDialog>>("shell");
const progressBarEl = useTemplateRef<HTMLElement>("progressBarEl");
const wellEl = () => shell.value?.textEl ?? null;

const { setHighlightingString, highlightAll } = useCodeHighlight(() => [
    wellEl(),
]);

// `DialogContent` unmounts its subtree on close, so the well is a NEW element
// on every open; the W5 idempotence record is keyed to the element, so the
// first `highlightAll` on a fresh one colourises. Watching the exposed ref is
// the correct trigger (it replaces the old `onMounted` + `watch(ownRef)` pair).
watch(wellEl, (el) => {
    if (el) highlightAll(el);
});

useEventListener(wellEl, "keydown", (e: KeyboardEvent) => {
    if (e.key === "Ï") {
        e.preventDefault();
        return;
    }

    if (e.key === "Tab") {
        e.preventDefault();
        insertTabAtCursor(e.target as HTMLElement);
    }

    highlightAll();
});

const reformat = async () => {
    const formatted = await props.format(text.value);
    text.value = formatted;
    setHighlightingString(wellEl(), formatted);
    highlightAll();
    window.getSelection()?.collapseToEnd();
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
