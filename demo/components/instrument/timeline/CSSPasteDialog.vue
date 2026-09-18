<template>
    <Dialog v-model:open="modelOpen">
        <!-- KF.W7 R-7 — the fold's ONE structural addition: the twin's
             `DialogTrigger` needs reka's root context, so it renders HERE,
             inside `<Dialog>`, never inside `<DialogContent>`. -->
        <slot name="trigger" />
        <!-- CPD R-2 + R-26 (S-9 companions, W6-I): the CONTENT is the scroll
             owner — `scroll` is the primitive's own prop for it (it emits the
             `max-h-[calc(100dvh-2rem)] overflow-y-auto` pair on the floating
             form, measured at the installed dist), and the width cap rides the
             same attribute, so the well below never has to own a viewport
             bound of its own. -->
        <DialogContent
            scroll
            class="sm:max-w-2xl"
            @interact-outside="
                (event) => {
                    if (isInsideToaster(event.target))
                        return event.preventDefault();
                }
            "
        >
            <DialogTitle class="text-subheading">{{ title }}</DialogTitle>
            <DialogDescription class="text-body text-muted-foreground">{{ description }}</DialogDescription>
            <!-- S-9 (W6-I) — THE WELL IS THE PRODUCER'S `Textarea`. The
                 `<pre contenteditable role="textbox">` it replaces was a
                 hand-ARIA'd editing host with no native value, selection or
                 IME (CPD R-1/R-6/R-8), a bespoke ringed well (R-14, R-16 — the
                 field-control carries its own ring and the demo's
                 `kf-focus-ring` is not layered over it at 7.0.0, I-35 R-16), a
                 viewport-literal floor (R-10 — `:rows` is the size now) and a
                 keydown Tab/recolour plumbing that has no host on a native
                 control (R-20; a Tab in a textarea moves focus, which is the
                 a11y-correct default). The control is a labelled, multi-line
                 textbox BY CONSTRUCTION: `aria-label`, `aria-invalid` (the
                 `invalid` prop) and `aria-describedby` to the error node
                 (R-15) are the whole ARIA surface. It is SIZE-DRIVEN (style.css
                 role (a): no size utility on a glass control — `--control-text`
                 already clears the iOS zoom floor at the installed dist, R-9),
                 and wears ONLY the mono family, because a CSS well is code
                 (KAD-4 / KF-KE-23; the producer ships no italic face, I-35
                 R-12). `spellcheck`/`autocorrect`/`autocapitalize` are off on a
                 code host (R-13). `wrap="off"` keeps a long declaration on its
                 line, scrolling inside the control, as an editor would.
                 R-12's PERIMETER carry is KEPT on measurement: at the installed
                 7.0.0 bytes `--control-surface-border` = `--glass-border-floating`
                 (foreground at 5%) is FAINTER than the `--muted-foreground` rung
                 this wave gives every 1.4.11 mark, so the demo's border colour
                 rides on top of the primitive until the producer's token clears
                 the ratio (recorded upward, never patched at the producer).
                 R-24/R-27 are SATISFIED BY THE PRIMITIVE (`--input-on-glass` is
                 the field-control's own surface), not swapped away. -->
            <Textarea
                :model-value="text"
                :rows="10"
                resize="vertical"
                wrap="off"
                :invalid="!!error"
                :aria-label="title"
                :aria-describedby="error ? 'css-paste-dialog-error' : undefined"
                spellcheck="false"
                autocorrect="off"
                autocapitalize="off"
                class="font-mono border-muted-foreground"
                @update:model-value="(v) => (text = String(v))"
                @keydown.meta.enter.prevent="onSubmit"
                @keydown.ctrl.enter.prevent="onSubmit"
            />
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
                <Button
                    class="gap-2"
                    :loading="busy"
                    :disabled="text.trim() === ''"
                    @click="onSubmit"
                >{{ buttonLabel }}<component v-if="buttonIcon" :is="buttonIcon" class="icon-md" /></Button>
            </DialogFooter>
            <!-- KAD-15 (W6-I): the adapter's feedback sweep is HOISTED out of
                 `DialogFooter` — the footer is bare flex again (the `grid`
                 override that once fought it, KAD-16, has no reason to exist),
                 and the sweep runs along the dialog's foot below the action,
                 where its twin runs below the editor toolbar. -->
            <slot name="feedback" />
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Component } from "vue";
import {
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from "@mkbabb/glass-ui";
import { Textarea } from "@mkbabb/glass-ui/forms";
import { isInsideToaster } from "@components/instrument/utils/toastGuard";

/**
 * THE ONE CSS-PASTE SHELL (KF.W7 G15 / R-7 ≡ KAD-F3).
 *
 * `KeyframesAddDialog` was a 161-line re-authoring of these 80: the same
 * `@interact-outside` toaster guard byte for byte, the same `onInput` body, the
 * same flush `<pre><code>` well — and two OPPOSITE state-ownership contracts
 * for one widget. It is now a thin adapter over this shell.
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
 *   • The primary action is disabled on an empty draft (R-17 — the
 *     whitespace-only submit was a silent dead click) and carries `loading`
 *     while a submit is in flight (KAD-10 — re-entry used to re-append stops).
 *   • Mod+Enter submits (R-23 — a keyboard user had to Tab out of a multi-line
 *     editor to commit, in a repo that treats shortcuts as first-class).
 *
 * S-9 (W6-I) — the well is the producer's `Textarea` (see the template). With
 * it the `preClass` prop (R-21's `cn` merge, R-11) and the exposed `textEl`
 * seam (L-4's falsifier) are RETIRED: both existed to let the adapter reach
 * INTO a contenteditable `<pre>` for hljs recolouring and Tab insertion, and a
 * native textarea has no innerHTML to recolour — the adapter's highlight/Tab
 * deltas are mooted with the host (KAD-3/7/16/17/19, KAD-F1/F4/F5), which is
 * the swap discharging them, not a second edit. The third `<pre>` widget
 * (`KeyframeCard.vue`, R-25) is NOT this shell's: it is a highlighted per-stop
 * read/edit surface whose token layer IS its content, and its S-9 carve is
 * focus/token/tap-floor only.
 */
const props = defineProps<{
    title: string;
    description: string;
    buttonLabel: string;
    buttonIcon?: Component;
    /** Awaitable: resolve closes the dialog, reject surfaces in place. */
    submit: (text: string) => void | Promise<void>;
}>();

const modelOpen = defineModel<boolean>("open", { required: true });
const text = defineModel<string>("text", { default: "" });

const busy = ref(false);
const error = ref<string | null>(null);

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
</script>
