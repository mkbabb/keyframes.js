<template>
    <!-- S-7 (W6-I) — the copy control is the producer's `Button`, in the
         exemplar register SharePopover set (`size="sm" emphasis="quiet"
         icon-only`): a REAL `<button>` stays in the DOM (S-2), the plate, the
         hover/press motion, the focus ring and the coarse-pointer floor
         (`[data-control-target]`, emitted under `icon-only`) all come from the
         primitive, so the bespoke `kf-focus-ring … p-0 m-0 bg-transparent
         border-0` reset is not re-authored (KF-CB-7/12/13). The Button OWNS ITS
         BOX: the interim `min-inline-size: 1rem` floor and the abspos
         `width: 100%` glyph algebra are gone with it (KF-CB-5/14 — two of four
         call sites passed no size and rendered a 0×0 control; the other two
         imposed 24px/16px boxes from outside, and no caller passes a size now).
         The two glyphs stack on ONE grid cell so both keep their intrinsic
         `icon-md` box and the engine's pulse has a laid-out target on each.
         Icon-only with no visible label: `aria-label` at the primitive and the
         tooltip carry the name for sighted pointer users and AT alike
         (KF-CB-26). The name flips to the copied state with the icon.
         The confirmation is enter → hold → return (X.KF.W13X.home, KFA-63):
         the check crossfades in over the clipboard, holds while the name
         reads "Copied", and both return together; a re-click restarts it.
         EVALUATED, not asserted (family law — a swap is never sufficient on
         its own): the retained rows are KF-CB-25 (the `easeInBounce` pulse is
         the demo's own feedback register, kept on the primitive by the owner's
         preserve-animations law, on the transform only), KF-CB-27 (script-side constants, retained by
         policy below) and KF-CB-37 (the MOVE is KF.W8's, R-13 — LANDED HERE:
         `instrument/` was REFUSED by R-1's destination law, because two of the
         four importers live in `scenes/easing` and `scenes/spring` and homing
         the control under `instrument/` would manufacture the up-import G5
         forbids. The home is this owner-named directory, the tree's own live
         idiom — `transport/{AnimationControlsGroup,TransportDock,KfPillTabs}/`
         — never a generic `shared/`/`common/`/`ui/` bucket). -->
    <Tooltip>
        <TooltipTrigger as-child>
            <Button
                size="sm"
                emphasis="quiet"
                icon-only
                :aria-label="isCopied ? 'Copied to clipboard' : label"
                @click="handleClick"
            >
                <span ref="stack" class="clipboard-stack" aria-hidden="true">
                    <Clipboard ref="clipboard" class="icon-md" />
                    <ClipboardCheck
                        ref="clipboardChecked"
                        class="icon-md opacity-0"
                    />
                </span>
                <!-- One AT-only status sink: announces the copy to screen
                     readers without a visual change (the icon swap is the
                     sighted feedback). -->
                <span class="sr-only" role="status" aria-live="polite">{{
                    liveStatus
                }}</span>
            </Button>
        </TooltipTrigger>
        <TooltipContent>{{ isCopied ? "Copied" : label }}</TooltipContent>
    </Tooltip>
</template>

<script setup lang="ts">
import { Clipboard, ClipboardCheck } from "@lucide/vue";

import { onBeforeUnmount, onMounted, ref, shallowRef, useTemplateRef } from "vue";
import { Button } from "@mkbabb/glass-ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@mkbabb/glass-ui/tooltip";
import type { InputAnimationOptions, AnimationGroup } from "@mkbabb/keyframes.js";
import { loadAnimationEngine } from "@mkbabb/keyframes.js";
import { copyWithToast } from "@composables/copyWithToast";

const { text, label = "Copy to clipboard" } = defineProps<{
    text: string;
    label?: string;
}>();

const isCopied = ref(false);
// AT-only live announcement — empty until a copy fires (re-armed each click so
// a repeat copy re-announces). The sighted feedback is the icon swap.
const liveStatus = ref("");

const stack = useTemplateRef<HTMLElement>("stack");
const clipboard = useTemplateRef<HTMLElement>("clipboard");
const clipboardChecked = useTemplateRef<HTMLElement>("clipboardChecked");

// Script-side constants are part of the token audit (KF-CB-27), disposition
// RETAINED-BY-POLICY: `FADE_MS` is the numeric mirror of glass-ui's
// `--duration-fast: 0.2s` (the engine takes milliseconds — a CSS custom property
// is not readable here without a getComputedStyle round-trip at mount, which
// would trade a documented constant for a layout read), and the `scale(1.25)`
// pulse amplitude in the keyframe strings below is the demo's OWN register:
// glass-ui ships hover (1.08/1.1) and press (0.96/0.97) scales, no pulse rung,
// so there is no producer surface for it to shadow (NO-SURFACE).
const FADE_MS = 200;
// KFA-63 — the confirmation is HELD, then returns: the check stays up for the
// hold, and the name reverts with the glyph (the copied state is a window, not
// a latch).
const HOLD_MS = 1400;

// KFA-178 — the `easeInBounce` pulse is the demo's own feedback register
// (KF-CB-25, kept) and it overshoots by design, so it rides the TRANSFORM only,
// on the glyph stack; the two opacities cross on a non-overshooting ease, so no
// out-of-range opacity is ever written.
const pulse: Partial<InputAnimationOptions> = {
    duration: FADE_MS,
    timingFunction: "easeInBounce",
    respectReducedMotion: true,
};
const fade: Partial<InputAnimationOptions> = {
    duration: FADE_MS,
    timingFunction: "ease-out",
    fillMode: "forwards",
    respectReducedMotion: true,
};

// The copy-feedback groups are HEAVY (CSSKeyframesAnimation/AnimationGroup), so
// they are constructed through loadAnimationEngine() at mount rather than a deep
// @src import. The engine resolves within microtasks of mount — well before a
// user can click — and both groups are null-guarded until they are in hand.
// `enter` crossfades clipboard → check under the pulse; `exit` crossfades back.
const enter = shallowRef<AnimationGroup<any> | null>(null);
const exit = shallowRef<AnimationGroup<any> | null>(null);
let holdTimer: ReturnType<typeof setTimeout> | undefined;

// stop() rewinds and resolves the in-flight play; `finished` is the engine's
// completion front-door, so the fresh play() starts only once that play has
// settled (a play() in the same tick would join the settling one).
const restart = async (group: AnimationGroup<any>) => {
    group.stop();
    await group.finished;
    return group.play();
};

const handleClick = async () => {
    // A2-KE-L1-19 — the check confirms a REAL copy: a refused write toasts its
    // named failure (copyWithToast) and shows no success feedback.
    const { ok } = await copyWithToast(text);
    if (!ok) return;

    isCopied.value = true;
    // Re-arm the announcement (clear then set on the next tick) so a repeat
    // copy re-fires the live region even though the text is unchanged.
    liveStatus.value = "";
    requestAnimationFrame(() => {
        liveStatus.value = "Copied to clipboard";
    });

    // KFA-124 — every click restarts the feedback: a copy inside the enter or
    // the hold re-enters from the rest frame and re-arms the hold, instead of
    // the click being swallowed by the running play.
    clearTimeout(holdTimer);
    exit.value?.stop();
    if (enter.value) void restart(enter.value);
    holdTimer = setTimeout(() => {
        isCopied.value = false;
        void exit.value?.play();
    }, FADE_MS + HOLD_MS);
};

onMounted(async () => {
    const { CSSKeyframesAnimation, AnimationGroup } =
        await loadAnimationEngine();

    const fadeTo = (from: number, to: number) =>
        new CSSKeyframesAnimation(fade).fromKeyframes({
            "0%": { opacity: from },
            "100%": { opacity: to },
        });

    const pulseAnim = new CSSKeyframesAnimation(pulse).fromString(
        /*css*/ `@keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.25);
            }
        }`,
    );
    const checkIn = fadeTo(0, 1);
    const clipboardOut = fadeTo(1, 0);
    const checkOut = fadeTo(1, 0);
    const clipboardIn = fadeTo(0, 1);

    pulseAnim.setTargets(stack.value!);
    checkIn.setTargets(clipboardChecked.value!);
    clipboardOut.setTargets(clipboard.value!);
    checkOut.setTargets(clipboardChecked.value!);
    clipboardIn.setTargets(clipboard.value!);

    const enterGroup = new AnimationGroup(pulseAnim, checkIn, clipboardOut);
    enterGroup.singleTarget = false;
    const exitGroup = new AnimationGroup(checkOut, clipboardIn);
    exitGroup.singleTarget = false;

    enter.value = enterGroup;
    exit.value = exitGroup;
});

onBeforeUnmount(() => {
    clearTimeout(holdTimer);
    enter.value?.stop();
    exit.value?.stop();
});
</script>
<style scoped>
/* Both glyphs occupy the same grid cell: the pair keeps its intrinsic
   `icon-md` box (the Button's own padding builds the target around it), the
   check rides on top of the clipboard, and neither is out of flow — the former
   `position: absolute; inset` pair was what left the host with zero intrinsic
   size (KF-CB-14). */
.clipboard-stack {
    display: grid;
    place-items: center;
}

.clipboard-stack > * {
    grid-area: 1 / 1;
}
</style>
