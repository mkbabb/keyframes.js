<template>
    <Dialog
        :open="open"
        @update:open="(value) => emit('update:open', value)"
    >
        <DialogTrigger as-child>
            <button
                type="button"
                aria-label="Add keyframes"
                class="inline-flex items-center justify-center cursor-pointer scale-on-hover rounded-lg bg-transparent border-none p-0"
            >
                <FilePlus2 class="stroke-2"></FilePlus2>
            </button>
        </DialogTrigger>

        <DialogContent
            @interact-outside="
                (event) => {
                    if (isInsideToaster(event.target))
                        return event.preventDefault();
                }
            "
        >
            <DialogTitle>
                <CardTitle class="text-heading">Add keyframes</CardTitle>
                <DialogDescription
                    class="text-subheading text-muted-foreground"
                >
                    Add keyframes to the animation
                </DialogDescription>
            </DialogTitle>
            <div>
                <pre
                    ref="addKeyframesEl"
                    @keydown="onKeyDown"
                    @input="onInput"
                    class="hljs css min-h-[25vh] p-2 cursor-text rounded-lg text-small bg-transparent outline-none border-none relative"
                    contenteditable="true"
                ><code>{{ text }}</code></pre>
            </div>
            <DialogFooter class="sticky bottom-0 class grid">
                <Button
                    type="submit"
                    @click="onSubmit"
                    >Add Keyframes<FileIcon></FileIcon
                ></Button>

                <div
                    ref="progressBarEl"
                    class="progress-bar w-full bottom mt-2"
                ></div>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef, watch } from "vue";
import { useMagicKeys } from "@vueuse/core";
import {
    Button,
    CardTitle,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "@mkbabb/glass-ui";
import { FileIcon, FilePlus2 } from "@lucide/vue";
import { loadAnimationEngine } from "@mkbabb/keyframes.js";
import { isInsideToaster } from "@utils/toastGuard";
import { useCodeHighlight } from "../composables/useHighlightCSS";
import { insertTabAtCursor } from "../utils/contenteditable";

const props = defineProps<{
    open: boolean;
    text: string;
    /** Formats the raw string; returns the formatted result for re-highlight. */
    format: (raw: string) => Promise<string>;
}>();

const emit = defineEmits<{
    (e: "update:open", value: boolean): void;
    (e: "update:text", value: string): void;
    (e: "submit", value: string): void;
}>();

const addKeyframesEl = useTemplateRef<HTMLElement>("addKeyframesEl");
const progressBarEl = useTemplateRef<HTMLElement>("progressBarEl");

const { setHighlightingString, highlightAll } = useCodeHighlight(() => [
    addKeyframesEl.value,
]);

const onInput = (e: Event) => {
    emit("update:text", (e.target as HTMLElement).innerText);
};

const reformat = async () => {
    const formatted = await props.format(props.text);

    setHighlightingString(addKeyframesEl.value, formatted);
    highlightAll();

    window.getSelection()?.collapseToEnd();
};

function onKeyDown(e: KeyboardEvent) {
    const { key } = e;

    if (key === "Ï") {
        e.preventDefault();
        return;
    }

    if (key === "Tab") {
        e.preventDefault();
        insertTabAtCursor(e.target as HTMLElement);
    }

    highlightAll();
}

const animateProgressBar = async () => {
    if (!progressBarEl.value) return;
    const { CSSKeyframesAnimation } = await loadAnimationEngine();
    new CSSKeyframesAnimation({ duration: 1000 }, progressBarEl.value)
        .fromVars([{ width: "0%" }, { width: "100%" }])
        .play();
};

const onSubmit = () => {
    emit("submit", props.text);
    animateProgressBar();
};

// Shift+Alt+F (or the dead-key Ï variant) reformats while the dialog is open.
const keys = useMagicKeys({ reactive: true });
watch(
    () => (keys["Shift"] && keys["Alt"] && keys["F"]) || keys["Ï"],
    (v) => {
        if (v && props.open) {
            reformat();
        }
    },
);

// Highlight the editable surface once it mounts.
watch(addKeyframesEl, () => {
    if (addKeyframesEl.value) {
        highlightAll(addKeyframesEl.value);
    }
});

onMounted(() => {
    if (addKeyframesEl.value) {
        highlightAll(addKeyframesEl.value);
    }
});
</script>
