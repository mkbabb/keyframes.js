<template>
    <Popover v-model:open="sharePopoverOpen">
        <!-- SP-11 — the trigger was a RAW 24x24 `<button>` with `p-0` zeroing any
             rescue and an `icon-lg` sole child: reachable by none of the demo's
             declared floors, and wearing a hand-rolled shell beside the very
             primitive that ships one. The swap to glass `Button emphasis="quiet"
             icon-only` collapses SP-11 with SP-26 and SP-27 in one edit — the
             plate, the hover/press motion and the focus ring all come from the
             producer, so `bg-transparent border-none p-0 scale-on-hover
             transition-all duration-fast` are not re-authored here.
             EH-9 ≡ SP-10 — THE MOTION BATCH, SPENT: the swap already retired
             `transition-all duration-fast`.
             X.KF.W13X.overlays · UIA-KF-140 — the recede-on-hover fade
             (`hover:opacity-50` + its scoped `transition-opacity`) is gone: no
             sibling menu glyph recedes on hover, and the hover affordance is the
             glass Button's own quiet plate. The 28x36 egg is the host's 28px
             glyph slot capping the Button (its own `max-width: 100%`); that
             half goes with the Share row's restructure (ESC-dock-1). -->
        <PopoverTrigger as-child>
            <Button
                size="sm"
                emphasis="quiet"
                icon-only
                aria-label="Share animation"
            >
                <Share2 class="icon-lg" />
            </Button>
        </PopoverTrigger>
        <!-- SP-1 + SP-19 + SP-21 (W6-I): `p-2` was DEAD (the primitive's
             overlay padding longhands won) and is gone. `align="end"`: the
             ribbon host is `placement="right"` with a row-reversed band.
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
            :side-offset="8"
            :collision-padding="16"
            @open-auto-focus="focusPrimary"
            @interact-outside="
                (event) => {
                    if (isInsideToaster(event.target))
                        return event.preventDefault();
                }
            "
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
import { ref, useTemplateRef } from "vue";
import type { ComponentPublicInstance } from "vue";
import { Share2, Copy, ArrowRight } from "@lucide/vue";
// SP-18 (W6-I): every glass symbol on its own subpath beside `./forms`.
import { Button } from "@mkbabb/glass-ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@mkbabb/glass-ui/popover";
import { Input } from "@mkbabb/glass-ui/input";
import { LabeledField } from "@mkbabb/glass-ui/labeled-field";
import { Separator } from "@mkbabb/glass-ui/separator";
import { isInsideToaster } from "@components/instrument/utils/toastGuard";
import { useShareState } from "./useShareState";

const props = defineProps<{
    onSceneRestore?: (sceneId: string) => void;
}>();

// X.KF.W13X.overlays · UIA-KF-070 — `done` fires when a share action COMPLETES
// (the link is copied, or a pasted link loads). This popover closes only
// itself; a host that renders it inside a menu (MbabbMenu) closes its menu on
// `done`, so the whole stack dismisses and focus returns to the menu trigger.
const emit = defineEmits<{ done: [] }>();

const { sharePopoverOpen, loadHashInput, loadError, shareState, loadFromInput } =
    useShareState(props.onSceneRestore);

// X.KF.W13U.d4 · ESC-d-3 (COHESION §0br) — the open model, EXPOSED from its
// owner. `useShareState` owns this ref (it closes the popover after a copy or a
// successful load), so the popover's open state is exposed, not re-owned. A host
// that renders this popover inside a menu row (MbabbMenu) sets `open` on the
// row's select, so Enter opens Share exactly as a pointer press on the trigger does.
defineExpose({ open: sharePopoverOpen });

// SP-6: the async copy's in-flight span, so the Share button carries `loading`
// and a second click during the first is a no-op.
const sharing = ref(false);
const onShare = async () => {
    if (sharing.value) return;
    sharing.value = true;
    try {
        if (await shareState()) emit("done");
    } finally {
        sharing.value = false;
    }
};

const onLoad = () => {
    if (loadFromInput()) emit("done");
};

// UIA-KF-248 — focus lands on the primary action. glass `Button` is a
// single-root component over the native `<button>`, so its instance `$el` IS the
// focusable element (the same `$el` contract the demo's other child-ref seams
// read; no querySelector).
const primaryEl = useTemplateRef<ComponentPublicInstance>("primaryEl");

const focusPrimary = (event: Event) => {
    event.preventDefault();
    (primaryEl.value?.$el as HTMLElement | undefined)?.focus();
};
</script>
