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
            <!-- KF-KE-31 (W6-I): the trigger is the producer's `Button`
                 (`size="sm" emphasis="quiet" icon-only`, a real `<button
                 aria-label="Add keyframes">` — the DOM shape
                 `useToolbarKeyboard` roves over is preserved) under a
                 `Tooltip`; the two `as-child` triggers chain onto the one
                 element. -->
            <Tooltip>
                <TooltipTrigger as-child>
                    <DialogTrigger as-child>
                        <Button
                            size="sm"
                            emphasis="quiet"
                            icon-only
                            aria-label="Add keyframes"
                        >
                            <FilePlus2 class="icon-md" />
                        </Button>
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>Add keyframes</TooltipContent>
            </Tooltip>
        </template>
        <template #feedback>
            <!-- KF-KE-21 (S-10, EVALUATED — glass `Progress` DECLINED, in
                 writing, at both twins): this bar measures NOTHING. The submit
                 is synchronous, there is no in-flight quantity and no
                 indeterminate wait to report; binding `<Progress>` (which emits
                 `role="progressbar"` and a value/indeterminate state) would
                 announce a progress that does not exist. So the FALSE
                 SEMANTICS are deleted — the bar is `aria-hidden` decorative
                 chrome, the demo's own brush-sweep flourish — and the
                 animation itself is kept (the owner's preserve-animations law:
                 moved or tokenized, never removed). KAD-15: it rests at ZERO
                 (`transform: scaleX(0)` — on the sweep's OWN property, KFA-15:
                 Tailwind 4's `scale-x-0` is the individual `scale: 0 1`, which
                 multiplied the animated transform by zero — so `w-full` no
                 longer paints it complete at idle — D-20), sweeps on `transform: scaleX()` (compositor-safe, the
                 R-A form), grows from the INLINE START (`origin-left` with its
                 `rtl:` mirror — D-26), and returns to rest when the sweep ends. -->
            <div
                ref="progressBarEl"
                class="progress-bar w-full mt-2 origin-left rtl:origin-right [transform:scaleX(0)]"
                aria-hidden="true"
            ></div>
        </template>
    </CSSPasteDialog>
</template>

<script setup lang="ts">
import { onScopeDispose, useTemplateRef, watch } from "vue";
import { Button } from "@mkbabb/glass-ui/button";
import { DialogTrigger } from "@mkbabb/glass-ui/dialog";
import { registerShortcut } from "@mkbabb/glass-ui/keyboard";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@mkbabb/glass-ui/tooltip";
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
 *      write is the whole of it now — the textarea renders the model — and the
 *      binding rides the app's ONE keyboard registry (KAD-12, below).
 *
 * The feedback sweep rides the shell's `feedback` slot, below the footer
 * (KAD-15 — see the template).
 *
 * ── KAD-17, AND THE PACKET'S DISCHARGE LEDGER (W6-M / W6-N, unit `.k`) ────────
 * The discharge discipline this wave holds is that a seat STATES which rows the
 * S-9 swap moots BEFORE it spends a cure. Measured at these bytes, by command,
 * after the swap landed:
 *
 *   KAD-17 (caret/selection cluster) — WHOLE, and wholly MOOT. All four limbs
 *     addressed a `<pre contenteditable>` that no longer exists:
 *     `collapseToEnd()` running synchronously BEFORE the microtask `innerHTML`
 *     write it targeted (L-7); that same call reaching the GLOBAL
 *     `window.getSelection()` — the exact hazard the `contenteditable.ts` util
 *     it imported exists to avoid, by resolving through
 *     `target.ownerDocument.defaultView` (C-13); `insertTabAtCursor` firing no
 *     `input` event, so a Tab as the LAST edit was dropped from the model and
 *     self-healed on the next keystroke (L-8); and that Tab being four U+00A0,
 *     whose indent-compounding postcss does not normalise. A native `<textarea>`
 *     has no innerHTML to collapse into, no portalled selection to resolve, and
 *     no Tab insertion at all (Tab moves focus — the a11y-correct default the
 *     swap restores, which is also KAD-7). `grep -nE
 *     'collapseToEnd|insertTabAtCursor|getSelection|innerHTML|contenteditable'`
 *     over this file returns only the two prose lines above. ZERO cure bytes are
 *     spent, and the row is recorded rather than re-derived.
 *     THE BLOCKER ARM IS DEAD AND STAYS DEAD: the "mangled parse" claim was
 *     killed on measurement (value.js's tokenizer `/\s/` MATCHES U+00A0; identity
 *     fold to the twin's L-9/K-1) and is not re-booked here or anywhere.
 *   KAD-3 · KAD-7 · KAD-19 · KAD-25 · KAD-16 — MOOT with the same host:
 *     session-long inert highlighting, the forward-Tab trap (WCAG 2.1.1), the
 *     unbounded long line, rich paste with no `plaintext-only`, and the dead
 *     token cluster (`class` as a literal class name, an inert `sticky bottom-0`,
 *     `type="submit"` with no `<form>` in the portalled tree) all belonged to
 *     markup this adapter no longer authors.
 *   KAD-F1 → CPD R-2 · KAD-F4 → R-20 · KAD-F5 → R-10 — DISCHARGED AT THE SHELL
 *     by the swap's own commit (`scroll` on `DialogContent`;
 *     `spellcheck`/`autocorrect`/`autocapitalize` off; `:rows` replacing the
 *     `min-h-[25vh]` viewport floor). Folds, not re-bookings.
 *   KAD-14(c) — CURED: the hand-rolled `onMounted` beside a watch, both passing
 *     an element the watch already owned, is gone; the binding below is a real
 *     `watch(…, { immediate: true })` (`grep -c onMounted` → 0).
 *   KAD-20 — NOT DISCHARGED, and DECLARED rather than quietly folded. The
 *     accessible-name half is cured (the shell names the field), but the empty
 *     state still renders a blank well with no placeholder, prompt or example.
 *     That attribute belongs to the shell (`CSSPasteDialog.vue`), which is in
 *     this wave's §Bounds but NOT in this unit's writable set, so it is routed,
 *     never reached across.
 *
 * KAD-5 — the two SFC floating promises are the packet's ONE live cure and are
 * spent below, under this wave's NON-TOAST posture.
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

// KAD-5 (rider on the KAD-17 packet) — FLOATING PROMISE #1, the one that FAILS
// SILENTLY ON THE STATE THE EDITOR LIVES IN. `format` is prettier, and prettier
// THROWS on malformed CSS — which is the draft's normal condition while it is
// being typed, i.e. exactly when Shift+Alt+F is pressed. The call was bare, so
// the rejection had nowhere to go: no route, no message, no console line, while
// every sibling operation in this stack routes through the house error channel.
// The house channel is `withErrorToastAsync` + Retry, and it is UNAVAILABLE here
// by this wave's NON-TOAST posture — the vue-sonner stylesheet is imported
// nowhere, so every toast in the demo is structurally unreachable (banked
// kf-DemoGlobalChrome). The in-tree idiom for exactly that situation is
// `useHighlightCSS.ts`'s, which names the unreachability and reports to the
// console instead; this follows it. The rejection is HANDLED, not swallowed: the
// draft is left byte-for-byte as the user typed it (a failed reformat must never
// eat the text it could not parse), and the failure is reported with its cause.
// A shared non-toast error surface is the durable cure and is declared upward,
// not invented here.
const reformat = async () => {
    try {
        text.value = await props.format(text.value);
    } catch (e) {
        console.error(
            "Failed to reformat the keyframes draft (the draft is unchanged):",
            e,
        );
    }
};

// KAD-15: the sweep is `transform: scaleX()` from the bar's rest (0) to full,
// and `fillMode: "none"` hands the element back to its rest class when the
// sweep ends — the bar never sits full at idle (D-20). The element is re-read
// AFTER the engine await (L-11: the dialog can close during the load).
// `respectReducedMotion` rides with the rest state (KF-KE-8's sequencing
// nuance: under PRM the engine snaps to the final frame, which with a rest
// state is the invisible bar, so the sweep simply does not show).
//
// KAD-11 — THE PRM PAIR, TOKENIZATION HALF (the twin is `KeyframesEditor.vue`'s
// `animateProgressBar`; one decision, spent at both sites in one motion):
//   · THE REGISTER — reduced motion is honoured through the engine's own
//     `respectReducedMotion` options bag → the shared `withReducedMotion`
//     authority. NEVER a bespoke per-site `@media (prefers-reduced-motion:
//     reduce)` block: a 1000 ms WAAPI width sweep is not delegable to CSS, and
//     a per-site query is exactly the hand-mirrored shape this register
//     replaced. A group-driven sweep would arm via `g.respectReducedMotion`;
//     this one is standalone and arms through its own bag.
//   · THE CLOCK — `duration: 1000` is the millisecond mirror of glass-ui's
//     `--duration-xl: 1s` (measured at the installed dist). The engine takes
//     milliseconds and reading the custom property here would trade a
//     documented constant for a layout read, so the mirror is
//     RETAINED-BY-POLICY with its rung named.
// Split row: the PRM MECHANISM unification is KF.W9's (`G-KFW9-6`), whose
// constraint rides verbatim — no unification lands that snaps a progress
// animation to a rest state its own banked defect makes idle-indistinguishable.
// Neither end records `KAD-11` or `G-KFW9-6` closed on its own.
const animateProgressBar = async () => {
    if (!progressBarEl.value) return;
    const { CSSKeyframesAnimation } = await loadAnimationEngine();
    const el = progressBarEl.value;
    if (!el) return;
    new CSSKeyframesAnimation(
        { duration: 1000, fillMode: "none", respectReducedMotion: true },
        el,
    )
        .fromVars([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }])
        .play();
};

// The parent owns this dialog's close (`useKeyframeOps` closes on its own
// success path), so the submit returns VOID and the shell leaves `open` alone —
// the shell's void-return rule preserves that contract exactly.
const onSubmit = (value: string): void => {
    emit("submit", value);
    // KAD-5 — FLOATING PROMISE #2. The sweep is decorative chrome and its ONE
    // rejection source is the engine chunk fetch above, so it must not be
    // awaited here (the shell's `void`-return rule is what keeps the parent's
    // close contract) and it must not float either. `void` states the deliberate
    // fire-and-forget and the handler gives the rejection a destination: the
    // flourish is skipped, the submit that already emitted is untouched, and the
    // chunk failure is reported rather than becoming an unhandled rejection on a
    // page whose only global listener (`useMonacoCancellationGuard`) filters for
    // Monaco's "Canceled" and toasts nothing.
    void animateProgressBar().catch((e) => {
        console.error("Failed to run the keyframes feedback sweep:", e);
    });
};

// KAD-12 (W6-I): Shift+Alt+F reformats through the ONE keyboard registry —
// the same `registerShortcut` every other shortcut in the app rides, so the
// binding is LISTED in the KeyboardShortcutsModal (it was undiscoverable: a
// private `useMagicKeys` watch that no surface could enumerate) and inherits
// the registry's one dispatch. The combo names the physical KEY CODE
// (`KeyF`): on macOS Shift+Alt+F yields the dead-key `Ï` as `event.key`, and
// the registry's matcher falls through to `event.code`, so the old
// `keys["Ï"]` sidecar is dissolved rather than re-authored. `allowInInput` is
// REQUIRED — the point of the shortcut is to fire while the caret is in the
// textarea, which the registry otherwise skips. The binding lives exactly as
// long as the dialog is open: registered on open, unregistered on close and on
// unmount, so a closed dialog owns no global key.
let unregisterReformat: (() => void) | null = null;

const bindReformat = () => {
    unregisterReformat?.();
    unregisterReformat = registerShortcut("Shift+Alt+KeyF", () => reformat(), {
        allowInInput: true,
        preventDefault: true,
        label: "Reformat keyframes CSS",
        group: "Actions",
    });
};

const unbindReformat = () => {
    unregisterReformat?.();
    unregisterReformat = null;
};

watch(
    open,
    (isOpen) => {
        if (isOpen) bindReformat();
        else unbindReformat();
    },
    { immediate: true },
);

onScopeDispose(unbindReformat);
</script>
