<template>
    <button
        type="button"
        :aria-label="isCopied ? 'Copied to clipboard' : label"
        class="kf-focus-ring cursor-pointer relative inline-block text-foreground p-0 m-0 bg-transparent border-0"
        @click="handleClick"
    >
        <Clipboard class="clipboard" ref="clipboard" />
        <ClipboardCheck
            class="clipboard opacity-0"
            ref="clipboardChecked"
        />
        <!-- One AT-only status sink: announces the copy to screen readers
             without a visual change (the icon swap is the sighted feedback). -->
        <span class="sr-only" role="status" aria-live="polite">{{ liveStatus }}</span>
    </button>
</template>

<script setup lang="ts">
import { Clipboard, ClipboardCheck } from "@lucide/vue";

import { onMounted, ref, shallowRef, useTemplateRef } from "vue";
import type { InputAnimationOptions, AnimationGroup } from "@mkbabb/keyframes.js";
import { loadAnimationEngine } from "@mkbabb/keyframes.js";
import { copyText } from "@utils/clipboard";

const { text, label = "Copy to clipboard" } = defineProps<{
    text: string;
    label?: string;
}>();

const isCopied = ref(false);
// AT-only live announcement — empty until a copy fires (re-armed each click so
// a repeat copy re-announces). The sighted feedback is the icon swap.
const liveStatus = ref("");

const clipboard = useTemplateRef<HTMLElement>("clipboard");
const clipboardChecked = useTemplateRef<HTMLElement>("clipboardChecked");

// Script-side constants are part of the token audit (KF-CB-27), disposition
// RETAINED-BY-POLICY: `duration: 200` is the numeric mirror of glass-ui's
// `--duration-fast: 0.2s` (the engine takes milliseconds — a CSS custom property
// is not readable here without a getComputedStyle round-trip at mount, which
// would trade a documented constant for a layout read), and the `scale(1.25)`
// pulse amplitude in the keyframe strings below is the demo's OWN register:
// glass-ui ships hover (1.08/1.1) and press (0.96/0.97) scales, no pulse rung,
// so there is no producer surface for it to shadow (NO-SURFACE).
const options: Partial<InputAnimationOptions> = {
    duration: 200,
    timingFunction: "easeInBounce",
};

// The copy-feedback group is HEAVY (CSSKeyframesAnimation/AnimationGroup), so it
// is constructed through loadAnimationEngine() at mount rather than a deep @src
// import. The engine resolves within microtasks of mount — well before a user
// can click — and `group` is null-guarded until it is in hand.
const group = shallowRef<AnimationGroup<any> | null>(null);

const handleClick = () => {
    copyText(text);

    isCopied.value = true;
    // Re-arm the announcement (clear then set on the next tick) so a repeat
    // copy re-fires the live region even though the text is unchanged.
    liveStatus.value = "";
    requestAnimationFrame(() => {
        liveStatus.value = "Copied to clipboard";
    });

    void group.value?.play();
};

onMounted(async () => {
    const { CSSKeyframesAnimation, AnimationGroup } =
        await loadAnimationEngine();

    const clipboardCheckedAnim = new CSSKeyframesAnimation(options).fromString(
        /*css*/ `@keyframes fade-in {
            0%, 100% {
                transform: scale(1);
                opacity: 0;
            }
            50% {
                transform: scale(1.25);
                opacity: 1;
            }
        }`,
    );

    const clipboardAnim = new CSSKeyframesAnimation(options).fromString(
        /*css*/ `@keyframes fade-out {
            0%, 100% {
                transform: scale(1);

            }
            50% {
                transform: scale(1.25);

            }
        }`,
    );

    const g = new AnimationGroup(clipboardAnim, clipboardCheckedAnim);
    g.singleTarget = false;

    clipboardCheckedAnim.setTargets(clipboardChecked.value!);
    clipboardAnim.setTargets(clipboard.value!);

    group.value = g;
});
</script>
<style scoped>
/* KF-CB-5 ≡ KF-CB-14 ≡ KF-ET-17 ≡ KF-KC-33 ≡ KC-23 — THE INTERIM BOX FLOOR.
   Every child of this button is out of flow (both glyphs are absolute below;
   `.sr-only` is absolute per glass's components.css), so the button has ZERO
   intrinsic size: at the two of four call sites that pass no size class it
   renders 0x0 and its sizing contract lives in a CONSUMER's CSS comment. The
   floor is declared as a MINIMUM, not as a fixed `w-4 h-4`, for one measured
   reason: three of the four sites already pass `w-6 h-6`, and a fixed default
   would have to out-order those utilities in the generated sheet to lose to
   them, which is not a property of the class attribute. A minimum cannot lose
   and cannot shrink a consumer.
   INTERIM, and named as interim: the real cure is S-7's reshell onto glass
   `Button` (W6-I), which owns the box by construction and dissolves the
   abspos `width:100%`-against-padding-box algebra that makes "a 16px glyph in
   a 32px target" structurally inexpressible here. The gapless-pair geometry of
   the four sites is SS-13's measurement, not this file's. */
button {
    min-inline-size: 1rem;
    min-block-size: 1rem;
}

.clipboard {
    bottom: 0;
    left: 0;
    height: 100%;
    width: 100%;

    position: absolute;
}
</style>
