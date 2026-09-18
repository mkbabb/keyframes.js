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
            <!-- CPD R-6 + R-27 ≡ KAD-F2 + KAD-22 — THE WELL BECOMES A NAMED,
                 RINGED CONTROL. It was the dialog's ONLY un-ringed focusable —
                 the shipped close X carries a ring — and it is where opening
                 focus lands, so the primary flow this dialog exists for (open,
                 Cmd+V, no click) began with an invisible focus on an unnamed
                 editing host. It also carried none of role / aria-multiline /
                 aria-label, while `KeyframeCard.vue`'s `<pre>` applies all three
                 plus the ring to the IDENTICAL idiom: there is no "no
                 established pattern" defence to make here, only an omission.
                 This is the row's written NON-SWAP fallback — four attributes
                 and one class. The swap that makes it a labelled control by
                 construction (S-9's `Textarea`) is W6-I's, has not landed at
                 this clock, and will discharge these rows with the component
                 rather than inherit this markup. Both dialogs are cured by this
                 one edit: KeyframesAddDialog is a thin adapter over this shell,
                 so the KAD twins are the same bytes, not a second site. -->
            <pre
                ref="textEl"
                @input="onInput"
                @keydown.meta.enter.prevent="onSubmit"
                @keydown.ctrl.enter.prevent="onSubmit"
                :class="cn(WELL_BASE, preClass)"
                :aria-invalid="error ? 'true' : undefined"
                :aria-describedby="error ? 'css-paste-dialog-error' : undefined"
                contenteditable="true"
                role="textbox"
                aria-multiline="true"
                :aria-label="title"
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
/**
 * R-6 (the ring) + R-24 (the surface) + R-12 (the perimeter), one string.
 *
 * • `outline-none` shipped with NOTHING put back; it goes, and `.kf-focus-ring`
 *   — whose own rule declares `outline: none` and which carries the demo's
 *   forced-colors restoration — replaces it.
 * • R-24: `bg-muted/50` was ~2.8x the system's READ-ONLY muting applied to an
 *   EDITABLE surface, so the affordance semantics were inverted, not merely
 *   off-token: the system reserves the `--muted` mix for `[data-state=readonly]`
 *   and ships `--input-on-glass` for the editable well. This is the doctrine row
 *   of that family and TimelineCaret's edit field is its second site.
 * • R-12: the perimeter measured sub-3:1. The row names `--control-surface-border`
 *   as the shipped cure, and at the INSTALLED 7.0.0 bytes that token resolves to
 *   `--glass-border-floating` = `color-mix(in srgb, var(--foreground) 5%,
 *   transparent)` — strictly FAINTER than the `--border` it would replace
 *   (`--neutral-4`), so adopting it by name would lower the ratio the row exists
 *   to raise. The cure SHAPE is kept (a real perimeter rung) and the token is
 *   chosen by measurement: `--muted-foreground`, the one rung this wave gives
 *   every 1.4.11 mark. The named token's falsification is recorded upward as a
 *   dated addendum-beside, never as a patch of the row.
 *
 * The token composite the row was reaching for arrives whole with S-9's swap
 * (`field-control` binds `--control-surface-bg` and `--control-surface-border`
 * together under `--glass-definition`); that swap is W6-I's and is not pre-empted
 * here. `min-h-[20vh]` is R-10's carry and stays untouched.
 *
 * THE WELL'S REGISTER (KAD-4 + KF-KE-23 · CPD R-9 ≡ SP-4 — W6-G roles (a) and
 * (b), decided once): a code surface wears the MONO register in one utility.
 * The former pair of a family utility and a proportional size utility competed
 * for `font-family` in the same layer — `highlight()` destroys the `<code>`
 * wrapper, so the glyphs sat directly in the `<pre>` and inherited whichever
 * won the generated sheet's order, which is how a tab-indented CSS editor came
 * to render in the UI face. `text-mono-small` binds face, size and leading as
 * ONE declaration set, so there is nothing to compete. `kf-text-entry` is the
 * ruled iOS no-zoom floor in its CSS form (style.css): `--type-small` is 14px at
 * a 390px viewport, under the 16px at which iOS zooms a focused editing host,
 * and this well is exactly such a host. Both mounts and the KeyframesAddDialog
 * adapter are cured by this one constant. The S-9 `Textarea` swap (W6-I) would
 * make the well size-driven by construction and discharge R-9 with the
 * component; it has not landed at this clock and this register does not wait
 * on it.
 */
const WELL_BASE =
    "kf-focus-ring kf-text-entry text-mono-small min-h-[20vh] p-3 cursor-text rounded-lg bg-[var(--input-on-glass)] border border-muted-foreground";

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
