<template>
    <Dialog v-model:open="modelOpen">
        <!-- KF.W7 R-7 — the fold's ONE structural addition: the twin's
             `DialogTrigger` needs reka's root context, so it renders HERE,
             inside `<Dialog>`, never inside `<DialogContent>`. -->
        <slot name="trigger" />
        <DialogContent
            @interact-outside="
                (event) => {
                    if (isInsideToaster(event.target))
                        return event.preventDefault();
                }
            "
        >
            <DialogTitle class="text-subheading">{{ title }}</DialogTitle>
            <DialogDescription class="text-body text-muted-foreground">{{ description }}</DialogDescription>
            <pre
                ref="textEl"
                @input="onInput"
                @keydown.meta.enter.prevent="onSubmit"
                @keydown.ctrl.enter.prevent="onSubmit"
                :class="cn(WELL_BASE, preClass)"
                :aria-invalid="error ? 'true' : undefined"
                :aria-describedby="error ? 'css-paste-dialog-error' : undefined"
                contenteditable="true"
            ><code>{{ text }}</code></pre>
            <!-- G14 P2 — a failed submit is surfaced HERE, beside the text that
                 caused it: the dialog stays open, the draft is untouched, and
                 the message is announced once. -->
            <p
                v-if="error"
                id="css-paste-dialog-error"
                class="text-admin-label text-destructive"
                role="status"
                aria-live="polite"
            >
                {{ error }}
            </p>
            <DialogFooter>
                <slot name="footer-extra" />
                <Button
                    class="gap-2"
                    :loading="busy"
                    :disabled="text.trim() === ''"
                    @click="onSubmit"
                >{{ buttonLabel }}<component v-if="buttonIcon" :is="buttonIcon" class="icon-md" /></Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import type { Component } from "vue";
import {
    Button,
    cn,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from "@mkbabb/glass-ui";
import { isInsideToaster } from "@components/instrument/utils/toastGuard";

/**
 * THE ONE CSS-PASTE SHELL (KF.W7 G15 / R-7 ≡ KAD-F3).
 *
 * `KeyframesAddDialog` was a 161-line re-authoring of these 80: the same
 * `@interact-outside` toaster guard byte for byte, the same `onInput` body, the
 * same flush `<pre><code>` well — and two OPPOSITE state-ownership contracts
 * for one widget. It is now a thin adapter over this shell, keeping only its
 * four genuine deltas (its trigger, hljs highlighting, Tab-insert, reformat).
 *
 * The contract the fold settles:
 *   • `text` is a MODEL, not an `initialText` prop copied into local state on
 *     every open (R-19 — the prop was dead at both mounts anyway; the twin's
 *     hoisting contract wins, which is also the house `defineModel` idiom).
 *   • `submit` is a PROP, and it is AWAITABLE (G14 P2). A promise that resolves
 *     closes the dialog; a promise that rejects leaves it open with the message
 *     rendered beside the draft. A `void` return means the consumer owns the
 *     close through `v-model:open` — which is exactly the adapter's parent
 *     contract today, preserved without touching it.
 *   • `preClass` MERGES through `cn` instead of replacing the well (R-21).
 *   • The primary action is disabled on an empty draft (R-17 — the
 *     whitespace-only submit was a silent dead click) and carries `loading`
 *     while a submit is in flight (KAD-10 — re-entry used to re-append stops).
 *   • Mod+Enter submits (R-23 — a keyboard user had to Tab out of a multi-line
 *     editor to commit, in a repo that treats shortcuts as first-class).
 *   • `textEl` stays exposed and is now LIVE: it is the seam the adapter's
 *     highlighter owns (L-4's falsifier, answered in G15-FOLD-RULING §3).
 */
const WELL_BASE =
    "font-mono min-h-[20vh] p-3 cursor-text rounded-lg text-small bg-muted/50 outline-none border border-border";

const props = defineProps<{
    title: string;
    description: string;
    buttonLabel: string;
    buttonIcon?: Component;
    preClass?: string;
    /** Awaitable: resolve closes the dialog, reject surfaces in place. */
    submit: (text: string) => void | Promise<void>;
}>();

const modelOpen = defineModel<boolean>("open", { required: true });
const text = defineModel<string>("text", { default: "" });
const textEl = useTemplateRef<HTMLElement>("textEl");

const busy = ref(false);
const error = ref<string | null>(null);

// R-22 — the well is the element the model reads from; there is no
// `EventTarget → HTMLElement` cast to charge.
const onInput = () => {
    text.value = textEl.value?.innerText ?? "";
};

const onSubmit = async () => {
    if (busy.value || text.value.trim() === "") return;
    error.value = null;

    const result = props.submit(text.value);
    if (!(result instanceof Promise)) return;

    busy.value = true;
    try {
        await result;
        modelOpen.value = false;
    } catch (e) {
        error.value = (e as Error).message;
    } finally {
        busy.value = false;
    }
};

defineExpose({ textEl });
</script>
