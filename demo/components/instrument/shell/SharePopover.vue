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
             `transition-all duration-fast`, whose `all` at 0.2s was what
             overwrote `scale-on-hover`'s spring shorthand (that utility resets
             `transition-property` to `scale` alone, so the two could never
             coexist on one element). What the bare deletion left behind is the
             defect this row exists to catch — a zero-frame `hover:opacity-50`
             snap: the glass Button's own sheet declares exactly one transition
             (`transition: none`, under its reduced-motion arm) and carries no
             opacity fade, so nothing replaced what died. The recede-affordance
             books here, on the opacity leg ALONE — `transition-opacity` scopes
             the property so no producer motion is in its way, and
             `duration-fast` is the producer's own rung. `motion-reduce` is not
             decoration either: the Button's reduced-motion arm lives in
             `@layer components`, which a utility outranks whatever media query
             it sits in, so an ungated transition utility here would have
             defeated the producer's own PRM arm on this control. -->
        <PopoverTrigger as-child>
            <Button
                size="sm"
                emphasis="quiet"
                icon-only
                aria-label="Share animation"
                class="transition-opacity duration-fast motion-reduce:transition-none"
                :class="sharePopoverOpen ? 'opacity-100' : 'hover:opacity-50'"
            >
                <Share2 class="icon-lg" />
            </Button>
        </PopoverTrigger>
        <!-- SP-20 — the field is FOCUSED ON OPEN. Its placeholder is an
             imperative ("Paste share URL..."), and until now the popover opened
             with focus on the content container, so the instruction named an
             action the keyboard could not take without a Tab; `openAutoFocus` is
             the primitive's own hook for exactly this and nothing bound it. The
             default is prevented and the field takes focus directly, so the
             popover's focus scope still traps — nothing about dismissal or the
             return target changes. -->
        <!-- SP-1 + SP-19 + SP-21 (W6-I): `p-2` was DEAD — `cn`'s disjoint
             padding buckets never collided it with the primitive's
             `px-(--overlay-pad-inline) py-(--overlay-pad-block)` longhands and
             Tailwind emits `.p-2` first, so the glass overlay rung shipped
             while the class sat in the DOM looking operative; it is gone.
             `align="end"`: the ribbon host is `placement="right"` with a
             row-reversed band, so a start-aligned 288px surface had ~22px of
             room and the collision middleware, not the author, was deciding
             placement. `@interact-outside` carries the demo's own toaster
             guard: both `loadFromInput` error paths toast AND leave this
             popover open, and a click on that toast must not dismiss it — the
             same guard the two sibling overlays install. -->
        <PopoverContent
            class="z-popover w-72"
            align="end"
            :side-offset="8"
            @open-auto-focus="focusShareField"
            @interact-outside="
                (event) => {
                    if (isInsideToaster(event.target))
                        return event.preventDefault();
                }
            "
        >
            <!-- SP-9 + SP-8 — the height overrides go, and `size` drives.
                 SP-9 is the row's largest deficit and the only one with no
                 rescue: `.field-control[data-kind="input"]` sets `block-size`,
                 which is THE SAME property `h-8` sets, so a coarse pointer's
                 60px rung collapsed to 32 on the one control a paste flow must
                 hit — a deficit no `max()` can recover, unlike the buttons'.
                 SP-8: `h-8 w-8 p-0` hand-rolled `iconOnly` and, in doing so,
                 forfeited the coarse floor twice over — `min-block-size` is a
                 different property from `height`, so the box it names is not the
                 box it renders, and `data-control-target`, the floor's SOLE
                 hook, is emitted only under the `icon-only` these never passed.
                 Passing the prop and dropping the overrides is the whole cure.
                 SP-4 + SP-7, ONE EDIT (W6-G role (a), style.css): the field is a
                 pasted URL — an artifact, so it keeps the MONO face — but the
                 caption utility it wore fixed `--type-caption` (~12.2px at
                 390px) OVER `field-control`'s own zoom-safe `--field-control-font`
                 (utilities layer beats components layer), then needed a case
                 cancel and, per MM-29, a tracking cancel to undo the caps
                 register it had just applied. The Input is now SIZE-DRIVEN:
                 `font-mono` alone, size from the producer's `--control-text`
                 (≥16px where iOS zooms), no transform to cancel and no caps
                 tracking to pair — the case-cancel/tracking pair this string
                 carried is retired together, so G-W6-8's census loses a site
                 rather than gaining an unpaired one. -->
            <!-- SP-5 + SP-6 (W6-I): the field gets its programmatic name and
                 the input semantics the primitive forwards — `aria-label`
                 (there is no visible label to point at; `./labeled-field`
                 would add a label row this 288px surface has no room for),
                 `inputmode="url"` + `enterkeyhint="go"` (Enter IS the load)
                 and `autocomplete="off"` (a pasted share hash is never a
                 remembered value). `type="url"` is deliberately NOT set — the
                 field accepts a bare base64 param (useShareState.ts), which a
                 URL-typed control would reject as invalid. States: the Load
                 action is DISABLED on an empty field (the empty submit was a
                 silent return), and the Share action carries `loading` for the
                 async copy's in-flight span so a double click cannot re-enter
                 it. The half that needs the store — an `invalid` skin on a
                 failed load and a reset of `loadHashInput` after success — is
                 `useShareState.ts`'s, outside this unit's bounds, DECLARED. -->
            <div class="flex items-center gap-1.5">
                <Input
                    ref="shareFieldEl"
                    v-model="loadHashInput"
                    placeholder="Paste share URL..."
                    aria-label="Share URL or hash to load"
                    inputmode="url"
                    enterkeyhint="go"
                    autocomplete="off"
                    class="font-mono flex-1"
                    @keydown.enter="loadFromInput"
                />
                <Button
                    size="sm"
                    emphasis="quiet"
                    icon-only
                    class="shrink-0"
                    :disabled="loadHashInput.trim() === ''"
                    @click="loadFromInput"
                    title="Load shared state"
                >
                    <ArrowRight class="icon-md" />
                </Button>
                <Button
                    size="sm"
                    emphasis="quiet"
                    icon-only
                    class="shrink-0"
                    :loading="sharing"
                    @click="onShare"
                    title="Copy share link"
                >
                    <Clipboard class="icon-md" />
                </Button>
            </div>
        </PopoverContent>
    </Popover>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import type { ComponentPublicInstance } from "vue";
import { Share2, Clipboard, ArrowRight } from "@lucide/vue";
// SP-18 (W6-I): every glass symbol on its own subpath beside `./forms`.
import { Button } from "@mkbabb/glass-ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@mkbabb/glass-ui/popover";
import { Input } from "@mkbabb/glass-ui/forms";
import { isInsideToaster } from "@components/instrument/utils/toastGuard";
import { useShareState } from "./useShareState";

const props = defineProps<{
    onSceneRestore?: (sceneId: string) => void;
}>();

const { sharePopoverOpen, loadHashInput, shareState, loadFromInput } =
    useShareState(props.onSceneRestore);

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

// SP-20 — glass `Input` is a single-root component over the native `<input>`,
// so its instance `$el` IS the focusable element (the same `$el` contract the
// demo's other child-ref seams read; no querySelector).
const shareFieldEl = useTemplateRef<ComponentPublicInstance>("shareFieldEl");

const focusShareField = (event: Event) => {
    event.preventDefault();
    (shareFieldEl.value?.$el as HTMLElement | undefined)?.focus();
};
</script>
