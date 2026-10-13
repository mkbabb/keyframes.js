<template>
    <!-- X.KF.W13X.esc2 · ESC-dock-1 (KFA-114 · UIA-KF-056 · 140 · A2-KE-L2-12;
         KF-W13.md addendum (g), COHESION §0er) — the share surface is its OWN
         popover with NO trigger of its own. It used to carry a Share button
         (SP-11's glass `Button` swap) nested inside the @mbabb menu's Share row:
         interactive content inside a menuitem, which the menu's roving focus
         never reached, and a popover that opened beside the still-open menu and
         occluded it. The host (MbabbMenu, the one owner) now runs Share as a
         plain menuitem: the menu closes and this popover opens on `open`,
         anchored to the element the host names (`anchor`, the @mbabb trigger).
         The anchor is reka's `PopoverAnchor` with a `reference`: glass `Popover`
         is reka's `PopoverRoot` on its click arm (its own typings say so) and
         ships no anchor seam of its own, so the anchor is the primitive's
         documented custom-anchor part, not a copied selector. With a custom
         anchor mounted, reka places the content against it instead of a trigger.
         UIA-KF-140 — the 28x36 egg and its hover fade were the trigger's; the
         trigger is gone, so both limbs are gone with it. -->
    <Popover v-model:open="open">
        <PopoverAnchor v-if="anchor" :reference="anchor" as-child />
        <!-- SP-1 + SP-19 + SP-21 (W6-I): `p-2` was DEAD (the primitive's
             overlay padding longhands won) and is gone. `align="end"`: the
             surface ends on its anchor's end edge, as the @mbabb menu does on
             the same trigger; `sideOffset` is the host's (the menu's own
             dock-edge offset, so both surfaces open below the dock band).
             `@interact-outside` carries the demo's own toaster guard: both
             `loadFromInput` error paths toast AND leave this popover open, and a
             click on that toast must not dismiss it.
             X.KF.W13X.overlays · A2-KE-L2-12 — `collision-padding="16"`: at
             phone width the 288px surface landed flush on the viewport's left
             edge (x 0 at 360/390/430); the same 16px the @mbabb menu passes on
             its own content (the producer default is relayed, O-74).
             UIA-KF-141 — the width is the demo's panel token
             (`--dock-panel-width`, the @mbabb menu's own width), not a `w-72`
             literal, and the field takes the surface's whole row.
             UIA-KF-248 · UIA-KF-071 — the popover opens on its PRIMARY action
             ("Copy link"), not on the paste field: the import path is the rare
             one, and focusing it painted the heaviest stroke on the page (the
             field's focus ring) the moment Share opened. -->
        <PopoverContent
            class="z-popover w-(--dock-panel-width)"
            align="end"
            :side-offset="sideOffset"
            :collision-padding="16"
            @open-auto-focus="focusPrimary"
            @close-auto-focus="returnFocus"
            @interact-outside="onInteractOutside"
        >
            <!-- X.KF.W13X.overlays · UIA-KF-071 — the hierarchy the menu row
                 promises. The action the row names ("Share": copy the link) is
                 the dominant, NAMED control on top; a separator; then the import
                 path as its own labelled field with a labelled Load button.
                 UIA-KF-224 — every control here says what it does in visible
                 text, so no native `title` tooltip is left to stand in for a
                 name (the two icon-only buttons and their titles are gone).
                 SP-6: the async copy carries `loading` for its in-flight span. -->
            <div class="grid gap-3">
                <Button
                    ref="primaryEl"
                    size="sm"
                    emphasis="primary"
                    :loading="sharing"
                    @click="onShare"
                >
                    <Copy class="icon-md" />
                    Copy link
                </Button>
                <!-- X.KF.W13X.r4dock · UIA-KF-321 — a refused copy offers the
                     link here, read-only and selected (useShareState.ts). -->
                <LabeledField
                    v-if="copyFallbackUrl !== null"
                    label="Share link"
                    description="Copying was blocked. The link is selected: copy it from here."
                >
                    <template #default="{ controlId, describedBy }">
                        <Input
                            :id="controlId"
                            ref="fallbackEl"
                            :model-value="copyFallbackUrl"
                            :aria-describedby="describedBy"
                            readonly
                            class="font-mono"
                            @focus="selectAll"
                        />
                    </template>
                </LabeledField>
                <Separator />
                <!-- SP-4/SP-7/SP-9: the Input is size-driven (`font-mono` alone;
                     the producer's `--control-text` keeps it >= 16px where iOS
                     zooms). SP-5/SP-6: `inputmode="url"`, `enterkeyhint="go"`,
                     `autocomplete="off"`; `type="url"` is deliberately NOT set —
                     the field accepts a bare base64 param (useShareState.ts).
                     UIA-KF-142 — a refused load marks the field: the producer's
                     `invalid` skin, and the reason in LabeledField's error slot,
                     which the field names through `aria-describedby` and the
                     field announces (`errorLive` polite). The verdict clears on
                     the next edit (useShareState.ts). -->
                <LabeledField label="Load from link" :invalid="loadError !== null">
                    <template #default="{ controlId, describedBy, invalid }">
                        <Input
                            :id="controlId"
                            v-model="loadHashInput"
                            :aria-describedby="describedBy"
                            :invalid="invalid"
                            placeholder="Paste a share link"
                            inputmode="url"
                            enterkeyhint="go"
                            autocomplete="off"
                            class="font-mono"
                            @keydown.enter="onLoad"
                        />
                    </template>
                    <template #error>{{ loadError }}</template>
                </LabeledField>
                <!-- The Load action is DISABLED on an empty field (the empty
                     submit was a silent return). -->
                <Button
                    size="sm"
                    emphasis="quiet"
                    :disabled="loadHashInput.trim() === ''"
                    @click="onLoad"
                >
                    <ArrowRight class="icon-md" />
                    Load
                </Button>
            </div>
        </PopoverContent>
    </Popover>
</template>

<script setup lang="ts">
import { nextTick, ref, useTemplateRef, watch } from "vue";
import type { ComponentPublicInstance } from "vue";
import { PopoverAnchor } from "reka-ui";
import { Copy, ArrowRight } from "@lucide/vue";
// SP-18 (W6-I): every glass symbol on its own subpath beside `./forms`.
import { Button } from "@mkbabb/glass-ui/button";
import { Popover, PopoverContent } from "@mkbabb/glass-ui/popover";
import { Input } from "@mkbabb/glass-ui/input";
import { LabeledField } from "@mkbabb/glass-ui/labeled-field";
import { Separator } from "@mkbabb/glass-ui/separator";
import { isInsideToaster } from "@components/instrument/utils/toastGuard";
import { useShareState } from "./useShareState";

const { anchor, sideOffset = 8, onSceneRestore } = defineProps<{
    /** The element the surface opens against (MbabbMenu: its @mbabb trigger). */
    anchor?: HTMLElement | undefined;
    /** The gap between the anchor and the surface, px. */
    sideOffset?: number;
    onSceneRestore?: (sceneId: string) => void;
}>();

// X.KF.W13X.esc2 · ESC-dock-1 — the open model is the HOST's (`v-model:open`):
// the host's Share row opens it, and `useShareState` closes it after a copy or
// a successful load (UIA-KF-070: a completed action dismisses the surface).
// The former `defineExpose({ open })` + `done` pair existed so a host could
// reach into a popover nested in its menu row; the row no longer nests it.
const open = defineModel<boolean>("open", { default: false });

const { loadHashInput, loadError, copyFallbackUrl, shareState, loadFromInput } = useShareState(
    onSceneRestore,
    open,
);
// UIA-KF-321 — the fallback field takes focus with its whole link selected.
const fallbackEl = useTemplateRef<ComponentPublicInstance>("fallbackEl");
const selectAll = (event: FocusEvent) => (event.target as HTMLInputElement).select();
watch(copyFallbackUrl, async (url) => {
    if (url === null) return;
    await nextTick();
    (fallbackEl.value?.$el as HTMLInputElement | undefined)?.focus();
});

// SP-6: the async copy's in-flight span, so the Share button carries `loading`
// and a second click during the first is a no-op.
const sharing = ref(false);
const onShare = async () => {
    if (sharing.value) return;
    sharing.value = true;
    try {
        await shareState();
    } finally {
        sharing.value = false;
    }
};

const onLoad = () => {
    loadFromInput();
};

// UIA-KF-248 — focus lands on the primary action. glass `Button` is a
// single-root component over the native `<button>`, so its instance `$el` IS the
// focusable element (the same `$el` contract the demo's other child-ref seams
// read; no querySelector).
const primaryEl = useTemplateRef<ComponentPublicInstance>("primaryEl");

const focusPrimary = (event: Event) => {
    event.preventDefault();
    interactedOutside = false;
    (primaryEl.value?.$el as HTMLElement | undefined)?.focus();
};

// The toaster guard: both `loadFromInput` error paths toast AND leave this
// popover open, and a click on that toast must not dismiss it. Any other
// outside interaction dismisses, and focus then stays where the user put it.
let interactedOutside = false;
const onInteractOutside = (event: Event) => {
    if (isInsideToaster(event.target)) return event.preventDefault();
    interactedOutside = true;
};

// With no trigger, reka has no element to hand focus back to on close, so it
// would fall to <body>. A keyboard or completed-action close returns focus to
// the anchor, the control the surface was opened from (the @mbabb trigger, the
// menu's own return target); an outside interaction keeps it where it landed,
// as reka does for a trigger.
const returnFocus = (event: Event) => {
    event.preventDefault();
    if (!interactedOutside) anchor?.focus();
};
</script>
