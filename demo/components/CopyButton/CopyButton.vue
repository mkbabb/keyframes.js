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
         EVALUATED, not asserted (family law — a swap is never sufficient on
         its own): the retained rows are KF-CB-25 (the `easeInBounce` pulse is
         the demo's own feedback register, kept on the primitive by the owner's
         preserve-animations law), KF-CB-27 (script-side constants, retained by
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
                <span class="clipboard-stack" aria-hidden="true">
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

import { onMounted, ref, shallowRef, useTemplateRef } from "vue";
import { Button } from "@mkbabb/glass-ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@mkbabb/glass-ui/tooltip";
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
